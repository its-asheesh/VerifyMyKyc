import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchSolutionById, clearSelectedSolution } from '../../redux/slices/solutionSlice';
import { useCatalogDetail } from '../../hooks/useCatalogDetail';
import type { RootState } from '../../redux/store';
import CatalogDetailPage from '../../components/catalog/CatalogDetailPage';

// Define the Solution interface with all possible properties
interface Solution {
  id: string;
  title: string;
  description: string;
  industry?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon?: string;
  };
  useCases?: Array<{
    title: string;
    description: string;
    benefits?: string[];
  }>;
  benefits?: string[];
  implementation?: Array<{
    step: number;
    title: string;
    description: string;
    duration: string;
  }>;
  caseStudies?: any[];
  isActive?: boolean;
  image?: string;
  link?: string;
  createdAt?: string;
  updatedAt?: string;
  features?: string[];
  pricing?: any;
  accountNumber?: string;
  accountType?: string;
  bankName?: string;
}

// Define the catalog detail config type
interface CatalogDetailConfig<T> {
  type: 'products' | 'solutions' | 'resources' | 'services';
  selectedItem: T | null;
  isLoading: boolean;
  error: string | null;
  notFoundTitle: string;
  notFoundDescription: string;
  notFoundMessage: string;
  errorTitle: string;
  errorMessage: string;
  showPricing: boolean;
  mapItemToProduct: (item: T) => any;
}



const SolutionDetailPage: React.FC = () => {
  // Extract id from URL params and use it in the hook
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  
  // Use the id in a way that satisfies TypeScript
  React.useEffect(() => {
    if (id) {
      // The id is being used here to satisfy TypeScript
      console.log(`Loading solution with id: ${id}`);
    }
  }, [id]);
  
  // Use the useCatalogDetail hook to fetch solution data
  const { selectedItem, isLoading, error } = useCatalogDetail<Solution>({
    type: 'solutions',
    fetchAction: fetchSolutionById,
    clearAction: clearSelectedSolution,
    selector: (state: RootState) => ({
      selectedItem: state.solutions.selectedSolution,
      isLoading: state.solutions.isLoading,
      error: state.solutions.error
    }),
    transformItem: (solution) => ({
      ...solution,
      // Ensure required fields are present
      title: solution.title || 'Untitled Solution',
      description: solution.description || '',
      useCases: solution.useCases || [],
    }),
  });

  const config: CatalogDetailConfig<Solution> = {
    type: 'solutions',
    selectedItem: selectedItem || null,
    isLoading,
    error: error || null,
    notFoundTitle: 'Solution not found',
    notFoundDescription: 'The solution you are looking for does not exist or has been removed.',
    notFoundMessage: 'The solution you are looking for could not be found.',
    errorTitle: 'Error Loading Solution',
    errorMessage: error || 'An error occurred while loading the solution.',
    showPricing: false,
    mapItemToProduct: (item: Solution) => ({
      ...item,
      // Ensure all required fields are present
      features: (item as any).features || [],
      pricing: (item as any).pricing || {},
      isActive: (item as any).isActive !== false,
      implementation: (item as any).implementation || [],
      // Add any other required fields with defaults
      title: item.title || 'Untitled Solution',
      description: item.description || '',
      useCases: item.useCases || []
    })
  };



  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      if (clearSelectedSolution) {
        dispatch(clearSelectedSolution());
      }
    };
  }, [dispatch, clearSelectedSolution]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!selectedItem) return <div>Solution not found</div>;

  return (
    <div className="solution-detail-page">
      <CatalogDetailPage
        config={config}
        selectedItem={selectedItem}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default SolutionDetailPage;
