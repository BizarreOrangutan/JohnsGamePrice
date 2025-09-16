import { useState, useEffect, useCallback } from 'react';
import { gameSearchService } from '../utils/gameSearchService';
import type { GameSearchResult, GameDetailsResult } from '../utils/gameSearchService';

interface UseGameSearchReturn {
  searchOptions: GameSearchResult[];
  loading: boolean;
  error: string | null;
  searchValue: string;
  setSearchValue: (value: string) => void;
  selectedGameDetails: GameDetailsResult | null;
  fetchGameDetails: (id: string) => Promise<void>;
}

export const useGameSearch = (debounceMs: number = 500): UseGameSearchReturn => {
  const [searchValue, setSearchValue] = useState('');
  const [searchOptions, setSearchOptions] = useState<GameSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGameDetails, setSelectedGameDetails] = useState<GameDetailsResult | null>(null);

  const debouncedSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchOptions([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await gameSearchService.searchGames(query);
        setSearchOptions(results);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Search failed';
        setError(errorMessage);
        setSearchOptions([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchGameDetails = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const details = await gameSearchService.getGameDetails(id);
        setSelectedGameDetails(details);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch game details';
        setError(errorMessage);
        setSelectedGameDetails(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchValue);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchValue, debouncedSearch, debounceMs]);

  return {
    searchOptions,
    loading,
    error,
    searchValue,
    setSearchValue,
    selectedGameDetails,
    fetchGameDetails,
  };
};