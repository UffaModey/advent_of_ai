# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Setup (First time only)
```bash
python3 setup.py
```

### 2. Launch Interactive Menu
```bash
python3 launcher.py
```

### 3. Or Run Examples Directly

**Basic Hand Tracking:**
```bash
python3 examples/basic_hand_tracking.py
```

**The Homecoming Board (Interactive Drawing):**
```bash
python3 examples/homecoming_board.py
```

**Advanced Gesture Recognition:**
```bash
python3 examples/advanced_gestures.py
```

## 🎯 Gesture Quick Reference

### Basic Gestures
- **Fist** (0 fingers) - Erase/Reset action
- **Point** (1 finger) - Draw/Select action  
- **Peace** (2 fingers) - Toggle/Confirm action
- **Three** (3 fingers) - Option 3/Blue color
- **Four** (4 fingers) - Option 4/Yellow color
- **Open Hand** (5 fingers) - Clear/Stop action
- **Thumbs Up** - Save/Approve action

### Advanced Gestures
- **Pinch** - Thumb and index close together
- **Spread** - All fingers spread wide
- **Wave** - Side-to-side hand movement
- **Circle** - Circular hand motion
- **OK Sign** - Thumb and index forming circle
- **Rock On** - Index and pinky up, others down
- **Swipe Left/Right** - Quick horizontal movement

## 🎨 Homecoming Board Controls

### Drawing
- **Point** (index finger) → Draw with current color
- **Fist** → Erase mode (larger brush)
- **Open Hand** → Clear entire board

### Colors
- **1 finger** (Point) → Red
- **2 fingers** → Green
- **3 fingers** → Blue  
- **4 fingers** → Yellow
- **5 fingers** → Magenta

### Actions
- **Thumbs Up** → Save current drawing
- **Peace Sign** → Toggle color palette display

### Keyboard Shortcuts
- `q` → Quit application
- `i` → Toggle instructions
- `c` → Clear board
- `p` → Toggle palette

## 💡 Tips for Best Results

1. **Lighting**: Use good, even lighting - avoid shadows
2. **Distance**: Stay 1-3 feet from camera
3. **Background**: Plain backgrounds work best
4. **Gestures**: Make clear, distinct gestures
5. **Stability**: Hold gestures for 0.5+ seconds
6. **Camera**: Ensure camera has proper permissions

## 🛠️ Troubleshooting

### Camera Issues
- Check camera permissions in system settings
- Try different camera index (0, 1, 2) if multiple cameras
- Restart application if camera fails to initialize

### Performance Issues  
- Close other applications using camera
- Lower camera resolution in code if needed
- Ensure good lighting to improve detection accuracy

### Gesture Recognition Issues
- Practice consistent gesture shapes
- Ensure entire hand is visible in frame
- Hold gestures steady for recognition
- Check lighting conditions

## 🧪 Running Tests

Test your installation:
```bash
python3 run_tests.py
```

## 📖 Full Documentation

See `README.md` for complete technical documentation and API reference.
