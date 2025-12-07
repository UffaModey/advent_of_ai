/**
 * UI components manager for the flight tracker
 * Handles flight card rendering, airport selection, and detail views
 */

class UIComponents {
    constructor() {
        this.currentFlights = [];
        this.selectedFlightIndex = -1;
        this.currentFlightType = 'arrivals';
        this.currentAirport = 'JFK';
        
        // DOM elements
        this.flightList = null;
        this.airportCode = null;
        this.airportName = null;
        this.airportList = null;
        this.selectedAirportIndex = 0;
        
        // Flight detail elements
        this.detailElements = {};
        
        // Initialize after DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    /**
     * Initialize UI components
     */
    initialize() {
        this.flightList = document.getElementById('flight-list');
        this.airportCode = document.getElementById('airport-code');
        this.airportName = document.getElementById('airport-name');
        this.airportList = document.getElementById('airport-list');
        
        // Initialize flight detail elements
        this.detailElements = {
            flightNumber: document.getElementById('detail-flight-number'),
            airline: document.getElementById('detail-airline'),
            status: document.getElementById('detail-status'),
            origin: document.getElementById('detail-origin'),
            destination: document.getElementById('detail-destination'),
            departureTime: document.getElementById('detail-departure-time'),
            arrivalTime: document.getElementById('detail-arrival-time'),
            gate: document.getElementById('detail-gate'),
            terminal: document.getElementById('detail-terminal'),
            aircraft: document.getElementById('detail-aircraft'),
            duration: document.getElementById('detail-duration')
        };
        
        this.setupEventListeners();
        console.log('✅ UI components initialized');
    }

    /**
     * Set up event listeners for UI interactions
     */
    setupEventListeners() {
        // Tab buttons
        const arrivalsTab = document.getElementById('arrivals-tab');
        const departuresTab = document.getElementById('departures-tab');
        const refreshBtn = document.getElementById('refresh-btn');
        
        if (arrivalsTab) {
            arrivalsTab.addEventListener('click', () => this.switchFlightType('arrivals'));
        }
        
        if (departuresTab) {
            departuresTab.addEventListener('click', () => this.switchFlightType('departures'));
        }
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshFlightData());
        }
        
        // Airport selection
        if (this.airportList) {
            this.airportList.addEventListener('click', (e) => {
                const airportOption = e.target.closest('.airport-option');
                if (airportOption) {
                    this.selectAirport(airportOption);
                }
            });
        }
        
