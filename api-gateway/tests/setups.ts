import { beforeEach, mock } from 'bun:test';

beforeEach(() => {
  // Set test environment FIRST - this must be set before any imports
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'silent';
  
  // Clear other env vars
  delete process.env.PRICE_FETCHER_SERVICE_URL;
  delete process.env.PORT;
});

// Mock fetch utilities and logger
const mockFetchUtils = {
  fetchWithErrorHandling: mock(),
  fetchWithTimeout: mock(),
};

const mockLogger = {
  info: mock(() => {}),
  warn: mock(() => {}),
  error: mock(() => {}),
  debug: mock(() => {}),
};

// Override the modules
const originalRequire = require;
require = function(id: string) {
  if (id.includes('fetchUtils')) {
    return mockFetchUtils;
  }
  if (id.includes('logger')) {
    return { default: mockLogger };
  }
  //@ts-ignore
  return originalRequire.apply(this, arguments);
} as any;

export const mockFetchSuccess = (data: any) => {
  mockFetchUtils.fetchWithErrorHandling.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => data,
  });
};

export const mockFetchError = (status: number, statusText: string = 'Error') => {
  const { ServiceUnavailableError, NotFoundError, AuthenticationError, RateLimitError } = require('../src/utils/errors.js');
  
  let error;
  switch (status) {
    case 404:
      error = new NotFoundError('Game not found', 'game');
      break;
    case 401:
    case 403:
      error = new AuthenticationError('Authentication failed');
      break;
    case 429:
      error = new RateLimitError('Rate limit exceeded', 60);
      break;
    case 503:
      error = new ServiceUnavailableError('Service unavailable', status, 'price-fetcher');
      break;
    default:
      error = new ServiceUnavailableError(statusText, status, 'price-fetcher');
  }
  
  mockFetchUtils.fetchWithErrorHandling.mockRejectedValue(error);
};

export const mockFetchNetworkError = () => {
  const { NetworkError } = require('../src/utils/errors.js');
  const error = new NetworkError('Network connection failed');
  mockFetchUtils.fetchWithErrorHandling.mockRejectedValue(error);
};

export const mockFetchInvalidJson = () => {
  mockFetchUtils.fetchWithErrorHandling.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => { throw new Error('Invalid JSON'); },
  });
};