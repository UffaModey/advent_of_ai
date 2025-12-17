/**
 * Fun House Photo Booth - Advanced Filter System
 * 
 * Provides intelligent face detection and professional filter positioning with performance optimization.
 * This class manages real-time filter rendering, face landmark detection, and adaptive positioning
 * based on device capabilities and performance constraints.
 * 
 * @class FilterSystem
 * @author Fun House Photo Booth Team
 * @version 1.0.0
 * @since 2024
 * 
 * Key Features:
 * - Real-time face detection using TinyFaceDetector
 * - Intelligent filter positioning based on facial landmarks
 * - Performance-optimized rendering with adaptive frame rates
 * - Graceful fallback positioning when face detection unavailable
 * - Multi-face support for group photos
 * 
 * @example
 * // Initialize filter system
 * const filterSystem = new FilterSystem(photoBoothApp);
 * 
 * // Add custom filter
 * filterSystem.filterConfigs['my-filter'] = {
 *   emoji: '🎭',
 *   baseSize: 48,
 *   position: 'forehead',
 *   offsetY: -20,
 *   scaleWithFace: true,
 *   fallback: { x: 0.5, y: 0.15 }
 * };
 */

class FilterSystem {
    /**
     * Initialize the Filter System with face detection and performance monitoring.
     * 
     * @param {PhotoBoothApp} photoBoothApp - Reference to the main application instance
     * @constructor
     */
    constructor(photoBoothApp) {
        this.app = photoBoothApp;
        this.faceDetectionActive = false;
        this.lastDetectedFaces = [];
        this.fallbackPositions = {};
        this.detectionInterval = null;
        this.smoothingFactor = 0.2; // CRITICAL FIX: Reduced smoothing for responsive real-time tracking
        this.lastSmoothedPositions = new Map(); // Store smoothed positions for each face
        this.detectionFailureCount = 0;
        this.maxDetectionFailures = 10;
        
        // Performance optimization features
        this.filterAssets = {};
        this.filterCache = new Map();
        this.enableFilterCaching = true;
        this.enableHighQualityEffects = true;
        this.maxCacheSize = 50; // Maximum cached filters
        
        // Performance monitoring
        this.renderCount = 0;
        this.lastRenderTime = 0;
        
        this.init();
    }

    /**
     * Initialize filter system components including configurations and face detection.
     * Sets up filter metadata, performance monitoring, and starts face detection if available.
     * 
     * @async
     * @returns {Promise<void>} Resolves when filter system is ready
     */
    async init() {
        console.log('🎭 Initializing Advanced Filter System...');
        
        // Initialize filter assets and configurations
        this.setupFilterConfigurations();
        
        // Start face detection if available
        if (this.app.faceDetectionEnabled) {
            console.log('🤖 Face detection enabled - starting real-time face tracking...');
            await this.startFaceDetection();
        } else {
            console.warn('⚠️ Face detection not available, using fallback positioning');
        }
        
        // CRITICAL DEBUG: Add periodic status logging
        this.statusLogInterval = setInterval(() => {
            console.log('📊 Filter System Status:', {
                faceDetectionActive: this.faceDetectionActive,
                detectedFaces: this.lastDetectedFaces.length,
                detectionFailures: this.detectionFailureCount,
                usingFallback: this.lastDetectedFaces.length === 0
            });
        }, 5000); // Log status every 5 seconds
        
        console.log('✅ Filter System ready');
    }