        // Flight card clicks
        if (this.flightList) {
            this.flightList.addEventListener('click', (e) => {
                const flightCard = e.target.closest('.flight-card');
                if (flightCard) {
                    const flightIndex = Array.from(this.flightList.children).indexOf(flightCard);
                    this.selectFlight(flightIndex);
                }
            });
        }
    }

    /**
     * Render flight list
     * @param {Array} flights - Array of flight objects
     * @param {string} type - 'arrivals' or 'departures'
     */
    renderFlights(flights, type) {
        if (!this.flightList) {
            console.error('❌ Flight list element not found');
            return;
        }
        
        console.log(`✈️ Rendering ${flights.length} ${type}`);
        
        this.currentFlights = flights;
        this.currentFlightType = type;
        this.selectedFlightIndex = -1;
        
        // Clear existing flights
        this.flightList.innerHTML = '';
        
        if (flights.length === 0) {
            this.renderNoFlightsMessage(type);
            return;
        }
        
        // Render flight cards
        flights.forEach((flight, index) => {
            const card = this.createFlightCard(flight, index);
            this.flightList.appendChild(card);
        });
        
        // Update tab buttons
        this.updateTabButtons(type);
        
        // Animate cards in
        this.animateFlightCardsIn();
    }

    /**
     * Create flight card element
     * @param {object} flight - Flight data
     * @param {number} index - Flight index
     * @returns {HTMLElement} Flight card element
     */
    createFlightCard(flight, index) {
        const card = document.createElement('div');
        card.className = 'flight-card';
        card.dataset.flightIndex = index;
        
        const scheduledTime = this.formatTime(flight.scheduledTime);
        const estimatedTime = flight.estimatedTime ? this.formatTime(flight.estimatedTime) : scheduledTime;
        
        const isArrival = this.currentFlightType === 'arrivals';
        const primaryAirport = isArrival ? flight.origin : flight.destination;
        const timeLabel = isArrival ? 'Arrival' : 'Departure';
        
        card.innerHTML = `
            <div class="flight-header">
                <div>
                    <div class="flight-number">${flight.flightNumber}</div>
                    <div class="airline">${flight.airline}</div>
                </div>
                <div class="status ${flight.status.class}">${flight.status.display}</div>
            </div>
            
            <div class="route">
                <div class="route-airport">
                    <div class="route-code">${primaryAirport.code}</div>
                    <div class="route-name">${this.truncateText(primaryAirport.name, 25)}</div>
                </div>
                <div class="route-arrow">✈️</div>
                <div class="route-airport">
                    <div class="route-code">${isArrival ? this.currentAirport : primaryAirport.code}</div>
                    <div class="route-name">${isArrival ? this.getAirportName(this.currentAirport) : this.truncateText(primaryAirport.name, 25)}</div>
                </div>
            </div>
            
            <div class="flight-times">
                <div class="time-info">
                    <div class="time-label">Scheduled ${timeLabel}</div>
                    <div class="time-value">${scheduledTime}</div>
                </div>
                <div class="time-info">
                    <div class="time-label">Estimated ${timeLabel}</div>
                    <div class="time-value">${estimatedTime}</div>
                </div>
            </div>
        `;
        
        return card;
    }

    /**
     * Render no flights message
     * @param {string} type - Flight type
     */
    renderNoFlightsMessage(type) {
        this.flightList.innerHTML = `
            <div class="no-flights-message">
                <div class="no-flights-icon">${type === 'arrivals' ? '🛬' : '🛫'}</div>
                <div class="no-flights-text">
                    <h3>No ${type} found</h3>
                    <p>There are currently no ${type} scheduled for ${this.currentAirport}</p>
                    <p>Try refreshing or selecting a different airport</p>
                </div>
            </div>
        `;
        
        // Add styles for no flights message
        const style = document.createElement('style');
        style.textContent = `
            .no-flights-message {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 60px 40px;
                text-align: center;
                grid-column: 1 / -1;
                background: var(--frost-gradient);
                backdrop-filter: blur(20px);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 20px;
                color: var(--winter-blue-dark);
            }
            
            .no-flights-icon {
                font-size: 4rem;
                margin-bottom: 20px;
                opacity: 0.7;
            }
            
            .no-flights-text h3 {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 10px;
                color: var(--gold);
            }
            
            .no-flights-text p {
                font-size: 1rem;
                line-height: 1.5;
                margin-bottom: 5px;
                color: var(--silver);
            }
        `;
        
        if (!document.querySelector('#no-flights-styles')) {
            style.id = 'no-flights-styles';
            document.head.appendChild(style);
        }
    }

    /**
     * Update tab button states
     * @param {string} activeType - Active flight type
     */
    updateTabButtons(activeType) {
        const arrivalsTab = document.getElementById('arrivals-tab');
        const departuresTab = document.getElementById('departures-tab');
        
        if (arrivalsTab && departuresTab) {
            arrivalsTab.classList.toggle('active', activeType === 'arrivals');
            departuresTab.classList.toggle('active', activeType === 'departures');
        }
    }

    /**
     * Switch between arrivals and departures
     * @param {string} type - 'arrivals' or 'departures'
     */
    switchFlightType(type) {
        if (this.currentFlightType === type) return;
        
        console.log(`🔄 Switching to ${type}`);
        this.currentFlightType = type;
        
        // Emit event for app to handle data loading
        document.dispatchEvent(new CustomEvent('flight-type-changed', {
            detail: { type, airport: this.currentAirport }
        }));
    }

    /**
     * Refresh flight data
     */
    refreshFlightData() {
        console.log('🔄 Refreshing flight data');
        
        // Emit event for app to handle data refresh
        document.dispatchEvent(new CustomEvent('flight-data-refresh', {
            detail: { type: this.currentFlightType, airport: this.currentAirport }
        }));
    }

    /**
     * Navigate flight selection (for wave gesture)
     * @param {string} direction - 'up' or 'down'
     */
    navigateFlights(direction) {
        if (this.currentFlights.length === 0) return;
        
        const increment = direction === 'down' ? 1 : -1;
        const newIndex = Math.max(0, Math.min(
            this.currentFlights.length - 1,
            this.selectedFlightIndex + increment
        ));
        
        if (newIndex !== this.selectedFlightIndex) {
            this.selectFlight(newIndex);
        }
    }

    /**
     * Select a flight card
     * @param {number} index - Flight index
     */
    selectFlight(index) {
        if (index < 0 || index >= this.currentFlights.length) return;
        
        console.log(`🎯 Selecting flight at index ${index}`);
        
        // Update selection
        this.selectedFlightIndex = index;
        
        // Update visual selection
        this.updateFlightSelection();
        
        // Emit selection event
        document.dispatchEvent(new CustomEvent('flight-selected', {
            detail: { 
                flight: this.currentFlights[index], 
                index: index 
            }
        }));
    }

    /**
     * Update visual flight selection
     */
    updateFlightSelection() {
        const cards = this.flightList.querySelectorAll('.flight-card');
        
        cards.forEach((card, index) => {
            const isSelected = index === this.selectedFlightIndex;
            card.classList.toggle('selected', isSelected);
            
            if (isSelected) {
                // Scroll into view
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    /**
     * Show flight detail view
     * @param {object} flight - Flight data
     */
    showFlightDetail(flight) {
        console.log(`📋 Showing detail for flight ${flight.flightNumber}`);
        
        // Update flight detail information
        this.updateFlightDetail(flight);
        
        // Emit event for app to handle screen transition
        document.dispatchEvent(new CustomEvent('show-flight-detail', {
            detail: { flight }
        }));
    }

    /**
     * Update flight detail view with flight data
     * @param {object} flight - Flight data
     */
    updateFlightDetail(flight) {
        if (!this.detailElements.flightNumber) {
            console.error('❌ Flight detail elements not found');
            return;
        }
        
        // Basic flight info
        this.detailElements.flightNumber.textContent = flight.flightNumber;
        this.detailElements.airline.textContent = flight.airline;
        this.detailElements.status.textContent = flight.status.display;
        this.detailElements.status.className = `status ${flight.status.class}`;
        
        // Route information
        this.detailElements.origin.textContent = flight.origin.code;
        this.detailElements.destination.textContent = flight.destination.code;
        
        // Times
        const departureTime = this.formatTime(flight.scheduledTime);
        const arrivalTime = flight.estimatedTime ? this.formatTime(flight.estimatedTime) : departureTime;
        
        this.detailElements.departureTime.textContent = departureTime;
        this.detailElements.arrivalTime.textContent = arrivalTime;
        
        // Additional details
        this.detailElements.gate.textContent = flight.origin.gate || flight.destination.gate || 'TBA';
        this.detailElements.terminal.textContent = flight.origin.terminal || flight.destination.terminal || 'TBA';
        this.detailElements.aircraft.textContent = flight.aircraft.type || 'Unknown';
        this.detailElements.duration.textContent = this.calculateFlightDuration(flight);
    }

    /**
     * Set up airport selection
     * @param {Array} airports - Available airports
     * @param {string} currentAirport - Currently selected airport
     */
    setupAirportSelection(airports, currentAirport) {
        this.currentAirport = currentAirport;
        this.selectedAirportIndex = airports.findIndex(airport => airport.code === currentAirport);
        
        // Update current airport display
        this.updateAirportDisplay(currentAirport);
        
        // Render airport options if airport list exists
        if (this.airportList) {
            this.renderAirportList(airports);
        }
    }

    /**
     * Render airport selection list
     * @param {Array} airports - Available airports
     */
    renderAirportList(airports) {
        this.airportList.innerHTML = '';
        
        airports.forEach((airport, index) => {
            const option = document.createElement('div');
            option.className = 'airport-option';
            option.dataset.code = airport.code;
            option.dataset.name = airport.name;
            option.dataset.index = index;
            
            if (airport.code === this.currentAirport) {
                option.classList.add('active');
            }
            
            option.innerHTML = `
                <div class="airport-code">${airport.code}</div>
                <div class="airport-name">${airport.name}</div>
                <div class="airport-location">${airport.location}</div>
            `;
            
            this.airportList.appendChild(option);
        });
    }

    /**
     * Navigate airport selection
     * @param {string} direction - 'up' or 'down'
     */
    navigateAirports(direction) {
        const options = this.airportList.querySelectorAll('.airport-option');
        if (options.length === 0) return;
        
        const increment = direction === 'down' ? 1 : -1;
        const newIndex = Math.max(0, Math.min(
            options.length - 1,
            this.selectedAirportIndex + increment
        ));
        
        if (newIndex !== this.selectedAirportIndex) {
            // Update visual selection
            options[this.selectedAirportIndex]?.classList.remove('active');
            options[newIndex]?.classList.add('active');
            
            this.selectedAirportIndex = newIndex;
            
            // Scroll into view
            options[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /**
     * Select airport
     * @param {HTMLElement|string} airportOption - Airport option element or airport code
     */
    selectAirport(airportOption) {
        let airportCode, airportName;
        
        if (typeof airportOption === 'string') {
            airportCode = airportOption;
            airportName = this.getAirportName(airportCode);
        } else {
            airportCode = airportOption.dataset.code;
            airportName = airportOption.dataset.name;
        }
        
        if (!airportCode) return;
        
        console.log(`🏢 Selecting airport: ${airportCode}`);
        
        this.currentAirport = airportCode;
        this.updateAirportDisplay(airportCode, airportName);
        
        // Update visual selection
        if (this.airportList) {
            const options = this.airportList.querySelectorAll('.airport-option');
            options.forEach(option => option.classList.remove('active'));
            
            const selectedOption = this.airportList.querySelector(`[data-code="${airportCode}"]`);
            if (selectedOption) {
                selectedOption.classList.add('active');
            }
        }
        
        // Emit airport change event
        document.dispatchEvent(new CustomEvent('airport-changed', {
            detail: { airportCode, airportName }
        }));
    }

    /**
     * Confirm airport selection
     */
    confirmAirportSelection() {
        const activeOption = this.airportList.querySelector('.airport-option.active');
        if (activeOption) {
            this.selectAirport(activeOption);
            
            // Emit confirmation event
            document.dispatchEvent(new CustomEvent('airport-selection-confirmed', {
                detail: { 
                    airportCode: this.currentAirport,
                    airportName: this.getAirportName(this.currentAirport)
                }
            }));
        }
    }

    /**
     * Update airport display in header
     * @param {string} airportCode - Airport code
     * @param {string} airportName - Airport name (optional)
     */
    updateAirportDisplay(airportCode, airportName = null) {
        if (this.airportCode) {
            this.airportCode.textContent = airportCode;
        }
        
        if (this.airportName) {
            this.airportName.textContent = airportName || this.getAirportName(airportCode);
        }
    }

    /**
     * Get airport name by code
     * @param {string} code - Airport code
     * @returns {string} Airport name
     */
    getAirportName(code) {
        const airportNames = {
            'JFK': 'John F. Kennedy International',
            'LAX': 'Los Angeles International',
            'ORD': "O'Hare International",
            'ATL': 'Hartsfield-Jackson Atlanta International',
            'DFW': 'Dallas/Fort Worth International'
        };
        
        return airportNames[code] || 'Unknown Airport';
    }

    /**
     * Animate flight cards entrance
     */
    animateFlightCardsIn() {
        const cards = this.flightList.querySelectorAll('.flight-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    /**
     * Format time string for display
     * @param {string} timeString - ISO time string
     * @returns {string} Formatted time
     */
    formatTime(timeString) {
        if (!timeString) return '--:--';
        
        try {
            const date = new Date(timeString);
            return date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
        } catch (error) {
            return '--:--';
        }
    }

    /**
     * Calculate flight duration
     * @param {object} flight - Flight data
     * @returns {string} Duration string
     */
    calculateFlightDuration(flight) {
        try {
            const departure = new Date(flight.scheduledTime);
            const arrival = new Date(flight.estimatedTime || flight.scheduledTime);
            const duration = arrival - departure;
            
            if (duration <= 0) return 'N/A';
            
            const hours = Math.floor(duration / (1000 * 60 * 60));
            const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
            
            return `${hours}h ${minutes}m`;
        } catch (error) {
            return 'N/A';
        }
    }

    /**
     * Truncate text to specified length
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    /**
     * Get current UI state
     * @returns {object} Current state
     */
    getState() {
        return {
            currentFlightType: this.currentFlightType,
            currentAirport: this.currentAirport,
            selectedFlightIndex: this.selectedFlightIndex,
            selectedAirportIndex: this.selectedAirportIndex,
            flightCount: this.currentFlights.length
        };
    }

    /**
     * Clear all flight data
     */
    clearFlights() {
        if (this.flightList) {
            this.flightList.innerHTML = '';
        }
        this.currentFlights = [];
        this.selectedFlightIndex = -1;
    }
}

// Export for use by other modules
window.UIComponents = UIComponents;

console.log('✅ UI components module loaded');
