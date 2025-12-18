// Staff Data Structure
const staffData = [
    {
        id: 'marcus',
        name: 'Marcus Thompson',
        role: 'Security',
        availability: 'Mon-Wed 6am-6pm',
        preferences: 'likes mornings better',
        color: '#ef4444',
        contact: {
            phone: '(555) 123-4567',
            email: 'marcus.thompson@festival.com',
            emergency: '(555) 123-9999'
        },
        schedule: [
            { day: 'monday', start: '06:00', end: '18:00', location: 'Main Entrance' },
            { day: 'tuesday', start: '06:00', end: '18:00', location: 'VIP Area' },
            { day: 'wednesday', start: '06:00', end: '18:00', location: 'Backstage' }
        ],
        skills: ['Security Management', 'Crowd Control', 'Emergency Response']
    },
    {
        id: 'elena',
        name: 'Elena Rodriguez',
        role: 'Marketing',
        availability: 'Tue-Thu 9am-9pm',
        preferences: 'absolutely no weekends',
        color: '#f97316',
        contact: {
            phone: '(555) 234-5678',
            email: 'elena.rodriguez@festival.com',
            emergency: '(555) 234-9999'
        },
        schedule: [
            { day: 'tuesday', start: '09:00', end: '21:00', location: 'Media Tent' },
            { day: 'wednesday', start: '09:00', end: '21:00', location: 'Social Media Station' },
            { day: 'thursday', start: '09:00', end: '21:00', location: 'Press Area' }
        ],
        skills: ['Social Media', 'Press Relations', 'Content Creation']
    },
    {
        id: 'sarah',
        name: 'Sarah Chen',
        role: 'Coordinator',
        availability: 'Daily 8am-8pm',
        preferences: 'needs lunch break',
        color: '#eab308',
        contact: {
            phone: '(555) 345-6789',
            email: 'sarah.chen@festival.com',
            emergency: '(555) 345-9999'
        },
        schedule: [
            { day: 'sunday', start: '08:00', end: '20:00', location: 'Command Center', break: '12:00-13:00' },
            { day: 'monday', start: '08:00', end: '20:00', location: 'Command Center', break: '12:00-13:00' },
            { day: 'tuesday', start: '08:00', end: '20:00', location: 'Command Center', break: '12:00-13:00' },
            { day: 'wednesday', start: '08:00', end: '20:00', location: 'Command Center', break: '12:00-13:00' },
            { day: 'thursday', start: '08:00', end: '20:00', location: 'Command Center', break: '12:00-13:00' },
            { day: 'friday', start: '08:00', end: '20:00', location: 'Command Center', break: '12:00-13:00' },
            { day: 'saturday', start: '08:00', end: '20:00', location: 'Command Center', break: '12:00-13:00' }
        ],
        skills: ['Event Coordination', 'Team Management', 'Problem Solving']
    },
    {
        id: 'david',
        name: 'David Park',
        role: 'Tech/Photo Booth',
        availability: 'Mon-Wed 10am-10pm',
        preferences: 'only one who knows the photo booth',
        color: '#22c55e',
        contact: {
            phone: '(555) 456-7890',
            email: 'david.park@festival.com',
            emergency: '(555) 456-9999'
        },
        schedule: [
            { day: 'monday', start: '10:00', end: '22:00', location: 'Photo Booth Area' },
            { day: 'tuesday', start: '10:00', end: '22:00', location: 'Tech Support Tent' },
            { day: 'wednesday', start: '10:00', end: '22:00', location: 'Photo Booth Area' }
        ],
        skills: ['Photo Booth Operation', 'Technical Support', 'Equipment Maintenance']
    },
    {
        id: 'lisa',
        name: 'Lisa Williams',
        role: 'Volunteer',
        availability: 'Wed-Fri 12pm-8pm',
        preferences: 'needs someone to train her',
        color: '#06b6d4',
        contact: {
            phone: '(555) 567-8901',
            email: 'lisa.williams@festival.com',
            emergency: '(555) 567-9999'
        },
        schedule: [
            { day: 'wednesday', start: '12:00', end: '20:00', location: 'Information Booth', trainer: 'Sarah Chen' },
            { day: 'thursday', start: '12:00', end: '20:00', location: 'Merchandise Stand', trainer: 'Elena Rodriguez' },
            { day: 'friday', start: '12:00', end: '20:00', location: 'Guest Services' }
        ],
        skills: ['Customer Service', 'General Support', 'Training in Progress']
    },
    {
        id: 'tom',
        name: 'Tom Anderson',
        role: 'Setup Crew',
        availability: 'Sun-Tue 5am-3pm',
        preferences: 'strong guy for heavy stuff',
        color: '#3b82f6',
        contact: {
            phone: '(555) 678-9012',
            email: 'tom.anderson@festival.com',
            emergency: '(555) 678-9999'
        },
        schedule: [
            { day: 'sunday', start: '05:00', end: '15:00', location: 'Main Stage Setup' },
            { day: 'monday', start: '05:00', end: '15:00', location: 'Vendor Area Setup' },
            { day: 'tuesday', start: '05:00', end: '15:00', location: 'Equipment Breakdown' }
        ],
        skills: ['Heavy Lifting', 'Stage Setup', 'Equipment Assembly']
    },
    {
        id: 'emma',
        name: 'Emma Davis',
        role: 'First Aid',
        availability: 'All week 9am-5pm',
        preferences: 'festival requires her at every event',
        color: '#8b5cf6',
        contact: {
            phone: '(555) 789-0123',
            email: 'emma.davis@festival.com',
            emergency: '(555) 789-9999'
        },
        schedule: [
            { day: 'sunday', start: '09:00', end: '17:00', location: 'First Aid Station', required: true },
            { day: 'monday', start: '09:00', end: '17:00', location: 'First Aid Station', required: true },
            { day: 'tuesday', start: '09:00', end: '17:00', location: 'First Aid Station', required: true },
            { day: 'wednesday', start: '09:00', end: '17:00', location: 'First Aid Station', required: true },
            { day: 'thursday', start: '09:00', end: '17:00', location: 'First Aid Station', required: true },
            { day: 'friday', start: '09:00', end: '17:00', location: 'First Aid Station', required: true },
            { day: 'saturday', start: '09:00', end: '17:00', location: 'First Aid Station', required: true }
        ],
        skills: ['First Aid', 'CPR Certified', 'Emergency Medical Response']
    },
    {
        id: 'jake',
        name: 'Jake Miller',
        role: 'Sound Tech',
        availability: 'Mon-Wed 7am-11pm',
        preferences: 'only does main stage work',
        color: '#ec4899',
        contact: {
            phone: '(555) 890-1234',
            email: 'jake.miller@festival.com',
            emergency: '(555) 890-9999'
        },
        schedule: [
            { day: 'monday', start: '07:00', end: '23:00', location: 'Main Stage', specialty: 'main stage only' },
            { day: 'tuesday', start: '07:00', end: '23:00', location: 'Main Stage', specialty: 'main stage only' },
            { day: 'wednesday', start: '07:00', end: '23:00', location: 'Main Stage', specialty: 'main stage only' }
        ],
        skills: ['Sound Engineering', 'Audio Equipment', 'Live Performance Support']
    }
];

