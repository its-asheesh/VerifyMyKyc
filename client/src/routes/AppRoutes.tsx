import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "../redux/store"
import { AppProvider } from "../context/AppContext"
import { ErrorBoundary } from "../components/common/ErrorBoundary"
import { AdminRoute, UserRoute, AnyRoleRoute } from "../components/auth/ProtectedRoute"

// Layout
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import ScrollToTop from "../components/common/ScrollToTop"

// Pages
import Home from "../pages/Home"
import ReviewsPage from "../pages/ReviewsPage"
import ProductsPage from "../pages/products/ProductsPage"
import ProductDetailPage from "../pages/products/ProductDetailPage"
import SolutionsPage from "../pages/solutions/SolutionsPage"
import SolutionDetailPage from "../pages/solutions/SolutionDetailPage"
import ResourcesPage from "../pages/resources/ResourcesPage"
import AboutPage from "../pages/company/AboutPage"
import ContactPage from "../pages/company/ContactPage"
import CareersPage from "../pages/company/CareersPage"
import AadhaarPage from "../pages/aadhaar"
import PanPage from "../pages/pan"
import DrivingLicensePage from "../pages/drivinglicense"
import CustomPricingPage from "../pages/CustomPricingPage"
import CheckoutPage from "../pages/CheckoutPage"


// Auth Pages
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage"
import ProfilePage from "../pages/ProfilePage"
import UnauthorizedPage from "../pages/UnauthorizedPage"

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard"
import AdminPricing from "../pages/admin/AdminPricing"
import AdminReviews from "../pages/admin/AdminReviews"

// Payment Pages
import PaymentSuccessPage from "../pages/PaymentSuccessPage"

// Footer Pages
import DisclaimerPage from '../pages/DisclaimerPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsAndConditionsPage from "../pages/TermsAndConditionsPage"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppProvider>
          <Router>
            <ScrollToTop />
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                {/* Products */}
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                
                {/* Solutions */}
                <Route path="/solutions" element={<SolutionsPage />} />
                <Route path="/solutions/:id" element={<SolutionDetailPage />} />
                
                {/* Resources */}
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/resources/:id" element={<div>Resource Detail Page</div>} />
                
                {/* Company */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/aadhaar" element={<AadhaarPage />} />
                <Route path="/pan" element={<PanPage />} />
                <Route path="/drivinglicense" element={<DrivingLicensePage />} />
                
                {/* Pricing */}
                <Route path="/custom-pricing" element={<CustomPricingPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                
                {/* Other Pages */}
                <Route path="/pricing" element={<div>Pricing Page</div>} />
                <Route path="/documentation" element={<div>Documentation Page</div>} />
                <Route path="/api-reference" element={<div>API Reference Page</div>} />
                <Route path="/help" element={<div>Help Center Page</div>} />

                {/* Footer routes */}
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/disclaimer" element={<DisclaimerPage />} />
                <Route path="/terms" element={<TermsAndConditionsPage />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify" element={<div>Verify Page</div>} />
                
                {/* Protected Routes - Any Role */}
                <Route
                  path="/profile"
                  element={
                    <AnyRoleRoute>
                      <ProfilePage />
                    </AnyRoleRoute>
                  }
                />
                
                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/pricing"
                  element={
                    <AdminRoute>
                      <AdminPricing />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/reviews"
                  element={
                    <AdminRoute>
                      <AdminReviews />
                    </AdminRoute>
                  }
                />
                
                {/* User Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <UserRoute>
                      <div>User Dashboard Page</div>
                    </UserRoute>
                  }
                />
                
                {/* Payment Success */}
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                
                {/* 404 */}
                <Route path="*" element={<div>404 Not Found</div>} />
              </Routes>
            </Layout>
          </Router>
        </AppProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default AppRoutes
