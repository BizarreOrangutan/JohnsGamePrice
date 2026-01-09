import SearchBar from '../components/SearchBar';
import { searchGame } from '../services/api';

const SearchPage = () => {
  const handleSearch = async (query: string) => {
    console.log('Searching for:', query)
    const results = await searchGame(query);
    console.log('Search results:', results);
  }

  return (
    <div>
      <h1>Search Page</h1>
      <SearchBar onSearch={handleSearch} />
    </div>
  )
}

export default SearchPage
