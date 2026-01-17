import SearchBar from '../components/SearchBar'
import { useContext } from 'react'
import { AppContext } from '../app-wrappers/AppContext'
import { useSearchGame } from '../hooks/useSearchGame'

import Stack from '@mui/material/Stack'

const SearchPage = () => {
  const { setGamesList, query, setQuery, region } = useContext(AppContext)
  const { handleSearch, searching } = useSearchGame(query, setGamesList)

  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <img
        src={"/assets/John's Game Price Logo.png"}
        alt="John's Game Price Logo"
        style={{ height: '50%', width: 'auto', imageRendering: 'pixelated' }}
      />
      <SearchBar
        input={query}
        setInput={setQuery as React.Dispatch<React.SetStateAction<string>>}
        handleEnter={handleSearch}
        sx={{ width: '50%' }}
        disabled={searching}
      />

      <span style={{ color: '#888', fontSize: '0.9rem' }}>
        Region: {region || 'default'}
      </span>
    </Stack>
  )
}

export default SearchPage
