"use client"

import type React from "react"
import { useState } from "react"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { VerificationConfirmDialog } from "./VerificationConfirmDialog"
import { NoQuotaDialog } from "./NoQuotaDialog"
import { aadhaarServices } from "../../utils/aadhaarServices"
import { aadhaarApi } from "../../services/api/aadhaarApi"
import { usePricingContext } from "../../context/PricingContext"
import OtpInputWithTimer from "../forms/OtpInputWithTimer"

export const AadhaarSection: React.FC<{ productId?: string }> = ({ productId }) => {
  const [selectedService, setSelectedService] = useState(aadhaarServices[0])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showNoQuotaDialog, setShowNoQuotaDialog] = useState(false)
  const [pendingFormData, setPendingFormData] = useState<any>(null)
  
  // V2 OTP Flow State
  const [otpStep, setOtpStep] = useState<"enter-aadhaar" | "enter-otp">("enter-aadhaar")
  const [otpValue, setOtpValue] = useState("")
  const [requestId, setRequestId] = useState<number | null>(null)
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [consent, setConsent] = useState("Y")

  const { getVerificationPricingByType } = usePricingContext()
  const aadhaarPricing = getVerificationPricingByType("aadhaar")

  const handleServiceChange = (service: any) => {
    setSelectedService(service)
    setResult(null)
    setError(null)
    setOtpStep("enter-aadhaar")
    setOtpValue("")
    setRequestId(null)
    setAadhaarNumber("")
  }

  /* ------------------------------------------------------------------ */
  /*  Reset handler for "Verify Another" button                         */
  /* ------------------------------------------------------------------ */
  const handleReset = () => {
    setResult(null)
    setError(null)
    setOtpStep("enter-aadhaar")
    setOtpValue("")
    setRequestId(null)
    setAadhaarNumber("")
    setConsent("Y")
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

        case "id_number":
          return {
            ...field,
            type: "text" as const,
            placeholder: "Enter 12-digit Aadhaar number",
            pattern: "^[0-9]{12}$",
            maxLength: 12,
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
  /*  Handle V2 OTP Generation                                           */
  /* ------------------------------------------------------------------ */
  const handleGenerateOtp = async (formData: any) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const aadhaarNumber = formData.id_number?.trim()
      
      // Validate Aadhaar number
      if (!aadhaarNumber || !/^[0-9]{12}$/.test(aadhaarNumber)) {
        throw new Error("Please enter a valid 12-digit Aadhaar number")
      }

      if (!formData.consent || !['Y', 'N'].includes(formData.consent)) {
        throw new Error("Please provide consent")
      }

      // Generate OTP
      const response = await aadhaarApi.generateOtpV2({
        id_number: aadhaarNumber,
        consent: formData.consent,
      })

      if (response.data?.otp_sent) {
        setRequestId(response.request_id)
        setAadhaarNumber(aadhaarNumber)
        setConsent(formData.consent)
        setOtpStep("enter-otp")
        setResult({
          ...response,
          message: response.message || "OTP sent successfully to your registered mobile number",
        })
      } else {
        throw new Error(response.message || "Failed to send OTP")
      }
    } catch (err: any) {
      console.error("Aadhaar V2 Generate OTP Error:", err)
      const errorMessage = 
        err?.response?.data?.message || 
        err?.response?.data?.error ||
        err?.message || 
        "Failed to generate OTP. Please try again."
      
      // Handle rate limit specifically
      if (err?.response?.status === 429 || errorMessage.includes("45 seconds")) {
        setError("Please wait 45 seconds before requesting another OTP for the same Aadhaar number.")
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Handle V2 OTP Submission                                           */
  /* ------------------------------------------------------------------ */
  const handleSubmitOtp = async () => {
    if (!otpValue || otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    if (!requestId) {
      setError("Invalid request. Please start again.")
      setOtpStep("enter-aadhaar")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await aadhaarApi.submitOtpV2({
        request_id: requestId,
        otp: otpValue,
        consent: consent,
      })

      if (response.status === "success" && response.data) {
        setResult(response)
        setOtpStep("enter-aadhaar") // Reset to show result in VerificationForm
        setOtpValue("") // Clear OTP input
      } else {
        throw new Error(response.message || "OTP verification failed")
      }
    } catch (err: any) {
      console.error("Aadhaar V2 Submit OTP Error:", err)
      const errorMessage = 
        err?.response?.data?.message || 
        err?.response?.data?.error ||
        err?.message || 
        "Invalid OTP. Please try again."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Handle OTP Resend                                                  */
  /* ------------------------------------------------------------------ */
  const handleResendOtp = async () => {
    if (!aadhaarNumber) {
      setError("Aadhaar number not found. Please start again.")
      setOtpStep("enter-aadhaar")
      return
    }

    await handleGenerateOtp({
      id_number: aadhaarNumber,
      consent: consent,
    })
  }

  /* ------------------------------------------------------------------ */
  /*  Submit handler - Shows confirmation dialog first                  */
  /* ------------------------------------------------------------------ */
  const handleSubmit = async (formData: any) => {
    // Show confirmation dialog before submission
    setPendingFormData(formData)
    setShowConfirmDialog(true)
  }

  /* ------------------------------------------------------------------ */
  /*  Confirmed submit handler - Actual submission after confirmation   */
  /* ------------------------------------------------------------------ */
  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false)
    const formData = pendingFormData

    // Handle V2 OTP flow
    if (selectedService.key === "v2-verify") {
      if (otpStep === "enter-aadhaar") {
        try {
          await handleGenerateOtp(formData)
        } catch (err: any) {
          // Check for quota error
          const errorMessage = err?.response?.data?.message || err?.message || ""
          if (err?.response?.status === 403 || /quota|exhaust|exhausted|limit|token/i.test(errorMessage)) {
            setShowNoQuotaDialog(true)
            return
          }
          throw err
        }
      } else {
        await handleSubmitOtp()
      }
      return
    }

    // Legacy OCR V2 flow
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      let response

      switch (selectedService.key) {
        case "ocr-v2":
          const formDataObj = new FormData()
          if (formData.file_front) {
            formDataObj.append("file_front", formData.file_front)
          }
          if (formData.file_back) {
            formDataObj.append("file_back", formData.file_back)
          }
          formDataObj.append("consent", formData.consent || "Y")
          response = await aadhaarApi.ocrV2(formDataObj)
          break
        default:
          throw new Error("Unknown service")
      }

      setResult(response.data || response)
    } catch (err: any) {
      console.error("Aadhaar API Error:", err)
      const errorMessage = err?.response?.data?.message || err?.message || ""
      // Check for quota error and show NoQuotaDialog
      if (err?.response?.status === 403 || /quota|exhaust|exhausted|limit|token/i.test(errorMessage)) {
        setShowNoQuotaDialog(true)
      } else {
        setError(errorMessage || "An error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Render OTP Input Step                                              */
  /* ------------------------------------------------------------------ */
  const renderOtpStep = () => {
    if (selectedService.key !== "v2-verify" || otpStep !== "enter-otp") {
      return null
    }

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            OTP has been sent to your registered mobile number ending with{" "}
            <strong>{aadhaarNumber.slice(-4)}</strong>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter OTP
          </label>
          <OtpInputWithTimer
            value={otpValue}
            onChange={setOtpValue}
            onResend={handleResendOtp}
            error={error || undefined}
            numInputs={6}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setOtpStep("enter-aadhaar")
              setOtpValue("")
              setError(null)
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmitOtp}
            disabled={isLoading || otpValue.length !== 6}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </div>
    )
  }

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */
  // Show OTP step only when in OTP entry mode and not showing final result
  const showOtpStep = selectedService.key === "v2-verify" && 
                      otpStep === "enter-otp" && 
                      !(result?.data?.aadhaar_number) // Not showing final verified result yet

  // Show form with final result if verification completed
  const showFinalResult = selectedService.key === "v2-verify" && 
                          result?.data?.aadhaar_number

  return (
    <>
      <VerificationLayout
        title="Aadhaar Verification Services"
        description="Secure and instant Aadhaar card verification with government database integration"
        services={aadhaarServices}
        selectedService={selectedService}
        onServiceChange={handleServiceChange}
      >
        {showOtpStep ? (
          renderOtpStep()
        ) : (
          <VerificationForm
            fields={showFinalResult ? [] : getFormFields(selectedService)} // Hide form fields if showing final result
            onSubmit={handleSubmit}
            isLoading={isLoading}
            result={result}
            error={error}
            serviceKey={selectedService.key}
            serviceName={selectedService.name}
            serviceDescription={selectedService.description}
            productId={productId}
            onCustomReset={selectedService.key === "v2-verify" ? handleReset : undefined}
          />
        )}
      </VerificationLayout>

      <VerificationConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSubmit}
        isLoading={isLoading}
        serviceName={selectedService.name}
        formData={pendingFormData || {}}
        tokenCost={1}
      />

      <NoQuotaDialog
        isOpen={showNoQuotaDialog}
        onClose={() => setShowNoQuotaDialog(false)}
        serviceName={selectedService.name}
        verificationType="aadhaar"
      />
    </>
  )
}
