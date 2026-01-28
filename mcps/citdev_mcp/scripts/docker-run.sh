#!/bin/bash
# CitDev MCP Server - Docker Runner
#
# This script runs the CitDev MCP server in Docker for use with Cursor IDE.
# Token cache is ephemeral - destroyed when container stops.
#
# Usage:
#   ./scripts/docker-run.sh           # Run the MCP server
#   ./scripts/docker-run.sh --build   # Rebuild image before running
#
# For Cursor MCP configuration (~/.cursor/mcp.json):
# {
#   "mcpServers": {
#     "citdev": {
#       "command": "/path/to/citdev_mcp/scripts/docker-run.sh",
#       "args": []
#     }
#   }
# }

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
IMAGE_NAME="citdev-mcp:latest"

# Parse arguments
BUILD=false
for arg in "$@"; do
    case $arg in
        --build)
            BUILD=true
            shift
            ;;
    esac
done

# Ensure auth config exists
if [ ! -f "$PROJECT_DIR/.citdev-auth.json" ]; then
    echo "Error: .citdev-auth.json not found in $PROJECT_DIR" >&2
    echo "Copy .citdev-auth.example.json to .citdev-auth.json and configure it." >&2
    exit 1
fi

# Build image if requested or if it doesn't exist
if [ "$BUILD" = true ] || ! docker image inspect "$IMAGE_NAME" &>/dev/null; then
    echo "Building Docker image..." >&2
    docker build -t "$IMAGE_NAME" "$PROJECT_DIR" >&2
fi

# Function to open URL on host
open_url() {
    local url="$1"
    case "$(uname)" in
        Darwin) open "$url" ;;
        Linux) xdg-open "$url" 2>/dev/null || sensible-browser "$url" 2>/dev/null ;;
        MINGW*|CYGWIN*|MSYS*) start "" "$url" ;;
    esac
}

# Build docker run command
DOCKER_ARGS=(
    run --rm -i
    -e CITDEV_DOCKER=1
    -v "$PROJECT_DIR/.citdev-auth.json:/app/.citdev-auth.json:ro"
)

# Add port mappings for OIDC callback
if [[ "$(uname)" == "Linux" ]]; then
    # Linux: use host network for seamless localhost access
    DOCKER_ARGS+=(--network host)
else
    # macOS/Windows: publish callback ports explicitly
    DOCKER_ARGS+=(-p 8085:8085 -p 8086:8086 -p 8087:8087)
fi

DOCKER_ARGS+=("$IMAGE_NAME")

# Run container and intercept stderr for URL opening signals
# We use a named pipe to handle stderr while passing stdin/stdout through
FIFO=$(mktemp -u)
mkfifo "$FIFO"

# Background process to read stderr, open URLs, and forward other messages
(
    while IFS= read -r line; do
        if [[ "$line" == __CITDEV_OPEN_URL__:* ]]; then
            # Extract URL and open it on host
            url="${line#__CITDEV_OPEN_URL__:}"
            open_url "$url" &
        else
            # Forward other stderr messages
            echo "$line" >&2
        fi
    done < "$FIFO"
) &
STDERR_PID=$!

# Run docker with stderr redirected to our pipe
docker "${DOCKER_ARGS[@]}" 2>"$FIFO"
EXIT_CODE=$?

# Cleanup
wait $STDERR_PID 2>/dev/null
rm -f "$FIFO"

exit $EXIT_CODE
