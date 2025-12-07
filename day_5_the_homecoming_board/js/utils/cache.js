/**
 * Cache utility for storing API responses and avoiding rate limits
 * Provides in-memory caching with expiration times
 */

class Cache {
    constructor() {
        this.storage = new Map();
        this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
    }

    /**
     * Store data in cache with optional TTL
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     * @param {number} ttl - Time to live in milliseconds (optional)
     */
    set(key, data, ttl = this.defaultTTL) {
        const item = {
            data,
            timestamp: Date.now(),
            ttl
        };
        this.storage.set(key, item);
    }

    /**
     * Retrieve data from cache
     * @param {string} key - Cache key
     * @returns {any|null} Cached data or null if expired/not found
     */
    get(key) {
        const item = this.storage.get(key);
        
        if (!item) {
            return null;
        }

        const now = Date.now();
        const isExpired = (now - item.timestamp) > item.ttl;

        if (isExpired) {
            this.storage.delete(key);
            return null;
        }

        return item.data;
    }

    /**
     * Check if a key exists and is not expired
     * @param {string} key - Cache key
     * @returns {boolean} True if key exists and is valid
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * Remove item from cache
     * @param {string} key - Cache key
     */
    delete(key) {
        this.storage.delete(key);
    }

    /**
     * Clear all cached items
     */
    clear() {
        this.storage.clear();
    }

    /**
     * Clean up expired items
     */
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.storage.entries()) {
            const isExpired = (now - item.timestamp) > item.ttl;
            if (isExpired) {
                this.storage.delete(key);
            }
        }
    }

    /**
     * Get cache statistics
     * @returns {object} Cache stats
     */
    getStats() {
        const now = Date.now();
        let valid = 0;
        let expired = 0;

        for (const [key, item] of this.storage.entries()) {
            const isExpired = (now - item.timestamp) > item.ttl;
            if (isExpired) {
                expired++;
            } else {
                valid++;
            }
        }

        return {
            total: this.storage.size,
            valid,
            expired
        };
    }

    /**
     * Generate cache key for flight data
     * @param {string} airport - Airport code
     * @param {string} type - 'arrivals' or 'departures'
     * @returns {string} Cache key
     */
    static generateFlightKey(airport, type) {
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        return `flights:${airport}:${type}:${date}`;
    }

    /**
     * Generate cache key for airport data
     * @param {string} airport - Airport code
     * @returns {string} Cache key
     */
    static generateAirportKey(airport) {
        return `airport:${airport}`;
    }
}

// Create global cache instance
window.FlightCache = new Cache();

// Clean up expired items every 10 minutes
setInterval(() => {
    window.FlightCache.cleanup();
}, 10 * 60 * 1000);

console.log('✅ Cache utility loaded');
