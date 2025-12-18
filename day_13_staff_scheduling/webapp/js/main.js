// Main application initialization and coordination
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    try {
        // Initialize all components
        initializeCalendar();
        initializeStaffDirectory();
        initializeBackupCoverage();
        
        // Set up event listeners
        setupEventListeners();
        
        // Show welcome message
        showNotification('Festival Staff Scheduler loaded successfully!', 'success');
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        showNotification('Error loading application. Please refresh the page.', 'danger');
    }
}

function setupEventListeners() {
    // Tab switching handlers
    document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', function (e) {
            const target = e.target.getAttribute('data-bs-target');
            
            // Refresh calendar when switching to calendar tab
            if (target === '#calendar' && calendar) {
                setTimeout(() => {
                    calendar.render();
                    calendar.updateSize();
                }, 100);
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + P for print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            const activeTab = document.querySelector('.tab-pane.show.active');
            
            if (activeTab) {
                switch (activeTab.id) {
                    case 'calendar':
                        printCalendar();
                        break;
                    case 'staff':
                        printStaffDirectory();
                        break;
                    case 'individual':
                        const staffId = document.getElementById('staff-selector').value;
                        if (staffId) {
                            printIndividualSchedule();
                        }
                        break;
                    case 'backup':
                        generateBackupReport();
                        break;
                }
            }
        }
        
        // Ctrl/Cmd + E for export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            const activeTab = document.querySelector('.tab-pane.show.active');
            
            if (activeTab && activeTab.id === 'calendar') {
                exportSchedule();
            }
        }
        
        // Tab navigation with numbers
        if (e.ctrlKey || e.metaKey) {
            const tabIndex = parseInt(e.key);
            if (tabIndex >= 1 && tabIndex <= 4) {
                e.preventDefault();
                const tabs = document.querySelectorAll('button[data-bs-toggle="tab"]');
                if (tabs[tabIndex - 1]) {
                    new bootstrap.Tab(tabs[tabIndex - 1]).show();
                }
            }
        }
    });
    
    // Window resize handler for calendar
    window.addEventListener('resize', function() {
        if (calendar) {
            calendar.updateSize();
        }
    });
    
    // Before print handler
    window.addEventListener('beforeprint', function() {
        // Add print-specific classes
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', function() {
        // Remove print-specific classes
        document.body.classList.remove('printing');
    });
}

// Global utility functions
function refreshAllData() {
    try {
        // Refresh calendar
        if (calendar) {
            calendar.removeAllEvents();
            calendar.addEventSource(generateCalendarEvents());
            calendar.render();
            updateStaffLegend();
            updateQuickStats();
        }
        
        // Refresh staff directory
        renderStaffDirectory();
        populateStaffSelector();
        
        // Refresh backup coverage
        renderBackupCoverage();
        
        // Refresh individual schedule if one is selected
        const staffSelector = document.getElementById('staff-selector');
        if (staffSelector && staffSelector.value) {
            loadIndividualSchedule();
        }
        
        showNotification('All data refreshed successfully!', 'success');
    } catch (error) {
        console.error('Error refreshing data:', error);
        showNotification('Error refreshing data. Please reload the page.', 'danger');
    }
}

// Data management functions
function addNewStaff(staffInfo) {
    try {
        // Validate required fields
        if (!staffInfo.name || !staffInfo.role || !staffInfo.schedule) {
            throw new Error('Missing required staff information');
        }
        
        // Generate unique ID
        const id = staffInfo.name.toLowerCase().replace(/\s+/g, '');
        
        // Add default values
        const newStaff = {
            id: id,
            color: generateStaffColor(),
            contact: {
                phone: staffInfo.contact?.phone || '(555) 000-0000',
                email: staffInfo.contact?.email || `${id}@festival.com`,
                emergency: staffInfo.contact?.emergency || '(555) 000-9999'
            },
            skills: staffInfo.skills || ['General Support'],
            ...staffInfo
        };
        
        // Add to staff data
        staffData.push(newStaff);
        
        // Refresh all data
        refreshAllData();
        
        showNotification(`${newStaff.name} added successfully!`, 'success');
        return newStaff;
    } catch (error) {
        console.error('Error adding staff:', error);
        showNotification(`Error adding staff: ${error.message}`, 'danger');
        return null;
    }
}

function updateStaffInfo(staffId, updates) {
    try {
        const staff = getStaffById(staffId);
        if (!staff) {
            throw new Error('Staff member not found');
        }
        
        // Update staff information
        Object.assign(staff, updates);
        
        // Refresh all data
        refreshAllData();
        
        showNotification(`${staff.name} updated successfully!`, 'success');
        return staff;
    } catch (error) {
        console.error('Error updating staff:', error);
        showNotification(`Error updating staff: ${error.message}`, 'danger');
        return null;
    }
}

