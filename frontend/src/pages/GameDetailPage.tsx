import { AppContext } from '../app-wrappers/AppContext'
import { useContext, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import HistoryLowCard from '../components/HistoryLowCard'
import CurrentPricesTableCard from '../components/CurrentPricesTableCard'
import PriceHistoryChart from '../components/PriceHistoryChart'
import { Grid } from '@mui/material'

// TODO: ViewStat management and charts for prices and history

const GameDetailPage = () => {
  const { pricesList, historyList, setPricesList, setHistoryList } =
    useContext(AppContext)
  const params = useParams()
  const location = useLocation()

  // Parse game_id from URL (either from path or query)
  const urlGameId =
    params.id || new URLSearchParams(location.search).get('game_id')

  useEffect(() => {
    // If no data or mismatched game, fetch from API
    const currentGameId = pricesList && pricesList[0]?.id
    if (
      !pricesList ||
      !historyList ||
      (urlGameId && currentGameId !== urlGameId)
    ) {
      if (urlGameId) {
        // Import fetchers directly to avoid circular deps
        import('../services/api').then(({ getGamePrices, getGameHistory }) => {
          getGamePrices(urlGameId).then(setPricesList)
          getGameHistory(urlGameId).then(setHistoryList)
        })
      }
    }
  }, [pricesList, historyList, urlGameId, setPricesList, setHistoryList])

  return (
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
  )
}

export default GameDetailPage
