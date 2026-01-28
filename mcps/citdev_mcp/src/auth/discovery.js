/**
 * OIDC Discovery
 * 
 * Fetches and caches OIDC provider metadata from the well-known endpoint.
 */

// Cache for discovered endpoints
const discoveryCache = new Map();

/**
 * OIDC Discovery document structure
 * @typedef {Object} OIDCDiscoveryDocument
 * @property {string} issuer
 * @property {string} authorization_endpoint
 * @property {string} token_endpoint
 * @property {string} [userinfo_endpoint]
 * @property {string} [revocation_endpoint]
 * @property {string} [end_session_endpoint]
 * @property {string[]} [scopes_supported]
 * @property {string[]} [response_types_supported]
 * @property {string[]} [code_challenge_methods_supported]
 */

/**
 * Fetch OIDC discovery document from the issuer
 */
export async function discover(issuer) {
  // Check cache first
  if (discoveryCache.has(issuer)) {
    return discoveryCache.get(issuer);
  }
  
  // Normalize issuer URL
  const issuerUrl = issuer.endsWith('/') ? issuer.slice(0, -1) : issuer;
  const discoveryUrl = `${issuerUrl}/.well-known/openid-configuration`;
  
  try {
    const response = await fetch(discoveryUrl);
    
    if (!response.ok) {
      throw new Error(`Discovery request failed: ${response.status} ${response.statusText}`);
    }
    
    const document = await response.json();
    
    // Validate required fields
    if (!document.authorization_endpoint) {
      throw new Error('Discovery document missing authorization_endpoint');
    }
    if (!document.token_endpoint) {
      throw new Error('Discovery document missing token_endpoint');
    }
    
    // Verify PKCE support
    if (document.code_challenge_methods_supported && 
        !document.code_challenge_methods_supported.includes('S256')) {
      console.error('Warning: IdP may not support S256 PKCE method');
    }
    
    // Cache the result
    discoveryCache.set(issuer, document);
    
    return document;
  } catch (error) {
    throw new Error(`OIDC discovery failed for ${issuer}: ${error.message}`);
  }
}

/**
 * Get authorization endpoint for a provider config
 */
export async function getAuthorizationEndpoint(config) {
  if (config.authorizationEndpoint) {
    return config.authorizationEndpoint;
  }
  const document = await discover(config.issuer);
  return document.authorization_endpoint;
}

/**
 * Get token endpoint for a provider config
 */
export async function getTokenEndpoint(config) {
  if (config.tokenEndpoint) {
    return config.tokenEndpoint;
  }
  const document = await discover(config.issuer);
  return document.token_endpoint;
}

/**
 * Get userinfo endpoint for a provider config
 */
export async function getUserInfoEndpoint(config) {
  if (config.userInfoEndpoint) {
    return config.userInfoEndpoint;
  }
  const document = await discover(config.issuer);
  return document.userinfo_endpoint;
}

/**
 * Clear the discovery cache
 */
export function clearCache() {
  discoveryCache.clear();
}
