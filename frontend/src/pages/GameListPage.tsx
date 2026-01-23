import { useContext, useMemo, useEffect } from 'react'
import { AppContext } from '../app-wrappers/AppContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGameListData } from '../hooks/useGameListData'
import { Grid, Typography } from '@mui/material'
import type { GameSearchResultItem } from '../types/api'
import { useNotification } from '../app-wrappers/NotificationProvider'
import GameCard from '../components/GameCard'

const GameListPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { showNotification, closeNotification } = useNotification()
  const { setPricesList, setHistoryList, region } = useContext(AppContext)
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  )
  const searchQuery = useMemo(() => params.get('query') || '', [params])
  const { gamesList, loading, error, fetchGameDetails } = useGameListData(
    searchQuery,
    region
  )

  // Show notification for errors or loading (useEffect to avoid multiple triggers)
  useEffect(() => {
    if (error) {
      showNotification(error, 'error')
    } else if (loading) {
      showNotification('Loading...', 'info')
    } else {
      closeNotification()
    }
    // Only run when loading or error changes
  }, [loading, error, showNotification, closeNotification])

  const handleGameClick = async (id: string, title: string) => {
    if (loading) return
    showNotification(`Fetching details for ${title}...`, 'info')
    const { prices, history, error: detailsError } = await fetchGameDetails(id)
    setPricesList(prices)
    setHistoryList(history)
    const params = new URLSearchParams({ game_id: id }).toString()
    if (!detailsError && prices && history) {
      navigate(`/game/${id}?${params}&title=${encodeURIComponent(title)}`)
      closeNotification()
    } else {
      showNotification(
        detailsError || 'Failed to fetch game details.',
        'error',
        undefined
      )
      // Don't close error notification immediately
    }
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom align="center">
        Search Results for {searchQuery ? `"${searchQuery}"` : ''}
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        style={{ padding: 16 }}
      >
        {gamesList && gamesList.length > 0 ? (
          gamesList.map((game: GameSearchResultItem) => (
            <Grid key={game.id} size={{ xs: 4, sm: 3, md: 2 }}>
              <GameCard
                game={game}
                onClick={() => handleGameClick(game.id, game.title)}
                disabled={loading}
              />
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 4, sm: 8, md: 12 }}>
            <p>No games found.</p>
          </Grid>
        )}
      </Grid>
    </div>
  )
}

export default GameListPage
