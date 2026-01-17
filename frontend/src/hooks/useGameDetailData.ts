import { useCallback, useEffect, useState } from 'react'
import type { GamePricesList, GameHistoryList } from '../types/api'
import { getGamePrices, getGameHistory } from '../services/api'

export function useGameDetailData(gameId: string | null, region: string) {
  const [pricesList, setPricesList] = useState<GamePricesList | null>(null)
  const [historyList, setHistoryList] = useState<GameHistoryList | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(() => {
    if (!gameId) {
      setError('No game ID provided')
      return
    }
    setLoading(true)
    setError(null)
    Promise.all([
      getGamePrices(gameId, region).catch(() => null),
      getGameHistory(gameId, region).catch(() => null),
    ])
      .then(([prices, history]) => {
        setPricesList(prices)
        setHistoryList(history)
      })
      .catch(() => setError('Failed to fetch game data'))
      .finally(() => setLoading(false))
  }, [gameId, region])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { pricesList, historyList, loading, error, refetch: fetchData }
}
