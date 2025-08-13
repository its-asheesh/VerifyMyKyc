"use client"

import React, { useState } from "react"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { gstinApi } from "../../services/api/gstinApi"
import type { Service } from "../../types/verification"
import { CheckCircle, FileText, Mail, Phone, Building, CreditCard, RotateCcw } from "lucide-react"

const services: Service[] = [
  {
    key: 'gstin-lite',
    name: 'GSTIN Lite Verification',
    description: 'Verify basic GSTIN details including business name, status, and registration information'
  }
]

export const GstinLiteSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [selectedService] = useState<Service>(services[0])
  
  const formFields = [
    {
      name: "gstin",
      label: "GSTIN Number",
      type: "text" as const,
      required: true,
      placeholder: "Enter 15-digit GSTIN number",
      pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
      title: "Please enter a valid 15-digit GSTIN number"
    },
    {
      name: "include_filing_data",
      label: "Include Filing Data",
      type: "checkbox" as const,
      required: false
    },
    {
      name: "consent",
      label: "I consent to verify this information",
      type: "radio" as const,
      required: true,
      options: [
        { label: "Yes", value: "Y" },
        { label: "No", value: "N" }
      ]
    }
  ]

  const handleSubmit = async (formData: any) => {
    if (formData.consent !== "Y") {
      setResult({ error: "Consent is required to fetch GSTIN details" })
      return
    }

    setIsLoading(true)
    try {
      const response = await gstinApi.fetchLite({
        gstin: formData.gstin,
        include_filing_data: formData.include_filing_data || false,
        consent: formData.consent
      })
      
      // Format the response for display
      if (response?.data?.gstin_data) {
        const gstinData = response.data.gstin_data
        setResult({
          ...response,
          document_type: gstinData.document_type || 'GSTIN',
          document_id: gstinData.document_id,
          legal_name: gstinData.legal_name,
          trade_name: gstinData.trade_name,
          status: gstinData.status,
          pan: gstinData.pan,
          date_of_registration: gstinData.date_of_registration,
          principal_address: gstinData.principal_address?.address || 'Not available',
          center_jurisdiction: gstinData.center_jurisdiction,
          state_jurisdiction: gstinData.state_jurisdiction,
          constitution_of_business: gstinData.constitution_of_business,
          taxpayer_type: gstinData.taxpayer_type
        })
      } else {
        setResult(response)
      }
    } catch (err: any) {
      console.error('Error fetching GSTIN Lite details:', err)
      setResult({
        error: err.message || 'Failed to fetch GSTIN details. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Custom render function for GSTIN Lite results
  const renderGstinLiteResult = () => {
    if (!result) return null

    return (
      <div className="w-full space-y-6">
        {/* Service Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">GSTIN Lite Verification</h2>
              <p className="text-blue-100 mt-1">Basic GSTIN details and verification</p>
            </div>
          </div>
        </div>

        {/* Success Result */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6 w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h4 className="font-semibold text-green-800 text-lg">GSTIN Verified Successfully</h4>
            </div>
            <button
              onClick={() => setResult(null)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Verify Another
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 border border-green-200">
            <div className="space-y-6">
              {/* Business Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Legal Name */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 mb-1">Legal Name</p>
                  <p className="text-lg font-bold text-blue-900">{result.legal_name || 'Not available'}</p>
                </div>

                {/* Trade Name */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-800 mb-1">Trade Name</p>
                  <p className="text-lg font-bold text-purple-900">{result.trade_name || 'Not available'}</p>
                </div>
              </div>

              {/* Document Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* GSTIN */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-1">GSTIN</p>
                  <p className="font-mono font-bold text-gray-900">{result.document_id || 'Not available'}</p>
                </div>

                {/* PAN */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-1">PAN</p>
                  <p className="font-mono font-bold text-gray-900">{result.pan || 'Not available'}</p>
                </div>

                {/* Status */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    result.status?.toLowerCase() === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {result.status || 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-800">Additional Details</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Registration Date */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">Registration Date</p>
                    <p className="text-gray-900">{result.date_of_registration || 'Not available'}</p>
                  </div>

                  {/* Taxpayer Type */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">Taxpayer Type</p>
                    <p className="text-gray-900">{result.taxpayer_type || 'Not available'}</p>
                  </div>

                  {/* Constitution of Business */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">Business Type</p>
                    <p className="text-gray-900">{result.constitution_of_business || 'Not available'}</p>
                  </div>

                  {/* Jurisdiction */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">Jurisdiction</p>
                    <p className="text-gray-900">
                      {[result.center_jurisdiction, result.state_jurisdiction]
                        .filter(Boolean)
                        .join(' / ')}
                      {!result.center_jurisdiction && !result.state_jurisdiction && 'Not available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              {result.principal_address && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Principal Address</p>
                  <p className="text-gray-900 whitespace-pre-line">{result.principal_address}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <VerificationLayout
      title="GSTIN Lite Verification"
      description="Verify basic GSTIN details including business name, status, and registration information"
      services={services}
      selectedService={selectedService}
      onServiceChange={() => {}}
    >
      {result ? (
        renderGstinLiteResult()
      ) : (
        <VerificationForm
          fields={formFields}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          serviceKey="gstin-lite"
          serviceName="GSTIN Lite Verification"
          serviceDescription="Verify basic GSTIN details including business name, status, and registration information"
        />
      )}
    </VerificationLayout>
  )
}

export default GstinLiteSection
