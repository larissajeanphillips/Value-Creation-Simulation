# Technical Documentation

This document is for developers who want to understand the architecture, customize the codebase, or deploy the application.

**For non-technical users:** See [README.md](./README.md) instead.

---

## Architecture Overview

This project is a full-stack web application with an optional AI agent framework:

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│                localhost:3000                       │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│              React Frontend (ui/)                   │
│         Vite + TypeScript + Tailwind                │
└─────────────────┬───────────────────────────────────┘
                  │ HTTP/WebSocket
┌─────────────────▼───────────────────────────────────┐
│             FastAPI Backend (api.py)                │
│                  Python 3.11+                       │
└─────────────────┬───────────────────────────────────┘
                  │ (optional)
┌─────────────────▼───────────────────────────────────┐
│            Agent Framework (agents/)                │
│     Multi-agent routing + AI Gateway                │
└─────────────────────────────────────────────────────┘
```

---

## Project Structure

```
src/
├── api.py                    # FastAPI backend entry point
├── Dockerfile                # Multi-stage Docker build
├── requirements.txt          # Python dependencies
│
├── ui/                       # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API client
│   │   └── App.tsx           # Main app
│   ├── package.json
│   └── vite.config.ts
│
├── agents/                   # AI agent implementations
│   ├── base.py              # Base classes (DO NOT MODIFY)
│   ├── catchall.py          # Fallback agent
│   └── *.py                 # Domain-specific agents
│
├── configs/
│   ├── prompts/             # Agent system prompts
│   ├── routing.yaml         # Agent routing rules
│   └── settings.yaml        # AI Gateway configuration
│
├── workflows/
│   └── workflow.py          # Agent orchestration
│
├── llm/
│   └── client.py            # LLM abstraction layer
│
├── reference/               # Domain reference data
│   └── {agent_name}/        # Per-agent reference files
│
├── scripts/
│   ├── docker-dev.sh        # Docker development script
│   ├── run_workflow.py      # CLI for testing agents
│   └── model_catalog.py     # AI Gateway model explorer
│
└── data/
    └── outputs/             # Generated outputs
```

---

## Running the Application

### Docker (Recommended)

```bash
# Start with hot reloading
./scripts/docker-dev.sh

# Rebuild image (after dependency changes)
./scripts/docker-dev.sh --build
```

### Local Development

```bash
# Terminal 1: Backend
uvicorn api:app --reload --port 3000

