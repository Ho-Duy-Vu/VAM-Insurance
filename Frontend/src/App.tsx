import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './components/theme-provider'
import { ToastProvider } from './components/ui/toast'
import { router } from './routes'
import FloatingChatWidget from './components/FloatingChatWidget'
import { useEffect, useState } from 'react'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

// Component to conditionally render chatbot based on route
function ChatbotWrapper() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  // Listen for route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname)
    }

    // Listen to both popstate (back/forward) and custom navigation events
    window.addEventListener('popstate', handleRouteChange)

    // Override pushState to detect route changes
    const originalPushState = window.history.pushState
    window.history.pushState = function (...args) {
      originalPushState.apply(this, args)
      handleRouteChange()
    }

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      window.history.pushState = originalPushState
    }
  }, [])

  // Hide chatbot on login and register pages
  const hideOnRoutes = ['/login', '/register']
  const shouldHideChatbot = hideOnRoutes.includes(currentPath)

  return shouldHideChatbot ? null : <FloatingChatWidget />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey="ade-ui-theme">
        <ToastProvider>
          <div className="min-h-screen bg-background text-foreground">
            <RouterProvider router={router} />
            {/* Global Floating Chat Widget - Hidden on auth pages */}
            <ChatbotWrapper />
          </div>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
