# docker-setup

Help users get Docker set up and running.

This command will be available in chat with `/docker-setup`

## Overview

This command helps users install and configure Docker Desktop. It's focused on getting them up and running with minimal technical jargon.

## Step 1: Explain Docker Simply

"**What is Docker?**

Imagine you want to bake a cake, but instead of gathering all the ingredients yourself, someone hands you a complete kit with everything pre-measured and ready to go.

**Docker is like that kit for your app.** It bundles everything your app needs into one package that 'just works' - you don't need to install programming languages or other tools on your computer.

**Why use Docker?**
- **Simpler** - Install one app (Docker) instead of many
- **Safer** - Your app runs in its own protected space
- **Reliable** - Works the same on every computer

**The only thing you need:** Docker Desktop (a free app)"

## Step 2: Check Docker Status

Run this command to check if Docker is installed and running:

```bash
docker --version && docker ps > /dev/null 2>&1 && echo "Docker is running" || echo "Docker not running"
```

### If Docker is installed and running:

"Docker is ready to go! 

You can start your app with:
```bash
./scripts/docker-dev.sh
```

Then open http://localhost:3000 in your browser."

### If Docker is not installed or not running:

Use AskQuestion:

```json
{
  "title": "Docker Setup",
  "questions": [
    {
      "id": "docker_status",
      "prompt": "Docker doesn't seem to be running.\n\nDo you have Docker Desktop installed?",
      "options": [
        { "id": "installed", "label": "Yes, it's installed but might not be running" },
        { "id": "not_installed", "label": "No, I need to install it" },
        { "id": "not_sure", "label": "I'm not sure" }
      ]
    }
  ]
}
```

## Step 3: Handle Response

### If "Yes, installed but not running"

"Docker Desktop needs to be running for your app to start.

**How to start Docker Desktop:**

**Mac:**
1. Open Finder
2. Go to Applications
3. Double-click 'Docker'
4. Wait for the whale icon to appear in your menu bar (top right)
5. When it stops animating, Docker is ready!

**Windows:**
1. Open the Start menu
2. Search for 'Docker Desktop'
3. Click to open it
4. Wait for the icon in your system tray to show 'Docker Desktop is running'

Once it's running, let me know and we'll start your app!"

### If "No, need to install"

"**Installing Docker Desktop**

Docker Desktop is free for personal and small team use.

**Step 1: Download**
- **McKinsey users:** [Docker for Business](https://mckinsey.service-now.com/ghd?id=mck_app_cat_item&table=pc_software_cat_item&sys_id=157a289187c6c1d0011e52c83cbb35ef)
- **Alternative:** [Podman Desktop](https://platform.mckinsey.com/team/no-team/create-service/d4a3647c-10ee-44da-848d-b7a52610f633)

**Step 2: Install**
1. Open the downloaded file
2. Follow the installation prompts
3. You may need to restart your computer

**Step 3: Start Docker**
1. Open Docker Desktop from your Applications (Mac) or Start menu (Windows)
2. Wait for it to fully start (the whale icon will stop animating)

**Step 4: Come back here**
Once Docker is running, let me know and we'll start your app!

**Note:** Installation might take 5-10 minutes and may require admin permissions."

### If "I'm not sure"

"No problem! Let me help you check.

**On Mac:**
1. Look at your menu bar (top right of screen)
2. Do you see a whale icon? 🐳
3. If yes → Docker is installed (might just need to be started)
4. If no → We'll need to install it

**On Windows:**
1. Look at your system tray (bottom right, near the clock)
2. Do you see a whale icon?
3. Or: Open Start menu and search for 'Docker'

What do you see?"

## Step 4: After Docker is Running

Once Docker is confirmed running:

"Docker is ready.

**Starting your app:**
```bash
cd deployer-apps/citizen-dev7/src
./scripts/docker-dev.sh
```

**What happens:**
- First time: Builds the app (takes 2-3 minutes)
- After that: Starts almost instantly
- Your app will be at http://localhost:3000

Would you like me to start it now?"

If yes, run the docker-dev.sh script.

## Troubleshooting

**"Docker is taking forever to start"**
→ First start can take a few minutes, especially on slower machines
→ Make sure you have at least 4GB of free RAM
→ Try restarting Docker Desktop

**"Permission denied" error**
→ On Mac: You may need to grant Docker access in System Settings > Privacy
→ On Windows: Make sure you're running as an administrator for installation

**"Port 3000 is already in use"**
→ Another app is using that port
→ Either close the other app or ask me to use a different port

**"Not enough disk space"**
→ Docker needs a few GB of free space
→ Try clearing some files and trying again

## Critical Instructions

1. **BE PATIENT** - Docker installation can take time
2. **NO AI GATEWAY HERE** - AI Gateway setup is handled by `/add-ai`, not this command
3. **ACTUALLY CHECK** - Run the docker command to verify status
4. **OFFER HELP** - If they get stuck, walk them through step by step
