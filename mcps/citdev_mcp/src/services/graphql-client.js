/**
 * GraphQL Client for McKinsey ID API
 * 
 * Handles GraphQL requests to the identity management API.
 */

import { getAccessToken } from '../auth/index.js';
import { logger } from './index.js';

const GRAPHQL_ENDPOINT = 'https://api.mckinsey.id/v2/graphql';

/**
 * Execute a GraphQL query or mutation
 * 
 * @param {Object} options
 * @param {string} options.query - The GraphQL query or mutation
 * @param {Object} [options.variables] - Variables for the query
 * @param {string} [options.operationName] - The operation name
 * @returns {Promise<Object>} The GraphQL response data
 */
export async function executeGraphQL({ query, variables = {}, operationName }) {
  // Get a valid access token (handles refresh/re-auth automatically)
  const accessToken = await getAccessToken();
  
  logger.info('GraphQL request', { 
    operationName, 
    variables,
    endpoint: GRAPHQL_ENDPOINT 
  });

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error('GraphQL HTTP error', { 
      status: response.status, 
      statusText: response.statusText,
      body: errorText 
    });
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    logger.error('GraphQL errors', { errors: result.errors });
    const errorMessages = result.errors.map(e => e.message).join('; ');
    throw new Error(`GraphQL error: ${errorMessages}`);
  }

  logger.info('GraphQL response received', { 
    operationName,
    hasData: !!result.data 
  });

  return result.data;
}

/**
 * GraphQL Mutations for User Management
 */
export const mutations = {
  /**
   * Add members to a stack
   */
  ADD_MEMBERS: `
    mutation AddMembers($stackId: UUID!, $users: [UserInput!]) {
      AddMembers(stackId: $stackId, users: $users) {
        id
        label
        name
        users(first: 10) {
          ... on User {
            id
            login
            email
            firstName
            lastName
            status
          }
        }
      }
    }
  `,

  /**
   * Remove members from a stack
   */
  REMOVE_MEMBERS: `
    mutation RemoveMembers($stackId: UUID!, $users: [Email!]) {
      RemoveMembers(stackId: $stackId, users: $users) {
        id
        label
        name
      }
    }
  `,
};

/**
 * GraphQL Queries for User Management
 */
export const queries = {
  /**
   * Get stack details with users
   * Note: Stack query returns an array, users field returns UsersAndServiceAccounts union
   */
  GET_STACK: `
    query GetStack($stackId: UUID!) {
      Stack(id: $stackId) {
        id
        label
        name
        stats {
          numUsers
          numMembers
          numOwners
        }
        users(first: 100) {
          ... on User {
            id
            login
            email
            firstName
            lastName
            status
            isMember
            isOwner
          }
          ... on ServiceAccount {
            id
            isMember
            isOwner
          }
        }
      }
    }
  `,
};
