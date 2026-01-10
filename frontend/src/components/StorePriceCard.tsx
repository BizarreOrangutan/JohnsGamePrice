import type { GamePricesItem } from '../types/api'

const StorePriceCard: React.FC<{ priceItem: GamePricesItem }> = ({
  priceItem,
}) => {
  return (
    <div>
      {priceItem.deals &&
        priceItem.deals.map((deal, index) => (
          <div key={index}>
            <p>Shop: {deal.shop.name} </p>
            <p>
              Current Price: {deal.price.amount} {deal.price.currency}
            </p>
            <p>
              Regular Price: {deal.regular.amount} {deal.regular.currency}
            </p>
            <p>cut: {deal.cut}%</p>
            <p>
              Platforms:{' '}
              {deal.platforms.map((platform) => platform.name).join(', ')}
            </p>
            <p>
              DRM: {deal.drm.map((drm) => drm.name).join(', ') || 'DRM Free'}
            </p>
            <p>Last Updated: {deal.timestamp}</p>
            <br />
          </div>
        ))}
      <div>
        <p>Historical Lows:</p>
        <p>
          All Time Low: {priceItem.historyLow.all.amount}{' '}
          {priceItem.historyLow.all.currency}
        </p>
        <p>
          Last Year Low: {priceItem.historyLow.y1.amount}{' '}
          {priceItem.historyLow.y1.currency}
        </p>
        <p>
          Last 3 Months Low: {priceItem.historyLow.m3.amount}{' '}
          {priceItem.historyLow.m3.currency}
        </p>
      </div>
    </div>
  )
}

export default StorePriceCard
