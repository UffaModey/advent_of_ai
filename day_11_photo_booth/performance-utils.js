/**
 * Performance Utilities for Fun House Photo Booth
 * 
 * Comprehensive performance monitoring, measurement, and optimization system.
 * Provides real-time performance tracking, device classification, and automatic
 * optimization recommendations for optimal photo booth experience.
 * 
 * @namespace PerformanceUtils
 * @author Fun House Photo Booth Team
 * @version 1.0.0
 * @since 2024
 * 
 * Key Components:
 * - PerformanceMonitor: Real-time metrics collection and analysis
 * - PerformanceOptimizer: Automatic optimization based on device capabilities
 * 
 * @example
 * // Initialize performance monitoring
 * const monitor = new PerformanceMonitor();
 * monitor.markCameraInitStart();
 * // ... camera initialization ...
 * monitor.markCameraInitEnd();
 * 
 * @example
 * // Set up automatic optimization
 * const optimizer = new PerformanceOptimizer(photoBoothApp);
 * const report = optimizer.generateReport();
 * console.log('Performance rating:', report.summary.overallRating.rating);
 */

/**
 * Real-time performance monitoring system with comprehensive metrics collection.
 * Tracks startup times, runtime performance, memory usage, and provides
 * detailed performance analysis with optimization suggestions.
 * 
 * @class PerformanceMonitor
 */
class PerformanceMonitor {
    /**
     * Initialize performance monitoring with metric collection systems.
     * Sets up performance observers, memory monitoring, and metric tracking.
     * 
     * @constructor
     */
    constructor() {
        this.metrics = {
            startup: {
                cameraInitStart: null,
                cameraInitEnd: null,
                faceDetectionInitStart: null,
                faceDetectionInitEnd: null,
                totalStartupTime: null
            },
            runtime: {
                frameRate: 0,
                renderTime: 0,
                faceDetectionTime: 0,
                memoryUsage: 0,
                cpuUsage: 0
            },
            performance: {
                frameDrops: 0,
                renderCalls: 0,
                faceDetectionCalls: 0,
                lastFrameTime: 0,
                frameHistory: []
            }
        };
        
        this.isMonitoring = false;
        this.monitoringInterval = null;
        this.performanceObserver = null;
        this.frameRequestId = null;
        
        this.init();
    }

    /**
     * Initialize all monitoring systems and begin metric collection.
     * Sets up performance observers, memory monitoring, and frame rate tracking.
     * 
     * @private
     */
    init() {
        console.log('📊 Initializing Performance Monitor...');
        
        // Setup performance observer for detailed metrics
        this.setupPerformanceObserver();
        
        // Setup memory monitoring
        this.setupMemoryMonitoring();
        
        // Start basic monitoring
        this.startMonitoring();
    }

