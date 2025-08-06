import type { BaseEntity } from "./common"

export interface Product extends BaseEntity {
  title: string
  description: string
  category: ProductCategory
  features: string[]
  pricing: ProductPricing
  documentation: string
  apiEndpoint?: string
  isActive: boolean
  icon: string
  image: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
}

export interface ProductPricing {
  free: PricingTier
  basic: PricingTier
  premium: PricingTier
}

export interface PricingTier {
  price: number
  requests: number
  features: string[]
  support: string
}

export enum ProductType {
  IDENTITY_VERIFICATION = "identity-verification",
  DOCUMENT_VERIFICATION = "document-verification",
  BIOMETRIC_VERIFICATION = "biometric-verification",
  ADDRESS_VERIFICATION = "address-verification",
}
