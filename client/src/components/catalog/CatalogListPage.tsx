"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { PageHeader } from "../common/PageHeader"
import { SearchInput } from "../common/SearchInput"
import { FilterTabs } from "../common/FilterTabs"
import { LoadingSpinner } from "../common/LoadingSpinner"
import type { CatalogItem, CatalogCategory } from "./types"

interface CatalogListPageProps {
  title: string
  subtitle: string
  items: CatalogItem[]
  categories: CatalogCategory[]
  isLoading?: boolean
  error?: string | null
  urlParamKey?: string // e.g., 'category' for products, 'industry' for solutions
  onSearch?: (value: string) => void
}

export const CatalogListPage: React.FC<CatalogListPageProps> = ({
  title,
  subtitle,
  items,
  categories,
  isLoading = false,
  error,
  urlParamKey = "category",
  onSearch,
}) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedId, setSelectedId] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    const param = searchParams.get(urlParamKey)
    if (!param) return
    const normalized = param.toLowerCase()
    const match =
      categories.find((c) => c.slug?.toLowerCase() === normalized) ||
      categories.find((c) => c.id === param) ||
      categories.find((c) => c.name.toLowerCase().includes(normalized))
    if (match && match.id !== selectedId) {
      setSelectedId(match.id)
    }
  }, [categories, searchParams, urlParamKey, selectedId])

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchesSearch =
        it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        it.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCat = !selectedId || it.category.id === selectedId
      return matchesSearch && matchesCat
    })
  }, [items, searchQuery, selectedId])

  const tabs = useMemo(() => (
    [{ id: "", label: `All`, count: items.length } as any].concat(
      categories.map((c) => ({ id: c.id, label: c.name, count: items.filter((it) => it.category.id === c.id).length }))
    )
  ), [items, categories])

  const handleTabChange = (id: string) => {
    setSelectedId(id)
    const cat = categories.find((c) => c.id === id)
    if (cat) {
      navigate(`?${urlParamKey}=${cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}`)
    } else {
      navigate(`.`)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title={title} subtitle={subtitle}>
        <div className="flex flex-col md:flex-row md:items-center md:gap-6 w-full">
          <div className="flex-1">
            <SearchInput
              placeholder="Search..."
              onSearch={(v) => {
                setSearchQuery(v)
                onSearch?.(v)
              }}
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
                <path fillRule="evenodd" d="M3 4h14v2H3V4zm0 5h14v2H3V9zm0 5h14v2H3v-2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8 space-y-6">
          <FilterTabs tabs={tabs} activeTab={selectedId} onTabChange={handleTabChange} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <motion.div
            layout
            className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
          >
            {filtered.map((item, idx) => (
              <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                {/* Consumer page should pass a renderer/card component via composition; for now use a simple card */}
                <div className="bg-white rounded-2xl shadow-lg p-4">
                  <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded-xl mb-4" />
                  <div className="text-xs text-gray-500 mb-1">{item.category.name}</div>
                  <div className="text-lg font-semibold text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-600 line-clamp-2 mt-1">{item.description}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}


