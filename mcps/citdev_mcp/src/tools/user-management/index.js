/**
 * User Management Tools
 * 
 * Tools for managing users in citizen developer applications.
 */

export { handlers } from './handlers.js';

export const tools = [
  {
    name: 'add-user',
    description: 'Add a user to an application. The user will be granted access to the specified application.',
    inputSchema: {
      type: 'object',
      properties: {
        application_id: {
          type: 'string',
          description: 'The unique identifier of the application',
        },
        user_email: {
          type: 'string',
          description: 'Email address of the user to add',
        },
      },
      required: ['application_id', 'user_email'],
    },
  },
  {
    name: 'remove-user',
    description: 'Remove a user from an application. This will revoke their access.',
    inputSchema: {
      type: 'object',
      properties: {
        application_id: {
          type: 'string',
          description: 'The unique identifier of the application',
        },
        user_email: {
          type: 'string',
          description: 'Email address of the user to remove',
        },
      },
      required: ['application_id', 'user_email'],
    },
  },
  {
    name: 'list-users',
    description: 'List all users in an application. Returns members and owners with their details.',
    inputSchema: {
      type: 'object',
      properties: {
        application_id: {
          type: 'string',
          description: 'The unique identifier of the application (Stack UUID)',
        },
      },
      required: ['application_id'],
    },
  },
];
