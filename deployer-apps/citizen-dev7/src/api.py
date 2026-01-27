"""
FastAPI backend for the Agent Chat UI.

This provides a REST API that wraps the Agent Workspace Framework,
allowing the React frontend to interact with the agents.

Run with:
    uvicorn api:app --reload --port 3000
"""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Ensure project root is importable
import sys
PROJECT_ROOT = Path(__file__).parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from llm.client import Settings
from workflows.workflow import KnowledgeWorkflow

app = FastAPI(
    title="Agent Chat API",
    description="REST API for the Agent Workspace Framework",
    version="0.1.0",
)

# CORS configuration for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files path for production (built UI)
UI_DIST_PATH = PROJECT_ROOT / "ui" / "dist"

# Initialize workflow on startup
settings = Settings.load("configs/settings.yaml")
workflow = KnowledgeWorkflow(settings)


class AnalyzeRequest(BaseModel):
    """Request body for the analyze endpoint."""
    objective: str
    agent: str | None = None


class AnalyzeResponse(BaseModel):
    """Response body for the analyze endpoint."""
    result: str
    agent: str


class AgentsResponse(BaseModel):
    """Response body for the agents endpoint."""
    agents: list[str]


class HealthResponse(BaseModel):
    """Response body for the health endpoint."""
    status: str


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    """
    Send an objective to an agent and get a response.
    
    If `agent` is specified, bypasses routing and uses that agent directly.
    Otherwise, uses intelligent routing to select the best agent.
    """
    try:
        result = workflow.run(
            objective=request.objective,
            inputs_dir="reference",
            max_turns=1,
            agent=request.agent,
        )
        
        # Determine which agent was used
        if request.agent:
            used_agent = request.agent
        else:
            # Re-run routing to determine which agent was selected
            used_agent = workflow.choose_agent(request.objective)
        
        return AnalyzeResponse(result=result, agent=used_agent)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/agents", response_model=AgentsResponse)
async def list_agents():
    """List all available agents."""
    agent_names = [route.name for route in workflow.routing_config]
    return AgentsResponse(agents=agent_names)


@app.get("/api/health", response_model=HealthResponse)
async def health():
    """Health check endpoint."""
    return HealthResponse(status="healthy")


# Serve static UI files in production
# Mount static assets (JS, CSS, images)
if UI_DIST_PATH.exists():
    app.mount("/assets", StaticFiles(directory=UI_DIST_PATH / "assets"), name="assets")
    
    # Serve index.html for all non-API routes (SPA routing)
    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        """Serve the SPA for all non-API routes."""
        # Don't intercept API routes
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not found")
        
        # Serve static files if they exist
        file_path = UI_DIST_PATH / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        
        # Otherwise serve index.html for SPA routing
        return FileResponse(UI_DIST_PATH / "index.html")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