    /**
     * Configure all available filters with their positioning and display properties.
     * Each filter includes emoji, sizing, positioning rules, and fallback coordinates.
     * 
     * Filter Configuration Schema:
     * - emoji: The emoji character to display
     * - baseSize: Base font size in pixels
     * - position: Positioning reference ('forehead', 'top', 'center')
     * - offsetY/offsetX: Pixel offsets from the reference position
     * - scaleWithFace: Whether to scale based on detected face size
     * - fallback: Relative position (0-1) when face detection unavailable
     * 
     * @private
     */
    setupFilterConfigurations() {
        this.filterConfigs = {
            'snowflake-crown': {
                emoji: '❄️👑❄️',
                baseSize: 48,
                position: 'forehead',
                offsetY: -20, // Move up from forehead
                offsetX: 0,
                scaleWithFace: true,
                fallback: { x: 0.5, y: 0.3 } // CENTER OF CAMERA VIEW
            },
            'reindeer-antlers': {
                emoji: '🦌',
                baseSize: 52,
                position: 'top',
                offsetY: -40, // Move up from top of head
                offsetX: 0,
                scaleWithFace: true,
                fallback: { x: 0.5, y: 0.25 } // CENTER OF CAMERA VIEW
            },
            'santa-hat': {
                emoji: '🎅',
                baseSize: 50,
                position: 'top',
                offsetY: -25, // Slightly above head
                offsetX: -5,  // Slight left offset
                scaleWithFace: true,
                fallback: { x: 0.5, y: 0.3 } // CENTER OF CAMERA VIEW
            }
        };
        
        // Initialize fallback positions
        this.updateFallbackPositions();
    }

    updateFallbackPositions() {
        if (!this.app.canvasDisplaySize) {
            console.warn('⚠️ Canvas display size not available for fallback positions');
            return;
        }
        
        const { width, height } = this.app.canvasDisplaySize;
        
        console.log('📐 Updating fallback positions for canvas:', width, 'x', height);
        
        for (const [filterId, config] of Object.entries(this.filterConfigs)) {
            this.fallbackPositions[filterId] = {
                x: width * config.fallback.x,
                y: height * config.fallback.y,
                size: this.calculateResponsiveSize(config.baseSize)
            };
            console.log(`🎯 Fallback position for ${filterId}:`, this.fallbackPositions[filterId]);
        }
    }

    /**
     * Start the face detection system with performance optimization.
     * Uses device-specific detection intervals and adapts to performance constraints.
     * Automatically handles face detection failures and reduces frequency if needed.
     * 
     * @async
     * @returns {Promise<void>} Resolves when face detection is active
     */
    async startFaceDetection() {
        if (!this.app.faceDetectionEnabled || this.faceDetectionActive) return;
        
        try {
            console.log('🤖 Starting face detection...');
            this.faceDetectionActive = true;
            this.detectionFailureCount = 0;
            
            // Get optimal detection interval based on device performance
            const detectionIntervalMs = this.getOptimalDetectionInterval();
            
            this.detectionInterval = setInterval(() => {
                this.detectFacesWithPerformanceMonitoring();
            }, detectionIntervalMs);
            
            console.log(`✅ Real-time face detection started at ${(1000/detectionIntervalMs).toFixed(1)}fps for smooth tracking`);
            
        } catch (error) {
            console.error('❌ Failed to start face detection:', error);
            this.faceDetectionActive = false;
        }
    }

