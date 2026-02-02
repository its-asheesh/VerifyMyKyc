"use client"

import type React from "react"
import { useVerificationLogic } from "../../hooks/useVerificationLogic"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { VerificationConfirmDialog } from "./VerificationConfirmDialog"
import { companyServices } from "../../config/companyConfig"
import { businessApi } from "../../services/api/businessApi"
import { NoQuotaDialog } from "./NoQuotaDialog"


interface CompanyFormData {
  cin: string;
  consent: string | boolean;
}

export const CompanySection: React.FC<{ productId?: string }> = ({ productId }) => {
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
  } = useVerificationLogic<typeof companyServices[number], CompanyFormData>({
    services: companyServices,
  })

  // Get Company pricing from backend
  // const { getVerificationPricingByType } = usePricingContext()

  const getFormFields = (service: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    return service.formFields.map((field: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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
  }

  const handleConfirmSubmit = async () => {
    await confirmSubmit(async (formData: CompanyFormData) => {
      const consentValue = typeof formData.consent === 'boolean' ? (formData.consent ? 'Y' : 'N') : formData.consent;

      let response
      const payload: any = { ...formData } // eslint-disable-line @typescript-eslint/no-explicit-any

      switch (selectedService.key) {
        case "fetch-company":
          response = await businessApi.mcaFetchCompany({
            cin: payload.cin,
            consent: consentValue
          } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
          break
        default:
          // Fallback for din-details and others
          response = await businessApi.post(selectedService.apiEndpoint || "", payload)
      }
      return response
    })
  }

  return (
    <>
      <VerificationLayout
        title="Company Verification Services"
        description="Verify Company/LLP details via CIN/LLPIN"
        services={companyServices}
        selectedService={selectedService}
        onServiceChange={handleServiceChange as any}
      >
        {/* Display pricing if available */}
        {/* {companyPricing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Service Pricing</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-blue-600">One-time: ₹{companyPricing.oneTimePrice}</span>
              <span className="text-blue-600">Monthly: ₹{companyPricing.monthlyPrice}</span>
              <span className="text-blue-600">Yearly: ₹{companyPricing.yearlyPrice}</span>
            </div>
          </div>
        )} */}
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
