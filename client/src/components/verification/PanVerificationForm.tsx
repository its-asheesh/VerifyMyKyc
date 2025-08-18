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
  RotateCcw,
  Printer,
} from "lucide-react"
import ShareActions from "./ShareActions"

interface FormField {
  name: string
  label: string
  type: "text" | "file" | "json" | "radio" | "camera"
  required: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
  accept?: string
  pattern?: string
  title?: string
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

interface DetailItem {
  label: string
  value: any
  icon: React.ReactNode
  category?: "primary" | "personal" | "location" | "document" | "other"
}

const PrintStyles = () => (
  <style>{`
    @media print {
      body * {
        visibility: hidden;
      }
      .print-area, .print-area * {
        visibility: visible;
      }
      .print-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      .no-print {
        display: none !important;
      }
      .print-header {
        border-bottom: 2px solid #000;
        margin-bottom: 20px;
        padding-bottom: 10px;
      }
    }
  `}</style>
)

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
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [showResult, setShowResult] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showMoreDetails, setShowMoreDetails] = useState(false)
  const shareTargetRef = useRef<HTMLDivElement | null>(null)
  const [capturedImages, setCapturedImages] = useState<Record<string, string>>({})
  const [showDetailView, setShowDetailView] = useState(false)

  // Clear form data and results when service changes
  useEffect(() => {
    setFormData({})
    setShowResult(false)
  }, [serviceKey])

  useEffect(() => {
    if (result) {
      setShowResult(true)
      setShowMoreDetails(false)
    }
  }, [result])

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (name: string, file: File | null) => {
    setFormData((prev: any) => ({ ...prev, [name]: file }))
  }

  const openCamera = async (fieldName: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraOpen(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Unable to access camera. Please check permissions.")
    }
  }

  const captureImage = (fieldName: string) => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedImages({ ...capturedImages, [fieldName]: imageData })
        setFormData({ ...formData, [fieldName]: imageData })
        closeCamera()
      }
    }
  }

  const closeCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setCameraOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const extractUnifiedDetails = (result: any): DetailItem[] => {
    if (!result?.data) return []

    const data = result.data
    const details: DetailItem[] = []

    // Helper function to get icon based on field type
    const getIconForField = (label: string): React.ReactNode => {
      const lowerLabel = label.toLowerCase()
      if (lowerLabel.includes("name")) return <User className="w-5 h-5" />
      if (lowerLabel.includes("id") || lowerLabel.includes("number")) return <CreditCard className="w-5 h-5" />
      if (lowerLabel.includes("status")) return <CheckCircle className="w-5 h-5" />
      if (lowerLabel.includes("address") || lowerLabel.includes("state") || lowerLabel.includes("district"))
        return <FileText className="w-5 h-5" />
      return <FileText className="w-5 h-5" />
    }

    // Helper function to categorize fields
    const getCategoryForField = (label: string): "primary" | "personal" | "location" | "document" | "other" => {
      const lowerLabel = label.toLowerCase()
      if (lowerLabel.includes("status") || lowerLabel.includes("epic") || lowerLabel.includes("document id"))
        return "primary"
      if (
        lowerLabel.includes("name") ||
        lowerLabel.includes("age") ||
        lowerLabel.includes("gender") ||
        lowerLabel.includes("dob")
      )
        return "personal"
      if (
        lowerLabel.includes("address") ||
        lowerLabel.includes("state") ||
        lowerLabel.includes("district") ||
        lowerLabel.includes("constituency")
      )
        return "location"
      if (lowerLabel.includes("document") || lowerLabel.includes("type") || lowerLabel.includes("serial"))
        return "document"
      return "other"
    }

    // Extract all possible fields dynamically
    const fieldMappings = [
      { key: "status", label: "Status" },
      { key: "doc_type", label: "Document Type" },
      { key: "doc_id", label: "Document ID" },
      { key: "name", label: "Name" },
      { key: "epic", label: "EPIC Number" },
      { key: "father_name", label: "Father's Name" },
      { key: "relation", label: "Relation" },
      { key: "gender", label: "Gender" },
      { key: "age", label: "Age" },
      { key: "dob", label: "Date of Birth" },
      { key: "state", label: "State" },
      { key: "district", label: "District" },
      { key: "assembly_name", label: "Assembly Constituency" },
      { key: "assembly_number", label: "Assembly Constituency No." },
      { key: "parliamentary_name", label: "Parliamentary Constituency" },
      { key: "parliamentary_number", label: "Parliamentary Constituency No." },
      { key: "part_name", label: "Part Name" },
      { key: "part_number", label: "Part Number" },
      { key: "polling_station", label: "Polling Station" },
      { key: "serial_number", label: "Serial Number" },
      { key: "address_line", label: "Address" },
      { key: "pincode", label: "Pincode" },
    ]

    // Check nested voter object
    const voter = data.voter || data

    fieldMappings.forEach(({ key, label }) => {
      let value = data[key] || voter[key]

      // Handle special cases
      if (key === "address_line" && value) {
        const pincode = data.pincode || voter.pincode
        if (pincode) value = `${value}, ${pincode}`
      }

      if (value && value !== "" && value !== null && value !== undefined) {
        details.push({
          label,
          value: String(value),
          icon: getIconForField(label),
          category: getCategoryForField(label),
        })
      }
    })

    return details
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopyDetails = async () => {
    const details = extractUnifiedDetails(result)
    const text = details.map((item) => `${item.label}: ${item.value}`).join("\n")

    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy details:", err)
    }
  }

  const handleReset = () => {
    setShowResult(false)
    setFormData({})
  }

  const renderFormattedResult = () => {
    if (!result || !showResult) return null

    // Company (MCA): fetch-company — show structured company details and directors
    if (serviceKey === "fetch-company") {
      const data = (result as any).data || result
      const companyData = data.company_data || data.company || {}
      const cd = companyData.company_details || companyData.details || companyData
      const directors =
        companyData.director_and_signatory_details || companyData.directors || companyData.signatories || []

      // Extract key fields with graceful fallbacks
      const status = data.status || data.code || cd.efiling_status || cd.active_compliance || data.message
      const name = cd.name || cd.company_name || data.name
      const companyId = cd.company_id || cd.cin || cd.llpin || cd.fcrn || data.document_number
      const email = cd.email
      const address = cd.address
      const roc = cd.roc_code || cd.roc
      const regNo = cd.registration_number
      const category = cd.category
      const subCategory = cd.sub_category
      const klass = cd.class
      const incorporationDate = cd.incorporation_date
      const lastAgmDate = cd.last_agm_date
      const balanceSheetDate = cd.balance_sheet_date
      const activeCompliance = cd.active_compliance
      const eFilingStatus = cd.efiling_status
      const listing = cd.listing
      const authorisedCapital = cd.authorised_capital
      const paidUpCapital = cd.paid_up_capital
      const totalObligation = cd.total_obligation
      const annualReturnFiledDate = cd.annual_return_filed_date
      const stateVal = cd.state
      const idType = cd.type
      const statusCode = data.code
      const statusMessage = data.message

      const detailRows: { label: string; value?: any }[] = [
        { label: "Status", value: status },
        { label: "Status Code", value: statusCode },
        { label: "Status Message", value: statusMessage },
        { label: "ID Type", value: idType },
        { label: "Company Name", value: name },
        { label: "Company ID", value: companyId },
        { label: "Email", value: email },
        { label: "Address", value: address },
        { label: "ROC Code", value: roc },
        { label: "Registration Number", value: regNo },
        { label: "Category", value: category },
        { label: "Sub Category", value: subCategory },
        { label: "Class", value: klass },
        { label: "Listing", value: listing },
        { label: "Incorporation Date", value: incorporationDate },
        { label: "Last AGM Date", value: lastAgmDate },
        { label: "Balance Sheet Date", value: balanceSheetDate },
        { label: "Active Compliance", value: activeCompliance },
        { label: "eFiling Status", value: eFilingStatus },
        { label: "Authorised Capital", value: authorisedCapital },
        { label: "Paid Up Capital", value: paidUpCapital },
        { label: "Total Obligation", value: totalObligation },
        { label: "Annual Return Filed Date", value: annualReturnFiledDate },
        { label: "State", value: stateVal },
      ].filter((r) => r.value !== undefined && r.value !== null && r.value !== "")

      return (
        <div className="w-full space-y-6">
          <PrintStyles />

          {/* Service Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white print-header">
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
            ref={shareTargetRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 w-full print-area"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h4 className="font-semibold text-green-800 text-lg">Verification Successful</h4>
                {typeof statusMessage === "string" && statusMessage && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                    {statusMessage}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <Printer className="w-4 h-4" />
                  Print Details
                </button>
                <ShareActions
                  targetRef={shareTargetRef}
                  serviceName={serviceName || (serviceKey ?? "Verification")}
                  fileName={`${(serviceName || "verification").toString().toLowerCase().replace(/\s+/g, "-")}-details`}
                  result={result}
                />
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Verify Another
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detailRows.map((row, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{row.label}</p>
                    <p className="text-base font-semibold text-gray-900 break-words">{row.value}</p>
                  </div>
                ))}
              </div>

              {/* Directors Section */}
              {Array.isArray(directors) && directors.length > 0 && (
                <div className="mt-8">
                  <h5 className="text-gray-800 font-semibold mb-4">Directors & Signatories</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {directors.map((director: any, i: number) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Name</p>
                            <p className="text-base font-semibold text-gray-900">
                              {director.name || director.full_name || director.director_name}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">DIN</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {director.din || director.id || director.number || "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Begin Date</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {director.begin_date || director.from || director.start_date || "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )
    }

    // Voter ID verification with detailed booth and location information
    if (serviceKey === "voter-id" || result?.data?.voter || result?.data?.epic) {
      const data = result.data || result
      const voter = data.voter || data

      // Primary voter details
      const primaryDetails = [
        { label: "Status", value: data.status },
        { label: "EPIC Number", value: voter.epic || data.epic },
        { label: "Name", value: voter.name || data.name },
        { label: "Father's Name", value: voter.father_name || data.father_name },
        { label: "Relation", value: voter.relation || data.relation },
        { label: "Gender", value: voter.gender || data.gender },
        { label: "Age", value: voter.age || data.age },
        { label: "Date of Birth", value: voter.dob || data.dob },
      ].filter((item) => item.value && item.value !== "")

      // Booth details
      const boothDetails = [
        { label: "Assembly Constituency", value: voter.assembly_name || data.assembly_name },
        { label: "Assembly Constituency No.", value: voter.assembly_number || data.assembly_number },
        { label: "Parliamentary Constituency", value: voter.parliamentary_name || data.parliamentary_name },
        { label: "Parliamentary Constituency No.", value: voter.parliamentary_number || data.parliamentary_number },
        { label: "Part Name", value: voter.part_name || data.part_name },
        { label: "Part Number", value: voter.part_number || data.part_number },
        { label: "Polling Station", value: voter.polling_station || data.polling_station },
        { label: "Serial Number", value: voter.serial_number || data.serial_number },
      ].filter((item) => item.value && item.value !== "")

      // Location details
      const locationDetails = [
        { label: "State", value: voter.state || data.state },
        { label: "District", value: voter.district || data.district },
        { label: "Address", value: voter.address_line || data.address_line },
        { label: "Pincode", value: voter.pincode || data.pincode },
      ].filter((item) => item.value && item.value !== "")

      return (
        <div className="w-full space-y-6">
          <PrintStyles />

          {/* Service Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white print-header">
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

          <motion.div
            ref={shareTargetRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 w-full print-area"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h4 className="font-semibold text-green-800 text-lg">Verification Successful</h4>
              </div>
              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <Printer className="w-4 h-4" />
                  Print Details
                </button>
                <ShareActions
                  targetRef={shareTargetRef}
                  serviceName={serviceName || (serviceKey ?? "Verification")}
                  fileName={`${(serviceName || "verification").toString().toLowerCase().replace(/\s+/g, "-")}-details`}
                  result={result}
                />
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Verify Another
                </button>
              </div>
            </div>

            {primaryDetails.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-green-200">
                  <h5 className="text-gray-800 font-semibold mb-4">Personal Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {primaryDetails.map((info, index) => (
                      <div key={index} className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{info.label}</p>
                        <p className="text-base font-semibold text-gray-900 break-words">{info.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {(boothDetails.length > 0 || locationDetails.length > 0) && (
                  <div className="flex justify-end no-print">
                    <button
                      type="button"
                      onClick={() => setShowMoreDetails((v) => !v)}
                      className="text-sm text-blue-700 hover:text-blue-800 font-medium"
                    >
                      {showMoreDetails ? "Hide extra details" : "Show more details"}
                    </button>
                  </div>
                )}

                {showMoreDetails && boothDetails.length > 0 && (
                  <div className="bg-white rounded-lg p-6 border border-green-200">
                    <h5 className="text-gray-800 font-semibold mb-4">Booth Details</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {boothDetails.map((info, index) => (
                        <div key={index} className="space-y-1">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{info.label}</p>
                          <p className="text-base font-semibold text-gray-900 break-words">{info.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {showMoreDetails && locationDetails.length > 0 && (
                  <div className="bg-white rounded-lg p-6 border border-green-200">
                    <h5 className="text-gray-800 font-semibold mb-4">Location Details</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {locationDetails.map((info, index) => (
                        <div key={index} className="space-y-1">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{info.label}</p>
                          <p className="text-base font-semibold text-gray-900 break-words">{info.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Verification Completed</h3>
                <p className="text-gray-600">The voter ID verification has been completed successfully.</p>
              </div>
            )}
          </motion.div>
        </div>
      )
    }

    // Default clean display for other services - extract key information only
    const data = result.data || result
    const extractedInfo = []

    // Try to extract common fields with enhanced styling
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

    return (
      <div className="w-full space-y-6">
        <PrintStyles />

        {/* Service Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white print-header">
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

        <motion.div
          ref={shareTargetRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6 w-full print-area"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h4 className="font-semibold text-green-800 text-lg">Verification Successful</h4>
            </div>
            <div className="flex items-center gap-2 no-print">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Printer className="w-4 h-4" />
                Print Details
              </button>
              <ShareActions
                targetRef={shareTargetRef}
                serviceName={serviceName || (serviceKey ?? "Verification")}
                fileName={`${(serviceName || "verification").toString().toLowerCase().replace(/\s+/g, "-")}-details`}
                result={result}
              />
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Verify Another
              </button>
            </div>
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
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm no-print"
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
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              placeholder={field.placeholder}
              required={field.required}
              pattern={field.pattern}
              title={field.title}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            />
          </div>
        )

      case "radio":
        return (
          <div key={field.name} className="space-y-3 w-full">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {field.options?.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={formData[field.name] === option.value}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    required={field.required}
                    className="mr-2 sm:mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm sm:text-base text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case "file":
        return (
          <div key={field.name} className="space-y-2 w-full">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                name={field.name}
                accept={field.accept}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setFormData({ ...formData, [field.name]: file })
                  }
                }}
                required={field.required}
                className="hidden"
                id={`file-${field.name}`}
              />
              <label htmlFor={`file-${field.name}`} className="cursor-pointer">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-600">
                  {formData[field.name] ? formData[field.name].name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  {field.accept?.split(",").join(", ") || "Any file type"}
                </p>
              </label>
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
            <div className="space-y-3">
              {capturedImages[field.name] && (
                <div className="relative">
                  <img
                    src={capturedImages[field.name] || "/placeholder.svg"}
                    alt="Captured document"
                    className="w-full max-w-sm rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = { ...capturedImages }
                      delete newImages[field.name]
                      setCapturedImages(newImages)
                      const newFormData = { ...formData }
                      delete newFormData[field.name]
                      setFormData(newFormData)
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => openCamera(field.name)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                {capturedImages[field.name] ? "Retake Photo" : "Take Photo"}
              </button>
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
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              placeholder={field.placeholder || "Enter JSON data"}
              required={field.required}
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base font-mono"
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
