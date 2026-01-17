import { useCallback, useEffect, useState } from 'react'
import { searchGame, getGamePrices, getGameHistory } from '../services/api'
import type {
  GameSearchResult,
  GamePricesList,
  GameHistoryList,
} from '../types/api'

export function useGameListData(query: string, region: string) {
  const [gamesList, setGamesList] = useState<GameSearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(() => {
    if (!query) {
      setError('No search query provided.')
      setGamesList(null)
      return
    }
    setLoading(true)
    setError(null)
    searchGame(query, region)
      .then((result) => {
        setGamesList(result)
        if (!result) setError('No games found.')
      })
      .catch(() => {
        setGamesList(null)
        setError('An error occurred while searching. Please try again later.')
      })
      .finally(() => setLoading(false))
  }, [query, region])

  // Optionally, fetch on mount or when query/region changes
  useEffect(() => {
    search()
  }, [search])

  // Fetch details for a game
  const fetchGameDetails = useCallback(
    async (id: string) => {
      setLoading(true)
      let prices: GamePricesList | null = null
      let history: GameHistoryList | null = null
      let errorMsg: string | null = null
      try {
        prices = await getGamePrices(id, region)
        history = await getGameHistory(id, region)
        if (!prices || !history) {
          errorMsg = 'Failed to fetch game details.'
        }
      } catch {
        errorMsg =
          'An error occurred while fetching game details. Please try again later.'
      } finally {
        setLoading(false)
      }
      return { prices, history, error: errorMsg }
    },
    [region]
  )

  return { gamesList, loading, error, search, fetchGameDetails, setGamesList }
}
