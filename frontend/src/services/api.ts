import type { GameSearchResult } from '../types/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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
  country: string = 'GB'
): Promise<any> {
  const response = await fetch(`${API_URL}/prices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ game_id, country }),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const data = await response.json()
  return data
}
