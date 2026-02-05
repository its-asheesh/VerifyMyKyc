import { useState, useCallback } from "react"
import { useMutation } from "@tanstack/react-query"

export interface VerificationLogicProps<T> {
    services: T[]
    initialService?: T
}

export interface UseVerificationLogicReturn<T, TFormData, TResult> {
    selectedService: T
    isLoading: boolean
    result: TResult | null
    error: string | null
    showConfirmDialog: boolean
    showNoQuotaDialog: boolean
    pendingFormData: TFormData | null
    handleServiceChange: (service: T) => void
    initiateSubmit: (formData: TFormData) => void
    closeConfirmDialog: () => void
    closeNoQuotaDialog: () => void
    confirmSubmit: (apiAction: (formData: TFormData) => Promise<TResult>) => Promise<void>
    setError: (error: string | null) => void
    setResult: (result: TResult | null) => void
    setIsLoading: (isLoading: boolean) => void
}

export const useVerificationLogic = <
    T extends { key: string; name: string; description: string; apiEndpoint?: string },
    TFormData = unknown,
    TResult = unknown
>({
    services,
    initialService,
}: VerificationLogicProps<T>): UseVerificationLogicReturn<T, TFormData, TResult> => {
    const [selectedService, setSelectedService] = useState<T>(initialService || services[0])
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [showNoQuotaDialog, setShowNoQuotaDialog] = useState(false)
    const [pendingFormData, setPendingFormData] = useState<TFormData | null>(null)

    // Result and Error are now managed via explicit state to persist them across component updates 
    // or we can use mutation.data/.error. However, mutation state handles "latest" execution.
    // For specific UI persistence, local state often fits UI "result views" better if mutation resets, 
    // but we can sync them. Let's use local state for result/error to maintain the existing API behavior exactly,
    // but drive the async process with mutation.
    const [result, setResult] = useState<TResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const mutation = useMutation({
        mutationFn: async ({ action, data }: { action: (d: TFormData) => Promise<TResult>, data: TFormData }) => {
            return await action(data);
        },
        onSuccess: (data) => {
            setResult(data);
            setError(null);
        },
        onError: (err: any) => {
            // Safe error extraction
            let errorMessage = "";
            if (err && typeof err === 'object') {
                const errorData = (err as { response?: { data?: { message?: string, error?: string | { message: string } }, status?: number }, message?: string });

                // prioritized error message extraction
                errorMessage =
                    errorData.response?.data?.message ||
                    (typeof errorData.response?.data?.error === 'string' ? errorData.response?.data?.error : errorData.response?.data?.error?.message) ||
                    errorData.message ||
                    "";

                // Check for quota error
                if (errorData.response?.status === 403 || /quota|exhaust|exhausted|limit|token/i.test(errorMessage)) {
                    setShowNoQuotaDialog(true);
                    return;
                }
            }
            setError(errorMessage || "Verification failed");
            setResult(null);
        }
    });

    const handleServiceChange = useCallback((service: T) => {
        setSelectedService(service)
        setResult(null)
        setError(null)
        mutation.reset();
    }, [mutation])

    const initiateSubmit = useCallback((formData: TFormData) => {
        setPendingFormData(formData)
        setShowConfirmDialog(true)
    }, [])

    const closeConfirmDialog = useCallback(() => {
        setShowConfirmDialog(false)
    }, [])

    const closeNoQuotaDialog = useCallback(() => {
        setShowNoQuotaDialog(false)
    }, [])

    const confirmSubmit = useCallback(
        async (apiAction: (formData: TFormData) => Promise<TResult>) => {
            if (!pendingFormData) return;

            setShowConfirmDialog(false)
            // Error/Result clearing handled by mutation lifecycle or manual if we prefer
            setError(null)
            setResult(null)

            await mutation.mutateAsync({ action: apiAction, data: pendingFormData });
        },
        [pendingFormData, mutation],
    )

    return {
        selectedService,
        isLoading: mutation.isPending,
        result,
        error,
        showConfirmDialog,
        showNoQuotaDialog,
        pendingFormData,
        handleServiceChange,
        initiateSubmit,
        closeConfirmDialog,
        closeNoQuotaDialog,
        confirmSubmit,
        setError,
        setResult,
        setIsLoading: () => { }, // No-op as managed by mutation now, but kept for interface compatibility
    }
}
