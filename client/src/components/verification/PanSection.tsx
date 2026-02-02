"use client"

import type React from "react"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { panServices } from "../../config/panConfig"
import { identityApi } from "../../services/api/identityApi"
import { VerificationConfirmDialog } from "./VerificationConfirmDialog"
import { useVerificationLogic } from "../../hooks/useVerificationLogic"
import { NoQuotaDialog } from "./NoQuotaDialog";

interface PanFormData {
  pan?: string;
  father_name?: string;
  date_of_birth?: string;
  consent: string | boolean;
  [key: string]: unknown;
}

export const PanSection: React.FC<{ productId?: string }> = ({ productId }) => {
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
  } = useVerificationLogic<typeof panServices[number], PanFormData>({
    services: panServices,
  })

  // Get PAN pricing from backend
  // const { getVerificationPricingByType } = usePricingContext()
  // const panPricing = getVerificationPricingByType("pan")

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
    await confirmSubmit(async (formData: PanFormData) => {
      // 1️⃣  Build clean payload
      const payload: Record<string, unknown> = {}

      // 2️⃣  Copy fields
      for (const [k, v] of Object.entries(formData)) {
        if (typeof v === "boolean") {
          payload[k] = v ? "Y" : "N"
        } else if (typeof v === "string") {
          payload[k] = v.trim()
        } else {
          payload[k] = v
        }
      }

      // 3️⃣  Basic validations
      if (payload.consent !== "Y") {
        throw new Error("Consent is required.")
      }

      // 4️⃣  Route to correct API
      let response
      switch (selectedService.key) {
        case "father-name":
          response = await identityApi.fetchPanFatherName(payload as any)
          break
        default:
          response = await identityApi.post(selectedService.apiEndpoint || "", payload)
      }
      return response
    })
  }

  return (
    <>
      <VerificationLayout
        title="PAN Verification Services"
        description="Verify PAN details"
        services={panServices}
        selectedService={selectedService}
        onServiceChange={handleServiceChange as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      >
        {/* Display pricing if available */}
        {/* {panPricing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Service Pricing</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-blue-600">One-time: ₹{panPricing.oneTimePrice}</span>
              <span className="text-blue-600">Monthly: ₹{panPricing.monthlyPrice}</span>
              <span className="text-blue-600">Yearly: ₹{panPricing.yearlyPrice}</span>
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
