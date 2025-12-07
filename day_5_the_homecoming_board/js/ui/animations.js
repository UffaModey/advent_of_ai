/**
 * UI animations and visual effects for the winter-themed flight tracker
 * Handles screen transitions, snow effects, and gesture feedback
 */

class AnimationManager {
    constructor() {
        this.snowflakes = [];
        this.snowContainer = null;
        this.maxSnowflakes = 50;
        this.animationFrameId = null;
        this.isSnowEnabled = true;
        
        // Animation state
        this.currentScreen = 'loading-screen';
        this.isTransitioning = false;
        
        // Gesture feedback elements
        this.gestureIndicator = null;
        this.gestureIcon = null;
        this.gestureName = null;
        
        // Initialize after DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    /**
     * Initialize animation manager
     */
    initialize() {
        this.snowContainer = document.getElementById('snow-container');
        this.gestureIndicator = document.getElementById('gesture-indicator');
        this.gestureIcon = document.getElementById('gesture-icon');
        this.gestureName = document.getElementById('gesture-name');
        
        if (this.snowContainer && this.isSnowEnabled) {
            this.startSnowAnimation();
        }
        
        console.log('✅ Animation manager initialized');
    }

    /**
     * Start snow particle animation
     */
    startSnowAnimation() {
        // Create initial snowflakes
        for (let i = 0; i < this.maxSnowflakes; i++) {
            this.createSnowflake();
        }
        
        // Start animation loop
        this.animateSnow();
        console.log('❄️ Snow animation started');
    }

    /**
     * Create a single snowflake element
     */
    createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = this.getRandomSnowflakeChar();
        
        // Random position and properties
        const x = Math.random() * window.innerWidth;
        const animationDuration = Math.random() * 15 + 10; // 10-25 seconds
        const opacity = Math.random() * 0.6 + 0.2; // 0.2-0.8
        const fontSize = Math.random() * 10 + 10; // 10-20px
        
        snowflake.style.left = x + 'px';
        snowflake.style.animationDuration = animationDuration + 's';
        snowflake.style.opacity = opacity;
        snowflake.style.fontSize = fontSize + 'px';
        snowflake.style.animationDelay = Math.random() * 20 + 's';
        
        this.snowContainer.appendChild(snowflake);
        
        // Remove snowflake after animation completes
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.parentNode.removeChild(snowflake);
            }
        }, (animationDuration + Math.random() * 20) * 1000);
        
        return snowflake;
    }

    /**
     * Get random snowflake character
     * @returns {string} Snowflake character
     */
    getRandomSnowflakeChar() {
        const snowflakes = ['❄', '❅', '❆', '✻', '✼', '❈', '❋', '✦'];
        return snowflakes[Math.floor(Math.random() * snowflakes.length)];
    }

    /**
     * Animation loop for snow
     */
    animateSnow() {
        // Occasionally add new snowflakes
        if (Math.random() < 0.02 && this.snowContainer.children.length < this.maxSnowflakes) {
            this.createSnowflake();
        }
        
        this.animationFrameId = requestAnimationFrame(() => this.animateSnow());
    }

    /**
     * Stop snow animation
     */
    stopSnowAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Remove existing snowflakes
        if (this.snowContainer) {
            this.snowContainer.innerHTML = '';
        }
        
        console.log('❄️ Snow animation stopped');
    }

    /**
     * Toggle snow animation on/off
     */
    toggleSnow() {
        this.isSnowEnabled = !this.isSnowEnabled;
        
        if (this.isSnowEnabled) {
            this.startSnowAnimation();
        } else {
            this.stopSnowAnimation();
        }
    }

    /**
     * Transition between screens with animation
     * @param {string} fromScreen - Current screen ID
     * @param {string} toScreen - Target screen ID
     * @param {string} direction - Animation direction ('slide-up', 'slide-down', 'fade')
     * @returns {Promise} Animation completion promise
     */
    async transitionScreen(fromScreen, toScreen, direction = 'fade') {
        if (this.isTransitioning) {
            return Promise.resolve();
        }
        
        this.isTransitioning = true;
        console.log(`🎬 Transitioning from ${fromScreen} to ${toScreen} (${direction})`);
        
        const fromElement = document.getElementById(fromScreen);
        const toElement = document.getElementById(toScreen);
        
        if (!fromElement || !toElement) {
            console.error('❌ Screen elements not found for transition');
            this.isTransitioning = false;
            return Promise.resolve();
        }
        
        try {
            // Prepare target screen
            toElement.style.display = 'flex';
            toElement.style.opacity = '0';
            
            // Apply entrance animation
            switch (direction) {
                case 'slide-up':
                    toElement.style.transform = 'translateY(100vh)';
                    break;
                case 'slide-down':
                    toElement.style.transform = 'translateY(-100vh)';
                    break;
                case 'fade':
                default:
                    toElement.style.transform = 'scale(0.95)';
                    break;
            }
            
            // Force reflow
            toElement.offsetHeight;
            
            // Start transition
            fromElement.style.transition = 'all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)';
            toElement.style.transition = 'all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)';
            
            // Animate out current screen
            fromElement.style.opacity = '0';
            fromElement.style.transform = direction === 'slide-up' ? 'translateY(-50px)' : 
                                         direction === 'slide-down' ? 'translateY(50px)' : 
                                         'scale(1.05)';
            
            // Animate in target screen
            toElement.style.opacity = '1';
            toElement.style.transform = 'translateY(0) scale(1)';
            
            // Wait for animation to complete
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Clean up
            fromElement.style.display = 'none';
            fromElement.classList.remove('active');
            toElement.classList.add('active');
            
            // Reset styles
            fromElement.style.transition = '';
            toElement.style.transition = '';
            fromElement.style.transform = '';
            toElement.style.transform = '';
            fromElement.style.opacity = '';
            toElement.style.opacity = '';
            
            this.currentScreen = toScreen;
            console.log('✅ Screen transition completed');
            
        } catch (error) {
            console.error('❌ Screen transition failed:', error);
        } finally {
            this.isTransitioning = false;
        }
        
        return Promise.resolve();
    }

    /**
     * Show gesture feedback animation
     * @param {object} gesture - Gesture object with name, emoji, and description
     */
    showGestureFeedback(gesture) {
        if (!this.gestureIndicator || !this.gestureIcon || !this.gestureName) {
            return;
        }
        
        console.log(`👋 Showing gesture feedback: ${gesture.name}`);
        
        // Update content
        this.gestureIcon.textContent = gesture.emoji;
        this.gestureName.textContent = gesture.description;
        
        // Add recognition animation
        this.gestureIndicator.classList.add('recognized');
        
        // Play pulse animation
        this.pulseElement(this.gestureIndicator);
        
        // Remove recognition class after animation
        setTimeout(() => {
            if (this.gestureIndicator) {
                this.gestureIndicator.classList.remove('recognized');
            }
        }, 1000);
    }

    /**
     * Reset gesture indicator to default state
     */
    resetGestureIndicator() {
        if (this.gestureIcon && this.gestureName) {
            this.gestureIcon.textContent = '✋';
            this.gestureName.textContent = 'Ready';
        }
        
        if (this.gestureIndicator) {
            this.gestureIndicator.classList.remove('recognized');
        }
    }

    /**
     * Pulse animation for elements
     * @param {HTMLElement} element - Element to animate
     * @param {number} scale - Scale factor for pulse
     * @param {number} duration - Animation duration in ms
     */
    pulseElement(element, scale = 1.1, duration = 300) {
        if (!element) return;
        
        const originalTransform = element.style.transform;
        
        element.style.transition = `transform ${duration / 2}ms ease-out`;
        element.style.transform = `scale(${scale})`;
        
        setTimeout(() => {
            element.style.transform = originalTransform;
            setTimeout(() => {
                element.style.transition = '';
            }, duration / 2);
        }, duration / 2);
    }

    /**
     * Shake animation for elements
     * @param {HTMLElement} element - Element to animate
     * @param {number} intensity - Shake intensity
     * @param {number} duration - Animation duration in ms
     */
    shakeElement(element, intensity = 10, duration = 600) {
        if (!element) return;
        
        const originalTransform = element.style.transform;
        let start = null;
        
        const shake = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                const x = Math.sin(elapsed * 0.01) * intensity * (1 - progress);
                const y = Math.cos(elapsed * 0.015) * intensity * 0.5 * (1 - progress);
                
                element.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(shake);
            } else {
                element.style.transform = originalTransform;
            }
        };
        
        requestAnimationFrame(shake);
    }

    /**
     * Animate flight card selection
     * @param {HTMLElement} card - Flight card element
     */
    animateCardSelection(card) {
        if (!card) return;
        
        card.classList.add('selected');
        this.pulseElement(card, 1.05, 400);
        
        console.log('🎯 Flight card selection animated');
    }

    /**
     * Remove selection animation from all cards
     */
    clearCardSelections() {
        const cards = document.querySelectorAll('.flight-card.selected');
        cards.forEach(card => {
            card.classList.remove('selected');
        });
    }

    /**
     * Animate loading progress
     * @param {number} progress - Progress percentage (0-100)
     */
    updateLoadingProgress(progress) {
        const progressBar = document.querySelector('.loading-progress');
        if (progressBar) {
            progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
    }

    /**
     * Show notification toast
     * @param {string} message - Notification message
     * @param {string} type - Notification type ('success', 'error', 'info')
     * @param {number} duration - Display duration in ms
     */
    showNotification(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `notification toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--frost-gradient);
            backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 15px;
            padding: 15px 25px;
            color: var(--winter-blue-dark);
            font-weight: 600;
            z-index: 1000;
            opacity: 0;
            transition: all 0.3s ease;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        `;
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        // Remove after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px)';
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
        
        console.log(`📢 Notification shown: ${message}`);
    }

    /**
     * Create magical sparkle effect at position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    createSparkleEffect(x, y) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: var(--gold);
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            box-shadow: 0 0 10px var(--gold);
        `;
        
        document.body.appendChild(sparkle);
        
        // Animate sparkle
        let scale = 0;
        let opacity = 1;
        const animate = () => {
            scale += 0.1;
            opacity -= 0.05;
            
            sparkle.style.transform = `scale(${scale})`;
            sparkle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                sparkle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Get current animation state
     * @returns {object} Animation state
     */
    getState() {
        return {
            currentScreen: this.currentScreen,
            isTransitioning: this.isTransitioning,
            isSnowEnabled: this.isSnowEnabled,
            snowflakeCount: this.snowContainer ? this.snowContainer.children.length : 0
        };
    }

    /**
     * Cleanup animations and resources
     */
    cleanup() {
        console.log('🧹 Cleaning up animations...');
        
        this.stopSnowAnimation();
        
        // Remove any remaining notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => notification.remove());
        
        console.log('✅ Animation cleanup complete');
    }
}

// Export for use by other modules
window.AnimationManager = AnimationManager;

console.log('✅ Animation manager module loaded');
