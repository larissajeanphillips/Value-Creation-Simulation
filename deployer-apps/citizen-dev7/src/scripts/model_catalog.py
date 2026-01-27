"""
AI Gateway Model Catalog Utility

Fetches available models from the AI Gateway catalog with cost and configuration details.
Helps users select appropriate models for different tasks.

Usage:
    python scripts/model_catalog.py \\
        --base-url "https://api.prod.ai-gateway.quantumblack.com" \\
        --api-key "client_id:client_secret" \\
        --instance-id "your-instance-id" \\
        --provider anthropic  # optional filter

    # Or use with environment variables:
    export AI_GATEWAY_API_KEY="client_id:client_secret"
    export AI_GATEWAY_INSTANCE_ID="your-instance-id"
    python scripts/model_catalog.py
"""

from __future__ import annotations

import json
import os
import sys
from typing import Optional
from dataclasses import dataclass

try:
    import requests
    import typer
    from dotenv import load_dotenv
except ImportError:
    print("ERROR: Required packages not installed.")
    print("Please run: pip install requests typer python-dotenv")
    sys.exit(1)

# Load environment variables from .env file
load_dotenv()

app = typer.Typer()


@dataclass
class ModelInfo:
    """Information about a model from the AI Gateway catalog"""
    provider: str
    endpoint: str
    name: str
    input_cost: float  # per million tokens
    output_cost: float  # per million tokens
    classification: int


CLASSIFICATION_LABELS = {
    0: "Green",
    1: "Yellow",
    2: "Red",
    3: "Purple"
}


