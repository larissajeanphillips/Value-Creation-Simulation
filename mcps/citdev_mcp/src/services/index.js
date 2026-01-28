/**
 * Service Registry
 * 
 * Shared services that can be used across different tool domains.
 * Add services here for things like:
 * - API clients
 * - Database connections
 * - Authentication
 * - Logging
 * - Caching
 */

/**
 * Logger service for audit and debugging
 */
export const logger = {
  info: (message, data = {}) => {
    console.error(JSON.stringify({ level: 'info', message, ...data, timestamp: new Date().toISOString() }));
  },
  
  warn: (message, data = {}) => {
    console.error(JSON.stringify({ level: 'warn', message, ...data, timestamp: new Date().toISOString() }));
  },
  
  error: (message, data = {}) => {
    console.error(JSON.stringify({ level: 'error', message, ...data, timestamp: new Date().toISOString() }));
  },
  
  audit: (action, data = {}) => {
    console.error(JSON.stringify({ level: 'audit', action, ...data, timestamp: new Date().toISOString() }));
  },
};

/**
 * Configuration service
 * Loads configuration from environment variables
 */
export const config = {
  get: (key, defaultValue = undefined) => {
    return process.env[key] ?? defaultValue;
  },
  
  require: (key) => {
    const value = process.env[key];
    if (value === undefined) {
      throw new Error(`Required configuration missing: ${key}`);
    }
    return value;
  },
};
