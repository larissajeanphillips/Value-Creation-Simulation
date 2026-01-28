/**
 * PKCE (Proof Key for Code Exchange) Utilities
 * 
 * Implements PKCE for secure OAuth 2.0 authorization code flow.
 */

import { randomBytes, createHash } from 'crypto';

/**
 * Generate a cryptographically random code verifier
 * Per RFC 7636, must be 43-128 characters from [A-Z] / [a-z] / [0-9] / "-" / "." / "_" / "~"
 */
export function generateCodeVerifier() {
  // Generate 32 random bytes and encode as base64url (will be 43 characters)
  const buffer = randomBytes(32);
  return base64UrlEncode(buffer);
}

/**
 * Generate the code challenge from the code verifier
 * Uses S256 method (SHA-256 hash, base64url encoded)
 */
export function generateCodeChallenge(codeVerifier) {
  const hash = createHash('sha256').update(codeVerifier).digest();
  return base64UrlEncode(hash);
}

/**
 * Generate a random state parameter for CSRF protection
 */
export function generateState() {
  return base64UrlEncode(randomBytes(16));
}

/**
 * Base64URL encode a buffer (RFC 4648)
 */
function base64UrlEncode(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate a complete PKCE pair
 */
export function generatePKCE() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = generateState();
  
  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: 'S256',
    state,
  };
}
