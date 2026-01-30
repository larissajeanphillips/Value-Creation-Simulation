# Citizen Dev7 - Multi-Agent Chat Application Starter

A comprehensive starter template for building modern React + FastAPI applications with Docker-first development. **No Node.js, Python, or build tools needed locally** - everything runs in Docker!

## 🚀 Quick Start (Docker - Recommended)

**No dependencies needed except Docker Desktop!**

```bash
# 1. Navigate to application source
cd deployer-apps/citizen-dev7/src

# 2. Configure credentials (if using agents)
cp .env.example .env
# Edit .env with your AI Gateway credentials

# 3. Start the app
./scripts/docker-dev.sh

# 4. Open http://localhost:3000
```

**That's it!** The Docker setup includes:
- ✅ Pre-built React UI (no Node.js/esbuild needed locally)
- ✅ Python backend with all dependencies (no Python setup needed)
- ✅ Hot reloading for backend code (agents, configs, API)
- ✅ Everything runs in one container
- ✅ **No elevated permissions required** - Docker handles all build tools
- ✅ Works the same on macOS, Windows, Linux

## What's Included

| Folder | Description |
|--------|-------------|
| `.cursor/rules/` | Cursor AI rules for consistent code generation |
| `.cursor/commands/` | Custom Cursor commands (`/launch`, `/commit`, etc.) |
| `code-templates/` | React components, hooks, Express routes, FastAPI patterns |
| `docs-templates/` | Documentation structure templates (architecture, backlog, changelog) |
| `config-templates/` | Frontend and backend configuration templates |
| `ui/` | Style guide and design tokens |
| `deployer-apps/citizen-dev7/src/` | Application source code |
| `deployer-apps/citizen-dev7/src/ui/` | React frontend (built in Docker) |

## Project Structure

```
citizen-dev7/
├── .cursor/
│   ├── rules/           # Cursor AI rules (.mdc files)
│   └── commands/        # Custom Cursor commands
├── .cursorrules         # Bootstrap rules for Cursor
├── code-templates/      # Component, hook, store, API templates
├── config-templates/    # Frontend/backend configs
├── docs-templates/      # Documentation templates
├── ui/                  # Style guide, design tokens
├── deployer-apps/
│   └── citizen-dev7/
│       ├── src/         # Application source
│       │   ├── ui/       # React frontend
│       │   ├── agents/  # Multi-agent framework
│       │   ├── api.py   # FastAPI backend
│       │   └── scripts/ # Docker dev script
│       └── dev-us-east-1/ # K8s deployment configs
└── README.md
```

## Tech Stack

### Frontend
- **React 18** + TypeScript
- **Vite** (built in Docker, no local install needed)
- **Tailwind CSS** for styling
- **Zustand** for state management (if needed)

### Backend
- **Python 3.12** + FastAPI
- **Multi-agent framework** for domain-specific AI agents
- **AI Gateway** integration for enterprise LLM access

### Development
- **Docker** - Primary development environment
  - **No local Node.js needed** - UI builds in Docker
  - **No local Python needed** - Backend runs in Docker
  - **No esbuild/build tools needed** - Everything in Docker
- **Hot reload** - Backend changes reflect immediately
- **Kubernetes** - Production deployment via Deployer K8s PaaS

## Key Features

### 🐳 Docker-First Development

**The core philosophy**: No local dependencies required!

- **React UI**: Built in Docker using Node.js 22 Alpine
- **Python Backend**: Runs in Docker with all dependencies
- **Build Tools**: esbuild, npm, pip - all in Docker
- **Hot Reload**: Backend code changes reflect immediately
- **One Command**: `./scripts/docker-dev.sh` starts everything

**Benefits:**
- ✅ No Node.js installation needed
- ✅ No Python installation needed
- ✅ No build tool setup (esbuild, etc.)
- ✅ No permission issues (Windows users especially benefit)
- ✅ Consistent environment across all machines
- ✅ Easy onboarding - just Docker Desktop

### 🤖 Multi-Agent Framework

Built-in framework for creating domain-specific AI agents:

- **Agent System**: Specialized agents for different tasks
- **Routing**: Automatic agent selection based on user objectives
- **Reference Data**: Domain-specific knowledge integration
- **AI Gateway**: Enterprise LLM access via McKinsey's AI Gateway

See `deployer-apps/citizen-dev7/src/SETUP.md` to generate your own agents.

### 📚 Templates & Guides

