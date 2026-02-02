"use client"

import type React from "react"
import { useVerificationLogic } from "../../hooks/useVerificationLogic"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { gstinServices } from "../../config/gstinConfig"
import { businessApi } from "../../services/api/businessApi"
import { VerificationConfirmDialog } from "./VerificationConfirmDialog"
import { NoQuotaDialog } from "./NoQuotaDialog"

interface GstinFormData {
  gstin: string;
  consent: string | boolean;
}

export const GstinSection: React.FC<{ productId?: string }> = ({ productId }) => {
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
  } = useVerificationLogic<typeof gstinServices[number], GstinFormData>({
    services: gstinServices,
  })

  // Get GSTIN pricing from backend
  // const { getVerificationPricingByType } = usePricingContext()
  // const gstinPricing = getVerificationPricingByType("gstin")

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
    await confirmSubmit(async (formData: GstinFormData) => {
      const consentValue = typeof formData.consent === 'boolean' ? (formData.consent ? 'Y' : 'N') : formData.consent;

      let response
      switch (selectedService.key) {
        case "contact": // Changed from "gstin-contact" to "contact" to match existing key
          response = await businessApi.gstinContact({
            gstin: formData.gstin,
            consent: consentValue,
          })
          break
        case "lite": // Changed from "gstin-fetch-lite" to "lite" to match existing key
          response = await businessApi.gstinFetchLite({
            gstin: formData.gstin,
            consent: consentValue,
          })
          break
        default:
          throw new Error("Unknown service")
      }
      return response
    })
  }

  return (
    <>
      <VerificationLayout
        title="GSTIN Verification Services"
        description="Verify GSTIN details instantly"
        services={gstinServices}
        selectedService={selectedService}
        onServiceChange={handleServiceChange as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      >
        {/* Display pricing if available */}
        {/* {gstinPricing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Service Pricing</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-blue-600">One-time: ₹{gstinPricing.oneTimePrice}</span>
              <span className="text-blue-600">Monthly: ₹{gstinPricing.monthlyPrice}</span>
              <span className="text-blue-600">Yearly: ₹{gstinPricing.yearlyPrice}</span>
            </div>
          </div>
        )} */}
        <VerificationForm
          fields={getFormFields(selectedService)}
          onSubmit={async (data: any) => initiateSubmit(data)} // eslint-disable-line @typescript-eslint/no-explicit-any
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
