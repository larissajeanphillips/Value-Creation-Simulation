# Generic Webapp Starter Template

This is a **generic FastAPI + React webapp starter** that works for any type of application. The agent framework is just one example - you can build anything!

**🎯 Perfect for Windows users** - Docker eliminates the need for elevated permissions, Node.js installation, or running build tools like esbuild locally. Everything runs in Docker containers!

## What This Template Provides

- ✅ **FastAPI Backend** (Python) - Build any API you need
- ✅ **React Frontend** (TypeScript + Tailwind) - Modern UI framework
- ✅ **Docker Setup** - One command to run everything
- ✅ **Hot Reloading** - Fast development iteration
- ✅ **Production Ready** - Multi-stage Docker build
- ✅ **Deployment Ready** - Kubernetes manifests included

## Quick Start (Any Webapp)

```bash
# Windows: Use Git Bash or PowerShell
# Mac/Linux: Use terminal

# 1. Configure environment (if needed)
cd deployer-apps/<instance-name>/src
cp .env.example .env  # Windows: copy .env.example .env
# Edit .env with any credentials your app needs

# 2. Start the app
./scripts/docker-dev.sh  # Windows: bash scripts/docker-dev.sh

# 3. Open http://localhost:3000
```

**That's it!** Works for any webapp type.

**Windows users:** No Node.js, Python, or elevated permissions needed! Docker handles everything. See [WINDOWS_SETUP.md](./WINDOWS_SETUP.md) for details.

## What You Can Build

### Option 1: Generic Webapp (No Agents)

Replace `api.py` with your own FastAPI app:

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

@app.get("/api/hello")
async def hello():
    return {"message": "Hello from my webapp!"}

# Serve React UI
app.mount("/", StaticFiles(directory="ui/dist"), name="static")
```

**Hot reloads:** ✅ Python files, ✅ React components (with rebuild)

### Option 2: Agent-Based Webapp (Current Example)

Use the included agent framework for AI-powered applications.

**Hot reloads:** ✅ Agents, ✅ Prompts, ✅ Configs, ✅ API

### Option 3: Custom Backend + React Frontend

Build any backend logic you need:
- REST APIs
- WebSocket servers
- Data processing
- Integrations
- Anything!

## Development Workflow

### Backend Changes (Python)

**Hot reloads automatically - NO rebuild needed:**
- ✅ API endpoints (`api.py`) - Edit, save, test immediately
- ✅ Business logic (any Python files) - Instant changes
- ✅ Python modules - Add new files, edit existing

**Rebuild needed only for:**
- ⚠️ New Python packages (`requirements.txt`)

### Frontend Changes (React)

**Two options:**

**Option 1: Rebuild** ⚠️ (requires rebuild each time)
```bash
./scripts/docker-dev.sh --build
```

**Option 2: Run UI Separately** ✅ **RECOMMENDED** (instant reload, no rebuilds!)
```bash
# Terminal 1: Backend (Docker)
./scripts/docker-dev.sh

# Terminal 2: UI (local, instant reload)
cd ui && npm run dev
```

**Benefits of Option 2:**
- ✅ UI changes reload instantly (no rebuild wait)
- ✅ Backend still hot reloads
- ✅ Fastest development cycle
- ✅ No rebuilds needed for UI work

**See [REBUILD_GUIDE.md](./REBUILD_GUIDE.md) for complete guide.**

## Project Structure

```
src/
├── api.py              # Your FastAPI backend (replace with your app)
├── ui/                 # React frontend
│   ├── src/
│   │   ├── components/ # Your React components
│   │   ├── services/   # API clients
│   │   └── ...
│   └── ...
├── requirements.txt    # Python dependencies
├── Dockerfile         # Multi-stage build
└── scripts/
    └── docker-dev.sh  # Development script
```

## Customizing for Your Webapp

### 1. Replace Backend Logic

Edit `api.py` to build your application:

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.post("/api/items")
async def create_item(item: Item):
    # Your business logic here
    return {"id": 1, **item.dict()}
```

### 2. Customize Frontend

Edit React components in `ui/src/components/`:
- Build your UI
- Connect to your API
- Use Tailwind for styling

### 3. Add Dependencies

**Python packages:**
```bash
# Add to requirements.txt
pandas==2.0.0
requests==2.31.0

# Rebuild
./scripts/docker-dev.sh --build
```

**npm packages:**
```bash
cd ui
npm install axios
npm install some-package

# Rebuild
cd ..
./scripts/docker-dev.sh --build
```

## Docker Setup Explained

The Docker setup is **completely generic**:

1. **Builds React UI** → Static files in `ui/dist/`
2. **Installs Python deps** → From `requirements.txt`
3. **Copies your code** → Any Python files you add
4. **Serves everything** → FastAPI serves UI + API

**Volume mounts for development:**
- Your Python files → Hot reload ✅
- UI source → Requires rebuild ⚠️

## Examples of What You Can Build

- **Dashboard Apps** - Data visualization, analytics
- **CRUD Applications** - Admin panels, content management
- **API Services** - Microservices, integrations
- **Real-time Apps** - WebSocket-based applications
- **AI Applications** - Using the included agent framework
- **Data Processing** - ETL, reporting, analysis
- **Custom Business Logic** - Any domain-specific app

## Removing Agent Framework (If Not Needed)

If you don't need the agent framework:

1. **Remove agent-specific code from `api.py`**
2. **Delete agent directories** (optional):
   - `agents/`
   - `configs/`
   - `workflows/`
   - `llm/`
   - `reference/`
3. **Update `requirements.txt`** - Remove agent-specific packages
4. **Keep the structure** - Docker, UI, basic FastAPI setup

The Docker setup works the same regardless!

## Key Points

- ✅ **Docker setup is generic** - Works for any FastAPI + React app
- ✅ **Hot reloading works** - Backend changes apply immediately
- ✅ **UI requires rebuild** - But you can run UI separately for faster dev
- ✅ **Production ready** - Multi-stage build, optimized images
- ✅ **Deployment ready** - Kubernetes manifests included

## Next Steps

1. **Start building** - Edit `api.py` and `ui/src/` for your app
2. **See DEVELOPMENT_WORKFLOW.md** - Detailed guide on how changes work
3. **Deploy** - See `STARTER_TEMPLATE_SETUP.md` for deployment

The agent framework is just one example - build whatever you need!
