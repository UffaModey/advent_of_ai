/**
 * Gesture recognition module for hand gesture classification
 * Recognizes specific gestures from MediaPipe hand landmarks
 */

class GestureRecognizer {
    constructor() {
        this.lastGesture = null;
        this.lastGestureTime = 0;
        this.debounceTime = 300; // 300ms debounce
        this.confidenceThreshold = 0.8;
        
        // Gesture history for stability
        this.gestureHistory = [];
        this.historySize = 5;
        
        // Callbacks for gesture events
        this.onGestureDetected = null;
        this.onGestureChanged = null;
    }

    /**
     * Set callback functions for gesture events
     * @param {Function} onDetected - Called when a gesture is detected
     * @param {Function} onChanged - Called when gesture changes
     */
    setCallbacks(onDetected, onChanged) {
        this.onGestureDetected = onDetected;
        this.onGestureChanged = onChanged;
    }

    /**
     * Process hand landmarks and detect gestures
     * @param {Array} landmarks - Array of hand landmarks from MediaPipe
     * @param {Array} handedness - Handedness information
     * @returns {object|null} Detected gesture or null
     */
    recognizeGesture(landmarks, handedness = []) {
        if (!landmarks || landmarks.length === 0) {
            return this.handleNoGesture();
        }

        // Use the first detected hand
        const handLandmarks = landmarks[0];
        const gesture = this.classifyGesture(handLandmarks);
        
        if (gesture) {
            return this.handleGestureDetection(gesture);
        }
        
        return this.handleNoGesture();
    }

    /**
     * Classify gesture from hand landmarks
     * @param {Array} landmarks - Hand landmarks (21 points)
     * @returns {object|null} Gesture classification result
     */
    classifyGesture(landmarks) {
        // Get finger states (extended/curled)
        const fingerStates = this.getFingerStates(landmarks);
        const angles = this.calculateFingerAngles(landmarks);
        
        // Define gesture patterns
        const gestures = [
            this.recognizeShaka(fingerStates, landmarks),
            this.recognizeOKSign(fingerStates, landmarks, angles),
            this.recognizeWaveHand(fingerStates, landmarks),
            this.recognizeClosedFist(fingerStates, landmarks),
            this.recognizeVulcanSign(fingerStates, landmarks),
            this.recognizePeaceSign(fingerStates, landmarks),
            this.recognizeRockOnSign(fingerStates, landmarks)
        ].filter(Boolean); // Remove null results

        // Return the gesture with highest confidence
        if (gestures.length > 0) {
            gestures.sort((a, b) => b.confidence - a.confidence);
            return gestures[0];
        }

        return null;
    }

    /**
     * Get finger extension states
     * @param {Array} landmarks - Hand landmarks
     * @returns {object} Finger states (thumb, index, middle, ring, pinky)
     */
    getFingerStates(landmarks) {
        // Landmark indices for finger tips and joints
        const fingerTips = [4, 8, 12, 16, 20]; // thumb, index, middle, ring, pinky tips
        const fingerJoints = [3, 6, 10, 14, 18]; // corresponding joints for comparison
        const fingerBases = [2, 5, 9, 13, 17]; // finger bases

        const states = {};
        const fingerNames = ['thumb', 'index', 'middle', 'ring', 'pinky'];

        for (let i = 0; i < fingerNames.length; i++) {
            const tipY = landmarks[fingerTips[i]].y;
            const jointY = landmarks[fingerJoints[i]].y;
            const baseY = landmarks[fingerBases[i]].y;

            if (i === 0) { // Thumb (horizontal movement)
                const tipX = landmarks[fingerTips[i]].x;
                const jointX = landmarks[fingerJoints[i]].x;
                states[fingerNames[i]] = Math.abs(tipX - jointX) > 0.04;
            } else { // Other fingers (vertical movement)
                states[fingerNames[i]] = tipY < jointY && tipY < baseY;
            }
        }

        return states;
    }

    /**
     * Calculate angles between finger segments
     * @param {Array} landmarks - Hand landmarks
     * @returns {object} Calculated angles for gesture recognition
     */
    calculateFingerAngles(landmarks) {
        const angles = {};
        
        // Calculate angle between thumb and index finger
        const thumb = landmarks[4];
        const index = landmarks[8];
        const wrist = landmarks[0];
        
        angles.thumbIndex = this.calculateAngle(
            { x: thumb.x - wrist.x, y: thumb.y - wrist.y },
            { x: index.x - wrist.x, y: index.y - wrist.y }
        );
        
        return angles;
    }

