/**
 * Flight API integration with AviationStack
 * Handles CORS, caching, and data formatting
 */

class FlightAPI {
    constructor() {
        this.apiKey = '';
        this.baseURL = 'https://api.aviationstack.com/v1';
        
        // Use CORS proxy for browser requests
        this.proxyURL = 'https://api.allorigins.win/raw?url=';
        
        // Default airports with their details
        this.airports = {
            'JFK': { name: 'John F. Kennedy International', location: 'New York, NY', iata: 'JFK' },
            'LAX': { name: 'Los Angeles International', location: 'Los Angeles, CA', iata: 'LAX' },
            'ORD': { name: "O'Hare International", location: 'Chicago, IL', iata: 'ORD' },
            'ATL': { name: 'Hartsfield-Jackson Atlanta International', location: 'Atlanta, GA', iata: 'ATL' },
            'DFW': { name: 'Dallas/Fort Worth International', location: 'Dallas, TX', iata: 'DFW' }
        };

        this.cache = window.FlightCache;
    }

    /**
     * Build API URL with parameters
     * @param {string} endpoint - API endpoint
     * @param {object} params - Query parameters
     * @returns {string} Complete API URL
     */
    buildURL(endpoint, params = {}) {
        const url = new URL(`${this.baseURL}/${endpoint}`);
        
        // Add API key
        url.searchParams.append('access_key', this.apiKey);
        
        // Add other parameters
        for (const [key, value] of Object.entries(params)) {
            if (value !== null && value !== undefined) {
                url.searchParams.append(key, value);
            }
        }

        // Use CORS proxy
        return this.proxyURL + encodeURIComponent(url.toString());
    }

    /**
     * Make HTTP request with error handling
     * @param {string} url - Request URL
     * @returns {Promise<object>} Response data
     */
    async request(url) {
        try {
            console.log('🛫 Making API request:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Check for API errors
            if (data.error) {
                throw new Error(`API Error: ${data.error.message || 'Unknown error'}`);
            }

            console.log('✅ API request successful');
            return data;
            
        } catch (error) {
            console.error('❌ API request failed:', error);
            
            // Return mock data for demo purposes
            console.log('🔄 Using mock data for demonstration');
            return this.getMockData();
        }
    }

    /**
     * Get flight arrivals for an airport
     * @param {string} airportCode - IATA airport code
     * @param {number} limit - Number of flights to retrieve
     * @returns {Promise<Array>} Array of arrival flights
     */
    async getArrivals(airportCode, limit = 20) {
        const cacheKey = Cache.generateFlightKey(airportCode, 'arrivals');
        
        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached) {
            console.log('📦 Using cached arrivals data');
            return cached;
        }

        try {
            const url = this.buildURL('flights', {
                arr_iata: airportCode,
                flight_status: 'active,scheduled,landed',
                limit: limit
            });

            const response = await this.request(url);
            const flights = this.formatFlightData(response.data || [], 'arrival');
            
            // Cache the results
            this.cache.set(cacheKey, flights);
            
            return flights;
        } catch (error) {
            console.error('Failed to fetch arrivals:', error);
            return this.getMockArrivals(airportCode);
        }
    }

    /**
     * Get flight departures for an airport
     * @param {string} airportCode - IATA airport code
     * @param {number} limit - Number of flights to retrieve
     * @returns {Promise<Array>} Array of departure flights
     */
    async getDepartures(airportCode, limit = 20) {
        const cacheKey = Cache.generateFlightKey(airportCode, 'departures');
        
        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached) {
            console.log('📦 Using cached departures data');
            return cached;
        }