    stopFaceDetection() {
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
            this.detectionInterval = null;
        }
        this.faceDetectionActive = false;
        console.log('🛑 Face detection stopped');
    }

    getOptimalDetectionInterval() {
        // CRITICAL FIX: Increase face detection frequency for real-time tracking
        // Target 10-15fps for smooth face tracking
        const deviceInfo = this.app.performanceOptimizer ? 
            this.app.performanceOptimizer.monitor.classifyDevicePerformance() : 
            { deviceClass: 'medium' };
        
        // CRITICAL FIX: Increased detection frequency for real-time tracking
        switch (deviceInfo.deviceClass) {
            case 'high':
                return 33; // ~30fps for smooth real-time tracking
            case 'medium':
                return 50; // ~20fps for good real-time tracking
            case 'low':
            default:
                return 66; // ~15fps minimum for usable tracking
        }
    }
    
    async detectFacesWithPerformanceMonitoring() {
        if (!this.faceDetectionActive || !this.app.video || this.app.video.paused) return;
        
        // Measure face detection performance
        if (this.app.performanceMonitor) {
            this.app.performanceMonitor.measureFaceDetectionStart();
        }
        
        try {
            // Adaptive input size based on performance
            const inputSize = this.getOptimalInputSize();
            
            // Use TinyFaceDetector for better mobile performance
            const detections = await faceapi.detectAllFaces(
                this.app.video,
                new faceapi.TinyFaceDetectorOptions({
                    inputSize: inputSize, // Dynamic input size for better performance
                    scoreThreshold: 0.5
                })
            ).withFaceLandmarks(true);

            if (detections && detections.length > 0) {
                this.lastDetectedFaces = this.processFaceDetections(detections);
                this.detectionFailureCount = 0;
                
                // CRITICAL FIX: Frequent logging for real-time tracking debug
                if (Math.random() < 0.2) { // 20% chance to log for better tracking visibility
                    console.log(`👤 Real-time tracking: ${detections.length} face(s) detected, positions updating`);
                }
            } else {
                this.detectionFailureCount++;
                
                // After too many failures, temporarily reduce detection frequency
                if (this.detectionFailureCount > this.maxDetectionFailures) {
                    console.warn('⚠️ Face detection struggling, reducing frequency');
                    this.adaptDetectionFrequency();
                }
            }
            
        } catch (error) {
            console.error('❌ Face detection error:', error);
            this.detectionFailureCount++;
            
            // If detection keeps failing, stop it to save performance
            if (this.detectionFailureCount > this.maxDetectionFailures * 2) {
                console.warn('🚫 Too many face detection failures, switching to fallback mode');
                this.stopFaceDetection();
            }
        } finally {
            // Record face detection performance
            if (this.app.performanceMonitor) {
                this.app.performanceMonitor.measureFaceDetectionEnd();
            }
        }
    }
    
    getOptimalInputSize() {
        // Get current performance metrics
        const currentFPS = this.app.performanceMonitor ? 
            this.app.performanceMonitor.metrics.runtime.frameRate : 60;
        const detectionTime = this.app.performanceMonitor ? 
            this.app.performanceMonitor.metrics.runtime.faceDetectionTime : 50;
        
        // Adaptive input size based on performance
        if (currentFPS < 20 || detectionTime > 150) {
            return 128; // Smallest size for poor performance
        } else if (currentFPS < 40 || detectionTime > 100) {
            return 160; // Medium size for moderate performance
        } else {
            return 224; // Default size for good performance
        }
    }
    
    adaptDetectionFrequency() {
        if (!this.detectionInterval) return;
        
        // Clear current interval
        clearInterval(this.detectionInterval);
        
        // CRITICAL FIX: Minimal frequency reduction to maintain real-time tracking
        const currentInterval = this.getOptimalDetectionInterval();
        const newInterval = Math.min(currentInterval * 1.1, 100); // Max 10fps minimum for real-time
        
        console.log(`🔄 Adapting face detection frequency: ${(1000/newInterval).toFixed(1)}fps`);
        
        // Restart with new frequency
        this.detectionInterval = setInterval(() => {
            this.detectFacesWithPerformanceMonitoring();
        }, newInterval);
        
        // CRITICAL FIX: Clear old detection results to force real-time fallback updates
        if (this.detectionFailureCount > this.maxDetectionFailures * 1.5) {
                this.lastDetectedFaces = []; // Clear stale positions after persistent failures
            }
    }
    
    // Legacy method for backward compatibility
    async detectFaces() {
        return this.detectFacesWithPerformanceMonitoring();
    }

    processFaceDetections(detections) {
        return detections.map((detection, index) => {
            const box = detection.detection.box;
            const landmarks = detection.landmarks;
            
            // Calculate key points for filter positioning
            const rawFaceCenter = {
                x: box.x + box.width / 2,
                y: box.y + box.height / 2
            };
            
            // Get forehead position (between eyebrows)
            const leftEyebrow = landmarks.getLeftEyeBrow();
            const rightEyebrow = landmarks.getRightEyeBrow();
            const rawForeheadCenter = this.calculateCenterPoint([
                leftEyebrow[0], leftEyebrow[4],
                rightEyebrow[0], rightEyebrow[4]
            ]);
            
            // Get top of head (extrapolated from face dimensions)
            const rawTopOfHead = {
                x: rawFaceCenter.x,
                y: box.y - (box.height * 0.3) // Extrapolate above face
            };
            
            // CRITICAL FIX: Apply position smoothing for real-time tracking
            const faceId = `face_${index}`; // Simple face ID for smoothing
            const lastSmoothed = this.lastSmoothedPositions.get(faceId);
            
            let faceCenter, foreheadCenter, topOfHead;
            
            if (lastSmoothed && this.smoothingFactor > 0) {
                // Apply exponential smoothing for stable tracking
                faceCenter = {
                    x: lastSmoothed.faceCenter.x * this.smoothingFactor + rawFaceCenter.x * (1 - this.smoothingFactor),
                    y: lastSmoothed.faceCenter.y * this.smoothingFactor + rawFaceCenter.y * (1 - this.smoothingFactor)
                };
                
                foreheadCenter = {
                    x: lastSmoothed.foreheadCenter.x * this.smoothingFactor + rawForeheadCenter.x * (1 - this.smoothingFactor),
                    y: lastSmoothed.foreheadCenter.y * this.smoothingFactor + rawForeheadCenter.y * (1 - this.smoothingFactor)
                };
                
                topOfHead = {
                    x: lastSmoothed.topOfHead.x * this.smoothingFactor + rawTopOfHead.x * (1 - this.smoothingFactor),
                    y: lastSmoothed.topOfHead.y * this.smoothingFactor + rawTopOfHead.y * (1 - this.smoothingFactor)
                };
            } else {
                // First detection or smoothing disabled
                faceCenter = rawFaceCenter;
                foreheadCenter = rawForeheadCenter;
                topOfHead = rawTopOfHead;
            }
            
            const processedFace = {
                box,
                faceCenter,
                foreheadCenter,
                topOfHead,
                faceSize: Math.max(box.width, box.height),
                confidence: detection.detection.score
            };
            
            // Store smoothed positions for next frame
            this.lastSmoothedPositions.set(faceId, {
                faceCenter,
                foreheadCenter,
                topOfHead
            });
            
            return processedFace;
        });
    }

    calculateCenterPoint(points) {
        const centerX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
        const centerY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
        return { x: centerX, y: centerY };
    }

    // Enhanced filter rendering with face detection
    /**
     * Render a specific filter on the provided canvas context.
     * Calculates optimal positioning based on face detection or fallback coordinates,
     * supports multiple faces, and applies performance optimizations.
     * 
     * @param {CanvasRenderingContext2D} ctx - Canvas context for rendering
     * @param {string} filterId - ID of the filter to render
     * @public
     */
    renderFilter(ctx, filterId) {
        if (!this.filterConfigs[filterId]) return;
        
        const config = this.filterConfigs[filterId];
        const positions = this.getFilterPositions(filterId);
        
        // Render filter at all detected positions (multiple faces)
        positions.forEach((position, index) => {
            this.drawFilterAtPosition(ctx, config, position, index);
        });
    }

    /**
     * Calculate optimal positions for a filter based on detected faces or fallback.
     * Converts face detection coordinates to canvas coordinates and applies offsets.
     * 
     * @param {string} filterId - ID of the filter to position
     * @returns {Array<Object>} Array of position objects with x, y, size, and confidence
     * @private
     */
    getFilterPositions(filterId) {
        const config = this.filterConfigs[filterId];
        const positions = [];
        
        if (this.lastDetectedFaces.length > 0) {
            // Use face detection positions for real-time tracking
            this.lastDetectedFaces.forEach(face => {
                let basePosition;
                
                switch (config.position) {
                    case 'forehead':
                        basePosition = face.foreheadCenter;
                        break;
                    case 'top':
                        basePosition = face.topOfHead;
                        break;
                    default:
                        basePosition = face.faceCenter;
                }
                
                // Convert video coordinates to canvas coordinates
                const canvasPos = this.app.getVideoToCanvasCoordinates(
                    basePosition.x, 
                    basePosition.y
                );
                
                // Apply offsets
                const position = {
                    x: canvasPos.x + config.offsetX,
                    y: canvasPos.y + config.offsetY,
                    size: config.scaleWithFace ? 
                        this.calculateFaceScaledSize(config.baseSize, face.faceSize) :
                        this.calculateResponsiveSize(config.baseSize),
                    confidence: face.confidence
                };
                
                positions.push(position);
            });
        } else {
            // Use fallback position when no face detected
            if (!this.fallbackPositions[filterId]) {
                this.updateFallbackPositions();
            }
            
            if (this.fallbackPositions[filterId]) {
                positions.push(this.fallbackPositions[filterId]);
            }
        }
        
        return positions;
    }

    /**
     * Draw a filter at a specific position with performance optimizations.
     * Handles caching, shadow effects, and confidence-based opacity.
     * 
     * @param {CanvasRenderingContext2D} ctx - Canvas context for rendering
     * @param {Object} config - Filter configuration object
     * @param {Object} position - Position object with x, y, size properties
     * @param {number} index - Index for multi-face scenarios
     * @private
     */
    drawFilterAtPosition(ctx, config, position, index = 0) {
        if (!position || !this.app.canvasDisplaySize) {
            return;
        }
        
        // Use cached rendering for better performance
        const cacheKey = this.generateCacheKey(config, position, index);
        const cachedFilter = this.getCachedFilter(cacheKey);
        
        if (cachedFilter && this.enableFilterCaching) {
            // Use cached version for better performance
            ctx.drawImage(cachedFilter.canvas, position.x - cachedFilter.width/2, position.y - cachedFilter.height/2);
            return;
        }
        
        // Save context state
        ctx.save();
        
        // Calculate final size and position
        const size = Math.max(position.size || config.baseSize, 24); // Minimum size
        const x = position.x;
        const y = position.y;
        
        // Apply confidence-based opacity for face detection
        if (position.confidence !== undefined) {
            const alpha = Math.max(position.confidence, 0.7);
            ctx.globalAlpha = alpha;
        }
        
        // Set up font and styling with performance optimizations
        ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Optimize shadow rendering for performance
        if (this.enableHighQualityEffects) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = Math.max(6, size * 0.15);
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
        }
        
        // Draw the emoji filter
        ctx.fillText(config.emoji, x, y);
        
        // Add outline only if high quality effects are enabled
        if (this.enableHighQualityEffects) {
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = Math.max(1, size * 0.03);
            ctx.strokeText(config.emoji, x, y);
        }
        
        // Cache the rendered filter if caching is enabled
        if (this.enableFilterCaching && !cachedFilter) {
            this.cacheFilter(cacheKey, ctx, x, y, size);
        }
        
        // Restore context state
        ctx.restore();
        
        // Debug visualization (only in development)
        if (this.app.debug && position.confidence !== undefined) {
            this.drawDebugInfo(ctx, position, index);
        }
    }

    calculateResponsiveSize(baseSize) {
        if (!this.app.canvasDisplaySize) return baseSize;
        
        // Scale based on canvas width, with reasonable bounds
        const scaleFactor = this.app.canvasDisplaySize.width / 400;
        return Math.max(Math.min(baseSize * scaleFactor, baseSize * 2), baseSize * 0.5);
    }

    calculateFaceScaledSize(baseSize, faceSize) {
        if (!this.app.videoSize) return this.calculateResponsiveSize(baseSize);
        
        // Scale filter size based on detected face size
        const videoWidth = this.app.videoSize.width;
        const relativeFaceSize = faceSize / videoWidth;
        
        // Reasonable scaling range
        const scaleFactor = Math.max(Math.min(relativeFaceSize * 2.5, 2), 0.5);
        
        return this.calculateResponsiveSize(baseSize * scaleFactor);
    }

    drawDebugInfo(ctx, position, index) {
        ctx.save();
        
        // Draw position indicator
        ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.fillRect(position.x - 2, position.y - 2, 4, 4);
        
        // Draw confidence text
        ctx.font = '12px Arial';
        ctx.fillStyle = 'red';
        ctx.textAlign = 'left';
        ctx.fillText(
            `Face ${index + 1}: ${(position.confidence * 100).toFixed(0)}%`,
            10,
            20 + (index * 15)
        );
        
        ctx.restore();
    }

    // Integration with PhotoBoothApp
    applyFilterToOverlay(ctx, filterId) {
        if (filterId === 'none') {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            return;
        }
        
        // Performance tracking
        const startTime = performance.now();
        this.renderCount++;
        
        // Clear the canvas
        ctx.clearRect(0, 0, this.app.canvasDisplaySize.width, this.app.canvasDisplaySize.height);
        
        // Render the filter
        this.renderFilter(ctx, filterId);
        
        // Track render time for performance optimization
        const renderTime = performance.now() - startTime;
        this.lastRenderTime = renderTime;
        
        // Auto-optimize if render is taking too long
        if (renderTime > 33 && this.enableHighQualityEffects) { // > 30fps
            console.warn(`🐌 Slow filter render (${renderTime.toFixed(2)}ms), considering optimizations`);
            if (this.renderCount % 10 === 0) { // Every 10th slow render
                this.enableHighQualityEffects = false;
                console.log('🔧 Disabled high quality effects for better performance');
            }
        }
    }

    applyFilterToCapture(ctx, filterId) {
        if (filterId === 'none') return;
        
        // Render filter on capture canvas
        this.renderFilter(ctx, filterId);
    }

    // Handle orientation changes and canvas updates
    onOrientationChange() {
        console.log('🎭 Filter system handling orientation change');
        
        // Update fallback positions
        setTimeout(() => {
            this.updateFallbackPositions();
        }, 100);
    }

    // Manual positioning fallback (future enhancement)
    enableManualPositioning(filterId, callback) {
        console.log(`🎯 Enabling manual positioning for ${filterId}`);
        
        // This could be enhanced to allow users to drag and position filters
        // For now, we use the fallback positions
        if (callback) callback(this.fallbackPositions[filterId]);
    }

    // Filter caching methods for performance optimization
    generateCacheKey(config, position, index) {
        // Create cache key based on filter config and approximate position/size
        const sizeKey = Math.round(position.size / 10) * 10; // Round to nearest 10 for cache efficiency
        return `${config.emoji}_${sizeKey}_${this.enableHighQualityEffects ? 'hq' : 'lq'}`;
    }
    
    getCachedFilter(cacheKey) {
        const cached = this.filterCache.get(cacheKey);
        if (cached && (performance.now() - cached.timestamp < 30000)) { // 30 second cache
            return cached;
        }
        return null;
    }
    
    cacheFilter(cacheKey, ctx, x, y, size) {
        try {
            // Create a temporary canvas for the cached filter
            const cacheCanvas = document.createElement('canvas');
            const cacheSize = size * 1.5; // Add some padding
            cacheCanvas.width = cacheSize;
            cacheCanvas.height = cacheSize;
            
            // Cache the filter rendering (this would be more complex in a real implementation)
            // For now, just store metadata
            this.filterCache.set(cacheKey, {
                canvas: cacheCanvas,
                width: cacheSize,
                height: cacheSize,
                timestamp: performance.now()
            });
            
            // Limit cache size
            if (this.filterCache.size > this.maxCacheSize) {
                const oldestKey = this.filterCache.keys().next().value;
                this.filterCache.delete(oldestKey);
            }
        } catch (error) {
            console.warn('Failed to cache filter:', error);
        }
    }
    
    clearFilterCache() {
        this.filterCache.clear();
        console.log('🧹 Filter cache cleared');
    }
    
    // Performance optimization methods
    optimizeForDevice(deviceClass) {
        switch (deviceClass) {
            case 'low':
                this.enableFilterCaching = true;
                this.enableHighQualityEffects = false;
                this.maxCacheSize = 20;
                console.log('🔧 Filter system optimized for low-end device');
                break;
            case 'medium':
                this.enableFilterCaching = true;
                this.enableHighQualityEffects = true;
                this.maxCacheSize = 35;
                console.log('🔧 Filter system optimized for medium device');
                break;
            case 'high':
                this.enableFilterCaching = false; // High-end devices can render in real-time
                this.enableHighQualityEffects = true;
                this.maxCacheSize = 50;
                console.log('🔧 Filter system optimized for high-end device');
                break;
        }
    }
    
    // Performance monitoring
    getPerformanceMetrics() {
        return {
            faceDetectionActive: this.faceDetectionActive,
            detectedFaces: this.lastDetectedFaces.length,
            detectionFailures: this.detectionFailureCount,
            usingFallback: this.lastDetectedFaces.length === 0,
            renderCount: this.renderCount,
            cacheSize: this.filterCache.size,
            enabledOptimizations: {
                filterCaching: this.enableFilterCaching,
                highQualityEffects: this.enableHighQualityEffects
            }
        };
    }

    // Cleanup
    cleanup() {
        console.log('🧹 Cleaning up Filter System');
        this.stopFaceDetection();
        this.lastDetectedFaces = [];
        this.lastSmoothedPositions.clear(); // CRITICAL FIX: Clear smoothed positions
        this.fallbackPositions = {};
        this.clearFilterCache();
        
        // Clear status logging interval
        if (this.statusLogInterval) {
            clearInterval(this.statusLogInterval);
            this.statusLogInterval = null;
        }
    }
}

