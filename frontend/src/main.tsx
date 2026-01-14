import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppContextProvider } from './app-wrappers/AppContext.tsx'
import ThemeProvider from './app-wrappers/ThemeProvider.tsx'
import { NotificationProvider } from './app-wrappers/NotificationProvider.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppContextProvider>
        <NotificationProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </NotificationProvider>
      </AppContextProvider>
    </ThemeProvider>
  </StrictMode>
)
