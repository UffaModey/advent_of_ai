# ✈️ The Homecoming Board - Winter Festival Edition

A magical, touchless, gesture-controlled flight tracker built with MediaPipe hand tracking, real-time flight data, and beautiful winter-themed interface.

![Winter Flight Tracker](docs/demo-preview.png)

## 🌟 Features

### ✋ Gesture Controls
Navigate entirely through hand gestures captured by your webcam:

| Gesture | Emoji | Action | Description |
|---------|-------|--------|-------------|
| **Shaka** | 🤙 | Load Arrivals | Display arriving flights for current airport |
| **OK Sign** | 👌 | Load Departures | Display departing flights for current airport |
| **Wave Hand** | 🖐️ | Navigate | Scroll through flights or options |
| **Closed Fist** | ✊ | Select Flight | Open detailed view of highlighted flight |
| **Vulcan Sign** | 🖖 | Exit Detail | Return from detail view to main screen |
| **Peace Sign** | ✌️ | Refresh Data | Reload current flight information |
| **Rock-On Sign** | 🤘 | Switch Airport | Toggle airport selection mode |

### ❄️ Winter Festival Theme
- Soft blue, white, and gold color palette
- Animated snow particles background
- Smooth, magical transitions between screens
- Clean typography optimized for large displays
- Frosted glass effects with backdrop blur

### 🛫 Real-Time Flight Data
- Live arrivals and departures from major US airports
- Flight numbers, airlines, gates, and terminals
- Scheduled vs. estimated times
- Flight status updates
- Detailed aircraft information

### 🏢 Airport Support
- JFK - John F. Kennedy International (New York)
- LAX - Los Angeles International (California)
- ORD - O'Hare International (Chicago)
- ATL - Hartsfield-Jackson Atlanta International (Georgia)
- DFW - Dallas/Fort Worth International (Texas)

## 🚀 Quick Start

### Prerequisites
- **Python 3.7+** (for local server)
- **Modern web browser** with webcam support
- **Camera permissions** enabled
- **Good lighting** for hand tracking

### Installation & Launch

1. **Clone or download** this repository
2. **Navigate** to the project directory:
   ```bash
   cd day_5_the_homecoming_board
   ```

3. **Start the server**:
   ```bash
   python3 serve.py
   ```
   
   Or with custom port:
   ```bash
   python3 serve.py --port 8080
   ```

4. **Open your browser** and go to:
   ```
   http://localhost:8000
   ```

5. **Allow camera access** when prompted

6. **Start gesturing!** ✋

### Alternative Launch Methods

#### Using Python's built-in server:
```bash
python3 -m http.server 8000
```

#### Using Node.js (if available):
```bash
npx http-server -p 8000 -c-1
```

## 📋 User Guide

### Getting Started
1. **Camera Setup**: Position yourself about 2-3 feet from your webcam
2. **Lighting**: Ensure good lighting on your hands
3. **Gestures**: Hold gestures clearly for 0.5-1 second for recognition
4. **Hand Position**: Keep your hand within the camera frame (bottom-right overlay)

### Navigation Flow
1. **Start**: Application loads with default airport (JFK)
2. **Load Data**: Use 🤙 (Shaka) for arrivals or 👌 (OK) for departures
3. **Browse Flights**: Use 🖐️ (Wave) to navigate through flights
4. **View Details**: Use ✊ (Fist) to open detailed flight information
5. **Return**: Use 🖖 (Vulcan) to go back to main screen
6. **Switch Airports**: Use 🤘 (Rock-On) to change airports
7. **Refresh**: Use ✌️ (Peace) to reload current data

### Gesture Tips
- **Hold gestures steady** for about 1 second
- **Use deliberate movements** - avoid quick transitions
- **Keep hand centered** in the camera view
- **Try different angles** if recognition isn't working
- **Use good contrast** between hand and background

## 🛠️ Technical Architecture

### Frontend Stack
- **HTML5** with semantic structure
- **CSS3** with CSS variables and modern features
- **Vanilla JavaScript** (ES6+) with modular architecture
- **MediaPipe Hands** for real-time hand tracking
- **Canvas API** for hand landmark visualization

### JavaScript Modules
```
js/
├── utils/
│   ├── cache.js      # API response caching
│   └── api.js        # Flight data integration
├── gesture/
│   ├── detector.js   # MediaPipe hand detection
│   └── recognizer.js # Gesture classification
├── ui/
│   ├── animations.js # Visual effects & transitions
│   └── components.js # UI component management
└── app.js           # Main application controller
```

