#!/usr/bin/env python3
"""
🎭 FORTUNE SHOWCASE
Demonstrate all the mystical moods of Madame Zelda's Oracle
"""

import subprocess
import time
import sys

def run_fortune(mood):
    """Run the fortune teller with a specific mood"""
    print(f"\n{'='*80}")
    print(f"🎭 DEMONSTRATING: {mood.upper()} MOOD")
    print(f"{'='*80}")
    time.sleep(1)
    
    result = subprocess.run([
        sys.executable, 'fortune_teller.py', mood
    ], capture_output=True, text=True)
    
    print(result.stdout)
    time.sleep(2)

def main():
    """Showcase all fortune moods"""
    moods = ['grumpy', 'poetic', 'festive', 'sarcastic', 'mysterious']
    
    print("🔮✨ WELCOME TO MADAME ZELDA'S MOOD SHOWCASE ✨🔮")
    print("Get ready to experience all five mystical fortune styles!")
    print("\nPress Enter to begin the magical journey...")
    input()
    
    for mood in moods:
        run_fortune(mood)
    
    print("\n" + "🌟" * 80)
    print("✨ That concludes our mystical mood showcase! ✨")
    print("🦆 Thank you for experiencing the magic of Madame Zelda's Oracle! 🦆")
    print("🌟" * 80)

if __name__ == "__main__":
    main()