- **Code Templates**: React components, hooks, Zustand stores, API routes
- **Documentation Templates**: Architecture docs, backlog, changelog, lessons learned
- **Config Templates**: Tailwind, Vite, TypeScript configs
- **Style Guide**: Design tokens, component patterns, UI guidelines

## Development Workflow

### Docker Development (Recommended)

```bash
cd deployer-apps/citizen-dev7/src

# Start with hot reload
./scripts/docker-dev.sh

# Rebuild image (if UI changes)
./scripts/docker-dev.sh --build
```

**What gets hot reloaded:**
- ✅ `api.py` - API endpoints
- ✅ `agents/` - Agent implementations
- ✅ `configs/` - Configuration files
- ✅ `workflows/` - Workflow logic
- ✅ `reference/` - Reference data

**Note:** UI changes require rebuild (`--build` flag)

### Local Development (Optional)

If you want faster UI iteration without Docker:

```bash
# Terminal 1: Backend
cd deployer-apps/citizen-dev7/src
uvicorn api:app --reload --port 3000

# Terminal 2: Frontend (requires Node.js locally)
cd deployer-apps/citizen-dev7/src/ui
npm install
npm run dev
```

## Using with Cursor AI

Cursor AI has access to all the rules in `.cursor/rules/`. Try these prompts:

- "Create a new component following the templates"
- "Generate an API route for user authentication"
- "Add a new Zustand store for user state"
- "Follow the style guide for this component"

### Available Commands

- `/welcome` - Getting started guide
- `/setup` - Docker setup wizard
- `/launch` - Start the application
- `/commit` - Commit changes with Conventional Commits
- `/add-lessons-learned` - Document a solution

## Available Templates

### Code Templates (`code-templates/`)

| Template | Description |
|----------|-------------|
| `COMPONENT_TEMPLATE.tsx` | React component with props, memoization |
| `HOOK_TEMPLATE.ts` | Custom hook with loading/error states |
| `ZUSTAND_STORE_TEMPLATE.ts` | State store with persistence |
| `API_ROUTE_TEMPLATE.ts` | Express route with validation |
| `EXPRESS_SERVER_TEMPLATE.ts` | Express server setup |
| `DATABASE_CLIENT_TEMPLATE.ts` | PostgreSQL client |

### Documentation Templates (`docs-templates/`)

| Template | Description |
|----------|-------------|
| `ARCHITECTURE_TEMPLATE.md` | System architecture docs |
| `BACKLOG_TEMPLATE.md` | Feature backlog |
| `CHANGELOG_TEMPLATE.md` | Version changelog |
| `LESSONS_LEARNED_TEMPLATE.md` | Team learnings |

## Prerequisites

**Required:**
- **Docker Desktop** - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Git** 2.30+

**Optional (only if not using Docker):**
- Node.js 20.x LTS (for local UI development)
- Python 3.12+ (for local backend development)
- Cursor IDE (for AI-assisted development)

## Deployment

This project uses **Deployer K8s PaaS** for production deployment:

- **Automated CI/CD**: GitHub Actions workflows
- **Kubernetes**: Helm charts for deployment
- **Infrastructure**: Terraform for AWS resources (S3, RDS, etc.)

See `STARTER_TEMPLATE_SETUP.md` for deployment instructions.

## Documentation

- **Quick Start**: `deployer-apps/citizen-dev7/src/START_HERE.md`
- **Full Guide**: `deployer-apps/citizen-dev7/src/README.md`
- **Agent Setup**: `deployer-apps/citizen-dev7/src/SETUP.md`
- **Windows Setup**: `deployer-apps/citizen-dev7/src/WINDOWS_SETUP.md`
- **Style Guide**: `ui/STYLE_GUIDE.md`
- **Design Tokens**: `ui/DESIGN_TOKENS.md`

## Version

**Citizen Dev7 Starter v1.0.0**

Created: January 2026

---

## Why Docker-First?

This starter template prioritizes Docker-first development because:

1. **No Local Dependencies**: Developers don't need Node.js, Python, or build tools installed
2. **Consistent Environment**: Same setup works on macOS, Windows, Linux
3. **Easy Onboarding**: New team members just need Docker Desktop
4. **No Permission Issues**: Windows users avoid elevated permission problems
5. **Production Parity**: Development environment matches production (Docker)

The Dockerfile uses multi-stage builds:
- **Stage 1**: Build React UI with Node.js (in Docker)
- **Stage 2**: Install Python dependencies (in Docker)
- **Stage 3**: Runtime with pre-built UI and Python backend

This means you can develop without installing any build tools locally!
