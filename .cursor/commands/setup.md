# setup

Launch the interactive project setup wizard.

This command will be available in chat with /setup

## Context Detection

**When triggered, first check if you're in the Agent Workspace starter template:**

Check for these indicators:
- Current directory contains `deployer-apps/*/src/`
- Files present: `Dockerfile`, `api.py`, `agents/` directory, `scripts/docker-dev.sh`
- File structure matches Agent Workspace template

**If Agent Workspace detected:**
- Follow `.cursor/rules/docker-setup-guide.mdc` instead
- Offer Docker setup wizard
- Help configure `.env` file
- **Actually launch Docker** when user chooses to start (run `./scripts/docker-dev.sh` directly)

**If NOT Agent Workspace:**
- Follow the standard project-setup-guide.mdc rule below

## Standard Project Setup (Non-Agent Workspace)

When triggered, immediately follow the project-setup-guide.mdc rule to:

1. **Launch the Setup Wizard** - Use the AskQuestion tool to present the interactive project configuration modal

2. **Collect Configuration**:
   - Project name (with sanitization for folder naming)
   - Project location (Documents, Projects, current folder, or custom)
   - Project description (optional)
   - Include tutorial app (yes/no)
   - GitHub repository URL (optional)
   - Team name (optional)

3. **Process Responses**:
   - Handle "custom" selections by asking follow-up questions in chat
   - Sanitize project name (lowercase, dashes, no special characters)
   - Expand paths (convert `~` to home directory)

4. **Execute Setup**:
   - Use `npx tsx scripts/setup-automation.ts` with the collected parameters
   - Or follow manual setup steps if script is unavailable

5. **Confirm Success**:
   - Display project location
   - Provide next steps (use `/launch` to start dev server)
   - List helpful resources in the new project

## Critical: Read the Full Guide

Before executing, read the complete project setup guide at:
`.cursor/rules/project-setup-guide.mdc`

This contains the full AskQuestion configuration and all setup steps.
