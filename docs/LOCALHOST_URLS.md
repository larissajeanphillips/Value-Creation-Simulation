# Localhost URLs and Startup

## URLs (single frontend on port 5173)

| Role   | URL |
|--------|-----|
| **Player** (team selection / game) | http://localhost:5173 |
| **Player** (demo, no backend)      | http://localhost:5173/demo |
| **Admin** (facilitator control)    | http://localhost:5173/admin |
| **Admin** (live control)           | http://localhost:5173/live-admin |
| **Admin** (demo walkthrough)       | http://localhost:5173/demo/admin |
| **Admin** (demo links list)        | http://localhost:5173/demo/admin/links |
| **Display** (hub)                  | http://localhost:5173/display |
| **Display** (scoreboard)           | http://localhost:5173/display/scoreboard |
| **Display** (round 1–5)            | http://localhost:5173/display/1 … /display/5 |
| **Display** (debrief)              | http://localhost:5173/display/debrief |

**Backend API / WebSocket:** http://localhost:3000 (used by frontend when backend is running)

---

## Startup

### Option 1: Two terminals

**Terminal 1 – Backend**
```bash
npm run dev:backend
```
Runs backend on **http://localhost:3000**.

**Terminal 2 – Frontend**
```bash
npm install
npm run dev
```
Runs frontend on **http://localhost:5173**.

### Option 2: One terminal (backend in background)

```bash
npm run dev:backend
```
Then in another terminal:
```bash
npm install
npm run dev
```

---

## Summary

- **Admin:** http://localhost:5173/admin (or 5174 if 5173 is in use)  
- **Player:** http://localhost:5173 (or 5174)  
- **Backend:** http://localhost:3000 (start with `npm run dev:backend` or see below)  
- **Frontend:** http://localhost:5173 (or next free port; start with `npm run dev`)

### If backend won’t start

- **Port 3000 in use:** Stop the other app using port 3000, or set `PORT=3001` in `backend/.env` and use http://localhost:3001 (and set `VITE_SOCKET_URL=http://localhost:3001` for the frontend).
- **`npm run dev:backend` fails (e.g. npx/tsc):** From project root run:
  ```bash
  cd backend && node ./node_modules/tsx/dist/cli.mjs server.ts
  ```
  That runs the backend without compiling TypeScript.
