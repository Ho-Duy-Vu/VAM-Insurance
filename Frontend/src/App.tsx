import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './components/theme-provider'
import { router } from './routes'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey="ade-ui-theme">
        <div className="min-h-screen bg-background text-foreground">
          <RouterProvider router={router} />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
