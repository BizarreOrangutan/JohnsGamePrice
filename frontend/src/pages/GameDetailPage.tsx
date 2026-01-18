import { AppContext } from '../app-wrappers/AppContext'
import { useContext, useMemo, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import HistoryLowCard from '../components/HistoryLowCard'
import CurrentPricesTableCard from '../components/CurrentPricesTableCard'
import PriceHistoryChart from '../components/PriceHistoryChart'
import { GameDetailContext } from '../components/GameDetailContext'
import { Grid, Typography } from '@mui/material'
import { useNotification } from '../app-wrappers/NotificationProvider'
import { useGameDetailData } from '../hooks/useGameDetailData'

const GameDetailPage = () => {
  const { region } = useContext(AppContext)
  const { showNotification, closeNotification } = useNotification()
  const params = useParams()
  const location = useLocation()
  const urlGameId =
    params.id || new URLSearchParams(location.search).get('game_id')
  const gameTitle =
    new URLSearchParams(location.search).get('title') || 'No title found'
  const { pricesList, historyList, loading, error } =
    useGameDetailData(urlGameId, region)
  const currency = useMemo(() => {
    if (
      pricesList &&
      pricesList.length > 0 &&
      pricesList[0].deals &&
      pricesList[0].deals.length > 0
    ) {
      return pricesList[0].deals[0].price.currency
    }
    return null
  }, [pricesList])

  // Notification handling for loading/error
  useEffect(() => {
    if (loading) {
      showNotification('Fetching game data...', 'info')
    } else if (error) {
      showNotification(error, 'error')
    } else {
      closeNotification()
    }
  }, [loading, error, showNotification, closeNotification])

  return (
    <GameDetailContext.Provider
      value={{ pricesList, historyList, region, currency }}
    >
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ fontWeight: 700, letterSpacing: 1, mb: 3 }}
      >
        {gameTitle ? gameTitle : 'Game Details'}
      </Typography>
      <Grid container spacing={3}>
        <Grid size={8}>
          <PriceHistoryChart />
        </Grid>
        <Grid size={4}>
          <HistoryLowCard />
        </Grid>
        <Grid size={12}>
          <CurrentPricesTableCard />
        </Grid>
      </Grid>
    </GameDetailContext.Provider>
  )
}

export default GameDetailPage
