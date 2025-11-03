---
title: "Git and GitHub Complete Guide"
description: "Comprehensive guide to Git version control and GitHub including installation, workflow, branching, merging, rebasing, pull requests, and best practices"
tags:
  - git
  - github
  - gitlab
  - version-control
  - branching
  - merging
  - rebase
  - workflow
date: 2024-11-03
lastUpdated: 2024-11-03
---

# Git and GitHub Complete Guide

Complete guide to Git version control system and GitHub collaboration platform, covering everything from basic commands to advanced workflows.

## Table of Contents

- [Installation and Setup](#installation-and-setup)
- [Git Basics](#git-basics)
- [Git Workflow](#git-workflow)
- [Branching and Merging](#branching-and-merging)
- [Remote Repositories](#remote-repositories)
- [Pull Requests](#pull-requests)
- [Advanced Topics](#advanced-topics)
- [Best Practices](#best-practices)

## Installation and Setup

### Install Git

```bash
# Ubuntu/Debian
apt install git

# macOS
brew install git

# Windows
# Download from https://git-scm.com/download/win
```

### Configure Git

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# View configuration
git config --list

# View specific config
git config user.name
```

## Git Basics

### Initialize a Repository

```bash
# Create a new repository
git init

# Clone an existing repository
git clone <repository-url>
```

### Git Help

```bash
# General help
git help

# Help for specific command
git help commit
git commit --help
```

### Common Git Commands

| Command | Description |
|---------|-------------|
| `git init` | Create empty Git repository |
| `git clone` | Clone repository into new directory |
| `git add` | Add file contents to staging |
| `git commit` | Record changes to repository |
| `git status` | Show working tree status |
| `git log` | Show commit logs |
| `git diff` | Show changes between commits |
| `git branch` | List, create, or delete branches |
| `git merge` | Join development histories |
| `git pull` | Fetch and integrate with another repository |
| `git push` | Update remote refs with local changes |

## Git Workflow

Git has three main areas:

1. **Working Directory** - Your local files
2. **Staging Area (Index)** - Files ready to be committed
3. **Local Repository** - Committed files

### Check Status

```bash
git status
```

**Output example:**

```
On branch master
No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        file1.txt

nothing added to commit but untracked files present (use "git add" to track)
```

### Add Files to Staging

```bash
# Add specific file
git add file1.txt

# Add all files
git add .

# Add all files with specific extension
git add *.js
```

### Commit Changes

```bash
# Commit with message
git commit -m "Your commit message"

# Commit specific file
git commit file1.txt -m "Updated file1"

# Add and commit in one step
git commit -am "Message"
```

### Remove File from Last Commit

```bash
# Unstage file
git reset HEAD <file>

# Example
git reset HEAD frontend/src/components/Informational.jsx
```

### View Commit History

```bash
# Full log
git log

# Compact log
git log --oneline

# Graph view
git log --oneline --graph --all

# With file statistics
git log --stat

# Last 5 commits
git log -n 5
```

## Viewing Differences

### Working Directory vs Staging

```bash
# Show unstaged changes
git diff
```

### Staging vs Repository

```bash
# Show staged changes
git diff --staged
```

### Between Branches

```bash
# Compare two branches
git diff branch1 branch2

# Compare current branch with another
git diff main
```

## Branching and Merging

### Branch Basics

```bash
# List branches
git branch

# List all branches (including remote)
git branch -a

# List remote branches
git branch -r

# Create new branch
git branch feature1

# Switch to branch
git checkout feature1
# or
git switch feature1

# Create and switch to new branch
git checkout -b feature1
# or
git switch -c feature1

# Delete branch
git branch -d feature1

# Force delete branch
git branch -D feature1
```

### Merging

#### Fast-Forward Merge

When main hasn't changed, Git simply moves the pointer forward.

```bash
# Switch to main
git checkout main

# Merge feature branch
git merge feature1
```

#### Three-Way (Recursive) Merge

When both branches have changes, Git creates a new merge commit.

```bash
git checkout main
git merge feature1
```

### Branch from Another Branch

```bash
# Create feature2 from feature1
git branch feature2 feature1
```

### Check Merged Branches

```bash
# Show merged branches
git branch --merged

# Show unmerged branches
git branch --no-merged
```

## Remote Repositories

### Add Remote Repository

```bash
# Add remote
git remote add origin <repository-url>

# Example
git remote add origin git@github.com:username/repo.git

# View remotes
git remote -v

# Remove remote
git remote rm origin
```

### Push to Remote

```bash
# Push to remote
git push origin main

# Push and set upstream
git push -u origin main

# Push new branch to remote
git push origin HEAD
```

### Pull from Remote

```bash
# Fetch and merge
git pull

# Fetch without merging
git fetch

# Merge after fetch
git merge origin/main
```

### Sync with Remote

```bash
# Rename branch to main
git branch -M main

# Pull with unrelated histories
git pull origin main --allow-unrelated-histories

# Push to remote
git push -u origin main
```

## Cloning and Remote Tracking

### Clone Repository

```bash
git clone <repository-url>
```

When you clone:
- Creates local `main` branch
- Creates `origin/main` tracking branch
- `origin/main` tracks remote changes

### Out of Sync with Remote

```bash
# Fetch remote changes
git fetch

# Merge remote changes
git merge origin/main

# Or use pull (fetch + merge)
git pull
```

## Pull Requests

**Note:** "Pull Request" is GitHub terminology. GitLab calls it "Merge Request".

### Real-World Workflow

1. **Fork** the main repository
2. **Clone** your fork to local machine
3. **Create branch** for your changes
4. **Make changes** and commit
5. **Push** to your fork
6. **Create pull request** on GitHub
7. **Owner reviews** and merges

### Example Workflow

```bash
# 1. Fork on GitHub, then clone
git clone git@github.com:yourusername/repo.git

# 2. Create new branch
git switch -c my-feature

# 3. Make changes
# Edit files...

# 4. Stage and commit
git add .
git commit -m "Add new feature"

# 5. Push to your fork
git push origin -u my-feature

# 6. Create pull request on GitHub
```

### Keep Fork Updated

```bash
# Add upstream remote
git remote add upstream https://github.com/original/repo.git

# Fetch upstream changes
git fetch upstream

# Switch to main
git switch main

# Merge upstream changes
git pull upstream main

# Push to your fork
git push origin main
```

## Removing Files

### Remove from Commit (Keep File)

```bash
# Remove from staging
git rm --cached <file>

# Example: Remove node_modules
git rm -r --cached node_modules
git commit -m 'Removed node_modules'
```

### Remove File Completely

```bash
# Remove file and stage deletion
git rm file.txt

# Commit the deletion
git commit -m "Removed file.txt"
```

## .gitignore

Create `.gitignore` file to exclude files from tracking.

```gitignore
# Logs
*.log
log/*.txt

# Dependencies
node_modules/
vendor/

# Environment files
.env
.env.local

# Build outputs
dist/
build/
*.min.js

# IDE files
.vscode/
.idea/
*.swp

# OS files
.DS_Store
Thumbs.db
```

**Note:** Files already tracked before adding to `.gitignore` will continue to be tracked. Remove them first:

```bash
git rm --cached <file>
```

## Advanced Topics

### Revert

Undo a commit by creating a new commit.

```bash
# Revert specific commit
git revert <commit-id>

# Revert range of commits
git revert <commit-id-1>..<commit-id-4>
```

### Reset

Move HEAD to specified commit.

```bash
# Soft reset (keep changes staged)
git reset --soft <commit-id>

# Mixed reset (keep changes unstaged) - DEFAULT
git reset <commit-id>

# Hard reset (discard all changes)
git reset --hard <commit-id>
```

**Warning:** `--hard` permanently deletes changes!

### Rebase

Reapply commits on top of another base.

```bash
# Rebase feature onto main
git checkout feature1
git rebase main

# Then update main
git checkout main
git rebase feature1

# Push changes
git push
```

#### Interactive Rebase

```bash
# Rebase last 3 commits
git rebase -i HEAD~3
```

In the editor:
- `pick` - use commit
- `reword` - edit commit message
- `edit` - edit commit
- `squash` - combine with previous commit
- `drop` - remove commit

### Squash Merge

Combine multiple commits into one.

```bash
# Interactive rebase
git rebase -i HEAD~3

# Change 'pick' to 'squash' for commits to combine
```

**Example:**

```
pick 666c9cf added line 5
squash 9860d66 added line 8
squash 86deda5 added line 9
```

### Cherry Pick

Apply specific commits to current branch.

```bash
# Cherry pick single commit
git cherry-pick <commit-id>

# Cherry pick multiple commits
git cherry-pick <commit-id-1> <commit-id-2>
```

**Note:** Commit ID will change after cherry-picking.

### Stash

Temporarily save changes without committing.

```bash
# Stash changes
git stash

# Stash with message
git stash save "Work in progress on feature"

# List stashes
git stash list

# Apply stash
git stash apply 0

# Apply and remove stash
git stash pop

# Clear all stashes
git stash clear

# Drop specific stash
git stash drop 0
```

## GitHub Features

### Issues

- Track bugs, enhancements, and tasks
- Assign to team members
- Link to pull requests
- Use labels for organization

**Linking PR to Issue:**

In PR description:
```
Fixes #123
Closes #456
Resolves #789
```

### Webhooks

Notify external services of repository events.

**Use cases:**
- Trigger CI/CD pipelines
- Deploy on push
- Notify chat applications
- Run automated tests

**Setup:**
1. Go to repository Settings
2. Select Webhooks
3. Add webhook URL
4. Choose events to trigger

## Branching Strategies

### Trunk-Based Development

- Create short-lived feature branches
- Merge frequently to main
- Small, incremental changes
- **Most popular for modern development**

### Git Flow

- `main` - production code
- `develop` - integration branch
- `feature/*` - new features
- `release/*` - release preparation
- `hotfix/*` - production fixes

**Workflow:**
1. Create feature branch from `develop`
2. Merge feature to `develop`
3. Create release branch from `develop`
4. Merge release to `main` and `develop`

## Best Practices

### Commit Messages

```bash
# Good commit messages
git commit -m "Add user authentication feature"
git commit -m "Fix: Resolve null pointer in login"
git commit -m "Refactor: Extract validation logic"

# Bad commit messages
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "asdf"
```

**Format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore

### General Best Practices

1. **Commit often** - Small, logical chunks
2. **Write clear messages** - Explain what and why
3. **Don't commit to main** - Use feature branches
4. **Pull before push** - Stay in sync
5. **Review before commit** - Use `git diff`
6. **Use .gitignore** - Don't commit generated files
7. **Test before push** - Ensure code works
8. **Keep history clean** - Use rebase when appropriate
9. **Document changes** - Update README and docs
10. **Use pull requests** - Enable code review

### Security Best Practices

1. **Never commit secrets** - API keys, passwords, tokens
2. **Use SSH keys** - More secure than passwords
3. **Enable 2FA** - On GitHub account
4. **Review permissions** - Limit access appropriately
5. **Sign commits** - Use GPG keys for verification

## Quick Reference

### Common Workflows

**Start new feature:**
```bash
git checkout main
git pull
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push -u origin feature/new-feature
```

**Update feature branch:**
```bash
git checkout main
git pull
git checkout feature/new-feature
git rebase main
git push -f origin feature/new-feature
```

**Fix merge conflict:**
```bash
# After conflict occurs
git status  # See conflicted files
# Edit files to resolve conflicts
git add .
git commit -m "Resolve merge conflicts"
```

### Useful Aliases

```bash
# Set up aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --oneline --graph --all'
```

## Troubleshooting

### Undo Last Commit (Keep Changes)

```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)

```bash
git reset --hard HEAD~1
```

### Discard Local Changes

```bash
# Discard changes in specific file
git checkout -- <file>

# Discard all local changes
git reset --hard HEAD
```

### Recover Deleted Branch

```bash
# Find commit
git reflog

# Recreate branch
git checkout -b <branch-name> <commit-id>
```

### Fix Wrong Branch

```bash
# Stash changes
git stash

# Switch to correct branch
git checkout correct-branch

# Apply changes
git stash pop
```

## Q&A Reference

**Q: What are the storage areas in Git?**  
A: Working directory, staging area (index), local repository, remote repository

**Q: What is the index?**  
A: Same as staging area

**Q: How to move files through Git workflow?**  
A: `git add .` → `git commit` → `git push`

**Q: Difference between git pull and pull request?**  
A: `git pull` fetches and merges remote changes. Pull request is a GitHub feature to propose merging changes.

**Q: Difference between fork and clone?**  
A: Fork creates a copy on GitHub. Clone downloads repository to local machine.

**Q: Difference between revert and reset?**  
A: Revert creates new commit undoing changes. Reset moves HEAD pointer, potentially losing commits.

**Q: Difference between rebase and merge?**  
A: Merge creates merge commit. Rebase replays commits on top of another branch (cleaner history).

---

**Related Topics:**
- GitHub Actions (CI/CD)
- Git Hooks
- GitLab CI/CD
- Semantic Versioning
