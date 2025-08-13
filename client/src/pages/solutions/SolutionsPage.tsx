"use client"

import type React from "react"
import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchSolutions, fetchIndustries } from "../../redux/slices/solutionSlice"
import { CatalogPage, CatalogFactory } from "../../components/catalog"

const SolutionsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { solutions, industries, isLoading, error } = useAppSelector((state) => state.solutions)

  const config = CatalogFactory.createCatalogConfig(CatalogFactory.SOLUTIONS)

  const handleFetchSolutions = useCallback(() => dispatch(fetchSolutions()), [dispatch])
  const handleFetchIndustries = useCallback(() => dispatch(fetchIndustries()), [dispatch])
  const handleRetry = useCallback(() => {
    dispatch(fetchSolutions())
    dispatch(fetchIndustries())
  }, [dispatch])

  const getItemCategory = (solution: any) => solution.industry
  const getItemCount = (industryId: string) => solutions.filter((s) => s.industry.id === industryId).length
  const getTotalCount = () => solutions.length
  const mapItemToProduct = (solution: any) => ({
    id: solution.id,
    title: solution.title,
    description: solution.description,
    image: solution.image,
    category: solution.industry,
    features: solution.benefits || [],
    pricing: undefined,
    isActive: true,
  })

  return (
    <CatalogPage
      config={config}
      items={solutions}
      categories={industries}
      isLoading={isLoading}
      error={error}
      onFetchItems={handleFetchSolutions}
      onFetchCategories={handleFetchIndustries}
      onRetry={handleRetry}
      getItemCategory={getItemCategory}
      getItemCount={getItemCount}
      getTotalCount={getTotalCount}
      mapItemToProduct={mapItemToProduct}
    />
  )
}

export default SolutionsPage
