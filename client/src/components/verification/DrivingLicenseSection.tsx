"use client"

import type React from "react"
import { useVerificationLogic } from "../../hooks/useVerificationLogic"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { VerificationConfirmDialog } from "./VerificationConfirmDialog"
import { NoQuotaDialog } from "./NoQuotaDialog"
import { drivingLicenseServices } from "../../config/drivingLicenseConfig"
import { identityApi } from "../../services/api/identityApi"

interface DlFormData {
  dl_number: string;
  dob: string;
  consent: string | boolean;
}

export const DrivingLicenseSection: React.FC<{ productId?: string }> = ({ productId }) => {
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
  } = useVerificationLogic<typeof drivingLicenseServices[number], DlFormData>({
    services: drivingLicenseServices,
  })

  // Get DL pricing from backend
  // const { getVerificationPricingByType } = usePricingContext()

  // Clear results when service changes - This logic is now inside useVerificationLogic
  // const handleServiceChange = (service: any) => {
  //   setSelectedService(service)
  //   setResult(null)
  //   setError(null)
  // }

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
      // Removed base64_data, file, and placeholder logic as per instruction
      return field
    })
  }

  // Replaced handleSubmit with initiateSubmit from the hook
  // const handleSubmit = async (formData: any) => {
  //   setPendingFormData(formData)
  //   setShowConfirmDialog(true)
  // }

  const handleConfirmSubmit = async () => {
    await confirmSubmit(async (formData: DlFormData) => {
      const consentValue = typeof formData.consent === 'boolean' ? (formData.consent ? 'Y' : 'N') : formData.consent;

      let response

      // Convert boolean consent to string - This logic is now handled by the hook or form
      // if (typeof formData.consent === "boolean") {
      //   formData.consent = formData.consent ? "Y" : "N"
      // }

      switch (selectedService.key) {
        case "fetch-details":
          response = await identityApi.fetchDlDetails({
            driving_license_number: formData.dl_number,
            date_of_birth: formData.dob,
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
        title="Driving License Verification Services"
        description="Verify Driving License details instantly" // Updated description
        services={drivingLicenseServices}
        selectedService={selectedService}
        onServiceChange={handleServiceChange as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      >
        {/* Display pricing if available */}
        {/* {dlPricing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Service Pricing</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-blue-600">One-time: ₹{dlPricing.oneTimePrice}</span>
              <span className="text-blue-600">Monthly: ₹{dlPricing.monthlyPrice}</span>
              <span className="text-blue-600">Yearly: ₹{dlPricing.yearlyPrice}</span>
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
        onClose={closeConfirmDialog} // Changed to closeConfirmDialog
        onConfirm={handleConfirmSubmit}
        isLoading={isLoading}
        serviceName={selectedService.name}
        formData={pendingFormData || {}}
        tokenCost={1}
      />

      <NoQuotaDialog
        isOpen={showNoQuotaDialog}
        onClose={closeNoQuotaDialog} // Changed to closeNoQuotaDialog
        serviceName={selectedService.name}
      />
    </>
  )
}
