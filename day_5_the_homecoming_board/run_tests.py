"""
Test runner for the hand tracking project.

This script runs all tests and provides a summary of results.
"""

import os
import sys
import subprocess

def run_tests():
    """Run all tests and display results."""
    print("🧪 MediaPipe Hand Tracking - Test Suite")
    print("=" * 50)
    
    # Change to project directory
    project_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_dir)
    
    # Run unit tests
    print("\n📋 Running Unit Tests...")
    try:
        result = subprocess.run([
            sys.executable, 'tests/test_hand_tracker.py'
        ], capture_output=True, text=True, timeout=30)
        
        print(result.stdout)
        if result.stderr:
            print("Errors:", result.stderr)
        
        if result.returncode == 0:
            print("✅ Unit tests PASSED")
        else:
            print("❌ Unit tests FAILED")
            
    except subprocess.TimeoutExpired:
        print("⏰ Unit tests TIMED OUT")
    except Exception as e:
        print(f"❌ Error running unit tests: {e}")
    
    # Test imports
    print("\n📦 Testing Imports...")
    try:
        sys.path.insert(0, os.path.join(project_dir, 'src'))
        from hand_tracking import HandTracker, GestureController
        print("✅ Import test PASSED")
    except Exception as e:
        print(f"❌ Import test FAILED: {e}")
    
    # Test basic functionality (without camera)
    print("\n🔧 Testing Basic Functionality...")
    try:
        tracker = HandTracker()
        controller = GestureController()
        
        # Test basic methods with mock data
        mock_landmarks = [(i * 10, i * 5) for i in range(21)]
        
        center = tracker.get_hand_center(mock_landmarks)
        bbox = tracker.get_bounding_box(mock_landmarks)
        distance = tracker.calculate_distance((0, 0), (3, 4))
        
        assert center == (100, 50)
        assert bbox == (0, 0, 200, 100)
        assert distance == 5.0
        
        print("✅ Basic functionality test PASSED")
    except Exception as e:
        print(f"❌ Basic functionality test FAILED: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Test Summary Complete")
    print("\nTo run specific examples:")
    print("  python examples/basic_hand_tracking.py")
    print("  python examples/homecoming_board.py")
    print("  python examples/advanced_gestures.py")

if __name__ == "__main__":
    run_tests()
