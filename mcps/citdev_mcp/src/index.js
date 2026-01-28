#!/usr/bin/env node

/**
 * CitDev MCP Server
 * 
 * Entry point for the MCP server that provides citizen developer operations.
 */

import { createServer } from './server.js';

async function main() {
  const server = await createServer();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error('Failed to start CitDev MCP server:', error);
  process.exit(1);
});
