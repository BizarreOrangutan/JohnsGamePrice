import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { gameSearchService } from '../../../../src/modules/core/utils/gameSearchService';

// Simple fetch mock
let originalFetch: any;

describe('gameSearchService', () => {
  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('should return empty array for empty query', async () => {
    const result = await gameSearchService.searchGames('');
    expect(result).toEqual([]);
  });

  test('should return empty array for whitespace query', async () => {
    const result = await gameSearchService.searchGames('   ');
    expect(result).toEqual([]);
  });

  test('should call API with query as provided (including whitespace)', async () => {
    let capturedUrl = '';
    
    global.fetch = async (url: string) => {
      capturedUrl = url;
      return {
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json'
        },
        json: async () => ({ 
          query: 'portal', 
          results: [{ title: 'Portal 2', plain: 'portal2' }], 
          count: 1, 
          timestamp: '' 
        })
      } as any;
    };

    const result = await gameSearchService.searchGames('  portal  ');
    
    // Service sends the query as-is with URL encoding
    expect(capturedUrl).toBe('http://api-gateway:8080/api/games/search?query=%20%20portal%20%20');
    expect(result).toEqual([{ title: 'Portal 2', plain: 'portal2' }]);
  });

  test('should handle successful API response', async () => {
    const mockResponse = {
      query: 'portal',
      results: [
        {
          title: 'Portal 2',
          plain: 'portal2',
          id: '123',
          slug: 'portal-2',
          assets: { boxart: 'image.jpg' }
        }
      ],
      count: 1,
      timestamp: '2025-01-01T12:00:00Z'
    };

    global.fetch = async () => ({
      ok: true,
      status: 200,
      headers: {
        get: (name: string) => name === 'content-type' ? 'application/json' : null
      },
      json: async () => mockResponse
    }) as any;

    const result = await gameSearchService.searchGames('portal');
    expect(result).toEqual(mockResponse.results);
  });

  test('should handle HTTP errors', async () => {
    global.fetch = async () => ({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    }) as any;

    await expect(gameSearchService.searchGames('portal')).rejects.toThrow(
      'HTTP 500: Internal Server Error'
    );
  });

  test('should handle non-JSON responses', async () => {
    global.fetch = async () => ({
      ok: true,
      status: 200,
      headers: {
        get: (name: string) => name === 'content-type' ? 'text/html' : null
      },
      text: async () => '<html>Error</html>'
    }) as any;

    await expect(gameSearchService.searchGames('portal')).rejects.toThrow(
      'Expected JSON, got text/html'
    );
  });

  test('should handle network errors', async () => {
    global.fetch = async () => {
      throw new Error('Network error');
    };

    await expect(gameSearchService.searchGames('portal')).rejects.toThrow(
      'Network error'
    );
  });

  test('should encode query parameters correctly', async () => {
    let capturedUrl = '';
    
    global.fetch = async (url: string) => {
      capturedUrl = url;
      return {
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json'
        },
        json: async () => ({ query: 'test', results: [], count: 0, timestamp: '' })
      } as any;
    };

    await gameSearchService.searchGames('portal & half life');
    
    expect(capturedUrl).toBe(
      'http://api-gateway:8080/api/games/search?query=portal%20%26%20half%20life'
    );
  });

  test('should handle empty results from API', async () => {
    global.fetch = async () => ({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json'
      },
      json: async () => ({ 
        query: 'nonexistent', 
        results: [], 
        count: 0, 
        timestamp: '2025-01-01T12:00:00Z' 
      })
    }) as any;

    const result = await gameSearchService.searchGames('nonexistent');
    expect(result).toEqual([]);
  });

  test('should handle malformed JSON response', async () => {
    global.fetch = async () => ({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json'
      },
      json: async () => {
        throw new SyntaxError('Unexpected token');
      }
    }) as any;

    await expect(gameSearchService.searchGames('portal')).rejects.toThrow(
      'Unexpected token'
    );
  });

  test('should properly encode special characters', async () => {
    let capturedUrl = '';
    
    global.fetch = async (url: string) => {
      capturedUrl = url;
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ query: 'test', results: [], count: 0, timestamp: '' })
      } as any;
    };

    await gameSearchService.searchGames('call of duty: modern warfare');
    
    expect(capturedUrl).toBe(
      'http://api-gateway:8080/api/games/search?query=call%20of%20duty%3A%20modern%20warfare'
    );
  });
});