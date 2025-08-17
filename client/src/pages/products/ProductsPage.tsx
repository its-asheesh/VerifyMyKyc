"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
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
  const { products = [], categories = [], isLoading, error, filters } = useAppSelector((state) => state.products)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  // Handle URL parameters on page load
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl && categoryFromUrl !== filters.category) {
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
    dispatch(setFilters({ category }))
    // Update URL to reflect the category change
    if (category) {
      navigate(`/products?category=${category}`)
    } else {
      navigate('/products')
    }
  }

  // Ensure categories is an array before mapping
  const categoryTabs = [
    { id: "", label: "All Products", count: mockProducts.length }, // Total count of all products
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
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Our Products" subtitle="Comprehensive verification solutions for every business need">
        {/* Layout toggle buttons and search bar aligned */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-6 w-full">
          <div className="flex-1">
            <SearchInput placeholder="Search products..." onSearch={handleSearch} className="max-w-md w-full" />
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
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
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Only show filter tabs if categories are loaded */}
          {categories && categories.length > 0 && (
            <FilterTabs tabs={categoryTabs} activeTab={filters?.category || ""} onTabChange={handleCategoryChange} />
          )}
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <motion.div
            layout
            className={`grid gap-6 ${
              viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            }`}
          >
            {(products || []).map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {(!products || products.length === 0) && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
