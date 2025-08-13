"use client"

import type React from "react"
import { PageHeader } from "../common/PageHeader"
import { LoadingSpinner } from "../common/LoadingSpinner"
import { ProductOverview } from "../products/ProductOverview"
import { ProductFeatures } from "../products/ProductFeatures"
import { ProductPricing } from "../products/ProductPricing"

export interface CatalogDetailConfig {
  type: 'products' | 'solutions' | 'resources' | 'services'
  notFoundTitle: string
  notFoundMessage: string
  errorTitle: string
  errorMessage: string
  showPricing: boolean
  mapItemToProduct: (item: any) => any
}

export interface CatalogDetailPageProps {
  config: CatalogDetailConfig
  selectedItem: any
  isLoading: boolean
  error: string | null
  renderHeaderActions?: () => React.ReactNode
}

const CatalogDetailPage: React.FC<CatalogDetailPageProps> = ({
  config,
  selectedItem,
  isLoading,
  error,
  renderHeaderActions,
}) => {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {config.errorTitle}
          </h2>
          <p className="text-gray-600">
            {error}
          </p>
        </div>
      </div>
    )
  }

  if (!selectedItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {config.notFoundTitle}
          </h2>
          <p className="text-gray-600">
            {config.notFoundMessage}
          </p>
        </div>
      </div>
    )
  }

  const mappedProduct = config.mapItemToProduct(selectedItem)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
        <div className="flex justify-between items-start gap-4">
          <PageHeader 
            title={selectedItem.title} 
            subtitle={selectedItem.description} 
            showBackButton 
          />
          {renderHeaderActions?.()}
        </div>

        <ProductOverview product={mappedProduct} />
        
        {config.showPricing && mappedProduct.pricing && (
          <ProductPricing product={mappedProduct} />
        )}
        
        <ProductFeatures product={mappedProduct} />
      </div>
    </div>
  )
}

export default CatalogDetailPage