function removeStaff(staffId) {
    try {
        const staffIndex = staffData.findIndex(s => s.id === staffId);
        if (staffIndex === -1) {
            throw new Error('Staff member not found');
        }
        
        const staff = staffData[staffIndex];
        
        // Remove from staff data
        staffData.splice(staffIndex, 1);
        
        // Update backup assignments
        Object.entries(backupAssignments).forEach(([role, assignment]) => {
            if (assignment.primary === staff.name) {
                // Promote a backup to primary if available
                if (assignment.backups.length > 0) {
                    assignment.primary = assignment.backups[0];
                    assignment.backups = assignment.backups.slice(1);
                }
            }
            
            // Remove from backup lists
            assignment.backups = assignment.backups.filter(name => name !== staff.name);
            delete assignment.coverage[staff.name];
        });
        
        // Refresh all data
        refreshAllData();
        
        showNotification(`${staff.name} removed successfully!`, 'warning');
        return true;
    } catch (error) {
        console.error('Error removing staff:', error);
        showNotification(`Error removing staff: ${error.message}`, 'danger');
        return false;
    }
}

// Color generation for new staff
function generateStaffColor() {
    const colors = [
        '#e74c3c', '#9b59b6', '#3498db', '#1abc9c', 
        '#f39c12', '#34495e', '#e67e22', '#95a5a6'
    ];
    
    const usedColors = staffData.map(s => s.color);
    const availableColors = colors.filter(c => !usedColors.includes(c));
    
    if (availableColors.length > 0) {
        return availableColors[0];
    }
    
    // Generate random color if all predefined colors are used
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

// Export/Import functionality
function exportAllData() {
    const exportData = {
        staff: staffData,
        backups: backupAssignments,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `festival_staff_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification('Staff data exported successfully!', 'success');
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.staff && Array.isArray(data.staff)) {
                // Backup current data
                const backup = {
                    staff: [...staffData],
                    backups: { ...backupAssignments }
                };
                
                // Import new data
                staffData.length = 0;
                staffData.push(...data.staff);
                
                if (data.backups) {
                    Object.assign(backupAssignments, data.backups);
                }
                
                // Refresh all data
                refreshAllData();
                
                showNotification('Data imported successfully!', 'success');
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            showNotification(`Error importing data: ${error.message}`, 'danger');
        }
    };
    reader.readAsText(file);
}

// Emergency contact quick reference
function showEmergencyContacts() {
    const emergencyList = staffData.map(staff => `
        <div class="emergency-contact-item">
            <strong>${staff.name}</strong> (${staff.role})<br>
            <i class="fas fa-phone me-2"></i>${staff.contact.emergency}<br>
            <i class="fas fa-mobile me-2"></i>${staff.contact.phone}
        </div>
    `).join('');
    
    const content = `
        <div class="emergency-contacts">
            <div class="alert alert-danger">
                <h5><i class="fas fa-exclamation-triangle me-2"></i>Emergency Contacts</h5>
                <p>Use these numbers in case of emergency during the festival.</p>
            </div>
            
            <div class="emergency-list">
                ${emergencyList}
            </div>
            
            <div class="mt-3">
                <div class="alert alert-info">
                    <strong>911:</strong> Police, Fire, Medical Emergency<br>
                    <strong>Festival Command:</strong> (555) 999-0000<br>
                    <strong>Security:</strong> ${staffData.find(s => s.role.includes('Security'))?.contact.emergency || 'N/A'}
                </div>
            </div>
        </div>
    `;
    
    showPrintModal('Emergency Contacts', content);
}

// Debug and development helpers
function debugInfo() {
    console.log('=== Festival Staff Scheduler Debug Info ===');
    console.log('Staff Data:', staffData);
    console.log('Backup Assignments:', backupAssignments);
    console.log('Calendar Events:', generateCalendarEvents());
    console.log('Coverage Gaps:', analyzeCoverageGaps());
    console.log('============================================');
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An unexpected error occurred. Please refresh the page.', 'danger');
});

// Add keyboard shortcut hints to help
function showKeyboardShortcuts() {
    const shortcuts = `
        <div class="keyboard-shortcuts">
            <h5>Keyboard Shortcuts</h5>
            <div class="row">
                <div class="col-md-6">
                    <h6>Navigation</h6>
                    <ul>
                        <li><kbd>Ctrl/Cmd + 1</kbd> - Calendar View</li>
                        <li><kbd>Ctrl/Cmd + 2</kbd> - Staff Directory</li>
                        <li><kbd>Ctrl/Cmd + 3</kbd> - Individual Schedules</li>
                        <li><kbd>Ctrl/Cmd + 4</kbd> - Backup Coverage</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h6>Actions</h6>
                    <ul>
                        <li><kbd>Ctrl/Cmd + P</kbd> - Print Current View</li>
                        <li><kbd>Ctrl/Cmd + E</kbd> - Export Schedule</li>
                        <li><kbd>F5</kbd> - Refresh Data</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    showPrintModal('Help - Keyboard Shortcuts', shortcuts);
}

// Make functions globally available
window.refreshAllData = refreshAllData;
window.exportAllData = exportAllData;
window.showEmergencyContacts = showEmergencyContacts;
window.showKeyboardShortcuts = showKeyboardShortcuts;
window.debugInfo = debugInfo;