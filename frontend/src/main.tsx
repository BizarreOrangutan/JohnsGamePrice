import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppContextProvider } from './AppContext.tsx'
import ThemeProvider from './ThemeProvider.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppContextProvider>
    </ThemeProvider>
  </StrictMode>
)
