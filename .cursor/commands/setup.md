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
- Continue with Steps 1-7 below

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

### Step 4: Visual Inspiration (Optional)

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

### Step 5: App Name

Ask in chat:

"**What would you like to call your app?**

This will appear in the browser tab and header.

Examples: 'Client Portal', 'Feedback Tracker', 'Project Dashboard'"

### Step 6: How to Run

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

### Step 6b: Docker Setup (if Docker selected)

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

If verified, proceed to Step 7 (Start the App).

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

### Step 7: Start the App (Auto-trigger)

Once Docker is confirmed running, **automatically start the app**:

"Docker is ready! Starting your app now..."

Run the following commands:
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

## After Collecting All Inputs (Steps 1-5)

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
- **Components to Create**: Table with component name, file path, description
- **Files to Modify**: Table with file and changes
- **Sample Data**: What will be generated with examples
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

### THEN Ask About Runtime (Step 6)

Only after the code is written, proceed to Step 6 (Docker vs Local choice).

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
- If Docker selected: Run `./scripts/docker-dev.sh`
- If local selected: Provide instructions for `npm run dev` in ui/ and `uvicorn api:app` in backend

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

1. **MANDATORY: CREATE PLAN.md** - After collecting inputs, you MUST:
   - Switch to Plan Mode using `SwitchMode(target_mode_id: "plan")`
   - Create `ui/PLAN.md` with the detailed implementation plan
   - Wait for explicit user confirmation
   - Update PLAN.md status to "Approved" once confirmed
   - DO NOT write any code until user confirms the plan
   
2. **BE CONVERSATIONAL** - This is a friendly wizard, not a technical form
3. **WAIT FOR RESPONSES** - Don't rush through steps
4. **HANDLE IMAGES** - If user shares an image, analyze it for design inspiration
5. **ACTUALLY WRITE CODE** - After user confirms the plan:
   - Create new component files in `ui/src/components/`
   - Edit `ui/src/App.tsx` to add navigation and routes
   - Update `ui/package.json` and `ui/index.html` with app name
   - Modify `ui/tailwind.config.js` for colors if needed
   - Generate sample data files if needed
   - DO NOT just describe what to do - actually make the file changes!
6. **SHOW PROGRESS** - Tell the user what you're creating as you go
7. **BUILD BEFORE DOCKER** - All code changes happen BEFORE starting Docker
8. **OFFER TO START** - After code is written, guide them through Docker/running
9. **TAILOR NEXT STEPS** - Show relevant suggestions based on their choices
