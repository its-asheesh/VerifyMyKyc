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
  
  // Get Aadhaar pricing from backend
  const { getVerificationPricingByType } = usePricingContext()
  const aadhaarPricing = getVerificationPricingByType("aadhaar")

  // Clear results when service changes
  const handleServiceChange = (service: any) => {
    setSelectedService(service)
    setResult(null)
    setError(null)
  }

  const getFormFields = (service: any) => {
    const baseFields = service.formFields.map((field: any) => {
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
      if (field.name === "base64_data") {
        return {
          ...field,
          type: "camera" as const,
          label: "Capture Aadhaar Image",
        }
      }
      if (field.name === "file_front") {
        return {
          ...field,
          type: "file" as const,
          accept: "image/*",
          label: "Aadhaar Front Image",
        }
      }
      if (field.name === "file_back") {
        return {
          ...field,
          type: "file" as const,
          accept: "image/*",
          label: "Aadhaar Back Image",
        }
      }
      if (field.type === "json") {
        return {
          ...field,
          placeholder: "Enter JSON payload...",
        }
      }
      return field
    })

    return baseFields
  }

  const handleSubmit = async (formData: any) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      let response

      if (selectedService.key === "fetch-eaadhaar" && !formData.transaction_id) {
        // Redirect to Digilocker for consent
        const initResp = await panApi.digilockerInit({
          redirect_uri: DIGILOCKER_EAADHAAR_REDIRECT_URI,
          consent: "Y",
        })
        const url = initResp?.data?.authorization_url
        if (url) {
          window.location.href = url
          return
        } else {
          throw new Error("Failed to get Digilocker authorization URL")
        }
      }

      switch (selectedService.key) {
        case "ocr-v1":
          response = await aadhaarApi.ocrV1(formData)
          break
        case "ocr-v2":
          response = await aadhaarApi.ocrV2(formData)
          break
        case "fetch-eaadhaar":
          response = await aadhaarApi.fetchEAadhaar(formData)
          break
        default:
          throw new Error("Unknown service")
      }

      setResult(response.data)
    } catch (err: any) {
      console.error("Aadhaar API Error:", err)
      setError(err.response?.data?.message || err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VerificationLayout
      title="Aadhaar Verification Services"
      description="Secure and instant Aadhaar card verification with government database integration"
      services={aadhaarServices}
      selectedService={selectedService}
      onServiceChange={handleServiceChange}
    >
      {/* Display pricing if available */}
      {/* {aadhaarPricing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-800 mb-4 text-lg">Aadhaar Verification Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">₹{aadhaarPricing.oneTimePrice}</div>
                <div className="text-sm text-gray-600">One-time</div>
                <div className="text-xs text-gray-500 mt-1">Perfect for single verification</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">₹{aadhaarPricing.monthlyPrice}</div>
                <div className="text-sm text-gray-600">Monthly</div>
                <div className="text-xs text-gray-500 mt-1">For regular usage</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">₹{aadhaarPricing.yearlyPrice}</div>
                <div className="text-sm text-gray-600">Yearly</div>
                <div className="text-xs text-gray-500 mt-1">Best value for businesses</div>
              </div>
            </div>
          </div>
          {aadhaarPricing.features && aadhaarPricing.features.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-blue-800 mb-2">Includes:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {aadhaarPricing.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-blue-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )} */}

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
