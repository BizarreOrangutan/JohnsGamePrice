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

export interface GameSearchResponse {
  query: string;
  results: GameSearchResult[];
  count: number;
  timestamp: string;
}

export const getApiUrl = () => {
  // Server-side (Docker build)
  if (typeof window === 'undefined') {
    return 'http://api-gateway:8080';
  }

  // Development mode (localhost)
  if (window.location.hostname === 'localhost') {
    // Use relative path for MSW interception
    return '';
  }
};

export const gameSearchService = {
  async searchGames(query: string): Promise<GameSearchResult[]> {
    console.log("In search games")
    if (!query.trim()) return [];
    
    try {
      const baseUrl = getApiUrl();
      const url = `${baseUrl}/api/games/search?query=${encodeURIComponent(query)}`;
      
      console.log('Fetching from:', url);
      console.log('Environment:', {
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
        VITE_API_URL: import.meta.env.VITE_API_URL,
        baseUrl
      });
      
      const response = await fetch(url);
      console.log('Response:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error(`Expected JSON, got ${contentType}`);
      }
      
      const data: GameSearchResponse = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }
};