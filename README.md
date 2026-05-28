# Watermelon AI Detection Platform

A full-stack AI website for watermelon detection using Django, Django REST Framework, React, TailwindCSS, Three.js, and YOLO inference.

## Features

- Modern Apple/Tesla-inspired UI
- 3D rotating watermelon hero scene
- Glassmorphism, neon accents, and smooth motion
- Upload image detection with drag & drop support
- Live camera capture and AI inference
- Bounding box detection with confidence, class name, and timing
- Detection history and dashboard statistics
- Backend model loading from `backend/models/best.pt`
- OpenCV image processing and GPU support when available

## Run locally

### Backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Notes

- Place your real YOLOv8 weights at `backend/models/best.pt`.
- Backend API endpoints:
  - `POST /api/detect/`
  - `GET /api/history/`
  - `GET /api/stats/`

Enjoy the cinematic watermelon AI experience.
