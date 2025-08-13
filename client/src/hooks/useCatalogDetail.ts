import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/hooks"

interface UseCatalogDetailOptions<T> {
  fetchAction: (id: string) => any
  clearAction: () => any
  selector: (state: any) => { 
    selectedItem: T | null
    isLoading: boolean
    error: string | null
  }
  type: string
  transformItem?: (item: T) => any
}

export function useCatalogDetail<T>({
  fetchAction,
  clearAction,
  selector,
  type,
  transformItem = (item) => item
}: UseCatalogDetailOptions<T>) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { selectedItem, isLoading, error } = useAppSelector(selector)

  // Handle data fetching
  useEffect(() => {
    if (id) {
      console.log(`Fetching ${type} with ID:`, id);
      dispatch(fetchAction(id))
        .unwrap()
        .then((data: any) => {
          console.log(`Successfully fetched ${type}:`, data);
        })
        .catch((err: Error) => {
          console.error(`Failed to fetch ${type}:`, err);
        });
    } else {
      console.error(`No ID provided for ${type} fetch`);
    }
    return () => {
      console.log(`Clearing ${type} data`);
      dispatch(clearAction());
    };
  }, [id, dispatch, fetchAction, clearAction, type])

  // Handle back navigation
  const handleBack = () => {
    navigate(-1)
  }

  return {
    id,
    selectedItem: selectedItem ? transformItem(selectedItem) : null,
    isLoading,
    error,
    handleBack,
    type
  }
}
