"""
Unit tests for the hand tracking module.

Run with: python -m pytest tests/test_hand_tracker.py -v
"""

import unittest
import numpy as np
import cv2
import sys
import os

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from hand_tracking import HandTracker, GestureController


class TestHandTracker(unittest.TestCase):
    """Test cases for HandTracker class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.tracker = HandTracker(max_num_hands=1)
        
        # Create mock landmarks data (21 points)
        self.mock_landmarks = []
        for i in range(21):
            x, y = i * 10, i * 5  # Simple coordinates
            self.mock_landmarks.append((x, y))
    
    def test_initialization(self):
        """Test HandTracker initialization."""
        self.assertIsNotNone(self.tracker)
        self.assertIsNotNone(self.tracker.hands)
        self.assertEqual(self.tracker.THUMB_TIP, 4)
        self.assertEqual(self.tracker.INDEX_TIP, 8)
        self.assertEqual(self.tracker.WRIST, 0)
    
    def test_calculate_distance(self):
        """Test distance calculation."""
        point1 = (0, 0)
        point2 = (3, 4)
        distance = self.tracker.calculate_distance(point1, point2)
        self.assertEqual(distance, 5.0)  # 3-4-5 triangle
    
    def test_get_hand_center(self):
        """Test hand center calculation."""
        landmarks = [(0, 0), (10, 0), (10, 10), (0, 10)]
        center = self.tracker.get_hand_center(landmarks)
        self.assertEqual(center, (5, 5))
    
    def test_get_bounding_box(self):
        """Test bounding box calculation."""
        landmarks = [(0, 0), (10, 5), (5, 10)]
        bbox = self.tracker.get_bounding_box(landmarks)
        self.assertEqual(bbox, (0, 0, 10, 10))
    
    def test_finger_detection_logic(self):
        """Test individual finger detection logic."""
        # This is a simplified test with mock data
        # In practice, finger detection depends on actual landmark positions
        landmarks = self.mock_landmarks.copy()
        
        # Mock scenario: index finger up
        landmarks[8] = (80, 20)  # INDEX_TIP higher
        landmarks[6] = (60, 40)  # INDEX_PIP lower
        
        result = self.tracker.is_finger_up(landmarks, 'index')
        self.assertTrue(result)
    
    def test_count_fingers_basic(self):
        """Test basic finger counting."""
        # This test uses simplified mock data
        landmarks = self.mock_landmarks.copy()
        
        # The actual implementation would need real landmark positions
        # This is a structural test to ensure the method exists and runs
        count = self.tracker.count_fingers(landmarks)
        self.assertIsInstance(count, int)
        self.assertGreaterEqual(count, 0)
        self.assertLessEqual(count, 5)


class TestGestureController(unittest.TestCase):
    """Test cases for GestureController class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.controller = GestureController()
        self.mock_landmarks = [(i * 10, i * 5) for i in range(21)]
    
    def test_initialization(self):
        """Test GestureController initialization."""
        self.assertIsNotNone(self.controller)
        self.assertIn('fist', self.controller.gesture_actions)
        self.assertIn('thumbs_up', self.controller.gesture_actions)
    
    def test_gesture_actions(self):
        """Test gesture action methods."""
        # Test that all gesture actions return strings
        result = self.controller.on_fist(self.mock_landmarks)
        self.assertIsInstance(result, str)
        
        result = self.controller.on_thumbs_up(self.mock_landmarks)
        self.assertIsInstance(result, str)
        
        result = self.controller.on_point(self.mock_landmarks)
        self.assertIsInstance(result, str)
    
    def test_process_gesture_timing(self):
        """Test gesture processing with timing."""
        # First call should not trigger action (gesture just started)
        result = self.controller.process_gesture('fist', self.mock_landmarks)
        self.assertIsNone(result)
        
        # Same gesture immediately should still not trigger
        result = self.controller.process_gesture('fist', self.mock_landmarks)
        self.assertIsNone(result)


class TestImageProcessing(unittest.TestCase):
    """Test image processing functionality."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.tracker = HandTracker()
        # Create a simple test image
        self.test_image = np.zeros((480, 640, 3), dtype=np.uint8)
        self.test_image.fill(100)  # Gray image
    
    def test_image_format(self):
        """Test that image processing handles correct formats."""
        # Test with BGR image (standard OpenCV format)
        result_image, landmarks = self.tracker.detect_hands(self.test_image)
        
        self.assertIsInstance(result_image, np.ndarray)
        self.assertEqual(result_image.shape, self.test_image.shape)
        self.assertIsInstance(landmarks, list)
    
    def test_draw_info_on_image(self):
        """Test drawing information on images."""
        landmarks = [(i * 20, i * 10) for i in range(21)]
        
        # This should not raise an exception
        try:
            result_image = self.tracker.draw_info(
                self.test_image.copy(), landmarks, "Test Hand"
            )
            self.assertIsInstance(result_image, np.ndarray)
        except Exception as e:
            self.fail(f"draw_info raised an exception: {e}")


class TestUtilityFunctions(unittest.TestCase):
    """Test utility functions and edge cases."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.tracker = HandTracker()
    
    def test_empty_landmarks(self):
        """Test behavior with empty landmarks."""
        empty_landmarks = []
        
        # These should handle empty input gracefully
        with self.assertRaises((IndexError, ZeroDivisionError)):
            self.tracker.get_hand_center(empty_landmarks)
    
    def test_minimal_landmarks(self):
        """Test with minimal landmark data."""
        minimal_landmarks = [(0, 0), (1, 1)]
        
        center = self.tracker.get_hand_center(minimal_landmarks)
        self.assertEqual(center, (0, 0))  # Average of coordinates: (0+1)//2=0, (0+1)//2=0
        
        bbox = self.tracker.get_bounding_box(minimal_landmarks)
        self.assertEqual(bbox, (0, 0, 1, 1))
    
    def test_cleanup(self):
        """Test cleanup method."""
        # Should not raise any exceptions
        try:
            self.tracker.cleanup()
        except Exception as e:
            self.fail(f"cleanup raised an exception: {e}")


def create_test_suite():
    """Create a test suite with all test cases."""
    suite = unittest.TestSuite()
    
    # Add test cases
    suite.addTest(unittest.makeSuite(TestHandTracker))
    suite.addTest(unittest.makeSuite(TestGestureController))
    suite.addTest(unittest.makeSuite(TestImageProcessing))
    suite.addTest(unittest.makeSuite(TestUtilityFunctions))
    
    return suite


if __name__ == '__main__':
    # Run tests
    print("Running Hand Tracking Tests...")
    print("-" * 50)
    
    # Create and run test suite
    suite = create_test_suite()
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    
    if result.failures:
        print("\nFailures:")
        for test, traceback in result.failures:
            print(f"- {test}: {traceback}")
    
    if result.errors:
        print("\nErrors:")
        for test, traceback in result.errors:
            print(f"- {test}: {traceback}")
    
    # Exit with appropriate code
    exit_code = 0 if result.wasSuccessful() else 1
    print(f"\nTest {'PASSED' if exit_code == 0 else 'FAILED'}")
    exit(exit_code)
