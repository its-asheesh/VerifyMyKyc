"use client"

import React, { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchSolutionById, clearSelectedSolution } from "../../redux/slices/solutionSlice"
import type { Solution } from "../../types/solution"
import type { Product, ProductCategory, ProductPricing } from "../../types/product"
import { PageHeader } from "../../components/common/PageHeader"
import { LoadingSpinner } from "../../components/common/LoadingSpinner"
import { ProductOverview } from "../../components/products/ProductOverview"
import { ProductPricing as ProductPricingSection } from "../../components/products/ProductPricing"
import { ProductFeatures } from "../../components/products/ProductFeatures"
import { ProductReviews } from "../../components/reviews/ProductReviews"

// Adapt a Solution entity to the Product shape expected by product components
function adaptSolutionToProduct(solution: Solution): Product {
  // Derive a category from the solution's industry
  const category: ProductCategory = {
    id: solution.industry.id,
    name: solution.industry.name,
    slug: solution.industry.slug,
    description: solution.industry.description,
  }

  // Build a features list from benefits and use case titles
  const useCaseTitles = (solution.useCases || []).map((u) => u.title)
  const features = Array.from(new Set([...(solution.benefits || []), ...useCaseTitles]))
  if (features.length === 0) {
    features.push("Seamless integration", "Real-time verification", "High accuracy", "Detailed reporting")
  }

  // Fallback pricing (will be overridden by admin-defined verification pricing where available)
  const fallbackPricing: ProductPricing = {
    free: { price: 0, requests: 10, features: ["Basic access"], support: "Community" },
    basic: { price: 199, requests: 100, features: ["Email support"], support: "Email" },
    premium: { price: 499, requests: 1000, features: ["Priority support"], support: "24/7" },
  }

  // Normalize title to trigger correct pricing mapping for bank solutions if needed
  let normalizedTitle = solution.title
  const t = solution.title.toLowerCase()
  const industryName = solution.industry.name.toLowerCase()
  if (t.includes("bank") && !(/bank account|bankaccount|banking/.test(t))) {
    normalizedTitle = `${solution.title} - Bank Account`
  } else if (industryName.includes("bank") || industryName.includes("finance")) {
    // If industry is banking/finance, keep original title; pricing mapping may still work via keywords
    normalizedTitle = solution.title
  }

  const product: Product = {
    id: solution.id,
    title: normalizedTitle,
    description: solution.description,
    category,
    features,
    pricing: fallbackPricing,
    documentation: "/documentation",
    apiEndpoint: "",
    isActive: solution.isActive,
    icon: solution.image,
    image: solution.image,
    createdAt: (solution as any).createdAt,
    updatedAt: (solution as any).updatedAt,
    demand: 'High Demand', // Default demand level
    demandLevel: 'medium',  // Default demand level
  }

  return product
}

const SolutionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { selectedSolution, isLoading, error } = useAppSelector((state) => state.solutions)

  useEffect(() => {
    if (id) {
      dispatch(fetchSolutionById(id))
    }
    return () => {
      dispatch(clearSelectedSolution())
    }
  }, [dispatch, id])

  const adaptedProduct = useMemo(() => {
    return selectedSolution ? adaptSolutionToProduct(selectedSolution) : null
  }, [selectedSolution])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !selectedSolution || !adaptedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Solution Not Found</h2>
          <p className="text-gray-600">{error || "The requested solution could not be found."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={selectedSolution.title}
        subtitle={selectedSolution.description}
        showBackButton
        className="py-6 md:py-8"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
        <ProductOverview product={adaptedProduct} />
        <div id="pricing">
          <ProductPricingSection product={adaptedProduct} />
        </div>
        <ProductFeatures product={adaptedProduct} />
        <ProductReviews productId={adaptedProduct.id} showList={true} showStats={true} showForm={false} limit={1000} />
      </div>
    </div>
  )
}

export default SolutionDetailPage
