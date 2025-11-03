---
title: "Tmux Cheatsheet"
description: "Comprehensive Tmux terminal multiplexer cheatsheet including sessions, windows, panes, key bindings, and configuration"
tags:
  - tmux
  - terminal
  - multiplexer
  - linux
  - productivity
  - cheatsheet
date: 2024-11-03
lastUpdated: 2024-11-03
---

# Tmux Cheatsheet

Complete reference for Tmux - a terminal multiplexer that lets you manage multiple terminal sessions.

## Table of Contents

- [Introduction](#introduction)
- [Sessions](#sessions)
- [Windows](#windows)
- [Panes](#panes)
- [Copy Mode](#copy-mode)
- [Configuration](#configuration)
- [Useful Commands](#useful-commands)

## Introduction

### What is Tmux?

Tmux is a terminal multiplexer that allows you to:
- Run multiple terminal sessions in one window
- Detach and reattach sessions
- Split terminal into panes
- Persist sessions after disconnection

### Default Prefix Key

The default prefix key is `Ctrl+b`. All commands start with this prefix.

**Note:** You can change this in your config file (see [Configuration](#configuration)).

## Sessions

Sessions are the highest level of organization in Tmux.

### Create New Session

```bash
# Create new session
tmux

# Create named session
tmux new -s mysession

# Create session with name and window
tmux new -s mysession -n mywindow
```

### Attach to Session

```bash
# Attach to last session
tmux attach

# Attach to named session
tmux a -t mysession

# Attach to session by number
tmux a -t 0
```

### Detach from Session

```
Ctrl+b d    # Detach from current session
```

### List Sessions

```bash
# List all sessions
tmux ls

# Or from within tmux
Ctrl+b s    # Show session list (interactive)
```

### Rename Session

```
Ctrl+b $    # Rename current session
```

```bash
# From command line
tmux rename-session -t old-name new-name
```

### Kill Session

```bash
# Kill specific session
tmux kill-session -t mysession

# Kill all sessions except current
tmux kill-session -a

# Kill all sessions
tmux kill-server
```

### Switch Sessions

```
Ctrl+b (    # Switch to previous session
Ctrl+b )    # Switch to next session
Ctrl+b L    # Switch to last session
```

## Windows

Windows are like tabs in a browser - each session can have multiple windows.

### Create Window

```
Ctrl+b c    # Create new window
```

### Navigate Windows

```
Ctrl+b n    # Next window
Ctrl+b p    # Previous window
Ctrl+b 0-9  # Switch to window by number
Ctrl+b w    # List all windows (interactive)
Ctrl+b l    # Switch to last window
Ctrl+b f    # Find window by name
```

### Rename Window

```
Ctrl+b ,    # Rename current window
```

### Close Window

```
Ctrl+b &    # Kill current window (with confirmation)
exit        # Close current window
```

### Reorder Windows

```
Ctrl+b .    # Move window to new index
```

## Panes

Panes allow you to split windows into multiple sections.

### Create Panes

```
Ctrl+b %    # Split pane vertically (left/right)
Ctrl+b "    # Split pane horizontally (top/bottom)
```

### Navigate Panes

```
Ctrl+b o              # Switch to next pane
Ctrl+b ;              # Switch to last active pane
Ctrl+b ↑/↓/←/→       # Switch to pane in direction
Ctrl+b q              # Show pane numbers
Ctrl+b q 0-9          # Switch to pane by number
```

### Resize Panes

```
Ctrl+b Ctrl+↑         # Resize pane up
Ctrl+b Ctrl+↓         # Resize pane down
Ctrl+b Ctrl+←         # Resize pane left
Ctrl+b Ctrl+→         # Resize pane right

# Hold Ctrl+b and use arrow keys repeatedly
```

### Pane Layouts

```
Ctrl+b Space          # Toggle between layouts
Ctrl+b Alt+1          # Even horizontal layout
Ctrl+b Alt+2          # Even vertical layout
Ctrl+b Alt+3          # Main horizontal layout
Ctrl+b Alt+4          # Main vertical layout
Ctrl+b Alt+5          # Tiled layout
```

### Zoom Pane

```
Ctrl+b z    # Toggle pane zoom (fullscreen)
```

### Close Pane

```
Ctrl+b x    # Kill current pane (with confirmation)
exit        # Close current pane
```

### Move Panes

```
Ctrl+b {    # Move pane left
Ctrl+b }    # Move pane right
Ctrl+b !    # Convert pane to window
```

### Synchronize Panes

```
Ctrl+b :setw synchronize-panes on     # Enable
Ctrl+b :setw synchronize-panes off    # Disable
```

## Copy Mode

Copy mode allows you to scroll and copy text.

### Enter Copy Mode

```
Ctrl+b [    # Enter copy mode
```

### Navigate in Copy Mode

```
↑/↓/←/→     # Move cursor
PgUp/PgDn   # Scroll page
g           # Go to top
G           # Go to bottom
/           # Search forward
?           # Search backward
n           # Next search result
N           # Previous search result
```

### Copy Text (Vi Mode)

```
Space       # Start selection
Enter       # Copy selection
v           # Start selection (vi mode)
y           # Copy selection (vi mode)
```

### Paste

```
Ctrl+b ]    # Paste buffer
```

### Exit Copy Mode

```
q           # Exit copy mode
Esc         # Exit copy mode
```

## Configuration

### Configuration File

Create or edit `~/.tmux.conf`:

```bash
nano ~/.tmux.conf
```

### Example Configuration

```bash
# Change prefix from Ctrl+b to Ctrl+a
unbind C-b
set -g prefix C-a
bind C-a send-prefix

# Start window and pane numbering at 1
set -g base-index 1
setw -g pane-base-index 1

# Enable mouse support
set -g mouse on

# Set easier window split keys
bind-key v split-window -h
bind-key h split-window -v

# Use Alt-arrow keys to switch panes (no prefix)
bind -n M-Left select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D

# Shift arrow to switch windows (no prefix)
bind -n S-Left previous-window
bind -n S-Right next-window

# Ctrl+Shift+Arrow to reorder windows
bind-key -n C-S-Left swap-window -t -1\; select-window -t -1
bind-key -n C-S-Right swap-window -t +1\; select-window -t +1

# Synchronize panes toggle
bind-key y set-window-option synchronize-panes\; display-message "synchronize mode toggled"

# Reload config
bind-key r source-file ~/.tmux.conf \; display-message "tmux.conf reloaded"

# Clear history
bind-key L clear-history

# Vi mode for copy
setw -g mode-keys vi
bind-key -T copy-mode-vi 'v' send -X begin-selection
bind-key -T copy-mode-vi 'y' send -X copy-selection-and-cancel

# No delay for escape key
set -sg escape-time 0

# Increase scrollback buffer
set -g history-limit 10000

# Display messages for longer
set-option -g display-time 3000
set-option -g display-panes-time 3000

# Automatically rename windows
set-window-option -g automatic-rename on
set-option -g set-titles on

# Allow arrow keys immediately after changing windows
set-option -g repeat-time 0

# Monitor activity
setw -g monitor-activity on
set -g visual-activity off

# Status bar
set -g status-position bottom
set -g status-justify centre
set -g status-style 'bg=colour234 fg=colour137'
set -g status-left '#[fg=colour233,bg=colour245,bold] #S '
set -g status-right '#[fg=colour233,bg=colour245,bold] %H:%M:%S '
set -g status-right-length 50
set -g status-left-length 20

# Window status
setw -g window-status-current-style 'fg=colour1 bg=colour238 bold'
setw -g window-status-current-format ' #I#[fg=colour249]:#[fg=colour255]#W#[fg=colour249]#F '
setw -g window-status-style 'fg=colour9 bg=colour236'
setw -g window-status-format ' #I#[fg=colour237]:#[fg=colour250]#W#[fg=colour244]#F '

# Pane borders
set -g pane-border-style 'fg=colour238'
set -g pane-active-border-style 'fg=colour51'
```

### Reload Configuration

```
Ctrl+b :source-file ~/.tmux.conf
```

Or with the binding from config:

```
Ctrl+b r
```

## Useful Commands

### Command Mode

```
Ctrl+b :    # Enter command mode
```

### Common Commands

```bash
# List all key bindings
tmux list-keys

# List all commands
tmux list-commands

# Show messages
tmux show-messages

# Display pane info
tmux display-panes

# Clock mode
Ctrl+b t
```

### Scripting

```bash
# Send keys to session
tmux send-keys -t mysession "ls -la" Enter

# Create session and run command
tmux new-session -d -s mysession 'htop'

# Split window and run commands
tmux split-window -h
tmux send-keys 'vim' Enter
```

## Quick Reference

### Sessions

| Command | Description |
|---------|-------------|
| `tmux new -s name` | Create named session |
| `tmux a -t name` | Attach to session |
| `Ctrl+b d` | Detach session |
| `tmux ls` | List sessions |
| `Ctrl+b $` | Rename session |
| `tmux kill-session -t name` | Kill session |

### Windows

| Command | Description |
|---------|-------------|
| `Ctrl+b c` | Create window |
| `Ctrl+b n` | Next window |
| `Ctrl+b p` | Previous window |
| `Ctrl+b 0-9` | Switch to window |
| `Ctrl+b ,` | Rename window |
| `Ctrl+b &` | Kill window |

### Panes

| Command | Description |
|---------|-------------|
| `Ctrl+b %` | Split vertically |
| `Ctrl+b "` | Split horizontally |
| `Ctrl+b o` | Next pane |
| `Ctrl+b ↑/↓/←/→` | Switch pane |
| `Ctrl+b z` | Toggle zoom |
| `Ctrl+b x` | Kill pane |

### Copy Mode

| Command | Description |
|---------|-------------|
| `Ctrl+b [` | Enter copy mode |
| `Space` | Start selection |
| `Enter` | Copy selection |
| `Ctrl+b ]` | Paste |
| `q` | Exit copy mode |

## Tips and Tricks

1. **Nested Tmux** - Use `Ctrl+b Ctrl+b` to send commands to nested tmux
2. **Zoom Pane** - `Ctrl+b z` for temporary fullscreen
3. **Synchronize Panes** - Type in all panes simultaneously
4. **Mouse Support** - Enable for easier pane resizing and scrolling
5. **Persistent Sessions** - Sessions survive disconnections
6. **Scripting** - Automate tmux setup with scripts

---

**Related Topics:**
- Screen (alternative multiplexer)
- Vim integration
- SSH with Tmux
- Tmux plugins (TPM)