// Backup staff assignments based on skills and availability
const backupAssignments = {
    'Security': {
        primary: 'Marcus Thompson',
        backups: ['Tom Anderson', 'Sarah Chen'],
        coverage: {
            'Tom Anderson': 'Sun-Tue 5am-3pm (overlaps Mon-Tue)',
            'Sarah Chen': 'Daily 8am-8pm (can coordinate security)'
        }
    },
    'Marketing': {
        primary: 'Elena Rodriguez',
        backups: ['Sarah Chen', 'Lisa Williams'],
        coverage: {
            'Sarah Chen': 'Daily coverage available',
            'Lisa Williams': 'Wed-Fri overlap for social media'
        }
    },
    'Coordination': {
        primary: 'Sarah Chen',
        backups: ['Emma Davis', 'Marcus Thompson'],
        coverage: {
            'Emma Davis': 'Daily 9am-5pm coverage',
            'Marcus Thompson': 'Mon-Wed morning coverage'
        }
    },
    'Technical/Photo Booth': {
        primary: 'David Park',
        backups: ['Jake Miller'],
        coverage: {
            'Jake Miller': 'Mon-Wed overlap, technical expertise'
        },
        notes: 'David is the only one trained on photo booth - needs to train backup'
    },
    'General Support': {
        primary: 'Lisa Williams',
        backups: ['Sarah Chen', 'Elena Rodriguez'],
        coverage: {
            'Sarah Chen': 'Can supervise and train',
            'Elena Rodriguez': 'Tue-Thu overlap for customer facing roles'
        }
    },
    'Setup/Physical': {
        primary: 'Tom Anderson',
        backups: ['Marcus Thompson'],
        coverage: {
            'Marcus Thompson': 'Mon-Wed overlap, security background'
        }
    },
    'First Aid': {
        primary: 'Emma Davis',
        backups: [],
        coverage: {},
        notes: 'CRITICAL: No backup first aid personnel. Need to arrange external medical support or train additional staff'
    },
    'Sound/Technical': {
        primary: 'Jake Miller',
        backups: ['David Park'],
        coverage: {
            'David Park': 'Mon-Wed overlap, technical background'
        }
    }
};

