import { useGameDetailContext } from './GameDetailContext'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardContent,
  Typography,
} from '@mui/material'

const CurrentPricesTableCard = () => {
  const { pricesList } = useGameDetailContext()

  const isoToDDMMYYYY = (isoString: string) => {
    const date = new Date(isoString)

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid ISO date string')
    }

    const day = String(date.getDate()).padStart(2, '0') // 1 → "01", 15 → "15"
    const month = String(date.getMonth() + 1).padStart(2, '0') // 0 → "01" (January)
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  if (
    !pricesList ||
    pricesList.length === 0 ||
    !pricesList[0].deals ||
    pricesList[0].deals.length === 0
  ) {
    console.warn('No deals data available to display.')
    return (
      <Card sx={{ height: '100%', width: '100%' }}>
        <CardContent>
          <Typography variant="body1" align="center">
            No price data available.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      style={{
        marginTop: 16,
        padding: 12,
        background: '#f5f5f5',
        borderRadius: 8,
      }}
    >
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Shop</TableCell>
              <TableCell>Current Price</TableCell>
              <TableCell>Regular Price</TableCell>
              <TableCell>Cut</TableCell>
              <TableCell>Platforms</TableCell>
              <TableCell>DRM</TableCell>
              <TableCell>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pricesList[0].deals.map((deal, idx) => (
              <TableRow key={idx}>
                <TableCell>{deal.shop?.name ?? 'N/A'}</TableCell>
                <TableCell>
                  {deal.price?.amount != null && deal.price?.currency
                    ? `${deal.price.amount.toFixed(2)} ${deal.price.currency}`
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {deal.regular?.amount != null && deal.regular?.currency
                    ? `${deal.regular.amount.toFixed(2)} ${deal.regular.currency}`
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {deal.cut != null ? `${deal.cut}%` : 'N/A'}
                </TableCell>
                <TableCell>
                  {deal.platforms?.length
                    ? deal.platforms.map((p) => p.name).join(', ')
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {deal.drm?.length
                    ? deal.drm.map((d) => d.name).join(', ')
                    : 'DRM Free'}
                </TableCell>
                <TableCell>
                  {deal.timestamp ? isoToDDMMYYYY(deal.timestamp) : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default CurrentPricesTableCard
