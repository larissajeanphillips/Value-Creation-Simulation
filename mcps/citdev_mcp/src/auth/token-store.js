/**
 * Token Store
 * 
 * Secure storage for OAuth tokens.
 * Uses the macOS Keychain via the security command for secure storage.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile, unlink } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const execAsync = promisify(exec);

const SERVICE_NAME = 'citdev-mcp';
const TOKEN_DIR = join(homedir(), '.citdev');
const TOKEN_FILE = join(TOKEN_DIR, 'tokens.json');

/**
 * Ensure token directory exists
 */
function ensureTokenDir() {
  if (!existsSync(TOKEN_DIR)) {
    mkdirSync(TOKEN_DIR, { mode: 0o700 });
  }
}

/**
 * Store tokens in macOS Keychain
 */
async function storeInKeychain(provider, tokens) {
  const account = `${SERVICE_NAME}-${provider}`;
  const data = JSON.stringify(tokens);
  
  // Delete existing entry if present
  try {
    await execAsync(`security delete-generic-password -s "${SERVICE_NAME}" -a "${account}" 2>/dev/null`);
  } catch {
    // Ignore error if entry doesn't exist
  }
  
  // Add new entry
  await execAsync(
    `security add-generic-password -s "${SERVICE_NAME}" -a "${account}" -w "${Buffer.from(data).toString('base64')}" -U`
  );
}

/**
 * Retrieve tokens from macOS Keychain
 */
async function getFromKeychain(provider) {
  const account = `${SERVICE_NAME}-${provider}`;
  
  try {
    const { stdout } = await execAsync(
      `security find-generic-password -s "${SERVICE_NAME}" -a "${account}" -w`
    );
    const data = Buffer.from(stdout.trim(), 'base64').toString('utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Delete tokens from macOS Keychain
 */
async function deleteFromKeychain(provider) {
  const account = `${SERVICE_NAME}-${provider}`;
  
  try {
    await execAsync(`security delete-generic-password -s "${SERVICE_NAME}" -a "${account}"`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Fallback: Store tokens in file (less secure)
 */
async function storeInFile(provider, tokens) {
  ensureTokenDir();
  
  let allTokens = {};
  if (existsSync(TOKEN_FILE)) {
    const content = await readFile(TOKEN_FILE, 'utf-8');
    allTokens = JSON.parse(content);
  }
  
  allTokens[provider] = {
    ...tokens,
    stored_at: new Date().toISOString(),
  };
  
  await writeFile(TOKEN_FILE, JSON.stringify(allTokens, null, 2), { mode: 0o600 });
}

/**
 * Fallback: Get tokens from file
 */
async function getFromFile(provider) {
  if (!existsSync(TOKEN_FILE)) {
    return null;
  }
  
  const content = await readFile(TOKEN_FILE, 'utf-8');
  const allTokens = JSON.parse(content);
  return allTokens[provider] || null;
}

/**
 * Fallback: Delete tokens from file
 */
async function deleteFromFile(provider) {
  if (!existsSync(TOKEN_FILE)) {
    return false;
  }
  
  const content = await readFile(TOKEN_FILE, 'utf-8');
  const allTokens = JSON.parse(content);
  
  if (!allTokens[provider]) {
    return false;
  }
  
  delete allTokens[provider];
  
  if (Object.keys(allTokens).length === 0) {
    await unlink(TOKEN_FILE);
  } else {
    await writeFile(TOKEN_FILE, JSON.stringify(allTokens, null, 2), { mode: 0o600 });
  }
  
  return true;
}

/**
 * Check if running on macOS
 */
function isMacOS() {
  return process.platform === 'darwin';
}

/**
 * Store tokens securely
 */
export async function storeTokens(provider, tokens) {
  if (isMacOS()) {
    try {
      await storeInKeychain(provider, tokens);
      return;
    } catch (error) {
      console.error('Keychain storage failed, falling back to file:', error.message);
    }
  }
  
  await storeInFile(provider, tokens);
}

/**
 * Retrieve stored tokens
 */
export async function getTokens(provider) {
  if (isMacOS()) {
    try {
      const tokens = await getFromKeychain(provider);
      if (tokens) return tokens;
    } catch {
      // Fall through to file-based storage
    }
  }
  
  return getFromFile(provider);
}

/**
 * Delete stored tokens
 */
export async function deleteTokens(provider) {
  let deleted = false;
  
  if (isMacOS()) {
    try {
      deleted = await deleteFromKeychain(provider);
    } catch {
      // Continue to try file deletion
    }
  }
  
  const fileDeleted = await deleteFromFile(provider);
  return deleted || fileDeleted;
}

/**
 * Check if tokens exist for a provider
 */
export async function hasTokens(provider) {
  const tokens = await getTokens(provider);
  return tokens !== null;
}

/**
 * Check if access token is expired
 */
export function isTokenExpired(tokens) {
  if (!tokens.stored_at || !tokens.expires_in) {
    return true;
  }
  
  const storedAt = new Date(tokens.stored_at).getTime();
  const expiresAt = storedAt + (tokens.expires_in * 1000);
  const now = Date.now();
  
  // Consider expired if within 5 minutes of expiry
  return now >= (expiresAt - 5 * 60 * 1000);
}
