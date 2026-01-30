#!/bin/bash
#
# Local development script for running the Agent Chat app in Docker with hot reloading.
#
# Usage:
#   ./scripts/docker-dev.sh [--build]
#
# Options:
#   --build    Force rebuild the Docker image before running
#
# Prerequisites:
#   - Docker installed and running
#   - Environment variables set (or .env file in current directory):
#     - AI_GATEWAY_INSTANCE_ID
#     - AI_GATEWAY_API_KEY
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
IMAGE_NAME="agent-chat"
CONTAINER_NAME="agent-chat-dev"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Agent Chat - Local Docker Development${NC}"
echo ""

# Change to project directory
cd "$PROJECT_DIR"

# Check for .env file, create from .env.example if missing
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo -e "${YELLOW}📝 Creating .env from .env.example${NC}"
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Please edit .env and add your AI Gateway credentials${NC}"
        echo ""
        echo "Required values:"
        echo "  - AI_GATEWAY_INSTANCE_ID"
        echo "  - AI_GATEWAY_API_KEY"
        echo ""
        echo "Get these from Platform McKinsey > AI Gateway service"
        echo ""
        read -p "Press Enter after you've updated .env, or Ctrl+C to cancel..."
    else
        echo -e "${RED}❌ No .env or .env.example file found${NC}"
        exit 1
    fi
fi

# Load .env file
if [ -f ".env" ]; then
    echo -e "${GREEN}📦 Loading environment from .env file${NC}"
    set -a
    # shellcheck source=/dev/null
    source .env
    set +a
fi

# Check for required environment variables (only if using agent framework)
# For generic webapps, you may not need these - they're only required for agents
if [ -f "api.py" ] && grep -q "AI_GATEWAY" api.py 2>/dev/null; then
    if [ -z "$AI_GATEWAY_INSTANCE_ID" ] || [ -z "$AI_GATEWAY_API_KEY" ]; then
        echo -e "${YELLOW}⚠️  Agent framework detected but missing AI Gateway credentials${NC}"
        echo ""
        echo "If you're using the agent framework, please edit .env and set:"
        echo "  - AI_GATEWAY_INSTANCE_ID"
        echo "  - AI_GATEWAY_API_KEY"
        echo ""
        echo "Get these from Platform McKinsey > AI Gateway service"
        echo ""
        echo "If you're building a generic webapp, you can remove agent code from api.py"
        echo ""
        read -p "Press Enter to continue anyway, or Ctrl+C to cancel..."
    fi
fi

# Check if --build flag is passed or image doesn't exist
BUILD_IMAGE=false
if [ "$1" == "--build" ]; then
    BUILD_IMAGE=true
elif ! docker image inspect "$IMAGE_NAME" &> /dev/null; then
    echo -e "${YELLOW}📦 Docker image not found, building...${NC}"
    BUILD_IMAGE=true
fi

# Build image if needed
if [ "$BUILD_IMAGE" = true ]; then
    echo -e "${YELLOW}🔨 Building Docker image...${NC}"
    docker build -t "$IMAGE_NAME" .
    echo -e "${GREEN}✅ Image built successfully${NC}"
    echo ""
fi

# Stop existing container if running
if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
    echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
    docker stop "$CONTAINER_NAME" > /dev/null
fi

# Remove existing container if exists
if docker ps -aq -f name="$CONTAINER_NAME" | grep -q .; then
    docker rm "$CONTAINER_NAME" > /dev/null
fi

echo -e "${GREEN}🐳 Starting container with hot reload...${NC}"
echo ""
echo "Volume mounts (changes reflect immediately):"
echo "  - api.py      → API endpoints (hot reload ✅)"
echo "  - Any Python files → Backend code (hot reload ✅)"
if [ -d "agents" ]; then
  echo "  - agents/     → Agent implementations (hot reload ✅)"
fi
if [ -d "configs" ]; then
  echo "  - configs/    → Configuration files (hot reload ✅)"
fi
if [ -d "workflows" ]; then
  echo "  - workflows/  → Workflow logic (hot reload ✅)"
fi
if [ -d "reference" ]; then
  echo "  - reference/  → Reference data (hot reload ✅)"
fi
echo ""
echo -e "${YELLOW}Note: UI changes require rebuilding (run with --build)${NC}"
echo -e "${GREEN}Python files auto-reload thanks to uvicorn --reload flag${NC}"
echo ""
echo -e "${GREEN}🌐 App will be available at: http://localhost:3000${NC}"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Build volume mount arguments (only mount directories that exist)
VOLUME_MOUNTS=(
    -v "$PROJECT_DIR/api.py:/app/api.py"
)

# Conditionally mount agent-related directories if they exist
[ -d "$PROJECT_DIR/agents" ] && VOLUME_MOUNTS+=(-v "$PROJECT_DIR/agents:/app/agents")
[ -d "$PROJECT_DIR/configs" ] && VOLUME_MOUNTS+=(-v "$PROJECT_DIR/configs:/app/configs")
[ -d "$PROJECT_DIR/workflows" ] && VOLUME_MOUNTS+=(-v "$PROJECT_DIR/workflows:/app/workflows")
[ -d "$PROJECT_DIR/reference" ] && VOLUME_MOUNTS+=(-v "$PROJECT_DIR/reference:/app/reference")

# Build environment variable arguments
ENV_ARGS=()
[ -n "$AI_GATEWAY_INSTANCE_ID" ] && ENV_ARGS+=(-e "AI_GATEWAY_INSTANCE_ID=$AI_GATEWAY_INSTANCE_ID")
[ -n "$AI_GATEWAY_API_KEY" ] && ENV_ARGS+=(-e "AI_GATEWAY_API_KEY=$AI_GATEWAY_API_KEY")

# Run container with volume mounts for hot reloading
# Using --reload flag for uvicorn to enable Python hot reloading
docker run -it --rm \
    --name "$CONTAINER_NAME" \
    -p 3000:3000 \
    "${VOLUME_MOUNTS[@]}" \
    "${ENV_ARGS[@]}" \
    "$IMAGE_NAME" \
    uvicorn api:app --host 0.0.0.0 --port 3000 --reload
