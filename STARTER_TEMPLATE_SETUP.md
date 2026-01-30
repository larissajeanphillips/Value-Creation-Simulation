# Starter Template Setup Guide

This repository is a **starter template** for building web applications (FastAPI + React) on Deployer K8s PaaS. The agent framework is one example - you can build any type of webapp!

**🎯 Windows users:** Docker eliminates permission issues! No need to install Node.js, Python, or run build tools like esbuild locally. Everything runs in Docker containers.

## 🚀 Quick Start Checklist

### 1. Repository Setup

- [ ] Clone or fork this repository
- [ ] Rename `deployer-apps/citizen-dev7` to `deployer-apps/<your-instance-name>`
- [ ] Update all references to `citizen-dev7` in GitHub workflows (these are managed by the platform, but you may need to verify)

### 2. Configure AI Gateway Credentials

The application requires AI Gateway credentials from Platform McKinsey:

1. **Get your credentials:**
   - Go to Platform McKinsey → AI Gateway service
   - Create or access your AI Gateway instance
   - Copy your Instance ID and API Key (format: `clientID:clientSecret`)

2. **Set up environment variables:**
   ```bash
   cd deployer-apps/<your-instance-name>/src
   cp .env.example .env
   # Edit .env and add your credentials:
   # AI_GATEWAY_INSTANCE_ID=your_instance_id_here
   # AI_GATEWAY_API_KEY=your_client_id:your_client_secret
   ```

3. **For production deployment:**
   - Add these as GitHub repository secrets:
     - `AI_GATEWAY_INSTANCE_ID`
     - `AI_GATEWAY_API_KEY`
   - They will be automatically synced to Kubernetes via ExternalSecrets

### 3. Configure Kubernetes Deployment

Update `deployer-apps/<your-instance-name>/<env>-<region>/manifests/values.yaml`:

**Required replacements:**
- `<PRODUCT_NAME>` → Your product name (for JFrog registry)
- `<INSTANCE_NAME>` → Your Platform McKinsey instance name
- `<PRODUCT_ID>` → Your Product ID (from Platform McKinsey instance details)
- `<ENVIRONMENT_ID>` → Your Environment ID (from Platform McKinsey instance details)
- `<INSTANCE_NAME_LOWERCASE>` → Lowercase version of instance name

**Example:**
```yaml
image:
  repository: mckinsey-myproduct-docker-local.jfrog.io/my-instance-starter-app
pmckinstanceName: my-instance
labels:
  app.kubernetes.io/lrah-user-product-id: 12345
  app.kubernetes.io/lrah-user-evironment-id: my-instance-abc123
imagePullSecrets:
  - name: jfrog-my-instance-abc123-secret
vaultSecrets:
  - name: lrah-secret-generic
    secretStoreName: myinstance
    secretPath: "deployer-k8s-paas/my-instance-abc123/app-secrets"
```

### 4. Set Up Your Agents

1. **Fill out `SETUP.md`:**
   - Open `deployer-apps/<your-instance-name>/src/SETUP.md`
   - Replace all `<!-- TODO: -->` placeholders with your domain information
   - Define your agent specializations (3-5 agents recommended)
   - Add your AI Gateway credentials

2. **Generate agents:**
   - In Cursor chat, say: "I've filled out SETUP.md. Please generate my industry-specific agents."
   - Cursor will create agent files, system prompts, and update configurations

3. **Add reference data (optional):**
   - Place domain-specific reference files in `reference/{agent_name}/` directories
   - Agents can access these files for context-aware responses

### 5. Test Locally

**🚀 Docker (Recommended - No dependencies needed!)**
```bash
cd deployer-apps/<your-instance-name>/src
./scripts/docker-dev.sh  # Windows: bash scripts/docker-dev.sh
# App available at http://localhost:3000
```

**Prerequisites:** Just Docker Desktop - no Node.js, Python, or build tools needed!

**Windows users:** Docker solves permission issues! No elevated permissions needed for esbuild, npm, or other build tools. See `src/WINDOWS_SETUP.md` for details.

The Docker setup:
- ✅ Builds everything automatically (React UI + Python backend)
- ✅ Hot reloads backend changes (no rebuild needed)
- ✅ Includes all dependencies
- ✅ Works the same on Windows/Mac/Linux
- ✅ **No local build tools required** - everything in Docker

**Alternative: Run Without Docker** (requires Node.js and Python)
```bash
# Terminal 1: Backend
cd deployer-apps/<your-instance-name>/src
uvicorn api:app --reload --port 3000

# Terminal 2: Frontend
cd deployer-apps/<your-instance-name>/src/ui
npm install
npm run dev
```

