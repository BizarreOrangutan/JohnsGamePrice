import {
  buildChartData,
  getDateRange,
  buildChartDates,
  getPreviousPrice,
  getStores
} from '../../../src/modules/analytics/utils/priceChartUtils';
import type { PriceHistoryPoint } from '../../../src/modules/core/utils/gameSearchService';

describe('priceChartUtils', () => {
  describe('getStores', () => {
    it('returns unique store names', () => {
      const data: PriceHistoryPoint[] = [
        { timestamp: '2025-09-16', shop: { id: 1, name: 'Steam' }, deal: {
          price: { amount: 10, amountInt: 1000, currency: 'USD' },
          regular: { amount: 12, amountInt: 1200, currency: 'USD' },
          cut: 17
        } },
        { timestamp: '2025-09-15', shop: { id: 2, name: 'GOG' }, deal: {
          price: { amount: 20, amountInt: 2000, currency: 'USD' },
          regular: { amount: 22, amountInt: 2200, currency: 'USD' },
          cut: 9
        } },
        { timestamp: '2025-09-14', shop: { id: 1, name: 'Steam' }, deal: {
          price: { amount: 15, amountInt: 1500, currency: 'USD' },
          regular: { amount: 15, amountInt: 1500, currency: 'USD' },
          cut: 0
        } },
      ];
      expect(getStores(data)).toEqual(['Steam', 'GOG']);
    });
    it('returns empty array for empty data', () => {
      expect(getStores([])).toEqual([]);
    });
  });

  describe('getDateRange', () => {
    it('returns correct range for month', () => {
  // Instead of mocking Date, just check the logic directly
  // getDateRange uses the current date, so we check that the start is about a month before now
  const { start, end } = getDateRange('month');
  const now = new Date();
  // Accept a 1-day tolerance for month calculation
      if (start) {
        expect(Math.abs(start.getTime() - new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).getTime())).toBeLessThanOrEqual(86400000);
      } else {
        throw new Error('start should not be null for month filter');
      }
  expect(end.toLocaleDateString()).toEqual(now.toLocaleDateString());
    });
    it('returns null start for default', () => {
      const { start, end } = getDateRange('all');
      expect(start).toBeNull();
      expect(end).toBeInstanceOf(Date);
    });
  });

  describe('buildChartDates', () => {
    it('returns all dates in range', () => {
      const start = new Date('2025-09-14');
      const end = new Date('2025-09-16');
      const data: PriceHistoryPoint[] = [];
      expect(buildChartDates(start, end, data)).toEqual([
        '14/09/2025', '15/09/2025', '16/09/2025'
      ]);
    });
    it('returns sorted unique dates from data if no filter', () => {
      const data: PriceHistoryPoint[] = [
        { timestamp: '2025-09-16', shop: { id: 1, name: 'Steam' }, deal: {
          price: { amount: 10, amountInt: 1000, currency: 'USD' },
          regular: { amount: 12, amountInt: 1200, currency: 'USD' },
          cut: 17
        } },
        { timestamp: '2025-09-15', shop: { id: 2, name: 'GOG' }, deal: {
          price: { amount: 20, amountInt: 2000, currency: 'USD' },
          regular: { amount: 22, amountInt: 2200, currency: 'USD' },
          cut: 9
        } },
        { timestamp: '2025-09-14', shop: { id: 1, name: 'Steam' }, deal: {
          price: { amount: 15, amountInt: 1500, currency: 'USD' },
          regular: { amount: 15, amountInt: 1500, currency: 'USD' },
          cut: 0
        } },
      ];
      expect(buildChartDates(null, new Date('2025-09-16'), data)).toEqual([
        '14/09/2025', '15/09/2025', '16/09/2025'
      ]);
    });
    it('handles empty data', () => {
      expect(buildChartDates(null, new Date('2025-09-16'), [])).toEqual([]);
    });
  });

  describe('getPreviousPrice', () => {
    it('returns previous price before range', () => {
      const data: PriceHistoryPoint[] = [
        { timestamp: '2025-09-10', shop: { id: 1, name: 'Steam' }, deal: {
          price: { amount: 5, amountInt: 500, currency: 'USD' },
          regular: { amount: 6, amountInt: 600, currency: 'USD' },
          cut: 17
        } },
        { timestamp: '2025-09-12', shop: { id: 1, name: 'Steam' }, deal: {
          price: { amount: 7, amountInt: 700, currency: 'USD' },
          regular: { amount: 8, amountInt: 800, currency: 'USD' },
          cut: 12
        } },
        { timestamp: '2025-09-14', shop: { id: 1, name: 'Steam' }, deal: {
          price: { amount: 9, amountInt: 900, currency: 'USD' },
          regular: { amount: 9, amountInt: 900, currency: 'USD' },
          cut: 0
        } },
      ];
      expect(getPreviousPrice(data, 'Steam', new Date('2025-09-13'))).toBe(7);
    });
    it('returns null if no previous price', () => {
      const data: PriceHistoryPoint[] = [
        { timestamp: '2025-09-14', shop: { id: 1, name: 'Steam' }, deal: {
          price: { amount: 9, amountInt: 900, currency: 'USD' },
          regular: { amount: 9, amountInt: 900, currency: 'USD' },
          cut: 0
        } },
      ];
      expect(getPreviousPrice(data, 'Steam', new Date('2025-09-13'))).toBeNull();
    });
    it('returns null for empty data', () => {
      expect(getPreviousPrice([], 'Steam', new Date('2025-09-13'))).toBeNull();
    });
  });

  describe('buildChartData', () => {
    it('forward-fills prices correctly (good case)', () => {
      const data: PriceHistoryPoint[] = [
        { timestamp: '2025-09-16', shop: { id: 1, name: 'Steam' }, deal: {
          price: { amount: 10, amountInt: 1000, currency: 'USD' },
          regular: { amount: 12, amountInt: 1200, currency: 'USD' },
          cut: 17
        } },
        { timestamp: '2025-09-15', shop: { id: 1, name: 'Steam' }, deal: {
          price: { amount: 8, amountInt: 800, currency: 'USD' },
          regular: { amount: 8, amountInt: 800, currency: 'USD' },
          cut: 0
        } },
      ];
      const stores = ['Steam'];
      const chartDates = ['15/09/2025', '16/09/2025'];
      const result = buildChartData(data, stores, chartDates, new Date('2025-09-15'));
      expect(result).toEqual([
        { date: '15/09/2025', Steam: 8 },
        { date: '16/09/2025', Steam: 10 }
      ]);
    });
    it('fills with first available price if no previous history (boundary)', () => {
      const data: PriceHistoryPoint[] = [
        { timestamp: '2025-09-16', shop: { id: 1, name: 'Steam' }, deal: {
          price: { amount: 10, amountInt: 1000, currency: 'USD' },
          regular: { amount: 12, amountInt: 1200, currency: 'USD' },
          cut: 17
        } },
      ];
      const stores = ['Steam'];
      const chartDates = ['15/09/2025', '16/09/2025'];
      const result = buildChartData(data, stores, chartDates, new Date('2025-09-15'));
      expect(result).toEqual([
        { date: '15/09/2025', Steam: 10 },
        { date: '16/09/2025', Steam: 10 }
      ]);
    });
    it('handles missing store data (erroneous)', () => {
      const data: PriceHistoryPoint[] = [
        { timestamp: '2025-09-16', shop: { id: 1, name: 'Steam' }, deal: {
          price: { amount: 10, amountInt: 1000, currency: 'USD' },
          regular: { amount: 12, amountInt: 1200, currency: 'USD' },
          cut: 17
        } },
      ];
      const stores = ['Steam', 'GOG'];
      const chartDates = ['15/09/2025', '16/09/2025'];
      const result = buildChartData(data, stores, chartDates, new Date('2025-09-15'));
      expect(result).toEqual([
        { date: '15/09/2025', Steam: 10, GOG: null },
        { date: '16/09/2025', Steam: 10, GOG: null }
      ]);
    });
    it('handles empty data (erroneous)', () => {
      const stores = ['Steam'];
      const chartDates = ['15/09/2025', '16/09/2025'];
      const result = buildChartData([], stores, chartDates, new Date('2025-09-15'));
      expect(result).toEqual([
        { date: '15/09/2025', Steam: null },
        { date: '16/09/2025', Steam: null }
      ]);
    });
    it('recovers if store name is typo (breaks)', () => {
      const data: PriceHistoryPoint[] = [
        { timestamp: '2025-09-16', shop: { id: 99, name: 'Stam' }, deal: {
          price: { amount: 10, amountInt: 1000, currency: 'USD' },
          regular: { amount: 12, amountInt: 1200, currency: 'USD' },
          cut: 17
        } },
      ];
      const stores = ['Steam'];
      const chartDates = ['16/09/2025'];
      const result = buildChartData(data, stores, chartDates, new Date('2025-09-15'));
      expect(result).toEqual([
        { date: '16/09/2025', Steam: null }
      ]);
    });
  });
});
