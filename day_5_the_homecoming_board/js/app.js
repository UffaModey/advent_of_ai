/**
 * Main application controller for the Gesture-Controlled Flight Tracker
 * The Homecoming Board - Winter Festival Edition
 * 
 * Coordinates between MediaPipe hand tracking, gesture recognition,
 * flight data API, and UI components
 */

class FlightTrackerApp {
    constructor() {
        // Core modules
        this.handDetector = null;
        this.gestureRecognizer = null;
        this.flightAPI = null;
        this.uiComponents = null;
        this.animationManager = null;
        
        // Application state
        this.currentScreen = 'loading-screen';
        this.isInitialized = false;
        this.isCameraEnabled = true;
        this.currentAirport = null; // Will be set from API
        this.currentFlightType = 'arrivals';
        
        // Gesture action mapping
        this.gestureActions = {
            'shaka': this.loadArrivals.bind(this),
            'ok_sign': this.loadDepartures.bind(this),
            'wave_hand': this.navigateInterface.bind(this),
            'closed_fist': this.selectCurrentFlight.bind(this),
            'vulcan_sign': this.exitDetailView.bind(this),
            'peace_sign': this.refreshFlightData.bind(this),
            'rock_on_sign': this.switchAirportMode.bind(this)
        };
        
        // Navigation state
        this.navigationDirection = 'down';
        this.lastNavigationTime = 0;
        this.navigationDebounce = 500; // ms
        
        // Initialize application
        this.initialize();
    }

