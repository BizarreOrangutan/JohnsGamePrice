import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import ErrorBoundary from '../../error/ErrorBoundary';
import NavDrawer from './NavDrawer';
import DarkModeToggle from './DarkModeToggle';
import GameSearchBar from './GameSearchBar';
import type { GameSearchResult } from '../utils/gameSearchService';

const AppAppBar = () => {
  const handleGameSelect = (game: GameSearchResult | null) => {
    if (game) {
      console.log('Selected game:', game);
      // TODO: Navigate to game details page
      // navigate(`/game/${game.slug || game.id}`);
    }
  };

  return (
    <AppBar position="static" sx={{ flexGrow: 1 }}>
      <Toolbar disableGutters sx={{ p: 1 }}>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'left' }}>
          <NavDrawer />
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <ErrorBoundary fallback="Error loading search bar">
            <GameSearchBar
              placeholder="Search for a game"
              onGameSelect={handleGameSelect}
              minWidth={600}
              debounceMs={500}
            />
          </ErrorBoundary>
        </Box>

        <Box sx={{ flexGrow: 0.5, display: 'flex', justifyContent: 'center' }}>
          <DarkModeToggle />
        </Box>

        <Box sx={{ flexGrow: 0.5, display: 'flex', justifyContent: 'right' }}>
          <Button variant="text" color="inherit" sx={{ borderRadius: 10, border: 0, p: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }}> Login / Register </Typography>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppAppBar;
