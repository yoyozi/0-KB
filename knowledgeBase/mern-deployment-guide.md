---
title: "MERN Stack Deployment Guide"
description: "Complete guide to deploying MERN (MongoDB, Express, React, Node.js) applications with PM2, Nginx, and SSL on Ubuntu server"
tags:
  - mern
  - deployment
  - mongodb
  - express
  - react
  - nodejs
  - pm2
  - nginx
  - ssl
  - ubuntu
date: 2024-11-03
lastUpdated: 2024-11-03
---

# MERN Stack Deployment Guide

Complete guide to deploying full-stack MERN applications on Ubuntu with PM2, Nginx, and SSL.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Server Setup](#server-setup)
- [Node.js Installation](#nodejs-installation)
- [MongoDB Setup](#mongodb-setup)
- [Application Deployment](#application-deployment)
- [PM2 Process Manager](#pm2-process-manager)
- [Nginx Configuration](#nginx-configuration)
- [SSL with Let's Encrypt](#ssl-with-lets-encrypt)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Ubuntu 20.04/22.04 server
- Domain name pointing to server IP
- SSH access to server
- Basic Linux command knowledge

## Server Setup

### Create Deployment User

```bash
# Create user
sudo adduser webuser

# Add to sudo group
sudo usermod -aG sudo webuser

# Switch to new user
su - webuser
```

### Setup SSH Key

```bash
# Generate SSH key (on local machine)
ssh-keygen -t rsa -b 4096

# Copy to server
ssh-copy-id webuser@your-server-ip

# Test connection
ssh webuser@your-server-ip
```

### Update System

```bash
sudo apt update
sudo apt upgrade -y
```

## Node.js Installation

### Install Node.js 20.x (LTS)

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node -v
npm -v
```

### Install Build Tools

```bash
sudo apt install -y build-essential
```

## MongoDB Setup

### Install MongoDB

```bash
# Import MongoDB public key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/mongodb-7.gpg

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

### Configure MongoDB Authentication

```bash
# Connect to MongoDB
mongosh

# Switch to admin database
use admin

# Create admin user
db.createUser({
  user: "mongoAdmin",
  pwd: "your-secure-password",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})

# Exit
exit
```

### Enable Authentication

```bash
# Edit MongoDB config
sudo nano /etc/mongod.conf
```

Add/uncomment:

```yaml
security:
  authorization: enabled
```

Restart MongoDB:

```bash
sudo systemctl restart mongod
```

### Create Application Database User

```bash
# Connect with admin
mongosh -u mongoAdmin -p --authenticationDatabase admin

# Switch to your database
use myapp

# Create app user
db.createUser({
  user: "appuser",
  pwd: "app-password",
  roles: [
    { role: "readWrite", db: "myapp" }
  ]
})

exit
```

## Application Deployment

### Clone Repository

```bash
# Install Git
sudo apt install -y git

# Setup SSH key for GitHub (if using private repo)
ssh-keygen -t ed25519 -C "your-email@example.com"
cat ~/.ssh/id_ed25519.pub
# Add to GitHub SSH keys

# Clone repository
cd ~
mkdir sites
cd sites
git clone git@github.com:username/your-app.git
cd your-app
```

### Install Dependencies

```bash
# Backend dependencies
npm install

# Frontend dependencies
cd client
npm install
cd ..
```

### Build React Frontend

```bash
cd client
npm run build
cd ..
```

### Setup Environment Variables

```bash
# Create .env file
nano .env
```

Add your configuration:

```env
NODE_ENV=production
PORT=5000

# MongoDB
MONGO_URI=mongodb://appuser:app-password@localhost:27017/myapp?authSource=myapp

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=90d

# Other configs
CLIENT_URL=https://yourdomain.com
```

### Configure Express for Production

```javascript
// server.js
const express = require('express');
const path = require('path');

const app = express();

// API routes
app.use('/api', apiRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## PM2 Process Manager

### Install PM2

```bash
sudo npm install -g pm2
```

### Create PM2 Ecosystem File

```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'myapp',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G'
  }]
};
```

### Start Application

```bash
# Create logs directory
mkdir logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Run the command it outputs

# Check status
pm2 status
pm2 logs
```

### PM2 Commands

```bash
# View logs
pm2 logs myapp

# Restart
pm2 restart myapp

# Stop
pm2 stop myapp

# Delete
pm2 delete myapp

# Monitor
pm2 monit
```

## Nginx Configuration

### Install Nginx

```bash
sudo apt install -y nginx

# Start and enable
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Configure Nginx

```bash
# Remove default config
sudo rm /etc/nginx/sites-enabled/default

# Create new config
sudo nano /etc/nginx/sites-available/myapp
```

**Basic Configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
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

### Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## SSL with Let's Encrypt

### Install Certbot

```bash
sudo apt install -y python3-certbot-nginx
```

### Obtain SSL Certificate

```bash
# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts
# Enter email
# Agree to terms
# Choose redirect option (2)
```

### Complete Nginx Configuration with SSL

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    
    server_name yourdomain.com www.yourdomain.com;
    
    return 301 https://yourdomain.com$request_uri;
}

# Redirect www to non-www
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    return 301 https://yourdomain.com$request_uri;
}

# Main server block
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
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Optional: Serve static files directly
    location /static {
        alias /home/webuser/sites/myapp/client/build/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Test and Reload

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot auto-renewal is enabled by default
sudo systemctl status certbot.timer
```

## Environment Variables

### Secure .env File

```bash
# Set proper permissions
chmod 600 .env

# Never commit to Git
echo ".env" >> .gitignore
```

### Example .env

```env
NODE_ENV=production
PORT=5000

# MongoDB
MONGO_URI=mongodb://appuser:password@localhost:27017/myapp?authSource=myapp

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=90d
JWT_COOKIE_EXPIRE=90

# Email (if using)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Client URL
CLIENT_URL=https://yourdomain.com

# File Upload
MAX_FILE_UPLOAD=1000000
FILE_UPLOAD_PATH=./uploads
```

## Troubleshooting

### Check Application Logs

```bash
# PM2 logs
pm2 logs myapp

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Check Services Status

```bash
# PM2
pm2 status

# Nginx
sudo systemctl status nginx

# MongoDB
sudo systemctl status mongod
```

### Common Issues

**Port already in use:**

```bash
# Find process using port
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

**MongoDB connection failed:**

```bash
# Check MongoDB is running
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test connection
mongosh -u appuser -p --authenticationDatabase myapp
```

**Nginx 502 Bad Gateway:**

```bash
# Check if Node.js app is running
pm2 status

# Check Node.js app logs
pm2 logs myapp

# Restart app
pm2 restart myapp
```

**Permission denied:**

```bash
# Fix file permissions
sudo chown -R webuser:webuser /home/webuser/sites/myapp

# Fix Nginx permissions
sudo chown -R www-data:www-data /var/www
```

## Deployment Checklist

- [ ] Server setup and user created
- [ ] Node.js installed
- [ ] MongoDB installed and secured
- [ ] Application cloned from repository
- [ ] Dependencies installed
- [ ] React app built
- [ ] Environment variables configured
- [ ] PM2 installed and configured
- [ ] Application started with PM2
- [ ] PM2 startup script enabled
- [ ] Nginx installed and configured
- [ ] SSL certificate obtained
- [ ] Firewall configured (UFW)
- [ ] Domain DNS configured
- [ ] Application tested
- [ ] Monitoring setup

## Firewall Setup

```bash
# Install UFW
sudo apt install -y ufw

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Updating Application

```bash
# Pull latest code
cd ~/sites/myapp
git pull origin main

# Install new dependencies
npm install

# Rebuild React app
cd client
npm install
npm run build
cd ..

# Restart PM2
pm2 restart myapp

# Check logs
pm2 logs myapp
```

## Backup Strategy

### MongoDB Backup

```bash
# Create backup script
nano ~/backup-mongo.sh
```

```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/webuser/backups/mongodb"
mkdir -p $BACKUP_DIR

mongodump \
  --uri="mongodb://appuser:password@localhost:27017/myapp?authSource=myapp" \
  --out="$BACKUP_DIR/backup_$TIMESTAMP"

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

```bash
# Make executable
chmod +x ~/backup-mongo.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/webuser/backup-mongo.sh
```

---

**Related Topics:**
- Docker Deployment
- CI/CD with GitHub Actions
- Load Balancing
- Database Replication
- Monitoring with PM2 Plus
