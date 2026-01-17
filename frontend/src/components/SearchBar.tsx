import TextField from '@mui/material/TextField'

interface SearchBarProps {
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  handleEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void
  sx?: object
  disabled?: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({
  input,
  setInput,
  handleEnter,
  sx,
  disabled = false,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <TextField
      type="text"
      value={input}
      onChange={handleInputChange}
      placeholder="Search for a game..."
      fullWidth
      size="small"
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          handleEnter(e)
        }
      }}
      sx={{ ...sx, backgroundColor: 'white', borderRadius: 1 }}
      disabled={disabled}
    />
  )
}

export default SearchBar
