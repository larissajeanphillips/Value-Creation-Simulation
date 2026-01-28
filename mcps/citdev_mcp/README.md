# CitDev MCP Server

An MCP (Model Context Protocol) server that provides citizen developers with authorized operations for managing their applications. This server exposes a set of controlled, secure tools for common operational tasks.

## Features

### Current Capabilities

- **User Management** - Add and remove users from applications
- **OIDC Authentication** - Secure PKCE-based authentication with McKinsey ID

### Planned Capabilities

- **Deployment Operations** - Deploy, rollback, and manage application versions
- **Configuration Management** - Update application settings and environment variables
- **Monitoring & Logs** - Access application logs and health metrics

## Architecture

The server is built with a modular architecture to easily add new operational domains:

```
src/
├── index.js              # MCP server entry point
├── server.js             # Server configuration and setup
├── auth/                 # OIDC authentication module
│   ├── index.js          # Auth module entry point
│   ├── config.js         # Provider configuration management
│   ├── pkce.js           # PKCE code generation
│   ├── discovery.js      # OIDC discovery endpoint handling
│   ├── callback-server.js # Local OAuth callback server
│   ├── oidc-client.js    # OIDC client implementation
│   └── token-store.js    # Secure token storage (macOS Keychain)
├── tools/
│   ├── index.js          # Tool registry and aggregation
│   └── user-management/  # User management tools
│       ├── index.js      # Tool definitions
│       └── handlers.js   # Business logic handlers
├── services/             # Shared services
│   └── index.js          # Service registry
└── utils/
    └── validation.js     # Input validation utilities
```

## Installation

```bash
npm install
```

## Authentication Setup

The server uses OIDC PKCE flow for authentication with McKinsey ID. Authentication is required before making user management API calls.

### Configuration

You can configure the McKinsey ID connection using either environment variables or a configuration file.

#### Option 1: Environment Variables

Set the following environment variables:

```bash
# McKinsey ID configuration
export CITDEV_AUTH_DEFAULT_ISSUER="https://auth.mckinsey.id/auth/realms/r"
export CITDEV_AUTH_DEFAULT_CLIENT_ID="your-client-id"
export CITDEV_AUTH_DEFAULT_STACK_ID="your-stack-id"  # Optional: default Stack for operations
export CITDEV_AUTH_DEFAULT_SCOPES="openid,profile,email"  # Optional

# Alternative: top-level Stack ID (takes precedence)
export CITDEV_STACK_ID="your-stack-id"
```

#### Option 2: Configuration File

Create a `.citdev-auth.json` file in your project directory or home directory:

```json
{
  "providers": {
    "default": {
      "issuer": "https://auth.mckinsey.id/auth/realms/r",
      "clientId": "your-client-id",
      "stackId": "your-stack-id",
      "scopes": ["openid", "profile", "email"]
    }
  }
}
```

See `.citdev-auth.example.json` for a complete example.

### Stack ID Configuration

The `stackId` identifies the McKinsey ID Stack (tenant) you want to manage. It can be configured in order of precedence:

1. **`CITDEV_STACK_ID` environment variable** - Top-level, provider-agnostic
2. **`CITDEV_AUTH_DEFAULT_STACK_ID` environment variable** - Provider-specific
3. **`stackId` in configuration file** - In the provider's JSON configuration

When a `stackId` is configured, tools can use it as the default application ID for operations.

### McKinsey ID Setup

McKinsey ID is a multi-tenant identity provider where each **Stack** represents a tenant. To use this MCP server with McKinsey ID, you need:

1. **Stack Ownership**: You must be an **Owner** of the Stack (application) you want to manage. Owners have administrative privileges over the Stack, including the ability to add/remove users.

2. **OIDC PKCE Asset**: Create an OIDC PKCE client asset in your Stack with the correct audience and redirect URIs. This client will be used by the MCP server to authenticate and call the McKinsey ID GraphQL API.

#### Creating the OIDC PKCE Asset

Run the following GraphQL mutation against the McKinsey ID API (`https://api.mckinsey.id/v2/graphql`) to create the OAuth client:

