"""
Webcam-based Emotion Detector

This script provides a robust GUI for real-time emotion detection using your webcam.
It includes improved face detection and expression recognition.
"""

import os
import cv2
import numpy as np
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from PIL import Image, ImageTk
import time
import threading

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

class WebcamEmotionDetector:
    def __init__(self, root):
        self.root = root
        self.root.title("Webcam Emotion Detector")
        self.root.geometry("900x600")
        
        # Initialize variables
        self.is_running = False
        self.cap = None
        self.face_cascade = None
        self.current_emotion = "No emotion detected"
        self.emotion_counts = {emotion: 0 for emotion in EMOTIONS}
        self.frame_count = 0
        self.last_time = time.time()
        self.fps = 0
        self.debug_mode = False  # Debug mode flag
        
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
        
        # Right frame for controls
        right_frame = ttk.Frame(main_frame, width=250)
        right_frame.pack(side=tk.RIGHT, fill=tk.Y)
        right_frame.pack_propagate(False)
        
        # Current emotion display
        emotion_frame = ttk.LabelFrame(right_frame, text="Current Emotion")
        emotion_frame.pack(fill=tk.X, pady=10)
        
        self.emotion_label = ttk.Label(emotion_frame, text="No emotion detected", font=("Arial", 16))
        self.emotion_label.pack(pady=10)
        
        # FPS display
        self.fps_label = ttk.Label(right_frame, text="FPS: 0.0")
        self.fps_label.pack(pady=5)
        
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
        
        # Sensitivity slider
        sensitivity_frame = ttk.LabelFrame(right_frame, text="Detection Sensitivity")
        sensitivity_frame.pack(fill=tk.X, pady=10)
        
        self.sensitivity = tk.DoubleVar(value=1.1)
        sensitivity_slider = ttk.Scale(sensitivity_frame, from_=1.05, to=1.4, 
                                      orient=tk.HORIZONTAL, variable=self.sensitivity)
        sensitivity_slider.pack(fill=tk.X, padx=10, pady=5)
        
        # Min neighbors slider
        neighbors_frame = ttk.LabelFrame(right_frame, text="Detection Precision")
        neighbors_frame.pack(fill=tk.X, pady=10)
        
        self.min_neighbors = tk.IntVar(value=5)
        neighbors_slider = ttk.Scale(neighbors_frame, from_=3, to=10, 
                                    orient=tk.HORIZONTAL, variable=self.min_neighbors)
        neighbors_slider.pack(fill=tk.X, padx=10, pady=5)
        
        # Debug mode checkbox
        debug_frame = ttk.Frame(right_frame)
        debug_frame.pack(fill=tk.X, pady=5)
        
        self.debug_var = tk.BooleanVar(value=False)
        debug_check = ttk.Checkbutton(debug_frame, text="Debug Mode", 
                                     variable=self.debug_var, 
                                     command=self.toggle_debug)
        debug_check.pack(side=tk.LEFT, padx=5)
        
        # Status label
        self.status_label = ttk.Label(right_frame, text="Ready - Press 'Start Camera'")
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
        
        # Detect faces with adjusted parameters based on sensitivity
        # Ensure scaleFactor is always > 1.0
        scale_factor = max(1.05, self.sensitivity.get())
        min_neighbors = self.min_neighbors.get()
        
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
                        # Resize face
                        face_roi = cv2.resize(face_roi, IMAGE_SIZE)
                        
                        # Add visualization of face regions in debug mode
                        if self.debug_mode:
                            # Create a color version of the face for visualization
                            face_color = cv2.cvtColor(face_roi, cv2.COLOR_GRAY2BGR)
                            height, width = face_roi.shape
                            
                            # Draw line separating upper and lower halves
                            cv2.line(face_color, (0, height//2), (width, height//2), (0, 255, 0), 1)
                            
                            # Draw line separating eye and mouth regions
                            cv2.line(face_color, (0, height//3), (width, height//3), (255, 0, 0), 1)
                            cv2.line(face_color, (0, 2*height//3), (width, 2*height//3), (255, 0, 0), 1)
                            
                            # Scale up for better visibility
                            face_display = cv2.resize(face_color, (width*4, height*4))
                            
                            # Display in corner of frame
                            h_display, w_display, _ = face_display.shape
                            frame[10:10+h_display, 10:10+w_display] = face_display
                        
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
                        if self.debug_mode:
                            print(f"Error processing face: {e}")
            except Exception as e:
                print(f"Error in face detection: {e}")
                self.status_label.config(text=f"Detection error: {str(e)}")
        
        # Display frame
        self.display_frame(frame)
    
    def predict_emotion(self, face):
        """Simplified emotion prediction focusing on Happy, Sad, Neutral, and Angry"""
        # Calculate basic features
        avg = np.mean(face)
        std = np.std(face)
        
        # Calculate regional features
        height, width = face.shape
        
        # Upper half (eyes region)
        upper_half = face[:height//2, :]
        upper_avg = np.mean(upper_half)
        upper_std = np.std(upper_half)
        
        # Lower half (mouth region)
        lower_half = face[height//2:, :]
        lower_avg = np.mean(lower_half)
        lower_std = np.std(lower_half)
        
        # Left and right sides for asymmetry
        left_half = face[:, :width//2]
        right_half = face[:, width//2:]
        left_avg = np.mean(left_half)
        right_avg = np.mean(right_half)
        asymmetry = abs(left_avg - right_avg)
        
        # Eye regions (top 1/3)
        eye_region = face[:height//3, :]
        eye_avg = np.mean(eye_region)
        eye_std = np.std(eye_region)
        
        # Mouth region (bottom 1/3)
        mouth_region = face[2*height//3:, :]
        mouth_avg = np.mean(mouth_region)
        mouth_std = np.std(mouth_region)
        
        # Difference between upper and lower halves
        upper_lower_diff = abs(upper_avg - lower_avg)
        
        # Calculate gradients
        h_gradient = np.mean(np.abs(np.diff(face, axis=1)))
        v_gradient = np.mean(np.abs(np.diff(face, axis=0)))
        
        # Calculate Laplacian for edge detection
        laplacian = cv2.Laplacian(face, cv2.CV_64F)
        lap_std = np.std(laplacian)
        
        # Print debug info if debug mode is on
        if self.debug_mode:
            print(f"Avg: {avg:.1f}, Std: {std:.1f}, Lap: {lap_std:.1f}")
            print(f"Upper: {upper_avg:.1f}/{upper_std:.1f}, Lower: {lower_avg:.1f}/{lower_std:.1f}, Diff: {upper_lower_diff:.1f}")
            print(f"Eyes: {eye_avg:.1f}/{eye_std:.1f}, Mouth: {mouth_avg:.1f}/{mouth_std:.1f}")
            print(f"Asymmetry: {asymmetry:.1f}, H-grad: {h_gradient:.1f}, V-grad: {v_gradient:.1f}")
        
        # Initialize scores for the four emotions
        scores = {
            "Happy": 0,
            "Sad": 0,
            "Angry": 0,
            "Neutral": 0
        }
        
        # HAPPY - Focused on smile detection
        # Key indicators: brighter lower face, high contrast in mouth area
        if lower_avg > upper_avg + 2:  # Brighter lower face (smile)
            scores["Happy"] += 30
        if mouth_std > 30:  # High variation in mouth (teeth showing)
            scores["Happy"] += 25
        if mouth_avg > eye_avg + 3:  # Brighter mouth area
            scores["Happy"] += 20
        
        # SAD - Focused on drooping features and darker appearance
        # Key indicators: darker image, less variation in lower face, drooping features
        if avg < 110:  # Overall darker image
            scores["Sad"] += 15
        if upper_std > lower_std + 3:  # Less movement in lower face
            scores["Sad"] += 25
        if mouth_avg < eye_avg - 2:  # Drooping mouth
            scores["Sad"] += 30
        if v_gradient < 5:  # Less vertical definition
            scores["Sad"] += 15
        
        # ANGRY - Focused on furrowed brows and tense features
        # Key indicators: high eye region variation, horizontal lines, darker upper face
        if eye_std > 25:  # Variation in eye area (furrowed brows)
            scores["Angry"] += 25
        if h_gradient > 6:  # Horizontal lines (frown)
            scores["Angry"] += 20
        if upper_avg < lower_avg - 3:  # Darker upper face
            scores["Angry"] += 25
        if asymmetry > 4:  # Facial asymmetry
            scores["Angry"] += 15
        
        # NEUTRAL - Focused on balanced features and low variation
        # Key indicators: balanced features, low variation, minimal gradients
        if std < 30:  # Low overall variation
            scores["Neutral"] += 25
        if abs(upper_std - lower_std) < 5:  # Similar variation in upper and lower face
            scores["Neutral"] += 20
        if abs(upper_avg - lower_avg) < 5:  # Similar brightness in upper and lower face
            scores["Neutral"] += 20
        if h_gradient < 5 and v_gradient < 5:  # Low gradients (few strong edges)
            scores["Neutral"] += 25
        if asymmetry < 3:  # Low asymmetry
            scores["Neutral"] += 15
        
        # Apply a baseline to ensure all emotions have a minimum score
        for emotion in scores:
            scores[emotion] = max(scores[emotion], 10)
        
        # Return the emotion with the highest score
        max_emotion = max(scores, key=scores.get)
        max_score = scores[max_emotion]
        
        if self.debug_mode:
            print(f"Scores: {', '.join([f'{e}: {s:.1f}' for e, s in scores.items()])}")
            print(f"Selected: {max_emotion} with score {max_score:.1f}")
        
        return max_emotion
    
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

    def toggle_debug(self):
        """Toggle debug mode on/off"""
        self.debug_mode = self.debug_var.get()
        if self.debug_mode:
            self.status_label.config(text="Debug mode ON")
        else:
            self.status_label.config(text="Debug mode OFF")

def main():
    # Create root window
    root = tk.Tk()
    
    # Create application
    app = WebcamEmotionDetector(root)
    
    # Start main loop
    root.mainloop()

if __name__ == "__main__":
    main() 