// Build chart data with forward-fill logic
export function buildChartData(
  validData: PriceHistoryPoint[],
  stores: string[],
  chartDates: string[],
  rangeStart: Date | null
): Array<{ date: string; [store: string]: number | string | null }> {
  // Aggregate by date
  const dateMap: Record<string, Record<string, any>> = {};
  validData.forEach(point => {
    const date = new Date(point.timestamp).toLocaleDateString('en-GB');
    if (!dateMap[date]) {
      dateMap[date] = { date };
    }
    dateMap[date][point.shop.name] = point.deal.price.amount;
  });

  // Forward-fill prices for each store after aggregation
  stores.forEach(store => {
    // Initialize lastPrice to the most recent price before the range
    let lastPrice: number | null = null;
    let mostRecentHistory: PriceHistoryPoint | undefined = undefined;
    if (rangeStart) {
      mostRecentHistory = validData
        .filter(point => point.shop.name === store && new Date(point.timestamp) < rangeStart)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      lastPrice = mostRecentHistory?.deal.price.amount ?? null;
    }
      // If no previous price, use the first available price in the range
    if (lastPrice === null) {
      // Find the first price in the range
      const firstInRange = chartDates
        .map(dateStr => dateMap[dateStr]?.[store])
        .find(val => val != null);
      if (firstInRange != null) {
        lastPrice = firstInRange;
      }
    }
    chartDates.forEach(dateStr => {
      if (dateMap[dateStr] && dateMap[dateStr][store] != null) {
        lastPrice = dateMap[dateStr][store];
      } else {
        dateMap[dateStr] = dateMap[dateStr] || { date: dateStr };
        dateMap[dateStr][store] = lastPrice;
      }
    });
  });

  // Build chartData array
  const chartData = chartDates.map(date => {
    const entry: { date: string; [store: string]: number | string | null } = { date };
    stores.forEach(store => {
      entry[store] = dateMap[date][store] ?? null;
    });
    return entry;
  });
  return chartData;
}
import type { PriceHistoryPoint } from '../../core/utils/gameSearchService';
import type { DateFilterValue } from '../components/DateFilter';

export function getDateRange(dateFilter: DateFilterValue): { start: Date | null; end: Date } {
  const now = new Date();
  let start: Date | null = null;
  switch (dateFilter) {
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case '6months':
      start = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      break;
    case 'year':
      start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    case '6years':
      start = new Date(now.getFullYear() - 6, now.getMonth(), now.getDate());
      break;
    default:
      start = null;
  }
  return { start, end: now };
}

export function buildChartDates(rangeStart: Date | null, rangeEnd: Date, validData: PriceHistoryPoint[]): string[] {
  if (rangeStart) {
    let chartDates: string[] = [];
    let d = new Date(rangeStart);
    while (d <= rangeEnd) {
      chartDates.push(new Date(d).toLocaleDateString('en-GB'));
      d.setDate(d.getDate() + 1);
    }
    return chartDates;
  } else {
    // Use all dates in data if no filter
    return Array.from(new Set(validData.map(point => new Date(point.timestamp).toLocaleDateString('en-GB')))).sort((a, b) => {
      return new Date(a.split('/').reverse().join('-')).getTime() - new Date(b.split('/').reverse().join('-')).getTime();
    });
  }
}

export function getPreviousPrice(validData: PriceHistoryPoint[], store: string, rangeStart: Date): number | null {
  const previous = validData
    .filter(point => point.shop.name === store && new Date(point.timestamp) < rangeStart)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  return previous ? previous.deal.price.amount : null;
}

export function getStores(validData: PriceHistoryPoint[]): string[] {
  return Array.from(new Set(validData.map(point => point.shop.name)));
}
