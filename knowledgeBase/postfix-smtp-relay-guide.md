---
title: "Postfix SMTP Relay Setup Guide"
description: "Complete guide to configuring Postfix as an SMTP relay using external services like SendinBlue, Gmail, or Amazon SES"
tags:
  - postfix
  - smtp
  - email
  - mail-relay
  - sendinblue
  - gmail
  - linux
  - ubuntu
date: 2024-11-03
lastUpdated: 2024-11-03
---

# Postfix SMTP Relay Setup Guide

Complete guide to setting up Postfix as an SMTP relay for sending emails through external services.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Postfix Installation](#postfix-installation)
- [SMTP Relay Configuration](#smtp-relay-configuration)
- [DNS Configuration](#dns-configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Introduction

### What is Postfix?

Postfix is a free and open-source mail transfer agent (MTA) that routes and delivers electronic mail.

### Why Use SMTP Relay?

- **Deliverability** - Better inbox placement
- **Reputation** - Use established email services
- **Compliance** - SPF, DKIM, DMARC support
- **Scalability** - Handle high email volumes
- **Monitoring** - Track email delivery

### Popular SMTP Relay Services

- **SendinBlue (Brevo)** - 300 emails/day free
- **Gmail** - 500 emails/day (with Google Workspace)
- **Amazon SES** - Pay as you go
- **SendGrid** - 100 emails/day free
- **Mailgun** - 5,000 emails/month free
- **Postmark** - 100 emails/month free

## Prerequisites

### Check Hostname

```bash
# Check current hostname
hostname -f

# Should return FQDN like: mail.example.com
```

### Set FQDN

```bash
# Set hostname
sudo hostnamectl set-hostname mail.example.com

# Edit hosts file
sudo nano /etc/hosts
```

Add:

```
127.0.0.1       localhost
your-server-ip  mail.example.com mail
```

### Update System

```bash
sudo apt update
sudo apt upgrade -y
```

## Postfix Installation

### Install Postfix

```bash
# Install Postfix and SASL modules
sudo apt install postfix libsasl2-modules

# During installation:
# 1. Select "Internet Site"
# 2. Enter your FQDN (mail.example.com)
```

### Install Mail Utilities

```bash
# Install mailx for testing
sudo apt install bsd-mailx

# Or mailutils
sudo apt install mailutils
```

## SMTP Relay Configuration

### SendinBlue (Brevo) Configuration

**Get SMTP Credentials:**
1. Sign up at [SendinBlue](https://www.sendinblue.com/)
2. Go to SMTP & API → SMTP
3. Note your credentials:
   - Server: `smtp-relay.sendinblue.com`
   - Port: `587`
   - Username: Your email
   - Password: SMTP key

**Configure Postfix:**

```bash
# Edit main configuration
sudo nano /etc/postfix/main.cf
```

Add or modify:

```conf
# Relay host
relayhost = [smtp-relay.sendinblue.com]:587

# SASL authentication
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous

# TLS settings
smtp_tls_security_level = may
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt

# Header size (for SendinBlue)
header_size_limit = 4096000

# Network settings
inet_interfaces = loopback-only
inet_protocols = ipv4
```

**Create Password File:**

```bash
# Create sasl_passwd file
sudo nano /etc/postfix/sasl_passwd
```

Add:

```
[smtp-relay.sendinblue.com]:587 your-email@example.com:your-smtp-key
```

**Secure and Hash:**

```bash
# Create hash database
sudo postmap /etc/postfix/sasl_passwd

# Set permissions
sudo chmod 0600 /etc/postfix/sasl_passwd /etc/postfix/sasl_passwd.db

# Restart Postfix
sudo systemctl restart postfix
```

### Gmail Configuration

**Enable 2FA and Create App Password:**
1. Enable 2-Factor Authentication
2. Generate App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)

**Configure Postfix:**

```bash
sudo nano /etc/postfix/main.cf
```

```conf
relayhost = [smtp.gmail.com]:587
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_security_level = encrypt
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

**Password File:**

```bash
sudo nano /etc/postfix/sasl_passwd
```

```
[smtp.gmail.com]:587 your-email@gmail.com:your-app-password
```

```bash
sudo postmap /etc/postfix/sasl_passwd
sudo chmod 0600 /etc/postfix/sasl_passwd /etc/postfix/sasl_passwd.db
sudo systemctl restart postfix
```

### Amazon SES Configuration

**Get SMTP Credentials:**
1. AWS Console → Amazon SES
2. Create SMTP credentials
3. Note server: `email-smtp.region.amazonaws.com`

**Configure Postfix:**

```bash
sudo nano /etc/postfix/main.cf
```

```conf
relayhost = [email-smtp.us-east-1.amazonaws.com]:587
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_security_level = encrypt
smtp_tls_note_starttls_offer = yes
```

**Password File:**

```bash
sudo nano /etc/postfix/sasl_passwd
```

```
[email-smtp.us-east-1.amazonaws.com]:587 SMTP_USERNAME:SMTP_PASSWORD
```

```bash
sudo postmap /etc/postfix/sasl_passwd
sudo chmod 0600 /etc/postfix/sasl_passwd /etc/postfix/sasl_passwd.db
sudo systemctl restart postfix
```

### SendGrid Configuration

```conf
relayhost = [smtp.sendgrid.net]:587
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_security_level = encrypt
```

**Password File:**

```
[smtp.sendgrid.net]:587 apikey:YOUR_SENDGRID_API_KEY
```

## DNS Configuration

### SPF Record

Add TXT record to your domain:

```
v=spf1 include:spf.sendinblue.com ~all
```

For multiple services:

```
v=spf1 include:_spf.google.com include:spf.sendinblue.com ~all
```

### DKIM Record

**For SendinBlue:**
1. Go to Senders & IPs → Domains
2. Click "Authenticate this domain"
3. Add provided DKIM records to DNS

Example:

```
mail._domainkey.example.com TXT "v=DKIM1; k=rsa; p=MIGfMA0GCS..."
```

### DMARC Record

Add TXT record:

```
_dmarc.example.com TXT "v=DMARC1; p=none; rua=mailto:dmarc@example.com"
```

For stricter policy:

```
v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com; pct=100
```

### MX Record (Optional)

If receiving email:

```
example.com MX 10 mail.example.com
```

## Testing

### Send Test Email

```bash
# Using mailx
echo "This is a test email" | mailx -r from@example.com -s "Test Subject" to@example.com

# Using sendmail
echo -e "Subject: Test\n\nThis is a test" | sendmail to@example.com

# Using mail command
echo "Test body" | mail -s "Test Subject" to@example.com
```

### Check Mail Queue

```bash
# View mail queue
mailq

# Or
postqueue -p

# Flush queue (retry sending)
postqueue -f

# Delete all queued mail
postsuper -d ALL
```

### Check Logs

```bash
# Real-time log monitoring
sudo tail -f /var/log/mail.log

# Or
sudo journalctl -u postfix -f

# Search for specific email
sudo grep "to@example.com" /var/log/mail.log

# Check for errors
sudo grep "error" /var/log/mail.log
sudo grep "warning" /var/log/mail.log
```

### Test SMTP Connection

```bash
# Test connection to relay
telnet smtp-relay.sendinblue.com 587

# Or using openssl
openssl s_client -connect smtp-relay.sendinblue.com:587 -starttls smtp

# Test authentication
# After connecting:
EHLO localhost
AUTH LOGIN
# Enter base64 encoded username
# Enter base64 encoded password
```

### Verify DNS Records

```bash
# Check SPF
dig TXT example.com

# Check DKIM
dig TXT mail._domainkey.example.com

# Check DMARC
dig TXT _dmarc.example.com

# Check MX
dig MX example.com
```

## Troubleshooting

### Common Issues

**Authentication failed:**

```bash
# Check credentials
sudo cat /etc/postfix/sasl_passwd

# Verify hash file exists
ls -l /etc/postfix/sasl_passwd.db

# Check permissions
ls -l /etc/postfix/sasl_passwd*

# Recreate hash
sudo postmap /etc/postfix/sasl_passwd
sudo systemctl restart postfix
```

**Connection timeout:**

```bash
# Check if port 587 is open
telnet smtp-relay.sendinblue.com 587

# Check firewall
sudo ufw status
sudo ufw allow out 587/tcp

# Check if Postfix is running
sudo systemctl status postfix
```

**TLS/SSL errors:**

```bash
# Update CA certificates
sudo apt install ca-certificates
sudo update-ca-certificates

# Check TLS configuration
postconf | grep tls
```

**Mail stuck in queue:**

```bash
# Check queue
mailq

# View message details
postcat -q QUEUE_ID

# Flush queue
postqueue -f

# Delete specific message
postsuper -d QUEUE_ID

# Delete all
postsuper -d ALL
```

### Debug Mode

```bash
# Enable verbose logging
sudo postconf -e "smtp_tls_loglevel = 1"
sudo postconf -e "debug_peer_list = smtp-relay.sendinblue.com"
sudo systemctl restart postfix

# Watch logs
sudo tail -f /var/log/mail.log
```

### Check Configuration

```bash
# Check Postfix configuration
postconf -n

# Check specific setting
postconf relayhost
postconf smtp_sasl_auth_enable

# Test configuration
sudo postfix check
```

## Best Practices

### 1. Secure Credentials

```bash
# Proper permissions
sudo chmod 0600 /etc/postfix/sasl_passwd
sudo chmod 0600 /etc/postfix/sasl_passwd.db

# Owned by root
sudo chown root:root /etc/postfix/sasl_passwd*
```

### 2. Monitor Mail Queue

```bash
# Create monitoring script
sudo nano /usr/local/bin/check-mail-queue.sh
```

```bash
#!/bin/bash
QUEUE_SIZE=$(mailq | tail -1 | awk '{print $5}')
if [ "$QUEUE_SIZE" -gt 100 ]; then
    echo "Mail queue size: $QUEUE_SIZE" | mail -s "Mail Queue Alert" admin@example.com
fi
```

```bash
chmod +x /usr/local/bin/check-mail-queue.sh

# Add to cron
crontab -e
# */15 * * * * /usr/local/bin/check-mail-queue.sh
```

### 3. Log Rotation

```bash
# Check log rotation
cat /etc/logrotate.d/rsyslog
```

### 4. Rate Limiting

```bash
# Add to main.cf
sudo nano /etc/postfix/main.cf
```

```conf
# Limit outbound connections
smtp_destination_concurrency_limit = 2
smtp_destination_rate_delay = 1s
smtp_extra_recipient_limit = 10
```

### 5. Backup Configuration

```bash
# Backup Postfix config
sudo cp -r /etc/postfix /backup/postfix-$(date +%Y%m%d)

# Backup script
sudo tar -czf /backup/postfix-backup-$(date +%Y%m%d).tar.gz /etc/postfix
```

### 6. Use Aliases

```bash
# Edit aliases
sudo nano /etc/aliases
```

```
root: admin@example.com
postmaster: admin@example.com
```

```bash
# Update aliases database
sudo newaliases
```

### 7. Security Headers

```bash
# Add to main.cf
sudo nano /etc/postfix/main.cf
```

```conf
# Remove sensitive information
smtp_header_checks = regexp:/etc/postfix/header_checks
```

```bash
# Create header_checks
sudo nano /etc/postfix/header_checks
```

```
/^Received:/            IGNORE
/^X-Originating-IP:/    IGNORE
```

```bash
sudo postmap /etc/postfix/header_checks
sudo systemctl restart postfix
```

## Quick Reference

### Postfix Commands

```bash
# Service management
sudo systemctl start postfix
sudo systemctl stop postfix
sudo systemctl restart postfix
sudo systemctl reload postfix
sudo systemctl status postfix

# Queue management
mailq                          # View queue
postqueue -f                   # Flush queue
postsuper -d ALL               # Delete all
postsuper -d QUEUE_ID          # Delete specific

# Configuration
postconf -n                    # Show non-default settings
postconf -e "setting=value"    # Set configuration
postfix check                  # Check configuration

# Logs
tail -f /var/log/mail.log
journalctl -u postfix -f
```

### Configuration Files

```
/etc/postfix/main.cf           # Main configuration
/etc/postfix/master.cf         # Service configuration
/etc/postfix/sasl_passwd       # SMTP credentials
/etc/aliases                   # Email aliases
/var/log/mail.log              # Mail logs
```

---

**Related Topics:**
- Dovecot (IMAP/POP3)
- SpamAssassin
- Email Security
- Mail Server Hardening
- Email Marketing
