---
title: "Next.js Deployment Guide"
description: "Complete guide to deploying Next.js applications with Express API, MongoDB, PM2, and Nginx on Ubuntu server with SSL"
tags:
  - nextjs
  - deployment
  - mongodb
  - express
  - nodejs
  - pm2
  - nginx
  - ssl
  - ubuntu
date: 2024-11-03
lastUpdated: 2024-11-03
---

# Next.js Deployment Guide

Complete guide to deploying Next.js applications with Express API backend on Ubuntu with PM2, Nginx, and SSL.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Server Setup](#server-setup)
- [Node.js Installation](#nodejs-installation)
- [MongoDB Setup](#mongodb-setup)
- [Application Deployment](#application-deployment)
- [Build Process](#build-process)
- [PM2 Configuration](#pm2-configuration)
- [Nginx Setup](#nginx-setup)
- [SSL Configuration](#ssl-configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Ubuntu 20.04/22.04 server
- Domain name pointing to server
- SSH access
- Basic Linux knowledge

## Server Setup

### Create Deployment User

```bash
# Create user
sudo adduser webuser

# Add to sudo group
sudo usermod -aG sudo webuser

# Switch to user
su - webuser
```

### SSH Key Setup

**On VPS (webuser):**

```bash
# Generate SSH key
ssh-keygen -t rsa -b 4096 -C "webuser"

# Create authorized_keys
touch ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Copy public key for GitHub
cat ~/.ssh/id_rsa.pub
# Add to GitHub SSH keys

# Test GitHub connection
ssh -T git@github.com
```

**On Deployment Server:**

```bash
# Generate key for webuser
ssh-keygen -f ~/.ssh/webuserkey_ed25519 -t ed25519 -C "webuser"

# Copy to VPS
ssh-copy-id -i ~/.ssh/webuserkey_ed25519.pub webuser@your-server-ip

# Add key to agent
eval $(ssh-agent -s)
ssh-add ~/.ssh/webuserkey_ed25519

# Test connection
ssh -i ~/.ssh/webuserkey_ed25519 webuser@your-server-ip
```

## Node.js Installation

### Option 1: Using NVM (Recommended)

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.bashrc

# Install latest LTS
nvm install --lts

# Verify
node -v
npm -v
```

### Option 2: NodeSource Repository

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node -v
npm -v
```

## MongoDB Setup

### Install MongoDB 7.0

```bash
# Install prerequisites
sudo apt-get install gnupg curl

# Import GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Check Ubuntu version
lsb_release -a

# Add repository (for Ubuntu 22.04 "jammy")
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start and enable
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
sudo systemctl status mongod
```

### Configure MongoDB

**Create Admin User:**

```bash
# Connect to MongoDB
mongosh --port 27017

# Switch to admin database
use admin

# Create admin user
db.createUser({
  user: "mongoAdmin",
  pwd: passwordPrompt(),
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})

# Exit
exit
```

**Enable Authentication:**

```bash
# Edit config
sudo nano /etc/mongod.conf
```

Add:

```yaml
security:
  authorization: enabled
```

Restart:

```bash
sudo systemctl restart mongod
```

**Create Application User:**

```bash
# Connect as admin
mongosh --port 27017 -u mongoAdmin -p

# Switch to your database
use myapp

# Create app user
db.createUser({
  user: "nodeUser",
  pwd: passwordPrompt(),
  roles: [
    { role: "readWrite", db: "myapp" },
    { role: "dbAdmin", db: "myapp" }
  ]
})

exit
```

### Restore Database

```bash
# If you have a backup from development
mongorestore --uri="mongodb://nodeUser:password@localhost:27017/myapp" ./backup/
```

## Application Deployment

### Clone Repository

```bash
# Create sites directory
mkdir ~/sites
cd ~/sites

# Clone from GitHub
git clone git@github.com:username/your-app.git
cd your-app
```

### Project Structure

```
your-app/
├── server/              # Express API
│   ├── config/
│   ├── routes/
│   ├── models/
│   ├── server.js
│   └── package.json
├── client/              # Next.js app
│   ├── pages/
│   ├── components/
│   ├── public/
│   ├── next.config.js
│   └── package.json
├── .env
└── package.json
```

### Environment Variables

```bash
# Create .env in root
nano .env
```

```env
NODE_ENV=production

# Server
PORT=5000

# MongoDB
NODE_USER=nodeUser
NODE_USER_PW=your-password
DB_NAME=myapp

# Next.js
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

**Secure .env:**

```bash
chmod 600 .env
```

### Database Connection (config/db.js)

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `mongodb://${process.env.NODE_USER}:${process.env.NODE_USER_PW}@127.0.0.1:27017/${process.env.DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Server Setup (server/server.js)

```javascript
const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../', '.env') });

const port = process.env.PORT || 5000;
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('short'));
app.use(cors());

// Connect to database
connectDB();

// API routes
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

## Build Process

### Install Dependencies

```bash
# Clean npm cache if needed
sudo npm cache clean --force

# Install server dependencies
cd ~/sites/your-app
npm install

# Install client dependencies
cd client
npm install
```

### Build Next.js Application

```bash
cd ~/sites/your-app/client

# Build for production
npm run build

# Set permissions
chmod 600 .env
```

### Fix Permissions

```bash
# Change ownership
sudo chown -R webuser:webuser ~/sites/your-app/client/.next

# Set permissions
sudo chmod -R 755 ~/sites/your-app/client/.next
```

## PM2 Configuration

### Install PM2

```bash
sudo npm install -g pm2
```

### Start Express Server

```bash
cd ~/sites/your-app

# Start server
pm2 start npm --name "server" -- run start

# Or with specific script
pm2 start server/server.js --name "server"
```

### Start Next.js Application

```bash
cd ~/sites/your-app/client

# Start Next.js
pm2 start npm --name "client" -- start
```

### PM2 Ecosystem File (Recommended)

Create `ecosystem.config.js` in project root:

```javascript
module.exports = {
  apps: [
    {
      name: 'server',
      cwd: './server',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '../logs/server-err.log',
      out_file: '../logs/server-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'client',
      cwd: './client',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '../logs/client-err.log',
      out_file: '../logs/client-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
```

Start with ecosystem:

```bash
# Create logs directory
mkdir logs

# Start all apps
pm2 start ecosystem.config.js

# Save configuration
pm2 save

# Setup startup
pm2 startup systemd
# Run the command it outputs

# Or specific command
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u webuser --hp /home/webuser
```

### PM2 Commands

```bash
# Status
pm2 status

# Logs
pm2 logs
pm2 logs server
pm2 logs client

# Restart
pm2 restart server
pm2 restart client
pm2 restart all

# Stop
pm2 stop server
pm2 stop client

# Delete
pm2 delete server
pm2 delete client

# Monitor
pm2 monit
```

## Nginx Setup

### Install Nginx

```bash
sudo apt install -y nginx

# Start and enable
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/default
```

**Basic Configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name yourdomain.com www.yourdomain.com;
    
    # Next.js app
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
    
    # Express API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Test and Restart

```bash
# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## SSL Configuration

### Install Certbot

```bash
sudo apt install -y python3-certbot-nginx
```

### Fix Permissions for Certbot

```bash
# Allow certbot to verify ownership
sudo chown -R www-data:www-data ~/sites/your-app/client/.next
```

### Obtain SSL Certificate

```bash
# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Or with webroot
sudo certbot certonly -a webroot \
  --webroot-path=/home/webuser/sites/your-app/client/.next \
  -d yourdomain.com -d www.yourdomain.com
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
    
    # Next.js app
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
    
    # Express API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Test and Restart

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Test SSL Renewal

```bash
sudo certbot renew --dry-run
```

## Firewall Setup

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

## Troubleshooting

### Check Services

```bash
# PM2
pm2 status
pm2 logs

# Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log

# MongoDB
sudo systemctl status mongod
sudo tail -f /var/log/mongodb/mongod.log
```

### Common Issues

**PM2 not loading .env:**

Ensure dotenv is loaded with correct path:

```javascript
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../', '.env') });
```

**Permission denied on .next:**

```bash
sudo chown -R webuser:webuser ~/sites/your-app/client/.next
sudo chmod -R 755 ~/sites/your-app/client/.next
```

**MongoDB connection failed:**

Check connection string and user permissions:

```bash
mongosh -u nodeUser -p --authenticationDatabase myapp
```

**Nginx 502 Bad Gateway:**

```bash
# Check if apps are running
pm2 status

# Check logs
pm2 logs
```

## Updating Application

```bash
# Pull latest code
cd ~/sites/your-app
git pull origin main

# Update server
npm install
pm2 restart server

# Update client
cd client
npm install
npm run build
pm2 restart client

# Check status
pm2 status
pm2 logs
```

## Backup Strategy

```bash
# Create backup script
nano ~/backup-db.sh
```

```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/webuser/backups"
mkdir -p $BACKUP_DIR

mongodump \
  --uri="mongodb://nodeUser:password@localhost:27017/myapp" \
  --out="$BACKUP_DIR/backup_$TIMESTAMP"

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

```bash
chmod +x ~/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/webuser/backup-db.sh
```

---

**Related Topics:**
- Next.js API Routes
- Vercel Deployment
- Docker Deployment
- CI/CD with GitHub Actions
- Load Balancing
