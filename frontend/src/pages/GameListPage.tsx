import GameCard from '../components/GameCard'
import { useContext, useEffect } from 'react'
import { AppContext } from '../app-wrappers/AppContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { getGameHistory, getGamePrices, searchGame } from '../services/api'
import { Grid, Typography } from '@mui/material'
import type { GameSearchResultItem } from '../types/api'

const GameListPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { gamesList, setGamesList, setPricesList, setHistoryList } =
    useContext(AppContext)
  // On mount, if gamesList is null and query param exists, call searchGame
  useEffect(() => {
    if (!gamesList) {
      const params = new URLSearchParams(location.search)
      const query = params.get('query')
      if (query) {
        searchGame(query).then((result) => {
          if (result) setGamesList(result)
        })
      }
    }
  }, [gamesList, location.search, setGamesList])

  const handleGameClick = async (id: string) => {
    console.log('Handling game clicked:', id)
    const priceResponse = await getGamePrices(id)
    setPricesList(priceResponse)
    const historyResponse = await getGameHistory(id)
    setHistoryList(historyResponse)

    // Encode params for link sharing (could add more params as needed)
    const params = new URLSearchParams({ game_id: id }).toString()
    if (priceResponse !== null && historyResponse !== null) {
      navigate(`/game/${id}?${params}`)
    }
    console.warn('Game Details Response:', priceResponse)
  }
  
  const params = new URLSearchParams(location.search)
  const searchQuery = params.get('query') || ''

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
        {gamesList ? (
          gamesList.map((game: GameSearchResultItem) => (
            <Grid key={game.id} size={{ xs: 4, sm: 3, md: 2 }}>
              <GameCard game={game} onClick={handleGameClick} />
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
