# 🤝 Contributing to Fun House Photo Booth

Welcome to the Fun House Photo Booth project! We're excited that you're interested in contributing to this festive photo booth application. This guide will help you get started with development, understand our conventions, and make meaningful contributions.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Git** for version control
- **Modern web browser** (Chrome, Safari, Firefox) with developer tools
- **Local web server** capability (Python, Node.js, or PHP)
- **Basic understanding** of JavaScript, HTML5, and CSS
- **Device with camera** for testing (or browser camera emulation)

### Quick Setup

```bash
# Clone the repository
git clone <repository-url>
cd fun-house-photo-booth

# Start development server
python -m http.server 8000
# OR
npx http-server
# OR  
php -S localhost:8000

# Open in browser
open http://localhost:8000
```

### Development Environment

#### Recommended Tools
- **Code Editor**: VS Code, WebStorm, or similar with JavaScript support
- **Browser DevTools**: Chrome DevTools or Safari Web Inspector
- **Version Control**: Git with clear commit messages
- **Testing**: Real mobile devices for accurate testing

#### Browser Setup
```javascript
// Enable debug mode for development
photoBoothApp.debug = true;

// Access performance metrics
console.log(photoBoothApp.getPerformanceData());

// Monitor face detection
console.log(photoBoothApp.filterSystem.getPerformanceMetrics());
```

---

## 📁 Project Structure

Understanding the codebase structure will help you navigate and contribute effectively:

```
fun-house-photo-booth/
├── index.html              # Main HTML structure
├── app.js                  # Core PhotoBoothApp class (626 lines)
├── filters.js              # FilterSystem with face detection (465 lines)
├── camera-utils.js         # Camera utilities & compatibility (646 lines)
├── performance-utils.js    # Performance monitoring (400+ lines)
├── styles.css              # Mobile-first responsive styling (509 lines)
├── docs/                   # Documentation
│   ├── README.md           # User guide
│   ├── TECHNICAL.md        # Developer documentation
│   ├── DEPLOYMENT.md       # Production deployment guide
│   ├── TROUBLESHOOTING.md  # Common issues & solutions
│   ├── PROJECT_STATUS.md   # Current project status
│   └── CONTRIBUTING.md     # This file
└── tests/                  # Test files (future)
    ├── unit/
    ├── integration/
    └── e2e/
```

### Core Components

#### 1. PhotoBoothApp (`app.js`)
**Responsibility:** Main application controller
- Camera initialization and management
- Canvas setup and coordinate mapping
- Photo capture pipeline
- Event handling and UI coordination

#### 2. FilterSystem (`filters.js`)
**Responsibility:** Filter management with face detection
- Real-time face detection using TinyFaceDetector
- Filter positioning and rendering
- Performance optimization for mobile devices

#### 3. CameraUtils (`camera-utils.js`)
**Responsibility:** Cross-browser camera compatibility
- Browser feature detection
- Device-specific optimizations
- Error handling and user-friendly messages

#### 4. PerformanceUtils (`performance-utils.js`)
**Responsibility:** Performance monitoring and optimization
- Real-time metrics collection
- Device capability analysis
- Automatic optimization recommendations

---

## 🛠️ Development Guidelines

### Code Style & Standards

#### JavaScript Conventions
```javascript
// Use clear, descriptive names
const filterSystem = new FilterSystem(photoBoothApp);

// Document public methods with JSDoc
/**
 * Apply filter to canvas with performance optimization.
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} filterId - Filter identifier
 * @returns {boolean} Success status
 */
applyFilter(ctx, filterId) {
    // Implementation
}

// Use consistent error handling
try {
    await this.initCamera();
} catch (error) {
    console.error('Camera initialization failed:', error);
    this.showError('Camera Error', CameraUtils.getErrorMessage(error).message);
}

// Prefer modern JavaScript features
const { width, height } = this.getCanvasSize();
const filters = [...this.availableFilters];
```

#### CSS Conventions
```css
/* Use mobile-first approach */
.photo-booth {
    /* Mobile styles first */
    padding: 1rem;
}

@media (min-width: 768px) {
    .photo-booth {
        /* Tablet and up */
        padding: 2rem;
    }
}

/* Use BEM naming convention */
.filter-btn {
    /* Block */
}

.filter-btn__icon {
    /* Element */
}

.filter-btn--active {
    /* Modifier */
}
```

#### HTML Structure
```html
<!-- Use semantic HTML -->
<main class="photo-booth" role="main">
    <section class="camera-section" aria-label="Camera Preview">
        <video id="videoElement" aria-hidden="true"></video>
        <canvas id="overlayCanvas" aria-hidden="true"></canvas>
    </section>
    
    <section class="controls" aria-label="Photo Booth Controls">
        <button class="filter-btn" data-filter="santa-hat" aria-label="Santa Hat Filter">
            <span class="filter-icon" aria-hidden="true">🎅</span>
            <span class="filter-name">Santa Hat</span>
        </button>
    </section>
</main>
```