# Terminal 2: Frontend
cd ui && npm install && npm run dev
```

---

## Hot Reloading

### Changes that apply immediately (no rebuild):
- `api.py` - Backend endpoints
- `agents/*.py` - Agent implementations
- `configs/prompts/*.txt` - Agent prompts
- `configs/routing.yaml` - Routing rules
- `configs/settings.yaml` - Settings
- `reference/` - Reference data

### Changes that require rebuild:
- `ui/src/` - React components
- `ui/package.json` - NPM dependencies
- `requirements.txt` - Python dependencies
- `Dockerfile` - Docker configuration

---

## Agent Framework

### Overview

The agent framework provides multi-agent routing for AI-powered features:

1. **Routing**: User message → keyword/LLM analysis → select agent
2. **Execution**: Selected agent + reference data → LLM → response
3. **Output**: Structured response returned to user

### Creating Agents

Agents are created via the `/setup` wizard or manually:

```python
# agents/my_agent.py
from agents.base import BaseAgent, AgentSpec

def create_my_agent(settings):
    return BaseAgent(
        spec=AgentSpec(
            name="my_agent",
            prompt_file="configs/prompts/my_agent.system.txt"
        ),
        settings=settings
    )
```

### Routing Configuration

```yaml
# configs/routing.yaml
routing:
  agents:
    - name: my_agent
      keywords: ["keyword1", "keyword2"]
      description: "When to use this agent"
    
    - name: catchall
      keywords: []  # fallback
      description: "Default agent"
```

### Reference Data

Place domain-specific files in `reference/{agent_name}/`:
- JSON, CSV, TXT, MD files
- Automatically loaded and provided to agent as context
- Agent can reference this data in responses

---

## AI Gateway Integration

### Configuration

```yaml
# configs/settings.yaml
ai_gateway:
  base_url: "https://openai.prod.ai-gateway.quantumblack.com"
  instance_id: "${AI_GATEWAY_INSTANCE_ID}"
  api_key: "${AI_GATEWAY_API_KEY}"

models:
  primary:
    provider: openai_compatible
    model: "gpt-4o"
    temperature: 0.2
```

### Environment Variables

```bash
# .env
AI_GATEWAY_INSTANCE_ID=your_instance_id
AI_GATEWAY_API_KEY=clientID:clientSecret
```

### Available Providers

| Provider | Base URL Pattern | Notes |
|----------|-----------------|-------|
| openai | `https://openai.prod.ai-gateway.quantumblack.com/{instance}/v1` | Requires `/v1` suffix |
| anthropic | `https://anthropic.prod.ai-gateway.quantumblack.com/{instance}` | Claude models |
| aws-bedrock | `https://aws-bedrock.prod.ai-gateway.quantumblack.com/{instance}` | AWS models |
| azure | `https://azure.prod.ai-gateway.quantumblack.com/{instance}` | Azure OpenAI |
| vertexai | `https://vertexai.prod.ai-gateway.quantumblack.com/{instance}` | Google models |

### Exploring Models

```bash
python scripts/model_catalog.py \
  --instance-id "your_instance_id" \
  --api-key "your_api_key" \
  --suggest
```

---

## API Reference

### Backend Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/chat` | POST | Send message to agent |
| `/agents` | GET | List available agents |

### Chat Endpoint

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Your question here"}'
```

Response:
```json
{
  "response": "Agent response",
  "agent": "selected_agent_name"
}
```

---

## Testing

### Test Specific Agent

```bash
python scripts/run_workflow.py \
  --agent "agent_name" \
  --objective "Test objective" \
  --output-path "data/outputs/test.md"
```

### Test Full Workflow (with routing)

```bash
python scripts/run_workflow.py \
  --objective "Test objective" \
  --output-path "data/outputs/test.md"
```

---

## Deployment

This project uses the Deployer K8s PaaS service. See the repository root for:

- `.github/workflows/` - CI/CD pipelines
- `deployer-apps/*/dev-us-east-1/` - Environment configuration
- `STARTER_TEMPLATE_SETUP.md` - Deployment guide

### Key Files

| File | Purpose |
|------|---------|
| `iac/main.tf` | Infrastructure (databases, S3, etc.) |
| `manifests/values.yaml` | Helm values (env vars, replicas) |

---

## Customization

### Safe to Modify

- `agents/*.py` (except base.py)
- `configs/prompts/*.txt`
- `configs/routing.yaml`
- `configs/settings.yaml`
- `reference/`
- `api.py`
- `ui/src/components/`
- `ui/src/services/api.ts`

### Do Not Modify (Framework Files)

- `agents/base.py`
- `llm/client.py`
- `scripts/run_workflow.py`
- `scripts/model_catalog.py`
- `workflows/workflow.py` (core logic only)

---

## Troubleshooting

### "AI Gateway authentication failed"
- Check `AI_GATEWAY_INSTANCE_ID` and `AI_GATEWAY_API_KEY` in `.env`
- Verify credentials are valid in Platform McKinsey

### "Agent not found"
- Check agent name matches `configs/routing.yaml`
- Ensure agent file exists in `agents/`

### "Model not available"
- Run `python scripts/model_catalog.py` to see available models
- Update `configs/settings.yaml` with valid model name

### "Port 3000 in use"
- Stop other applications using port 3000
- Or modify port in `docker-dev.sh`

---

## Resources

- [AGENTS.md](./AGENTS.md) - Detailed agent architecture
- [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md) - Development practices
- [REBUILD_GUIDE.md](./REBUILD_GUIDE.md) - When to rebuild Docker
- [WINDOWS_SETUP.md](./WINDOWS_SETUP.md) - Windows-specific guidance
