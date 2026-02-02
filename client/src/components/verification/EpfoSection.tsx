"use client"

import type React from "react"
import { useVerificationLogic } from "../../hooks/useVerificationLogic"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { businessApi } from "../../services/api/businessApi"
import { VerificationConfirmDialog } from "./VerificationConfirmDialog"
import { NoQuotaDialog } from "./NoQuotaDialog"

type ServiceKey =
  | "fetch-uan"
  | "employment-by-uan"
  | "employment-latest"
  | "uan-by-pan"
  | "claim-status"
  | "kyc-status"

const services = [
  {
    key: "fetch-uan" as ServiceKey,
    name: "Fetch UAN",
    description: "Retrieve UANs linked to a mobile number and optional PAN",
    formFields: [
      { name: "mobile_number", label: "Mobile Number", type: "text", required: true, placeholder: "Enter 10-digit mobile number" },
      { name: "pan", label: "PAN (optional)", type: "text", required: false, placeholder: "Enter 10-character PAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
  {
    key: "uan-by-pan" as ServiceKey,
    name: "Fetch UAN by PAN",
    description: "Fetch UAN using PAN number",
    formFields: [
      { name: "pan_number", label: "PAN Number", type: "text", required: true, placeholder: "Enter 10-character PAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
  {
    key: "employment-by-uan" as ServiceKey,
    name: "Employment by UAN",
    description: "Fetch employment history using UAN",
    formFields: [
      { name: "uan_number", label: "UAN", type: "text", required: true, placeholder: "Enter UAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
  {
    key: "employment-latest" as ServiceKey,
    name: "Latest Employment by UAN",
    description: "Fetch latest employment record using UAN",
    formFields: [
      { name: "uan", label: "UAN", type: "text", required: true, placeholder: "Enter UAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
  {
    key: "claim-status" as ServiceKey,
    name: "Fetch Claim Status",
    description: "Fetch the status of an EPFO claim using UAN",
    formFields: [
      { name: "uan", label: "UAN", type: "text", required: true, placeholder: "Enter UAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
  {
    key: "kyc-status" as ServiceKey,
    name: "Fetch KYC Status",
    description: "Fetch the KYC status for a given UAN",
    formFields: [
      { name: "uan", label: "UAN", type: "text", required: true, placeholder: "Enter UAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
]

interface EpfoFormData {
  mobile_number?: string;
  pan_number?: string;
  uan_number?: string;
  uan?: string;
  consent: string | boolean;
}

export const EpfoSection: React.FC<{ productId?: string }> = ({ productId }) => {
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
  } = useVerificationLogic<typeof services[number], EpfoFormData>({
    services: services, // Use local services
  })

  // Get EPFO pricing from backend
  // const { getVerificationPricingByType } = usePricingContext()
  // const epfoPricing = getVerificationPricingByType("epfo")

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
    await confirmSubmit(async (formData: EpfoFormData) => {
      const consentValue = typeof formData.consent === 'boolean' ? (formData.consent ? 'Y' : 'N') : formData.consent;

      let response
      switch (selectedService.key) {
        case "fetch-uan":
          response = await businessApi.epfoFetchUan({
            mobile_number: formData.mobile_number || "",
            consent: consentValue,
          })
          break
        case "uan-by-pan":
          response = await businessApi.epfoUanByPan({
            pan_number: formData.pan_number || "",
            consent: consentValue,
          })
          break
        case "employment-by-uan":
          response = await businessApi.epfoEmploymentByUan({
            uan_number: formData.uan_number || "",
            consent: consentValue,
          })
          break
        case "employment-latest":
          response = await businessApi.epfoEmploymentLatest({
            uan: formData.uan || "",
            consent: consentValue,
          })
          break
        case "claim-status":
          response = await businessApi.epfoClaimStatus({
            uan: formData.uan || "",
            consent: consentValue,
          })
          break
        case "kyc-status":
          response = await businessApi.epfoKycStatus({
            uan: formData.uan || "",
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
        title="EPFO Verification Services"
        description="Verify EPFO details"
        services={services}
        selectedService={selectedService}
        onServiceChange={handleServiceChange as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      >
        {/* Display pricing if available */}
        {/* {epfoPricing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Service Pricing</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-blue-600">One-time: ₹{epfoPricing.oneTimePrice}</span>
              <span className="text-blue-600">Monthly: ₹{epfoPricing.monthlyPrice}</span>
              <span className="text-blue-600">Yearly: ₹{epfoPricing.yearlyPrice}</span>
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
