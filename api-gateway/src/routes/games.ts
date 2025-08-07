import express from 'express';
import logger from '../utils/logger.js';
import { handleApiError } from '../utils/errorHandler.js';
import { fetchWithErrorHandling } from '../utils/fetchUtils.js';
import { validateSearchQuery, validateGameId, validateResponseData } from '../utils/validation.js';
import { DataFormatError } from '../utils/errors.js';

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
 *       - name: result_num
 *         in: query
 *         required: false
 *         description: Number of results to return (1-100)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
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

    // Parse and validate result_num
    let resultNum = 10;
    if (req.query.result_num !== undefined) {
      const parsed = parseInt(req.query.result_num as string, 10);
      if (isNaN(parsed) || parsed < 1 || parsed > 100) {
        return res.status(400).json({
          error: 'Invalid result_num: must be an integer between 1 and 100',
        });
      }
      resultNum = parsed;
    }

    logger.info(`Searching for game: "${query}"`, {
      query,
      resultNum,
      ip: req.ip,
      requestId: req.get('x-request-id') || 'unknown',
    });

    const priceFetcherServiceUrl = process.env.PRICE_FETCHER_SERVICE_URL || 'http://price-fetcher:8000';
    const searchUrl = `${priceFetcherServiceUrl}/game-ids?title=${encodeURIComponent(query)}&result_num=${resultNum}`;

    const response = await fetchWithErrorHandling(searchUrl, 'price-fetcher', { 
      timeout: 15000 
    });

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

    const responseTime = Date.now() - startTime;

    logger.info(`Game search completed successfully`, {
      query,
      resultNum,
      resultsCount: data.count || 0,
      gamesFound: data.games?.length || 0,
      responseTimeMs: responseTime,
    });

    res.status(200).json({
      query,
      results: data.games || [],
      count: data.count || 0,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
    });

  } catch (error) {
    handleApiError(error, req, res, { startTime });
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
    
    const responseTime = Date.now() - startTime;
    
    logger.info(`Successfully retrieved prices for game`, {
      gameId,
      pricesCount: Object.keys(data as object).length,
      responseTimeMs: responseTime,
    });
    
    res.status(200).json({
      id: gameId,
      prices: data,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
    });

  } catch (error) {
    handleApiError(error, req, res, { startTime });
  }
});

export default router;
