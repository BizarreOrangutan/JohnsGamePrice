import express from 'express';
import logger from './logger.js';
import {
  ValidationError,
  ServiceUnavailableError,
  DataFormatError,
  NetworkError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  isValidationError,
  isServiceUnavailableError,
  isDataFormatError,
  isNetworkError,
  isAuthenticationError,
  isRateLimitError,
  isNotFoundError,
} from './errors.js';

interface ErrorResponse {
  error: string;
  details: string;
  code?: string;
  field?: string;
  service?: string;
  retryAfter?: string;
  timestamp: string;
  responseTime?: string;
  [key: string]: any;
}

interface RequestContext {
  method: string;
  path: string;
  ip: string | undefined;
  userAgent?: string;
  requestId?: string;
  startTime?: number;
}

/**
 * Safe logger that works in both test and non-test environments
 */
const safeLogger = {
  info: (message: string, meta?: any) => {
    if (logger && typeof logger.info === 'function') {
      logger.info(message, meta);
    }
  },
  warn: (message: string, meta?: any) => {
    if (logger && typeof logger.warn === 'function') {
      logger.warn(message, meta);
    }
  },
  error: (message: string, meta?: any) => {
    if (logger && typeof logger.error === 'function') {
      logger.error(message, meta);
    }
  },
  debug: (message: string, meta?: any) => {
    if (logger && typeof logger.debug === 'function') {
      logger.debug(message, meta);
    }
  },
};

/**
 * Creates request context for logging
 */
export const createRequestContext = (req: express.Request, startTime?: number): RequestContext => ({
  method: req.method,
  path: req.path,
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  requestId: req.get('x-request-id') || 'unknown',
  startTime,
});

/**
 * Handles API errors and returns appropriate HTTP responses
 */
export const handleApiError = (
  error: unknown,
  req: express.Request,
  res: express.Response,
  context: Partial<RequestContext> = {}
): void => {
  const requestContext = { ...createRequestContext(req), ...context };
  const responseTime = requestContext.startTime ? Date.now() - requestContext.startTime : undefined;

  // Base error response
  const baseResponse: Partial<ErrorResponse> = {
    timestamp: new Date().toISOString(),
  };

  if (responseTime) {
    baseResponse.responseTime = `${responseTime}ms`;
  }

  // Handle specific error types
  if (isValidationError(error)) {
    safeLogger.warn('Validation error', {
      error: error.message,
      field: error.field,
      code: error.code,
      ...requestContext,
      responseTimeMs: responseTime,
    });

    res.status(400).json({
      ...baseResponse,
      error: 'Validation error',
      details: error.message,
      code: error.code,
      field: error.field,
    });
    return;
  }

  if (isAuthenticationError(error)) {
    safeLogger.warn('Authentication error', {
      error: error.message,
      code: error.code,
      ...requestContext,
      responseTimeMs: responseTime,
    });

    res.status(401).json({
      ...baseResponse,
      error: 'Authentication failed',
      details: error.message,
      code: error.code,
    });
    return;
  }

  if (isNotFoundError(error)) {
    safeLogger.info('Resource not found', {
      error: error.message,
      resource: error.resource,
      resourceId: error.resourceId,
      code: error.code,
      ...requestContext,
      responseTimeMs: responseTime,
    });

    res.status(404).json({
      ...baseResponse,
      error: 'Resource not found',
      details: error.message,
      code: error.code,
      resource: error.resource,
      resourceId: error.resourceId,
    });
    return;
  }

  if (isRateLimitError(error)) {
    safeLogger.warn('Rate limit exceeded', {
      error: error.message,
      retryAfter: error.retryAfter,
      code: error.code,
      ...requestContext,
      responseTimeMs: responseTime,
    });

    const response: ErrorResponse = {
      ...baseResponse,
      error: 'Rate limit exceeded',
      details: error.message,
      code: error.code,
      timestamp: baseResponse.timestamp!,
    };

    if (error.retryAfter) {
      response.retryAfter = `${error.retryAfter}s`;
      res.set('Retry-After', error.retryAfter.toString());
    }

    res.status(429).json(response);
    return;
  }

  if (isDataFormatError(error)) {
    safeLogger.error('Data format error', {
      error: error.message,
      expectedFormat: error.expectedFormat,
      actualFormat: error.actualFormat,
      code: error.code,
      ...requestContext,
      responseTimeMs: responseTime,
    });

    res.status(502).json({
      ...baseResponse,
      error: 'Bad gateway',
      details: 'External service returned invalid data format',
      code: error.code,
      expectedFormat: error.expectedFormat,
    });
    return;
  }

  if (isServiceUnavailableError(error)) {
    safeLogger.error('External service unavailable', {
      error: error.message,
      service: error.service,
      statusCode: error.statusCode,
      code: error.code,
      ...requestContext,
      responseTimeMs: responseTime,
    });

    res.status(503).json({
      ...baseResponse,
      error: 'Service temporarily unavailable',
      details: error.message,
      code: error.code,
      service: error.service,
      retryAfter: '30s',
    });
    return;
  }

  if (isNetworkError(error)) {
    safeLogger.error('Network error', {
      error: error.message,
      originalError: error.originalError?.message,
      code: error.code,
      ...requestContext,
      responseTimeMs: responseTime,
    });

    res.status(503).json({
      ...baseResponse,
      error: 'Service temporarily unavailable',
      details: 'Unable to connect to external service',
      code: error.code,
      retryAfter: '30s',
    });
    return;
  }

  // Handle generic errors
  const isError = error instanceof Error;
  safeLogger.error('Unexpected error', {
    error: isError ? error.message : 'Unknown error',
    stack: isError ? error.stack : undefined,
    errorType: typeof error,
    ...requestContext,
    responseTimeMs: responseTime,
  });

  res.status(500).json({
    ...baseResponse,
    error: 'Internal server error',
    details: 'An unexpected error occurred while processing your request',
    code: 'INTERNAL_ERROR',
  });
};

/**
 * Express error handling middleware
 */
export const errorMiddleware = (
  error: Error,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
): void => {
  handleApiError(error, req, res);
};