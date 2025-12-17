/**
 * Fun House Photo Booth - Main Application
 * 
 * Core camera functionality and photo capture system with advanced performance monitoring.
 * This class manages the entire photo booth application lifecycle including camera access,
 * filter rendering, photo capture, and device optimization.
 * 
 * @class PhotoBoothApp
 * @author Fun House Photo Booth Team
 * @version 1.0.0
 * @since 2024
 * 
 * @example
 * // Initialize the photo booth
 * const app = new PhotoBoothApp();
 * 
 * // Listen for events
 * app.video.addEventListener('loadedmetadata', () => {
 *   console.log('Camera ready');
 * });
 * 
 * // Programmatically capture photo
 * app.capturePhoto().then(() => {
 *   console.log('Photo captured');
 * });
 */

class PhotoBoothApp {
    /**
     * Initialize the Fun House Photo Booth application.
     * Sets up all necessary DOM references, canvas contexts, and initial state.
     * Automatically starts the initialization process on construction.
     * 
     * @constructor
     */
    constructor() {
        this.video = document.getElementById('videoElement');
        this.overlayCanvas = document.getElementById('overlayCanvas');
        this.captureCanvas = document.getElementById('captureCanvas');
        this.captureBtn = document.getElementById('captureBtn');
        this.switchCameraBtn = document.getElementById('switchCameraBtn');
        this.cameraStatus = document.getElementById('cameraStatus');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.photoPreview = document.getElementById('photoPreview');
        
        this.overlayCtx = this.overlayCanvas.getContext('2d');
        this.captureCtx = this.captureCanvas.getContext('2d');
        
        this.stream = null;
        this.currentFilter = 'none';
        this.facingMode = 'user'; // Start with front camera
        this.isCapturing = false;
        this.faceDetectionEnabled = false;
        
        // Performance monitoring and optimization
        this.performanceMonitor = null;
        this.performanceOptimizer = null;
        this.targetFrameRate = 30;
        this.lastRenderTime = 0;
        this.renderFrameSkip = 0;
        
        // Optimization flags - OPTIMIZED FOR REAL-TIME TRACKING
        this.enableAdaptiveRendering = false; // DISABLED for consistent real-time performance
        this.enableSmartFrameSkip = false; // DISABLED to ensure continuous face tracking
        this.maxRenderInterval = 1000 / 60; // Target 60fps for ultra-smooth tracking
        
        this.init();
    }

    /**
     * Main initialization method that orchestrates app startup.
     * Handles camera access, canvas setup, face detection loading,
     * and performance monitoring initialization.
     * 
     * @async
     * @returns {Promise<void>} Resolves when initialization is complete
     * @throws {Error} If critical components fail to initialize
     */
    async init() {
        console.log('🎪 Initializing Fun House Photo Booth...');
        
        // Initialize performance monitoring first
        if (typeof PerformanceMonitor !== 'undefined') {
            this.performanceMonitor = new PerformanceMonitor();
            this.performanceMonitor.markCameraInitStart();
        }
        
        // Show loading overlay
        this.showLoading(true);
        
        try {
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize camera with performance monitoring
            await this.initCamera();
            
            // Mark camera initialization complete
            if (this.performanceMonitor) {
                this.performanceMonitor.markCameraInitEnd();
            }
            
            // Set up canvas dimensions
            this.setupCanvases();
            
            // Initialize performance optimizer
            if (typeof PerformanceOptimizer !== 'undefined') {
                this.performanceOptimizer = new PerformanceOptimizer(this);
            }
            
            // Try to load face detection (optional)
            await this.initFaceDetection();
            
            // Mark startup complete
            if (this.performanceMonitor) {
                this.performanceMonitor.markStartupComplete();
            }
            
            // Hide loading overlay
            this.showLoading(false);
            
            console.log('✅ Photo Booth ready!');
            this.updateStatus('📹 Camera ready! Choose a filter and strike a pose!');
            
            // Log initial performance metrics
            this.logPerformanceMetrics();
            
        } catch (error) {
            console.error('❌ Failed to initialize:', error);
            this.showError('Failed to initialize camera', error.message);
            this.showLoading(false);
        }
    }

