# Gesture-Controlled Flight Tracker  
## The Homecoming Board – Winter Festival Edition

A magical, touchless, gesture-controlled display that shows real-time flight arrivals and departures for selected airports. Built with MediaPipe hand tracking, real flight data, and a clean winter-themed interface.

---

## Project Overview

Build a browser-based flight tracker that uses MediaPipe for hand tracking and gesture recognition. Users interact entirely through predefined hand signals captured by their webcam.  
The interface should feel magical, intuitive, and winter-themed, with smooth animations and clean layout.

---

## Core Features

1. Real-time arrivals and departures from at least one airport  
2. Hand-gesture navigation using MediaPipe Hands  
3. Webcam-powered hand tracking  
4. Winter/holiday themed, clean UI  
5. Visual gesture feedback  
6. Expanded flight detail view  
7. Airport switching  
8. Smooth UI transitions and animations

---

## Gesture Controls

The following gestures must trigger these actions:

1. **🤙 Shaka**  
   Action: Load live arrivals for the currently selected airport

2. **👌 OK Sign**  
   Action: Load live departures

3. **🖐️ Wave Hand**  
   Action: Navigate the interface (scroll or move focus)

4. **✊ Closed Fist**  
   Action: Select the highlighted flight and open the expanded detail view

5. **🖖 Vulcan Sign**  
   Action: Leave the detail view and return to the main menu

6. **✌️ Peace Sign**  
   Action: Refresh flight data from the API

7. **🤘 Rock-On Sign**  
   Action: Switch between airports

---

## Technical Requirements

1. Use MediaPipe Hands for real-time landmark tracking (30–60 FPS)  
2. Implement gesture detection via finger curl, landmark position, or angle rules  
3. Use AviationStack 
4. Handle CORS (use a proxy if required)  
5. Mirror video and landmark overlay if hand appears reversed  
6. Debounce gesture detection (200–400 ms)  
7. Cache API results to avoid rate-limit issues  
8. Provide clear visual feedback for recognized gestures  
9. Must run fully in the browser (no server required)

---

## Interface & Design Requirements

**Theme:** Winter Festival / Holiday  
**Style:** Clean, calm, elegant

Design guidelines:
- Use soft blues, whites, golds, and subtle snow textures  
- Optional light snow particle background  
- Large, readable typography suitable for a public display board  
- Smooth animations between screens and states  
- Clearly highlighted selection when a flight is focused  
- Hand tracking overlay in a corner (optional toggle)  
- Small visual gesture indicator appears when a gesture is recognized  
- Panels required:
  - Main flight list (arrivals/departures)  
  - Expanded flight detail view  
  - Airport switching state

Flight list items must include:
- Flight number  
- Airline  
- Origin or destination  
- Scheduled and estimated times  
- Status

---

## Suggested Architecture

1. HTML, CSS, JavaScript frontend  
2. MediaPipe Hands running in-browser  
3. Gesture classifier module  
4. Flight API module  
5. Cache layer  
6. UI renderer with clean state management  
7. Optional: Web Speech API for voice feedback

---

## Implementation Tips

- Start with highly distinct gestures to reduce misclassification  
- Keep MediaPipe detection confidence around 0.7  
- Reduce smoothing for faster responsiveness  
- Cache API responses for several minutes  
- Ensure layout scales for large screens  
- Add subtle UI animations for a magical feel

---

## Deliverables

Goose should output:

1. Fully functional browser app  
2. Clean, readable code with comments  
3. Winter/holiday styled UI  
4. Integrated hand gesture detection  
5. Real flight data fetch and display  
6. Expanded flight-view feature  
7. Airport switching  
8. Gesture feedback visuals  
9. Optional: sound and voice feedback  
10. All files and instructions needed to run locally

