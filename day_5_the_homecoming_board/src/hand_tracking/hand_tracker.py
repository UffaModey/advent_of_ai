"""
MediaPipe Hand Tracking Module

This module provides a comprehensive hand tracking implementation using MediaPipe.
It includes hand detection, landmark extraction, and gesture recognition capabilities.
"""

import cv2
import mediapipe as mp
import numpy as np
from typing import List, Tuple, Optional, Dict
import math


class HandTracker:
    """
    A comprehensive hand tracking class using MediaPipe.
    
    Features:
    - Real-time hand detection and tracking
    - Hand landmark extraction
    - Gesture recognition
    - Hand pose classification
    """
    
    def __init__(self, 
                 max_num_hands: int = 2,
                 min_detection_confidence: float = 0.7,
                 min_tracking_confidence: float = 0.5):
        """
        Initialize the hand tracker.
        
        Args:
            max_num_hands: Maximum number of hands to detect
            min_detection_confidence: Minimum confidence for hand detection
            min_tracking_confidence: Minimum confidence for hand tracking
        """
        self.mp_hands = mp.solutions.hands
        self.mp_draw = mp.solutions.drawing_utils
        self.mp_draw_styles = mp.solutions.drawing_styles
        
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=max_num_hands,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )
        
        # Hand landmark indices
        self.THUMB_TIP = 4
        self.THUMB_IP = 3
        self.THUMB_MCP = 2
        self.INDEX_TIP = 8
        self.INDEX_PIP = 6
        self.INDEX_MCP = 5
        self.MIDDLE_TIP = 12
        self.MIDDLE_PIP = 10
        self.MIDDLE_MCP = 9
        self.RING_TIP = 16
        self.RING_PIP = 14
        self.RING_MCP = 13
        self.PINKY_TIP = 20
        self.PINKY_PIP = 18
        self.PINKY_MCP = 17
        self.WRIST = 0
        
        # Gesture recognition
        self.gesture_history = []
        self.gesture_buffer_size = 5
    
    def detect_hands(self, image: np.ndarray) -> Tuple[np.ndarray, List]:
        """
        Detect hands in an image and return landmarks.
        
        Args:
            image: Input image (BGR format)
            
        Returns:
            Tuple of (processed_image, hand_landmarks_list)
        """
        # Convert BGR to RGB
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        rgb_image.flags.writeable = False
        
        # Process the image
        results = self.hands.process(rgb_image)
        
        # Convert back to BGR
        rgb_image.flags.writeable = True
        bgr_image = cv2.cvtColor(rgb_image, cv2.COLOR_RGB2BGR)
        
        hand_landmarks_list = []
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                hand_landmarks_list.append(hand_landmarks)
                
                # Draw landmarks
                self.mp_draw.draw_landmarks(
                    bgr_image,
                    hand_landmarks,
                    self.mp_hands.HAND_CONNECTIONS,
                    self.mp_draw_styles.get_default_hand_landmarks_style(),
                    self.mp_draw_styles.get_default_hand_connections_style()
                )
        
        return bgr_image, hand_landmarks_list
    
    def get_hand_landmarks(self, landmarks, image_shape: Tuple[int, int]) -> List[Tuple[int, int]]:
        """
        Convert normalized landmarks to pixel coordinates.
        
        Args:
            landmarks: MediaPipe hand landmarks
            image_shape: (height, width) of the image
            
        Returns:
            List of (x, y) pixel coordinates
        """
        h, w = image_shape
        landmark_points = []
        
        for landmark in landmarks.landmark:
            x = int(landmark.x * w)
            y = int(landmark.y * h)
            landmark_points.append((x, y))
            
        return landmark_points
    
    def calculate_distance(self, point1: Tuple[int, int], point2: Tuple[int, int]) -> float:
        """Calculate Euclidean distance between two points."""
        return math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2)
    
    def is_finger_up(self, landmarks: List[Tuple[int, int]], finger: str) -> bool:
        """
        Check if a specific finger is up.
        
        Args:
            landmarks: List of hand landmark points
            finger: Finger name ('thumb', 'index', 'middle', 'ring', 'pinky')
            
        Returns:
            True if finger is up, False otherwise
        """
        if finger == 'thumb':
            # Thumb is up if tip is to the right of IP joint (for right hand)
            return landmarks[self.THUMB_TIP][0] > landmarks[self.THUMB_IP][0]
        elif finger == 'index':
            return landmarks[self.INDEX_TIP][1] < landmarks[self.INDEX_PIP][1]
        elif finger == 'middle':
            return landmarks[self.MIDDLE_TIP][1] < landmarks[self.MIDDLE_PIP][1]
        elif finger == 'ring':
            return landmarks[self.RING_TIP][1] < landmarks[self.RING_PIP][1]
        elif finger == 'pinky':
            return landmarks[self.PINKY_TIP][1] < landmarks[self.PINKY_PIP][1]
        
        return False
    
    def count_fingers(self, landmarks: List[Tuple[int, int]]) -> int:
        """Count the number of fingers that are up."""
        fingers = ['thumb', 'index', 'middle', 'ring', 'pinky']
        count = 0
        
        for finger in fingers:
            if self.is_finger_up(landmarks, finger):
                count += 1
                
        return count
    
    def recognize_gesture(self, landmarks: List[Tuple[int, int]]) -> str:
        """
        Recognize hand gestures based on landmark positions.
        
        Args:
            landmarks: List of hand landmark points
            
        Returns:
            Recognized gesture name
        """
        finger_count = self.count_fingers(landmarks)
        
        # Basic gesture recognition
        if finger_count == 0:
            gesture = "fist"
        elif finger_count == 1:
            if self.is_finger_up(landmarks, 'index'):
                gesture = "point"
            elif self.is_finger_up(landmarks, 'thumb'):
                gesture = "thumbs_up"
            else:
                gesture = "one"
        elif finger_count == 2:
            if (self.is_finger_up(landmarks, 'index') and 
                self.is_finger_up(landmarks, 'middle')):
                gesture = "peace"
            else:
                gesture = "two"
        elif finger_count == 3:
            gesture = "three"
        elif finger_count == 4:
            gesture = "four"
        elif finger_count == 5:
            gesture = "open_hand"
        else:
            gesture = "unknown"
        
        # Add to gesture history for stability
        self.gesture_history.append(gesture)
        if len(self.gesture_history) > self.gesture_buffer_size:
            self.gesture_history.pop(0)
        
        # Return most common gesture in recent history
        if self.gesture_history:
            return max(set(self.gesture_history), key=self.gesture_history.count)
        
        return gesture
    
    def get_hand_center(self, landmarks: List[Tuple[int, int]]) -> Tuple[int, int]:
        """Get the center point of the hand."""
        x_coords = [point[0] for point in landmarks]
        y_coords = [point[1] for point in landmarks]
        
        center_x = sum(x_coords) // len(x_coords)
        center_y = sum(y_coords) // len(y_coords)
        
        return (center_x, center_y)
    
    def get_bounding_box(self, landmarks: List[Tuple[int, int]]) -> Tuple[int, int, int, int]:
        """Get bounding box coordinates for the hand."""
        x_coords = [point[0] for point in landmarks]
        y_coords = [point[1] for point in landmarks]
        
        x_min, x_max = min(x_coords), max(x_coords)
        y_min, y_max = min(y_coords), max(y_coords)
        
        return (x_min, y_min, x_max, y_max)
    
    def draw_info(self, image: np.ndarray, landmarks: List[Tuple[int, int]], 
                  hand_label: str = "Hand") -> np.ndarray:
        """
        Draw hand information on the image.
        
        Args:
            image: Image to draw on
            landmarks: Hand landmark points
            hand_label: Label for the hand
            
        Returns:
            Image with drawn information
        """
        # Get hand info
        finger_count = self.count_fingers(landmarks)
        gesture = self.recognize_gesture(landmarks)
        center = self.get_hand_center(landmarks)
        bbox = self.get_bounding_box(landmarks)
        
        # Draw bounding box
        cv2.rectangle(image, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (0, 255, 0), 2)
        
        # Draw center point
        cv2.circle(image, center, 5, (255, 0, 0), -1)
        
        # Draw text info
        info_text = f"{hand_label}: {gesture} ({finger_count} fingers)"
        text_size = cv2.getTextSize(info_text, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)[0]
        
        # Position text above bounding box
        text_x = bbox[0]
        text_y = max(bbox[1] - 10, text_size[1] + 10)
        
        # Draw background for text
        cv2.rectangle(image, 
                     (text_x, text_y - text_size[1] - 5),
                     (text_x + text_size[0] + 5, text_y + 5),
                     (0, 0, 0), -1)
        
        # Draw text
        cv2.putText(image, info_text, (text_x + 2, text_y), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        
        return image
    
    def cleanup(self):
        """Clean up resources."""
        self.hands.close()


class GestureController:
    """
    A controller class that maps gestures to actions.
    """
    
    def __init__(self):
        self.gesture_actions = {
            'fist': self.on_fist,
            'open_hand': self.on_open_hand,
            'point': self.on_point,
            'peace': self.on_peace,
            'thumbs_up': self.on_thumbs_up,
            'one': self.on_one,
            'two': self.on_two,
            'three': self.on_three,
            'four': self.on_four,
        }
        
        self.last_gesture = None
        self.gesture_start_time = None
        self.min_gesture_duration = 1.0  # Minimum seconds to hold gesture
    
    def process_gesture(self, gesture: str, landmarks: List[Tuple[int, int]]) -> Optional[str]:
        """
        Process a detected gesture and trigger appropriate action.
        
        Args:
            gesture: Detected gesture name
            landmarks: Hand landmark points
            
        Returns:
            Action result or None
        """
        import time
        current_time = time.time()
        
        if gesture != self.last_gesture:
            self.last_gesture = gesture
            self.gesture_start_time = current_time
            return None
        
        # Check if gesture has been held long enough
        if (self.gesture_start_time and 
            current_time - self.gesture_start_time >= self.min_gesture_duration):
            
            if gesture in self.gesture_actions:
                result = self.gesture_actions[gesture](landmarks)
                self.gesture_start_time = None  # Reset to prevent repeated actions
                return result
        
        return None
    
    def on_fist(self, landmarks: List[Tuple[int, int]]) -> str:
        """Action for fist gesture."""
        return "Fist detected - Action: Reset"
    
    def on_open_hand(self, landmarks: List[Tuple[int, int]]) -> str:
        """Action for open hand gesture."""
        return "Open hand detected - Action: Stop/Pause"
    
    def on_point(self, landmarks: List[Tuple[int, int]]) -> str:
        """Action for pointing gesture."""
        return "Point detected - Action: Select/Click"
    
    def on_peace(self, landmarks: List[Tuple[int, int]]) -> str:
        """Action for peace sign."""
        return "Peace sign detected - Action: Victory/Confirm"
    
    def on_thumbs_up(self, landmarks: List[Tuple[int, int]]) -> str:
        """Action for thumbs up."""
        return "Thumbs up detected - Action: Approve/Like"
    
    def on_one(self, landmarks: List[Tuple[int, int]]) -> str:
        """Action for one finger."""
        return "One finger detected - Action: Option 1"
    
    def on_two(self, landmarks: List[Tuple[int, int]]) -> str:
        """Action for two fingers."""
        return "Two fingers detected - Action: Option 2"
    
    def on_three(self, landmarks: List[Tuple[int, int]]) -> str:
        """Action for three fingers."""
        return "Three fingers detected - Action: Option 3"
    
    def on_four(self, landmarks: List[Tuple[int, int]]) -> str:
        """Action for four fingers."""
        return "Four fingers detected - Action: Option 4"
