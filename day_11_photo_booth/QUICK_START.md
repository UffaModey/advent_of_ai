# ⚡ Quick Start Guide

## Get Your Photo Booth Running in 5 Minutes!

This guide gets you up and running with the Fun House Photo Booth in the fastest way possible.

---

## 🚀 Super Quick Setup

### 1. Download or Clone

```bash
# Option A: Clone with git
git clone <repository-url>
cd photo-booth

# Option B: Download ZIP and extract
# Extract to a folder named "photo-booth"
```

### 2. Start a Local Server

**Choose ONE of these methods:**

```bash
# Python 3 (most common)
python -m http.server 8000

# Python 2 (if Python 3 unavailable)
python -m SimpleHTTPServer 8000

# Node.js (if you have it)
npx http-server

# PHP (if available)
php -S localhost:8000
```

### 3. Open in Browser

Visit: **http://localhost:8000**

### 4. Allow Camera Access

- Click "Allow" when prompted
- If no prompt appears, check your browser settings

### 5. Start Taking Photos!

- Choose a filter (❄️, 🦌, or 🎅)
- Position your face in the frame
- Click the camera button 📸
- Save your festive photo! 💾

---

## 📱 Mobile Quick Start

### Test on Your Phone

1. Find your computer's IP address:
   ```bash
   # On Mac/Linux:
   ifconfig | grep inet
   
   # On Windows:
   ipconfig
   ```

2. On your phone, visit: **http://YOUR-IP-ADDRESS:8000**
   (Replace YOUR-IP-ADDRESS with the actual IP)

3. Allow camera access when prompted

4. Take amazing selfies with festive filters!

---

## 🎯 What You'll See

### ✅ Success Checklist

When everything works, you should see:

- [ ] Camera preview appears (usually within 2-3 seconds)
- [ ] "Camera ready" message
- [ ] Four filter buttons (Original, Snow Crown, Reindeer, Santa Hat)
- [ ] Filter overlays appear when you select them
- [ ] Take Photo button captures the image
- [ ] Photo preview shows with the applied filter
- [ ] Save button downloads the photo

### ❌ Common Quick Fixes

**Camera not working?**
- Make sure you clicked "Allow" for camera permission
- Try refreshing the page (Cmd+R / Ctrl+R)
- Use Chrome, Safari, or Firefox

**No filters appearing?**
- Wait 5-10 seconds for face detection to load
- Make sure your face is visible and well-lit
- Filters will appear at fixed positions if face detection isn't available

**Can't save photos?**
- Check if your browser blocked the download
- Look for a download icon in the address bar
- Try right-clicking the photo and selecting "Save Image As"

---

## 🔧 Browser Requirements

### ✅ Fully Supported
- **Chrome** 70+ (Desktop & Mobile)
- **Safari** 12+ (Desktop & Mobile) 
- **iOS Safari** 12+ (iPhone & iPad)
- **Android Chrome** 70+

### ⚠️ Basic Support
- **Firefox** 68+ (Limited camera switching)
- **Edge** 79+ (Some features may be limited)

### ❌ Not Supported
- Internet Explorer
- Very old browsers (before 2018)

---

## 📁 File Overview

You only need these files:
```
photo-booth/
├── index.html          # Main app (open this in browser)
├── app.js              # Core functionality  
├── camera-utils.js     # Camera helpers
├── filters.js          # Face detection & filters
├── styles.css          # Styling
└── README.md          # Full documentation
```

**That's it!** Everything runs in your browser - no installation required.

---

## 🆘 Need Help?

### Instant Solutions

1. **Refresh the page** - Fixes 80% of issues
2. **Check camera permissions** - Look for camera icon in address bar  
3. **Try a different browser** - Chrome/Safari work best
4. **Check the console** - Press F12, look for red error messages

### Get More Help

- **Full Guide**: See [README.md](README.md)
- **Technical Issues**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)  
- **Developer Info**: See [TECHNICAL.md](TECHNICAL.md)

---

## 🎉 You're Ready!

If you can see your camera and take a photo with a filter, you're all set! The app is designed to work well on mobile devices, so grab your phone and start taking festive selfies.

**Have fun creating magical holiday memories! 📸🎄**