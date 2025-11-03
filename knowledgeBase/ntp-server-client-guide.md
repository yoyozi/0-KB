---
title: "NTP Server and Client Setup Guide"
description: "Complete guide to setting up and configuring NTP (Network Time Protocol) servers and clients on Linux for accurate time synchronization"
tags:
  - ntp
  - time-synchronization
  - linux
  - ubuntu
  - networking
  - server
  - systemd-timesyncd
date: 2024-11-03
lastUpdated: 2024-11-03
---

# NTP Server and Client Setup Guide

Complete guide to configuring NTP (Network Time Protocol) for accurate time synchronization across your network.

## Table of Contents

- [Introduction](#introduction)
- [NTP vs Systemd-timesyncd](#ntp-vs-systemd-timesyncd)
- [NTP Server Setup](#ntp-server-setup)
- [NTP Client Setup](#ntp-client-setup)
- [Systemd-timesyncd Setup](#systemd-timesyncd-setup)
- [Verification and Testing](#verification-and-testing)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Introduction

### What is NTP?

Network Time Protocol (NTP) is a networking protocol for clock synchronization between computer systems over packet-switched, variable-latency data networks.

### Why Time Synchronization Matters

- **Log correlation** - Accurate timestamps across systems
- **Security** - Kerberos and SSL certificates require synchronized time
- **Distributed systems** - Databases and clusters need time sync
- **Compliance** - Many regulations require accurate timekeeping

### NTP Hierarchy

- **Stratum 0** - Atomic clocks, GPS clocks (reference clocks)
- **Stratum 1** - Servers directly connected to Stratum 0
- **Stratum 2** - Servers that sync with Stratum 1
- **Stratum 3-15** - Each level syncs with the level above

## NTP vs Systemd-timesyncd

### NTP (ntpd)

**Pros:**
- Full NTP server functionality
- Can serve time to other systems
- More accurate for servers
- Advanced configuration options

**Cons:**
- More complex to configure
- Higher resource usage
- Overkill for simple clients

**Use when:**
- Setting up an NTP server
- Need high accuracy
- Serving time to other systems

### Systemd-timesyncd

**Pros:**
- Lightweight and simple
- Built into systemd
- Sufficient for most clients
- Easy to configure

**Cons:**
- Client only (can't serve time)
- Less accurate than ntpd
- Limited configuration

**Use when:**
- Simple time sync needed
- Desktop or workstation
- Client-only requirements

## NTP Server Setup

### Install NTP

```bash
# Update package list
sudo apt update

# Install NTP
sudo apt install ntp

# Verify installation
sntp --version
ntpd --version
```

### Configure NTP Server

```bash
# Edit configuration
sudo nano /etc/ntp.conf
```

**Basic Configuration:**

```conf
# Drift file
driftfile /var/lib/ntp/ntp.drift

# Leap seconds definition
leapfile /usr/share/zoneinfo/leap-seconds.list

# Statistics (optional)
statistics loopstats peerstats clockstats
filegen loopstats file loopstats type day enable
filegen peerstats file peerstats type day enable
filegen clockstats file clockstats type day enable

# NTP Pool Servers (use servers close to your location)
# Global pool
pool 0.pool.ntp.org iburst
pool 1.pool.ntp.org iburst
pool 2.pool.ntp.org iburst
pool 3.pool.ntp.org iburst

# Regional pools (examples)
# North America
# pool 0.north-america.pool.ntp.org iburst

# Europe
# pool 0.europe.pool.ntp.org iburst

# Asia
# pool 0.asia.pool.ntp.org iburst

# Africa (South Africa example)
# server ntp1.meraka.csir.co.za
# server ntp.dimensiondata.com

# Fallback
pool ntp.ubuntu.com iburst

# Access control
# By default, exchange time with everybody, but don't allow configuration
restrict -4 default kod notrap nomodify nopeer noquery limited
restrict -6 default kod notrap nomodify nopeer noquery limited

# Local users may interrogate the ntp server more closely
restrict 127.0.0.1
restrict ::1

# Needed for adding pool entries
restrict source notrap nomodify noquery

# Allow clients from local network (adjust to your network)
restrict 192.168.1.0 mask 255.255.255.0 nomodify notrap

# Broadcast time to local subnet (optional)
# broadcast 192.168.1.255
```

### Start and Enable NTP Service

```bash
# Start NTP service
sudo systemctl start ntp

# Enable on boot
sudo systemctl enable ntp

# Check status
sudo systemctl status ntp
```

### Configure Firewall

```bash
# Allow NTP traffic (UDP port 123)
sudo ufw allow 123/udp

# Or allow from specific network
sudo ufw allow from 192.168.1.0/24 to any port 123 proto udp

# Check firewall status
sudo ufw status
```

### Verify NTP Server

```bash
# Check NTP peers
ntpq -p

# Check NTP status
ntpstat

# Detailed status
ntpq -c rv
```

## NTP Client Setup

### Option 1: Using NTP Client

```bash
# Install NTP
sudo apt install ntp

# Edit configuration
sudo nano /etc/ntp.conf
```

**Client Configuration:**

```conf
driftfile /var/lib/ntp/ntp.drift

# Point to your NTP server
server 192.168.1.100 iburst prefer
server 0.pool.ntp.org iburst
server 1.pool.ntp.org iburst

# Access control
restrict -4 default kod notrap nomodify nopeer noquery limited
restrict -6 default kod notrap nomodify nopeer noquery limited
restrict 127.0.0.1
restrict ::1
restrict source notrap nomodify noquery
```

```bash
# Restart NTP
sudo systemctl restart ntp

# Check synchronization
ntpq -p
```

### Option 2: Using ntpdate (One-time Sync)

```bash
# Install ntpdate
sudo apt install ntpdate

# Stop NTP service
sudo systemctl stop ntp

# Sync time
sudo ntpdate -s time.nist.gov

# Or sync with your server
sudo ntpdate -s 192.168.1.100

# Start NTP service
sudo systemctl start ntp
```

## Systemd-timesyncd Setup

### Enable Systemd-timesyncd

```bash
# Stop and disable NTP if installed
sudo systemctl stop ntp
sudo systemctl disable ntp

# Enable systemd-timesyncd
sudo systemctl enable systemd-timesyncd
sudo systemctl start systemd-timesyncd
```

### Configure Systemd-timesyncd

```bash
# Edit configuration
sudo nano /etc/systemd/timesyncd.conf
```

**Configuration:**

```ini
[Time]
NTP=192.168.1.100 0.pool.ntp.org 1.pool.ntp.org
FallbackNTP=ntp.ubuntu.com
#RootDistanceMaxSec=5
#PollIntervalMinSec=32
#PollIntervalMaxSec=2048
```

```bash
# Restart service
sudo systemctl restart systemd-timesyncd

# Check status
timedatectl status
timedatectl show-timesync --all
```

### Set Timezone

```bash
# List timezones
timedatectl list-timezones

# Set timezone
sudo timedatectl set-timezone America/New_York
sudo timedatectl set-timezone Europe/London
sudo timedatectl set-timezone Africa/Johannesburg
sudo timedatectl set-timezone UTC

# Verify
timedatectl
```

## Verification and Testing

### Check Time Synchronization

```bash
# Using timedatectl
timedatectl status

# Using ntpq (for NTP)
ntpq -p

# Using ntpstat
ntpstat

# Check system time
date

# Check hardware clock
sudo hwclock --show
```

### NTP Query Output Explained

```bash
ntpq -p
```

Output columns:
- **remote** - NTP server address
- **refid** - Reference ID of the server
- **st** - Stratum level
- **t** - Type (u=unicast, b=broadcast, l=local)
- **when** - Last time server was queried
- **poll** - Polling interval (seconds)
- **reach** - Reachability register (octal)
- **delay** - Round-trip delay (ms)
- **offset** - Time difference (ms)
- **jitter** - Dispersion (ms)

Symbols:
- **\*** - Current sync source
- **+** - Candidate for sync
- **-** - Discarded as outlier
- **x** - Discarded as false ticker

### Test NTP Server

```bash
# From another machine
ntpdate -q your-ntp-server-ip

# Or
sntp -t 5 your-ntp-server-ip

# Check if port is open
nc -zvu your-ntp-server-ip 123
```

## Troubleshooting

### Common Issues

**Time not synchronizing:**

```bash
# Check NTP service status
sudo systemctl status ntp

# Check logs
sudo journalctl -u ntp -f
sudo tail -f /var/log/syslog | grep ntp

# Restart service
sudo systemctl restart ntp

# Force sync
sudo systemctl stop ntp
sudo ntpdate -s pool.ntp.org
sudo systemctl start ntp
```

**Firewall blocking:**

```bash
# Check firewall rules
sudo ufw status

# Allow NTP
sudo ufw allow 123/udp

# Check if port is listening
sudo netstat -ulnp | grep 123
sudo ss -ulnp | grep 123
```

**Large time offset:**

```bash
# If offset is too large, NTP won't sync
# Stop NTP and manually set time
sudo systemctl stop ntp
sudo ntpdate -b pool.ntp.org
sudo systemctl start ntp
```

**Check NTP peers:**

```bash
# Detailed peer information
ntpq -c peers

# Association information
ntpq -c associations

# System variables
ntpq -c rv
```

### Debug Mode

```bash
# Run NTP in debug mode
sudo ntpd -d -n

# Or check with verbose output
ntpq -p -n
```

## Best Practices

### 1. Use Multiple Time Sources

Always configure at least 3-4 NTP servers for redundancy:

```conf
pool 0.pool.ntp.org iburst
pool 1.pool.ntp.org iburst
pool 2.pool.ntp.org iburst
pool 3.pool.ntp.org iburst
```

### 2. Use Geographic Proximity

Use NTP servers close to your location for better accuracy:

```conf
# Use regional pools
pool 0.north-america.pool.ntp.org iburst
pool 0.europe.pool.ntp.org iburst
pool 0.asia.pool.ntp.org iburst
```

### 3. Implement Access Control

Restrict who can query your NTP server:

```conf
# Deny all by default
restrict -4 default kod notrap nomodify nopeer noquery limited

# Allow specific network
restrict 192.168.1.0 mask 255.255.255.0 nomodify notrap
```

### 4. Monitor NTP Health

```bash
# Create monitoring script
cat > /usr/local/bin/check-ntp.sh << 'EOF'
#!/bin/bash
if ! ntpstat > /dev/null 2>&1; then
    echo "NTP not synchronized!"
    systemctl restart ntp
fi
EOF

chmod +x /usr/local/bin/check-ntp.sh

# Add to cron
crontab -e
# */15 * * * * /usr/local/bin/check-ntp.sh
```

### 5. Use iburst Option

The `iburst` option sends a burst of packets when the server is unreachable, speeding up initial synchronization:

```conf
server ntp.example.com iburst
```

### 6. Set Hardware Clock

Sync hardware clock with system time:

```bash
# Write system time to hardware clock
sudo hwclock --systohc

# Read hardware clock
sudo hwclock --show
```

### 7. Regular Backups

Backup NTP configuration:

```bash
sudo cp /etc/ntp.conf /etc/ntp.conf.backup
```

## Quick Reference

### NTP Commands

```bash
# Status
ntpq -p                    # Show peers
ntpstat                    # Show sync status
timedatectl status         # System time status

# Service management
sudo systemctl start ntp
sudo systemctl stop ntp
sudo systemctl restart ntp
sudo systemctl status ntp

# Manual sync
sudo ntpdate -s pool.ntp.org

# Logs
sudo journalctl -u ntp -f
```

### Configuration Files

```
/etc/ntp.conf                      # NTP configuration
/etc/systemd/timesyncd.conf        # Systemd-timesyncd config
/var/lib/ntp/ntp.drift             # Drift file
/var/log/syslog                    # NTP logs
```

### Public NTP Servers

```
pool.ntp.org                       # NTP Pool Project
time.nist.gov                      # NIST
time.google.com                    # Google
time.cloudflare.com                # Cloudflare
ntp.ubuntu.com                     # Ubuntu
```

---

**Related Topics:**
- Chrony (alternative to NTP)
- PTP (Precision Time Protocol)
- GPS Time Servers
- Network Monitoring
- System Administration
