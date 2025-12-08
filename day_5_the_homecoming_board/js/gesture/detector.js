/**
 * Hand tracking detector using MediaPipe Hands
 * Handles camera setup, hand detection, and landmark extraction
 */

class HandDetector {
    constructor() {
        this.hands = null;
        this.camera = null;
        this.videoElement = null;
        this.canvasElement = null;
        this.canvasCtx = null;
        this.onResults = null;
        this.isInitialized = false;
        this.isRunning = false;
        
        // Detection settings
        this.config = {
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.5,
            staticImageMode: false,
            selfieMode: true // Mirror horizontally
        };

        // Bind methods
        this.handleResults = this.handleResults.bind(this);
    }

    /**
     * Initialize MediaPipe Hands and camera
     * @param {HTMLVideoElement} videoElement - Video element for camera feed
     * @param {HTMLCanvasElement} canvasElement - Canvas for drawing landmarks
     * @param {Function} onResultsCallback - Callback for detection results
     * @returns {Promise<boolean>} Success status
     */
    async initialize(videoElement, canvasElement, onResultsCallback) {
        try {
            console.log('🤖 Initializing MediaPipe Hands...');
            
            this.videoElement = videoElement;
            this.canvasElement = canvasElement;
            this.canvasCtx = canvasElement.getContext('2d');
            this.onResults = onResultsCallback;

            // Initialize MediaPipe Hands
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });

            // Configure the hands model
            this.hands.setOptions(this.config);
            
            // Set up result handler
            this.hands.onResults(this.handleResults);

            // Initialize camera
            await this.initializeCamera();

            this.isInitialized = true;
            console.log('✅ MediaPipe Hands initialized successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize MediaPipe Hands:', error);
            return false;
        }
    }

    /**
     * Initialize camera and video stream
     * @returns {Promise<void>}
     */
    async initializeCamera() {
        try {
            console.log('📷 Initializing camera...');
            
            this.camera = new Camera(this.videoElement, {
                onFrame: async () => {
                    if (this.hands && this.isRunning) {
                        await this.hands.send({ image: this.videoElement });
                    }
                },
                width: 320,
                height: 240,
                facingMode: 'user'
            });

            console.log('✅ Camera initialized successfully');
            
        } catch (error) {
            console.error('❌ Camera initialization failed:', error);
            throw error;
        }
    }

    /**
     * Start hand detection
     * @returns {Promise<boolean>} Success status
     */
    async start() {
        if (!this.isInitialized) {
            console.error('❌ Cannot start: MediaPipe not initialized');
            return false;
        }

        try {
            console.log('▶️ Starting hand detection...');
            
            await this.camera.start();
            this.isRunning = true;
            
            console.log('✅ Hand detection started');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to start hand detection:', error);
            return false;
        }
    }

    /**
     * Stop hand detection
     */
    stop() {
        if (this.camera && this.isRunning) {
            console.log('⏹️ Stopping hand detection...');
            
            this.camera.stop();
            this.isRunning = false;
            
            // Clear canvas
            if (this.canvasCtx) {
                this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
            }
            
            console.log('✅ Hand detection stopped');
        }
    }

    /**
     * Handle detection results from MediaPipe
     * @param {object} results - MediaPipe detection results
     */
    handleResults(results) {
        // Clear the canvas
        this.canvasCtx.save();
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        // Mirror the canvas context to match the mirrored video
        if (this.config.selfieMode) {
            this.canvasCtx.translate(this.canvasElement.width, 0);
            this.canvasCtx.scale(-1, 1);
        }

        // Draw the hand landmarks if detected
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            for (const landmarks of results.multiHandLandmarks) {
                this.drawLandmarks(landmarks);
                this.drawConnections(landmarks);
            }
        }

        this.canvasCtx.restore();

        // Pass results to callback
        if (this.onResults) {
            this.onResults({
                landmarks: results.multiHandLandmarks || [],
                handedness: results.multiHandedness || [],
                image: results.image
            });
        }
    }

    /**
     * Draw hand landmarks on canvas
     * @param {Array} landmarks - Hand landmarks array
     */
    drawLandmarks(landmarks) {
        this.canvasCtx.fillStyle = '#FFB74D';
        this.canvasCtx.strokeStyle = '#FF8F00';
        this.canvasCtx.lineWidth = 2;

        for (const landmark of landmarks) {
            const x = landmark.x * this.canvasElement.width;
            const y = landmark.y * this.canvasElement.height;
            
            this.canvasCtx.beginPath();
            this.canvasCtx.arc(x, y, 5, 0, 2 * Math.PI);
            this.canvasCtx.fill();
            this.canvasCtx.stroke();
        }
    }

    /**
     * Draw connections between hand landmarks
     * @param {Array} landmarks - Hand landmarks array
     */
    drawConnections(landmarks) {
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8], // Index finger
            [0, 9], [9, 10], [10, 11], [11, 12], // Middle finger
            [0, 13], [13, 14], [14, 15], [15, 16], // Ring finger
            [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
            [5, 9], [9, 13], [13, 17] // Palm connections
        ];

        this.canvasCtx.strokeStyle = '#FFB74D';
        this.canvasCtx.lineWidth = 2;

        for (const [start, end] of connections) {
            if (landmarks[start] && landmarks[end]) {
                const startX = landmarks[start].x * this.canvasElement.width;
                const startY = landmarks[start].y * this.canvasElement.height;
                const endX = landmarks[end].x * this.canvasElement.width;
                const endY = landmarks[end].y * this.canvasElement.height;

                this.canvasCtx.beginPath();
                this.canvasCtx.moveTo(startX, startY);
                this.canvasCtx.lineTo(endX, endY);
                this.canvasCtx.stroke();
            }
        }
    }

    /**
     * Update detector configuration
     * @param {object} newConfig - New configuration options
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        if (this.hands) {
            this.hands.setOptions(this.config);
            console.log('🔧 Updated MediaPipe configuration:', this.config);
        }
    }

    /**
     * Get current detector status
     * @returns {object} Status information
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isRunning: this.isRunning,
            config: this.config
        };
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        console.log('🧹 Cleaning up hand detector...');
        
        this.stop();
        
        if (this.camera) {
            this.camera = null;
        }
        
        if (this.hands) {
            this.hands.close();
            this.hands = null;
        }
        
        this.isInitialized = false;
        this.isRunning = false;
        
        console.log('✅ Hand detector cleanup complete');
    }
}

// Export for use by other modules
window.HandDetector = HandDetector;

console.log('✅ Hand detector module loaded');
