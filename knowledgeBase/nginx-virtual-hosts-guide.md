---
title: "Nginx Virtual Hosts (Server Blocks) Guide"
description: "Complete guide to configuring Nginx virtual hosts (server blocks) for hosting multiple websites on a single server"
tags:
  - nginx
  - server-blocks
  - virtual-hosts
  - web-server
  - ubuntu
  - linux
  - hosting
date: 2024-11-03
lastUpdated: 2024-11-03
---

# Nginx Virtual Hosts (Server Blocks) Guide

Complete guide to setting up and managing Nginx server blocks (virtual hosts) for hosting multiple websites on a single server.

## Table of Contents

- [Introduction](#introduction)
- [Directory Structure](#directory-structure)
- [Creating Server Blocks](#creating-server-blocks)
- [SSL Configuration](#ssl-configuration)
- [Advanced Configurations](#advanced-configurations)
- [Testing and Troubleshooting](#testing-and-troubleshooting)
- [Best Practices](#best-practices)

## Introduction

### What are Server Blocks?

Server blocks (called virtual hosts in Apache) allow you to host multiple websites on a single server. Each server block can serve different content based on the domain name requested.

### Default Configuration

By default, Nginx on Ubuntu has one server block enabled, serving documents from `/var/www/html`.

## Directory Structure

### Create Document Root Directories

```bash
# Create directories for each site
sudo mkdir -p /var/www/example.com/html
sudo mkdir -p /var/www/test.com/html

# Set ownership (use your username)
sudo chown -R $USER:$USER /var/www/example.com/html
sudo chown -R $USER:$USER /var/www/test.com/html

# Set permissions
sudo chmod -R 755 /var/www
```

### Recommended Structure

```
/var/www/
├── example.com/
│   ├── html/           # Web root
│   ├── logs/           # Site-specific logs (optional)
│   └── ssl/            # SSL certificates (optional)
├── test.com/
│   ├── html/
│   ├── logs/
│   └── ssl/
└── html/               # Default site
```

### Create Sample Pages

**example.com:**

```bash
sudo nano /var/www/example.com/html/index.html
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Example.com</title>
</head>
<body>
    <h1>Success! The example.com server block is working!</h1>
    <p>This is the example.com website.</p>
</body>
</html>
```

**test.com:**

```bash
sudo nano /var/www/test.com/html/index.html
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Test.com</title>
</head>
<body>
    <h1>Success! The test.com server block is working!</h1>
    <p>This is the test.com website.</p>
</body>
</html>
```

## Creating Server Blocks

### Basic Server Block

```bash
# Create configuration file
sudo nano /etc/nginx/sites-available/example.com
```

**Basic Configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;

    root /var/www/example.com/html;
    index index.html index.htm index.php;

    server_name example.com www.example.com;

    location / {
        try_files $uri $uri/ =404;
    }

    # Custom error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /var/www/example.com/html;
    }

    # Logging
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;
}
```

### Enable Server Block

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Multiple Server Blocks

**test.com configuration:**

```bash
sudo nano /etc/nginx/sites-available/test.com
```

```nginx
server {
    listen 80;
    listen [::]:80;

    root /var/www/test.com/html;
    index index.html index.htm index.php;

    server_name test.com www.test.com;

    location / {
        try_files $uri $uri/ =404;
    }

    access_log /var/log/nginx/test.com.access.log;
    error_log /var/log/nginx/test.com.error.log;
}
```

```bash
# Enable
sudo ln -s /etc/nginx/sites-available/test.com /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Default Server Block

Only one server block can have the `default_server` directive:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    server_name _;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

This catches all requests that don't match other server blocks.

## SSL Configuration

### With Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d example.com -d www.example.com
```

### Manual SSL Configuration

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name example.com www.example.com;
    root /var/www/example.com/html;
    index index.html;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        try_files $uri $uri/ =404;
    }

    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;
}
```

## Advanced Configurations

### PHP Support

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/example.com/html;
    index index.php index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

### Reverse Proxy (Node.js/Express)

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Static Files Optimization

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/example.com/html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
```

### Subdomain Configuration

```nginx
# Main domain
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/example.com/html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# Subdomain
server {
    listen 80;
    server_name blog.example.com;
    root /var/www/example.com/blog;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# API subdomain
server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Redirect www to non-www

```nginx
server {
    listen 80;
    server_name www.example.com;
    return 301 $scheme://example.com$request_uri;
}

server {
    listen 80;
    server_name example.com;
    root /var/www/example.com/html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

## Testing and Troubleshooting

### Test Configuration

```bash
# Test Nginx configuration
sudo nginx -t

# Check configuration syntax
sudo nginx -T

# Reload Nginx
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx
```

### Check Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/example.com.access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/example.com.error.log
```

### Test with curl

```bash
# Test HTTP
curl -I http://example.com

# Test HTTPS
curl -I https://example.com

# Test with specific host header
curl -H "Host: example.com" http://your-server-ip
```

### Local Testing (Edit Hosts File)

**Linux/Mac:**

```bash
sudo nano /etc/hosts
```

**Windows:**

```
C:\Windows\System32\drivers\etc\hosts
```

Add entries:

```
203.0.113.5 example.com www.example.com
203.0.113.5 test.com www.test.com
```

### Common Issues

**Permission denied:**

```bash
sudo chown -R www-data:www-data /var/www/example.com
sudo chmod -R 755 /var/www/example.com
```

**Hash bucket memory problem:**

```bash
sudo nano /etc/nginx/nginx.conf
```

```nginx
http {
    server_names_hash_bucket_size 64;
}
```

**Port already in use:**

```bash
# Check what's using port 80
sudo lsof -i :80

# Check Nginx status
sudo systemctl status nginx
```

## Best Practices

### 1. Organize Configuration Files

```bash
# Keep sites-available and sites-enabled separate
/etc/nginx/sites-available/  # All configurations
/etc/nginx/sites-enabled/    # Active sites (symlinks)
```

### 2. Use Includes for Common Settings

```bash
# Create common configuration
sudo nano /etc/nginx/snippets/common.conf
```

```nginx
# Common security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;

# Gzip compression
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

Include in server blocks:

```nginx
server {
    include snippets/common.conf;
    # ... rest of configuration
}
```

### 3. Separate Log Files

Always use separate log files for each site:

```nginx
access_log /var/log/nginx/example.com.access.log;
error_log /var/log/nginx/example.com.error.log;
```

### 4. Use Descriptive Names

Name configuration files after the domain:

```
/etc/nginx/sites-available/example.com
/etc/nginx/sites-available/test.com
```

### 5. Regular Backups

```bash
# Backup configurations
sudo cp -r /etc/nginx/sites-available /backup/nginx-configs-$(date +%Y%m%d)
```

### 6. Security Checklist

- [ ] SSL/TLS enabled
- [ ] Security headers configured
- [ ] Hide Nginx version (`server_tokens off;`)
- [ ] Limit request size
- [ ] Rate limiting configured
- [ ] Access to hidden files denied
- [ ] Proper file permissions

### 7. Performance Optimization

```nginx
# In http block
http {
    # Connection settings
    keepalive_timeout 65;
    keepalive_requests 100;
    
    # Buffer sizes
    client_body_buffer_size 10K;
    client_header_buffer_size 1k;
    client_max_body_size 8m;
    large_client_header_buffers 2 1k;
    
    # Timeouts
    client_body_timeout 12;
    client_header_timeout 12;
    send_timeout 10;
}
```

## Quick Reference

```bash
# Create server block
sudo nano /etc/nginx/sites-available/example.com

# Enable server block
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

# Disable server block
sudo rm /etc/nginx/sites-enabled/example.com

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View logs
sudo tail -f /var/log/nginx/error.log
```

---

**Related Topics:**
- Nginx Configuration
- SSL/TLS Setup
- Load Balancing
- Caching Strategies
- Security Hardening
