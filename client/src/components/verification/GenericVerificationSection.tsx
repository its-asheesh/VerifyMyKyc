import React from "react"
import { useVerificationLogic } from "../../hooks/useVerificationLogic"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { VerificationConfirmDialog } from "./VerificationConfirmDialog"
import { NoQuotaDialog } from "./NoQuotaDialog"

interface GenericVerificationSectionProps<TService, TFormData, TPayload> {
    services: TService[]
    title: string
    description: string
    productId?: string
    apiAction: (serviceKey: string, formData: TPayload) => Promise<unknown>
    transformFormData?: (formData: TFormData) => TPayload
    preprocessFields?: (fields: any[]) => any[]
}

export const GenericVerificationSection = <
    TService extends { key: string; name: string; description: string; formFields: any[] },
    TFormData extends Record<string, unknown>,
    TPayload = any
>({
    services,
    title,
    description,
    productId,
    apiAction,
    transformFormData,
    preprocessFields,
}: GenericVerificationSectionProps<TService, TFormData, TPayload>) => {
    const {
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
    } = useVerificationLogic<TService, TFormData>({
        services,
    })

    const getFormFields = (service: TService) => {
        let fields = service.formFields

        // Default consent processing if not overridden
        fields = fields.map((field) => {
            if (field.name === "consent") {
                return {
                    ...field,
                    type: "radio" as const,
                    options: [
                        { label: "Yes", value: "Y" },
                        { label: "No", value: "N" },
                    ],
                }
            }
            return field
        })

        if (preprocessFields) {
            fields = preprocessFields(fields)
        }

        return fields
    }

    const handleConfirmSubmit = async () => {
        await confirmSubmit(async (formData: TFormData) => {
            // Optional transformation
            const payload = transformFormData ? transformFormData(formData) : (formData as unknown as TPayload)

            // Execute API action
            return await apiAction(selectedService.key, payload)
        })
    }

    return (
        <>
            <VerificationLayout
                title={title}
                description={description}
                services={services}
                selectedService={selectedService}
                onServiceChange={handleServiceChange}
            >
                <VerificationForm
                    fields={getFormFields(selectedService)}
                    onSubmit={async (data: any) => initiateSubmit(data)}
                    isLoading={isLoading}
                    result={result}
                    error={error}
                    serviceKey={selectedService.key}
                    serviceName={selectedService.name}
                    serviceDescription={selectedService.description}
                    productId={productId}
                />
            </VerificationLayout>

            <VerificationConfirmDialog
                isOpen={showConfirmDialog}
                onClose={closeConfirmDialog}
                onConfirm={handleConfirmSubmit}
                isLoading={isLoading}
                serviceName={selectedService.name}
                formData={pendingFormData || {}}
                tokenCost={1}
            />

            <NoQuotaDialog
                isOpen={showNoQuotaDialog}
                onClose={closeNoQuotaDialog}
                serviceName={selectedService.name}
            />
        </>
    )
}
