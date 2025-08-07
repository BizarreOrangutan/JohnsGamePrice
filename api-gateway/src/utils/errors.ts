/**
 * Custom error classes for better error handling and categorization
 */

export class ValidationError extends Error {
  constructor(
    message: string, 
    public field: string,
    public code: string = 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ServiceUnavailableError extends Error {
  constructor(
    message: string, 
    public statusCode: number, 
    public service: string,
    public code: string = 'SERVICE_UNAVAILABLE'
  ) {
    super(message);
    this.name = 'ServiceUnavailableError';
  }
}

export class DataFormatError extends Error {
  constructor(
    message: string, 
    public expectedFormat: string,
    public actualFormat?: string,
    public code: string = 'DATA_FORMAT_ERROR'
  ) {
    super(message);
    this.name = 'DataFormatError';
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public originalError?: Error,
    public code: string = 'NETWORK_ERROR'
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends Error {
  constructor(
    message: string = 'Authentication failed',
    public code: string = 'AUTHENTICATION_ERROR'
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string = 'Rate limit exceeded',
    public retryAfter?: number,
    public code: string = 'RATE_LIMIT_ERROR'
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class NotFoundError extends Error {
  constructor(
    message: string,
    public resource: string,
    public resourceId?: string,
    public code: string = 'NOT_FOUND'
  ) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Type guard functions for error checking
 */
export const isValidationError = (error: unknown): error is ValidationError =>
  error instanceof ValidationError;

export const isServiceUnavailableError = (error: unknown): error is ServiceUnavailableError =>
  error instanceof ServiceUnavailableError;

export const isDataFormatError = (error: unknown): error is DataFormatError =>
  error instanceof DataFormatError;

export const isNetworkError = (error: unknown): error is NetworkError =>
  error instanceof NetworkError;

export const isAuthenticationError = (error: unknown): error is AuthenticationError =>
  error instanceof AuthenticationError;

export const isRateLimitError = (error: unknown): error is RateLimitError =>
  error instanceof RateLimitError;

export const isNotFoundError = (error: unknown): error is NotFoundError =>
  error instanceof NotFoundError;

/**
 * Utility function to detect network-related errors
 */
export const isNetworkRelatedError = (error: Error): boolean => {
  return (
    error.message.includes('timeout') ||
    error.message.includes('ECONNREFUSED') ||
    error.message.includes('ENOTFOUND') ||
    error.message.includes('ETIMEDOUT') ||
    error.message.includes('fetch failed') ||
    error.name === 'AbortError'
  );
};

/**
 * Convert fetch response errors to appropriate custom errors
 */
export const createErrorFromResponse = (
  response: Response, 
  service: string = 'external-service'
): ServiceUnavailableError | AuthenticationError | RateLimitError | NotFoundError => {
  const { status, statusText } = response;
  
  switch (status) {
    case 401:
    case 403:
      return new AuthenticationError(`Authentication failed: ${statusText}`);
    case 404:
      return new NotFoundError(`Resource not found: ${statusText}`, service);
    case 429: {
      const retryAfter = response.headers.get('retry-after');
      return new RateLimitError(
        `Rate limit exceeded: ${statusText}`, 
        retryAfter ? parseInt(retryAfter) : undefined
      );
    }
    case 502:
    case 503:
    case 504:
      return new ServiceUnavailableError(
        `Service temporarily unavailable: ${statusText}`,
        status,
        service
      );
    default:
      return new ServiceUnavailableError(
        `Service error: ${statusText}`,
        status,
        service
      );
  }
}

/**
 * Map HTTP status codes to corresponding error classes
 */
export const mapHttpStatusToError = (status: number, message: string, service: string): Error => {
  switch (status) {
    case 400: {
      const error = new ValidationError(message, 'request');
      return error;
    }
    case 401: {
      const error = new AuthenticationError(message);
      return error;
    }
    case 403: {
      const error = new AuthenticationError(message);
      return error;
    }
    case 404: {
      const error = new NotFoundError(message, 'resource');
      return error;
    }
    case 429: {
      const error = new RateLimitError(message);
      return error;
    }
    case 502: {
      const error = new DataFormatError(message, 'JSON');
      return error;
    }
    case 503: {
      const error = new ServiceUnavailableError(message, status, service);
      return error;
    }
    default: {
      const error = new ServiceUnavailableError(message, status, service);
      return error;
    }
  }
};