See [QUICKSTART.md](./deployer-apps/<your-instance-name>/src/QUICKSTART.md) for detailed Docker instructions.

### 6. Deploy to Platform

1. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: configure starter template for my instance"
   git push origin main
   ```

2. **Deploy via GitHub Actions:**
   - Go to GitHub → Actions tab
   - Run the workflow: `<instance-name>-dev-<region>-Deploy All`
   - This will:
     - Build and publish Docker image
     - Deploy infrastructure (if configured)
     - Sync secrets
     - Deploy application to Kubernetes

3. **Access your application:**
   - URL format: `https://app-<k8s_namespace>.<cloudflare_domain>`
   - Find your namespace in Platform McKinsey instance details

## 📁 Project Structure

```
deployer-apps/<instance-name>/
├── src/                          # Application source code
│   ├── agents/                   # Agent implementations (customize these)
│   │   ├── base.py              # Framework file (don't modify)
│   │   └── *.py                 # Your custom agents
│   ├── configs/                  # Configuration files
│   │   ├── prompts/             # Agent system prompts
│   │   ├── routing.yaml         # Agent routing rules
│   │   └── settings.yaml        # AI Gateway and model config
│   ├── llm/                      # LLM client (framework file)
│   ├── workflows/                # Agent workflow logic
│   ├── reference/                # Reference data for agents
│   ├── ui/                       # React frontend
│   ├── api.py                    # FastAPI backend
│   ├── Dockerfile                # Production Docker build
│   ├── SETUP.md                  # Agent configuration questionnaire
│   └── .env.example              # Environment variables template
│
└── <env>-<region>/               # Environment-specific configs
    ├── manifests/                # Kubernetes Helm charts
    │   └── values.yaml          # Deployment values (UPDATE THIS)
    └── iac/                      # Terraform infrastructure
        └── main.tf              # AWS resources (S3, RDS, etc.)
```

## 🔧 Customization Guide

### Adding New Agents

1. Create agent file: `agents/your_agent.py`
2. Create system prompt: `configs/prompts/your_agent.system.txt`
3. Add routing rules: `configs/routing.yaml`
4. Update settings: `configs/settings.yaml`

See `AGENTS.md` for detailed architecture documentation.

### Customizing the UI

- Modify React components: `ui/src/components/`
- Update API client: `ui/src/services/api.ts`
- Customize theme: `ui/tailwind.config.js`

### Adding Infrastructure

Edit `iac/main.tf` (USER CONFIGURATION section only):
- Add PostgreSQL databases
- Add S3 buckets
- Add SQS queues

**Important:** Never modify platform-managed variables in `main.tf`.

## 🐛 Troubleshooting

### "AI Gateway authentication failed"
- Verify `.env` file has correct credentials
- Check GitHub secrets are set correctly
- Confirm credentials in Platform McKinsey

### "Agent not found"
- Check `configs/routing.yaml` for agent name
- Verify agent file exists in `agents/`
- Ensure agent is registered in workflow

### "Docker build fails"
- Check Docker is running
- Verify all dependencies in `requirements.txt` and `ui/package.json`
- Review Dockerfile for any path issues

### "Deployment fails"
- Check `values.yaml` has all placeholders replaced
- Verify GitHub secrets are configured
- Review GitHub Actions workflow logs

## 📚 Additional Resources

- **Agent Framework:** See `src/AGENTS.md` for architecture details
- **Development Guidelines:** See `.cursor/rules/development-guidelines.mdc`
- **Deployment Guide:** See `.cursor/rules/deployment-guidelines.mdc`
- **Platform Docs:** [Deployer K8s PaaS Knowledge Base](https://platform.mckinsey.com/knowledge-base/service-guide/852265408/deployer-k8s-paas)

## ✅ Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All `values.yaml` placeholders replaced with actual values
- [ ] AI Gateway credentials configured (local `.env` and GitHub secrets)
- [ ] Agents configured and tested locally
- [ ] Docker image builds successfully
- [ ] Application runs locally without errors
- [ ] GitHub workflows are configured for your instance name
- [ ] Infrastructure resources (if any) are properly configured in `iac/main.tf`

## 🆘 Need Help?

- Check the [Platform McKinsey Knowledge Base](https://platform.mckinsey.com/knowledge-base/service-guide/852265408/deployer-k8s-paas)
- Review GitHub Actions workflow logs for deployment issues
- Check application logs in Dynatrace (see main README.md for access instructions)
