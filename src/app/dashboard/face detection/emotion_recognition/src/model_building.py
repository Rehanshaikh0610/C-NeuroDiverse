"""
Model Building Script for Facial Emotion Recognition

This script:
1. Defines a CNN model architecture for emotion recognition
2. Provides alternative model architectures using transfer learning
3. Compiles the model with appropriate loss function and optimizer
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPooling2D, BatchNormalization, Input
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.applications import VGG16, ResNet50
from tensorflow.keras.utils import plot_model

# Define constants
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models')
IMAGE_SIZE = 48  # FER2013 images are 48x48 pixels
NUM_CLASSES = 7  # 7 emotion classes

# Ensure models directory exists
os.makedirs(MODELS_DIR, exist_ok=True)

def build_custom_cnn():
    """
    Build a custom CNN model for emotion recognition
    
    Returns:
        tensorflow.keras.models.Sequential: The compiled model
    """
    model = Sequential([
        # First convolutional block
        Conv2D(32, kernel_size=(3, 3), activation='relu', padding='same', input_shape=(IMAGE_SIZE, IMAGE_SIZE, 1)),
        BatchNormalization(),
        Conv2D(32, kernel_size=(3, 3), activation='relu', padding='same'),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),
        
        # Second convolutional block
        Conv2D(64, kernel_size=(3, 3), activation='relu', padding='same'),
        BatchNormalization(),
        Conv2D(64, kernel_size=(3, 3), activation='relu', padding='same'),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),
        
        # Third convolutional block
        Conv2D(128, kernel_size=(3, 3), activation='relu', padding='same'),
        BatchNormalization(),
        Conv2D(128, kernel_size=(3, 3), activation='relu', padding='same'),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),
        
        # Flatten and dense layers
        Flatten(),
        Dense(512, activation='relu'),
        BatchNormalization(),
        Dropout(0.5),
        Dense(256, activation='relu'),
        BatchNormalization(),
        Dropout(0.5),
        Dense(NUM_CLASSES, activation='softmax')
    ])
    
    # Compile the model
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def build_vgg16_transfer():
    """
    Build a transfer learning model using VGG16 as the base
    
    Returns:
        tensorflow.keras.models.Model: The compiled model
    """
    # Create a base model from VGG16 without the top layers
    # We need to convert grayscale to RGB (3 channels)
    base_model = VGG16(weights='imagenet', include_top=False, input_shape=(IMAGE_SIZE, IMAGE_SIZE, 3))
    
    # Freeze the base model layers
    for layer in base_model.layers:
        layer.trainable = False
    
    # Create a new model on top of the base model
    inputs = Input(shape=(IMAGE_SIZE, IMAGE_SIZE, 1))
    # Convert from 1 channel to 3 channels
    x = Conv2D(3, (1, 1), padding='same')(inputs)
    x = base_model(x)
    x = Flatten()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.5)(x)
    outputs = Dense(NUM_CLASSES, activation='softmax')(x)
    
    model = Model(inputs=inputs, outputs=outputs)
    
    # Compile the model
    model.compile(
        optimizer=Adam(learning_rate=0.0001),  # Lower learning rate for transfer learning
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def build_resnet50_transfer():
    """
    Build a transfer learning model using ResNet50 as the base
    
    Returns:
        tensorflow.keras.models.Model: The compiled model
    """
    # Create a base model from ResNet50 without the top layers
    base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(IMAGE_SIZE, IMAGE_SIZE, 3))
    
    # Freeze the base model layers
    for layer in base_model.layers:
        layer.trainable = False
    
    # Create a new model on top of the base model
    inputs = Input(shape=(IMAGE_SIZE, IMAGE_SIZE, 1))
    # Convert from 1 channel to 3 channels
    x = Conv2D(3, (1, 1), padding='same')(inputs)
    x = base_model(x)
    x = Flatten()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.5)(x)
    outputs = Dense(NUM_CLASSES, activation='softmax')(x)
    
    model = Model(inputs=inputs, outputs=outputs)
    
    # Compile the model
    model.compile(
        optimizer=Adam(learning_rate=0.0001),  # Lower learning rate for transfer learning
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def build_model(model_type='custom_cnn'):
    """
    Build a model based on the specified type
    
    Args:
        model_type (str): Type of model to build ('custom_cnn', 'vgg16', 'resnet50')
        
    Returns:
        tensorflow.keras.models.Model: The compiled model
    """
    if model_type == 'vgg16':
        model = build_vgg16_transfer()
    elif model_type == 'resnet50':
        model = build_resnet50_transfer()
    else:  # default to custom CNN
        model = build_custom_cnn()
    
    # Print model summary
    model.summary()
    
    # Save model architecture diagram
    plot_model(
        model, 
        to_file=os.path.join(MODELS_DIR, f'{model_type}_architecture.png'),
        show_shapes=True,
        show_layer_names=True
    )
    
    return model

def main():
    """
    Main function to demonstrate model building
    """
    print("Building custom CNN model...")
    custom_model = build_model('custom_cnn')
    
    print("\nBuilding VGG16 transfer learning model...")
    vgg16_model = build_model('vgg16')
    
    print("\nBuilding ResNet50 transfer learning model...")
    resnet50_model = build_model('resnet50')
    
    print("\nModel building completed!")

if __name__ == "__main__":
    main() 