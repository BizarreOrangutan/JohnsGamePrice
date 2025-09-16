import { http } from 'msw';
import type { GameSearchResult, PriceInfo, GameDetailsResult } from '../modules/core/utils/gameSearchService';

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

// Prices for each game by id
const mockPricesById: Record<string, PriceInfo[]> = {
  '123': [
    {
      store: 'Steam',
      currentPrice: 9.99,
      basePrice: 19.99,
      currency: 'USD',
      discount: 50,
      url: 'https://store.steampowered.com/app/portal2'
    },
    {
      store: 'GOG',
      currentPrice: 8.49,
      basePrice: 16.99,
      currency: 'USD',
      discount: 50,
      url: 'https://www.gog.com/game/portal_2'
    }
  ],
  '124': [
    {
      store: 'Steam',
      currentPrice: 7.99,
      basePrice: 14.99,
      currency: 'USD',
      discount: 47,
      url: 'https://store.steampowered.com/app/halflife2'
    },
    {
      store: 'GOG',
      currentPrice: 6.99,
      basePrice: 13.99,
      currency: 'USD',
      discount: 50,
      url: 'https://www.gog.com/game/half_life_2'
    }
  ],
  '125': [
    {
      store: 'Steam',
      currentPrice: 19.99,
      basePrice: 39.99,
      currency: 'USD',
      discount: 50,
      url: 'https://store.steampowered.com/app/witcher3'
    },
    {
      store: 'GOG',
      currentPrice: 17.99,
      basePrice: 35.99,
      currency: 'USD',
      discount: 50,
      url: 'https://www.gog.com/game/witcher_3_wild_hunt'
    }
  ],
  '126': [
    {
      store: 'Steam',
      currentPrice: 11.99,
      basePrice: 14.99,
      currency: 'USD',
      discount: 20,
      url: 'https://store.steampowered.com/app/stardewvalley'
    },
    {
      store: 'GOG',
      currentPrice: 10.99,
      basePrice: 13.99,
      currency: 'USD',
      discount: 21,
      url: 'https://www.gog.com/game/stardew_valley'
    }
  ],
  '127': [
    {
      store: 'Steam',
      currentPrice: 24.99,
      basePrice: 29.99,
      currency: 'USD',
      discount: 17,
      url: 'https://store.steampowered.com/app/hades'
    },
    {
      store: 'GOG',
      currentPrice: 22.99,
      basePrice: 27.99,
      currency: 'USD',
      discount: 18,
      url: 'https://www.gog.com/game/hades'
    }
  ]
};

