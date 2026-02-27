"""
Data Preparation Script for Facial Emotion Recognition

This script:
1. Downloads the FER2013 dataset (if not already downloaded)
2. Preprocesses the images (face detection, cropping, resizing, normalization)
3. Splits the data into training, validation, and testing sets
4. Saves the preprocessed data for later use
"""

import os
import numpy as np
import pandas as pd
import cv2
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from tqdm import tqdm
import urllib.request
import zipfile
import kaggle
import mediapipe as mp

# Define constants
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models')
FER_DATASET_PATH = os.path.join(DATA_DIR, 'fer2013.csv')
PROCESSED_DATA_PATH = os.path.join(DATA_DIR, 'processed')
IMAGE_SIZE = 48  # FER2013 images are 48x48 pixels

# Ensure directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(PROCESSED_DATA_PATH, exist_ok=True)

# Emotion mapping
EMOTIONS = {
    0: 'Angry',
    1: 'Disgust',
    2: 'Fear',
    3: 'Happy',
    4: 'Sad',
    5: 'Surprise',
    6: 'Neutral'
}

def download_dataset():
    """
    Download the FER2013 dataset from Kaggle if not already downloaded
    """
    if os.path.exists(FER_DATASET_PATH):
        print(f"Dataset already exists at {FER_DATASET_PATH}")
        return
    
    print("Downloading FER2013 dataset from Kaggle...")
    try:
        # Using Kaggle API (requires kaggle.json credentials)
        kaggle.api.authenticate()
        kaggle.api.dataset_download_files('msambare/fer2013', path=DATA_DIR, unzip=True)
        print("Dataset downloaded successfully!")
    except Exception as e:
        print(f"Error downloading dataset: {e}")
        print("Please download the FER2013 dataset manually from Kaggle:")
        print("https://www.kaggle.com/datasets/msambare/fer2013")
        print(f"And place the 'fer2013.csv' file in the {DATA_DIR} directory.")

def load_data():
    """
    Load the FER2013 dataset
    
    Returns:
        pandas.DataFrame: The loaded dataset
    """
    if not os.path.exists(FER_DATASET_PATH):
        print(f"Dataset not found at {FER_DATASET_PATH}")
        download_dataset()
    
    print("Loading dataset...")
    try:
        data = pd.read_csv(FER_DATASET_PATH)
        print(f"Dataset loaded successfully! Shape: {data.shape}")
        return data
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return None

def preprocess_with_opencv(data):
    """
    Preprocess the dataset using OpenCV's face detection
    
    Args:
        data (pandas.DataFrame): The dataset to preprocess
        
    Returns:
        tuple: (X_train, y_train, X_val, y_val, X_test, y_test)
    """
    print("Preprocessing data with OpenCV...")
    
    # Load face cascade classifier
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    # Initialize arrays for processed images and labels
    X = []
    y = []
    
    # Process each image in the dataset
    for i, row in tqdm(data.iterrows(), total=data.shape[0], desc="Processing images"):
        emotion = row['emotion']
        pixels = row['pixels'].split()
        pixels = np.array([int(pixel) for pixel in pixels], dtype=np.uint8)
        img = pixels.reshape((IMAGE_SIZE, IMAGE_SIZE))
        
        # Detect faces
        faces = face_cascade.detectMultiScale(
            img,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )
        
        # If a face is detected, crop to the face region
        if len(faces) > 0:
            x, y_coord, w, h = faces[0]
            face_img = img[y_coord:y_coord+h, x:x+w]
            # Resize to standard size
            face_img = cv2.resize(face_img, (IMAGE_SIZE, IMAGE_SIZE))
        else:
            # If no face is detected, use the original image
            face_img = img
        
        # Normalize pixel values to [0, 1]
        face_img = face_img / 255.0
        
        X.append(face_img)
        y.append(emotion)
    
    # Convert lists to numpy arrays
    X = np.array(X)
    y = np.array(y)
    
    # Reshape images to include channel dimension (grayscale = 1 channel)
    X = X.reshape(X.shape[0], IMAGE_SIZE, IMAGE_SIZE, 1)
    
    # Split data into training, validation, and testing sets (70%, 15%, 15%)
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)
    
    print(f"Training set: {X_train.shape[0]} samples")
    print(f"Validation set: {X_val.shape[0]} samples")
    print(f"Testing set: {X_test.shape[0]} samples")
    
    return X_train, y_train, X_val, y_val, X_test, y_test

