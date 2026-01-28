/**
 * Local Callback Server
 * 
 * Starts a temporary local HTTP server to receive the OAuth callback.
 * Designed for localhost-based OIDC flows on macOS.
 */

import { createServer } from 'http';
import { URL } from 'url';

/**
 * Default callback configuration
 */
const DEFAULT_PORT = 8085;
const CALLBACK_PATH = '/callback';

// In Docker, bind to 0.0.0.0 so port forwarding works
// The redirect URI still uses 127.0.0.1 (what the browser sees)
const LISTEN_HOST = process.env.CITDEV_DOCKER === '1' ? '0.0.0.0' : '127.0.0.1';
const REDIRECT_HOST = '127.0.0.1';

/**
 * HTML response for successful authentication
 */
const SUCCESS_HTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Authentication Successful</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .container {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    .checkmark {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: block;
      margin: 0 auto 20px;
      background: #4CAF50;
      position: relative;
    }
    .checkmark::after {
      content: '';
      position: absolute;
      left: 28px;
      top: 18px;
      width: 20px;
      height: 35px;
      border: solid white;
      border-width: 0 4px 4px 0;
      transform: rotate(45deg);
    }
    h1 { color: #333; margin-bottom: 10px; }
    p { color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="checkmark"></div>
    <h1>Authentication Successful</h1>
    <p>You can close this window and return to your terminal.</p>
  </div>
</body>
</html>
`;

/**
 * HTML response for authentication error
 */
const ERROR_HTML = (error, description) => `
<!DOCTYPE html>
<html>
<head>
  <title>Authentication Failed</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
    }
    .container {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      max-width: 400px;
    }
    .error-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: block;
      margin: 0 auto 20px;
      background: #f44336;
      position: relative;
    }
    .error-icon::before, .error-icon::after {
      content: '';
      position: absolute;
      left: 38px;
      top: 20px;
      width: 4px;
      height: 40px;
      background: white;
    }
    .error-icon::before { transform: rotate(45deg); }
    .error-icon::after { transform: rotate(-45deg); }
    h1 { color: #333; margin-bottom: 10px; }
    p { color: #666; }
    .error-detail { 
      background: #f5f5f5; 
      padding: 10px; 
      border-radius: 4px; 
      font-family: monospace;
      font-size: 12px;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="error-icon"></div>
    <h1>Authentication Failed</h1>
    <p>${description || 'An error occurred during authentication.'}</p>
    <div class="error-detail">Error: ${error}</div>
  </div>
</body>
</html>
`;

/**
 * Find an available port starting from the default
 */
async function findAvailablePort(startPort = DEFAULT_PORT) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(startPort, LISTEN_HOST, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && startPort < DEFAULT_PORT + 100) {
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
}

/**
 * Start a local callback server and wait for the authorization code
 * 
 * @param {Object} options
 * @param {string} options.expectedState - The state parameter to validate
 * @param {number} [options.timeout=300000] - Timeout in milliseconds (default: 5 minutes)
 * @param {number} [options.port] - Specific port to use (auto-selects if not specified)
 * @returns {Promise<{code: string, redirectUri: string}>}
 */
export function startCallbackServer(options) {
  const { expectedState, timeout = 300000, port: preferredPort } = options;
  
  return new Promise(async (resolve, reject) => {
    let server;
    let timeoutId;
    
    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (server) {
        server.close();
      }
    };
    
    try {
      const port = preferredPort || await findAvailablePort();
      const redirectUri = `http://${REDIRECT_HOST}:${port}${CALLBACK_PATH}`;
      
      server = createServer((req, res) => {
        const url = new URL(req.url, `http://${REDIRECT_HOST}:${port}`);
        
        // Only handle the callback path
        if (url.pathname !== CALLBACK_PATH) {
          res.writeHead(404);
          res.end('Not Found');
          return;
        }
        
        // Check for error response
        const error = url.searchParams.get('error');
        if (error) {
          const errorDescription = url.searchParams.get('error_description');
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(ERROR_HTML(error, errorDescription));
          cleanup();
          reject(new Error(`OAuth error: ${error} - ${errorDescription}`));
          return;
        }
        
        // Validate state parameter
        const state = url.searchParams.get('state');
        if (state !== expectedState) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(ERROR_HTML('state_mismatch', 'State parameter does not match. Possible CSRF attack.'));
          cleanup();
          reject(new Error('State parameter mismatch'));
          return;
        }
        
        // Get authorization code
        const code = url.searchParams.get('code');
        if (!code) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(ERROR_HTML('missing_code', 'No authorization code received.'));
          cleanup();
          reject(new Error('No authorization code received'));
          return;
        }
        
        // Success!
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(SUCCESS_HTML);
        cleanup();
        resolve({ code, redirectUri });
      });
      
      server.listen(port, LISTEN_HOST, () => {
        // Server is ready - resolve will happen when we receive the callback
      });
      
      server.on('error', (err) => {
        cleanup();
        reject(err);
      });
      
      // Set timeout
      timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('Authentication timed out. Please try again.'));
      }, timeout);
      
      // Return early with redirect URI so caller can build auth URL
      // The promise resolves when the callback is received
      
    } catch (err) {
      cleanup();
      reject(err);
    }
  });
}

/**
 * Get the redirect URI for a given port
 */
export function getRedirectUri(port = DEFAULT_PORT) {
  return `http://${REDIRECT_HOST}:${port}${CALLBACK_PATH}`;
}

/**
 * Start server and return both the promise and the redirect URI
 */
export async function createCallbackHandler(options) {
  const port = options.port || await findAvailablePort();
  const redirectUri = getRedirectUri(port);
  
  const callbackPromise = startCallbackServer({
    ...options,
    port,
  });
  
  return {
    redirectUri,
    waitForCallback: () => callbackPromise,
  };
}
