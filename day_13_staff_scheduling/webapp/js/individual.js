// Individual schedule functionality
function loadIndividualSchedule() {
    const staffId = document.getElementById('staff-selector').value;
    if (!staffId) {
        document.getElementById('individual-schedule-content').innerHTML = 
            '<p class="text-muted">Select a staff member to view their schedule.</p>';
        document.getElementById('individual-schedule-title').textContent = 'Individual Schedule';
        document.getElementById('print-individual-btn').style.display = 'none';
        return;
    }
    
    const staff = getStaffById(staffId);
    if (!staff) return;
    
    document.getElementById('individual-schedule-title').textContent = `${staff.name}'s Schedule`;
    document.getElementById('print-individual-btn').style.display = 'block';
    
    const scheduleContent = generateIndividualScheduleContent(staff);
    document.getElementById('individual-schedule-content').innerHTML = scheduleContent;
}

function generateIndividualScheduleContent(staff) {
    let content = `
        <div class="individual-schedule fade-in">
            <div class="row mb-4">
                <div class="col-md-8">
                    <h5>${staff.name}</h5>
                    <p class="text-muted">${staff.role} | ${staff.availability}</p>
                    ${staff.preferences ? `<p class="text-info"><i class="fas fa-info-circle me-2"></i>${staff.preferences}</p>` : ''}
                </div>
                <div class="col-md-4">
                    <div class="staff-contact-summary">
                        <h6>Contact Information</h6>
                        <p class="mb-1"><i class="fas fa-phone me-2"></i>${staff.contact.phone}</p>
                        <p class="mb-1"><i class="fas fa-envelope me-2"></i>${staff.contact.email}</p>
                        <p class="mb-0"><i class="fas fa-exclamation-triangle me-2"></i>${staff.contact.emergency}</p>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-8">
                    <h6>Weekly Schedule</h6>
    `;
    
    // Sort schedule by day order
    const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const sortedSchedule = staff.schedule.sort((a, b) => 
        dayOrder.indexOf(a.day.toLowerCase()) - dayOrder.indexOf(b.day.toLowerCase())
    );
    
    sortedSchedule.forEach(shift => {
        const dayName = shift.day.charAt(0).toUpperCase() + shift.day.slice(1);
        const startTime = formatTime(shift.start);
        const endTime = formatTime(shift.end);
        const duration = calculateShiftDuration(shift.start, shift.end, shift.break);
        
        content += `
            <div class="schedule-day" style="border-left-color: ${staff.color};">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">${dayName}</h6>
                        <div class="schedule-time">${startTime} - ${endTime}</div>
                        <div class="text-muted">
                            <i class="fas fa-map-marker-alt me-1"></i>${shift.location}
                            ${shift.break ? `<br><i class="fas fa-coffee me-1"></i>Break: ${shift.break}` : ''}
                        </div>
                        ${shift.trainer ? `<div class="schedule-notes"><i class="fas fa-user-graduate me-1"></i>Trainer: ${shift.trainer}</div>` : ''}
                        ${shift.specialty ? `<div class="schedule-notes"><i class="fas fa-star me-1"></i>${shift.specialty}</div>` : ''}
                        ${shift.required ? `<span class="badge bg-danger mt-1">Required Attendance</span>` : ''}
                    </div>
                    <div class="text-end">
                        <small class="text-muted">${duration} hours</small>
                    </div>
                </div>
            </div>
        `;
    });
    
    content += `
                </div>
                <div class="col-md-4">
                    <div class="schedule-summary">
                        <h6>Summary</h6>
                        ${generateScheduleSummary(staff)}
                    </div>
                    
                    <div class="backup-info mt-4">
                        <h6>Backup Coverage</h6>
                        ${generateBackupInfo(staff)}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return content;
}

function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true});
}

function calculateShiftDuration(start, end, breakTime) {
    const startMinutes = parseTimeToMinutes(start);
    const endMinutes = parseTimeToMinutes(end);
    const breakMinutes = breakTime ? calculateBreakTime(breakTime) : 0;
    
    const totalMinutes = endMinutes - startMinutes - breakMinutes;
    return (totalMinutes / 60).toFixed(1);
}

function generateScheduleSummary(staff) {
    const totalHours = staff.schedule.reduce((sum, shift) => {
        return sum + parseFloat(calculateShiftDuration(shift.start, shift.end, shift.break));
    }, 0);
    
    const workingDays = staff.schedule.length;
    const avgHoursPerDay = workingDays > 0 ? (totalHours / workingDays).toFixed(1) : 0;
    
    // Find peak hours
    const hourCounts = {};
    staff.schedule.forEach(shift => {
        const start = Math.floor(parseTimeToMinutes(shift.start) / 60);
        const end = Math.floor(parseTimeToMinutes(shift.end) / 60);
        for (let hour = start; hour < end; hour++) {
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        }
    });
    
    const peakHour = Object.keys(hourCounts).reduce((a, b) => 
        hourCounts[a] > hourCounts[b] ? a : b, 0
    );
    
    return `
        <div class="summary-stats">
            <div class="row text-center">
                <div class="col-6">
                    <div class="stat-item">
                        <div class="stat-number">${totalHours.toFixed(1)}</div>
                        <div class="stat-label">Total Hours</div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="stat-item">
                        <div class="stat-number">${workingDays}</div>
                        <div class="stat-label">Working Days</div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="stat-item">
                        <div class="stat-number">${avgHoursPerDay}</div>
                        <div class="stat-label">Avg Hours/Day</div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="stat-item">
                        <div class="stat-number">${peakHour}:00</div>
                        <div class="stat-label">Peak Hour</div>
                    </div>
                </div>
            </div>
            
            <div class="mt-3">
                <h6>Skills</h6>
                <div class="skills-list">
                    ${staff.skills.map(skill => `<span class="badge bg-light text-dark me-1 mb-1">${skill}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

function generateBackupInfo(staff) {
    // Find backup assignments for this staff member
    const staffBackups = [];
    const staffAsPrimary = [];
    
    Object.entries(backupAssignments).forEach(([role, assignment]) => {
        if (assignment.primary === staff.name) {
            staffAsPrimary.push({
                role: role,
                backups: assignment.backups,
                coverage: assignment.coverage,
                notes: assignment.notes
            });
        }
        
        if (assignment.backups.includes(staff.name)) {
            staffBackups.push({
                role: role,
                primary: assignment.primary,
                coverage: assignment.coverage[staff.name] || 'Available as backup'
            });
        }
    });
    
    let backupContent = '';
    
    if (staffAsPrimary.length > 0) {
        backupContent += '<div class="mb-3"><h6 class="text-primary">Primary Role Backups</h6>';
        staffAsPrimary.forEach(item => {
            backupContent += `
                <div class="backup-role mb-2">
                    <strong>${item.role}</strong><br>
                    <small class="text-muted">
                        Backups: ${item.backups.join(', ')}<br>
                        ${item.notes ? `<em>${item.notes}</em>` : ''}
                    </small>
                </div>
            `;
        });
        backupContent += '</div>';
    }
    
    if (staffBackups.length > 0) {
        backupContent += '<div><h6 class="text-secondary">Backup Responsibilities</h6>';
        staffBackups.forEach(item => {
            backupContent += `
                <div class="backup-role mb-2">
                    <strong>${item.role}</strong><br>
                    <small class="text-muted">
                        Backing up: ${item.primary}<br>
                        ${item.coverage}
                    </small>
                </div>
            `;
        });
        backupContent += '</div>';
    }
    
    if (!backupContent) {
        backupContent = '<p class="text-muted">No backup assignments</p>';
    }
    
    return backupContent;
}

function printIndividualSchedule() {
    const staffId = document.getElementById('staff-selector').value;
    if (!staffId) return;
    
    const staff = getStaffById(staffId);
    if (!staff) return;
    
    const printContent = generateIndividualSchedulePrint(staff);
    const modal = new bootstrap.Modal(document.getElementById('printModal'));
    document.getElementById('print-content').innerHTML = printContent;
    document.querySelector('#printModal .modal-title').textContent = `Print ${staff.name}'s Schedule`;
    modal.show();
}

function generateIndividualSchedulePrint(staff) {
    return `
        <div class="individual-schedule-print">
            <div class="text-center mb-4">
                <h2>${staff.name}</h2>
                <h4>${staff.role}</h4>
                <p>Festival Week Schedule | July 15-21, 2024</p>
            </div>
            
            <div class="contact-info-print mb-4">
                <h5>Contact Information</h5>
                <div class="row">
                    <div class="col-4"><strong>Phone:</strong> ${staff.contact.phone}</div>
                    <div class="col-4"><strong>Email:</strong> ${staff.contact.email}</div>
                    <div class="col-4"><strong>Emergency:</strong> ${staff.contact.emergency}</div>
                </div>
            </div>
            
            <div class="schedule-print">
                <h5>Work Schedule</h5>
                ${staff.schedule.map(shift => {
                    const dayName = shift.day.charAt(0).toUpperCase() + shift.day.slice(1);
                    const startTime = formatTime(shift.start);
                    const endTime = formatTime(shift.end);
                    const duration = calculateShiftDuration(shift.start, shift.end, shift.break);
                    
                    return `
                        <div class="schedule-day" style="border-left: 4px solid ${staff.color};">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h6>${dayName}</h6>
                                    <p><strong>Time:</strong> ${startTime} - ${endTime} (${duration} hours)</p>
                                    <p><strong>Location:</strong> ${shift.location}</p>
                                    ${shift.break ? `<p><strong>Break:</strong> ${shift.break}</p>` : ''}
                                    ${shift.trainer ? `<p><strong>Trainer:</strong> ${shift.trainer}</p>` : ''}
                                    ${shift.specialty ? `<p><strong>Note:</strong> ${shift.specialty}</p>` : ''}
                                    ${shift.required ? `<p><strong>⚠️ REQUIRED ATTENDANCE</strong></p>` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="schedule-summary-print mt-4">
                <h5>Summary</h5>
                ${generateScheduleSummary(staff)}
            </div>
            
            <div class="backup-info-print mt-4">
                <h5>Backup Information</h5>
                ${generateBackupInfo(staff)}
            </div>
            
            <div class="footer-print mt-4">
                <hr>
                <p class="text-center text-muted">
                    <small>Generated on ${new Date().toLocaleDateString()} | Festival Staff Management System</small>
                </p>
            </div>
        </div>
    `;
}