def preprocess_with_mediapipe(data):
    """
    Preprocess the dataset using MediaPipe's face detection
    
    Args:
        data (pandas.DataFrame): The dataset to preprocess
        
    Returns:
        tuple: (X_train, y_train, X_val, y_val, X_test, y_test)
    """
    print("Preprocessing data with MediaPipe...")
    
    # Initialize MediaPipe face detection
    mp_face_detection = mp.solutions.face_detection
    face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.5)
    
    # Initialize arrays for processed images and labels
    X = []
    y = []
    
    # Process each image in the dataset
    for i, row in tqdm(data.iterrows(), total=data.shape[0], desc="Processing images"):
        emotion = row['emotion']
        pixels = row['pixels'].split()
        pixels = np.array([int(pixel) for pixel in pixels], dtype=np.uint8)
        img = pixels.reshape((IMAGE_SIZE, IMAGE_SIZE))
        
        # Convert to RGB for MediaPipe (it expects RGB images)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
        
        # Detect faces
        results = face_detection.process(img_rgb)
        
        # If a face is detected, crop to the face region
        if results.detections:
            detection = results.detections[0]  # Get the first detected face
            bboxC = detection.location_data.relative_bounding_box
            
            # Convert relative coordinates to absolute
            h, w, _ = img_rgb.shape
            x = int(bboxC.xmin * w)
            y_coord = int(bboxC.ymin * h)
            width = int(bboxC.width * w)
            height = int(bboxC.height * h)
            
            # Ensure coordinates are within image boundaries
            x = max(0, x)
            y_coord = max(0, y_coord)
            width = min(width, w - x)
            height = min(height, h - y_coord)
            
            # Crop the face
            face_img = img[y_coord:y_coord+height, x:x+width]
            
            # Resize to standard size
            face_img = cv2.resize(face_img, (IMAGE_SIZE, IMAGE_SIZE))
        else:
            # If no face is detected, use the original image
            face_img = img
        
        # Normalize pixel values to [0, 1]
        face_img = face_img / 255.0
        
        X.append(face_img)
        y.append(emotion)
    
    # Convert lists to numpy arrays
    X = np.array(X)
    y = np.array(y)
    
    # Reshape images to include channel dimension (grayscale = 1 channel)
    X = X.reshape(X.shape[0], IMAGE_SIZE, IMAGE_SIZE, 1)
    
    # Split data into training, validation, and testing sets (70%, 15%, 15%)
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)
    
    print(f"Training set: {X_train.shape[0]} samples")
    print(f"Validation set: {X_val.shape[0]} samples")
    print(f"Testing set: {X_test.shape[0]} samples")
    
    return X_train, y_train, X_val, y_val, X_test, y_test

def save_processed_data(X_train, y_train, X_val, y_val, X_test, y_test, method="opencv"):
    """
    Save the preprocessed data to disk
    
    Args:
        X_train (numpy.ndarray): Training images
        y_train (numpy.ndarray): Training labels
        X_val (numpy.ndarray): Validation images
        y_val (numpy.ndarray): Validation labels
        X_test (numpy.ndarray): Testing images
        y_test (numpy.ndarray): Testing labels
        method (str): Preprocessing method used ('opencv' or 'mediapipe')
    """
    print(f"Saving preprocessed data ({method})...")
    
    # Create directory for the specific method
    method_dir = os.path.join(PROCESSED_DATA_PATH, method)
    os.makedirs(method_dir, exist_ok=True)
    
    # Save arrays
    np.save(os.path.join(method_dir, 'X_train.npy'), X_train)
    np.save(os.path.join(method_dir, 'y_train.npy'), y_train)
    np.save(os.path.join(method_dir, 'X_val.npy'), X_val)
    np.save(os.path.join(method_dir, 'y_val.npy'), y_val)
    np.save(os.path.join(method_dir, 'X_test.npy'), X_test)
    np.save(os.path.join(method_dir, 'y_test.npy'), y_test)
    
    print(f"Data saved to {method_dir}")

def visualize_samples(X, y, method, num_samples=5):
    """
    Visualize sample images from the preprocessed dataset
    
    Args:
        X (numpy.ndarray): Images
        y (numpy.ndarray): Labels
        method (str): Preprocessing method used
        num_samples (int): Number of samples to visualize
    """
    plt.figure(figsize=(15, 3))
    plt.suptitle(f"Sample Images ({method} preprocessing)")
    
    for i in range(num_samples):
        plt.subplot(1, num_samples, i+1)
        plt.imshow(X[i].reshape(IMAGE_SIZE, IMAGE_SIZE), cmap='gray')
        plt.title(EMOTIONS[y[i]])
        plt.axis('off')
    
    # Save the figure
    plt.savefig(os.path.join(PROCESSED_DATA_PATH, f'samples_{method}.png'))
    plt.close()

def compare_methods(data):
    """
    Compare OpenCV and MediaPipe face detection methods
    
    Args:
        data (pandas.DataFrame): The dataset to preprocess
    """
    # Process a small subset of the data for comparison
    sample_data = data.sample(n=min(1000, len(data)), random_state=42)
    
    # Process with OpenCV
    X_train_cv, y_train_cv, X_val_cv, y_val_cv, X_test_cv, y_test_cv = preprocess_with_opencv(sample_data)
    
    # Process with MediaPipe
    X_train_mp, y_train_mp, X_val_mp, y_val_mp, X_test_mp, y_test_mp = preprocess_with_mediapipe(sample_data)
    
    # Visualize samples from both methods
    visualize_samples(X_train_cv, y_train_cv, "OpenCV")
    visualize_samples(X_train_mp, y_train_mp, "MediaPipe")
    
    print("\nComparison of face detection methods:")
    print(f"OpenCV detected faces: {len(X_train_cv) + len(X_val_cv) + len(X_test_cv)}")
    print(f"MediaPipe detected faces: {len(X_train_mp) + len(X_val_mp) + len(X_test_mp)}")

def main():
    """
    Main function to execute the data preparation pipeline
    """
    # Load the dataset
    data = load_data()
    if data is None:
        return
    
    # Compare face detection methods on a small subset
    print("\nComparing face detection methods...")
    compare_methods(data.sample(n=min(1000, len(data)), random_state=42))
    
    # Process the full dataset with the chosen method (OpenCV in this case)
    print("\nProcessing full dataset with OpenCV...")
    X_train, y_train, X_val, y_val, X_test, y_test = preprocess_with_opencv(data)
    
    # Save the processed data
    save_processed_data(X_train, y_train, X_val, y_val, X_test, y_test, method="opencv")
    
    print("\nData preparation completed!")

if __name__ == "__main__":
    main() 