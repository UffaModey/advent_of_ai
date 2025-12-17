/**
 * Camera Utilities for Fun House Photo Booth
 * 
 * Comprehensive camera management and cross-browser compatibility utilities.
 * Provides robust camera access, device optimization, error handling,
 * and performance recommendations for optimal photo booth experience.
 * 
 * @class CameraUtils
 * @author Fun House Photo Booth Team
 * @version 1.0.0
 * @since 2024
 * 
 * Key Features:
 * - Cross-browser getUserMedia compatibility
 * - Device-specific camera optimizations
 * - Intelligent error handling with user-friendly messages
 * - Performance recommendations based on device capabilities
 * - Mobile-first design with fallback support
 * 
 * @example
 * // Check browser compatibility
 * const compatibility = CameraUtils.checkCompatibility();
 * if (compatibility.getUserMedia) {
 *   // Initialize camera with optimal settings
 *   const stream = await CameraUtils.initCameraWithFallback('user');
 * }
 * 
 * @example
 * // Handle camera errors gracefully
 * try {
 *   const stream = await CameraUtils.initCameraWithFallback('environment');
 * } catch (error) {
 *   const errorInfo = CameraUtils.getErrorMessage(error);
 *   console.error(errorInfo.title, errorInfo.message);
 * }
 */

class CameraUtils {
    /**
     * Comprehensive browser compatibility check for camera and related features.
     * Tests for getUserMedia support, modern APIs, and required capabilities.
     * 
     * @static
     * @returns {Object} Compatibility object with boolean flags for each feature
     * @returns {boolean} returns.getUserMedia - Basic camera access support
     * @returns {boolean} returns.mediaDevices - Modern MediaDevices API support
     * @returns {boolean} returns.canvas - HTML5 Canvas support for image processing
     * @returns {boolean} returns.download - File download capability
     * @returns {boolean} returns.orientation - Orientation change event support
     * @returns {boolean} returns.touch - Touch event support for mobile
     * 
     * @example
     * const compatibility = CameraUtils.checkCompatibility();
     * if (!compatibility.getUserMedia) {
     *   throw new Error('Camera not supported in this browser');
     * }
     */
    static checkCompatibility() {
        const compatibility = {
            getUserMedia: false,
            mediaDevices: false,
            canvas: false,
            download: false,
            orientation: false,
            touch: false
        };

        // Check getUserMedia support
        if (navigator.getUserMedia || 
            navigator.webkitGetUserMedia || 
            navigator.mozGetUserMedia ||
            (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            compatibility.getUserMedia = true;
        }

        // Check modern MediaDevices API
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            compatibility.mediaDevices = true;
        }

        // Check Canvas support
        try {
            const canvas = document.createElement('canvas');
            compatibility.canvas = !!(canvas.getContext && canvas.getContext('2d'));
        } catch (e) {
            compatibility.canvas = false;
        }

        // Check download support
        const a = document.createElement('a');
        compatibility.download = typeof a.download !== 'undefined';

        // Check orientation support
        compatibility.orientation = typeof window.orientation !== 'undefined';

        // Check touch support
        compatibility.touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        return compatibility;
    }

