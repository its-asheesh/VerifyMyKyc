import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from './context/ToastContext'
import DashboardLayout from './components/layout/DashboardLayout'
import AuthGuard from './components/auth/AuthGuard'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import PricingManagement from './pages/PricingManagement'
import OrderManagement from './pages/OrderManagement'
import CarouselManagement from './pages/CarouselManagement'
import CouponManagement from './pages/CouponManagement'
import Users from './pages/Users'
import Analytics from './pages/Analytics'
import LocationAnalytics from './pages/LocationAnalytics'
import Settings from './pages/Settings'
import SubscribersPage from './pages/SubscribersPage'
import ReviewsManagement from './pages/ReviewsManagement'
import './App.css'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public route - Login page */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes - Admin dashboard */}
            <Route path="/*" element={
              <AuthGuard>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/pricing" element={<PricingManagement />} />
                    <Route path="/orders" element={<OrderManagement />} />
                    <Route path="/carousel" element={<CarouselManagement />} />
                    <Route path="/coupons" element={<CouponManagement />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/location-analytics" element={<LocationAnalytics />} />
                    <Route path="/subscribers" element={<SubscribersPage />} />
                    <Route path="/reviews" element={<ReviewsManagement />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </DashboardLayout>
              </AuthGuard>
            } />
          </Routes>
        </Router>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
