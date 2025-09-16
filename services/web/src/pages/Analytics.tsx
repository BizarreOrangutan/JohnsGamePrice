import { useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { Container } from '@mui/material';
import { gameSearchService } from '../modules/core/utils/gameSearchService';
import { Graph } from '../modules/analytics/components/Graph';
import { DateFilter } from '../modules/analytics/components/DateFilter';
import type { DateFilterValue } from '../modules/analytics/components/DateFilter';
import { StoreFilter } from '../modules/analytics/components/StoreFilter';
import type { GameHistoryResult } from '../modules/core/utils/gameSearchService';

const Analytics = () => {
  const { id } = useParams();
  const [gameHistory, setGameHistory] = useState<GameHistoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilterValue>('all');

  useEffect(() => {
    if (id) {
  gameSearchService.getGameHistory(id)
        .then(history => {
          setGameHistory(history);
          // Default to all stores selected
          if (history?.priceHistory) {
            const allStores = Array.from(new Set(history.priceHistory.map(p => p.shop?.name).filter(Boolean)));
            setSelectedStores(allStores);
          }
          console.log('Game History JSON:', history);
        })
        .catch(err => setError(err.message || 'Failed to fetch details'));
    } else {
      setError('No ID provided');
    }
  }, [id]);

  // Compute all stores from priceHistory
  const stores = useMemo(() => {
    if (!gameHistory?.priceHistory) return [];
    return Array.from(new Set(gameHistory.priceHistory.map(p => p.shop?.name).filter(Boolean)));
  }, [gameHistory]);

  // Filter priceHistory by selected stores and date range, and add current prices if missing
  const filteredData = useMemo(() => {
    if (!gameHistory?.priceHistory) return [];
    let data = gameHistory.priceHistory.filter(p => selectedStores.includes(p.shop?.name));
    if (dateFilter !== 'all') {
      const now = new Date();
      let threshold: Date | null = null;
      switch (dateFilter) {
        case 'month':
          threshold = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case '6months':
          threshold = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          break;
        case 'year':
          threshold = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        case '6years':
          threshold = new Date(now.getFullYear() - 6, now.getMonth(), now.getDate());
          break;
        default:
          threshold = null;
      }
      if (threshold) {
        data = data.filter(p => new Date(p.timestamp) >= threshold!);
      }
    }

    // Add current price points for each selected store if not present for today
    const todayStr = new Date().toLocaleDateString('en-GB');
    selectedStores.forEach(store => {
      const hasToday = data.some(p => p.shop?.name === store && new Date(p.timestamp).toLocaleDateString('en-GB') === todayStr);
      // Find the latest price point for this store
      const storeHistory = gameHistory.priceHistory.filter(p => p.shop?.name === store);
      const latestPrice = storeHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      if (!hasToday && latestPrice) {
        // Add a synthetic price point for today
        data.push({
          ...latestPrice,
          timestamp: new Date().toISOString(),
        });
      }
    });
    return data;
  }, [gameHistory, selectedStores, dateFilter]);

  return (
    <Container>
      {error && <div>{error}</div>}
      {!error && !gameHistory && <div>Loading...</div>}
      {gameHistory && (
        <>
          <h2>{gameHistory.title}</h2>
          <DateFilter value={dateFilter} onChange={setDateFilter} />
          <StoreFilter stores={stores} selectedStores={selectedStores} onChange={setSelectedStores} />
          <Graph data={filteredData} gameTitle={gameHistory.title} dateFilter={dateFilter} />
          <pre>{JSON.stringify(gameHistory, null, 2)}</pre>
        </>
      )}
    </Container>
  );
};

export default Analytics;
