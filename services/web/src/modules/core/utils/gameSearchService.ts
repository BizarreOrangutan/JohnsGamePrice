export interface GameSearchResult {
  title: string;
  plain: string;
  id?: string;
  slug?: string;
  assets?: {
    boxart?: string;
    banner?: string;
    logo?: string;
  };
  mature?: boolean;
  type?: string;
}

export interface PriceInfo {
  store: string;
  currentPrice: number;
  basePrice?: number;
  currency: string;
  discount?: number;
  url?: string;
}

export interface PriceHistoryPoint {
  timestamp: string;
  shop: {
    id: number;
    name: string;
  };
  deal: {
    price: {
      amount: number;
      amountInt: number;
      currency: string;
    };
    regular: {
      amount: number;
      amountInt: number;
      currency: string;
    };
    cut: number;
  };
}

export interface GameDetailsResult extends GameSearchResult {
  prices: PriceInfo[];
  priceHistory: PriceHistoryPoint[];
}

export interface GameSearchResponse {
  query: string;
  results: GameSearchResult[];
  count: number;
  timestamp: string;
}

export const getApiUrl = () => {
  // Always use relative path in development for MSW interception
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return '';
  }
  // Use your production API host in production
  return 'http://api-gateway:8080';
};

export const gameSearchService = {
  async searchGames(query: string): Promise<GameSearchResult[]> {
    if (!query.trim()) return [];
    try {
      const baseUrl = getApiUrl();
      const url = `${baseUrl}/api/games/search?query=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON, got ${contentType}`);
      }
      const data: GameSearchResponse = await response.json();
      return data.results || [];
    } catch (error) {
      throw error;
    }
  },

  async getGameDetails(id: string): Promise<GameDetailsResult | null> {
    if (!id) return null;
    try {
      const baseUrl = getApiUrl();
      const detailsUrl = `${baseUrl}/api/games/details/${encodeURIComponent(id)}`;
      const response = await fetch(detailsUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON, got ${contentType}`);
      }
      const details: GameDetailsResult = await response.json();
      
      return details;
    } catch (error) {
      throw error;
    }
  }
};