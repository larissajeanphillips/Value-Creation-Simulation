# Git Commands Quick Reference

A printable cheat sheet for everyday Git commands.

---

## Setup Commands

| Command | What It Does |
|---------|--------------|
| `git --version` | Check if Git is installed |
| `git config --global user.name "Name"` | Set your name |
| `git config --global user.email "email"` | Set your email |
| `git config --global --list` | See your settings |

---

## Starting a Project

| Command | What It Does |
|---------|--------------|
| `git init` | Turn current folder into a Git repo |
| `git clone <url>` | Download a repo from GitHub |

---

## Daily Workflow

### Checking Status

| Command | What It Does |
|---------|--------------|
| `git status` | See what files have changed |
| `git diff` | See the actual line-by-line changes |
| `git diff --staged` | See changes that are staged |
| `git log` | See commit history |
| `git log --oneline` | See compact commit history |
| `git log --oneline -10` | See last 10 commits |

### Saving Your Work

| Command | What It Does |
|---------|--------------|
| `git add <file>` | Stage a specific file |
| `git add .` | Stage all changed files |
| `git add -p` | Stage changes interactively (pick which parts) |
| `git commit -m "message"` | Save staged changes with a description |
| `git commit -am "message"` | Stage and commit all tracked files |

### Syncing with GitHub

| Command | What It Does |
|---------|--------------|
| `git push` | Send your commits to GitHub |
| `git push -u origin <branch>` | Push a new branch for the first time |
| `git pull` | Download and merge latest from GitHub |
| `git fetch` | Download latest (but don't merge yet) |

---

## Branches

| Command | What It Does |
|---------|--------------|
| `git branch` | List all local branches |
| `git branch -a` | List all branches (including remote) |
| `git branch <name>` | Create a new branch |
| `git checkout <branch>` | Switch to a branch |
| `git checkout -b <name>` | Create and switch to new branch |
| `git switch <branch>` | Switch to a branch (newer syntax) |
| `git switch -c <name>` | Create and switch (newer syntax) |
| `git merge <branch>` | Merge another branch into current |
| `git branch -d <name>` | Delete a branch (safe) |
| `git branch -D <name>` | Force delete a branch |

---

## Undoing Things

### Before Staging (git add)

| Command | What It Does |
|---------|--------------|
| `git checkout -- <file>` | Discard changes to a file |
| `git restore <file>` | Discard changes (newer syntax) |
| `git checkout .` | Discard all changes |

### After Staging, Before Commit

| Command | What It Does |
|---------|--------------|
| `git reset HEAD <file>` | Unstage a file |
| `git restore --staged <file>` | Unstage (newer syntax) |
| `git reset HEAD` | Unstage everything |

### After Commit

| Command | What It Does |
|---------|--------------|
| `git reset --soft HEAD~1` | Undo last commit (keep changes staged) |
| `git reset HEAD~1` | Undo last commit (keep changes unstaged) |
| `git reset --hard HEAD~1` | Undo last commit (delete changes) ⚠️ |
| `git revert <commit>` | Create new commit that undoes a specific commit |

---

## Stashing (Temporary Storage)

| Command | What It Does |
|---------|--------------|
| `git stash` | Save changes temporarily |
| `git stash list` | See all stashes |
| `git stash pop` | Restore most recent stash |
| `git stash apply` | Restore stash but keep it in the list |
| `git stash drop` | Delete most recent stash |

---

## Remote Repositories

| Command | What It Does |
|---------|--------------|
| `git remote -v` | See connected remote repos |
| `git remote add origin <url>` | Connect to a GitHub repo |
| `git remote set-url origin <url>` | Change the remote URL |

---

## Viewing History

| Command | What It Does |
|---------|--------------|
| `git log` | Full commit history |
| `git log --oneline` | Compact history |
| `git log --graph` | Visual branch history |
| `git log -p` | History with actual changes |
| `git show <commit>` | See a specific commit |
| `git blame <file>` | See who changed each line |

---

## Comparing Changes

| Command | What It Does |
|---------|--------------|
| `git diff` | Changes not yet staged |
| `git diff --staged` | Changes staged for commit |
| `git diff <branch1> <branch2>` | Compare two branches |
| `git diff <commit1> <commit2>` | Compare two commits |

---

## Tags (Marking Releases)

| Command | What It Does |
|---------|--------------|
| `git tag` | List all tags |
| `git tag v1.0.0` | Create a lightweight tag |
| `git tag -a v1.0.0 -m "message"` | Create annotated tag |
| `git push --tags` | Push tags to GitHub |

---

## Dangerous Commands ⚠️

Use with caution - these can lose work!

| Command | What It Does |
|---------|--------------|
| `git reset --hard` | Delete all uncommitted changes |
| `git clean -fd` | Delete untracked files and folders |
| `git push --force` | Overwrite remote history |

---

## Keyboard Shortcuts in Git Log/Diff

When viewing logs or diffs, Git uses a "pager" (like `less`):

| Key | Action |
|-----|--------|
| `Space` | Next page |
| `b` | Previous page |
| `q` | Quit/exit |
| `/text` | Search for "text" |
| `n` | Next search result |

---

## Commit Message Best Practices

Write messages that explain **why**, not just **what**:

```bash
# Good ✅
git commit -m "Fix login timeout issue for slow networks"
git commit -m "Add dark mode toggle to settings page"

# Bad ❌
git commit -m "Fixed bug"
git commit -m "Updates"
git commit -m "asdf"
```

### Conventional Commit Format (Used in This Project)

```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation only
- style: Formatting (no code change)
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance tasks
```

Examples:
```bash
git commit -m "feat: add user profile page"
git commit -m "fix: resolve login redirect loop"
git commit -m "docs: update API documentation"
```
