/**
 * User Management Handlers
 * 
 * Business logic for user management operations.
 * Integrates with McKinsey ID GraphQL API.
 */

import { validateEmail, validateRequired } from '../../utils/validation.js';
import { logger } from '../../services/index.js';
import { executeGraphQL, mutations, queries } from '../../services/graphql-client.js';

/**
 * Add a user to an application (stack)
 */
async function addUser(args) {
  const { application_id, user_email } = args;
  
  logger.info('add-user: Handler invoked', { 
    tool: 'add-user',
    args: { application_id, user_email } 
  });

  // Validate inputs
  try {
    validateRequired('application_id', application_id);
    validateRequired('user_email', user_email);
    validateEmail(user_email);
    logger.info('add-user: Validation passed', { application_id, user_email });
  } catch (validationError) {
    logger.error('add-user: Validation failed', { 
      application_id, 
      user_email, 
      error: validationError.message 
    });
    throw validationError;
  }

  // Call McKinsey ID GraphQL API
  try {
    logger.info('add-user: Calling GraphQL API', { application_id, user_email });
    
    const data = await executeGraphQL({
      query: mutations.ADD_MEMBERS,
      variables: {
        stackId: application_id,
        users: [{ login: user_email }],
      },
      operationName: 'AddMembers',
    });

    logger.audit('add-user', {
      action: 'user_added',
      application_id,
      user_email,
      status: 'success',
      stack_label: data.AddMembers?.label,
    });

    const result = {
      success: true,
      message: `User ${user_email} added to application ${application_id}`,
      data: {
        application_id,
        stack_name: data.AddMembers?.name,
        stack_label: data.AddMembers?.label,
        user_email,
        added_at: new Date().toISOString(),
      },
    };

    logger.info('add-user: Handler completed', { 
      tool: 'add-user',
      result 
    });

    return result;

  } catch (error) {
    logger.error('add-user: GraphQL API error', { 
      application_id, 
      user_email, 
      error: error.message 
    });
    
    throw new Error(`Failed to add user: ${error.message}`);
  }
}

/**
 * Remove a user from an application (stack)
 */
async function removeUser(args) {
  const { application_id, user_email } = args;
  
  logger.info('remove-user: Handler invoked', { 
    tool: 'remove-user',
    args: { application_id, user_email } 
  });

  // Validate inputs
  try {
    validateRequired('application_id', application_id);
    validateRequired('user_email', user_email);
    validateEmail(user_email);
    logger.info('remove-user: Validation passed', { application_id, user_email });
  } catch (validationError) {
    logger.error('remove-user: Validation failed', { 
      application_id, 
      user_email, 
      error: validationError.message 
    });
    throw validationError;
  }

  // Call McKinsey ID GraphQL API
  try {
    logger.info('remove-user: Calling GraphQL API', { application_id, user_email });
    
    const data = await executeGraphQL({
      query: mutations.REMOVE_MEMBERS,
      variables: {
        stackId: application_id,
        users: [user_email],
      },
      operationName: 'RemoveMembers',
    });

    logger.audit('remove-user', {
      action: 'user_removed',
      application_id,
      user_email,
      status: 'success',
      stack_label: data.RemoveMembers?.label,
    });

    const result = {
      success: true,
      message: `User ${user_email} removed from application ${application_id}`,
      data: {
        application_id,
        stack_name: data.RemoveMembers?.name,
        stack_label: data.RemoveMembers?.label,
        user_email,
        removed_at: new Date().toISOString(),
      },
    };

    logger.info('remove-user: Handler completed', { 
      tool: 'remove-user',
      result 
    });

    return result;

  } catch (error) {
    logger.error('remove-user: GraphQL API error', { 
      application_id, 
      user_email, 
      error: error.message 
    });
    
    throw new Error(`Failed to remove user: ${error.message}`);
  }
}

/**
 * List all users in an application (stack)
 */
async function listUsers(args) {
  const { application_id } = args;
  
  logger.info('list-users: Handler invoked', { 
    tool: 'list-users',
    args: { application_id } 
  });

  // Validate inputs
  try {
    validateRequired('application_id', application_id);
    logger.info('list-users: Validation passed', { application_id });
  } catch (validationError) {
    logger.error('list-users: Validation failed', { 
      application_id, 
      error: validationError.message 
    });
    throw validationError;
  }

  // Call McKinsey ID GraphQL API
  try {
    logger.info('list-users: Calling GraphQL API', { application_id });
    
    const data = await executeGraphQL({
      query: queries.GET_STACK,
      variables: {
        stackId: application_id,
      },
      operationName: 'GetStack',
    });

    // Stack query returns an array, get the first (and only) result
    const stacks = data.Stack;
    
    if (!stacks || stacks.length === 0) {
      throw new Error(`Application not found: ${application_id}`);
    }

    const stack = stacks[0];

    // Transform users into a cleaner format (filter out service accounts without login/email)
    const users = (stack.users || [])
      .filter(user => user.login || user.email) // Only include User type (has login/email)
      .map(user => ({
        email: user.email || user.login,
        login: user.login,
        first_name: user.firstName,
        last_name: user.lastName,
        status: user.status,
        is_member: user.isMember,
        is_owner: user.isOwner,
      }));

    logger.audit('list-users', {
      action: 'users_listed',
      application_id,
      status: 'success',
      stack_label: stack.label,
      user_count: users.length,
    });

    const result = {
      success: true,
      message: `Found ${users.length} users in application ${application_id}`,
      data: {
        application_id,
        stack_name: stack.name,
        stack_label: stack.label,
        stats: {
          total_users: stack.stats?.numUsers || 0,
          members: stack.stats?.numMembers || 0,
          owners: stack.stats?.numOwners || 0,
        },
        users,
      },
    };

    logger.info('list-users: Handler completed', { 
      tool: 'list-users',
      user_count: users.length 
    });

    return result;

  } catch (error) {
    logger.error('list-users: GraphQL API error', { 
      application_id, 
      error: error.message 
    });
    
    throw new Error(`Failed to list users: ${error.message}`);
  }
}

export const handlers = {
  'add-user': addUser,
  'remove-user': removeUser,
  'list-users': listUsers,
};