// Festival schedule template (can be customized)
const festivalDates = {
    start: '2024-07-15', // Monday
    end: '2024-07-21'     // Sunday
};

// Function to get staff member by ID
function getStaffById(id) {
    return staffData.find(staff => staff.id === id);
}

// Function to get staff by role
function getStaffByRole(role) {
    return staffData.filter(staff => staff.role.toLowerCase().includes(role.toLowerCase()));
}

// Function to generate calendar events from staff data
function generateCalendarEvents() {
    const events = [];
    const startDate = new Date('2024-07-15'); // Start of festival week
    
    staffData.forEach(staff => {
        staff.schedule.forEach(scheduleItem => {
            const dayOffset = getDayOffset(scheduleItem.day);
            const eventDate = new Date(startDate);
            eventDate.setDate(startDate.getDate() + dayOffset);
            
            const startDateTime = new Date(eventDate);
            const [startHour, startMin] = scheduleItem.start.split(':');
            startDateTime.setHours(parseInt(startHour), parseInt(startMin));
            
            const endDateTime = new Date(eventDate);
            const [endHour, endMin] = scheduleItem.end.split(':');
            endDateTime.setHours(parseInt(endHour), parseInt(endMin));
            
            events.push({
                title: `${staff.name} - ${scheduleItem.location}`,
                start: startDateTime,
                end: endDateTime,
                backgroundColor: staff.color,
                borderColor: staff.color,
                textColor: '#ffffff',
                extendedProps: {
                    staffId: staff.id,
                    staffName: staff.name,
                    role: staff.role,
                    location: scheduleItem.location,
                    break: scheduleItem.break,
                    trainer: scheduleItem.trainer,
                    specialty: scheduleItem.specialty,
                    required: scheduleItem.required
                }
            });
            
            // Add break events if specified
            if (scheduleItem.break) {
                const [breakStart, breakEnd] = scheduleItem.break.split('-');
                const [breakStartHour, breakStartMin] = breakStart.split(':');
                const [breakEndHour, breakEndMin] = breakEnd.split(':');
                
                const breakStartTime = new Date(eventDate);
                breakStartTime.setHours(parseInt(breakStartHour), parseInt(breakStartMin));
                
                const breakEndTime = new Date(eventDate);
                breakEndTime.setHours(parseInt(breakEndHour), parseInt(breakEndMin));
                
                events.push({
                    title: `${staff.name} - Lunch Break`,
                    start: breakStartTime,
                    end: breakEndTime,
                    backgroundColor: '#f59e0b',
                    borderColor: '#d97706',
                    textColor: '#ffffff',
                    extendedProps: {
                        staffId: staff.id,
                        staffName: staff.name,
                        type: 'break'
                    }
                });
            }
        });
    });
    
    return events;
}

// Helper function to convert day name to offset from Monday
function getDayOffset(dayName) {
    const days = {
        'sunday': -1,
        'monday': 0,
        'tuesday': 1,
        'wednesday': 2,
        'thursday': 3,
        'friday': 4,
        'saturday': 5
    };
    return days[dayName.toLowerCase()] || 0;
}

// Function to get day name from offset
function getDayName(offset) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const adjustedOffset = offset === -1 ? 6 : offset;
    return days[adjustedOffset] || 'Unknown';
}