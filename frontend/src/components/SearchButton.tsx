interface SearchButtonProps {
  onClick: () => void
}

const SearchButton = ({ onClick }: SearchButtonProps) => {
  return (
    <button className="search-button" onClick={onClick}>Search</button>
    )
}

export default SearchButton