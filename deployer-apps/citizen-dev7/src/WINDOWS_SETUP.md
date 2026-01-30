# Windows Setup Guide - No Elevated Permissions Needed!

**Docker solves Windows permission issues** - No need to install Node.js, Python, or run build tools locally!

## 🎯 The Problem Docker Solves

On Windows, building webapps typically requires:
- ❌ Installing Node.js (npm, esbuild, etc.) - often needs elevated permissions
- ❌ Installing Python - permission issues
- ❌ Running build tools in Cursor - requires admin/elevated access
- ❌ Managing PATH variables
- ❌ Dealing with Windows-specific build tool issues

## ✅ The Docker Solution

**Everything runs inside Docker** - no local build tools needed!

- ✅ **No Node.js installation** - React builds happen in Docker
- ✅ **No Python installation** - Backend runs in Docker
- ✅ **No esbuild locally** - All builds happen in container
- ✅ **No elevated permissions** - Docker handles everything
- ✅ **Works the same on Windows/Mac/Linux**

## 🚀 Quick Start (Windows)

### Step 1: Install Docker Desktop

1. Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
2. Install (may need admin for installation, but not for running)
3. Start Docker Desktop
4. Wait for it to fully start (whale icon in system tray)

**That's it!** No other tools needed.

### Step 2: Configure Environment

```powershell
# Navigate to project
cd deployer-apps\<instance-name>\src

# Copy environment template
copy .env.example .env

# Edit .env with any credentials your app needs
# (Use Notepad, VS Code, or any text editor)
```

### Step 3: Start the App

```powershell
# Run Docker script
.\scripts\docker-dev.sh

# Or if PowerShell execution policy blocks it:
bash scripts/docker-dev.sh
```

**That's it!** The app builds and runs in Docker - no local tools needed.

## 🔧 No Local Build Tools Required

### What You DON'T Need to Install

- ❌ **Node.js** - Not needed, React builds in Docker
- ❌ **npm/yarn/pnpm** - Not needed, Docker handles it
- ❌ **esbuild** - Not needed, builds in Docker
- ❌ **Python** - Not needed, runs in Docker
- ❌ **pip/venv** - Not needed, Docker manages dependencies
- ❌ **Build tools** - Everything happens in Docker

### What Happens in Docker

When you run `./scripts/docker-dev.sh`:

1. **Docker builds React UI** - Uses Node.js inside container
2. **Docker installs Python deps** - Uses pip inside container
3. **Docker runs your app** - Everything contained
4. **No Windows permissions needed** - Docker handles it all

## 💻 Development Workflow (Windows)

### Backend Development

**No rebuilds needed - hot reloads automatically:**

```powershell
# Start once
.\scripts\docker-dev.sh

# Then just edit Python files
# Changes apply immediately - no rebuilds!
```

**Works for:**
- Editing `api.py`
- Adding Python modules
- Modifying business logic
- Agent files (if using agent framework)

### Frontend Development

**Two options:**

**Option 1: Docker Only** (No local tools needed)
```powershell
# Edit UI files
# Rebuild when done
.\scripts\docker-dev.sh --build
```

**Option 2: UI Locally** (Requires Node.js, but faster)
```powershell
# Terminal 1: Backend (Docker)
.\scripts\docker-dev.sh

# Terminal 2: UI (requires Node.js installed)
cd ui
npm install
npm run dev
```

**Recommendation:** Use Option 1 if you want to avoid installing Node.js. Use Option 2 if you already have Node.js and want faster UI iteration.

## 🐛 Troubleshooting Windows Issues

### "Execution Policy" Error

If PowerShell blocks the script:

```powershell
# Option 1: Use Git Bash (recommended)
bash scripts/docker-dev.sh

# Option 2: Change execution policy (one-time)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Option 3: Run in Command Prompt (cmd)
cmd /c scripts\docker-dev.sh
```

### Docker Not Starting

- Make sure Docker Desktop is running (check system tray)
- May need to enable WSL 2 (Docker will prompt you)
- Restart Docker Desktop if needed

### Path Issues

Docker handles all paths internally - no Windows PATH configuration needed!

### File Permissions

Docker volume mounts handle permissions automatically. If you see permission errors:
- Make sure Docker Desktop is running
- Check that files aren't locked by another process
- Restart Docker Desktop

## ✅ Benefits for Windows Users

1. **No Elevated Permissions** - Docker runs everything
2. **No Tool Installation** - Everything in Docker
3. **Consistent Environment** - Same on all machines
4. **No PATH Issues** - Docker handles paths
5. **No Build Tool Conflicts** - Isolated in containers
6. **Easy Cleanup** - Just remove Docker containers/images

## 📝 What Gets Built Where

| Component | Builds In | Needs Local Tools? |
|-----------|-----------|-------------------|
| React UI | Docker container | ❌ No |
| Python backend | Docker container | ❌ No |
| Dependencies | Docker container | ❌ No |
| Everything | Docker | ❌ No |

## 🎯 Summary

**For Windows users, Docker eliminates:**
- ❌ Permission issues with build tools
- ❌ Need to install Node.js/Python
- ❌ Elevated permissions in Cursor
- ❌ esbuild/npm/pip installation issues
- ❌ PATH configuration problems

**Docker provides:**
- ✅ Everything runs in containers
- ✅ No local build tools needed
- ✅ No permission issues
- ✅ Same experience on Windows/Mac/Linux

**Just install Docker Desktop and you're done!**
