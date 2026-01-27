# Agent Workspace Framework

**A generalized multi-agent framework for domain experts to create industry-specific agent systems using Cursor IDE.**

This framework enables non-technical domain experts to build specialized AI agent systems for their industry without deep coding knowledge. Simply answer questions about your domain, and Cursor will generate the necessary agents, prompts, and configurations.

## What This Is

- **Framework**: Reusable infrastructure for multi-agent systems
- **Example**: Working automotive cost optimization implementation (replace with your domain)
- **Cursor-Powered**: Uses Cursor IDE to generate industry-specific code from simple questionnaires
- **AI Gateway Ready**: Integrated with McKinsey's AI Gateway for enterprise LLM access

## Current Example

This repository includes a complete **automotive cost optimization** example with:
- Specialized agent for electrical architecture
- Anonymized reference data from vehicle designs
- Routing system that selects appropriate agents
- System prompts with automotive domain knowledge

**All automotive-specific code is clearly marked as "EXAMPLE" and should be replaced with your own industry content.**

## Getting Started

### Prerequisites

Before you begin, you'll need:

1. **Cursor IDE**
   - Download and install from: [McKinsey Global Help Desk - Cursor](https://mckinsey.service-now.com/ghd?id=mck_app_cat_item&utm_medium=web&utm_source=ghd_website&utm_content=ai_search_result&sys_id=1a9b2b55c38c9650cd5777f4e40131c9&table=pc_software_cat_item&searchTerm=cursor)
   - Follow the installation instructions for your platform

2. **AI Gateway Credentials**
   - Go to [Platform McKinsey](https://platform.mckinsey.com)
   - Navigate to AI Gateway service
   - Copy your **Instance ID** and **API Key** (format: `clientID:clientSecret`)
   - Keep these handy for Step 2 below

### Setup Steps

#### Step 1: Get This Repository

Choose one option:

**Option A: Clone the repository**
```bash
git clone <your-repo-url>
cd agent-workspace
```

**Option B: Download as ZIP**
- Click the green "Code" button → Download ZIP
- Extract the ZIP file to your desired location
- Navigate to the extracted folder

#### Step 2: Fill Out SETUP.md

1. Open `SETUP.md` in any text editor
2. Answer the questions about:
   - Your industry and domain
   - 3-5 agent specializations you need
   - Your AI Gateway credentials (from Prerequisites above)
   - Model selection preferences
3. **Save the file** (important!)

#### Step 3: Generate Your Agents

1. Open the `agent-workspace` folder in Cursor IDE
2. Open Cursor Chat (click the chat icon in the bottom right, or press `Cmd/Ctrl + L`)
3. In the chat, type:
   ```
   I've filled out SETUP.md. Please generate my industry-specific agents.
   Refer to AGENTS.md and the cursor rules.
   ```
4. Press Enter and wait for Cursor to generate everything

**Cursor will automatically:**
- Read your SETUP.md responses
- Create agent files and system prompts
- Configure routing rules
- Set up AI Gateway integration
- Create a `.env` file with your credentials

#### Step 4: Review Generated Prompts

After Cursor generates your agents, review what was created:

1. **Check the agent files** in `agents/` - make sure there is one file per expected agent
2. **Review system prompts** in `configs/prompts/` - review the wording and requirements, this defines how each agent behaves
3. **Review routing rules** in `configs/routing.yaml` - review the keywords and descriptions, this controls which agent handles which user objectives

**Make any adjustments directly in these files**

#### Step 5: Test Your Agents

Now test your agents directly in Cursor chat:

**Test a specific agent:**
```
Test the [agent_name] agent with: [your test objective]
```

**Test full workflow (with routing):**
```
Test the full workflow with: [your test objective]
```

**Example:**
```
Test the compliance_review agent with: Review glucose monitoring device for FDA compliance
```

#### Step 6: Add Reference Data (Optional but Recommended)

Enhance your agents by adding domain-specific reference files:

1. Create folders under `reference/` for each agent: `reference/{agent_name}/`
2. Add relevant files:
   - Specifications, standards, regulations
   - Cost tables, design templates
   - Best practices documents
   - Example analyses

Your agents will automatically access this data when running.


## Project Structure

```
agent-workspace/
├── AGENTS.md                    # Guide for AI agents (Cursor reads this)
├── SETUP.md                     # Questionnaire for experts to fill out
├── README.md                    # This file
│
├── .cursor/rules/               # Cursor-specific generation instructions
│   ├── setup-workflow.md        # How Cursor processes SETUP.md
│   ├── agent-generation-guide.md # Templates for creating agents
│   └── testing-guide.md         # How Cursor handles testing commands
│
├── agents/                      # Agent definitions
│   ├── base.py                 # [FRAMEWORK] Base classes - DO NOT MODIFY
│   ├── catchall.py             # General-purpose fallback agent
│   ├── software_analyzer.py    # Code analysis agent
│   ├── recommendation.py       # Optimization recommendations agent
│   └── user_prompting.py       # Clarification questions agent
│
├── configs/
│   ├── routing.yaml            # Agent selection rules
│   ├── settings.yaml           # AI Gateway config and models
│   └── prompts/                # Agent system prompts
│       ├── catchall.system.txt
│       ├── software_analyzer.system.txt
│       ├── recommendation.system.txt
│       └── user_prompting.system.txt
│
├── workflows/
│   └── workflow.py             # [FRAMEWORK] Orchestration logic
│
├── llm/
│   └── client.py               # [FRAMEWORK] LLM abstraction layer
│
├── scripts/
│   ├── run_workflow.py         # [FRAMEWORK] CLI entry point
│   └── model_catalog.py        # [FRAMEWORK] AI Gateway model fetcher
│
├── reference/                   # Domain reference data (add your own)
│
└── data/
    └── outputs/                # Generated outputs
```

## Configuration Files

### configs/routing.yaml
Defines how objectives are routed to agents:
```yaml
routing:
  agents:
    - name: your_agent
      keywords: ["keyword1", "keyword2"]
      description: "When to use this agent"

    - name: catchall
      keywords: []  # fallback
      description: "Default agent"
```

### configs/settings.yaml
AI Gateway and model configuration:
```yaml
ai_gateway:
  base_url: "https://openai.prod.ai-gateway.quantumblack.com"
  instance_id: "${AI_GATEWAY_INSTANCE_ID}"
  api_key: "${AI_GATEWAY_API_KEY}"

models:
  primary:
    provider: openai_compatible
    model: "gpt-5-chat-latest"
    temperature: 0.2

defaults:
  your_agent_model: "primary"
  routing_model: "routing"
```

## AI Gateway Integration

### Getting Your Credentials
1. Go to **Platform McKinsey**
2. Navigate to **AI Gateway service**
3. Copy your:
   - **Instance ID**
   - **API Key** (format: `clientID:clientSecret`)

**Note:** These same credentials work for all AI providers (OpenAI, Anthropic, Cohere, etc.)

### Base URL Pattern
The AI Gateway uses provider-specific URLs with your instance ID:
```
https://{provider}.prod.ai-gateway.quantumblack.com/{instance_id}
```

**Important:** For `openai_compatible` provider, add `/v1` to the end. Other providers don't need it.

Available providers:
- `openai` - OpenAI models (GPT-5, etc.) - **Requires `/v1` suffix**
- `anthropic` - Anthropic/Claude models - No `/v1`
- `aws-bedrock` - AWS Bedrock models - No `/v1`
- `azure` - Azure OpenAI - No `/v1`
- `vertexai` - Google Vertex AI - No `/v1`
- `cohere` - Cohere models - No `/v1`
- `perplexity` - Perplexity models - No `/v1`

### Environment Variables

**When you generate agents, Cursor will automatically:**
1. Create a `.env` file with your credentials from SETUP.md
2. Update `configs/settings.yaml` to reference these environment variables

### Exploring Available Models
```bash
python scripts/model_catalog.py \
  --instance-id "your_instance_id" \
  --api-key "your_api_key" \
  --suggest
```

This shows available models from all providers with costs and recommendations for routing vs. analysis tasks.

## Testing

### Test Specific Agent (Direct)
Bypasses routing to test agent prompt in isolation:
```bash
python scripts/run_workflow.py \
  --agent "your_agent_name" \
  --objective "Your test objective" \
  --output-path "data/outputs/test.md"
```

Or in Cursor chat:
```
"Test the your_agent_name agent with: Your test objective"
```

### Test Full Workflow (With Routing)
Tests routing + agent execution:
```bash
python scripts/run_workflow.py \
  --objective "Your test objective" \
  --output-path "data/outputs/test.md"
```

Or in Cursor chat:
```
"Test the full workflow with: Your test objective"
```

## Example Industries This Can Support

- **Healthcare**: Compliance review, risk analysis, clinical validation
- **Finance**: Risk assessment, regulatory compliance, portfolio analysis
- **Legal**: Contract review, compliance checking, due diligence
- **Manufacturing**: Quality assurance, process optimization, defect analysis
- **Energy**: Safety compliance, environmental impact, cost optimization
- **Pharma**: Regulatory submission, clinical trial analysis, formulation optimization

## How It Works

### 1. Setup Phase
You fill out SETUP.md → Cursor generates:
- Agent files (`agents/{agent_name}.py`)
- System prompts (`configs/prompts/{agent_name}.system.txt`)
- Routing config (`configs/routing.yaml`)
- Settings with your AI Gateway credentials

### 2. Runtime Flow
```
User Objective
     ↓
Routing System (reads routing.yaml)
     ↓
Keyword Match or LLM Selection
     ↓
Selected Agent
     ↓
Loads Reference Data (if any)
     ↓
LLM via AI Gateway
     ↓
Generated Output
```

### 3. Agent Architecture
Each agent:
- Has a factory function (`create_{agent_name}`)
- Uses a system prompt from `configs/prompts/`
- Can access reference data from `reference/{agent_name}/`
- Calls LLM through AI Gateway
- Returns structured recommendations

## Extending and Customizing

### Add a New Agent
1. Update `SETUP.md` with new agent description
2. Tell Cursor: `"Add a new agent for {specialization}"`
3. Cursor will:
   - Create agent file
   - Generate system prompt
   - Update routing.yaml
   - Update workflow.py

### Refine Agent Prompts
1. Test agent with various objectives
2. Identify issues or gaps
3. Edit `configs/prompts/{agent_name}.system.txt`
4. Re-test to validate improvements

### Adjust Routing
- Edit `configs/routing.yaml` to add/remove keywords
- Update agent descriptions to clarify when they should be used
- Test routing with: `"Test the full workflow with: {objective}"`

### Add Reference Data
- Place files in `reference/{agent_name}/`
- Supported formats: JSON, CSV, TXT, MD
- Agent automatically loads and provides to LLM as context

## Integrating Agents into Your Application

Once you've generated and tested your agents, you can integrate them into your backend application or API.

### What to Export

**1. Core Framework Code (Required)**

These files provide the agent infrastructure:
```
llm/
├── __init__.py
└── client.py          # LLM abstraction layer

agents/
├── __init__.py
└── base.py           # BaseAgent class, AgentSpec

workflows/
├── __init__.py
└── workflow.py       # Routing and orchestration logic
```

**2. Your Generated Agents (Required)**

```
agents/
├── catchall.py
├── your_agent_1.py
├── your_agent_2.py
└── ...               # All agents Cursor generated for you
```

**3. Configuration Files (Required)**

```
configs/
├── settings.yaml      # AI Gateway config, model settings
├── routing.yaml       # Routing rules
└── prompts/
    ├── catchall.system.txt
    ├── your_agent_1.system.txt
    └── ...           # All your system prompts
```

**4. Reference Data (Optional)**

```
reference/
└── {agent_name}/     # Your domain-specific reference files
```

**5. Dependencies**

From `requirements.txt`, you'll need:
- `openai`
- `anthropic`
- `pydantic`
- `pyyaml`
- `python-dotenv`

### What NOT to Export

These are CLI/development-specific and not needed in production:
- ❌ `scripts/run_workflow.py` - CLI entry point
- ❌ `scripts/model_catalog.py` - CLI utility
- ❌ `.cursor/` - Cursor IDE instructions
- ❌ `SETUP.md`, `AGENTS.md`, `README.md` - Documentation
- ❌ `.env.example` - Template file

### Integration Approach

**Recommended: Wrap in an API Layer**

Create an API wrapper around the agent workflow:

```python
from fastapi import FastAPI
from workflows.workflow import KnowledgeWorkflow
from llm.client import Settings

app = FastAPI()
settings = Settings.load("configs/settings.yaml")
workflow = KnowledgeWorkflow(settings)

@app.post("/analyze")
async def analyze(objective: str, agent: str = None):
    """
    Run agent workflow
    - objective: User's request
    - agent: Optional - bypass routing and use specific agent
    """
    result = workflow.run(
        objective=objective,
        inputs_dir="reference",
        max_turns=1,
        agent=agent
    )
    return {"result": result}

@app.get("/agents")
async def list_agents():
    """List available agents"""
    return {"agents": [r.name for r in workflow.routing_config]}
```

**Key Integration Points:**

1. **Initialize once at startup**
   - Load settings and create workflow instance
   - Don't recreate on every request

2. **Environment variables**
   - Ensure `.env` is loaded or variables are set in your deployment
   - AI Gateway credentials must be available

3. **Reference data path**
   - Update `inputs_dir` to point to your reference data location
   - Can be local filesystem or cloud storage

4. **Error handling**
   - Add appropriate try/catch for production
   - Return meaningful error messages to clients

## Important Notes

### DO NOT MODIFY
These framework files should not be changed (Cursor won't modify them either):
- `agents/base.py`
- `llm/client.py`
- `scripts/run_workflow.py`
- `scripts/model_catalog.py`

### SAFE TO MODIFY
Customize these for your domain:
- `agents/*.py` (except base.py)
- `configs/prompts/*.system.txt`
- `configs/routing.yaml`
- `configs/settings.yaml`
- `reference/` directories
- `workflows/workflow.py` (agent initialization and routing only)

### Security
- Never commit API keys or credentials
- Use environment variables for sensitive values
- The framework uses `${VAR_NAME}` syntax in configs for env vars

## Troubleshooting

### "AI Gateway authentication failed"
- Verify environment variables are set
- Check Instance ID and API Key format
- Confirm access in Platform McKinsey

### "Agent not found"
- Agent name in `--agent` flag must match name in routing.yaml
- Check `configs/routing.yaml` for available agent names

### "Routing selected wrong agent"
- Update keywords in `configs/routing.yaml`
- Make objective more specific
- Test with: `"Test the {expected_agent} agent directly"`

### "Model not available"
- Run `python scripts/model_catalog.py` to see available models
- Update `configs/settings.yaml` with available model names

## Resources

- **AGENTS.md**: Detailed architecture and concepts (for AI agents to read)
- **SETUP.md**: Questionnaire to generate your agents
- **.cursor/rules/**: Instructions for Cursor on how to generate code
- **configs/routing.yaml**: Comments explain routing system
- **Example agents**: Study `agents/software_analyzer.py` and its prompt for patterns

## Getting Help

1. **Check AGENTS.md**: Comprehensive guide to the framework
2. **Review examples**: Study the existing agents as templates
3. **Ask Cursor**: "How do I {task}?" - Cursor knows the framework
4. **Test incrementally**: Generate one agent first, test, then add more
