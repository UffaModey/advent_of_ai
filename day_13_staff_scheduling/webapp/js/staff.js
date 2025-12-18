// Staff directory functionality
function initializeStaffDirectory() {
    renderStaffDirectory();
    populateStaffSelector();
}

function renderStaffDirectory() {
    const container = document.getElementById('staff-directory');
    container.innerHTML = '';
    
    staffData.forEach(staff => {
        const staffCard = createStaffCard(staff);
        container.appendChild(staffCard);
    });
}

function createStaffCard(staff) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'col-lg-6 col-xl-4';
    
    // Calculate total working hours
    const totalHours = staff.schedule.reduce((sum, shift) => {
        const start = parseTimeToMinutes(shift.start);
        const end = parseTimeToMinutes(shift.end);
        const breakTime = shift.break ? calculateBreakTime(shift.break) : 0;
        return sum + (end - start - breakTime) / 60;
    }, 0);
    
    // Get availability summary
    const availabilityDays = staff.schedule.map(shift => 
        shift.day.charAt(0).toUpperCase() + shift.day.slice(1, 3)
    ).join(', ');
    
    // Generate initials for avatar
    const initials = staff.name.split(' ').map(n => n[0]).join('');
    
    cardDiv.innerHTML = `
        <div class="card staff-card h-100">
            <div class="card-body">
                <div class="d-flex align-items-start">
                    <div class="staff-avatar" style="background-color: ${staff.color};">
                        ${initials}
                    </div>
                    <div class="staff-info flex-grow-1">
                        <h6 class="card-title">${staff.name}</h6>
                        <p class="staff-role">${staff.role}</p>
                        <div class="staff-availability">
                            <small><i class="fas fa-calendar-day me-1"></i>${availabilityDays}</small><br>
                            <small><i class="fas fa-clock me-1"></i>${Math.round(totalHours)} hours/week</small>
                        </div>
                        <div class="contact-info mt-2">
                            <div class="row">
                                <div class="col-6">
                                    <small><i class="fas fa-phone me-1"></i>${staff.contact.phone}</small>
                                </div>
                                <div class="col-6">
                                    <small><i class="fas fa-envelope me-1"></i>${staff.contact.email}</small>
                                </div>
                            </div>
                            <div class="row mt-1">
                                <div class="col-12">
                                    <small><i class="fas fa-exclamation-triangle me-1"></i>Emergency: ${staff.contact.emergency}</small>
                                </div>
                            </div>
                        </div>
                        ${staff.preferences ? `
                            <div class="mt-2">
                                <small class="text-muted"><i class="fas fa-info-circle me-1"></i>${staff.preferences}</small>
                            </div>
                        ` : ''}
                        <div class="mt-2">
                            <small><strong>Skills:</strong> ${staff.skills.join(', ')}</small>
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary btn-sm flex-fill" onclick="viewStaffSchedule('${staff.id}')">
                            <i class="fas fa-calendar me-1"></i>View Schedule
                        </button>
                        <button class="btn btn-outline-secondary btn-sm flex-fill" onclick="editStaffContact('${staff.id}')">
                            <i class="fas fa-edit me-1"></i>Edit Contact
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return cardDiv;
}

function parseTimeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function calculateBreakTime(breakStr) {
    const [start, end] = breakStr.split('-');
    const startMinutes = parseTimeToMinutes(start);
    const endMinutes = parseTimeToMinutes(end);
    return endMinutes - startMinutes;
}

function populateStaffSelector() {
    const selector = document.getElementById('staff-selector');
    selector.innerHTML = '<option value="">Choose a staff member...</option>';
    
    staffData.forEach(staff => {
        const option = document.createElement('option');
        option.value = staff.id;
        option.textContent = `${staff.name} - ${staff.role}`;
        selector.appendChild(option);
    });
}

function viewStaffSchedule(staffId) {
    // Switch to individual schedules tab and load this staff member
    const individualTab = new bootstrap.Tab(document.getElementById('individual-tab'));
    individualTab.show();
    
    // Set the selector and load the schedule
    document.getElementById('staff-selector').value = staffId;
    loadIndividualSchedule();
}

function editStaffContact(staffId) {
    const staff = getStaffById(staffId);
    if (!staff) return;
    
    // Create a simple modal for editing contact information
    const modalContent = `
        <div class="edit-contact-form">
            <h5>Edit Contact Information - ${staff.name}</h5>
            <form id="contact-form">
                <div class="mb-3">
                    <label for="edit-phone" class="form-label">Phone</label>
                    <input type="tel" class="form-control" id="edit-phone" value="${staff.contact.phone}">
                </div>
                <div class="mb-3">
                    <label for="edit-email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="edit-email" value="${staff.contact.email}">
                </div>
                <div class="mb-3">
                    <label for="edit-emergency" class="form-label">Emergency Contact</label>
                    <input type="tel" class="form-control" id="edit-emergency" value="${staff.contact.emergency}">
                </div>
                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-primary flex-fill" onclick="saveStaffContact('${staffId}')">
                        <i class="fas fa-save me-1"></i>Save Changes
                    </button>
                    <button type="button" class="btn btn-secondary flex-fill" data-bs-dismiss="modal">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('printModal'));
    document.getElementById('print-content').innerHTML = modalContent;
    document.querySelector('#printModal .modal-title').textContent = 'Edit Contact Information';
    modal.show();
}

function saveStaffContact(staffId) {
    const staff = getStaffById(staffId);
    if (!staff) return;
    
    // Get form values
    const phone = document.getElementById('edit-phone').value;
    const email = document.getElementById('edit-email').value;
    const emergency = document.getElementById('edit-emergency').value;
    
    // Update staff data
    staff.contact.phone = phone;
    staff.contact.email = email;
    staff.contact.emergency = emergency;
    
    // Refresh the staff directory
    renderStaffDirectory();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('printModal'));
    modal.hide();
    
    // Show success message
    showNotification('Contact information updated successfully!', 'success');
}

function showNotification(message, type = 'info') {
    // Create a simple toast notification
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '1100';
    document.body.appendChild(container);
    return container;
}

// Filter and search functionality
function filterStaffDirectory() {
    const searchTerm = document.getElementById('staff-search').value.toLowerCase();
    const roleFilter = document.getElementById('role-filter').value;
    
    const filteredStaff = staffData.filter(staff => {
        const matchesSearch = staff.name.toLowerCase().includes(searchTerm) || 
                             staff.role.toLowerCase().includes(searchTerm) ||
                             staff.skills.some(skill => skill.toLowerCase().includes(searchTerm));
        
        const matchesRole = !roleFilter || staff.role.toLowerCase().includes(roleFilter.toLowerCase());
        
        return matchesSearch && matchesRole;
    });
    
    const container = document.getElementById('staff-directory');
    container.innerHTML = '';
    
    filteredStaff.forEach(staff => {
        const staffCard = createStaffCard(staff);
        container.appendChild(staffCard);
    });
    
    if (filteredStaff.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted text-center">No staff members found matching your criteria.</p></div>';
    }
}