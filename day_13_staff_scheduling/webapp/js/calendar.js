// Calendar functionality
let calendar;

function initializeCalendar() {
    const calendarEl = document.getElementById('calendar-view');
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialDate: '2024-07-15', // Festival week
        slotMinTime: '05:00',
        slotMaxTime: '24:00',
        height: 'auto',
        events: generateCalendarEvents(),
        eventClick: function(info) {
            showEventDetails(info.event);
        },
        eventMouseEnter: function(info) {
            // Add hover tooltip
            info.el.title = `${info.event.extendedProps.staffName} - ${info.event.extendedProps.role}\nLocation: ${info.event.extendedProps.location}`;
        },
        dayHeaderFormat: { weekday: 'long', month: 'numeric', day: 'numeric' },
        slotLabelFormat: {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        },
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }
    });
    
    calendar.render();
    updateStaffLegend();
    updateQuickStats();
}

function showEventDetails(event) {
    const props = event.extendedProps;
    const staff = getStaffById(props.staffId);
    
    let details = `
        <div class="event-details">
            <h6><strong>${props.staffName}</strong></h6>
            <p><strong>Role:</strong> ${props.role}</p>
            <p><strong>Location:</strong> ${props.location}</p>
            <p><strong>Time:</strong> ${event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${event.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
    `;
    
    if (props.break) {
        details += `<p><strong>Break:</strong> ${props.break}</p>`;
    }
    
    if (props.trainer) {
        details += `<p><strong>Trainer:</strong> ${props.trainer}</p>`;
    }
    
    if (props.specialty) {
        details += `<p><strong>Specialty:</strong> ${props.specialty}</p>`;
    }
    
    if (props.required) {
        details += `<p><span class="badge bg-danger">Required Attendance</span></p>`;
    }
    
    if (staff) {
        details += `
            <hr>
            <p><strong>Contact:</strong><br>
            <i class="fas fa-phone"></i> ${staff.contact.phone}<br>
            <i class="fas fa-envelope"></i> ${staff.contact.email}</p>
        `;
    }
    
    details += `</div>`;
    
    // Show in a modal or tooltip (for now, using alert)
    const modal = new bootstrap.Modal(document.getElementById('printModal'));
    document.getElementById('print-content').innerHTML = details;
    document.querySelector('#printModal .modal-title').textContent = 'Event Details';
    modal.show();
}

function updateStaffLegend() {
    const legendContainer = document.getElementById('staff-legend');
    legendContainer.innerHTML = '';
    
    staffData.forEach(staff => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${staff.color}"></div>
            <div class="legend-label">${staff.name}</div>
        `;
        legendContainer.appendChild(legendItem);
    });
}

function updateQuickStats() {
    const statsContainer = document.getElementById('quick-stats');
    
    // Calculate statistics
    const totalStaff = staffData.length;
    const totalShifts = staffData.reduce((sum, staff) => sum + staff.schedule.length, 0);
    const criticalRoles = staffData.filter(staff => 
        staff.role.toLowerCase().includes('first aid') || 
        staff.preferences.includes('required') ||
        staff.preferences.includes('only one who knows')
    ).length;
    
    // Calculate coverage hours per day
    const coverageByDay = {};
    staffData.forEach(staff => {
        staff.schedule.forEach(shift => {
            if (!coverageByDay[shift.day]) {
                coverageByDay[shift.day] = 0;
            }
            const start = parseTime(shift.start);
            const end = parseTime(shift.end);
            const hours = (end - start) / (1000 * 60 * 60);
            coverageByDay[shift.day] += hours;
        });
    });
    
    const avgDailyCoverage = Object.values(coverageByDay).reduce((sum, hours) => sum + hours, 0) / Object.keys(coverageByDay).length;
    
    statsContainer.innerHTML = `
        <div class="stat-item">
            <div class="stat-number">${totalStaff}</div>
            <div class="stat-label">Total Staff</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${totalShifts}</div>
            <div class="stat-label">Total Shifts</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${criticalRoles}</div>
            <div class="stat-label">Critical Roles</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${Math.round(avgDailyCoverage)}</div>
            <div class="stat-label">Avg Hours/Day</div>
        </div>
    `;
}

function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

function printCalendar() {
    const printContent = generateCalendarPrintView();
    const modal = new bootstrap.Modal(document.getElementById('printModal'));
    document.getElementById('print-content').innerHTML = printContent;
    document.querySelector('#printModal .modal-title').textContent = 'Print Calendar View';
    modal.show();
}

function generateCalendarPrintView() {
    const events = generateCalendarEvents();
    const eventsByDay = {};
    
    // Group events by day
    events.forEach(event => {
        const dayKey = event.start.toDateString();
        if (!eventsByDay[dayKey]) {
            eventsByDay[dayKey] = [];
        }
        eventsByDay[dayKey].push(event);
    });
    
    let printHTML = `
        <div class="print-calendar">
            <h2>Festival Staff Schedule</h2>
            <p>Week of July 15-21, 2024</p>
    `;
    
    Object.keys(eventsByDay).sort().forEach(dayKey => {
        const dayEvents = eventsByDay[dayKey].sort((a, b) => a.start - b.start);
        const dayName = new Date(dayKey).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        printHTML += `
            <div class="print-day">
                <h4>${dayName}</h4>
                <div class="day-schedule">
        `;
        
        dayEvents.forEach(event => {
            const startTime = event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const endTime = event.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            printHTML += `
                <div class="schedule-item" style="border-left: 4px solid ${event.backgroundColor};">
                    <strong>${event.extendedProps.staffName}</strong> - ${event.extendedProps.role}<br>
                    <small>${startTime} - ${endTime} | ${event.extendedProps.location}</small>
                </div>
            `;
        });
        
        printHTML += `
                </div>
            </div>
        `;
    });
    
    printHTML += `</div>`;
    return printHTML;
}

function exportSchedule() {
    const events = generateCalendarEvents();
    const csvContent = generateCSVContent(events);
    downloadCSV(csvContent, 'festival_staff_schedule.csv');
}

function generateCSVContent(events) {
    let csv = 'Date,Staff Name,Role,Start Time,End Time,Location,Notes\n';
    
    events.forEach(event => {
        const date = event.start.toLocaleDateString();
        const startTime = event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const endTime = event.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const notes = [];
        
        if (event.extendedProps.break) notes.push(`Break: ${event.extendedProps.break}`);
        if (event.extendedProps.trainer) notes.push(`Trainer: ${event.extendedProps.trainer}`);
        if (event.extendedProps.specialty) notes.push(`Specialty: ${event.extendedProps.specialty}`);
        if (event.extendedProps.required) notes.push('Required Attendance');
        
        csv += `"${date}","${event.extendedProps.staffName}","${event.extendedProps.role}","${startTime}","${endTime}","${event.extendedProps.location}","${notes.join('; ')}"\n`;
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
}