    /**
     * Initialize the application
     */
    async initialize() {
        console.log('🚀 Initializing Flight Tracker App...');
        
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Initialize modules
            await this.initializeModules();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize camera and hand tracking
            await this.initializeHandTracking();
            
            // Setup initial airport and flight data
            await this.setupInitialData();
            
            // Show main screen
            await this.showMainScreen();
            
            this.isInitialized = true;
            console.log('✅ Flight Tracker App initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Flight Tracker App:', error);
            this.showErrorState(error);
        }
    }

    /**
     * Initialize all application modules
     */
    async initializeModules() {
        console.log('🔧 Initializing modules...');
        
        // Initialize core modules
        this.flightAPI = window.FlightAPI;
        this.uiComponents = new UIComponents();
        this.animationManager = new AnimationManager();
        this.gestureRecognizer = new GestureRecognizer();
        this.handDetector = new HandDetector();
        
        // Setup gesture recognition callbacks
        this.gestureRecognizer.setCallbacks(
            this.onGestureDetected.bind(this),
            this.onGestureChanged.bind(this)
        );
        
        console.log('✅ All modules initialized');
    }

    /**
     * Setup application event listeners
     */
    setupEventListeners() {
        // UI component events
        document.addEventListener('flight-type-changed', this.onFlightTypeChanged.bind(this));
        document.addEventListener('flight-data-refresh', this.onFlightDataRefresh.bind(this));
        document.addEventListener('flight-selected', this.onFlightSelected.bind(this));
        document.addEventListener('show-flight-detail', this.onShowFlightDetail.bind(this));
        document.addEventListener('airport-changed', this.onAirportChanged.bind(this));
        document.addEventListener('airport-selection-confirmed', this.onAirportConfirmed.bind(this));
        document.addEventListener('airport-navigation-change', this.onAirportNavigationChange.bind(this));
        
        // Camera toggle button
        const toggleCameraBtn = document.getElementById('toggle-camera');
        if (toggleCameraBtn) {
            toggleCameraBtn.addEventListener('click', this.toggleCamera.bind(this));
        }
        
        // Back button in detail view
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', this.exitDetailView.bind(this));
        }
        
        // Airport confirmation button
        const confirmAirportBtn = document.getElementById('confirm-airport');
        if (confirmAirportBtn) {
            confirmAirportBtn.addEventListener('click', this.confirmAirportSelection.bind(this));
        }
        
        // Gesture controls toggle
        const controlsToggle = document.getElementById('controls-toggle');
        if (controlsToggle) {
            controlsToggle.addEventListener('click', this.toggleGestureControls.bind(this));
        }
        
        console.log('✅ Event listeners setup complete');
    }

    /**
     * Initialize hand tracking and MediaPipe
     */
    async initializeHandTracking() {
        console.log('👋 Initializing hand tracking...');
        
        const videoElement = document.getElementById('input-video');
        const canvasElement = document.getElementById('output-canvas');
        
        if (!videoElement || !canvasElement) {
            throw new Error('Video or canvas elements not found');
        }
        
        // Initialize hand detector
        const success = await this.handDetector.initialize(
            videoElement,
            canvasElement,
            this.onHandTrackingResults.bind(this)
        );
        
        if (!success) {
            throw new Error('Failed to initialize MediaPipe hand tracking');
        }
        
        // Start hand detection
        await this.handDetector.start();
        
        console.log('✅ Hand tracking initialized');
    }

    /**
     * Setup initial airport and flight data
     */
    async setupInitialData() {
        console.log('🏢 Setting up initial data...');
        
        // Get available airports
        const airports = await this.flightAPI.getAvailableAirports();
        
        // Set the first airport as current if not already set
        if (!this.currentAirport && airports.length > 0) {
            this.currentAirport = airports[0].code;
            console.log(`🛫 Default airport set to: ${this.currentAirport}`);
        }
        
        this.uiComponents.setupAirportSelection(airports, this.currentAirport);
        
        // Load initial flight data
        await this.loadFlightData(this.currentAirport, this.currentFlightType);
        
        console.log('✅ Initial data setup complete');
    }

    /**
     * Show main screen with transition
     */
    async showMainScreen() {
        await this.animationManager.transitionScreen(
            this.currentScreen,
            'main-screen',
            'fade'
        );
        this.currentScreen = 'main-screen';
    }

    /**
     * Handle hand tracking results from MediaPipe
     * @param {object} results - Hand tracking results
     */
    onHandTrackingResults(results) {
        if (!this.isInitialized) return;
        
        // Process gestures
        const gesture = this.gestureRecognizer.recognizeGesture(
            results.landmarks,
            results.handedness
        );
        
        if (gesture && gesture.isNewGesture) {
            this.handleGestureAction(gesture);
        }
    }

    /**
     * Handle gesture detection
     * @param {object} gesture - Detected gesture
     */
    onGestureDetected(gesture) {
        console.log(`👋 Gesture detected: ${gesture.name} (${gesture.emoji})`);
        
        // Show visual feedback
        this.animationManager.showGestureFeedback(gesture);
    }

    /**
     * Handle gesture changes
     * @param {object} gesture - New gesture
     */
    onGestureChanged(gesture) {
        console.log(`🔄 Gesture changed to: ${gesture.name}`);
        
        // Update gesture indicator
        this.animationManager.showGestureFeedback(gesture);
    }

    /**
     * Handle gesture actions
     * @param {object} gesture - Gesture with action
     */
    handleGestureAction(gesture) {
        const action = this.gestureActions[gesture.name];
        
        if (action) {
            console.log(`⚡ Executing gesture action: ${gesture.action}`);
            
            try {
                action(gesture);
                
                // Show success notification
                this.animationManager.showNotification(
                    `${gesture.emoji} ${gesture.description}`,
                    'success',
                    2000
                );
                
            } catch (error) {
                console.error('❌ Gesture action failed:', error);
                
                this.animationManager.showNotification(
                    'Action failed, please try again',
                    'error'
                );
            }
        } else {
            console.warn(`⚠️ No action defined for gesture: ${gesture.name}`);
        }
    }

    /**
     * Load arrivals for current airport
     */
    async loadArrivals(gesture) {
        if (this.currentScreen !== 'main-screen') return;
        
        console.log('🛬 Loading arrivals...');
        this.currentFlightType = 'arrivals';
        await this.loadFlightData(this.currentAirport, 'arrivals');
    }

    /**
     * Load departures for current airport
     */
    async loadDepartures(gesture) {
        if (this.currentScreen !== 'main-screen') return;
        
        console.log('🛫 Loading departures...');
        this.currentFlightType = 'departures';
        await this.loadFlightData(this.currentAirport, 'departures');
    }

    /**
     * Navigate the interface based on current screen
     */
    navigateInterface(gesture) {
        const now = Date.now();
        
        // Debounce navigation
        if (now - this.lastNavigationTime < this.navigationDebounce) {
            return;
        }
        
        this.lastNavigationTime = now;
        
        // Alternate navigation direction for continuous wave
        this.navigationDirection = this.navigationDirection === 'down' ? 'up' : 'down';
        
        console.log(`🖐️ Navigating ${this.navigationDirection} on ${this.currentScreen}`);
        
        switch (this.currentScreen) {
            case 'main-screen':
                this.uiComponents.navigateFlights(this.navigationDirection);
                break;
            case 'airport-screen':
                this.uiComponents.navigateAirports(this.navigationDirection);
                break;
            default:
                console.log('Navigation not available on current screen');
        }
    }

    /**
     * Select currently highlighted flight
     */
    selectCurrentFlight(gesture) {
        if (this.currentScreen === 'main-screen') {
            const state = this.uiComponents.getState();
            
            if (state.selectedFlightIndex >= 0) {
                console.log('✊ Selecting current flight for detail view');
                
                // Get selected flight
                const flight = this.uiComponents.currentFlights[state.selectedFlightIndex];
                this.showFlightDetailView(flight);
            } else {
                this.animationManager.showNotification(
                    'No flight selected. Use wave gesture to navigate.',
                    'info'
                );
            }
        } else if (this.currentScreen === 'airport-screen') {
            console.log('✊ Confirming airport selection');
            this.confirmAirportSelection();
        }
    }

    /**
     * Exit detail view and return to main screen
     */
    async exitDetailView(gesture) {
        if (this.currentScreen === 'detail-screen') {
            console.log('🖖 Exiting detail view');
            
            await this.animationManager.transitionScreen(
                'detail-screen',
                'main-screen',
                'slide-down'
            );
            
            this.currentScreen = 'main-screen';
            this.uiComponents.clearCardSelections();
        }
    }

    /**
     * Refresh current flight data
     */
    async refreshFlightData(gesture) {
        if (this.currentScreen !== 'main-screen') return;
        
        console.log('✌️ Refreshing flight data...');
        
        // Show loading indicator
        this.animationManager.showNotification('Refreshing flight data...', 'info', 1000);
        
        // Clear cache for current data
        const cacheKey = Cache.generateFlightKey(
            this.currentAirport,
            this.currentFlightType
        );
        window.FlightCache.delete(cacheKey);
        
        // Reload data
        await this.loadFlightData(this.currentAirport, this.currentFlightType);
    }

    /**
     * Switch to airport selection mode
     */
    async switchAirportMode(gesture) {
        if (this.currentScreen === 'main-screen') {
            console.log('🤘 Switching to airport selection');
            
            await this.animationManager.transitionScreen(
                'main-screen',
                'airport-screen',
                'slide-up'
            );
            
            this.currentScreen = 'airport-screen';
        } else if (this.currentScreen === 'airport-screen') {
            console.log('🤘 Returning to main screen');
            
            await this.animationManager.transitionScreen(
                'airport-screen',
                'main-screen',
                'slide-down'
            );
            
            this.currentScreen = 'main-screen';
        }
    }

    /**
     * Load flight data from API
     * @param {string} airport - Airport code
     * @param {string} type - 'arrivals' or 'departures'
     */
    async loadFlightData(airport, type) {
        console.log(`📡 Loading ${type} for ${airport}...`);
        
        try {
            // Show loading state
            this.animationManager.updateLoadingProgress(30);
            
            let flights;
            if (type === 'arrivals') {
                flights = await this.flightAPI.getArrivals(airport);
            } else {
                flights = await this.flightAPI.getDepartures(airport);
            }
            
            this.animationManager.updateLoadingProgress(80);
            
            // Render flights in UI
            this.uiComponents.renderFlights(flights, type);
            
            this.animationManager.updateLoadingProgress(100);
            
            console.log(`✅ Loaded ${flights.length} ${type} for ${airport}`);
            
        } catch (error) {
            console.error(`❌ Failed to load ${type}:`, error);
            
            this.animationManager.showNotification(
                `Failed to load ${type}. Using demo data.`,
                'error'
            );
        }
    }

    /**
     * Show flight detail view
     * @param {object} flight - Flight data
     */
    async showFlightDetailView(flight) {
        console.log(`📋 Showing detail view for ${flight.flightNumber}`);
        
        this.uiComponents.showFlightDetail(flight);
        
        await this.animationManager.transitionScreen(
            'main-screen',
            'detail-screen',
            'slide-up'
        );
        
        this.currentScreen = 'detail-screen';
    }

    /**
     * Confirm airport selection and return to main screen
     */
    async confirmAirportSelection() {
        this.uiComponents.confirmAirportSelection();
        
        await this.animationManager.transitionScreen(
            'airport-screen',
            'main-screen',
            'slide-down'
        );
        
        this.currentScreen = 'main-screen';
    }

    /**
     * Toggle camera visibility
     */
    toggleCamera() {
        const cameraContainer = document.getElementById('camera-container');
        if (cameraContainer) {
            this.isCameraEnabled = !this.isCameraEnabled;
            cameraContainer.classList.toggle('hidden', !this.isCameraEnabled);
            
            console.log(`📷 Camera ${this.isCameraEnabled ? 'enabled' : 'disabled'}`);
        }
    }

    /**
     * Toggle gesture controls panel
     */
    toggleGestureControls() {
        const controlsPanel = document.getElementById('gesture-controls-panel');
        const controlsToggle = document.getElementById('controls-toggle');
        
        if (controlsPanel) {
            const isCollapsed = controlsPanel.classList.toggle('collapsed');
            
            if (controlsToggle) {
                controlsToggle.textContent = isCollapsed ? '👁️' : '📝';
                controlsToggle.title = isCollapsed ? 'Show gesture controls' : 'Hide gesture controls';
            }
            
            console.log(`🎛️ Gesture controls ${isCollapsed ? 'collapsed' : 'expanded'}`);
        }
    }

    /**
     * Handle flight type change event
     * @param {CustomEvent} event - Event with flight type details
     */
    async onFlightTypeChanged(event) {
        const { type, airport } = event.detail;
        this.currentFlightType = type;
        await this.loadFlightData(airport, type);
    }

    /**
     * Handle flight data refresh event
     * @param {CustomEvent} event - Event with refresh details
     */
    async onFlightDataRefresh(event) {
        const { type, airport } = event.detail;
        
        // Clear cache and reload
        const cacheKey = Cache.generateFlightKey(airport, type);
        window.FlightCache.delete(cacheKey);
        
        await this.loadFlightData(airport, type);
    }

    /**
     * Handle flight selection event
     * @param {CustomEvent} event - Event with flight details
     */
    onFlightSelected(event) {
        const { flight } = event.detail;
        console.log(`✈️ Flight selected: ${flight.flightNumber}`);
        
        // Visual feedback
        this.animationManager.showNotification(
            `Selected ${flight.flightNumber}`,
            'info',
            1500
        );
    }

    /**
     * Handle show flight detail event
     * @param {CustomEvent} event - Event with flight details
     */
    async onShowFlightDetail(event) {
        await this.showFlightDetailView(event.detail.flight);
    }

    /**
     * Handle airport change event
     * @param {CustomEvent} event - Event with airport details
     */
    async onAirportChanged(event) {
        const { airportCode } = event.detail;
        this.currentAirport = airportCode;
        
        console.log(`🏢 Airport changed to: ${airportCode}`);
    }

    /**
     * Handle airport selection confirmation
     * @param {CustomEvent} event - Event with airport details
     */
    async onAirportConfirmed(event) {
        const { airportCode } = event.detail;
        this.currentAirport = airportCode;
        
        // Load flight data for new airport
        await this.loadFlightData(airportCode, this.currentFlightType);
        
        this.animationManager.showNotification(
            `Switched to ${airportCode}`,
            'success'
        );
    }

    /**
     * Handle airport navigation change event (for visual feedback)
     * @param {CustomEvent} event - Event with navigation details
     */
    onAirportNavigationChange(event) {
        const { airportCode, airportName, direction } = event.detail;
        
        console.log(`🛫 Airport navigation: ${airportCode} - ${airportName} (${direction})`);
        
        // Show feedback notification
        this.animationManager.showNotification(
            `🖐️ ${airportCode} - ${airportName}`,
            'info',
            1500
        );
    }

    /**
     * Show error state
     * @param {Error} error - Error details
     */
    showErrorState(error) {
        console.error('💥 Application error:', error);
        
        const errorScreen = document.createElement('div');
        errorScreen.id = 'error-screen';
        errorScreen.className = 'screen active';
        errorScreen.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 40px;
        `;
        
        errorScreen.innerHTML = `
            <div style="
                background: var(--frost-gradient);
                backdrop-filter: blur(20px);
                padding: 40px;
                border-radius: 20px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                color: var(--winter-blue-dark);
                max-width: 500px;
            ">
                <div style="font-size: 4rem; margin-bottom: 20px;">❌</div>
                <h2 style="color: var(--gold); margin-bottom: 15px;">Initialization Failed</h2>
                <p style="margin-bottom: 20px; line-height: 1.5;">${error.message}</p>
                <p style="font-size: 0.9rem; color: var(--silver);">
                    Please ensure your camera is connected and try refreshing the page.
                </p>
                <button onclick="location.reload()" style="
                    background: var(--gold);
                    border: none;
                    color: var(--winter-blue-dark);
                    padding: 12px 24px;
                    border-radius: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 20px;
                ">Retry</button>
            </div>
        `;
        
        // Hide loading screen and show error
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        document.getElementById('app').appendChild(errorScreen);
    }

    /**
     * Get application status
     * @returns {object} Application status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            currentScreen: this.currentScreen,
            currentAirport: this.currentAirport,
            currentFlightType: this.currentFlightType,
            isCameraEnabled: this.isCameraEnabled,
            handDetectorStatus: this.handDetector?.getStatus(),
            gestureRecognizerStatus: this.gestureRecognizer?.getStatus(),
            uiComponentsStatus: this.uiComponents?.getState(),
            animationStatus: this.animationManager?.getState()
        };
    }

    /**
     * Cleanup application resources
     */
    cleanup() {
        console.log('🧹 Cleaning up Flight Tracker App...');
        
        if (this.handDetector) {
            this.handDetector.cleanup();
        }
        
        if (this.animationManager) {
            this.animationManager.cleanup();
        }
        
        if (this.gestureRecognizer) {
            this.gestureRecognizer.reset();
        }
        
        console.log('✅ Cleanup complete');
    }
}

// Initialize application when DOM is ready
let app;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new FlightTrackerApp();
    });
} else {
    app = new FlightTrackerApp();
}

// Global access for debugging
window.FlightTrackerApp = app;

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (app) {
        app.cleanup();
    }
});

console.log('✅ Flight Tracker App script loaded');
