# ADR-001: MCP Server Architecture for Citizen Developer Operations

**Status:** Accepted  
**Date:** 2026-01-23  
**Authors:** Peter Mondlock

## Context

Citizen developers at McKinsey need the ability to perform common operational tasks on their applications without requiring deep technical expertise or direct access to administrative interfaces. These tasks include:

- Managing user access to applications (adding/removing users)
- Future: Deployment operations, configuration management, monitoring

The current process requires citizen developers to either:
1. Navigate complex administrative UIs in McKinsey ID
2. Request assistance from platform teams
3. Learn and use GraphQL APIs directly

This creates friction, delays, and dependency on specialized knowledge.

Additionally, the rise of AI-powered development environments like Cursor presents an opportunity to enable natural language interactions for these operational tasks, making them accessible to a broader audience.

### Requirements

1. **Security**: Operations must be authenticated and authorized through the existing McKinsey ID infrastructure
2. **Usability**: Citizen developers should be able to perform operations through natural language in their IDE
3. **Extensibility**: The solution must support adding new operational domains over time
4. **Auditability**: All operations must be logged for compliance and troubleshooting
5. **Local-first**: The solution should work on developer machines without requiring server infrastructure

### Constraints

1. Must integrate with McKinsey ID as the identity provider
2. Must support OIDC PKCE flow for secure authentication on localhost
3. Must work within the MCP (Model Context Protocol) specification for Cursor integration
4. Cannot store long-lived credentials on disk in plaintext

## Decision

We will build an **MCP (Model Context Protocol) server** in Node.js that:

### 1. Uses MCP for AI Integration

The server implements the MCP specification, allowing it to be used as a tool provider for AI assistants in Cursor and other MCP-compatible clients. This enables natural language interactions like "add user@example.com to my application."

**Rationale:**
- MCP is the emerging standard for AI tool integration
- Cursor has native MCP support
- The protocol is simple (JSON-RPC over stdio) and well-documented

### 2. Implements OIDC PKCE Authentication

The server includes a complete OIDC PKCE authentication flow that:
- Starts a local HTTP server on `127.0.0.1:8085` to receive OAuth callbacks
- Opens the system browser for user authentication
- Exchanges authorization codes for tokens
- Stores tokens securely in the macOS Keychain (with file fallback)

**Rationale:**
- PKCE is the recommended flow for native/public clients
- Local callback server avoids the need for a hosted redirect endpoint
- Keychain storage is more secure than plaintext files
- Browser-based auth leverages existing SSO sessions

### 3. Uses GraphQL for Backend Operations

The server calls the McKinsey ID GraphQL API (`https://api.mckinsey.id/v2/graphql`) to perform user management operations using the `AddMembers` and `RemoveMembers` mutations.

**Rationale:**
- GraphQL is the official API for McKinsey ID administrative operations
- Single endpoint simplifies configuration
- Strong typing provides clear contracts

### 4. Adopts a Modular Tool Architecture

Tools are organized by domain (e.g., `user-management/`) with separate files for:
- Tool definitions (schema)
- Handlers (business logic)

New domains can be added by creating a new directory and registering it in the tool registry.

**Rationale:**
- Separation of concerns improves maintainability
- New capabilities can be added without modifying existing code
- Each domain can have its own dependencies and configuration

### 5. Supports Multiple Identity Providers

Authentication configuration supports multiple IdP providers through a JSON configuration file (`.citdev-auth.json`), enabling use with different McKinsey ID environments or other OIDC providers.

**Rationale:**
- Developers may need to work with multiple environments (dev, staging, prod)
- Configuration should not be hardcoded
- Same codebase can be adapted for different IdPs

## Consequences

### Positive

1. **Improved Developer Experience**: Citizen developers can manage users through natural language in their IDE without learning new tools or APIs.

2. **Reduced Support Burden**: Platform teams receive fewer requests for routine user management tasks.

3. **Secure by Design**: Authentication flows through McKinsey ID with proper PKCE; tokens are stored in system keychain; operations are scoped to authorized stacks.

4. **Extensible Foundation**: The modular architecture makes it straightforward to add deployment, configuration, and monitoring tools in the future.

5. **No Infrastructure Required**: The MCP server runs locally on the developer's machine, eliminating the need for hosted services.

6. **Audit Trail**: All operations are logged with timestamps, user identifiers, and outcomes.

### Negative

1. **Initial Setup Complexity**: Users must create an OIDC PKCE asset in McKinsey ID and configure the MCP server before first use.

2. **macOS-Centric**: The current implementation uses macOS-specific features (Keychain, `open` command). Windows/Linux support would require additional work.

3. **Browser Dependency**: Authentication requires a web browser and manual user interaction, which may not work in headless environments.

4. **Stack Ownership Required**: Users must be Owners of the target Stack to perform operations, which may require coordination with existing Stack owners.

### Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Token theft from Keychain | Keychain is protected by macOS security; tokens are short-lived |
| Unauthorized operations | All operations require valid JWT with Stack ownership claims |
| API rate limiting | Implement retry logic with exponential backoff (future) |
| GraphQL schema changes | Pin to known working schema; monitor for deprecations |

## Alternatives Considered

### 1. Web-Based Admin Portal

Build a web application for citizen developers to manage their applications.

**Rejected because:**
- Requires hosting infrastructure
- Adds another tool for developers to learn
- Doesn't integrate with developer workflow (IDE)

### 2. CLI Tool

Build a traditional command-line tool for user management.

**Rejected because:**
- Requires developers to learn command syntax
- Doesn't leverage AI assistance for natural language
- MCP provides CLI-like functionality with better UX

### 3. Slack/Teams Bot

Build a chatbot for operational tasks.

**Rejected because:**
- Context switching away from development environment
- Requires bot hosting infrastructure
- Security concerns with chat-based authentication

## References

- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [OAuth 2.0 for Native Apps (RFC 8252)](https://tools.ietf.org/html/rfc8252)
- [PKCE (RFC 7636)](https://tools.ietf.org/html/rfc7636)
- [McKinsey ID GraphQL API Documentation](https://api.mckinsey.id/v2/graphql)
