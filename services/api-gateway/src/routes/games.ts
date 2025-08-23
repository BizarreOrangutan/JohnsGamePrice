import express from 'express';
import logger from '../utils/logger.js';
import { handleApiError } from '../utils/errorHandler.js';
import { fetchWithErrorHandling } from '../utils/fetchUtils.js';
import { validateSearchQuery, validateGameId, validateResponseData } from '../utils/validation.js';
import { DataFormatError } from '../utils/errors.js';
import { redisClient } from '../utils/redisClient.js';

const router = express.Router();

interface PriceFetcherServiceResponse {
  games?: Array<{
    title?: string;
    plain?: string;
  }>;
  count?: number;
  message?: string;
  error?: string;
}

/**
 * @swagger
 * /api/games/search:
 *   get:
 *     summary: Search for games
 *     tags:
 *       - Games
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: Name of the game to search for
 *         example: portal
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number (starts at 1)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - name: page_size
 *         in: query
 *         required: false
 *         description: Results per page (max 100)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         example: 20
 *     responses:
 *       200:
 *         description: Game search results
 *       400:
 *         description: Missing or invalid game name
 *       503:
 *         description: External service unavailable
 *       500:
 *         description: Internal server error
 */
router.get('/search', async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();

  try {
    const query = validateSearchQuery(req.query.query);
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.page_size as string, 10) || 20));

    // Compose cache key for redis
    const cacheKey = `gamesearch:${query}:${page}:${pageSize}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      const cachedData = JSON.parse(cached);
      return res.status(200).json({ ...cachedData, cached: true });
    }

    const fetchLimit = 100;
    const priceFetcherServiceUrl = process.env.PRICE_FETCHER_SERVICE_URL || 'http://price-fetcher:8000';
    const searchUrl = `${priceFetcherServiceUrl}/game-ids?title=${encodeURIComponent(query)}&result_num=${fetchLimit}`;

    const response = await fetchWithErrorHandling(searchUrl, 'price-fetcher', { timeout: 15000 });
    let data: PriceFetcherServiceResponse;

    try {
      data = await response.json() as PriceFetcherServiceResponse;
      validateResponseData(data, 'object');
    } catch (jsonError) {
      logger.error('Failed to parse JSON response from price fetcher', {
        query,
        serviceUrl: priceFetcherServiceUrl,
        error: jsonError instanceof Error ? jsonError.message : 'Unknown JSON error',
      });
      throw new DataFormatError('Invalid JSON response from price fetcher service', 'JSON');
    }

    // Local pagination
    const allResults = data.games || [];
    const total = allResults.length;
    const start = (page - 1) * pageSize;
    const endIdx = start + pageSize;
    const pagedResults = allResults.slice(start, endIdx);

    const responseData = {
      query,
      results: pagedResults,
      count: total,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(total / pageSize),
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`,
    };

    // Cache the result for 5 minutes (300 seconds)
    await redisClient.setEx(cacheKey, 300, JSON.stringify(responseData));

    res.status(200).json(responseData);

  } catch (error) {
    handleApiError(error, req, res, { startTime }); // <-- Use local variable
  }
});

/**
 * @swagger
 * /api/games/prices:
 *   get:
 *     summary: Get game prices
 *     tags:
 *       - Games
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: Game ID to get prices for
 *         example: 018d937f-07fc-72ed-8517-d8e24cb1eb22
 *     responses:
 *       200:
 *         description: Game price information
 *       400:
 *         description: Missing or invalid game ID
 *       404:
 *         description: Game not found
 *       503:
 *         description: External service unavailable
 *       500:
 *         description: Internal server error
 */
router.get('/prices', async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();

  try {
    const gameId = validateGameId(req.query.id);

    logger.info(`Getting prices for game ID: "${gameId}"`, {
      gameId,
      ip: req.ip,
      requestId: req.get('x-request-id') || 'unknown',
    });

    const priceFetcherServiceUrl = process.env.PRICE_FETCHER_SERVICE_URL || 'http://price-fetcher:8000';
    const pricesUrl = `${priceFetcherServiceUrl}/prices?id=${encodeURIComponent(gameId)}`;

    const response = await fetchWithErrorHandling(pricesUrl, 'price-fetcher', {
      timeout: 20000
    });

    let data: unknown;

    try {
      data = await response.json();
      validateResponseData(data, 'object');
    } catch (jsonError) {
      logger.error('Failed to parse JSON response from price fetcher', {
        gameId,
        serviceUrl: priceFetcherServiceUrl,
        error: jsonError instanceof Error ? jsonError.message : 'Unknown JSON error',
      });
      throw new DataFormatError('Invalid JSON response from price fetcher service', 'JSON');
    }

    logger.info(`Successfully retrieved prices for game`, {
      gameId,
      pricesCount: Object.keys(data as object).length,
      responseTimeMs: Date.now() - startTime,
    });

    res.status(200).json({
      id: gameId,
      prices: data,
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`,
    });

  } catch (error) {
    handleApiError(error, req, res, { startTime });
  }
});

export default router;
