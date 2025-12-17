/**
 * URGENT FILTER SYSTEM DIAGNOSTIC AND FIX SCRIPT
 * 
 * This script diagnoses and fixes critical issues with the filter positioning system:
 * 1. Face detection not working
 * 2. Filters not appearing on faces
 * 3. Coordinate mapping problems
 * 4. Filter rendering issues
 */

class FilterSystemDiagnostic {
    constructor() {
        this.results = {
            faceApi: false,
            filterSystem: false,
            canvasDimensions: false,
            coordinateMapping: false,
            filterRendering: false,
            fallbackPositioning: false
        };
        
        this.fixes = [];
        this.errors = [];
        
        console.log('🔧 URGENT: Starting Filter System Diagnostic...');
    }
    
    async runFullDiagnostic() {
        console.log('🚨 RUNNING COMPREHENSIVE FILTER SYSTEM DIAGNOSTIC');
        
        // Test 1: Face API Loading
        await this.testFaceAPILoading();
        
        // Test 2: Filter System Initialization
        this.testFilterSystemInit();
        
        // Test 3: Canvas Dimensions and Positioning
        this.testCanvasDimensions();
        
        // Test 4: Coordinate Mapping
        this.testCoordinateMapping();
        
        // Test 5: Filter Rendering
        this.testFilterRendering();
        
        // Test 6: Fallback Positioning
        this.testFallbackPositioning();
        
        // Generate report and apply fixes
        this.generateReport();
        await this.applyFixes();
        
        return this.results;
    }
    
    async testFaceAPILoading() {
        console.log('🤖 Testing Face API Loading...');
        
        try {
            if (typeof faceapi === 'undefined') {
                this.errors.push('CRITICAL: Face API not loaded');
                this.fixes.push('loadFaceAPI');
                return false;
            }
            
            // Test if models are loaded
            const modelUrl = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model';
            
            try {
                await Promise.race([
                    Promise.all([
                        faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
                        faceapi.nets.faceLandmark68TinyNet.loadFromUri(modelUrl)
                    ]),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Model loading timeout')), 10000))
                ]);
                
                console.log('✅ Face API models loaded successfully');
                this.results.faceApi = true;
                return true;
                
            } catch (modelError) {
                this.errors.push(`Face API models failed to load: ${modelError.message}`);
                this.fixes.push('fixFaceAPIModels');
                return false;
            }
            
        } catch (error) {
            this.errors.push(`Face API error: ${error.message}`);
            this.fixes.push('loadFaceAPI');
            return false;
        }
    }
    
    testFilterSystemInit() {
        console.log('🎭 Testing Filter System Initialization...');
        
        const app = window.photoBoothApp;
        if (!app) {
            this.errors.push('CRITICAL: PhotoBoothApp not initialized');
            this.fixes.push('initializeApp');
            return false;
        }
        
        if (!app.filterSystem) {
            this.errors.push('CRITICAL: Filter System not initialized');
            this.fixes.push('initializeFilterSystem');
            return false;
        }
        
        // Test filter configurations
        const requiredFilters = ['snowflake-crown', 'reindeer-antlers', 'santa-hat'];
        let missingFilters = [];
        
        requiredFilters.forEach(filterId => {
            if (!app.filterSystem.filterConfigs[filterId]) {
                missingFilters.push(filterId);
            }
        });
        
        if (missingFilters.length > 0) {
            this.errors.push(`Missing filter configurations: ${missingFilters.join(', ')}`);
            this.fixes.push('fixFilterConfigs');
            return false;
        }
        
        console.log('✅ Filter System initialized correctly');
        this.results.filterSystem = true;
        return true;
    }
    
    testCanvasDimensions() {
        console.log('📐 Testing Canvas Dimensions...');
        
        const app = window.photoBoothApp;
        if (!app) return false;
        
        const video = app.video;
        const overlayCanvas = app.overlayCanvas;
        
        if (!video || !overlayCanvas) {
            this.errors.push('CRITICAL: Video or overlay canvas missing');
            this.fixes.push('setupCanvas');
            return false;
        }
        
        // Check if video has dimensions
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            this.errors.push('CRITICAL: Video dimensions not available');
            this.fixes.push('waitForVideo');
            return false;
        }
        
