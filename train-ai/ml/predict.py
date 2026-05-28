import os
import sys
from pathlib import Path

import torch
from ultralytics import YOLO


BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent
MODEL_PATH = ROOT_DIR / 'backend' / 'models' / 'best.pt'
TEST_DIR = BASE_DIR / 'dataset' / 'test'


def get_device():
    """Return the device string configured for CUDA if available."""
    if torch.cuda.is_available():
        return '0'
    return 'cpu'


def find_test_image():
    """Pick the first image in the test folder for prediction."""
    supported = ['.jpg', '.jpeg', '.png', '.bmp']
    if not TEST_DIR.exists():
        raise FileNotFoundError(f"Test folder not found: {TEST_DIR}")

    for path in sorted(TEST_DIR.iterdir()):
        if path.suffix.lower() in supported:
            return path
    raise FileNotFoundError('No supported test image found in dataset/test.')


def run_prediction():
    """Load the trained model and run prediction on a test image."""
    print('\n===== YOLOv8 Watermelon Prediction =====')
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f'Model weights not found: {MODEL_PATH}')

    device = get_device()
    print(f'Using device: {device}')
    if device != 'cpu':
        print('GPU detected. Prediction will use CUDA acceleration.')
    else:
        print('No GPU detected. Prediction will run on CPU.')

    test_image = find_test_image()
    print(f'Running prediction on: {test_image}')

    model = YOLO(str(MODEL_PATH))
    results = model.predict(
        source=str(test_image),
        imgsz=640,
        conf=0.25,
        device=device,
        save=True,
        project=str(BASE_DIR / 'runs' / 'predict'),
        name='watermelon',
        exist_ok=True,
    )

    print('Prediction completed.')
    print(f'Results saved to: {BASE_DIR / "runs" / "predict" / "watermelon"}')
    return results


if __name__ == '__main__':
    try:
        run_prediction()
    except Exception as error:
        print(f'ERROR: {error}')
        sys.exit(1)
