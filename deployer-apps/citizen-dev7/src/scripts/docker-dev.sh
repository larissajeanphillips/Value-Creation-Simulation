#!/bin/bash
#
# Local development script for running the Agent Chat app in Docker with hot reloading.
#
# Usage:
#   ./scripts/docker-dev.sh [--build] [--ui-dev]
#
# Options:
#   --build    Force rebuild the Docker image before running
#   --ui-dev   Run Vite dev server for instant UI hot reload (no rebuild needed for UI changes)
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
UI_DEV_MODE=false

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

# Parse command line arguments
BUILD_IMAGE=false
for arg in "$@"; do
    case $arg in
        --build)
            BUILD_IMAGE=true
            ;;
        --ui-dev)
            UI_DEV_MODE=true
            ;;
    esac
done


# Determine which image to use
if [ "$UI_DEV_MODE" = true ]; then
    IMAGE_NAME="agent-chat-dev"
    BUILD_TARGET="dev"
else
    BUILD_TARGET="runner"
fi

# Build image if needed
if [ "$BUILD_IMAGE" = true ]; then
    echo -e "${YELLOW}🔨 Building Docker image (target: $BUILD_TARGET)...${NC}"
    docker build --target "$BUILD_TARGET" -t "$IMAGE_NAME" .
    echo -e "${GREEN}✅ Image built successfully${NC}"
    echo ""
elif ! docker image inspect "$IMAGE_NAME" &> /dev/null; then
    echo -e "${YELLOW}📦 Docker image '$IMAGE_NAME' not found, building...${NC}"
    docker build --target "$BUILD_TARGET" -t "$IMAGE_NAME" .
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

if [ "$UI_DEV_MODE" = true ]; then
    echo -e "${GREEN}🎨 UI Dev Mode enabled - UI changes hot reload instantly!${NC}"
    echo "  - ui/src/     → React components (hot reload ✅)"
    echo ""
    echo -e "${GREEN}🌐 UI available at: http://localhost:5173${NC}"
    echo -e "${GREEN}🌐 API available at: http://localhost:3000${NC}"
else
    echo -e "${YELLOW}Note: UI changes require rebuilding (run with --build)${NC}"
    echo -e "${YELLOW}Tip: Use --ui-dev for instant UI hot reload${NC}"
    echo ""
    echo -e "${GREEN}🌐 App will be available at: http://localhost:3000${NC}"
fi

echo -e "${GREEN}Python files auto-reload thanks to uvicorn --reload flag${NC}"
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

# UI Dev Mode: Run both backend and Vite dev server
if [ "$UI_DEV_MODE" = true ]; then
    # Mount UI source for hot reloading
    VOLUME_MOUNTS+=(-v "$PROJECT_DIR/ui/src:/app/ui/src")
    VOLUME_MOUNTS+=(-v "$PROJECT_DIR/ui/index.html:/app/ui/index.html")
    VOLUME_MOUNTS+=(-v "$PROJECT_DIR/ui/vite.config.ts:/app/ui/vite.config.ts")
    VOLUME_MOUNTS+=(-v "$PROJECT_DIR/ui/tailwind.config.js:/app/ui/tailwind.config.js")
    VOLUME_MOUNTS+=(-v "$PROJECT_DIR/ui/postcss.config.js:/app/ui/postcss.config.js")
    VOLUME_MOUNTS+=(-v "$PROJECT_DIR/ui/tsconfig.json:/app/ui/tsconfig.json")
    
    # Run container with both services
    docker run -it --rm \
        --name "$CONTAINER_NAME" \
        -p 3000:3000 \
        -p 5173:5173 \
        "${VOLUME_MOUNTS[@]}" \
        "${ENV_ARGS[@]}" \
        "$IMAGE_NAME" \
        sh -c "cd /app/ui && npm install --silent && (npm run dev &) && cd /app && uvicorn api:app --host 0.0.0.0 --port 3000 --reload"
else
    # Standard mode: just run backend with pre-built UI
    docker run -it --rm \
        --name "$CONTAINER_NAME" \
        -p 3000:3000 \
        "${VOLUME_MOUNTS[@]}" \
        "${ENV_ARGS[@]}" \
        "$IMAGE_NAME" \
        uvicorn api:app --host 0.0.0.0 --port 3000 --reload
fi
