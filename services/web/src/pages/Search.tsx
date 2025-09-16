import { Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSearch } from '../modules/core/hooks/useGameSearch';
import GameSearchList from '../modules/core/components/GameSearchList';
import { useEffect } from 'react';

const Search = () => {
  const { searchOptions, setSearchValue, loading, error } = useGameSearch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';
    setSearchValue(query);
    console.log(searchOptions);
  }, [location.search, setSearchValue]);

  console.log('searchOptions:', searchOptions);

  const handleGameClick = (id: string) => {
    navigate(`/analytics/${id}`);
  };

  return (
    <Container>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {searchOptions.length === 0 && !loading ? (
        <div>No results</div>
      ) : (
        <GameSearchList games={searchOptions} onGameClick={handleGameClick} />
      )}
    </Container>
  );
};

export default Search;