### Performance Guidelines

#### Mobile Performance
```javascript
// Throttle expensive operations
const renderLoop = () => {
    if (performance.now() - lastRender < 66) { // 15fps
        requestAnimationFrame(renderLoop);
        return;
    }
    
    // Render logic
    lastRender = performance.now();
    requestAnimationFrame(renderLoop);
};

// Use device-specific optimizations
const deviceInfo = PerformanceMonitor.classifyDevicePerformance();
if (deviceInfo.deviceClass === 'low') {
    // Reduce quality for low-end devices
    this.enableHighQualityEffects = false;
    this.faceDetectionInterval = 500; // Slower detection
}
```

#### Memory Management
```javascript
// Clean up resources
cleanup() {
    // Stop camera streams
    if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
    }
    
    // Clear intervals
    if (this.detectionInterval) {
        clearInterval(this.detectionInterval);
    }
    
    // Remove event listeners
    this.removeEventListeners();
}
```

### Browser Compatibility

#### Target Support Matrix
- **Primary:** iOS Safari 12+, Chrome 70+
- **Secondary:** Firefox 68+, Edge 79+
- **Testing:** Real devices preferred over emulation

#### Feature Detection
```javascript
// Check for required features
const compatibility = CameraUtils.checkCompatibility();
if (!compatibility.getUserMedia) {
    throw new Error('Camera not supported');
}

// Progressive enhancement
if (typeof faceapi !== 'undefined') {
    await this.initFaceDetection();
} else {
    console.warn('Face detection unavailable, using fallback positioning');
}
```

---

## 🎨 Adding New Features

### Adding Custom Filters

#### 1. Define Filter Configuration
```javascript
// In filters.js - setupFilterConfigurations()
this.filterConfigs['my-custom-filter'] = {
    emoji: '🎄',                    // Emoji to display
    baseSize: 48,                   // Base size in pixels
    position: 'forehead',           // Positioning reference
    offsetY: -20,                   // Vertical offset
    offsetX: 0,                     // Horizontal offset
    scaleWithFace: true,           // Scale with face size
    fallback: { x: 0.5, y: 0.15 }  // Fallback position (0-1)
};
```

#### 2. Add UI Button
```html
<!-- In index.html - filter controls section -->
<button class="filter-btn" data-filter="my-custom-filter" aria-label="Christmas Tree Filter">
    <span class="filter-icon" aria-hidden="true">🎄</span>
    <span class="filter-name">Christmas Tree</span>
</button>
```

#### 3. Style the Button
```css
/* In styles.css - filter button styles */
.filter-btn[data-filter="my-custom-filter"] {
    background: linear-gradient(145deg, #2e7d32, #4caf50);
}

.filter-btn[data-filter="my-custom-filter"].active {
    background: linear-gradient(145deg, #1b5e20, #2e7d32);
    transform: scale(0.95);
}
```

### Adding Performance Monitoring

#### Custom Metrics
```javascript
// In performance-utils.js
measureCustomOperation(operationName, operation) {
    const startTime = performance.now();
    performance.mark(`${operationName}-start`);
    
    try {
        const result = operation();
        
        const duration = performance.now() - startTime;
        performance.mark(`${operationName}-end`);
        performance.measure(operationName, `${operationName}-start`, `${operationName}-end`);
        
        console.log(`${operationName} took ${duration.toFixed(2)}ms`);
        return result;
    } catch (error) {
        console.error(`${operationName} failed:`, error);
        throw error;
    }
}
```

### Adding Error Recovery

#### Graceful Degradation
```javascript
// Implement fallback for failed features
async initAdvancedFeature() {
    try {
        await this.loadAdvancedCapability();
        this.advancedFeatureEnabled = true;
    } catch (error) {
        console.warn('Advanced feature failed, using basic implementation:', error);
        this.initBasicFallback();
        this.advancedFeatureEnabled = false;
    }
}
```

---

## 🧪 Testing Guidelines

### Testing Strategy

#### 1. Real Device Testing (Priority)
```bash
# Test on real devices whenever possible
# Camera emulation has limitations

# Get local IP for mobile testing
ipconfig getifaddr en0  # macOS
hostname -I | awk '{print $1}'  # Linux

# Access from mobile: http://your-ip:8000
```

#### 2. Browser Testing
```javascript
// Test critical paths across browsers
const testSuite = {
    async testCameraAccess() {
        try {
            const stream = await CameraUtils.initCameraWithFallback();
            return { success: true, stream };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    async testFilterRendering() {
        // Test filter rendering performance
        const start = performance.now();
        this.filterSystem.renderFilter(ctx, 'santa-hat');
        const duration = performance.now() - start;
        return { success: duration < 50, duration };
    }
};
```