    /**
     * Set up all event listeners for user interactions and system events.
     * Includes touch/click handlers, orientation change detection,
     * and periodic validation checks.
     * 
     * @private
     */
    setupEventListeners() {
        // Capture button
        this.captureBtn.addEventListener('click', () => this.capturePhoto());
        
        // Switch camera button
        this.switchCameraBtn.addEventListener('click', () => this.switchCamera());
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectFilter(e.target.closest('.filter-btn')));
        });
        
        // Photo preview controls
        document.getElementById('savePhotoBtn').addEventListener('click', () => this.savePhoto());
        document.getElementById('retakeBtn').addEventListener('click', () => this.hidePhotoPreview());
        
        // Handle orientation and resize changes with debouncing
        this.orientationTimeout = null;
        const handleResize = () => {
            clearTimeout(this.orientationTimeout);
            this.orientationTimeout = setTimeout(() => {
                this.handleOrientationChange();
            }, 300);
        };
        
        window.addEventListener('orientationchange', handleResize);
        window.addEventListener('resize', handleResize);
        
        // Handle scroll events to reposition canvas
        const handleScroll = () => {
            if (!this.isSettingUpCanvases && this.overlayCanvas && this.video) {
                const videoRect = this.video.getBoundingClientRect();
                this.overlayCanvas.style.top = videoRect.top + window.scrollY + 'px';
                this.overlayCanvas.style.left = videoRect.left + window.scrollX + 'px';
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        // Store scroll handler for cleanup
        this.scrollHandler = handleScroll;
        
        // DISABLED: Periodically validate canvas alignment (causing false positives)
        // this.alignmentCheckInterval = setInterval(() => {
        //     // Only check alignment if not currently setting up and video is playing
        //     if (!this.isSettingUpCanvases && !this.isRealigning && 
        //         this.video && !this.video.paused && this.overlayCanvas) {
        //         if (!this.validateCanvasAlignment()) {
        //             this.realignCanvas();
        //         }
        //     }
        // }, 10000); // Check every 10 seconds (less aggressive)
        
        // Handle page visibility for camera cleanup
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    /**
     * Initialize camera access with comprehensive device compatibility.
     * Requests camera permissions, optimizes settings for mobile devices,
     * and establishes the media stream for the video element.
     * 
     * @async
     * @private
     * @returns {Promise<void>} Resolves when camera is ready
     * @throws {Error} If camera access fails or is not supported
     */
    async initCamera() {
        try {
            // Check browser compatibility
            const compatibility = CameraUtils.checkCompatibility();
            if (!compatibility.getUserMedia) {
                throw new Error('Camera not supported in this browser');
            }

            // Request camera access
            this.updateStatus('📹 Requesting camera access...');
            
            // Use camera utils for better device compatibility
            this.stream = await CameraUtils.initCameraWithFallback(this.facingMode);
            
            // Set video source and optimize for mobile
            this.video.srcObject = this.stream;
            CameraUtils.optimizeVideoForMobile(this.video);
            
            // Wait for video to be ready
            await new Promise((resolve, reject) => {
                this.video.onloadedmetadata = () => {
                    resolve();
                };
                this.video.onerror = (error) => {
                    reject(new Error('Failed to load video stream'));
                };
                
                // Timeout after 10 seconds
                setTimeout(() => reject(new Error('Video load timeout')), 10000);
            });

            // Start video playback
            await this.video.play();
            
            // Enable capture button
            this.captureBtn.disabled = false;
            
            console.log('✅ Camera initialized successfully');
            
        } catch (error) {
            console.error('❌ Camera initialization failed:', error);
            
            // Use camera utils for better error messages
            const errorInfo = CameraUtils.getErrorMessage(error);
            throw new Error(errorInfo.message);
        }
    }

    /**
     * Configure canvas elements for optimal rendering performance.
     * Calculates appropriate dimensions based on video stream and device capabilities,
     * sets up pixel ratio for high-DPI displays, and establishes coordinate mapping.
     * 
     * @private
     */
    setupCanvases() {
        // Prevent recursive calls during setup
        if (this.isSettingUpCanvases) {
            console.log('⏭️ Canvas setup already in progress, skipping...');
            return;
        }
        
        this.isSettingUpCanvases = true;
        
        // Wait for video dimensions to be available
        const updateCanvases = () => {
            if (this.video.videoWidth === 0 || this.video.videoHeight === 0) {
                setTimeout(updateCanvases, 100);
                return;
            }

            const videoWidth = this.video.videoWidth;
            const videoHeight = this.video.videoHeight;
            
            // Get video element's actual display size
            const videoRect = this.video.getBoundingClientRect();
            const videoDisplayWidth = videoRect.width;
            const videoDisplayHeight = videoRect.height;
            
            // CRITICAL FIX: Use display dimensions directly to match video exactly
            const displayWidth = Math.round(videoDisplayWidth);
            const displayHeight = Math.round(videoDisplayHeight);
            
            // CRITICAL FIX: Set canvas dimensions to match video display dimensions exactly
            // This eliminates the dimension mismatch that was causing filter misalignment
            const canvasWidth = displayWidth;
            const canvasHeight = displayHeight;
            
            // Store previous dimensions for comparison
            const prevCanvasSize = this.canvasActualSize;
            
            // Only update canvases if dimensions actually changed
            if (prevCanvasSize && 
                prevCanvasSize.width === canvasWidth && 
                prevCanvasSize.height === canvasHeight) {
                console.log('📐 Canvas dimensions unchanged, skipping update');
                this.isSettingUpCanvases = false;
                return;
            }
            
            // Configure overlay canvas - match video display size exactly
            this.overlayCanvas.width = canvasWidth;
            this.overlayCanvas.height = canvasHeight;
            this.overlayCanvas.style.width = displayWidth + 'px';
            this.overlayCanvas.style.height = displayHeight + 'px';
            
            // CRITICAL FIX: No scaling needed since canvas matches display size 1:1
            this.overlayCtx.setTransform(1, 0, 0, 1, 0, 0);
            
            // Configure capture canvas - use higher resolution for quality
            const capturePixelRatio = Math.min(CameraUtils.getPixelRatio ? CameraUtils.getPixelRatio() : window.devicePixelRatio || 1, 2);
            this.captureCanvas.width = Math.round(canvasWidth * capturePixelRatio);
            this.captureCanvas.height = Math.round(canvasHeight * capturePixelRatio);
            
            // Scale capture canvas context for high-DPI rendering
            this.captureCtx.setTransform(1, 0, 0, 1, 0, 0);
            this.captureCtx.scale(capturePixelRatio, capturePixelRatio);
            
            // CRITICAL FIX: Perfect overlay positioning aligned with video
            // getBoundingClientRect() returns viewport-relative coordinates,
            // so we need to add scroll position to convert to document coordinates
            this.overlayCanvas.style.position = 'absolute';
            this.overlayCanvas.style.top = (videoRect.top + window.scrollY) + 'px';
            this.overlayCanvas.style.left = (videoRect.left + window.scrollX) + 'px';
            this.overlayCanvas.style.pointerEvents = 'none';
            this.overlayCanvas.style.zIndex = '10';
            this.overlayCanvas.style.transformOrigin = 'top left';
            
            // CRITICAL DEBUG FIX: Make overlay canvas visible for debugging
            this.overlayCanvas.style.border = '1px solid rgba(0, 255, 0, 0.5)';
            this.overlayCanvas.style.opacity = '1';
            this.overlayCanvas.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
            
            // CRITICAL FIX: Ensure canvas is on top and visible
            this.overlayCanvas.style.display = 'block';
            this.overlayCanvas.style.visibility = 'visible';
            
            // Store dimensions for coordinate mapping
            this.canvasDisplaySize = { width: displayWidth, height: displayHeight };
            this.canvasActualSize = { width: canvasWidth, height: canvasHeight };
            this.videoSize = { width: videoWidth, height: videoHeight };
            this.canvasPixelRatio = 1; // Fixed to 1 since canvas matches display 1:1
            this.capturePixelRatio = capturePixelRatio; // Store for capture quality
            
            console.log(`📐 Canvas setup - Display: ${displayWidth}x${displayHeight}, Actual: ${canvasWidth}x${canvasHeight}, Video: ${videoWidth}x${videoHeight} - ALIGNED!`);
            console.log(`🎯 Overlay canvas positioned at: top=${videoRect.top + window.scrollY}px, left=${videoRect.left + window.scrollX}px`);
            console.log(`📺 Video rect:`, videoRect);
            console.log(`🎨 Overlay canvas style:`, this.overlayCanvas.style.cssText);
            
            // Mark setup as complete
            this.isSettingUpCanvases = false;
            
            // CRITICAL FIX: Always start overlay rendering after canvas setup
            // This ensures filters work even if setup happens after filter selection
            if (this.currentFilter && this.currentFilter !== 'none') {
                console.log('🚀 Auto-starting overlay rendering for active filter:', this.currentFilter);
                this.startOverlayRendering();
            }
        };
        
        updateCanvases();
    }

    /**
     * Initialize face detection system with performance optimization.
     * Loads face-api.js models asynchronously and adapts based on device capabilities.
     * Gracefully degrades if face detection is unavailable or performance is poor.
     * 
     * @async
     * @private
     * @returns {Promise<void>} Resolves when face detection is ready or skipped
     */
    async initFaceDetection() {
        try {
            this.updateStatus('🤖 Loading face detection...');
            
            // Mark face detection initialization start
            if (this.performanceMonitor) {
                this.performanceMonitor.markFaceDetectionInitStart();
            }
            
            // Check if face-api.js is loaded
            if (typeof faceapi === 'undefined') {
                console.warn('⚠️ face-api.js not loaded, skipping face detection');
                return;
            }

            // Check device performance before loading heavy models
            const deviceInfo = this.performanceOptimizer ? 
                this.performanceOptimizer.monitor.classifyDevicePerformance() : 
                { deviceClass: 'medium', recommendations: { enableFaceDetection: true } };
            
            if (!deviceInfo.recommendations.enableFaceDetection) {
                console.log('⚠️ Face detection disabled for low-end device');
                return;
            }

            // Load face detection models (lightweight versions)
            const modelUrl = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model';
            
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
                faceapi.nets.faceLandmark68TinyNet.loadFromUri(modelUrl)
            ]);

            this.faceDetectionEnabled = true;
            
            // Mark face detection initialization complete
            if (this.performanceMonitor) {
                this.performanceMonitor.markFaceDetectionInitEnd();
            }
            
            console.log('✅ Face detection ready');
            
        } catch (error) {
            console.warn('⚠️ Face detection not available:', error);
            // Continue without face detection
        }
    }

    /**
     * Change the active filter and update the user interface.
     * FIXED: Properly clears previous filters and enables real-time face tracking.
     * 
     * @param {HTMLElement} filterBtn - The filter button element that was clicked
     * @public
     */
    selectFilter(filterBtn) {
        console.log('🔍 Filter button clicked!', filterBtn);
        
        // CRITICAL FIX: Stop current overlay rendering FIRST
        console.log('⏹️ Stopping previous overlay rendering...');
        this.stopOverlayRendering();
        
        // CRITICAL FIX: Multiple clearing methods to ensure complete canvas reset
        if (this.overlayCanvas && this.overlayCtx) {
            console.log('🧹 Clearing overlay canvas completely with multiple methods...');
            
            // Method 1: Clear with display size
            if (this.canvasDisplaySize) {
                this.overlayCtx.clearRect(0, 0, this.canvasDisplaySize.width, this.canvasDisplaySize.height);
            }
            
            // Method 2: Clear with canvas dimensions
            this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
            
            // Method 3: Reset entire canvas state
            this.overlayCtx.save();
            this.overlayCtx.setTransform(1, 0, 0, 1, 0, 0);
            this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
            this.overlayCtx.restore();
            
            // Method 4: Force canvas redraw by manipulating width
            const currentWidth = this.overlayCanvas.width;
            this.overlayCanvas.width = currentWidth;
            
            console.log('✅ Canvas completely cleared with all methods');
        }
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');
        
        // Get filter type
        this.currentFilter = filterBtn.dataset.filter;
        console.log(`🎭 Filter selected: ${this.currentFilter}`);
        console.log('📐 Canvas display size:', this.canvasDisplaySize);
        console.log('📺 Overlay canvas:', this.overlayCanvas);
        console.log('🎥 Video element:', this.video);
        
        // Handle filter selection
        if (this.currentFilter === 'none') {
            console.log('❌ No filter selected - staying cleared');
            // Canvas already cleared above, just ensure rendering stays stopped
        } else {
            // CRITICAL FIX: Small delay to ensure clearing is complete before starting new filter
            console.log('🚀 Starting overlay rendering for filter:', this.currentFilter);
            setTimeout(() => {
                this.startOverlayRendering();
            }, 50); // 50ms delay to ensure clean state
        }
    }
    
    startOverlayRendering() {
        // CRITICAL FIX: Always stop any existing rendering loop first
        if (this.overlayRenderingActive) {
            console.log('🔄 Stopping existing overlay rendering before starting new one...');
            this.stopOverlayRendering();
            // Brief delay to ensure the previous loop has stopped
            setTimeout(() => this.startOverlayRendering(), 50);
            return;
        }
        
        // CRITICAL FIX: Check if we have necessary components before starting
        if (!this.overlayCanvas || !this.overlayCtx) {
            console.error('❌ Cannot start overlay rendering - canvas or context missing');
            return;
        }
        
        if (!this.canvasDisplaySize) {
            console.warn('⚠️ Canvas display size not ready, delaying overlay rendering');
            setTimeout(() => this.startOverlayRendering(), 100);
            return;
        }
        
        console.log('🚀 Starting overlay rendering loop');
        console.log('📊 Render state check:', {
            currentFilter: this.currentFilter,
            canvasDisplaySize: this.canvasDisplaySize,
            overlayCanvas: !!this.overlayCanvas,
            overlayCtx: !!this.overlayCtx
        });
        
        this.overlayRenderingActive = true;
        
        const renderLoop = () => {
            if (!this.overlayRenderingActive || this.currentFilter === 'none') {
                console.log('⏹️ Stopping render loop - active:', this.overlayRenderingActive, 'filter:', this.currentFilter);
                return;
            }
            
            const now = performance.now();
            
            // CRITICAL FIX: Removed frame skipping for real-time face tracking
            // This ensures filters update continuously as the user moves
            
            // Measure render performance
            if (this.performanceMonitor) {
                this.performanceMonitor.measureRenderStart();
            }
            
            // Double-check canvas dimensions are ready
            if (!this.canvasDisplaySize) {
                console.warn('⚠️ Canvas display size not ready, skipping frame');
                requestAnimationFrame(renderLoop);
                return;
            }
            
            // CRITICAL FIX: Clear the overlay canvas completely
            this.overlayCtx.clearRect(0, 0, this.canvasDisplaySize.width, this.canvasDisplaySize.height);
            // Also clear using actual canvas dimensions as extra safety
            this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
            
            // Apply current filter overlay - this is where real-time tracking happens
            this.applyFilterToOverlay(this.overlayCtx);
            
            // Record render time
            if (this.performanceMonitor) {
                this.performanceMonitor.measureRenderEnd();
            }
            
            this.lastRenderTime = now;
            
            // Continue rendering loop with optimal timing
            requestAnimationFrame(renderLoop);
        };
        
        requestAnimationFrame(renderLoop);
    }
    
    stopOverlayRendering() {
        console.log('⏹️ Stopping overlay rendering...');
        this.overlayRenderingActive = false;
        
        // CRITICAL FIX: Clear the canvas when stopping
        if (this.overlayCanvas && this.overlayCtx) {
            if (this.canvasDisplaySize) {
                this.overlayCtx.clearRect(0, 0, this.canvasDisplaySize.width, this.canvasDisplaySize.height);
            }
            this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
            console.log('🧹 Overlay canvas cleared on stop');
        }
    }
    
    applyFilterToOverlay(ctx) {
        // CRITICAL FIX: Use the filter system if available
        if (this.filterSystem) {
            console.log('🎭 Using FilterSystem for overlay');
            this.filterSystem.applyFilterToOverlay(ctx, this.currentFilter);
            return;
        }
        
        // Fallback to basic filter rendering
        if (!this.canvasDisplaySize) {
            console.warn('⚠️ Cannot apply filter - canvasDisplaySize not ready');
            return;
        }
        
        const canvas = ctx.canvas;
        const width = this.canvasDisplaySize.width;
        const height = this.canvasDisplaySize.height;
        
        console.log('🎨 Applying filter:', this.currentFilter, 'to canvas size:', width, 'x', height);
        console.log('🎯 Canvas actual dimensions:', canvas.width, 'x', canvas.height);
        console.log('📺 Context ready:', !!ctx);
        
        // CRITICAL FIX: Ensure we're drawing within canvas bounds
        if (width <= 0 || height <= 0) {
            console.error('❌ Invalid canvas dimensions:', width, height);
            return;
        }
        
        switch (this.currentFilter) {
            case 'snowflake-crown':
                console.log('❄️ Drawing Snow Crown filter');
                this.drawAdvancedFilter(ctx, '❄️👑❄️', width / 2, height * 0.2, 48);
                break;
                
            case 'reindeer-antlers':
                console.log('🦌 Drawing Reindeer filter');
                this.drawAdvancedFilter(ctx, '🦌', width / 2, height * 0.15, 52);
                break;
                
            case 'santa-hat':
                console.log('🎅 Drawing Santa Hat filter');
                this.drawAdvancedFilter(ctx, '🎅', width / 2, height * 0.18, 50);
                break;
                
            default:
                console.log('🤷 Unknown filter:', this.currentFilter);
        }
    }

    /**
     * Capture a high-quality photo with the currently applied filter.
     * Renders the video frame to a high-resolution canvas, applies the active filter,
     * and provides a preview for the user to save or retake.
     * 
     * @async
     * @public
     * @returns {Promise<void>} Resolves when photo capture is complete
     */
    async capturePhoto() {
        if (this.isCapturing) return;
        
        try {
            this.isCapturing = true;
            this.captureBtn.disabled = true;
            this.updateStatus('📸 Capturing photo...');
            
            // Clear capture canvas
            this.captureCtx.clearRect(0, 0, this.captureCanvas.width, this.captureCanvas.height);
            
            // Save current context state
            this.captureCtx.save();
            
            // Draw video frame to capture canvas with proper scaling
            const canvasDisplayWidth = this.canvasDisplaySize.width;
            const canvasDisplayHeight = this.canvasDisplaySize.height;
            
            this.captureCtx.drawImage(
                this.video, 
                0, 0, 
                canvasDisplayWidth, 
                canvasDisplayHeight
            );
            
            // Apply current filter to capture canvas
            await this.applyFilterToCanvas(this.captureCtx);
            
            // Restore context state
            this.captureCtx.restore();
            
            // Convert to high-quality data URL
            const photoDataUrl = this.captureCanvas.toDataURL('image/jpeg', 0.95);
            
            // Show photo preview
            this.showPhotoPreview(photoDataUrl);
            
            console.log('📸 Photo captured successfully');
            this.updateStatus('✅ Photo captured! Save it or take another one.');
            
        } catch (error) {
            console.error('❌ Photo capture failed:', error);
            this.showError('Failed to capture photo', error.message);
        } finally {
            this.isCapturing = false;
            this.captureBtn.disabled = false;
        }
    }

    async applyFilterToCanvas(ctx) {
        if (!this.canvasDisplaySize || this.currentFilter === 'none') return;
        
        const width = this.canvasDisplaySize.width;
        const height = this.canvasDisplaySize.height;
        
        switch (this.currentFilter) {
            case 'snowflake-crown':
                this.drawAdvancedFilter(ctx, '❄️👑❄️', width / 2, height * 0.15, 48);
                break;
                
            case 'reindeer-antlers':
                this.drawAdvancedFilter(ctx, '🦌', width / 2, height * 0.1, 52);
                break;
                
            case 'santa-hat':
                this.drawAdvancedFilter(ctx, '🎅', width / 2, height * 0.12, 50);
                break;
        }
    }

    drawAdvancedFilter(ctx, emoji, x, y, fontSize = 48) {
        console.log('✏️ Drawing filter:', emoji, 'at position:', x, y, 'with size:', fontSize);
        
        // Save context state
        ctx.save();
        
        // Set font with responsive size
        const scaledFontSize = Math.max(fontSize * (this.canvasDisplaySize.width / 400), 32);
        console.log('📏 Scaled font size:', scaledFontSize);
        
        ctx.font = `${scaledFontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add strong shadow for visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        
        // Draw the emoji
        console.log('🎨 Drawing emoji at:', x, y);
        ctx.fillText(emoji, x, y);
        
        // Add a subtle outline for better contrast
        ctx.shadowColor = 'transparent'; // Clear shadow for stroke
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeText(emoji, x, y);
        
        console.log('✅ Filter drawn successfully');
        
        // Restore context state
        ctx.restore();
    }

    showPhotoPreview(photoDataUrl) {
        const capturedPhoto = document.getElementById('capturedPhoto');
        capturedPhoto.src = photoDataUrl;
        this.photoPreview.style.display = 'block';
        
        // Store photo data for saving
        this.lastCapturedPhoto = photoDataUrl;
    }

    hidePhotoPreview() {
        this.photoPreview.style.display = 'none';
        this.updateStatus('📹 Ready to take another photo!');
    }

    savePhoto() {
        if (!this.lastCapturedPhoto) return;
        
        try {
            // Generate timestamp-based filename
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const filename = `fun-house-photo-${timestamp}.jpg`;
            
            // Use camera utils for better download compatibility
            const success = CameraUtils.downloadImage(this.lastCapturedPhoto, filename);
            
            if (success) {
                console.log('💾 Photo saved successfully:', filename);
                this.updateStatus('💾 Photo saved! Take another one?');
                
                // Add visual feedback
                const saveBtn = document.getElementById('savePhotoBtn');
                saveBtn.textContent = '✅ Saved!';
                saveBtn.style.background = 'linear-gradient(145deg, #4caf50, #45a049)';
                
                // Hide preview after a delay
                setTimeout(() => this.hidePhotoPreview(), 2000);
                
                // Reset button after delay
                setTimeout(() => {
                    saveBtn.innerHTML = '<span class="btn-icon">💾</span> Save Photo';
                    saveBtn.style.background = '';
                }, 2500);
            } else {
                this.showError('Failed to save photo', 'Download not supported in this browser');
            }
            
        } catch (error) {
            console.error('❌ Failed to save photo:', error);
            this.showError('Failed to save photo', 'Try taking the photo again');
        }
    }

    /**
     * Switch between front-facing and rear-facing cameras.
     * Toggles the facing mode, reinitializes the camera stream,
     * and updates canvas dimensions if needed.
     * 
     * @async
     * @public
     * @returns {Promise<void>} Resolves when camera switch is complete
     */
    async switchCamera() {
        try {
            this.updateStatus('🔄 Switching camera...');
            
            // Toggle facing mode
            this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
            
            // Stop current stream
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }
            
            // Reinitialize with new facing mode
            await this.initCamera();
            this.setupCanvases();
            
            this.updateStatus('✅ Camera switched!');
            
        } catch (error) {
            console.error('❌ Failed to switch camera:', error);
            // Revert facing mode on error
            this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
            this.showError('Failed to switch camera', 'Camera switch not available');
        }
    }

    handleOrientationChange() {
        console.log('📱 Orientation change detected');
        
        // Prevent multiple orientation changes during setup
        if (this.isSettingUpCanvases || this.isRealigning) {
            console.log('⏭️ Orientation change ignored during canvas setup');
            return;
        }
        
        // Stop current overlay rendering
        this.stopOverlayRendering();
        
        // Use requestAnimationFrame for smoother transition
        requestAnimationFrame(() => {
            // Recalculate canvas dimensions after orientation change
            this.setupCanvases();
            
            // Restart overlay rendering if filter is active
            if (this.currentFilter !== 'none') {
                this.startOverlayRendering();
            }
        });
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden, pause video to save battery
            if (this.video && !this.video.paused) {
                this.video.pause();
            }
        } else {
            // Page is visible, resume video
            if (this.video && this.video.paused) {
                this.video.play();
            }
        }
    }

    updateStatus(message) {
        this.cameraStatus.innerHTML = `<p>${message}</p>`;
        this.cameraStatus.style.display = 'block';
        this.errorMessage.style.display = 'none';
    }

    showError(title, details) {
        this.errorMessage.querySelector('.error-details').textContent = details;
        this.errorMessage.style.display = 'block';
        this.cameraStatus.style.display = 'none';
    }

    showLoading(show) {
        this.loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    // Get video coordinates mapped to canvas coordinates
    getVideoToCanvasCoordinates(videoX, videoY) {
        if (!this.videoSize || !this.canvasDisplaySize) {
            return { x: videoX, y: videoY };
        }
        
        const scaleX = this.canvasDisplaySize.width / this.videoSize.width;
        const scaleY = this.canvasDisplaySize.height / this.videoSize.height;
        
        return {
            x: videoX * scaleX,
            y: videoY * scaleY
        };
    }
    
    // Get canvas coordinates mapped to video coordinates
    getCanvasToVideoCoordinates(canvasX, canvasY) {
        if (!this.videoSize || !this.canvasDisplaySize) {
            return { x: canvasX, y: canvasY };
        }
        
        const scaleX = this.videoSize.width / this.canvasDisplaySize.width;
        const scaleY = this.videoSize.height / this.canvasDisplaySize.height;
        
        return {
            x: canvasX * scaleX,
            y: canvasY * scaleY
        };
    }
    
    // DISABLED: Check if canvas is properly aligned with video (causing false positives)
    validateCanvasAlignment() {
        // VALIDATION DISABLED - canvas works fine without continuous checking
        return true;
        
        /* ORIGINAL VALIDATION CODE - DISABLED
        if (!this.video || !this.overlayCanvas || this.isSettingUpCanvases || this.isRealigning) {
            return true; // Skip validation during setup or if elements not ready
        }
        
        const videoRect = this.video.getBoundingClientRect();
        const canvasRect = this.overlayCanvas.getBoundingClientRect();
        
        // CRITICAL FIX: Much more generous tolerance since canvas now matches display 1:1
        // This prevents false alignment warnings caused by minor browser rendering differences
        const alignmentTolerance = 15; // Increased tolerance
        
        const topDiff = Math.abs(videoRect.top - canvasRect.top);
        const leftDiff = Math.abs(videoRect.left - canvasRect.left);
        const widthDiff = Math.abs(videoRect.width - canvasRect.width);
        const heightDiff = Math.abs(videoRect.height - canvasRect.height);
        
        const isAligned = 
            topDiff < alignmentTolerance &&
            leftDiff < alignmentTolerance &&
            widthDiff < alignmentTolerance &&
            heightDiff < alignmentTolerance;
        
        if (!isAligned) {
            // CRITICAL FIX: Only log warning if differences are very significant
            // This prevents spam from minor pixel differences
            if (topDiff > 50 || leftDiff > 50 || widthDiff > 50 || heightDiff > 50) {
                console.warn('⚠️ Canvas-video alignment issue detected', {
                    video: { 
                        top: Math.round(videoRect.top), 
                        left: Math.round(videoRect.left),
                        width: Math.round(videoRect.width),
                        height: Math.round(videoRect.height)
                    },
                    canvas: { 
                        top: Math.round(canvasRect.top), 
                        left: Math.round(canvasRect.left),
                        width: Math.round(canvasRect.width),
                        height: Math.round(canvasRect.height)
                    },
                    differences: {
                        top: Math.round(topDiff),
                        left: Math.round(leftDiff),
                        width: Math.round(widthDiff),
                        height: Math.round(heightDiff)
                    }
                });
            }
        }
        
        return isAligned;
        */
    }
    
    // DISABLED: Method to trigger canvas realignment (no longer needed)
    realignCanvas() {
        // REALIGNMENT DISABLED - canvas positioning is stable
        console.log('🔧 Canvas realignment disabled - not needed');
        return;
        
        /* ORIGINAL REALIGNMENT CODE - DISABLED
        // Prevent multiple realignment attempts
        if (this.isRealigning || this.isSettingUpCanvases) {
            console.log('⏭️ Realignment already in progress, skipping...');
            return;
        }
        
        this.isRealigning = true;
        console.log('🔧 Realigning canvas with video');
        
        // Use requestAnimationFrame for better timing
        requestAnimationFrame(() => {
            // Reset the flag and re-setup canvases
            this.isRealigning = false;
            this.setupCanvases();
        });
        */
    }
    
    // Performance optimization methods
    calculateOptimalRenderInterval() {
        if (!this.enableAdaptiveRendering) {
            return 1000 / this.targetFrameRate;
        }
        
        // Get current performance metrics
        const currentFPS = this.performanceMonitor ? this.performanceMonitor.metrics.runtime.frameRate : 60;
        const renderTime = this.performanceMonitor ? this.performanceMonitor.metrics.runtime.renderTime : 16;
        
        // Adaptive frame rate based on performance
        if (currentFPS < 20 || renderTime > 33) {
            // Poor performance - reduce to 15fps
            return Math.max(this.maxRenderInterval, 1000 / 15);
        } else if (currentFPS < 40 || renderTime > 20) {
            // Moderate performance - reduce to 20fps
            return 1000 / 20;
        } else {
            // Good performance - use target frame rate
            return 1000 / this.targetFrameRate;
        }
    }
    
    logPerformanceMetrics() {
        if (!this.performanceMonitor) return;
        
        // Log performance every 10 seconds
        setInterval(() => {
            this.performanceMonitor.logCurrentState();
        }, 10000);
    }
    
    // Get performance data for debugging
    getPerformanceData() {
        if (!this.performanceMonitor) return null;
        
        return {
            monitor: this.performanceMonitor.generateReport(),
            optimizer: this.performanceOptimizer ? this.performanceOptimizer.getOptimizationState() : null,
            app: {
                targetFrameRate: this.targetFrameRate,
                enableAdaptiveRendering: this.enableAdaptiveRendering,
                enableSmartFrameSkip: this.enableSmartFrameSkip,
                maxRenderInterval: this.maxRenderInterval
            }
        };
    }
    
    // Manual performance tuning methods
    setTargetFrameRate(fps) {
        this.targetFrameRate = Math.max(10, Math.min(60, fps));
        console.log(`🎬 Target frame rate set to ${this.targetFrameRate} fps`);
    }
    
    toggleAdaptiveRendering(enabled) {
        this.enableAdaptiveRendering = enabled;
        console.log(`🔄 Adaptive rendering: ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    toggleSmartFrameSkip(enabled) {
        this.enableSmartFrameSkip = enabled;
        console.log(`⏭️ Smart frame skip: ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    // Cleanup method for when the app is destroyed
    cleanup() {
        console.log('🧹 Cleaning up Photo Booth App');
        
        // Stop overlay rendering
        this.stopOverlayRendering();
        
        // Stop camera stream
        if (this.stream) {
            this.stream.getTracks().forEach(track => {
                track.stop();
                console.log('📹 Camera track stopped');
            });
        }
        
        // Cleanup performance monitoring
        if (this.performanceMonitor) {
            this.performanceMonitor.cleanup();
        }
        
        if (this.performanceOptimizer) {
            this.performanceOptimizer.cleanup();
        }
        
        // Clear any timeouts or intervals
        if (this.orientationTimeout) {
            clearTimeout(this.orientationTimeout);
        }
        
        // DISABLED: No alignment check interval to clear
        // if (this.alignmentCheckInterval) {
        //     clearInterval(this.alignmentCheckInterval);
        // }
        
        // Remove event listeners
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
        }
        
        // Reset setup flags
        this.isSettingUpCanvases = false;
        this.isRealigning = false;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.photoBoothApp = new PhotoBoothApp();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.photoBoothApp) {
        window.photoBoothApp.cleanup();
    }
});

// Export for other modules
window.PhotoBoothApp = PhotoBoothApp;