    setupPerformanceObserver() {
        if (typeof PerformanceObserver !== 'undefined') {
            try {
                this.performanceObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (entry.entryType === 'measure') {
                            this.recordPerformanceEntry(entry);
                        }
                    });
                });
                
                this.performanceObserver.observe({ 
                    entryTypes: ['measure', 'navigation', 'resource'] 
                });
                
                console.log('✅ Performance Observer setup complete');
            } catch (error) {
                console.warn('⚠️ Performance Observer not supported:', error);
            }
        }
    }

    setupMemoryMonitoring() {
        // Check for memory API support
        if (performance.memory) {
            console.log('✅ Memory monitoring available');
        } else {
            console.warn('⚠️ Memory monitoring not supported in this browser');
        }
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        
        // Monitor at 1Hz for basic metrics
        this.monitoringInterval = setInterval(() => {
            this.updateRuntimeMetrics();
        }, 1000);
        
        // Monitor frame rate at 60fps
        this.startFrameRateMonitoring();
        
        console.log('📊 Performance monitoring started');
    }

    stopMonitoring() {
        this.isMonitoring = false;
        
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        
        if (this.frameRequestId) {
            cancelAnimationFrame(this.frameRequestId);
            this.frameRequestId = null;
        }
        
        if (this.performanceObserver) {
            this.performanceObserver.disconnect();
        }
        
        console.log('📊 Performance monitoring stopped');
    }

    // Startup Performance Tracking
    /**
     * Mark the beginning of camera initialization for performance measurement.
     * Creates a performance mark for detailed timing analysis.
     * 
     * @public
     */
    markCameraInitStart() {
        this.metrics.startup.cameraInitStart = performance.now();
        performance.mark('camera-init-start');
    }

    /**
     * Mark the completion of camera initialization and calculate duration.
     * Measures total camera initialization time and evaluates performance.
     * 
     * @public
     * @returns {number} Camera initialization duration in milliseconds
     */
    markCameraInitEnd() {
        this.metrics.startup.cameraInitEnd = performance.now();
        performance.mark('camera-init-end');
        performance.measure('camera-initialization', 'camera-init-start', 'camera-init-end');
        
        const duration = this.metrics.startup.cameraInitEnd - this.metrics.startup.cameraInitStart;
        console.log(`📹 Camera initialization took ${duration.toFixed(2)}ms`);
        
        return duration;
    }

    markFaceDetectionInitStart() {
        this.metrics.startup.faceDetectionInitStart = performance.now();
        performance.mark('face-detection-init-start');
    }

    markFaceDetectionInitEnd() {
        this.metrics.startup.faceDetectionInitEnd = performance.now();
        performance.mark('face-detection-init-end');
        performance.measure('face-detection-initialization', 'face-detection-init-start', 'face-detection-init-end');
        
        const duration = this.metrics.startup.faceDetectionInitEnd - this.metrics.startup.faceDetectionInitStart;
        console.log(`🤖 Face detection initialization took ${duration.toFixed(2)}ms`);
        
        return duration;
    }

    markStartupComplete() {
        const totalTime = performance.now() - (this.metrics.startup.cameraInitStart || 0);
        this.metrics.startup.totalStartupTime = totalTime;
        
        console.log(`🎪 Total startup time: ${totalTime.toFixed(2)}ms`);
        
        // Evaluate startup performance
        this.evaluateStartupPerformance(totalTime);
        
        return totalTime;
    }

    evaluateStartupPerformance(startupTime) {
        const targets = {
            excellent: 2000,
            good: 3000,
            fair: 5000
        };
        
        let rating, suggestions = [];
        
        if (startupTime <= targets.excellent) {
            rating = '🟢 Excellent';
        } else if (startupTime <= targets.good) {
            rating = '🟡 Good';
            suggestions.push('Consider optimizing model loading');
        } else if (startupTime <= targets.fair) {
            rating = '🟠 Fair';
            suggestions.push('Camera initialization is slow');
            suggestions.push('Consider preloading face detection models');
        } else {
            rating = '🔴 Poor';
            suggestions.push('Significant startup optimization needed');
            suggestions.push('Consider lazy loading face detection');
            suggestions.push('Implement progressive camera initialization');
        }
        
        console.log(`📊 Startup Performance: ${rating} (${startupTime.toFixed(2)}ms)`);
        if (suggestions.length > 0) {
            console.log('💡 Suggestions:', suggestions);
        }
    }

    // Runtime Performance Tracking
    startFrameRateMonitoring() {
        let lastTime = performance.now();
        let frameCount = 0;
        const frameHistory = [];
        
        const measureFrame = (currentTime) => {
            const delta = currentTime - lastTime;
            frameCount++;
            
            // Store frame time
            frameHistory.push(delta);
            if (frameHistory.length > 60) {
                frameHistory.shift(); // Keep last 60 frames
            }
            
            // Update frame rate every 60 frames or 1 second
            if (frameCount >= 60 || delta >= 1000) {
                const averageFrameTime = frameHistory.reduce((a, b) => a + b, 0) / frameHistory.length;
                const fps = 1000 / averageFrameTime;
                
                this.metrics.runtime.frameRate = fps;
                this.metrics.performance.frameHistory = [...frameHistory];
                
                // Detect frame drops
                const frameDrops = frameHistory.filter(time => time > 33).length; // >30fps
                this.metrics.performance.frameDrops += frameDrops;
                
                frameCount = 0;
            }
            
            lastTime = currentTime;
            this.frameRequestId = requestAnimationFrame(measureFrame);
        };
        
        this.frameRequestId = requestAnimationFrame(measureFrame);
    }

    // Measure render performance
    measureRenderStart() {
        this.renderStartTime = performance.now();
        performance.mark('render-start');
    }

    measureRenderEnd() {
        const renderTime = performance.now() - this.renderStartTime;
        this.metrics.runtime.renderTime = renderTime;
        this.metrics.performance.renderCalls++;
        
        performance.mark('render-end');
        performance.measure('render-operation', 'render-start', 'render-end');
        
        // Log slow renders
        if (renderTime > 16) { // Slower than 60fps
            console.warn(`🐌 Slow render detected: ${renderTime.toFixed(2)}ms`);
        }
        
        return renderTime;
    }

    // Measure face detection performance
    measureFaceDetectionStart() {
        this.faceDetectionStartTime = performance.now();
        performance.mark('face-detection-start');
    }

    measureFaceDetectionEnd() {
        const detectionTime = performance.now() - this.faceDetectionStartTime;
        this.metrics.runtime.faceDetectionTime = detectionTime;
        this.metrics.performance.faceDetectionCalls++;
        
        performance.mark('face-detection-end');
        performance.measure('face-detection-operation', 'face-detection-start', 'face-detection-end');
        
        // Target: 15fps = 66ms per detection
        if (detectionTime > 100) {
            console.warn(`🐌 Slow face detection: ${detectionTime.toFixed(2)}ms`);
        }
        
        return detectionTime;
    }

    updateRuntimeMetrics() {
        // Update memory usage
        if (performance.memory) {
            this.metrics.runtime.memoryUsage = {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }
        
        // Check for memory leaks
        this.checkMemoryLeaks();
        
        // Update CPU usage estimate (basic)
        this.estimateCPUUsage();
    }

    checkMemoryLeaks() {
        if (!performance.memory) return;
        
        const used = this.metrics.runtime.memoryUsage.used;
        const limit = this.metrics.runtime.memoryUsage.limit;
        const usage = (used / limit) * 100;
        
        if (usage > 80) {
            console.warn(`⚠️ High memory usage: ${usage.toFixed(1)}% (${used}MB/${limit}MB)`);
        }
    }

    estimateCPUUsage() {
        // Simple CPU usage estimation based on frame timing
        const avgFrameTime = this.metrics.performance.frameHistory.length > 0 
            ? this.metrics.performance.frameHistory.reduce((a, b) => a + b, 0) / this.metrics.performance.frameHistory.length 
            : 0;
        
        const targetFrameTime = 1000 / 60; // 60fps = 16.67ms
        const cpuUsage = Math.min((avgFrameTime / targetFrameTime) * 100, 100);
        
        this.metrics.runtime.cpuUsage = cpuUsage;
    }

    recordPerformanceEntry(entry) {
        const category = entry.name.split('-')[0];
        
        switch (category) {
            case 'camera':
                console.log(`📹 Camera operation: ${entry.duration.toFixed(2)}ms`);
                break;
            case 'render':
                // Already handled in measureRenderEnd
                break;
            case 'face':
                // Already handled in measureFaceDetectionEnd
                break;
        }
    }

    // Device Performance Classification
    /**
     * Analyze device capabilities and classify performance tier.
     * Considers memory, CPU cores, and network speed to determine
     * optimal settings and feature recommendations.
     * 
     * @public
     * @returns {Object} Device classification with performance recommendations
     * @returns {string} returns.deviceClass - 'low', 'medium', or 'high'
     * @returns {Object} returns.metrics - Device capability metrics
     * @returns {Object} returns.recommendations - Optimization recommendations
     */
    classifyDevicePerformance() {
        const metrics = {
            memory: performance.memory ? performance.memory.jsHeapSizeLimit / 1024 / 1024 : 1024,
            cores: navigator.hardwareConcurrency || 4,
            connection: navigator.connection ? navigator.connection.effectiveType : 'unknown'
        };
        
        let deviceClass = 'medium';
        let recommendations = {};
        
        // Low-end device detection
        if (metrics.memory < 2048 || metrics.cores < 4) {
            deviceClass = 'low';
            recommendations = {
                maxCanvasSize: { width: 960, height: 540 },
                targetFrameRate: 15,
                faceDetectionInterval: 300,
                enableHighDPI: false,
                enableFaceDetection: false
            };
        }
        // High-end device detection
        else if (metrics.memory > 8192 && metrics.cores > 8) {
            deviceClass = 'high';
            recommendations = {
                maxCanvasSize: { width: 1920, height: 1080 },
                targetFrameRate: 60,
                faceDetectionInterval: 100,
                enableHighDPI: true,
                enableFaceDetection: true
            };
        }
        // Medium device (default)
        else {
            recommendations = {
                maxCanvasSize: { width: 1280, height: 720 },
                targetFrameRate: 30,
                faceDetectionInterval: 200,
                enableHighDPI: true,
                enableFaceDetection: true
            };
        }
        
        console.log(`🔧 Device class: ${deviceClass}`, metrics);
        
        return {
            deviceClass,
            metrics,
            recommendations
        };
    }

    // Performance Optimization Suggestions
    getOptimizationSuggestions() {
        const suggestions = [];
        const metrics = this.metrics.runtime;
        
        // Frame rate issues
        if (metrics.frameRate < 30) {
            suggestions.push({
                issue: 'Low frame rate',
                suggestion: 'Reduce render frequency or simplify effects',
                priority: 'high'
            });
        }
        
        // Memory issues
        if (metrics.memoryUsage && metrics.memoryUsage.used > metrics.memoryUsage.limit * 0.8) {
            suggestions.push({
                issue: 'High memory usage',
                suggestion: 'Implement texture caching and cleanup',
                priority: 'high'
            });
        }
        
        // Render performance
        if (metrics.renderTime > 16) {
            suggestions.push({
                issue: 'Slow rendering',
                suggestion: 'Optimize canvas operations and reduce overdraw',
                priority: 'medium'
            });
        }
        
        // Face detection performance
        if (metrics.faceDetectionTime > 66) {
            suggestions.push({
                issue: 'Slow face detection',
                suggestion: 'Reduce detection frequency or input size',
                priority: 'medium'
            });
        }
        
        return suggestions;
    }

    // Generate Performance Report
    /**
     * Generate comprehensive performance report with metrics and recommendations.
     * Includes startup times, runtime performance, device classification,
     * and actionable optimization suggestions.
     * 
     * @public
     * @returns {Object} Complete performance report
     */
    generateReport() {
        const deviceInfo = this.classifyDevicePerformance();
        const suggestions = this.getOptimizationSuggestions();
        
        const report = {
            timestamp: new Date().toISOString(),
            startup: this.metrics.startup,
            runtime: this.metrics.runtime,
            performance: this.metrics.performance,
            device: deviceInfo,
            suggestions: suggestions,
            summary: {
                overallRating: this.calculateOverallRating(),
                keyMetrics: {
                    startupTime: this.metrics.startup.totalStartupTime,
                    frameRate: Math.round(this.metrics.runtime.frameRate),
                    memoryUsage: this.metrics.runtime.memoryUsage ? 
                        `${this.metrics.runtime.memoryUsage.used}MB` : 'Unknown',
                    avgRenderTime: this.metrics.runtime.renderTime.toFixed(2) + 'ms'
                }
            }
        };
        
        return report;
    }

    calculateOverallRating() {
        const factors = [];
        
        // Startup time rating (0-100)
        const startupScore = Math.max(0, 100 - (this.metrics.startup.totalStartupTime || 5000) / 50);
        factors.push({ name: 'startup', score: startupScore, weight: 0.3 });
        
        // Frame rate rating (0-100)
        const frameScore = Math.min(100, (this.metrics.runtime.frameRate / 60) * 100);
        factors.push({ name: 'frameRate', score: frameScore, weight: 0.4 });
        
        // Memory efficiency rating (0-100)
        const memoryScore = this.metrics.runtime.memoryUsage ? 
            Math.max(0, 100 - (this.metrics.runtime.memoryUsage.used / this.metrics.runtime.memoryUsage.limit * 100)) : 
            50;
        factors.push({ name: 'memory', score: memoryScore, weight: 0.3 });
        
        const totalScore = factors.reduce((sum, factor) => sum + (factor.score * factor.weight), 0);
        
        return {
            score: Math.round(totalScore),
            factors: factors,
            rating: totalScore > 80 ? 'Excellent' : 
                   totalScore > 60 ? 'Good' : 
                   totalScore > 40 ? 'Fair' : 'Poor'
        };
    }

    // Log current performance state
    logCurrentState() {
        const report = this.generateReport();
        
        console.group('📊 Performance Report');
        console.log('Overall Rating:', report.summary.overallRating.rating, `(${report.summary.overallRating.score}/100)`);
        console.log('Key Metrics:', report.summary.keyMetrics);
        
        if (report.suggestions.length > 0) {
            console.group('💡 Optimization Suggestions');
            report.suggestions.forEach(suggestion => {
                console.log(`${suggestion.priority === 'high' ? '🔴' : '🟡'} ${suggestion.issue}: ${suggestion.suggestion}`);
            });
            console.groupEnd();
        }
        
        console.groupEnd();
    }

    // Cleanup
    cleanup() {
        console.log('🧹 Cleaning up Performance Monitor');
        this.stopMonitoring();
    }
}