    /**
     * Generate optimal camera constraints based on device type and capabilities.
     * Automatically detects iOS, Android, and desktop devices and applies
     * appropriate resolution, frame rate, and quality settings.
     * 
     * @static
     * @param {string} [facingMode='user'] - Camera direction ('user' for front, 'environment' for rear)
     * @param {Object} [options={}] - Custom constraint overrides
     * @param {Object} [options.width] - Width constraint object
     * @param {Object} [options.height] - Height constraint object
     * @param {Object} [options.frameRate] - Frame rate constraint object
     * @returns {Object} MediaStreamConstraints object optimized for the device
     * 
     * @example
     * // Get default front camera constraints
     * const constraints = CameraUtils.getOptimalConstraints();
     * 
     * @example
     * // Get rear camera with custom resolution
     * const constraints = CameraUtils.getOptimalConstraints('environment', {
     *   width: { ideal: 1920, max: 3840 },
     *   height: { ideal: 1080, max: 2160 }
     * });
     */
    static getOptimalConstraints(facingMode = 'user', options = {}) {
        const constraints = {
            video: {
                facingMode: facingMode
            },
            audio: false
        };

        // Device-specific optimizations
        const userAgent = navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);
        const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);

        if (isIOS || isSafari) {
            // iOS Safari optimizations
            constraints.video = {
                ...constraints.video,
                width: { ideal: 720, max: 1280 },
                height: { ideal: 1280, max: 720 },
                frameRate: { ideal: 15, max: 30 } // Lower frame rate for iOS
            };
        } else if (isAndroid) {
            // Android optimizations
            constraints.video = {
                ...constraints.video,
                width: { ideal: 1280, max: 1920 },
                height: { ideal: 720, max: 1080 },
                frameRate: { ideal: 30, max: 60 }
            };
        } else {
            // Desktop/other devices
            constraints.video = {
                ...constraints.video,
                width: { ideal: 1280, max: 1920 },
                height: { ideal: 720, max: 1080 },
                frameRate: { ideal: 30, max: 60 }
            };
        }

        // Apply custom options
        if (options.width) constraints.video.width = options.width;
        if (options.height) constraints.video.height = options.height;
        if (options.frameRate) constraints.video.frameRate = options.frameRate;

        return constraints;
    }

    /**
     * Robust camera initialization with comprehensive fallback strategies.
     * Attempts multiple initialization methods to ensure maximum device compatibility.
     * Falls back gracefully from optimal settings to basic camera access.
     * 
     * @static
     * @async
     * @param {string} [facingMode='user'] - Preferred camera direction
     * @param {Object} [options={}] - Custom options for camera initialization
     * @returns {Promise<MediaStream>} Camera media stream
     * @throws {Error} If all initialization methods fail
     * 
     * Fallback Strategy:
     * 1. Try optimal constraints for device type
     * 2. Try basic constraints without specific facing mode
     * 3. Try legacy getUserMedia API
     * 4. Try minimal constraints (video: true)
     * 
     * @example
     * try {
     *   const stream = await CameraUtils.initCameraWithFallback('user');
     *   video.srcObject = stream;
     * } catch (error) {
     *   console.error('Camera initialization failed:', error.message);
     * }
     */
    static async initCameraWithFallback(facingMode = 'user', options = {}) {
        const compatibility = CameraUtils.checkCompatibility();

        if (!compatibility.getUserMedia) {
            throw new Error('Camera not supported in this browser');
        }

        let stream = null;
        let error = null;

        try {
            // Try modern MediaDevices API first
            if (compatibility.mediaDevices) {
                const constraints = CameraUtils.getOptimalConstraints(facingMode, options);
                stream = await navigator.mediaDevices.getUserMedia(constraints);
            } else {
                // Fallback to legacy getUserMedia
                stream = await CameraUtils.getLegacyUserMedia(facingMode);
            }

            return stream;

        } catch (err) {
            error = err;
            console.warn('Primary camera initialization failed:', err);

            // Try fallback strategies
            try {
                // Fallback 1: Try without specific constraints
                if (compatibility.mediaDevices) {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: facingMode },
                        audio: false
                    });
                    return stream;
                }
            } catch (fallbackErr) {
                console.warn('Fallback 1 failed:', fallbackErr);
            }

            try {
                // Fallback 2: Try without facingMode
                if (compatibility.mediaDevices) {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false
                    });
                    return stream;
                }
            } catch (fallbackErr2) {
                console.warn('Fallback 2 failed:', fallbackErr2);
            }

            // If all fallbacks fail, throw the original error
            throw error;
        }
    }

    /**
     * Legacy getUserMedia wrapper
     */
    static getLegacyUserMedia(facingMode) {
        return new Promise((resolve, reject) => {
            const constraints = {
                video: { facingMode: facingMode },
                audio: false
            };

            const getUserMedia = navigator.getUserMedia ||
                               navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia;

            if (!getUserMedia) {
                reject(new Error('getUserMedia not supported'));
                return;
            }

            getUserMedia.call(navigator, constraints,
                (stream) => resolve(stream),
                (error) => reject(error)
            );
        });
    }

    /**
     * Get available camera devices
     */
    static async getAvailableCameras() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                return [];
            }

            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.filter(device => device.kind === 'videoinput');
        } catch (error) {
            console.warn('Could not enumerate devices:', error);
            return [];
        }
    }

    /**
     * Check if device has multiple cameras
     */
    static async hasMultipleCameras() {
        const cameras = await CameraUtils.getAvailableCameras();
        return cameras.length > 1;
    }

    /**
     * Convert technical camera errors into user-friendly messages with actionable advice.
     * Provides specific guidance based on error type and includes retry recommendations.
     * 
     * @static
     * @param {Error} error - The camera access error
     * @returns {Object} Error information object
     * @returns {string} returns.title - User-friendly error title
     * @returns {string} returns.message - Detailed explanation and guidance
     * @returns {boolean} returns.canRetry - Whether the user can attempt to retry
     * 
     * @example
     * catch (error) {
     *   const errorInfo = CameraUtils.getErrorMessage(error);
     *   showErrorDialog(errorInfo.title, errorInfo.message);
     *   if (errorInfo.canRetry) {
     *     showRetryButton();
     *   }
     * }
     */
    static getErrorMessage(error) {
        switch (error.name) {
            case 'NotAllowedError':
            case 'PermissionDeniedError':
                return {
                    title: 'Camera Permission Denied',
                    message: 'Please allow camera access and refresh the page. Check your browser settings if needed.',
                    canRetry: true
                };

            case 'NotFoundError':
            case 'DevicesNotFoundError':
                return {
                    title: 'No Camera Found',
                    message: 'No camera was detected on your device. Please connect a camera and try again.',
                    canRetry: true
                };

            case 'NotSupportedError':
            case 'ConstraintNotSatisfiedError':
                return {
                    title: 'Camera Not Supported',
                    message: 'Your camera doesn\'t support the required features. Try using a different browser or device.',
                    canRetry: false
                };

            case 'NotReadableError':
            case 'TrackStartError':
                return {
                    title: 'Camera In Use',
                    message: 'Your camera might be in use by another app. Close other camera apps and try again.',
                    canRetry: true
                };

            case 'OverconstrainedError':
                return {
                    title: 'Camera Settings Issue',
                    message: 'Camera settings are not supported. Trying with default settings.',
                    canRetry: true
                };

            case 'TypeError':
                return {
                    title: 'Browser Not Supported',
                    message: 'Your browser doesn\'t support camera features. Please use Chrome, Safari, or Firefox.',
                    canRetry: false
                };

            default:
                return {
                    title: 'Camera Error',
                    message: `Something went wrong: ${error.message}. Please try again.`,
                    canRetry: true
                };
        }
    }

    /**
     * Optimize video element for mobile
     */
    static optimizeVideoForMobile(videoElement) {
        // Prevent zooming on double tap
        videoElement.style.touchAction = 'manipulation';
        
        // Optimize for mobile playback
        videoElement.setAttribute('playsinline', '');
        videoElement.setAttribute('webkit-playsinline', '');
        videoElement.muted = true; // Required for autoplay on mobile
        
        // Disable video controls
        videoElement.controls = false;
        
        // Prevent video from being selectable
        videoElement.style.userSelect = 'none';
        videoElement.style.webkitUserSelect = 'none';
        
        return videoElement;
    }

    /**
     * Calculate optimal canvas size for device with aspect ratio preservation
     */
    static getOptimalCanvasSize(videoWidth, videoHeight, maxWidth = 1280, maxHeight = 720) {
        // Start with video dimensions
        let width = videoWidth;
        let height = videoHeight;
        
        // Ensure minimum quality
        const minWidth = 640;
        const minHeight = 480;
        
        // Scale up if too small (but maintain aspect ratio)
        if (width < minWidth || height < minHeight) {
            const aspectRatio = width / height;
            
            if (width < minWidth) {
                width = minWidth;
                height = width / aspectRatio;
            }
            
            if (height < minHeight) {
                height = minHeight;
                width = height * aspectRatio;
            }
        }

        // Scale down if too large (maintaining aspect ratio)
        if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;
            
            // Calculate scale factors for both dimensions
            const scaleWidth = maxWidth / width;
            const scaleHeight = maxHeight / height;
            
            // Use the smaller scale factor to maintain aspect ratio
            const scale = Math.min(scaleWidth, scaleHeight);
            
            width = width * scale;
            height = height * scale;
        }
        
        // Ensure even dimensions for better video encoding
        width = Math.round(width / 2) * 2;
        height = Math.round(height / 2) * 2;

        return {
            width: width,
            height: height,
            aspectRatio: width / height
        };
    }

    /**
     * Handle device orientation changes
     */
    static handleOrientationChange(callback, delay = 500) {
        let orientationTimeout;

        const handleOrientation = () => {
            clearTimeout(orientationTimeout);
            orientationTimeout = setTimeout(() => {
                callback();
            }, delay);
        };

        // Listen for orientation changes
        window.addEventListener('orientationchange', handleOrientation);
        window.addEventListener('resize', handleOrientation);

        // Return cleanup function
        return () => {
            window.removeEventListener('orientationchange', handleOrientation);
            window.removeEventListener('resize', handleOrientation);
            clearTimeout(orientationTimeout);
        };
    }

    /**
     * Cross-browser image download with multiple fallback strategies.
     * Handles various browser limitations and provides alternative download methods
     * when the standard download attribute is not supported.
     * 
     * @static
     * @param {string} dataUrl - Base64 encoded image data URL
     * @param {string} [filename] - Desired filename (auto-generated if not provided)
     * @returns {boolean} Whether the download was successful
     * 
     * Download Strategy:
     * 1. Try HTML5 download attribute (modern browsers)
     * 2. Try URL.createObjectURL with Blob (fallback)
     * 3. Open in new window with save instructions (legacy browsers)
     * 4. Copy to clipboard as last resort
     * 
     * @example
     * const success = CameraUtils.downloadImage(photoDataUrl, 'my-photo.jpg');
     * if (!success) {
     *   alert('Please right-click the image and save manually');
     * }
     */
    static downloadImage(dataUrl, filename = `photo-${Date.now()}.jpg`) {
        try {
            // Validate data URL
            if (!dataUrl || !dataUrl.startsWith('data:')) {
                throw new Error('Invalid data URL');
            }
            
            // Clean filename for different OS
            const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
            
            // Modern browsers with download attribute support
            if ('download' in document.createElement('a')) {
                const link = document.createElement('a');
                link.download = cleanFilename;
                link.href = dataUrl;
                link.style.display = 'none';
                
                // Add to DOM, click, and remove
                document.body.appendChild(link);
                link.click();
                
                // Clean up after a short delay
                setTimeout(() => {
                    if (link.parentNode) {
                        document.body.removeChild(link);
                    }
                }, 100);
                
                return true;
            }
            
            // Fallback for older browsers
            throw new Error('Download attribute not supported');
            
        } catch (error) {
            console.warn('Primary download failed, trying fallbacks:', error);
            
            try {
                // Fallback 1: Try using URL.createObjectURL if available
                if (window.URL && window.URL.createObjectURL) {
                    // Convert data URL to blob
                    const byteString = atob(dataUrl.split(',')[1]);
                    const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
                    const arrayBuffer = new ArrayBuffer(byteString.length);
                    const uint8Array = new Uint8Array(arrayBuffer);
                    
                    for (let i = 0; i < byteString.length; i++) {
                        uint8Array[i] = byteString.charCodeAt(i);
                    }
                    
                    const blob = new Blob([arrayBuffer], { type: mimeType });
                    const blobUrl = URL.createObjectURL(blob);
                    
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Clean up blob URL
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
                    
                    return true;
                }
                
                // Fallback 2: Open in new window with instructions
                const newWindow = window.open('', '_blank');
                if (newWindow) {
                    newWindow.document.write(`
                        <html>
                            <head>
                                <title>Save Your Photo</title>
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                    body {
                                        margin: 0;
                                        padding: 20px;
                                        display: flex;
                                        flex-direction: column;
                                        justify-content: center;
                                        align-items: center;
                                        background: #000;
                                        font-family: Arial, sans-serif;
                                        min-height: 100vh;
                                    }
                                    img {
                                        max-width: 90%;
                                        max-height: 70vh;
                                        border-radius: 10px;
                                        box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
                                    }
                                    .instructions {
                                        color: white;
                                        text-align: center;
                                        margin-top: 20px;
                                        padding: 20px;
                                        background: rgba(255, 255, 255, 0.1);
                                        border-radius: 10px;
                                        max-width: 400px;
                                    }
                                    .instructions h3 {
                                        margin-top: 0;
                                        color: #4caf50;
                                    }
                                    .instructions p {
                                        margin: 10px 0;
                                        line-height: 1.4;
                                    }
                                    @media (max-width: 600px) {
                                        .instructions {
                                            font-size: 14px;
                                        }
                                    }
                                </style>
                            </head>
                            <body>
                                <img src="${dataUrl}" alt="Your Fun House Photo" />
                                <div class="instructions">
                                    <h3>📱 Save Your Photo</h3>
                                    <p><strong>On Mobile:</strong> Long-press the image above and select "Save Image" or "Download Image"</p>
                                    <p><strong>On Desktop:</strong> Right-click the image and select "Save Image As..."</p>
                                    <p>Filename: ${filename}</p>
                                </div>
                            </body>
                        </html>
                    `);
                    return true;
                } else {
                    throw new Error('Popup blocked');
                }
                
            } catch (fallbackError) {
                console.error('All download methods failed:', fallbackError);
                
                // Final fallback: Copy to clipboard if supported
                try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(dataUrl);
                        alert('Photo data copied to clipboard! You can paste it into an image editor.');
                        return true;
                    }
                } catch (clipboardError) {
                    console.error('Clipboard fallback failed:', clipboardError);
                }
                
                return false;
            }
        }
    }

    /**
     * Detect if device is in portrait mode
     */
    static isPortrait() {
        if (window.screen && window.screen.orientation) {
            return window.screen.orientation.angle === 0 || window.screen.orientation.angle === 180;
        }
        return window.innerHeight > window.innerWidth;
    }

    /**
     * Get device pixel ratio with performance-conscious limits.
     * Prevents excessive memory usage on very high-DPI displays
     * while maintaining good quality on standard retina displays.
     * 
     * @static
     * @returns {number} Pixel ratio capped at 2.0 for performance
     * 
     * @example
     * const pixelRatio = CameraUtils.getPixelRatio();
     * canvas.width = displayWidth * pixelRatio;
     * canvas.height = displayHeight * pixelRatio;
     * ctx.scale(pixelRatio, pixelRatio);
     */
    static getPixelRatio() {
        const ratio = window.devicePixelRatio || 1;
        
        // Limit pixel ratio to prevent excessive memory usage
        // Most devices work well with max 2x scaling
        return Math.min(ratio, 2);
    }
    
    /**
     * Comprehensive video stream validation with optimization suggestions.
     * Analyzes video resolution, aspect ratio, playback state, and provides
     * specific recommendations for improving video quality and performance.
     * 
     * @static
     * @param {HTMLVideoElement} videoElement - Video element to validate
     * @returns {Object} Validation result object
     * @returns {boolean} returns.isValid - Whether the video stream is acceptable
     * @returns {Object} returns.resolution - Current video resolution and aspect ratio
     * @returns {Array<string>} returns.issues - List of detected issues
     * @returns {Array<string>} returns.suggestions - Actionable optimization suggestions
     * 
     * Validation checks:
     * - Minimum resolution requirements (640x480)
     * - Aspect ratio validation (0.75-2.0 range)
     * - Video playback state verification
     * - Stream availability confirmation
     * 
     * @example
     * const validation = CameraUtils.validateVideoStream(video);
     * if (!validation.isValid) {
     *   console.warn('Video issues:', validation.issues);
     *   console.log('Suggestions:', validation.suggestions);
     * }
     */
    static validateVideoStream(videoElement) {
        if (!videoElement || !videoElement.videoWidth) {
            return {
                isValid: false,
                issues: ['Video element not ready or no video stream'],
                suggestions: []
            };
        }
        
        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;
        const aspectRatio = width / height;
        
        const issues = [];
        const suggestions = [];
        
        // Check resolution
        if (width < 640 || height < 480) {
            issues.push('Low video resolution');
            suggestions.push('Request higher resolution from camera');
        }
        
        // Check aspect ratio
        if (aspectRatio < 0.75 || aspectRatio > 2.0) {
            issues.push('Unusual aspect ratio detected');
            suggestions.push('Check camera orientation and settings');
        }
        
        // Check if video is playing
        if (videoElement.paused || videoElement.ended) {
            issues.push('Video stream not playing');
            suggestions.push('Ensure video.play() has been called');
        }
        
        return {
            isValid: issues.length === 0,
            resolution: { width, height, aspectRatio },
            issues,
            suggestions
        };
    }
    
    /**
     * Analyze device capabilities and provide performance optimization recommendations.
     * Considers memory, CPU, network, and device type to suggest optimal settings
     * for canvas size, frame rate, and feature enablement.
     * 
     * @static
     * @returns {Object} Performance recommendations object
     * @returns {Object} returns.maxCanvasSize - Recommended maximum canvas dimensions
     * @returns {number} returns.targetFrameRate - Optimal target frame rate
     * @returns {boolean} returns.useHighDPI - Whether to enable high-DPI rendering
     * @returns {boolean} returns.enableFaceDetection - Whether face detection is recommended
     * 
     * Factors considered:
     * - Device memory (navigator.deviceMemory)
     * - CPU cores (navigator.hardwareConcurrency)
     * - Network speed (navigator.connection)
     * - User agent detection for known low-end devices
     * 
     * @example
     * const recommendations = CameraUtils.getPerformanceRecommendations();
     * app.setMaxCanvasSize(recommendations.maxCanvasSize);
     * app.setTargetFrameRate(recommendations.targetFrameRate);
     */
    static getPerformanceRecommendations() {
        const recommendations = {
            maxCanvasSize: { width: 1280, height: 720 },
            targetFrameRate: 30,
            useHighDPI: true,
            enableFaceDetection: true
        };
        
        // Detect device type and adjust recommendations
        const userAgent = navigator.userAgent.toLowerCase();
        const isLowEndDevice = /android.*(sm-|gt-|sgh-|sph-|sch-)/i.test(userAgent) ||
                              /iphone.*(4|5)/i.test(userAgent);
        
        if (isLowEndDevice) {
            recommendations.maxCanvasSize = { width: 960, height: 540 };
            recommendations.targetFrameRate = 15;
            recommendations.useHighDPI = false;
            recommendations.enableFaceDetection = false;
        }
        
        // Check memory constraints
        if (navigator.deviceMemory && navigator.deviceMemory < 4) {
            recommendations.maxCanvasSize = { width: 960, height: 540 };
            recommendations.useHighDPI = false;
        }
        
        // Check connection quality
        if (navigator.connection) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                recommendations.targetFrameRate = 10;
                recommendations.enableFaceDetection = false;
            }
        }
        
        return recommendations;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.CameraUtils = CameraUtils;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CameraUtils;
}