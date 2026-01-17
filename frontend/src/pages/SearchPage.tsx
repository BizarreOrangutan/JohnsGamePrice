import SearchBar from '../components/SearchBar'
import { useContext } from 'react'
import { AppContext } from '../app-wrappers/AppContext'
import { searchGame } from '../services/api'
import { useNavigate } from 'react-router-dom'
import Stack from '@mui/material/Stack'

import { useNotification } from '../app-wrappers/NotificationProvider'

const SearchPage = () => {
  const { showNotification, closeNotification } = useNotification()
  const navigate = useNavigate()
  const { setGamesList, query, setQuery } = useContext(AppContext)

  const handleSearch = async () => {
    showNotification('Searching for games...', 'info')
    try {
      const response = await searchGame(query)
      setGamesList(response)
      if (response !== null) {
        navigate('/search-game?query=' + encodeURIComponent(query))
      } else {
        showNotification('No games found.', 'warning')
        console.warn('Search Results Response:', response)
      }
    } catch (error: any) {
      showNotification('An error occurred while searching. Please try again later.', 'error')
      console.error('Search API error:', error)
    } finally {
      closeNotification()
    }
  }

  return (
    <Stack spacing={2} alignItems="center" justifyContent="center" height="100vh">
      <img
        src={"/assets/John's Game Price Logo.png"}
        alt="John's Game Price Logo"
        style={{ height: "50%", width : "auto", imageRendering: "pixelated" }}
      />
      <SearchBar
        input={query}
        setInput={setQuery as React.Dispatch<React.SetStateAction<string>>}
        handleEnter={handleSearch}
        sx ={{ width: '50%' }}
      />
    </Stack>
  )
}

export default SearchPage
