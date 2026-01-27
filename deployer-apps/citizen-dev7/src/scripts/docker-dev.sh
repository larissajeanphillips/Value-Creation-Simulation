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

# Load .env file if it exists
if [ -f ".env" ]; then
    echo -e "${YELLOW}📦 Loading environment from .env file${NC}"
    set -a
    # shellcheck source=/dev/null
    source .env
    set +a
fi

# Check for required environment variables
if [ -z "$AI_GATEWAY_INSTANCE_ID" ] || [ -z "$AI_GATEWAY_API_KEY" ]; then
    echo -e "${RED}❌ Missing required environment variables${NC}"
    echo ""
    echo "Please set the following environment variables:"
    echo "  - AI_GATEWAY_INSTANCE_ID"
    echo "  - AI_GATEWAY_API_KEY"
    echo ""
    echo "You can either:"
    echo "  1. Create a .env file in the src/ directory"
    echo "  2. Export them in your shell before running this script"
    echo ""
    echo "Example .env file:"
    echo "  AI_GATEWAY_INSTANCE_ID=your_instance_id"
    echo "  AI_GATEWAY_API_KEY=your_api_key"
    exit 1
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
echo "  - agents/     → Agent implementations"
echo "  - configs/    → Prompts, routing, settings"
echo "  - workflows/  → Workflow logic"
echo "  - reference/  → Reference data"
echo "  - api.py      → API endpoints"
echo ""
echo -e "${YELLOW}Note: UI changes require rebuilding (run with --build)${NC}"
echo ""
echo -e "${GREEN}🌐 App will be available at: http://localhost:3000${NC}"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Run container with volume mounts for hot reloading
docker run -it --rm \
    --name "$CONTAINER_NAME" \
    -p 3000:3000 \
    -v "$PROJECT_DIR/agents:/app/agents" \
    -v "$PROJECT_DIR/configs:/app/configs" \
    -v "$PROJECT_DIR/workflows:/app/workflows" \
    -v "$PROJECT_DIR/reference:/app/reference" \
    -v "$PROJECT_DIR/api.py:/app/api.py" \
    -e AI_GATEWAY_INSTANCE_ID="$AI_GATEWAY_INSTANCE_ID" \
    -e AI_GATEWAY_API_KEY="$AI_GATEWAY_API_KEY" \
    "$IMAGE_NAME"
