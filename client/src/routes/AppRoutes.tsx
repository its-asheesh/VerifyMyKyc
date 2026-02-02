import React, { Suspense, lazy } from "react"
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "../redux/store"
import { AppProvider } from "../context/AppContext"
import { ErrorBoundary } from "../components/common/ErrorBoundary"
import { UserRoute, AnyRoleRoute } from "../components/auth/ProtectedRoute"
import { useTokenValidation } from "../hooks/useTokenValidation"
import { useAutoLogout } from "../hooks/useAutoLogout"

// Layout
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import ScrollToTop from "../components/common/ScrollToTop"
import { LoadingSpinner } from "../components/common/LoadingSpinner"

// Lazy Load Pages
const Home = lazy(() => import("../pages/Home"))
const ReviewsPage = lazy(() => import("../pages/ReviewsPage"))
const ProductsPage = lazy(() => import("../pages/products/ProductsPage"))
const ProductDetailPage = lazy(() => import("../pages/products/ProductDetailPage"))
const AboutPage = lazy(() => import("../pages/company/AboutPage"))
const ContactPage = lazy(() => import("../pages/company/ContactPage"))
const CustomPricingPage = lazy(() => import("../pages/CustomPricingPage"))
const CheckoutPage = lazy(() => import("../pages/user/CheckoutPage"))
const BlogListPage = lazy(() => import("../pages/blog/BlogListPage"))
const BlogDetailPage = lazy(() => import("../pages/blog/BlogDetailPage"))
const VerificationPage = lazy(() => import("../pages/verification/VerificationPage"))

// Auth Pages
const LoginPage = lazy(() => import("../pages/auth/LoginPage"))
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"))
const ProfilePage = lazy(() => import("../pages/user/ProfilePage"))
const UnauthorizedPage = lazy(() => import("../pages/UnauthorizedPage"))


// Payment Pages
const PaymentSuccessPage = lazy(() => import("../pages/user/PaymentSuccessPage"))

// Footer Pages
const DisclaimerPage = lazy(() => import("../pages/legal/DisclaimerPage"))
const PrivacyPolicyPage = lazy(() => import("../pages/legal/PrivacyPolicyPage"))
const TermsAndConditionsPage = lazy(() => import("../pages/legal/TermsAndConditionsPage"))

const MainLayout = () => {
  // Validate token on app initialization
  useTokenValidation();
  // Auto-logout after 15 days (must be inside Redux Provider)
  useAutoLogout();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
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
            <Suspense fallback={<div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner /></div>}>
              <Routes>
                {/* Standalone Routes (No Navbar/Footer) */}
                <Route path="/verification/:type" element={<VerificationPage />} />

                {/* Main Application Routes (With Navbar/Footer) */}
                <Route element={<MainLayout />}>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />

                  {/* Products */}
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />

                  {/* Resources */}
                  <Route path="/resources/:id" element={<div>Resource Detail Page</div>} />

                  {/* Company */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />

                  {/* Blog */}
                  <Route path="/blog" element={<BlogListPage />} />
                  <Route path="/blog/:slug" element={<BlogDetailPage />} />

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

                  {/* Protected Routes - Any Role */}
                  <Route
                    path="/profile"
                    element={
                      <AnyRoleRoute>
                        <ProfilePage />
                      </AnyRoleRoute>
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
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </AppProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default AppRoutes
