import { test, expect, describe } from 'bun:test';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { mockFetchSuccess, mockFetchError } from './setups.js';

describe('Game Search Business Logic', () => {
  const app = createApp();

  describe('Search Games', () => {
    test('should search for games successfully', async () => {
      const mockGames = {
        game_ids: [
          { id: 1942, name: 'Portal' },
          { id: 2777, name: 'Portal 2' }
        ]
      };

      mockFetchSuccess(mockGames);

      const response = await request(app)
        .get('/api/games/search?query=portal')
        .expect(200);

      expect(response.body.query).toBe('portal');
      expect(response.body.results).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });

    test('should handle empty search results', async () => {
      mockFetchSuccess({ game_ids: [] });

      const response = await request(app)
        .get('/api/games/search?query=unknowngame')
        .expect(200);

      expect(response.body.results).toHaveLength(0);
      expect(response.body.count).toBe(0);
    });

    test('should require a search query', async () => {
      const response = await request(app)
        .get('/api/games/search')
        .expect(400);

      expect(response.body.error).toBe('Query parameter is required');
    });

    test('should handle service errors gracefully', async () => {
      mockFetchError(500);

      const response = await request(app)
        .get('/api/games/search?query=portal')
        .expect(500);

      expect(response.body.error).toBe('Search failed');
    });

    test('should encode special characters in queries', async () => {
      mockFetchSuccess({ game_ids: [] });

      const response = await request(app)
        .get('/api/games/search?query=call of duty')
        .expect(200);

      // Just verify the request went through successfully
      expect(response.body.query).toBe('call of duty');
    });
  });
});