# Value Creation Challenge - Scoreboard Display

A standalone scoreboard display for the Value Creation Challenge game, designed for big screen presentations.

## Features

- **Real-time Updates**: Auto-refreshes every 3 seconds
- **Team Leaderboard**: Ranked by cumulative TSR (Total Shareholder Return)
- **Stock Price Chart**: Visual history of all teams across rounds (FY26-FY30)
- **News Ticker**: Shows current market scenario updates
- **PIN Authentication**: Secure access using admin PIN

## Deployment to Vercel

### Option 1: Deploy from GitHub

1. Push the `scoreboard-app` folder to a new GitHub repository (or as a subfolder)
2. Go to [Vercel](https://vercel.com) and create a new project
3. Import your GitHub repository
4. If deploying from a subfolder, set the **Root Directory** to `scoreboard-app`
5. Add the environment variable:
   - `VITE_API_URL` = Your backend API URL (e.g., `https://your-backend.railway.app`)
6. Deploy!

### Option 2: Deploy via Vercel CLI

```bash
cd scoreboard-app
npm install
npx vercel
```

When prompted:
- Set the root directory to `.` (current directory)
- Add environment variable `VITE_API_URL` with your backend URL

## Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend

# Start development server
npm run dev
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.railway.app` |

## Usage

1. Open the scoreboard URL
2. Enter the admin PIN (same as the main game's admin PIN)
3. View the live scoreboard!

## Requirements

- The backend must be running and accessible
- CORS must be configured on the backend to allow the scoreboard origin
- Use the same admin PIN as configured in the main game

## Design

- Optimized for 1080p+ displays
- Dark theme for presentation rooms
- Minimal UI distractions
- Auto-updating without page refresh
