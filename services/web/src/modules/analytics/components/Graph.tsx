import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import type { PriceHistoryPoint } from '../../core/utils/gameSearchService';
import ErrorBoundary from '../../error/ErrorBoundary';
import type { DateFilterValue } from './DateFilter';
import { getDateRange, buildChartDates, getStores, buildChartData } from '../utils/priceChartUtils';

interface GraphProps {
  data: PriceHistoryPoint[];
  gameTitle?: string;
  dateFilter?: DateFilterValue;
}

const COLORS = ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2'];

export const Graph = ({ data, gameTitle, dateFilter = 'all' }: GraphProps) => {
  // Get date range and stores using utils
  const { start: rangeStart, end: rangeEnd } = getDateRange(dateFilter);
  const validData = data.filter(point => point.shop && typeof point.shop.name === 'string');
  const stores = getStores(validData);
  const chartDates = buildChartDates(rangeStart, rangeEnd, validData);
  const chartData = buildChartData(validData, stores, chartDates, rangeStart);

  if (chartDates.length > 0 && chartDates[chartDates.length - 1] !== rangeEnd?.toLocaleDateString('en-GB')) {
    const todayEntry: { date: string; [store: string]: number | string | null } = { date: rangeEnd?.toLocaleDateString('en-GB') };
    stores.forEach(store => {
      // Use last value from chartData
      todayEntry[store] = chartData[chartData.length - 1]?.[store] ?? null;
    });
    chartData.push(todayEntry);
  }

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