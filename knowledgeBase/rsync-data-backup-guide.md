---
title: "Rsync Data Backup Guide"
description: "Complete guide to using rsync for data backups including SSH key setup, rsync options, bash scripts, and cron job automation"
tags:
  - rsync
  - backup
  - ssh
  - bash
  - cron
  - linux
  - automation
date: 2024-11-03
lastUpdated: 2024-11-03
---

# Rsync Data Backup Guide

Complete guide to setting up automated data backups using rsync, SSH keys, bash scripts, and cron jobs.

## Table of Contents

- [SSH Key Setup](#ssh-key-setup)
- [Rsync Basics](#rsync-basics)
- [Rsync Options Explained](#rsync-options-explained)
- [Basic Bash Script](#basic-bash-script)
- [Advanced Backup Script](#advanced-backup-script)
- [Cron Job Setup](#cron-job-setup)
- [Email Notifications](#email-notifications)

## SSH Key Setup

Set up passwordless SSH authentication for automated backups.

```bash
# Generate SSH key pair
ssh-keygen

# Copy public key to remote server
ssh-copy-id -i ~/.ssh/id_rsa.pub craig@10.10.77.200

# Set correct permissions on private key
chmod 400 ~/.ssh/id_rsa
```

**Test the connection:**

```bash
ssh -i ~/.ssh/id_rsa craig@10.10.77.200
```

## Rsync Basics

### Basic Rsync Command

```bash
sudo rsync -av --progress --delete \
  --log-file=/home/your-username/Desktop/$(date +%Y%m%d)_rsync.log \
  --exclude "/home/your-username/.gvfs" \
  /home \
  /media/HomeBackup
```

### Remote Rsync with SSH

```bash
rsync -avz -e "ssh -i /home/craig/.ssh/id_rsa" \
  craig@10.10.77.200:/srv/dev-disk-by-uuid-d83733e6-8862-4e9d-b0e6-37a4945f88ef/Data/ \
  /local/destination/
```

## Rsync Options Explained

### Common Options

| Option | Description |
|--------|-------------|
| `-a` | Archive mode - preserves permissions, ownership, timestamps, and copies recursively |
| `-v` | Verbose - shows what's being copied |
| `-z` | Compress data during transfer |
| `-r` | Recursive - copy directories recursively |
| `-i` | Itemize changes - show detailed changes |
| `--progress` | Show progress during transfer |
| `--delete` | Delete files at destination that were deleted at source |
| `--log-file=FILE` | Save rsync output to log file |
| `--exclude=PATTERN` | Exclude files/directories matching pattern |
| `--exclude-from=FILE` | Exclude patterns listed in file |
| `-e "ssh -i KEY"` | Use SSH with specific key file |

### Archive Mode (-a) Includes

- `-r` - recursive
- `-l` - copy symlinks as symlinks
- `-p` - preserve permissions
- `-t` - preserve modification times
- `-g` - preserve group
- `-o` - preserve owner
- `-D` - preserve device files and special files

### Source Path Differences

```bash
/home      # Copies the directory AND its contents
/home/     # Copies ONLY the contents (not the directory itself)
```

## Basic Bash Script

Create a simple backup script.

### Script: `backup-simple.sh`

```bash
#!/bin/bash

rsync -avz -e "ssh -i /home/craig/.ssh/id_rsa" \
  craig@10.10.77.200:/srv/dev-disk-by-uuid-d83733e6-8862-4e9d-b0e6-37a4945f88ef/Data/ \
  /local/destination/
```

### Make Script Executable

```bash
chmod 770 backup-simple.sh
```

### Run the Script

```bash
./backup-simple.sh
```

## Advanced Backup Script

A production-ready backup script with logging and email notifications.

### Wrapper Script: `bu-wrapper.sh`

Calls the backup script and emails the results.

```bash
#!/bin/bash

# Run backup script and save output
~/bu-bigstore.sh > ~/bu_log_hello.txt

# Email the log file
(cat ~/bu_log_hello.txt) | mailx -s "Store2 rsync - bigstore ran" craig@netsecurity.co.za
```

### Backup Script: `bu-bigstore.sh`

The main backup script with variables and logging.

```bash
#!/bin/bash

# Variables
THEN=$(date)
DESTDIR="/mnt/storage/bigstore"
SOURCE="/srv/dev-disk-by-uuid-d83733e6-8862-4e9d-b0e6-37a4945f88ef/"
HOST="craig@10.10.77.200:"

# Log start time
echo "Script started: $THEN"
echo "Script location: $(readlink -f ${BASH_SOURCE[0]})"

# Run rsync
rsync -azir -e "ssh -i /home/craig/.ssh/id_rsa" \
  --delete \
  --exclude-from='bu_exclude_list.txt' \
  $HOST$SOURCE \
  $DESTDIR

# Log completion
NOW=$(date)
echo "Script finished: $NOW"

# Show disk usage
df -H /mnt/storage/
```

### Exclude File: `bu_exclude_list.txt`

Create a file listing patterns to exclude:

```
*.tmp
*.cache
.git/
node_modules/
__pycache__/
*.log
```

### Make Scripts Executable

```bash
chmod 770 bu-wrapper.sh
chmod 770 bu-bigstore.sh
```

## Cron Job Setup

Automate backups with cron.

### Edit Crontab

```bash
crontab -e
```

### Cron Job Example

```bash
MAILTO=""

# Run backup daily at 5:05 PM
05 17 * * * ~/bu-wrapper.sh
```

### Cron Time Format

```
# ┌───────────── minute (0 - 59)
# │ ┌───────────── hour (0 - 23)
# │ │ ┌───────────── day of month (1 - 31)
# │ │ │ ┌───────────── month (1 - 12)
# │ │ │ │ ┌───────────── day of week (0 - 6) (Sunday=0 or 7)
# │ │ │ │ │
# * * * * * command to execute
```

### Cron Examples

```bash
# Run at 2:30 AM every day
30 2 * * * /path/to/script.sh

# Run every hour
0 * * * * /path/to/script.sh

# Run every 15 minutes
*/15 * * * * /path/to/script.sh

# Run at midnight on the 1st of every month
0 0 1 * * /path/to/script.sh

# Run at 5 PM on weekdays (Monday-Friday)
0 17 * * 1-5 /path/to/script.sh
```

### Cron Shortcuts

```bash
@reboot     # Run once at startup
@yearly     # Run once a year (0 0 1 1 *)
@monthly    # Run once a month (0 0 1 * *)
@weekly     # Run once a week (0 0 * * 0)
@daily      # Run once a day (0 0 * * *)
@hourly     # Run once an hour (0 * * * *)
```

### Email Notifications

```bash
# Set email address for cron output
MAILTO=your@email.com

# Run command and send output via email
* * * * * /path/to/script.sh

# Disable all email notifications
* * * * * command > /dev/null 2>&1

# Disable email but allow error notifications
* * * * * command > /dev/null
```

### Complete Cron Example

```bash
# Set email for notifications
MAILTO=admin@example.com

# Daily backup at 2 AM
0 2 * * * ~/bu-wrapper.sh

# Weekly cleanup on Sunday at 3 AM
0 3 * * 0 ~/cleanup-old-backups.sh

# Hourly sync during business hours (9 AM - 5 PM, weekdays)
0 9-17 * * 1-5 ~/hourly-sync.sh
```

## Email Notifications

### Setup Postfix

For email notifications to work, you need a mail transfer agent like Postfix.

```bash
# Install postfix
sudo apt-get install postfix mailutils

# Configure postfix
sudo dpkg-reconfigure postfix
```

### Test Email

```bash
echo "Test email body" | mailx -s "Test Subject" your@email.com
```

## Best Practices

1. **Test your backup script manually** before adding to cron
2. **Use absolute paths** in cron jobs
3. **Set correct permissions** on SSH keys (400 or 600)
4. **Log all backup operations** for troubleshooting
5. **Monitor disk space** on backup destination
6. **Test restore procedures** regularly
7. **Keep multiple backup versions** (use dated directories)
8. **Exclude unnecessary files** to save space and time
9. **Use compression (-z)** for remote backups over slow connections
10. **Verify backups** by checking file counts and sizes

## Troubleshooting

### Check Cron Logs

```bash
# View cron logs
grep CRON /var/log/syslog

# Or
sudo tail -f /var/log/cron.log
```

### Test SSH Connection

```bash
ssh -i ~/.ssh/id_rsa craig@10.10.77.200
```

### Dry Run

Test rsync without actually copying files:

```bash
rsync -avz --dry-run -e "ssh -i /home/craig/.ssh/id_rsa" \
  craig@10.10.77.200:/source/ \
  /destination/
```

### Check Rsync Version

```bash
rsync --version
```

## Common Issues

### Permission Denied

```bash
# Fix SSH key permissions
chmod 400 ~/.ssh/id_rsa
chmod 700 ~/.ssh
```

### Cron Job Not Running

```bash
# Check cron service is running
sudo systemctl status cron

# Start cron service
sudo systemctl start cron
```

### Email Not Sending

```bash
# Check mail logs
sudo tail -f /var/log/mail.log

# Test mail command
echo "test" | mail -s "test" your@email.com
```

---

**Related Topics:**
- SSH Key Management
- Bash Scripting
- Linux System Administration
- Backup Strategies
