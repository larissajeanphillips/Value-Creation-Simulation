# setup

Launch the interactive app setup wizard.

This command will be available in chat with `/setup`

## Overview

This wizard helps users configure their web app through a conversational, step-by-step process. It gathers context about what they're building, creates an implementation plan for approval, and then customizes the project accordingly.

## CRITICAL: Plan-First Requirement

**After gathering all user inputs (Steps 0-5), you MUST:**

1. **Switch to Plan Mode** - Use `SwitchMode(target_mode_id: "plan")`
2. **Create `ui/PLAN.md`** - Write the implementation plan to a proper markdown file
3. **Wait for explicit user confirmation** - Do NOT proceed until user says "yes", "looks good", etc.
4. **Update PLAN.md status** - Change from "Awaiting approval" to "Approved"
5. **Only then build** - Switch back to Agent mode and implement the confirmed plan

**DO NOT skip the planning step. DO NOT start writing code until user confirms.**

## Step-by-Step Flow

### Step 0: Choose Your Path

Use AskQuestion:

```json
{
  "title": "Let's set up your app!",
  "questions": [
    {
      "id": "approach",
      "prompt": "How would you like to get started?",
      "options": [
        { "id": "quick", "label": "Quick Start - I'm just playing around" },
        { "id": "prd", "label": "Detailed Plan - I'm building something real and need proper requirements" }
      ]
    }
  ]
}
```

**If "prd" selected:**
- Read and follow the PRD generator skill at `.cursor/skills/prd-generator/SKILL.md`
- After PRD is complete, return here and continue from Step 1 to apply the configuration

**If "quick" selected:**
- Continue with Steps 1-8 below

### Step 1: Context - What are you building for?

Use AskQuestion to understand the context:

```json
{
  "title": "Let's Set Up Your App",
  "questions": [
    {
      "id": "purpose",
      "prompt": "What are you building this for?\n\nThis helps me adjust the polish level and style.",
      "options": [
        { "id": "client", "label": "A client project or engagement" },
        { "id": "internal", "label": "An internal tool for my team" },
        { "id": "personal", "label": "A personal project or learning" },
        { "id": "other", "label": "Something else" }
      ]
    }
  ]
}
```

### Step 2: Description - What should it do?

**First, open the inspiration gallery to give them ideas:**

```bash
open deployer-apps/citizen-dev7/src/ui/public/inspiration.html
```

(On Windows, use `start` instead of `open`)

Then ask in chat:

"**I've opened an inspiration gallery in your browser** with examples of apps you can build.

Take a look, then **describe your app in a sentence or two:**

What should it do? Who will use it?

Examples:
- 'A dashboard for clients to see their project status and upcoming milestones'
- 'A tool for our team to track workshop feedback and generate reports'
- 'A form where customers submit support requests'

Or just describe your own idea - there are no limits!"

Wait for their response and save it.

### Step 3: Features - Multi-select

Use AskQuestion with multi-select:

```json
{
  "title": "What features does your app need?",
  "questions": [
    {
      "id": "features",
      "prompt": "Select all that apply:",
      "allow_multiple": true,
      "options": [
        { "id": "dashboard", "label": "Dashboard & Charts - Display data with graphs, tables, and metrics" },
        { "id": "forms", "label": "Forms & Data Entry - Collect information with forms and validation" },
        { "id": "analytics", "label": "Data Analytics - Filter, sort, search, and export data" },
        { "id": "chatbot", "label": "AI Chatbot - Answer questions using AI (additional setup later)" },
        { "id": "files", "label": "File Upload/Download - Upload documents or download reports" },
        { "id": "auth", "label": "User Login - Require users to sign in" },
        { "id": "api", "label": "Connect to External Data - Pull data from APIs or databases" }
      ]
    }
  ]
}
```

### Step 4: Reference Code or Data (Optional)

Use AskQuestion:

```json
{
  "title": "Reference Code or Data (Optional)",
  "questions": [
    {
      "id": "reference",
      "prompt": "Do you have existing code, data, or a repo you want me to reference?\n\nThis helps me match existing patterns, use real data structures, or build on what you already have.",
      "options": [
        { "id": "local_folder", "label": "Yes, a folder on my computer" },
        { "id": "git_repo", "label": "Yes, a Git repository (GitHub, GitLab, etc.)" },
        { "id": "none", "label": "No, start fresh" }
      ]
    }
  ]
}
```

