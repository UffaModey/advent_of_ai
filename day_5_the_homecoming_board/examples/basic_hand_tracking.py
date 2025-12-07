"""
Basic Hand Tracking Example

This script demonstrates basic hand tracking functionality using MediaPipe.
Run this script to test hand detection, landmark tracking, and gesture recognition.

Controls:
- Press 'q' to quit
- Press 's' to save current frame
- Press 'r' to reset gesture history
"""

import cv2
import sys
import os
import time

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from hand_tracking import HandTracker, GestureController


def main():
    """Main function to run the hand tracking demo."""
    # Initialize hand tracker and gesture controller
    hand_tracker = HandTracker(
        max_num_hands=2,
        min_detection_confidence=0.7,
        min_tracking_confidence=0.5
    )
    
    gesture_controller = GestureController()
    
    # Initialize camera
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open camera.")
        return
    
    # Set camera properties
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    cap.set(cv2.CAP_PROP_FPS, 30)
    
    print("Hand Tracking Demo Started!")
    print("Controls:")
    print("  'q' - Quit")
    print("  's' - Save current frame")
    print("  'r' - Reset gesture history")
    print("  'h' - Toggle help display")
    
    frame_count = 0
    fps_start_time = time.time()
    show_help = True
    last_action = ""
    action_display_time = 0
    
    while True:
        success, image = cap.read()
        if not success:
            print("Error: Failed to read from camera.")
            break
        
        # Flip the image horizontally for a selfie-view display
        image = cv2.flip(image, 1)
        
        # Detect hands
        image, hand_landmarks_list = hand_tracker.detect_hands(image)
        
        # Process each detected hand
        for i, hand_landmarks in enumerate(hand_landmarks_list):
            # Get pixel coordinates
            landmarks = hand_tracker.get_hand_landmarks(hand_landmarks, image.shape[:2])
            
            # Add hand information to the image
            hand_label = f"Hand {i+1}"
            image = hand_tracker.draw_info(image, landmarks, hand_label)
            
            # Recognize gesture and process actions
            gesture = hand_tracker.recognize_gesture(landmarks)
            action = gesture_controller.process_gesture(gesture, landmarks)
            
            if action:
                last_action = action
                action_display_time = time.time()
                print(f"Action triggered: {action}")
        
        # Calculate and display FPS
        frame_count += 1
        if frame_count % 30 == 0:  # Update FPS every 30 frames
            fps_end_time = time.time()
            fps = 30 / (fps_end_time - fps_start_time)
            fps_start_time = fps_end_time
        else:
            fps = 0
        
        if fps > 0:
            cv2.putText(image, f"FPS: {fps:.1f}", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        # Display last action
        if last_action and time.time() - action_display_time < 3.0:
            cv2.putText(image, f"Action: {last_action}", (10, 70), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
        
        # Display help text
        if show_help:
            help_lines = [
                "Controls:",
                "'q' - Quit",
                "'s' - Save frame",
                "'r' - Reset gestures",
                "'h' - Toggle help"
            ]
            
            for i, line in enumerate(help_lines):
                y = image.shape[0] - (len(help_lines) - i) * 25 - 10
                cv2.putText(image, line, (10, y), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        # Display number of hands detected
        num_hands = len(hand_landmarks_list)
        status_text = f"Hands detected: {num_hands}"
        cv2.putText(image, status_text, (image.shape[1] - 200, 30), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        
        # Show the image
        cv2.imshow('MediaPipe Hand Tracking', image)
        
        # Handle key presses
        key = cv2.waitKey(1) & 0xFF
        
        if key == ord('q'):
            print("Quitting...")
            break
        elif key == ord('s'):
            filename = f"hand_tracking_frame_{int(time.time())}.jpg"
            cv2.imwrite(filename, image)
            print(f"Frame saved as {filename}")
        elif key == ord('r'):
            hand_tracker.gesture_history = []
            gesture_controller.last_gesture = None
            gesture_controller.gesture_start_time = None
            print("Gesture history reset")
        elif key == ord('h'):
            show_help = not show_help
            print(f"Help display {'enabled' if show_help else 'disabled'}")
    
    # Cleanup
    cap.release()
    cv2.destroyAllWindows()
    hand_tracker.cleanup()
    print("Hand tracking demo ended.")


if __name__ == "__main__":
    main()
