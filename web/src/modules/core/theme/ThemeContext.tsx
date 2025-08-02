import { createTheme } from '@mui/material';
import { createContext } from 'react';
import type { Theme } from '@emotion/react';

type ThemeContextType = {
  mode: string;
  toggleColorMode: () => void;
  theme: Theme;
};

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleColorMode: () => console.log('Not implemented'),
  theme: createTheme(),
});