**If "local_folder" selected:**

Ask in chat:
"Please provide the path to the folder you want me to reference.

You can:
- Drag and drop the folder into this chat
- Or type/paste the full path (e.g., `/Users/you/projects/my-app` or `C:\Projects\my-app`)

I'll analyze the code structure, data formats, and patterns to incorporate into your new app."

Wait for the path, then:
1. Use the Read and LS tools to explore the folder structure
2. Identify key patterns: file naming, code style, data schemas, etc.
3. Note these in the PLAN.md for reference during implementation

**If "git_repo" selected:**

Ask in chat:
"Please provide the Git repository URL.

Examples:
- `https://github.com/username/repo-name`
- `git@github.com:username/repo-name.git`

If it's a private repo, make sure you have access configured (SSH key or token)."

Wait for the URL, then:
```bash
# Clone to a temp directory for reference
git clone --depth 1 [REPO_URL] /tmp/reference-repo 2>&1 || echo "CLONE_FAILED"
```

If clone succeeds:
1. Explore the repo structure with LS and Read tools
2. Identify relevant patterns, components, or data structures
3. Note these in the PLAN.md for reference during implementation

If clone fails (private repo or invalid URL):
"I couldn't access that repository. This might be because:
- It's a private repo and I don't have access
- The URL has a typo

You can:
1. Make the repo public temporarily
2. Clone it locally and give me the local path instead
3. Skip this step and describe what you want me to reference"

**If "none" selected:**

Continue to Step 5.

### Step 5: Visual Inspiration (Optional)

Use AskQuestion:

```json
{
  "title": "Visual Inspiration (Optional)",
  "questions": [
    {
      "id": "visual",
      "prompt": "Do you have any visual inspiration for how it should look?\n\nA sketch, screenshot, or example helps me match your vision.",
      "options": [
        { "id": "image", "label": "Yes, I have an image to share" },
        { "id": "describe", "label": "I'll describe what I want" },
        { "id": "skip", "label": "No, use your best judgment" }
      ]
    }
  ]
}
```

**If "image" selected:**
"Please drag and drop your image here, or paste it. I'll use it as inspiration for the layout, colors, and style."

Wait for image, then analyze for:
- Layout structure (sidebar, top nav, grid, etc.)
- Color palette
- Component types (cards, tables, charts)
- Overall aesthetic (minimal, corporate, playful, etc.)

**If "describe" selected:**
"Describe the look and feel you're going for.

Examples:
- 'Clean and minimal, like Notion'
- 'Professional with a blue color scheme'
- 'Modern with lots of white space and subtle shadows'"

### Step 6: App Name

Ask in chat:

"**What would you like to call your app?**

This will appear in the browser tab and header.

Examples: 'Client Portal', 'Feedback Tracker', 'Project Dashboard'"

### Step 7: How to Run

First, explain the options in chat:

"**How would you like to run your app?**

I can run your app in two ways:

**Docker** (Recommended) - Think of it as a 'container' that has everything your app needs built in. You install Docker once, and everything just works. No other software needed. *Best for most people.*

**Local** - Runs directly on your computer using Node.js and Python. *Best for developers who already have these tools.*"

Then use AskQuestion with a simple choice:

```json
{
  "title": "Choose how to run",
  "questions": [
    {
      "id": "runtime",
      "prompt": "Which option works for you?",
      "options": [
        { "id": "docker", "label": "Docker (Recommended)" },
        { "id": "local", "label": "Local (Node.js/Python)" }
      ]
    }
  ]
}
```

### Step 7b: Docker Setup (if Docker selected)

**First, check if Docker is running:**
```bash
docker info > /dev/null 2>&1 && echo "DOCKER_RUNNING" || echo "DOCKER_NOT_RUNNING"
```

**If Docker is NOT running or not installed, ask:**

```json
{
  "title": "Let's Get Docker Running",
  "questions": [
    {
      "id": "docker_status",
      "prompt": "Docker needs to be open for your app to run.\n\n**Do you have Docker Desktop installed?**\n\nDocker Desktop is a free app that runs your project. You only need to install it once.",
      "options": [
        { "id": "installed", "label": "Yes, I have Docker Desktop installed" },
        { "id": "not_installed", "label": "No, I need to install it" },
        { "id": "not_sure", "label": "I'm not sure" }
      ]
    }
  ]
}
```

