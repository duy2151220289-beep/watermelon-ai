from pathlib import Path
import requests
img = Path("train-ai/dataset/test/images")
files = sorted(img.glob("*"))
with open(files[0], "rb") as f:
    r = requests.post("http://localhost:8000/api/detect/", files={"image": f})
    print("status", r.status_code)
    print("headers", r.headers.get("content-type"))
    print(r.text[:2000])
