import express from 'express';

const router = express.Router();

// ✅ Fix the interface - remove any
interface GameIdServiceResponse {
  game_ids?: Array<{
    id: number;
    name: string;
  }>;
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

    const gameIdServiceUrl = process.env.GAME_ID_SERVICE_URL || 'http://game-id-fetcher:8000';
    
    const response = await fetch(`${gameIdServiceUrl}/game-ids?query=${encodeURIComponent(query as string)}`);
    
    if (!response.ok) {
      throw new Error(`Game service error: ${response.status}`);
    }
    const unknownData: unknown = await response.json();
    
    if (typeof unknownData !== 'object' || unknownData === null) {
      throw new Error('Invalid response format from game service');
    }
    
    const data = unknownData as GameIdServiceResponse;
    
    res.status(200).json({
      query,
      results: data.game_ids || [],
      count: data.game_ids?.length || 0,
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
