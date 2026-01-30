# 🎯 START HERE - Get Running in 2 Minutes

**Generic FastAPI + React Webapp Starter** - Build any type of webapp!

## What You Need

1. **Docker Desktop** (that's it!)
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Make sure it's running

2. **Environment Variables** (if your app needs them)
   - Create `.env` file from `.env.example`
   - Add any credentials your app requires
   - *Note: The agent framework example needs AI Gateway credentials, but you can build any app*

## Quick Start

```bash
# 1. Navigate to src directory
cd deployer-apps/<instance-name>/src

# 2. Copy environment template
cp .env.example .env

# 3. Edit .env and add your credentials
# (Use any text editor)

# 4. Start the app
./scripts/docker-dev.sh
```

**Open http://localhost:3000** - You're done! 🎉

## What Happens

- First run: Builds Docker image (~2-3 minutes)
- Subsequent runs: Starts instantly
- Hot reload: Agent/config changes apply automatically
- No Node.js, Python, or other tools needed!

## Need Help?

- **Windows users**: See [WINDOWS_SETUP.md](./WINDOWS_SETUP.md) - No permission issues!
- **Detailed instructions**: See [QUICKSTART.md](./QUICKSTART.md)
- **Full documentation**: See [README.md](./README.md)
- **Troubleshooting**: See [QUICKSTART.md](./QUICKSTART.md#-troubleshooting)

## Next Steps

- **Build your webapp**: Edit `api.py` and `ui/src/` for your application
- **See WEBAPP_STARTER.md**: Guide for building any type of webapp
- **When to rebuild**: See [REBUILD_GUIDE.md](./REBUILD_GUIDE.md) - usually NO rebuilds needed!
- **Making changes**: See [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md) for detailed workflow
- **Agent framework**: If using agents, see `SETUP.md` and `README.md`
- **Deploy**: See `STARTER_TEMPLATE_SETUP.md` in the repo root
