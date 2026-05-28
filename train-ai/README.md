# Watermelon YOLOv8 Training Pipeline

This project is a complete YOLOv8 training pipeline for watermelon detection using a Roboflow dataset.

## Project structure

train-ai/
│
├── dataset/
│   ├── train/
│   ├── valid/
│   ├── test/
│   └── data.yaml
│
├── ml/
│   ├── train.py
│   ├── predict.py
│   └── requirements.txt
│
├── backend/
│   └── models/
│
└── README.md

## Setup

### 1. Create a virtual environment

```bash
cd train-ai/ml
python -m venv .venv
```

### 2. Activate the virtual environment

Windows PowerShell:
```powershell
.\.venv\Scripts\Activate.ps1
```

Windows CMD:
```cmd
.venv\Scripts\activate.bat
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

## Dataset

Place your Roboflow-exported watermelon dataset inside the `dataset/` folder. The structure should be:

- `dataset/train/`
- `dataset/valid/`
- `dataset/test/`
- `dataset/data.yaml`

The `data.yaml` file already points to these directories.

## Run training

```bash
python train.py
```

This will:

- load `yolov8n.pt`
- train for `50` epochs
- use `imgsz=640`
- use `batch=8`
- automatically detect CUDA if available
- save weights in `runs/detect/weights/`
- copy `best.pt` and `last.pt` into the root `backend/models/` directory used by the deployed app

## Run prediction

```bash
python predict.py
```

This will:

- load `backend/models/best.pt`
- run prediction on the first supported image found in `dataset/test/`
- save results to `runs/predict/watermelon/`

## Hyperparameter explanations

- `epochs`: The number of times the model sees the entire dataset. More epochs help the model learn better, but too many can cause overfitting.
- `batch`: The number of images processed in one training step. A batch size of `8` balances GPU memory usage and training stability.
- `imgsz`: The size of the training images, set to `640x640`. Larger images help detect small objects better but use more GPU memory.
- `confidence threshold`: The minimum confidence required to keep a detection. In the prediction code, it is set to `0.25` so low-confidence boxes are filtered out.
- `mAP50`: Mean Average Precision at 50% IoU. This is a standard object detection metric that measures how well bounding boxes match ground truth labels.

## Notes

- For best results, use an NVIDIA RTX 4060 or similar CUDA-capable GPU.
- If CUDA is not available, the code will fall back to CPU automatically.
- Make sure `yolov8n.pt` is available in the working environment, or download it with Ultralytics automatically.
