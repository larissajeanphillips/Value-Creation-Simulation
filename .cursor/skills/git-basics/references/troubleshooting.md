# Git Troubleshooting Guide

Solutions to common Git problems, explained simply.

---

## Authentication Errors

### "Permission denied (publickey)"

**What it means:** GitHub doesn't recognize your computer.

**Solution 1: Check if you have SSH keys**
```bash
ls -la ~/.ssh
```

If you don't see `id_ed25519` or `id_rsa` files, you need to create SSH keys:
```bash
ssh-keygen -t ed25519 -C "your.email@company.com"
```

**Solution 2: Add your key to the SSH agent**
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

**Solution 3: Make sure your key is on GitHub**
```bash
# Copy your public key
cat ~/.ssh/id_ed25519.pub
```
Then add it at: GitHub → Settings → SSH and GPG Keys → New SSH Key

**Solution 4: Test the connection**
```bash
ssh -T git@github.com
```

---

### "remote: Invalid username or password"

**What it means:** Your password/token is wrong or expired.

**If using HTTPS:**
1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens
2. Generate a new token with "repo" scope
3. Use this token as your password

**Switch to SSH instead (recommended):**
```bash
# Change remote URL from HTTPS to SSH
git remote set-url origin git@github.com:username/repo.git
```

---

### "Could not read from remote repository"

**What it means:** Git can't connect to GitHub.

**Check 1: Verify remote URL**
```bash
git remote -v
```

**Check 2: Test connectivity**
```bash
# For SSH
ssh -T git@github.com

# For HTTPS
curl https://github.com
```

**Check 3: VPN/Firewall issues**
- Try disabling VPN temporarily
- Check if your network blocks Git ports

---

## Push/Pull Errors

### "Failed to push some refs" / "Updates were rejected"

**What it means:** Someone else pushed changes before you. Your local copy is behind.

**Solution:**
```bash
# Get the latest changes first
git pull

# If there are conflicts, resolve them (see merge conflicts section)
# Then try pushing again
git push
```

**If you want to see what's different:**
```bash
git fetch
git log HEAD..origin/main --oneline
```

---

### "Your branch is behind origin/main by X commits"

**What it means:** There are newer commits on GitHub that you don't have.

**Solution:**
```bash
git pull
```

---

### "Your branch is ahead of origin/main by X commits"

**What it means:** You have commits that aren't on GitHub yet.

**Solution:**
```bash
git push
```

---

### "There is no tracking information for the current branch"

**What it means:** Git doesn't know which remote branch to push to.

**Solution (first push of a new branch):**
```bash
git push -u origin your-branch-name
```

---

## Merge Conflicts

### "CONFLICT: Merge conflict in [filename]"

**What it means:** You and someone else changed the same lines. Git doesn't know which version to keep.

**Step 1: Open the file**

You'll see something like:
```
<<<<<<< HEAD
Your changes here
=======
Their changes here
>>>>>>> branch-name
```

**Step 2: Edit the file**
- Keep the code you want
- Delete the `<<<<<<<`, `=======`, and `>>>>>>>` markers
- Save the file

**Step 3: Mark as resolved**
```bash
git add filename
git commit -m "Resolve merge conflict in filename"
```

**Tip: Use a visual merge tool**
```bash
git mergetool
```

---

### "Automatic merge failed; fix conflicts and then commit"

**What it means:** Multiple files have conflicts.

**Solution:**
```bash
# See which files have conflicts
git status

# The files listed as "both modified" need to be fixed
# Edit each one, then:
git add .
git commit -m "Resolve merge conflicts"
```

---

## Undo Mistakes

### "I committed to the wrong branch!"

**Solution 1: Move the commit to the right branch**
```bash
# Note the commit hash
git log --oneline -1

# Switch to the correct branch
git checkout correct-branch

# Apply the commit there
git cherry-pick <commit-hash>

# Go back and remove from wrong branch
git checkout wrong-branch
git reset --hard HEAD~1
```

**Solution 2: If you haven't pushed yet**
```bash
git reset --soft HEAD~1  # Undo commit, keep changes
git stash                # Save changes temporarily
git checkout correct-branch
git stash pop            # Bring changes back
git add .
git commit -m "Your message"
```

---

### "I need to undo my last commit"

**Keep the changes (just undo the commit):**
```bash
git reset --soft HEAD~1
```

**Discard the changes completely:**
```bash
git reset --hard HEAD~1
```

---

### "I need to undo changes to a file"

**If you haven't staged it yet (no git add):**
```bash
git checkout -- filename
# or
git restore filename
```

**If you already staged it:**
```bash
git reset HEAD filename
git checkout -- filename
```

---

### "I accidentally deleted a file!"

**If you haven't committed the deletion:**
```bash
git checkout -- filename
```

**If you committed the deletion:**
```bash
# Find when the file existed
git log --all --full-history -- filename

# Restore it from that commit
git checkout <commit-hash> -- filename
```

---

## Branch Problems

### "Cannot delete branch: checked out at..."

**What it means:** You can't delete the branch you're currently on.

**Solution:**
```bash
git checkout main  # Switch to another branch first
git branch -d branch-to-delete
```

---

### "Cannot delete branch: not fully merged"

**What it means:** The branch has commits that aren't in main yet.

**If you're sure you want to delete:**
```bash
git branch -D branch-name  # Force delete
```

---

### "Detached HEAD state"

**What it means:** You're not on a branch; you're looking at a specific commit.

**Solution: Create a branch here or go back**
```bash
# Option 1: Go back to a branch
git checkout main

# Option 2: Create a new branch from here
git checkout -b new-branch-name
```

---

## Configuration Issues

### "fatal: not a git repository"

**What it means:** You're not inside a Git project folder.

**Solution:**
```bash
# Navigate to your project folder
cd path/to/your/project

# Or initialize Git in current folder
git init
```

---

### "Author identity unknown"

**What it means:** You haven't set up your name/email.

**Solution:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"
```

---

## Performance Issues

### "Git is very slow"

**Possible causes and solutions:**

1. **Large files in repo:**
   ```bash
   # Find large files
   git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sort -rnk3 | head -20
   ```

2. **Too many files:**
   ```bash
   # Use sparse checkout
   git sparse-checkout init
   git sparse-checkout set folder1 folder2
   ```

3. **Network issues:**
   ```bash
   # Clone with depth limit
   git clone --depth 1 <url>
   ```

---

## Still Stuck?

### Get More Information

```bash
# Verbose output
GIT_TRACE=1 git <command>

# Check Git configuration
git config --list --show-origin

# Check remote configuration
git remote -v
```

### Emergency Reset (Last Resort) ⚠️

If everything is broken and you have a backup:

```bash
# Save your changes somewhere safe first!
cp -r . ../backup

# Reset to match remote exactly
git fetch origin
git reset --hard origin/main
```

### Ask for Help

Include this information when asking for help:
```bash
git --version
git status
git remote -v
git log --oneline -5
```
