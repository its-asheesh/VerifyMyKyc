# Reusable Catalog System

This directory contains a reusable catalog system that eliminates duplication between products, solutions, and other catalog-like pages.

## Components

### CatalogPage
A reusable component for displaying lists of items (products, solutions, resources, etc.) with:
- Search functionality
- Category/industry filtering
- Grid/list view toggle
- Responsive design
- Loading states
- Error handling

### CatalogDetailPage
A reusable component for displaying detailed views of individual items with:
- Product overview
- Features/benefits
- Conditional pricing display
- Loading states
- Error handling

### CatalogFactory
A factory class that provides predefined configurations for common catalog types:
- Products
- Solutions
- Resources
- Services

## Usage

### Basic Usage

```tsx
import { CatalogPage, CatalogFactory } from '../../components/catalog'

const MyCatalogPage: React.FC = () => {
  const config = CatalogFactory.createCatalogConfig(CatalogFactory.PRODUCTS)
  
  return (
    <CatalogPage
      config={config}
      items={myItems}
      categories={myCategories}
      isLoading={isLoading}
      error={error}
      onFetchItems={handleFetchItems}
      onFetchCategories={handleFetchCategories}
      onRetry={handleRetry}
      getItemCategory={getItemCategory}
      getItemCount={getItemCount}
      getTotalCount={getTotalCount}
      mapItemToProduct={mapItemToProduct}
    />
  )
}
```

### Creating Custom Catalog Types

```tsx
const CUSTOM_CATALOG: CatalogTypeDefinition = {
  type: 'custom',
  title: 'Custom Items',
  subtitle: 'Description of custom items',
  searchPlaceholder: 'Search custom items...',
  filterLabel: 'Categories',
  allItemsLabel: 'All Items',
  noItemsMessage: 'No items found',
  noItemsSubmessage: 'Try adjusting your search or filter criteria',
  errorTitle: 'Error Loading Items',
  errorMessage: 'Failed to load items',
  baseRoute: '/custom',
  detailRoute: '/custom',
  showPricing: false
}

const config = CatalogFactory.createCatalogConfig(CUSTOM_CATALOG)
```

### Required Functions

The catalog components require several functions to work properly:

- `getItemCategory(item)`: Returns the category object for an item
- `getItemCount(categoryId)`: Returns the count of items in a category
- `getTotalCount()`: Returns the total count of all items
- `mapItemToProduct(item)`: Transforms an item to the expected product format

## Benefits

1. **Eliminates Duplication**: No more copying code between products and solutions
2. **Consistent UI**: All catalog pages look and behave the same way
3. **Easy Maintenance**: Changes to catalog functionality only need to be made in one place
4. **Extensible**: Easy to add new catalog types (resources, services, etc.)
5. **Type Safe**: Full TypeScript support with proper interfaces

## Migration

The existing products and solutions pages have been refactored to use this system. The functionality remains exactly the same, but the code is now much cleaner and more maintainable.

## Future Enhancements

- Add support for different card layouts
- Add pagination support
- Add sorting options
- Add advanced filtering
- Add bulk actions
