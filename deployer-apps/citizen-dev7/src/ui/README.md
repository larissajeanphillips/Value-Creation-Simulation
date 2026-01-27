# Agent Chat UI

A modern React chat interface for interacting with the Agent Workspace Framework backend.

## Features

- Real-time chat interface with markdown support
- Agent selection (auto-routing or direct agent access)
- Conversation history management
- Beautiful dark theme with glass morphism effects
- Responsive design

## Quick Start

### Prerequisites

- Node.js 18+ 
- The backend API running (see [Backend Setup](#backend-setup))

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The UI will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Backend Setup

The UI expects a backend API with the following endpoints:

### `POST /api/analyze`

Send a message to an agent.

**Request:**
```json
{
  "objective": "Your question or objective",
  "agent": "software_analyzer"  // Optional: bypass routing
}
```

**Response:**
```json
{
  "result": "Agent response in markdown",
  "agent": "software_analyzer"
}
```

### `GET /api/agents`

List available agents.

**Response:**
```json
{
  "agents": ["software_analyzer", "recommendation", "user_prompting", "catchall"]
}
```

### `GET /api/health`

Health check endpoint.

## Sample Backend (FastAPI)

Here's a sample FastAPI backend that wraps the Agent Workspace:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from workflows.workflow import KnowledgeWorkflow
from llm.client import Settings

app = FastAPI()

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

settings = Settings.load("configs/settings.yaml")
workflow = KnowledgeWorkflow(settings)

class AnalyzeRequest(BaseModel):
    objective: str
    agent: str | None = None

@app.post("/api/analyze")
async def analyze(request: AnalyzeRequest):
    result = workflow.run(
        objective=request.objective,
        inputs_dir="reference",
        max_turns=1,
        agent=request.agent
    )
    return {"result": result, "agent": request.agent or "auto"}

@app.get("/api/agents")
async def list_agents():
    return {"agents": [r.name for r in workflow.routing_config]}

@app.get("/api/health")
async def health():
    return {"status": "healthy"}
```

Save as `api.py` in the `src/` directory and run:

```bash
pip install fastapi uvicorn
uvicorn api:app --reload --port 3000
```

## Configuration

### Environment Variables

Create a `.env` file (or `.env.local` for development):

```env
VITE_API_URL=http://localhost:3000/api
```

If not set, the UI defaults to `/api` (works with the Vite proxy in development).

### Vite Proxy

The `vite.config.ts` includes a proxy configuration for development:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

This allows the UI to call `/api/*` endpoints without CORS issues during development.

## Project Structure

```
ui/
├── public/
│   └── agent-icon.svg       # Favicon
├── src/
│   ├── components/
│   │   ├── ChatWindow.tsx   # Main chat area
│   │   ├── InputBar.tsx     # Message input
│   │   ├── MessageBubble.tsx # Individual messages
│   │   ├── Sidebar.tsx      # Conversation list & agent selector
│   │   └── TypingIndicator.tsx
│   ├── services/
│   │   └── api.ts           # Backend API client
│   ├── App.tsx              # Main app component
│   ├── index.css            # Tailwind & custom styles
│   ├── main.tsx             # Entry point
│   └── types.ts             # TypeScript types
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Customization

### Styling

The UI uses Tailwind CSS with a custom theme defined in `tailwind.config.js`:

- **Ocean palette**: Primary blues for interactive elements
- **Coral accent**: Warm accent for user messages
- **Surface colors**: Dark theme backgrounds

### Adding Features

Common customizations:

1. **New agent types**: Update `SAMPLE_AGENTS` in `App.tsx` or implement dynamic loading
2. **Message actions**: Add copy/edit buttons in `MessageBubble.tsx`
3. **File uploads**: Extend `InputBar.tsx` with file input
4. **Streaming responses**: Modify `api.ts` to use Server-Sent Events

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Markdown** - Message rendering
