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

// Create module mock using dynamic imports instead of require override
const moduleCache = new Map<string, unknown>();

export const getMockedModule = async (modulePath: string): Promise<unknown> => {
  if (modulePath.includes('fetchUtils')) {
    return mockFetchUtils;
  }
  if (modulePath.includes('logger')) {
    return { default: mockLogger };
  }
  
  // Fallback to actual module
  return import(modulePath);
};

export const mockFetchSuccess = (data: Record<string, unknown>): void => {
  mockFetchUtils.fetchWithErrorHandling.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => data,
  });
};

export const mockFetchError = async (status: number, statusText = 'Error'): Promise<void> => {
  const { ServiceUnavailableError, NotFoundError, AuthenticationError, RateLimitError } = await import('../src/utils/errors.js');
  
  let error: Error;
  switch (status) {
    case 404: {
      error = new NotFoundError('Game not found', 'game');
      break;
    }
    case 401:
    case 403: {
      error = new AuthenticationError('Authentication failed');
      break;
    }
    case 429: {
      error = new RateLimitError('Rate limit exceeded', 60);
      break;
    }
    case 503: {
      error = new ServiceUnavailableError('Service unavailable', status, 'price-fetcher');
      break;
    }
    default: {
      error = new ServiceUnavailableError(statusText, status, 'price-fetcher');
      break;
    }
  }
  
  mockFetchUtils.fetchWithErrorHandling.mockRejectedValue(error);
};

export const mockFetchNetworkError = async (): Promise<void> => {
  const { NetworkError } = await import('../src/utils/errors.js');
  const error = new NetworkError('Network connection failed');
  mockFetchUtils.fetchWithErrorHandling.mockRejectedValue(error);
};

export const mockFetchInvalidJson = (): void => {
  mockFetchUtils.fetchWithErrorHandling.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => { throw new Error('Invalid JSON'); },
  });
};