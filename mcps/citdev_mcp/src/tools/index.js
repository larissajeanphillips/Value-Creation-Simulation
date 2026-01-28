/**
 * Tool Registry
 * 
 * Aggregates all tool domains and provides lookup functions.
 * Add new tool domains here as they are created.
 */

import * as userManagement from './user-management/index.js';

// Register all tool domains here
const toolDomains = [
  userManagement,
  // Future domains:
  // deployment,
  // configuration,
  // monitoring,
];

/**
 * Get all available tools from all domains
 */
export function getAllTools() {
  return toolDomains.flatMap(domain => domain.tools);
}

/**
 * Get the handler for a specific tool
 */
export function getHandler(toolName) {
  for (const domain of toolDomains) {
    if (domain.handlers[toolName]) {
      return domain.handlers[toolName];
    }
  }
  return null;
}

/**
 * Get all tool names
 */
export function getToolNames() {
  return getAllTools().map(tool => tool.name);
}
