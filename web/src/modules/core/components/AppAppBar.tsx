import AppBar from '@mui/material/AppBar';

import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ErrorBoundary from '../../error/ErrorBoundary';
import NavDrawer from './NavDrawer';
import InputAdornment from '@mui/material/InputAdornment';

import SearchIcon from '@mui/icons-material/Search';

import { Typography } from '@mui/material';
import DarkModeToggle from './DarkModeToggle';

const AppAppBar = () => {
  return (
    <AppBar position="static" sx={{ flexGrow: 1 }}>
      <Toolbar disableGutters sx={{ p: 1 }}>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'left' }}>
          <NavDrawer />
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <ErrorBoundary fallback="Error loading search bar">
            <Autocomplete
              freeSolo
              id="Game Search"
              options={['one', 'two', 'three']}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label=""
                  variant="standard"
                  placeholder="Search for a game"
                  sx={{
                    input: { color: 'black' },
                  }}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ mr: 2, color: 'black' }} />
                        </InputAdornment>
                      ),
                      disableUnderline: true,
                    },
                  }}
                />
              )}
              sx={{ minWidth: 600, bgcolor: 'white' }}
              // For making the top of the dropdown box sharp
              slotProps={{
                paper: {
                  sx: {
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  },
                },
              }}
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
