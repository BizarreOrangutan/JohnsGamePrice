import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeContextProvider } from './modules/core/theme/ThemeContextProvider.tsx';

if (import.meta.env.DEV) {
  import('./mocks/browser').then(({ worker }) => {
    worker.start();
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </React.StrictMode>
);
