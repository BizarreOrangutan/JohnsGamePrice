import { test, expect, describe } from 'bun:test';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('API Gateway', () => {
  const app = createApp();

  describe('Core Functionality', () => {
    test('should serve API documentation with trailing slash', async () => {
      await request(app)
        .get('/api-docs/')
        .expect(200);
    });

    test('should redirect /api-docs to /api-docs/', async () => {
      await request(app)
        .get('/api-docs')
        .expect(301);
    });

    test('should return 404 for unknown endpoints', async () => {
      const response = await request(app)
        .get('/unknown')
        .expect(404);

      expect(response.body.error).toBe('Endpoint not found');
    });

    test('should have CORS enabled', async () => {
      const response = await request(app)
        .options('/api/games/search')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });
});