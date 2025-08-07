import { ValidationError } from './errors.js';

/**
 * Validates search query parameter
 */
export const validateSearchQuery = (query: unknown): string => {
  if (!query) {
    throw new ValidationError('Query parameter is required', 'query');
  }

  if (typeof query !== 'string') {
    throw new ValidationError('Query parameter must be a string', 'query');
  }

  const trimmed = query.trim();
  
  if (trimmed.length === 0) {
    throw new ValidationError('Query parameter cannot be empty', 'query');
  }

  if (trimmed.length > 100) {
    throw new ValidationError('Query parameter too long (max 100 characters)', 'query');
  }

  return trimmed;
};

/**
 * Validates game ID parameter
 */
export const validateGameId = (id: unknown): string => {
  if (!id) {
    throw new ValidationError('Game ID parameter is required', 'id');
  }

  if (typeof id !== 'string') {
    throw new ValidationError('Game ID parameter must be a string', 'id');
  }

  const trimmed = id.trim();
  
  if (trimmed.length === 0) {
    throw new ValidationError('Game ID parameter cannot be empty', 'id');
  }

  // Basic UUID format validation
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(trimmed)) {
    throw new ValidationError('Game ID must be a valid UUID format', 'id');
  }

  return trimmed;
};

/**
 * Validates and parses response data
 */
export const validateResponseData = (data: unknown, expectedType: string = 'object'): any => {
  if (expectedType === 'object') {
    if (typeof data !== 'object' || data === null) {
      throw new Error(`Expected object but received ${typeof data}`);
    }
  }
  
  return data;
};