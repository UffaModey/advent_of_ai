"""
Advanced Gesture Recognition Example

This script demonstrates advanced gesture recognition including:
- Custom gesture patterns
- Hand orientation detection
- Gesture stability filtering
- Multi-hand gesture combinations
"""

import cv2
import numpy as np
import sys
import os
import time
import math

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from hand_tracking import HandTracker


class AdvancedGestureRecognizer:
    """Advanced gesture recognition with custom patterns."""
    
    def __init__(self):
        self.hand_tracker = HandTracker(max_num_hands=2)
        
        # Gesture history for stability
        self.gesture_history = []
        self.history_size = 10
        
        # Custom gesture patterns
        self.gesture_patterns = {
            'swipe_right': self.detect_swipe_right,
            'swipe_left': self.detect_swipe_left,
            'pinch': self.detect_pinch,
            'spread': self.detect_spread,
            'wave': self.detect_wave,
            'circle': self.detect_circle,
            'ok_sign': self.detect_ok_sign,
            'rock_on': self.detect_rock_on,
        }
        
        # Tracking variables
        self.hand_positions_history = []
        self.position_history_size = 30
        
    def get_hand_orientation(self, landmarks: list) -> str:
        """Determine hand orientation (palm up/down)."""
        wrist = landmarks[0]
        middle_mcp = landmarks[9]
        
        # If middle MCP is above wrist, palm is likely facing up
        if middle_mcp[1] < wrist[1]:
            return "palm_up"
        else:
            return "palm_down"
    
    def calculate_hand_velocity(self, landmarks: list) -> tuple:
        """Calculate hand movement velocity."""
        if len(self.hand_positions_history) < 2:
            return (0, 0)
        
        current_center = self.get_hand_center(landmarks)
        prev_center = self.hand_positions_history[-1]
        
        velocity_x = current_center[0] - prev_center[0]
        velocity_y = current_center[1] - prev_center[1]
        
        return (velocity_x, velocity_y)
    
    def get_hand_center(self, landmarks: list) -> tuple:
        """Get center point of hand."""
        x_coords = [point[0] for point in landmarks]
        y_coords = [point[1] for point in landmarks]
        return (sum(x_coords) // len(x_coords), sum(y_coords) // len(y_coords))
    
    def detect_swipe_right(self, landmarks: list) -> bool:
        """Detect right swipe gesture."""
        velocity = self.calculate_hand_velocity(landmarks)
        return velocity[0] > 20 and abs(velocity[1]) < 10
    
    def detect_swipe_left(self, landmarks: list) -> bool:
        """Detect left swipe gesture."""
        velocity = self.calculate_hand_velocity(landmarks)
        return velocity[0] < -20 and abs(velocity[1]) < 10
    
    def detect_pinch(self, landmarks: list) -> bool:
        """Detect pinch gesture (thumb and index finger close)."""
        thumb_tip = landmarks[4]
        index_tip = landmarks[8]
        distance = math.sqrt((thumb_tip[0] - index_tip[0])**2 + (thumb_tip[1] - index_tip[1])**2)
        return distance < 30
    
    def detect_spread(self, landmarks: list) -> bool:
        """Detect spread gesture (fingers spread wide)."""
        # Calculate distances between adjacent fingertips
        fingertips = [landmarks[4], landmarks[8], landmarks[12], landmarks[16], landmarks[20]]
        total_spread = 0
        
        for i in range(len(fingertips) - 1):
            dist = math.sqrt((fingertips[i][0] - fingertips[i+1][0])**2 + 
                           (fingertips[i][1] - fingertips[i+1][1])**2)
            total_spread += dist
        
        return total_spread > 300
    
    def detect_wave(self, landmarks: list) -> bool:
        """Detect waving gesture (hand moving side to side)."""
        if len(self.hand_positions_history) < 20:
            return False
        
        # Check for oscillating motion
        x_positions = [pos[0] for pos in self.hand_positions_history[-20:]]
        velocity_changes = 0
        
        for i in range(1, len(x_positions) - 1):
            if ((x_positions[i] > x_positions[i-1] and x_positions[i] > x_positions[i+1]) or
                (x_positions[i] < x_positions[i-1] and x_positions[i] < x_positions[i+1])):
                velocity_changes += 1
        
        return velocity_changes > 3
    
    def detect_circle(self, landmarks: list) -> bool:
        """Detect circular motion gesture."""
        if len(self.hand_positions_history) < 15:
            return False
        
        # Simple circular motion detection
        positions = self.hand_positions_history[-15:]
        center_x = sum(pos[0] for pos in positions) / len(positions)
        center_y = sum(pos[1] for pos in positions) / len(positions)
        
        # Check if points roughly form a circle
        radii = []
        for pos in positions:
            radius = math.sqrt((pos[0] - center_x)**2 + (pos[1] - center_y)**2)
            radii.append(radius)
        
        # If radii are relatively consistent, it might be circular
        if radii:
            avg_radius = sum(radii) / len(radii)
            variance = sum((r - avg_radius)**2 for r in radii) / len(radii)
            return variance < 1000 and avg_radius > 30
        
        return False
    
    def detect_ok_sign(self, landmarks: list) -> bool:
        """Detect OK sign (thumb and index finger forming circle)."""
        thumb_tip = landmarks[4]
        index_tip = landmarks[8]
        thumb_ip = landmarks[3]
        index_pip = landmarks[6]
        
        # Check if thumb tip and index tip are close (forming circle)
        tip_distance = math.sqrt((thumb_tip[0] - index_tip[0])**2 + (thumb_tip[1] - index_tip[1])**2)
        
        # Check if other fingers are extended
        middle_up = landmarks[12][1] < landmarks[10][1]
        ring_up = landmarks[16][1] < landmarks[14][1]
        pinky_up = landmarks[20][1] < landmarks[18][1]
        
        return tip_distance < 30 and middle_up and ring_up and pinky_up
    
    def detect_rock_on(self, landmarks: list) -> bool:
        """Detect rock on sign (index and pinky up, middle and ring down)."""
        index_up = landmarks[8][1] < landmarks[6][1]
        middle_down = landmarks[12][1] > landmarks[10][1]
        ring_down = landmarks[16][1] > landmarks[14][1]
        pinky_up = landmarks[20][1] < landmarks[18][1]
        
        return index_up and middle_down and ring_down and pinky_up
    
    def recognize_advanced_gestures(self, landmarks: list) -> list:
        """Recognize all advanced gestures."""
        detected_gestures = []
        
        # Update position history
        center = self.get_hand_center(landmarks)
        self.hand_positions_history.append(center)
        if len(self.hand_positions_history) > self.position_history_size:
            self.hand_positions_history.pop(0)
        
        # Check each gesture pattern
        for gesture_name, detector in self.gesture_patterns.items():
            if detector(landmarks):
                detected_gestures.append(gesture_name)
        
        return detected_gestures
    
    def draw_advanced_info(self, image: np.ndarray, landmarks: list, hand_label: str) -> np.ndarray:
        """Draw advanced gesture information."""
        # Get basic info
        finger_count = self.hand_tracker.count_fingers(landmarks)
        basic_gesture = self.hand_tracker.recognize_gesture(landmarks)
        orientation = self.get_hand_orientation(landmarks)
        velocity = self.calculate_hand_velocity(landmarks)
        advanced_gestures = self.recognize_advanced_gestures(landmarks)
        
        # Draw bounding box
        bbox = self.hand_tracker.get_bounding_box(landmarks)
        cv2.rectangle(image, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (0, 255, 0), 2)
        
        # Draw information
        info_lines = [
            f"{hand_label}: {basic_gesture}",
            f"Fingers: {finger_count}",
            f"Orientation: {orientation}",
            f"Velocity: ({velocity[0]:.1f}, {velocity[1]:.1f})",
        ]
        
        if advanced_gestures:
            info_lines.append(f"Advanced: {', '.join(advanced_gestures)}")
        
        # Position text
        text_y = bbox[1] - 10
        for i, line in enumerate(reversed(info_lines)):
            y_pos = text_y - i * 20
            if y_pos > 20:
                # Draw background
                text_size = cv2.getTextSize(line, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)[0]
                cv2.rectangle(image, (bbox[0], y_pos - 15), 
                             (bbox[0] + text_size[0] + 5, y_pos + 5), (0, 0, 0), -1)
                # Draw text
                cv2.putText(image, line, (bbox[0] + 2, y_pos), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        # Draw hand trail
        if len(self.hand_positions_history) > 1:
            for i in range(1, len(self.hand_positions_history)):
                pt1 = tuple(map(int, self.hand_positions_history[i-1]))
                pt2 = tuple(map(int, self.hand_positions_history[i]))
                opacity = i / len(self.hand_positions_history)
                color = (int(255 * opacity), int(100 * opacity), int(100 * opacity))
                cv2.line(image, pt1, pt2, color, 2)
        
        return image


def main():
    """Main function for advanced gesture recognition demo."""
    recognizer = AdvancedGestureRecognizer()
    
    # Initialize camera
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open camera.")
        return
    
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    
    print("Advanced Gesture Recognition Demo")
    print("Gestures to try:")
    print("- Basic: fist, open hand, point, peace, thumbs up")
    print("- Advanced: pinch, spread, wave, circle, OK sign, rock on")
    print("- Movement: swipe left/right")
    print("\nPress 'q' to quit")
    
    while True:
        success, image = cap.read()
        if not success:
            break
        
        image = cv2.flip(image, 1)
        
        # Detect hands
        image, hand_landmarks_list = recognizer.hand_tracker.detect_hands(image)
        
        # Process each hand
        for i, hand_landmarks in enumerate(hand_landmarks_list):
            landmarks = recognizer.hand_tracker.get_hand_landmarks(hand_landmarks, image.shape[:2])
            hand_label = f"Hand {i+1}"
            image = recognizer.draw_advanced_info(image, landmarks, hand_label)
        
        # Show instructions
        instructions = [
            "Advanced Gesture Recognition",
            "Try: pinch, spread, wave, circle, OK, rock on",
            "Move hand for swipe gestures"
        ]
        
        for i, instruction in enumerate(instructions):
            cv2.putText(image, instruction, (10, 30 + i * 25), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
        
        cv2.imshow('Advanced Gesture Recognition', image)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()
    recognizer.hand_tracker.cleanup()


if __name__ == "__main__":
    main()
