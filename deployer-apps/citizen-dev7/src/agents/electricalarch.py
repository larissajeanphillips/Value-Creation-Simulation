# ============================================================================
# EXAMPLE AGENT - Automotive Industry
# ============================================================================
# This is an example agent for automotive electrical architecture cost optimization.
# Replace this with your own industry-specific agents.
# See SETUP.md and .cursor/rules/ for instructions on generating new agents.
# ============================================================================

from __future__ import annotations

from agents.base import AgentSpec, BaseAgent
from llm.client import Settings, get_model_client


def create_electricalarch(settings: Settings, system_prompt: str) -> BaseAgent:
    model_name = settings.defaults.get("electricalarch_model", "primary")
    client = get_model_client(settings, model_name)
    spec = AgentSpec(
        name="electricalarch",
        system_prompt=system_prompt,
        model_name=model_name,
        tools={},
    )
    return BaseAgent(spec, client)

