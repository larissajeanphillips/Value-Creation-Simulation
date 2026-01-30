# When Do You Need to Rebuild? Quick Answer

**Short answer: Usually NO for backend, YES for UI (but there's a better way).**

## 🎯 Quick Decision Tree

```
Are you editing...
├─ Python files (api.py, agents, business logic)?
│  └─ ❌ NO REBUILD - Hot reloads automatically!
│
├─ React UI components (ui/src/components/)?
│  ├─ Option 1: Rebuild with --build flag ⚠️ (slower)
│  └─ Option 2: Run UI separately ✅ (instant reload, recommended)
│
├─ Adding npm packages (ui/package.json)?
│  └─ ✅ YES - Rebuild needed
│
└─ Adding Python packages (requirements.txt)?
   └─ ✅ YES - Rebuild needed
```

## ✅ No Rebuild Needed (Hot Reloads)

These changes apply **immediately** - just save and refresh:

- ✅ **API endpoints** (`api.py`) - Edit, save, test immediately
- ✅ **Python modules** (any `.py` files) - Add new files, edit existing
- ✅ **Agent files** (`agents/*.py`) - If using agent framework
- ✅ **Config files** (`configs/*.yaml`, `configs/prompts/*.txt`) - If using agents
- ✅ **Business logic** - Any Python code you write

**How it works:** Volume mounts + uvicorn `--reload` flag = instant changes

## ⚠️ Rebuild Needed

These require rebuilding the Docker image:

- ⚠️ **UI components** (`ui/src/components/`) - React changes
- ⚠️ **UI styles** (`ui/src/*.css`) - CSS changes  
- ⚠️ **UI config** (`ui/tailwind.config.js`, `ui/vite.config.ts`)
- ⚠️ **New npm packages** (`ui/package.json`)
- ⚠️ **New Python packages** (`requirements.txt`)
- ⚠️ **Dockerfile changes**

**Rebuild command:**
```bash
./scripts/docker-dev.sh --build
```

## 🚀 Better Way: Run UI Separately (Recommended for UI Development)

**Instead of rebuilding every time you change UI:**

```bash
# Terminal 1: Backend in Docker (hot reloads Python)
./scripts/docker-dev.sh

# Terminal 2: UI locally (instant React hot reload)
cd ui
npm install  # First time only
npm run dev  # Starts on http://localhost:5173
```

**Benefits:**
- ✅ UI changes reload **instantly** (no rebuild wait)
- ✅ Backend still hot reloads Python changes
- ✅ Fastest development cycle
- ✅ Best of both worlds

**Note:** UI runs on port 5173 when separate. Update API calls if needed, or proxy through backend.

## 📊 Development Scenarios

### Scenario 1: Building Backend API

**What you're doing:** Writing API endpoints, business logic, database code

**Rebuild needed?** ❌ **NO**

**Workflow:**
```bash
# Start once
./scripts/docker-dev.sh

# Then just edit Python files - changes apply immediately!
# No rebuilds, no restarts, just save and test
```

### Scenario 2: Building UI Components

**What you're doing:** Creating React components, styling, UI logic

**Option A: Rebuild each time** ⚠️
```bash
# Edit UI files
# Rebuild when done
./scripts/docker-dev.sh --build
# Wait 1-2 minutes for rebuild
```

**Option B: Run UI separately** ✅ **RECOMMENDED**
```bash
# Terminal 1: Backend
./scripts/docker-dev.sh

# Terminal 2: UI (instant reload)
cd ui && npm run dev
# Changes reload instantly - no rebuild!
```

### Scenario 3: Full-Stack Development

**What you're doing:** Building both backend and frontend

**Best approach:**
```bash
# Terminal 1: Backend (Docker)
./scripts/docker-dev.sh

# Terminal 2: UI (local)
cd ui && npm run dev
```

**Result:**
- Backend changes → Hot reload ✅
- UI changes → Instant reload ✅
- Fastest iteration possible ✅

### Scenario 4: Adding Dependencies

**What you're doing:** Installing new packages

**Python packages:**
```bash
# 1. Add to requirements.txt
echo "new-package==1.0.0" >> requirements.txt

# 2. Rebuild (required)
./scripts/docker-dev.sh --build
```

**npm packages:**
```bash
# 1. Add package
cd ui && npm install new-package

# 2. Rebuild (required)
cd .. && ./scripts/docker-dev.sh --build

# OR run UI separately (no rebuild needed)
cd ui && npm run dev
```

## 💡 Pro Tips

1. **For backend work:** Use Docker - hot reload is perfect, no rebuilds needed
2. **For UI work:** Run UI separately - instant reload, much faster
3. **For both:** Run backend in Docker + UI locally = fastest workflow
4. **Before deploying:** Always rebuild with `--build` to test production build
5. **Check what's mounted:** `docker inspect agent-chat-dev | grep Mounts`

## 🔍 How to Check If Hot Reload Is Working

**Backend (Python):**
1. Edit `api.py`
2. Save file
3. Check container logs: `docker logs -f agent-chat-dev`
4. Should see: `INFO: Detected file change in 'api.py'. Reloading...`

**Frontend (React):**
- If running separately: Changes appear instantly in browser
- If in Docker: Need to rebuild to see changes

## 📝 Summary Table

| What You're Building | Rebuild? | Better Option |
|---------------------|----------|---------------|
| Backend API | ❌ No | Docker (hot reload) |
| Python modules | ❌ No | Docker (hot reload) |
| Agents/Configs | ❌ No | Docker (hot reload) |
| UI components | ⚠️ Yes | Run UI separately ✅ |
| UI styles | ⚠️ Yes | Run UI separately ✅ |
| Add npm package | ⚠️ Yes | Run UI separately ✅ |
| Add Python package | ✅ Yes | Rebuild required |

## 🎯 Bottom Line

**Most of the time, you DON'T need to rebuild!**

- **Backend development:** No rebuilds - hot reload works great
- **UI development:** Run UI separately - no rebuilds needed
- **Only rebuild when:** Adding dependencies or testing production build

The Docker setup is optimized for backend development with hot reloading. For UI work, running it separately gives you the fastest development experience.
