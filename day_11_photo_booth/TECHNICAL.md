# 🔧 Technical Documentation

## Fun House Photo Booth - Technical Architecture & Developer Guide

This document provides comprehensive technical information for developers working with the Fun House Photo Booth application.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [API Reference](#api-reference)
4. [Setup & Development](#setup--development)
5. [Browser Compatibility](#browser-compatibility)
6. [Performance Optimization](#performance-optimization)
7. [Security Considerations](#security-considerations)
8. [Deployment](#deployment)

---

## 🏗️ Architecture Overview

### System Design

The Fun House Photo Booth follows a **modular, client-side architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────┐
│                  User Interface                 │
│              (HTML + CSS + Events)              │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              Core Application                   │
│                  (app.js)                      │
│  • State Management                             │
│  • Camera Integration                           │
│  • Event Coordination                           │
│  • Photo Capture Pipeline                      │
└─────────────┬───────────┬───────────────────────┘
              │           │
    ┌─────────▼─────────┐ │ ┌───────────────▼─────────┐
    │  Camera System    │ │ │    Filter System        │
    │ (camera-utils.js) │ │ │    (filters.js)         │
    │                   │ │ │                         │
    │ • Device Detection│ │ │ • Face Detection        │
    │ • Stream Management│ │ │ • Filter Positioning   │
    │ • Error Handling  │ │ │ • Real-time Rendering  │
    │ • Mobile Optimization│ │ • Performance Management│
    └───────────────────┘ │ └─────────────────────────┘
                          │
            ┌─────────────▼─────────────┐
            │     Browser APIs          │
            │                           │
            │ • MediaDevices API        │
            │ • Canvas 2D Context       │
            │ • Face-API.js (optional)  │
            │ • File Download API       │
            └───────────────────────────┘
```

### Design Principles

1. **Mobile-First**: All components prioritize mobile device compatibility
2. **Progressive Enhancement**: Core features work without advanced capabilities
3. **Graceful Degradation**: Fallbacks for when features aren't supported
4. **Performance-Conscious**: Optimized for limited mobile resources
5. **Modular**: Components can be enhanced or replaced independently

---

## 🧩 Core Components

### 1. PhotoBoothApp Class (`app.js`)

**Primary controller managing application state and coordination.**

#### Key Responsibilities:
- Camera initialization and management
- Canvas setup and coordinate mapping
- Photo capture pipeline
- Event handling and UI coordination
- Lifecycle management (cleanup, orientation changes)

#### Core Methods:
```javascript
// Initialization
async init()                    // Main app initialization
setupEventListeners()           // Bind UI event handlers
async initCamera()              // Camera access and setup
setupCanvases()                 // Canvas configuration

// Photo Operations
async capturePhoto()            // Capture photo with filters
showPhotoPreview(dataUrl)       // Display captured photo
savePhoto()                     // Download photo to device

// Camera Controls
async switchCamera()            // Toggle front/rear camera
handleOrientationChange()       // Adapt to device rotation
handleVisibilityChange()        // Manage battery optimization

// State Management
selectFilter(filterBtn)         // Change active filter
updateStatus(message)           // Update UI status messages
showError(title, details)       // Display error information

// Cleanup
cleanup()                       // Resource cleanup on app destruction
```

#### State Properties:
```javascript
{
    video: HTMLVideoElement,           // Camera preview element
    overlayCanvas: HTMLCanvasElement,  // Real-time filter overlay
    captureCanvas: HTMLCanvasElement,  // High-quality capture canvas
    stream: MediaStream,               // Camera media stream
    currentFilter: string,             // Active filter ID
    facingMode: string,               // Camera direction ('user'/'environment')
    canvasDisplaySize: Object,        // Canvas display dimensions
    canvasActualSize: Object,         // Canvas actual pixel dimensions
    videoSize: Object,                // Video stream dimensions
    faceDetectionEnabled: boolean     // Face detection availability
}
```

### 2. CameraUtils Class (`camera-utils.js`)

**Utility library providing camera management and device compatibility.**

#### Key Features:
- **Cross-browser compatibility** for getUserMedia API
- **Device-specific optimizations** for iOS, Android, desktop
- **Error handling** with user-friendly messages
- **Performance recommendations** based on device capabilities

#### Core Methods:
```javascript
// Compatibility
static checkCompatibility()              // Feature detection
static getOptimalConstraints(facingMode) // Device-optimized camera settings
static async getAvailableCameras()       // Enumerate video input devices

// Camera Management
static async initCameraWithFallback(facingMode, options)  // Robust camera init
static optimizeVideoForMobile(videoElement)              // Mobile optimizations
static getErrorMessage(error)                            // Human-readable errors

// Utilities
static getOptimalCanvasSize(width, height, maxW, maxH)   // Canvas optimization
static downloadImage(dataUrl, filename)                 // Cross-browser download
static getPixelRatio()                                  // High-DPI display handling
static getPerformanceRecommendations()                  // Device-based settings
```

#### Browser Compatibility Matrix:
```javascript
const compatibility = {
    getUserMedia: boolean,    // Basic camera access
    mediaDevices: boolean,    // Modern MediaDevices API
    canvas: boolean,         // HTML5 Canvas support
    download: boolean,       // File download capability
    orientation: boolean,    // Orientation change events
    touch: boolean          // Touch event support
}
```

### 3. FilterSystem Class (`filters.js`)

**Advanced filter management with face detection integration.**

#### Features:
- **Real-time face detection** using face-api.js
- **Intelligent filter positioning** based on facial landmarks
- **Fallback positioning** when face detection unavailable
- **Multi-face support** for group photos
- **Performance optimization** for mobile devices

#### Core Methods:
```javascript
// Initialization
async init()                           // Initialize filter system
setupFilterConfigurations()            // Configure filter metadata
async startFaceDetection()             // Begin face detection loop

// Rendering
renderFilter(ctx, filterId)           // Render filter on canvas
getFilterPositions(filterId)          // Calculate filter positions
drawFilterAtPosition(ctx, config, pos) // Draw individual filter instance

// Face Detection
async detectFaces()                    // Detect faces in video stream
processFaceDetections(detections)     // Extract positioning data
calculateCenterPoint(points)          // Utility for landmark processing

// Integration
applyFilterToOverlay(ctx, filterId)   // Real-time overlay rendering
applyFilterToCapture(ctx, filterId)   // High-quality capture rendering

// Management
onOrientationChange()                 // Handle device rotation
cleanup()                             // Resource cleanup
```

#### Filter Configuration Schema:
```javascript
const filterConfig = {
    emoji: string,              // Emoji character to display
    baseSize: number,          // Base font size in pixels
    position: string,          // Positioning reference ('forehead'|'top'|'center')
    offsetY: number,           // Vertical offset in pixels
    offsetX: number,           // Horizontal offset in pixels
    scaleWithFace: boolean,    // Whether to scale based on face size
    fallback: {               // Fallback position (relative to canvas)
        x: number,            // Horizontal position (0-1)
        y: number             // Vertical position (0-1)
    }
}
```

---

## 📡 API Reference

### PhotoBoothApp Public API

#### Events
```javascript
// Custom events dispatched by PhotoBoothApp
'camera-initialized'    // Camera successfully started
'camera-error'         // Camera initialization failed
'photo-captured'       // Photo successfully captured
'filter-changed'       // Active filter changed
'orientation-changed'  // Device orientation changed
```

#### Public Methods
```javascript
// External integration points
photoBoothApp.selectFilter(filterId)        // Programmatically change filter
photoBoothApp.capturePhoto()               // Trigger photo capture
photoBoothApp.switchCamera()               // Toggle camera
photoBoothApp.getPerformanceMetrics()      // Get current performance data
```

### Camera Coordinate System

#### Coordinate Mapping
The app uses multiple coordinate systems:

1. **Video Coordinates**: Native camera stream dimensions
2. **Canvas Display Coordinates**: Scaled coordinates for display
3. **Canvas Actual Coordinates**: High-DPI pixel coordinates

```javascript
// Convert between coordinate systems
const canvasCoords = app.getVideoToCanvasCoordinates(videoX, videoY);
const videoCoords = app.getCanvasToVideoCoordinates(canvasX, canvasY);

// Validate canvas alignment
const isAligned = app.validateCanvasAlignment();
if (!isAligned) {
    app.realignCanvas();
}
```

### Filter Integration

#### Adding Custom Filters
```javascript
// 1. Define filter configuration
const customFilter = {
    emoji: '🎄',
    baseSize: 48,
    position: 'forehead',
    offsetY: -20,
    offsetX: 0,
    scaleWithFace: true,
    fallback: { x: 0.5, y: 0.15 }
};

// 2. Register with filter system
filterSystem.filterConfigs['custom-filter'] = customFilter;

// 3. Add UI control
<button class="filter-btn" data-filter="custom-filter">
    <span class="filter-icon">🎄</span>
    <span class="filter-name">Christmas Tree</span>
</button>
```

#### Advanced Filter Types
```javascript
// Image-based filters (future enhancement)
const imageFilter = {
    type: 'image',
    src: 'filters/santa-hat.png',
    position: 'top',
    anchor: 'center-bottom',
    scaleWithFace: true
};

// Animated filters (future enhancement)
const animatedFilter = {
    type: 'animated',
    frames: ['🌟', '⭐', '✨'],
    frameRate: 2,
    position: 'forehead'
};
```

---

## 🛠️ Setup & Development

### Development Environment

#### Prerequisites
```bash
# Required
- Node.js 14+ or Python 3.7+ (for local server)
- Modern web browser with developer tools
- Device with camera (or camera emulation)

# Optional
- Git for version control
- Code editor with JavaScript support
- Mobile device for testing
```

#### Quick Setup
```bash
# Clone repository
git clone <repository-url>
cd photo-booth

# Start development server
python -m http.server 8000
# OR
npx http-server
# OR
php -S localhost:8000

# Open in browser
open http://localhost:8000
```

#### Development Workflow

1. **Local Development**
   ```bash
   # Edit files with live reload
   # Test in Chrome DevTools device emulation
   # Use console for debugging
   ```

2. **Mobile Testing**
   ```bash
   # Get local IP address
   ipconfig getifaddr en0  # macOS
   # or
   hostname -I | awk '{print $1}'  # Linux
   
   # Access from mobile device
   http://<your-ip>:8000
   ```

3. **Performance Profiling**
   ```javascript
   // Enable debug mode
   photoBoothApp.debug = true;
   
   // Monitor performance
   const metrics = photoBoothApp.getPerformanceMetrics();
   console.log('Performance:', metrics);
   ```

### File Structure Explained

```
photo-booth/
├── index.html                 # Application entry point
│   ├── Meta tags for mobile optimization
│   ├── Face-API.js CDN integration
│   └── Semantic HTML structure
│
├── app.js                     # Core application logic (626 lines)
│   ├── PhotoBoothApp class definition
│   ├── Camera management
│   ├── Canvas operations
│   ├── Photo capture pipeline
│   └── Event handling
│
├── camera-utils.js           # Camera utilities (646 lines)
│   ├── Browser compatibility detection
│   ├── Device-specific optimizations
│   ├── Error handling utilities
│   └── Performance helpers
│
├── filters.js                # Filter system (465 lines)
│   ├── FilterSystem class definition
│   ├── Face detection integration
│   ├── Filter positioning logic
│   └── Real-time rendering
│
├── styles.css               # Responsive styling (509 lines)
│   ├── Mobile-first design
│   ├── Touch-friendly controls
│   ├── Festive theme
│   └── Cross-browser compatibility
│
├── README.md               # User documentation
├── TECHNICAL.md           # This technical guide
└── TROUBLESHOOTING.md    # Common issues & solutions
```

### Code Organization

#### Module Pattern
```javascript
// Each component follows consistent patterns:

// 1. Class definition with constructor
class ComponentName {
    constructor(dependencies) {
        this.property = value;
        this.init();
    }
    
    // 2. Initialization method
    async init() {
        // Setup code
    }
    
    // 3. Public API methods
    publicMethod() {
        // External interface
    }
    
    // 4. Private implementation
    privateMethod() {
        // Internal logic
    }
    
    // 5. Cleanup method
    cleanup() {
        // Resource cleanup
    }
}
```

#### Event-Driven Architecture
```javascript
// Components communicate via events
photoBoothApp.addEventListener('camera-initialized', () => {
    filterSystem.startFaceDetection();
});

// DOM events with delegation
document.addEventListener('click', (event) => {
    if (event.target.matches('.filter-btn')) {
        handleFilterSelection(event.target);
    }
});
```

---

## 🌐 Browser Compatibility

### Feature Detection Strategy

```javascript
// Progressive enhancement approach
const features = CameraUtils.checkCompatibility();

if (features.mediaDevices) {
    // Use modern MediaDevices API
    initModernCamera();
} else if (features.getUserMedia) {
    // Fallback to legacy API
    initLegacyCamera();
} else {
    // Show upload alternative
    showUploadFallback();
}
```

### Mobile-Specific Considerations

#### iOS Safari
```javascript
// iOS-specific optimizations
if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
    // Lower frame rate for battery life
    constraints.video.frameRate = { ideal: 15, max: 30 };
    
    // Ensure playsinline attribute
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    
    // Handle iOS permission flow
    video.muted = true; // Required for autoplay
}
```

#### Android Chrome
```javascript
// Android optimizations
if (/android/i.test(navigator.userAgent)) {
    // Higher resolution support
    constraints.video.width = { ideal: 1280, max: 1920 };
    constraints.video.height = { ideal: 720, max: 1080 };
    
    // Handle Android-specific camera switching
    if (capabilities.facingMode) {
        constraints.video.facingMode = { exact: facingMode };
    }
}
```

### Cross-Browser Testing Matrix

| Feature | Chrome | Safari | Firefox | Edge | Support Level |
|---------|--------|--------|---------|------|---------------|
| getUserMedia | ✅ | ✅ | ✅ | ✅ | Universal |
| Camera switching | ✅ | ✅ | ⚠️ | ✅ | Limited Firefox |
| High-DPI canvas | ✅ | ✅ | ✅ | ✅ | Universal |
| Download API | ✅ | ✅ | ✅ | ✅ | Universal |
| Face detection | ✅ | ✅ | ✅ | ✅ | Library-dependent |
| Touch events | ✅ | ✅ | ✅ | ✅ | Universal |

---

## ⚡ Performance Optimization

### Mobile Performance Strategy

#### Memory Management
```javascript
// Canvas size optimization
const optimalSize = CameraUtils.getOptimalCanvasSize(
    videoWidth, 
    videoHeight,
    1280,  // Max width for mobile
    720    // Max height for mobile
);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    photoBoothApp.cleanup();
});
```

#### Rendering Performance
```javascript
// Throttled face detection (5fps)
const detectionInterval = setInterval(() => {
    this.detectFaces();
}, 200); // 200ms = 5fps

// Throttled filter rendering (15fps)
const renderLoop = () => {
    if (this.overlayRenderingActive) {
        this.applyFilterToOverlay();
        setTimeout(() => requestAnimationFrame(renderLoop), 66); // 66ms = 15fps
    }
};
```

### Performance Monitoring

#### Built-in Metrics
```javascript
// Get performance data
const metrics = {
    cameraStartupTime: number,      // Camera initialization duration
    filterRenderingFPS: number,     // Current rendering frame rate
    faceDetectionLatency: number,   // Detection processing time
    memoryUsage: number,            // Approximate memory usage
    detectedFaces: number,          // Number of faces in current frame
    isUsingFallback: boolean        // Whether fallback positioning is active
};

// Performance recommendations
const recommendations = CameraUtils.getPerformanceRecommendations();
```

#### Optimization Techniques

1. **Lazy Loading**: Face detection models loaded on-demand
2. **Throttling**: Reduced frame rates for battery preservation
3. **Canvas Optimization**: Pixel-perfect sizing for device DPI
4. **Memory Cleanup**: Proper stream and interval cleanup
5. **Progressive Enhancement**: Core features work without expensive operations

### Battery Optimization

```javascript
// Pause camera when page hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        video.pause();
        stopFaceDetection();
    } else {
        video.play();
        startFaceDetection();
    }
});

