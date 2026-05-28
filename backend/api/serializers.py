from rest_framework import serializers
from django.contrib.auth.models import User
from .models import DetectionRecord, Review, Post, UserProfile


class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='profile.role', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined', 'role']


class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Tên tài khoản đã tồn tại.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Force default role to 'consumer'
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.role = 'consumer'
        profile.save()
        return user


class ReviewSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'name', 'rating', 'comment', 'created_at', 'user_username']


class DetectionRecordSerializer(serializers.ModelSerializer):
    original_image_url = serializers.SerializerMethodField()
    detected_image_url = serializers.SerializerMethodField()
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = DetectionRecord
        fields = [
            'id',
            'source',
            'user_username',
            'original_image_url',
            'detected_image_url',
            'label',
            'confidence',
            'predicted_weight',
            'ripeness',
            'sweetness',
            'bbox',
            'duration_ms',
            'created_at',
        ]

    def get_original_image_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.original_image.url) if obj.original_image else None

    def get_detected_image_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.detected_image.url) if obj.detected_image else None


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'likes', 'dislikes', 'created_at']
