#!/usr/bin/env python3
"""
Simple HTTP server for testing the Gesture-Controlled Flight Tracker
Serves the application locally with CORS headers for MediaPipe
"""

import http.server
import socketserver
import os
import webbrowser
import argparse
from pathlib import Path

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with CORS support"""
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

def serve_app(port=8000, open_browser=True):
    """Serve the flight tracker application"""
    
    # Change to project directory
    project_dir = Path(__file__).parent
    os.chdir(project_dir)
    
    print(f"🚀 Starting Flight Tracker Server...")
    print(f"📁 Serving from: {project_dir}")
    print(f"🌐 Server URL: http://localhost:{port}")
    print(f"📱 Access from: http://localhost:{port}/index.html")
    print()
    
    # Create server
    with socketserver.TCPServer(("", port), CORSHTTPRequestHandler) as httpd:
        print(f"✅ Server running on port {port}")
        print("🎯 Point your browser to http://localhost:8000")
        print("📸 Make sure to allow camera access when prompted")
        print()
        print("👋 Available gestures:")
        print("   🤙 Shaka - Load arrivals")
        print("   👌 OK Sign - Load departures")
        print("   🖐️ Wave Hand - Navigate/scroll")
        print("   ✊ Closed Fist - Select flight")
        print("   🖖 Vulcan Sign - Exit detail view")
        print("   ✌️ Peace Sign - Refresh data")
        print("   🤘 Rock-On Sign - Switch airports")
        print()
        print("⏹️  Press Ctrl+C to stop the server")
        print("=" * 50)
        
        # Open browser if requested
        if open_browser:
            try:
                webbrowser.open(f'http://localhost:{port}')
                print("🌐 Opened browser automatically")
            except Exception as e:
                print(f"⚠️  Could not open browser: {e}")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Serve the Flight Tracker application")
    parser.add_argument("--port", "-p", type=int, default=8000, help="Port to serve on (default: 8000)")
    parser.add_argument("--no-browser", action="store_true", help="Don't open browser automatically")
    
    args = parser.parse_args()
    
    serve_app(port=args.port, open_browser=not args.no_browser)
