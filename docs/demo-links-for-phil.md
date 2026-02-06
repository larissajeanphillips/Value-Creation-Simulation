# Demo Links for Phil (Simulation Facilitator)

**Purpose:** Phil can click through the simulation tool over the weekend—no need to start the game. We’ll show him how to run the live simulation later.

**Production (Vercel):** Base URL is `https://value-creation-simulation.vercel.app`. This doc is the single source of truth for demo links; when you deploy to Vercel, use the URLs below. For local/ngrok, replace the base with your URL (e.g. `https://xyz789.ngrok-free.app` or `http://localhost:5173`).

**Save to Verso:** Copy the “Links to copy into Verso” section below into Verso so Phil has the list there too.

---

## Two main demo links (Vercel)

| Role | Description | URL |
|------|-------------|-----|
| **Facilitator / Admin demo** | Displays, scoreboard, rounds, debrief, admin—start here for Phil | https://value-creation-simulation.vercel.app/demo |
| **Player demo** | Team interface: join a team, lobby, decisions (when game is running) | https://value-creation-simulation.vercel.app/demo/player |

---

## All links (production Vercel)

| Page | URL |
|------|-----|
| **Facilitator demo (start here)** | https://value-creation-simulation.vercel.app/demo |
| **Player demo** | https://value-creation-simulation.vercel.app/demo/player |
| Team interface (player app) | https://value-creation-simulation.vercel.app/ |
| Display Hub (big-screen menu) | https://value-creation-simulation.vercel.app/display |
| Live Scoreboard | https://value-creation-simulation.vercel.app/display/scoreboard |
| Round 1 (FY26) | https://value-creation-simulation.vercel.app/display/1 |
| Round 2 (FY27) | https://value-creation-simulation.vercel.app/display/2 |
| Round 3 (FY28) | https://value-creation-simulation.vercel.app/display/3 |
| Round 4 (FY29) | https://value-creation-simulation.vercel.app/display/4 |
| Round 5 (FY30) | https://value-creation-simulation.vercel.app/display/5 |
| Game Debrief | https://value-creation-simulation.vercel.app/display/debrief |
| Facilitator / Admin | https://value-creation-simulation.vercel.app/admin |

**Note:** Admin and the team interface use an access code (you’ll give Phil the code when you run the live sim).

---

## Links to copy into Verso (Vercel URLs)

Paste this block into Verso:

```
Facilitator demo (start here): https://value-creation-simulation.vercel.app/demo
Player demo: https://value-creation-simulation.vercel.app/demo/player
Team interface: https://value-creation-simulation.vercel.app/
Display Hub: https://value-creation-simulation.vercel.app/display
Live Scoreboard: https://value-creation-simulation.vercel.app/display/scoreboard
Round 1 (FY26): https://value-creation-simulation.vercel.app/display/1
Round 2 (FY27): https://value-creation-simulation.vercel.app/display/2
Round 3 (FY28): https://value-creation-simulation.vercel.app/display/3
Round 4 (FY29): https://value-creation-simulation.vercel.app/display/4
Round 5 (FY30): https://value-creation-simulation.vercel.app/display/5
Game Debrief: https://value-creation-simulation.vercel.app/display/debrief
Facilitator / Admin: https://value-creation-simulation.vercel.app/admin
```

---

## Getting a shareable BASE_URL (e.g. ngrok)

See **scripts/share-setup.md** for:

1. Running backend and frontend locally
2. Using ngrok to get a public URL for the frontend
3. Sharing that URL as BASE_URL in the table above
