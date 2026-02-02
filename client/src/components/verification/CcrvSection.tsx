"use client";

import type React from "react";
import { VerificationLayout } from "./VerificationLayout";
import { VerificationForm } from "./VerificationForm";
import { ccrvServices } from "../../config/ccrvConfig";
import { VerificationConfirmDialog } from "./VerificationConfirmDialog";
import { useVerificationLogic } from "../../hooks/useVerificationLogic";
import { NoQuotaDialog } from "./NoQuotaDialog";

export const CcrvSection: React.FC<{ productId?: string }> = ({ productId }) => {
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
    // confirmSubmit,
    setError,
  } = useVerificationLogic({
    services: ccrvServices,
  })

  // Get CCRV pricing from backend
  // const { getVerificationPricingByType } = usePricingContext()
  // const ccrvPricing = getVerificationPricingByType("ccrv")

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
      // Add placeholders for specific fields
      const placeholders: Record<string, string> = {
        name: "Enter full name",
        father_name: "Enter father's name",
        house_number: "Enter house number",
        locality: "Enter locality",
        city: "Enter city",
        village: "Enter village",
        state: "Enter state",
        district: "Enter district",
        pincode: "Enter pincode",
        date_of_birth: "Enter DOB (YYYY-MM-DD)",
        gender: "Enter gender (MALE/FEMALE/OTHER)",
        mobile_number: "Enter mobile number",
        email: "Enter email address",
        callback_url: "Enter callback URL",
        transaction_id: "Enter transaction ID",
        address: "Enter complete address",
      }
      return {
        ...field,
        placeholder: placeholders[field.name] || field.placeholder,
      }
    })
  }



  const handleConfirmSubmit = async () => {
    // Temporary maintenance message (easy to remove later)
    closeConfirmDialog()
    setError("Government source temporarily unavailable. Please try again later.")
  }

  return (
    <>
      <VerificationLayout
        title="CCRV Verification"
        description="Verify CCRV details"
        services={ccrvServices}
        selectedService={selectedService}
        onServiceChange={handleServiceChange as any} // eslint-disable-line @typescript-eslint/no-explicit-any
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