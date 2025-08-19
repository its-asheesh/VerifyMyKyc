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
} from "lucide-react"
import ShareActions from "./ShareActions"
import { ProductReviews } from "../reviews/ProductReviews"

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
  productId?: string
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
  productId,
}) => {
  const [formData, setFormData] = useState<any>({})
  const [showResult, setShowResult] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showMoreDetails, setShowMoreDetails] = useState(false)
  const shareTargetRef = useRef<HTMLDivElement | null>(null)

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
            ref={shareTargetRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 w-full"
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
              <div className="flex items-center gap-2">
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
                  <div key={idx} className="p-4 rounded-xl border bg-white border-gray-200">
                    <div className="text-sm text-gray-500">{row.label}</div>
                    <div className="mt-1 font-medium text-gray-900 break-words">{String(row.value)}</div>
                  </div>
                ))}
              </div>

              {Array.isArray(directors) && directors.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h4 className="text-lg font-semibold text-gray-900">Directors & Signatories</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {directors.map((d: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl border bg-white border-gray-200">
                        <div className="text-sm text-gray-500">Name</div>
                        <div className="font-medium text-gray-900">{d.name || d.full_name || d.director_name}</div>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <div className="text-sm text-gray-500">DIN</div>
                            <div className="text-gray-900">{d.din || d.id || d.number || "-"}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Begin Date</div>
                            <div className="text-gray-900">{d.begin_date || d.from || d.start_date || "-"}</div>
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

    // Bank Account Verification: show all fields from bank_account_data
    if (
      serviceKey === "account-verify" ||
      (result && (((result as any).data && (result as any).data.bank_account_data) || (result as any).bank_account_data))
    ) {
      const payload: any = (result as any).data || result
      const data: any = payload // transformed result already sets result.data = inner
      const bank: any = data.bank_account_data || data
      const status = data.message || data.status || data.code || (result as any).message
      const requestId = data.request_id || payload.request_id
      const transactionId = data.transaction_id || payload.transaction_id
      const referenceId = bank.reference_id || data.reference_id || payload.reference_id

      const name = bank.name
      const bankName = bank.bank_name || bank.bankName
      const branch = bank.branch
      const city = bank.city
      const ifsc = bank.ifsc
      const micr = bank.micr
      const utr = bank.utr
      const accountNumber = bank.account_number

      const details: { label: string; value?: any }[] = []
      if (name) details.push({ label: "Account Holder", value: name })
      if (bankName) details.push({ label: "Bank Name", value: bankName })
      if (branch) details.push({ label: "Branch", value: branch })
      if (city) details.push({ label: "City", value: city })
      if (ifsc) details.push({ label: "IFSC", value: ifsc })
      if (micr) details.push({ label: "MICR", value: micr })
      if (utr) details.push({ label: "UTR", value: utr })
      if (accountNumber) details.push({ label: "Account Number", value: accountNumber })
      if (referenceId) details.push({ label: "Reference ID", value: referenceId })

      // Build a flat list of all key/value pairs for full data view
      const allEntries = Object.entries(bank || {}) as [string, any][]

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
            ref={shareTargetRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h4 className="font-semibold text-green-800 text-lg">Verification Successful</h4>
                {typeof status === "string" && status && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                    {status}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
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

            <div className="bg-white rounded-lg p-6 border border-green-200 space-y-6">
              {(requestId || transactionId || referenceId) && (
                <div className="mb-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {requestId && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Request ID</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 break-words font-mono">{requestId}</p>
                    </div>
                  )}
                  {transactionId && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Transaction ID</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 break-words font-mono">{transactionId}</p>
                    </div>
                  )}
                  {referenceId && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Reference ID</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 break-words font-mono">{referenceId}</p>
                    </div>
                  )}
                </div>
              )}

{allEntries.length > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {allEntries.map(([k, v]) => (
      <div key={k} className="p-4 rounded-xl border bg-white border-gray-200">
        <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{k}</div>
        <div className="mt-1 font-medium text-gray-900 break-words">
          {typeof v === "object" ? JSON.stringify(v) : String(v)}
        </div>
      </div>
    ))}
  </div>
)}

            </div>
          </motion.div>
        </div>
      )
    }

    // Driving License services: prefer unmasked fields and handle both fetch-details and OCR
    // Detect via serviceName including "driving license" or presence of DL-specific fields
    if (
      (serviceName && serviceName.toLowerCase().includes("driving license")) ||
      (result && (result.license_details || result.driving_license_data || (result.data && (result.data.license_details || result.data.driving_license_data))))
    ) {
      const data = (result as any).data || result
      const dl = data.license_details || data.driving_license_data || data.dl_data || data.ocr_data || data // 

      // Extract tolerant fields, preferring unmasked variants
      const status = data.status || data.verification_status || data.message || data.code
      const name =
        dl.full_name_unmasked || dl.name_unmasked || dl.full_name || dl.name || dl.holder_name
      const dlNumber =
        dl.dl_number || dl.license_number || dl.licence_number || formData?.driving_license_number
      const relation =
        dl.father_name_unmasked || dl.father_name || dl.dependent_name || dl.spouse_name || dl.guardian_name // 
      const dob = dl.date_of_birth || dl.dob
      const gender = dl.gender || dl.sex
      const address = dl.address_full || dl.address || dl.present_address || dl.permanent_address
      const issueDate =
        dl.issue_date || dl.issued_on || dl.date_of_issue || dl.validity?.non_transport?.issue_date // 
      const expiryDate =
        dl.expiry_date || dl.valid_till || dl.valid_upto || dl.validity?.non_transport?.expiry_date // 
      const stateVal = dl.state || dl.rto_state || dl.rto_details?.state // 
      const rto = dl.rto || dl.rto_office || dl.issuing_authority || dl.rto_details?.authority // 
 

  const details: { label: string; value?: any; icon: React.ReactNode; bgColor: string; borderColor: string; textColor: string; valueColor: string }[] = []
  if (status) {
    details.push({
      label: "Status",
      value: typeof status === "string" ? status : JSON.stringify(status),
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      valueColor: "text-green-900",
    })
  }
  if (name) {
    details.push({
      label: "Name",
      value: name,
      icon: <User className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      valueColor: "text-blue-900",
    })
  }
  if (dlNumber) {
    details.push({
      label: "DL Number",
      value: dlNumber,
      icon: <CreditCard className="w-6 h-6 text-purple-600" />,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-800",
      valueColor: "text-purple-900",
    })
  }
  if (relation) {
    details.push({
      label: "Father/Spouse",
      value: relation,
      icon: <User className="w-6 h-6 text-teal-600" />,
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      textColor: "text-teal-800",
      valueColor: "text-teal-900",
    })
  }
  if (gender) {
    details.push({
      label: "Gender",
      value: gender,
      icon: <FileText className="w-6 h-6 text-pink-600" />,
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      textColor: "text-pink-800",
      valueColor: "text-pink-900",
    })
  }
  if (dob) {
    details.push({
      label: "Date of Birth",
      value: dob,
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-800",
      valueColor: "text-orange-900",
    })
  }
  if (issueDate) {
    details.push({
      label: "Issue Date",
      value: issueDate,
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-800",
      valueColor: "text-emerald-900",
    })
  }
  if (expiryDate) {
    details.push({
      label: "Expiry Date",
      value: expiryDate,
      icon: <FileText className="w-6 h-6 text-red-600" />,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      valueColor: "text-red-900",
    })
  }
  if (stateVal) {
    details.push({
      label: "State",
      value: stateVal,
      icon: <FileText className="w-6 h-6 text-indigo-600" />,
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-800",
      valueColor: "text-indigo-900",
    })
  }
  if (rto) {
    details.push({
      label: "RTO",
      value: rto,
      icon: <FileText className="w-6 h-6 text-cyan-600" />,
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      textColor: "text-cyan-800",
      valueColor: "text-cyan-900",
    })
  }
  if (address) {
    details.push({
      label: "Address",
      value: address,
      icon: <FileText className="w-6 h-6 text-slate-600" />,
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      textColor: "text-slate-800",
      valueColor: "text-slate-900",
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
        ref={shareTargetRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 border border-green-200 rounded-xl p-6 w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h4 className="font-semibold text-green-800 text-lg">Verification Successful</h4>
            {typeof status === "string" && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                {status}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
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
            {details.map((row, idx) => (
              <div key={idx} className="p-4 rounded-xl border bg-white border-gray-200">
                <div className="text-sm text-gray-500">{row.label}</div>
                <div className="mt-1 font-medium text-gray-900 break-words">{String(row.value ?? "-")}</div>
              </div>
            ))}
          </div>
          
        </div>
      </motion.div>
    </div>
  )
}

    // Voter services: show voter_data/ocr_data directly
    if (serviceKey === "boson-fetch" || serviceKey === "meson-fetch" || serviceKey === "ocr") {
      const data = result.data || result
      const voter = data.voter_data || data.ocr_data || data

      // Extract key voter fields with tolerant fallbacks
      const name =
        voter.name || voter.full_name || voter.fullName || voter.voter_name || voter.applicant_name
      const epic =
        voter.voter_id || voter.epic_number || voter.epic || voter.id || voter.number || formData?.voter_id
      const relation =
        voter.father_name || voter.husband_name || voter.guardian_name || voter.guardian || voter.relation_name
      const gender = voter.gender || voter.sex
      const age = voter.age || voter.age_years
      const dob = voter.date_of_birth || voter.dob || voter.dateOfBirth
      const state = voter.state || voter.state_name
      const district = voter.district || voter.district_name
      const docType = voter.document_type || voter.documentType
      const docId = voter.document_id || voter.documentId
      const assemblyName = voter.assembly_constituency_name || voter.ac_name
      const assemblyNumber = voter.assembly_constituency_number || voter.ac_number
      const parliamentaryName = voter.parliamentary_constituency_name || voter.pc_name
      const parliamentaryNumber = voter.parliamentary_constituency_number || voter.pc_number
      const partName = voter.part_name
      const partNumber = voter.part_number
      const pollingStation = voter.polling_station
      const serialNumber = voter.serial_number
      const normalizedEpic = epic ? String(epic).trim().toUpperCase() : ""
      const normalizedDocId = docId ? String(docId).trim().toUpperCase() : ""
      const addressLine =
        voter.address || voter.address_full || voter.address_line || voter.locality || voter.street
      const pincode = voter.pincode || voter.pin_code
      const status = data.status || data.verification_status || data.message || data.code

      const details: { label: string; value: any; icon: React.ReactNode; bgColor: string; borderColor: string; textColor: string; valueColor: string }[] = []
      if (status) {
        details.push({
          label: "Status",
          value: typeof status === "string" ? status : JSON.stringify(status),
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
          valueColor: "text-green-900",
        })
      }
      if (docType) {
        details.push({
          label: "Document Type",
          value: docType,
          icon: <FileText className="w-6 h-6 text-slate-600" />,
          bgColor: "bg-slate-50",
          borderColor: "border-slate-200",
          textColor: "text-slate-800",
          valueColor: "text-slate-900",
        })
      }
      if (docId && normalizedDocId !== normalizedEpic) {
        details.push({
          label: "Document ID",
          value: docId,
          icon: <CreditCard className="w-6 h-6 text-emerald-600" />,
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          textColor: "text-emerald-800",
          valueColor: "text-emerald-900",
        })
      }
      if (name) {
        details.push({
          label: "Name",
          value: name,
          icon: <User className="w-6 h-6 text-blue-600" />,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
          valueColor: "text-blue-900",
        })
      }
      if (epic) {
        details.push({
          label: "EPIC Number",
          value: epic,
          icon: <CreditCard className="w-6 h-6 text-purple-600" />,
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          textColor: "text-purple-800",
          valueColor: "text-purple-900",
        })
      }
      if (voter.father_name) {
        details.push({
          label: "Father's Name",
          value: voter.father_name,
          icon: <User className="w-6 h-6 text-teal-600" />,
          bgColor: "bg-teal-50",
          borderColor: "border-teal-200",
          textColor: "text-teal-800",
          valueColor: "text-teal-900",
        })
      } else if (relation) {
        details.push({
          label: "Relation",
          value: relation,
          icon: <User className="w-6 h-6 text-teal-600" />,
          bgColor: "bg-teal-50",
          borderColor: "border-teal-200",
          textColor: "text-teal-800",
          valueColor: "text-teal-900",
        })
      }
      if (gender) {
        details.push({
          label: "Gender",
          value: gender,
          icon: <FileText className="w-6 h-6 text-pink-600" />,
          bgColor: "bg-pink-50",
          borderColor: "border-pink-200",
          textColor: "text-pink-800",
          valueColor: "text-pink-900",
        })
      }
      if (age || dob) {
        details.push({
          label: age ? "Age" : "Date of Birth",
          value: age || dob,
          icon: <FileText className="w-6 h-6 text-orange-600" />,
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          textColor: "text-orange-800",
          valueColor: "text-orange-900",
        })
      }
      if (state) {
        details.push({
          label: "State",
          value: state,
          icon: <FileText className="w-6 h-6 text-indigo-600" />,
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-200",
          textColor: "text-indigo-800",
          valueColor: "text-indigo-900",
        })
      }
      if (district) {
        details.push({
          label: "District",
          value: district,
          icon: <FileText className="w-6 h-6 text-cyan-600" />,
          bgColor: "bg-cyan-50",
          borderColor: "border-cyan-200",
          textColor: "text-cyan-800",
          valueColor: "text-cyan-900",
        })
      }
      if (assemblyName) {
        details.push({
          label: "Assembly Constituency",
          value: assemblyName,
          icon: <FileText className="w-6 h-6 text-fuchsia-600" />,
          bgColor: "bg-fuchsia-50",
          borderColor: "border-fuchsia-200",
          textColor: "text-fuchsia-800",
          valueColor: "text-fuchsia-900",
        })
      }
      if (assemblyNumber) {
        details.push({
          label: "Assembly Constituency No.",
          value: assemblyNumber,
          icon: <FileText className="w-6 h-6 text-fuchsia-600" />,
          bgColor: "bg-fuchsia-50",
          borderColor: "border-fuchsia-200",
          textColor: "text-fuchsia-800",
          valueColor: "text-fuchsia-900",
        })
      }
      if (parliamentaryName) {
        details.push({
          label: "Parliamentary Constituency",
          value: parliamentaryName,
          icon: <FileText className="w-6 h-6 text-rose-600" />,
          bgColor: "bg-rose-50",
          borderColor: "border-rose-200",
          textColor: "text-rose-800",
          valueColor: "text-rose-900",
        })
      }
      if (parliamentaryNumber) {
        details.push({
          label: "Parliamentary Constituency No.",
          value: parliamentaryNumber,
          icon: <FileText className="w-6 h-6 text-rose-600" />,
          bgColor: "bg-rose-50",
          borderColor: "border-rose-200",
          textColor: "text-rose-800",
          valueColor: "text-rose-900",
        })
      }
      if (partName) {
        details.push({
          label: "Part Name",
          value: partName,
          icon: <FileText className="w-6 h-6 text-lime-600" />,
          bgColor: "bg-lime-50",
          borderColor: "border-lime-200",
          textColor: "text-lime-800",
          valueColor: "text-lime-900",
        })
      }
      if (partNumber) {
        details.push({
          label: "Part Number",
          value: partNumber,
          icon: <FileText className="w-6 h-6 text-lime-600" />,
          bgColor: "bg-lime-50",
          borderColor: "border-lime-200",
          textColor: "text-lime-800",
          valueColor: "text-lime-900",
        })
      }
      if (pollingStation) {
        details.push({
          label: "Polling Station",
          value: pollingStation,
          icon: <FileText className="w-6 h-6 text-amber-600" />,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          textColor: "text-amber-800",
          valueColor: "text-amber-900",
        })
      }
      if (serialNumber) {
        details.push({
          label: "Serial Number",
          value: serialNumber,
          icon: <FileText className="w-6 h-6 text-amber-600" />,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          textColor: "text-amber-800",
          valueColor: "text-amber-900",
        })
      }
      // Keep address concise to avoid repeating fields already shown separately
      const addressParts = [addressLine, pincode].filter(Boolean)
      if (addressParts.length) {
        details.push({
          label: "Address",
          value: addressParts.join(", "),
          icon: <FileText className="w-6 h-6 text-indigo-600" />,
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-200",
          textColor: "text-indigo-800",
          valueColor: "text-indigo-900",
        })
      }

      // Group details into sections for cleaner presentation
      const identityDetails = details.filter((d) => [
        "Document Type",
        "Document ID",
        "Father's Name",
        "Relation",
        "Gender",
        "Age",
        "Date of Birth",
      ].includes(d.label))
      const constituencyDetails = details.filter((d) => [
        "Assembly Constituency",
        "Assembly Constituency No.",
        "Parliamentary Constituency",
        "Parliamentary Constituency No.",
      ].includes(d.label))
      const boothDetails = details.filter((d) => [
        "Part Name",
        "Part Number",
        "Polling Station",
        "Serial Number",
      ].includes(d.label))
      const locationDetails = details.filter((d) => ["State", "District", "Address"].includes(d.label))
      const hasAny = identityDetails.length || constituencyDetails.length || boothDetails.length || locationDetails.length

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
            ref={shareTargetRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h4 className="font-semibold text-green-800 text-lg">Verification Successful</h4>
                {typeof status === "string" && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                    {status}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
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

            {(name || epic) && (
              <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {name && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Name</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 break-words">{name}</p>
                    </div>
                  )}
                  {epic && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">EPIC Number</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 break-words">{epic}</p>
                    </div>
                  )}
                </div>
              </div>

            )}

            <div className="bg-white rounded-lg p-6 border border-green-200">
              {hasAny ? (
                <div className="space-y-8">
                  {identityDetails.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="text-gray-800 font-semibold mb-3">Identity</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {identityDetails.map((info, index) => (
                          <div key={index} className="space-y-1">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{info.label}</p>
                            <p className="text-base font-semibold text-gray-900 break-words">{info.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {constituencyDetails.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="text-gray-800 font-semibold mb-3">Constituency</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {constituencyDetails.map((info, index) => (
                          <div key={index} className="space-y-1">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{info.label}</p>
                            <p className="text-base font-semibold text-gray-900 break-words">{info.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(boothDetails.length > 0 || locationDetails.length > 0) && (
                    <div className="flex justify-end">
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
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="text-gray-800 font-semibold mb-3">Booth Details</h5>
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
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="text-gray-800 font-semibold mb-3">Location</h5>
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
                  <p className="text-gray-600">Voter details verified successfully.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )
    }

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
            ref={shareTargetRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h4 className="font-semibold text-green-800 text-lg">Verification Successful</h4>
              </div>
              <div className="flex items-center gap-2">
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

    // MCA CIN-by-PAN: show list of CINs and entity names
    if (serviceKey === "cin-by-pan") {
      const payload = result.data || result
      const data = payload.data || payload
      const message = data.message || payload.message || "CIN details fetched"
      const cinList: string[] = Array.isArray(data.cin_list)
        ? data.cin_list
        : Array.isArray(data.cinList)
          ? data.cinList
          : []
      const cinDetails: { cin?: string; entity_name?: string; entityName?: string }[] = Array.isArray(
        data.cin_details || data.cinDetails,
      )
        ? (data.cin_details || data.cinDetails)
        : []
      const count = (cinDetails && cinDetails.length) || (cinList && cinList.length) || 0
      const requestId = payload.request_id || payload.requestId
      const transactionId = payload.transaction_id || payload.transactionId
      const referenceId = payload.reference_id || payload.referenceId

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
            ref={shareTargetRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h4 className="font-semibold text-green-800 text-lg">Verification Successful</h4>
                {typeof message === "string" && message && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                    {message}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
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

            {/* Summary Row */}
            {count > 0 && (
              <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">CINs Found</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900 break-words">{count}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Meta identifiers */}
            {(requestId || transactionId || referenceId) && (
              <div className="mb-6 rounded-lg bg-white p-4 border border-green-200">
                <h5 className="text-gray-800 font-semibold mb-3">Request Info</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {requestId && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Request ID</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 break-words font-mono">{requestId}</p>
                    </div>
                  )}
                  {transactionId && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Transaction ID</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 break-words font-mono">{transactionId}</p>
                    </div>
                  )}
                  {referenceId && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Reference ID</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 break-words font-mono">{referenceId}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg p-6 border border-green-200 space-y-6">
              {cinDetails.length > 0 ? (
                <div className="space-y-4">
                  {cinDetails.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-purple-800 mb-1">CIN</p>
                        <p className="text-lg font-bold text-purple-900 font-mono">{item.cin}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-800 mb-1">Entity Name</p>
                        <p className="text-lg font-bold text-blue-900 break-words">{item.entity_name || item.entityName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : cinList.length > 0 ? (
                <div className="space-y-3">
                  {cinList.map((cin, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-purple-800 mb-1">CIN</p>
                        <p className="text-lg font-bold text-purple-900 font-mono">{cin}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Lookup Completed</h3>
                  <p className="text-gray-600">No CIN records found for the provided PAN.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )
    }

    // GSTIN by PAN: show GSTIN list
    if (serviceKey === "gstin-by-pan") {
      const payload = result?.data || result
      const data = payload?.data || payload || {}
      const message = data?.message || payload?.message || "GSTIN details fetched"
      const results: { document_type?: string; document_id?: string; status?: string; state?: string; state_code?: string }[] =
        Array.isArray(data?.results) ? data.results : []
      const count = results.length
      const requestId = payload?.request_id || payload?.requestId
      const transactionId = payload?.transaction_id || payload?.transactionId
      const referenceId = payload?.reference_id || payload?.referenceId

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
            ref={shareTargetRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h4 className="font-semibold text-green-800 text-lg">Verification Successful</h4>
                {typeof message === "string" && message && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                    {message}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
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

            {/* Summary Row */}
            {count > 0 && (
              <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">GSTINs Found</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900 break-words">{count}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Meta identifiers */}
            {(requestId || transactionId || referenceId) && (
              <div className="mb-6 rounded-lg bg-white p-4 border border-green-200">
                <h5 className="text-gray-800 font-semibold mb-3">Request Info</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {requestId && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Request ID</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 break-words font-mono">{requestId}</p>
                    </div>
                  )}
                  {transactionId && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Transaction ID</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 break-words font-mono">{transactionId}</p>
                    </div>
                  )}
                  {referenceId && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Reference ID</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 break-words font-mono">{referenceId}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg p-6 border border-green-200 space-y-4">
              {results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-purple-800">GSTIN</p>
                        <p className="text-lg font-bold text-purple-900 font-mono break-words">{item.document_id}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-600">Status</p>
                        <p className="text-sm font-semibold text-gray-900">{item.status}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-600">State</p>
                        <p className="text-sm font-semibold text-gray-900">{item.state} ({item.state_code})</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Lookup Completed</h3>
                  <p className="text-gray-600">No GSTIN records found for the provided PAN.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )
    }

    // GSTIN services: show comprehensive business details
    if (serviceKey === "contact" || serviceKey === "lite") {
      const data = result.data || result
      const gstin = data.gstin_data || data

      const documentType = gstin.document_type || "GSTIN"
      const documentId = gstin.document_id || gstin.gstin || gstin.document_number
      const documentLabel = gstin.document_number && !gstin.gstin && !gstin.document_id ? "Document Number" : "GSTIN"
      const legalName = gstin.legal_name || gstin.legalName
      const tradeName = gstin.trade_name || gstin.tradeName
      const pan = gstin.pan
      const taxpayerType = gstin.taxpayer_type || gstin.taxpayerType
      const constitution = gstin.constitution_of_business || gstin.constitutionOfBusiness
      const registrationDate = gstin.date_of_registration || gstin.registration_date || gstin.dateOfRegistration
      const activeStatus = gstin.status
      const aadhaarVerified = gstin.aadhaar_verified
      const fieldVisit = gstin.field_visit_conducted
      const centerJurisdiction = gstin.center_jurisdiction || gstin.centre_jurisdiction
      const stateJurisdiction = gstin.state_jurisdiction
      const principalAddress =
        (gstin.principal_address && (gstin.principal_address.address || gstin.principal_address.full_address)) ||
        gstin.address || gstin.address_full
      const email = gstin.email || gstin.contact_email || gstin.email_id
      const mobile = gstin.mobile || gstin.phone || gstin.phone_number || gstin.contact_mobile

      const message = data.message || data.status || "Verified"

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
            ref={shareTargetRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h4 className="font-semibold text-green-800 text-lg">Verification Successful</h4>
                {typeof message === "string" && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                    {message}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
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

            {/* Summary Row */}
            {(legalName || documentId) && (
              <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {legalName && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Legal Name</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 break-words">{legalName}</p>
                    </div>
                  )}
                  {documentId && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{documentLabel}</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 break-words font-mono">{documentId}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg p-6 border border-green-200 space-y-8">
              {/* Identity */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="text-gray-800 font-semibold mb-3">Identity</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tradeName && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Trade Name</p>
                      <p className="text-base font-semibold text-gray-900 break-words">{tradeName}</p>
                    </div>
                  )}
                  {pan && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">PAN</p>
                      <p className="text-base font-semibold text-gray-900 break-words">{pan}</p>
                    </div>
                  )}
                  {documentType && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Document Type</p>
                      <p className="text-base font-semibold text-gray-900 break-words">{documentType}</p>
                    </div>
                  )}
                  {documentId && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{documentLabel}</p>
                      <p className="text-base font-semibold text-gray-900 break-words font-mono">{documentId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="text-gray-800 font-semibold mb-3">Registration</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeStatus && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</p>
                      <p className="text-base font-semibold text-gray-900 break-words">{String(activeStatus)}</p>
                    </div>
                  )}
                  {registrationDate && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Date of Registration</p>
                      <p className="text-base font-semibold text-gray-900 break-words">{registrationDate}</p>
                    </div>
                  )}
                  {taxpayerType && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Taxpayer Type</p>
                      <p className="text-base font-semibold text-gray-900 break-words">{taxpayerType}</p>
                    </div>
                  )}
                  {constitution && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Constitution of Business</p>
                      <p className="text-base font-semibold text-gray-900 break-words">{constitution}</p>
                    </div>
                  )}
                  {typeof aadhaarVerified !== "undefined" && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Aadhaar Verified</p>
                      <p className="text-base font-semibold text-gray-900 break-words">{aadhaarVerified ? "Yes" : "No"}</p>
                    </div>
                  )}
                  {typeof fieldVisit !== "undefined" && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Field Visit Conducted</p>
                      <p className="text-base font-semibold text-gray-900 break-words">{fieldVisit ? "Yes" : "No"}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact (GSTIN Contact service) */}
              {serviceKey === "contact" && (email || mobile) && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="text-gray-800 font-semibold mb-3">Contact</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {email && (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Email</p>
                        <p className="text-base font-semibold text-gray-900 break-words">{email}</p>
                      </div>
                    )}
                    {mobile && (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Mobile</p>
                        <p className="text-base font-semibold text-gray-900 break-words">{mobile}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Jurisdiction */}
              {(centerJurisdiction || stateJurisdiction) && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="text-gray-800 font-semibold mb-3">Jurisdiction</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {centerJurisdiction && (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Center Jurisdiction</p>
                        <p className="text-base font-semibold text-gray-900 break-words">{centerJurisdiction}</p>
                      </div>
                    )}
                    {stateJurisdiction && (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">State Jurisdiction</p>
                        <p className="text-base font-semibold text-gray-900 break-words">{stateJurisdiction}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Address */}
              {principalAddress && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="text-gray-800 font-semibold mb-3">Principal Address</h5>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Address</p>
                      <p className="text-base font-semibold text-gray-900 break-words">{principalAddress}</p>
                    </div>
                  </div>
                </div>
              )}
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
            ref={shareTargetRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h4 className="font-semibold text-green-800 text-lg">Link Status Verified</h4>
              </div>
              <div className="flex items-center gap-2">
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
          ref={shareTargetRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6 w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h4 className="font-semibold text-green-800 text-lg">Verification Successful</h4>
            </div>
            <div className="flex items-center gap-2">
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
              pattern={field.pattern}
              title={field.title}
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

        {productId && (
          <div className="mt-6">
            <div className="my-6 border-t border-gray-200"></div>
            <ProductReviews productId={productId} showList={false} showStats={false} showForm={true} />
          </div>
        )}
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