    /**
     * Calculate angle between two vectors
     * @param {object} v1 - First vector {x, y}
     * @param {object} v2 - Second vector {x, y}
     * @returns {number} Angle in degrees
     */
    calculateAngle(v1, v2) {
        const dot = v1.x * v2.x + v1.y * v2.y;
        const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        const cos = dot / (mag1 * mag2);
        return Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
    }

    /**
     * Recognize Shaka gesture 🤙 (Load arrivals)
     * @param {object} fingerStates - Finger extension states
     * @param {Array} landmarks - Hand landmarks
     * @returns {object|null} Gesture result
     */
    recognizeShaka(fingerStates, landmarks) {
        // Shaka: Thumb and pinky extended, other fingers curled
        if (fingerStates.thumb && fingerStates.pinky && 
            !fingerStates.index && !fingerStates.middle && !fingerStates.ring) {
            
            return {
                name: 'shaka',
                emoji: '🤙',
                action: 'load_arrivals',
                description: 'Load Arrivals',
                confidence: 0.9
            };
        }
        return null;
    }

    /**
     * Recognize OK Sign gesture 👌 (Load departures)
     * @param {object} fingerStates - Finger extension states
     * @param {Array} landmarks - Hand landmarks
     * @param {object} angles - Calculated angles
     * @returns {object|null} Gesture result
     */
    recognizeOKSign(fingerStates, landmarks, angles) {
        // OK Sign: Thumb and index form circle, other fingers extended
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const distance = Math.sqrt(
            Math.pow(thumbTip.x - indexTip.x, 2) + 
            Math.pow(thumbTip.y - indexTip.y, 2)
        );

        if (distance < 0.06 && fingerStates.middle && fingerStates.ring && fingerStates.pinky) {
            return {
                name: 'ok_sign',
                emoji: '👌',
                action: 'load_departures',
                description: 'Load Departures',
                confidence: 0.85
            };
        }
        return null;
    }

    /**
     * Recognize Wave Hand gesture 🖐️ (Navigate/scroll)
     * @param {object} fingerStates - Finger extension states
     * @param {Array} landmarks - Hand landmarks
     * @returns {object|null} Gesture result
     */
    recognizeWaveHand(fingerStates, landmarks) {
        // Wave: All fingers extended
        if (fingerStates.thumb && fingerStates.index && fingerStates.middle && 
            fingerStates.ring && fingerStates.pinky) {
            
            return {
                name: 'wave_hand',
                emoji: '🖐️',
                action: 'navigate',
                description: 'Navigate',
                confidence: 0.8
            };
        }
        return null;
    }

    /**
     * Recognize Closed Fist gesture ✊ (Select flight)
     * @param {object} fingerStates - Finger extension states
     * @param {Array} landmarks - Hand landmarks
     * @returns {object|null} Gesture result
     */
    recognizeClosedFist(fingerStates, landmarks) {
        // Fist: All fingers curled
        if (!fingerStates.thumb && !fingerStates.index && !fingerStates.middle && 
            !fingerStates.ring && !fingerStates.pinky) {
            
            return {
                name: 'closed_fist',
                emoji: '✊',
                action: 'select_flight',
                description: 'Select Flight',
                confidence: 0.9
            };
        }
        return null;
    }

    /**
     * Recognize Vulcan Sign gesture 🖖 (Exit detail view)
     * @param {object} fingerStates - Finger extension states
     * @param {Array} landmarks - Hand landmarks
     * @returns {object|null} Gesture result
     */
    recognizeVulcanSign(fingerStates, landmarks) {
        // Vulcan: Index+middle extended, ring+pinky extended, thumb extended
        if (fingerStates.thumb && fingerStates.index && fingerStates.middle && 
            fingerStates.ring && fingerStates.pinky) {
            
            // Check if fingers are in Vulcan formation (split between middle and ring)
            const middleTip = landmarks[12];
            const ringTip = landmarks[16];
            const fingerGap = Math.abs(middleTip.x - ringTip.x);
            
            if (fingerGap > 0.05) { // Significant gap between middle and ring
                return {
                    name: 'vulcan_sign',
                    emoji: '🖖',
                    action: 'exit_detail',
                    description: 'Back to Main',
                    confidence: 0.85
                };
            }
        }
        return null;
    }

    /**
     * Recognize Peace Sign gesture ✌️ (Refresh data)
     * @param {object} fingerStates - Finger extension states
     * @param {Array} landmarks - Hand landmarks
     * @returns {object|null} Gesture result
     */
    recognizePeaceSign(fingerStates, landmarks) {
        // Peace: Index and middle extended, others curled
        if (!fingerStates.thumb && fingerStates.index && fingerStates.middle && 
            !fingerStates.ring && !fingerStates.pinky) {
            
            return {
                name: 'peace_sign',
                emoji: '✌️',
                action: 'refresh_data',
                description: 'Refresh Data',
                confidence: 0.85
            };
        }
        return null;
    }

