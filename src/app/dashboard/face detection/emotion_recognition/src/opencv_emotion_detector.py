"""
Simplified Emotion Detector using OpenCV

This script provides an emotion detection system using OpenCV's Haar cascades
and a simplified rule-based approach for emotion classification.
"""

import os
import cv2
import numpy as np
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from PIL import Image, ImageTk
import time
import threading
import random

# Define constants
IMAGE_SIZE = (48, 48)

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
        self.root.title("OpenCV Emotion Detector")
        self.root.geometry("1000x700")
        
        # Initialize variables
        self.is_running = False
        self.cap = None
        self.face_cascade = None
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
        
        # Create GUI
        self.create_gui()
        
        # Bind window close event
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
    
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
                        # Resize face for analysis
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
                        
                        # Predict emotion using OpenCV-based approach
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
        """Predict emotion using OpenCV-based features"""
        # Extract facial features
        # We'll use simple image statistics for each region of the face
        
        # Divide face into regions
        height, width = face.shape
        
        # Upper face (eyes, eyebrows)
        upper_face = face[0:height//3, :]
        
        # Middle face (nose, cheeks)
        middle_face = face[height//3:2*height//3, :]
        
        # Lower face (mouth)
        lower_face = face[2*height//3:, :]
        
        # More specific regions
        left_eye_region = face[height//8:height//3, width//4:width//2]
        right_eye_region = face[height//8:height//3, width//2:3*width//4]
        mouth_region = face[2*height//3:5*height//6, width//4:3*width//4]
        forehead_region = face[0:height//8, :]
        
        # Even more specific regions
        left_eyebrow = face[height//8:height//5, width//4:width//2]
        right_eyebrow = face[height//8:height//5, width//2:3*width//4]
        nose_region = face[height//3:2*height//3, width//3:2*width//3]
        left_cheek = face[height//3:2*height//3, width//6:width//3]
        right_cheek = face[height//3:2*height//3, 2*width//3:5*width//6]
        
        # Upper and lower mouth regions for smile detection
        upper_mouth = face[2*height//3:3*height//4, width//4:3*width//4]
        lower_mouth = face[3*height//4:5*height//6, width//4:3*width//4]
        
        # Left side and right side
        left_side = face[:, 0:width//2]
        right_side = face[:, width//2:]
        
        # Calculate statistics for each region
        upper_avg = np.mean(upper_face)
        upper_std = np.std(upper_face)
        
        middle_avg = np.mean(middle_face)
        middle_std = np.std(middle_face)
        
        lower_avg = np.mean(lower_face)
        lower_std = np.std(lower_face)
        
        left_avg = np.mean(left_side)
        right_avg = np.mean(right_side)
        
        # More specific region statistics
        mouth_avg = np.mean(mouth_region)
        mouth_std = np.std(mouth_region)
        
        left_eye_avg = np.mean(left_eye_region)
        left_eye_std = np.std(left_eye_region)
        
        right_eye_avg = np.mean(right_eye_region)
        right_eye_std = np.std(right_eye_region)
        
        forehead_avg = np.mean(forehead_region)
        forehead_std = np.std(forehead_region)
        
        # Even more specific region statistics
        left_eyebrow_avg = np.mean(left_eyebrow)
        left_eyebrow_std = np.std(left_eyebrow)
        
        right_eyebrow_avg = np.mean(right_eyebrow)
        right_eyebrow_std = np.std(right_eyebrow)
        
        nose_avg = np.mean(nose_region)
        nose_std = np.std(nose_region)
        
        left_cheek_avg = np.mean(left_cheek)
        right_cheek_avg = np.mean(right_cheek)
        
        upper_mouth_avg = np.mean(upper_mouth)
        lower_mouth_avg = np.mean(lower_mouth)
        
        # Smile detection: difference between upper and lower mouth
        mouth_diff = lower_mouth_avg - upper_mouth_avg
        
        # Overall face statistics
        overall_avg = np.mean(face)
        overall_std = np.std(face)
        
        # Calculate horizontal and vertical gradients
        sobelx = cv2.Sobel(face, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(face, cv2.CV_64F, 0, 1, ksize=3)
        
        gradient_x_avg = np.mean(np.abs(sobelx))
        gradient_y_avg = np.mean(np.abs(sobely))
        
        # Calculate gradients for specific regions
        mouth_sobelx = cv2.Sobel(mouth_region, cv2.CV_64F, 1, 0, ksize=3)
        mouth_sobely = cv2.Sobel(mouth_region, cv2.CV_64F, 0, 1, ksize=3)
        
        mouth_gradient_x = np.mean(np.abs(mouth_sobelx))
        mouth_gradient_y = np.mean(np.abs(mouth_sobely))
        
        # Calculate gradients for eyebrows (for angry detection)
        left_eyebrow_sobelx = cv2.Sobel(left_eyebrow, cv2.CV_64F, 1, 0, ksize=3)
        left_eyebrow_sobely = cv2.Sobel(left_eyebrow, cv2.CV_64F, 0, 1, ksize=3)
        
        right_eyebrow_sobelx = cv2.Sobel(right_eyebrow, cv2.CV_64F, 1, 0, ksize=3)
        right_eyebrow_sobely = cv2.Sobel(right_eyebrow, cv2.CV_64F, 0, 1, ksize=3)
        
        eyebrow_gradient_x = (np.mean(np.abs(left_eyebrow_sobelx)) + np.mean(np.abs(right_eyebrow_sobelx))) / 2
        eyebrow_gradient_y = (np.mean(np.abs(left_eyebrow_sobely)) + np.mean(np.abs(right_eyebrow_sobely))) / 2
        
        # Print debug info if enabled
        if self.debug_mode:
            print(f"Upper face: avg={upper_avg:.2f}, std={upper_std:.2f}")
            print(f"Middle face: avg={middle_avg:.2f}, std={middle_std:.2f}")
            print(f"Lower face: avg={lower_avg:.2f}, std={lower_std:.2f}")
            print(f"Left/Right: {left_avg:.2f}/{right_avg:.2f}")
            print(f"Mouth: avg={mouth_avg:.2f}, std={mouth_std:.2f}")
            print(f"Mouth diff (upper/lower): {upper_mouth_avg:.2f}/{lower_mouth_avg:.2f} = {mouth_diff:.2f}")
            print(f"Eyes: L={left_eye_avg:.2f}±{left_eye_std:.2f}, R={right_eye_avg:.2f}±{right_eye_std:.2f}")
            print(f"Eyebrows: L={left_eyebrow_avg:.2f}±{left_eyebrow_std:.2f}, R={right_eyebrow_avg:.2f}±{right_eyebrow_std:.2f}")
            print(f"Eyebrow gradients: x={eyebrow_gradient_x:.2f}, y={eyebrow_gradient_y:.2f}")
            print(f"Cheeks: L={left_cheek_avg:.2f}, R={right_cheek_avg:.2f}")
            print(f"Forehead: avg={forehead_avg:.2f}, std={forehead_std:.2f}")
            print(f"Overall: avg={overall_avg:.2f}, std={overall_std:.2f}")
            print(f"Gradients: x={gradient_x_avg:.2f}, y={gradient_y_avg:.2f}")
            print(f"Mouth gradients: x={mouth_gradient_x:.2f}, y={mouth_gradient_y:.2f}")
        
        # Initialize scores for each emotion
        scores = {emotion: 15.0 for emotion in EMOTIONS}  # Start with a higher base score
        
        # HAPPY indicators
        # 1. Positive mouth difference (lower part brighter than upper - smile)
        if mouth_diff > 10:
            scores['Happy'] += 30.0
            if self.debug_mode:
                print(f"Happy+30: Strong smile indicator (mouth diff: {mouth_diff:.2f})")
        elif mouth_diff > 5:
            scores['Happy'] += 20.0
            if self.debug_mode:
                print(f"Happy+20: Smile indicator (mouth diff: {mouth_diff:.2f})")
        
        # 2. Bright lower face (smiling)
        if lower_avg > middle_avg + 8:
            scores['Happy'] += 20.0
            if self.debug_mode:
                print(f"Happy+20: Very bright lower face ({lower_avg:.2f} > {middle_avg+8:.2f})")
        elif lower_avg > middle_avg + 5:
            scores['Happy'] += 15.0
            if self.debug_mode:
                print(f"Happy+15: Bright lower face ({lower_avg:.2f} > {middle_avg+5:.2f})")
        
        # 3. High horizontal gradient in mouth region (smile lines)
        if mouth_gradient_x > mouth_gradient_y * 1.3:
            scores['Happy'] += 25.0
            if self.debug_mode:
                print(f"Happy+25: Strong horizontal mouth gradient ({mouth_gradient_x:.2f} > {mouth_gradient_y*1.3:.2f})")
        elif mouth_gradient_x > mouth_gradient_y * 1.1:
            scores['Happy'] += 15.0
            if self.debug_mode:
                print(f"Happy+15: Horizontal mouth gradient ({mouth_gradient_x:.2f} > {mouth_gradient_y*1.1:.2f})")
        
        # 4. High variation in lower face
        if lower_std > overall_std * 1.2:
            scores['Happy'] += 15.0
            if self.debug_mode:
                print(f"Happy+15: High lower face variation ({lower_std:.2f} > {overall_std*1.2:.2f})")
        
        # 5. Bright cheeks (smiling raises cheeks)
        if (left_cheek_avg + right_cheek_avg)/2 > overall_avg + 5:
            scores['Happy'] += 15.0
            if self.debug_mode:
                print(f"Happy+15: Bright cheeks ({(left_cheek_avg + right_cheek_avg)/2:.2f} > {overall_avg+5:.2f})")
        
        # SAD indicators
        # 1. Darker lower face
        if lower_avg < middle_avg - 5:
            scores['Sad'] += 25.0
            if self.debug_mode:
                print(f"Sad+25: Very dark lower face ({lower_avg:.2f} < {middle_avg-5:.2f})")
        elif lower_avg < middle_avg - 3:
            scores['Sad'] += 15.0
            if self.debug_mode:
                print(f"Sad+15: Dark lower face ({lower_avg:.2f} < {middle_avg-3:.2f})")
        
        # 2. Negative mouth difference (upper part brighter than lower - frown)
        if mouth_diff < -5:
            scores['Sad'] += 30.0
            if self.debug_mode:
                print(f"Sad+30: Strong frown indicator (mouth diff: {mouth_diff:.2f})")
        elif mouth_diff < -2:
            scores['Sad'] += 20.0
            if self.debug_mode:
                print(f"Sad+20: Frown indicator (mouth diff: {mouth_diff:.2f})")
        
        # 3. Vertical gradient dominance (downturned mouth)
        if mouth_gradient_y > mouth_gradient_x * 1.2:
            scores['Sad'] += 25.0
            if self.debug_mode:
                print(f"Sad+25: Strong vertical mouth gradient ({mouth_gradient_y:.2f} > {mouth_gradient_x*1.2:.2f})")
        elif mouth_gradient_y > mouth_gradient_x * 1.05:
            scores['Sad'] += 15.0
            if self.debug_mode:
                print(f"Sad+15: Vertical mouth gradient ({mouth_gradient_y:.2f} > {mouth_gradient_x*1.05:.2f})")
        
        # 4. Low variation in mouth region
        if mouth_std < overall_std * 0.8:
            scores['Sad'] += 15.0
            if self.debug_mode:
                print(f"Sad+15: Low mouth variation ({mouth_std:.2f} < {overall_std*0.8:.2f})")
        
        # 5. Dark eyes
        if (left_eye_avg + right_eye_avg)/2 < overall_avg - 15:
            scores['Sad'] += 20.0
            if self.debug_mode:
                print(f"Sad+20: Very dark eye regions ({(left_eye_avg + right_eye_avg)/2:.2f} < {overall_avg-15:.2f})")
        elif (left_eye_avg + right_eye_avg)/2 < overall_avg - 10:
            scores['Sad'] += 10.0
            if self.debug_mode:
                print(f"Sad+10: Dark eye regions ({(left_eye_avg + right_eye_avg)/2:.2f} < {overall_avg-10:.2f})")
        
        # ANGRY indicators
        # 1. Darker upper face (furrowed brows)
        if upper_avg < middle_avg - 8:
            scores['Angry'] += 25.0
            if self.debug_mode:
                print(f"Angry+25: Very dark upper face ({upper_avg:.2f} < {middle_avg-8:.2f})")
        elif upper_avg < middle_avg - 5:
            scores['Angry'] += 15.0
            if self.debug_mode:
                print(f"Angry+15: Dark upper face ({upper_avg:.2f} < {middle_avg-5:.2f})")
        
        # 2. High variation in eyebrows (furrowed brows)
        if (left_eyebrow_std + right_eyebrow_std)/2 > overall_std * 1.2:
            scores['Angry'] += 25.0
            if self.debug_mode:
                print(f"Angry+25: High eyebrow variation ({(left_eyebrow_std + right_eyebrow_std)/2:.2f} > {overall_std*1.2:.2f})")
        elif (left_eyebrow_std + right_eyebrow_std)/2 > overall_std * 1.1:
            scores['Angry'] += 15.0
            if self.debug_mode:
                print(f"Angry+15: Elevated eyebrow variation ({(left_eyebrow_std + right_eyebrow_std)/2:.2f} > {overall_std*1.1:.2f})")
        
        # 3. High vertical gradient in eyebrows (furrowed brows)
        if eyebrow_gradient_y > eyebrow_gradient_x * 1.2:
            scores['Angry'] += 20.0
            if self.debug_mode:
                print(f"Angry+20: Strong vertical eyebrow gradient ({eyebrow_gradient_y:.2f} > {eyebrow_gradient_x*1.2:.2f})")
        
        # 4. Asymmetry in face
        if abs(left_avg - right_avg) > 10.0:
            scores['Angry'] += 25.0
            if self.debug_mode:
                print(f"Angry+25: Strong face asymmetry ({abs(left_avg - right_avg):.2f} > 10.0)")
        elif abs(left_avg - right_avg) > 8.0:
            scores['Angry'] += 15.0
            if self.debug_mode:
                print(f"Angry+15: Face asymmetry ({abs(left_avg - right_avg):.2f} > 8.0)")
        
        # 5. Dark eyebrows compared to forehead
        if (left_eyebrow_avg + right_eyebrow_avg)/2 < forehead_avg - 10:
            scores['Angry'] += 20.0
            if self.debug_mode:
                print(f"Angry+20: Dark eyebrows ({(left_eyebrow_avg + right_eyebrow_avg)/2:.2f} < {forehead_avg-10:.2f})")
        
        # NEUTRAL indicators
        # 1. Balanced brightness across face regions
        if abs(upper_avg - lower_avg) < 6.0:
            scores['Neutral'] += 25.0
            if self.debug_mode:
                print(f"Neutral+25: Very balanced face brightness ({abs(upper_avg - lower_avg):.2f} < 6.0)")
        elif abs(upper_avg - lower_avg) < 8.0:
            scores['Neutral'] += 15.0
            if self.debug_mode:
                print(f"Neutral+15: Balanced face brightness ({abs(upper_avg - lower_avg):.2f} < 8.0)")
        
        # 2. Small mouth difference (flat mouth)
        if abs(mouth_diff) < 3.0:
            scores['Neutral'] += 25.0
            if self.debug_mode:
                print(f"Neutral+25: Flat mouth ({abs(mouth_diff):.2f} < 3.0)")
        
        # 3. Low overall variation
        if overall_std < 40.0:
            scores['Neutral'] += 20.0
            if self.debug_mode:
                print(f"Neutral+20: Very low overall variation ({overall_std:.2f} < 40.0)")
        elif overall_std < 45.0:
            scores['Neutral'] += 10.0
            if self.debug_mode:
                print(f"Neutral+10: Low overall variation ({overall_std:.2f} < 45.0)")
        
        # 4. Low gradient values (less pronounced features)
        if gradient_x_avg < 35.0 and gradient_y_avg < 35.0:
            scores['Neutral'] += 20.0
            if self.debug_mode:
                print(f"Neutral+20: Very low gradient values (x:{gradient_x_avg:.2f}, y:{gradient_y_avg:.2f} < 35.0)")
        elif gradient_x_avg < 40.0 and gradient_y_avg < 40.0:
            scores['Neutral'] += 10.0
            if self.debug_mode:
                print(f"Neutral+10: Low gradient values (x:{gradient_x_avg:.2f}, y:{gradient_y_avg:.2f} < 40.0)")
        
        # 5. Similar left/right sides
        if abs(left_avg - right_avg) < 4.0:
            scores['Neutral'] += 20.0
            if self.debug_mode:
                print(f"Neutral+20: Very symmetric face ({abs(left_avg - right_avg):.2f} < 4.0)")
        elif abs(left_avg - right_avg) < 6.0:
            scores['Neutral'] += 10.0
            if self.debug_mode:
                print(f"Neutral+10: Symmetric face ({abs(left_avg - right_avg):.2f} < 6.0)")
        
        # Add a small amount of randomness to prevent getting stuck
        for emotion in EMOTIONS:
            scores[emotion] += random.uniform(0, 2.0)
        
        # Apply penalties to prevent one emotion from dominating
        max_emotion = max(scores, key=scores.get)
        max_score = scores[max_emotion]
        
        # If one emotion is much stronger than others, slightly reduce its dominance
        for emotion in EMOTIONS:
            if emotion != max_emotion and max_score > scores[emotion] * 2:
                scores[max_emotion] *= 0.9
                if self.debug_mode:
                    print(f"Applied 10% penalty to dominant emotion {max_emotion}")
                break
        
        # Find the emotion with the highest score (after potential penalty)
        max_emotion = max(scores, key=scores.get)
        max_score = scores[max_emotion]
        
        # Calculate confidence (normalize scores)
        total_score = sum(scores.values())
        confidence = max_score / total_score
        
        # Convert scores to probabilities
        probabilities = np.array([scores[emotion] / total_score for emotion in EMOTIONS])
        
        # Debug output
        if self.debug_mode:
            print("Emotion scores:")
            for emotion, score in scores.items():
                print(f"  {emotion}: {score:.2f} ({score/total_score:.2%})")
            print(f"Selected: {max_emotion} with confidence {confidence:.2%}")
        
        return max_emotion, confidence, probabilities
    
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