import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import type { PriceHistoryPoint } from '../../core/utils/gameSearchService';
import ErrorBoundary from '../../error/ErrorBoundary';

interface GraphProps {
  data: PriceHistoryPoint[];
  gameTitle?: string;
}

const COLORS = ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2'];

export const Graph = ({ data, gameTitle }: GraphProps) => {
  // Filter out points without a valid shop
  const validData = data.filter(point => point.shop && typeof point.shop.name === 'string');

  const stores = Array.from(new Set(validData.map(point => point.shop.name)));

  // Aggregate by date and forward-fill prices for each store
  const dateMap: Record<string, Record<string, any>> = {};
  validData.forEach(point => {
    const date = new Date(point.timestamp).toLocaleDateString('en-GB');
    if (!dateMap[date]) {
      dateMap[date] = { date };
    }
    dateMap[date][point.shop.name] = point.deal.price.amount;
  });
  // Sort dates ascending
  const sortedDates = Object.keys(dateMap).sort((a, b) => {
    return new Date(a.split('/').reverse().join('-')).getTime() - new Date(b.split('/').reverse().join('-')).getTime();
  });
  // Forward-fill prices for each store
  const lastPrices: Record<string, number | null> = {};
  const chartData = sortedDates.map(date => {
    const entry = { ...dateMap[date] };
    stores.forEach(store => {
      if (entry[store] != null) {
        lastPrices[store] = entry[store];
      } else {
        entry[store] = lastPrices[store] ?? null;
      }
    });
    return entry;
  });

  console.log('Valid Data:', validData);
  console.log('Graph chartData:', chartData);

  return (
    <ErrorBoundary fallback="Error loading price history graph">
      <div style={{ width: '100%', height: 400 }}>
        <h3>{gameTitle ? `${gameTitle} Price History` : 'Price History'}</h3>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {stores.map((store, idx) => (
              <Line
                key={store}
                type="stepAfter"
                dataKey={store}
                name={store}
                stroke={COLORS[idx % COLORS.length]}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ErrorBoundary>
  );
};