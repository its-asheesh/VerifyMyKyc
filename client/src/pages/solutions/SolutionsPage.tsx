"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchSolutions, fetchIndustries } from "../../redux/slices/solutionSlice"
import { PageHeader } from "../../components/common/PageHeader"
import { SearchInput } from "../../components/common/SearchInput"
import { FilterTabs } from "../../components/common/FilterTabs"
import { LoadingSpinner } from "../../components/common/LoadingSpinner"
import { SolutionCard } from "../../components/solutions/SolutionCard"
import { useSearchParams } from "react-router-dom"

const SolutionsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { solutions, industries, isLoading, error } = useAppSelector((state) => state.solutions)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const industryParam = searchParams.get("industry") || ""
  const [selectedIndustry, setSelectedIndustry] = useState(industryParam)

  useEffect(() => {
    // Initialize from URL and load data (with client fallback if backend 404s)
    dispatch(fetchSolutions(industryParam || undefined))
    dispatch(fetchIndustries())
    setSelectedIndustry(industryParam)
  }, [dispatch, industryParam])

  const filteredSolutions = solutions.filter((solution) => {
    const matchesSearch =
      solution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = !selectedIndustry || solution.industry.id === selectedIndustry
    return matchesSearch && matchesIndustry
  })

  const industryTabs = [
    { id: "", label: "All Industries", count: solutions.length },
    ...industries.map((industry) => ({
      id: industry.id,
      label: industry.name,
      count: solutions.filter((s) => s.industry.id === industry.id).length,
    })),
  ]

  const handleTabChange = (id: string) => {
    setSelectedIndustry(id)
    const next = new URLSearchParams(searchParams)
    if (id) next.set("industry", id)
    else next.delete("industry")
    setSearchParams(next, { replace: true })
    // Optionally re-fetch solutions for server-side filtering; client fallback still filters in UI
    dispatch(fetchSolutions(id || undefined))
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Solutions</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Industry Solutions"
        subtitle="Tailored verification solutions for every industry and use case"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Search and Filters */}
        {/* <div className="mb-8 space-y-6">
          <SearchInput placeholder="Search solutions..." onSearch={setSearchQuery} className="max-w-md" />

          <FilterTabs tabs={industryTabs} activeTab={selectedIndustry} onTabChange={handleTabChange} />
        </div> */}

        {/* Solutions Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSolutions.map((solution, index) => (
              <motion.div
                key={solution.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SolutionCard solution={solution} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredSolutions.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No solutions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SolutionsPage
