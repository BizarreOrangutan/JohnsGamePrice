import SearchBar from '../components/SearchBar'
import { useContext } from 'react'
import { AppContext } from '../AppContext'
import { searchGame } from '../services/api'
import { useNavigate } from 'react-router-dom'

const SearchPage = () => {
  const navigate = useNavigate()
  const { setGamesList, query, setQuery } = useContext(AppContext)

  const handleSearch = async () => {
    const response = await searchGame(query)
    setGamesList(response)
    if (response !== null) {
      navigate('/search-game?query=' + encodeURIComponent(query))
    }
    console.log('Search Results Response:', response)
  }

  return (
    <div>
      <SearchBar
        input={query}
        setInput={setQuery as React.Dispatch<React.SetStateAction<string>>}
        handleEnter={handleSearch}
      />
    </div>
  )
}

export default SearchPage
