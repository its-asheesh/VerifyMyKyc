"use client";

import type React from "react";
import { useVerificationLogic } from "../../hooks/useVerificationLogic";
import { VerificationLayout } from "./VerificationLayout";
import { VerificationForm } from "./VerificationForm";
import { VerificationConfirmDialog } from "./VerificationConfirmDialog";
import { NoQuotaDialog } from "./NoQuotaDialog";
import { passportServices } from "../../config/passportConfig";
import { identityApi } from "../../services/api/identityApi";
// import { usePricingContext } from "../../context/PricingContext";

interface PassportFormData {
  file_number: string;
  dob: string;
  consent: string | boolean;
}

export const PassportSection: React.FC<{ productId?: string }> = ({ productId }) => {
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
  } = useVerificationLogic<typeof passportServices[number], PassportFormData>({
    services: passportServices,
  })

  // Get Passport pricing from backend
  // const { getVerificationPricingByType } = usePricingContext()
  // const passportPricing = getVerificationPricingByType("passport")

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
      if (field.name === "file_front" || field.name === "file_back") {
        return {
          ...field,
          type: "file" as const,
          accept: "image/*",
        }
      }
      return field
    })
  }

  const handleConfirmSubmit = async () => {
    await confirmSubmit(async (formData: PassportFormData) => {
      const consentValue = typeof formData.consent === 'boolean' ? (formData.consent ? 'Y' : 'N') : formData.consent;

      let response
      switch (selectedService.key) {
        case "fetch":
          response = await identityApi.fetchPassportDetails({
            file_number: formData.file_number,
            date_of_birth: formData.dob,
            consent: consentValue as "Y" | "N",
          })
          break;
      }
      return response
    })
  }

  return (
    <>
      <VerificationLayout
        title="Passport Verification Services"
        description="Verify Passport details instantly"
        services={passportServices}
        selectedService={selectedService}
        onServiceChange={handleServiceChange as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      >
        {/* Display pricing if available */}
        {/* {passportPricing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Service Pricing</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-blue-600">One-time: ₹{passportPricing.oneTimePrice}</span>
              <span className="text-blue-600">Monthly: ₹{passportPricing.monthlyPrice}</span>
              <span className="text-blue-600">Yearly: ₹{passportPricing.yearlyPrice}</span>
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
};