```graphql
mutation {
  CreateOidcPkceAsset(
    name: "citdev-mcp",
    label: "citdev-mcp",
    stackId: "YOUR_STACK_ID",
    asset: {
      audienceSource: McKinseyIdApiV2,
      redirectUris: [
        "http://127.0.0.1:8085/callback",
        "http://127.0.0.1:8086/callback",
        "http://127.0.0.1:8087/callback"
      ],
      corsOrigins: [
        "http://127.0.0.1:8085/callback",
        "http://127.0.0.1:8086/callback",
        "http://127.0.0.1:8087/callback"
      ]
    }
  ) {
    clientId
  }
}
```

**Important configuration notes:**

| Setting | Value | Description |
|---------|-------|-------------|
| `audienceSource` | `McKinseyIdApiV2` | Required for the token to be accepted by the GraphQL API |
| `redirectUris` | `http://127.0.0.1:8085-8087/callback` | Multiple ports in case default is busy |
| `corsOrigins` | Same as redirectUris | Required for the localhost callback |

The mutation returns a `clientId` - use this in your `.citdev-auth.json` configuration:

```json
{
  "providers": {
    "default": {
      "issuer": "https://auth.mckinsey.id/auth/realms/r",
      "clientId": "YOUR_CLIENT_ID_FROM_MUTATION",
      "scopes": ["openid", "profile", "email"]
    }
  }
}
```

#### McKinsey ID Concepts

| Concept | Description |
|---------|-------------|
| **Stack** | A tenant in McKinsey ID. Each Stack has its own users, groups, and assets. |
| **Owner** | An administrator of a Stack who can manage users, groups, and assets. |
| **Member** | A user who has access to a Stack but cannot manage it. |
| **Asset** | An OAuth client (OIDC or SAML) registered in a Stack. |

### Token Storage

Tokens are stored securely using:
- **macOS**: Keychain (via `security` command)
- **Fallback**: Encrypted file at `~/.citdev/tokens.json`

## Usage

### Running the Server

```bash
npm start
```

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Running with Docker

The server can be run in a Docker container. Token cache is ephemeral - stored inside the container and destroyed when it stops. Each session requires fresh authentication.

**Build the image:**

```bash
docker build -t citdev-mcp .
```

**Run with Docker Compose:**

```bash
docker compose run --rm citdev-mcp
```

**Run directly with Docker:**

```bash
docker run --rm -i \
  -v ./.citdev-auth.json:/app/.citdev-auth.json:ro \
  citdev-mcp
```

On first tool use, your browser will open for authentication. Tokens are cached for the duration of the container session.

## Using with Cursor IDE

