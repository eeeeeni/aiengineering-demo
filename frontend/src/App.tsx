import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { TodoPage } from './pages/TodoPage'

const queryClient = new QueryClient()

const theme = createTheme({
  palette: {
    mode: 'light',
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TodoPage />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
