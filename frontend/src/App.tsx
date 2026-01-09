import SearchPage from './pages/SearchPage'
import GameListPage from './pages/GameListPage'
import GameDetailPage from './pages/GameDetailPage'

import './App.css'
import { Routes, Route } from 'react-router-dom'

// TODO: Create page layout for the SEARCH state and use context to switch between them

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/search-game" element={<GameListPage />} />
        <Route path="/game/:id" element={<GameDetailPage />} />
      </Routes>
    </>
  )
}

export default App
