---
title: "Node.js with Nginx Deployment Guide"
description: "Complete guide to deploying Node.js applications on Ubuntu with Nginx reverse proxy, PM2 process manager, and SSL/HTTPS configuration using Let's Encrypt"
tags:
  - nodejs
  - nginx
  - ubuntu
  - deployment
  - pm2
  - ssl
  - letsencrypt
  - reverse-proxy
  - https
date: 2024-11-03
lastUpdated: 2024-11-03
---

# Node.js with Nginx Deployment Guide

Complete guide to deploying Node.js applications on Ubuntu with Nginx as a reverse proxy, PM2 for process management, and SSL/HTTPS setup.

## Table of Contents

- [Node.js Installation](#nodejs-installation)
- [Create Node.js Application](#create-nodejs-application)
- [PM2 Process Manager](#pm2-process-manager)
- [Nginx Setup](#nginx-setup)
- [SSL Certificate with Let's Encrypt](#ssl-certificate-with-lets-encrypt)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

## Node.js Installation

### Install Node.js on Ubuntu 20.04/22.04

#### Method 1: NodeSource Repository (Recommended)

```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or Node.js 20.x (Current)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Install Build Tools

```bash
# Install GCC and Make
sudo apt-get install gcc g++ make

# Install build-essential for compiling native addons
sudo apt install build-essential
```

#### Verify Installation

```bash
# Check Node.js version
node -v

# Check npm version
npm -v
```

### Install Network Tools (Optional)

```bash
# Install net-tools for netstat
sudo apt install net-tools

# Check listening ports
netstat -tupan
```

## Create Node.js Application

### Basic Express Server

Create a simple Node.js application:

```bash
# Create project directory
mkdir ~/myapp
cd ~/myapp

# Initialize npm project
npm init -y

# Install Express
npm install express
```

### Create Server File

```bash
# Create server file
nano server.js
```

**Basic HTTP Server:**

```javascript
const http = require('http');
const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome to Node.js!\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
```

**Express Server:**

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

### Test the Application

```bash
# Run the server
node server.js

# Test with curl (in another terminal)
curl http://localhost:3000
```

## PM2 Process Manager

PM2 is a production process manager for Node.js applications.

### Install PM2

```bash
# Install PM2 globally
sudo npm install pm2@latest -g

# Verify installation
pm2 --version
```

### Start Application with PM2

```bash
# Start application
pm2 start server.js

# Start with custom name
pm2 start server.js --name "myapp"

# Start with environment variables
pm2 start server.js --name "myapp" --env production
```

### PM2 Commands

```bash
# List all processes
pm2 list

# Show process details
pm2 show myapp

# Monitor processes
pm2 monit

# View logs
pm2 logs
pm2 logs myapp

# Restart application
pm2 restart myapp

# Stop application
pm2 stop myapp

# Delete from PM2
pm2 delete myapp

# Restart all applications
pm2 restart all

# Stop all applications
pm2 stop all
```

### PM2 Startup Script

Configure PM2 to start on system boot:

```bash
# Generate startup script
pm2 startup systemd

# Save current process list
pm2 save

# Disable startup
pm2 unstartup systemd
```

### PM2 Ecosystem File

Create `ecosystem.config.js` for advanced configuration:

```javascript
module.exports = {
  apps: [{
    name: 'myapp',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G'
  }]
};
```

Start with ecosystem file:

```bash
pm2 start ecosystem.config.js --env production
```

## Nginx Setup

### Install Nginx

```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Check Nginx status
sudo systemctl status nginx

# Enable Nginx on boot
sudo systemctl enable nginx
```

### Remove Default Configuration

```bash
# Remove default site configuration
sudo rm /etc/nginx/sites-available/default
sudo rm /etc/nginx/sites-enabled/default
```

### Create Nginx Configuration

```bash
# Create new site configuration
sudo nano /etc/nginx/sites-available/yourdomain.com
```

**Basic Reverse Proxy Configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name yourdomain.com www.yourdomain.com;

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

### Enable Site Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Stop Nginx
sudo systemctl stop nginx

# Start Nginx
sudo systemctl start nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

## SSL Certificate with Let's Encrypt

### Install Certbot

```bash
# Install Certbot for Nginx
sudo apt install python3-certbot-nginx
```

### Obtain SSL Certificate

```bash
# Get certificate (interactive)
sudo certbot --nginx

# Get certificate (non-interactive)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com --non-interactive --agree-tos -m your@email.com

# Certificate only (manual configuration)
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

### Complete Nginx Configuration with SSL

```bash
# Edit Nginx configuration
sudo nano /etc/nginx/sites-available/yourdomain.com
```

**Full Configuration with SSL and Redirects:**

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    
    server_name yourdomain.com www.yourdomain.com;

    return 301 https://yourdomain.com$request_uri;
}

# Redirect www to non-www HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    return 301 https://yourdomain.com$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Node.js
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

    # Static files (if needed)
    location /static {
        alias /var/www/yourdomain.com/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Test and Restart Nginx

```bash
# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Auto-Renewal Setup

Let's Encrypt certificates expire after 90 days. Set up automatic renewal:

```bash
# Test renewal
sudo certbot renew --dry-run

# Add cron job for auto-renewal
sudo crontab -e
```

Add this line to check for renewal twice daily:

```cron
0 0,12 * * * certbot renew --quiet && systemctl reload nginx
```

Or use systemd timer (recommended):

```bash
# Check certbot timer status
sudo systemctl status certbot.timer

# Enable timer
sudo systemctl enable certbot.timer
```

## Security Best Practices

### Firewall Configuration

```bash
# Install UFW
sudo apt install ufw

# Allow SSH
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Or specific ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Node.js Security

```bash
# Run Node.js as non-root user
sudo useradd -r -s /bin/false nodeapp

# Set file permissions
sudo chown -R nodeapp:nodeapp /path/to/app

# Run PM2 as specific user
pm2 start server.js --user nodeapp
```

### Environment Variables

```bash
# Create .env file
nano .env
```

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost/db
API_KEY=your_secret_key
```

**Load in Node.js:**

```javascript
require('dotenv').config();

const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
```

### Rate Limiting in Nginx

```nginx
# Add to http block in /etc/nginx/nginx.conf
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

# Add to server block
location / {
    limit_req zone=mylimit burst=20 nodelay;
    proxy_pass http://localhost:3000;
}
```

## Troubleshooting

### Check Application Status

```bash
# Check if Node.js is running
pm2 list

# Check application logs
pm2 logs myapp

# Check system logs
journalctl -u nginx -f
```

### Check Ports

```bash
# Check if port 3000 is listening
sudo netstat -tulpn | grep :3000

# Or with ss
sudo ss -tulpn | grep :3000

# Check Nginx ports
sudo netstat -tulpn | grep nginx
```

### Common Issues

**Port already in use:**

```bash
# Find process using port
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

**Nginx configuration errors:**

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

**SSL certificate issues:**

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew --force-renewal
```

**Permission denied:**

```bash
# Fix Nginx permissions
sudo chown -R www-data:www-data /var/www

# Fix application permissions
sudo chown -R $USER:$USER /path/to/app
```

## Quick Reference

```bash
# Node.js
node server.js                    # Run application
npm start                         # Run with npm script

# PM2
pm2 start server.js              # Start app
pm2 restart myapp                # Restart app
pm2 logs                         # View logs
pm2 monit                        # Monitor

# Nginx
sudo nginx -t                    # Test config
sudo systemctl restart nginx     # Restart
sudo systemctl reload nginx      # Reload config

# SSL
sudo certbot renew              # Renew certificates
sudo certbot certificates       # List certificates

# Firewall
sudo ufw status                 # Check firewall
sudo ufw allow 80/tcp           # Allow HTTP
sudo ufw allow 443/tcp          # Allow HTTPS
```

---

**Related Topics:**
- Docker Deployment
- CI/CD with GitHub Actions
- Load Balancing with Nginx
- MongoDB Setup
- PostgreSQL Configuration
