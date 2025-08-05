import express from 'express';

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
 *     responses:
 *       200:
 *         description: Game search results
 *       400:
 *         description: Missing game name
 */
router.get('/search', async (req: express.Request, res: express.Response) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        error: 'Query parameter is required',
        example: '/api/games/search?query=portal',
      });
    }

    console.log(`Searching for: "${query}"`);

    const priceFetcherServiceUrl = process.env.PRICE_FETCHER_SERVICE_URL || 'http://price-fetcher:8000';
    
    const response = await fetch(`${priceFetcherServiceUrl}/game-ids?title=${encodeURIComponent(query as string)}&result_num=10`);
    
    if (!response.ok) {
      throw new Error(`Price fetcher service error: ${response.status}`);
    }
    
    const data = await response.json() as PriceFetcherServiceResponse;
    
    res.status(200).json({
      query,
      results: data.games || [],
      count: data.count || 0,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Search failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
