# 🚀 Quick Start Guide - Festival Staff Scheduler

Get up and running with the Festival Staff Scheduler in just 5 minutes!

## ⚡ Instant Setup (No Installation Required)

### Option 1: Direct Browser Access
1. **Download** the project files to your computer
2. **Navigate** to the `webapp` folder
3. **Double-click** `index.html` to open in your browser
4. **Start scheduling** immediately!

### Option 2: Local Web Server (Recommended for Teams)
```bash
# If you have Python installed:
cd webapp
python -m http.server 8000

# Then open: http://localhost:8000
```

```bash
# If you have Node.js installed:
cd webapp
npx serve .

# Follow the provided URL
```

## 🎯 First Steps

### 1. **Explore the Interface**
The application has 4 main sections accessible via tabs:
- 📅 **Calendar View** - Visual schedule overview
- 👥 **Staff Directory** - Contact information
- 👤 **Individual Schedules** - Personal schedule views  
- 🛡️ **Backup Coverage** - Coverage analysis

### 2. **View Sample Data**
The app comes pre-loaded with festival staff data:
- 8 staff members with different roles and schedules
- Complete contact information
- Realistic availability patterns
- Backup coverage assignments

### 3. **Try Key Features**
- **Click** on calendar events to see details
- **Select** a staff member in Individual Schedules
- **Print** any view using the print buttons
- **Export** schedule data to CSV

## 📋 Essential Tasks

### ✅ **5-Minute Checklist**

#### **Calendar View**
- [ ] Click on the Calendar tab
- [ ] Browse through the weekly schedule
- [ ] Click on any colored event block to see staff details
- [ ] Try switching between Month/Week/Day views
- [ ] Check the Staff Legend on the right

#### **Staff Directory**
- [ ] Click on the Staff Directory tab
- [ ] Review staff contact cards
- [ ] Click "Edit Contact" on any staff member
- [ ] Update a phone number and save
- [ ] Notice how changes reflect across the app

#### **Individual Schedules**
- [ ] Click on Individual Schedules tab
- [ ] Select "Sarah Chen - Coordinator" from dropdown
- [ ] Review her detailed schedule
- [ ] Click "Print" to see print preview
- [ ] Try selecting different staff members

#### **Backup Coverage**
- [ ] Click on Backup Coverage tab
- [ ] Review the coverage overview statistics
- [ ] Expand different role sections
- [ ] Click "Generate Report" for detailed analysis
- [ ] Note any critical gaps highlighted

#### **Print Features**
- [ ] Try printing from each tab
- [ ] Use keyboard shortcut `Ctrl+P` (or `Cmd+P` on Mac)
- [ ] Preview different print formats
- [ ] Test the CSV export feature

## 🎨 Customization Quick Start

### **Update Festival Dates**
Edit `webapp/js/data.js`:
```javascript
const festivalDates = {
    start: '2024-07-15',  // ← Change to your event start
    end: '2024-07-21'     // ← Change to your event end
};
```

### **Add New Staff Member**
Add to the `staffData` array in `webapp/js/data.js`:
```javascript
{
    id: 'new_staff',
    name: 'Your Staff Name',
    role: 'Position Title',
    availability: 'Mon-Wed 9am-5pm',
    preferences: 'Any special requirements',
    color: '#ff6b6b',  // Choose a unique color
    contact: {
        phone: '(555) 123-4567',
        email: 'staff@yourevent.com',
        emergency: '(555) 987-6543'
    },
    schedule: [
        {
            day: 'monday',
            start: '09:00',
            end: '17:00',
            location: 'Main Stage'
        }
    ],
    skills: ['Customer Service', 'Setup']
}
```

### **Update Organization Info**
Edit the header in `webapp/index.html`:
```html
<h1 class="mb-0">
    <i class="fas fa-calendar-alt me-2"></i>
    Your Event Name Scheduler  <!-- ← Change this -->
</h1>
<p class="mb-0">Your event description</p>  <!-- ← And this -->
```

