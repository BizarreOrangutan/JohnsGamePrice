import type {
  GameHistoryList,
  GamePricesList,
  GameSearchResult,
} from '../types/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
console.log('Using API URL:', API_URL)

// Get request to search for a game by title
export async function searchGame(
  title: string
): Promise<GameSearchResult | null> {
  const response = await fetch(
    `${API_URL}/search-game?title=${encodeURIComponent(title)}`
  )

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const data = await response.json()
  console.log('API Response:', data)
  const transformedData: GameSearchResult | null = Array.isArray(data)
    ? data
    : null
  console.log('Transformed Data:', transformedData)
  return transformedData
}

// Post request to get game prices
export async function getGamePrices(
  game_id: string,
  country: string = 'GB',
  shops?: number[]
): Promise<GamePricesList | null> {
  const response = await fetch(`${API_URL}/prices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ game_id, country, shops }),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const data = await response.json()
  console.log('API Response:', data)
  const transformedData: GamePricesList | null = Array.isArray(data)
    ? data
    : null
  console.log('Transformed Data:', transformedData)
  return transformedData
}

// Post request to fetch game historical price data
export async function getGameHistory(
  game_id: string,
  country: string = 'GB',
  shops?: number[],
  since?: string
): Promise<GameHistoryList | null> {
  const response = await fetch(`${API_URL}/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ game_id, country, shops, since }),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const data = await response.json()
  console.log('API Response:', data)
  const transformedData: GameHistoryList | null = Array.isArray(data)
    ? data
    : null
  console.log('Transformed Data:', transformedData)
  return transformedData
}
