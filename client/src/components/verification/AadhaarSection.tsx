"use client"

import type React from "react"
import { useState } from "react"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { aadhaarServices } from "../../utils/aadhaarServices"
import { aadhaarApi } from "../../services/api/aadhaarApi"
import { panApi } from "../../services/api/panApi"
import { DIGILOCKER_EAADHAAR_REDIRECT_URI } from "../../services/api/constants"
import { usePricingContext } from "../../context/PricingContext"

export const AadhaarSection: React.FC<{ productId?: string }> = ({ productId }) => {
  const [selectedService, setSelectedService] = useState(aadhaarServices[0])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const { getVerificationPricingByType } = usePricingContext()
  const aadhaarPricing = getVerificationPricingByType("aadhaar")

  const handleServiceChange = (service: any) => {
    setSelectedService(service)
    setResult(null)
    setError(null)
  }

  /* ------------------------------------------------------------------ */
  /*  Build the final field list for VerificationForm                     */
  /* ------------------------------------------------------------------ */
  const getFormFields = (service: typeof aadhaarServices[number]) => {
    return service.formFields.map((field) => {
      switch (field.name) {
        case "consent":
          return {
            ...field,
            type: "radio" as const,
            options: [
              { label: "Yes", value: "Y" },
              { label: "No", value: "N" },
            ],
          }

        case "base64_data":
          return {
            ...field,
            type: "camera" as const,
            label: "Capture Aadhaar Image",
          }

        case "file_front":
          return {
            ...field,
            type: "file" as const,
            accept: "image/*",
            multiple: false,
          }

        case "file_back":
          return {
            ...field,
            type: "file" as const,
            accept: "image/*",
            multiple: false,
          }

        case "json":
          return {
            ...field,
            type: "json" as const,
            placeholder: "Enter JSON payload…",
          }

        default:
          return field
      }
    })
  }

  /* ------------------------------------------------------------------ */
  /*  Submit handler                                                     */
  /* ------------------------------------------------------------------ */
  // const handleSubmit = async (formData: any) => {
  //   setIsLoading(true)
  //   setError(null)
  //   setResult(null)

  //   try {
  //     let response

  //     if (selectedService.key === "fetch-eaadhaar" && !formData.transaction_id) {
  //       const initResp = await panApi.digilockerInit({
  //         redirect_uri: DIGILOCKER_EAADHAAR_REDIRECT_URI,
  //         consent: "Y",
  //       })
  //       const url = initResp?.data?.authorization_url
  //       if (url) {
  //         window.location.href = url
  //         return
  //       } else {
  //         throw new Error("Failed to get Digilocker authorization URL")
  //       }
  //     }

  //     switch (selectedService.key) {
  //       case "ocr-v1":
  //         response = await aadhaarApi.ocrV1(formData)
  //         break
  //       case "ocr-v2":
  //         response = await aadhaarApi.ocrV2(formData)
  //         break
  //       case "fetch-eaadhaar":
  //         response = await aadhaarApi.fetchEAadhaar(formData)
  //         break
  //       default:
  //         throw new Error("Unknown service")
  //     }

  //     setResult(response.data)
  //   } catch (err: any) {
  //     console.error("Aadhaar API Error:", err)
  //     setError(err.response?.data?.message || err.message || "An error occurred")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const handleSubmit = async (_formData: any) => {
    // Temporary maintenance message (easy to remove later)
    setError("Government source temporarily unavailable. Please try again later.")
    return
  }

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <VerificationLayout
      title="Aadhaar Verification Services"
      description="Secure and instant Aadhaar card verification with government database integration"
      services={aadhaarServices}
      selectedService={selectedService}
      onServiceChange={handleServiceChange}
    >
      <VerificationForm
        fields={getFormFields(selectedService)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        result={result}
        error={error}
        serviceKey={selectedService.key}
        serviceName={selectedService.name}
        serviceDescription={selectedService.description}
        productId={productId}
      />
    </VerificationLayout>
  )
}