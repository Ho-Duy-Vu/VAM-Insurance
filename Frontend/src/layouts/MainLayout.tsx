import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

/**
 * Main Layout Wrapper
 * - Renders Header and Footer once
 * - Prevents re-rendering on navigation
 * - Maintains state across page transitions
 */
export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header - rendered once */}
      <Header />
      
      {/* Main Content Area - changes based on route */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Fixed Footer - rendered once */}
      <Footer />
    </div>
  )
}
