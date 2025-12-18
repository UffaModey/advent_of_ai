# Festival Staff Scheduler 🎪

A comprehensive web-based staff scheduling application designed for festivals and events. Manage staff schedules, contact information, backup coverage, and generate printable schedules with an intuitive, professional interface.

![Festival Staff Scheduler](https://img.shields.io/badge/Status-Ready%20for%20Production-green)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### 📅 **Interactive Calendar View**
- **Weekly/Daily Schedule Display**: Visual calendar showing all staff assignments
- **Color-Coded Staff**: Each staff member has a unique color for easy identification
- **Interactive Events**: Click on any schedule block to see detailed information
- **Quick Stats**: Real-time statistics showing total staff, shifts, and coverage hours
- **Multiple Views**: Switch between month, week, and day views

### 👥 **Staff Directory & Contact Management**
- **Complete Staff Profiles**: Name, role, skills, availability, and preferences
- **Contact Information**: Phone numbers, email addresses, and emergency contacts
- **Editable Details**: Update contact information with inline editing
- **Professional Cards**: Clean, organized staff profile cards
- **Skills Tracking**: Monitor staff capabilities and specializations

### 👤 **Individual Schedule Generation**
- **Personal Schedule View**: Filter schedules by individual staff member
- **Detailed Information**: Shows times, locations, breaks, training requirements
- **Schedule Statistics**: Total hours, working days, average daily hours, peak times
- **Backup Information**: Shows who can cover for each staff member
- **Print-Ready Format**: Generate professional individual schedules

### 🛡️ **Backup Coverage System**
- **Comprehensive Analysis**: Identifies backup staff for each role
- **Coverage Gap Detection**: Automatically finds scheduling vulnerabilities
- **Smart Recommendations**: Suggests improvements for better coverage
- **Critical Role Identification**: Highlights roles with insufficient backup
- **Coverage Matrix**: Visual representation of backup relationships

### 🖨️ **Professional Printing**
- **Print-Optimized Layouts**: Clean, professional print formatting
- **Multiple Print Options**: Calendar view, individual schedules, staff directory
- **Emergency Contact Lists**: Quick-reference emergency information
- **Backup Coverage Reports**: Detailed analysis reports for management

### 📊 **Data Management**
- **CSV Export**: Export schedules and staff data for external use
- **Data Import/Export**: Backup and restore application data
- **Real-time Updates**: Changes reflect immediately across all views
- **Error Handling**: Robust error management with user notifications

## 🚀 Quick Start

See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

### Instant Setup
1. Download or clone this repository
2. Open `webapp/index.html` in your web browser
3. Start managing your staff schedules immediately!

## 📋 System Requirements

### **Browser Compatibility**
- **Chrome/Edge**: Version 90+ (Recommended)
- **Firefox**: Version 88+
- **Safari**: Version 14+
- **Mobile Browsers**: iOS Safari, Chrome Mobile

### **Internet Connection**
- Required for initial load (CDN resources)
- Offline functionality available after first load

### **Screen Resolution**
- **Desktop**: 1024x768 minimum (1920x1080 recommended)
- **Tablet**: 768x1024 supported
- **Mobile**: 375x667 supported (responsive design)

## 🏗️ Technology Stack

### **Frontend Technologies**
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Modern JavaScript features
- **Bootstrap 5.3**: Responsive UI framework
- **FullCalendar 6.x**: Interactive calendar component
- **Font Awesome 6.x**: Professional icon library

### **Architecture**
- **Client-Side Application**: No server required
- **Modular JavaScript**: Organized into functional modules
- **JSON Data Structure**: Lightweight data management
- **Progressive Enhancement**: Works without JavaScript for basic functionality

## 📖 Usage Guide

### **Navigation**
- **Calendar View**: Main schedule overview with all staff
- **Staff Directory**: Contact information and staff details
- **Individual Schedules**: Personal schedule views
- **Backup Coverage**: Analysis and management of backup staff

### **Keyboard Shortcuts**
- `Ctrl/Cmd + 1-4`: Switch between tabs
- `Ctrl/Cmd + P`: Print current view
- `Ctrl/Cmd + E`: Export schedule (Calendar view)
- `F5`: Refresh application data

### **Printing Options**
1. **Calendar View**: Complete weekly/daily schedule
2. **Individual Schedules**: Personal schedule for each staff member
3. **Staff Directory**: Contact information and emergency contacts
4. **Backup Reports**: Coverage analysis and recommendations

## 🎯 Use Cases

### **Festival Management**
- Music festivals, art fairs, cultural events
- Multi-day events with complex scheduling needs
- Large volunteer coordination

### **Event Planning**
- Corporate events and conferences
- Wedding and party coordination
- Community events and fundraisers

### **Venue Management**
- Theaters and performance venues
- Sports facilities and recreation centers
- Museums and cultural institutions

### **Service Industries**
- Restaurant and hospitality staffing
- Retail shift management
- Healthcare facility scheduling

## 🔧 Customization

### **Adding New Staff**
```javascript
// Example staff member object
const newStaff = {
    id: 'unique_id',
    name: 'Staff Name',
    role: 'Position Title',
    availability: 'Mon-Fri 9am-5pm',
    preferences: 'Any special notes',
    contact: {
        phone: '(555) 123-4567',
        email: 'staff@example.com',
        emergency: '(555) 987-6543'
    },
    schedule: [
        {
            day: 'monday',
            start: '09:00',
            end: '17:00',
            location: 'Work Area',
            break: '12:00-13:00'  // Optional
        }
    ],
    skills: ['Skill 1', 'Skill 2']
};
```

### **Color Customization**
Edit the CSS custom properties in `css/styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #64748b;
    /* Add more color customizations */
}
```

### **Festival Dates**
Update the festival dates in `js/data.js`:
```javascript
const festivalDates = {
    start: '2024-07-15',  // Change to your event start date
    end: '2024-07-21'     // Change to your event end date
};
```

## 🛠️ Development

### **File Structure**
```
webapp/
├── index.html              # Main application file
├── css/
│   └── styles.css         # Application styles and print CSS
└── js/
    ├── data.js            # Staff data and configuration
    ├── calendar.js        # Calendar functionality
    ├── staff.js          # Staff directory features
    ├── individual.js     # Individual schedule viewer
    ├── backup.js         # Backup coverage system
    ├── print.js          # Printing functionality
    └── main.js           # Application initialization
```

### **Key Functions**
- `initializeApp()`: Application startup
- `generateCalendarEvents()`: Creates calendar data
- `renderStaffDirectory()`: Builds staff cards
- `loadIndividualSchedule()`: Individual schedule display
- `renderBackupCoverage()`: Backup analysis

### **Data Management**
All staff data is stored in JavaScript objects in `js/data.js`. This allows for:
- Easy customization without database setup
- Quick deployment and testing
- Offline functionality
- Simple backup and restore

## 📝 Sample Data

The application comes pre-loaded with sample festival staff data including:

- **Marcus Thompson** (Security) - Morning coverage Mon-Wed
- **Elena Rodriguez** (Marketing) - Weekday coverage, no weekends
- **Sarah Chen** (Coordinator) - Daily coverage with lunch breaks
- **David Park** (Tech/Photo Booth) - Specialized technical role
- **Lisa Williams** (Volunteer) - New staff requiring training
- **Tom Anderson** (Setup Crew) - Early morning physical setup
- **Emma Davis** (First Aid) - Critical daily coverage
- **Jake Miller** (Sound Tech) - Main stage specialist

## 🤝 Contributing

### **Bug Reports**
1. Check existing issues
2. Provide detailed description
3. Include browser/version information
4. Add steps to reproduce

### **Feature Requests**
1. Describe the feature and use case
2. Explain the expected behavior
3. Consider backward compatibility

### **Code Contributions**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🔒 Privacy & Security

### **Data Storage**
- All data stored locally in browser
- No server-side data collection
- No external data transmission
- User controls all information

### **Contact Information**
- Staff contact details remain private
- Emergency contacts for authorized personnel only
- Print only when necessary

## 📞 Support

### **Documentation**
- See `QUICKSTART.md` for setup instructions
- Check inline code comments for technical details
- Review sample data in `js/data.js`

### **Troubleshooting**
1. **Calendar not loading**: Check browser console for JavaScript errors
2. **Print formatting issues**: Ensure print stylesheets are loaded
3. **Data not saving**: Application uses local storage; check browser settings
4. **Mobile display problems**: Test in mobile device or browser dev tools

### **Browser Issues**
- Clear browser cache and reload
- Disable browser extensions temporarily
- Check JavaScript is enabled
- Verify internet connection for CDN resources

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### **Third-Party Libraries**
- **FullCalendar**: Calendar display and interaction
- **Bootstrap**: Responsive UI framework  
- **Font Awesome**: Professional icons

### **Inspiration**
Built to address real-world festival and event management challenges, focusing on usability, accessibility, and professional presentation.

---

**Made with ❤️ for festival organizers and event managers worldwide**

*Last updated: December 2024*