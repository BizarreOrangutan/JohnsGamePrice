import { useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { Container } from '@mui/material';
import { gameSearchService } from '../modules/core/utils/gameSearchService';
import { Graph } from '../modules/analytics/components/Graph';
import { StoreFilter } from '../modules/analytics/components/StoreFilter';
import type { GameDetailsResult } from '../modules/core/utils/gameSearchService';

const Analytics = () => {
  const { id } = useParams();
  const [gameDetails, setGameDetails] = useState<GameDetailsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      gameSearchService.getGameDetails(id)
        .then(details => {
          setGameDetails(details);
          // Default to all stores selected
          if (details?.priceHistory) {
            const allStores = Array.from(new Set(details.priceHistory.map(p => p.shop?.name).filter(Boolean)));
            setSelectedStores(allStores);
          }
          console.log('Game Details JSON:', details);
        })
        .catch(err => setError(err.message || 'Failed to fetch details'));
    } else {
      setError('No ID provided');
    }
  }, [id]);

  // Compute all stores from priceHistory
  const stores = useMemo(() => {
    if (!gameDetails?.priceHistory) return [];
    return Array.from(new Set(gameDetails.priceHistory.map(p => p.shop?.name).filter(Boolean)));
  }, [gameDetails]);

  // Filter priceHistory by selected stores
  const filteredData = useMemo(() => {
    if (!gameDetails?.priceHistory) return [];
    return gameDetails.priceHistory.filter(p => selectedStores.includes(p.shop?.name));
  }, [gameDetails, selectedStores]);

  return (
    <Container>
      {error && <div>{error}</div>}
      {!error && !gameDetails && <div>Loading...</div>}
      {gameDetails && (
        <>
          <h2>{gameDetails.title}</h2>
          <StoreFilter stores={stores} selectedStores={selectedStores} onChange={setSelectedStores} />
          <Graph data={filteredData} gameTitle={gameDetails.title} />
          <pre>{JSON.stringify(gameDetails, null, 2)}</pre>
        </>
      )}
    </Container>
  );
};

export default Analytics;
