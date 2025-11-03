---
title: "Ubuntu Server Initial Setup Guide"
description: "Complete guide to initial Ubuntu server setup including user creation, SSH hardening, firewall configuration, and DNS setup for Linode and other VPS providers"
tags:
  - ubuntu
  - linux
  - server
  - security
  - ssh
  - firewall
  - ufw
  - linode
  - vps
date: 2024-11-03
lastUpdated: 2024-11-03
---

# Ubuntu Server Initial Setup Guide

Complete guide to securing and configuring a fresh Ubuntu server (20.04/22.04) on Linode or any VPS provider.

## Table of Contents

- [Initial Connection](#initial-connection)
- [System Updates](#system-updates)
- [Timezone Configuration](#timezone-configuration)
- [Hostname Setup](#hostname-setup)
- [User Management](#user-management)
- [SSH Hardening](#ssh-hardening)
- [Firewall Configuration](#firewall-configuration)
- [Network Configuration](#network-configuration)
- [DNS Configuration](#dns-configuration)
- [Security Checklist](#security-checklist)

## Initial Connection

### Connect as Root

```bash
# Get IP from your VPS control panel
ssh root@your-server-ip

# Example
ssh root@203.0.113.10
```

### First Login

Accept the host key fingerprint when prompted.

## System Updates

### Update Package Lists and Upgrade

```bash
# Update package lists
apt update

# Upgrade installed packages
apt upgrade -y

# Optional: Full upgrade
apt full-upgrade -y

# Remove unnecessary packages
apt autoremove -y

# Clean package cache
apt clean
```

### Reboot if Kernel Updated

```bash
# Check if reboot required
[ -f /var/run/reboot-required ] && echo "Reboot required"

# Reboot
reboot
```

## Timezone Configuration

### Set Timezone

```bash
# Configure timezone interactively
dpkg-reconfigure tzdata

# Or set directly
timedatectl set-timezone America/New_York

# List available timezones
timedatectl list-timezones

# Common timezones
timedatectl set-timezone UTC
timedatectl set-timezone Europe/London
timedatectl set-timezone Africa/Johannesburg
```

### Verify Time Settings

```bash
# Check current time
date

# Check timezone info
timedatectl
```

## Hostname Setup

### Set Hostname

```bash
# Set hostname
hostnamectl set-hostname your-hostname

# Example
hostnamectl set-hostname myserver

# Verify
hostname
```

### Configure /etc/hosts

```bash
# Edit hosts file
nano /etc/hosts
```

Add your server's IP and hostname:

```
127.0.0.1       localhost.localdomain localhost
203.0.113.10    myserver.example.com myserver
2600:3c01::a123:b456:c789:d012 myserver.example.com myserver
```

**Important:** 
- Replace `203.0.113.10` with your IPv4 address
- Replace `2600:3c01::...` with your IPv6 address
- Set up DNS A record for IPv4
- Set up DNS AAAA record for IPv6

### Verify FQDN

```bash
# Check FQDN
hostname -f
```

## User Management

### Create New User

```bash
# Create user (replace with your username)
adduser yourusername

# You'll be prompted for:
# - Password
# - Full name
# - Room number (optional)
# - Work phone (optional)
# - Home phone (optional)
```

### Add User to Sudo Group

```bash
# Grant sudo privileges
adduser yourusername sudo

# Verify sudo access
groups yourusername
```

### Test New User

```bash
# Logout from root
exit

# Login as new user
ssh yourusername@your-server-ip

# Test sudo access
sudo apt update
```

## SSH Hardening

### Generate SSH Key Pair (On Local Machine)

```bash
# Generate 4096-bit RSA key
ssh-keygen -b 4096 -t rsa

# Or generate Ed25519 key (more secure, shorter)
ssh-keygen -t ed25519 -C "your-email@example.com"

# Keys will be saved in ~/.ssh/
# - Private key: id_rsa or id_ed25519
# - Public key: id_rsa.pub or id_ed25519.pub
```

### Copy Public Key to Server

```bash
# From local machine
ssh-copy-id yourusername@your-server-ip

# Or manually
cat ~/.ssh/id_rsa.pub | ssh yourusername@your-server-ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Test Key-Based Login

```bash
# Try logging in without password
ssh yourusername@your-server-ip
```

### Configure SSH Daemon

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config
```

**Recommended Settings:**

```bash
# Disable root login
PermitRootLogin no

# Use IPv4 only (optional)
AddressFamily inet

# Disable password authentication (after key setup)
PasswordAuthentication no

# Disable empty passwords
PermitEmptyPasswords no

# Disable X11 forwarding (if not needed)
X11Forwarding no

# Change default port (optional, for security through obscurity)
# Port 2222

# Allow specific users only (optional)
AllowUsers yourusername

# Maximum authentication attempts
MaxAuthTries 3

# Login grace time
LoginGraceTime 30
```

### Restart SSH Service

```bash
# Test configuration
sudo sshd -t

# Restart SSH
sudo systemctl restart sshd

# Check status
sudo systemctl status sshd
```

**Important:** Keep your current SSH session open and test new connection in another terminal before closing!

## Firewall Configuration

### Install UFW

```bash
# Install UFW (usually pre-installed)
sudo apt install ufw
```

### Configure UFW Rules

```bash
# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (important - do this first!)
sudo ufw allow ssh
# Or if you changed SSH port
# sudo ufw allow 2222/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Allow specific IP (optional)
sudo ufw allow from 203.0.113.0/24

# Allow specific port range
sudo ufw allow 6000:6007/tcp
```

### Enable UFW

```bash
# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose

# Check numbered rules
sudo ufw status numbered
```

### UFW Management

```bash
# Delete rule by number
sudo ufw delete 2

# Delete rule by specification
sudo ufw delete allow 80/tcp

# Disable firewall
sudo ufw disable

# Reset firewall
sudo ufw reset

# Reload rules
sudo ufw reload
```

## Network Configuration

### Static IP with Netplan

**Check network interface:**

```bash
# List network interfaces
ip addr show

# Common interface names: eth0, ens3, ens160
```

**Edit Netplan configuration:**

```bash
# Navigate to netplan directory
cd /etc/netplan

# List config files
ls -la

# Edit configuration (filename may vary)
sudo nano 01-netcfg.yaml
```

**Example Static IP Configuration:**

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.1.100/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 1.1.1.1
          - 8.8.8.8
          - 8.8.4.4
```

**For DHCP (default):**

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: yes
      dhcp6: yes
```

### Apply Network Configuration

```bash
# Test configuration (will revert after 120 seconds if not confirmed)
sudo netplan try

# Apply configuration
sudo netplan apply

# Debug mode
sudo netplan --debug apply

# Check IP configuration
ip addr show
```

## DNS Configuration

### Linode DNS Setup

**At Domain Registrar:**

Update nameservers to Linode's:

```
ns1.linode.com
ns2.linode.com
ns3.linode.com
ns4.linode.com
ns5.linode.com
```

**In Linode Control Panel:**

1. Go to Domains
2. Add domain
3. Add DNS records:

**Common DNS Records:**

```
# A Record (IPv4)
example.com         A       203.0.113.10

# AAAA Record (IPv6)
example.com         AAAA    2600:3c01::a123:b456:c789:d012

# WWW subdomain
www.example.com     A       203.0.113.10

# Mail server
example.com         MX 10   mail.example.com
mail.example.com    A       203.0.113.10

# TXT records (SPF, DKIM, etc.)
example.com         TXT     "v=spf1 mx ~all"
```

### Custom DNS Servers

**Edit resolved.conf:**

```bash
sudo nano /etc/systemd/resolved.conf
```

```ini
[Resolve]
DNS=1.1.1.1 8.8.8.8
FallbackDNS=8.8.4.4 1.0.0.1
```

**Restart service:**

```bash
sudo systemctl restart systemd-resolved

# Check DNS
resolvectl status
```

## Security Checklist

### Essential Security Steps

- [ ] System updated and upgraded
- [ ] Timezone configured
- [ ] Hostname set correctly
- [ ] Non-root user created with sudo access
- [ ] SSH key-based authentication enabled
- [ ] Root login disabled
- [ ] Password authentication disabled (SSH)
- [ ] UFW firewall enabled and configured
- [ ] Only necessary ports open
- [ ] DNS records configured
- [ ] Fail2ban installed (optional but recommended)

### Install Fail2ban (Recommended)

```bash
# Install fail2ban
sudo apt install fail2ban

# Copy default config
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Edit configuration
sudo nano /etc/fail2ban/jail.local

# Enable and start
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check status
sudo fail2ban-client status
```

### Enable Automatic Security Updates

```bash
# Install unattended-upgrades
sudo apt install unattended-upgrades

# Configure
sudo dpkg-reconfigure -plow unattended-upgrades

# Edit configuration
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

### Monitor System Logs

```bash
# SSH authentication logs
sudo tail -f /var/log/auth.log

# System logs
sudo journalctl -f

# Failed login attempts
sudo grep "Failed password" /var/log/auth.log
```

## Additional Recommendations

### Install Essential Tools

```bash
# Development tools
sudo apt install build-essential git curl wget vim htop

# Network tools
sudo apt install net-tools dnsutils

# Security tools
sudo apt install fail2ban ufw
```

### Set Up Swap (If Needed)

```bash
# Check existing swap
swapon --show

# Create swap file (2GB example)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Configure Timezone for Logs

```bash
# Set timezone
sudo timedatectl set-timezone UTC

# Or your local timezone
sudo timedatectl set-timezone America/New_York
```

---

**Related Topics:**
- Nginx Installation
- Node.js Setup
- MongoDB Installation
- SSL with Let's Encrypt
- Docker Installation
- Monitoring with Prometheus