// Reduce processing on low battery
if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
        if (battery.level < 0.2) {
            // Enable power saving mode
            filterSystem.reducedProcessing = true;
        }
    });
}
```

---

## 🔐 Security Considerations

### Camera Privacy

#### Permission Management
```javascript
// Request minimal permissions
const constraints = {
    video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
    },
    audio: false  // No audio recording
};

// Handle permission errors gracefully
catch (error) {
    if (error.name === 'NotAllowedError') {
        showPrivacyExplanation();
    }
}
```

#### Data Handling
- **No Data Transmission**: All processing happens locally
- **No Storage**: Photos not saved to server
- **No Analytics**: No tracking or data collection
- **Local Processing**: Face detection runs in browser

### Content Security Policy

```html
<!-- Recommended CSP headers -->
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob:;
    connect-src 'self';
    media-src 'self';
">
```

### Browser Security Features

```javascript
// Ensure HTTPS for camera access (production)
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    console.warn('Camera requires HTTPS in production');
    showHTTPSWarning();
}

// Validate data URLs before download
const isValidDataURL = (dataUrl) => {
    return dataUrl.startsWith('data:image/jpeg;base64,') || 
           dataUrl.startsWith('data:image/png;base64,');
};
```

---

## 🚀 Deployment

### Production Checklist

#### Pre-deployment
- [ ] **HTTPS Setup**: Camera requires secure connection
- [ ] **CDN Configuration**: Face-API.js from reliable CDN
- [ ] **Error Tracking**: Implement error reporting
- [ ] **Performance Monitoring**: Add analytics for performance issues
- [ ] **Browser Testing**: Verify on target devices/browsers

#### Build Process
```bash
# No build process required - vanilla JavaScript
# Optional optimizations:
# - Minify JavaScript/CSS
# - Optimize images
# - Add service worker for PWA

