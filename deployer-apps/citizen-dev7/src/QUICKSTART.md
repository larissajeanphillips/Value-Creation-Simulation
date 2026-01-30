# 🚀 Quick Start - Run with Docker (No Dependencies Required!)

**Generic FastAPI + React Webapp Starter** - Build any type of webapp!

**Everything you need is in Docker - no Node.js, Python, or other tools required!**

**🎯 Perfect for Windows users** - No elevated permissions needed! Docker handles all build tools (esbuild, npm, etc.) inside containers.

## Prerequisites

- **Docker Desktop** installed and running
  - Download: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - **Windows users:** Docker eliminates need for Node.js, Python, or elevated permissions!
  - Make sure Docker is running (check system tray/status bar)

- **Environment Variables** (if your app needs them)
  - Create `.env` from `.env.example`
  - Add any credentials your app requires
  - *The agent framework example needs AI Gateway credentials, but you can build any app*

**That's it!** No Node.js, Python, npm, esbuild, or any other build tools needed. Everything runs in Docker.

## 🎯 3-Step Setup

### Step 1: Configure Credentials

```bash
cd deployer-apps/<instance-name>/src
cp .env.example .env
```

Edit `.env` and add your credentials:
```bash
AI_GATEWAY_INSTANCE_ID=your_instance_id_here
AI_GATEWAY_API_KEY=your_client_id:your_client_secret
```

### Step 2: Start the App

```bash
./scripts/docker-dev.sh
```

That's it! The script will:
- Build the Docker image (first time only, ~2-3 minutes)
- Start the container with hot reloading
- Make the app available at **http://localhost:3000**

### Step 3: Open in Browser

Open **http://localhost:3000** in your browser.

## 🛑 Stopping the App

Press `Ctrl+C` in the terminal where Docker is running, or:

```bash
docker stop agent-chat-dev
```

## 🔄 Rebuilding After Changes

**Most of the time, you DON'T need to rebuild!**

### Backend Changes (No Rebuild Needed)
Python files hot reload automatically:
- API endpoints (`api.py`)
- Business logic (any Python files)
- Agents, configs, prompts (if using agent framework)

**Just save and test - no rebuild!**

### UI Changes (Two Options)

**Option 1: Rebuild** ⚠️ (slower)
```bash
./scripts/docker-dev.sh --build
```

**Option 2: Run UI Separately** ✅ **RECOMMENDED** (instant reload)
```bash
# Terminal 1: Backend (Docker)
./scripts/docker-dev.sh

# Terminal 2: UI (local, instant reload)
cd ui && npm run dev
```

**See [REBUILD_GUIDE.md](./REBUILD_GUIDE.md) for detailed scenarios.**

## 📝 What Gets Hot Reloaded

These changes apply immediately (no rebuild):
- ✅ Agent files (`agents/*.py`) - Add new agents, modify existing
- ✅ Prompts (`configs/prompts/*.txt`) - Edit agent prompts
- ✅ Routing (`configs/routing.yaml`) - Update routing rules
- ✅ Settings (`configs/settings.yaml`) - Change models, configs
- ✅ Reference data (`reference/`) - Add/update reference files
- ✅ API endpoints (`api.py`) - Modify backend API

These require rebuild (`--build` flag):
- ⚠️ UI components (`ui/src/`) - React component changes
- ⚠️ UI dependencies (`ui/package.json`) - New npm packages
- ⚠️ Python dependencies (`requirements.txt`) - New Python packages

**💡 Tip:** See [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md) for detailed development scenarios and best practices.

## 🐛 Troubleshooting

### "Docker is not running"
- Start Docker Desktop
- Wait for it to fully start (whale icon in system tray)

### "Missing required environment variables"
- Make sure `.env` file exists in `src/` directory
- Check that it contains `AI_GATEWAY_INSTANCE_ID` and `AI_GATEWAY_API_KEY`

### "Port 3000 already in use"
- Stop any other apps using port 3000
- Or modify the port in `docker-dev.sh` (change `-p 3000:3000` to `-p 3001:3000`)

### "Permission denied" on docker-dev.sh
```bash
chmod +x scripts/docker-dev.sh
```

## 📚 Next Steps

- **Build your webapp**: See [WEBAPP_STARTER.md](./WEBAPP_STARTER.md) for building any type of app
- **Development workflow**: See [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md) for how changes work
- **Agent framework**: If using agents, see `SETUP.md` and `README.md`
- **Deploy to production**: See `STARTER_TEMPLATE_SETUP.md`

## 💡 Alternative: Run Without Docker

If you prefer to run without Docker (requires Node.js and Python):

```bash
# Terminal 1: Backend
uvicorn api:app --reload --port 3000

# Terminal 2: Frontend  
cd ui && npm install && npm run dev
```

But Docker is recommended - it's simpler and ensures consistency!
