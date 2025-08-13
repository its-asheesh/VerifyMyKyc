import type { CatalogConfig, CatalogDetailConfig } from './index'

export interface CatalogTypeDefinition {
  type: 'products' | 'solutions' | 'resources' | 'services'
  title: string
  subtitle: string
  searchPlaceholder: string
  filterLabel: string
  allItemsLabel: string
  noItemsMessage: string
  noItemsSubmessage: string
  errorTitle: string
  errorMessage: string
  baseRoute: string
  detailRoute: string
  showPricing: boolean
}

export class CatalogFactory {
  static createCatalogConfig(definition: CatalogTypeDefinition): CatalogConfig {
    return {
      type: definition.type,
      title: definition.title,
      subtitle: definition.subtitle,
      searchPlaceholder: definition.searchPlaceholder,
      filterLabel: definition.filterLabel,
      allItemsLabel: definition.allItemsLabel,
      noItemsMessage: definition.noItemsMessage,
      noItemsSubmessage: definition.noItemsSubmessage,
      errorTitle: definition.errorTitle,
      errorMessage: definition.errorMessage,
      baseRoute: definition.baseRoute,
      detailRoute: definition.detailRoute
    }
  }

  static createCatalogDetailConfig(definition: CatalogTypeDefinition): CatalogDetailConfig {
    return {
      type: definition.type,
      notFoundTitle: `${definition.title.slice(0, -1)} Not Found`,
      notFoundMessage: `The requested ${definition.type.slice(0, -1)} could not be found.`,
      errorTitle: `Error Loading ${definition.title}`,
      errorMessage: `Failed to load ${definition.type}`,
      showPricing: definition.showPricing,
      mapItemToProduct: (item: any) => item // Default mapping, can be overridden
    }
  }

  // Predefined catalog types
  static readonly PRODUCTS: CatalogTypeDefinition = {
    type: 'products',
    title: 'Our Products',
    subtitle: 'Comprehensive verification solutions for every business need',
    searchPlaceholder: 'Search products...',
    filterLabel: 'Categories',
    allItemsLabel: 'All Products',
    noItemsMessage: 'No products found',
    noItemsSubmessage: 'Try adjusting your search or filter criteria',
    errorTitle: 'Error Loading Products',
    errorMessage: 'Failed to load products',
    baseRoute: '/products',
    detailRoute: '/products',
    showPricing: true
  }

  static readonly SOLUTIONS: CatalogTypeDefinition = {
    type: 'solutions',
    title: 'Industry Solutions',
    subtitle: 'Tailored verification solutions for every industry and use case',
    searchPlaceholder: 'Search solutions...',
    filterLabel: 'Industries',
    allItemsLabel: 'All Industries',
    noItemsMessage: 'No solutions found',
    noItemsSubmessage: 'Try adjusting your search or filter criteria',
    errorTitle: 'Error Loading Solutions',
    errorMessage: 'Failed to load solutions',
    baseRoute: '/solutions',
    detailRoute: '/solutions',
    showPricing: false
  }

  static readonly RESOURCES: CatalogTypeDefinition = {
    type: 'resources',
    title: 'Resources',
    subtitle: 'Documentation, guides, and helpful resources',
    searchPlaceholder: 'Search resources...',
    filterLabel: 'Categories',
    allItemsLabel: 'All Resources',
    noItemsMessage: 'No resources found',
    noItemsSubmessage: 'Try adjusting your search or filter criteria',
    errorTitle: 'Error Loading Resources',
    errorMessage: 'Failed to load resources',
    baseRoute: '/resources',
    detailRoute: '/resources',
    showPricing: false
  }

  static readonly SERVICES: CatalogTypeDefinition = {
    type: 'services',
    title: 'Our Services',
    subtitle: 'Professional verification and consulting services',
    searchPlaceholder: 'Search services...',
    filterLabel: 'Service Types',
    allItemsLabel: 'All Services',
    noItemsMessage: 'No services found',
    noItemsSubmessage: 'Try adjusting your search or filter criteria',
    errorTitle: 'Error Loading Services',
    errorMessage: 'Failed to load services',
    baseRoute: '/services',
    detailRoute: '/services',
    showPricing: true
  }
}
