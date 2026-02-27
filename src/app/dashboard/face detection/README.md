# Face Emotion Detection

A real-time face emotion detection program using OpenCV and computer vision techniques.

## Requirements
- Python 3.x
- OpenCV (opencv-python)
- NumPy

## Installation
1. Make sure you have Python installed on your system
2. Install the required packages:
```bash
pip install opencv-python numpy
```

## Usage
1. Run the script:
```bash
python emotion_detection.py
```
2. The program will open your webcam and start detecting faces and emotions
3. Press 'q' to quit the program

## Features
- Real-time face detection
- Eye and mouth detection
- Advanced emotion classification:
  - Happy
  - Sad
  - Surprised
  - Angry
  - Neutral
- Error handling for robust operation

## How It Works
The program uses multiple features to determine emotions:
1. Facial intensity and variance analysis
2. Eye state detection (open/closed)
3. Mouth aspect ratio calculation

## Troubleshooting
- If you encounter webcam access issues, make sure no other application is using your camera
- For better detection, ensure good lighting conditions
- If cascade files fail to load, check your OpenCV installation

## Note
This implementation uses computer vision techniques for emotion detection. For even higher accuracy, consider implementing a deep learning-based approach. 