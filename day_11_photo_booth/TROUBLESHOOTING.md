# 🚨 Troubleshooting Guide

## Fun House Photo Booth - Common Issues & Solutions

This guide helps you resolve common issues with the Fun House Photo Booth application. Issues are organized by category with step-by-step solutions.

---

## 📋 Quick Diagnostic

### Check Your Setup
Before diving into specific issues, verify these basics:

- [ ] **Browser**: Chrome, Safari, or Firefox (see [browser support](#browser-compatibility))
- [ ] **Connection**: HTTPS or localhost (camera requires secure connection)
- [ ] **Permissions**: Camera access allowed in browser settings
- [ ] **Device**: Camera-enabled device with sufficient storage
- [ ] **Server**: Local web server running (not file:// protocol)

### Browser Console Check
1. Press `F12` (Windows/Linux) or `Cmd+Option+I` (Mac)
2. Click the **Console** tab
3. Look for error messages (red text)
4. Share error messages when seeking help

---

## 📹 Camera Issues

### ❌ Camera Not Starting

#### Symptom: "Initializing camera..." message never goes away

**Solution 1: Check Browser Permissions**
```
1. Look for camera icon in address bar
2. Click the icon and select "Allow"
3. Refresh the page (Cmd+R / Ctrl+R)
4. Grant permission when prompted
```

**Solution 2: Check Browser Settings**
- **Chrome**: Settings → Privacy and security → Site settings → Camera
- **Safari**: Preferences → Websites → Camera
- **Firefox**: Preferences → Privacy & Security → Permissions → Camera

**Solution 3: Close Other Camera Apps**
```
1. Close Zoom, Skype, FaceTime, or other camera apps
2. Close other browser tabs using camera
3. Restart browser if needed
4. Try again
```

**Solution 4: Check HTTPS Requirement**
```
✅ Works: https://yoursite.com or http://localhost:8000
❌ Fails: http://yoursite.com (non-localhost HTTP)

If hosting remotely, use HTTPS or ngrok for testing:
ngrok http 8000
```

### ❌ Camera Permission Denied

#### Symptom: "Camera Permission Denied" error message

**Solution 1: Reset Browser Permissions**

**Chrome:**
```
1. Go to chrome://settings/content/camera
2. Find your site in "Block" list
3. Click trash icon to remove
4. Refresh page and try again
```

**Safari:**
```
1. Safari → Preferences → Websites → Camera
2. Find your site and change to "Allow"
3. Refresh page
```

**Firefox:**
```
1. Click shield icon in address bar
2. Click "Turn off blocking for this site"
3. Refresh page and grant permission
```

**Solution 2: Incognito/Private Mode**
```
1. Open incognito/private browser window
2. Navigate to the app
3. Grant camera permission
4. If it works, clear cookies/data for your site
```

**Solution 3: Hardware Check**
```
1. Test camera in other apps (Photo Booth, Camera app)
2. Check if camera LED turns on
3. Try different browser
4. Restart computer if needed
```

### ❌ Poor Camera Quality

#### Symptom: Blurry or pixelated camera feed

**Solution 1: Lighting & Environment**
```
✅ Good lighting (natural light preferred)
✅ Clean camera lens
✅ Stable positioning
❌ Avoid backlighting
❌ Avoid dim environments
```

**Solution 2: Browser Optimization**
```
1. Close other tabs and apps
2. Restart browser
3. Clear browser cache:
   - Chrome: Ctrl+Shift+Delete
   - Safari: Cmd+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
4. Try different browser
```

**Solution 3: Reduce Quality Settings (if needed)**
```javascript
// Open browser console and run:
photoBoothApp.video.srcObject.getVideoTracks()[0].applyConstraints({
    width: { ideal: 640 },
    height: { ideal: 480 }
});
```

### ❌ Camera Switching Not Working

#### Symptom: "Flip Camera" button doesn't switch cameras

**Solution 1: Check Device Support**
```
- Front camera: Usually supported on all devices
- Rear camera: May not be available on some computers
- Multiple cameras: Required for switching functionality
```

**Solution 2: Browser Compatibility**
```
✅ Chrome: Full support
✅ Safari: Full support  
⚠️ Firefox: Limited support on mobile
⚠️ Edge: Partial support

Try Chrome or Safari if using Firefox
```

**Solution 3: Reset Camera**
```
1. Close app tab
2. Wait 10 seconds
3. Reopen app
4. Try camera switch again
```

---

## 🎭 Filter Issues

### ❌ Filters Not Appearing

#### Symptom: Filter buttons work but no overlay appears

**Solution 1: Wait for Face Detection**
```
1. Wait 5-10 seconds after camera starts
2. Look for "Loading face detection..." message
3. Ensure face is clearly visible and well-lit
4. Try moving closer to camera
```

**Solution 2: Check Face-API.js Loading**
```
1. Open browser console (F12)
2. Look for these messages:
   ✅ "Face detection ready"
   ❌ "face-api.js not loaded"
3. If not loaded, refresh page and wait longer
```

**Solution 3: Use Fallback Mode**
```
If face detection fails, filters use fixed positions:
- Position face in center of screen
- Filters appear at default locations
- Still works for photo capture
```

**Solution 4: Network Issues**
```
1. Check internet connection
2. Try different network
3. Disable ad blockers (may block CDN)
4. Wait longer for models to download
```

### ❌ Filters Positioned Incorrectly

#### Symptom: Filters appear in wrong location on face

**Solution 1: Improve Face Detection**
```
✅ Face directly facing camera
✅ Good lighting on face
✅ Remove glasses/hats temporarily
✅ Only 1-2 faces in frame
❌ Avoid side angles
❌ Avoid shadows on face
```

**Solution 2: Face Detection Troubleshooting**
```
1. Ensure face fills about 1/3 of camera view
2. Look directly at camera
3. Avoid rapid movements
4. Wait for detection to stabilize (2-3 seconds)
```

**Solution 3: Manual Positioning (Fallback)**
```
If face detection struggles:
1. Filters will use fixed positions
2. Position your face to match filter location
3. Still works for capturing photos
4. Consider this normal on older devices
```

### ❌ Filter Performance Issues

#### Symptom: Choppy filter rendering or lag

**Solution 1: Close Other Apps**
```
1. Close unnecessary browser tabs
2. Close other applications
3. Ensure device isn't overheating
4. Try restarting browser
```

**Solution 2: Reduce Processing**
```javascript
// Open console and disable face detection:
if (window.photoBoothApp && window.photoBoothApp.filterSystem) {
    window.photoBoothApp.filterSystem.stopFaceDetection();
}
// Filters will use fixed positions instead
```

**Solution 3: Device Performance**
```
Lower-end devices: Filters may render at lower frame rate
This is normal behavior to maintain stability
Photo capture quality is not affected
```

---

## 📸 Photo Capture Issues

### ❌ Photo Capture Fails

#### Symptom: Camera button doesn't work or shows error

**Solution 1: Wait for Camera Ready**
```
1. Ensure "Take Photo" button is not grayed out
2. Wait for "Camera ready" status message
3. Don't click button multiple times rapidly
```

**Solution 2: Memory Issues**
```
1. Close other tabs and apps
2. Refresh the page
3. Try taking photo immediately after page loads
4. Restart browser if needed
```

**Solution 3: Browser Console Check**
```
1. Open console (F12)
2. Try taking photo
3. Look for error messages
4. Common errors:
   - Canvas memory limit
   - Video not ready
   - Stream disconnected
```

### ❌ Photo Download Problems

#### Symptom: Photo preview appears but won't download

**Solution 1: Browser Download Settings**
```
Chrome:
1. Settings → Advanced → Downloads
2. Enable "Ask where to save files"
3. Check if download was blocked (look for icon in address bar)

Safari:
1. Preferences → General → File download location
2. Choose "Downloads" folder
3. Disable popup blocker for this site
```

**Solution 2: Alternative Download Methods**

**Method A: Right-click Save**
```
1. Take photo normally
2. When preview appears, right-click the image
3. Select "Save Image As..."
4. Choose location and save
```

**Method B: Manual Save**
```
1. Take photo
2. Photo opens in new window with instructions
3. Follow on-screen instructions for your device
```

**Solution 3: Storage Space**
```
1. Check device storage space
2. Clear Downloads folder if full
3. Try downloading to different location
```

### ❌ Photo Quality Issues

#### Symptom: Captured photos are blurry or low quality

**Solution 1: Camera Positioning**
```
✅ Hold device steady during capture
✅ Good lighting conditions
✅ Clean camera lens
✅ Face well-positioned in frame
❌ Avoid movement during capture
```

**Solution 2: Technical Issues**
```
1. Refresh page and try again
2. Close other camera apps
3. Restart browser
4. Check if camera is overheating
```

**Solution 3: Browser Performance**
```
1. Use latest version of Chrome or Safari
2. Close unnecessary tabs
3. Clear browser cache
4. Try incognito/private mode
```

---

## 🌐 Browser Compatibility Issues

### Chrome Issues

**Problem: Camera not starting in Chrome**
```
Solution:
1. Update Chrome to latest version
2. Check chrome://settings/content/camera
3. Ensure site has camera permission
4. Try incognito mode
5. Disable camera-blocking extensions
```

**Problem: Download not working in Chrome**
```
Solution:
1. Check if download was blocked (address bar icon)
2. Chrome settings → Privacy → Site settings → Automatic downloads
3. Allow automatic downloads for your site
```

### Safari Issues

**Problem: Camera preview black screen**
```
Solution:
1. Safari → Preferences → Websites → Camera → Allow
2. Refresh page
3. Check iOS Safari: Settings → Safari → Camera access
4. Try different website (test on localhost first)
```

**Problem: Filters not rendering on Safari**
```
Solution:
1. Ensure JavaScript is enabled
2. Update Safari to latest version
3. Clear website data
4. Disable content blockers
```

### Firefox Issues

**Problem: Limited camera switching**
```
Solution:
1. This is a known Firefox limitation
2. Use Chrome or Safari for full functionality
3. Basic camera and filters still work
```

**Problem: Face detection not loading**
```
Solution:
1. Check Firefox privacy settings
2. Disable tracking protection for this site
3. Allow third-party cookies for CDN access
```

### Mobile Browser Issues

**Problem: Orientation changes causing issues**
```
Solution:
1. Refresh page after orientation change
2. Keep device in portrait mode for best experience
3. Wait a few seconds after rotating device
```

**Problem: Touch controls not responsive**
```
Solution:
1. Ensure device has adequate touch calibration
2. Try different finger or stylus
3. Restart browser app
4. Clear browser cache
```

---

## 📱 Mobile-Specific Issues

### iOS Issues

**Problem: Camera permission popup not appearing**
```
Solution:
1. iOS Settings → Safari → Camera → Ask
2. Delete website data for your site
3. Refresh page and wait for prompt
4. Grant permission when asked
```

**Problem: Photo download not working on iOS**
```
Solution:
1. Long-press the photo in preview
2. Select "Save to Photos" or "Save Image"
3. Or use the share button to save to Files app
```

**Problem: App feels sluggish on older iPhones**
```
Solution:
1. Close other apps running in background
2. Restart Safari
3. Use simplified mode (disable face detection in console)
4. Consider using newer device for optimal experience
```

### Android Issues

**Problem: Camera orientation incorrect**
```
Solution:
1. Enable screen rotation
2. Refresh page
3. Hold device upright
4. Try switching to front camera
```

**Problem: Filter rendering choppy**
```
Solution:
1. Enable hardware acceleration in browser
2. Close background apps
3. Free up device storage
4. Restart device if needed
```

---

## ⚡ Performance Issues

### Slow Loading

**Problem: App takes long time to start**
```
Typical load times:
✅ Good connection: 2-3 seconds
⚠️ Slow connection: 5-10 seconds
❌ Very slow: 10+ seconds

Solutions:
1. Check internet speed
2. Try different network
3. Wait longer for face detection models
4. Disable ad blockers
5. Clear browser cache
```

### High CPU/Battery Usage

**Problem: Device getting hot or battery draining quickly**
```
Solutions:
1. Close other apps
2. Reduce screen brightness
3. Use power saving mode
4. Take breaks between usage
5. Disable face detection if needed:
```

```javascript
// In browser console:
photoBoothApp.filterSystem.stopFaceDetection();
```

### Memory Issues

**Problem: Browser becomes unresponsive**
```
Solutions:
1. Refresh page
2. Restart browser
3. Close other tabs
4. Clear browser cache
5. Restart device
```

**Warning Signs:**
- Browser tab becomes sluggish
- Camera preview freezes
- Filter rendering stops
- Photo capture fails

---

## 🛠️ Advanced Debugging

### Developer Console Commands

**Check App Status:**
```javascript
// Basic app info
console.log('App status:', {
    cameraReady: !photoBoothApp.video.paused,
    currentFilter: photoBoothApp.currentFilter,
    faceDetection: photoBoothApp.faceDetectionEnabled
});

// Performance metrics
console.log('Performance:', photoBoothApp.getPerformanceMetrics());
```

**Reset Camera:**
```javascript
// Force camera restart
photoBoothApp.cleanup();
photoBoothApp.init();
```

**Test Filter System:**
```javascript
// Check filter system
console.log('Filter system:', {
    active: photoBoothApp.filterSystem?.faceDetectionActive,
    detected: photoBoothApp.filterSystem?.lastDetectedFaces?.length || 0
});
```

### Network Debugging

**Check CDN Loading:**
```javascript
// Check if face-api.js loaded
console.log('Face API loaded:', typeof faceapi !== 'undefined');

// Check model loading
if (typeof faceapi !== 'undefined') {
    console.log('Face models loaded:', faceapi.nets);
}
```

**Network Panel (F12 → Network):**
- Look for failed requests (red entries)
- Check face-api.js and model files loading
- Verify all resources load successfully

### Canvas Debugging

**Check Canvas Setup:**
```javascript
// Canvas dimensions
console.log('Canvas info:', {
    display: photoBoothApp.canvasDisplaySize,
    actual: photoBoothApp.canvasActualSize,
    video: photoBoothApp.videoSize
});

// Test canvas alignment
console.log('Canvas aligned:', photoBoothApp.validateCanvasAlignment());
```

---

## 📞 Getting Help

### Before Reporting Issues

Please collect this information:

1. **Device & Browser:**
   ```
   Device: iPhone 13 Pro / MacBook Pro / etc.
   Browser: Safari 15.2 / Chrome 96 / etc.
   OS: iOS 15.2 / macOS 12.1 / etc.
   ```

2. **Console Errors:**
   - Open browser console (F12)
   - Copy any red error messages
   - Include full error text

3. **Steps to Reproduce:**
   - List exact steps that cause the issue
   - Include which filter was selected
   - Note if issue happens consistently

4. **Network Environment:**
   ```
   Connection: WiFi / 4G / 5G
   Speed: [run speed test]
   Location: localhost / https://domain.com
   ```

### Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `NotAllowedError` | Camera permission denied | Grant permission in browser settings |
| `NotFoundError` | No camera detected | Check camera connection |
| `NotReadableError` | Camera in use | Close other camera apps |
| `OverconstrainedError` | Camera settings invalid | Try different browser |
| `TypeError` | Browser not supported | Use supported browser |

### Self-Help Resources

1. **Browser Developer Tools** (F12)
   - Console tab for error messages
   - Network tab for loading issues
   - Performance tab for speed issues

2. **Test Sites:**
   - **WebRTC Test:** https://test.webrtc.org/
   - **Camera Test:** https://webcamtests.com/
   - **Browser Support:** https://caniuse.com/

3. **Alternative Browsers:**
   - Try Chrome, Safari, or Firefox
   - Test in incognito/private mode
   - Compare desktop vs mobile behavior

---

## ✅ Success Checklist

If everything works correctly, you should see:

- [ ] ✅ Camera preview appears within 3 seconds
- [ ] ✅ "Camera ready" status message
- [ ] ✅ Filter buttons change camera overlay
- [ ] ✅ Filters position correctly on face
- [ ] ✅ Take Photo button captures image
- [ ] ✅ Photo preview shows image with filter
- [ ] ✅ Save button downloads photo file
- [ ] ✅ No console errors (red messages)

**If all items are checked, you're ready to take amazing festive photos! 📸🎄**

---

*Remember: Most issues can be resolved by refreshing the page, checking permissions, or trying a different browser. The app is designed to work reliably on modern mobile devices with proper setup.*