**If "not_installed" or "not_sure":**

"No problem! Here's how to get Docker:

**Step 1: Download Docker Desktop**
- McKinsey users: [Docker for Business](https://mckinsey.service-now.com/ghd?id=mck_app_cat_item&table=pc_software_cat_item&sys_id=157a289187c6c1d0011e52c83cbb35ef)
- Or go to: docker.com/products/docker-desktop

**Step 2: Install it**
Open the downloaded file and follow the prompts (just like installing any app).

**Step 3: Open Docker Desktop**
Find it in your Applications (Mac) or Start Menu (Windows) and open it.
Wait until the whale icon in your menu bar/system tray stops animating.

**Let me know when Docker is open and I'll start your app!**"

**If "installed":**

"Great! Please open Docker Desktop now.

**On Mac:** Look in your Applications folder, or use Spotlight (Cmd+Space) and type 'Docker'
**On Windows:** Open the Start Menu and search for 'Docker Desktop'

Once it's open, wait a moment for it to fully start (the whale icon will stop animating).

Let me know when it's ready!"

Then ask:

```json
{
  "title": "Is Docker Running?",
  "questions": [
    {
      "id": "docker_open",
      "prompt": "Is Docker Desktop open and running?\n\nYou'll know it's ready when:\n- Mac: The whale icon in the top menu bar stops animating\n- Windows: The whale icon in the system tray (bottom right) shows 'Docker Desktop is running'",
      "options": [
        { "id": "yes", "label": "Yes, Docker is running" },
        { "id": "no", "label": "No, I'm having trouble" },
        { "id": "help", "label": "I don't see a whale icon" }
      ]
    }
  ]
}
```

**If "yes" - Docker is running:**

Verify with a command:
```bash
docker info > /dev/null 2>&1 && echo "Docker confirmed running!"
```

If verified, proceed to Step 8 (Start the App).

**If "no" or "help":**

"Let me help troubleshoot:

**Can't find Docker Desktop?**
- Try searching 'Docker' in Spotlight (Mac) or Start Menu (Windows)
- If you don't find it, you may need to install it first

**Docker is open but seems stuck?**
- Close Docker Desktop completely
- Wait 10 seconds
- Open it again
- It can take 1-2 minutes to fully start

**Getting an error?**
- Tell me what you see and I'll help!

Once Docker is running, let me know and we'll continue."

### Step 8: Start the App (Auto-trigger)

Once Docker is confirmed running, **automatically start the app**.

**IMPORTANT: Check if AI features were selected in Step 3.**

#### If "chatbot" was NOT selected (frontend-only app):

The app doesn't need the Python backend or AI Gateway credentials. Use Docker to run just the UI:

"Docker is ready! Starting your app now..."

Run the following commands:
```bash
cd deployer-apps/citizen-dev7/src/ui

# Build and run with Docker using a Node.js image
docker run --rm -d \
  --name citizen-dev-ui \
  -p 3000:5173 \
  -v "$(pwd)":/app \
  -w /app \
  node:20-alpine \
  sh -c "npm install && npm run dev -- --host 0.0.0.0"
```

Wait a few seconds for npm install to complete, then verify it's running:
```bash
sleep 10 && curl -s http://localhost:3000 > /dev/null && echo "APP_READY" || echo "STILL_STARTING"
```

If "STILL_STARTING", wait a bit longer (up to 60 seconds for first run) and check again.

Once ready, open the browser:
```bash
# macOS
open http://localhost:3000

# Windows  
start http://localhost:3000

# Linux
xdg-open http://localhost:3000
```

Tell the user:
"**Your app is live!** I've opened it in your browser at http://localhost:3000

Your app runs in Docker with hot reloading - any code changes will appear automatically."

#### If "chatbot" WAS selected (needs AI backend):

The app needs the full Python backend with AI Gateway. Check for credentials first:

```bash
cd deployer-apps/citizen-dev7/src
cat .env 2>/dev/null | grep -E "^AI_GATEWAY" || echo "NO_CREDENTIALS"
```

**If "NO_CREDENTIALS" or missing values:**

Tell the user:
"Your app includes AI chatbot features, which require AI Gateway credentials.

**To set up AI Gateway:**
1. Go to Platform McKinsey > AI Gateway
2. Create or get your instance ID and API key
3. Create a `.env` file in `deployer-apps/citizen-dev7/src/` with:
   ```
   AI_GATEWAY_INSTANCE_ID=your-instance-id
   AI_GATEWAY_API_KEY=your-api-key
   ```

For now, I'll start the app without the AI features. The chatbot will show placeholder responses until you add credentials.

Let me know when you've added the credentials and I'll restart with full AI support!"

Then start the frontend-only Docker (same as above).

**If credentials exist:**

Run the full Docker setup:
```bash
cd deployer-apps/citizen-dev7/src
chmod +x scripts/docker-dev.sh
./scripts/docker-dev.sh
```

Tell the user:
"**Your app is building!**

This takes 2-3 minutes the first time (it's downloading everything your app needs).
After that, it starts in just a few seconds.

I'll let you know when it's ready..."

Monitor the Docker build output. Once the app is running (you see the server is ready), **automatically open the browser**:

```bash
# macOS
open http://localhost:3000

# Windows
start http://localhost:3000

# Linux
xdg-open http://localhost:3000
```

Tell the user:
"**Your app is live!** I've opened it in your browser at http://localhost:3000"

## After Collecting All Inputs (Steps 1-6)

### MANDATORY: Switch to Plan Mode and Create PLAN.md

After collecting app name, description, features, and visual inspiration - **DO NOT start writing code yet**.

**Step A: Switch to Plan Mode**

Use the SwitchMode tool:
```
SwitchMode(target_mode_id: "plan", explanation: "Creating an implementation plan for your review before I start building")
```

Tell the user:
"Before I start building, let me create a plan so you can review exactly what I'm going to create."

**Step B: Create PLAN.md File**

Write a detailed plan to `deployer-apps/citizen-dev7/src/ui/PLAN.md` with:

- **Header**: App name, status (Awaiting approval), date
- **Overview table**: App name, purpose, description
- **Reference Sources** (if provided in Step 4): Table with source type, path/URL, and what patterns/data will be used from it
- **Components to Create**: Table with component name, file path, description
- **Files to Modify**: Table with file and changes
- **Sample Data**: What will be generated with examples (or note if using real data from reference)
- **Styling Approach**: Layout, colors, component styles, typography
- **Implementation Order**: Numbered list of build sequence
- **Approval section**: Instructions for confirming or requesting changes

**Step C: Tell User to Review**

"I've created a detailed implementation plan at `ui/PLAN.md`. Please review it and let me know:
- **'yes'** to proceed with building
- **'change X'** to adjust something
- **'add Y'** for additional features"

**Step D: Wait for User Response**

**DO NOT proceed until user explicitly confirms** ("yes", "looks good", "proceed", "go ahead", etc.)

If user requests changes, update PLAN.md and ask again.

**Step E: Update Status and Build**

Once user confirms:
1. Update PLAN.md status from "Awaiting approval" to "Approved - [Date]"
2. Switch back to Agent mode
3. Tell the user: "**Perfect! I'm now building your app based on the confirmed plan...**"

Then **actually create/modify these files**:

#### 1. Set App Name

Edit `ui/package.json`:
```json
{
  "name": "[user's-app-name-lowercase]",
  ...
}
```

Edit `ui/index.html`:
```html
<title>[User's App Name]</title>
```

#### 2. Create Feature Pages Based on Selections

**If Dashboard & Charts selected:**

Create `ui/src/components/Dashboard.tsx`:
```tsx
import React from 'react';

export function Dashboard() {
  // Sample data based on user's description
  const data = [...]; // Generate relevant sample data
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">[Page name from description]</h1>
      {/* Add chart components */}
    </div>
  );
}
```

**If Forms & Data Entry selected:**

Create `ui/src/components/FormPage.tsx` with form fields relevant to their description.

**If Data Analytics selected:**

Create `ui/src/components/DataTable.tsx` with filtering, sorting, and export.

**Continue for each selected feature...**

#### 3. Update App.tsx with Navigation

Edit `ui/src/App.tsx` to include:
- Navigation (sidebar or header based on number of features)
- Routes to each feature page
- App name in header

#### 4. Apply Visual Styling

If user provided image or description:
- Update `ui/tailwind.config.js` with matching colors
- Apply layout structure (sidebar vs top-nav)
- Match component styles (shadows, rounded corners, spacing)

#### 5. Generate Sample Data

Create realistic sample data based on their app description:
- Use context-appropriate names and values
- Enough data to demonstrate the features
- Comments explaining how to replace with real data

### Show Progress to User

As you write code, tell them what you're doing:

"✓ Created Dashboard page with sample charts
✓ Added navigation sidebar
✓ Applied blue color scheme
✓ Generated sample project data

**Your app is ready!** Now let's get it running..."

### THEN Ask About Runtime (Step 7)

Only after the code is written, proceed to Step 7 (Docker vs Local choice).

### Offer to Start

After code is built and runtime is configured, ask:

```json
{
  "title": "Your App is Ready!",
  "questions": [
    {
      "id": "start",
      "prompt": "Your app '[APP_NAME]' has been configured!\n\nWould you like to start it now?",
      "options": [
        { "id": "yes", "label": "Yes, start my app - Opens at http://localhost:3000" },
        { "id": "no", "label": "No, I want to customize more first" }
      ]
    }
  ]
}
```

**If yes:** 
- If Docker selected: Follow Step 7 logic (frontend-only vs full backend based on chatbot selection)
- If local selected: 
  - For frontend-only: `cd ui && npm install && npm run dev`
  - For full backend: Terminal 1: `uvicorn api:app --reload --port 3000`, Terminal 2: `cd ui && npm run dev`

**If no:**
- Explain they can start anytime with `/launch`
- Suggest what they might want to customize

### Show Next Steps

Provide tailored next steps based on their selections:

"**Your app is running at http://localhost:3000**

Here's what you can do next:

[If Dashboard selected]
- Your Dashboard page has sample charts. Try: 'Change the chart colors to blue' or 'Add a pie chart'

[If Forms selected]
- Your form is ready. Try: 'Add a phone number field' or 'Make the email field required'

[If AI Chatbot selected]
- Your chatbot UI works but shows placeholder responses. Run `/add-ai` when you're ready to connect real AI.

**General tips:**
- 'Make the header darker'
- 'Add a footer with copyright'
- 'The spacing looks too tight - add more padding'

Just describe what you want to change!"

## Critical Instructions

1. **TRACK FEATURE SELECTIONS** - After Step 3, remember whether "chatbot" was selected:
   - If chatbot selected → App needs AI backend → Requires AI Gateway credentials
   - If chatbot NOT selected → Frontend-only → No credentials needed, simpler Docker setup
   
2. **MANDATORY: CREATE PLAN.md** - After collecting inputs, you MUST:
   - Switch to Plan Mode using `SwitchMode(target_mode_id: "plan")`
   - Create `ui/PLAN.md` with the detailed implementation plan
   - Wait for explicit user confirmation
   - Update PLAN.md status to "Approved" once confirmed
   - DO NOT write any code until user confirms the plan
   
3. **BE CONVERSATIONAL** - This is a friendly wizard, not a technical form
4. **WAIT FOR RESPONSES** - Don't rush through steps
5. **HANDLE IMAGES** - If user shares an image, analyze it for design inspiration
6. **ACTUALLY WRITE CODE** - After user confirms the plan:
   - Create new component files in `ui/src/components/`
   - Edit `ui/src/App.tsx` to add navigation and routes
   - Update `ui/package.json` and `ui/index.html` with app name
   - Modify `ui/tailwind.config.js` for colors if needed
   - Generate sample data files if needed
   - DO NOT just describe what to do - actually make the file changes!
7. **SHOW PROGRESS** - Tell the user what you're creating as you go
8. **BUILD BEFORE DOCKER** - All code changes happen BEFORE starting Docker
9. **OFFER TO START** - After code is written, guide them through Docker/running
10. **USE CORRECT DOCKER APPROACH** - Based on chatbot selection:
    - No chatbot → Simple `node:20-alpine` container for frontend only
    - With chatbot → Full `docker-dev.sh` script (requires AI Gateway credentials)
11. **TAILOR NEXT STEPS** - Show relevant suggestions based on their choices
