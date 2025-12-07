#!/usr/bin/env python3
"""
MediaPipe Hand Tracking Project Launcher

This script provides an interactive menu to run different hand tracking examples
and utilities in the project.

Usage: python3 launcher.py
"""

import os
import sys
import subprocess

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def print_banner():
    """Print the project banner."""
    banner = """
    ╔══════════════════════════════════════════════════════════════╗
    ║                MediaPipe Hand Tracking Project                ║
    ║                    The Homecoming Board                      ║
    ╚══════════════════════════════════════════════════════════════╝
    
    🖐️  Real-time hand tracking and gesture recognition
    🎨  Interactive drawing board with gesture controls
    🚀  Advanced gesture pattern detection
    """
    print(banner)

def show_menu():
    """Display the main menu options."""
    menu = """
    📋 Available Options:
    
    1️⃣  Basic Hand Tracking Demo
        - Real-time hand detection and landmark visualization
        - Basic gesture recognition (fist, point, peace, etc.)
        - FPS monitoring and camera controls
    
    2️⃣  The Homecoming Board (Interactive Drawing)
        - Draw with hand gestures
        - Change colors with finger counts
        - Erase and save functionality
    
    3️⃣  Advanced Gesture Recognition
        - Complex gesture patterns (pinch, swipe, wave, circle)
        - Hand orientation and velocity tracking
        - Multi-gesture combinations
    
    4️⃣  Run Tests
        - Execute unit tests
        - Verify installation and functionality
    
    5️⃣  Project Information
        - View README and documentation
        - Check system requirements
    
    0️⃣  Exit
    
    """
    print(menu)

def run_basic_demo():
    """Run the basic hand tracking demonstration."""
    print("🚀 Starting Basic Hand Tracking Demo...")
    print("\nControls:")
    print("  'q' - Quit")
    print("  's' - Save current frame")
    print("  'r' - Reset gesture history")
    print("  'h' - Toggle help display")
    print("\nPress Enter to continue...")
    input()
    
    try:
        subprocess.run([sys.executable, "examples/basic_hand_tracking.py"])
    except KeyboardInterrupt:
        print("\n👋 Demo interrupted by user.")
    except Exception as e:
        print(f"\n❌ Error running demo: {e}")

def run_homecoming_board():
    """Run the Homecoming Board interactive application."""
    print("🎨 Starting The Homecoming Board...")
    print("\nGesture Controls:")
    print("  Point (1 finger) - Draw")
    print("  Fist - Erase mode")
    print("  Open hand (5) - Clear board")
    print("  Thumbs up - Save drawing")
    print("  2-5 fingers - Change color")
    print("  Peace sign - Toggle palette")
    print("\nKeyboard Controls:")
    print("  'q' - Quit")
    print("  'i' - Toggle instructions")
    print("  'c' - Clear board")
    print("\nPress Enter to continue...")
    input()
    
    try:
        subprocess.run([sys.executable, "examples/homecoming_board.py"])
    except KeyboardInterrupt:
        print("\n👋 Board session ended by user.")
    except Exception as e:
        print(f"\n❌ Error running board: {e}")

def run_advanced_gestures():
    """Run the advanced gesture recognition demo."""
    print("🔬 Starting Advanced Gesture Recognition...")
    print("\nAdvanced Gestures to try:")
    print("  • Pinch - Thumb and index finger close together")
    print("  • Spread - All fingers spread wide apart")
    print("  • Wave - Side-to-side hand movement")
    print("  • Circle - Circular hand motion")
    print("  • OK Sign - Thumb and index forming circle")
    print("  • Rock On - Index and pinky up, others down")
    print("  • Swipe - Quick left/right hand movement")
    print("\nPress Enter to continue...")
    input()
    
    try:
        subprocess.run([sys.executable, "examples/advanced_gestures.py"])
    except KeyboardInterrupt:
        print("\n👋 Advanced demo ended by user.")
    except Exception as e:
        print(f"\n❌ Error running advanced demo: {e}")

def run_tests():
    """Run the project tests."""
    print("🧪 Running Project Tests...")
    print("\nThis will test:")
    print("  • Core functionality")
    print("  • Import capabilities")
    print("  • Basic algorithms")
    print("\nPress Enter to continue...")
    input()
    
    try:
        subprocess.run([sys.executable, "run_tests.py"])
    except Exception as e:
        print(f"\n❌ Error running tests: {e}")

def show_project_info():
    """Show project information and documentation."""
    info = """
    📖 Project Information
    
    🎯 Project: MediaPipe Hand Tracking - The Homecoming Board
    🔧 Technology: MediaPipe, OpenCV, Python
    📅 Features:
       • Real-time hand detection (up to 2 hands)
       • 21-point hand landmark extraction
       • Gesture recognition and classification
       • Interactive drawing board
       • Advanced gesture patterns
       • Customizable gesture actions
    
    📋 System Requirements:
       • Python 3.7+
       • Webcam or camera device
       • 4GB+ RAM recommended
       • Good lighting conditions for best results
    
    📁 Project Structure:
       src/hand_tracking/     - Core tracking modules
       examples/              - Demo applications
       tests/                 - Unit tests
       docs/                  - Documentation
    
    🔗 Dependencies:
       • mediapipe==0.10.9    - Hand tracking framework
       • opencv-python==4.8.1.78 - Computer vision
       • numpy==1.24.3        - Numerical computing
       • matplotlib==3.7.2    - Plotting
       • Pillow==10.0.1       - Image processing
    
    💡 Tips for Best Results:
       • Use good lighting
       • Keep hands clearly visible
       • Maintain 1-3 feet from camera
       • Practice consistent gesture shapes
       • Use plain backgrounds when possible
    
    """
    print(info)
    
    print("Would you like to view the full README? (y/n): ", end="")
    if input().lower().startswith('y'):
        try:
            with open('README.md', 'r') as f:
                print("\n" + "="*60)
                print(f.read())
        except FileNotFoundError:
            print("README.md not found in current directory.")

def main():
    """Main launcher function."""
    # Change to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    while True:
        clear_screen()
        print_banner()
        show_menu()
        
        try:
            choice = input("Select an option (0-5): ").strip()
            
            if choice == '1':
                run_basic_demo()
            elif choice == '2':
                run_homecoming_board()
            elif choice == '3':
                run_advanced_gestures()
            elif choice == '4':
                run_tests()
            elif choice == '5':
                show_project_info()
            elif choice == '0':
                print("\n👋 Thanks for using MediaPipe Hand Tracking!")
                print("Happy gesture recognizing! 🖐️")
                break
            else:
                print(f"\n❌ Invalid choice: '{choice}'. Please select 0-5.")
            
            if choice != '0':
                print("\nPress Enter to return to main menu...")
                input()
                
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Unexpected error: {e}")
            print("Press Enter to continue...")
            input()

if __name__ == "__main__":
    main()