#### 3. Performance Testing
```javascript
// Monitor performance during development
const performanceTest = {
    memoryUsage: () => performance.memory?.usedJSHeapSize || 0,
    frameRate: () => photoBoothApp.performanceMonitor.metrics.runtime.frameRate,
    cameraInitTime: () => photoBoothApp.performanceMonitor.metrics.startup.cameraInitTime
};

// Log every 10 seconds during testing
setInterval(() => {
    console.log('Performance:', performanceTest.memoryUsage(), 'bytes');
}, 10000);
```

### Testing Checklist

#### Before Submitting PR
- [ ] **Camera Access** - Works on target browsers
- [ ] **Filter Rendering** - Smooth performance on mobile
- [ ] **Photo Capture** - High-quality output with filters
- [ ] **Error Handling** - Graceful failures with user feedback
- [ ] **Performance** - No memory leaks or performance degradation
- [ ] **Mobile UX** - Touch-friendly and responsive
- [ ] **Documentation** - Code comments and documentation updated

#### Cross-Browser Verification
- [ ] **iOS Safari** - Primary mobile platform
- [ ] **Chrome Mobile** - Android primary
- [ ] **Desktop Chrome** - Development platform
- [ ] **Desktop Safari** - Secondary desktop
- [ ] **Firefox** - Limited support validation

---

## 📝 Contribution Process

### 1. Planning & Discussion

#### Feature Proposals
Before starting significant work:
1. **Open an Issue** describing the feature or bug
2. **Discuss the approach** with maintainers
3. **Get approval** for significant changes
4. **Plan the implementation** with performance considerations

#### Example Issue Template
```markdown
## Feature/Bug Description
Brief description of what you want to add/fix

## Motivation
Why is this needed? What problem does it solve?

## Implementation Plan
How do you plan to implement this?

## Testing Strategy
How will you test this change?

## Performance Impact
What's the expected performance impact?
```

### 2. Development Workflow

#### Branch Strategy
```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/my-new-feature

# Make changes with clear commits
git add .
git commit -m "feat: add Christmas tree filter with face detection"

# Push and create PR
git push origin feature/my-new-feature
```

#### Commit Message Convention
```bash
# Format: type(scope): description

feat: add new Christmas tree filter
fix: resolve camera switching issue on iOS
docs: update filter customization guide
perf: optimize face detection for low-end devices
refactor: improve error handling in camera utils
test: add unit tests for filter positioning
```

### 3. Code Review Process

#### Pull Request Template
```markdown
## Changes Made
- [ ] Added/Modified feature X
- [ ] Fixed bug Y
- [ ] Updated documentation Z

## Testing Done
- [ ] Tested on iOS Safari
- [ ] Tested on Chrome Mobile
- [ ] Verified performance impact
- [ ] Tested error conditions

## Screenshots/Videos
Include screenshots or videos of changes

## Performance Impact
Document any performance implications

## Breaking Changes
List any breaking changes and migration guide
```

#### Review Checklist
Reviewers will check:
- [ ] **Code Quality** - Clean, readable, well-documented
- [ ] **Performance** - No negative impact on mobile devices
- [ ] **Browser Compatibility** - Works on target platforms
- [ ] **Error Handling** - Graceful failure scenarios
- [ ] **Documentation** - Updated documentation and comments
- [ ] **Testing** - Adequate testing coverage

### 4. Documentation Updates

#### Required Documentation Updates
When contributing:
- [ ] **Code Comments** - JSDoc for public methods
- [ ] **README Updates** - If adding user-facing features
- [ ] **Technical Docs** - If changing architecture
- [ ] **Deployment Docs** - If affecting deployment

#### Documentation Style
```javascript
/**
 * Apply custom filter with performance optimization.
 * 
 * @param {CanvasRenderingContext2D} ctx - Target canvas context
 * @param {string} filterId - Unique filter identifier  
 * @param {Object} options - Rendering options
 * @param {boolean} [options.highQuality=false] - Enable high-quality rendering
 * @returns {Promise<boolean>} Success status
 * @throws {Error} If filter is not found or rendering fails
 * 
 * @example
 * // Apply filter with high quality
 * const success = await filterSystem.applyCustomFilter(ctx, 'my-filter', {
 *   highQuality: true
 * });
 */
```

---

## 🐛 Bug Reports & Issues

### Reporting Bugs

#### Bug Report Template
```markdown
## Bug Description
Clear description of what's broken

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 95.0.4638.69
- OS: iOS 15.1 
- Device: iPhone 12 Pro
- App Version: 1.0.0

## Additional Context
Screenshots, console errors, etc.
```

