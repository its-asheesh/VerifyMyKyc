"use client"

import type React from "react"
import { useVerificationLogic } from "../../hooks/useVerificationLogic"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { VerificationConfirmDialog } from "./VerificationConfirmDialog"
import { voterServices } from "../../config/voterConfig"
import { identityApi } from "../../services/api/identityApi"
import { NoQuotaDialog } from "./NoQuotaDialog";

interface VoterFormData {
  voter_id: string;
  consent: string | boolean;
}

export const VoterSection: React.FC<{ productId?: string }> = ({ productId }) => {
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
  } = useVerificationLogic<typeof voterServices[number], VoterFormData>({
    services: voterServices,
  })

  // Get Voter pricing from backend
  // const { getVerificationPricingByType } = usePricingContext()
  // const voterPricing = getVerificationPricingByType("voterid")

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
    await confirmSubmit(async (formData: VoterFormData) => {
      const consentValue = typeof formData.consent === 'boolean' ? (formData.consent ? 'Y' : 'N') : formData.consent;

      let response
      switch (selectedService.key) {
        case "boson-fetch":
          response = await identityApi.voterBosonFetch({
            voter_id: formData.voter_id,
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
        title="Voter ID Verification Services"
        description="Verify Voter ID details instantly"
        services={voterServices}
        selectedService={selectedService}
        onServiceChange={handleServiceChange as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      >
        {/* Display pricing if available */}
        {/* {voterPricing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Service Pricing</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-blue-600">One-time: ₹{voterPricing.oneTimePrice}</span>
              <span className="text-blue-600">Monthly: ₹{voterPricing.monthlyPrice}</span>
              <span className="text-blue-600">Yearly: ₹{voterPricing.yearlyPrice}</span>
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
