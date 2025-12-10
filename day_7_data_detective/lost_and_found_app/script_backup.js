// Lost & Found Detective - JavaScript Application
class LostFoundApp {
    constructor() {
        this.allItems = [];
        this.filteredItems = [];
        this.currentFilters = {
            search: '',
            category: '',
            urgency: '',
            location: '',
            day: '',
            matchesOnly: false
        };
        this.currentSort = 'urgency';
        
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.setupEventListeners();
            this.populateFilters();
            this.displayItems();
            this.updateStats();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load data. Please refresh the page.');
        }
    }

    async loadData() {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.allItems = data.items || [];
        this.metadata = data.metadata || {};
        this.filteredItems = [...this.allItems];
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value.toLowerCase().trim();
            this.applyFilters();
        });

        // Clear search button
        document.getElementById('clearSearch').addEventListener('click', () => {
            searchInput.value = '';
            this.currentFilters.search = '';
            this.applyFilters();
        });

        // Filter selects
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.applyFilters();
        });

        document.getElementById('urgencyFilter').addEventListener('change', (e) => {
            this.currentFilters.urgency = e.target.value;
            this.applyFilters();
        });

        document.getElementById('locationFilter').addEventListener('change', (e) => {
            this.currentFilters.location = e.target.value;
            this.applyFilters();
        });

        document.getElementById('dayFilter').addEventListener('change', (e) => {
            this.currentFilters.day = e.target.value;
            this.applyFilters();
        });

        // Sort select
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.sortAndDisplayItems();
        });

        // Matches only checkbox
        document.getElementById('matchesOnlyFilter').addEventListener('change', (e) => {
            this.currentFilters.matchesOnly = e.target.checked;
            this.applyFilters();
        });

        // Clear all filters button
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearAllFilters();
        });

        // Modal close handlers
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('itemModal').addEventListener('click', (e) => {
            if (e.target.id === 'itemModal') {
                this.closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    populateFilters() {
        // Populate category filter
        const categories = [...new Set(this.allItems.map(item => item.category))].sort();
        const categorySelect = document.getElementById('categoryFilter');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = this.getCategoryIcon(category) + ' ' + category;
            categorySelect.appendChild(option);
        });

        // Populate location filter
        const locations = [...new Set(this.allItems.map(item => item.location))]
            .filter(location => location && location !== 'Unknown')
            .sort();
        const locationSelect = document.getElementById('locationFilter');
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationSelect.appendChild(option);
        });
    }

    getCategoryIcon(category) {
        const icons = {
            'Electronics': '📱',
            'Clothing': '👕',
            'Keys & Wallets': '🔑',
            'Accessories': '👓',
            'Personal Items': '📚',
            'Other': '📦'
        };
        return icons[category] || '📦';
    }

    getUrgencyIcon(urgency) {
        const icons = {
            'high': '🚨',
            'medium': '⚠️',
            'low': '✅'
        };
        return icons[urgency] || '✅';
    }

    applyFilters() {
        this.filteredItems = this.allItems.filter(item => {
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search;
                const searchableText = [
                    item.item,
                    item.description,
                    item.category,
                    item.location,
                    item.original_entry
                ].join(' ').toLowerCase();
                
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            // Category filter
            if (this.currentFilters.category && item.category !== this.currentFilters.category) {
                return false;
            }

            // Urgency filter
            if (this.currentFilters.urgency && item.urgency !== this.currentFilters.urgency) {
                return false;
            }

            // Location filter
            if (this.currentFilters.location && item.location !== this.currentFilters.location) {
                return false;
            }

            // Day filter
            if (this.currentFilters.day && item.date !== this.currentFilters.day) {
                return false;
            }

            // Matches only filter
            if (this.currentFilters.matchesOnly && (!item.potential_matches || item.potential_matches.length === 0)) {
                return false;
            }

            return true;
        });

        this.sortAndDisplayItems();
        this.updateItemsTitle();
    }

    sortAndDisplayItems() {
        // Sort items
        this.filteredItems.sort((a, b) => {
            switch (this.currentSort) {
                case 'urgency':
                    const urgencyOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                    return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
                
                case 'category':
                    return a.category.localeCompare(b.category);
                
                case 'location':
                    return a.location.localeCompare(b.location);
                
                case 'item':
                    return a.item.localeCompare(b.item);
                
                case 'date':
                    return a.date.localeCompare(b.date);
                
                default:
                    return 0;
            }
        });

        this.displayItems();
    }

    displayItems() {
        const container = document.getElementById('itemsContainer');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const noResults = document.getElementById('noResults');

        // Hide loading spinner
        loadingSpinner.style.display = 'none';

        if (this.filteredItems.length === 0) {
            container.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        
        // Create item cards
        container.innerHTML = this.filteredItems.map(item => this.createItemCard(item)).join('');

        // Add click event listeners to item cards
        container.querySelectorAll('.item-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showItemDetails(this.filteredItems[index]);
            });
        });

        // Update items count
        document.getElementById('itemsCount').textContent = 
            `${this.filteredItems.length} ${this.filteredItems.length === 1 ? 'item' : 'items'}`;
    }

    createItemCard(item) {
        const hasMatches = item.potential_matches && item.potential_matches.length > 0;
        const categoryIcon = this.getCategoryIcon(item.category);
        const urgencyIcon = this.getUrgencyIcon(item.urgency);

        return `
            <div class="item-card ${item.urgency}" role="button" tabindex="0" 
                 aria-label="View details for ${item.item}">
                <div class="item-header">
                    <div class="item-name">${categoryIcon} ${this.escapeHtml(item.item)}</div>
                    <div class="urgency-badge ${item.urgency}">${urgencyIcon} ${item.urgency}</div>
                </div>
                
                <div class="item-description">
                    ${this.escapeHtml(item.description)}
                </div>
                
                <div class="item-details">
                    <div class="item-detail">
                        <i class="fas fa-layer-group" aria-hidden="true"></i>
                        <span>${item.category}</span>
                    </div>
                    
                    <div class="item-detail">
                        <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                        <span>${this.escapeHtml(item.location)}</span>
                    </div>
                    
                    <div class="item-detail">
                        <i class="fas fa-calendar" aria-hidden="true"></i>
                        <span>${item.date}${item.time ? ` at ${item.time}` : ''}</span>
                    </div>
                </div>
                
                ${hasMatches ? `
                    <div class="matches-indicator">
                        <i class="fas fa-link" aria-hidden="true"></i>
                        ${item.potential_matches.length} potential match${item.potential_matches.length > 1 ? 'es' : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }

    showItemDetails(item) {
        const modal = document.getElementById('itemModal');
        const modalBody = document.getElementById('modalBody');
        const modalTitle = document.getElementById('modalTitle');
        
        modalTitle.textContent = `${this.getCategoryIcon(item.category)} ${item.item}`;
        
        const hasMatches = item.potential_matches && item.potential_matches.length > 0;
        const matchItems = hasMatches ? this.getMatchItems(item.potential_matches) : [];
        
        modalBody.innerHTML = `
            <div class="modal-item-details">
                <div class="modal-urgency-section">
                    <div class="urgency-badge ${item.urgency}">
                        ${this.getUrgencyIcon(item.urgency)} ${item.urgency.toUpperCase()} PRIORITY
                    </div>
                </div>
                
                <div class="modal-detail-grid">
                    <div class="modal-detail-item">
                        <strong><i class="fas fa-layer-group"></i> Category:</strong>
                        <span>${item.category}</span>
                    </div>
                    
                    <div class="modal-detail-item">
                        <strong><i class="fas fa-map-marker-alt"></i> Location:</strong>
                        <span>${this.escapeHtml(item.location)}</span>
                    </div>
                    
                    <div class="modal-detail-item">
                        <strong><i class="fas fa-calendar"></i> Day:</strong>
                        <span>${item.date} - ${item.day_title}</span>
                    </div>
                    
                    ${item.time ? `
                        <div class="modal-detail-item">
                            <strong><i class="fas fa-clock"></i> Time:</strong>
                            <span>${item.time}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="modal-section">
                    <h4><i class="fas fa-info-circle"></i> Description</h4>
                    <p class="modal-description">${this.escapeHtml(item.description)}</p>
                </div>
                
                <div class="modal-section">
                    <h4><i class="fas fa-file-alt"></i> Original Entry</h4>
                    <p class="modal-original">${this.escapeHtml(item.original_entry)}</p>
                </div>
                
                ${hasMatches ? `
                    <div class="modal-section matches-section">
                        <h4><i class="fas fa-link"></i> Potential Matches (${item.potential_matches.length})</h4>
                        <div class="matches-grid">
                            ${matchItems.map(matchItem => `
                                <div class="match-card">
                                    <div class="match-header">
                                        <strong>${this.getCategoryIcon(matchItem.category)} ${this.escapeHtml(matchItem.item)}</strong>
                                        <span class="urgency-badge ${matchItem.urgency}">${matchItem.urgency}</span>
                                    </div>
                                    <p class="match-description">${this.escapeHtml(matchItem.description)}</p>
                                    <div class="match-location">
                                        <i class="fas fa-map-marker-alt"></i> ${this.escapeHtml(matchItem.location)}
                                        <span class="match-day">${matchItem.date}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : `
                    <div class="modal-section">
                        <h4><i class="fas fa-search"></i> No Potential Matches</h4>
                        <p class="no-matches">No similar items found in the database.</p>
                    </div>
                `}
                
                <div class="modal-actions">
                    <button class="action-btn primary" onclick="navigator.share ? navigator.share({title: 'Lost Item: ${this.escapeHtml(item.item)}', text: '${this.escapeHtml(item.description)}'}) : alert('Item details copied to clipboard!')">
                        <i class="fas fa-share"></i> Share Item
                    </button>
                    <button class="action-btn secondary" onclick="window.print()">
                        <i class="fas fa-print"></i> Print Details
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus management for accessibility
        const closeButton = modal.querySelector('.modal-close');
        closeButton.focus();
    }

    getMatchItems(matchIds) {
        return matchIds.map(id => this.allItems.find(item => item.id === id)).filter(Boolean);
    }

    closeModal() {
        const modal = document.getElementById('itemModal');
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    updateStats() {
        document.getElementById('totalItems').textContent = this.allItems.length;
        
        const urgentCount = this.allItems.filter(item => item.urgency === 'high').length;
        document.getElementById('urgentItems').textContent = urgentCount;
        
        const matchCount = this.allItems.filter(item => 
            item.potential_matches && item.potential_matches.length > 0
        ).length;
        document.getElementById('matchItems').textContent = matchCount;
        
        const locations = [...new Set(this.allItems.map(item => item.location))].length;
        document.getElementById('locationCount').textContent = locations;
    }

    updateItemsTitle() {
        const title = document.getElementById('itemsTitle');
        const activeFilters = [];
        
        if (this.currentFilters.search) activeFilters.push('Search Results');
        if (this.currentFilters.category) activeFilters.push(this.currentFilters.category);
        if (this.currentFilters.urgency) activeFilters.push(`${this.currentFilters.urgency} Priority`);
        if (this.currentFilters.location) activeFilters.push(this.currentFilters.location);
        if (this.currentFilters.day) activeFilters.push(this.currentFilters.day);
        if (this.currentFilters.matchesOnly) activeFilters.push('With Matches');
        
        title.textContent = activeFilters.length > 0 ? activeFilters.join(' • ') : 'All Items';
    }

    clearAllFilters() {
        // Reset all filters
        this.currentFilters = {
            search: '',
            category: '',
            urgency: '',
            location: '',
            day: '',
            matchesOnly: false
        };
        
        // Reset form elements
        document.getElementById('searchInput').value = '';
        document.getElementById('categoryFilter').value = '';
        document.getElementById('urgencyFilter').value = '';
        document.getElementById('locationFilter').value = '';
        document.getElementById('dayFilter').value = '';
        document.getElementById('matchesOnlyFilter').checked = false;
        document.getElementById('sortSelect').value = 'urgency';
        
        this.currentSort = 'urgency';
        this.applyFilters();
    }

    showError(message) {
        const container = document.getElementById('itemsContainer');
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--urgent-red); margin-bottom: 1rem;"></i>
                <h3>Oops! Something went wrong</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="action-btn primary" style="margin-top: 1rem;">
                    <i class="fas fa-refresh"></i> Try Again
                </button>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Additional modal styles for better presentation
const additionalStyles = `
<style>
.modal-item-details {
    display: grid;
    gap: var(--spacing-lg);
}

.modal-urgency-section {
    display: flex;
    justify-content: center;
}

.modal-detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
}

.modal-detail-item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.modal-detail-item strong {
    color: var(--winter-blue);
    font-size: var(--font-size-sm);
}

.modal-section {
    border-top: 2px solid var(--ice-blue);
    padding-top: var(--spacing-lg);
}

.modal-section h4 {
    color: var(--text-dark);
    margin-bottom: var(--spacing-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.modal-description, .modal-original {
    background: var(--primary-blue);
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
    line-height: 1.6;
}

.matches-section {
    background: linear-gradient(135deg, rgba(255, 152, 0, 0.05), rgba(255, 193, 7, 0.05));
    padding: var(--spacing-lg);
    border-radius: var(--border-radius);
    border: 2px solid var(--medium-orange);
}

.matches-grid {
    display: grid;
    gap: var(--spacing-md);
}

.match-card {
    background: var(--snow-white);
    border: 2px solid var(--ice-blue);
    border-radius: var(--border-radius);
    padding: var(--spacing-md);
    transition: var(--transition);
}

.match-card:hover {
    border-color: var(--medium-orange);
    transform: translateY(-2px);
}

.match-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-sm);
}

.match-description {
    font-size: var(--font-size-sm);
    color: var(--text-light);
    margin-bottom: var(--spacing-sm);
}

.match-location {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-xs);
    color: var(--text-light);
}

.match-day {
    background: var(--primary-blue);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    font-weight: 500;
}

.modal-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    padding-top: var(--spacing-lg);
    border-top: 2px solid var(--ice-blue);
}

.action-btn {
    padding: var(--spacing-sm) var(--spacing-lg);
    border: none;
    border-radius: var(--border-radius);
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    transition: var(--transition);
}

.action-btn.primary {
    background: var(--winter-blue);
    color: var(--snow-white);
}

.action-btn.primary:hover {
    background: var(--deep-blue);
    transform: translateY(-2px);
}

.action-btn.secondary {
    background: var(--ice-blue);
    color: var(--text-dark);
}

.action-btn.secondary:hover {
    background: var(--primary-blue);
    transform: translateY(-2px);
}

.no-matches {
    text-align: center;
    color: var(--text-light);
    font-style: italic;
    padding: var(--spacing-lg);
}

.error-state {
    text-align: center;
    padding: var(--spacing-xxl);
    color: var(--text-light);
}

.error-state h3 {
    color: var(--text-dark);
    margin-bottom: var(--spacing-sm);
}

@media (max-width: 768px) {
    .modal-detail-grid {
        grid-template-columns: 1fr;
    }
    
    .modal-actions {
        flex-direction: column;
    }
    
    .match-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-xs);
    }
}
</style>
`;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add additional styles
    document.head.insertAdjacentHTML('beforeend', additionalStyles);
    
    // Initialize the app
    new LostFoundApp();
    
    // Add winter effect (optional)
    if (Math.random() > 0.7) { // 30% chance for snow effect
        addSnowEffect();
    }
});

// Optional: Winter snow effect
function addSnowEffect() {
    const snowContainer = document.createElement('div');
    snowContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    
    // Create snowflakes
    for (let i = 0; i < 20; i++) {
        const snowflake = document.createElement('div');
        snowflake.innerHTML = '❄';
        snowflake.style.cssText = `
            position: absolute;
            color: rgba(255, 255, 255, 0.8);
            font-size: ${Math.random() * 10 + 10}px;
            top: -50px;
            left: ${Math.random() * 100}%;
            animation: snow ${Math.random() * 3 + 2}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        snowContainer.appendChild(snowflake);
    }
    
    // Add snow animation CSS
    const snowStyles = document.createElement('style');
    snowStyles.textContent = `
        @keyframes snow {
            to {
                transform: translateY(100vh) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(snowStyles);
    document.body.appendChild(snowContainer);
}
