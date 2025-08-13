"use client"

import type React from "react"
import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchProducts, fetchCategories } from "../../redux/slices/productSlice"
import { CatalogPage, CatalogFactory } from "../../components/catalog"
import { mockProducts } from "../../redux/slices/productSlice"

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { products = [], categories = [], isLoading, error } = useAppSelector((state) => state.products)

  const config = CatalogFactory.createCatalogConfig(CatalogFactory.PRODUCTS)

  const handleFetchProducts = useCallback(() => dispatch(fetchProducts()), [dispatch])
  const handleFetchCategories = useCallback(() => dispatch(fetchCategories()), [dispatch])
  const handleRetry = useCallback(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  const getItemCategory = (product: any) => product.category
  const getItemCount = (categoryId: string) => mockProducts.filter((p) => p.category?.id === categoryId).length
  const getTotalCount = () => mockProducts.length
  const mapItemToProduct = (product: any) => product

  return (
    <CatalogPage
      config={config}
      items={products}
      categories={categories}
      isLoading={isLoading}
      error={error}
      onFetchItems={handleFetchProducts}
      onFetchCategories={handleFetchCategories}
      onRetry={handleRetry}
      getItemCategory={getItemCategory}
      getItemCount={getItemCount}
      getTotalCount={getTotalCount}
      mapItemToProduct={mapItemToProduct}
    />
  )
}

export default ProductsPage