// Performance Optimization Utilities
/**
 * Automatic performance optimization system that adapts application behavior
 * based on device capabilities and real-time performance metrics.
 * 
 * @class PerformanceOptimizer
 */
class PerformanceOptimizer {
    /**
     * Initialize performance optimizer with application reference.
     * Sets up device classification, monitoring, and automatic optimizations.
     * 
     * @constructor
     * @param {PhotoBoothApp} photoBoothApp - Main application instance
     */
    constructor(photoBoothApp) {
        this.app = photoBoothApp;
        this.monitor = new PerformanceMonitor();
        this.optimizations = new Map();
        
        this.init();
    }

    /**
     * Initialize optimization system and apply device-specific settings.
     * Analyzes device capabilities and applies appropriate optimizations.
     * 
     * @private
     */
    init() {
        console.log('🚀 Initializing Performance Optimizer...');
        
        // Apply device-specific optimizations
        this.applyDeviceOptimizations();
        
        // Setup automatic optimization triggers
        this.setupAutoOptimizations();
        
        console.log('✅ Performance Optimizer ready');
    }

    /**
     * Apply performance optimizations based on device classification.
     * Adjusts canvas size, frame rate, face detection, and display settings
     * based on device capabilities.
     * 
     * @private
     */
    applyDeviceOptimizations() {
        const deviceInfo = this.monitor.classifyDevicePerformance();
        const recommendations = deviceInfo.recommendations;
        
        console.log(`🔧 Applying ${deviceInfo.deviceClass} device optimizations`);
        
        // Apply canvas size optimizations
        this.optimizeCanvasSize(recommendations.maxCanvasSize);
        
        // Apply frame rate optimizations
        this.optimizeFrameRate(recommendations.targetFrameRate);
        
        // Apply face detection optimizations
        this.optimizeFaceDetection(recommendations.faceDetectionInterval, recommendations.enableFaceDetection);
        
        // Apply high-DPI optimizations
        this.optimizeHighDPI(recommendations.enableHighDPI);
    }

