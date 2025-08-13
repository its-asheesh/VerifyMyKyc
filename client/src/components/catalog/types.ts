export interface CatalogCategory {
  id: string
  name: string
  slug?: string
}

export interface CatalogItem {
  id: string
  title: string
  description: string
  image: string
  category: CatalogCategory
  link?: string
  price?: number
  rating?: number
  reviews?: number
  tags?: string[]
}


