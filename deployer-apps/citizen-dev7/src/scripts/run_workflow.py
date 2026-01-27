from __future__ import annotations

import os
from pathlib import Path
import sys
from datetime import datetime

import typer
from rich.console import Console
from rich.panel import Panel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Ensure project root is on sys.path when running as a script
CURRENT_FILE = Path(__file__).resolve()
PROJECT_ROOT = CURRENT_FILE.parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))
from llm.client import Settings
from workflows.workflow import KnowledgeWorkflow

app = typer.Typer(add_completion=False)
console = Console()


@app.command()
def run(
    objective: str = typer.Option(..., help="High-level goal (what to codify)."),
    inputs_dir: str = typer.Option("data/inputs", help="Directory with input files."),
    output_path: str = typer.Option("data/outputs/test.md", help="Where to write the test output."),
    append_timestamp: bool = typer.Option(True, help="Append a timestamp to the output filename to avoid overwrites."),
    settings_path: str = typer.Option("configs/settings.yaml", help="Path to settings YAML."),
    max_turns: int = typer.Option(3, help="Max researcher→synthesizer→critic loop turns."),
    agent: str = typer.Option(None, help="Specific agent to use (bypasses routing). Example: 'catchall', 'software_analyzer', 'recommendation'"),
):
    """
    Run the workflow with the given objective.

    If --agent is specified, runs that specific agent directly (bypasses routing).
    Otherwise, uses intelligent routing to select the best agent.
    """
    if not os.path.exists(settings_path):
        typer.secho(f"Settings file not found: {settings_path}", fg=typer.colors.RED)
        raise typer.Exit(code=2)
    if not os.path.isdir(inputs_dir):
        typer.secho(f"Inputs dir not found: {inputs_dir}", fg=typer.colors.RED)
        raise typer.Exit(code=2)

    settings = Settings.load(settings_path)
    wf = KnowledgeWorkflow(settings)

    if agent:
        console.print(Panel.fit(
            f"[bold]Objective[/bold]\n{objective}\n\n[bold]Agent[/bold]\n{agent} (routing bypassed)",
            subtitle="Direct Agent Test"
        ))
    else:
        console.print(Panel.fit(f"[bold]Objective[/bold]\n{objective}", subtitle="Knowledge Codification"))

    sop = wf.run(
        objective=objective,
        inputs_dir=inputs_dir,
        max_turns=max_turns,
        agent=agent,
    )
    # Prepare timestamped output path
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    if append_timestamp:
        if "{timestamp}" in output_path:
            final_output = output_path.replace("{timestamp}", ts)
            out_path = Path(final_output)
        else:
            p = Path(output_path)
            stamped_name = f"{p.stem}_{ts}{p.suffix or '.md'}"
            out_path = p.with_name(stamped_name)
    else:
        out_path = Path(output_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(sop, encoding="utf-8")
    typer.secho(f"Saved output to: {out_path}", fg=typer.colors.GREEN)


@app.command("models")
def list_models(
    settings_path: str = typer.Option("configs/settings.yaml", help="Path to settings YAML."),
    model_name: str = typer.Option("primary", help="Model config key to use for listing (provider/base_url/api_key)."),
):
    """
    Lists models from an OpenAI-compatible gateway using the configured base_url and api_key.
    """
    try:
        from openai import OpenAI  # type: ignore
    except Exception as e:
        typer.secho(f"OpenAI client not available: {e}", fg=typer.colors.RED)
        raise typer.Exit(code=1)

    if not os.path.exists(settings_path):
        typer.secho(f"Settings file not found: {settings_path}", fg=typer.colors.RED)
        raise typer.Exit(code=2)
    settings = Settings.load(settings_path)
    cfg = settings.models.get(model_name)
    if not cfg:
        typer.secho(f"Model '{model_name}' not found in settings", fg=typer.colors.RED)
        raise typer.Exit(code=2)
    if cfg.provider not in ("openai", "openai_compatible"):
        typer.secho(f"Listing is supported only for openai/openai_compatible providers. Got: {cfg.provider}", fg=typer.colors.YELLOW)
        raise typer.Exit(code=0)

    client = OpenAI(api_key=cfg.api_key, base_url=cfg.base_url)  # type: ignore
    resp = client.models.list()  # type: ignore
    models = getattr(resp, "data", []) or []
    if not models:
        typer.secho("No models returned.", fg=typer.colors.YELLOW)
        raise typer.Exit(code=0)
    console.print(Panel.fit(f"[bold]Base URL[/bold]\n{cfg.base_url or '(default)'}", subtitle="OpenAI-Compatible"))
    typer.echo("Models:")
    for m in models:
        mid = getattr(m, "id", None) or getattr(m, "model", None) or str(m)
        typer.echo(f"- {mid}")


if __name__ == "__main__":
    app()


