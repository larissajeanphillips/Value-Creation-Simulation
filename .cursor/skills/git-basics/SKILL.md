---
name: git-basics
description: Beginner-friendly Git tutorial for first-time coders. Covers installation, setup, connecting to GitHub, and daily workflows like commit, push, and pull. Use when someone is new to Git, needs help with "how do I set up git", "push to github", "what is a commit", or troubleshooting common Git errors.
---

# Git Basics for Beginners

A friendly, step-by-step guide to Git for people who are completely new to coding.

---

## What do you need help with?

| I want to... | Go to |
|--------------|-------|
| **Set up Git for the first time** | [Part 1: First-Time Setup](#part-1-first-time-setup) |
| **Connect to GitHub** | [Part 2: Connecting to GitHub](#part-2-connecting-to-github) |
| **Start a new project or download one** | [Part 3: Your First Repository](#part-3-your-first-repository) |
| **Learn the daily workflow** (add, commit, push) | [Part 4: Daily Workflow](#part-4-daily-workflow) |
| **Understand branches** | [Part 5: Understanding Branches](#part-5-understanding-branches) |
| **Fix a specific problem** | [Part 6: Common Scenarios](#part-6-common-scenarios) |
| **Quick command reference** | [Quick Reference Card](#quick-reference-card) |

---

## What is Git? (The Simple Version)

Think of Git like a **super-powered "Save" button** for your code:

- **Regular Save**: Overwrites your file (old version gone forever)
- **Git Save**: Keeps every version, so you can go back in time

Git also lets you:
- **Share code** with teammates (like Google Docs, but for code)
- **See who changed what** and when
- **Undo mistakes** without losing work

---

## Part 1: First-Time Setup

### Step 1: Check if Git is Installed

Open your terminal (or command prompt) and type:

```bash
git --version
```

**If you see a version number** (like `git version 2.39.0`): You're good! Skip to Step 2.

**If you see an error**: You need to install Git.

### Installing Git

#### On Mac
```bash
# Option 1: If you have Homebrew
brew install git

# Option 2: Download from https://git-scm.com/download/mac
```

#### On Windows
1. Download from https://git-scm.com/download/win
2. Run the installer (use default settings)
3. **Important**: Choose "Git Bash" when asked about terminal

#### On Linux
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install git

# Fedora
sudo dnf install git
```

### Step 2: Tell Git Who You Are

Git needs to know your name and email (this appears on your work):

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your.email@company.com"
```

**Verify it worked:**
```bash
git config --global --list
```

You should see your name and email listed.

---

## Part 2: Connecting to GitHub

GitHub is like "Dropbox for code" - it stores your code online so you can access it anywhere and share with others.

### Option A: HTTPS (Easier for Beginners)

1. **Create a GitHub account** at https://github.com
2. When you push code, GitHub will ask for your username/password
3. **Pro tip**: Use a Personal Access Token instead of password:
   - Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
   - Generate new token, select "repo" scope
   - Save this token somewhere safe (you'll use it as your password)

### Option B: SSH Keys (More Secure, Recommended)

SSH keys let you connect without typing your password every time.

#### Step 1: Check for Existing SSH Keys
```bash
ls -la ~/.ssh
```

If you see files like `id_rsa` and `id_rsa.pub` (or `id_ed25519`), you might already have keys.

#### Step 2: Create a New SSH Key

**Important**: Use your GitHub email as the comment (`-C` flag). This helps GitHub recognize the key.

```bash
# Use your GitHub email address (the one you signed up with)
ssh-keygen -t ed25519 -C "your.email@company.com"
```

When prompted:
- **File location**: Press Enter to accept default
- **Passphrase**: Optional (extra security, but you'll type it each time)

> **Troubleshooting**: If GitHub rejects your key with "Key is invalid. You must supply a key in OpenSSH public key format", your key may have been generated with a non-standard comment or format. Generate a new key with a proper email comment:
> ```bash
> ssh-keygen -t ed25519 -C "your.email@company.com" -f ~/.ssh/id_ed25519_github -N ""
> ```
> Then configure SSH to use it by adding to `~/.ssh/config`:
> ```
> Host github.com
>   HostName github.com
>   User git
>   IdentityFile ~/.ssh/id_ed25519_github
>   IdentitiesOnly yes
> ```

#### Step 3: Start the SSH Agent
```bash
# On Mac/Linux
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# On Windows (Git Bash)
eval $(ssh-agent -s)
ssh-add ~/.ssh/id_ed25519
```

#### Step 4: Add Your Key to GitHub
```bash
# Display your public key
cat ~/.ssh/id_ed25519.pub
```

The output should look like this (one single line):
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... your.email@company.com
```

**To add to GitHub:**
1. Copy the **entire line** (from `ssh-ed25519` through your email)
2. Go to https://github.com/settings/keys
3. Click **"New SSH Key"**
4. **Title**: Give it a name (like "Work Laptop")
5. **Key type**: Authentication Key (default)
6. **Key**: Paste the entire line
7. Click **"Add SSH Key"**

> **Common Error**: If GitHub says "Key is invalid", make sure you copied the entire line including the email at the end. Keys without a proper email comment may be rejected.

#### Step 5: Test the Connection
```bash
ssh -T git@github.com
```

You should see: "Hi username! You've successfully authenticated..."

---

## Part 3: Your First Repository

### Scenario A: Starting a New Project

```bash
# 1. Create a folder for your project
mkdir my-project
cd my-project

# 2. Initialize Git (turn this folder into a Git repository)
git init

# 3. Create your first file
echo "# My Project" > README.md

# 4. Stage the file (prepare it to be saved)
git add README.md

# 5. Commit (save a checkpoint)
git commit -m "Initial commit: add README"
```

**What just happened?**
- `git init` = "Start tracking this folder with Git"
- `git add` = "Include this file in my next save"
- `git commit` = "Save a checkpoint with a description"

### Scenario B: Downloading an Existing Project

```bash
# Clone (download) a repository
git clone https://github.com/username/repository-name.git

# Move into the project folder
cd repository-name
```

---

## Part 4: Daily Workflow

This is what you'll do most of the time:

### The Basic Cycle: Edit → Stage → Commit → Push

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   1. EDIT        2. STAGE        3. COMMIT      4. PUSH     │
│   ────────       ──────────      ─────────      ────────    │
│   Make your      Tell Git        Save a         Send to     │
│   changes        which files     checkpoint     GitHub      │
│                  to include                                 │
│                                                             │
│   (your editor)  git add .       git commit     git push    │
│                                  -m "message"               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Step-by-Step Example

```bash
# 1. Check what's changed
git status

# 2. See the actual changes (optional)
git diff

# 3. Stage all changed files
git add .
# Or stage specific files:
git add filename.js

# 4. Commit with a meaningful message
git commit -m "Add login button to homepage"

# 5. Push to GitHub
git push
```

### Getting Updates from Your Team

```bash
# Download the latest changes from GitHub
git pull
```

**Do this before starting work each day!**

---

## Part 5: Understanding Branches

Branches let you work on new features without affecting the main code.

```
main (stable code)
  │
  └── feature-login (your new work)
         │
         └── When done, merge back to main
```

### Basic Branch Commands

```bash
# See what branch you're on
git branch

# Create a new branch and switch to it
git checkout -b feature-name

# Switch between branches
git checkout main
git checkout feature-name

# Push a new branch to GitHub
git push -u origin feature-name
```

---

## Part 6: Common Scenarios

### "I want to save my work"
```bash
git add .
git commit -m "Describe what you changed"
git push
```

### "I want to get the latest code from my team"
```bash
git pull
```

### "I made a mistake and want to undo"

**Undo changes to a file (before staging):**
```bash
git checkout -- filename.js
```

**Unstage a file (after git add, before commit):**
```bash
git reset HEAD filename.js
```

**Undo the last commit (keep the changes):**
```bash
git reset --soft HEAD~1
```

### "I'm on the wrong branch"
```bash
# Save your work temporarily
git stash

# Switch to the correct branch
git checkout correct-branch

# Bring your work back
git stash pop
```

### "Someone else changed the same file (merge conflict)"

Don't panic! Git will show you both versions:

```
<<<<<<< HEAD
Your version of the code
=======
Their version of the code
>>>>>>> branch-name
```

1. Edit the file to keep what you want
2. Remove the `<<<<<<<`, `=======`, and `>>>>>>>` markers
3. Save, then:
```bash
git add filename.js
git commit -m "Resolve merge conflict in filename.js"
```

---

## Quick Reference Card

| What You Want to Do | Command |
|---------------------|---------|
| Check status | `git status` |
| See what changed | `git diff` |
| Stage all files | `git add .` |
| Stage one file | `git add filename` |
| Save a checkpoint | `git commit -m "message"` |
| Send to GitHub | `git push` |
| Get latest from GitHub | `git pull` |
| Create new branch | `git checkout -b branch-name` |
| Switch branches | `git checkout branch-name` |
| See all branches | `git branch` |
| View commit history | `git log --oneline` |
| Undo uncommitted changes | `git checkout -- filename` |

---

## Troubleshooting

See `references/troubleshooting.md` for solutions to common errors like:
- "Permission denied (publickey)"
- "Your branch is behind origin/main"
- "Failed to push some refs"
- Merge conflicts

---

## Glossary

See `references/glossary.md` for plain-English explanations of Git terms.

---

## Health Check

Run the diagnostic script to check your Git setup:

```bash
python scripts/git_health_check.py
```

This will verify:
- Git is installed
- Your identity is configured
- SSH keys are set up
- You can connect to GitHub

---

## Resources

- **Official Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com
- **Interactive Tutorial**: https://learngitbranching.js.org

---

## Remember

1. **Commit often** - Small, frequent saves are better than one huge save
2. **Write good messages** - Future you will thank present you
3. **Pull before you push** - Get the latest code before sending yours
4. **Don't panic** - Almost everything in Git can be undone!
