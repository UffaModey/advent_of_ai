// Print functionality
function printCalendar() {
    const printContent = generateCalendarPrintView();
    showPrintModal('Festival Staff Calendar', printContent);
}

function printIndividualSchedule() {
    const staffId = document.getElementById('staff-selector').value;
    if (!staffId) return;
    
    const staff = getStaffById(staffId);
    if (!staff) return;
    
    const printContent = generateIndividualSchedulePrint(staff);
    showPrintModal(`${staff.name}'s Schedule`, printContent);
}

function showPrintModal(title, content) {
    const modal = new bootstrap.Modal(document.getElementById('printModal'));
    document.getElementById('print-content').innerHTML = content;
    document.querySelector('#printModal .modal-title').textContent = title;
    
    // Update modal footer for printing
    const modalFooter = document.querySelector('#printModal .modal-footer');
    modalFooter.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" onclick="printContent()">
            <i class="fas fa-print me-1"></i>Print
        </button>
    `;
    
    modal.show();
}

function printContent() {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    const printContent = document.getElementById('print-content').innerHTML;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Festival Staff Schedule - Print</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                ${getPrintStyles()}
            </style>
        </head>
        <body>
            ${printContent}
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    }
                }
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

function getPrintStyles() {
    return `
        @media print {
            @page {
                margin: 1cm;
                size: A4;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 12px;
                line-height: 1.4;
                color: #000 !important;
                background: white !important;
            }
            
            .card {
                border: 1px solid #ddd !important;
                box-shadow: none !important;
                break-inside: avoid;
                margin-bottom: 15px;
            }
            
            .card-header {
                background: #f8f9fa !important;
                color: #000 !important;
                font-weight: bold;
                padding: 10px 15px;
            }
            
            .schedule-day {
                border-left: 3px solid #333 !important;
                margin-bottom: 10px;
                padding: 10px;
                break-inside: avoid;
                background: #f9f9f9;
            }
            
            .schedule-day h6 {
                margin: 0 0 5px 0;
                font-weight: bold;
            }
            
            .schedule-time {
                font-weight: bold;
                font-size: 14px;
            }
            
            .stat-item {
                text-align: center;
                padding: 10px;
                border: 1px solid #ddd;
                margin-bottom: 10px;
            }
            
            .stat-number {
                font-size: 24px;
                font-weight: bold;
                line-height: 1;
            }
            
            .stat-label {
                font-size: 10px;
                text-transform: uppercase;
                color: #666;
            }
            
            .backup-role-header {
                background: #e9ecef !important;
                color: #000 !important;
                padding: 10px 15px;
                font-weight: bold;
                border-bottom: 1px solid #ddd;
            }
            
            .backup-assignments {
                padding: 15px;
            }
            
            .backup-item {
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }
            
            .backup-primary {
                font-weight: bold;
            }
            
            .backup-secondary {
                font-size: 11px;
                color: #666;
            }
            
            .alert {
                border: 1px solid #ddd !important;
                padding: 10px;
                margin: 10px 0;
            }
            
            .alert-danger {
                background: #f8d7da !important;
                border-color: #f5c6cb !important;
                color: #721c24 !important;
            }
            
            .alert-warning {
                background: #fff3cd !important;
                border-color: #ffeaa7 !important;
                color: #856404 !important;
            }
            
            .alert-success {
                background: #d4edda !important;
                border-color: #c3e6cb !important;
                color: #155724 !important;
            }
            
            .alert-info {
                background: #d1ecf1 !important;
                border-color: #bee5eb !important;
                color: #0c5460 !important;
            }
            
            .badge {
                border: 1px solid #333 !important;
                color: #000 !important;
                background: #f8f9fa !important;
                padding: 2px 6px;
                font-size: 10px;
            }
            
            .text-muted {
                color: #666 !important;
            }
            
            .text-primary {
                color: #000 !important;
                font-weight: bold;
            }
            
            .contact-info-print {
                border: 1px solid #ddd;
                padding: 15px;
                margin-bottom: 20px;
            }
            
            .schedule-print .schedule-day {
                margin-bottom: 15px;
            }
            
            .footer-print {
                border-top: 1px solid #ddd;
                padding-top: 10px;
                margin-top: 30px;
                text-align: center;
                font-size: 10px;
                color: #666;
            }
            
            /* Hide buttons and interactive elements */
            .btn, button, .modal-footer {
                display: none !important;
            }
            
            /* Calendar print styles */
            .print-day {
                margin-bottom: 20px;
                break-inside: avoid;
            }
            
            .print-day h4 {
                border-bottom: 2px solid #333;
                padding-bottom: 5px;
                margin-bottom: 10px;
            }
            
            .schedule-item {
                padding: 8px 10px;
                margin-bottom: 5px;
                border: 1px solid #ddd;
                border-left: 4px solid #333;
            }
            
            .schedule-item strong {
                font-weight: bold;
            }
            
            .schedule-item small {
                color: #666;
                font-size: 10px;
            }
            
            /* Staff avatar in print */
            .backup-avatar {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: #ddd !important;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: #000 !important;
                font-weight: bold;
                font-size: 12px;
                margin-right: 10px;
            }
            
            /* Force black text */
            * {
                color: #000 !important;
                background: transparent !important;
            }
            
            .card, .alert, .schedule-day, .contact-info-print {
                background: white !important;
            }
        }
    `;
}

function exportSchedule() {
    const events = generateCalendarEvents();
    const csvContent = generateCSVContent(events);
    downloadCSV(csvContent, 'festival_staff_schedule.csv');
}

function generateCSVContent(events) {
    let csv = 'Date,Day,Staff Name,Role,Start Time,End Time,Location,Duration,Notes\n';
    
    events.forEach(event => {
        const date = event.start.toLocaleDateString();
        const day = event.start.toLocaleDateString('en-US', { weekday: 'long' });
        const startTime = event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const endTime = event.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // Calculate duration
        const durationMs = event.end - event.start;
        const durationHours = (durationMs / (1000 * 60 * 60)).toFixed(1);
        
        const notes = [];
        if (event.extendedProps.break) notes.push(`Break: ${event.extendedProps.break}`);
        if (event.extendedProps.trainer) notes.push(`Trainer: ${event.extendedProps.trainer}`);
        if (event.extendedProps.specialty) notes.push(`Specialty: ${event.extendedProps.specialty}`);
        if (event.extendedProps.required) notes.push('Required Attendance');
        if (event.extendedProps.type === 'break') notes.push('BREAK TIME');
        
        csv += `"${date}","${day}","${event.extendedProps.staffName}","${event.extendedProps.role}","${startTime}","${endTime}","${event.extendedProps.location}","${durationHours}h","${notes.join('; ')}"\n`;
    });
    
    return csv;
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success notification
    showNotification('Schedule exported successfully!', 'success');
}

// Export individual schedule as PDF-like content
function exportIndividualSchedule(staffId) {
    const staff = getStaffById(staffId);
    if (!staff) return;
    
    const csvContent = generateIndividualCSV(staff);
    downloadCSV(csvContent, `${staff.name.replace(' ', '_')}_schedule.csv`);
}

function generateIndividualCSV(staff) {
    let csv = 'Day,Date,Start Time,End Time,Duration,Location,Break,Notes\n';
    
    const startDate = new Date('2024-07-15'); // Start of festival week
    
    staff.schedule.forEach(shift => {
        const dayOffset = getDayOffset(shift.day);
        const eventDate = new Date(startDate);
        eventDate.setDate(startDate.getDate() + dayOffset);
        
        const date = eventDate.toLocaleDateString();
        const dayName = shift.day.charAt(0).toUpperCase() + shift.day.slice(1);
        const startTime = formatTime(shift.start);
        const endTime = formatTime(shift.end);
        const duration = calculateShiftDuration(shift.start, shift.end, shift.break);
        
        const notes = [];
        if (shift.trainer) notes.push(`Trainer: ${shift.trainer}`);
        if (shift.specialty) notes.push(`Specialty: ${shift.specialty}`);
        if (shift.required) notes.push('REQUIRED ATTENDANCE');
        
        csv += `"${dayName}","${date}","${startTime}","${endTime}","${duration}h","${shift.location}","${shift.break || 'None'}","${notes.join('; ')}"\n`;
    });
    
    return csv;
}

// Print all staff contact information
function printStaffDirectory() {
    const contactContent = generateStaffDirectoryPrint();
    showPrintModal('Staff Directory', contactContent);
}

function generateStaffDirectoryPrint() {
    return `
        <div class="staff-directory-print">
            <div class="text-center mb-4">
                <h2>Festival Staff Directory</h2>
                <p>Contact Information & Details</p>
                <p>Generated: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="staff-list">
                ${staffData.map(staff => `
                    <div class="staff-print-card mb-4">
                        <div class="card">
                            <div class="card-header">
                                <h5>${staff.name} - ${staff.role}</h5>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-6">
                                        <h6>Contact Information</h6>
                                        <p><strong>Phone:</strong> ${staff.contact.phone}</p>
                                        <p><strong>Email:</strong> ${staff.contact.email}</p>
                                        <p><strong>Emergency:</strong> ${staff.contact.emergency}</p>
                                    </div>
                                    <div class="col-6">
                                        <h6>Work Details</h6>
                                        <p><strong>Availability:</strong> ${staff.availability}</p>
                                        <p><strong>Skills:</strong> ${staff.skills.join(', ')}</p>
                                        ${staff.preferences ? `<p><strong>Notes:</strong> ${staff.preferences}</p>` : ''}
                                    </div>
                                </div>
                                
                                <div class="schedule-summary">
                                    <h6>Schedule Overview</h6>
                                    <ul>
                                        ${staff.schedule.map(shift => `
                                            <li>
                                                <strong>${shift.day.charAt(0).toUpperCase() + shift.day.slice(1)}:</strong>
                                                ${formatTime(shift.start)} - ${formatTime(shift.end)} @ ${shift.location}
                                                ${shift.break ? ` (Break: ${shift.break})` : ''}
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="footer-print">
                <hr>
                <p>Festival Staff Management System | Emergency Contacts Available 24/7</p>
            </div>
        </div>
    `;
}