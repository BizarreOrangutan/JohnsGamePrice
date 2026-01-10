import { AppContext } from '../AppContext'
import { useContext, useState } from 'react'
import StorePriceCard from '../components/StorePriceCard'
import PriceHistoryChart from '../components/PriceHistoryChart'

enum ViewState {
  PRICES = 'prices',
  HISTORY = 'history',
}

// TODO: ViewStat management and charts for prices and history

const GameDetailPage = () => {
  const [view, setView] = useState<ViewState>(ViewState.HISTORY)
  const { pricesList, historyList } = useContext(AppContext)

  return (
    <div className="w-full p-4">
      {/* List of store prices */}
      {view === ViewState.PRICES &&
        pricesList &&
        pricesList.map((priceItem) => (
          <StorePriceCard key={priceItem.id} priceItem={priceItem} />
        ))}

      {/* Price history chart */}
      {view === ViewState.HISTORY && historyList && (
        <div className="h-96 w-full">
          {/* Placeholder for price history chart */}
          <h2>Price History Chart</h2>
          {/* Chart component would go here */}
          <PriceHistoryChart />
        </div>
      )}
    </div>
  )
}

export default GameDetailPage
