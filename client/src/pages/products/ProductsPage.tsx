"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSearchParams, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchProducts, fetchCategories, setFilters } from "../../redux/slices/productSlice"
import { PageHeader } from "../../components/common/PageHeader"
import { SearchInput } from "../../components/common/SearchInput"
import { FilterTabs } from "../../components/common/FilterTabs"
import { LoadingSpinner } from "../../components/common/LoadingSpinner"
import { ProductCard } from "../../components/products/ProductCard"

// Import mockProducts for total count
import { mockProducts } from "../../redux/slices/productSlice"

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation() as any
  const { products = [], categories = [], isLoading, error, filters } = useAppSelector((state) => state.products)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showBuyPrompt, setShowBuyPrompt] = useState(false)

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

  const handleSearch = (search: string) => {
    dispatch(setFilters({ search }))
  }

  const handleCategoryChange = (category: string) => {
  if (category === "all") {
    dispatch(setFilters({ category: "" }))
    navigate("/products", { replace: true }) // Clean URL
  } else {
    dispatch(setFilters({ category }))
    navigate(`/products?category=${category}`)
  }
}

  const handleProductClick = (product: any) => {
    console.log("[v0] Product clicked:", product.name)
    // Navigate to product detail or handle product selection
    navigate(`/products/${product.id}`)
  }

  // Ensure categories is an array before mapping
  const categoryTabs = [
    { id: "all", label: "All Products", count: mockProducts.length }, // Total count of all products
    ...(categories || []).map((cat) => ({
      id: cat.id,
      label: cat.name,
      count: mockProducts.filter((p) => p.category?.id === cat.id).length, // Use mockProducts for accurate counts
    })),
  ]

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => {
              dispatch(fetchProducts())
              dispatch(fetchCategories())
            }}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <PageHeader title="Our Products" subtitle="Comprehensive verification solutions for every business need">
        {/* Layout toggle buttons and search bar aligned */}
        <div className="flex flex-col space-y-4 w-full">
          {/* View toggle buttons - hidden on mobile, shown on desktop */}
          <div className="hidden md:flex items-center justify-end gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-xl transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-xl transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* <div className="mb-12">
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-2xl">
              <SearchInput
                placeholder="Search verification services..."
                onSearch={handleSearch}
                className="w-full shadow-xl border-2 border-gray-200 focus:border-blue-500 rounded-2xl px-8 py-5 text-lg placeholder-gray-400 bg-white backdrop-blur-sm"
              />
            </div>
          </div>
        </div> */}

        {/* Search and Filters */}
        <div className="mb-10 space-y-6">
          {/* Only show filter tabs if categories are loaded */}
          {categories && categories.length > 0 && (
            <div className="w-full">
              {/* Mobile: Horizontal scrollable tabs */}
              <div className="md:hidden">
                <div
                  className="flex overflow-x-auto scrollbar-hide gap-3 pb-4 px-2"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {categoryTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleCategoryChange(tab.id)}
                      className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap shadow-sm ${
                        (filters?.category || "all") === tab.id
                          ? "bg-blue-600 text-white shadow-lg scale-105"
                          : "bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md"
                      }`}
                    >
                      {tab.label} <span className="ml-1 opacity-75">{tab.count}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Desktop: Regular FilterTabs */}
              <div className="hidden md:block">
                <FilterTabs
                  tabs={categoryTabs}
                  activeTab={filters?.category || "all"}
                  onTabChange={handleCategoryChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <motion.div
            layout
            className={`grid gap-8 ${
              viewMode === "grid" || window.innerWidth < 768
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {(products || []).map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <ProductCard
                  product={product}
                  viewMode={window.innerWidth < 768 ? "grid" : viewMode}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {(!products || products.length === 0) && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>

      {/* Elegant Buy Prompt Modal */}
      {showBuyPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              aria-label="Close"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowBuyPrompt(false)}
            >
              ✕
            </button>
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">💡</div>
              <h3 className="text-xl font-semibold text-gray-900">You don’t have an active plan</h3>
              <p className="text-gray-600">Purchase a verification to get started instantly.</p>
              <div className="pt-2 flex gap-3 justify-center">
                <button
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowBuyPrompt(false)}
                >
                  Not now
                </button>
                <button
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  onClick={() => {
                    const vt = location.state?.verificationType
                    const fromProduct = location.state?.fromProduct
                    const vtFromQp = searchParams.get('service') || undefined
                    if (vt && fromProduct) {
                      // Go directly to checkout for one-time purchase
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
                  Buy Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsPage
