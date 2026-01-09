import { Input } from '@headlessui/react'

interface SearchBarProps {
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  handleEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  input,
  setInput,
  handleEnter,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <div className="search-bar relative">
      <Input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Search for a game..."
        className="w-full rounded-md border border-gray-300 p-2"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleEnter(e)
          }
        }}
      />
    </div>
  )
}

export default SearchBar
