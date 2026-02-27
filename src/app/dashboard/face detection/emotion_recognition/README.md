# Facial Emotion Recognition

A Python application for real-time facial emotion recognition using OpenCV and TensorFlow/Keras.

## Overview

This application detects and classifies facial emotions into seven categories:
- Happy
- Sad
- Angry
- Surprise
- Fear
- Disgust
- Neutral

## Project Structure

```
emotion_recognition/
├── data/               # Dataset storage
├── models/             # Trained models
├── src/                # Source code
└── requirements.txt    # Dependencies
```

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

1. Prepare the dataset:
   ```
   python src/data_preparation.py
   ```

2. Train the model:
   ```
   python src/train_model.py
   ```

3. Run real-time emotion detection:
   ```
   python src/emotion_detection.py
   ```

## Dataset

This project uses the FER2013 dataset, which contains 48x48 pixel grayscale images of faces labeled with seven emotions.

## Model Architecture

The model is a Convolutional Neural Network (CNN) with multiple convolutional layers, max-pooling layers, dropout for regularization, and dense layers for classification.

## License

[MIT License](LICENSE) 