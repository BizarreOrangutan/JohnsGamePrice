import { AppContext } from '../AppContext'
import { useContext, useState } from 'react'
import StorePriceCard from '../components/StorePriceCard'
import type { GamePricesItem } from '../types/api'

enum ViewState {
  PRICES = 'prices',
  HISTORY = 'history',
}

// TODO: ViewStat management and charts for prices and history

const GameDetailPage = () => {
  const [view, setView] = useState<ViewState>(ViewState.PRICES)
  const { pricesList, historyList } = useContext(AppContext)

  return (
    <div>
      {/* List of store prices */}
      {pricesList &&
        pricesList.map((priceItem) => (
          <StorePriceCard key={priceItem.id} priceItem={priceItem} />
        ))}
    </div>
  )
}

export default GameDetailPage
