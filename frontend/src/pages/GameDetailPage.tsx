import { AppContext } from '../app-wrappers/AppContext'
import { useContext, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import HistoryLowCard from '../components/HistoryLowCard'
import CurrentPricesTableCard from '../components/CurrentPricesTableCard'
import PriceHistoryChart from '../components/PriceHistoryChart'
import { Grid, Typography } from '@mui/material'
import { useNotification } from '../app-wrappers/NotificationProvider'

const GameDetailPage = () => {
  const { pricesList, historyList, setPricesList, setHistoryList } =
  useContext(AppContext)
  const { showNotification, closeNotification } = useNotification()
  const params = useParams()
  const location = useLocation()
  // Get the game title from pricesList if available
  const gameTitle = new URLSearchParams(location.search).get('title') || "No title found"
  
  // Parse game_id from URL (either from path or query)
  const urlGameId =
    params.id || new URLSearchParams(location.search).get('game_id')

  useEffect(() => {
    // Only fetch if data is missing or mismatched
    const currentGameId = pricesList && pricesList[0]?.id
    const needsFetch =
      !pricesList || pricesList.length === 0 ||
      !historyList || historyList.length === 0 ||
      (urlGameId && currentGameId !== urlGameId)

    if (!needsFetch) return

    let isMounted = true

    if (urlGameId) {
      showNotification('Fetching game data...', 'info')
      import('../services/api')
        .then(({ getGamePrices, getGameHistory }) => {
          Promise.all([
            getGamePrices(urlGameId).then((prices) => {
              if (isMounted && prices && prices[0]?.id === urlGameId) setPricesList(prices)
            }).catch((error) => {
              showNotification('Failed to fetch current prices. Please try again later.', 'error')
              console.error('getGamePrices error:', error)
            }),
            getGameHistory(urlGameId).then((history) => {
              if (isMounted && history && urlGameId) setHistoryList(history)
            }).catch((error) => {
              showNotification('Failed to fetch price history. Please try again later.', 'error')
              console.error('getGameHistory error:', error)
            })
          ]).finally(() => {
            closeNotification()
          })
        })
        .catch((error) => {
          showNotification('An error occurred while loading game data.', 'error')
          console.error('API import error:', error)
          closeNotification()
        })
    } else {
      showNotification('No game ID provided in URL.', 'error')
    }

    return () => {
      isMounted = false
    }
  }, [pricesList, historyList, urlGameId, showNotification])

  return (
    <>
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
    </>
  )
}

export default GameDetailPage