#### Critical Bug Criteria
Report immediately if:
- **Camera Access Fails** on major browsers
- **App Crashes** or becomes unresponsive
- **Security Vulnerabilities** discovered
- **Performance Regression** > 50% on mobile devices
- **Data Loss** or corruption

### Issue Prioritization

#### Priority Levels
1. **Critical** - App unusable, security issues
2. **High** - Major feature broken, poor UX
3. **Medium** - Minor feature issues, performance improvements
4. **Low** - Cosmetic issues, nice-to-have features

---

## 🎯 Development Roadmap

### Current Priorities

#### Short Term (Next Release)
1. **Performance Optimization** - Improve face detection speed
2. **Accessibility** - Better screen reader support
3. **Error Recovery** - More robust error handling
4. **Testing** - Automated test suite

#### Medium Term
1. **Advanced Filters** - Image-based filters and animations
2. **Video Recording** - Short video clips with filters
3. **PWA Features** - Offline support and installation
4. **Custom Backgrounds** - Green screen replacement

#### Long Term
1. **WebAssembly** - Performance optimization
2. **WebGL Effects** - Advanced visual effects
3. **AR Integration** - Augmented reality features
4. **Social Sharing** - Direct platform integration

### Technology Considerations

#### Performance Targets
- **Load Time:** < 2s on 3G
- **Camera Init:** < 1.5s average
- **Memory Usage:** < 100MB on mobile
- **Frame Rate:** 20+ fps consistently

#### Browser Evolution
- **WebAssembly** adoption for performance
- **WebGL** for advanced effects
- **WebXR** for AR/VR integration
- **Progressive Web Apps** for better mobile experience

---

## 🏆 Recognition & Community

### Contribution Recognition

#### Types of Contributions
- **Code Contributions** - New features, bug fixes, optimizations
- **Documentation** - Guides, tutorials, API documentation  
- **Testing** - Device testing, bug reporting, QA
- **Design** - UI/UX improvements, accessibility
- **Performance** - Optimization, monitoring, analysis

#### Recognition System
- **Contributor List** - All contributors recognized in README
- **Code Attribution** - Author credits in significant contributions
- **Feature Credits** - Recognition for major feature additions
- **Performance Champions** - Recognition for optimization work

### Community Guidelines

#### Communication Standards
- **Be Respectful** - Treat all contributors with respect
- **Be Constructive** - Provide helpful feedback and suggestions
- **Be Patient** - Remember that everyone is learning
- **Be Inclusive** - Welcome contributors of all skill levels

#### Code of Conduct
1. **Professional Behavior** - Maintain professional standards
2. **Inclusive Environment** - Welcome all backgrounds and perspectives
3. **Constructive Feedback** - Focus on code and ideas, not individuals
4. **Respect Privacy** - Don't share personal information without consent

---

## 📞 Getting Help

### Development Support

#### Documentation Resources
1. **[TECHNICAL.md](TECHNICAL.md)** - Complete architecture guide
2. **[README.md](README.md)** - User guide and overview
3. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues
4. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment

#### Code Examples
```javascript
// Example: Adding a new filter
const myFilter = {
    emoji: '🎭',
    baseSize: 48,
    position: 'forehead',
    offsetY: -25,
    scaleWithFace: true,
    fallback: { x: 0.5, y: 0.15 }
};

// Example: Performance monitoring
const monitor = new PerformanceMonitor();
monitor.markCustomStart('my-operation');
// ... operation code ...
const duration = monitor.markCustomEnd('my-operation');
```

#### Common Development Tasks

1. **Testing Camera Features**
   ```javascript
   // Test camera access
   const testResult = await CameraUtils.initCameraWithFallback();
   console.log('Camera test:', testResult ? 'Success' : 'Failed');
   ```

2. **Debugging Performance**
   ```javascript
   // Enable debug mode
   photoBoothApp.debug = true;
   
   // Monitor performance
   setInterval(() => {
       const metrics = photoBoothApp.getPerformanceData();
       console.log('FPS:', metrics.monitor.runtime.frameRate);
   }, 5000);
   ```

3. **Testing Error Scenarios**
   ```javascript
   // Simulate camera error
   photoBoothApp.stream = null;
   photoBoothApp.initCamera().catch(error => {
       console.log('Error handling test:', error.message);
   });
   ```

### Contact & Support

#### Getting Stuck?
1. **Check Documentation** - Most answers are in the docs
2. **Search Issues** - Someone might have asked already
3. **Open Discussion** - Create a discussion for questions
4. **Join Community** - Connect with other contributors

---

## 🎊 Thank You!

Thank you for contributing to the Fun House Photo Booth! Your contributions help make this project better for everyone. Whether you're fixing bugs, adding features, improving documentation, or helping with testing, every contribution is valued.

**Happy coding, and let's create amazing photo booth experiences together! 📸🎄**

---

*This contributing guide is a living document. Please suggest improvements to make it more helpful for future contributors.*