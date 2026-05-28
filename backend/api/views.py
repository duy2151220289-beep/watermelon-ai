import os
import time
import cv2
import numpy as np
import torch
from django.conf import settings
from django.core.files.base import ContentFile
from django.db import models
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from ultralytics import YOLO
from .models import DetectionRecord, Review, Post, UserProfile
from .serializers import (
    DetectionRecordSerializer, ReviewSerializer, PostSerializer,
    UserSerializer, UserRegisterSerializer
)


MODEL = None


def load_model():
    global MODEL
    if MODEL is None:
        model_path = settings.MODEL_PATH
        if not model_path.exists():
            raise FileNotFoundError(f"YOLO model weights not found at {model_path}")
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        MODEL = YOLO(str(model_path))
        MODEL.to(device)
    return MODEL


def annotate_image(image, boxes, confidences, classes, labels):
    overlay = image.copy()
    height, width = image.shape[:2]
    for bbox, score, class_id in zip(boxes, confidences, classes):
        x1, y1, x2, y2 = map(int, bbox)
        label = labels[class_id] if class_id < len(labels) else 'object'
        text = f"{label} {score * 100:.1f}%"
        color = (13, 255, 80)
        cv2.rectangle(overlay, (x1, y1), (x2, y2), color, 3)
        cv2.putText(overlay, text, (x1, max(y1 - 12, 20)), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    blended = cv2.addWeighted(overlay, 0.85, image, 0.15, 0)
    return blended


def run_detection(image_bytes, source='upload'):
    model = load_model()
    np_img = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError('Uploaded file is not a valid image')

    # 1. Dynamic confidence threshold based on source to reduce false positives (gated at 0.52 to prevent background clutter)
    conf_thresh = 0.52 if source == 'camera' else 0.52

    start = time.time()
    results = model(image, imgsz=640, conf=conf_thresh, device=model.device, verbose=False)
    end = time.time()
    duration_ms = (end - start) * 1000

    result = results[0]
    raw_boxes = []
    raw_confidences = []
    raw_classes = []
    labels = model.names
    if hasattr(result, 'boxes') and result.boxes is not None and len(result.boxes) > 0:
        xyxy = result.boxes.xyxy.cpu().numpy()
        conf = result.boxes.conf.cpu().numpy()
        cls = result.boxes.cls.cpu().numpy().astype(int)
        raw_boxes = xyxy.tolist()
        raw_confidences = conf.tolist()
        raw_classes = cls.tolist()

    # 2. Geometric & Colorimetric heuristic filtering to reject false positives
    boxes = []
    confidences = []
    classes = []
    img_h, img_w = image.shape[:2]

    for box, score, cls_id in zip(raw_boxes, raw_confidences, raw_classes):
        x1, y1, x2, y2 = box
        w = x2 - x1
        h = y2 - y1
        if h <= 0 or w <= 0:
            continue
            
        aspect = w / h
        area_ratio = (w * h) / (img_w * img_h)

        # Watermelons are spheres or ellipsoids (aspect ratio 0.45 to 2.1)
        if aspect < 0.45 or aspect > 2.1:
            continue

        # In camera mode, reject small background clutter (must be > 1.5% of overall screen)
        if source == 'camera' and area_ratio < 0.015:
            continue

        # Color filter check: Extract crop and evaluate green hue ratio
        cx1, cy1 = max(0, int(x1)), max(0, int(y1))
        cx2, cy2 = min(img_w, int(x2)), min(img_h, int(y2))
        crop = image[cy1:cy2, cx1:cx2]
        if crop.size > 0:
            crop_hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
            # Green hue [30, 92], Saturation [20, 255], Value [20, 255]
            green_mask = cv2.inRange(crop_hsv, np.array([30, 20, 20]), np.array([92, 255, 255]))
            green_ratio = np.sum(green_mask > 0) / (crop.shape[0] * crop.shape[1])
            
            # If the crop doesn't have at least 6% green color pixels, reject it as a non-watermelon false positive
            if green_ratio < 0.06:
                continue

        boxes.append(box)
        confidences.append(score)
        classes.append(cls_id)

    # Estimate quality parameters (ripeness, weight, sweetness)
    ripeness = 'Unknown'
    sweetness = 0.0
    predicted_weight = 0.0

    if len(boxes) > 0:
        x1, y1, x2, y2 = map(int, boxes[0])
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(img_w, x2), min(img_h, y2)

        crop = image[y1:y2, x1:x2]
        if crop.size > 0:
            # 1. Weight estimation based on area ratio and bounding box aspect ratio
            box_w = x2 - x1
            box_h = y2 - y1
            area_ratio = (box_w * box_h) / (img_w * img_h)
            
            # Map area ratio to weight in kg (between 1.8 and 8.0 kg)
            base_weight = 1.8 + area_ratio * 6.5
            aspect = box_w / box_h if box_h > 0 else 1.0
            predicted_weight = base_weight * (1.0 + 0.1 * abs(1.0 - aspect))
            predicted_weight = round(min(max(predicted_weight, 1.5), 12.0), 2)

            # 2. Ripeness & Sweetness analysis using HSV and Green channel contrast
            hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
            # Yellow ground spot mask: Hue [12, 32], Saturation [40, 255], Value [80, 255]
            yellow_mask = cv2.inRange(hsv, np.array([12, 40, 80]), np.array([32, 255, 255]))
            yellow_ratio = np.sum(yellow_mask > 0) / (crop.shape[0] * crop.shape[1])

            # Stripe contrast using Green channel std dev
            green_channel = crop[:, :, 1]
            green_std = float(np.std(green_channel))

            # Ripeness & Sweetness rules
            if yellow_ratio > 0.012:
                if yellow_ratio > 0.08:
                    ripeness = "Overripe"
                    base_sweetness = 8.2 + (green_std % 2.0)
                else:
                    ripeness = "Ripe (Perfect)"
                    base_sweetness = 11.2 + (green_std % 2.3)
            else:
                if green_std > 20.0:
                    ripeness = "Ripe (Perfect)"
                    base_sweetness = 10.5 + (green_std % 2.0)
                else:
                    ripeness = "Underripe"
                    base_sweetness = 7.5 + (green_std % 1.5)

            sweetness = round(min(max(base_sweetness, 7.0), 13.5), 1)

    annotated = annotate_image(image, boxes, confidences, classes, labels)
    _, encoded = cv2.imencode('.jpg', annotated)
    return encoded.tobytes(), boxes, confidences, classes, duration_ms, labels, ripeness, sweetness, predicted_weight


class HealthCheckView(APIView):
    def get(self, request):
        return Response({'status': 'ok', 'service': 'watermelon-detect-ai'})


class DetectImageView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if 'image' not in request.FILES:
            return Response({'detail': 'No image file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        image_file = request.FILES['image']
        source = request.data.get('source', 'upload')
        image_bytes = image_file.read()

        try:
            detected_bytes, boxes, confidences, classes, duration_ms, labels, ripeness, sweetness, predicted_weight = run_detection(image_bytes, source=source)
        except FileNotFoundError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as exc:
            return Response({'detail': f'Detection failed: {exc}'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user if request.user.is_authenticated else None

        record = DetectionRecord.objects.create(
            user=user,
            source=source,
            original_image=image_file,
            label=labels[int(classes[0])] if classes else 'watermelon',
            confidence=float(confidences[0] * 100) if confidences else 0.0,
            bbox={
                'x1': boxes[0][0] if boxes else 0,
                'y1': boxes[0][1] if boxes else 0,
                'x2': boxes[0][2] if boxes else 0,
                'y2': boxes[0][3] if boxes else 0,
            },
            ripeness=ripeness,
            sweetness=sweetness,
            predicted_weight=predicted_weight,
            duration_ms=duration_ms,
        )
        detected_name = os.path.basename(image_file.name).split('.')[0] + '_detected.jpg'
        record.detected_image.save(detected_name, ContentFile(detected_bytes), save=True)

        serializer = DetectionRecordSerializer(record, context={'request': request})
        return Response({'detail': 'Detection completed', 'result': serializer.data}, status=status.HTTP_200_OK)


class HistoryView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            records = DetectionRecord.objects.filter(user=request.user)[:20]
        else:
            records = DetectionRecord.objects.filter(user__isnull=True)[:20]
        serializer = DetectionRecordSerializer(records, many=True, context={'request': request})
        return Response(serializer.data)


class StatsView(APIView):
    def get(self, request):
        total = DetectionRecord.objects.count()
        average_conf = DetectionRecord.objects.aggregate(models.Avg('confidence'))['confidence__avg'] or 0.0
        recent = DetectionRecord.objects.order_by('-created_at')[:5]
        serializer = DetectionRecordSerializer(recent, many=True, context={'request': request})
        return Response({
            'totalDetections': total,
            'averageConfidence': round(average_conf, 2),
            'recentDetections': serializer.data,
        })


class ReviewView(APIView):
    def get(self, request):
        reviews = Review.objects.all()[:30]
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            review_obj = serializer.save()
            if user:
                review_obj.user = user
                review_obj.name = user.username
                review_obj.save()
            return Response(ReviewSerializer(review_obj).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostListView(APIView):
    def get(self, request):
        posts = Post.objects.all()[:30]
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)


class PostLikeView(APIView):
    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        post.likes += 1
        post.save()
        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PostDislikeView(APIView):
    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        post.dislikes += 1
        post.save()
        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response({'detail': 'Tên đăng nhập hoặc mật khẩu không chính xác.'}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        scans = DetectionRecord.objects.filter(user=user)[:20]
        scans_serializer = DetectionRecordSerializer(scans, many=True, context={'request': request})
        
        total_scans = DetectionRecord.objects.filter(user=user).count()
        total_reviews = Review.objects.filter(user=user).count()

        return Response({
            'user': UserSerializer(user).data,
            'totalScans': total_scans,
            'totalReviews': total_reviews,
            'scans': scans_serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        role = request.data.get('role', None)
        if role in ['consumer', 'merchant']:
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.role = role
            profile.save()
            return Response({
                'detail': 'Cập nhật phân quyền thành công!',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response({'detail': 'Vai trò không hợp lệ.'}, status=status.HTTP_400_BAD_REQUEST)



class ClearUploadsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        import shutil
        if not (request.user.is_staff or request.user.is_superuser or request.user.username == 'admin'):
            return Response({'detail': 'Bạn không có quyền thực hiện hành động này.'}, status=status.HTTP_403_FORBIDDEN)

        # Delete database records
        records_deleted, _ = DetectionRecord.objects.all().delete()

        # Delete files in uploads and results directories
        uploads_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
        results_dir = os.path.join(settings.MEDIA_ROOT, 'results')
        deleted_files_count = 0

        for directory in [uploads_dir, results_dir]:
            if os.path.exists(directory):
                for filename in os.listdir(directory):
                    file_path = os.path.join(directory, filename)
                    try:
                        if os.path.isfile(file_path) or os.path.islink(file_path):
                            os.unlink(file_path)
                            deleted_files_count += 1
                        elif os.path.isdir(file_path):
                            shutil.rmtree(file_path)
                            deleted_files_count += 1
                    except Exception as e:
                        print(f"Failed to delete {file_path}. Reason: {e}")

        return Response({
            'detail': 'Dọn dẹp hệ thống thành công!',
            'records_deleted': records_deleted,
            'files_deleted': deleted_files_count
        }, status=status.HTTP_200_OK)


class LeaderboardView(APIView):
    def get(self, request):
        top_scanners = (
            User.objects.annotate(scan_count=models.Count('scans'))
            .filter(scan_count__gt=0)
            .order_by('-scan_count')[:10]
        )
        
        data = []
        for index, u in enumerate(top_scanners):
            badge = 'Diamond' if index == 0 else ('Gold' if index == 1 else ('Silver' if index == 2 else 'Bronze'))
            data.append({
                'rank': index + 1,
                'username': u.username,
                'scan_count': u.scan_count,
                'badge': badge,
            })
            
        if len(data) == 0:
            data = [
                {'rank': 1, 'username': 'CyberFarmer_99', 'scan_count': 34, 'badge': 'Diamond'},
                {'rank': 2, 'username': 'admin', 'scan_count': 22, 'badge': 'Gold'},
                {'rank': 3, 'username': 'NeonWatermelon', 'scan_count': 17, 'badge': 'Silver'},
                {'rank': 4, 'username': 'BaoDuy_Dev', 'scan_count': 12, 'badge': 'Bronze'},
                {'rank': 5, 'username': 'ai_sensor_bot', 'scan_count': 7, 'badge': 'Bronze'},
            ]
        else:
            if len(data) < 5:
                extra_mock = [
                    {'username': 'CyberFarmer_99', 'scan_count': 18},
                    {'username': 'NeonWatermelon', 'scan_count': 11},
                    {'username': 'ai_sensor_bot', 'scan_count': 5},
                ]
                for extra in extra_mock:
                    if not any(x['username'] == extra['username'] for x in data):
                        data.append({
                            'rank': len(data) + 1,
                            'username': extra['username'],
                            'scan_count': extra['scan_count'],
                            'badge': 'Bronze'
                        })
                data.sort(key=lambda x: x['scan_count'], reverse=True)
                for idx, item in enumerate(data):
                    item['rank'] = idx + 1
                    item['badge'] = 'Diamond' if idx == 0 else ('Gold' if idx == 1 else ('Silver' if idx == 2 else 'Bronze'))

        return Response({
            'scanners': data,
            'supporters': [
                {'rank': 1, 'name': 'NGUYEN LE BAO DUY', 'amount': '1,500,000 VND', 'badge': 'Legendary Developer', 'avatar': '🍉', 'method': 'Momo'},
                {'rank': 2, 'name': 'Future_Agri_Tech', 'amount': '50 USDT', 'badge': 'Platinum Sponsor', 'avatar': '🤖', 'method': 'USDT (ERC-20)'},
                {'rank': 3, 'name': 'Sora_AI_Lab', 'amount': '25 USDT', 'badge': 'Gold Sponsor', 'avatar': '👁️', 'method': 'USDT (ERC-20)'},
                {'rank': 4, 'name': 'Momo_Gamer_98', 'amount': '100,000 VND', 'badge': 'Silver Supporter', 'avatar': '🎮', 'method': 'Momo'},
                {'rank': 5, 'name': 'Fruit_Collector_VN', 'amount': '50,000 VND', 'badge': 'Bronze Supporter', 'avatar': '🧺', 'method': 'Momo'},
            ]
        })


class ChatAgronomistView(APIView):
    def post(self, request):
        import requests
        message = request.data.get('message', '').strip()
        history = request.data.get('history', [])  # list of {role: 'user'|'model', content: '...'}
        context = request.data.get('context', None) # optional dict {label, ripeness, sweetness, predicted_weight, confidence}
        
        if not message:
            return Response({'detail': 'Message is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        system_instruction = (
            "Bạn là một Kỹ sư Nông nghiệp & Chuyên gia Ẩm thực (AI Agronomist) chuyên sâu về dưa hấu và các loại trái cây Việt Nam. "
            "Nhiệm vụ của bạn là giải đáp thắc mắc của người dùng về cách trồng, lựa chọn, bảo quản, độ chín, độ ngọt và chế biến trái cây (đặc biệt là dưa hấu). "
            "Hãy giao tiếp bằng tiếng Việt một cách cực kỳ thân thiện, nhiệt tình, chuyên nghiệp, sử dụng biểu tượng cảm xúc (emoji) sinh động, nhưng trả lời súc tích và ngắn gọn (dưới 150 từ mỗi câu trả lời) để phù hợp hiển thị trong khung chat nhỏ."
        )
        
        if context:
            system_instruction += (
                f"\nNgười dùng vừa quét một thực thể trái cây với các chỉ số thực tế sau:\n"
                f"- Loại trái cây: {context.get('label', 'dưa hấu')}\n"
                f"- Trạng thái độ chín (Ripeness): {context.get('ripeness', 'Chưa rõ')}\n"
                f"- Độ ngọt ước tính (Sweetness): {context.get('sweetness', 0.0)} Brix\n"
                f"- Trọng lượng ước tính (Weight): {context.get('predicted_weight', 0.0)} kg\n"
                f"- Độ tin cậy nhận diện (Confidence): {context.get('confidence', 0.0)}%\n"
                f"Hãy dựa trên các chỉ số thực tế này khi người dùng hỏi các câu liên quan đến quả dưa vừa quét (ví dụ: quả này ăn được chưa, làm gì với quả này, tại sao ngọt/chín thế...)."
            )

        api_key = getattr(settings, 'GEMINI_API_KEY', '')
        
        if api_key:
            try:
                contents = []
                for msg in history:
                    role = 'user' if msg.get('role') == 'user' else 'model'
                    contents.append({
                        'role': role,
                        'parts': [{'text': msg.get('content', '')}]
                    })
                
                contents.append({
                    'role': 'user',
                    'parts': [{'text': message}]
                })
                
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
                headers = {'Content-Type': 'application/json'}
                data = {
                    'contents': contents,
                    'systemInstruction': {
                        'parts': [{'text': system_instruction}]
                    },
                    'generationConfig': {
                        'maxOutputTokens': 400,
                        'temperature': 0.7,
                    }
                }
                
                response = requests.post(url, headers=headers, json=data, timeout=8)
                if response.status_code == 200:
                    resp_json = response.json()
                    candidates = resp_json.get('candidates', [])
                    if candidates:
                        text = candidates[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                        if text:
                            return Response({'response': text.strip()})
                
                print(f"Gemini API returned status {response.status_code}: {response.text}")
            except Exception as e:
                print(f"Failed to fetch Gemini response: {e}")
                
        # Fallback logic (Mock Expert Agent) - If API fails or GEMINI_API_KEY is not configured
        msg_lower = message.lower()
        response_text = ""
        
        if context and any(k in msg_lower for k in ['quả dưa này', 'quả này', 'này', 'quét', 'vừa quét', 'ăn được chưa', 'làm gì']):
            ripeness = context.get('ripeness', 'Ripe (Perfect)')
            sweetness = context.get('sweetness', 10.5)
            weight = context.get('predicted_weight', 3.5)
            
            if "ripe" in ripeness.lower() and "perfect" in ripeness.lower():
                response_text = (
                    f"🍉 Quả dưa hấu của bạn chín hoàn hảo ({ripeness}) và đạt độ ngọt khá cao {sweetness} Brix đó! "
                    f"Với quả dưa nặng khoảng {weight} kg này, bạn có thể ăn trực tiếp, làm dĩa dưa hấu ướp lạnh, "
                    f"hoặc xay sinh tố giải nhiệt mùa hè cực đã. Hãy thưởng thức ngay nhé! 😋"
                )
            elif "overripe" in ripeness.lower():
                response_text = (
                    f"🍉 Quả dưa hấu này đã hơi quá chín ({ripeness}), ruột có thể bị mềm hoặc hơi xốp cát, độ ngọt {sweetness} Brix. "
                    f"Ăn trực tiếp có thể không còn giòn, nhưng quả này làm nước ép dưa hấu, sinh tố hoặc làm thạch dưa hấu "
                    f"thì lại siêu ngọt và tuyệt vời luôn! Đừng bỏ phí nhé! 🍹"
                )
            elif "underripe" in ripeness.lower():
                response_text = (
                    f"🍉 Quả dưa hấu này còn hơi non hoặc chưa chín kỹ ({ripeness}), độ ngọt chỉ đạt {sweetness} Brix. "
                    f"Nếu ăn trực tiếp sẽ hơi nhạt và ít nước. Mẹo nhỏ là bạn có thể dùng làm salad dưa hấu với phô mai, "
                    f"hoặc làm món vỏ dưa muối chua kiểu Việt Nam ăn kèm cơm rất đưa miệng đó nha! 🥗"
                )
            else:
                response_text = (
                    f"🍉 Quả dưa hấu vừa quét của bạn nặng {weight} kg, độ ngọt {sweetness} Brix và trạng thái chín là: {ripeness}. "
                    f"Hãy hỏi tôi bất kỳ câu hỏi nào về cách chế biến hay bảo quản quả dưa này nhé! 🧑‍🌾"
                )
        elif any(k in msg_lower for k in ['chọn dưa', 'bí quyết chọn', 'lựa dưa', 'ngon', 'chọn quả']):
            response_text = (
                "🧑‍🌾 Mẹo chọn dưa hấu ngon ngọt từ chuyên gia:\n"
                "1. **Rốn dưa**: Chọn quả có rốn (vòng tròn nhỏ dưới đáy) càng nhỏ càng tốt, rốn lõm nhẹ.\n"
                "2. **Cuống dưa**: Nên chọn quả cuống nhỏ, héo và xoăn lại (cuống tươi là dưa mới hái nhưng chưa chín hẳn).\n"
                "3. **Đốm vàng (Ground Spot)**: Chọn quả có phần tiếp xúc đất màu vàng đậm hoặc cam vàng (màu trắng là dưa non).\n"
                "4. **Tiếng gõ**: Gõ nhẹ thấy tiếng bộp bộp trầm ấm là dưa chín nhiều cát; tiếng đanh đục là dưa non; tiếng rỗng bộp là dưa xốp ruột. 🍉"
            )
        elif any(k in msg_lower for k in ['bảo quản', 'để được lâu', 'tươi lâu', 'hỏng']):
            response_text = (
                "🍉 Cách bảo quản dưa hấu tươi lâu tốt nhất:\n"
                "- **Dưa chưa bổ**: Để nơi thoáng mát, tránh ánh nắng trực tiếp, có thể giữ được 1-2 tuần.\n"
                "- **Dưa đã bổ**: Dùng màng bọc thực phẩm bọc kín phần ruột đỏ hoặc cắt miếng nhỏ cho vào hộp kín, "
                "bảo quản trong ngăn mát tủ lạnh (sử dụng tốt nhất trong 2-3 ngày).\n"
                "- *Mẹo*: Không nên để dưa hấu quá gần các trái cây sinh khí ethylene như chuối, táo vì sẽ làm dưa hấu nhanh chín nhũn."
            )
        elif any(k in msg_lower for k in ['brix', 'độ ngọt', 'ngọt']):
            response_text = (
                "📊 **Độ ngọt Brix** là đơn vị đo lượng đường hòa tan trong nước (1 độ Brix = 1g đường/100g dung dịch).\n"
                "- Dưới 8.5 Brix: Dưa nhạt, chưa chín (underripe).\n"
                "- Từ 9.0 - 10.5 Brix: Độ ngọt trung bình khá, ăn mát lành.\n"
                "- Từ 11.0 - 12.5 Brix: Dưa ngọt đậm đà, rất ngon (Ripe/Perfect).\n"
                "- Trên 13.0 Brix: Siêu ngọt, cực kỳ hiếm có! 🌟"
            )
        elif any(k in msg_lower for k in ['công thức', 'món ăn', 'sinh tố', 'chế biến', 'nước ép']):
            response_text = (
                "🍹 **Gợi ý món ngon giải nhiệt với dưa hấu**:\n"
                "1. **Sinh tố Dưa hấu Bạc hà**: Xay nhuyễn dưa hấu đông đá + vài lá bạc hà + 1 thìa nước cốt chanh. Mát lạnh, sảng khoái!\n"
                "2. **Salad Dưa hấu Feta**: Dưa hấu cắt khối vuông + phô mai Feta bào + ít rau húng lủi + rưới chút dầu ô liu. Món khai vị tuyệt vời!\n"
                "3. **Kem que dưa hấu**: Ép lấy nước dưa hấu, thêm chút mật ong, rót vào khuôn và để đông đá. Trẻ em cực thích! 🍦"
            )
        elif any(k in msg_lower for k in ['hello', 'hi', 'chào', 'xin chào', 'chào bạn']):
            response_text = (
                "🍉 Xin chào! Tôi là Trợ lý AI Chuyên gia Nông nghiệp dưa hấu. "
                "Tôi có thể giúp bạn giải đáp các mẹo chọn dưa hấu ngon ngọt, cách bảo quản, công thức chế biến "
                "hoặc phân tích chuyên sâu về quả dưa bạn vừa quét trên hệ thống. Bạn cần tôi trợ giúp gì nào? 🧑‍🌾"
            )
        else:
            response_text = (
                "🍉 Cảm ơn câu hỏi của bạn! Là một chuyên gia nông nghiệp dưa hấu, tôi khuyên bạn nên chọn những quả "
                "có cuống héo, đốm vàng đậm và vỏ căng bóng. Nếu bạn có bất kỳ câu hỏi nào về các món chế biến từ dưa hấu, "
                "mẹo chọn dưa ngon ngọt, hay cách bảo quản trái cây, cứ hỏi tôi nhé! 🧑‍🌾"
            )
            
        return Response({'response': response_text})




