# =============================================================================
# Agent Chat Application - Production Dockerfile
# Multi-stage build: React UI + Python FastAPI backend
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build React UI
# -----------------------------------------------------------------------------
FROM node:22.12.0-alpine3.21 AS ui-builder

WORKDIR /app/ui

# Copy dependency files first (layer caching optimization)
COPY ui/package.json ui/package-lock.json ./

# Install dependencies with cache mount for faster rebuilds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts

# Copy source and build
COPY ui/ ./
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Python dependencies builder
# -----------------------------------------------------------------------------
FROM python:3.12.8-slim-bookworm AS python-builder

WORKDIR /app

# Install build dependencies if needed (for compiled packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install to user directory
COPY requirements.txt ./

# Install dependencies with cache mount
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --user --no-cache-dir -r requirements.txt \
    && pip install --user --no-cache-dir fastapi uvicorn[standard] python-dotenv

# -----------------------------------------------------------------------------
# Stage 3: Production runtime
# -----------------------------------------------------------------------------
FROM python:3.12.8-slim-bookworm AS runner

WORKDIR /app

# Install minimal runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create non-root user for security
RUN useradd -m -u 1000 appuser \
    && chown -R appuser:appuser /app

# Copy Python dependencies from builder
COPY --from=python-builder /root/.local /home/appuser/.local
ENV PATH=/home/appuser/.local/bin:$PATH

# Copy application code (ordered by change frequency - least to most)
# Note: This template includes agent framework directories, but you can
# build any type of webapp - just replace api.py with your own FastAPI app
COPY --chown=appuser:appuser llm/ ./llm/
COPY --chown=appuser:appuser scripts/ ./scripts/
COPY --chown=appuser:appuser agents/ ./agents/
COPY --chown=appuser:appuser configs/ ./configs/
COPY --chown=appuser:appuser workflows/ ./workflows/
COPY --chown=appuser:appuser reference/ ./reference/
COPY --chown=appuser:appuser api.py ./

# Copy built UI static files from ui-builder
COPY --from=ui-builder --chown=appuser:appuser /app/ui/dist ./ui/dist

# Create data directories
RUN mkdir -p data/outputs \
    && chown -R appuser:appuser /app/data

# Switch to non-root user
USER appuser

# Environment configuration
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app

# Expose application port
EXPOSE 3000

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl --fail http://localhost:3000/api/health || exit 1

# Run FastAPI with uvicorn
# Note: --reload is enabled via docker-dev.sh for development
# In production, this runs without reload for better performance
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "3000"]
