# Development Workflow Guide

This guide explains what happens when you make changes to your webapp and how to handle different types of modifications.

**Note:** This template works for any FastAPI + React webapp. The agent framework is just one example - you can build anything!

## 🔄 Hot Reloading vs. Rebuilds

The Docker setup uses **volume mounts** to enable hot reloading for most backend changes, while UI changes require rebuilding the Docker image.

## ✅ Changes That Hot Reload Automatically

These changes apply **immediately** - just save the file and refresh your browser (or make a new API request):

### Backend Changes (No Rebuild Needed)

1. **API Endpoints** (`api.py`)
   - Add new endpoints
   - Modify existing endpoints
   - Change API logic
   - **Example**: Add new `/api/custom` endpoint

2. **Python Modules** (any `.py` files you add)
   - Create new modules
   - Modify business logic
   - Add utility functions
   - **Example**: Create `services/database.py`

3. **Agent Files** (`agents/*.py`) - *If using agent framework*
   - Add new agent files
   - Modify existing agent logic
   - Changes reflect on next API request
   - **Example**: Create `agents/my_new_agent.py`

4. **System Prompts** (`configs/prompts/*.system.txt`) - *If using agent framework*
   - Edit agent prompts
   - Add new prompt files
   - Changes apply immediately

5. **Configuration Files** (`configs/*.yaml`) - *If using agent framework*
   - Update routing rules
   - Change model settings
   - Modify configurations

6. **Reference Data** (`reference/`) - *If using agent framework*
   - Add new reference files
   - Update existing files
   - Create new directories

7. **Workflow Logic** (`workflows/workflow.py`) - *If using agent framework*
   - Modify agent initialization
   - Change routing logic
   - Update workflow behavior

## ⚠️ Changes That Require Rebuild

These changes require rebuilding the Docker image with `--build` flag:

### UI Changes (Rebuild Required)

1. **React Components** (`ui/src/components/`)
   - Modify component code
   - Add new components
   - Change component structure
   - **Rebuild**: `./scripts/docker-dev.sh --build`

2. **UI Dependencies** (`ui/package.json`)
   - Add new npm packages
   - Update package versions
   - **Rebuild**: `./scripts/docker-dev.sh --build`

3. **UI Configuration** (`ui/tailwind.config.js`, `ui/vite.config.ts`)
   - Change Tailwind settings
   - Modify Vite configuration
   - **Rebuild**: `./scripts/docker-dev.sh --build`

4. **UI Styles** (`ui/src/index.css`, `ui/src/*.css`)
   - Global CSS changes
   - Style modifications
   - **Rebuild**: `./scripts/docker-dev.sh --build`

### Python Dependencies (Rebuild Required)

1. **New Python Packages** (`requirements.txt`)
   - Add new dependencies
   - Update package versions
   - **Rebuild**: `./scripts/docker-dev.sh --build`

2. **Framework Files** (`llm/client.py`, `agents/base.py`)
   - Modify core framework (rare)
   - **Rebuild**: `./scripts/docker-dev.sh --build`

## 📋 Common Development Scenarios

### Scenario 1: Adding a New API Endpoint

**Steps:**
1. Edit `api.py`
2. Add new endpoint:
   ```python
   @app.get("/api/my-endpoint")
   async def my_endpoint():
       return {"message": "Hello!"}
   ```

**Rebuild needed?** ❌ **No** - Just save and test!

**Test:**
```bash
curl http://localhost:3000/api/my-endpoint
```

### Scenario 2: Adding a New Agent (If Using Agent Framework)

**Steps:**
1. Create new agent file: `agents/my_new_agent.py`
2. Create system prompt: `configs/prompts/my_new_agent.system.txt`
3. Add to routing: `configs/routing.yaml`
4. Update settings: `configs/settings.yaml` (if needed)

**Rebuild needed?** ❌ **No** - Just save files and test!

**Test:**
```bash
# Container is already running, just make a request
curl http://localhost:3000/api/chat -d '{"message": "test my new agent"}'
```

### Scenario 3: Modifying Agent Behavior (If Using Agent Framework)

**Steps:**
1. Edit agent file: `agents/my_agent.py`
2. Or edit prompt: `configs/prompts/my_agent.system.txt`

**Rebuild needed?** ❌ **No** - Changes apply immediately!

**Test:**
- Refresh browser or make new API request
- Changes reflect on next request

### Scenario 4: Adding Reference Data (If Using Agent Framework)

**Steps:**
1. Create directory: `reference/my_agent/`
2. Add files: `reference/my_agent/data.json`

**Rebuild needed?** ❌ **No** - Files are mounted as volumes!

**Test:**
- Agent automatically loads new reference data
- No restart needed

### Scenario 5: Changing UI Components

**Steps:**
1. Edit component: `ui/src/components/Chat.tsx`
2. Save file

**Rebuild needed?** ✅ **Yes** - UI is pre-built in Docker image

**Rebuild:**
```bash
# Stop current container (Ctrl+C)
./scripts/docker-dev.sh --build
```

**Alternative for UI Development:**
Run UI separately for faster iteration:
```bash
# Terminal 1: Backend (Docker)
./scripts/docker-dev.sh

# Terminal 2: UI (local, requires Node.js)
cd ui && npm install && npm run dev
```

### Scenario 6: Adding New npm Package

**Steps:**
1. Edit `ui/package.json`:
   ```json
   "dependencies": {
     "new-package": "^1.0.0"
   }
   ```

**Rebuild needed?** ✅ **Yes**

**Rebuild:**
```bash
./scripts/docker-dev.sh --build
```

