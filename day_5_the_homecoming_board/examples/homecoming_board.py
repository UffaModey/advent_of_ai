"""
The Homecoming Board - Interactive Hand Tracking Application

This application creates an interactive virtual board that responds to hand gestures.
You can draw, erase, and control the board using hand movements and gestures.

Features:
- Draw with index finger pointing
- Erase with fist gesture
- Change colors with different finger counts
- Clear board with open hand gesture
- Save drawings with thumbs up
"""

import cv2
import numpy as np
import sys
import os
import time
import math

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from hand_tracking import HandTracker, GestureController


class HomecomingBoard:
    """Interactive drawing board controlled by hand gestures."""
    
    def __init__(self, width: int = 1280, height: int = 720):
        """
        Initialize the Homecoming Board.
        
        Args:
            width: Board width
            height: Board height
        """
        self.width = width
        self.height = height
        
        # Create drawing canvas
        self.canvas = np.zeros((height, width, 3), dtype=np.uint8)
        
        # Drawing properties
        self.current_color = (0, 255, 0)  # Green
        self.brush_size = 5
        self.is_drawing = False
        self.last_point = None
        
        # Color palette
        self.colors = {
            1: (0, 0, 255),    # Red
            2: (0, 255, 0),    # Green
            3: (255, 0, 0),    # Blue
            4: (0, 255, 255),  # Yellow
            5: (255, 0, 255),  # Magenta
        }
        
        # UI elements
        self.show_palette = True
        self.show_instructions = True
        
        # Hand tracker
        self.hand_tracker = HandTracker(max_num_hands=1)
        
        # Gesture states
        self.last_gesture = None
        self.gesture_start_time = None
        self.min_gesture_time = 0.5  # Minimum time to hold gesture for action
        
    def draw_palette(self, image: np.ndarray) -> np.ndarray:
        """Draw color palette on the image."""
        if not self.show_palette:
            return image
        
        palette_start_x = 10
        palette_start_y = 50
        color_size = 30
        
        for i, (finger_count, color) in enumerate(self.colors.items()):
            x = palette_start_x
            y = palette_start_y + i * (color_size + 10)
            
            # Draw color square
            cv2.rectangle(image, (x, y), (x + color_size, y + color_size), color, -1)
            cv2.rectangle(image, (x, y), (x + color_size, y + color_size), (255, 255, 255), 2)
            
            # Draw finger count label
            label = f"{finger_count}"
            cv2.putText(image, label, (x + color_size + 5, y + 20), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            
            # Highlight current color
            if color == self.current_color:
                cv2.rectangle(image, (x - 3, y - 3), 
                             (x + color_size + 3, y + color_size + 3), 
                             (255, 255, 255), 3)
        
        return image
    
    def draw_instructions(self, image: np.ndarray) -> np.ndarray:
        """Draw instructions on the image."""
        if not self.show_instructions:
            return image
        
        instructions = [
            "Homecoming Board Controls:",
            "Point (1 finger) - Draw",
            "Fist - Erase mode",
            "Open hand (5) - Clear board",
            "Thumbs up - Save drawing",
            "2-5 fingers - Change color",
            "Peace sign - Toggle palette"
        ]
        
        start_y = self.height - len(instructions) * 25 - 10
        
        for i, instruction in enumerate(instructions):
            y = start_y + i * 25
            # Draw background for text
            text_size = cv2.getTextSize(instruction, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)[0]
            cv2.rectangle(image, (10, y - 18), (10 + text_size[0] + 5, y + 5), 
                         (0, 0, 0), -1)
            cv2.putText(image, instruction, (12, y), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        return image
    
    def process_hand_gesture(self, landmarks: list, gesture: str) -> None:
        """Process hand gesture and update board state."""
        current_time = time.time()
        
        # Check if gesture changed
        if gesture != self.last_gesture:
            self.last_gesture = gesture
            self.gesture_start_time = current_time
            return
        
        # Check if gesture held long enough
        if current_time - self.gesture_start_time < self.min_gesture_time:
            return
        
        # Get fingertip position (index finger)
        index_tip = landmarks[self.hand_tracker.INDEX_TIP]
        
        if gesture == "point":
            # Drawing mode
            if self.last_point is not None:
                cv2.line(self.canvas, self.last_point, index_tip, 
                        self.current_color, self.brush_size)
            self.last_point = index_tip
            self.is_drawing = True
            
        elif gesture == "fist":
            # Erase mode
            cv2.circle(self.canvas, index_tip, self.brush_size * 3, (0, 0, 0), -1)
            self.last_point = index_tip
            
        elif gesture == "open_hand":
            # Clear board
            self.canvas = np.zeros((self.height, self.width, 3), dtype=np.uint8)
            self.last_point = None
            self.gesture_start_time = None  # Reset to prevent repeated clearing
            
        elif gesture == "thumbs_up":
            # Save drawing
            filename = f"homecoming_board_{int(time.time())}.jpg"
            cv2.imwrite(filename, self.canvas)
            print(f"Drawing saved as {filename}")
            self.gesture_start_time = None  # Reset to prevent repeated saving
            
        elif gesture == "peace":
            # Toggle palette
            self.show_palette = not self.show_palette
            self.gesture_start_time = None  # Reset to prevent repeated toggling
            
        elif gesture in ["two", "three", "four"]:
            # Change color based on finger count
            finger_count = self.hand_tracker.count_fingers(landmarks)
            if finger_count in self.colors:
                self.current_color = self.colors[finger_count]
                print(f"Color changed to {finger_count} fingers")
            self.gesture_start_time = None  # Reset to prevent repeated color changes
            
        else:
            # Reset drawing state for other gestures
            self.last_point = None
            self.is_drawing = False
    
    def run(self):
        """Run the Homecoming Board application."""
        # Initialize camera
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            print("Error: Could not open camera.")
            return
        
        # Set camera properties
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
        cap.set(cv2.CAP_PROP_FPS, 30)
        
        print("Homecoming Board Started!")
        print("Use hand gestures to control the board.")
        print("Press 'q' to quit, 'i' to toggle instructions, 'c' to clear board")
        
        while True:
            success, frame = cap.read()
            if not success:
                print("Error: Failed to read from camera.")
                break
            
            # Flip frame for mirror effect
            frame = cv2.flip(frame, 1)
            
            # Detect hands
            frame, hand_landmarks_list = self.hand_tracker.detect_hands(frame)
            
            # Process hand gestures
            if hand_landmarks_list:
                for hand_landmarks in hand_landmarks_list:
                    # Get pixel coordinates
                    landmarks = self.hand_tracker.get_hand_landmarks(
                        hand_landmarks, frame.shape[:2])
                    
                    # Recognize gesture
                    gesture = self.hand_tracker.recognize_gesture(landmarks)
                    
                    # Process gesture
                    self.process_hand_gesture(landmarks, gesture)
                    
                    # Draw gesture info
                    finger_count = self.hand_tracker.count_fingers(landmarks)
                    cv2.putText(frame, f"Gesture: {gesture} ({finger_count} fingers)", 
                               (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            
            # Blend canvas with camera frame
            alpha = 0.7  # Canvas opacity
            frame_with_canvas = cv2.addWeighted(frame, 1-alpha, self.canvas, alpha, 0)
            
            # Draw UI elements
            frame_with_canvas = self.draw_palette(frame_with_canvas)
            frame_with_canvas = self.draw_instructions(frame_with_canvas)
            
            # Show current brush info
            cv2.circle(frame_with_canvas, (self.width - 50, 50), self.brush_size, 
                      self.current_color, -1)
            cv2.circle(frame_with_canvas, (self.width - 50, 50), self.brush_size, 
                      (255, 255, 255), 2)
            
            # Display the frame
            cv2.imshow('Homecoming Board', frame_with_canvas)
            
            # Handle key presses
            key = cv2.waitKey(1) & 0xFF
            
            if key == ord('q'):
                break
            elif key == ord('i'):
                self.show_instructions = not self.show_instructions
            elif key == ord('c'):
                self.canvas = np.zeros((self.height, self.width, 3), dtype=np.uint8)
                print("Board cleared!")
            elif key == ord('p'):
                self.show_palette = not self.show_palette
        
        # Cleanup
        cap.release()
        cv2.destroyAllWindows()
        self.hand_tracker.cleanup()
        print("Homecoming Board ended.")


def main():
    """Main function to run the Homecoming Board."""
    board = HomecomingBoard()
    board.run()


if __name__ == "__main__":
    main()
