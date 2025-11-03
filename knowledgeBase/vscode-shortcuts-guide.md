---
title: "VSCode Shortcuts Guide"
description: "Comprehensive Visual Studio Code keyboard shortcuts for Windows, Linux, and macOS covering editing, navigation, multi-cursor, debugging, and productivity features"
tags:
  - vscode
  - shortcuts
  - keyboard
  - productivity
  - editor
  - ide
date: 2024-11-03
lastUpdated: 2024-11-03
---

# VSCode Shortcuts Guide

Comprehensive keyboard shortcuts for Visual Studio Code to boost your productivity.

## Table of Contents

- [General](#general)
- [File Management](#file-management)
- [Editing](#editing)
- [Navigation](#navigation)
- [Search and Replace](#search-and-replace)
- [Multi-Cursor Editing](#multi-cursor-editing)
- [Code Folding](#code-folding)
- [Display and Layout](#display-and-layout)
- [Terminal](#terminal)
- [Debugging](#debugging)
- [Git Integration](#git-integration)
- [Extensions](#extensions)

## Platform Key Notation

- **Windows/Linux:** `Ctrl`, `Alt`, `Shift`
- **macOS:** `⌘` (Cmd), `⌥` (Option/Alt), `⇧` (Shift)

This guide shows Windows/Linux shortcuts first, with macOS alternatives where different.

## General

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Command Palette | `Ctrl+Shift+P` or `F1` | `⌘+Shift+P` |
| Quick Open (Go to File) | `Ctrl+P` | `⌘+P` |
| Settings | `Ctrl+,` | `⌘+,` |
| Keyboard Shortcuts | `Ctrl+K Ctrl+S` | `⌘+K ⌘+S` |
| User Snippets | `Ctrl+K Ctrl+S` | `⌘+K ⌘+S` |

## File Management

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| New File | `Ctrl+N` | `⌘+N` |
| Open File | `Ctrl+O` | `⌘+O` |
| Save | `Ctrl+S` | `⌘+S` |
| Save As | `Ctrl+Shift+S` | `⌘+Shift+S` |
| Save All | `Ctrl+K S` | `⌘+K S` |
| Close File | `Ctrl+W` | `⌘+W` |
| Close All Files | `Ctrl+K W` | `⌘+K W` |
| Close Folder | `Ctrl+K F` | `⌘+K F` |
| Reopen Closed File | `Ctrl+Shift+T` | `⌘+Shift+T` |
| New Window | `Ctrl+Shift+N` | `⌘+Shift+N` |
| Close Window | `Alt+F4` | `⌘+Q` |

## Editing

### Basic Editing

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Cut Line | `Ctrl+X` | `⌘+X` |
| Copy Line | `Ctrl+C` | `⌘+C` |
| Paste | `Ctrl+V` | `⌘+V` |
| Undo | `Ctrl+Z` | `⌘+Z` |
| Redo | `Ctrl+Y` | `⌘+Shift+Z` |
| Delete Line | `Ctrl+Shift+K` | `⌘+Shift+K` |
| Move Line Up | `Alt+Up` | `⌥+Up` |
| Move Line Down | `Alt+Down` | `⌥+Down` |
| Copy Line Up | `Shift+Alt+Up` | `⇧+⌥+Up` |
| Copy Line Down | `Shift+Alt+Down` | `⇧+⌥+Down` |
| Insert Line Above | `Ctrl+Shift+Enter` | `⌘+Shift+Enter` |
| Insert Line Below | `Ctrl+Enter` | `⌘+Enter` |

### Text Manipulation

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Toggle Line Comment | `Ctrl+/` | `⌘+/` |
| Toggle Block Comment | `Shift+Alt+A` | `⇧+⌥+A` |
| Format Document | `Shift+Alt+F` | `⇧+⌥+F` |
| Format Selection | `Ctrl+K Ctrl+F` | `⌘+K ⌘+F` |
| Indent Line | `Ctrl+]` | `⌘+]` |
| Outdent Line | `Ctrl+[` | `⌘+[` |
| Trim Trailing Whitespace | `Ctrl+K Ctrl+X` | `⌘+K ⌘+X` |
| Transform to Uppercase | `Ctrl+K Ctrl+U` | `⌘+K ⌘+U` |
| Transform to Lowercase | `Ctrl+K Ctrl+L` | `⌘+K ⌘+L` |

### Smart Editing

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Trigger Suggestion | `Ctrl+Space` | `⌃+Space` |
| Trigger Parameter Hints | `Ctrl+Shift+Space` | `⌘+Shift+Space` |
| Quick Fix | `Ctrl+.` | `⌘+.` |
| Rename Symbol | `F2` | `F2` |
| Go to Definition | `F12` | `F12` |
| Peek Definition | `Alt+F12` | `⌥+F12` |
| Go to References | `Shift+F12` | `⇧+F12` |
| Show Hover | `Ctrl+K Ctrl+I` | `⌘+K ⌘+I` |

## Navigation

### Cursor Movement

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Move Word Left | `Ctrl+Left` | `⌥+Left` |
| Move Word Right | `Ctrl+Right` | `⌥+Right` |
| Go to Beginning of Line | `Home` | `⌘+Left` |
| Go to End of Line | `End` | `⌘+Right` |
| Go to Beginning of File | `Ctrl+Home` | `⌘+Up` |
| Go to End of File | `Ctrl+End` | `⌘+Down` |
| Scroll Line Up | `Ctrl+Up` | `⌃+PgUp` |
| Scroll Line Down | `Ctrl+Down` | `⌃+PgDown` |

### File Navigation

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Go to Line | `Ctrl+G` | `⌃+G` |
| Go to Symbol in File | `Ctrl+Shift+O` | `⌘+Shift+O` |
| Go to Symbol in Workspace | `Ctrl+T` | `⌘+T` |
| Navigate Back | `Alt+Left` | `⌃+-` |
| Navigate Forward | `Alt+Right` | `⌃+Shift+-` |
| Go to Bracket | `Ctrl+Shift+\` | `⌘+Shift+\` |
| Next Error/Warning | `F8` | `F8` |
| Previous Error/Warning | `Shift+F8` | `⇧+F8` |

### Editor Navigation

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Switch Editor Tab | `Ctrl+Tab` | `⌃+Tab` |
| Previous Editor | `Ctrl+PageUp` | `⌘+⇧+[` |
| Next Editor | `Ctrl+PageDown` | `⌘+⇧+]` |
| Focus First Editor | `Ctrl+1` | `⌘+1` |
| Focus Second Editor | `Ctrl+2` | `⌘+2` |
| Focus Third Editor | `Ctrl+3` | `⌘+3` |

## Search and Replace

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Find | `Ctrl+F` | `⌘+F` |
| Replace | `Ctrl+H` | `⌘+H` |
| Find Next | `F3` or `Enter` | `⌘+G` |
| Find Previous | `Shift+F3` | `⌘+Shift+G` |
| Select All Occurrences | `Alt+Enter` | `⌥+Enter` |
| Find in Files | `Ctrl+Shift+F` | `⌘+Shift+F` |
| Replace in Files | `Ctrl+Shift+H` | `⌘+Shift+H` |
| Toggle Case Sensitive | `Alt+C` | `⌥+⌘+C` |
| Toggle Regex | `Alt+R` | `⌥+⌘+R` |
| Toggle Whole Word | `Alt+W` | `⌥+⌘+W` |

## Multi-Cursor Editing

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Add Cursor Above | `Ctrl+Alt+Up` | `⌘+⌥+Up` |
| Add Cursor Below | `Ctrl+Alt+Down` | `⌘+⌥+Down` |
| Add Cursor to Line Ends | `Shift+Alt+I` | `⇧+⌥+I` |
| Select Next Occurrence | `Ctrl+D` | `⌘+D` |
| Select All Occurrences | `Ctrl+Shift+L` | `⌘+Shift+L` |
| Undo Last Cursor Operation | `Ctrl+U` | `⌘+U` |
| Column (Box) Selection | `Shift+Alt+Drag` | `⇧+⌥+Drag` |
| Column Selection Up | `Ctrl+Shift+Alt+Up` | `⌘+⇧+⌥+Up` |
| Column Selection Down | `Ctrl+Shift+Alt+Down` | `⌘+⇧+⌥+Down` |

### Multi-Cursor Tips

```
1. Select word → Ctrl+D → Ctrl+D → Edit all occurrences
2. Ctrl+Shift+L → Select all occurrences of selection
3. Alt+Click → Add cursor at click position
4. Shift+Alt+Drag → Box selection for column editing
```

## Code Folding

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Fold | `Ctrl+Shift+[` | `⌥+⌘+[` |
| Unfold | `Ctrl+Shift+]` | `⌥+⌘+]` |
| Fold All | `Ctrl+K Ctrl+0` | `⌘+K ⌘+0` |
| Unfold All | `Ctrl+K Ctrl+J` | `⌘+K ⌘+J` |
| Fold Level 1 | `Ctrl+K Ctrl+1` | `⌘+K ⌘+1` |
| Fold Level 2 | `Ctrl+K Ctrl+2` | `⌘+K ⌘+2` |
| Fold Level 3 | `Ctrl+K Ctrl+3` | `⌘+K ⌘+3` |
| Fold Recursively | `Ctrl+K Ctrl+[` | `⌘+K ⌘+[` |
| Unfold Recursively | `Ctrl+K Ctrl+]` | `⌘+K ⌘+]` |

## Display and Layout

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Toggle Sidebar | `Ctrl+B` | `⌘+B` |
| Toggle Explorer | `Ctrl+Shift+E` | `⌘+Shift+E` |
| Toggle Search | `Ctrl+Shift+F` | `⌘+Shift+F` |
| Toggle Source Control | `Ctrl+Shift+G` | `⌃+Shift+G` |
| Toggle Debug | `Ctrl+Shift+D` | `⌘+Shift+D` |
| Toggle Extensions | `Ctrl+Shift+X` | `⌘+Shift+X` |
| Split Editor | `Ctrl+\` | `⌘+\` |
| Split Editor Down | `Ctrl+K Ctrl+\` | `⌘+K ⌘+\` |
| Close Editor | `Ctrl+W` | `⌘+W` |
| Zen Mode | `Ctrl+K Z` | `⌘+K Z` |
| Toggle Full Screen | `F11` | `⌃+⌘+F` |
| Zoom In | `Ctrl+=` | `⌘+=` |
| Zoom Out | `Ctrl+-` | `⌘+-` |
| Reset Zoom | `Ctrl+0` | `⌘+0` |

## Terminal

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Toggle Terminal | ``Ctrl+` `` | ``⌃+` `` |
| Create New Terminal | ``Ctrl+Shift+` `` | ``⌃+Shift+` `` |
| Split Terminal | `Ctrl+Shift+5` | `⌘+\` |
| Focus Next Terminal | `Alt+Down` | `⌥+⌘+Down` |
| Focus Previous Terminal | `Alt+Up` | `⌥+⌘+Up` |
| Kill Terminal | `Ctrl+Shift+K` | `⌘+Shift+K` |
| Scroll Up | `Ctrl+Shift+Up` | `⌘+Up` |
| Scroll Down | `Ctrl+Shift+Down` | `⌘+Down` |

## Debugging

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Toggle Breakpoint | `F9` | `F9` |
| Start/Continue | `F5` | `F5` |
| Stop | `Shift+F5` | `⇧+F5` |
| Restart | `Ctrl+Shift+F5` | `⌘+Shift+F5` |
| Step Over | `F10` | `F10` |
| Step Into | `F11` | `F11` |
| Step Out | `Shift+F11` | `⇧+F11` |
| Show Hover | `Ctrl+K Ctrl+I` | `⌘+K ⌘+I` |

## Git Integration

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Open Source Control | `Ctrl+Shift+G` | `⌃+Shift+G` |
| Stage Changes | `Ctrl+K Ctrl+S` | `⌘+K ⌘+S` |
| Commit | `Ctrl+Enter` | `⌘+Enter` |
| Pull | `Ctrl+Shift+P` → "Git: Pull" | `⌘+Shift+P` |
| Push | `Ctrl+Shift+P` → "Git: Push" | `⌘+Shift+P` |
| Show Git Output | `Ctrl+Shift+U` | `⌘+Shift+U` |

## Extensions

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Show Extensions | `Ctrl+Shift+X` | `⌘+Shift+X` |
| Install Extension | `Ctrl+Shift+P` → "Extensions: Install" | `⌘+Shift+P` |
| Disable Extension | `Ctrl+Shift+P` → "Extensions: Disable" | `⌘+Shift+P` |

## Productivity Tips

### Quick File Navigation

```
Ctrl+P           → Quick Open
Ctrl+P filename  → Go to file
Ctrl+P @symbol   → Go to symbol in file
Ctrl+P :line     → Go to line number
Ctrl+P #term     → Search in workspace
```

### Multi-Cursor Workflow

```
1. Highlight word
2. Ctrl+D (repeat to select more occurrences)
3. Edit all selected instances simultaneously
4. Ctrl+U to undo last selection
```

### Code Navigation

```
F12              → Go to definition
Alt+F12          → Peek definition
Shift+F12        → Find all references
Ctrl+Shift+O     → Go to symbol
Ctrl+T           → Go to symbol in workspace
```

### Efficient Editing

```
Ctrl+/           → Toggle comment
Shift+Alt+F      → Format document
Ctrl+.           → Quick fix
F2               → Rename symbol
Alt+Up/Down      → Move line
Shift+Alt+Up/Down → Copy line
```

## Custom Keybindings

To customize shortcuts:

1. Open Command Palette: `Ctrl+Shift+P`
2. Type "Preferences: Open Keyboard Shortcuts"
3. Search for command
4. Click pencil icon to change binding

Or edit `keybindings.json` directly:

```json
[
  {
    "key": "ctrl+shift+c",
    "command": "editor.action.commentLine",
    "when": "editorTextFocus"
  }
]
```

## Useful Command Palette Commands

```
> Preferences: Open Settings (JSON)
> Preferences: Color Theme
> View: Toggle Zen Mode
> File: Save All
> Terminal: Create New Terminal
> Git: Clone
> Extensions: Install Extensions
> Developer: Reload Window
> Preferences: Open Keyboard Shortcuts
```

## Emmet Shortcuts

| Action | Shortcut |
|--------|----------|
| Expand Abbreviation | `Tab` |
| Wrap with Abbreviation | `Ctrl+Shift+P` → "Emmet: Wrap" |
| Remove Tag | `Ctrl+Shift+P` → "Emmet: Remove Tag" |
| Update Tag | `Ctrl+Shift+P` → "Emmet: Update Tag" |

---

**Related Topics:**
- VSCode Extensions
- VSCode Settings
- VSCode Themes
- Workspace Configuration
