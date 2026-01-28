# CitDev MCP Server
# 
# This Dockerfile builds the CitDev MCP server for containerized deployments.
# 
# Token cache is ephemeral - stored inside the container and destroyed on shutdown.
# Each session requires fresh authentication via browser.

# ============================================================================
# Build stage
# ============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/

# ============================================================================
# Production stage
# ============================================================================
FROM node:20-alpine AS production

# Add labels for container metadata
LABEL org.opencontainers.image.title="CitDev MCP Server" \
      org.opencontainers.image.description="MCP server for citizen developer operations" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.vendor="McKinsey & Company"

# Create non-root user for security
RUN addgroup -g 1001 -S citdev && \
    adduser -u 1001 -S citdev -G citdev

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy source from builder
COPY --from=builder /app/src ./src

# Create ephemeral token cache directory (destroyed when container stops)
RUN mkdir -p /home/citdev/.citdev && \
    chown -R citdev:citdev /home/citdev/.citdev

# Switch to non-root user
USER citdev

# Set HOME so token-store.js finds ~/.citdev
ENV HOME=/home/citdev
ENV NODE_ENV=production

# The MCP server uses stdio transport - no ports to expose
CMD ["node", "src/index.js"]
