// Enhanced Lost & Found Detective - JavaScript Application with Debug
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
        
        console.log('🕵️‍♀️ Lost & Found App: Starting initialization...');
        this.init();
    }

    async init() {
        try {
            console.log('📊 Loading data...');
            await this.loadData();
            console.log('🎛️ Setting up event listeners...');
            this.setupEventListeners();
            console.log('🏷️ Populating filters...');
            this.populateFilters();
            console.log('📱 Displaying items...');
            this.displayItems();
            console.log('📈 Updating stats...');
            this.updateStats();
            console.log('✅ App initialization complete!');
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
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
        
        console.log(`📊 Loaded ${this.allItems.length} items`);
        console.log('📍 Available locations:', [...new Set(this.allItems.map(i => i.location))]);
        console.log('🏷️ Available categories:', [...new Set(this.allItems.map(i => i.category))]);
    }

    setupEventListeners() {
        console.log('🎛️ Setting up event listeners...');
        
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                console.log('🔍 Search filter changed:', e.target.value);
                this.currentFilters.search = e.target.value.toLowerCase().trim();
                this.applyFilters();
            });
            console.log('✅ Search input listener added');
        } else {
            console.error('❌ Search input not found');
        }

        // Clear search button
        const clearSearch = document.getElementById('clearSearch');
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                console.log('🧹 Clearing search');
                searchInput.value = '';
                this.currentFilters.search = '';
                this.applyFilters();
            });
            console.log('✅ Clear search listener added');
        }

        // Filter selects
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                console.log('🏷️ Category filter changed:', e.target.value);
                this.currentFilters.category = e.target.value;
                this.applyFilters();
            });
            console.log('✅ Category filter listener added');
        } else {
            console.error('❌ Category filter not found');
        }

        const urgencyFilter = document.getElementById('urgencyFilter');
        if (urgencyFilter) {
            urgencyFilter.addEventListener('change', (e) => {
                console.log('🚨 Urgency filter changed:', e.target.value);
                this.currentFilters.urgency = e.target.value;
                this.applyFilters();
            });
            console.log('✅ Urgency filter listener added');
        } else {
            console.error('❌ Urgency filter not found');
        }

        const locationFilter = document.getElementById('locationFilter');
        if (locationFilter) {
            locationFilter.addEventListener('change', (e) => {
                console.log('📍 Location filter changed:', e.target.value);
                this.currentFilters.location = e.target.value;
                this.applyFilters();
            });
            console.log('✅ Location filter listener added');
        } else {
            console.error('❌ Location filter not found');
        }

        const dayFilter = document.getElementById('dayFilter');
        if (dayFilter) {
            dayFilter.addEventListener('change', (e) => {
                console.log('📅 Day filter changed:', e.target.value);
                this.currentFilters.day = e.target.value;
                this.applyFilters();
            });
            console.log('✅ Day filter listener added');
        } else {
            console.error('❌ Day filter not found');
        }

        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                console.log('📊 Sort changed:', e.target.value);
                this.currentSort = e.target.value;
                this.sortAndDisplayItems();
            });
            console.log('✅ Sort listener added');
        } else {
            console.error('❌ Sort select not found');
        }

        // Matches only checkbox
        const matchesOnlyFilter = document.getElementById('matchesOnlyFilter');
        if (matchesOnlyFilter) {
            matchesOnlyFilter.addEventListener('change', (e) => {
                console.log('🔗 Matches only filter changed:', e.target.checked);
                this.currentFilters.matchesOnly = e.target.checked;
                this.applyFilters();
            });
            console.log('✅ Matches only filter listener added');
        } else {
            console.error('❌ Matches only filter not found');
        }

        // Clear all filters button
        const clearFilters = document.getElementById('clearFilters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                console.log('🧹 Clearing all filters');
                this.clearAllFilters();
            });
            console.log('✅ Clear filters listener added');
        } else {
            console.error('❌ Clear filters button not found');
        }

        // Modal close handlers
        const modalClose = document.querySelector('.modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
            console.log('✅ Modal close listener added');
        }

        const itemModal = document.getElementById('itemModal');
        if (itemModal) {
            itemModal.addEventListener('click', (e) => {
                if (e.target.id === 'itemModal') {
                    this.closeModal();
                }
            });
            console.log('✅ Modal backdrop listener added');
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
        console.log('✅ Keyboard navigation listener added');
    }

    populateFilters() {
        console.log('🏷️ Populating filter options...');
        
        // Populate category filter
        const categories = [...new Set(this.allItems.map(item => item.category))].sort();
        const categorySelect = document.getElementById('categoryFilter');
        if (categorySelect) {
            // Clear existing options (except first one)
            while (categorySelect.children.length > 1) {
                categorySelect.removeChild(categorySelect.lastChild);
            }
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = this.getCategoryIcon(category) + ' ' + category;
                categorySelect.appendChild(option);
            });
            console.log('✅ Category filter populated with:', categories);
        }

        // Populate location filter
        const locations = [...new Set(this.allItems.map(item => item.location))]
            .filter(location => location && location !== 'Unknown')
            .sort();
        const locationSelect = document.getElementById('locationFilter');
        if (locationSelect) {
            // Clear existing options (except first one)
            while (locationSelect.children.length > 1) {
                locationSelect.removeChild(locationSelect.lastChild);
            }
            
            locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                locationSelect.appendChild(option);
            });
            console.log('✅ Location filter populated with:', locations);
        }
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
        console.log('🔍 Applying filters:', this.currentFilters);
        
        const startTime = performance.now();
        let initialCount = this.allItems.length;
        
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

        const endTime = performance.now();
        console.log(`📊 Filtered ${initialCount} → ${this.filteredItems.length} items in ${(endTime - startTime).toFixed(2)}ms`);

        this.sortAndDisplayItems();
        this.updateItemsTitle();
    }

    sortAndDisplayItems() {
        console.log('📊 Sorting items by:', this.currentSort);
        
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
        console.log(`📱 Displaying ${this.filteredItems.length} items`);
        
        const container = document.getElementById('itemsContainer');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const noResults = document.getElementById('noResults');

        if (!container) {
            console.error('❌ Items container not found');
            return;
        }

        // Hide loading spinner
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }

        if (this.filteredItems.length === 0) {
            container.innerHTML = '';
            if (noResults) {
                noResults.style.display = 'block';
            }
            console.log('📭 No items to display');
            return;
        }

        if (noResults) {
            noResults.style.display = 'none';
        }
        
        // Create item cards
        const startTime = performance.now();
        container.innerHTML = this.filteredItems.map(item => this.createItemCard(item)).join('');
        const endTime = performance.now();
        
        console.log(`🎨 Rendered ${this.filteredItems.length} item cards in ${(endTime - startTime).toFixed(2)}ms`);

        // Add click event listeners to item cards
        container.querySelectorAll('.item-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showItemDetails(this.filteredItems[index]);
            });
        });

        // Update items count
        const itemsCount = document.getElementById('itemsCount');
        if (itemsCount) {
            itemsCount.textContent = 
                `${this.filteredItems.length} ${this.filteredItems.length === 1 ? 'item' : 'items'}`;
        }
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
        console.log('📋 Showing details for item:', item.id);
        
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
        if (closeButton) {
            closeButton.focus();
        }
    }

    getMatchItems(matchIds) {
        return matchIds.map(id => this.allItems.find(item => item.id === id)).filter(Boolean);
    }

    closeModal() {
        const modal = document.getElementById('itemModal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    updateStats() {
        const totalItems = document.getElementById('totalItems');
        if (totalItems) {
            totalItems.textContent = this.allItems.length;
        }
        
        const urgentCount = this.allItems.filter(item => item.urgency === 'high').length;
        const urgentItems = document.getElementById('urgentItems');
        if (urgentItems) {
            urgentItems.textContent = urgentCount;
        }
        
        const matchCount = this.allItems.filter(item => 
            item.potential_matches && item.potential_matches.length > 0
        ).length;
        const matchItems = document.getElementById('matchItems');
        if (matchItems) {
            matchItems.textContent = matchCount;
        }
        
        const locations = [...new Set(this.allItems.map(item => item.location))].length;
        const locationCount = document.getElementById('locationCount');
        if (locationCount) {
            locationCount.textContent = locations;
        }
        
        console.log('📈 Stats updated');
    }

    updateItemsTitle() {
        const title = document.getElementById('itemsTitle');
        if (!title) return;
        
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
        console.log('🧹 Clearing all filters');
        
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
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) categoryFilter.value = '';
        
        const urgencyFilter = document.getElementById('urgencyFilter');
        if (urgencyFilter) urgencyFilter.value = '';
        
        const locationFilter = document.getElementById('locationFilter');
        if (locationFilter) locationFilter.value = '';
        
        const dayFilter = document.getElementById('dayFilter');
        if (dayFilter) dayFilter.value = '';
        
        const matchesOnlyFilter = document.getElementById('matchesOnlyFilter');
        if (matchesOnlyFilter) matchesOnlyFilter.checked = false;
        
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) sortSelect.value = 'urgency';
        
        this.currentSort = 'urgency';
        this.applyFilters();
    }

    showError(message) {
        console.error('❌ Showing error:', message);
        const container = document.getElementById('itemsContainer');
        if (container) {
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
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Additional modal styles (same as before)
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
    console.log('🚀 DOM loaded, starting Lost & Found Detective App...');
    
    // Add additional styles
    document.head.insertAdjacentHTML('beforeend', additionalStyles);
    
    // Initialize the app
    window.lostFoundApp = new LostFoundApp();
    
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