    optimizeCanvasSize(maxSize) {
        if (this.app.canvasDisplaySize) {
            const currentSize = this.app.canvasDisplaySize;
            
            if (currentSize.width > maxSize.width || currentSize.height > maxSize.height) {
                console.log(`📐 Optimizing canvas size from ${currentSize.width}x${currentSize.height} to max ${maxSize.width}x${maxSize.height}`);
                
                // This would trigger a canvas resize in the app
                this.optimizations.set('canvasSize', maxSize);
            }
        }
    }

    optimizeFrameRate(targetFPS) {
        const frameInterval = 1000 / targetFPS;
        
        console.log(`🎬 Setting target frame rate to ${targetFPS} fps (${frameInterval}ms interval)`);
        
        // Store optimization setting
        this.optimizations.set('frameRate', { fps: targetFPS, interval: frameInterval });
        
        // Apply to overlay rendering if available
        if (this.app.filterSystem) {
            this.app.filterSystem.renderInterval = frameInterval;
        }
    }

    optimizeFaceDetection(interval, enabled) {
        console.log(`🤖 Face detection optimization: ${enabled ? 'enabled' : 'disabled'} at ${interval}ms interval`);
        
        this.optimizations.set('faceDetection', { enabled, interval });
        
        // Apply to filter system
        if (this.app.filterSystem) {
            if (!enabled) {
                this.app.filterSystem.stopFaceDetection();
            } else if (this.app.filterSystem.detectionInterval) {
                clearInterval(this.app.filterSystem.detectionInterval);
                this.app.filterSystem.detectionInterval = setInterval(() => {
                    this.app.filterSystem.detectFaces();
                }, interval);
            }
        }
    }

