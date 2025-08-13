"use client"

import React from "react"
import { fetchProductById, clearSelectedProduct } from "../../redux/slices/productSlice"
import { CatalogDetailPage, CatalogFactory } from "../../components/catalog"
import { useCatalogDetail } from "../../hooks/useCatalogDetail"

const ProductDetailPage: React.FC = () => {
  const { selectedItem, isLoading, error } = useCatalogDetail({
    fetchAction: fetchProductById,
    clearAction: clearSelectedProduct,
    selector: (state: any) => {
      console.log('Product state:', state.products);
      return {
        selectedItem: state.products.selectedProduct,
        isLoading: state.products.isLoading,
        error: state.products.error,
      };
    },
    type: "product",
    transformItem: (product: any) => product // Simple pass-through for products
  })

  console.log('ProductDetailPage render:', { selectedItem, isLoading, error });

  const config = {
    ...CatalogFactory.createCatalogDetailConfig(CatalogFactory.PRODUCTS),
    notFoundTitle: "Product Not Found",
    notFoundMessage: "The requested product could not be found.",
    errorTitle: "Error Loading Product",
    errorMessage: error || "An error occurred while loading the product.",
    mapItemToProduct: (product: any) => ({
      ...product,
      // Ensure all required fields are present
      title: product.title || 'Untitled Product',
      description: product.description || '',
      features: product.features || [],
      pricing: product.pricing || {},
      category: product.category || { name: 'Uncategorized', id: 'uncategorized' },
      image: product.image || '/placeholder-product.png'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CatalogDetailPage
        config={config}
        selectedItem={selectedItem}
        isLoading={isLoading}
        error={error}
      />
    </div>
  )
}

export default ProductDetailPage
