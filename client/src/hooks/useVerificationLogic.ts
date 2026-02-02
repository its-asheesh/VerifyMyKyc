import { useState, useCallback } from "react"

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
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<TResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [showNoQuotaDialog, setShowNoQuotaDialog] = useState(false)
    const [pendingFormData, setPendingFormData] = useState<TFormData | null>(null)

    const handleServiceChange = useCallback((service: T) => {
        setSelectedService(service)
        setResult(null)
        setError(null)
    }, [])

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
            if (!pendingFormData) return; // Guard clause

            setShowConfirmDialog(false)
            setIsLoading(true)
            setError(null)
            setResult(null)

            try {
                const response = await apiAction(pendingFormData)
                setResult(response)
            } catch (err: unknown) {
                // Safe error extraction
                let errorMessage = "";
                if (err && typeof err === 'object') {
                    const errorData = (err as { response?: { data?: { message?: string }, status?: number }, message?: string });
                    errorMessage = errorData.response?.data?.message || errorData.message || "";

                    // Check for quota error
                    if (errorData.response?.status === 403 || /quota|exhaust|exhausted|limit|token/i.test(errorMessage)) {
                        setShowNoQuotaDialog(true);
                        setIsLoading(false);
                        return;
                    }
                }

                setError(errorMessage || "Verification failed")
            } finally {
                setIsLoading(false)
            }
        },
        [pendingFormData],
    )

    return {
        selectedService,
        isLoading,
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
        setIsLoading,
    }
}
