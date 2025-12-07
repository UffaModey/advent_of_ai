# Winter Festival Website ❄️

A beautiful, responsive one-page website for the Winter Festival 2025, featuring enchanting experiences, cozy treats, and unforgettable memories.

## 🎯 Project Overview

This website showcases the Winter Festival with sections for:
- **Hero Section** - Welcome message with call-to-action
- **About the Festival** - Information about the annual event
- **Festival Highlights** - Fortune Teller's Tent, Storyteller's Booth, Hot Cocoa Championship
- **Photo Gallery** - Beautiful images from the festival
- **Countdown Timer** - Anticipation for next year's event
- **Testimonials** - Visitor experiences and feedback
- **Location & Hours** - Event details and venue information

## 🎨 Design Features

- **Winter Color Palette** - Cool blues, whites, and soft gradients
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **CSS Animations** - Gentle snowfall effect and smooth hover animations
- **Modern Typography** - Clean fonts with proper spacing
- **Accessibility** - Semantic HTML and proper contrast ratios
- **Interactive Elements** - Smooth scrolling and mobile navigation

## 📁 Project Structure

```
festival-website/
├── index.html                 # Main website file
├── assets/
│   ├── css/
│   │   └── styles.css        # All styling and animations
│   └── images/               # Festival photos
│       ├── asif-ali-VlYf8w7JcoA-unsplash.jpg
│       ├── dominic-kurniawan-suryaputra-LpPW2FPypi0-unsplash.jpg
│       ├── ian-schneider-PAykYb-8Er8-unsplash.jpg
│       ├── thomas-lipke-oIuDXlOJSiE-unsplash.jpg
│       └── yue-iris-bSZjulW5eWI-unsplash.jpg
├── README.md                 # This file
└── netlify.toml             # Netlify deployment configuration
```

## 🚀 How to Deploy to Netlify

### Method 1: Drag & Drop Deployment (Easiest)

1. **Prepare the files:**
   - Ensure all files are in the `festival-website` folder
   - Zip the entire `festival-website` folder (or prepare for drag & drop)

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up for a free account (if you don't have one)
   - Click "Deploy to Netlify" on the main dashboard
   - Drag and drop the `festival-website` folder into the deployment area
   - Wait for deployment to complete (usually under 1 minute)

3. **Your site is live!**
   - Netlify will provide a random URL (e.g., `https://amazing-winter-festival-abc123.netlify.app`)
   - You can customize the URL in site settings if desired

### Method 2: GitHub + Netlify (Recommended for ongoing updates)

1. **Upload to GitHub:**
   - Create a new repository on GitHub
   - Upload the `festival-website` folder contents to the repository
   - Commit and push the files

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "New site from Git"
   - Choose GitHub as your Git provider
   - Select your repository
   - Set build command: (leave empty)
   - Set publish directory: `.` (current directory)
   - Click "Deploy site"

3. **Automatic updates:**
   - Any future changes pushed to the GitHub repository will automatically deploy to Netlify

## 🛠️ Local Development

To run the website locally:

1. **No build process required** - This is a static HTML/CSS/JavaScript website
2. **Open directly in browser:**
   - Navigate to the project folder
   - Double-click `index.html` to open in your default browser
   
3. **Or use a local server:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if you have npx)
   npx serve .
   ```
   Then visit `http://localhost:8000`

## 📱 Browser Support

- **Modern browsers:** Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile browsers:** iOS Safari, Android Chrome
- **Features:** CSS Grid, Flexbox, CSS Custom Properties (CSS Variables)
- **Fallbacks:** Graceful degradation for older browsers

## 🎨 Customization Guide

### Colors
The color palette is defined in CSS variables at the top of `styles.css`:
```css
:root {
    --winter-blue: #4A90E2;
    --ice-blue: #87CEEB;
    --snow-white: #FAFAFA;
    /* ... more colors */
}
```

### Content
All text content can be updated in `index.html`. The structure is semantic and easy to follow.

### Images
Replace images in the `assets/images/` folder. Update the image paths in `index.html` if using different filenames.

### Typography
Fonts are loaded from Google Fonts:
- Primary: Nunito (body text)
- Accent: Dancing Script (decorative headings)

## 📸 Image Credits

All images are from Unsplash:
- Festival entrance, storytelling, and winter scenes
- Images are optimized for web use
- Attribution included in image metadata

## 🔧 Technical Details

- **Framework:** Vanilla HTML/CSS/JavaScript (no dependencies)
- **CSS Features:** Custom properties, Grid, Flexbox, animations
- **JavaScript:** Minimal - only for navigation and simple interactions
- **Performance:** Optimized for fast loading
- **SEO:** Semantic HTML with proper meta tags

## 📞 Support

For questions about deployment or customization:
1. Check Netlify's excellent documentation
2. Review the code comments in the CSS file
3. Test changes locally before deploying

---

**© 2025 Winter Festival — Where Magic Meets Community ❄️**

Enjoy your beautiful winter festival website! 🎉