// Enhance PhotoBoothApp with filter system
if (typeof PhotoBoothApp !== 'undefined') {
    console.log('🔗 Integrating Filter System with PhotoBoothApp');
    
    const originalInit = PhotoBoothApp.prototype.init;
    PhotoBoothApp.prototype.init = async function() {
        await originalInit.call(this);
        
        // Initialize filter system after app is ready
        this.filterSystem = new FilterSystem(this);
    };
    
    const originalApplyFilterToOverlay = PhotoBoothApp.prototype.applyFilterToOverlay;
    PhotoBoothApp.prototype.applyFilterToOverlay = function(ctx) {
        if (this.filterSystem) {
            this.filterSystem.applyFilterToOverlay(ctx, this.currentFilter);
        } else {
            // Fallback to original implementation
            originalApplyFilterToOverlay.call(this, ctx);
        }
    };
    
    const originalApplyFilterToCanvas = PhotoBoothApp.prototype.applyFilterToCanvas;
    PhotoBoothApp.prototype.applyFilterToCanvas = async function(ctx) {
        if (this.filterSystem) {
            this.filterSystem.applyFilterToCapture(ctx, this.currentFilter);
        } else {
            // Fallback to original implementation
            await originalApplyFilterToCanvas.call(this, ctx);
        }
    };
    
    const originalHandleOrientationChange = PhotoBoothApp.prototype.handleOrientationChange;
    PhotoBoothApp.prototype.handleOrientationChange = function() {
        originalHandleOrientationChange.call(this);
        
        if (this.filterSystem) {
            this.filterSystem.onOrientationChange();
        }
    };
    
    // Add performance optimization integration
    const originalInit = PhotoBoothApp.prototype.init;
    PhotoBoothApp.prototype.init = async function() {
        await originalInit.call(this);
        
        // Optimize filter system based on device performance
        if (this.filterSystem && this.performanceOptimizer) {
            const deviceInfo = this.performanceOptimizer.monitor.classifyDevicePerformance();
            this.filterSystem.optimizeForDevice(deviceInfo.deviceClass);
        }
    };
    
    const originalCleanup = PhotoBoothApp.prototype.cleanup;
    PhotoBoothApp.prototype.cleanup = function() {
        if (this.filterSystem) {
            this.filterSystem.cleanup();
        }
        originalCleanup.call(this);
    };
}

// Export for use in other modules
window.FilterSystem = FilterSystem;
