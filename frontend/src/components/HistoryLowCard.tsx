import { Card, CardContent, Typography } from '@mui/material'
import { AppContext } from '../app-wrappers/AppContext'
import { useContext } from 'react'

const HistoryLowCard = () => {
  const { pricesList } = useContext(AppContext)
  if (!pricesList || pricesList.length === 0) {
    return (
      <Card sx={{ p: 3, background: '#f5f5f5', width: '100%', height: '100%' }}>
        <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="h3" fontWeight={700} mb={2}>
            Historical Lows
          </Typography>
          <Typography color="text.secondary">No price data available.</Typography>
        </CardContent>
      </Card>
    )
  }
  if (!pricesList[0].historyLow) {
    return (
      <Card sx={{ p: 3, background: '#f5f5f5', width: '100%', height: '100%' }}>
        <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="h3" fontWeight={700} mb={2}>
            Historical Lows
          </Typography>
          <Typography color="text.secondary">No historical low data available.</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      sx={{
        p: 3,
        background: '#f5f5f5',
        width: '100%',
        height: '100%',
      }}
    >
      <CardContent
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Typography variant="h3" fontWeight={700} mb={2}>
          Historical Lows
        </Typography>
        <Typography sx={{ fontSize: 'clamp(1.2rem, 2vw, 2rem)' }}>
          🕰️ All Time Low:&nbsp;
          <strong>
            {pricesList[0].historyLow.all.amount.toFixed(2)}{' '}
            {pricesList[0].historyLow.all.currency}
          </strong>
        </Typography>
        <Typography sx={{ fontSize: 'clamp(1.2rem, 2vw, 2rem)' }}>
          📅 Last Year Low:&nbsp;
          <strong>
            {pricesList[0].historyLow.y1.amount.toFixed(2)}{' '}
            {pricesList[0].historyLow.y1.currency}
          </strong>
        </Typography>
        <Typography sx={{ fontSize: 'clamp(1.2rem, 2vw, 2rem)' }}>
          🗓️ Last 3 Months Low:&nbsp;
          <strong>
            {pricesList[0].historyLow.m3.amount.toFixed(2)}{' '}
            {pricesList[0].historyLow.m3.currency}
          </strong>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default HistoryLowCard
