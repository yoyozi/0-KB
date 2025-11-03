---
title: "Vim Cheatsheet"
description: "Comprehensive Vim editor cheatsheet covering cursor movement, editing, visual mode, search/replace, file operations, and advanced features"
tags:
  - vim
  - editor
  - cheatsheet
  - text-editor
  - shortcuts
  - linux
date: 2024-11-03
lastUpdated: 2024-11-03
---

# Vim Cheatsheet

Comprehensive reference for Vim text editor commands and shortcuts.

## Table of Contents

- [Modes](#modes)
- [Cursor Movement](#cursor-movement)
- [Editing Text](#editing-text)
- [Operators](#operators)
- [Visual Mode](#visual-mode)
- [Clipboard Operations](#clipboard-operations)
- [Search and Replace](#search-and-replace)
- [File Operations](#file-operations)
- [Windows and Tabs](#windows-and-tabs)
- [Marks](#marks)
- [Text Objects](#text-objects)
- [Miscellaneous](#miscellaneous)

## Modes

Vim has several modes:

- **Normal Mode** - Default mode for navigation and commands
- **Insert Mode** - For inserting text
- **Visual Mode** - For selecting text
- **Command Mode** - For executing commands (`:`)

### Switching Modes

```
i           Enter Insert mode at cursor
a           Enter Insert mode after cursor
I           Enter Insert mode at beginning of line
A           Enter Insert mode at end of line
o           Open new line below and enter Insert mode
O           Open new line above and enter Insert mode
Esc         Return to Normal mode
Ctrl+[      Return to Normal mode (alternative)
v           Enter Visual mode
V           Enter Visual Line mode
Ctrl+v      Enter Visual Block mode
:           Enter Command mode
```

## Cursor Movement

### Basic Movement (Normal/Visual Mode)

```
h           Move left
j           Move down
k           Move up
l           Move right
```

### Word Movement

```
w           Move to start of next word
W           Move to start of next word (space separated)
b           Move to start of previous word
B           Move to start of previous word (space separated)
e           Move to end of next word
ge          Move to end of previous word
E           Move to end of next word (space separated)
```

### Line Movement

```
0           Move to start of line
^           Move to first non-blank character of line
$           Move to end of line
g_          Move to last non-blank character of line
```

### Page Movement

```
gg          Go to top of file
G           Go to bottom of file
:[num]      Go to line number (e.g., :42)
Ctrl+d      Move down half a page
Ctrl+u      Move up half a page
Ctrl+f      Move down one page
Ctrl+b      Move up one page
Ctrl+e      Scroll down one line
Ctrl+y      Scroll up one line
```

### Paragraph Movement

```
}           Go forward by paragraph (next blank line)
{           Go backward by paragraph (previous blank line)
```

### Character Search

```
f[char]     Move forward to next occurrence of char
F[char]     Move backward to previous occurrence of char
t[char]     Move forward to before next occurrence of char
T[char]     Move backward to before previous occurrence of char
;           Repeat last f, F, t, or T search forward
,           Repeat last f, F, t, or T search backward
```

### Other Movement

```
%           Jump to matching bracket/parenthesis
H           Move to top of screen
M           Move to middle of screen
L           Move to bottom of screen
```

## Editing Text

### Insert and Append

```
i           Insert before cursor
a           Insert after cursor
I           Insert at beginning of line
A           Insert at end of line
o           Open new line below
O           Open new line above
```

### Delete

```
x           Delete character under cursor
X           Delete character before cursor
dd          Delete entire line
D           Delete from cursor to end of line
d$          Delete from cursor to end of line (same as D)
d0          Delete from cursor to beginning of line
dw          Delete word
diw         Delete inner word (cursor can be anywhere in word)
daw         Delete a word (includes surrounding whitespace)
```

### Change (Delete and Enter Insert Mode)

```
cc          Change entire line
C           Change from cursor to end of line
c$          Change from cursor to end of line (same as C)
cw          Change word
ciw         Change inner word
caw         Change a word (includes surrounding whitespace)
r[char]     Replace single character with char
R           Enter Replace mode (overwrite text)
```

### Join Lines

```
J           Join current line with next line
gJ          Join lines without adding space
```

### Undo and Redo

```
u           Undo last change
Ctrl+r      Redo last undone change
U           Undo all changes on current line
```

### Repeat

```
.           Repeat last command
```

## Operators

Operators work with motions and in Visual Mode.

```
d           Delete
c           Change (delete and enter Insert mode)
y           Yank (copy)
>           Indent
<           Unindent
=           Auto-indent
~           Toggle case
gu          Make lowercase
gU          Make uppercase
```

### Operator + Motion Examples

```
d$          Delete from cursor to end of line
c^          Change from cursor to first non-blank character
y}          Yank from cursor to end of paragraph
>}          Indent paragraph
<3j         Unindent current line and 3 lines below
=G          Auto-indent from cursor to end of file
```

## Visual Mode

### Enter Visual Mode

```
v           Start character-wise visual mode
V           Start line-wise visual mode
Ctrl+v      Start block-wise visual mode
gv          Reselect last visual selection
```

### Visual Mode Operations

```
o           Move to other end of marked area
O           Move to other corner of block (block mode)
Esc         Exit visual mode
Ctrl+[      Exit visual mode (alternative)
```

### Visual Mode Commands

After selecting text in visual mode:

```
d           Delete selection
c           Change selection
y           Yank (copy) selection
>           Indent selection
<           Unindent selection
=           Auto-indent selection
~           Toggle case of selection
u           Make selection lowercase
U           Make selection uppercase
```

## Clipboard Operations

### Yank (Copy)

```
yy          Yank entire line
Y           Yank entire line (same as yy)
y$          Yank from cursor to end of line
y^          Yank from cursor to first non-blank character
yw          Yank word
yiw         Yank inner word
yaw         Yank a word (includes whitespace)
```

### Paste

```
p           Paste after cursor/line
P           Paste before cursor/line
gp          Paste after cursor and move cursor after pasted text
gP          Paste before cursor and move cursor after pasted text
```

### Registers

```
"ayy        Yank line into register a
"ap         Paste from register a
:reg        Show all registers
Ctrl+r a    Paste from register a in Insert/Command mode
Ctrl+r 0    Paste last yanked text in Insert mode
```

## Search and Replace

### Search

```
/pattern    Search forward for pattern
?pattern    Search backward for pattern
n           Repeat search in same direction
N           Repeat search in opposite direction
*           Search forward for word under cursor
#           Search backward for word under cursor
```

### Replace

```
:s/old/new/         Replace first occurrence in current line
:s/old/new/g        Replace all occurrences in current line
:%s/old/new/g       Replace all occurrences in file
:%s/old/new/gc      Replace all with confirmations
:5,12s/old/new/g    Replace in lines 5-12
```

### Search Options

```
:set ignorecase     Case-insensitive search
:set smartcase      Case-sensitive if pattern has uppercase
:set hlsearch       Highlight search results
:noh                Clear search highlighting
```

## File Operations

### Save and Quit

```
:w          Write (save) file
:w filename Save as filename
:wq         Write and quit
:x          Write and quit (only if changes made)
ZZ          Write and quit (Normal mode)
:q          Quit (fails if unsaved changes)
:q!         Quit without saving
ZQ          Quit without saving (Normal mode)
:qa         Quit all windows
:qa!        Quit all windows without saving
```

### File Management

```
:e filename     Edit file
:e!             Reload current file (discard changes)
:bn             Next buffer
:bp             Previous buffer
:bd             Delete buffer (close file)
:ls             List all buffers
:b[num]         Switch to buffer number
```

## Windows and Tabs

### Windows (Splits)

```
:sp             Split window horizontally
:vsp            Split window vertically
:sp filename    Open filename in horizontal split
:vsp filename   Open filename in vertical split
Ctrl+w s        Split window horizontally
Ctrl+w v        Split window vertically
Ctrl+w w        Switch between windows
Ctrl+w h        Move to window on left
Ctrl+w j        Move to window below
Ctrl+w k        Move to window above
Ctrl+w l        Move to window on right
Ctrl+w q        Quit window
Ctrl+w =        Make all windows equal size
Ctrl+w _        Maximize current window height
Ctrl+w |        Maximize current window width
```

### Tabs

```
:tabe           Create new tab
:tabe filename  Open filename in new tab
gt              Go to next tab
gT              Go to previous tab
:tabc           Close current tab
:tabo           Close all other tabs
:tabs           List all tabs
```

## Marks

Marks allow you to jump to designated points in your code.

```
m[a-z]      Set mark at cursor position (local to file)
m[A-Z]      Set global mark (works between files)
'[a-z]      Jump to mark (beginning of line)
`[a-z]      Jump to mark (exact position)
''          Jump back to previous position (line)
``          Jump back to previous position (exact)
'.          Jump to last change
```

## Text Objects

Text objects allow you to operate on structured text.

### Format

```
[operator][a/i][object]
```

- `a` - "a" (includes surrounding whitespace/delimiters)
- `i` - "inner" (excludes surrounding whitespace/delimiters)

### Objects

```
w           Word
s           Sentence
p           Paragraph
t           Tag (HTML/XML)
"           Double quotes
'           Single quotes
`           Backticks
(           Parentheses
[           Square brackets
{           Curly braces
<           Angle brackets
```

### Examples

```
diw         Delete inner word
daw         Delete a word (includes whitespace)
ci"         Change text inside double quotes
da(         Delete text in parentheses including parentheses
di{         Delete text inside curly braces
yit         Yank text inside HTML tag
vip         Visually select paragraph
```

### Practical Example

If cursor is in: `def (arg1, arg2, arg3)`

```
di(         Deletes everything between parentheses
ci(         Changes everything between parentheses
ya(         Yanks everything including parentheses
```

## Miscellaneous

### Increment/Decrement

```
Ctrl+a      Increment number under cursor
Ctrl+x      Decrement number under cursor
```

### Indentation

```
>>          Indent current line
<<          Unindent current line
==          Auto-indent current line
>}          Indent paragraph
=G          Auto-indent from cursor to end of file
```

### Folding

```
zf          Create fold
zo          Open fold
zc          Close fold
za          Toggle fold
zR          Open all folds
zM          Close all folds
```

### Macros

```
q[a-z]      Start recording macro into register
q           Stop recording macro
@[a-z]      Execute macro from register
@@          Repeat last macro
```

### Command Line

```
:!command   Execute shell command
:r !command Read output of shell command into file
:w !command Write file to shell command
```

### Help

```
:help       Open help
:help [cmd] Help for specific command
:q          Close help window
```

## Quick Reference Card

### Most Common Commands

```
i/a/o       Enter Insert mode
Esc         Exit to Normal mode
h/j/k/l     Move cursor
w/b         Word forward/backward
0/$         Start/end of line
gg/G        Top/bottom of file
dd          Delete line
yy          Yank line
p/P         Paste after/before
u           Undo
Ctrl+r      Redo
/           Search
n/N         Next/previous search result
:w          Save
:q          Quit
:wq         Save and quit
```

## Tips and Tricks

1. **Use `.` to repeat** - The dot command repeats your last change
2. **Combine operators and motions** - `d3w` deletes 3 words
3. **Use text objects** - `ci"` changes text inside quotes
4. **Visual Block mode** - Great for editing columns
5. **Use marks** - Jump back to important locations
6. **Learn macros** - Automate repetitive tasks
7. **Use relative line numbers** - `:set relativenumber`
8. **Search and replace** - Use `:%s/old/new/gc` for confirmation

---

**Related Topics:**
- Vim Configuration (.vimrc)
- Vim Plugins
- Neovim
- Vi Editor
