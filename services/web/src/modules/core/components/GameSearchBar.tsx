import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress } from '@mui/material';
import { useGameSearch } from '../hooks/useGameSearch';
import GameSearchOption from './GameSearchOption';
import type { GameSearchResult } from '../utils/gameSearchService';
import type { SxProps, Theme } from '@mui/material';
import type { SyntheticEvent } from 'react';

interface GameSearchBarProps {
  placeholder?: string;
  debounceMs?: number;
  minWidth?: number | string;
  sx?: SxProps<Theme>;
  onGameSelect?: (game: GameSearchResult | null) => void;
  variant?: 'standard' | 'outlined' | 'filled';
  size?: 'small' | 'medium';
  disabled?: boolean;
  showError?: boolean;
}

const GameSearchBar = ({
  placeholder = "Search for a game",
  debounceMs = 500,
  minWidth = 600,
  sx,
  onGameSelect,
  variant = 'standard',
  size = 'medium',
  disabled = false,
  showError = true,
}: GameSearchBarProps) => {
  const { searchOptions, loading, error, searchValue, setSearchValue } = useGameSearch(debounceMs);
  const [selectedValue, setSelectedValue] = useState<GameSearchResult | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (event: SyntheticEvent, newValue: string) => {
    setSearchValue(newValue);
  };

  const handleValueChange = (
    event: SyntheticEvent,
    newValue: GameSearchResult | string | null
  ) => {
    if (typeof newValue === 'string') {
      setSelectedValue(null);
      onGameSelect?.(null);
    } else {
      setSelectedValue(newValue);
      onGameSelect?.(newValue);
    }
  };

  // On Enter, navigate to /search with the exact searchValue, do not autocomplete
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchValue.trim()) {
      event.preventDefault(); // Prevent Autocomplete default behavior
      navigate(`/search?query=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <Autocomplete<GameSearchResult, false, false, true>
      freeSolo
      id="game-search-autocomplete"
      value={selectedValue}
      inputValue={searchValue}
      options={searchOptions}
      loading={loading}
      disabled={disabled}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option.title || option.plain || '';
      }}
      isOptionEqualToValue={(option, value) => {
        if (typeof option === 'string' || typeof value === 'string') return false;
        return option.id === value.id || option.slug === value.slug;
      }}
      onInputChange={handleInputChange}
      onChange={handleValueChange}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.id || option.slug || option.plain}>
          <GameSearchOption 
            game={option} 
            isHighlighted={selected}
          />
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label=""
          variant={variant}
          size={size}
          placeholder={placeholder}
          error={showError && !!error}
          helperText={showError && error ? `Error: ${error}` : ''}
          sx={{
            input: { color: 'black' },
          }}
          onKeyDown={handleKeyDown}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ mr: 1, color: 'black' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
              disableUnderline: variant === 'standard',
            },
          }}
        />
      )}
      sx={{ 
        minWidth,
        bgcolor: 'white',
        ...sx
      }}
      slotProps={{
        paper: {
          sx: {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            maxHeight: 400,
          },
        },
        listbox: {
          sx: {
            maxHeight: 300,
            '& .MuiAutocomplete-option': {
              padding: 0,
            },
          },
        },
      }}
    />
  );
};

export default GameSearchBar;