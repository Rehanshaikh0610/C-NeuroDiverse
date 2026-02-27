import cv2
import numpy as np
from typing import Tuple, List
from datetime import datetime
import time

class FacialEmotionDetector:
    def __init__(self):
        """Initialize cascades and webcam"""
        # Load cascades with error handling
        try:
            self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
            self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_eye.xml")
            self.mouth_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_smile.xml")
            
            # Check if cascades loaded successfully
            if self.face_cascade.empty():
                raise ValueError("Failed to load face cascade classifier")
            if self.eye_cascade.empty():
                raise ValueError("Failed to load eye cascade classifier")
            if self.mouth_cascade.empty():
                raise ValueError("Failed to load mouth cascade classifier")
                
        except Exception as e:
            print(f"Error loading cascades: {e}")
            exit(1)

        # Initialize webcam with retry logic
        self.init_webcam()

    def init_webcam(self, max_retries=3):
        """Initialize webcam with retry logic"""
        retries = 0
        while retries < max_retries:
            print(f"Attempting to open webcam (attempt {retries+1}/{max_retries})...")
            self.cap = cv2.VideoCapture(0)
            if self.cap.isOpened():
                # Test reading a frame
                ret, test_frame = self.cap.read()
                if ret:
                    print("Webcam started successfully. Press 'q' to quit.")
                    return
                else:
                    print("Could not read frame from webcam.")
            else:
                print("Could not open webcam.")
            
            # Release and retry after a short delay
            if self.cap:
                self.cap.release()
            time.sleep(1)
            retries += 1
        
        print("Failed to initialize webcam after multiple attempts.")
        print("Please ensure no other application is using the webcam and try again.")
        exit(1)

    def are_eyes_open(self, eyes: List[Tuple[int, int, int, int]]) -> bool:
        """Check if eyes are open based on detection"""
        return len(eyes) >= 2

    def get_mouth_aspect_ratio(self, mouths: List[Tuple[int, int, int, int]]) -> float:
        """Calculate Mouth Aspect Ratio"""
        if len(mouths) > 0:
            mx, my, mw, mh = mouths[0]
            return mh / mw if mw > 0 else 0.0
        return 0.0

    def detect_emotion(self, face_img, eyes_open: bool, mouth_ratio: float) -> str:
        """
        Improved emotion detection using multiple features:
        1. Facial intensity and variance
        2. Eye state (open/closed)
        3. Mouth aspect ratio
        """
        # Convert to grayscale if not already
        if len(face_img.shape) == 3:
            gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
        else:
            gray = face_img
            
        # Calculate image metrics
        avg_intensity = np.mean(gray)
        std_intensity = np.std(gray)
        
        # Emotion classification using multiple features
        if eyes_open and mouth_ratio > 0.5:
            return "Happy"
        elif not eyes_open and std_intensity < 40:
            return "Sad"
        elif mouth_ratio > 0.7:
            return "Surprised"
        elif std_intensity > 60 and avg_intensity < 90:
            return "Angry"
        else:
            return "Neutral"

    def process_frame(self, frame: np.ndarray) -> np.ndarray:
        """Process a single frame for facial detection"""
        try:
            # Flip frame for mirror effect
            frame = cv2.flip(frame, 1)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Detect faces
            faces = self.face_cascade.detectMultiScale(
                gray, 
                scaleFactor=1.3, 
                minNeighbors=5, 
                minSize=(30, 30)
            )

            for (x, y, w, h) in faces:
                # Draw face rectangle
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

                # ROI for eyes and mouth
                roi_gray = gray[y:y + h, x:x + w]
                roi_color = frame[y:y + h, x:x + w]

                # Detect eyes
                eyes = self.eye_cascade.detectMultiScale(
                    roi_gray,
                    scaleFactor=1.1,
                    minNeighbors=5,
                    minSize=(15, 15)
                )
                for (ex, ey, ew, eh) in eyes:
                    cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (255, 0, 0), 2)

                # Detect mouth
                mouths = self.mouth_cascade.detectMultiScale(
                    roi_gray,
                    scaleFactor=1.5,
                    minNeighbors=20,
                    minSize=(25, 15)
                )
                
                # Sort mouths by y-coordinate and take the lowest (most likely actual mouth)
                if len(mouths) > 0:
                    mouths = sorted(mouths, key=lambda m: m[1])[-1:]
                    mx, my, mw, mh = mouths[0]
                    cv2.rectangle(roi_color, (mx, my), (mx + mw, my + mh), (0, 0, 255), 2)

                # Analyze emotion
                eyes_open = self.are_eyes_open(eyes)
                mouth_ratio = self.get_mouth_aspect_ratio(mouths)
                emotion = self.detect_emotion(roi_gray, eyes_open, mouth_ratio)

                # Display emotion with background for better visibility
                cv2.rectangle(frame, (x, y - 40), (x + w, y), (0, 0, 0), -1)
                cv2.putText(frame, f"Emotion: {emotion}", (x + 5, y - 10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

            return frame
            
        except Exception as e:
            print(f"Error processing frame: {e}")
            return frame

    def run(self):
        """Main execution loop"""
        try:
            frame_error_count = 0
            max_frame_errors = 5
            
            while True:
                ret, frame = self.cap.read()
                if not ret:
                    frame_error_count += 1
                    print(f"Error: Could not read frame. (Error {frame_error_count}/{max_frame_errors})")
                    
                    # If we've had too many consecutive errors, exit
                    if frame_error_count >= max_frame_errors:
                        print("Too many frame errors. Exiting.")
                        break
                    
                    # Wait a bit before trying again
                    time.sleep(0.5)
                    continue
                
                # Reset error count on successful frame
                frame_error_count = 0
                
                processed_frame = self.process_frame(frame)
                cv2.imshow("Face and Emotion Detection", processed_frame)

                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

        except Exception as e:
            print(f"Error during execution: {e}")
        finally:
            self.cleanup()

    def cleanup(self):
        """Release resources"""
        if hasattr(self, 'cap') and self.cap is not None:
            self.cap.release()
        cv2.destroyAllWindows()
        print("Webcam released. Program ended.")

def main():
    detector = FacialEmotionDetector()
    detector.run()

if __name__ == "__main__":
    main()