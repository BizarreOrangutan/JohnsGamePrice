import { Card, CardContent, Typography } from '@mui/material'
import { useGameDetailContext } from './GameDetailContext'

const HistoryLowCard = () => {
  const { pricesList } = useGameDetailContext()
  if (!pricesList || pricesList.length === 0) {
    return (
      <Card sx={{ p: 3, background: '#f5f5f5', width: '100%', height: '100%' }}>
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
          <Typography color="text.secondary">
            No price data available.
          </Typography>
        </CardContent>
      </Card>
    )
  }
  if (!pricesList[0].historyLow) {
    return (
      <Card sx={{ p: 3, background: '#f5f5f5', width: '100%', height: '100%' }}>
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
          <Typography color="text.secondary">
            No historical low data available.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const allLow = pricesList[0].historyLow?.all
  const y1Low = pricesList[0].historyLow?.y1
  const m3Low = pricesList[0].historyLow?.m3

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
            {allLow?.amount != null && allLow?.currency
              ? `${allLow.amount.toFixed(2)} ${allLow.currency}`
              : 'N/A'}
          </strong>
        </Typography>
        <Typography sx={{ fontSize: 'clamp(1.2rem, 2vw, 2rem)' }}>
          📅 Last Year Low:&nbsp;
          <strong>
            {y1Low?.amount != null && y1Low?.currency
              ? `${y1Low.amount.toFixed(2)} ${y1Low.currency}`
              : 'N/A'}
          </strong>
        </Typography>
        <Typography sx={{ fontSize: 'clamp(1.2rem, 2vw, 2rem)' }}>
          🗓️ Last 3 Months Low:&nbsp;
          <strong>
            {m3Low?.amount != null && m3Low?.currency
              ? `${m3Low.amount.toFixed(2)} ${m3Low.currency}`
              : 'N/A'}
          </strong>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default HistoryLowCard
