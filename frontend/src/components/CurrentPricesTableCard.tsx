import { useContext } from 'react'
import { AppContext } from '../AppContext'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardContent,
} from '@mui/material'

const CurrentPricesTableCard = () => {
  const { pricesList } = useContext(AppContext)

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

  if (pricesList == null || pricesList[0].deals == null) {
    console.warn('No deals data available to display.')
    return null
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
                <TableCell>{deal.shop.name}</TableCell>
                <TableCell>
                  {deal.price.amount.toFixed(2)} {deal.price.currency}
                </TableCell>
                <TableCell>
                  {deal.regular.amount.toFixed(2)} {deal.regular.currency}
                </TableCell>
                <TableCell>{deal.cut}%</TableCell>
                <TableCell>
                  {deal.platforms.map((p) => p.name).join(', ')}
                </TableCell>
                <TableCell>
                  {deal.drm.map((d) => d.name).join(', ') || 'DRM Free'}
                </TableCell>
                <TableCell>{isoToDDMMYYYY(deal.timestamp)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default CurrentPricesTableCard
