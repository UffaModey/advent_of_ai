# Fun House Photo Booth MVP - 40 Minute Build Plan

## 🎯 MVP Goals

Build a functional festive photo booth web app that allows users to:
- Access their device camera
- Apply real-time face filters
- Capture and download photos with filters applied
- Have a delightful mobile-first experience

## ⚡ Core Features (40-Minute Scope)

### Phase 1: Foundation (10 minutes)
- **Camera Access**: Basic getUserMedia implementation
- **HTML Structure**: Simple, clean layout with camera preview
- **Mobile-First**: Responsive design from the start

### Phase 2: Face Detection (10 minutes) 
- **Library Integration**: face-api.js for lightweight face detection
- **Basic Detection**: Face landmarks identification
- **Performance**: Optimized for mobile devices

### Phase 3: Filter Implementation (15 minutes)
**Priority Filters** (choose 2-3 for MVP):
1. **Snowflake Crown** - Simple overlay on forehead area
2. **Reindeer Antlers** - Positioned above head
3. **Frosty Beard** - Overlay on chin/jaw area

### Phase 4: Capture & Polish (5 minutes)
- **Photo Capture**: Canvas-based image capture with filters
- **Download Feature**: One-click download functionality
- **Basic Error Handling**: Camera permission failures

## 🎨 Design Considerations

### Technical Constraints
- **Single Page Application**: Keep it simple - no routing needed
- **CDN Libraries**: Use face-api.js from CDN for quick setup
- **Canvas Rendering**: Overlay filters using HTML5 Canvas
- **Mobile Priority**: Touch-friendly controls, vertical layout

### User Experience
- **Instant Preview**: Real-time filter preview
- **Simple Controls**: Large, obvious buttons for mobile
- **Quick Loading**: Minimal dependencies, fast startup
- **Clear Instructions**: Visual cues for camera positioning

### Filter Strategy
- **Pre-built Assets**: Use simple PNG overlays with transparency
- **Fixed Positioning**: Basic face landmark mapping (no complex tracking)
- **Fallback Graceful**: App works even if face detection fails

## 📱 Mobile Optimizations
- Viewport meta tag for proper scaling
- Touch-friendly button sizes (44px minimum)
- Portrait orientation focus
- Simplified navigation

## 🚀 Success Metrics
- [ ] Camera loads within 3 seconds
- [ ] Face detection works on front-facing mobile camera
- [ ] At least 2 filters render correctly
- [ ] Photo capture produces downloadable image
- [ ] Works on iOS Safari and Android Chrome
- [ ] Basic documentation exists

## 🎭 Team Execution Order
1. **PM** - Validate requirements and setup project structure
2. **Core App Builder** - Camera access and basic HTML/JS foundation  
3. **Filter Engineer** - Face detection integration and filter overlays
4. **Stylist** - Mobile-responsive UI and festive styling
5. **QA** - Cross-device testing and critical bug fixes
6. **Performance Optimizer** - Loading speed and smoothness
7. **Documentation Writer** - User guide and setup instructions

---

*Remember: Better to have 2-3 working filters than 5 broken ones. Focus on core functionality first!*
