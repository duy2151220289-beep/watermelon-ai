from pathlib import Path
import requests
img = Path("train-ai/dataset/test/images")
files = sorted(img.glob("*"))
print("image", files[0])
with open(files[0], "rb") as f:
    r = requests.post("http://localhost:8000/api/detect/", files={"image": f})
    print("status", r.status_code)
    print("content-type", r.headers.get("Content-Type"))
    print(r.text[:1000])
