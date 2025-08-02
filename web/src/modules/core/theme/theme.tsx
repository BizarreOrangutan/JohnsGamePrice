import type { PaletteMode } from '@mui/material';
import { blue, grey, deepPurple } from '@mui/material/colors';

const theme = {
  paletted: {
    primary: blue,
  },
};

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: blue,
          divider: blue[200],
          text: {
            primary: grey[900],
            secondary: grey[800],
          },
        }
      : {
          primary: deepPurple,
          divider: deepPurple[700],
          background: {
            default: deepPurple[900],
            paper: deepPurple[900],
          },
          text: {
            primary: '#fff',
            secondary: grey[500],
          },
        }),
  },
});

export default theme;
