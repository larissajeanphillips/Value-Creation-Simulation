/**
 * Authentication Module
 * 
 * Main entry point for OIDC authentication.
 */

export { login, getUserInfo, refreshToken } from './oidc-client.js';
export { 
  getProviderConfig, 
  getDefaultProvider, 
  getStackId,
  listProviders,
  validateConfig 
} from './config.js';
export { 
  storeTokens, 
  getTokens, 
  deleteTokens, 
  hasTokens,
  isTokenExpired 
} from './token-store.js';
export { generatePKCE } from './pkce.js';
export { discover, clearCache as clearDiscoveryCache } from './discovery.js';

import { login, refreshToken as refresh } from './oidc-client.js';
import { getTokens, storeTokens, isTokenExpired, deleteTokens } from './token-store.js';
import { getDefaultProvider } from './config.js';

/**
 * Get a valid access token, refreshing or re-authenticating if needed
 * 
 * @param {Object} options
 * @param {string} [options.provider] - Provider name
 * @param {boolean} [options.forceLogin] - Force new login even if tokens exist
 * @returns {Promise<string>} Access token
 */
export async function getAccessToken(options = {}) {
  const { provider = getDefaultProvider(), forceLogin = false } = options;
  
  if (!forceLogin) {
    // Check for existing tokens
    const tokens = await getTokens(provider);
    
    if (tokens) {
      // If not expired, return the access token
      if (!isTokenExpired(tokens)) {
        return tokens.access_token;
      }
      
      // Try to refresh if we have a refresh token
      if (tokens.refresh_token) {
        try {
          const newTokens = await refresh(tokens.refresh_token, { provider });
          await storeTokens(provider, newTokens);
          return newTokens.access_token;
        } catch (error) {
          console.error('Token refresh failed:', error.message);
          // Fall through to login
        }
      }
    }
  }
  
  // Perform fresh login
  const tokens = await login({ provider });
  await storeTokens(provider, tokens);
  return tokens.access_token;
}

/**
 * Logout - remove stored tokens
 */
export async function logout(options = {}) {
  const { provider = getDefaultProvider() } = options;
  await deleteTokens(provider);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(options = {}) {
  const { provider = getDefaultProvider() } = options;
  const tokens = await getTokens(provider);
  return tokens !== null && !isTokenExpired(tokens);
}
