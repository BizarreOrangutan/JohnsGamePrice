import { describe, test, expect } from 'bun:test';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { mockFetchSuccess, mockFetchError } from './setups.js';

describe('Games API', () => {
  const app = createApp();

  describe('GET /api/games/search', () => {
    test('should return games successfully', async () => {
      const mockResponse = {
        games: [
          { title: 'Portal', plain: 'portal' }
        ],
        count: 1
      };

      mockFetchSuccess(mockResponse);

      const response = await request(app)
        .get('/api/games/search?query=portal')
        .expect(200);

      expect(response.body.query).toBe('portal');
      expect(response.body.results).toHaveLength(1);
      expect(response.body.count).toBe(1);
    });

    test('should return empty results when no games found', async () => {
      const mockResponse = {
        games: [],
        count: 0
      };

      mockFetchSuccess(mockResponse);

      const response = await request(app)
        .get('/api/games/search?query=unknown')
        .expect(200);

      expect(response.body.results).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    test('should return 400 when query is missing', async () => {
      const response = await request(app)
        .get('/api/games/search')
        .expect(400);

      expect(response.body.error).toBe('Query parameter is required');
    });

    test('should handle service errors', async () => {
      mockFetchError(500, 'Service Error');

      const response = await request(app)
        .get('/api/games/search?query=portal')
        .expect(500);

      expect(response.body.error).toBe('Search failed');
    });
  });
});