    /**
     * Recognize Rock-On Sign gesture 🤘 (Switch airports)
     * @param {object} fingerStates - Finger extension states
     * @param {Array} landmarks - Hand landmarks
     * @returns {object|null} Gesture result
     */
    recognizeRockOnSign(fingerStates, landmarks) {
        // Rock-On: Index and pinky extended, thumb extended, middle and ring curled
        if (fingerStates.thumb && fingerStates.index && !fingerStates.middle && 
            !fingerStates.ring && fingerStates.pinky) {
            
            return {
                name: 'rock_on_sign',
                emoji: '🤘',
                action: 'switch_airport',
                description: 'Switch Airport',
                confidence: 0.85
            };
        }
        return null;
    }

    /**
     * Handle gesture detection with debouncing
     * @param {object} gesture - Detected gesture
     * @returns {object} Gesture result with timing info
     */
    handleGestureDetection(gesture) {
        const now = Date.now();
        
        // Add to gesture history
        this.gestureHistory.push(gesture);
        if (this.gestureHistory.length > this.historySize) {
            this.gestureHistory.shift();
        }

        // Check if gesture is stable (appears consistently)
        const stableGesture = this.getStableGesture();
        
        if (stableGesture && stableGesture.confidence >= this.confidenceThreshold) {
            // Check debouncing
            if (this.lastGesture !== stableGesture.name || 
                (now - this.lastGestureTime) > this.debounceTime) {
                
                const gestureChanged = this.lastGesture !== stableGesture.name;
                this.lastGesture = stableGesture.name;
                this.lastGestureTime = now;

                // Call callbacks
                if (this.onGestureDetected) {
                    this.onGestureDetected(stableGesture);
                }
                
                if (gestureChanged && this.onGestureChanged) {
                    this.onGestureChanged(stableGesture);
                }

                return {
                    ...stableGesture,
                    isNewGesture: gestureChanged,
                    timestamp: now
                };
            }
        }

        return null;
    }

    /**
     * Handle no gesture detected
     * @returns {null}
     */
    handleNoGesture() {
        // Clear gesture history when no gesture is detected
        this.gestureHistory = [];
        return null;
    }

    /**
     * Get stable gesture from history
     * @returns {object|null} Most frequent gesture in history
     */
    getStableGesture() {
        if (this.gestureHistory.length < 3) {
            return null;
        }

        // Count gesture occurrences
        const gestureCounts = {};
        for (const gesture of this.gestureHistory) {
            gestureCounts[gesture.name] = (gestureCounts[gesture.name] || 0) + 1;
        }

        // Find most frequent gesture
        let mostFrequent = null;
        let maxCount = 0;
        
        for (const [gestureName, count] of Object.entries(gestureCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostFrequent = gestureName;
            }
        }

        // Return gesture if it appears at least 60% of the time
        if (maxCount >= Math.ceil(this.gestureHistory.length * 0.6)) {
            return this.gestureHistory.find(g => g.name === mostFrequent);
        }

        return null;
    }

    /**
     * Update recognizer settings
     * @param {object} settings - New settings
     */
    updateSettings(settings) {
        if (settings.debounceTime !== undefined) {
            this.debounceTime = settings.debounceTime;
        }
        if (settings.confidenceThreshold !== undefined) {
            this.confidenceThreshold = settings.confidenceThreshold;
        }
        if (settings.historySize !== undefined) {
            this.historySize = settings.historySize;
        }
        
        console.log('🔧 Updated gesture recognizer settings:', settings);
    }

    /**
     * Get recognizer status and statistics
     * @returns {object} Status information
     */
    getStatus() {
        return {
            lastGesture: this.lastGesture,
            lastGestureTime: this.lastGestureTime,
            gestureHistory: this.gestureHistory,
            settings: {
                debounceTime: this.debounceTime,
                confidenceThreshold: this.confidenceThreshold,
                historySize: this.historySize
            }
        };
    }

    /**
     * Reset recognizer state
     */
    reset() {
        this.lastGesture = null;
        this.lastGestureTime = 0;
        this.gestureHistory = [];
        console.log('🔄 Gesture recognizer reset');
    }
}

// Export for use by other modules
window.GestureRecognizer = GestureRecognizer;

console.log('✅ Gesture recognizer module loaded');
