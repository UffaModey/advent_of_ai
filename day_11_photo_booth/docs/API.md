# 🔌 Developer API Reference

## Fun House Photo Booth - Public API Documentation

This document provides comprehensive API documentation for developers who want to integrate with or extend the Fun House Photo Booth application.

---

## 📋 Table of Contents

1. [Core Classes](#core-classes)
2. [Public Methods](#public-methods)
3. [Event System](#event-system)
4. [Configuration API](#configuration-api)
5. [Extension Points](#extension-points)
6. [Code Examples](#code-examples)

---

## 🏗️ Core Classes

### PhotoBoothApp

The main application controller that manages camera, canvas, and photo operations.

```javascript
class PhotoBoothApp {
    constructor()
    async init()
    cleanup()
}
```

#### Properties

| Property | Type | Description | Access |
|----------|------|-------------|---------|
| `video` | `HTMLVideoElement` | Camera preview element | Public |
| `overlayCanvas` | `HTMLCanvasElement` | Real-time filter overlay | Public |
| `captureCanvas` | `HTMLCanvasElement` | High-quality capture canvas | Public |
| `stream` | `MediaStream` | Active camera stream | Public |
| `currentFilter` | `string` | Currently selected filter ID | Public |
| `facingMode` | `string` | Camera direction ('user'/'environment') | Public |
| `faceDetectionEnabled` | `boolean` | Face detection availability | Read-only |
| `canvasDisplaySize` | `Object` | Canvas display dimensions | Read-only |
| `videoSize` | `Object` | Video stream dimensions | Read-only |

#### State Constants

```javascript
const CAMERA_STATES = {
    INITIALIZING: 'initializing',
    READY: 'ready',
    ERROR: 'error',
    SWITCHING: 'switching'
};

const FILTER_STATES = {
    NONE: 'none',
    LOADING: 'loading', 
    ACTIVE: 'active',
    ERROR: 'error'
};
```

---

## 🔧 Public Methods

### Core Application Methods

#### `selectFilter(filterId: string): void`

Programmatically change the active filter.

```javascript
// Change to reindeer antlers filter
photoBoothApp.selectFilter('reindeer-antlers');

// Remove all filters
photoBoothApp.selectFilter('none');
```

**Parameters:**
- `filterId` (string): Filter identifier ('none', 'snowflake-crown', 'reindeer-antlers', 'santa-hat')

**Returns:** `void`

**Throws:** 
- `Error` if filter ID is invalid
- `Error` if filter system not initialized

---

#### `async capturePhoto(): Promise<string>`

Capture a photo with the currently applied filter.

```javascript
try {
    const dataUrl = await photoBoothApp.capturePhoto();
    console.log('Photo captured:', dataUrl.substring(0, 50) + '...');
} catch (error) {
    console.error('Photo capture failed:', error);
}
```

**Returns:** `Promise<string>` - Base64 encoded JPEG data URL

**Throws:**
- `Error` if camera not ready
- `Error` if capture canvas not initialized
- `Error` if photo processing fails

---

#### `async switchCamera(): Promise<void>`

Toggle between front and rear cameras.

```javascript
try {
    await photoBoothApp.switchCamera();
    console.log('Camera switched to:', photoBoothApp.facingMode);
} catch (error) {
    console.error('Camera switch failed:', error);
}
```

**Returns:** `Promise<void>`

**Throws:**
- `Error` if camera switching not supported
- `Error` if camera initialization fails
- `Error` if only one camera available

---

#### `getPerformanceMetrics(): Object`

Get current application performance data.

```javascript
const metrics = photoBoothApp.getPerformanceMetrics();
console.log('Performance metrics:', metrics);
```

**Returns:** 
```javascript
{
    cameraStartupTime: number,      // Camera initialization time (ms)
    filterRenderingFPS: number,     // Current rendering frame rate
    faceDetectionLatency: number,   // Face detection processing time (ms)
    memoryUsage: number,            // Approximate memory usage (MB)
    detectedFaces: number,          // Number of faces in current frame
    isUsingFallback: boolean        // Whether using fallback positioning
}
```

---

### Coordinate System Methods

#### `getVideoToCanvasCoordinates(videoX: number, videoY: number): Object`

Convert video stream coordinates to canvas coordinates.

```javascript
const canvasCoords = photoBoothApp.getVideoToCanvasCoordinates(100, 50);
console.log('Canvas coordinates:', canvasCoords); // { x: 200, y: 100 }
```

**Parameters:**
- `videoX` (number): X coordinate in video stream space
- `videoY` (number): Y coordinate in video stream space

**Returns:** `{ x: number, y: number }`

---

#### `getCanvasToVideoCoordinates(canvasX: number, canvasY: number): Object`

Convert canvas coordinates to video stream coordinates.

```javascript
const videoCoords = photoBoothApp.getCanvasToVideoCoordinates(200, 100);
console.log('Video coordinates:', videoCoords); // { x: 100, y: 50 }
```

**Parameters:**
- `canvasX` (number): X coordinate in canvas space
- `canvasY` (number): Y coordinate in canvas space

**Returns:** `{ x: number, y: number }`

---

### Utility Methods

#### `validateCanvasAlignment(): boolean`

Check if overlay canvas is properly aligned with video element.

```javascript
const isAligned = photoBoothApp.validateCanvasAlignment();
if (!isAligned) {
    photoBoothApp.realignCanvas();
}
```

**Returns:** `boolean` - True if canvas is properly aligned

---

#### `realignCanvas(): void`

Force realignment of overlay canvas with video element.

```javascript
// Trigger realignment after orientation change
photoBoothApp.realignCanvas();
```

**Returns:** `void`

---

## 📡 Event System

### Custom Events

The PhotoBoothApp dispatches custom events that you can listen for:

#### `camera-initialized`

Fired when camera successfully starts.

```javascript
photoBoothApp.addEventListener('camera-initialized', (event) => {
    console.log('Camera ready:', event.detail);
    // Enable UI elements that require camera
    enablePhotoFeatures();
});
```

**Event Detail:**
```javascript
{
    videoWidth: number,
    videoHeight: number,
    facingMode: string,
    deviceId: string
}
```

---

#### `camera-error`

Fired when camera initialization fails.

```javascript
photoBoothApp.addEventListener('camera-error', (event) => {
    console.error('Camera failed:', event.detail);
    // Show fallback UI or error message
    showCameraError(event.detail.error);
});
```

**Event Detail:**
```javascript
{
    error: Error,
    errorType: string,  // 'permission', 'hardware', 'unsupported'
    canRetry: boolean
}
```

---

#### `photo-captured`

Fired when photo is successfully captured.

```javascript
photoBoothApp.addEventListener('photo-captured', (event) => {
    console.log('Photo captured:', event.detail);
    // Auto-upload, analytics, etc.
    trackPhotoCapture(event.detail);
});
```

**Event Detail:**
```javascript
{
    dataUrl: string,
    filter: string,
    timestamp: number,
    dimensions: { width: number, height: number }
}
```

---

#### `filter-changed`

Fired when active filter changes.

```javascript
photoBoothApp.addEventListener('filter-changed', (event) => {
    console.log('Filter changed:', event.detail);
    // Update UI, analytics, etc.
    updateFilterAnalytics(event.detail.filter);
});
```

**Event Detail:**
```javascript
{
    previousFilter: string,
    currentFilter: string,
    timestamp: number
}
```

---

#### `orientation-changed`

Fired when device orientation changes.

```javascript
photoBoothApp.addEventListener('orientation-changed', (event) => {
    console.log('Orientation changed:', event.detail);
    // Adjust UI layout
    handleOrientationChange(event.detail);
});
```

**Event Detail:**
```javascript
{
    orientation: string,  // 'portrait', 'landscape'
    angle: number,       // Orientation angle
    dimensions: { width: number, height: number }
}
```

---

### Event Listener Management

#### Adding Event Listeners

```javascript
// Add event listener
const handler = (event) => console.log('Event:', event.detail);
photoBoothApp.addEventListener('camera-initialized', handler);

// Add multiple events
const events = ['photo-captured', 'filter-changed'];
events.forEach(eventName => {
    photoBoothApp.addEventListener(eventName, handler);
});
```

#### Removing Event Listeners

```javascript
// Remove specific listener
photoBoothApp.removeEventListener('camera-initialized', handler);

// Remove all listeners for an event
photoBoothApp.removeAllListeners('photo-captured');
```

---

## ⚙️ Configuration API

### Filter Configuration

#### Adding Custom Filters

```javascript
// Define custom filter
const customFilter = {
    emoji: '🎄',
    baseSize: 48,
    position: 'forehead',
    offsetY: -20,
    offsetX: 0,
    scaleWithFace: true,
    fallback: { x: 0.5, y: 0.15 }
};

// Register filter
photoBoothApp.filterSystem.filterConfigs['christmas-tree'] = customFilter;

// Add UI button
const filterButton = document.createElement('button');
filterButton.className = 'filter-btn';
filterButton.dataset.filter = 'christmas-tree';
filterButton.innerHTML = `
    <span class="filter-icon">🎄</span>
    <span class="filter-name">Christmas Tree</span>
`;
document.querySelector('.filter-buttons').appendChild(filterButton);
```

#### Filter Configuration Schema

```javascript
const FilterConfig = {
    emoji: string,              // Emoji character or text
    baseSize: number,          // Base font size (pixels)
    position: string,          // 'forehead' | 'top' | 'center' | 'chin'
    offsetY: number,           // Vertical offset (pixels)
    offsetX: number,           // Horizontal offset (pixels)
    scaleWithFace: boolean,    // Scale based on face size
    fallback: {               // Fallback position (0-1 relative)
        x: number,            // Horizontal position
        y: number             // Vertical position
    },
    // Advanced options
    rotation?: number,         // Rotation angle (degrees)
    opacity?: number,         // Opacity (0-1)
    shadow?: {                // Text shadow
        color: string,
        blur: number,
        offsetX: number,
        offsetY: number
    }
}
```

---

### Camera Configuration

#### Custom Camera Constraints

```javascript
// Override camera settings
const customConstraints = {
    video: {
        width: { ideal: 1920, max: 1920 },
        height: { ideal: 1080, max: 1080 },
        frameRate: { ideal: 30, max: 60 },
        facingMode: 'user'
    }
};

// Apply custom constraints
await photoBoothApp.initCamera(customConstraints);
```

#### Performance Settings

```javascript
// Configure performance settings
photoBoothApp.performanceSettings = {
    maxCanvasSize: { width: 1280, height: 720 },
    targetFrameRate: 15,
    enableHighDPI: true,
    faceDetectionEnabled: true,
    faceDetectionInterval: 200  // milliseconds
};
```

---

## 🔌 Extension Points

### Custom Filter Renderers

Create custom filter rendering logic:

```javascript
class CustomFilterRenderer {
    constructor(photoBoothApp) {
        this.app = photoBoothApp;
    }
    
    renderCustomFilter(ctx, filterId, position) {
        switch (filterId) {
            case 'animated-sparkle':
                this.renderAnimatedSparkle(ctx, position);
                break;
            case 'gradient-overlay':
                this.renderGradientOverlay(ctx, position);
                break;
        }
    }
    
    renderAnimatedSparkle(ctx, position) {
        const sparkles = ['✨', '🌟', '💫'];
        const frame = Math.floor(Date.now() / 500) % sparkles.length;
        
        ctx.save();
        ctx.font = `${position.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(sparkles[frame], position.x, position.y);
        ctx.restore();
    }
}

// Register custom renderer
photoBoothApp.customRenderer = new CustomFilterRenderer(photoBoothApp);
```

---

### Custom Camera Handlers

Extend camera functionality:

```javascript
class CustomCameraHandler {
    constructor(photoBoothApp) {
        this.app = photoBoothApp;
    }
    
    async initSpecialCamera() {
        // Custom camera initialization logic
        const stream = await this.getHighQualityStream();
        this.app.video.srcObject = stream;
    }
    
    async getHighQualityStream() {
        return await navigator.mediaDevices.getUserMedia({
            video: {
                width: 3840,
                height: 2160,
                frameRate: 60
            }
        });
    }
}
```

---

### Custom Photo Processors

Add post-processing to captured photos:

```javascript
class PhotoProcessor {
    constructor(photoBoothApp) {
        this.app = photoBoothApp;
    }
    
    async processPhoto(canvas) {
        // Apply custom effects
        const ctx = canvas.getContext('2d');
        
        // Add watermark
        this.addWatermark(ctx, canvas.width, canvas.height);
        
        // Apply color correction
        this.enhanceColors(ctx, canvas.width, canvas.height);
        
        return canvas.toDataURL('image/jpeg', 0.95);
    }
    
    addWatermark(ctx, width, height) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'right';
        ctx.fillText('Fun House Photo Booth', width - 20, height - 20);
        ctx.restore();
    }
    
    enhanceColors(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Simple brightness/contrast enhancement
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.1);     // Red
            data[i + 1] = Math.min(255, data[i + 1] * 1.1); // Green
            data[i + 2] = Math.min(255, data[i + 2] * 1.1); // Blue
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
}

// Hook into photo capture
const originalCapturePhoto = photoBoothApp.capturePhoto;
photoBoothApp.capturePhoto = async function() {
    // Capture photo normally
    await originalCapturePhoto.call(this);
    
    // Apply custom processing
    const processor = new PhotoProcessor(this);
    return await processor.processPhoto(this.captureCanvas);
};
```

---

## 💡 Code Examples

### Complete Integration Example

```javascript
class PhotoBoothIntegration {
    constructor() {
        this.photoBoothApp = null;
        this.photos = [];
        this.analytics = new Analytics();
    }
    
    async init() {
        // Wait for PhotoBoothApp to be available
        await this.waitForApp();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Configure custom settings
        this.configureApp();
        
        console.log('Photo Booth integration ready!');
    }
    
    waitForApp() {
        return new Promise((resolve) => {
            const checkApp = () => {
                if (window.photoBoothApp) {
                    this.photoBoothApp = window.photoBoothApp;
                    resolve();
                } else {
                    setTimeout(checkApp, 100);
                }
            };
            checkApp();
        });
    }
    
    setupEventListeners() {
        // Track camera usage
        this.photoBoothApp.addEventListener('camera-initialized', (event) => {
            this.analytics.track('camera_started', event.detail);
        });
        
        // Auto-save photos
        this.photoBoothApp.addEventListener('photo-captured', (event) => {
            this.savePhoto(event.detail);
            this.analytics.track('photo_captured', {
                filter: event.detail.filter,
                timestamp: event.detail.timestamp
            });
        });
        
        // Track filter usage
        this.photoBoothApp.addEventListener('filter-changed', (event) => {
            this.analytics.track('filter_selected', {
                filter: event.detail.currentFilter
            });
        });
    }
    
    configureApp() {
        // Add custom filters
        this.addCustomFilters();
        
        // Set performance options
        this.photoBoothApp.performanceSettings = {
            maxCanvasSize: { width: 1920, height: 1080 },
            enableHighDPI: true
        };
    }
    
    addCustomFilters() {
        const customFilters = [
            {
                id: 'party-hat',
                emoji: '🎉',
                baseSize: 45,
                position: 'top',
                offsetY: -30
            },
            {
                id: 'sunglasses',
                emoji: '😎',
                baseSize: 40,
                position: 'center',
                offsetY: -10
            }
        ];
        
        customFilters.forEach(filter => {
            this.photoBoothApp.filterSystem.filterConfigs[filter.id] = {
                emoji: filter.emoji,
                baseSize: filter.baseSize,
                position: filter.position,
                offsetY: filter.offsetY,
                offsetX: 0,
                scaleWithFace: true,
                fallback: { x: 0.5, y: 0.15 }
            };
            
            this.createFilterButton(filter);
        });
    }
    
    createFilterButton(filter) {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.filter = filter.id;
        button.innerHTML = `
            <span class="filter-icon">${filter.emoji}</span>
            <span class="filter-name">${filter.id.replace('-', ' ')}</span>
        `;
        
        document.querySelector('.filter-buttons').appendChild(button);
    }
    
    savePhoto(photoData) {
        // Save to local storage or send to server
        const photoRecord = {
            id: Date.now(),
            dataUrl: photoData.dataUrl,
            filter: photoData.filter,
            timestamp: photoData.timestamp,
            metadata: {
                dimensions: photoData.dimensions,
                userAgent: navigator.userAgent
            }
        };
        
        this.photos.push(photoRecord);
        localStorage.setItem('photoBoothPhotos', JSON.stringify(this.photos));
        
        console.log('Photo saved:', photoRecord.id);
    }
    
    // Public API methods
    async takePhotoWithFilter(filterId) {
        this.photoBoothApp.selectFilter(filterId);
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for filter to apply
        return await this.photoBoothApp.capturePhoto();
    }
    
    getPhotos() {
        return this.photos;
    }
    
    clearPhotos() {
        this.photos = [];
        localStorage.removeItem('photoBoothPhotos');
    }
}

// Initialize integration
const integration = new PhotoBoothIntegration();
integration.init();
```

---

### Performance Monitoring Example

```javascript
class PerformanceMonitor {
    constructor(photoBoothApp) {
        this.app = photoBoothApp;
        this.metrics = {
            frameRates: [],
            captureeTimes: [],
            errors: []
        };
        
        this.startMonitoring();
    }
    
    startMonitoring() {
        // Monitor frame rate
        this.monitorFrameRate();
        
        // Monitor capture performance
        this.monitorCapturePerformance();
        
        // Monitor errors
        this.monitorErrors();
        
        // Report every 30 seconds
        setInterval(() => this.reportMetrics(), 30000);
    }
    
    monitorFrameRate() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = frameCount;
                this.metrics.frameRates.push(fps);
                frameCount = 0;
                lastTime = currentTime;
                
                // Keep only last 60 seconds of data
                if (this.metrics.frameRates.length > 60) {
                    this.metrics.frameRates.shift();
                }
            }
            
            if (this.app.overlayRenderingActive) {
                requestAnimationFrame(measureFPS);
            }
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    monitorCapturePerformance() {
        const originalCapture = this.app.capturePhoto.bind(this.app);
        
        this.app.capturePhoto = async function() {
            const startTime = performance.now();
            
            try {
                const result = await originalCapture();
                const duration = performance.now() - startTime;
                
                this.metrics.captureTimes.push(duration);
                if (this.metrics.captureTimes.length > 100) {
                    this.metrics.captureTimes.shift();
                }
                
                return result;
            } catch (error) {
                const duration = performance.now() - startTime;
                this.metrics.errors.push({
                    type: 'capture_error',
                    error: error.message,
                    duration: duration,
                    timestamp: Date.now()
                });
                throw error;
            }
        }.bind(this);
    }
    
    monitorErrors() {
        // Monitor JavaScript errors
        window.addEventListener('error', (event) => {
            this.metrics.errors.push({
                type: 'javascript_error',
                error: event.error.message,
                filename: event.filename,
                line: event.lineno,
                timestamp: Date.now()
            });
        });
        
        // Monitor unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.metrics.errors.push({
                type: 'promise_rejection',
                error: event.reason,
                timestamp: Date.now()
            });
        });
    }
    
    reportMetrics() {
        const report = {
            averageFPS: this.calculateAverage(this.metrics.frameRates),
            averageCaptureTime: this.calculateAverage(this.metrics.captureTimes),
            errorCount: this.metrics.errors.length,
            recentErrors: this.metrics.errors.slice(-5),
            timestamp: Date.now()
        };
        
        console.log('Performance Report:', report);
        
        // Send to analytics service
        // this.sendToAnalytics(report);
        
        return report;
    }
    
    calculateAverage(array) {
        if (array.length === 0) return 0;
        return array.reduce((sum, val) => sum + val, 0) / array.length;
    }
}

// Usage
const monitor = new PerformanceMonitor(photoBoothApp);
```

---

This API documentation provides comprehensive integration points for extending the Fun House Photo Booth application. The modular design allows for easy customization while maintaining core functionality.

**For additional examples and integration patterns, see the main [TECHNICAL.md](../TECHNICAL.md) documentation.**