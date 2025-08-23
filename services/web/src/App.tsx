import { RouterProvider } from 'react-router-dom';
import { Router } from './modules/core/utils/Router.tsx';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@emotion/react';
import { useThemeContext } from './modules/core/theme/useThemeContext.tsx';

const App = () => {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={Router} />
    </ThemeProvider>
  );
};

export default App;
