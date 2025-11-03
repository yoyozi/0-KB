---
title: "Deploying MERN Stack with Ansible, PM2, and Nginx"
description: "Complete deployment guide for Node.js, Next.js, Express, and MongoDB applications using Ansible automation, PM2 process management, and Nginx reverse proxy on Ubuntu servers"
tags:
  - deployment
  - mern-stack
  - nodejs
  - nextjs
  - express
  - mongodb
  - pm2
  - nginx
  - ubuntu
  - ansible
  - ssl
  - lets-encrypt
  - devops
date: "2024-11-03T00:00:00.000Z"
lastUpdated: "2024-11-03T00:00:00.000Z"
---

# Deploying MERN Stack with Ansible, PM2, and Nginx

A comprehensive guide for deploying a full-stack MERN application (MongoDB, Express, React/Next.js, Node.js) on Ubuntu servers using Ansible for automation, PM2 for process management, and Nginx as a reverse proxy.

## Prerequisites

- Ubuntu 22.04 LTS server
- SSH access with sudo privileges
- Domain name (for SSL setup)
- Basic knowledge of Linux command line
- Git installed on local machine

## Table of Contents

- [User Setup](#user-setup)
- [Install Node.js](#install-nodejs)
- [Clone Project from GitHub](#clone-project-from-github)
- [MongoDB Installation](#mongodb-installation)
- [MongoDB Configuration](#mongodb-configuration)
- [Database Setup](#database-setup)
- [Build Application](#build-application)
- [PM2 Process Manager](#pm2-process-manager)
- [Nginx Setup](#nginx-setup)
- [SSL Certificate](#ssl-certificate)
- [Firewall Configuration](#firewall-configuration)
- [Troubleshooting](#troubleshooting)

## User Setup

Create a deployment user on the server and set up SSH keys for secure access.

### Generate SSH Keys

On your deployment machine (where Ansible runs):

```bash

# Generate SSH key for web user

ssh-keygen -f webuser -t ed25519 -C "webUser"

# Copy public key to target servers

ssh-copy-id -i ~/.ssh/webuser.pub webuser@axweb
ssh-copy-id -i ~/.ssh/webuser.pub webuser@ioweb

```

## Install Node.js

Install the latest LTS version of Node.js using NodeSource repository.

### Add NodeSource Repository

```bash

# Download and run the setup script for Node.js 21.x

curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash -

# Install Node.js

sudo apt-get install -y nodejs

```

### Verify Installation

```bash

# Check Node.js version

node -v

# Output: v21.7.1

# Check npm version

npm -v

# Output: 10.5.0

```

**Reference:** [NodeSource Installation Instructions](https://github.com/nodesource/distributions?tab=readme-ov-file#installation-instructions)

## Clone Project from GitHub

Set up the project directory and clone your application from GitHub.

### Install Git

```bash

# Git usually comes pre-installed on Ubuntu

sudo apt -y install git

```

### Clone Repository

```bash

# Switch to webuser

su - webuser

# Create sites directory

mkdir sites
cd sites

# Clone your project

git clone git@github.com:yoyozi/shoppingCart.git

```

## MongoDB Installation

Install MongoDB 7.0 on Ubuntu 22.04 (Jammy).

### Check Ubuntu Version

```bash

# Verify your Ubuntu release

lsb_release -a

```

**Expected output:**

```

Distributor ID: Ubuntu
Description:    Ubuntu 22.04.4 LTS
Release:        22.04
Codename:       jammy

```

### Install Required Packages

```bash

# Install gnupg and curl

sudo apt-get install gnupg curl

```

### Import MongoDB GPG Key

```bash

# Import the public key for MongoDB 7.0

curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

```

### Add MongoDB Repository

```bash

# Create the list file for MongoDB

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

```

### Install MongoDB

```bash

# Update package database

sudo apt-get update

# Install MongoDB

sudo apt-get install -y mongodb-org

```

**Reference:** [MongoDB Ubuntu Installation Guide](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)

## MongoDB Configuration

Configure MongoDB with authentication and create necessary users.

### Start and Enable MongoDB

```bash

# Start MongoDB service

sudo systemctl start mongod.service

# Enable MongoDB to start on boot

sudo systemctl enable mongod.service

```

### Create Admin User

Connect to MongoDB shell:

```bash

# Connect to MongoDB

mongosh --port 27017

```

**Note:** To disable telemetry, run `disableTelemetry()` in the MongoDB shell.

Create the admin user:

```javascript
// Switch to admin database
use admin

// Create admin user with full privileges
db.createUser({
  user: "mongoAdmin",
  pwd: passwordPrompt(),
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})

```

### Manage Users

```javascript
// Change user password
db.changeUserPassword("mongoAdmin", "new_password")

// List all users
db.getUsers()

```

### Enable Authentication

Edit MongoDB configuration file:

```bash
sudo vim /etc/mongod.conf

```

Add or modify the security section:

```yaml
security:
  authorization: enabled

```

Restart MongoDB:

```bash
sudo systemctl restart mongod.service

```

### Create Application User

```bash

# Connect as admin

mongosh --port 27017 -u mongoAdmin -p

```

Create a user for your Node.js application:

```javascript
// Switch to admin database
use admin

// Create application user
db.createUser({
  user: "nodeUser",
  pwd: passwordPrompt(),
  roles: [
    { role: "readWrite", db: "ozoneshop" },
    { role: "dbAdmin", db: "ozoneshop" }
  ]
})

```

### Test Application User

```bash

# Test connection with nodeUser

mongosh --port 27017 -u nodeUser -p

```

## Database Setup

Import your database from a backup or seed data.

### Export Database (Development)

On your development machine:

```bash

# Create a backup of your database

mongodump --db=ozoneshop --out=./00-Backup/20240321

```

### Import Database (Production)

On your production server:

```bash

# Restore database from backup

mongorestore --uri="mongodb://nodeUser@localhost:27017" ./20240321/

```

### Configure Database Connection

Create or update your database configuration file (`config/db.js`):

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  const url = process.env.MONGO_URI;
  try {
    const conn = await mongoose.connect(url)
    console.log(`Mongoose connected to ${conn.connection.host}...`)
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;

```

### Environment Variables

Create `.env` file with your MongoDB connection string:

```ini
MONGO_URI=mongodb://nodeUser:your_password@localhost:27017/ozoneshop
PORT=5000
NODE_ENV=production

```

**Important:** The `MONGO_URI` includes the username and password in the connection string.

## Build Application

Build both server and client components of your application.

### Build Server

```bash

# Navigate to main app folder

cd ~/sites/your-app

# Install server dependencies

npm install

# Start server (for testing)

npm run live

```

### Build Client

```bash

# Navigate to client folder

cd client

# Install client dependencies

npm install

# Build Next.js application

npm run build

# Secure environment file

chmod 600 .env

```

## PM2 Process Manager

Use PM2 to manage your Node.js applications and ensure they run continuously.

### Install PM2

```bash

# Install PM2 globally

sudo npm install pm2@latest -g

```

### Start Express Server

```bash

# Navigate to app directory

cd ~/sites/your-app

# Start Express server with PM2

pm2 start server.js --name "express-server"

```

### Start Next.js Application

```bash

# Navigate to client directory

cd ~/sites/your-app/client

# Start Next.js app with PM2

pm2 start npm --name "nextjs-ozoneshop" -- start

```

### Verify Running Processes

```bash

# Install net-tools for netstat

sudo apt install net-tools

# Check listening ports

netstat -tupan

# Check PM2 status

pm2 status

```

### Enable PM2 Startup

Configure PM2 to start on system boot:

```bash

# Generate startup script

pm2 startup

# Save current process list

pm2 save

```

### PM2 Commands

```bash

# View status of all processes

pm2 status

# Stop a specific process

pm2 stop express-server
pm2 stop nextjs-ozoneshop

# Restart a process

pm2 restart express-server

# View logs

pm2 logs

# Monitor processes

pm2 monit

```

## Troubleshooting

### PM2 Not Loading Environment Variables

If PM2 doesn't load your `.env` file properly, configure the path explicitly in your `server.js`:

```javascript
const express = require('express');
const path = require('path');

// Load .env from parent directory
require('dotenv').config({ path: path.join(__dirname, '../', '.env') });

const port = process.env.PORT || 5000;
const { errHandler } = require('./middleware/errorMiddleware.js');
const connectDB = require('./config/db.js');
const colors = require('colors');
const cors = require('cors');
const corsOptions = require('./corsOptions');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(morgan('short'));
app.use(express.urlencoded({ extended: false }));

// Connect to database
connectDB();

```

### Configure PM2 Startup for Specific User

If prompted by PM2, run this command:

```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u webuser --hp /home/webuser

# Then save the process list

pm2 save

# To remove startup script

pm2 unstartup systemd

```

## Nginx Setup

Configure Nginx as a reverse proxy for your application.

### Install Nginx

```bash
sudo apt install nginx

```

After installation, visiting your server's IP address should show the "Welcome to nginx!" page.

### Configure Reverse Proxy

Edit the default Nginx configuration:

```bash
sudo vim /etc/nginx/sites-available/default

```

Replace the `location /` block with:

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

```

Add your domain name:

```nginx
server_name yourdomain.com www.yourdomain.com;

```

### Test and Restart Nginx

```bash

# Test configuration

sudo nginx -t

# Restart Nginx

sudo service nginx restart

```

## SSL Certificate

Set up free SSL certificates using Let's Encrypt.

### Install Certbot

```bash
sudo apt install python3-certbot-nginx

```

### Obtain SSL Certificate

```bash

# Run Certbot

sudo certbot --nginx certonly

```

Follow the prompts:
1. Enter your email address
2. Agree to terms of service
3. Select domains for certificate

### Configure Nginx with SSL

Edit your Nginx configuration:

```bash
sudo vim /etc/nginx/sites-available/default

```

Replace with the following configuration (update paths and domain):

```nginx

# Redirect HTTP to HTTPS

server {
    listen [::]:80;
    listen 80;

    server_name yourdomain.com www.yourdomain.com;

    return 301 https://yourdomain.com$request_uri;
}

# Redirect www to non-www HTTPS

server {
    listen [::]:443 ssl;
    listen 443 ssl;

    server_name www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    return 301 https://yourdomain.com$request_uri;
}

# Main HTTPS server

server {
    listen [::]:443 ssl http2;
    listen 443 ssl http2;

    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

```

### Test and Reload Nginx

```bash

# Test configuration

sudo nginx -t

# Reload Nginx

sudo systemctl reload nginx

```

## Firewall Configuration

Configure UFW (Uncomplicated Firewall) to secure your server.

### Enable Firewall and Allow Services

```bash

# Enable UFW

sudo ufw enable

# Allow SSH (important - do this first!)

sudo ufw allow 22/tcp

# Allow HTTP

sudo ufw allow 80/tcp

# Allow HTTPS

sudo ufw allow 443/tcp

# Check status

sudo ufw status

```

## Next Steps

### Recommended Improvements

1. **Automated Backups**
   - Set up nightly MongoDB backups
   - Configure backup rotation
   - Store backups off-site

2. **Monitoring**
   - Set up application monitoring
   - Configure log aggregation
   - Set up alerts for downtime

3. **Security Hardening**
   - Configure fail2ban
   - Set up SSH key-only authentication
   - Regular security updates

4. **Performance Optimization**
   - Enable Nginx caching
   - Configure CDN for static assets
   - Optimize database indexes

## Summary

You now have a fully deployed MERN stack application with:

- ✅ Node.js and npm installed
- ✅ MongoDB configured with authentication
- ✅ Application code deployed from Git
- ✅ PM2 managing application processes
- ✅ Nginx serving as reverse proxy
- ✅ SSL certificate for HTTPS
- ✅ Firewall configured for security

Your application should be accessible at `https://yourdomain.com` with automatic HTTPS redirection and process management ensuring high availability.
