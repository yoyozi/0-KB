---
title: "Manjaro Linux Guide"
description: "Essential commands and configuration for Manjaro Linux including network management, systemd services, package management with pacman, and system configuration"
tags:
  - manjaro
  - linux
  - arch
  - pacman
  - systemd
  - networking
  - system-administration
date: 2024-11-03
lastUpdated: 2024-11-03
---

# Manjaro Linux Guide

Essential commands and configuration guide for Manjaro Linux, an Arch-based distribution.

## Table of Contents

- [Network Management](#network-management)
- [System Services](#system-services)
- [Package Management](#package-management)
- [Network Configuration](#network-configuration)
- [System Configuration](#system-configuration)
- [Useful Commands](#useful-commands)

## Network Management

### NetworkManager Commands

NetworkManager is the default network management tool in Manjaro.

```bash
# Show help
networkctl --help

# List all network interfaces
networkctl --all
networkctl list

# Show specific interface details
networkctl list enp0s3
networkctl status enp0s3

# Show status of all interfaces
networkctl status
```

### IP Address Management

```bash
# Show IP addresses
ip addr show
ip addr sh
ip a

# Show specific interface
ip addr show enp0s3

# Show routing table
ip route show
ip r

# Show network statistics
ip -s link
```

### Firewall (iptables)

```bash
# Show help
iptables --help

# List all rules
sudo iptables --list
sudo iptables -L

# List rules with line numbers
sudo iptables -L --line-numbers

# List rules in specific chain
sudo iptables -L INPUT
sudo iptables -L OUTPUT
sudo iptables -L FORWARD

# Show NAT rules
sudo iptables -t nat -L
```

## System Services

Manjaro uses systemd for service management.

### Service Management

```bash
# Check service status
systemctl status <service>
systemctl status sshd
systemctl status NetworkManager

# Start service
sudo systemctl start <service>
sudo systemctl start sshd

# Stop service
sudo systemctl stop <service>

# Restart service
sudo systemctl restart <service>

# Enable service (start on boot)
sudo systemctl enable <service>

# Disable service
sudo systemctl disable <service>

# Enable and start service
sudo systemctl enable --now <service>

# Disable and stop service
sudo systemctl disable --now <service>
```

### Common Services

```bash
# SSH daemon
systemctl status sshd

# Network Manager
systemctl status NetworkManager

# Firewall
systemctl status iptables

# Display manager (login screen)
systemctl status sddm  # or lightdm, gdm

# Bluetooth
systemctl status bluetooth
```

### View Service Logs

```bash
# View service logs
journalctl -u <service>
journalctl -u sshd

# Follow logs in real-time
journalctl -u sshd -f

# Show last 50 lines
journalctl -u sshd -n 50

# Show logs since boot
journalctl -u sshd -b
```

## Package Management

Manjaro uses `pacman` as its package manager.

### Update System

```bash
# Update package database and upgrade all packages
sudo pacman -Syu

# Force refresh package database and upgrade
sudo pacman -Syuu

# Update only package database
sudo pacman -Sy
```

### Install Packages

```bash
# Install package
sudo pacman -S <package>
sudo pacman -S vim

# Install multiple packages
sudo pacman -S vim git htop

# Install package without confirmation
sudo pacman -S --noconfirm vim
```

### Search Packages

```bash
# Search for package
pacman -Ss <keyword>
pacman -Ss vim
pacman -Ss text editor

# Search installed packages
pacman -Qs <keyword>
```

### Package Information

```bash
# Show package information
pacman -Si <package>
pacman -Si vim

# Show installed package information
pacman -Qi <package>
pacman -Qi vim

# List files owned by package
pacman -Ql <package>
pacman -Ql vim

# Find which package owns a file
pacman -Qo /usr/bin/vim
```

### Remove Packages

```bash
# Remove package
sudo pacman -R <package>

# Remove package and dependencies
sudo pacman -Rs <package>

# Remove package, dependencies, and config files
sudo pacman -Rns <package>

# Remove orphaned packages
sudo pacman -Rns $(pacman -Qtdq)
```

### Clean Package Cache

```bash
# Remove all cached packages
sudo pacman -Scc

# Remove old cached packages
sudo pacman -Sc
```

### AUR (Arch User Repository)

```bash
# Install yay (AUR helper)
sudo pacman -S yay

# Search AUR
yay -Ss <package>

# Install from AUR
yay -S <package>

# Update AUR packages
yay -Syu
```

## Network Configuration

### Static IP Configuration with systemd-networkd

#### Disable NetworkManager

```bash
# Disable NetworkManager
sudo systemctl disable --now NetworkManager.service

# Enable systemd-networkd
sudo systemctl enable --now systemd-networkd.service
sudo systemctl enable --now systemd-resolved.service
```

#### Configure Static IP

Create network configuration file:

```bash
# Edit network configuration
sudo vim /etc/systemd/network/enp0s3.network
```

**Configuration file content:**

```ini
[Match]
Name=enp0s3

[Network]
Address=10.10.77.13/24
Gateway=10.10.77.1
DNS=10.10.77.1
DNS=8.8.8.8
DNS=8.8.4.4
```

#### Apply Configuration

```bash
# Restart systemd-networkd
sudo systemctl restart systemd-networkd

# Check status
networkctl status enp0s3

# Test connectivity
ping -c 4 8.8.8.8
```

### DHCP Configuration

```bash
# Edit network configuration
sudo vim /etc/systemd/network/enp0s3.network
```

**DHCP configuration:**

```ini
[Match]
Name=enp0s3

[Network]
DHCP=yes
```

### DNS Configuration

```bash
# Edit resolved configuration
sudo vim /etc/systemd/resolved.conf
```

**DNS settings:**

```ini
[Resolve]
DNS=8.8.8.8 8.8.4.4
FallbackDNS=1.1.1.1 1.0.0.1
```

## System Configuration

### Vim Configuration

Create `.vimrc` for clipboard support:

```bash
# Create/edit .vimrc
vim ~/.vimrc
```

**Add clipboard support:**

```vim
" Enable system clipboard
set clipboard=unnamed

" Or for X11
set clipboard=unnamedplus

" Enable line numbers
set number

" Enable syntax highlighting
syntax on

" Set tab width
set tabstop=4
set shiftwidth=4
set expandtab
```

### SSH Configuration

```bash
# Install OpenSSH
sudo pacman -S openssh

# Enable SSH service
sudo systemctl enable --now sshd

# Check SSH status
systemctl status sshd

# Edit SSH config
sudo vim /etc/ssh/sshd_config

# Restart SSH after config changes
sudo systemctl restart sshd
```

**Common SSH settings:**

```bash
# Allow root login (not recommended)
PermitRootLogin no

# Use key-based authentication
PubkeyAuthentication yes
PasswordAuthentication no

# Change SSH port
Port 2222
```

### Firewall Configuration

```bash
# Install UFW (Uncomplicated Firewall)
sudo pacman -S ufw

# Enable UFW
sudo systemctl enable --now ufw

# Allow SSH
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Allow specific port
sudo ufw allow 8080/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

## Useful Commands

### System Information

```bash
# System information
uname -a
hostnamectl

# CPU information
lscpu

# Memory information
free -h

# Disk usage
df -h

# Disk partitions
lsblk

# PCI devices
lspci

# USB devices
lsusb

# Kernel version
uname -r

# Distribution information
cat /etc/os-release
```

### Process Management

```bash
# List processes
ps aux
ps aux | grep <process>

# Interactive process viewer
htop
top

# Kill process
kill <PID>
kill -9 <PID>  # Force kill

# Kill by name
pkill <process-name>
killall <process-name>
```

### Disk Management

```bash
# Check disk usage
df -h

# Check directory size
du -sh /path/to/directory

# Find large files
find / -type f -size +100M 2>/dev/null

# Mount partition
sudo mount /dev/sda1 /mnt

# Unmount partition
sudo umount /mnt

# List mounted filesystems
mount | column -t
```

### User Management

```bash
# Add user
sudo useradd -m -G wheel <username>

# Set password
sudo passwd <username>

# Delete user
sudo userdel -r <username>

# Add user to group
sudo usermod -aG <group> <username>

# List groups
groups <username>

# Switch user
su - <username>
```

### System Maintenance

```bash
# Clean package cache
sudo pacman -Sc

# Remove orphaned packages
sudo pacman -Rns $(pacman -Qtdq)

# Update mirror list
sudo pacman-mirrors --fasttrack

# Rank mirrors by speed
sudo pacman-mirrors --fasttrack && sudo pacman -Syyu

# Check for errors
sudo journalctl -p 3 -xb

# Clear journal logs
sudo journalctl --vacuum-time=2weeks
```

## Troubleshooting

### Network Issues

```bash
# Restart NetworkManager
sudo systemctl restart NetworkManager

# Check network interfaces
ip link show

# Bring interface up
sudo ip link set enp0s3 up

# Bring interface down
sudo ip link set enp0s3 down

# Flush DNS cache
sudo systemd-resolve --flush-caches

# Test DNS resolution
nslookup google.com
dig google.com
```

### Package Manager Issues

```bash
# Fix corrupted database
sudo rm /var/lib/pacman/db.lck
sudo pacman -Syu

# Reinstall all packages
sudo pacman -Qnq | sudo pacman -S -

# Clear cache and update
sudo pacman -Scc
sudo pacman -Syyu
```

### Boot Issues

```bash
# Check boot logs
journalctl -b

# Check failed services
systemctl --failed

# Rebuild initramfs
sudo mkinitcpio -P

# Update GRUB
sudo update-grub
```

## Quick Reference

### Essential Commands

```bash
# Update system
sudo pacman -Syu

# Install package
sudo pacman -S <package>

# Remove package
sudo pacman -Rs <package>

# Search package
pacman -Ss <keyword>

# Service status
systemctl status <service>

# Start service
sudo systemctl start <service>

# Enable service
sudo systemctl enable <service>

# Network status
networkctl status

# IP address
ip addr show

# Disk usage
df -h

# System info
uname -a
```

---

**Related Topics:**
- Arch Linux
- Pacman Package Manager
- Systemd
- Linux Networking
- AUR (Arch User Repository)
