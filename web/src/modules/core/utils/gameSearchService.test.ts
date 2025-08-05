import { describe, test, expect, beforeEach, mock } from 'bun:test';
import { gameSearchService } from './gameSearchService';
import type { GameSearchResponse } from './gameSearchService';

// Mock fetch globally
const mockFetch = mock();
global.fetch = mockFetch;

describe('gameSearchService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('searchGames', () => {
    test('should return empty array for empty query', async () => {
      const result = await gameSearchService.searchGames('');
      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test('should return empty array for whitespace query', async () => {
      const result = await gameSearchService.searchGames('   ');
      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test('should fetch games successfully', async () => {
      const mockResponse: GameSearchResponse = {
        query: 'portal',
        results: [
          {
            title: 'Portal 2',
            plain: 'portal2',
            id: '123',
            slug: 'portal-2',
            assets: {
              boxart: 'https://example.com/boxart.jpg'
            }
          }
        ],
        count: 1,
        timestamp: '2025-01-01T12:00:00Z'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({
          'content-type': 'application/json'
        }),
        json: async () => mockResponse
      });

      const result = await gameSearchService.searchGames('portal');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/games/search?query=portal'
      );
      expect(result).toEqual(mockResponse.results);
    });

    test('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(gameSearchService.searchGames('portal')).rejects.toThrow(
        'HTTP 500: Internal Server Error'
      );
    });

    test('should handle non-JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({
          'content-type': 'text/html'
        }),
        text: async () => '<html>Error page</html>'
      });

      await expect(gameSearchService.searchGames('portal')).rejects.toThrow(
        'Expected JSON, got text/html'
      );
    });

    test('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(gameSearchService.searchGames('portal')).rejects.toThrow(
        'Network error'
      );
    });

    test('should encode query parameters', async () => {
      const mockResponse: GameSearchResponse = {
        query: 'portal & half life',
        results: [],
        count: 0,
        timestamp: '2025-01-01T12:00:00Z'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({
          'content-type': 'application/json'
        }),
        json: async () => mockResponse
      });

      await gameSearchService.searchGames('portal & half life');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/games/search?query=portal%20%26%20half%20life'
      );
    });
  });
});