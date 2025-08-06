import BaseApi from "./baseApi"
import type { Product, ProductCategory } from "../../types/product"
import type { ApiResponse } from "../../types/common"

class ProductApi extends BaseApi {
  async getProducts(params?: { category?: string; search?: string }): Promise<ApiResponse<Product[]>> {
    return this.get("/products", { params })
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return this.get(`/products/${id}`)
  }

  async getCategories(): Promise<ApiResponse<ProductCategory[]>> {
    return this.get("/products/categories")
  }

  async getProductDocumentation(id: string): Promise<ApiResponse<string>> {
    return this.get(`/products/${id}/documentation`)
  }
}

export const productApi = new ProductApi()