This MCP server integrates with [Cursor](https://cursor.sh) to give AI assistants the ability to manage users in your applications through natural language.

### Step 1: Install Dependencies

First, clone the repository and install dependencies:

```bash
cd /path/to/citdev_mcp
npm install
```

### Step 2: Configure Authentication

Create a `.citdev-auth.json` file in the project directory with your OAuth client configuration:

```json
{
  "providers": {
    "default": {
      "issuer": "https://auth.mckinsey.id/auth/realms/r",
      "clientId": "YOUR_CLIENT_ID",
      "scopes": ["openid", "profile", "email"]
    }
  }
}
```

See [McKinsey ID Setup](#mckinsey-id-setup) for how to obtain a client ID.

### Step 3: Add to Cursor MCP Configuration

1. Open Cursor Settings (`Cmd + ,` on macOS)
2. Search for "MCP" or navigate to **Features > MCP Servers**
3. Click "Edit in settings.json" or manually edit your Cursor configuration file

Add the CitDev MCP server to your configuration:

**macOS/Linux** - Edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "citdev": {
      "command": "node",
      "args": ["/absolute/path/to/citdev_mcp/src/index.js"],
      "cwd": "/absolute/path/to/citdev_mcp"
    }
  }
}
```

**Example with actual path:**

```json
{
  "mcpServers": {
    "citdev": {
      "command": "node",
      "args": ["/Users/yourname/src/citdev_mcp/src/index.js"],
      "cwd": "/Users/yourname/src/citdev_mcp"
    }
  }
}
```

**Alternative: Using Docker:**

If you prefer to run the MCP server in Docker, use the provided script:

```json
{
  "mcpServers": {
    "citdev": {
      "command": "/absolute/path/to/citdev_mcp/scripts/docker-run.sh",
      "args": []
    }
  }
}
```

Token cache is ephemeral - each Cursor session will require fresh authentication when you first use a tool.

### Step 4: Restart Cursor

After saving the configuration, restart Cursor for the MCP server to be loaded.

### Step 5: Using the Tools

Once configured, you can ask the AI assistant in Cursor to manage users using natural language:

**Adding a user:**
> "Add john.doe@example.com to my application 7b335932-00c5-457a-bca9-b68074d56ca9"

**Removing a user:**
> "Remove jane.smith@example.com from stack 7b335932-00c5-457a-bca9-b68074d56ca9"

### First-Time Authentication

The first time you use a tool, your browser will open for authentication:

1. A browser window will open to the McKinsey ID login page
2. Sign in with your credentials (you must be an Owner of the target Stack)
3. After successful authentication, the browser will show "Authentication Successful"
4. Return to Cursor - the operation will complete automatically

Subsequent requests will use the cached token (stored in macOS Keychain) until it expires.

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Redirect URI is not valid" | Ensure `http://127.0.0.1:8085/callback` is registered in your OAuth client |
| "401 Unauthorized" on GraphQL | Your OAuth client needs `audienceSource: McKinseyIdApiV2` |
| "You must be an owner" | You need Owner permissions on the target Stack |
| Browser doesn't open | Check the terminal for the auth URL and open it manually |
| Token expired | Delete cached token: `security delete-generic-password -s "citdev-mcp" -a "citdev-mcp-default"` |

## Available Tools

### User Management

These tools manage user membership in applications. For McKinsey ID, the `application_id` is the Stack UUID.

#### `add-user`

Adds a user to an application (grants membership to a Stack in McKinsey ID).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `application_id` | string (UUID) | Yes | The Stack ID (UUID) of the application |
| `user_email` | string | Yes | Email address of the user to add |

**Example:**
```json
{
  "application_id": "7b335932-00c5-457a-bca9-b68074d56ca9",
  "user_email": "newuser@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User newuser@example.com added to application 7b335932-00c5-457a-bca9-b68074d56ca9",
  "data": {
    "application_id": "7b335932-00c5-457a-bca9-b68074d56ca9",
    "stack_name": "My Application",
    "stack_label": "my-application",
    "user_email": "newuser@example.com",
    "added_at": "2026-01-23T14:14:52.007Z"
  }
}
```

#### `remove-user`

Removes a user from an application (revokes membership from a Stack in McKinsey ID).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `application_id` | string (UUID) | Yes | The Stack ID (UUID) of the application |
| `user_email` | string | Yes | Email address of the user to remove |

**Example:**
```json
{
  "application_id": "7b335932-00c5-457a-bca9-b68074d56ca9",
  "user_email": "olduser@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User olduser@example.com removed from application 7b335932-00c5-457a-bca9-b68074d56ca9",
  "data": {
    "application_id": "7b335932-00c5-457a-bca9-b68074d56ca9",
    "stack_name": "My Application",
    "stack_label": "my-application",
    "user_email": "olduser@example.com",
    "removed_at": "2026-01-23T14:16:47.231Z"
  }
}
```

## Adding New Tool Domains

To add a new domain (e.g., deployments):

1. Create a new directory under `src/tools/`:
   ```
   src/tools/deployment/
   ├── index.js      # Tool definitions
   └── handlers.js   # Business logic
   ```

2. Define your tools in `index.js`:
   ```javascript
   export const tools = [
     {
       name: 'deploy_application',
       description: 'Deploy an application to production',
       inputSchema: { ... }
     }
   ];
   
   export { handlers } from './handlers.js';
   ```

3. Register in `src/tools/index.js`:
   ```javascript
   import * as deployment from './deployment/index.js';
   // Add to toolDomains array
   ```

## Security Considerations

- All operations are scoped to authorized applications
- Input validation is performed on all parameters
- Operations are logged for audit purposes
- Role-based access control determines available operations

## License

Proprietary - McKinsey & Company. All rights reserved.
