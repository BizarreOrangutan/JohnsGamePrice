import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  shape: {
    borderRadius: 16,
  },
})

const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default ThemeProviderWrapper
