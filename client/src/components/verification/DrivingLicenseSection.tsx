"use client"

import type React from "react"
import { useState } from "react"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { drivingLicenseServices } from "../../utils/drivingLicenseServices"
import { drivingLicenseApi } from "../../services/api/drivingLicenseApi"
import { usePricingContext } from "../../context/PricingContext"

export const DrivingLicenseSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState(drivingLicenseServices[0])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Get DL pricing from backend
  const { getVerificationPricingByType } = usePricingContext()
  const dlPricing = getVerificationPricingByType("drivinglicense")

  // Clear results when service changes
  const handleServiceChange = (service: any) => {
    setSelectedService(service)
    setResult(null)
    setError(null)
  }

  const getFormFields = (service: any) => {
    return service.formFields.map((field: any) => {
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
          label: "Capture Driving License Image",
        }
      }
      if (field.name === "file") {
        return {
          ...field,
          type: "file" as const,
          accept: "image/*",
          label: "Driving License Image",
        }
      }
      return {
        ...field,
        placeholder:
          field.name === "dl_number"
            ? "Enter driving license number"
            : field.name === "dob"
              ? "Enter date of birth (DD/MM/YYYY)"
              : undefined,
      }
    })
  }

  const handleSubmit = async (formData: any) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      let response

      // Convert boolean consent to string
      if (typeof formData.consent === "boolean") {
        formData.consent = formData.consent ? "Y" : "N"
      }

      switch (selectedService.key) {
        case "fetch-details":
          response = await drivingLicenseApi.fetchDetails(formData)
          break
        case "ocr":
          if (formData.file) {
            const formDataObj = new FormData()
            Object.keys(formData).forEach((key) => {
              if (formData[key]) formDataObj.append(key, formData[key])
            })
            response = await drivingLicenseApi.ocr(formDataObj)
          } else {
            response = await drivingLicenseApi.ocr(formData)
          }
          break
        default:
          throw new Error("Unknown service")
      }

      setResult(response)
    } catch (err: any) {
      setError(err?.message || "Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VerificationLayout
      title="Driving License Verification Services"
      description="Comprehensive driving license verification and OCR services"
      services={drivingLicenseServices}
      selectedService={selectedService}
      onServiceChange={handleServiceChange}
    >
      {/* Display pricing if available */}
      {dlPricing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Service Pricing</h3>
          <div className="flex gap-4 text-sm">
            <span className="text-blue-600">One-time: ₹{dlPricing.oneTimePrice}</span>
            <span className="text-blue-600">Monthly: ₹{dlPricing.monthlyPrice}</span>
            <span className="text-blue-600">Yearly: ₹{dlPricing.yearlyPrice}</span>
          </div>
        </div>
      )}
      <VerificationForm
        fields={getFormFields(selectedService)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        result={result}
        error={error}
        serviceKey={selectedService.key}
        serviceName={selectedService.name}
        serviceDescription={selectedService.description}
      />
    </VerificationLayout>
  )
}
