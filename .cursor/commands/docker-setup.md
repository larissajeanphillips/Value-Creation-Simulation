# docker-setup

Launch the Docker setup wizard for the Agent Workspace starter template.

This command will be available in chat with `/docker-setup`

When triggered, immediately:

1. **Check Docker Status** - Verify Docker is installed and running
2. **Configure Environment** - Help set up `.env` file with AI Gateway credentials
3. **Start Application** - Optionally launch Docker container
4. **Provide Next Steps** - Guide user through first-time setup

## Step 1: Check Docker

Check if Docker is available:
```bash
docker --version && docker ps > /dev/null 2>&1 && echo "Docker is running" || echo "Docker not running"
```

If Docker is not running:
- Inform user they need to start Docker Desktop
- Provide download link if Docker is not installed

## Step 2: Collect AI Gateway Credentials

Use AskQuestion to collect credentials interactively:

```json
{
  "title": "Docker Setup - AI Gateway Configuration",
  "questions": [
    {
      "id": "has_credentials",
      "prompt": "Do you have your AI Gateway credentials ready?\n\nYou can get these from Platform McKinsey > AI Gateway service.\n\nYou'll need:\n- Instance ID\n- API Key (format: clientID:clientSecret)",
      "options": [
        { "id": "yes", "label": "Yes, I have my credentials ready" },
        { "id": "no", "label": "No, I need to get them first" },
        { "id": "skip", "label": "Skip for now - I'll configure later" }
      ]
    }
  ]
}
```

If user selects "yes":
- Ask for Instance ID
- Ask for API Key
- Create `.env` file automatically

If user selects "no":
- Provide instructions on how to get credentials
- Offer to help again later

If user selects "skip":
- Create `.env` from `.env.example` with placeholders
- Inform user they need to edit it before running

## Step 3: Create .env File

If credentials provided:
```bash
cd deployer-apps/<instance-name>/src
cat > .env << EOF
AI_GATEWAY_INSTANCE_ID=<instance_id>
AI_GATEWAY_API_KEY=<api_key>
EOF
```

If skipped:
```bash
cd deployer-apps/<instance-name>/src
cp .env.example .env
# Inform user to edit .env before running
```

## Step 4: Offer to Start Docker

Ask if user wants to start the app now:

```json
{
  "title": "Ready to Start?",
  "questions": [
    {
      "id": "start_now",
      "prompt": "Would you like to start the application now?\n\nThe Docker container will:\n- Build the image (first time only, ~2-3 minutes)\n- Start the app on http://localhost:3000\n- Enable hot reloading for agents and configs",
      "options": [
        { "id": "yes", "label": "Yes, start it now" },
        { "id": "no", "label": "No, I'll start it later" }
      ]
    }
  ]
}
```

If "yes":
- **Actually run** `./scripts/docker-dev.sh` (not in background - let user see output)
- Navigate to correct directory first
- Make script executable if needed
- Inform user the app will be available at http://localhost:3000 after build completes

If "no":
- Provide instructions for starting later
- Show the command: `./scripts/docker-dev.sh`

## Step 5: Confirm Success

Provide a summary:

```
✅ Docker setup complete!

📁 Configuration:
   • .env file created at: deployer-apps/<instance-name>/src/.env
   • Docker image: agent-chat

🚀 To start the app:
   cd deployer-apps/<instance-name>/src
   ./scripts/docker-dev.sh

🌐 App will be available at: http://localhost:3000

📚 Next steps:
   • Customize agents: Edit SETUP.md and regenerate
   • Add reference data: Place files in reference/{agent_name}/
   • See QUICKSTART.md for detailed instructions
```

## Error Handling

- **Docker not installed**: Provide download link and clear instructions
- **Docker not running**: Ask user to start Docker Desktop
- **Missing credentials**: Offer to help get them or skip for now
- **Script not executable**: Fix permissions automatically
- **Port 3000 in use**: Suggest alternative port or help identify what's using it

## Critical Instructions

1. **Check Docker FIRST** - Don't proceed if Docker isn't available
2. **Create .env automatically** - Don't ask user to manually create files
3. **Provide clear feedback** - Explain what's happening at each step
4. **Handle errors gracefully** - Guide user to solutions
5. **Offer to start** - But don't force it if user wants to configure more first