def fetch_catalog_models(
    base_url: str,
    api_key: str,
    instance_id: str,
    provider: Optional[str] = None
) -> list[ModelInfo]:
    """
    Fetch models from the AI Gateway catalog.

    Args:
        base_url: AI Gateway API base URL (e.g., https://api.prod.ai-gateway.quantumblack.com)
        api_key: Client credentials in format "client_id:client_secret"
        instance_id: Your AI Gateway instance ID
        provider: Optional provider filter (openai, anthropic, google_gemini, etc.)

    Returns:
        List of ModelInfo objects
    """
    url = f"{base_url}/v1/catalog/models"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "X-Instance-Id": instance_id
    }

    params = {}
    if provider:
        params["provider"] = provider

    try:
        response = requests.get(url, headers=headers, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()

        models = []
        for provider_info in data:
            provider_name = provider_info["name"]
            classification = provider_info["classification"]

            for endpoint in provider_info.get("endpoints", []):
                endpoint_slug = endpoint["slug"]

                for model in endpoint.get("models", []):
                    cost_info = model.get("cost", {})

                    models.append(ModelInfo(
                        provider=provider_name,
                        endpoint=endpoint_slug,
                        name=model["name"],
                        input_cost=cost_info.get("input_unit_cost", 0.0),
                        output_cost=cost_info.get("output_unit_cost", 0.0),
                        classification=classification
                    ))

        return models

    except requests.exceptions.RequestException as e:
        typer.echo(f"ERROR: Failed to fetch models from AI Gateway: {e}", err=True)
        sys.exit(1)
    except (KeyError, json.JSONDecodeError) as e:
        typer.echo(f"ERROR: Unexpected response format from AI Gateway: {e}", err=True)
        sys.exit(1)


def print_models_table(models: list[ModelInfo]) -> None:
    """Print models in a formatted table"""
    if not models:
        typer.echo("No models found.")
        return

    # Group by provider
    providers = {}
    for model in models:
        if model.provider not in providers:
            providers[model.provider] = []
        providers[model.provider].append(model)

    for provider_name, provider_models in sorted(providers.items()):
        classification = provider_models[0].classification
        classification_label = CLASSIFICATION_LABELS.get(classification, "Unknown")

        typer.echo(f"\n{'='*80}")
        typer.echo(f"Provider: {provider_name.upper()}")
        typer.echo(f"Classification: {classification} ({classification_label})")
        typer.echo(f"{'='*80}")

        # Print header
        typer.echo(f"{'Model Name':<40} {'Input Cost':<15} {'Output Cost':<15}")
        typer.echo(f"{'-'*40} {'-'*15} {'-'*15}")

        # Print models sorted by input cost
        for model in sorted(provider_models, key=lambda m: m.input_cost):
            input_cost_str = f"${model.input_cost}/M tokens"
            output_cost_str = f"${model.output_cost}/M tokens"
            typer.echo(f"{model.name:<40} {input_cost_str:<15} {output_cost_str:<15}")


def suggest_models(models: list[ModelInfo]) -> None:
    """Suggest models for different use cases"""
    typer.echo(f"\n{'='*80}")
    typer.echo("MODEL SELECTION SUGGESTIONS")
    typer.echo(f"{'='*80}\n")

    # Find cheapest fast model for routing
    cheap_models = sorted(models, key=lambda m: m.input_cost + m.output_cost)[:3]

    typer.echo("For ROUTING (fast, cheap, simple decisions):")
    typer.echo("Recommended: Models with low cost and fast response times")
    for i, model in enumerate(cheap_models, 1):
        total_cost = model.input_cost + model.output_cost
        typer.echo(f"  {i}. {model.name} ({model.provider}) - Total: ${total_cost:.2f}/M tokens")

    # Find powerful models for analysis
    typer.echo("\nFor ANALYSIS (powerful, comprehensive reasoning):")
    typer.echo("Recommended: Latest/most capable models from each provider")

    # Get latest models (heuristic: models with higher version numbers or 'latest' in name)
    analysis_candidates = []
    seen_providers = set()

    for model in sorted(models, key=lambda m: (m.provider, m.name), reverse=True):
        if model.provider not in seen_providers:
            if any(keyword in model.name.lower() for keyword in ['4o', '3.5', 'sonnet', 'opus', 'gemini', 'pro', 'ultra']):
                analysis_candidates.append(model)
                seen_providers.add(model.provider)

    for i, model in enumerate(analysis_candidates[:5], 1):
        total_cost = model.input_cost + model.output_cost
        typer.echo(f"  {i}. {model.name} ({model.provider}) - Total: ${total_cost:.2f}/M tokens")

    typer.echo("\nFor COST OPTIMIZATION:")
    typer.echo("Consider balancing quality and cost based on your use case.")
    typer.echo("Start with mid-tier models and adjust based on output quality.")


@app.command()
def list_models(
    base_url: str = typer.Option(
        "https://api.prod.ai-gateway.quantumblack.com",
        "--base-url",
        help="AI Gateway API base URL"
    ),
    api_key: str = typer.Option(
        None,
        "--api-key",
        envvar="AI_GATEWAY_API_KEY",
        help="Client credentials (client_id:client_secret)"
    ),
    instance_id: str = typer.Option(
        None,
        "--instance-id",
        envvar="AI_GATEWAY_INSTANCE_ID",
        help="Your AI Gateway instance ID"
    ),
    provider: Optional[str] = typer.Option(
        None,
        "--provider",
        help="Filter by provider (openai, anthropic, google_gemini, etc.)"
    ),
    suggest: bool = typer.Option(
        True,
        "--suggest/--no-suggest",
        help="Show model selection suggestions"
    ),
    json_output: bool = typer.Option(
        False,
        "--json",
        help="Output as JSON"
    )
):
    """
    Fetch and display available models from the AI Gateway catalog.

    Examples:
        # List all models with suggestions
        python scripts/model_catalog.py \\
            --api-key "client_id:client_secret" \\
            --instance-id "your-instance-id"

        # List only Anthropic models
        python scripts/model_catalog.py \\
            --api-key "client_id:client_secret" \\
            --instance-id "your-instance-id" \\
            --provider anthropic

        # Output as JSON for programmatic use
        python scripts/model_catalog.py \\
            --api-key "client_id:client_secret" \\
            --instance-id "your-instance-id" \\
            --json
    """
    if not api_key:
        typer.echo("ERROR: API key is required. Provide via --api-key or AI_GATEWAY_API_KEY env var.", err=True)
        typer.echo("Format: client_id:client_secret", err=True)
        raise typer.Exit(1)

    if not instance_id:
        typer.echo("ERROR: Instance ID is required. Provide via --instance-id or AI_GATEWAY_INSTANCE_ID env var.", err=True)
        raise typer.Exit(1)

    typer.echo("Fetching models from AI Gateway...")
    models = fetch_catalog_models(base_url, api_key, instance_id, provider)

    if json_output:
        # Output as JSON
        json_data = [
            {
                "provider": m.provider,
                "endpoint": m.endpoint,
                "name": m.name,
                "input_cost": m.input_cost,
                "output_cost": m.output_cost,
                "classification": m.classification
            }
            for m in models
        ]
        typer.echo(json.dumps(json_data, indent=2))
    else:
        # Human-readable output
        print_models_table(models)

        if suggest and models:
            suggest_models(models)

        typer.echo(f"\nTotal models: {len(models)}")


if __name__ == "__main__":
    app()
