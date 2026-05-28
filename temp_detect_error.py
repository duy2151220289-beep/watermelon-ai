import requests
from pathlib import Path
p = Path('train-ai/dataset/test/images')
files = sorted(p.glob('*'))
with open(files[0], 'rb') as f:
    r = requests.post('http://localhost:8000/api/detect/', files={'image': f})
    text = r.text
    idx = text.find('TypeError')
    print('status', r.status_code)
    print('idx', idx)
    if idx >= 0:
        print(text[idx:idx+1200])
    else:
        print(text[:1200])
