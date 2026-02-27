"""
GUI Application for Emotion Detection

This script:
1. Creates a GUI using Tkinter
2. Accesses the webcam using OpenCV
3. Detects faces and emotions in real-time
4. Displays the results in the GUI
"""

import os
import numpy as np
import cv2
import time
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from PIL import Image, ImageTk
import threading
import queue
import random
from collections import deque

# Define constants
IMAGE_SIZE = (48, 48)

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

# Emotion colors (BGR format for OpenCV, RGB for Tkinter)
EMOTION_COLORS = {
    'Angry': "#FF0000",      # Red
    'Disgust': "#9ACD32",    # Yellow-green
    'Fear': "#800080",       # Purple
    'Happy': "#FFD700",      # Gold
    'Sad': "#1E90FF",        # Dodger blue
    'Surprise': "#FFA500",   # Orange
    'Neutral': "#FFFFFF"     # White
}

class EmotionDetectionApp:
    def __init__(self, root):
        """
        Initialize the GUI application
        
        Args:
            root (tk.Tk): The root Tkinter window
        """
        self.root = root
        self.root.title("Emotion Detection")
        self.root.geometry("1000x600")
        self.root.configure(bg="#f0f0f0")
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
        
        # Initialize variables
        self.is_running = False
        self.cap = None
        self.face_cascade = None
        self.current_emotion = "No emotion detected"
        self.emotion_history = deque(maxlen=100)
        self.emotion_counts = {emotion: 0 for emotion in EMOTIONS.values()}
        self.fps_history = deque(maxlen=30)
        self.last_frame_time = time.time()
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
        
        # Create GUI components
        self.create_widgets()
        
        # Initialize FPS calculation
        self.prev_frame_time = 0
        self.new_frame_time = 0
        
        # Update the GUI
        self.update_gui()
    
    def create_widgets(self):
        """
        Set up the GUI components
        """
        # Main frame
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Left frame for video feed
        left_frame = ttk.Frame(main_frame)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # Video canvas
        self.canvas = tk.Canvas(left_frame, bg="black")
        self.canvas.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Right frame for controls and stats
        right_frame = ttk.Frame(main_frame, width=300)
        right_frame.pack(side=tk.RIGHT, fill=tk.Y, padx=10)
        right_frame.pack_propagate(False)
        
        # Current emotion display
        emotion_frame = ttk.LabelFrame(right_frame, text="Current Emotion")
        emotion_frame.pack(fill=tk.X, pady=10)
        
        self.emotion_label = ttk.Label(emotion_frame, text="No emotion detected", font=("Arial", 16))
        self.emotion_label.pack(pady=10)
        
        self.confidence_label = ttk.Label(emotion_frame, text="Confidence: 0%")
        self.confidence_label.pack(pady=5)
        
        # FPS display
        self.fps_label = ttk.Label(right_frame, text="FPS: 0")
        self.fps_label.pack(pady=5)
        
        # Statistics frame
        stats_frame = ttk.LabelFrame(right_frame, text="Emotion Statistics")
        stats_frame.pack(fill=tk.X, pady=10)
        
        self.stats_labels = {}
        for emotion in EMOTIONS.values():
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
        
        self.start_button = ttk.Button(control_frame, text="Start Detection", command=self.toggle_detection)
        self.start_button.pack(side=tk.LEFT, padx=5)
        
        self.reset_button = ttk.Button(control_frame, text="Reset Stats", command=self.reset_stats)
        self.reset_button.pack(side=tk.RIGHT, padx=5)
        
        # Image mode button
        self.image_button = ttk.Button(right_frame, text="Use Static Image", command=self.toggle_image_mode)
        self.image_button.pack(fill=tk.X, pady=5)
    
    def update_gui(self):
        """
        Update the GUI components
        """
        # We don't need to check the queue since we're updating directly in process_frame
        # Just schedule the next update
        self.root.after(100, self.update_gui)
    
    def reset_stats(self):
        """
        Reset the emotion statistics
        """
        self.emotion_counts = {emotion: 0 for emotion in EMOTIONS.values()}
        self.emotion_history.clear()
        self.update_stats()
    
    def toggle_image_mode(self):
        if self.is_running:
            self.toggle_detection()  # Stop detection first
        
        if not self.using_image_mode:
            # Switch to image mode
            file_path = filedialog.askopenfilename(
                title="Select an image",
                filetypes=[("Image files", "*.jpg *.jpeg *.png")]
            )
            
            if file_path:
                try:
                    self.static_image = cv2.imread(file_path)
                    if self.static_image is None:
                        raise Exception("Failed to load image")
                    
                    self.using_image_mode = True
                    self.image_button.config(text="Use Webcam")
                    messagebox.showinfo("Success", "Switched to static image mode")
                    
                    # Display the image
                    self.display_frame(self.static_image)
                except Exception as e:
                    messagebox.showerror("Error", f"Error loading image: {str(e)}")
        else:
            # Switch back to webcam mode
            self.using_image_mode = False
            self.static_image = None
            self.image_button.config(text="Use Static Image")
            messagebox.showinfo("Success", "Switched to webcam mode")
            
            # Clear the canvas
            self.canvas.delete("all")
    
    def toggle_detection(self):
        if self.is_running:
            # Stop detection
            self.is_running = False
            if self.cap is not None and not self.using_image_mode:
                self.cap.release()
                self.cap = None
            self.start_button.config(text="Start Detection")
        else:
            # Start detection
            if self.using_image_mode and self.static_image is not None:
                self.is_running = True
                self.start_button.config(text="Stop Detection")
                self.process_static_image()
            else:
                # Try to initialize webcam
                try:
                    self.cap = cv2.VideoCapture(0)
                    if not self.cap.isOpened():
                        raise Exception("Could not open webcam")
                    
                    self.is_running = True
                    self.start_button.config(text="Stop Detection")
                    self.update_frame()
                except Exception as e:
                    messagebox.showerror("Webcam Error", 
                                         f"Could not access webcam: {str(e)}\n\n"
                                         "Please try:\n"
                                         "1. Ensuring your webcam is connected and enabled\n"
                                         "2. Closing other applications that might be using the webcam\n"
                                         "3. Using the 'Use Static Image' option instead")
    
    def process_static_image(self):
        if not self.is_running or self.static_image is None:
            return
        
        # Process the static image repeatedly to simulate video
        frame = self.static_image.copy()
        self.process_frame(frame)
        
        # Schedule the next update
        if self.is_running:
            self.root.after(33, self.process_static_image)  # ~30 FPS
    
    def update_frame(self):
        if not self.is_running or self.cap is None:
            return
        
        # Calculate FPS
        current_time = time.time()
        fps = 1 / (current_time - self.last_frame_time)
        self.last_frame_time = current_time
        self.fps_history.append(fps)
        avg_fps = sum(self.fps_history) / len(self.fps_history)
        self.fps_label.config(text=f"FPS: {avg_fps:.1f}")
        
        # Read frame from webcam
        ret, frame = self.cap.read()
        if not ret:
            # Try to reconnect to the webcam
            self.cap.release()
            self.cap = cv2.VideoCapture(0)
            ret, frame = self.cap.read()
            if not ret:
                self.is_running = False
                self.start_button.config(text="Start Detection")
                messagebox.showerror("Error", "Failed to read from webcam. Try using static image mode.")
                return
        
        self.process_frame(frame)
        
        # Schedule the next update
        if self.is_running:
            self.root.after(10, self.update_frame)
    
    def process_frame(self, frame):
        # Convert to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        if self.face_cascade is not None:
            faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
            
            for (x, y, w, h) in faces:
                # Draw rectangle around face
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                
                # Extract face region
                face_roi = gray[y:y+h, x:x+w]
                
                # Resize to model input size
                try:
                    face_roi = cv2.resize(face_roi, IMAGE_SIZE)
                    
                    # Predict emotion (using enhanced rule-based approach for demo)
                    emotion, confidence = self.predict_emotion(face_roi)
                    
                    # Update current emotion
                    self.current_emotion = emotion
                    self.emotion_history.append(emotion)
                    self.emotion_counts[emotion] += 1
                    
                    # Update emotion label
                    self.emotion_label.config(text=emotion)
                    self.confidence_label.config(text=f"Confidence: {confidence:.1f}%")
                    
                    # Display emotion text
                    cv2.putText(frame, emotion, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 
                                0.9, self.get_emotion_color(emotion), 2)
                    
                    # Update statistics
                    self.update_stats()
                except Exception as e:
                    print(f"Error processing face: {str(e)}")
        
        # Display the frame
        self.display_frame(frame)
    
    def predict_emotion(self, face_image):
        """
        Enhanced rule-based emotion classification for demo purposes.
        In a real application, this would use a trained model.
        """
        # Calculate image statistics
        avg_intensity = np.mean(face_image)
        std_intensity = np.std(face_image)
        
        # Calculate additional features
        # Horizontal gradient (left-right differences)
        h_gradient = np.mean(np.abs(np.diff(face_image, axis=1)))
        # Vertical gradient (top-bottom differences)
        v_gradient = np.mean(np.abs(np.diff(face_image, axis=0)))
        
        # Calculate regional features
        height, width = face_image.shape
        
        # Upper half (eyes region)
        upper_half = face_image[:height//2, :]
        upper_avg = np.mean(upper_half)
        upper_std = np.std(upper_half)
        
        # Lower half (mouth region)
        lower_half = face_image[height//2:, :]
        lower_avg = np.mean(lower_half)
        lower_std = np.std(lower_half)
        
        # Center region (nose and inner features)
        center_region = face_image[height//4:3*height//4, width//4:3*width//4]
        center_avg = np.mean(center_region)
        center_std = np.std(center_region)
        
        # Difference between upper and lower halves (important for expressions)
        upper_lower_diff = abs(upper_avg - lower_avg)
        
        # Enhanced rule-based classification with more nuanced thresholds
        
        # Happy detection - typically bright in lower half (smile), high contrast
        if lower_std > 45 and lower_avg > upper_avg and v_gradient > 10:
            emotion = "Happy"
            confidence = 70 + random.uniform(-10, 10)
        
        # Surprise detection - high overall contrast, open mouth and eyes
        elif std_intensity > 55 and upper_lower_diff > 15 and v_gradient > 12:
            emotion = "Surprise"
            confidence = 65 + random.uniform(-10, 10)
        
        # Angry detection - darker upper region (furrowed brows), high contrast
        elif upper_std > 40 and upper_avg < lower_avg and h_gradient > 8:
            emotion = "Angry"
            confidence = 60 + random.uniform(-15, 10)
        
        # Sad detection - lower contrast in lower half, darker overall
        elif lower_std < 35 and avg_intensity < 100 and upper_std > lower_std:
            emotion = "Sad"
            confidence = 55 + random.uniform(-10, 15)
        
        # Fear detection - high contrast overall, similar to surprise but darker
        elif std_intensity > 45 and avg_intensity < 110 and v_gradient > 10:
            emotion = "Fear"
            confidence = 50 + random.uniform(-15, 15)
        
        # Disgust detection - asymmetry and medium brightness
        elif h_gradient > 10 and 90 < avg_intensity < 130 and upper_std > 40:
            emotion = "Disgust"
            confidence = 55 + random.uniform(-15, 10)
        
        # Neutral detection - low overall variation, balanced features
        elif std_intensity < 40 and abs(upper_std - lower_std) < 10 and h_gradient < 8:
            emotion = "Neutral"
            confidence = 75 + random.uniform(-10, 5)
        
        # Default case - if no clear pattern is detected
        else:
            # Determine the most likely emotion based on the features
            if avg_intensity > 120:
                emotion = "Happy"
                confidence = 45 + random.uniform(-15, 15)
            elif avg_intensity < 90:
                emotion = "Sad"
                confidence = 45 + random.uniform(-15, 15)
            elif std_intensity > 45:
                emotion = "Surprise"
                confidence = 40 + random.uniform(-15, 15)
            else:
                emotion = "Neutral"
                confidence = 50 + random.uniform(-15, 10)
        
        # Print debug info to help with tuning
        print(f"Emotion: {emotion}, Confidence: {confidence:.1f}%")
        print(f"Avg: {avg_intensity:.1f}, Std: {std_intensity:.1f}, H-grad: {h_gradient:.1f}, V-grad: {v_gradient:.1f}")
        print(f"Upper: {upper_avg:.1f}/{upper_std:.1f}, Lower: {lower_avg:.1f}/{lower_std:.1f}, Diff: {upper_lower_diff:.1f}")
        print("-" * 50)
        
        return emotion, confidence
    
    def get_emotion_color(self, emotion):
        """Convert emotion color from hex to BGR for OpenCV"""
        hex_color = EMOTION_COLORS.get(emotion, "#FFFFFF")
        # Convert hex to RGB
        r = int(hex_color[1:3], 16)
        g = int(hex_color[3:5], 16)
        b = int(hex_color[5:7], 16)
        # Return as BGR for OpenCV
        return (b, g, r)
    
    def display_frame(self, frame):
        # Convert frame to RGB for tkinter
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Convert to PIL Image
        pil_image = Image.fromarray(rgb_frame)
        
        # Resize to fit canvas while maintaining aspect ratio
        canvas_width = self.canvas.winfo_width()
        canvas_height = self.canvas.winfo_height()
        
        if canvas_width > 1 and canvas_height > 1:  # Ensure canvas has been drawn
            img_width, img_height = pil_image.size
            
            # Calculate scaling factor
            scale = min(canvas_width/img_width, canvas_height/img_height)
            
            # Resize image
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
            image=self.photo, anchor=tk.CENTER
        )
    
    def update_stats(self):
        total = sum(self.emotion_counts.values())
        if total > 0:
            for emotion, count in self.emotion_counts.items():
                percentage = (count / total) * 100
                self.stats_labels[emotion].config(text=f"{count} ({percentage:.1f}%)")
    
    def on_closing(self):
        """
        Handle window closing event
        """
        if self.is_running:
            self.toggle_detection()
        
        self.root.destroy()

def main():
    """
    Main function to run the GUI application
    """
    try:
        # Create the root window
        root = tk.Tk()
        
        # Create the application
        app = EmotionDetectionApp(root)
        
        # Start the main loop
        root.mainloop()
    
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 