import { useState } from 'react'
import { searchGame } from '../services/api'
import { useNotification } from '../app-wrappers/NotificationProvider'
import { useNavigate } from 'react-router-dom'

export function useSearchGame(
  query: string,
  setGamesList: (games: any) => void
) {
  const { showNotification, closeNotification } = useNotification()
  const navigate = useNavigate()
  const [searching, setSearching] = useState(false)

  const handleSearch = async () => {
    showNotification('Searching for games...', 'info')
    setSearching(true)
    try {
      const response = await searchGame(query)
      setGamesList(response)
      if (response !== null) {
        navigate('/search-game?query=' + encodeURIComponent(query))
      } else {
        setGamesList(null)
        showNotification('No games found.', 'warning')
        console.warn('Search Results Response:', response)
      }
    } catch (error: any) {
      setGamesList(null)
      showNotification(
        'An error occurred while searching. Please try again later.',
        'error'
      )
      console.error('Search API error:', error)
    } finally {
      setSearching(false)
      closeNotification()
    }
  }

  return { handleSearch, searching }
}