### Scenario 7: Adding New Python Package

**Steps:**
1. Edit `requirements.txt`:
   ```
   new-package==1.0.0
   ```

**Rebuild needed?** ✅ **Yes**

**Rebuild:**
```bash
./scripts/docker-dev.sh --build
```

### Scenario 8: Adding New Python Module

**Steps:**
1. Create new file: `services/my_service.py`
2. Import and use in `api.py`

**Rebuild needed?** ❌ **No** - Python modules hot reload!

**Test:**
- Changes apply immediately
- Refresh browser or make new request

## 🚀 Development Workflow Recommendations

### For Backend Development (API, Business Logic, Agents)

**Recommended: Use Docker with hot reload**
```bash
# Start once
./scripts/docker-dev.sh

# Then just edit files - changes apply automatically!
# No need to restart for:
# - New agents
# - Prompt changes
# - Config updates
# - Reference data
# - API modifications
```

**Workflow:**
1. Start Docker container once
2. Edit Python files as needed (API, business logic, agents)
3. Test immediately (no restart)
4. Iterate quickly

**Works for:**
- Generic webapps (any FastAPI app)
- Agent-based apps (using the framework)
- Any Python backend logic

### For UI Development

**Option 1: Docker (Slower iteration)**
```bash
# Edit UI files
# Rebuild when done
./scripts/docker-dev.sh --build
```

**Option 2: Separate Processes (Faster iteration)**
```bash
# Terminal 1: Backend in Docker
./scripts/docker-dev.sh

# Terminal 2: UI locally (hot reloads instantly)
cd ui
npm install  # First time only
npm run dev  # Starts on http://localhost:5173
```

**Benefits of Option 2:**
- UI changes reload instantly (no rebuild)
- Faster development cycle
- Better for UI-heavy work

**Note:** UI runs on different port (5173) when separate. Update API calls if needed.

### For Full-Stack Development

**Best approach:**
```bash
# Terminal 1: Backend (Docker)
./scripts/docker-dev.sh

# Terminal 2: UI (local, if doing UI work)
cd ui && npm run dev
```

This gives you:
- ✅ Backend hot reload (agents, configs, API)
- ✅ UI hot reload (components, styles)
- ✅ Fastest iteration cycle

## 🔍 How Hot Reloading Works

### Volume Mounts

The Docker container mounts these directories as volumes:

```bash
-v "$PROJECT_DIR/agents:/app/agents"        # Hot reload ✅
-v "$PROJECT_DIR/configs:/app/configs"        # Hot reload ✅
-v "$PROJECT_DIR/workflows:/app/workflows"   # Hot reload ✅
-v "$PROJECT_DIR/reference:/app/reference"    # Hot reload ✅
-v "$PROJECT_DIR/api.py:/app/api.py"         # Hot reload ✅
```

**What this means:**
- Changes to these files on your host machine
- Are immediately visible inside the container
- FastAPI's `--reload` flag (if enabled) picks up Python changes
- No rebuild needed!

### Pre-built UI

The UI is built during Docker image creation:
```dockerfile
# UI is built into static files
COPY --from=ui-builder /app/ui/dist ./ui/dist
```

**What this means:**
- UI is compiled into static files
- Changes to source files don't affect the built files
- Need to rebuild image to see UI changes

## 📝 Quick Reference

| Change Type | Hot Reload? | Action Needed |
|------------|------------|---------------|
| Modify API endpoint | ✅ Yes | Just save file |
| Add Python module | ✅ Yes | Just save file |
| Edit business logic | ✅ Yes | Just save file |
| New agent file | ✅ Yes | Just save file (if using agents) |
| Edit agent prompt | ✅ Yes | Just save file (if using agents) |
| Update config files | ✅ Yes | Just save file (if using agents) |
| Add reference data | ✅ Yes | Just add files (if using agents) |
| Change UI component | ❌ No | Rebuild with `--build` |
| Add npm package | ❌ No | Rebuild with `--build` |
| Add Python package | ❌ No | Rebuild with `--build` |
| Modify Dockerfile | ❌ No | Rebuild with `--build` |

## 🐛 Troubleshooting

### Changes Not Reflecting

**Backend changes not working:**
- Check if container is running: `docker ps`
- Verify file was saved
- Check container logs: `docker logs agent-chat-dev`
- Try restarting container: `./scripts/docker-dev.sh`

**UI changes not working:**
- Did you rebuild? Run: `./scripts/docker-dev.sh --build`
- Check if UI files are in `ui/src/` (not `ui/dist/`)
- Verify build succeeded (check for errors)

### Need to Force Rebuild

```bash
# Stop container
docker stop agent-chat-dev

# Remove old image (optional, forces full rebuild)
docker rmi agent-chat

# Rebuild and start
./scripts/docker-dev.sh --build
```

### Check What's Mounted

```bash
# See volume mounts
docker inspect agent-chat-dev | grep -A 10 Mounts
```

## 💡 Pro Tips

1. **For agent development**: Use Docker - hot reload is perfect
2. **For UI development**: Consider running UI separately for faster iteration
3. **For both**: Run backend in Docker, UI locally
4. **Before deploying**: Always rebuild with `--build` to test production build
5. **Check logs**: `docker logs -f agent-chat-dev` to see what's happening

## 🎯 Summary

- **Backend changes** (API, Python modules, agents, configs) = Hot reload ✅
- **UI changes** = Rebuild required ⚠️
- **Dependencies** = Rebuild required ⚠️
- **Fastest workflow** = Backend in Docker, UI locally (if doing UI work)
- **Works for any webapp** = Generic FastAPI + React template
