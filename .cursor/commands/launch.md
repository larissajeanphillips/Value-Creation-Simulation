# launch

Launch this app locally.

This command will be available in chat with /launch

## For Agent Workspace (Docker)

If in Agent Workspace context (detected by `deployer-apps/*/src/` structure):

```bash
cd deployer-apps/*/src
./scripts/docker-dev.sh
```

## For Standard React App

```bash
# Frontend
npm run dev

# Backend (if separate)
cd backend && npm run dev
```
