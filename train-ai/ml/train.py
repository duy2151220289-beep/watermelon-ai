import os
import shutil
import sys
import time
from pathlib import Path

import torch
from ultralytics import YOLO


# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent
DATA_YAML = BASE_DIR / 'dataset' / 'data.yaml'
RUNS_DIR = BASE_DIR / 'runs'
BACKEND_MODEL_DIR = ROOT_DIR / 'backend' / 'models'
BACKEND_MODEL_DIR.mkdir(parents=True, exist_ok=True)


def get_device():
    """Detect CUDA automatically and return the device string."""
    if torch.cuda.is_available():
        return '0'
    return 'cpu'


def validate_dataset():
    """Ensure that the dataset file and expected directories exist."""
    if not DATA_YAML.exists():
        raise FileNotFoundError(f"Dataset config not found: {DATA_YAML}")
    print(f"Dataset config found at: {DATA_YAML}")


def train_model():
    """Train the YOLOv8 model on the watermelon dataset."""
    print('\n===== Watermelon YOLOv8 Training Pipeline =====')
    validate_dataset()

    device = get_device()
    print(f'Using device: {device}')
    if device != 'cpu':
        print('GPU detected. Training will use CUDA acceleration.')
    else:
        print('No GPU detected. Training will run on CPU. This will be slower.')

    print('Loading YOLOv8n base model...')
    model = YOLO('yolov8n.pt')

    print('Starting training with the following hyperparameters:')
    print('  - epochs=50')
    print('  - imgsz=640')
    print('  - batch=8')
    print('  - device=' + device)
    print('  - data=' + str(DATA_YAML))

    start_time = time.time()
    results = model.train(
        data=str(DATA_YAML),
        epochs=50,
        imgsz=640,
        batch=8,
        device=device,
        project=str(RUNS_DIR),
        name='detect',
        exist_ok=True,
    )
    elapsed = time.time() - start_time

    print(f'Training completed in {elapsed/60:.2f} minutes.')

    best_path = RUNS_DIR / 'detect' / 'weights' / 'best.pt'
    last_path = RUNS_DIR / 'detect' / 'weights' / 'last.pt'
    if best_path.exists():
        shutil.copy2(best_path, BACKEND_MODEL_DIR / 'best.pt')
        print(f'best.pt saved successfully to {BACKEND_MODEL_DIR / "best.pt"}')
    else:
        raise FileNotFoundError(f'Expected best.pt not found at {best_path}')

    if last_path.exists():
        shutil.copy2(last_path, BACKEND_MODEL_DIR / 'last.pt')
        print(f'last.pt saved successfully to {BACKEND_MODEL_DIR / "last.pt"}')
    else:
        print(f'Warning: last.pt was not found at {last_path}')

    print('Training finished successfully. You can now use backend/models/best.pt for inference.')
    return results


if __name__ == '__main__':
    try:
        train_model()
    except Exception as error:
        print(f'ERROR: {error}')
        sys.exit(1)
