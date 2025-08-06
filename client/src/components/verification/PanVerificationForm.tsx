import React, { useState, useEffect } from "react"
import { panApi } from "../../services/api/panApi"
import type { PanServiceMeta } from "../../utils/panServices"
import { DIGILOCKER_REDIRECT_URI } from "../../utils/panServices"

interface PanVerificationFormProps {
  service: PanServiceMeta
}

export const PanVerificationForm: React.FC<PanVerificationFormProps> = ({ service }) => {
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [autoSubmit, setAutoSubmit] = useState(false)

  // For Digilocker callback
  useEffect(() => {
    if (service.key !== "digilocker-pull" && service.key !== "digilocker-fetch-document") return
    const params = new URLSearchParams(window.location.search)
    const transactionId = params.get("transaction_id")
    const documentUri = params.get("document_uri")
    if (service.key === "digilocker-pull" && transactionId) {
      setForm((prev: any) => ({ ...prev, transactionId }))
      setAutoSubmit(true)
    }
    if (service.key === "digilocker-fetch-document" && transactionId && documentUri) {
      setForm((prev: any) => ({ ...prev, transaction_id: transactionId, document_uri: documentUri }))
      setAutoSubmit(true)
    }
  }, [service.key])

  useEffect(() => {
    if (autoSubmit && service.key === "digilocker-pull" && form.panno && form.PANFullName && form.transactionId) {
      handleDigilockerPull()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSubmit, form.panno, form.PANFullName, form.transactionId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement
      setForm((prev: any) => ({ ...prev, [name]: fileInput.files && fileInput.files[0] }))
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  const handleConsentChange = (value: boolean) => {
    setForm((prev: any) => ({ ...prev, consent: value }))
  }

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev: any) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleDigilockerPull = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const payload = {
        parameters: {
          panno: form.panno,
          PANFullName: form.PANFullName,
        },
        transactionId: form.transactionId,
      }
      const response = await panApi.digilockerPull(payload)
      setResult(response)
      setAutoSubmit(false)
    } catch (err: any) {
      setError(err?.message || "Verification failed")
      setAutoSubmit(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      let payload = { ...form }
      if (typeof payload.consent === "boolean") {
        payload.consent = payload.consent ? "Y" : "N"
      }
      service.formFields.forEach(field => {
        if (field.type === "json" && typeof payload[field.name] === "string") {
          try {
            payload[field.name] = JSON.parse(payload[field.name])
          } catch {
            throw new Error(`Invalid JSON for ${field.label}`)
          }
        }
      })
      if (service.key === "digilocker-pull") {
        // Step 1: Call digilocker-init
        const initPayload = {
          redirect_uri: DIGILOCKER_REDIRECT_URI,
          consent: payload.consent || "Y"
        }
        const initResp = await panApi.digilockerInit(initPayload)
        const url = initResp?.data?.authorization_url;
        const transactionId = initResp?.data?.transaction_id;
        if (url && transactionId) {
          sessionStorage.setItem("digilocker_pan_pull_panno", form.panno)
          sessionStorage.setItem("digilocker_pan_pull_name", form.PANFullName)
          sessionStorage.setItem("digilocker_transaction_id", transactionId)
          window.location.href = url
          return
        } else {
          throw new Error("Failed to get Digilocker authorization URL")
        }
      }
      if (service.key === "digilocker-fetch-document") {
        const initPayload = {
          redirect_uri: DIGILOCKER_REDIRECT_URI,
          consent: payload.consent || "Y"
        }
        const initResp = await panApi.digilockerInit(initPayload)
        if (initResp && initResp.redirect_url) {
          window.location.href = initResp.redirect_url
          return
        } else {
          throw new Error("Failed to get Digilocker authorization URL")
        }
      }
      let response
      switch (service.key) {
        case "father-name":
          response = await panApi.fetchFatherName(payload)
          break
        case "aadhaar-link":
          response = await panApi.checkAadhaarLink(payload)
          break
        default:
          response = await panApi.post(service.apiEndpoint, payload)
      }
      setResult(response)
    } catch (err: any) {
      setError(err?.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  // For digilocker-pull, after redirect, restore PAN number, name, and transactionId from sessionStorage
  useEffect(() => {
    if (service.key === "digilocker-pull" && (!form.transactionId || !form.panno || !form.PANFullName)) {
      const panno = sessionStorage.getItem("digilocker_pan_pull_panno")
      const PANFullName = sessionStorage.getItem("digilocker_pan_pull_name")
      const transactionId = sessionStorage.getItem("digilocker_transaction_id")
      if (panno && PANFullName && transactionId) {
        setForm((prev: any) => ({ ...prev, panno, PANFullName, transactionId }))
      }
    }
  }, [service.key])

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {service.formFields.map(field => (
        <div key={field.name}>
          <label className="block font-medium mb-1">{field.label}{field.required && " *"}</label>
          {field.name === "consent" ? (
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="consent"
                  value="true"
                  checked={form.consent === true}
                  onChange={() => handleConsentChange(true)}
                  required={field.required}
                />
                Yes
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="consent"
                  value="false"
                  checked={form.consent === false}
                  onChange={() => handleConsentChange(false)}
                  required={field.required}
                />
                No
              </label>
            </div>
          ) : field.type === "json" ? (
            <textarea name={field.name} required={field.required} onChange={handleJsonChange} className="w-full border rounded p-2" rows={4} />
          ) : (
            <input
              type="text"
              name={field.name}
              required={field.required}
              onChange={handleChange}
              className="w-full border rounded p-2"
              value={form[field.name] || ""}
              disabled={field.name === "panno" && service.key === "digilocker-pull" && !!form.panno && !!form.transactionId}
            />
          )}
        </div>
      ))}
      {/* For digilocker-pull, show transactionId if present */}
      {service.key === "digilocker-pull" && form.transactionId && (
        <div>
          <label className="block font-medium mb-1">Transaction ID</label>
          <input type="text" name="transactionId" value={form.transactionId} className="w-full border rounded p-2" disabled />
        </div>
      )}
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded" disabled={loading}>
        {loading ? "Verifying..." : "Verify"}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {result && (
        <pre className="bg-gray-100 rounded p-4 mt-4 overflow-x-auto text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </form>
  )
} 