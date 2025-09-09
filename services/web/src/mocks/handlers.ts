import { http } from 'msw';
import type { GameSearchResult } from '../modules/core/utils/gameSearchService';

const mockResults: GameSearchResult[] = [
  {
    title: 'Portal 2',
    plain: 'portal2',
    id: '123',
    slug: 'portal-2',
    assets: { boxart: 'portal2.jpg' }
  },
  {
    title: 'Half-Life 2',
    plain: 'halflife2',
    id: '124',
    slug: 'half-life-2',
    assets: { boxart: 'halflife2.jpg' }
  },
  {
    title: 'The Witcher 3: Wild Hunt',
    plain: 'witcher3',
    id: '125',
    slug: 'the-witcher-3-wild-hunt',
    assets: { boxart: 'witcher3.jpg' }
  },
  {
    title: 'Stardew Valley',
    plain: 'stardewvalley',
    id: '126',
    slug: 'stardew-valley',
    assets: { boxart: 'stardewvalley.jpg' }
  },
  {
    title: 'Hades',
    plain: 'hades',
    id: '127',
    slug: 'hades',
    assets: { boxart: 'hades.jpg' }
  }
];

export const handlers = [
  http.get('/api/games/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    const filteredResults = query
      ? mockResults.filter(game =>
          game.title.toLowerCase().includes(query.toLowerCase())
        )
      : mockResults;

    return Response.json({
      query,
      results: filteredResults,
      count: filteredResults.length,
      timestamp: new Date().toISOString()
    });
  }),
];