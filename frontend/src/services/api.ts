const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface GameSearchResultItem {
    id: string;
    slug: string;
    title: string;
    type: string;
    mature: boolean;
    assets: {
        banner145: string;
        banner300: string;
        banner400: string;
        boxart: string;
    }
}

interface GameSearchResult {
    games: Array<GameSearchResultItem>;
}

export async function searchGame(title: string): Promise<GameSearchResult | null> {
    const response = await fetch(`${API_URL}/search-game?title=${encodeURIComponent(title)}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

