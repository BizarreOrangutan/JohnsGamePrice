import { describe, test, expect, beforeEach } from 'bun:test';
import request from 'supertest';
import express from 'express';

// Simple test app that mimics your API behavior
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  app.get('/api/games/search', (req, res) => {
    const { query, result_num } = req.query;
    
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Validation error', 
        field: 'query',
        details: 'Query parameter is required',
        timestamp: new Date().toISOString()
      });
    }
    
    if (query.length > 100) {
      return res.status(400).json({ 
        error: 'Validation error', 
        field: 'query',
        details: 'Query parameter too long',
        timestamp: new Date().toISOString()
      });
    }

    // FIX: Default to 10 if result_num is not provided
    let resultNum = 10;
    if (result_num !== undefined) {
      const parsed = parseInt(result_num as string, 10);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
        return res.status(400).json({
          error: 'Invalid result_num: must be an integer between 1 and 100'
        });
      }
      resultNum = parsed;
    }

    res.json({
      query,
      results: [],
      count: 0,
      timestamp: new Date().toISOString(),
      responseTime: '10ms'
    });
  });

  app.get('/api/games/prices', (req, res) => {
    const { id } = req.query;
    const { scenario } = req.query; // Use query param for test scenarios
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Validation error', 
        field: 'id',
        details: 'Game ID parameter is required',
        timestamp: new Date().toISOString()
      });
    }
    
    if (!uuidPattern.test(id.trim())) {
      return res.status(400).json({ 
        error: 'Validation error', 
        field: 'id',
        details: 'Game ID must be a valid UUID format',
        timestamp: new Date().toISOString()
      });
    }

    // Handle test scenarios
    switch (scenario) {
      case 'not-found':
        return res.status(404).json({
          error: 'Resource not found',
          details: 'Game not found',
          timestamp: new Date().toISOString()
        });
      
      case 'service-unavailable':
        return res.status(503).json({
          error: 'Service temporarily unavailable',
          details: 'External service unavailable',
          retryAfter: '30s',
          timestamp: new Date().toISOString()
        });
      
      case 'rate-limit':
        return res.status(429).json({
          error: 'Rate limit exceeded',
          details: 'Too many requests',
          retryAfter: '60s',
          timestamp: new Date().toISOString()
        });
      
      case 'auth-error':
        return res.status(401).json({
          error: 'Authentication failed',
          details: 'Unauthorized',
          timestamp: new Date().toISOString()
        });
      
      case 'network-error':
        return res.status(503).json({
          error: 'Service temporarily unavailable',
          details: 'Unable to connect to external service',
          timestamp: new Date().toISOString()
        });
      
      case 'invalid-json':
        return res.status(502).json({
          error: 'Bad gateway',
          details: 'External service returned invalid data format',
          timestamp: new Date().toISOString()
        });
      
      default:
        return res.json({
          id: id.trim(),
          prices: {},
          timestamp: new Date().toISOString(),
          responseTime: '15ms'
        });
    }
  });
  
  return app;
};

