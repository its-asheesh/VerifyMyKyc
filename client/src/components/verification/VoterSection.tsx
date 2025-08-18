"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { voterServices } from "../../utils/voterServices"
import { voterApi } from "../../services/api/voterApi"

export const VoterSection: React.FC<{ productId?: string }> = ({ productId }) => {
  const [selectedService, setSelectedService] = useState(voterServices[0])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const [captchaBase64, setCaptchaBase64] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState<string | null>(null)

  // Pricing hidden per request; no pricing fetch

  const handleServiceChange = (service: any) => {
    setSelectedService(service)
    setResult(null)
    setError(null)
  }

  useEffect(() => {
    // When selecting Meson service, initialize captcha/transaction
    const initMeson = async () => {
      try {
        const resp = await voterApi.mesonInit()
        const b64 = resp?.data?.captcha_base64
        const tx = resp?.data?.transaction_id || resp?.transaction_id
        if (b64) setCaptchaBase64(b64)
        if (tx) setTransactionId(tx)
      } catch (e: any) {
        console.error('Meson init failed', e)
      }
    }
    if (selectedService.key === 'meson-fetch') {
      initMeson()
    } else {
      setCaptchaBase64(null)
      setTransactionId(null)
    }
  }, [selectedService.key])

  const getFormFields = (service: any) => {
    return service.formFields.map((field: any) => {
      if (field.name === 'consent') {
        return {
          ...field,
          type: 'radio' as const,
          options: [
            { label: 'Yes', value: 'Y' },
            { label: 'No', value: 'N' },
          ],
        }
      }
      if (field.name === 'file_front' || field.name === 'file_back') {
        return {
          ...field,
          type: 'file' as const,
          accept: 'image/*',
        }
      }
      return field
    })
  }

  const handleSubmit = async (formData: any) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      let response: any

      // Normalize consent if boolean
      if (typeof formData.consent === 'boolean') {
        formData.consent = formData.consent ? 'Y' : 'N'
      }

      switch (selectedService.key) {
        case 'boson-fetch': {
          response = await voterApi.bosonFetch({
            voter_id: formData.voter_id,
            consent: formData.consent,
          })
          break
        }
        case 'meson-fetch': {
          const tx = transactionId || formData.transaction_id
          if (!tx) throw new Error('Missing transaction_id. Please re-open captcha flow.')
          response = await voterApi.mesonFetch({
            voter_id: formData.voter_id,
            captcha: formData.captcha,
            transaction_id: tx,
            consent: formData.consent,
          })
          break
        }
        case 'ocr': {
          const fd = new FormData()
          if (formData.file_front) fd.append('file_front', formData.file_front)
          if (formData.file_back) fd.append('file_back', formData.file_back)
          if (formData.consent) fd.append('consent', formData.consent)
          response = await voterApi.ocr(fd)
          break
        }
        default:
          throw new Error('Unknown service')
      }

      setResult(response)
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message || err?.response?.data?.error || err?.data?.message
      setError(backendMsg || err?.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VerificationLayout
      title="Voter ID Verification Services"
      description="Verify voter details with direct, captcha, or OCR flows"
      services={voterServices}
      selectedService={selectedService}
      onServiceChange={handleServiceChange}
    >
      {/* Pricing hidden as per requirement */}

      {selectedService.key === 'meson-fetch' && captchaBase64 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800 font-medium mb-2">Enter the captcha shown below. The transaction is pre-initialized.</p>
          <img src={`data:image/png;base64,${captchaBase64}`} alt="Captcha" className="h-20 w-auto" />
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
        productId={productId}
      />
    </VerificationLayout>
  )
}
