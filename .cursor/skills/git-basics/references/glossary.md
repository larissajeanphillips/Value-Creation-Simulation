# Git Glossary

Plain-English explanations of Git terms. No jargon, just clarity.

---

## Core Concepts

### Repository (Repo)
A folder that Git is tracking. Contains all your project files plus a hidden `.git` folder where Git stores its history.

**Analogy:** A project folder with a magical time machine attached.

---

### Commit
A saved checkpoint of your project at a moment in time. Each commit has:
- A unique ID (hash)
- A message describing what changed
- A record of who made it and when

**Analogy:** Like taking a snapshot/photo of your entire project that you can return to later.

---

### Branch
A parallel version of your project. You can work on features in separate branches without affecting the main code.

**Analogy:** Like creating a copy of a document to try out ideas, while keeping the original safe.

---

### Main (or Master)
The primary branch of your project. This is usually the "official" version that gets deployed.

**Note:** Older projects use "master"; newer ones use "main". They work the same way.

---

### Remote
A version of your repository stored on a server (like GitHub). Allows sharing and backup.

**Analogy:** If your local repo is a document on your computer, the remote is a copy saved to Dropbox/Google Drive.

---

### Origin
The default name for your remote repository (usually on GitHub). When you push or pull, you're typically communicating with "origin."

---

### Clone
Download a copy of a remote repository to your computer.

**Analogy:** Making a copy of someone's Google Doc so you can edit it locally.

---

## Working with Changes

### Working Directory
The files you see in your project folder - the ones you're actively editing.

---

### Staging Area (Index)
A holding area for changes you want to include in your next commit. When you `git add` a file, it goes to the staging area.

**Analogy:** A box where you collect items before shipping them. You decide what goes in the box before sealing it.

```
Working Directory → [git add] → Staging Area → [git commit] → Repository
```

---

### Staged
A file that's been added to the staging area and is ready to be committed.

---

### Unstaged
A file that has changes, but those changes aren't in the staging area yet.

---

### Untracked
A new file that Git doesn't know about yet. It won't be included in commits until you `git add` it.

---

### Modified
A tracked file that has changes since the last commit.

---

### Tracked
A file that Git is monitoring for changes (it was included in a previous commit).

---

## Syncing & Collaboration

### Push
Send your local commits to a remote repository (like GitHub).

**Analogy:** Uploading your saved work to the cloud.

---

### Pull
Download changes from a remote repository and merge them into your local branch.

**Analogy:** Downloading the latest version from the cloud and merging it with your work.

---

### Fetch
Download changes from a remote repository, but don't merge them yet. Lets you see what's new before integrating.

**Analogy:** Checking your mailbox without opening the letters.

---

### Merge
Combine changes from one branch into another. Git tries to do this automatically; if there are conflicts, you'll need to resolve them manually.

---

### Merge Conflict
When Git can't automatically combine changes because the same lines were modified differently in two branches. You have to manually choose which version to keep.

---

### Pull Request (PR)
A request to merge your branch into another branch (usually main). Used on GitHub for code review before merging.

**Analogy:** Asking your teammate to review your changes before adding them to the official project.

---

## Branching & History

### HEAD
A pointer to the current commit you're working on. Usually points to the tip of your current branch.

**Analogy:** The "You Are Here" marker on a map.

---

### Checkout
Switch to a different branch or commit. Also used to discard changes to files.

---

### Hash (SHA)
A unique 40-character ID for each commit (often shown as just the first 7 characters). Looks like: `a1b2c3d`

---

### Parent
The commit that came before the current one. Most commits have one parent; merge commits have two.

---

### Log
The history of commits in your repository. View with `git log`.

---

### Diff
The differences between two versions of a file or between commits. Shows what lines were added/removed.

---

## Undoing Things

### Reset
Move your branch pointer to a different commit. Can optionally discard changes.

- `--soft`: Keep changes staged
- `--mixed` (default): Keep changes unstaged
- `--hard`: Discard all changes ⚠️

---

### Revert
Create a new commit that undoes a previous commit. Safer than reset because it doesn't rewrite history.

---

### Stash
Temporarily save uncommitted changes so you can work on something else. Like putting your work in a drawer.

---

### Cherry-pick
Copy a specific commit from one branch to another.

---

## Advanced Concepts

### Rebase
Move or combine commits by changing their base. Creates a cleaner history but rewrites commits.

**Note:** Don't rebase commits that have been pushed and shared with others.

---

### Squash
Combine multiple commits into one. Often done before merging to keep history clean.

---

### Tag
A label attached to a specific commit, usually used to mark releases (like `v1.0.0`).

---

### .gitignore
A file that tells Git which files/folders to ignore (not track). Commonly used for:
- `node_modules/`
- `.env` files
- Build outputs
- IDE settings

---

### Upstream
The remote repository/branch that your local branch is tracking. Set with `git push -u origin branch-name`.

---

### Fork
A personal copy of someone else's repository on GitHub. You can make changes without affecting the original.

---

## Visual Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Git Workflow                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   Working    │    │   Staging    │    │    Local     │          │
│  │  Directory   │───▶│    Area      │───▶│  Repository  │          │
│  │              │    │              │    │              │          │
│  │  (your files)│    │ (ready to    │    │ (committed   │          │
│  │              │    │  commit)     │    │  history)    │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│         │                                       │                   │
│      git add                                 git push               │
│                                                 │                   │
│                                                 ▼                   │
│                                         ┌──────────────┐           │
│                                         │    Remote    │           │
│                                         │  Repository  │           │
│                                         │   (GitHub)   │           │
│                                         └──────────────┘           │
│                                                 │                   │
│                                              git pull               │
│                                                 │                   │
│                                                 ▼                   │
│                                         Back to Working            │
│                                            Directory               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Common Confusion

### Git vs GitHub
- **Git**: The version control software running on your computer
- **GitHub**: A website that hosts Git repositories online

Git works without GitHub. GitHub is just one place to store remote repositories.

---

### Pull vs Fetch
- **Fetch**: Download changes, but don't merge (safe to do anytime)
- **Pull**: Fetch + Merge in one step

---

### Merge vs Rebase
- **Merge**: Creates a merge commit, preserves history exactly as it happened
- **Rebase**: Rewrites history to be linear, creates cleaner-looking history

For beginners: **stick with merge**. It's safer and easier to understand.

---

### Reset vs Revert
- **Reset**: Go back in time, potentially losing commits (rewrites history)
- **Revert**: Create a new commit that undoes changes (safe, preserves history)

For shared branches: **use revert**. For local work: reset is fine.