## 🖱️ Essential Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+1` | Calendar View |
| `Ctrl+2` | Staff Directory |
| `Ctrl+3` | Individual Schedules |
| `Ctrl+4` | Backup Coverage |
| `Ctrl+P` | Print Current View |
| `Ctrl+E` | Export Schedule (CSV) |
| `F5` | Refresh Application |

*Use `Cmd` instead of `Ctrl` on Mac*

## 📱 Mobile Usage

The app is fully responsive! On mobile devices:
- **Swipe** to navigate calendar views
- **Tap** events for details
- **Use** landscape mode for better calendar viewing
- **Print** functionality works with mobile browsers

## 🎯 Common Use Cases

### **For Festival Managers**
1. **Print** individual schedules for each staff member
2. **Export** CSV data for payroll or external systems
3. **Review** backup coverage to identify gaps
4. **Generate** emergency contact lists

### **For Staff Members**
1. **View** personal schedule in Individual Schedules tab
2. **Print** personal schedule for reference
3. **Check** contact information for colleagues
4. **See** backup assignments and training requirements

### **For Emergency Coordinators**
1. **Access** emergency contacts quickly
2. **Print** emergency contact list
3. **Review** critical role coverage (First Aid, Security)
4. **Check** backup staff availability

## ⚠️ Important Notes

### **Data Persistence**
- Data changes are saved in browser localStorage
- Changes persist between browser sessions
- Use Export feature to backup your data
- Clear browser data will reset to sample data

### **Printing Tips**
- Use **landscape orientation** for calendar prints
- **Portrait orientation** works best for individual schedules
- Modern browsers provide best print quality
- PDF printing preserves colors and formatting

### **Browser Compatibility**
- Works best in **Chrome, Firefox, Safari, Edge**
- Requires **JavaScript enabled**
- Internet connection needed for initial load (CDN resources)
- Mobile browsers fully supported

## 🐛 Quick Troubleshooting

### **Calendar Not Showing**
- Check browser console for errors (F12)
- Verify internet connection (needs CDN access)
- Try refreshing the page (F5)
- Ensure JavaScript is enabled

### **Print Formatting Issues**
- Use print preview to check layout
- Try different browsers if formatting looks wrong
- Landscape mode usually works better for calendars
- PDF printing often gives better results

### **Data Not Updating**
- Check if changes are being saved to localStorage
- Try refreshing the page
- Clear browser cache if needed
- Verify you're not in private/incognito mode

### **Mobile Display Problems**
- Try landscape orientation
- Ensure viewport zoom is at 100%
- Some features work better on larger screens
- Print functionality available but may vary by mobile browser

## 🚀 Next Steps

### **Immediate Actions**
1. ✅ Complete the 5-minute checklist above
2. 🎨 Customize with your event information
3. 📝 Replace sample staff data with real data
4. 🖨️ Test printing with your printer setup

### **For Production Use**
1. **Backup** your customized data using Export function
2. **Test** all features with your actual staff information
3. **Train** staff on using Individual Schedules view
4. **Prepare** printed emergency contact lists

### **Advanced Features**
1. **Explore** backup coverage analysis
2. **Customize** colors and styling in CSS
3. **Add** additional staff roles and skills
4. **Integrate** with existing event management workflows

## 🆘 Getting Help

### **Quick Reference**
- All staff data is in `webapp/js/data.js`
- Styling can be modified in `webapp/css/styles.css`
- Print settings are in the print-specific CSS sections

### **Common Questions**
- **Q: Can I add more staff?** A: Yes, edit the staffData array in data.js
- **Q: Can I change colors?** A: Yes, update the color property for each staff member
- **Q: Does it work offline?** A: Yes, after initial load (CDNs cache)
- **Q: Can I backup my data?** A: Yes, use the Export feature in the app

### **Need More Help?**
- Check the full README.md for detailed documentation
- Review the inline comments in the JavaScript files
- Test with sample data first before adding real information
- Use browser developer tools (F12) to debug issues

---

**🎉 You're Ready to Go!**

The Festival Staff Scheduler is now ready to help manage your event. Start with the sample data, explore all features, then customize for your specific needs.

*Happy scheduling! 🎪*