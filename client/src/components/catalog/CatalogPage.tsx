"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { PageHeader } from "../common/PageHeader"
import { SearchInput } from "../common/SearchInput"
import { FilterTabs } from "../common/FilterTabs"
import { LoadingSpinner } from "../common/LoadingSpinner"
import { ProductCard } from "../products/ProductCard"

export interface CatalogConfig {
  type: 'products' | 'solutions' | 'resources' | 'services'
  title: string
  subtitle: string
  searchPlaceholder: string
  filterLabel: string
  allItemsLabel: string
  noItemsMessage: string
  noItemsSubmessage: string
  errorTitle: string
  errorMessage: string
  baseRoute: string
  detailRoute: string
}

export interface CatalogPageProps {
  config: CatalogConfig
  items: any[]
  categories: any[]
  isLoading: boolean
  error: string | null
  onFetchItems: () => void
  onFetchCategories: () => void
  onRetry: () => void
  getItemCategory: (item: any) => any
  getItemCount: (categoryId: string) => number
  getTotalCount: () => number
  mapItemToProduct: (item: any) => any
}

const CatalogPage: React.FC<CatalogPageProps> = ({
  config,
  items,
  categories,
  isLoading,
  error,
  onFetchItems,
  onFetchCategories,
  onRetry,
  getItemCategory,
  getItemCount,
  getTotalCount,
  mapItemToProduct
}) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    onFetchItems()
    onFetchCategories()
  }, [])

  // Handle URL parameters on page load
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || searchParams.get('industry')
    if (categoryFromUrl && categoryFromUrl !== selectedCategoryId) {
      setSelectedCategoryId(categoryFromUrl)
    }
  }, [searchParams, selectedCategoryId])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategoryId || getItemCategory(item)?.id === selectedCategoryId
      return matchesSearch && matchesCategory
    })
  }, [items, searchQuery, selectedCategoryId, getItemCategory])

  const categoryTabs = useMemo(() => [
    { id: "", label: config.allItemsLabel, count: getTotalCount() },
    ...(categories || []).map((cat) => ({
      id: cat.id,
      label: cat.name,
      count: getItemCount(cat.id),
    })),
  ], [categories, getTotalCount, getItemCount, config.allItemsLabel])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    const category = categories.find((c) => c.id === categoryId)
    if (category) {
      const paramName = config.type === 'solutions' ? 'industry' : 'category'
      const paramValue = category.slug || category.name.toLowerCase().replace(/\s+/g, "-")
      navigate(`${config.baseRoute}?${paramName}=${paramValue}`)
    } else {
      navigate(config.baseRoute)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{config.errorTitle}</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={onRetry}
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
      <PageHeader title={config.title} subtitle={config.subtitle}>
        <div className="flex flex-col md:flex-row md:items-center md:gap-6 w-full">
          <div className="flex-1">
            <SearchInput 
              placeholder={config.searchPlaceholder} 
              onSearch={setSearchQuery} 
              className="max-w-md w-full" 
            />
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
        {/* Filters */}
        <div className="mb-8 space-y-6">
          {categories && categories.length > 0 && (
            <FilterTabs 
              tabs={categoryTabs} 
              activeTab={selectedCategoryId} 
              onTabChange={handleCategoryChange} 
            />
          )}
        </div>

        {/* Items Grid/List */}
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
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard 
                  product={mapItemToProduct(item)} 
                  viewMode={viewMode} 
                  linkTo={`${config.detailRoute}/${item.id}`}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredItems.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{config.noItemsMessage}</h3>
            <p className="text-gray-600">{config.noItemsSubmessage}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CatalogPage
