"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSearchParams, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchProducts, fetchCategories, setFilters } from "../../redux/slices/productSlice"
import { LoadingSpinner } from "../../components/common/LoadingSpinner"
import { ProductCard } from "../../components/products/ProductCard"
import SEOHead from "../../components/seo/SEOHead"
import { ShieldCheck, Search } from "lucide-react"

// Import mockProducts for total count
import { mockProducts } from "../../redux/slices/productSlice"

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation() as any
  const { products = [], categories = [], isLoading, error, filters } = useAppSelector((state) => state.products)
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    return typeof window !== "undefined" && window.innerWidth < 768 ? "list" : "grid"
  })
  const [showBuyPrompt, setShowBuyPrompt] = useState(false)

  // Handle responsive view mode switching
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("list")
      } else {
        setViewMode("grid")
      }
    }

    // Initial check
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  // Open elegant buy modal when navigated from Start Verification without active plan
  useEffect(() => {
    const statePrompt = location.state?.showBuyPrompt
    const qpPrompt = searchParams.get('buyVerification') === '1'
    if (statePrompt || qpPrompt) {
      setShowBuyPrompt(true)
    }
  }, [location.state, searchParams])

  // Handle URL parameters on page load
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category")

    if (!categoryFromUrl) {
      // No param → "all"
      if (filters.category !== "") {
        dispatch(setFilters({ category: "" }))
      }
    } else if (categoryFromUrl !== filters.category) {
      dispatch(setFilters({ category: categoryFromUrl }))
    }
  }, [searchParams, dispatch, filters.category])

  useEffect(() => {
    dispatch(fetchProducts(filters))
  }, [dispatch, filters])

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      dispatch(setFilters({ category: "" }))
      navigate("/products", { replace: true }) // Clean URL
    } else {
      dispatch(setFilters({ category }))
      navigate(`/products?category=${category}`)
    }
  }

  // Ensure categories is an array before mapping
  const categoryTabs = [
    { id: "all", label: "All Solutions", count: mockProducts.length }, // Total count of all products
    ...(categories || []).map((cat) => ({
      id: cat.id,
      label: cat.name,
      count: mockProducts.filter((p) => p.category?.id === cat.id).length, // Use mockProducts for accurate counts
    })),
  ]

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-200 max-w-md mx-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              dispatch(fetchProducts())
              dispatch(fetchCategories())
            }}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title="Verification Solutions | VerifyMyKYC"
        description="Browse our comprehensive range of KYC verification products including Aadhaar, PAN, Driving License, and more."
        keywords="KYC products, verification services, Aadhaar verification, PAN verification"
        canonicalUrl="/products"
      />

      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        {/* Modern Header Section */}
        <div className="bg-white border-b border-gray-300 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  Verification Solutions
                </h1>
                <p className="text-gray-600 text-sm mt-1">Secure, compliant, and instant verification APIs for your business.</p>
              </div>

              {/* View Toggle */}
              <div className="hidden md:flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                  title="Grid View"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                  title="List View"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mt-6 flex overflow-x-auto scrollbar-hide gap-2 pb-1 -mx-4 px-4 md:mx-0 md:px-0">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleCategoryChange(tab.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${(filters?.category || "all") === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                >
                  {tab.label}
                  <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${(filters?.category || "all") === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                    }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Products Grid/List */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <motion.div
              layout
              className={`grid gap-6 ${viewMode === "grid" || window.innerWidth < 768
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
                }`}
            >
              {(products || []).map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <ProductCard
                    product={product}
                    viewMode={window.innerWidth < 768 ? "list" : viewMode}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {(!products || products.length === 0) && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No solutions found</h3>
              <p className="text-gray-500 max-w-md">
                We couldn't find any verification products matching your current filters. Try selecting a different category.
              </p>
              <button
                onClick={() => handleCategoryChange("all")}
                className="mt-6 px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>

        {/* Elegant Buy Prompt Modal */}
        {showBuyPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-purple-600" />
              <button
                aria-label="Close"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setShowBuyPrompt(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center space-y-4 pt-2">
                <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Active Plan Required</h3>
                  <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                    You need an active verification plan or credits to access this service. Purchase a plan to get started instantly.
                  </p>
                </div>

                <div className="pt-4 flex gap-3 justify-center">
                  <button
                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
                    onClick={() => setShowBuyPrompt(false)}
                  >
                    Maybe Later
                  </button>
                  <button
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all text-sm"
                    onClick={() => {
                      const vt = location.state?.verificationType
                      const fromProduct = location.state?.fromProduct
                      const vtFromQp = searchParams.get('service') || undefined
                      if (vt && fromProduct) {
                        navigate('/checkout', {
                          state: {
                            selectedPlan: 'one-time',
                            billingPeriod: 'one-time',
                            selectedServices: [vt],
                            productInfo: fromProduct,
                            tierInfo: { service: vt, label: fromProduct.title, price: 0, billingPeriod: 'one-time', originalPrice: 0, discount: 0 }
                          }
                        })
                      } else if (vtFromQp) {
                        navigate('/checkout', {
                          state: {
                            selectedPlan: 'one-time',
                            billingPeriod: 'one-time',
                            selectedServices: [vtFromQp]
                          }
                        })
                      } else {
                        navigate('/custom-pricing')
                      }
                    }}
                  >
                    View Plans
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  )
}

export default ProductsPage
