import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeContextProvider } from './modules/core/theme/ThemeContextProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </StrictMode>
);
