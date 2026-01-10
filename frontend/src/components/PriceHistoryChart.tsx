import {
  ResponsiveContainer,
  Line,
  LineChart,
  Tooltip,
  Legend,
  CartesianGrid,
  YAxis,
  XAxis,
} from 'recharts'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../AppContext'

const PriceHistoryChart = () => {
  const { historyList, pricesList } = useContext(AppContext)
  const [chartData, setChartData] = useState<any[]>([])
  const [stores, setStores] = useState<Set<string>>(new Set())

  const parseHistoryData = () => {
    if (!historyList) return
    try {
      // Collect all unique store names
      const possibleStores = new Set<string>()
      historyList.forEach((point) => {
        possibleStores.add(point.shop.name)
      })
      if (pricesList) {
        pricesList.forEach((priceItem) => {
          priceItem.deals.forEach((deal) => {
            possibleStores.add(deal.shop.name)
          })
        })
      }
      setStores(possibleStores)

      // Group by timestamp
      const grouped: { [date: string]: any } = {}
      historyList.forEach((point) => {
        const date = new Date(point.timestamp).toLocaleDateString()
        if (!grouped[date]) {
          grouped[date] = { date }
        }
        grouped[date][point.shop.name] = point.deal.price.amount
      })

      // Add current prices point if pricesList is available
      if (pricesList) {
        const now = new Date().toLocaleDateString()
        const currentPricesPoint: any = { date: now }
        pricesList.forEach((priceItem) => {
          priceItem.deals.forEach((deal) => {
            currentPricesPoint[deal.shop.name] = deal.price.amount
          })
        })
        grouped[now] = currentPricesPoint
      }

      // Convert grouped object to array sorted by date (ascending)
      const groupedArr = Object.values(grouped).sort((a: any, b: any) => {
        const da = new Date(a.date.split('/').reverse().join('-'))
        const db = new Date(b.date.split('/').reverse().join('-'))
        return da.getTime() - db.getTime()
      })

      // For each store, find first index where it appears
      const allStores = Array.from(possibleStores)
      const storeFirstIndex: Record<string, number> = {}
      allStores.forEach((store) => {
        for (let i = 0; i < groupedArr.length; i++) {
          if (groupedArr[i][store] !== undefined) {
            storeFirstIndex[store] = i
            break
          }
        }
      })

      // Fill nulls only after first appearance
      const storesData = groupedArr.map((row: any, idx) => {
        const filledRow: any = { ...row }
        allStores.forEach((store) => {
          if (
            idx >= (storeFirstIndex[store] ?? Infinity) &&
            filledRow[store] === undefined
          ) {
            filledRow[store] = null
          }
        })
        return filledRow
      })

      console.log('Parsed chart data:', storesData)
      setChartData(storesData)
    } catch (error) {
      console.error('Error parsing history data:', error)
    }
  }

  // Update chart data when historyList or pricesList changes
  useEffect(() => {
    parseHistoryData()
  }, [historyList, pricesList])

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        {[...stores].map((store) => (
          <Line
            key={store}
            type="stepAfter"
            dataKey={store}
            stroke="#8884d8"
            connectNulls
          />
        ))}
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default PriceHistoryChart
