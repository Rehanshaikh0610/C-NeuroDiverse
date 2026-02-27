"""
Simple Emotion Detection Application

This script provides a simplified GUI for emotion detection with fallback options
for when webcam access is problematic.
"""

import os
import cv2
import numpy as np
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from PIL import Image, ImageTk
import time
import random

# Define constants
IMAGE_SIZE = (48, 48)

# Emotion mapping
EMOTIONS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Emotion colors
EMOTION_COLORS = {
    'Angry': "#FF0000",      # Red
    'Disgust': "#9ACD32",    # Yellow-green
    'Fear': "#800080",       # Purple
    'Happy': "#FFD700",      # Gold
    'Sad': "#1E90FF",        # Dodger blue
    'Surprise': "#FFA500",   # Orange
    'Neutral': "#FFFFFF"     # White
}

class SimpleEmotionDetector:
    def __init__(self, root):
        self.root = root
        self.root.title("Simple Emotion Detector")
        self.root.geometry("800x600")
        
        # Initialize variables
        self.is_running = False
        self.cap = None
        self.face_cascade = None
        self.current_emotion = "No emotion detected"
        self.emotion_counts = {emotion: 0 for emotion in EMOTIONS}
        self.using_image_mode = False
        self.static_image = None
        
        # Load face cascade
        try:
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            self.face_cascade = cv2.CascadeClassifier(cascade_path)
            if self.face_cascade.empty():
                messagebox.showerror("Error", "Failed to load face cascade classifier")
        except Exception as e:
            messagebox.showerror("Error", f"Error loading face cascade: {str(e)}")
        
        # Create GUI
        self.create_gui()
    
    def create_gui(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding=10)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Left frame for video
        left_frame = ttk.Frame(main_frame)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # Video canvas
        self.canvas = tk.Canvas(left_frame, bg="black", width=400, height=300)
        self.canvas.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Right frame for controls
        right_frame = ttk.Frame(main_frame, width=200)
        right_frame.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Current emotion display
        emotion_frame = ttk.LabelFrame(right_frame, text="Current Emotion")
        emotion_frame.pack(fill=tk.X, pady=10)
        
        self.emotion_label = ttk.Label(emotion_frame, text="No emotion detected", font=("Arial", 14))
        self.emotion_label.pack(pady=5)
        
        # Statistics frame
        stats_frame = ttk.LabelFrame(right_frame, text="Statistics")
        stats_frame.pack(fill=tk.X, pady=10)
        
        self.stats_labels = {}
        for emotion in EMOTIONS:
            frame = ttk.Frame(stats_frame)
            frame.pack(fill=tk.X, pady=2)
            
            label = ttk.Label(frame, text=f"{emotion}:")
            label.pack(side=tk.LEFT)
            
            count_label = ttk.Label(frame, text="0")
            count_label.pack(side=tk.RIGHT)
            
            self.stats_labels[emotion] = count_label
        
        # Control buttons
        control_frame = ttk.Frame(right_frame)
        control_frame.pack(fill=tk.X, pady=10)
        
        self.start_button = ttk.Button(control_frame, text="Start Camera", command=self.toggle_camera)
        self.start_button.pack(side=tk.LEFT, padx=5)
        
        self.reset_button = ttk.Button(control_frame, text="Reset Stats", command=self.reset_stats)
        self.reset_button.pack(side=tk.RIGHT, padx=5)
        
        # Image mode button
        self.image_button = ttk.Button(right_frame, text="Use Image", command=self.use_image)
        self.image_button.pack(fill=tk.X, pady=5)
        
        # Status label
        self.status_label = ttk.Label(right_frame, text="Ready")
        self.status_label.pack(pady=5)
    
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
            # Start camera
            try:
                self.cap = cv2.VideoCapture(0)
                if not self.cap.isOpened():
                    raise Exception("Could not open webcam")
                
                self.is_running = True
                self.using_image_mode = False
                self.start_button.config(text="Stop Camera")
                self.status_label.config(text="Camera running")
                self.process_camera()
            except Exception as e:
                messagebox.showerror("Camera Error", 
                                    f"Could not access camera: {str(e)}\n\n"
                                    "Please try using an image instead.")
    
    def use_image(self):
        # Stop camera if running
        if self.is_running:
            self.toggle_camera()
        
        # Open file dialog
        file_path = filedialog.askopenfilename(
            title="Select an image",
            filetypes=[("Image files", "*.jpg *.jpeg *.png")]
        )
        
        if file_path:
            try:
                # Load image
                self.static_image = cv2.imread(file_path)
                if self.static_image is None:
                    raise Exception("Failed to load image")
                
                # Process image
                self.using_image_mode = True
                self.status_label.config(text=f"Using image: {os.path.basename(file_path)}")
                self.process_image(self.static_image)
            except Exception as e:
                messagebox.showerror("Error", f"Error loading image: {str(e)}")
    
    def process_camera(self):
        if not self.is_running or self.cap is None:
            return
        
        # Read frame
        ret, frame = self.cap.read()
        if not ret:
            self.status_label.config(text="Error reading from camera")
            self.is_running = False
            self.start_button.config(text="Start Camera")
            return
        
        # Process frame
        self.process_frame(frame)
        
        # Schedule next update
        self.root.after(33, self.process_camera)
    
    def process_image(self, image):
        # Process the static image
        self.process_frame(image.copy())
    
    def process_frame(self, frame):
        # Convert to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        if self.face_cascade is not None:
            faces = self.face_cascade.detectMultiScale(
                gray, 
                scaleFactor=1.1, 
                minNeighbors=5, 
                minSize=(30, 30)
            )
            
            # Process each face
            for (x, y, w, h) in faces:
                # Draw rectangle
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                
                # Extract face region
                face_roi = gray[y:y+h, x:x+w]
                
                try:
                    # Resize face
                    face_roi = cv2.resize(face_roi, IMAGE_SIZE)
                    
                    # Predict emotion
                    emotion = self.predict_emotion(face_roi)
                    
                    # Update stats
                    self.current_emotion = emotion
                    self.emotion_counts[emotion] += 1
                    self.update_stats()
                    
                    # Update emotion label
                    color = EMOTION_COLORS.get(emotion, "#FFFFFF")
                    self.emotion_label.config(text=emotion, foreground=color)
                    
                    # Display emotion on frame
                    cv2.putText(
                        frame, 
                        emotion, 
                        (x, y-10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 
                        0.9, 
                        self.hex_to_bgr(color), 
                        2
                    )
                except Exception as e:
                    print(f"Error processing face: {e}")
        
        # Display frame
        self.display_frame(frame)
    
    def predict_emotion(self, face):
        """Simple rule-based emotion prediction"""
        # Calculate features
        avg = np.mean(face)
        std = np.std(face)
        
        # Simple rules for emotion classification
        if avg > 130 and std > 40:
            return "Happy"
        elif avg < 90 and std > 40:
            return "Angry"
        elif std > 50:
            return "Surprise"
        elif avg < 100 and std < 30:
            return "Sad"
        elif avg > 110 and std < 35:
            return "Neutral"
        elif avg < 110 and std > 35:
            return "Fear"
        else:
            return "Disgust"
    
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
        # Update statistics labels
        for emotion, count in self.emotion_counts.items():
            self.stats_labels[emotion].config(text=str(count))
    
    def reset_stats(self):
        # Reset emotion counts
        self.emotion_counts = {emotion: 0 for emotion in EMOTIONS}
        self.update_stats()
        self.emotion_label.config(text="No emotion detected", foreground="black")
    
    def hex_to_bgr(self, hex_color):
        # Convert hex color to BGR for OpenCV
        hex_color = hex_color.lstrip('#')
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)
        return (b, g, r)

def main():
    # Create root window
    root = tk.Tk()
    
    # Create application
    app = SimpleEmotionDetector(root)
    
    # Start main loop
    root.mainloop()

if __name__ == "__main__":
    main() 