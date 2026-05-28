import os
import sys
import traceback
from pathlib import Path

sys.path.insert(0, os.getcwd())
os.environ["DJANGO_SETTINGS_MODULE"] = "backend.settings"
import django
django.setup()
from rest_framework.test import APIRequestFactory
from django.core.files.uploadedfile import SimpleUploadedFile
from api.views import DetectImageView

p = Path("../train-ai/dataset/test/images")
files = sorted(p.glob("*"))
img_path = files[0]
print("img", img_path)
data = open(img_path, "rb").read()
upload = SimpleUploadedFile(img_path.name, data, content_type="image/jpeg")
factory = APIRequestFactory()
req = factory.post('/api/detect/', {'image': upload}, format='multipart')
view = DetectImageView.as_view()
try:
    resp = view(req)
    print('status', resp.status_code)
    print(resp.data)
except Exception:
    traceback.print_exc()