        // Check if canvas has dimensions
        if (overlayCanvas.width === 0 || overlayCanvas.height === 0) {
            this.errors.push('CRITICAL: Canvas dimensions not set');
            this.fixes.push('setupCanvasDimensions');
            return false;
        }
        
        // Check if canvasDisplaySize is set
        if (!app.canvasDisplaySize) {
            this.errors.push('CRITICAL: Canvas display size not calculated');
            this.fixes.push('calculateCanvasDisplaySize');
            return false;
        }
        
        console.log('✅ Canvas dimensions look correct');
        console.log(`Video: ${video.videoWidth}x${video.videoHeight}`);
        console.log(`Canvas: ${overlayCanvas.width}x${overlayCanvas.height}`);
        console.log(`Display: ${app.canvasDisplaySize.width}x${app.canvasDisplaySize.height}`);
        
        this.results.canvasDimensions = true;
        return true;
    }
    
    testCoordinateMapping() {
        console.log('🗺️ Testing Coordinate Mapping...');
        
        const app = window.photoBoothApp;
        if (!app || !app.canvasDisplaySize || !app.videoSize) {
            this.errors.push('Coordinate mapping prerequisites missing');
            return false;
        }
        
        // Test coordinate mapping functions
        if (typeof app.getVideoToCanvasCoordinates !== 'function') {
            this.errors.push('getVideoToCanvasCoordinates function missing');
            this.fixes.push('addCoordinateMappingFunctions');
            return false;
        }
        
        // Test with sample coordinates
        const testVideoX = app.videoSize.width / 2;
        const testVideoY = app.videoSize.height / 2;
        
        const canvasCoords = app.getVideoToCanvasCoordinates(testVideoX, testVideoY);
        
        console.log(`Test mapping: Video(${testVideoX}, ${testVideoY}) -> Canvas(${canvasCoords.x}, ${canvasCoords.y})`);
        
        if (!canvasCoords || typeof canvasCoords.x !== 'number' || typeof canvasCoords.y !== 'number') {
            this.errors.push('Coordinate mapping returns invalid results');
            this.fixes.push('fixCoordinateMapping');
            return false;
        }
        
        console.log('✅ Coordinate mapping working');
        this.results.coordinateMapping = true;
        return true;
    }
    
    testFilterRendering() {
        console.log('🎨 Testing Filter Rendering...');
        
        const app = window.photoBoothApp;
        if (!app || !app.overlayCtx) {
            this.errors.push('Canvas context not available');
            return false;
        }
        
        // Test direct filter rendering
        try {
            const ctx = app.overlayCtx;
            const testFilter = 'snowflake-crown';
            
            // Clear canvas
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            
            // Try to render filter
            if (app.filterSystem) {
                console.log('Testing FilterSystem rendering...');
                app.filterSystem.applyFilterToOverlay(ctx, testFilter);
            } else {
                console.log('Testing fallback rendering...');
                app.applyFilterToOverlay(ctx);
            }
            
            // Check if something was drawn (basic test)
            const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            let hasPixels = false;
            
            for (let i = 0; i < imageData.data.length; i += 4) {
                if (imageData.data[i + 3] > 0) { // Check alpha channel
                    hasPixels = true;
                    break;
                }
            }
            
            if (!hasPixels) {
                this.errors.push('Filter rendering produces no visible output');
                this.fixes.push('fixFilterRendering');
                return false;
            }
            
            console.log('✅ Filter rendering produces output');
            this.results.filterRendering = true;
            return true;
            
        } catch (error) {
            this.errors.push(`Filter rendering error: ${error.message}`);
            this.fixes.push('fixFilterRenderingError');
            return false;
        }
    }
    
    testFallbackPositioning() {
        console.log('🎯 Testing Fallback Positioning...');
        
        const app = window.photoBoothApp;
        if (!app || !app.filterSystem) {
            return false;
        }
        
        const filterSystem = app.filterSystem;
        
        // Check if fallback positions are calculated
        if (!filterSystem.fallbackPositions || Object.keys(filterSystem.fallbackPositions).length === 0) {
            this.errors.push('Fallback positions not calculated');
            this.fixes.push('calculateFallbackPositions');
            return false;
        }
        
        // Test each filter has a fallback position
        const requiredFilters = ['snowflake-crown', 'reindeer-antlers', 'santa-hat'];
        let missingFallbacks = [];
        
        requiredFilters.forEach(filterId => {
            if (!filterSystem.fallbackPositions[filterId]) {
                missingFallbacks.push(filterId);
            }
        });
        
        if (missingFallbacks.length > 0) {
            this.errors.push(`Missing fallback positions for: ${missingFallbacks.join(', ')}`);
            this.fixes.push('createMissingFallbacks');
            return false;
        }
        
        console.log('✅ Fallback positioning configured');
        this.results.fallbackPositioning = true;
        return true;
    }
    
    generateReport() {
        console.log('📊 DIAGNOSTIC REPORT:');
        console.log('='.repeat(50));
        
        Object.entries(this.results).forEach(([test, passed]) => {
            const status = passed ? '✅ PASS' : '❌ FAIL';
            console.log(`${test}: ${status}`);
        });
        
        console.log('\n🚨 ERRORS FOUND:');
        this.errors.forEach(error => console.log(`❌ ${error}`));
        
        console.log('\n🔧 FIXES TO APPLY:');
        this.fixes.forEach(fix => console.log(`🔧 ${fix}`));
    }
    
    async applyFixes() {
        console.log('🔧 APPLYING FIXES...');
        
        for (const fix of this.fixes) {
            try {
                await this[fix]();
                console.log(`✅ Applied fix: ${fix}`);
            } catch (error) {
                console.error(`❌ Fix failed (${fix}):`, error);
            }
        }
    }
    
    // FIX METHODS
    async loadFaceAPI() {
        console.log('🔧 Loading Face API...');
        
        return new Promise((resolve, reject) => {
            if (typeof faceapi !== 'undefined') {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    async fixFaceAPIModels() {
        console.log('🔧 Fixing Face API models...');
        
        const modelUrl = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model';
        
        // Try alternative model URLs
        const alternativeUrls = [
            'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model',
            'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights',
            './models' // Local fallback
        ];
        
        for (const url of alternativeUrls) {
            try {
                await Promise.race([
                    Promise.all([
                        faceapi.nets.tinyFaceDetector.loadFromUri(url),
                        faceapi.nets.faceLandmark68TinyNet.loadFromUri(url)
                    ]),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
                ]);
                
                console.log(`✅ Models loaded from: ${url}`);
                return;
            } catch (error) {
                console.warn(`Failed to load from ${url}:`, error.message);
            }
        }
        
        throw new Error('All model URLs failed');
    }
    
    initializeApp() {
        console.log('🔧 Initializing app...');
        
        if (!window.photoBoothApp) {
            window.photoBoothApp = new PhotoBoothApp();
        }
    }
    
    initializeFilterSystem() {
        console.log('🔧 Initializing filter system...');
        
        const app = window.photoBoothApp;
        if (app && !app.filterSystem) {
            app.filterSystem = new FilterSystem(app);
        }
    }
    
    setupCanvas() {
        console.log('🔧 Setting up canvas...');
        
        const app = window.photoBoothApp;
        if (app && app.setupCanvases) {
            app.setupCanvases();
        }
    }
    
    waitForVideo() {
        console.log('🔧 Waiting for video...');
        
        return new Promise((resolve) => {
            const app = window.photoBoothApp;
            if (!app || !app.video) {
                resolve();
                return;
            }
            
            const checkVideo = () => {
                if (app.video.videoWidth > 0 && app.video.videoHeight > 0) {
                    resolve();
                } else {
                    setTimeout(checkVideo, 100);
                }
            };
            
            checkVideo();
        });
    }
    
    setupCanvasDimensions() {
        console.log('🔧 Setting up canvas dimensions...');
        
        const app = window.photoBoothApp;
        if (!app) return;
        
        const video = app.video;
        const overlayCanvas = app.overlayCanvas;
        
        if (video && overlayCanvas && video.videoWidth > 0 && video.videoHeight > 0) {
            const videoRect = video.getBoundingClientRect();
            
            overlayCanvas.width = Math.round(videoRect.width);
            overlayCanvas.height = Math.round(videoRect.height);
            
            overlayCanvas.style.width = videoRect.width + 'px';
            overlayCanvas.style.height = videoRect.height + 'px';
            overlayCanvas.style.position = 'absolute';
            overlayCanvas.style.top = (videoRect.top + window.scrollY) + 'px';
            overlayCanvas.style.left = (videoRect.left + window.scrollX) + 'px';
        }
    }
    
    calculateCanvasDisplaySize() {
        console.log('🔧 Calculating canvas display size...');
        
        const app = window.photoBoothApp;
        if (!app || !app.overlayCanvas) return;
        
        const videoRect = app.video ? app.video.getBoundingClientRect() : null;
        
        if (videoRect) {
            app.canvasDisplaySize = {
                width: Math.round(videoRect.width),
                height: Math.round(videoRect.height)
            };
            
            app.videoSize = {
                width: app.video.videoWidth,
                height: app.video.videoHeight
            };
            
            console.log('Canvas display size calculated:', app.canvasDisplaySize);
        }
    }
    
    addCoordinateMappingFunctions() {
        console.log('🔧 Adding coordinate mapping functions...');
        
        const app = window.photoBoothApp;
        if (!app) return;
        
        app.getVideoToCanvasCoordinates = function(videoX, videoY) {
            if (!this.videoSize || !this.canvasDisplaySize) {
                return { x: videoX, y: videoY };
            }
            
            const scaleX = this.canvasDisplaySize.width / this.videoSize.width;
            const scaleY = this.canvasDisplaySize.height / this.videoSize.height;
            
            return {
                x: videoX * scaleX,
                y: videoY * scaleY
            };
        };
        
        app.getCanvasToVideoCoordinates = function(canvasX, canvasY) {
            if (!this.videoSize || !this.canvasDisplaySize) {
                return { x: canvasX, y: canvasY };
            }
            
            const scaleX = this.videoSize.width / this.canvasDisplaySize.width;
            const scaleY = this.videoSize.height / this.canvasDisplaySize.height;
            
            return {
                x: canvasX * scaleX,
                y: canvasY * scaleY
            };
        };
    }
    
    fixCoordinateMapping() {
        console.log('🔧 Fixing coordinate mapping...');
        this.addCoordinateMappingFunctions();
    }
    
    fixFilterConfigs() {
        console.log('🔧 Fixing filter configurations...');
        
        const app = window.photoBoothApp;
        if (!app || !app.filterSystem) return;
        
        // Ensure all required filter configs exist
        const requiredConfigs = {
            'snowflake-crown': {
                emoji: '❄️👑❄️',
                baseSize: 48,
                position: 'forehead',
                offsetY: -20,
                offsetX: 0,
                scaleWithFace: true,
                fallback: { x: 0.5, y: 0.3 }
            },
            'reindeer-antlers': {
                emoji: '🦌',
                baseSize: 52,
                position: 'top',
                offsetY: -40,
                offsetX: 0,
                scaleWithFace: true,
                fallback: { x: 0.5, y: 0.25 }
            },
            'santa-hat': {
                emoji: '🎅',
                baseSize: 50,
                position: 'top',
                offsetY: -25,
                offsetX: -5,
                scaleWithFace: true,
                fallback: { x: 0.5, y: 0.3 }
            }
        };
        
        Object.assign(app.filterSystem.filterConfigs, requiredConfigs);
    }
    
    calculateFallbackPositions() {
        console.log('🔧 Calculating fallback positions...');
        
        const app = window.photoBoothApp;
        if (!app || !app.filterSystem) return;
        
        app.filterSystem.updateFallbackPositions();
    }
    
    createMissingFallbacks() {
        console.log('🔧 Creating missing fallback positions...');
        this.calculateFallbackPositions();
    }
    
    fixFilterRendering() {
        console.log('🔧 Fixing filter rendering...');
        
        const app = window.photoBoothApp;
        if (!app) return;
        
        // Force restart overlay rendering
        if (app.stopOverlayRendering) {
            app.stopOverlayRendering();
        }
        
        if (app.currentFilter && app.currentFilter !== 'none') {
            if (app.startOverlayRendering) {
                app.startOverlayRendering();
            }
        }
    }
    
    fixFilterRenderingError() {
        console.log('🔧 Fixing filter rendering error...');
        this.fixFilterRendering();
    }
}

// EMERGENCY FILTER FIX FUNCTION
window.emergencyFixFilters = async function() {
    console.log('🚨 EMERGENCY FILTER FIX ACTIVATED');
    
    const diagnostic = new FilterSystemDiagnostic();
    const results = await diagnostic.runFullDiagnostic();
    
    // Force immediate filter application if everything is working
    if (Object.values(results).every(r => r)) {
        console.log('🚀 All tests passed, forcing immediate filter render');
        
        const app = window.photoBoothApp;
        if (app && app.currentFilter && app.currentFilter !== 'none') {
            // Force clear and redraw
            app.overlayCtx.clearRect(0, 0, app.overlayCanvas.width, app.overlayCanvas.height);
            
            if (app.filterSystem) {
                app.filterSystem.applyFilterToOverlay(app.overlayCtx, app.currentFilter);
            }
            
            console.log('✅ Filter forcibly applied');
        }
    }
    
    return results;
};

// QUICK DEBUG FUNCTIONS
window.quickDebugFilters = function() {
    console.log('🔍 QUICK FILTER DEBUG');
    
    const app = window.photoBoothApp;
    if (!app) {
        console.error('❌ App not found');
        return;
    }
    
    console.log('App status:', {
        video: !!app.video,
        videoPlaying: app.video && !app.video.paused,
        videoDimensions: app.video ? `${app.video.videoWidth}x${app.video.videoHeight}` : 'N/A',
        overlayCanvas: !!app.overlayCanvas,
        canvasDimensions: app.overlayCanvas ? `${app.overlayCanvas.width}x${app.overlayCanvas.height}` : 'N/A',
        canvasDisplaySize: app.canvasDisplaySize,
        currentFilter: app.currentFilter,
        overlayRenderingActive: app.overlayRenderingActive,
        filterSystem: !!app.filterSystem
    });
    
    if (app.filterSystem) {
        console.log('Filter system status:', {
            faceDetectionActive: app.filterSystem.faceDetectionActive,
            facesDetected: app.filterSystem.lastDetectedFaces ? app.filterSystem.lastDetectedFaces.length : 0,
            fallbackPositions: Object.keys(app.filterSystem.fallbackPositions || {}),
            filterConfigs: Object.keys(app.filterSystem.filterConfigs || {})
        });
    }
};

// AUTO-RUN DIAGNOSTIC ON LOAD
document.addEventListener('DOMContentLoaded', () => {
    // Wait for app to initialize, then run diagnostic
    setTimeout(async () => {
        if (window.photoBoothApp) {
            console.log('🔧 Auto-running filter diagnostic...');
            await window.emergencyFixFilters();
        }
    }, 3000);
});

console.log('🔧 Filter System Diagnostic Script Loaded');
console.log('💡 Run window.emergencyFixFilters() to diagnose and fix filter issues');
console.log('💡 Run window.quickDebugFilters() for quick status check');