    optimizeHighDPI(enabled) {
        console.log(`🖥️ High-DPI optimization: ${enabled ? 'enabled' : 'disabled'}`);
        
        this.optimizations.set('highDPI', enabled);
        
        // This would affect pixel ratio calculations in the app
        if (!enabled && this.app.getPixelRatio) {
            this.app.getPixelRatio = () => 1; // Force 1x scaling
        }
    }

    setupAutoOptimizations() {
        // Monitor performance and trigger optimizations
        setInterval(() => {
            this.checkAndOptimize();
        }, 5000); // Check every 5 seconds
    }

    /**
     * Monitor current performance and apply automatic optimizations.
     * Checks for high-priority performance issues and applies corrections.
     * 
     * @private
     */
    checkAndOptimize() {
        const suggestions = this.monitor.getOptimizationSuggestions();
        
        suggestions.forEach(suggestion => {
            if (suggestion.priority === 'high') {
                this.applyAutoOptimization(suggestion);
            }
        });
    }

    applyAutoOptimization(suggestion) {
        console.log(`🔧 Auto-applying optimization: ${suggestion.suggestion}`);
        
        switch (suggestion.issue) {
            case 'Low frame rate':
                // Reduce render frequency
                const currentFPS = this.optimizations.get('frameRate')?.fps || 30;
                if (currentFPS > 15) {
                    this.optimizeFrameRate(Math.max(15, currentFPS - 5));
                }
                break;
                
            case 'High memory usage':
                // Trigger cleanup
                this.triggerMemoryCleanup();
                break;
                
            case 'Slow face detection':
                // Increase detection interval
                const currentInterval = this.optimizations.get('faceDetection')?.interval || 200;
                if (currentInterval < 500) {
                    this.optimizeFaceDetection(currentInterval + 100, true);
                }
                break;
        }
    }

