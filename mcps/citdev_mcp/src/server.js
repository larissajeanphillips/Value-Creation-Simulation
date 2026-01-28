/**
 * MCP Server Configuration and Setup
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { getAllTools, getHandler, getToolNames } from './tools/index.js';
import { logger } from './services/index.js';

/**
 * Creates and configures the MCP server
 */
export async function createServer() {
  const server = new Server(
    {
      name: 'citdev-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register the list tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: getAllTools(),
    };
  });

  // Register the call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    const handler = getHandler(name);
    
    if (!handler) {
      return {
        content: [
          {
            type: 'text',
            text: `Unknown tool: ${name}`,
          },
        ],
        isError: true,
      };
    }

    try {
      const result = await handler(args);
      return {
        content: [
          {
            type: 'text',
            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error executing ${name}: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Connect using stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log startup information
  const tools = getToolNames();
  logger.info('CitDev MCP server started', {
    transport: 'stdio',
    version: '1.0.0',
    tools_available: tools,
    tools_count: tools.length
  });

  return server;
}
