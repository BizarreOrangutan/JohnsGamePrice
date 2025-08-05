import { describe, test, expect, beforeEach, mock } from 'bun:test';
import { renderHook, act } from '@testing-library/react';
import { useGameSearch } from './useGameSearch';
import * as gameSearchService from '../utils/gameSearchService';

// Mock the game search service
const mockSearchGames = mock();
mock.module('../utils/gameSearchService', () => ({
  gameSearchService: {
    searchGames: mockSearchGames
  }
}));

describe('useGameSearch', () => {
  beforeEach(() => {
    mockSearchGames.mockClear();
    mockSearchGames.mockResolvedValue([]);
  });

  test('should initialize with empty state', () => {
    const { result } = renderHook(() => useGameSearch());

    expect(result.current.searchValue).toBe('');
    expect(result.current.searchOptions).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test('should update search value', () => {
    const { result } = renderHook(() => useGameSearch());

    act(() => {
      result.current.setSearchValue('portal');
    });

    expect(result.current.searchValue).toBe('portal');
  });

  test('should debounce search calls', async () => {
    const { result } = renderHook(() => useGameSearch(100));

    act(() => {
      result.current.setSearchValue('p');
    });

    act(() => {
      result.current.setSearchValue('po');
    });

    act(() => {
      result.current.setSearchValue('portal');
    });

    // Should not call search immediately
    expect(mockSearchGames).not.toHaveBeenCalled();

    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 150));

    // Should only call once with final value
    expect(mockSearchGames).toHaveBeenCalledTimes(1);
    expect(mockSearchGames).toHaveBeenCalledWith('portal');
  });

  test('should handle successful search', async () => {
    const mockResults = [
      { title: 'Portal 2', plain: 'portal2' }
    ];
    mockSearchGames.mockResolvedValue(mockResults);

    const { result } = renderHook(() => useGameSearch(50));

    act(() => {
      result.current.setSearchValue('portal');
    });

    // Wait for debounce and API call
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(result.current.searchOptions).toEqual(mockResults);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test('should handle search errors', async () => {
    mockSearchGames.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useGameSearch(50));

    act(() => {
      result.current.setSearchValue('portal');
    });

    // Wait for debounce and API call
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(result.current.searchOptions).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('API Error');
  });

  test('should clear results for empty search', async () => {
    const { result } = renderHook(() => useGameSearch(50));

    // First search with results
    mockSearchGames.mockResolvedValue([
      { title: 'Portal 2', plain: 'portal2' }
    ]);

    act(() => {
      result.current.setSearchValue('portal');
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(result.current.searchOptions).toHaveLength(1);

    // Clear search
    act(() => {
      result.current.setSearchValue('');
    });

    expect(result.current.searchOptions).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});