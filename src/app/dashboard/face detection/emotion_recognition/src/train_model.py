"""
Model Training Script for Facial Emotion Recognition

This script:
1. Loads the preprocessed data
2. Applies data augmentation to the training set
3. Trains the model with early stopping and learning rate reduction
4. Saves the trained model and training history
"""

import os
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import time
from model_building import build_model

# Define constants
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models')
PROCESSED_DATA_PATH = os.path.join(DATA_DIR, 'processed')
BATCH_SIZE = 64
EPOCHS = 50

# Ensure directories exist
os.makedirs(MODELS_DIR, exist_ok=True)

def load_data(method="opencv"):
    """
    Load the preprocessed data
    
    Args:
        method (str): Preprocessing method used ('opencv' or 'mediapipe')
        
    Returns:
        tuple: (X_train, y_train, X_val, y_val, X_test, y_test)
    """
    method_dir = os.path.join(PROCESSED_DATA_PATH, method)
    
    print(f"Loading preprocessed data from {method_dir}...")
    
    X_train = np.load(os.path.join(method_dir, 'X_train.npy'))
    y_train = np.load(os.path.join(method_dir, 'y_train.npy'))
    X_val = np.load(os.path.join(method_dir, 'X_val.npy'))
    y_val = np.load(os.path.join(method_dir, 'y_val.npy'))
    X_test = np.load(os.path.join(method_dir, 'X_test.npy'))
    y_test = np.load(os.path.join(method_dir, 'y_test.npy'))
    
    print(f"Training set: {X_train.shape[0]} samples")
    print(f"Validation set: {X_val.shape[0]} samples")
    print(f"Testing set: {X_test.shape[0]} samples")
    
    return X_train, y_train, X_val, y_val, X_test, y_test

def create_data_generators(X_train, y_train, X_val, y_val):
    """
    Create data generators with augmentation for training
    
    Args:
        X_train (numpy.ndarray): Training images
        y_train (numpy.ndarray): Training labels
        X_val (numpy.ndarray): Validation images
        y_val (numpy.ndarray): Validation labels
        
    Returns:
        tuple: (train_generator, validation_generator)
    """
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest'
    )
    
    # No augmentation for validation
    val_datagen = ImageDataGenerator()
    
    # Create generators
    train_generator = train_datagen.flow(
        X_train, y_train,
        batch_size=BATCH_SIZE
    )
    
    validation_generator = val_datagen.flow(
        X_val, y_val,
        batch_size=BATCH_SIZE
    )
    
    return train_generator, validation_generator

def train_model(model, train_generator, validation_generator, X_train, model_type='custom_cnn'):
    """
    Train the model with callbacks for early stopping and learning rate reduction
    
    Args:
        model (tensorflow.keras.models.Model): The model to train
        train_generator: Training data generator
        validation_generator: Validation data generator
        X_train (numpy.ndarray): Training images (for steps calculation)
        model_type (str): Type of model being trained
        
    Returns:
        tensorflow.keras.callbacks.History: Training history
    """
    # Define callbacks
    model_checkpoint = ModelCheckpoint(
        os.path.join(MODELS_DIR, f'{model_type}_best.h5'),
        monitor='val_accuracy',
        save_best_only=True,
        mode='max',
        verbose=1
    )
    
    early_stopping = EarlyStopping(
        monitor='val_loss',
        patience=10,
        verbose=1,
        restore_best_weights=True
    )
    
    reduce_lr = ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.2,
        patience=5,
        min_lr=1e-6,
        verbose=1
    )
    
    # Calculate steps per epoch
    steps_per_epoch = len(X_train) // BATCH_SIZE
    
    # Train the model
    print(f"\nTraining {model_type} model...")
    start_time = time.time()
    
    history = model.fit(
        train_generator,
        steps_per_epoch=steps_per_epoch,
        epochs=EPOCHS,
        validation_data=validation_generator,
        validation_steps=len(validation_generator),
        callbacks=[model_checkpoint, early_stopping, reduce_lr]
    )
    
    training_time = time.time() - start_time
    print(f"Training completed in {training_time:.2f} seconds")
    
    # Save the final model
    model.save(os.path.join(MODELS_DIR, f'{model_type}_final.h5'))
    print(f"Model saved to {os.path.join(MODELS_DIR, f'{model_type}_final.h5')}")
    
    return history

def plot_training_history(history, model_type='custom_cnn'):
    """
    Plot and save the training history
    
    Args:
        history (tensorflow.keras.callbacks.History): Training history
        model_type (str): Type of model trained
    """
    # Plot accuracy
    plt.figure(figsize=(12, 4))
    
    plt.subplot(1, 2, 1)
    plt.plot(history.history['accuracy'])
    plt.plot(history.history['val_accuracy'])
    plt.title('Model Accuracy')
    plt.ylabel('Accuracy')
    plt.xlabel('Epoch')
    plt.legend(['Train', 'Validation'], loc='lower right')
    
    # Plot loss
    plt.subplot(1, 2, 2)
    plt.plot(history.history['loss'])
    plt.plot(history.history['val_loss'])
    plt.title('Model Loss')
    plt.ylabel('Loss')
    plt.xlabel('Epoch')
    plt.legend(['Train', 'Validation'], loc='upper right')
    
    plt.tight_layout()
    plt.savefig(os.path.join(MODELS_DIR, f'{model_type}_training_history.png'))
    plt.close()

def optimize_training_speed():
    """
    Print tips for optimizing training speed
    """
    print("\nTips for optimizing training speed:")
    print("1. Use GPU acceleration if available")
    print("2. Reduce batch size if memory is limited")
    print("3. Use mixed precision training (tf.keras.mixed_precision)")
    print("4. Reduce image size or use grayscale images")
    print("5. Use fewer layers in the model architecture")
    print("6. Use data caching and prefetching with tf.data.Dataset")

def main():
    """
    Main function to execute the model training pipeline
    """
    # Load preprocessed data
    X_train, y_train, X_val, y_val, X_test, y_test = load_data(method="opencv")
    
    # Create data generators
    train_generator, validation_generator = create_data_generators(X_train, y_train, X_val, y_val)
    
    # Build and train the model
    model_type = 'custom_cnn'  # Options: 'custom_cnn', 'vgg16', 'resnet50'
    model = build_model(model_type)
    
    # Train the model
    history = train_model(model, train_generator, validation_generator, X_train, model_type)
    
    # Plot training history
    plot_training_history(history, model_type)
    
    # Print optimization tips
    optimize_training_speed()
    
    print("\nModel training completed!")

if __name__ == "__main__":
    main() 