    triggerMemoryCleanup() {
        console.log('🧹 Triggering memory cleanup...');
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        // Clear any cached textures or temporary objects
        if (this.app.filterSystem) {
            this.app.filterSystem.clearCache?.();
        }
    }

    // Get current optimization state
    getOptimizationState() {
        return {
            applied: Object.fromEntries(this.optimizations),
            suggestions: this.monitor.getOptimizationSuggestions(),
            performance: this.monitor.metrics.runtime
        };
    }

    // Enable/disable specific optimizations
    toggleOptimization(type, enabled) {
        switch (type) {
            case 'faceDetection':
                this.optimizeFaceDetection(
                    this.optimizations.get('faceDetection')?.interval || 200,
                    enabled
                );
                break;
                
            case 'highDPI':
                this.optimizeHighDPI(enabled);
                break;
                
            default:
                console.warn(`Unknown optimization type: ${type}`);
        }
    }

    // Generate performance report
    generateReport() {
        return this.monitor.generateReport();
    }

    // Cleanup
    cleanup() {
        console.log('🧹 Cleaning up Performance Optimizer');
        this.monitor.cleanup();
        this.optimizations.clear();
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.PerformanceMonitor = PerformanceMonitor;
    window.PerformanceOptimizer = PerformanceOptimizer;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PerformanceMonitor, PerformanceOptimizer };
}