"""
Model Evaluation Script for Facial Emotion Recognition

This script:
1. Loads the trained model
2. Evaluates the model on the test set
3. Calculates and displays performance metrics
4. Visualizes the confusion matrix
"""

import os
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import tensorflow as tf
from tensorflow.keras.models import load_model
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.metrics import confusion_matrix, classification_report

# Define constants
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models')
PROCESSED_DATA_PATH = os.path.join(DATA_DIR, 'processed')

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

def load_test_data(method="opencv"):
    """
    Load the test data
    
    Args:
        method (str): Preprocessing method used ('opencv' or 'mediapipe')
        
    Returns:
        tuple: (X_test, y_test)
    """
    method_dir = os.path.join(PROCESSED_DATA_PATH, method)
    
    print(f"Loading test data from {method_dir}...")
    
    X_test = np.load(os.path.join(method_dir, 'X_test.npy'))
    y_test = np.load(os.path.join(method_dir, 'y_test.npy'))
    
    print(f"Test set: {X_test.shape[0]} samples")
    
    return X_test, y_test

def load_trained_model(model_type='custom_cnn'):
    """
    Load the trained model
    
    Args:
        model_type (str): Type of model to load ('custom_cnn', 'vgg16', 'resnet50')
        
    Returns:
        tensorflow.keras.models.Model: The loaded model
    """
    model_path = os.path.join(MODELS_DIR, f'{model_type}_best.h5')
    
    if not os.path.exists(model_path):
        print(f"Model not found at {model_path}")
        model_path = os.path.join(MODELS_DIR, f'{model_type}_final.h5')
        
        if not os.path.exists(model_path):
            print(f"Model not found at {model_path}")
            return None
    
    print(f"Loading model from {model_path}...")
    model = load_model(model_path)
    
    return model

def evaluate_model(model, X_test, y_test):
    """
    Evaluate the model on the test set
    
    Args:
        model (tensorflow.keras.models.Model): The model to evaluate
        X_test (numpy.ndarray): Test images
        y_test (numpy.ndarray): Test labels
        
    Returns:
        tuple: (accuracy, precision, recall, f1, y_pred)
    """
    print("Evaluating model on test set...")
    
    # Get model predictions
    y_pred_prob = model.predict(X_test)
    y_pred = np.argmax(y_pred_prob, axis=1)
    
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted')
    recall = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')
    
    # Print metrics
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    
    # Print classification report
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=list(EMOTIONS.values())))
    
    return accuracy, precision, recall, f1, y_pred

def plot_confusion_matrix(y_test, y_pred, model_type='custom_cnn'):
    """
    Plot and save the confusion matrix
    
    Args:
        y_test (numpy.ndarray): True labels
        y_pred (numpy.ndarray): Predicted labels
        model_type (str): Type of model evaluated
    """
    # Calculate confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    
    # Normalize confusion matrix
    cm_norm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
    
    # Plot confusion matrix
    plt.figure(figsize=(10, 8))
    sns.heatmap(
        cm_norm, 
        annot=True, 
        fmt='.2f', 
        cmap='Blues',
        xticklabels=list(EMOTIONS.values()),
        yticklabels=list(EMOTIONS.values())
    )
    plt.title('Normalized Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    
    # Save the figure
    plt.savefig(os.path.join(MODELS_DIR, f'{model_type}_confusion_matrix.png'))
    plt.close()
    
    print(f"Confusion matrix saved to {os.path.join(MODELS_DIR, f'{model_type}_confusion_matrix.png')}")

def visualize_misclassifications(X_test, y_test, y_pred, model_type='custom_cnn', num_samples=5):
    """
    Visualize misclassified samples
    
    Args:
        X_test (numpy.ndarray): Test images
        y_test (numpy.ndarray): True labels
        y_pred (numpy.ndarray): Predicted labels
        model_type (str): Type of model evaluated
        num_samples (int): Number of misclassified samples to visualize
    """
    # Find misclassified samples
    misclassified_indices = np.where(y_test != y_pred)[0]
    
    if len(misclassified_indices) == 0:
        print("No misclassified samples found.")
        return
    
    # Select random misclassified samples
    selected_indices = np.random.choice(
        misclassified_indices, 
        size=min(num_samples, len(misclassified_indices)), 
        replace=False
    )
    
    # Plot misclassified samples
    plt.figure(figsize=(15, 3))
    plt.suptitle(f"Misclassified Samples ({model_type} model)")
    
    for i, idx in enumerate(selected_indices):
        plt.subplot(1, num_samples, i+1)
        plt.imshow(X_test[idx].reshape(48, 48), cmap='gray')
        plt.title(f"True: {EMOTIONS[y_test[idx]]}\nPred: {EMOTIONS[y_pred[idx]]}")
        plt.axis('off')
    
    # Save the figure
    plt.savefig(os.path.join(MODELS_DIR, f'{model_type}_misclassifications.png'))
    plt.close()
    
    print(f"Misclassified samples saved to {os.path.join(MODELS_DIR, f'{model_type}_misclassifications.png')}")

def main():
    """
    Main function to execute the model evaluation pipeline
    """
    # Load test data
    X_test, y_test = load_test_data(method="opencv")
    
    # Load trained model
    model_type = 'custom_cnn'  # Options: 'custom_cnn', 'vgg16', 'resnet50'
    model = load_trained_model(model_type)
    
    if model is None:
        print("Model not found. Please train the model first.")
        return
    
    # Evaluate model
    accuracy, precision, recall, f1, y_pred = evaluate_model(model, X_test, y_test)
    
    # Plot confusion matrix
    plot_confusion_matrix(y_test, y_pred, model_type)
    
    # Visualize misclassifications
    visualize_misclassifications(X_test, y_test, y_pred, model_type)
    
    print("\nModel evaluation completed!")

if __name__ == "__main__":
    main() 