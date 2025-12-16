# Fun House Photo Booth - 40 Minute MVP Plan

## 🎯 MVP Goals
Build a working photo booth web app with festive face filters that users can access, capture photos with effects, and download their creations.

## ⏱️ Time Allocation (40 Minutes Total)

### Minutes 1-10: Setup & Core Structure
**PM + Core App Builder**
- Initialize HTML5 project with camera access
- Set up basic UI layout (camera view, capture button, filter selector)
- Implement getUserMedia() for camera access
- Create basic file structure

### Minutes 11-25: Core Features Implementation
**Core App Builder + Filter Engineer**
- Integrate face detection (use face-api.js or MediaPipe)
- Implement 3 essential filters:
  - Snowflake crown overlay
  - Reindeer antlers
  - Simple beard overlay
- Add filter selection interface
- Implement photo capture functionality

### Minutes 26-35: Polish & Testing
**QA + Stylist**
- Style the interface with festive theme
- Test camera functionality across devices
- Ensure mobile responsiveness
- Add download functionality for captured photos

### Minutes 36-40: Final Testing & Documentation
**QA + Documentation Writer**
- Cross-browser testing
- Create quick user guide
- Final bug fixes
- Deploy to GitHub Pages or similar

## 🔧 Technical Implementation

### Core Stack
- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Face Detection**: face-api.js (lightweight, fast setup)
- **Camera**: WebRTC getUserMedia API
- **Filters**: CSS overlays + Canvas manipulation

### Essential Files Structure
```
photo-booth/
├── index.html
├── style.css
├── script.js
├── filters/
│   ├── snowflake-crown.png
│   ├── reindeer-antlers.png
│   └── beard-overlay.png
└── README.md
```

## 🎭 MVP Filter Set (3 Filters)
1. **Snowflake Crown** - PNG overlay positioned above detected face
2. **Reindeer Antlers** - Positioned on forehead area
3. **Frosty Beard** - Lower face overlay

## 📱 Mobile-First Considerations
- Responsive design for phone cameras
- Touch-friendly interface
- Optimized for portrait orientation
- Fast loading with minimal dependencies

## ✅ Success Criteria
- [ ] Camera access works on desktop and mobile
- [ ] Face detection accurately positions filters
- [ ] Users can switch between 3 filters
- [ ] Photo capture saves with applied filter
- [ ] Download functionality works
- [ ] App loads in under 3 seconds

## 🚀 Quick Start Implementation

### Core HTML Structure
```html
<div id="app">
    <video id="camera"></video>
    <canvas id="output" hidden></canvas>
    <div id="filters">
        <button data-filter="snowflake">❄️ Crown</button>
        <button data-filter="antlers">🦌 Antlers</button>
        <button data-filter="beard">🧔 Beard</button>
    </div>
    <button id="capture">📸 Capture</button>
    <button id="download" hidden>⬇️ Download</button>
</div>
```

### Key JavaScript Functions Needed
```javascript
// Core functions to implement
async function startCamera()
async function detectFace() 
function applyFilter(filterType)
function capturePhoto()
function downloadPhoto()
```

## 🎯 Team Roles & Focus

**PM**: Coordinate timeline, ensure MVP scope stays realistic
**Core App Builder**: Camera integration, basic functionality
**Filter Engineer**: Face detection integration, filter positioning
**QA**: Cross-device testing, user experience validation
**Stylist**: UI/UX, festive theme implementation
**Performance Optimizer**: Ensure smooth camera performance
**Documentation Writer**: User guide, deployment instructions

## 📋 Risk Mitigation
- **Face detection issues**: Have manual positioning fallback
- **Camera permissions**: Clear user instructions
- **Performance**: Optimize filter assets, minimal processing
- **Browser compatibility**: Focus on Chrome/Safari first

## 🎨 Design Priorities
1. **Festive theme**: Winter/holiday colors and styling
2. **Large touch targets**: Easy mobile interaction
3. **Clear visual feedback**: Show when filters are active
4. **Intuitive flow**: Camera → Filter → Capture → Download

This plan prioritizes working functionality over perfect features. The goal is a fun, usable photo booth that demonstrates the core concept and can be enhanced post-MVP.