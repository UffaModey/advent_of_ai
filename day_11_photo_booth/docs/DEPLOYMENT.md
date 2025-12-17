# 🚀 Deployment Guide

## Fun House Photo Booth - Production Deployment

This guide covers deploying the Fun House Photo Booth to production environments with proper security, performance, and reliability considerations.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Security Requirements](#security-requirements)
3. [Server Configuration](#server-configuration)
4. [CDN Setup](#cdn-setup)
5. [Performance Optimization](#performance-optimization)
6. [Monitoring & Analytics](#monitoring--analytics)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### System Requirements

**Minimum Server Specs:**
- **CPU**: 1 vCPU (2+ recommended)
- **Memory**: 512MB RAM (1GB+ recommended)
- **Storage**: 1GB available space
- **Network**: 10Mbps upload bandwidth minimum

**Software Requirements:**
- **Web Server**: Apache 2.4+, Nginx 1.18+, or equivalent
- **SSL Certificate**: Valid SSL/TLS certificate (required for camera access)
- **HTTP/2**: Recommended for better performance
- **Gzip/Brotli**: Compression enabled

**Domain Requirements:**
- **HTTPS**: Mandatory (camera APIs require secure context)
- **Domain Name**: Registered domain or subdomain
- **DNS**: Properly configured A/AAAA records

---

## 🔐 Security Requirements

### SSL/TLS Configuration

Camera access requires HTTPS in production. HTTP is only allowed for localhost development.

#### Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt update
sudo apt install certbot

# For Apache
sudo certbot --apache -d yourdomain.com

# For Nginx
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Manual SSL Certificate

```bash
# Generate CSR
openssl req -new -newkey rsa:2048 -nodes -keyout yourdomain.key -out yourdomain.csr

# Install certificate files
sudo cp yourdomain.crt /etc/ssl/certs/
sudo cp yourdomain.key /etc/ssl/private/
sudo chmod 600 /etc/ssl/private/yourdomain.key
```

### Content Security Policy (CSP)

Add security headers to prevent XSS and other attacks:

```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob:;
    media-src 'self' blob:;
    connect-src 'self';
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
">
```

### HTTP Security Headers

Configure your web server to add security headers:

```nginx
# Nginx security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()";
```

```apache
# Apache security headers (.htaccess)
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
```

---

## ⚙️ Server Configuration

### Apache Configuration

#### Virtual Host Setup

```apache
# /etc/apache2/sites-available/photobooth.conf
<VirtualHost *:443>
    ServerName yourdomain.com
    DocumentRoot /var/www/photobooth
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/yourdomain.crt
    SSLCertificateKeyFile /etc/ssl/private/yourdomain.key
    
    # Security Headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    
    # Compression
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \
            \.(?:gif|jpe?g|png)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \
            \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>
    
    # Caching
    <FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 month"
        Header set Cache-Control "public, immutable"
    </FilesMatch>
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/photobooth_error.log
    CustomLog ${APACHE_LOG_DIR}/photobooth_access.log combined
</VirtualHost>

# Redirect HTTP to HTTPS
<VirtualHost *:80>
    ServerName yourdomain.com
    Redirect permanent / https://yourdomain.com/
</VirtualHost>
```

#### Enable Required Modules

```bash
sudo a2enmod ssl
sudo a2enmod headers
sudo a2enmod deflate
sudo a2enmod expires
sudo a2ensite photobooth
sudo systemctl reload apache2
```

### Nginx Configuration

#### Server Block Setup

```nginx
# /etc/nginx/sites-available/photobooth
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/yourdomain.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.key;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Document root
    root /var/www/photobooth;
    index index.html;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # Static file caching
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1M;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Main location
    location / {
        try_files $uri $uri/ /index.html;
        
        # Security headers for HTML
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
    
    # Logs
    access_log /var/log/nginx/photobooth_access.log;
    error_log /var/log/nginx/photobooth_error.log;
}
```

#### Enable Configuration

```bash
sudo ln -s /etc/nginx/sites-available/photobooth /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📁 File Deployment

### Basic Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e

DEPLOY_DIR="/var/www/photobooth"
BACKUP_DIR="/var/backups/photobooth"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting Photo Booth deployment..."

# Create backup
echo "📦 Creating backup..."
sudo mkdir -p "$BACKUP_DIR"
if [ -d "$DEPLOY_DIR" ]; then
    sudo tar -czf "$BACKUP_DIR/photobooth_$TIMESTAMP.tar.gz" -C "$DEPLOY_DIR" .
fi

# Create deploy directory
sudo mkdir -p "$DEPLOY_DIR"

# Copy files
echo "📋 Copying files..."
sudo cp index.html "$DEPLOY_DIR/"
sudo cp app.js "$DEPLOY_DIR/"
sudo cp camera-utils.js "$DEPLOY_DIR/"
sudo cp filters.js "$DEPLOY_DIR/"
sudo cp styles.css "$DEPLOY_DIR/"
sudo cp README.md "$DEPLOY_DIR/"
sudo cp TECHNICAL.md "$DEPLOY_DIR/"
sudo cp TROUBLESHOOTING.md "$DEPLOY_DIR/"

# Copy documentation
sudo mkdir -p "$DEPLOY_DIR/docs"
sudo cp docs/API.md "$DEPLOY_DIR/docs/"
sudo cp docs/DEPLOYMENT.md "$DEPLOY_DIR/docs/"

# Set permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data "$DEPLOY_DIR"
sudo find "$DEPLOY_DIR" -type f -exec chmod 644 {} \;
sudo find "$DEPLOY_DIR" -type d -exec chmod 755 {} \;

# Validate deployment
echo "✅ Validating deployment..."
if [ -f "$DEPLOY_DIR/index.html" ]; then
    echo "✅ Deployment successful!"
else
    echo "❌ Deployment failed!"
    exit 1
fi

echo "🎉 Photo Booth deployed successfully!"
echo "🔗 Visit: https://yourdomain.com"
```

### Automated Deployment with Git

```bash
#!/bin/bash
# git-deploy.sh

REPO_URL="https://github.com/yourusername/photo-booth.git"
DEPLOY_DIR="/var/www/photobooth"
TEMP_DIR="/tmp/photobooth-deploy"

echo "🚀 Git deployment starting..."

# Clone repository
rm -rf "$TEMP_DIR"
git clone "$REPO_URL" "$TEMP_DIR"
cd "$TEMP_DIR"

# Run tests (if available)
# npm test

# Deploy files
sudo rsync -av --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='*.md' \
    "$TEMP_DIR/" "$DEPLOY_DIR/"

# Set permissions
sudo chown -R www-data:www-data "$DEPLOY_DIR"

# Cleanup
rm -rf "$TEMP_DIR"

echo "✅ Git deployment complete!"
```

---

## 🌐 CDN Setup

### Face-API.js CDN Configuration

The app relies on face-api.js from CDN. Configure fallbacks for reliability:

```html
<!-- Primary CDN -->
<script defer src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>

<!-- Fallback script -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Check if primary CDN loaded
    if (typeof faceapi === 'undefined') {
        console.warn('Primary CDN failed, loading fallback...');
        
        // Load from fallback CDN
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js';
        script.onload = () => console.log('Fallback CDN loaded successfully');
        script.onerror = () => console.error('All CDNs failed to load');
        document.head.appendChild(script);
    }
});
</script>
```

### Asset CDN (Optional)

For better performance, serve static assets from a CDN:

```html
<!-- If using asset CDN -->
<link rel="stylesheet" href="https://cdn.yourdomain.com/photobooth/styles.css">
<script src="https://cdn.yourdomain.com/photobooth/camera-utils.js"></script>
<script src="https://cdn.yourdomain.com/photobooth/filters.js"></script>
<script src="https://cdn.yourdomain.com/photobooth/app.js"></script>
```

---

## ⚡ Performance Optimization

### File Compression

#### Gzip Configuration

```bash
# Test gzip compression
curl -H "Accept-Encoding: gzip" -I https://yourdomain.com/app.js
```

Expected response should include:
```
Content-Encoding: gzip
```

#### Brotli Compression (Advanced)

```nginx
# Nginx with Brotli
load_module modules/ngx_http_brotli_filter_module.so;

http {
    brotli on;
    brotli_comp_level 4;
    brotli_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/json;
}
```

### File Minification (Optional)

```bash
# Install minification tools
npm install -g uglify-js clean-css-cli html-minifier

# Minify JavaScript
uglifyjs app.js -c -m -o app.min.js
uglifyjs camera-utils.js -c -m -o camera-utils.min.js
uglifyjs filters.js -c -m -o filters.min.js

# Minify CSS
cleancss -o styles.min.css styles.css

# Minify HTML
html-minifier --collapse-whitespace --remove-comments index.html -o index.min.html
```

Update HTML to use minified files:
```html
<link rel="stylesheet" href="styles.min.css">
<script src="camera-utils.min.js"></script>
<script src="filters.min.js"></script>
<script src="app.min.js"></script>
```

### Preloading Resources

```html
<!-- Preload critical resources -->
<link rel="preload" href="app.js" as="script">
<link rel="preload" href="styles.css" as="style">
<link rel="preconnect" href="https://cdn.jsdelivr.net">

<!-- DNS prefetch for external resources -->
<link rel="dns-prefetch" href="//cdn.jsdelivr.net">
<link rel="dns-prefetch" href="//unpkg.com">
```

### Service Worker (PWA)

```javascript
// sw.js - Service worker for caching
const CACHE_NAME = 'photobooth-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/app.js',
    '/camera-utils.js',
    '/filters.js',
    '/styles.css'
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app files');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});
```

Register service worker in HTML:
```html
<script>
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
</script>
```

---

## 📊 Monitoring & Analytics

### Error Monitoring

#### Basic JavaScript Error Tracking

```javascript
// Add to app.js
class ErrorTracker {
    constructor() {
        this.setupGlobalErrorHandling();
    }
    
    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            this.logError({
                type: 'javascript_error',
                message: event.error.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error.stack,
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                type: 'promise_rejection',
                message: event.reason,
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        });
    }
    
    logError(errorData) {
        // Log to console
        console.error('Application Error:', errorData);
        
        // Send to monitoring service (implement as needed)
        this.sendToMonitoring(errorData);
    }
    
    sendToMonitoring(errorData) {
        // Example: Send to your monitoring endpoint
        fetch('/api/errors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(errorData)
        }).catch(err => {
            console.warn('Failed to send error data:', err);
        });
    }
}

// Initialize error tracking
const errorTracker = new ErrorTracker();
```

### Performance Monitoring

```javascript
// Performance tracking
class PerformanceTracker {
    constructor() {
        this.metrics = {};
        this.startTracking();
    }
    
    startTracking() {
        // Track page load performance
        window.addEventListener('load', () => {
            this.trackPageLoad();
        });
        
        // Track camera initialization
        if (window.photoBoothApp) {
            this.trackCameraPerformance();
        }
    }
    
    trackPageLoad() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const metrics = {
            dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp_connect: navigation.connectEnd - navigation.connectStart,
            request_time: navigation.responseEnd - navigation.requestStart,
            dom_processing: navigation.domComplete - navigation.responseEnd,
            total_load_time: navigation.loadEventEnd - navigation.navigationStart
        };
        
        this.sendMetrics('page_load', metrics);
    }
    
    trackCameraPerformance() {
        const startTime = performance.now();
        
        photoBoothApp.addEventListener('camera-initialized', () => {
            const cameraStartTime = performance.now() - startTime;
            this.sendMetrics('camera_init', { duration: cameraStartTime });
        });
    }
    
    sendMetrics(eventName, data) {
        // Send to analytics service
        console.log(`Performance: ${eventName}`, data);
        
        // Example: Google Analytics
        // gtag('event', eventName, data);
        
        // Example: Custom analytics
        // analytics.track(eventName, data);
    }
}

// Initialize performance tracking
const performanceTracker = new PerformanceTracker();
```

### Server-side Monitoring

#### Log Analysis Script

```bash
#!/bin/bash
# analyze-logs.sh

LOG_FILE="/var/log/nginx/photobooth_access.log"
ERROR_LOG="/var/log/nginx/photobooth_error.log"

echo "📊 Photo Booth Analytics Report"
echo "================================"

# Traffic statistics
echo "🌐 Traffic Statistics:"
echo "Total requests today: $(grep "$(date '+%d/%b/%Y')" "$LOG_FILE" | wc -l)"
echo "Unique visitors today: $(grep "$(date '+%d/%b/%Y')" "$LOG_FILE" | awk '{print $1}' | sort | uniq | wc -l)"

# Top user agents
echo ""
echo "📱 Top User Agents:"
grep "$(date '+%d/%b/%Y')" "$LOG_FILE" | awk -F'"' '{print $6}' | sort | uniq -c | sort -nr | head -5

# Error analysis
echo ""
echo "🚨 Error Summary:"
echo "Total errors today: $(grep "$(date '+%d/%b/%Y')" "$ERROR_LOG" | wc -l)"

# Response time analysis
echo ""
echo "⚡ Performance:"
AVG_RESPONSE=$(grep "$(date '+%d/%b/%Y')" "$LOG_FILE" | awk '{sum+=$10; count++} END {if(count>0) print sum/count; else print 0}')
echo "Average response time: ${AVG_RESPONSE}ms"

# Browser compatibility
echo ""
echo "🌐 Browser Compatibility:"
grep -o 'Chrome/[0-9]*' "$LOG_FILE" | sort | uniq -c | head -3
grep -o 'Safari/[0-9]*' "$LOG_FILE" | sort | uniq -c | head -3
grep -o 'Firefox/[0-9]*' "$LOG_FILE" | sort | uniq -c | head -3
```

---

## 🔧 Troubleshooting

### Common Deployment Issues

#### SSL Certificate Problems

```bash
# Check SSL certificate
openssl x509 -in /etc/ssl/certs/yourdomain.crt -text -noout

# Test SSL configuration
curl -I https://yourdomain.com

# Verify certificate chain
curl -I --verbose https://yourdomain.com
```

#### File Permission Issues

```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/photobooth
sudo chmod -R 644 /var/www/photobooth
sudo find /var/www/photobooth -type d -exec chmod 755 {} \;
```

#### CDN Loading Issues

```javascript
// Debug CDN loading
console.log('Face-API loaded:', typeof faceapi !== 'undefined');

// Test CDN availability
fetch('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js')
    .then(response => console.log('CDN status:', response.status))
    .catch(error => console.error('CDN error:', error));
```

### Health Check Endpoint

```html
<!-- Create health.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Health Check</title>
</head>
<body>
    <script>
    const healthCheck = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
            web_server: 'operational',
            ssl: location.protocol === 'https:' ? 'operational' : 'error',
            cdn: typeof faceapi !== 'undefined' ? 'operational' : 'loading'
        }
    };
    
    document.body.innerHTML = '<pre>' + JSON.stringify(healthCheck, null, 2) + '</pre>';
    </script>
</body>
</html>
```

### Monitoring Script

```bash
#!/bin/bash
# monitor.sh

DOMAIN="yourdomain.com"
EMAIL="admin@yourdomain.com"

# Check HTTPS availability
if ! curl -f -s https://"$DOMAIN" > /dev/null; then
    echo "Website down!" | mail -s "Photo Booth Alert" "$EMAIL"
    exit 1
fi

# Check SSL certificate expiration
EXPIRY=$(date -d "$(openssl x509 -in /etc/ssl/certs/yourdomain.crt -noout -enddate | cut -d= -f2)" +%s)
CURRENT=$(date +%s)
DAYS_LEFT=$(( (EXPIRY - CURRENT) / 86400 ))

if [ "$DAYS_LEFT" -lt 30 ]; then
    echo "SSL certificate expires in $DAYS_LEFT days!" | mail -s "SSL Alert" "$EMAIL"
fi

# Check disk space
USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$USAGE" -gt 80 ]; then
    echo "Disk usage is $USAGE%!" | mail -s "Disk Space Alert" "$EMAIL"
fi

echo "All systems operational"
```

Add to crontab:
```bash
# Check every 5 minutes
*/5 * * * * /path/to/monitor.sh
```

---

## 📈 Scaling Considerations

### Load Balancing

For high traffic, consider load balancing:

```nginx
# Nginx load balancer
upstream photobooth_backend {
    server 192.168.1.10:443;
    server 192.168.1.11:443;
    server 192.168.1.12:443;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    location / {
        proxy_pass https://photobooth_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Database Integration (Optional)

For analytics and user management:

```javascript
// Add analytics endpoint
class Analytics {
    async trackEvent(eventType, data) {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: eventType,
                    data: data,
                    timestamp: Date.now(),
                    session: this.getSessionId()
                })
            });
        } catch (error) {
            console.warn('Analytics tracking failed:', error);
        }
    }
    
    getSessionId() {
        let sessionId = sessionStorage.getItem('photoboothSession');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random();
            sessionStorage.setItem('photoboothSession', sessionId);
        }
        return sessionId;
    }
}