# Basic file serving
cp -r photo-booth/ /var/www/html/
```

#### Server Configuration

##### Apache (.htaccess)
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Cache static assets
<FilesMatch "\.(js|css|jpg|jpeg|png|gif|ico)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</FilesMatch>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

##### Nginx
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        root /var/www/html/photo-booth;
        index index.html;
        
        # Cache static assets
        location ~* \.(js|css|jpg|jpeg|png|gif|ico)$ {
            expires 1M;
            add_header Cache-Control "public, immutable";
        }
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/javascript;
}
```

### CDN & Performance

#### Face-API.js Considerations
```html
<!-- Primary CDN -->
<script src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>

<!-- Fallback CDN -->
<script>
if (!window.faceapi) {
    document.write('<script src="https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js"><\/script>');
}
</script>
```

#### Performance Monitoring
```javascript
// Basic performance tracking
const performanceData = {
    loadTime: performance.now(),
    cameraInitTime: null,
    firstFilterRender: null
};

// Send to analytics (if needed)
function trackPerformance(eventName, duration) {
    // gtag('event', eventName, { event_duration: duration });
    console.log(`Performance: ${eventName} took ${duration}ms`);
}
```

### Progressive Web App (PWA) Enhancement

#### Service Worker (optional)
```javascript
// sw.js - Basic caching for offline capability
const CACHE_NAME = 'photo-booth-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/app.js',
    '/camera-utils.js',
    '/filters.js',
    '/styles.css'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});
```