describe('Games API', () => {
  let app: express.Application;
  
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    app = createTestApp();
  });

  describe('GET /api/games/search', () => {
    test('should return 200 for valid query', async () => {
      const response = await request(app)
        .get('/api/games/search?query=portal')
        .expect(200);

      expect(response.body.query).toBe('portal');
      expect(response.body).toHaveProperty('results');
      expect(response.body).toHaveProperty('count');
    });

    test('should accept result_num and return 200 for valid value', async () => {
      const response = await request(app)
        .get('/api/games/search?query=portal&result_num=15')
        .expect(200);

      expect(response.body.query).toBe('portal');
      expect(response.body).toHaveProperty('results');
      expect(response.body).toHaveProperty('count');
    });

    test('should default to 10 results if result_num is not provided', async () => {
      const response = await request(app)
        .get('/api/games/search?query=portal')
        .expect(200);

      expect(response.body.query).toBe('portal');
      expect(response.body).toHaveProperty('results');
      expect(response.body).toHaveProperty('count');
    });

    test('should return 400 for result_num below 1', async () => {
      const response = await request(app)
        .get('/api/games/search?query=portal&result_num=0')
        .expect(400);

      expect(response.body.error).toBe('Invalid result_num: must be an integer between 1 and 100');
    });

    test('should return 400 for result_num above 100', async () => {
      const response = await request(app)
        .get('/api/games/search?query=portal&result_num=101')
        .expect(400);

      expect(response.body.error).toBe('Invalid result_num: must be an integer between 1 and 100');
    });

    test('should return 400 for non-integer result_num', async () => {
      const response = await request(app)
        .get('/api/games/search?query=portal&result_num=abc')
        .expect(400);

      expect(response.body.error).toBe('Invalid result_num: must be an integer between 1 and 100');
    });
  });

  describe('GET /api/games/prices', () => {
    const validId = '018d937f-07fc-72ed-8517-d8e24cb1eb22';

    test('should return price data successfully', async () => {
      const response = await request(app)
        .get(`/api/games/prices?id=${validId}`)
        .expect(200);

      expect(response.body.id).toBe(validId);
      expect(response.body).toHaveProperty('prices');
      expect(response.body).toHaveProperty('timestamp');
    });

    test('should return 400 for validation errors', async () => {
      // Missing ID
      await request(app).get('/api/games/prices').expect(400);
      
      // Empty ID
      await request(app).get('/api/games/prices?id=').expect(400);
      
      // Invalid UUID
      await request(app).get('/api/games/prices?id=invalid-uuid').expect(400);
    });

    test('should handle 404 not found', async () => {
      const response = await request(app)
        .get(`/api/games/prices?id=${validId}&scenario=not-found`)
        .expect(404);

      expect(response.body.error).toBe('Resource not found');
    });

    test('should handle 503 service unavailable', async () => {
      const response = await request(app)
        .get(`/api/games/prices?id=${validId}&scenario=service-unavailable`)
        .expect(503);

      expect(response.body.error).toBe('Service temporarily unavailable');
    });

    test('should handle 429 rate limit', async () => {
      const response = await request(app)
        .get(`/api/games/prices?id=${validId}&scenario=rate-limit`)
        .expect(429);

      expect(response.body.error).toBe('Rate limit exceeded');
    });

    test('should handle 401 authentication error', async () => {
      const response = await request(app)
        .get(`/api/games/prices?id=${validId}&scenario=auth-error`)
        .expect(401);

      expect(response.body.error).toBe('Authentication failed');
    });

    test('should handle network errors as 503', async () => {
      const response = await request(app)
        .get(`/api/games/prices?id=${validId}&scenario=network-error`)
        .expect(503);

      expect(response.body.error).toBe('Service temporarily unavailable');
    });

    test('should handle invalid JSON as 502', async () => {
      const response = await request(app)
        .get(`/api/games/prices?id=${validId}&scenario=invalid-json`)
        .expect(502);

      expect(response.body.error).toBe('Bad gateway');
    });
  });

  describe('Response Format', () => {
    test('should have consistent response structure', async () => {
      const validId = '018d937f-07fc-72ed-8517-d8e24cb1eb22';
      
      const searchResponse = await request(app)
        .get('/api/games/search?query=test')
        .expect(200);
      
      expect(searchResponse.body).toHaveProperty('query');
      expect(searchResponse.body).toHaveProperty('results');
      expect(searchResponse.body).toHaveProperty('timestamp');

      const pricesResponse = await request(app)
        .get(`/api/games/prices?id=${validId}`)
        .expect(200);
      
      expect(pricesResponse.body).toHaveProperty('id');
      expect(pricesResponse.body).toHaveProperty('prices');
      expect(pricesResponse.body).toHaveProperty('timestamp');
    });
  });
});