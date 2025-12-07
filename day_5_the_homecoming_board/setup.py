#!/usr/bin/env python3
"""
MediaPipe Hand Tracking - Quick Setup Script

This script helps you set up the MediaPipe hand tracking project quickly.
"""

import subprocess
import sys
import os

def check_python_version():
    """Check if Python version is compatible."""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 7):
        print("❌ Python 3.7+ is required")
        print(f"   Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    else:
        print(f"✅ Python version {version.major}.{version.minor}.{version.micro} is compatible")
        return True

def install_dependencies():
    """Install project dependencies."""
    print("\n📦 Installing dependencies...")
    
    try:
        # Upgrade pip first
        subprocess.run([sys.executable, "-m", "pip", "install", "--upgrade", "pip"], 
                      check=True, capture_output=True)
        print("✅ pip upgraded successfully")
        
        # Install requirements
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True)
        print("✅ Dependencies installed successfully")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def verify_installation():
    """Verify that all dependencies are working."""
    print("\n🔍 Verifying installation...")
    
    try:
        # Test imports
        import mediapipe as mp
        import cv2
        import numpy as np
        print("✅ Core dependencies imported successfully")
        
        # Test MediaPipe hands
        hands = mp.solutions.hands.Hands()
        print("✅ MediaPipe hands initialized successfully")
        hands.close()
        
        # Test camera access (without actually opening it)
        print("✅ OpenCV imported successfully")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Verification error: {e}")
        return False

def run_quick_test():
    """Run a quick functionality test."""
    print("\n🧪 Running quick functionality test...")
    
    try:
        # Add src to path
        sys.path.insert(0, os.path.join(os.getcwd(), 'src'))
        
        from hand_tracking import HandTracker, GestureController
        
        # Test basic functionality
        tracker = HandTracker()
        controller = GestureController()
        
        # Test with mock data
        mock_landmarks = [(i * 10, i * 5) for i in range(21)]
        center = tracker.get_hand_center(mock_landmarks)
        bbox = tracker.get_bounding_box(mock_landmarks)
        
        tracker.cleanup()
        
        print("✅ Basic functionality test passed")
        return True
        
    except Exception as e:
        print(f"❌ Functionality test failed: {e}")
        return False

def main():
    """Main setup function."""
    print("🚀 MediaPipe Hand Tracking - Quick Setup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        print("\n❌ Setup failed: Incompatible Python version")
        return
    
    # Install dependencies
    if not install_dependencies():
        print("\n❌ Setup failed: Could not install dependencies")
        return
    
    # Verify installation
    if not verify_installation():
        print("\n❌ Setup failed: Installation verification failed")
        return
    
    # Run quick test
    if not run_quick_test():
        print("\n❌ Setup failed: Functionality test failed")
        return
    
    # Success!
    print("\n" + "=" * 50)
    print("🎉 Setup completed successfully!")
    print("\n📋 What's next?")
    print("  1. Run the launcher: python3 launcher.py")
    print("  2. Try basic demo: python3 examples/basic_hand_tracking.py")
    print("  3. Use the board: python3 examples/homecoming_board.py")
    print("  4. Test gestures: python3 examples/advanced_gestures.py")
    
    print("\n💡 Tips:")
    print("  • Make sure you have good lighting")
    print("  • Position yourself 1-3 feet from the camera")
    print("  • Use a plain background for best results")
    
    print("\n🔧 Troubleshooting:")
    print("  • If camera doesn't work, check permissions")
    print("  • For performance issues, lower camera resolution")
    print("  • Read the full README.md for detailed information")

if __name__ == "__main__":
    main()