### Key Features
- **Modular Architecture**: Clean separation of concerns
- **Gesture Recognition**: Advanced finger tracking algorithms
- **Caching System**: Smart API response caching
- **Animation Engine**: Smooth transitions and effects
- **Error Handling**: Graceful fallbacks and user feedback
- **Responsive Design**: Works on various screen sizes

### API Integration
- **Provider**: AviationStack API
- **CORS Handling**: AllOrigins proxy for browser compatibility
- **Rate Limiting**: Built-in caching to minimize API calls
- **Fallback Data**: Mock data for demonstration

## 🎨 Customization

### Styling Variables
Modify CSS variables in `styles/main.css`:

```css
:root {
    --winter-blue: #1e3a8a;
    --ice-white: #f8fafc;
    --snow-white: #ffffff;
    --gold: #f59e0b;
    /* ... more variables */
}
```

### Gesture Sensitivity
Adjust in `js/gesture/recognizer.js`:

```javascript
this.debounceTime = 300; // ms between gestures
this.confidenceThreshold = 0.8; // recognition confidence
this.historySize = 5; // gesture history for stability
```

### Animation Settings
Configure in `js/ui/animations.js`:

```javascript
this.maxSnowflakes = 50; // snow particle count
this.defaultTTL = 5 * 60 * 1000; // cache duration
```

## 🔧 Development

### Project Structure
```
day_5_the_homecoming_board/
├── index.html           # Main HTML file
├── styles/
│   └── main.css        # Winter theme styles
├── js/                 # JavaScript modules
├── serve.py            # Development server
├── README.md           # This file
└── docs/               # Documentation assets
```

### Development Server
The included `serve.py` provides:
- **CORS headers** for MediaPipe
- **Static file serving**
- **Auto browser opening**
- **Custom port support**

### Browser Compatibility
- **Chrome/Chromium 88+** ✅ (Recommended)
- **Firefox 85+** ✅
- **Safari 14+** ✅
- **Edge 88+** ✅

### Performance Considerations
- **Target 30-60 FPS** for hand tracking
- **Gesture debouncing** prevents rapid triggering
- **API caching** reduces network calls
- **Efficient animations** using CSS transitions

## 🐛 Troubleshooting

### Camera Issues
- **Check permissions**: Ensure camera access is granted
- **Try different browsers**: Chrome usually works best
- **Check lighting**: Ensure good contrast for hand detection
- **Restart browser**: Clear any camera access conflicts

### Gesture Recognition
- **Hold gestures longer**: 1-2 seconds for recognition
- **Improve lighting**: Better lighting = better tracking
- **Center your hand**: Keep hand in camera view
- **Try different angles**: Slight hand rotation can help

### Flight Data
- **Check internet connection**: API requires connectivity
- **Wait for loading**: Initial data load may take time
- **Try refreshing**: Use peace gesture or browser refresh
- **Mock data**: App falls back to demo data if API fails

### Performance
- **Close other tabs**: Free up browser resources
- **Check CPU usage**: MediaPipe is computationally intensive
- **Lower quality**: Try reducing camera resolution
- **Restart app**: Refresh browser if performance degrades

## 📱 Mobile Support

While optimized for desktop use, the app includes responsive design:
- **Touch fallbacks** for gesture actions
- **Mobile-friendly layouts**
- **Camera orientation handling**
- **Simplified navigation**

## 🔒 Privacy & Security

- **No data storage**: All processing happens locally
- **Camera access**: Only used for hand tracking
- **No recording**: Video feed is processed in real-time only
- **API keys**: Demo key included (replace for production)

## 🎯 Future Enhancements

- **Voice feedback** using Web Speech API
- **Sound effects** for gesture confirmations
- **Additional airports** and international support
- **Custom gesture training**
- **Multi-language support**
- **Accessibility improvements**

## 📄 License

This project is created as a demonstration of gesture-controlled interfaces and modern web technologies.

## 🤝 Contributing

This is a demonstration project, but improvements are welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your setup meets the prerequisites
3. Try the provided solutions
4. Check browser console for error messages

---

**Made with ❄️ for the Winter Festival** | **Powered by MediaPipe & Modern Web APIs**
