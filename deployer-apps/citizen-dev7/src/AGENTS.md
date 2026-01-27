# Agent Workspace – Quick Guide

This is a minimal, skimmable guide for Cursor and non-technical experts. All detailed, step-by-step instructions live in `.cursor/rules/`.

## What to Edit vs. Not

- Do not modify: `agents/base.py`, `llm/client.py`, `workflows/workflow.py` (orchestrator logic only if instructed), `scripts/run_workflow.py`, `scripts/model_catalog.py`.
- Customize: `agents/*.py`, `configs/prompts/*.system.txt`, `configs/routing.yaml`, `configs/settings.yaml`, `reference/{agent_name}/`.

## How It Runs (at a glance)

```
User Objective (Cursor chat or CLI)
  ↓
Routing reads configs/routing.yaml
  ↓
Agent selected (keywords/descriptions)
  ↓
Agent runs with its system prompt + AI Gateway
  ↓
Outputs written to data/outputs/
```

## Agent Factory (pattern to follow)

```python
def create_{agent_name}(settings: Settings, system_prompt: str) -> BaseAgent:
    model_client = get_model_client(settings, "{agent_name}_model")
    spec = AgentSpec(
        name="{agent_name}",
        system_prompt=system_prompt,
        model_name=settings.defaults.get("{agent_name}_model", "primary"),
        tools=None,
    )
    return BaseAgent(spec, model_client)
```

## Where the Knowledge Goes

- System prompts: `configs/prompts/{agent_name}.system.txt` 
- Reference data: `reference/{agent_name}/` (the only runtime input source).

## Routing

- Configure in `configs/routing.yaml` with `name`, `keywords`, `description`.
- If nothing matches, framework falls back to `catchall`.

## Environment Bootstrap (Cursor must do this)

- `.env` with:
  - `AI_GATEWAY_INSTANCE_ID=...`
  - `AI_GATEWAY_API_KEY=...`
- Create venv and install deps:
  - macOS/Linux: `python -m venv .venv && .venv/bin/pip install -r requirements.txt`
  - Windows: `python -m venv .venv && .venv\Scripts\pip install -r requirements.txt`
- Details and exact steps: see `.cursor/rules/setup-workflow.md` (Steps 6–7).

## Testing from Cursor Chat

- Specific agent (bypass routing): `Test the {agent_name} agent with: {objective}`
- Full workflow (with routing): `Test the full workflow with: {objective}`
- Execution details: `.cursor/rules/testing-guide.md`

## Hard Constraints

1) All LLM calls go through AI Gateway (configure in `configs/settings.yaml`; OpenAI-compatible requires `/v1` suffix in base_url).  
2) Follow the factory pattern above for every agent; register each agent in `routing.yaml` and `settings.yaml`.  
3) Do not commit secrets; only `.env` holds credentials (gitignored).  
4) Reference data is the only runtime input source.

## Where to Find the Details

- Generation: `.cursor/rules/setup-workflow.md`
- Agent templates: `.cursor/rules/agent-generation-guide.md`
- Testing: `.cursor/rules/testing-guide.md`
