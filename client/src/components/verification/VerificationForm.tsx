"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  Camera,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  User,
  CreditCard,
  FileText,
  Link,
  RotateCcw,
  Building,
  Mail,
  Phone,
} from "lucide-react"

interface FormField {
  name: string
  label: string
  type: "text" | "file" | "json" | "radio" | "camera"
  required: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
  accept?: string
}

interface VerificationFormProps {
  fields: FormField[]
  onSubmit: (data: any) => Promise<any>
  isLoading?: boolean
  result?: any
  error?: string | null
  serviceKey?: string
  serviceName?: string
  serviceDescription?: string
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  fields,
  onSubmit,
  isLoading = false,
  result,
  error,
  serviceKey,
  serviceName,
  serviceDescription,
}) => {
  const [formData, setFormData] = useState<any>({})
  const [showResult, setShowResult] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Clear form data and results when service changes
  useEffect(() => {
    setFormData({})
    setShowResult(false)
  }, [serviceKey])

  useEffect(() => {
    if (result) {
      setShowResult(true)
      // Debug: Log the result structure
      console.log("Full result received:", result)
      console.log("Result data:", result.data)
      console.log("Result keys:", Object.keys(result))
      if (result.data) {
        console.log("Data keys:", Object.keys(result.data))
      }
    }
  }, [result])

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (name: string, file: File | null) => {
    setFormData((prev: any) => ({ ...prev, [name]: file }))
  }

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment",
        },
      })
      setStream(mediaStream)
      setCameraOpen(true)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Camera access denied:", err)
      alert("Camera access is required for document capture. Please allow camera permissions.")
    }
  }

  const captureImage = (fieldName: string) => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        const video = videoRef.current
        canvasRef.current.width = video.videoWidth
        canvasRef.current.height = video.videoHeight
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
        const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.8)
        const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, "")
        handleInputChange(fieldName, base64)
        closeCamera()
      }
    }
  }

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setCameraOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
    } catch (err) {
      console.error("Form submission error:", err)
    }
  }

  const handleReset = () => {
    setShowResult(false)
    setFormData({})
  }

  const renderFormattedResult = () => {
    if (!result || !showResult) return null

    // Format result based on service type
    if (serviceKey === "gstin-lite") {
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
                onClick={handleReset}
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

    // Format result based on service type
    if (serviceKey === "gstin-contact") {
      return (
        <div className="w-full space-y-6">
          {/* Service Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{serviceName}</h2>
                <p className="text-blue-100 mt-1">{serviceDescription}</p>
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
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Verify Another
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="space-y-6">
                {/* Document Type */}
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800 mb-1">Document Type</p>
                    <p className="text-lg font-bold text-blue-900">{result.document_type || 'GSTIN'}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-800 mb-1">Email</p>
                    {result.email ? (
                      <a 
                        href={`mailto:${result.email}`}
                        className="text-lg font-bold text-purple-900 hover:underline"
                      >
                        {result.email}
                      </a>
                    ) : (
                      <p className="text-lg font-medium text-gray-500">Not available</p>
                    )}
                  </div>
                </div>

                {/* Mobile */}
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 mb-1">Mobile</p>
                    {result.mobile ? (
                      <a 
                        href={`tel:${result.mobile}`}
                        className="text-lg font-bold text-green-900 hover:underline"
                      >
                        {result.mobile}
                      </a>
                    ) : (
                      <p className="text-lg font-medium text-gray-500">Not available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )
    }

    // Format result based on service type
    if (serviceKey === "father-name") {
      // Handle different possible response structures
      const data = result.data || result
      const panData = data.pan_data || data // Check for nested pan_data first

      // More comprehensive data extraction with better fallbacks
      let documentType = "PAN Card" // Default for father name service
      let documentId = ""
      let fatherName = ""

      // Try multiple possible field names for document ID
      if (panData.document_id) documentId = panData.document_id
      else if (panData.documentId) documentId = panData.documentId
      else if (panData.pan_number) documentId = panData.pan_number
      else if (panData.panNumber) documentId = panData.panNumber
      else if (panData.pan) documentId = panData.pan
      else if (panData.number) documentId = panData.number
      else if (panData.id) documentId = panData.id
      else if (formData.pan_number)
        documentId = formData.pan_number // Use form input as fallback
      else if (formData.panNumber) documentId = formData.panNumber
      else documentId = "Not Available"

      // Try multiple possible field names for father's name
      if (panData.father_name) fatherName = panData.father_name
      else if (panData.fatherName) fatherName = panData.fatherName
      else if (panData.fathers_name) fatherName = panData.fathers_name
      else if (panData.fathersName) fatherName = panData.fathersName
      else if (panData.father) fatherName = panData.father
      else if (panData.parent_name) fatherName = panData.parent_name
      else if (panData.parentName) fatherName = panData.parentName
      else fatherName = "Not Available"

      // Try to get document type if available
      if (panData.document_type) documentType = panData.document_type
      else if (panData.documentType) documentType = panData.documentType
      else if (panData.doc_type) documentType = panData.doc_type

      console.log("Extracted data:", { documentType, documentId, fatherName })

      return (
        <div className="w-full space-y-6">
          {/* Service Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{serviceName}</h2>
                <p className="text-blue-100 mt-1">{serviceDescription}</p>
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
                <h4 className="font-semibold text-green-800 text-lg">Verification Successful</h4>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Verify Another
              </button>
            </div>

            {/* Column Layout for Results */}
            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="space-y-6">
                {/* Document Type */}
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800 mb-1">Document Type</p>
                    <p className="text-lg font-bold text-blue-900">{documentType}</p>
                  </div>
                </div>

                {/* Document ID */}
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-800 mb-1">Document ID</p>
                    <p className="text-lg font-bold text-purple-900 font-mono">{documentId}</p>
                  </div>
                </div>

                {/* Father's Name */}
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 mb-1">Father's Name</p>
                    <p className="text-lg font-bold text-green-900">{fatherName}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )
    }

    if (serviceKey === "aadhaar-link") {
      const data = result.data || result
      const message = data.message || data.status || "Linked Successfully"

      return (
        <div className="w-full space-y-6">
          {/* Service Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Link className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{serviceName}</h2>
                <p className="text-blue-100 mt-1">{serviceDescription}</p>
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
                <h4 className="font-semibold text-green-800 text-lg">Link Status Verified</h4>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Verify Another
              </button>
            </div>

            <div className="bg-white rounded-lg p-8 border border-green-200">
              <div className="flex items-center justify-center gap-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Link className="w-10 h-10 text-green-600" />
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-800 mb-2">{message}</p>
                  <p className="text-gray-600 text-lg">PAN and Aadhaar are successfully linked</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )
    }

    if (serviceKey === "cin-by-pan") {
      const data = result.data || result
      const cinDetails = data.cin_details || []
      const cinList = data.cin_list || []

      return (
        <div className="w-full space-y-6">
          {/* Service Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{serviceName}</h2>
                <p className="text-blue-100 mt-1">{serviceDescription}</p>
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
                <h4 className="font-semibold text-green-800 text-lg">CIN Details Retrieved</h4>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Verify Another
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="space-y-6">
                {/* PAN Number */}
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800 mb-1">PAN Number</p>
                    <p className="text-lg font-bold text-blue-900 font-mono">{formData.pan_number}</p>
                  </div>
                </div>

                {/* CIN List */}
                {cinList.length > 0 && (
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-800 mb-1">CIN Numbers</p>
                      <div className="space-y-1">
                        {cinList.map((cin: string, index: number) => (
                          <p key={index} className="text-lg font-bold text-purple-900 font-mono">{cin}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Company Details */}
                {cinDetails.length > 0 && (
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-800">Company Details</h5>
                    {cinDetails.map((company: any, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-800 mb-1">Company Name</p>
                          <p className="text-lg font-bold text-green-900">{company.entity_name}</p>
                          {company.cin && (
                            <p className="text-sm text-green-700 font-mono mt-1">CIN: {company.cin}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No CIN Found */}
                {cinDetails.length === 0 && cinList.length === 0 && (
                  <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800 mb-1">No CIN Found</p>
                      <p className="text-lg font-bold text-yellow-900">No CIN is associated with this PAN number</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )
    }

    if (serviceKey === "din-by-pan") {
      const data = result.data || result
      const dinDetails = data.din_details || null
      const message = data.message || "No DIN found"

      return (
        <div className="w-full space-y-6">
          {/* Service Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{serviceName}</h2>
                <p className="text-blue-100 mt-1">{serviceDescription}</p>
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
                <h4 className="font-semibold text-green-800 text-lg">DIN Details Retrieved</h4>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Verify Another
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="space-y-6">
                {/* PAN Number */}
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800 mb-1">PAN Number</p>
                    <p className="text-lg font-bold text-blue-900 font-mono">{formData.pan_number}</p>
                  </div>
                </div>

                {/* Status Message */}
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-800 mb-1">Status</p>
                    <p className="text-lg font-bold text-purple-900">{message}</p>
                  </div>
                </div>

                {/* DIN Details */}
                {dinDetails ? (
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-800">Director Details</h5>
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800 mb-1">Director Name</p>
                        <p className="text-lg font-bold text-green-900">{dinDetails.name}</p>
                        {dinDetails.din && (
                          <p className="text-sm text-green-700 font-mono mt-1">DIN: {dinDetails.din}</p>
                        )}
                        {dinDetails.pan && (
                          <p className="text-sm text-green-700 font-mono mt-1">PAN: {dinDetails.pan}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800 mb-1">No DIN Found</p>
                      <p className="text-lg font-bold text-yellow-900">No DIN is associated with this PAN number</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )
    }
    if (serviceKey === "gstin-by-pan") {
      const data = result.data || result
      const results = data.results || []
      const message = data.message || "No GSTIN found"
    
      return (
        <div className="w-full space-y-6">
          {/* Service Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{serviceName}</h2>
                <p className="text-blue-100 mt-1">{serviceDescription}</p>
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
                <h4 className="font-semibold text-green-800 text-lg">GSTIN Details Retrieved</h4>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Verify Another
              </button>
            </div>
    
            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="space-y-6">
                {/* PAN Number */}
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800 mb-1">PAN Number</p>
                    <p className="text-lg font-bold text-blue-900 font-mono">{formData.pan_number}</p>
                  </div>
                </div>
    
                {/* Status Message */}
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-800 mb-1">Status</p>
                    <p className="text-lg font-bold text-purple-900">{message}</p>
                  </div>
                </div>
    
                {/* GSTIN Results List */}
                {results.length > 0 ? (
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-800">GSTIN Records</h5>
                    {results.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-1 p-4 bg-green-50 rounded-lg border border-green-200"
                      >
                        <p className="text-sm text-green-700 font-mono">
                          <strong>Document ID:</strong> {item.document_id}
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>Status:</strong> {item.status}
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>State:</strong> {item.state} ({item.state_code})
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800 mb-1">No GSTIN Found</p>
                      <p className="text-lg font-bold text-yellow-900">No GSTIN is associated with this PAN number</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )
    }
    

    // Default clean display for other services - extract key information only
    const data = result.data || result
    const extractedInfo = []

    // Try to extract common fields
    if (data.name || data.full_name || data.fullName) {
      extractedInfo.push({
        label: "Name",
        value: data.name || data.full_name || data.fullName,
        icon: <User className="w-6 h-6 text-blue-600" />,
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-800",
        valueColor: "text-blue-900",
      })
    }

    if (data.document_number || data.documentNumber || data.id || data.number) {
      extractedInfo.push({
        label: "Document Number",
        value: data.document_number || data.documentNumber || data.id || data.number,
        icon: <CreditCard className="w-6 h-6 text-purple-600" />,
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-800",
        valueColor: "text-purple-900",
      })
    }

    if (data.status || data.verification_status) {
      extractedInfo.push({
        label: "Status",
        value: data.status || data.verification_status,
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        valueColor: "text-green-900",
      })
    }

    if (data.date_of_birth || data.dob || data.dateOfBirth) {
      extractedInfo.push({
        label: "Date of Birth",
        value: data.date_of_birth || data.dob || data.dateOfBirth,
        icon: <FileText className="w-6 h-6 text-orange-600" />,
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-800",
        valueColor: "text-orange-900",
      })
    }

    return (
      <div className="w-full space-y-6">
        {/* Service Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{serviceName}</h2>
              <p className="text-blue-100 mt-1">{serviceDescription}</p>
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
              <h4 className="font-semibold text-green-800 text-lg">Verification Successful</h4>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Verify Another
            </button>
          </div>

          {extractedInfo.length > 0 ? (
            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="space-y-6">
                {extractedInfo.map((info, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 ${info.bgColor} rounded-lg border ${info.borderColor}`}
                  >
                    <div
                      className={`w-12 h-12 ${info.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${info.textColor} mb-1`}>{info.label}</p>
                      <p className={`text-lg font-bold ${info.valueColor}`}>{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Verification Completed</h3>
                <p className="text-gray-600">The verification process has been completed successfully.</p>
              </div>
            </div>
          )}

          {result.data?.eaadhaar_link && (
            <div className="mt-4">
              <a
                href={result.data.eaadhaar_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download Document
              </a>
            </div>
          )}
        </motion.div>
      </div>
    )
  }

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.name} className="space-y-2 w-full">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            />
          </div>
        )

      case "file":
        return (
          <div key={field.name} className="space-y-2 w-full">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-blue-400 transition-colors w-full">
              <input
                ref={fileInputRef}
                type="file"
                accept={field.accept || "image/*"}
                onChange={(e) => handleFileChange(field.name, e.target.files?.[0] || null)}
                className="hidden"
              />
              {formData[field.name] ? (
                <div className="text-center">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">{formData[field.name].name}</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm"
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                  >
                    Choose File
                  </button>
                </div>
              )}
            </div>
          </div>
        )

      case "camera":
        return (
          <div key={field.name} className="space-y-2 w-full">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="border border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 w-full">
              {formData[field.name] ? (
                <div className="text-center">
                  <div className="relative inline-block mb-3">
                    <img
                      src={`data:image/jpeg;base64,${formData[field.name]}`}
                      alt="Captured"
                      className="w-32 h-24 sm:w-40 sm:h-32 object-cover rounded-lg border-2 border-green-200"
                    />
                    <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-green-600 font-medium">Image captured successfully!</p>
                    <button
                      type="button"
                      onClick={openCamera}
                      className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                    >
                      Retake Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">Capture document image</p>
                  <button
                    type="button"
                    onClick={openCamera}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
                  >
                    Open Camera
                  </button>
                </div>
              )}
            </div>
          </div>
        )

      case "radio":
        return (
          <div key={field.name} className="space-y-3 w-full">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-4 sm:gap-6">
              {field.options?.map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={formData[field.name] === option.value}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required={field.required}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm sm:text-base text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case "json":
        return (
          <div key={field.name} className="space-y-2 w-full">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              name={field.name}
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder || "Enter JSON data..."}
              required={field.required}
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-xs sm:text-sm"
            />
          </div>
        )

      default:
        return null
    }
  }

  // If we have a successful result, show only the formatted result
  if (result && showResult) {
    return (
      <div className="w-full">
        {/* Camera Modal */}
        <AnimatePresence>
          {cameraOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base sm:text-lg font-semibold">Capture Document</h3>
                  <button onClick={closeCamera} className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <div className="text-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full max-w-sm rounded-lg mb-4 bg-gray-100" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-gray-600">Position the document within the frame</p>
                    <button
                      onClick={() => {
                        const cameraField = fields.find((f) => f.type === "camera")
                        if (cameraField) captureImage(cameraField.name)
                      }}
                      className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                      Capture Image
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {renderFormattedResult()}
      </div>
    )
  }

  // Show form if no result or error
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Service Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{serviceName}</h2>
            <p className="text-blue-100 mt-1">{serviceDescription}</p>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {cameraOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-semibold">Capture Document</h3>
                <button onClick={closeCamera} className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <div className="text-center">
                <video ref={videoRef} autoPlay playsInline className="w-full max-w-sm rounded-lg mb-4 bg-gray-100" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-gray-600">Position the document within the frame</p>
                  <button
                    onClick={() => {
                      const cameraField = fields.find((f) => f.type === "camera")
                      if (cameraField) captureImage(cameraField.name)
                    }}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                    Capture Image
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 w-full">
        {fields.map(renderField)}

        {/* Submit Button */}
        <div className="pt-4 w-full">
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Verify Document
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-3 w-full"
          >
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-red-800 text-sm sm:text-base">Verification Failed</h4>
              <p className="text-red-600 text-xs sm:text-sm mt-1 break-words">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
