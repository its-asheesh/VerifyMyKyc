import React, { useState } from "react"
import { drivingLicenseApi } from "../../services/api/drivingLicenseApi"
import type { DrivingLicenseServiceMeta } from "../../utils/drivingLicenseServices"

interface DrivingLicenseVerificationFormProps {
  service: DrivingLicenseServiceMeta
}

export const DrivingLicenseVerificationForm: React.FC<DrivingLicenseVerificationFormProps> = ({ service }) => {
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement
      setForm((prev: any) => ({ ...prev, [name]: fileInput.files && fileInput.files[0] }))
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  const handleConsentChange = (value: "Y" | "N") => {
    setForm((prev: any) => ({ ...prev, consent: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      let response
      if (service.key === "ocr") {
        const formData = new FormData()
        service.formFields.forEach(field => {
          if (form[field.name]) formData.append(field.name, form[field.name])
        })
        response = await drivingLicenseApi.ocr(formData)
      } else if (service.key === "fetch-details") {
        response = await drivingLicenseApi.fetchDetails(form)
      }
      setResult(response)
    } catch (err: any) {
      setError(err?.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

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
                  value="Y"
                  checked={form.consent === "Y"}
                  onChange={() => handleConsentChange("Y")}
                  required={field.required}
                />
                Yes
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="consent"
                  value="N"
                  checked={form.consent === "N"}
                  onChange={() => handleConsentChange("N")}
                  required={field.required}
                />
                No
              </label>
            </div>
          ) : field.type === "file" ? (
            <input type="file" name={field.name} required={field.required} onChange={handleChange} />
          ) : (
            <input type="text" name={field.name} required={field.required} onChange={handleChange} className="w-full border rounded p-2" />
          )}
        </div>
      ))}
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