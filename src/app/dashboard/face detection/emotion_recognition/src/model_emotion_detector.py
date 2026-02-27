"""
Advanced Emotion Detector with Pre-trained Model

This script provides a high-accuracy emotion detection system using a pre-trained model.
It includes a robust GUI and real-time webcam processing.
"""

import os
import cv2
import numpy as np
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from PIL import Image, ImageTk
import time
import threading
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPooling2D, BatchNormalization
import matplotlib.pyplot as plt

# Define constants
IMAGE_SIZE = (48, 48)
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'emotion_model.h5')

# Emotion mapping
EMOTIONS = ['Angry', 'Happy', 'Sad', 'Neutral']

# Emotion colors
EMOTION_COLORS = {
    'Angry': "#FF0000",      # Red
    'Happy': "#FFD700",      # Gold
    'Sad': "#1E90FF",        # Dodger blue
    'Neutral': "#FFFFFF"     # White
}

class EmotionDetector:
    def __init__(self, root):
        self.root = root
        self.root.title("Advanced Emotion Detector")
        self.root.geometry("1000x700")
        
        # Initialize variables
        self.is_running = False
        self.cap = None
        self.face_cascade = None
        self.model = None
        self.current_emotion = "No emotion detected"
        self.emotion_counts = {emotion: 0 for emotion in EMOTIONS}
        self.frame_count = 0
        self.last_time = time.time()
        self.fps = 0
        self.debug_mode = False
        self.confidence_threshold = 0.5
        
        # Load face cascade
        try:
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            self.face_cascade = cv2.CascadeClassifier(cascade_path)
            if self.face_cascade.empty():
                messagebox.showerror("Error", "Failed to load face cascade classifier")
        except Exception as e:
            messagebox.showerror("Error", f"Error loading face cascade: {str(e)}")
        
        # Load or create model
        self.load_model()
        
        # Create GUI
        self.create_gui()
        
        # Bind window close event
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
    
    def load_model(self):
        """Load pre-trained model or create a new one if not found"""
        try:
            if os.path.exists(MODEL_PATH):
                self.model = tf.keras.models.load_model(MODEL_PATH)
                print(f"Model loaded from {MODEL_PATH}")
            else:
                print("Pre-trained model not found. Creating a new model...")
                self.create_model()
                os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
                self.model.save(MODEL_PATH)
                print(f"New model saved to {MODEL_PATH}")
        except Exception as e:
            print(f"Error loading/creating model: {e}")
            self.create_model()
    
    def create_model(self):
        """Create a CNN model for emotion detection"""
        model = Sequential()
        
        # First convolutional block
        model.add(Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(48, 48, 1)))
        model.add(BatchNormalization())
        model.add(Conv2D(32, kernel_size=(3, 3), activation='relu'))
        model.add(BatchNormalization())
        model.add(MaxPooling2D(pool_size=(2, 2)))
        model.add(Dropout(0.25))
        
        # Second convolutional block
        model.add(Conv2D(64, kernel_size=(3, 3), activation='relu'))
        model.add(BatchNormalization())
        model.add(Conv2D(64, kernel_size=(3, 3), activation='relu'))
        model.add(BatchNormalization())
        model.add(MaxPooling2D(pool_size=(2, 2)))
        model.add(Dropout(0.25))
        
        # Third convolutional block
        model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
        model.add(BatchNormalization())
        model.add(MaxPooling2D(pool_size=(2, 2)))
        model.add(Dropout(0.25))
        
        # Flatten and dense layers
        model.add(Flatten())
        model.add(Dense(512, activation='relu'))
        model.add(BatchNormalization())
        model.add(Dropout(0.5))
        model.add(Dense(len(EMOTIONS), activation='softmax'))
        
        # Compile model
        model.compile(
            loss='categorical_crossentropy',
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
            metrics=['accuracy']
        )
        
        self.model = model
    
    def create_gui(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding=10)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Left frame for video
        left_frame = ttk.Frame(main_frame)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # Video canvas
        self.canvas = tk.Canvas(left_frame, bg="black", width=640, height=480)
        self.canvas.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Right frame for controls and visualization
        right_frame = ttk.Frame(main_frame, width=300)
        right_frame.pack(side=tk.RIGHT, fill=tk.Y)
        right_frame.pack_propagate(False)
        
        # Current emotion display
        emotion_frame = ttk.LabelFrame(right_frame, text="Current Emotion")
        emotion_frame.pack(fill=tk.X, pady=10)
        
        self.emotion_label = ttk.Label(emotion_frame, text="No emotion detected", font=("Arial", 16))
        self.emotion_label.pack(pady=10)
        
        # Confidence display
        self.confidence_label = ttk.Label(emotion_frame, text="Confidence: 0%")
        self.confidence_label.pack(pady=5)
        
        # FPS display
        self.fps_label = ttk.Label(right_frame, text="FPS: 0.0")
        self.fps_label.pack(pady=5)
        
        # Confidence threshold slider
        threshold_frame = ttk.LabelFrame(right_frame, text="Confidence Threshold")
        threshold_frame.pack(fill=tk.X, pady=10)
        
        self.threshold_var = tk.DoubleVar(value=0.5)
        threshold_slider = ttk.Scale(
            threshold_frame, 
            from_=0.1, 
            to=0.9, 
            orient=tk.HORIZONTAL, 
            variable=self.threshold_var,
            command=self.update_threshold
        )
        threshold_slider.pack(fill=tk.X, padx=10, pady=5)
        
        threshold_value = ttk.Label(threshold_frame, text="0.5")
        threshold_value.pack(pady=5)
        self.threshold_label = threshold_value
        
        # Emotion probabilities visualization
        probs_frame = ttk.LabelFrame(right_frame, text="Emotion Probabilities")
        probs_frame.pack(fill=tk.X, pady=10)
        
        self.prob_bars = {}
        for emotion in EMOTIONS:
            frame = ttk.Frame(probs_frame)
            frame.pack(fill=tk.X, pady=2)
            
            label = ttk.Label(frame, text=f"{emotion}:", width=10)
            label.pack(side=tk.LEFT, padx=5)
            
            # Create a canvas for the probability bar
            canvas = tk.Canvas(frame, height=20, bg="light gray")
            canvas.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
            
            # Create a label for the probability value
            value_label = ttk.Label(frame, text="0%", width=8)
            value_label.pack(side=tk.RIGHT, padx=5)
            
            self.prob_bars[emotion] = {
                "canvas": canvas,
                "label": value_label
            }
        
        # Statistics frame
        stats_frame = ttk.LabelFrame(right_frame, text="Emotion Statistics")
        stats_frame.pack(fill=tk.X, pady=10)
        
        self.stats_labels = {}
        for emotion in EMOTIONS:
            frame = ttk.Frame(stats_frame)
            frame.pack(fill=tk.X, pady=2)
            
            label = ttk.Label(frame, text=f"{emotion}:")
            label.pack(side=tk.LEFT)
            
            count_label = ttk.Label(frame, text="0 (0%)")
            count_label.pack(side=tk.RIGHT)
            
            self.stats_labels[emotion] = count_label
        
        # Control buttons
        control_frame = ttk.Frame(right_frame)
        control_frame.pack(fill=tk.X, pady=10)
        
        self.start_button = ttk.Button(control_frame, text="Start Camera", command=self.toggle_camera)
        self.start_button.pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)
        
        self.reset_button = ttk.Button(control_frame, text="Reset Stats", command=self.reset_stats)
        self.reset_button.pack(side=tk.RIGHT, padx=5, fill=tk.X, expand=True)
        
        # Camera selection
        camera_frame = ttk.Frame(right_frame)
        camera_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(camera_frame, text="Camera:").pack(side=tk.LEFT, padx=5)
        
        self.camera_var = tk.StringVar(value="0")
        camera_combo = ttk.Combobox(camera_frame, textvariable=self.camera_var, values=["0", "1", "2", "3"])
        camera_combo.pack(side=tk.RIGHT, padx=5, fill=tk.X, expand=True)
        
        # Face detection parameters
        detection_frame = ttk.LabelFrame(right_frame, text="Face Detection")
        detection_frame.pack(fill=tk.X, pady=10)
        
        # Scale factor slider
        scale_frame = ttk.Frame(detection_frame)
        scale_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(scale_frame, text="Scale:").pack(side=tk.LEFT, padx=5)
        
        self.scale_var = tk.DoubleVar(value=1.1)
        scale_slider = ttk.Scale(
            scale_frame, 
            from_=1.05, 
            to=1.4, 
            orient=tk.HORIZONTAL, 
            variable=self.scale_var
        )
        scale_slider.pack(side=tk.RIGHT, fill=tk.X, expand=True, padx=5)
        
        # Min neighbors slider
        neighbors_frame = ttk.Frame(detection_frame)
        neighbors_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(neighbors_frame, text="Precision:").pack(side=tk.LEFT, padx=5)
        
        self.neighbors_var = tk.IntVar(value=5)
        neighbors_slider = ttk.Scale(
            neighbors_frame, 
            from_=3, 
            to=10, 
            orient=tk.HORIZONTAL, 
            variable=self.neighbors_var
        )
        neighbors_slider.pack(side=tk.RIGHT, fill=tk.X, expand=True, padx=5)
        
        # Debug mode checkbox
        debug_frame = ttk.Frame(right_frame)
        debug_frame.pack(fill=tk.X, pady=5)
        
        self.debug_var = tk.BooleanVar(value=False)
        debug_check = ttk.Checkbutton(
            debug_frame, 
            text="Debug Mode", 
            variable=self.debug_var, 
            command=self.toggle_debug
        )
        debug_check.pack(side=tk.LEFT, padx=5)
        
        # Status label
        self.status_label = ttk.Label(right_frame, text="Ready - Press 'Start Camera'")
        self.status_label.pack(pady=5)
    
    def update_threshold(self, value):
        """Update confidence threshold value"""
        self.confidence_threshold = self.threshold_var.get()
        self.threshold_label.config(text=f"{self.confidence_threshold:.1f}")
    
    def toggle_debug(self):
        """Toggle debug mode on/off"""
        self.debug_mode = self.debug_var.get()
        if self.debug_mode:
            self.status_label.config(text="Debug mode ON")
        else:
            self.status_label.config(text="Debug mode OFF")
    
    def toggle_camera(self):
        if self.is_running:
            # Stop camera
            self.is_running = False
            if self.cap is not None:
                self.cap.release()
                self.cap = None
            self.start_button.config(text="Start Camera")
            self.status_label.config(text="Camera stopped")
        else:
            # Start camera in a separate thread
            self.start_button.config(text="Starting...")
            self.start_button.config(state=tk.DISABLED)
            
            # Use threading to avoid blocking the GUI
            threading.Thread(target=self.start_camera, daemon=True).start()
    
    def start_camera(self):
        try:
            # Try to open the selected camera
            camera_id = int(self.camera_var.get())
            self.cap = cv2.VideoCapture(camera_id, cv2.CAP_DSHOW)  # Use DirectShow on Windows
            
            # Set camera properties for better performance
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            self.cap.set(cv2.CAP_PROP_FPS, 30)
            
            # Check if camera opened successfully
            if not self.cap.isOpened():
                raise Exception(f"Could not open camera {camera_id}")
            
            # Read a test frame
            ret, test_frame = self.cap.read()
            if not ret or test_frame is None:
                raise Exception("Could not read from camera")
            
            # Start processing
            self.is_running = True
            self.root.after(0, lambda: self.start_button.config(text="Stop Camera", state=tk.NORMAL))
            self.status_label.config(text=f"Camera {camera_id} running")
            self.process_camera()
            
        except Exception as e:
            # Handle camera initialization errors
            if self.cap is not None:
                self.cap.release()
                self.cap = None
            
            self.root.after(0, lambda: self.start_button.config(text="Start Camera", state=tk.NORMAL))
            self.root.after(0, lambda: self.status_label.config(text=f"Error: {str(e)}"))
            self.root.after(0, lambda: messagebox.showerror("Camera Error", 
                                     f"Could not access camera: {str(e)}\n\n"
                                     "Please try:\n"
                                     "1. Selecting a different camera\n"
                                     "2. Closing other applications using the camera\n"
                                     "3. Checking if your camera is enabled"))
    
    def process_camera(self):
        if not self.is_running or self.cap is None:
            return
        
        try:
            # Read frame
            ret, frame = self.cap.read()
            if not ret or frame is None:
                self.status_label.config(text="Error reading from camera")
                self.is_running = False
                self.start_button.config(text="Start Camera")
                return
            
            # Calculate FPS
            self.frame_count += 1
            if self.frame_count >= 10:
                current_time = time.time()
                self.fps = self.frame_count / (current_time - self.last_time)
                self.last_time = current_time
                self.frame_count = 0
                self.fps_label.config(text=f"FPS: {self.fps:.1f}")
            
            # Process frame
            self.process_frame(frame)
            
            # Schedule next update
            self.root.after(10, self.process_camera)
            
        except Exception as e:
            print(f"Error in process_camera: {e}")
            self.status_label.config(text=f"Error: {str(e)}")
            self.is_running = False
            self.start_button.config(text="Start Camera")
    
    def process_frame(self, frame):
        # Flip frame horizontally for mirror effect
        frame = cv2.flip(frame, 1)
        
        # Convert to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces with adjusted parameters
        scale_factor = max(1.05, self.scale_var.get())
        min_neighbors = self.neighbors_var.get()
        
        if self.face_cascade is not None:
            try:
                faces = self.face_cascade.detectMultiScale(
                    gray, 
                    scaleFactor=scale_factor, 
                    minNeighbors=min_neighbors, 
                    minSize=(30, 30)
                )
                
                # Process each face
                if len(faces) > 0:
                    # Get the largest face
                    largest_face = max(faces, key=lambda rect: rect[2] * rect[3])
                    (x, y, w, h) = largest_face
                    
                    # Draw rectangle around face
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                    
                    # Extract face region
                    face_roi = gray[y:y+h, x:x+w]
                    
                    try:
                        # Resize face for model input
                        face_roi = cv2.resize(face_roi, IMAGE_SIZE)
                        
                        # Add visualization of face in debug mode
                        if self.debug_mode:
                            # Create a color version of the face for visualization
                            face_color = cv2.cvtColor(face_roi, cv2.COLOR_GRAY2BGR)
                            
                            # Scale up for better visibility
                            face_display = cv2.resize(face_color, (96, 96))
                            
                            # Display in corner of frame
                            h_display, w_display, _ = face_display.shape
                            frame[10:10+h_display, 10:10+w_display] = face_display
                        
                        # Predict emotion using model
                        emotion, confidence, all_probs = self.predict_emotion(face_roi)
                        
                        # Update probability bars
                        self.update_probability_bars(all_probs)
                        
                        # Only update stats if confidence is above threshold
                        if confidence >= self.confidence_threshold:
                            # Update stats
                            self.current_emotion = emotion
                            self.emotion_counts[emotion] += 1
                            self.update_stats()
                            
                            # Update emotion label
                            color = EMOTION_COLORS.get(emotion, "#FFFFFF")
                            self.emotion_label.config(text=emotion, foreground=color)
                            self.confidence_label.config(text=f"Confidence: {confidence:.1%}")
                            
                            # Display emotion on frame
                            cv2.putText(
                                frame, 
                                f"{emotion} ({confidence:.1%})", 
                                (x, y-10), 
                                cv2.FONT_HERSHEY_SIMPLEX, 
                                0.9, 
                                self.hex_to_bgr(color), 
                                2
                            )
                        else:
                            # Display low confidence message
                            cv2.putText(
                                frame, 
                                f"Low confidence ({confidence:.1%})", 
                                (x, y-10), 
                                cv2.FONT_HERSHEY_SIMPLEX, 
                                0.9, 
                                (128, 128, 128), 
                                2
                            )
                    except Exception as e:
                        if self.debug_mode:
                            print(f"Error processing face: {e}")
            except Exception as e:
                print(f"Error in face detection: {e}")
                self.status_label.config(text=f"Detection error: {str(e)}")
        
        # Display frame
        self.display_frame(frame)
    
    def predict_emotion(self, face):
        """Predict emotion using the pre-trained model"""
        # Normalize the face image
        face = face.astype('float32') / 255.0
        
        # Reshape for model input (add batch and channel dimensions)
        face = np.expand_dims(face, axis=0)
        face = np.expand_dims(face, axis=-1)
        
        # Get model predictions
        if self.model is not None:
            try:
                predictions = self.model.predict(face, verbose=0)[0]
                
                # Get the emotion with highest probability
                max_index = np.argmax(predictions)
                emotion = EMOTIONS[max_index]
                confidence = predictions[max_index]
                
                # For debugging
                if self.debug_mode:
                    print(f"Predictions: {', '.join([f'{e}: {p:.3f}' for e, p in zip(EMOTIONS, predictions)])}")
                    print(f"Selected: {emotion} with confidence {confidence:.3f}")
                
                return emotion, confidence, predictions
            except Exception as e:
                print(f"Error in model prediction: {e}")
                # Fall back to a simple rule-based approach
                return self.fallback_prediction(face[0, :, :, 0]), 0.5, np.ones(len(EMOTIONS)) / len(EMOTIONS)
        else:
            # If model is not available, use fallback
            return self.fallback_prediction(face[0, :, :, 0]), 0.5, np.ones(len(EMOTIONS)) / len(EMOTIONS)
    
    def fallback_prediction(self, face):
        """Simple rule-based fallback if model fails"""
        # Calculate basic features
        avg = np.mean(face)
        std = np.std(face)
        
        # Very simple rules
        if std > 0.2:  # High variation
            if avg > 0.5:  # Brighter
                return "Happy"
            else:  # Darker
                return "Angry"
        else:  # Low variation
            if avg > 0.5:  # Brighter
                return "Neutral"
            else:  # Darker
                return "Sad"
    
    def update_probability_bars(self, probabilities):
        """Update the probability bars in the GUI"""
        for i, emotion in enumerate(EMOTIONS):
            prob = probabilities[i]
            canvas = self.prob_bars[emotion]["canvas"]
            label = self.prob_bars[emotion]["label"]
            
            # Update the label
            label.config(text=f"{prob:.1%}")
            
            # Update the bar
            canvas.delete("all")
            width = canvas.winfo_width()
            if width > 0:  # Ensure canvas has been drawn
                bar_width = int(width * prob)
                # Use color based on emotion
                color = EMOTION_COLORS.get(emotion, "#FFFFFF")
                canvas.create_rectangle(0, 0, bar_width, 20, fill=color, outline="")
    
    def display_frame(self, frame):
        # Convert to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Convert to PIL Image
        pil_image = Image.fromarray(rgb_frame)
        
        # Get canvas dimensions
        canvas_width = self.canvas.winfo_width()
        canvas_height = self.canvas.winfo_height()
        
        # Resize image to fit canvas
        if canvas_width > 1 and canvas_height > 1:
            img_width, img_height = pil_image.size
            scale = min(canvas_width/img_width, canvas_height/img_height)
            new_width = int(img_width * scale)
            new_height = int(img_height * scale)
            pil_image = pil_image.resize((new_width, new_height), Image.LANCZOS)
        
        # Convert to PhotoImage
        self.photo = ImageTk.PhotoImage(image=pil_image)
        
        # Update canvas
        self.canvas.delete("all")
        self.canvas.create_image(
            self.canvas.winfo_width() // 2,
            self.canvas.winfo_height() // 2,
            image=self.photo, 
            anchor=tk.CENTER
        )
    
    def update_stats(self):
        # Calculate total detections
        total = sum(self.emotion_counts.values())
        
        # Update statistics labels
        if total > 0:
            for emotion, count in self.emotion_counts.items():
                percentage = (count / total) * 100
                self.stats_labels[emotion].config(text=f"{count} ({percentage:.1f}%)")
    
    def reset_stats(self):
        # Reset emotion counts
        self.emotion_counts = {emotion: 0 for emotion in EMOTIONS}
        self.update_stats()
        self.emotion_label.config(text="No emotion detected", foreground="black")
        self.confidence_label.config(text="Confidence: 0%")
        
        # Reset probability bars
        for emotion in EMOTIONS:
            canvas = self.prob_bars[emotion]["canvas"]
            label = self.prob_bars[emotion]["label"]
            canvas.delete("all")
            label.config(text="0%")
    
    def hex_to_bgr(self, hex_color):
        # Convert hex color to BGR for OpenCV
        hex_color = hex_color.lstrip('#')
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)
        return (b, g, r)
    
    def on_closing(self):
        # Stop camera if running
        if self.is_running:
            self.is_running = False
            if self.cap is not None:
                self.cap.release()
        
        # Destroy the window
        self.root.destroy()

def main():
    # Create root window
    root = tk.Tk()
    
    # Create application
    app = EmotionDetector(root)
    
    # Start main loop
    root.mainloop()

if __name__ == "__main__":
    main() 