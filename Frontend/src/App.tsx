import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './components/theme-provider'
import { ToastProvider } from './components/ui/toast'
import { router } from './routes'
import FloatingChatWidget from './components/FloatingChatWidget'

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
        <ToastProvider>
          <div className="min-h-screen bg-background text-foreground">
            <RouterProvider router={router} />
            {/* Global Floating Chat Widget - Available on all pages */}
            <FloatingChatWidget />
          </div>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
