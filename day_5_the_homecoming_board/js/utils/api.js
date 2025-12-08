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
        
        // Airports will be loaded from API
        this.airports = [];
        this.airportsLoaded = false;

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
     * Get airports from API
     * @param {number} limit - Number of airports to retrieve
     * @returns {Promise<Array>} Array of airport objects
     */
    async getAirports(limit = 100) {
        const cacheKey = 'airports_list';
        
        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached && this.airportsLoaded) {
            console.log('📦 Using cached airports data');
            return cached;
        }

        try {
            const url = this.buildURL('airports', { limit: limit });
            console.log('🛫 Fetching airports from:', url);

            const response = await this.request(url);
            const airports = this.formatAirportsData(response.data || []);
            
            // Cache the results
            this.cache.set(cacheKey, airports);
            this.airports = airports;
            this.airportsLoaded = true;
            
            console.log(`✅ Loaded ${airports.length} airports from API`);
            return airports;
        } catch (error) {
            console.error('Failed to fetch airports:', error);
            const mockAirports = this.getMockAirports();
            this.airports = mockAirports;
            this.airportsLoaded = true;
            return mockAirports;
        }
    }

    /**
     * Get flight arrivals for an airport using timetable endpoint
     * @param {string} airportCode - IATA airport code
     * @param {number} limit - Number of flights to retrieve
     * @returns {Promise<Array>} Array of arrival flights
     */
    async getArrivals(airportCode, limit = 50) {
        const cacheKey = Cache.generateFlightKey(airportCode, 'arrivals');
        
        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached) {
            console.log('📦 Using cached arrivals data');
            return cached;
        }

        try {
            const url = this.buildURL('timetable', {
                iataCode: airportCode,
                type: 'arrival',
                limit: limit
            });

            console.log('🛬 Fetching arrivals from:', url);
            const response = await this.request(url);
            const flights = this.formatTimetableData(response.data || [], 'arrival');
            
            // Cache the results
            this.cache.set(cacheKey, flights);
            
            console.log(`✅ Loaded ${flights.length} arrivals for ${airportCode}`);
            return flights;
        } catch (error) {
            console.error('Failed to fetch arrivals:', error);
            return this.getMockArrivals(airportCode);
        }
    }

    /**
     * Get flight departures for an airport using timetable endpoint
     * @param {string} airportCode - IATA airport code
     * @param {number} limit - Number of flights to retrieve
     * @returns {Promise<Array>} Array of departure flights
     */
    async getDepartures(airportCode, limit = 50) {
        const cacheKey = Cache.generateFlightKey(airportCode, 'departures');
        
        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached) {
            console.log('📦 Using cached departures data');
            return cached;
        }

        try {
            const url = this.buildURL('timetable', {
                iataCode: airportCode,
                type: 'departure',
                limit: limit
            });

            console.log('🛫 Fetching departures from:', url);
            const response = await this.request(url);
            const flights = this.formatTimetableData(response.data || [], 'departure');
            
            // Cache the results
            this.cache.set(cacheKey, flights);
            
            console.log(`✅ Loaded ${flights.length} departures for ${airportCode}`);
            return flights;
        } catch (error) {
            console.error('Failed to fetch departures:', error);
            return this.getMockDepartures(airportCode);
        }
    }

    /**
     * Format airports data from API response
     * @param {Array} airports - Raw airports data from API
     * @returns {Array} Formatted airports data
     */
    formatAirportsData(airports) {
        return airports.map(airport => ({
            code: airport.iata_code || airport.icao_code || 'XXX',
            iata: airport.iata_code || airport.icao_code || 'XXX',
            name: airport.airport_name || 'Unknown Airport',
            location: `${airport.city_name || 'Unknown'}, ${airport.country_name || 'Unknown'}`,
            country: airport.country_name || 'Unknown',
            city: airport.city_name || 'Unknown',
            timezone: airport.timezone || 'UTC'
        })).filter(airport => airport.code && airport.code !== 'XXX');
    }

    /**
     * Format timetable data from API response  
     * @param {Array} flights - Raw timetable data from API
     * @param {string} type - 'arrival' or 'departure'
     * @returns {Array} Formatted flight data
     */
    formatTimetableData(flights, type) {
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
     * Format raw flight data for display (legacy method)
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
        const currentTime = new Date();
        const mockFlights = [
            {
                id: 'AA123',
                flightNumber: 'AA123',
                airline: 'American Airlines',
                airlineCode: 'AA',
                origin: { code: 'LAX', name: 'Los Angeles International', terminal: '4', gate: '42A' },
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '8', gate: 'B12' },
                scheduledTime: new Date(currentTime.getTime() + 1 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 1.1 * 60 * 60 * 1000).toISOString(),
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
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '4', gate: 'C8' },
                scheduledTime: new Date(currentTime.getTime() + 0.5 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 0.75 * 60 * 60 * 1000).toISOString(),
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
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '7', gate: 'A5' },
                scheduledTime: new Date(currentTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Boarding', class: 'boarding' },
                aircraft: { type: 'Boeing 777-200', registration: 'N11111' },
                type: 'arrival'
            },
            {
                id: 'SW201',
                flightNumber: 'SW201',
                airline: 'Southwest Airlines',
                airlineCode: 'WN',
                origin: { code: 'PHX', name: 'Phoenix Sky Harbor', terminal: '4', gate: 'A12' },
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '1', gate: 'B5' },
                scheduledTime: new Date(currentTime.getTime() + 3 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 3 * 60 * 60 * 1000).toISOString(),
                status: { display: 'On Time', class: 'on-time' },
                aircraft: { type: 'Boeing 737-700', registration: 'N734SW' },
                type: 'arrival'
            },
            {
                id: 'AC567',
                flightNumber: 'AC567',
                airline: 'Air Canada',
                airlineCode: 'AC',
                origin: { code: 'YYZ', name: 'Toronto Pearson', terminal: '1', gate: 'D15' },
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '5', gate: 'A8' },
                scheduledTime: new Date(currentTime.getTime() + 4 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 4.2 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Delayed', class: 'delayed' },
                aircraft: { type: 'Airbus A321', registration: 'C-GJVX' },
                type: 'arrival'
            },
            {
                id: 'JB892',
                flightNumber: 'JB892',
                airline: 'JetBlue Airways',
                airlineCode: 'B6',
                origin: { code: 'BOS', name: 'Boston Logan', terminal: 'C', gate: '5' },
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '5', gate: 'B24' },
                scheduledTime: new Date(currentTime.getTime() + 1.5 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 1.5 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Boarding', class: 'boarding' },
                aircraft: { type: 'Airbus A320', registration: 'N615JB' },
                type: 'arrival'
            },
            {
                id: 'AS334',
                flightNumber: 'AS334',
                airline: 'Alaska Airlines',
                airlineCode: 'AS',
                origin: { code: 'SEA', name: 'Seattle-Tacoma', terminal: 'N', gate: '8' },
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '6', gate: 'C15' },
                scheduledTime: new Date(currentTime.getTime() + 5 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 5 * 60 * 60 * 1000).toISOString(),
                status: { display: 'On Time', class: 'on-time' },
                aircraft: { type: 'Boeing 737-900', registration: 'N493AS' },
                type: 'arrival'
            },
            {
                id: 'F9789',
                flightNumber: 'F9789',
                airline: 'Frontier Airlines',
                airlineCode: 'F9',
                origin: { code: 'DEN', name: 'Denver International', terminal: 'A', gate: '23' },
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '3', gate: 'A18' },
                scheduledTime: new Date(currentTime.getTime() + 6 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 6.3 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Delayed', class: 'delayed' },
                aircraft: { type: 'Airbus A320neo', registration: 'N301FR' },
                type: 'arrival'
            },
            // Additional arrivals to ensure complete lists
            {
                id: 'NH211',
                flightNumber: 'NH211',
                airline: 'ANA',
                airlineCode: 'NH',
                origin: { code: 'NRT', name: 'Tokyo Narita', terminal: '1', gate: '11' },
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '2', gate: 'D3' },
                scheduledTime: new Date(currentTime.getTime() + 7 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 7.2 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Delayed', class: 'delayed' },
                aircraft: { type: 'Boeing 787-8', registration: 'JA801A' },
                type: 'arrival'
            },
            {
                id: 'KL642',
                flightNumber: 'KL642',
                airline: 'KLM',
                airlineCode: 'KL',
                origin: { code: 'AMS', name: 'Amsterdam Schiphol', terminal: '3', gate: 'D12' },
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '4', gate: 'B8' },
                scheduledTime: new Date(currentTime.getTime() + 8 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 8 * 60 * 60 * 1000).toISOString(),
                status: { display: 'On Time', class: 'on-time' },
                aircraft: { type: 'Boeing 777-200ER', registration: 'PH-BQA' },
                type: 'arrival'
            },
            {
                id: 'TK1',
                flightNumber: 'TK1',
                airline: 'Turkish Airlines',
                airlineCode: 'TK',
                origin: { code: 'IST', name: 'Istanbul Airport', terminal: '1', gate: 'A1' },
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '1', gate: 'A12' },
                scheduledTime: new Date(currentTime.getTime() + 9 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 9 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Boarding', class: 'boarding' },
                aircraft: { type: 'Airbus A350-900', registration: 'TC-LGA' },
                type: 'arrival'
            },
            {
                id: 'SK925',
                flightNumber: 'SK925',
                airline: 'SAS',
                airlineCode: 'SK',
                origin: { code: 'CPH', name: 'Copenhagen Airport', terminal: '3', gate: 'A15' },
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '5', gate: 'C22' },
                scheduledTime: new Date(currentTime.getTime() + 10 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 10.5 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Delayed', class: 'delayed' },
                aircraft: { type: 'Airbus A320neo', registration: 'SE-ROH' },
                type: 'arrival'
            },
            {
                id: 'AZ611',
                flightNumber: 'AZ611',
                airline: 'Alitalia',
                airlineCode: 'AZ',
                origin: { code: 'FCO', name: 'Rome Fiumicino', terminal: '3', gate: 'B7' },
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '1', gate: 'A20' },
                scheduledTime: new Date(currentTime.getTime() + 11 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 11 * 60 * 60 * 1000).toISOString(),
                status: { display: 'On Time', class: 'on-time' },
                aircraft: { type: 'Airbus A330-200', registration: 'EI-EJG' },
                type: 'arrival'
            },
            {
                id: 'LX18',
                flightNumber: 'LX18',
                airline: 'Swiss International',
                airlineCode: 'LX',
                origin: { code: 'ZUR', name: 'Zurich Airport', terminal: '2', gate: 'A18' },
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '2', gate: 'B15' },
                scheduledTime: new Date(currentTime.getTime() + 12 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 12.3 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Delayed', class: 'delayed' },
                aircraft: { type: 'Airbus A340-300', registration: 'HB-JMG' },
                type: 'arrival'
            },
            {
                id: 'OS90',
                flightNumber: 'OS90',
                airline: 'Austrian Airlines',
                airlineCode: 'OS',
                origin: { code: 'VIE', name: 'Vienna International', terminal: '3', gate: 'F12' },
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '3', gate: 'C8' },
                scheduledTime: new Date(currentTime.getTime() + 13 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 13 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Boarding', class: 'boarding' },
                aircraft: { type: 'Boeing 777-200ER', registration: 'OE-LPD' },
                type: 'arrival'
            },
            {
                id: 'IB6250',
                flightNumber: 'IB6250',
                airline: 'Iberia',
                airlineCode: 'IB',
                origin: { code: 'MAD', name: 'Madrid-Barajas', terminal: '4', gate: 'R12' },
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '7', gate: 'A25' },
                scheduledTime: new Date(currentTime.getTime() + 14 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 14.1 * 60 * 60 * 1000).toISOString(),
                status: { display: 'On Time', class: 'on-time' },
                aircraft: { type: 'Airbus A350-900', registration: 'EC-MYX' },
                type: 'arrival'
            },
            {
                id: 'TP203',
                flightNumber: 'TP203',
                airline: 'TAP Air Portugal',
                airlineCode: 'TP',
                origin: { code: 'LIS', name: 'Lisbon Airport', terminal: '1', gate: '15' },
                destination: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '4', gate: 'D12' },
                scheduledTime: new Date(currentTime.getTime() + 15 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 15.5 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Delayed', class: 'delayed' },
                aircraft: { type: 'Airbus A330-900neo', registration: 'CS-TUA' },
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
        const currentTime = new Date();
        const mockFlights = [
            {
                id: 'BA101',
                flightNumber: 'BA101',
                airline: 'British Airways',
                airlineCode: 'BA',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '7', gate: 'A1' },
                destination: { code: 'LHR', name: 'London Heathrow', terminal: '5', gate: '12' },
                scheduledTime: new Date(currentTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
                status: { display: 'On Time', class: 'on-time' },
                aircraft: { type: 'Boeing 747-400', registration: 'G-ABCD' },
                type: 'departure'
            },
            {
                id: 'LH402',
                flightNumber: 'LH402',
                airline: 'Lufthansa',
                airlineCode: 'LH',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '1', gate: 'B15' },
                destination: { code: 'FRA', name: 'Frankfurt Airport', terminal: '1', gate: 'A23' },
                scheduledTime: new Date(currentTime.getTime() + 4 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 4.25 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Delayed', class: 'delayed' },
                aircraft: { type: 'Airbus A350', registration: 'D-EFGH' },
                type: 'departure'
            },
            {
                id: 'AF789',
                flightNumber: 'AF789',
                airline: 'Air France',
                airlineCode: 'AF',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '4', gate: 'C12' },
                destination: { code: 'CDG', name: 'Charles de Gaulle Airport', terminal: '2E', gate: 'K35' },
                scheduledTime: new Date(currentTime.getTime() + 1 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 1 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Boarding', class: 'boarding' },
                aircraft: { type: 'Boeing 787-9', registration: 'F-IJKL' },
                type: 'departure'
            },
            {
                id: 'EK205',
                flightNumber: 'EK205',
                airline: 'Emirates',
                airlineCode: 'EK',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '3', gate: 'B8' },
                destination: { code: 'DXB', name: 'Dubai International', terminal: '3', gate: 'A15' },
                scheduledTime: new Date(currentTime.getTime() + 5 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 5 * 60 * 60 * 1000).toISOString(),
                status: { display: 'On Time', class: 'on-time' },
                aircraft: { type: 'Airbus A380', registration: 'A6-EUA' },
                type: 'departure'
            },
            {
                id: 'QR743',
                flightNumber: 'QR743',
                airline: 'Qatar Airways',
                airlineCode: 'QR',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '8', gate: 'A12' },
                destination: { code: 'DOH', name: 'Hamad International', terminal: '1', gate: 'D5' },
                scheduledTime: new Date(currentTime.getTime() + 3 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 3.5 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Delayed', class: 'delayed' },
                aircraft: { type: 'Boeing 777-300ER', registration: 'A7-BEX' },
                type: 'departure'
            },
            {
                id: 'VS45',
                flightNumber: 'VS45',
                airline: 'Virgin Atlantic',
                airlineCode: 'VS',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '4', gate: 'A7' },
                destination: { code: 'LGW', name: 'London Gatwick', terminal: 'S', gate: '101' },
                scheduledTime: new Date(currentTime.getTime() + 6 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 6 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Boarding', class: 'boarding' },
                aircraft: { type: 'Boeing 787-9', registration: 'G-VZIG' },
                type: 'departure'
            },
            {
                id: 'SQ26',
                flightNumber: 'SQ26',
                airline: 'Singapore Airlines',
                airlineCode: 'SQ',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '4', gate: 'B20' },
                destination: { code: 'SIN', name: 'Singapore Changi', terminal: '3', gate: 'A8' },
                scheduledTime: new Date(currentTime.getTime() + 7 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 7 * 60 * 60 * 1000).toISOString(),
                status: { display: 'On Time', class: 'on-time' },
                aircraft: { type: 'Airbus A350-900', registration: '9V-SMC' },
                type: 'departure'
            },
            {
                id: 'CX831',
                flightNumber: 'CX831',
                airline: 'Cathay Pacific',
                airlineCode: 'CX',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '8', gate: 'B18' },
                destination: { code: 'HKG', name: 'Hong Kong International', terminal: '1', gate: '15' },
                scheduledTime: new Date(currentTime.getTime() + 8 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 8.3 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Delayed', class: 'delayed' },
                aircraft: { type: 'Boeing 777-300', registration: 'B-KQA' },
                type: 'departure'
            },
            // Additional departures to ensure complete lists
            {
                id: 'AA142',
                flightNumber: 'AA142',
                airline: 'American Airlines',
                airlineCode: 'AA',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '8', gate: 'B15' },
                destination: { code: 'MIA', name: 'Miami International', terminal: 'S', gate: 'D8' },
                scheduledTime: new Date(currentTime.getTime() + 9 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 9 * 60 * 60 * 1000).toISOString(),
                status: { display: 'On Time', class: 'on-time' },
                aircraft: { type: 'Boeing 737-800', registration: 'N823NN' },
                type: 'departure'
            },
            {
                id: 'UA456',
                flightNumber: 'UA456',
                airline: 'United Airlines',
                airlineCode: 'UA',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '7', gate: 'A22' },
                destination: { code: 'SFO', name: 'San Francisco International', terminal: '3', gate: 'F12' },
                scheduledTime: new Date(currentTime.getTime() + 10 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 10.2 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Delayed', class: 'delayed' },
                aircraft: { type: 'Airbus A320', registration: 'N418UA' },
                type: 'departure'
            },
            {
                id: 'DL789',
                flightNumber: 'DL789',
                airline: 'Delta Air Lines',
                airlineCode: 'DL',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '4', gate: 'C18' },
                destination: { code: 'BOS', name: 'Boston Logan International', terminal: 'A', gate: '12' },
                scheduledTime: new Date(currentTime.getTime() + 11 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 11 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Boarding', class: 'boarding' },
                aircraft: { type: 'Boeing 757-200', registration: 'N6716C' },
                type: 'departure'
            },
            {
                id: 'WN234',
                flightNumber: 'WN234',
                airline: 'Southwest Airlines',
                airlineCode: 'WN',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '1', gate: 'B8' },
                destination: { code: 'MDW', name: 'Chicago Midway', terminal: '1', gate: 'A5' },
                scheduledTime: new Date(currentTime.getTime() + 12 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 12 * 60 * 60 * 1000).toISOString(),
                status: { display: 'On Time', class: 'on-time' },
                aircraft: { type: 'Boeing 737-700', registration: 'N234WN' },
                type: 'departure'
            },
            {
                id: 'B6892',
                flightNumber: 'B6892',
                airline: 'JetBlue Airways',
                airlineCode: 'B6',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '5', gate: 'B24' },
                destination: { code: 'MCO', name: 'Orlando International', terminal: 'B', gate: '35' },
                scheduledTime: new Date(currentTime.getTime() + 13 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 13.3 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Delayed', class: 'delayed' },
                aircraft: { type: 'Airbus A321', registration: 'N965JB' },
                type: 'departure'
            },
            {
                id: 'AS567',
                flightNumber: 'AS567',
                airline: 'Alaska Airlines',
                airlineCode: 'AS',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '6', gate: 'C15' },
                destination: { code: 'PDX', name: 'Portland International', terminal: 'C', gate: '4' },
                scheduledTime: new Date(currentTime.getTime() + 14 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 14 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Boarding', class: 'boarding' },
                aircraft: { type: 'Boeing 737-900', registration: 'N267AK' },
                type: 'departure'
            },
            {
                id: 'F9321',
                flightNumber: 'F9321',
                airline: 'Frontier Airlines',
                airlineCode: 'F9',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '3', gate: 'A18' },
                destination: { code: 'LAS', name: 'Las Vegas McCarran', terminal: '3', gate: 'D12' },
                scheduledTime: new Date(currentTime.getTime() + 15 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 15.2 * 60 * 60 * 1000).toISOString(),
                status: { display: 'On Time', class: 'on-time' },
                aircraft: { type: 'Airbus A320neo', registration: 'N321FR' },
                type: 'departure'
            },
            {
                id: 'NK456',
                flightNumber: 'NK456',
                airline: 'Spirit Airlines',
                airlineCode: 'NK',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '4', gate: 'A9' },
                destination: { code: 'FLL', name: 'Fort Lauderdale', terminal: '4', gate: 'A23' },
                scheduledTime: new Date(currentTime.getTime() + 16 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 16.5 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Delayed', class: 'delayed' },
                aircraft: { type: 'Airbus A319', registration: 'N523NK' },
                type: 'departure'
            },
            {
                id: 'G4123',
                flightNumber: 'G4123',
                airline: 'Allegiant Air',
                airlineCode: 'G4',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '2', gate: 'B12' },
                destination: { code: 'PIE', name: 'St. Pete-Clearwater', terminal: '1', gate: '3' },
                scheduledTime: new Date(currentTime.getTime() + 17 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 17 * 60 * 60 * 1000).toISOString(),
                status: { display: 'Boarding', class: 'boarding' },
                aircraft: { type: 'Airbus A320', registration: 'N223NV' },
                type: 'departure'
            },
            {
                id: 'SY789',
                flightNumber: 'SY789',
                airline: 'Sun Country Airlines',
                airlineCode: 'SY',
                origin: { code: airportCode, name: this.getAirportInfo(airportCode).name || 'Unknown Airport', terminal: '1', gate: 'C5' },
                destination: { code: 'MSP', name: 'Minneapolis-St. Paul', terminal: '2', gate: 'G8' },
                scheduledTime: new Date(currentTime.getTime() + 18 * 60 * 60 * 1000).toISOString(),
                estimatedTime: new Date(currentTime.getTime() + 18.1 * 60 * 60 * 1000).toISOString(),
                status: { display: 'On Time', class: 'on-time' },
                aircraft: { type: 'Boeing 737-800', registration: 'N815SY' },
                type: 'departure'
            }
        ];

        return mockFlights;
    }

    /**
     * Get mock airports for fallback
     * @returns {Array} Mock airports data
     */
    getMockAirports() {
        return [
            { code: 'JFK', iata: 'JFK', name: 'John F. Kennedy International', location: 'New York, NY', country: 'United States', city: 'New York' },
            { code: 'LAX', iata: 'LAX', name: 'Los Angeles International', location: 'Los Angeles, CA', country: 'United States', city: 'Los Angeles' },
            { code: 'ORD', iata: 'ORD', name: "O'Hare International", location: 'Chicago, IL', country: 'United States', city: 'Chicago' },
            { code: 'ATL', iata: 'ATL', name: 'Hartsfield-Jackson Atlanta International', location: 'Atlanta, GA', country: 'United States', city: 'Atlanta' },
            { code: 'DFW', iata: 'DFW', name: 'Dallas/Fort Worth International', location: 'Dallas, TX', country: 'United States', city: 'Dallas' },
            { code: 'DEN', iata: 'DEN', name: 'Denver International', location: 'Denver, CO', country: 'United States', city: 'Denver' },
            { code: 'PHX', iata: 'PHX', name: 'Phoenix Sky Harbor International', location: 'Phoenix, AZ', country: 'United States', city: 'Phoenix' },
            { code: 'LAS', iata: 'LAS', name: 'McCarran International', location: 'Las Vegas, NV', country: 'United States', city: 'Las Vegas' },
            { code: 'SEA', iata: 'SEA', name: 'Seattle-Tacoma International', location: 'Seattle, WA', country: 'United States', city: 'Seattle' },
            { code: 'BOS', iata: 'BOS', name: 'Logan International', location: 'Boston, MA', country: 'United States', city: 'Boston' },
            { code: 'SFO', iata: 'SFO', name: 'San Francisco International', location: 'San Francisco, CA', country: 'United States', city: 'San Francisco' },
            { code: 'MIA', iata: 'MIA', name: 'Miami International', location: 'Miami, FL', country: 'United States', city: 'Miami' },
            { code: 'MCO', iata: 'MCO', name: 'Orlando International', location: 'Orlando, FL', country: 'United States', city: 'Orlando' },
            { code: 'LHR', iata: 'LHR', name: 'London Heathrow', location: 'London, United Kingdom', country: 'United Kingdom', city: 'London' },
            { code: 'CDG', iata: 'CDG', name: 'Charles de Gaulle', location: 'Paris, France', country: 'France', city: 'Paris' },
            { code: 'FRA', iata: 'FRA', name: 'Frankfurt Airport', location: 'Frankfurt, Germany', country: 'Germany', city: 'Frankfurt' },
            { code: 'AMS', iata: 'AMS', name: 'Amsterdam Schiphol', location: 'Amsterdam, Netherlands', country: 'Netherlands', city: 'Amsterdam' },
            { code: 'DXB', iata: 'DXB', name: 'Dubai International', location: 'Dubai, UAE', country: 'United Arab Emirates', city: 'Dubai' },
            { code: 'DOH', iata: 'DOH', name: 'Hamad International', location: 'Doha, Qatar', country: 'Qatar', city: 'Doha' },
            { code: 'NRT', iata: 'NRT', name: 'Tokyo Narita', location: 'Tokyo, Japan', country: 'Japan', city: 'Tokyo' },
            { code: 'HKG', iata: 'HKG', name: 'Hong Kong International', location: 'Hong Kong', country: 'Hong Kong', city: 'Hong Kong' },
            { code: 'SIN', iata: 'SIN', name: 'Singapore Changi', location: 'Singapore', country: 'Singapore', city: 'Singapore' },
            { code: 'YYZ', iata: 'YYZ', name: 'Toronto Pearson', location: 'Toronto, ON', country: 'Canada', city: 'Toronto' }
        ];
    }

    /**
     * Get airport information by code
     * @param {string} airportCode - IATA airport code
     * @returns {object} Airport information
     */
    getAirportInfo(airportCode) {
        const airport = this.airports.find(a => a.code === airportCode || a.iata === airportCode);
        return airport || {
            name: 'Unknown Airport',
            location: 'Unknown Location',
            iata: airportCode,
            code: airportCode
        };
    }

    /**
     * Get list of available airports
     * @returns {Promise<Array>} Array of airport objects
     */
    async getAvailableAirports() {
        if (!this.airportsLoaded) {
            await this.getAirports();
        }
        return this.airports;
    }
}

// Create global API instance
window.FlightAPI = new FlightAPI();

console.log('✅ Flight API module loaded');
