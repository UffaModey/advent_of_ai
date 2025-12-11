#!/usr/bin/env python3
"""
Dmitri's Vendor Server
Serves the clean vendor data via HTTP API and static files
"""

import json
import os
import http.server
import socketserver
import urllib.parse
from pathlib import Path

class VendorRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler for vendor data"""
    
    def __init__(self, *args, **kwargs):
        # Set the directory to serve files from
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def do_GET(self):
        # Parse the URL
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # API endpoint for vendor data
        if path == '/api/vendors':
            self.serve_vendor_data()
        
        # Serve the main HTML file at root
        elif path == '/' or path == '':
            self.serve_html_file('vendor_display.html')
        
        # Default handling for other files
        else:
            super().do_GET()
    
    def serve_vendor_data(self):
        """Serve the JSON vendor data"""
        try:
            # Load the JSON file
            with open('dmitris-definitely-not-a-disaster.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')  # Enable CORS
            self.end_headers()
            
            # Write JSON data
            json_data = json.dumps(data, indent=2, ensure_ascii=False)
            self.wfile.write(json_data.encode('utf-8'))
            
        except FileNotFoundError:
            self.send_error(404, "Vendor data file not found")
        except Exception as e:
            self.send_error(500, f"Error loading vendor data: {e}")
    
    def serve_html_file(self, filename):
        """Serve an HTML file"""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(content.encode('utf-8'))
            
        except FileNotFoundError:
            self.send_error(404, f"File {filename} not found")
        except Exception as e:
            self.send_error(500, f"Error serving file: {e}")
    
    def log_message(self, format, *args):
        """Custom log format with emoji"""
        message = format % args
        if '/api/vendors' in message:
            print(f"🍽️ {message}")
        elif any(ext in message for ext in ['.html', '.css', '.js']):
            print(f"📄 {message}")
        else:
            print(f"🌐 {message}")

def main():
    # Configuration
    PORT = 8001
    HOST = 'localhost'
    
    # Check if required files exist
    required_files = ['dmitris-definitely-not-a-disaster.json', 'vendor_display.html']
    missing_files = [f for f in required_files if not os.path.exists(f)]
    
    if missing_files:
        print(f"❌ Missing required files: {', '.join(missing_files)}")
        print("Make sure to run the data cleaner script first!")
        return
    
    # Create the server
    try:
        with socketserver.TCPServer((HOST, PORT), VendorRequestHandler) as httpd:
            print("🚀 Dmitri's Vendor Server Starting Up!")
            print("=" * 50)
            print(f"🌐 Server running at: http://{HOST}:{PORT}")
            print(f"📱 View vendor directory: http://{HOST}:{PORT}")
            print(f"📊 API endpoint: http://{HOST}:{PORT}/api/vendors")
            print("=" * 50)
            print("✨ Features:")
            print("   • Clean, stain-free vendor data")
            print("   • Beautiful responsive web interface")
            print("   • RESTful JSON API")
            print("   • Real-time vendor information")
            print("=" * 50)
            print("Press Ctrl+C to stop the server")
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n👋 Server shutting down gracefully...")
        print("Thanks for using Dmitri's Vendor Server!")
        
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use!")
            print("Try a different port or stop the other server.")
        else:
            print(f"❌ Server error: {e}")

if __name__ == "__main__":
    main()