const mockPriceHistoryById: Record<string, any[]> = {
  '123': [
    {
      timestamp: "2022-01-01T10:00:00+01:00",
      shop: { id: 61, name: "Steam" },
      deal: {
        price: { amount: 19.99, amountInt: 1999, currency: "EUR" },
        regular: { amount: 39.99, amountInt: 3999, currency: "EUR" },
        cut: 50
      }
    },
    {
      timestamp: "2022-02-01T10:00:00+01:00",
      shop: { id: 61, name: "Steam" },
      deal: {
        price: { amount: 17.99, amountInt: 1799, currency: "EUR" },
        regular: { amount: 39.99, amountInt: 3999, currency: "EUR" },
        cut: 55
      }
    },
    {
      timestamp: "2022-03-01T10:00:00+01:00",
      shop: { id: 61, name: "Steam" },
      deal: {
        price: { amount: 15.99, amountInt: 1599, currency: "EUR" },
        regular: { amount: 39.99, amountInt: 3999, currency: "EUR" },
        cut: 60
      }
    },
    {
      timestamp: "2022-04-01T10:00:00+01:00",
      shop: { id: 61, name: "Steam" },
      deal: {
        price: { amount: 13.99, amountInt: 1399, currency: "EUR" },
        regular: { amount: 39.99, amountInt: 3999, currency: "EUR" },
        cut: 65
      }
    },
    {
      timestamp: "2022-05-01T10:00:00+01:00",
      shop: { id: 61, name: "Steam" },
      deal: {
        price: { amount: 11.99, amountInt: 1199, currency: "EUR" },
        regular: { amount: 39.99, amountInt: 3999, currency: "EUR" },
        cut: 70
      }
    },
    {
      timestamp: "2022-06-01T10:00:00+01:00",
      shop: { id: 61, name: "Steam" },
      deal: {
        price: { amount: 9.99, amountInt: 999, currency: "EUR" },
        regular: { amount: 39.99, amountInt: 3999, currency: "EUR" },
        cut: 75
      }
    },
    {
      timestamp: "2022-07-01T10:00:00+01:00",
      shop: { id: 61, name: "Steam" },
      deal: {
        price: { amount: 12.99, amountInt: 1299, currency: "EUR" },
        regular: { amount: 39.99, amountInt: 3999, currency: "EUR" },
        cut: 67
      }
    },
    {
      timestamp: "2022-08-01T10:00:00+01:00",
      shop: { id: 61, name: "Steam" },
      deal: {
        price: { amount: 14.99, amountInt: 1499, currency: "EUR" },
        regular: { amount: 39.99, amountInt: 3999, currency: "EUR" },
        cut: 62
      }
    },
    {
      timestamp: "2022-09-01T10:00:00+01:00",
      shop: { id: 61, name: "Steam" },
      deal: {
        price: { amount: 16.99, amountInt: 1699, currency: "EUR" },
        regular: { amount: 39.99, amountInt: 3999, currency: "EUR" },
        cut: 57
      }
    },
    {
      timestamp: "2022-10-01T10:00:00+01:00",
      shop: { id: 61, name: "Steam" },
      deal: {
        price: { amount: 18.99, amountInt: 1899, currency: "EUR" },
        regular: { amount: 39.99, amountInt: 3999, currency: "EUR" },
        cut: 52
      }
    },
    {
      timestamp: "2022-11-01T10:00:00+01:00",
      shop: { id: 61, name: "Steam" },
      deal: {
        price: { amount: 20.99, amountInt: 2099, currency: "EUR" },
        regular: { amount: 39.99, amountInt: 3999, currency: "EUR" },
        cut: 47
      }
    },
    {
      timestamp: "2022-12-01T10:00:00+01:00",
      shop: { id: 61, name: "Steam" },
      deal: {
        price: { amount: 22.99, amountInt: 2299, currency: "EUR" },
        regular: { amount: 39.99, amountInt: 3999, currency: "EUR" },
        cut: 42
      }
    },
    {
      timestamp: "2022-12-27T11:21:08+01:00",
      shop: { id: 61, name: "Steam" },
      deal: {
        price: { amount: 9.99, amountInt: 999, currency: "EUR" },
        regular: { amount: 39.99, amountInt: 3999, currency: "EUR" },
        cut: 75
      }
    },
    {
      timestamp: "2022-12-14T00:12:29+01:00",
      shop: { id: 61, name: "Steam" },
      deal: {
        price: { amount: 39.99, amountInt: 3999, currency: "EUR" },
        regular: { amount: 39.99, amountInt: 3999, currency: "EUR" },
        cut: 0
      }
    }
      ,
  // GOG data points with some overlapping timestamps
    {
      timestamp: "2022-01-01T10:00:00+01:00",
      shop: { id: 1, name: "GOG" },
      deal: {
        price: { amount: 16.99, amountInt: 1699, currency: "EUR" },
        regular: { amount: 33.99, amountInt: 3399, currency: "EUR" },
        cut: 50
      }
    },
    {
      timestamp: "2022-03-01T10:00:00+01:00",
      shop: { id: 1, name: "GOG" },
      deal: {
        price: { amount: 13.99, amountInt: 1399, currency: "EUR" },
        regular: { amount: 33.99, amountInt: 3399, currency: "EUR" },
        cut: 59
      }
    },
    {
      timestamp: "2022-05-01T10:00:00+01:00",
      shop: { id: 1, name: "GOG" },
      deal: {
        price: { amount: 10.99, amountInt: 1099, currency: "EUR" },
        regular: { amount: 33.99, amountInt: 3399, currency: "EUR" },
        cut: 68
      }
    },
    {
      timestamp: "2022-06-01T10:00:00+01:00",
      shop: { id: 1, name: "GOG" },
      deal: {
        price: { amount: 8.49, amountInt: 849, currency: "EUR" },
        regular: { amount: 33.99, amountInt: 3399, currency: "EUR" },
        cut: 75
      }
    },
    {
      timestamp: "2022-07-01T10:00:00+01:00",
      shop: { id: 1, name: "GOG" },
      deal: {
        price: { amount: 9.99, amountInt: 999, currency: "EUR" },
        regular: { amount: 33.99, amountInt: 3399, currency: "EUR" },
        cut: 71
      }
    },
    {
      timestamp: "2022-09-01T10:00:00+01:00",
      shop: { id: 1, name: "GOG" },
      deal: {
        price: { amount: 12.99, amountInt: 1299, currency: "EUR" },
        regular: { amount: 33.99, amountInt: 3399, currency: "EUR" },
        cut: 62
      }
    },
    {
      timestamp: "2022-10-01T10:00:00+01:00",
      shop: { id: 1, name: "GOG" },
      deal: {
        price: { amount: 14.49, amountInt: 1449, currency: "EUR" },
        regular: { amount: 33.99, amountInt: 3399, currency: "EUR" },
        cut: 57
      }
    },
    {
      timestamp: "2022-12-01T10:00:00+01:00",
      shop: { id: 1, name: "GOG" },
      deal: {
        price: { amount: 17.49, amountInt: 1749, currency: "EUR" },
        regular: { amount: 33.99, amountInt: 3399, currency: "EUR" },
        cut: 49
      }
    },
    // Epic store data points with some overlapping timestamps
    {
      timestamp: "2022-03-01T10:00:00+01:00", // overlaps with Steam & GOG
      shop: { id: 100, name: "Epic" },
      deal: {
        price: { amount: 14.99, amountInt: 1499, currency: "EUR" },
        regular: { amount: 34.99, amountInt: 3499, currency: "EUR" },
        cut: 57
      }
    },
    {
      timestamp: "2022-05-01T10:00:00+01:00", // overlaps with Steam & GOG
      shop: { id: 100, name: "Epic" },
      deal: {
        price: { amount: 12.99, amountInt: 1299, currency: "EUR" },
        regular: { amount: 34.99, amountInt: 3499, currency: "EUR" },
        cut: 63
      }
    },
    {
      timestamp: "2022-08-01T10:00:00+01:00", // unique to Epic
      shop: { id: 100, name: "Epic" },
      deal: {
        price: { amount: 10.99, amountInt: 1099, currency: "EUR" },
        regular: { amount: 34.99, amountInt: 3499, currency: "EUR" },
        cut: 69
      }
    },
    {
      timestamp: "2022-12-01T10:00:00+01:00", // overlaps with Steam & GOG
      shop: { id: 100, name: "Epic" },
      deal: {
        price: { amount: 8.99, amountInt: 899, currency: "EUR" },
        regular: { amount: 34.99, amountInt: 3499, currency: "EUR" },
        cut: 74
      }
    }
  ]
};

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
  http.get('/api/games/details/:id', ({ params }) => {
    const id = String(params.id);
    const game = mockResults.find(g => g.id === id) || mockResults[0];
    const prices = mockPricesById[id] || [];

    const mockDetails: GameDetailsResult = {
      ...game,
      prices,
      priceHistory: mockPriceHistoryById[id] || []
    };

    return Response.json(mockDetails);
  }),
];