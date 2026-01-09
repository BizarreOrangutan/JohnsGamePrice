import { useState } from 'react';
import SearchPage from './pages/SearchPage';
import './App.css';

function App() {
  const [page , setPage] = useState<'search'>('search');

  return (
    <>
      {page === 'search' && <SearchPage />}
    </>
  )
}

export default App
