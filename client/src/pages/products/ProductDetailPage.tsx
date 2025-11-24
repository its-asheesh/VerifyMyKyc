"use client"

import type React from "react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchProductById, clearSelectedProduct } from "../../redux/slices/productSlice"
import { PageHeader } from "../../components/common/PageHeader"
import { LoadingSpinner } from "../../components/common/LoadingSpinner"
import { ProductOverview } from "../../components/products/ProductOverview"
import { ProductFeatures } from "../../components/products/ProductFeatures"
import { ProductPricing } from "../../components/products/ProductPricing"
import { ProductReviews } from "../../components/reviews/ProductReviews"
import { ProductHowItWorks } from "../../components/products/ProductHowItWorks"
import { ProductFAQ } from "../../components/products/ProductFAQ"

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { selectedProduct, isLoading, error } = useAppSelector((state) => state.products)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
    }
    return () => {
      dispatch(clearSelectedProduct())
    }
  }, [dispatch, id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600">{error || "The requested product could not be found."}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
      <PageHeader
      title={selectedProduct.title}
      subtitle={selectedProduct.description}
      showBackButton
      className="py-6 md:py-8"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
        <ProductOverview product={selectedProduct} />
        
        {/* Key Features Section */}
        <ProductFeatures product={selectedProduct} />
        
        {/* How It Works Section */}
        <ProductHowItWorks product={selectedProduct} />
        
        {/* FAQ Section */}
        <ProductFAQ product={selectedProduct} />
        
        {/* Pricing Section */}
        <div id="pricing">
          {/* <ProductPricing product={selectedProduct} /> */}
        </div>
        
        {/* Reviews Section */}
        <ProductReviews productId={selectedProduct.id} showList={true} showStats={true} showForm={false} limit={1000} />
      </div>
    </div>
    </>
  )
}

export default ProductDetailPage