#### Web App Manifest
```json
{
    "name": "Fun House Photo Booth",
    "short_name": "Photo Booth",
    "description": "Take festive photos with fun filters",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#1e3c72",
    "theme_color": "#d32f2f",
    "icons": [
        {
            "src": "icons/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

---

## 🔍 Debugging & Monitoring

### Debug Mode

```javascript
// Enable verbose logging
photoBoothApp.debug = true;

// Debug information includes:
// - Camera initialization steps
// - Canvas coordinate mapping
// - Filter positioning calculations
// - Performance metrics
// - Face detection results

// Example debug output
console.log('Debug Info:', {
    videoSize: { width: 1280, height: 720 },
    canvasSize: { width: 640, height: 360 },
    detectedFaces: 1,
    filterPosition: { x: 320, y: 90 },
    renderingFPS: 15
});
```

### Error Reporting

```javascript
// Centralized error handling
function reportError(error, context) {
    const errorData = {
        message: error.message,
        stack: error.stack,
        context: context,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    };
    
    // Log locally
    console.error('Application Error:', errorData);
    
    // Send to monitoring service (if configured)
    // sendToErrorReporting(errorData);
}

// Usage
try {
    await initCamera();
} catch (error) {
    reportError(error, 'camera-initialization');
}
```

### Performance Profiling

```javascript
// Built-in performance measurement
class PerformanceProfiler {
    constructor() {
        this.marks = {};
        this.measures = {};
    }
    
    mark(name) {
        this.marks[name] = performance.now();
    }
    
    measure(name, startMark) {
        const duration = performance.now() - this.marks[startMark];
        this.measures[name] = duration;
        console.log(`${name}: ${duration.toFixed(2)}ms`);
        return duration;
    }
    
    getReport() {
        return {
            marks: this.marks,
            measures: this.measures
        };
    }
}

// Usage
const profiler = new PerformanceProfiler();
profiler.mark('camera-start');
await initCamera();
profiler.measure('camera-initialization', 'camera-start');
```

---

## 📚 Additional Resources

### Browser APIs Documentation
- [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [File API](https://developer.mozilla.org/en-US/docs/Web/API/File)

### Libraries & Dependencies
- [Face-API.js](https://github.com/justadudewhohacks/face-api.js/) - Face detection library
- [TensorFlow.js](https://www.tensorflow.org/js) - Machine learning platform

### Testing Resources
- [BrowserStack](https://www.browserstack.com/) - Cross-browser testing
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) - Development tools
- [WebPageTest](https://www.webpagetest.org/) - Performance analysis

---

**Built with modern web technologies for maximum compatibility and performance! 🚀**

*This technical documentation covers the complete architecture and implementation details of the Fun House Photo Booth application.*