// Initialize analytics
const analytics = new Analytics();

// Track photo captures
photoBoothApp.addEventListener('photo-captured', (event) => {
    analytics.trackEvent('photo_captured', {
        filter: event.detail.filter,
        timestamp: event.detail.timestamp
    });
});
```

---

## 🎉 Deployment Checklist

### Pre-Deployment

- [ ] **SSL Certificate**: Valid and properly configured
- [ ] **DNS**: Domain pointing to server
- [ ] **Server**: Web server installed and configured
- [ ] **Files**: All application files copied to server
- [ ] **Permissions**: Proper file and directory permissions set
- [ ] **Security**: Security headers configured
- [ ] **Compression**: Gzip/Brotli enabled

### Post-Deployment

- [ ] **HTTPS Test**: Verify SSL certificate works
- [ ] **Camera Test**: Test camera access on mobile devices
- [ ] **Filter Test**: Verify all filters work properly
- [ ] **Performance**: Check page load times
- [ ] **Compatibility**: Test on target browsers/devices
- [ ] **Monitoring**: Error tracking and analytics enabled
- [ ] **Backup**: Automated backup system configured

### Production Verification

```bash
# Quick verification script
#!/bin/bash

DOMAIN="yourdomain.com"

echo "🔍 Verifying Photo Booth deployment..."

# Test HTTPS
echo "Testing HTTPS..."
if curl -f -s https://"$DOMAIN" | grep -q "Fun House Photo Booth"; then
    echo "✅ HTTPS working"
else
    echo "❌ HTTPS failed"
    exit 1
fi

# Test SSL grade
echo "Testing SSL configuration..."
SSL_GRADE=$(curl -s "https://api.ssllabs.com/api/v3/analyze?host=$DOMAIN" | grep -o '"grade":"[A-F]"' | cut -d'"' -f4)
echo "SSL Grade: $SSL_GRADE"

# Test performance
echo "Testing performance..."
LOAD_TIME=$(curl -o /dev/null -s -w "%{time_total}" https://"$DOMAIN")
echo "Load time: ${LOAD_TIME}s"

# Test mobile compatibility
echo "Testing mobile user agent..."
if curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)" -s https://"$DOMAIN" | grep -q "viewport"; then
    echo "✅ Mobile-responsive"
else
    echo "⚠️ Mobile compatibility check failed"
fi

echo "🎉 Deployment verification complete!"
```

---

**Your Fun House Photo Booth is now ready for production! 🚀**

*For ongoing maintenance and updates, refer to the monitoring scripts and update procedures outlined in this guide.*