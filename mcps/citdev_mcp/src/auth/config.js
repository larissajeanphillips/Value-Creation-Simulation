/**
 * Authentication Configuration
 * 
 * Manages OIDC provider configurations. Supports multiple IdPs through
 * environment variables or configuration files.
 */

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// Default configuration file locations
const CONFIG_LOCATIONS = [
  join(process.cwd(), '.citdev-auth.json'),
  join(homedir(), '.citdev-auth.json'),
];

/**
 * OIDC Provider configuration schema
 * @typedef {Object} OIDCProviderConfig
 * @property {string} issuer - The OIDC issuer URL (e.g., https://auth.mckinsey.id/auth/realms/r)
 * @property {string} clientId - The OAuth client ID
 * @property {string} [stackId] - The McKinsey ID Stack ID (application UUID)
 * @property {string} [authorizationEndpoint] - Override authorization endpoint
 * @property {string} [tokenEndpoint] - Override token endpoint
 * @property {string} [userInfoEndpoint] - Override userinfo endpoint
 * @property {string[]} [scopes] - Scopes to request (default: openid, profile, email)
 */

/**
 * Default scopes for OIDC
 */
const DEFAULT_SCOPES = ['openid', 'profile', 'email'];

/**
 * Load configuration from file
 */
async function loadConfigFile() {
  for (const configPath of CONFIG_LOCATIONS) {
    if (existsSync(configPath)) {
      try {
        const content = await readFile(configPath, 'utf-8');
        return JSON.parse(content);
      } catch (error) {
        console.error(`Failed to load config from ${configPath}:`, error.message);
      }
    }
  }
  return null;
}

/**
 * Load provider configuration from environment variables
 */
function loadFromEnv(providerName) {
  const prefix = `CITDEV_AUTH_${providerName.toUpperCase()}`;
  
  const issuer = process.env[`${prefix}_ISSUER`];
  const clientId = process.env[`${prefix}_CLIENT_ID`];
  
  if (!issuer || !clientId) {
    return null;
  }
  
  return {
    issuer,
    clientId,
    stackId: process.env[`${prefix}_STACK_ID`],
    authorizationEndpoint: process.env[`${prefix}_AUTHORIZATION_ENDPOINT`],
    tokenEndpoint: process.env[`${prefix}_TOKEN_ENDPOINT`],
    userInfoEndpoint: process.env[`${prefix}_USERINFO_ENDPOINT`],
    scopes: process.env[`${prefix}_SCOPES`]?.split(',').map(s => s.trim()),
  };
}

/**
 * Get the default provider name
 */
export function getDefaultProvider() {
  return process.env.CITDEV_AUTH_PROVIDER || 'default';
}

/**
 * Get the configured Stack ID (McKinsey ID application UUID)
 * 
 * Order of precedence:
 * 1. CITDEV_STACK_ID environment variable (top-level, provider-agnostic)
 * 2. CITDEV_AUTH_{PROVIDER}_STACK_ID environment variable
 * 3. stackId in the provider configuration file
 * 
 * @param {string} [providerName] - Provider name (defaults to default provider)
 * @returns {Promise<string|null>} The Stack ID or null if not configured
 */
export async function getStackId(providerName = getDefaultProvider()) {
  // 1. Check top-level environment variable
  if (process.env.CITDEV_STACK_ID) {
    return process.env.CITDEV_STACK_ID;
  }
  
  // 2. Check provider-specific environment variable
  const prefix = `CITDEV_AUTH_${providerName.toUpperCase()}`;
  if (process.env[`${prefix}_STACK_ID`]) {
    return process.env[`${prefix}_STACK_ID`];
  }
  
  // 3. Check configuration file
  const fileConfig = await loadConfigFile();
  if (fileConfig?.providers?.[providerName]?.stackId) {
    return fileConfig.providers[providerName].stackId;
  }
  
  return null;
}

/**
 * Get configuration for a specific provider
 */
export async function getProviderConfig(providerName = getDefaultProvider()) {
  // First, try environment variables
  const envConfig = loadFromEnv(providerName);
  if (envConfig) {
    return {
      name: providerName,
      ...envConfig,
      scopes: envConfig.scopes || DEFAULT_SCOPES,
    };
  }
  
  // Then, try configuration file
  const fileConfig = await loadConfigFile();
  if (fileConfig?.providers?.[providerName]) {
    const config = fileConfig.providers[providerName];
    return {
      name: providerName,
      ...config,
      scopes: config.scopes || DEFAULT_SCOPES,
    };
  }
  
  throw new Error(
    `No configuration found for provider "${providerName}". ` +
    `Set CITDEV_AUTH_${providerName.toUpperCase()}_ISSUER and CITDEV_AUTH_${providerName.toUpperCase()}_CLIENT_ID ` +
    `environment variables, or create a config file at ${CONFIG_LOCATIONS[0]}`
  );
}

/**
 * List all configured providers
 */
export async function listProviders() {
  const providers = new Set();
  
  // Check environment variables for provider patterns
  for (const key of Object.keys(process.env)) {
    const match = key.match(/^CITDEV_AUTH_([A-Z0-9_]+)_ISSUER$/);
    if (match) {
      providers.add(match[1].toLowerCase());
    }
  }
  
  // Check configuration file
  const fileConfig = await loadConfigFile();
  if (fileConfig?.providers) {
    for (const name of Object.keys(fileConfig.providers)) {
      providers.add(name);
    }
  }
  
  return Array.from(providers);
}

/**
 * Validate provider configuration
 */
export function validateConfig(config) {
  const required = ['issuer', 'clientId'];
  const missing = required.filter(field => !config[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
  
  // Validate issuer URL
  try {
    new URL(config.issuer);
  } catch {
    throw new Error(`Invalid issuer URL: ${config.issuer}`);
  }
  
  return true;
}
