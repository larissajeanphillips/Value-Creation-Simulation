# Cursor Commands Reference

Quick reference for triggering common project operations in Cursor.

---

## Slash Commands

These slash commands are available to anyone who clones this repo. Type them in Cursor chat.

| Command | Description |
|---------|-------------|
| `/add-lessons-learned` | Root cause analysis and documentation of issues |
| `/commit-locally` | Commit changes locally without pushing |
| `/commit` | Commit changes to the repo |
| `/docker-setup` | **NEW** - Set up Docker and configure .env for Agent Workspace |
| `/launch` | Launch the app locally |
| `/push` | Push changes to remote repository |
| `/restart` | Shut down and restart the dev environment |
| `/review-code` | Comprehensive code review checklist |
| `/setup` | Launch project setup wizard (or Docker setup if in Agent Workspace) |
| `/welcome` | Getting started guide for new users |

---

## Docker Setup (Agent Workspace)

### How to Launch

If you're in the Agent Workspace starter template (`deployer-apps/<instance-name>/src/`), use:

- **`/docker-setup`** - Interactive Docker setup wizard
- Or say: **"set up docker"**, **"configure docker"**, **"help me start the app"**

### What Happens

The wizard will:

1. **Check Docker** - Verify Docker Desktop is installed and running
2. **Configure Credentials** - Help you set up `.env` with AI Gateway credentials
3. **Create Configuration** - Set up all necessary files automatically
4. **Offer to Start** - Optionally launch the Docker container

### What You Need

- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **AI Gateway Credentials** - From Platform McKinsey > AI Gateway service
  - Instance ID
  - API Key (format: `clientID:clientSecret`)

### After Setup

Start the app with:
```bash
cd deployer-apps/<instance-name>/src
./scripts/docker-dev.sh
```

The app will be available at **http://localhost:3000**

See `QUICKSTART.md` for detailed instructions.

---

## Project Setup Wizard

### How to Launch

Open Cursor chat (`Cmd+L` on Mac, `Ctrl+L` on Windows) and say any of these:

- **"Set up a new project"**
- **"Launch the setup guide"**
- **"Create a new project"**
- **"New project"**

### What Happens

The AI will show you an interactive form asking about:

1. **Project Name** - What to call your project
   - Examples: "client-dashboard", "sales-analytics", "team-portal"
   - Spaces and special characters are automatically converted

2. **Project Location** - Where to save your project files
   - Documents folder (recommended for most users)
   - Projects folder (if you have one)
   - Current folder
   - Custom location

3. **Description** (optional) - A short description of what your project does

4. **Tutorial App** - Whether to include example code to help you learn
   - Recommended if you're new to this setup

5. **GitHub Repository** (optional) - Link to your code repository if you have one

6. **Team Name** (optional) - Who owns this project

### What Gets Created

After answering the questions, the wizard creates:

- A complete project folder with all necessary files
- Pre-configured settings for React, TypeScript, and Tailwind CSS
- A development environment ready to run
- Documentation and style guides

### Next Steps After Setup

1. Open your terminal in the new project folder
2. Run `npm run dev` to start the development server
3. Open http://localhost:5173 in your browser
4. Start building!

---

## Alternative: Command-Line Setup

If you prefer typing commands instead of using the wizard:

```bash
# Basic usage
npx tsx scripts/setup-automation.ts --name my-project

# Full options
npx tsx scripts/setup-automation.ts \
  --name my-project \
  --location ~/Documents \
  --description "My awesome project" \
  --tutorial \
  --repo https://github.com/me/my-project \
  --team "My Team"
```

See `docs-templates/SETUP_AUTOMATION_USAGE.md` for full documentation.

---

## Helpful Files in This Template

| File | Purpose |
|------|---------|
| `.cursor/rules/welcome.mdc` | The welcome/getting started guide rule |
| `.cursor/rules/project-setup-guide.mdc` | The setup wizard rule |
| `scripts/setup-automation.ts` | Automation script for project creation |
| `docs-templates/CURSOR_SETUP_PROMPT.md` | Detailed setup documentation |
| `docs-templates/SETUP_AUTOMATION_USAGE.md` | Script usage guide |
| `ui/STYLE_GUIDE.md` | Design patterns and component examples |
| `ui/DESIGN_TOKENS.md` | Colors, typography, and spacing |