        try {
            const url = this.buildURL('flights', {
                dep_iata: airportCode,
                flight_status: 'active,scheduled',
                limit: limit
            });

            const response = await this.request(url);
            const flights = this.formatFlightData(response.data || [], 'departure');
            
            // Cache the results
            this.cache.set(cacheKey, flights);
            
            return flights;
        } catch (error) {
            console.error('Failed to fetch departures:', error);
            return this.getMockDepartures(airportCode);
        }
    }

    /**
     * Format raw flight data for display
     * @param {Array} flights - Raw flight data from API
     * @param {string} type - 'arrival' or 'departure'
     * @returns {Array} Formatted flight data
     */
    formatFlightData(flights, type) {
        return flights.map(flight => {
            const departure = flight.departure || {};
            const arrival = flight.arrival || {};
            const airline = flight.airline || {};
            
            return {
                id: flight.flight_iata || flight.flight_icao || Math.random().toString(36),
                flightNumber: flight.flight_iata || flight.flight_icao || 'N/A',
                airline: airline.name || 'Unknown Airline',
                airlineCode: airline.iata || airline.icao || 'XX',
                
                // Origin and destination
                origin: {
                    code: departure.iata || departure.icao || 'XXX',
                    name: departure.airport || 'Unknown Airport',
                    terminal: departure.terminal || 'N/A',
                    gate: departure.gate || 'N/A'
                },
                destination: {
                    code: arrival.iata || arrival.icao || 'XXX', 
                    name: arrival.airport || 'Unknown Airport',
                    terminal: arrival.terminal || 'N/A',
                    gate: arrival.gate || 'N/A'
                },

                // Times
                scheduledTime: type === 'arrival' 
                    ? arrival.scheduled || arrival.estimated 
                    : departure.scheduled || departure.estimated,
                estimatedTime: type === 'arrival'
                    ? arrival.estimated || arrival.actual
                    : departure.estimated || departure.actual,
                actualTime: type === 'arrival' ? arrival.actual : departure.actual,

                // Status
                status: this.formatStatus(flight.flight_status),
                delay: departure.delay || arrival.delay || 0,

                // Aircraft
                aircraft: {
                    type: flight.aircraft?.type || 'Unknown',
                    registration: flight.aircraft?.registration || 'N/A'
                },

                // Additional info
                type: type,
                flightDate: flight.flight_date || new Date().toISOString().split('T')[0]
            };
        });
    }

    /**
     * Format flight status for display
     * @param {string} status - Raw status from API
     * @returns {object} Formatted status with display name and class
     */
    formatStatus(status) {
        const statusMap = {
            'scheduled': { display: 'Scheduled', class: 'on-time' },
            'active': { display: 'In Flight', class: 'boarding' },
            'landed': { display: 'Arrived', class: 'on-time' },
            'cancelled': { display: 'Cancelled', class: 'delayed' },
            'incident': { display: 'Incident', class: 'delayed' },
            'diverted': { display: 'Diverted', class: 'delayed' }
        };

        return statusMap[status] || { display: 'Unknown', class: 'on-time' };
    }

    /**
     * Get mock data for demonstration when API fails
     * @returns {object} Mock API response
     */
    getMockData() {
        return {
            data: [
                {
                    flight_iata: 'AA123',
                    airline: { name: 'American Airlines', iata: 'AA' },
                    departure: {
                        iata: 'LAX',
                        airport: 'Los Angeles International',
                        scheduled: '2023-12-07T14:30:00+00:00',
                        terminal: '4',
                        gate: '42A'
                    },
                    arrival: {
                        iata: 'JFK',
                        airport: 'John F. Kennedy International',
                        scheduled: '2023-12-07T22:45:00+00:00',
                        estimated: '2023-12-07T22:50:00+00:00',
                        terminal: '8',
                        gate: 'B12'
                    },
                    aircraft: { type: 'Boeing 737-800' },
                    flight_status: 'active'
                }
            ]
        };
    }

    /**
     * Generate mock arrivals data
     * @param {string} airportCode - Airport code
     * @returns {Array} Mock arrivals data
     */
    getMockArrivals(airportCode) {
        const mockFlights = [
            {
                id: 'AA123',
                flightNumber: 'AA123',
                airline: 'American Airlines',
                airlineCode: 'AA',
                origin: { code: 'LAX', name: 'Los Angeles International', terminal: '4', gate: '42A' },
                destination: { code: airportCode, name: this.airports[airportCode]?.name || 'Unknown Airport', terminal: '8', gate: 'B12' },
                scheduledTime: '2023-12-07T22:45:00+00:00',
                estimatedTime: '2023-12-07T22:50:00+00:00',
                status: { display: 'On Time', class: 'on-time' },
                aircraft: { type: 'Boeing 737-800', registration: 'N12345' },
                type: 'arrival'
            },
            {
                id: 'DL456',
                flightNumber: 'DL456',
                airline: 'Delta Air Lines',
                airlineCode: 'DL',
                origin: { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', terminal: 'T', gate: 'A15' },
                destination: { code: airportCode, name: this.airports[airportCode]?.name || 'Unknown Airport', terminal: '4', gate: 'C8' },
                scheduledTime: '2023-12-07T18:20:00+00:00',
                estimatedTime: '2023-12-07T18:35:00+00:00',
                status: { display: 'Delayed', class: 'delayed' },
                aircraft: { type: 'Airbus A320', registration: 'N67890' },
                type: 'arrival'
            },
            {
                id: 'UA789',
                flightNumber: 'UA789',
                airline: 'United Airlines',
                airlineCode: 'UA',
                origin: { code: 'ORD', name: "O'Hare International", terminal: '1', gate: 'B22' },
                destination: { code: airportCode, name: this.airports[airportCode]?.name || 'Unknown Airport', terminal: '7', gate: 'A5' },
                scheduledTime: '2023-12-07T16:15:00+00:00',
                estimatedTime: '2023-12-07T16:15:00+00:00',
                status: { display: 'Boarding', class: 'boarding' },
                aircraft: { type: 'Boeing 777-200', registration: 'N11111' },
                type: 'arrival'
            }
        ];

        return mockFlights;
    }

    /**
     * Generate mock departures data  
     * @param {string} airportCode - Airport code
     * @returns {Array} Mock departures data
     */
    getMockDepartures(airportCode) {
        const mockFlights = [
            {
                id: 'BA101',
                flightNumber: 'BA101',
                airline: 'British Airways',
                airlineCode: 'BA',
                origin: { code: airportCode, name: this.airports[airportCode]?.name || 'Unknown Airport', terminal: '7', gate: 'A1' },
                destination: { code: 'LHR', name: 'London Heathrow', terminal: '5', gate: '12' },
                scheduledTime: '2023-12-07T20:30:00+00:00',
                estimatedTime: '2023-12-07T20:30:00+00:00',
                status: { display: 'On Time', class: 'on-time' },
                aircraft: { type: 'Boeing 747-400', registration: 'G-ABCD' },
                type: 'departure'
            },
            {
                id: 'LH402',
                flightNumber: 'LH402',
                airline: 'Lufthansa',
                airlineCode: 'LH',
                origin: { code: airportCode, name: this.airports[airportCode]?.name || 'Unknown Airport', terminal: '1', gate: 'B15' },
                destination: { code: 'FRA', name: 'Frankfurt Airport', terminal: '1', gate: 'A23' },
                scheduledTime: '2023-12-07T23:45:00+00:00',
                estimatedTime: '2023-12-07T23:55:00+00:00',
                status: { display: 'Delayed', class: 'delayed' },
                aircraft: { type: 'Airbus A350', registration: 'D-EFGH' },
                type: 'departure'
            },
            {
                id: 'AF789',
                flightNumber: 'AF789',
                airline: 'Air France',
                airlineCode: 'AF',
                origin: { code: airportCode, name: this.airports[airportCode]?.name || 'Unknown Airport', terminal: '4', gate: 'C12' },
                destination: { code: 'CDG', name: 'Charles de Gaulle Airport', terminal: '2E', gate: 'K35' },
                scheduledTime: '2023-12-07T19:10:00+00:00',
                estimatedTime: '2023-12-07T19:10:00+00:00',
                status: { display: 'Boarding', class: 'boarding' },
                aircraft: { type: 'Boeing 787-9', registration: 'F-IJKL' },
                type: 'departure'
            }
        ];

        return mockFlights;
    }

    /**
     * Get airport information
     * @param {string} airportCode - IATA airport code
     * @returns {object} Airport information
     */
    getAirportInfo(airportCode) {
        return this.airports[airportCode] || {
            name: 'Unknown Airport',
            location: 'Unknown Location',
            iata: airportCode
        };
    }

    /**
     * Get list of available airports
     * @returns {Array} Array of airport objects
     */
    getAvailableAirports() {
        return Object.entries(this.airports).map(([code, info]) => ({
            code,
            ...info
        }));
    }
}

// Create global API instance
window.FlightAPI = new FlightAPI();

console.log('✅ Flight API module loaded');
