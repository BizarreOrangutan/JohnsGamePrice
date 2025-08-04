import { beforeEach, afterEach, beforeAll, afterAll, mock } from 'bun:test';

// Mock fetch globally for all tests
global.fetch = mock(() => Promise.resolve({
  ok: true,
  status: 200,
  json: async () => ({}),
} as Response));

// Mock console methods to reduce noise in test output
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  // Silence console.log in tests unless needed
  console.log = mock(() => {});
  console.error = mock(() => {});
});

afterAll(() => {
  // Restore original console methods
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

beforeEach(() => {
  // Clear any environment variables that might affect tests
  delete process.env.GAME_ID_SERVICE_URL;
  delete process.env.PRICE_SERVICE_URL;
  delete process.env.PORT;
  
  // Set test environment
  process.env.NODE_ENV = 'test';
});

// Helper function to mock successful fetch responses
export const mockFetchSuccess = (data: any) => {
  global.fetch = mock(() => Promise.resolve({
    ok: true,
    status: 200,
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as Response));
};

// Helper function to mock failed fetch responses
export const mockFetchError = (status: number = 500, statusText: string = 'Internal Server Error') => {
  global.fetch = mock(() => Promise.resolve({
    ok: false,
    status,
    statusText,
    json: async () => ({ error: statusText }),
    text: async () => JSON.stringify({ error: statusText }),
  } as Response));
};

// Helper function to mock network errors
export const mockFetchNetworkError = (message: string = 'Network error') => {
  global.fetch = mock(() => Promise.reject(
    new TypeError(`fetch failed: ${message}`)
  ));
};

// Helper to get the mocked fetch function
export const getMockFetch = () => global.fetch;

// Setup default environment variables for tests
export const setupTestEnv = () => {
  process.env.GAME_ID_SERVICE_URL = 'http://localhost:8000';
  process.env.PRICE_SERVICE_URL = 'http://localhost:8001';
  process.env.PORT = '8080';
  process.env.LOG_LEVEL = 'silent';
};

// Cleanup test environment
export const cleanupTestEnv = () => {
  delete process.env.GAME_ID_SERVICE_URL;
  delete process.env.PRICE_SERVICE_URL;
  delete process.env.PORT;
  delete process.env.LOG_LEVEL;
};