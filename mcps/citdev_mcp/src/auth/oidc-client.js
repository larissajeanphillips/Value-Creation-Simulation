/**
 * OIDC Client
 * 
 * Handles the OIDC PKCE authorization flow.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { generatePKCE } from './pkce.js';
import { getAuthorizationEndpoint, getTokenEndpoint, getUserInfoEndpoint } from './discovery.js';
import { createCallbackHandler } from './callback-server.js';
import { getProviderConfig, validateConfig } from './config.js';

const execAsync = promisify(exec);

/**
 * Token response structure
 * @typedef {Object} TokenResponse
 * @property {string} access_token
 * @property {string} [id_token]
 * @property {string} [refresh_token]
 * @property {string} token_type
 * @property {number} expires_in
 * @property {string} [scope]
 */

/**
 * Build the authorization URL
 */
async function buildAuthorizationUrl(config, pkce, redirectUri) {
  const authEndpoint = await getAuthorizationEndpoint(config);
  const url = new URL(authEndpoint);
  
  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', config.scopes.join(' '));
  url.searchParams.set('state', pkce.state);
  url.searchParams.set('code_challenge', pkce.codeChallenge);
  url.searchParams.set('code_challenge_method', pkce.codeChallengeMethod);
  
  // Add audience if specified (for Auth0, etc.)
  if (config.audience) {
    url.searchParams.set('audience', config.audience);
  }
  
  return url.toString();
}

/**
 * Exchange authorization code for tokens
 */
async function exchangeCodeForTokens(config, code, codeVerifier, redirectUri) {
  const tokenEndpoint = await getTokenEndpoint(config);
  
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: config.clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });
  
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${response.status} - ${error}`);
  }
  
  return response.json();
}

/**
 * Open URL in default browser
 * Supports macOS, Linux, Windows, and Docker containers
 */
async function openBrowser(url) {
  const platform = process.platform;
  const isDocker = process.env.CITDEV_DOCKER === '1';
  
  // In Docker, we need to signal the host to open the browser
  // Output a special marker that the wrapper script can detect
  if (isDocker) {
    // Write to fd 3 if available (passed by wrapper script), otherwise stderr
    const marker = `__CITDEV_OPEN_URL__:${url}`;
    console.error(marker);
    return;
  }
  
  try {
    if (platform === 'darwin') {
      await execAsync(`open "${url}"`);
    } else if (platform === 'linux') {
      // Try xdg-open first, fall back to sensible-browser
      try {
        await execAsync(`xdg-open "${url}"`);
      } catch {
        await execAsync(`sensible-browser "${url}"`);
      }
    } else if (platform === 'win32') {
      await execAsync(`start "" "${url}"`);
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
  } catch (error) {
    // Browser couldn't be opened - print URL for manual opening
    console.error('Could not open browser automatically.');
    console.error('Please open the URL above manually in your browser.');
  }
}

/**
 * Perform OIDC PKCE login flow
 * 
 * @param {Object} options
 * @param {string} [options.provider] - Provider name (uses default if not specified)
 * @param {number} [options.timeout] - Timeout in milliseconds
 * @returns {Promise<TokenResponse>}
 */
export async function login(options = {}) {
  const { provider, timeout = 300000 } = options;
  
  // Load provider configuration
  const config = await getProviderConfig(provider);
  validateConfig(config);
  
  console.error(`Authenticating with ${config.name} (${config.issuer})...`);
  
  // Generate PKCE parameters
  const pkce = generatePKCE();
  
  // Start callback server
  const callbackHandler = await createCallbackHandler({
    expectedState: pkce.state,
    timeout,
  });
  
  // Build authorization URL
  const authUrl = await buildAuthorizationUrl(config, pkce, callbackHandler.redirectUri);
  
  console.error('Opening browser for authentication...');
  console.error(`If the browser doesn't open, visit: ${authUrl}`);
  
  // Open browser
  await openBrowser(authUrl);
  
  // Wait for callback
  const { code } = await callbackHandler.waitForCallback();
  
  console.error('Received authorization code, exchanging for tokens...');
  
  // Exchange code for tokens
  const tokens = await exchangeCodeForTokens(
    config,
    code,
    pkce.codeVerifier,
    callbackHandler.redirectUri
  );
  
  console.error('Authentication successful!');
  
  return tokens;
}

/**
 * Get user info using access token
 */
export async function getUserInfo(accessToken, options = {}) {
  const { provider } = options;
  const config = await getProviderConfig(provider);
  
  const userInfoEndpoint = await getUserInfoEndpoint(config);
  if (!userInfoEndpoint) {
    throw new Error('UserInfo endpoint not available');
  }
  
  const response = await fetch(userInfoEndpoint, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`UserInfo request failed: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Refresh an access token using a refresh token
 */
export async function refreshToken(refreshToken, options = {}) {
  const { provider } = options;
  const config = await getProviderConfig(provider);
  
  const tokenEndpoint = await getTokenEndpoint(config);
  
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: config.clientId,
    refresh_token: refreshToken,
  });
  
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${response.status} - ${error}`);
  }
  
  return response.json();
}
