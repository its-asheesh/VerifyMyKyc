"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  X,
  XCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  User,
  CreditCard,
  FileText,
  Link,
  RotateCcw,
} from "lucide-react";
import { VerificationResultShell } from "./VerificationResultShell.tsx";

import ShareActions from "./ShareActions";
import { ProductReviews } from "../reviews/ProductReviews";

interface FormField {
  name: string;
  label: string;
  type: "text" | "file" | "json" | "radio" | "camera";
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  accept?: string;
  pattern?: string;
  title?: string;
}

interface VerificationFormProps {
  fields: FormField[];
  onSubmit: (data: any) => Promise<any>;
  isLoading?: boolean;
  result?: any;
  error?: string | null;
  serviceKey?: string;
  serviceName?: string;
  serviceDescription?: string;
  productId?: string;
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
  const [formData, setFormData] = useState<any>({});
  const [showResult, setShowResult] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const shareTargetRef = useRef<HTMLDivElement | null>(null);

  interface CINDetail {
    cin: string;
    entity_name: string;
  }

  // Clear form data and results when service changes
  useEffect(() => {
    setFormData({});
    setShowResult(false);
  }, [serviceKey]);

  useEffect(() => {
    if (result) {
      setShowResult(true);
      setShowMoreDetails(false);
    }
  }, [result]);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: string, file: File | null) => {
    setFormData((prev: any) => ({ ...prev, [name]: file }));
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment",
        },
      });
      setStream(mediaStream);
      setCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      alert(
        "Camera access is required for document capture. Please allow camera permissions."
      );
    }
  };

  const captureImage = (fieldName: string) => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        const video = videoRef.current;
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.8);
        const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
        handleInputChange(fieldName, base64);
        closeCamera();
      }
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const handleReset = () => {
    setShowResult(false);
    setFormData({});
  };

  const renderFormattedResult = () => {
    if (!result || !showResult) return null;

    // Format result based on service type
    // Company (MCA): fetch-company — show structured company details and directors
    if (serviceKey === "fetch-company") {
  const data = (result as any).data || result;
  const companyData = data.company_data || data.company || {};
  const cd = companyData.company_details || companyData.details || companyData;
  const directors =
    companyData.director_and_signatory_details ||
    companyData.directors ||
    companyData.signatories ||
    [];

  // Extract key fields with graceful fallbacks
  const status =
    data.status ||
    data.code ||
    cd.efiling_status ||
    cd.active_compliance ||
    data.message;
  const name = cd.name || cd.company_name || data.name;
  const companyId = cd.company_id || cd.cin || cd.llpin || cd.fcrn || data.document_number;
  const email = cd.email;
  const address = cd.address;
  const roc = cd.roc_code || cd.roc;
  const regNo = cd.registration_number;
  const category = cd.category;
  const subCategory = cd.sub_category;
  const klass = cd.class;
  const incorporationDate = cd.incorporation_date;
  const lastAgmDate = cd.last_agm_date;
  const balanceSheetDate = cd.balance_sheet_date;
  const activeCompliance = cd.active_compliance;
  const eFilingStatus = cd.efiling_status;
  const listing = cd.listing;
  const authorisedCapital = cd.authorised_capital;
  const paidUpCapital = cd.paid_up_capital;
  const totalObligation = cd.total_obligation;
  const annualReturnFiledDate = cd.annual_return_filed_date;
  const stateVal = cd.state;
  const idType = cd.type;
  const statusCode = data.code;
  const statusMessage = data.message;

  // ✅ Meta IDs
  const requestId = data.request_id || data.requestId;
  const transactionId = data.transaction_id || data.transactionId;
  const referenceId = data.reference_id || data.referenceId;

  // ✅ Build PDF export lines
  const pdfLines: string[] = [];
  pdfLines.push(`${serviceName || "Company Verification"}`);
  pdfLines.push("Verification Successful");
  if (statusMessage) pdfLines.push(`Status: ${statusMessage}`);
  pdfLines.push("");

  // Company Info
  pdfLines.push("COMPANY DETAILS");
  if (status) pdfLines.push(`Status: ${status}`);
  if (statusCode) pdfLines.push(`Status Code: ${statusCode}`);
  if (statusMessage) pdfLines.push(`Status Message: ${statusMessage}`);
  if (idType) pdfLines.push(`ID Type: ${idType}`);
  if (name) pdfLines.push(`Company Name: ${name}`);
  if (companyId) pdfLines.push(`Company ID (CIN/LLPIN): ${companyId}`);
  if (email) pdfLines.push(`Email: ${email}`);
  if (address) pdfLines.push(`Address: ${address}`);
  if (roc) pdfLines.push(`ROC Code: ${roc}`);
  if (regNo) pdfLines.push(`Registration Number: ${regNo}`);
  if (category) pdfLines.push(`Category: ${category}`);
  if (subCategory) pdfLines.push(`Sub Category: ${subCategory}`);
  if (klass) pdfLines.push(`Class: ${klass}`);
  if (listing) pdfLines.push(`Listing: ${listing}`);
  if (incorporationDate) pdfLines.push(`Incorporation Date: ${incorporationDate}`);
  if (lastAgmDate) pdfLines.push(`Last AGM Date: ${lastAgmDate}`);
  if (balanceSheetDate) pdfLines.push(`Balance Sheet Date: ${balanceSheetDate}`);
  if (activeCompliance) pdfLines.push(`Active Compliance: ${activeCompliance}`);
  if (eFilingStatus) pdfLines.push(`eFiling Status: ${eFilingStatus}`);
  if (authorisedCapital) pdfLines.push(`Authorised Capital: ${authorisedCapital}`);
  if (paidUpCapital) pdfLines.push(`Paid Up Capital: ${paidUpCapital}`);
  if (totalObligation) pdfLines.push(`Total Obligation: ${totalObligation}`);
  if (annualReturnFiledDate) pdfLines.push(`Annual Return Filed Date: ${annualReturnFiledDate}`);
  if (stateVal) pdfLines.push(`State: ${stateVal}`);

  // Directors
  if (Array.isArray(directors) && directors.length > 0) {
    pdfLines.push("");
    pdfLines.push("DIRECTORS & SIGNATORIES");
    directors.forEach((d: any, i: number) => {
      pdfLines.push(`--- Director ${i + 1} ---`);
      pdfLines.push(`Name: ${d.name || d.full_name || d.director_name || "-"}`);
      pdfLines.push(`DIN: ${d.din || d.id || d.number || "-"}`);
      pdfLines.push(`Appointment Date: ${d.begin_date || d.from || d.start_date || "-"}`);
      pdfLines.push(""); // spacing
    });
  }

  return (
    <VerificationResultShell
      serviceName={serviceName}
      serviceDescription={serviceDescription}
      message={statusMessage || "Company details fetched"}
      isValid={true}
      requestId={requestId}
      transactionId={transactionId}
      referenceId={referenceId}
      result={result}
      onReset={handleReset}
      targetRef={shareTargetRef}
      summary={pdfLines.join("\n")}
    >
      <div ref={shareTargetRef} className="bg-white rounded-lg p-6 border border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
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
          ]
            .filter((r) => r.value !== undefined && r.value !== null && r.value !== "")
            .map((row, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border bg-white border-gray-200"
              >
                <div className="text-sm text-gray-500">{row.label}</div>
                <div className="mt-1 font-medium text-gray-900 break-words">
                  {String(row.value)}
                </div>
              </div>
            ))}
        </div>

        {/* Directors */}
        {Array.isArray(directors) && directors.length > 0 && (
          <div className="space-y-3 mt-6">
            <h4 className="text-lg font-semibold text-gray-900">Directors & Signatories</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {directors.map((d: any, i: number) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border bg-white border-gray-200"
                >
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium text-gray-900">
                    {d.name || d.full_name || d.director_name || "-"}
                  </div>
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
    </VerificationResultShell>
  );
}

    // Bank Account Verification: show all fields from bank_account_data
    if (
  serviceKey === "account-verify" ||
  (result &&
    (((result as any).data && (result as any).data.bank_account_data) ||
      (result as any).bank_account_data))
) {
  const payload: any = (result as any).data || result;
  const data: any = payload; // transformed result already sets result.data = inner
  const bank: any = data.bank_account_data || data;

  const status =
    data.message || data.status || data.code || (result as any).message;
  const requestId = data.request_id || payload.request_id;
  const transactionId = data.transaction_id || payload.transaction_id;
  const referenceId =
    bank.reference_id || data.reference_id || payload.referenceId;

  const name = bank.name;
  const bankName = bank.bank_name || bank.bankName;
  const branch = bank.branch;
  const city = bank.city;
  const ifsc = bank.ifsc;
  const micr = bank.micr;
  const utr = bank.utr;
  const accountNumber = bank.account_number;

  // ✅ Build PDF export lines
  const pdfLines: string[] = [];
  pdfLines.push(`${serviceName || "Bank Account Verification"}`);
  pdfLines.push("Verification Successful");
  if (status) pdfLines.push(`Status: ${status}`);
  pdfLines.push("");

  if (name) pdfLines.push(`Account Holder: ${name}`);
  if (bankName) pdfLines.push(`Bank Name: ${bankName}`);
  if (branch) pdfLines.push(`Branch: ${branch}`);
  if (city) pdfLines.push(`City: ${city}`);
  if (ifsc) pdfLines.push(`IFSC: ${ifsc}`);
  if (micr) pdfLines.push(`MICR: ${micr}`);
  if (utr) pdfLines.push(`UTR: ${utr}`);
  if (accountNumber) pdfLines.push(`Account Number: ${accountNumber}`);
  if (requestId) pdfLines.push(`Request ID: ${requestId}`);
  if (transactionId) pdfLines.push(`Transaction ID: ${transactionId}`);
  if (referenceId) pdfLines.push(`Reference ID: ${referenceId}`);

  return (
    <VerificationResultShell
      serviceName={serviceName}
      serviceDescription={serviceDescription}
      message={status || "Bank details verified"}
      isValid={true}
      requestId={requestId}
      transactionId={transactionId}
      referenceId={referenceId}
      result={result}
      onReset={handleReset}
      targetRef={shareTargetRef}
      summary={pdfLines.join("\n")}
    >
      <div ref={shareTargetRef} className="bg-white rounded-lg p-6 border border-green-200 space-y-6">
        {/* Meta IDs */}
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

        {/* All Bank Fields */}
        {Object.keys(bank).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(bank).map(([k, v]) => {
              // Skip empty or internal fields
              if (v == null || k === "reference_id") return null;

              const label = k
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())
                .replace("Bank Name", "Bank Name")
                .replace("Account Number", "Account Number");

              const value =
                typeof v === "object" ? JSON.stringify(v) : String(v);

              return (
                <div
                  key={k}
                  className="p-4 rounded-xl border bg-white border-gray-200"
                >
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {label}
                  </div>
                  <div className="mt-1 font-medium text-gray-900 break-words">
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No bank details available.</p>
        )}
      </div>
    </VerificationResultShell>
  );
}

    // Driving License services: prefer unmasked fields and handle both fetch-details and OCR
    // Detect via serviceName including "driving license" or presence of DL-specific fields
    if (
  (serviceName && serviceName.toLowerCase().includes("driving license")) ||
  (result &&
    (result.license_details ||
      result.driving_license_data ||
      (result.data &&
        (result.data.license_details || result.data.driving_license_data))))
) {
  const data = (result as any).data || result;
  const dl =
    data.license_details ||
    data.driving_license_data ||
    data.dl_data ||
    data.ocr_data ||
    data;

  // Extract tolerant fields, preferring unmasked variants
  const status =
    data.status || data.verification_status || data.message || data.code;
  const name =
    dl.full_name_unmasked ||
    dl.name_unmasked ||
    dl.full_name ||
    dl.name ||
    dl.holder_name;
  const dlNumber =
    dl.dl_number ||
    dl.license_number ||
    dl.licence_number ||
    formData?.driving_license_number;
  const relation =
    dl.father_name_unmasked ||
    dl.father_name ||
    dl.dependent_name ||
    dl.spouse_name ||
    dl.guardian_name;
  const dob = dl.date_of_birth || dl.dob;
  const gender = dl.gender || dl.sex;
  const address =
    dl.address_full ||
    dl.address ||
    dl.present_address ||
    dl.permanent_address;
  const issueDate =
    dl.issue_date ||
    dl.issued_on ||
    dl.date_of_issue ||
    dl.validity?.non_transport?.issue_date;
  const expiryDate =
    dl.expiry_date ||
    dl.valid_till ||
    dl.valid_upto ||
    dl.validity?.non_transport?.expiry_date;
  const stateVal = dl.state || dl.rto_state || dl.rto_details?.state;
  const rto =
    dl.rto ||
    dl.rto_office ||
    dl.issuing_authority ||
    dl.rto_details?.authority;

  // ✅ Meta IDs
  const requestId = data.request_id || data.requestId;
  const transactionId = data.transaction_id || data.transactionId;
  const referenceId = data.reference_id || data.referenceId;

  // ✅ Build PDF export lines
  const pdfLines: string[] = [];
  pdfLines.push(`${serviceName || "Driving License Verification"}`);
  pdfLines.push("Verification Successful");
  pdfLines.push("");

  if (status) pdfLines.push(`Status: ${status}`);
  if (name) pdfLines.push(`Name: ${name}`);
  if (dlNumber) pdfLines.push(`DL Number: ${dlNumber}`);
  if (relation) pdfLines.push(`Father/Spouse: ${relation}`);
  if (gender) pdfLines.push(`Gender: ${gender}`);
  if (dob) pdfLines.push(`Date of Birth: ${dob}`);
  if (issueDate) pdfLines.push(`Issue Date: ${issueDate}`);
  if (expiryDate) pdfLines.push(`Expiry Date: ${expiryDate}`);
  if (stateVal) pdfLines.push(`State: ${stateVal}`);
  if (rto) pdfLines.push(`RTO: ${rto}`);
  if (address) pdfLines.push(`Address: ${address}`);

  // ✅ Build details for UI
  const details: {
    label: string;
    value?: any;
    icon: React.ReactNode;
    bgColor: string;
    borderColor: string;
    textColor: string;
    valueColor: string;
  }[] = [];

  if (status) {
    details.push({
      label: "Status",
      value: typeof status === "string" ? status : JSON.stringify(status),
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      valueColor: "text-green-900",
    });
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
    });
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
    });
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
    });
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
    });
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
    });
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
    });
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
    });
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
    });
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
    });
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
    });
  }

  return (
    <VerificationResultShell
      serviceName={serviceName}
      serviceDescription={serviceDescription}
      message={status || "Driving license verified"}
      isValid={true}
      requestId={requestId}
      transactionId={transactionId}
      referenceId={referenceId}
      result={result}
      onReset={handleReset}
      targetRef={shareTargetRef}
      summary={pdfLines.join("\n")}
    >
      <div ref={shareTargetRef} className="bg-white rounded-lg p-6 border border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((row, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border bg-white border-gray-200"
            >
              <div className="text-sm text-gray-500">{row.label}</div>
              <div className="mt-1 font-medium text-gray-900 break-words">
                {String(row.value ?? "-")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </VerificationResultShell>
  );
}

    // Voter services: show voter_data/ocr_data directly
    if (
  serviceKey === "boson-fetch" ||
  serviceKey === "meson-fetch" ||
  serviceKey === "ocr"
) {
  const payload = result.data || result;
  const voter = payload.voter_data || payload.ocr_data || payload;

  // ✅ Extract fields
  const fields = [
    { label: "Document Type", value: voter.document_type },
    { label: "Document ID / EPIC", value: voter.document_id },
    { label: "Name", value: voter.name },
    { label: "Father's Name", value: voter.father_name },
    { label: "Gender", value: voter.gender },
    { label: "Age", value: voter.age },
    { label: "District", value: voter.district },
    { label: "State", value: voter.state },
    {
      label: "Assembly Constituency",
      value: `${voter.assembly_constituency_name} (${voter.assembly_constituency_number})`,
    },
    {
      label: "Parliamentary Constituency",
      value: `${voter.parliamentary_constituency_name} (${voter.parliamentary_constituency_number})`,
    },
    { label: "Part Number", value: voter.part_number },
    { label: "Serial Number", value: voter.serial_number },
    { label: "Polling Station", value: voter.polling_station },
  ].filter((f) => f.value);

  // ✅ Meta IDs
  const requestId = payload.request_id;
  const transactionId = payload.transaction_id;
  const referenceId = payload.reference_id;
  const message = payload.message || "Voter details fetched";

  // ✅ Build PDF export lines
  const pdfLines: string[] = [];
  pdfLines.push(`${serviceName || "Voter Verification"}`);
  pdfLines.push("Verification Successful");
  pdfLines.push("");

  fields.forEach(({ label, value }) => {
    pdfLines.push(`${label}: ${value}`);
  });

  return (
    <VerificationResultShell
      serviceName={serviceName}
      serviceDescription={serviceDescription}
      message={message}
      isValid={true}
      requestId={requestId}
      transactionId={transactionId}
      referenceId={referenceId}
      result={result}
      onReset={handleReset}
      targetRef={shareTargetRef}
      summary={pdfLines.join("\n")}
    >
      <div ref={shareTargetRef} className="bg-white rounded-lg p-6 border border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div
              key={f.label}
              className="p-4 rounded-xl border bg-gray-50 border-gray-200"
            >
              <div className="text-sm font-medium text-gray-600">{f.label}</div>
              <div className="mt-1 font-semibold text-gray-900 break-words">
                {String(f.value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </VerificationResultShell>
  );
}

    if (serviceKey === "father-name") {
  const data = result.data || result;
  const panData = data.pan_data || data;

  // ✅ Confirmed from API: use exact known fields
  const documentType = panData.document_type || "PAN";
  const documentId = panData.document_id || formData.pan_number || "Not Available";
  const fatherName = panData.father_name || "Not Available";

  // Meta info
  const requestId = data.request_id;
  const transactionId = data.transaction_id;
  const referenceId = data.reference_id;
  const message = data.message || "PAN details fetched";

  // Only show fields that have real values
  const fields = [
    { label: "Document Type", value: documentType },
    { label: "Document ID", value: documentId },
    { label: "Father's Name", value: fatherName },
  ].filter((f) => f.value && f.value !== "Not Available");

  // ✅ Build PDF export lines
  const pdfLines: string[] = [];
  pdfLines.push(`${serviceName || "Father Name Verification"}`);
  pdfLines.push("Verification Successful");
  pdfLines.push("");

  if (fields.length > 0) {
    fields.forEach(({ label, value }) => {
      pdfLines.push(`${label}: ${value}`);
    });
  } else {
    pdfLines.push("No valid information available.");
  }

  return (
    <VerificationResultShell
      serviceName={serviceName}
      serviceDescription={serviceDescription}
      message={message}
      isValid={true}
      requestId={requestId}
      transactionId={transactionId}
      referenceId={referenceId}
      result={result}
      onReset={handleReset}
      targetRef={shareTargetRef}
      summary={pdfLines.join("\n")}
    >
      <div ref={shareTargetRef} className="bg-white rounded-lg p-6 border border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.label} className="p-4 rounded-xl border bg-gray-50 border-gray-200">
              <div className="text-sm font-medium text-gray-600">{field.label}</div>
              <div className="mt-1 font-semibold text-gray-900 break-words">{field.value}</div>
            </div>
          ))}
        </div>
      </div>
    </VerificationResultShell>
  );
}

//Fetch Pan advanced
if (serviceKey === "fetch-advanced") {
  const data = result.data || result;
  const panData = data.pan_data || data;

  // ✅ Extract PAN Advanced fields with fallbacks
  const documentType = panData.document_type || "PAN";
  const documentId =
    panData.document_id || formData.pan_number || "Not Available";
  const fullName = panData.name || "Not Available";
  const firstName = panData.first_name || "Not Available";
  const middleName = panData.middle_name || "";
  const lastName = panData.last_name || "Not Available";
  const category = panData.category || "Not Available";
  const categoryType = panData.category_type || "Not Available";
  const isIndividual =
    typeof panData.is_individual !== "undefined"
      ? panData.is_individual
        ? "Yes"
        : "No"
      : "Not Available";
  const taxComplianceStatus =
    panData.individual_tax_compliance_status || "Not Available";
  const aadhaarLinked =
    typeof panData.aadhaar_linked !== "undefined"
      ? panData.aadhaar_linked
        ? "Yes"
        : "No"
      : "Not Available";

  // Meta info
  // const requestId = data.request_id || "Not Available";
  // const transactionId = data.transaction_id || "Not Available";
  // const referenceId = data.reference_id || "Not Available";
  const message =
    data.message || "PAN Advanced details fetched successfully";
  const statusCode = data.code || "1000";

  // Group fields for display - only include those with real values
  const personalInfo = [
    { label: "Document Type", value: documentType },
    { label: "Document ID", value: documentId },
    { label: "Full Name", value: fullName },
    { label: "First Name", value: firstName },
    { label: "Middle Name", value: middleName },
    { label: "Last Name", value: lastName },
  ].filter((f) => f.value && f.value !== "Not Available" && f.value !== "");

  const categoryInfo = [
    { label: "Category", value: category },
    { label: "Category Type", value: categoryType },
    { label: "Is Individual", value: isIndividual },
    { label: "Tax Compliance Status", value: taxComplianceStatus },
    { label: "Aadhaar Linked", value: aadhaarLinked },
  ].filter((f) => f.value && f.value !== "Not Available");

  // ✅ Build PDF export lines
  const pdfLines: string[] = [];
  pdfLines.push(`${serviceName || "PAN Advanced Verification"}`);
  pdfLines.push("Verification Successful");
  pdfLines.push(`Status Code: ${statusCode}`);
  pdfLines.push("");

  // Add personal info to PDF
  if (personalInfo.length > 0) {
    pdfLines.push("=== PERSONAL INFORMATION ===");
    personalInfo.forEach(({ label, value }) => {
      pdfLines.push(`${label}: ${value}`);
    });
    pdfLines.push("");
  }

  // Add category info to PDF
  if (categoryInfo.length > 0) {
    pdfLines.push("=== CATEGORY & STATUS INFORMATION ===");
    categoryInfo.forEach(({ label, value }) => {
      pdfLines.push(`${label}: ${value}`);
    });
    pdfLines.push("");
  }

  return (
    <VerificationResultShell
      serviceName={serviceName}
      serviceDescription={serviceDescription}
      message={message}
      isValid={true}
      //requestId={requestId}
     // transactionId={transactionId}
      //referenceId={referenceId}
      result={result}
      onReset={handleReset}
      targetRef={shareTargetRef}
      summary={pdfLines.join("\n")}
    >
      <div
        ref={shareTargetRef}
        className="bg-white rounded-lg p-6 border border-green-200"
      >
        {/* Personal Information Section */}
        {personalInfo.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalInfo.map((field) => (
                <div
                  key={field.label}
                  className="p-4 rounded-xl border bg-gray-50 border-gray-200"
                >
                  <div className="text-sm font-medium text-gray-600">
                    {field.label}
                  </div>
                  <div className="mt-1 font-semibold text-gray-900 break-words">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category & Status Information Section */}
        {categoryInfo.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Category & Status Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryInfo.map((field) => (
                <div
                  key={field.label}
                  className="p-4 rounded-xl border bg-gray-50 border-gray-200"
                >
                  <div className="text-sm font-medium text-gray-600">
                    {field.label}
                  </div>
                  <div className="mt-1 font-semibold text-gray-900 break-words">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show message if no data available */}
        {personalInfo.length === 0 && categoryInfo.length === 0 && (
          <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
            No valid information available.
          </div>
        )}
      </div>
    </VerificationResultShell>
  );
}

if (serviceKey === "fetch-detailed") {
  const data = result.data || result;
  const panData = data.pan_data || data.pan_details || data;

  // ✅ Extract PAN Detailed fields with fallbacks
  const documentType = panData.document_type || "PAN";
  const documentId = panData.document_id || formData.pan_number || "Not Available";
  const fullName = panData.name || "Not Available";
  const lastName = panData.last_name || "Not Available";
  const category = panData.category || "Not Available";
  const dob = panData.date_of_birth || "Not Available";
  const maskedAadhaar = panData.masked_aadhaar_number || "Not Available";
  const email = panData.email || "Not Available";
  const phone = panData.phone || "Not Available";
  const gender = panData.gender || "Not Available";
  const aadhaarLinked =
    typeof panData.aadhaar_linked !== "undefined"
      ? panData.aadhaar_linked
        ? "Yes"
        : "No"
      : "Not Available";

  const address = panData.address_data || {};
  const addressInfo = [
    { label: "Line 1", value: address.line_1 },
    { label: "Line 2", value: address.line_2 },
    { label: "Street", value: address.street },
    { label: "City", value: address.city },
    { label: "Line 5", value: address.line_5 },
    { label: "State", value: address.state },
    { label: "Pincode", value: address.pincode },
  ].filter((f) => f.value && f.value !== "Not Available");

  const personalInfo = [
    { label: "Document Type", value: documentType },
    { label: "Document ID", value: documentId },
    { label: "Full Name", value: fullName },
    { label: "Last Name", value: lastName },
    { label: "Category", value: category },
    { label: "Date of Birth", value: dob },
    { label: "Masked Aadhaar", value: maskedAadhaar },
    { label: "Email", value: email },
    { label: "Phone", value: phone },
    { label: "Gender", value: gender },
    { label: "Aadhaar Linked", value: aadhaarLinked },
  ].filter((f) => f.value && f.value !== "Not Available");

  const message = data.message || "PAN Detailed details fetched successfully";
  const statusCode = data.code || "1000";

  // ✅ Build PDF export lines
  const pdfLines: string[] = [];
  pdfLines.push(`${serviceName || "PAN Detailed Verification"}`);
  pdfLines.push("Verification Successful");
  pdfLines.push(`Status Code: ${statusCode}`);
  pdfLines.push("");

  if (personalInfo.length > 0) {
    pdfLines.push("=== PERSONAL INFORMATION ===");
    personalInfo.forEach(({ label, value }) => {
      pdfLines.push(`${label}: ${value}`);
    });
    pdfLines.push("");
  }

  if (addressInfo.length > 0) {
    pdfLines.push("=== ADDRESS INFORMATION ===");
    addressInfo.forEach(({ label, value }) => {
      pdfLines.push(`${label}: ${value}`);
    });
    pdfLines.push("");
  }

  return (
    <VerificationResultShell
      serviceName={serviceName}
      serviceDescription={serviceDescription}
      message={message}
      isValid={true}
      result={result}
      onReset={handleReset}
      targetRef={shareTargetRef}
      summary={pdfLines.join("\n")}
    >
      <div
        ref={shareTargetRef}
        className="bg-white rounded-lg p-6 border border-green-200"
      >
        {/* Personal Information Section */}
        {personalInfo.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalInfo.map((field) => (
                <div
                  key={field.label}
                  className="p-4 rounded-xl border bg-gray-50 border-gray-200"
                >
                  <div className="text-sm font-medium text-gray-600">{field.label}</div>
                  <div className="mt-1 font-semibold text-gray-900 break-words">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Address Information Section */}
        {addressInfo.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addressInfo.map((field) => (
                <div
                  key={field.label}
                  className="p-4 rounded-xl border bg-gray-50 border-gray-200"
                >
                  <div className="text-sm font-medium text-gray-600">{field.label}</div>
                  <div className="mt-1 font-semibold text-gray-900 break-words">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show message if no data available */}
        {personalInfo.length === 0 && addressInfo.length === 0 && (
          <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
            No valid information available.
          </div>
        )}
      </div>
    </VerificationResultShell>
  );
}




    // MCA CIN-by-PAN: show list of CINs and entity names
    if (serviceKey === "cin-by-pan") {
  const payload = result.data || result;
  const data = payload.data || payload;

  const message = data.message || "CIN details fetched";
  const cinDetails: { cin: string; entity_name: string }[] = Array.isArray(data.cin_details)
    ? data.cin_details
    : [];
  const cinList: string[] = Array.isArray(data.cin_list)
    ? data.cin_list
    : [];
  const count = cinDetails.length || cinList.length;

  const requestId = payload.request_id;
  const transactionId = payload.transaction_id;
  const referenceId = payload.reference_id;

  const hasDetails = cinDetails.length > 0;
  const hasListOnly = !hasDetails && cinList.length > 0;

  // ✅ Build PDF export lines
  const pdfLines: string[] = [];
  pdfLines.push(`${serviceName || "CIN by PAN Lookup"}`);
  pdfLines.push("Verification Successful");
  pdfLines.push("");

  // Summary
  pdfLines.push(`CINs Found: ${count}`);
  pdfLines.push("");

  // Detailed Results
  if (hasDetails) {
    pdfLines.push("CIN DETAILS WITH ENTITY NAMES");
    cinDetails.forEach((item) => {
      pdfLines.push(`--- CIN ${item.cin} ---`);
      pdfLines.push(`CIN: ${item.cin}`);
      pdfLines.push(`Entity Name: ${item.entity_name}`);
      pdfLines.push(""); // spacing
    });
  } else if (hasListOnly) {
    pdfLines.push("CIN LIST");
    cinList.forEach((cin) => {
      pdfLines.push(`CIN: ${cin}`);
    });
  } else {
    pdfLines.push("No CIN records found for the provided PAN.");
  }

  return (
    <VerificationResultShell
      serviceName={serviceName}
      serviceDescription={serviceDescription}
      message={message}
      isValid={true}
      requestId={requestId}
      transactionId={transactionId}
      referenceId={referenceId}
      result={result}
      onReset={handleReset}
      targetRef={shareTargetRef}
      summary={pdfLines.join("\n")}
    >
      <div ref={shareTargetRef} className="bg-white rounded-lg p-6 border border-green-200 space-y-6">
        {/* Summary */}
        {count > 0 && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">CINs Found</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{count}</p>
          </div>
        )}

        {/* Detailed Results */}
        {hasDetails ? (
          <div className="space-y-4">
            {cinDetails.map((item) => (
              <div
                key={item.cin}
                className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-800 mb-1">CIN</p>
                  <p className="text-lg font-bold text-purple-900 font-mono">{item.cin}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800 mb-1">Entity Name</p>
                  <p className="text-lg font-bold text-blue-900 break-words">{item.entity_name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : hasListOnly ? (
          <div className="space-y-3">
            {cinList.map((cin) => (
              <div
                key={cin}
                className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200"
              >
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
    </VerificationResultShell>
  );
}

    // GSTIN by PAN: show GSTIN list
    if (serviceKey === "gstin-by-pan") {
  const payload = result?.data || result;
  const data = payload?.data || payload || {};

  // ✅ Extract message
  const message = data?.message || payload?.message || "GSTIN details fetched";

  // ✅ Extract results with type safety
  const results: {
    document_type?: string;
    document_id?: string;
    status?: string;
    state?: string;
    state_code?: string;
  }[] = Array.isArray(data?.results) ? data.results : [];

  const count = results.length;

  // ✅ Meta IDs
  const requestId = payload?.request_id || payload?.requestId;
  const transactionId = payload?.transaction_id || payload?.transactionId;
  const referenceId = payload?.reference_id || payload?.referenceId;

  // ✅ Build PDF export lines
  const pdfLines: string[] = [];
  pdfLines.push(`${serviceName || "GSTIN by PAN Lookup"}`);
  pdfLines.push("Verification Successful");
  pdfLines.push("");

  // Summary
  pdfLines.push(`GSTINs Found: ${count}`);
  pdfLines.push("");

  // GSTIN List
  if (results.length > 0) {
    pdfLines.push("GSTIN DETAILS");
    results.forEach((item) => {
      pdfLines.push(`--- GSTIN ${item.document_id} ---`);
      pdfLines.push(`GSTIN: ${item.document_id || "—"}`);
      pdfLines.push(`Status: ${item.status || "Unknown"}`);
      pdfLines.push(`State: ${item.state} (${item.state_code || "?"})`);
      pdfLines.push(""); // spacing
    });
  } else {
    pdfLines.push("No GSTIN records found for the provided PAN.");
  }

  return (
    <VerificationResultShell
      serviceName={serviceName}
      serviceDescription={serviceDescription}
      message={message}
      isValid={true}
      requestId={requestId}
      transactionId={transactionId}
      referenceId={referenceId}
      result={result}
      onReset={handleReset}
      targetRef={shareTargetRef}
      summary={pdfLines.join("\n")}
    >
      <div ref={shareTargetRef} className="bg-white rounded-lg p-6 border border-green-200 space-y-4">
        {/* Summary */}
        {count > 0 && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">GSTINs Found</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{count}</p>
          </div>
        )}

        {/* GSTIN List */}
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((item) => (
              <div
                key={item.document_id}
                className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>

                {/* GSTIN */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-purple-800">GSTIN</p>
                  <p className="text-lg font-bold text-purple-900 font-mono break-words">
                    {item.document_id}
                  </p>
                </div>

                {/* Status */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600">Status</p>
                  <p
                    className={`text-sm font-semibold ${
                      item.status?.toLowerCase() === "active"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {item.status || "Unknown"}
                  </p>
                </div>

                {/* State */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600">State</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.state} ({item.state_code})
                  </p>
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
    </VerificationResultShell>
  );
}

    // GSTIN services: show comprehensive business details
    if (serviceKey === "contact" || serviceKey === "lite") {
  const data = result.data || result;
  const gstin = data.gstin_data || data; // Handle nested or flat structure

  // ✅ Extract fields with fallbacks
  const documentType = gstin.document_type || "GSTIN";
  const documentId = gstin.document_id || gstin.gstin || gstin.document_number;
  const documentLabel =
    gstin.document_number && !gstin.gstin && !gstin.document_id
      ? "Document Number"
      : "GSTIN";

  const legalName = gstin.legal_name || gstin.legalName;
  const tradeName = gstin.trade_name || gstin.tradeName;
  const pan = gstin.pan;
  const taxpayerType = gstin.taxpayer_type || gstin.taxpayerType;
  const constitution =
    gstin.constitution_of_business || gstin.constitutionOfBusiness;
  const registrationDate =
    gstin.date_of_registration ||
    gstin.registration_date ||
    gstin.dateOfRegistration;
  const activeStatus = gstin.status;
  const aadhaarVerified = gstin.aadhaar_verified;
  const fieldVisit = gstin.field_visit_conducted;
  const centerJurisdiction =
    gstin.center_jurisdiction || gstin.centre_jurisdiction;
  const stateJurisdiction = gstin.state_jurisdiction;
  const principalAddress =
    (gstin.principal_address &&
      (gstin.principal_address.address ||
        gstin.principal_address.full_address)) ||
    gstin.address ||
    gstin.address_full;
  const email = gstin.email || gstin.contact_email || gstin.email_id;
  const mobile =
    gstin.mobile ||
    gstin.phone ||
    gstin.phone_number ||
    gstin.contact_mobile;

  // ✅ Message
  const message = data.message || data.status || "Details verified";

  // ✅ Meta IDs
  const requestId = data.request_id || data.requestId;
  const transactionId = data.transaction_id || data.transactionId;
  const referenceId = data.reference_id || data.referenceId;

  // ✅ Determine validity
  const isValid = !!(documentId || legalName || email || mobile);

  // ✅ Build PDF export lines
  const pdfLines: string[] = [];
  pdfLines.push(`${serviceName || "GST Verification"}`);
  pdfLines.push(isValid ? "Verification Successful" : "Verification Failed");
  pdfLines.push("");

  // Summary
  if (legalName) pdfLines.push(`Legal Name: ${legalName}`);
  if (documentId) pdfLines.push(`${documentLabel}: ${documentId}`);

  // Identity
  if (tradeName || pan || documentType || documentId) {
    pdfLines.push("");
    pdfLines.push("IDENTITY");
    if (tradeName) pdfLines.push(`Trade Name: ${tradeName}`);
    if (pan) pdfLines.push(`PAN: ${pan}`);
    if (documentType) pdfLines.push(`Document Type: ${documentType}`);
    if (documentId) pdfLines.push(`${documentLabel}: ${documentId}`);
  }

  // Registration
  if (
    activeStatus ||
    registrationDate ||
    taxpayerType ||
    constitution ||
    aadhaarVerified !== undefined ||
    fieldVisit !== undefined
  ) {
    pdfLines.push("");
    pdfLines.push("REGISTRATION");
    if (activeStatus) pdfLines.push(`Status: ${String(activeStatus)}`);
    if (registrationDate)
      pdfLines.push(`Date of Registration: ${registrationDate}`);
    if (taxpayerType)
      pdfLines.push(`Taxpayer Type: ${taxpayerType}`);
    if (constitution)
      pdfLines.push(`Constitution: ${constitution}`);
    if (typeof aadhaarVerified !== "undefined")
      pdfLines.push(`Aadhaar Verified: ${aadhaarVerified ? "Yes" : "No"}`);
    if (typeof fieldVisit !== "undefined")
      pdfLines.push(`Field Visit Conducted: ${fieldVisit ? "Yes" : "No"}`);
  }

  // Contact (only for 'contact')
  if (serviceKey === "contact" && (email || mobile)) {
    pdfLines.push("");
    pdfLines.push("CONTACT");
    if (email) pdfLines.push(`Email: ${email}`);
    if (mobile) pdfLines.push(`Mobile: ${mobile}`);
  }

  // Jurisdiction
  if (centerJurisdiction || stateJurisdiction) {
    pdfLines.push("");
    pdfLines.push("JURISDICTION");
    if (centerJurisdiction)
      pdfLines.push(`Center Jurisdiction: ${centerJurisdiction}`);
    if (stateJurisdiction)
      pdfLines.push(`State Jurisdiction: ${stateJurisdiction}`);
  }

  // Principal Address
  if (principalAddress) {
    pdfLines.push("");
    pdfLines.push("PRINCIPAL ADDRESS");
    pdfLines.push(principalAddress);
  }

  return (
    <VerificationResultShell
      serviceName={serviceName}
      serviceDescription={serviceDescription}
      message={message}
      isValid={isValid}
      requestId={requestId}
      transactionId={transactionId}
      referenceId={referenceId}
      result={result}
      onReset={handleReset}
      targetRef={shareTargetRef}
      summary={pdfLines.join("\n")}
    >
      <div ref={shareTargetRef} className="bg-white rounded-lg p-6 border border-green-200 space-y-8">
        {/* Summary Row */}
        {(legalName || documentId) && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {legalName && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Legal Name
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900 break-words">
                    {legalName}
                  </p>
                </div>
              )}
              {documentId && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {documentLabel}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900 break-words font-mono">
                    {documentId}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Identity Section */}
        {(tradeName || pan || documentType || documentId) && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="text-gray-800 font-semibold mb-3">Identity</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tradeName && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Trade Name
                  </p>
                  <p className="text-base font-semibold text-gray-900 break-words">
                    {tradeName}
                  </p>
                </div>
              )}
              {pan && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    PAN
                  </p>
                  <p className="text-base font-semibold text-gray-900 break-words">
                    {pan}
                  </p>
                </div>
              )}
              {documentType && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Document Type
                  </p>
                  <p className="text-base font-semibold text-gray-900 break-words">
                    {documentType}
                  </p>
                </div>
              )}
              {documentId && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {documentLabel}
                  </p>
                  <p className="text-base font-semibold text-gray-900 break-words font-mono">
                    {documentId}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Registration Section */}
        {(activeStatus ||
          registrationDate ||
          taxpayerType ||
          constitution ||
          aadhaarVerified !== undefined ||
          fieldVisit !== undefined) && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="text-gray-800 font-semibold mb-3">Registration</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeStatus && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Status
                  </p>
                  <p
                    className={`text-base font-semibold ${
                      String(activeStatus).toLowerCase() === "active"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {String(activeStatus)}
                  </p>
                </div>
              )}
              {registrationDate && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Date of Registration
                  </p>
                  <p className="text-base font-semibold text-gray-900 break-words">
                    {registrationDate}
                  </p>
                </div>
              )}
              {taxpayerType && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Taxpayer Type
                  </p>
                  <p className="text-base font-semibold text-gray-900 break-words">
                    {taxpayerType}
                  </p>
                </div>
              )}
              {constitution && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Constitution of Business
                  </p>
                  <p className="text-base font-semibold text-gray-900 break-words">
                    {constitution}
                  </p>
                </div>
              )}
              {typeof aadhaarVerified !== "undefined" && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Aadhaar Verified
                  </p>
                  <p className="text-base font-semibold text-gray-900 break-words">
                    {aadhaarVerified ? "Yes" : "No"}
                  </p>
                </div>
              )}
              {typeof fieldVisit !== "undefined" && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Field Visit Conducted
                  </p>
                  <p className="text-base font-semibold text-gray-900 break-words">
                    {fieldVisit ? "Yes" : "No"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Section - Only for 'contact' service */}
        {serviceKey === "contact" && (email || mobile) && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="text-gray-800 font-semibold mb-3">Contact</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {email && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Email
                  </p>
                  <p className="text-base font-semibold text-gray-900 break-words">
                    {email}
                  </p>
                </div>
              )}
              {mobile && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Mobile
                  </p>
                  <p className="text-base font-semibold text-gray-900 break-words">
                    {mobile}
                  </p>
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
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Center Jurisdiction
                  </p>
                  <p className="text-base font-semibold text-gray-900 break-words">
                    {centerJurisdiction}
                  </p>
                </div>
              )}
              {stateJurisdiction && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    State Jurisdiction
                  </p>
                  <p className="text-base font-semibold text-gray-900 break-words">
                    {stateJurisdiction}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Principal Address */}
        {principalAddress && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="text-gray-800 font-semibold mb-3">Principal Address</h5>
            <div>
              <p className="text-base font-semibold text-gray-900 break-words">
                {principalAddress}
              </p>
            </div>
          </div>
        )}
      </div>
    </VerificationResultShell>
  );
}

    // Fastag (RC): fetch-fastag — show structured fastag details
    if (serviceKey === "fastag-fetch-detailed") {
  const data = (result as any).data || result;
  const fastagData = data.vehicle_fastag_data || {};

  const rcNumber = fastagData.rc_number;
  const activeTagAge = fastagData.active_tag_age;
  const tagsSummary = fastagData.tags_summary || {};
  const fastagRecords = fastagData.fastag_records || [];

  // ✅ Extract main fields
  const detailRows: { label: string; value?: any }[] = [
    { label: "RC Number", value: rcNumber },
    { label: "Active Tag Age", value: activeTagAge },
    { label: "Total Tags", value: tagsSummary.total_tags },
    { label: "Active Tags", value: tagsSummary.active_tags },
    { label: "Inactive Tags", value: tagsSummary.inactive_tags },
  ].filter((r) => r.value !== undefined && r.value !== null && r.value !== "");

  // ✅ Meta IDs
  const requestId = data.request_id || data.requestId;
  const transactionId = data.transaction_id || data.transactionId;
  const referenceId = data.reference_id || data.referenceId;
  const message = data.message || "FASTag details fetched";

  // ✅ Build PDF export lines
  const pdfLines: string[] = [];
  pdfLines.push(`${serviceName || "FASTag Verification"}`);
  pdfLines.push("Verification Successful");
  pdfLines.push("");

  // Summary Info
  pdfLines.push("FASTag SUMMARY");
  detailRows.forEach(({ label, value }) => {
    pdfLines.push(`${label}: ${String(value)}`);
  });

  // FASTag Records
  if (Array.isArray(fastagRecords) && fastagRecords.length > 0) {
    pdfLines.push("");
    pdfLines.push("FASTag RECORDS");
    fastagRecords.forEach((rec, i) => {
      pdfLines.push(`--- Tag ${i + 1} ---`);
      if (rec.tag_id) pdfLines.push(`Tag ID: ${rec.tag_id}`);
      if (rec.tag_status) pdfLines.push(`Status: ${rec.tag_status}`);
      if (rec.vehicle_class) pdfLines.push(`Vehicle Class: ${rec.vehicle_class}`);
      if (rec.issuer_bank) pdfLines.push(`Issuer Bank: ${rec.issuer_bank}`);
      if (rec.issue_date) pdfLines.push(`Issue Date: ${rec.issue_date}`);
      if (rec.action) pdfLines.push(`Action: ${rec.action}`);
      pdfLines.push(""); // spacing
    });
  }

  return (
    <VerificationResultShell
      serviceName={serviceName}
      serviceDescription={serviceDescription}
      message={message}
      isValid={true}
      requestId={requestId}
      transactionId={transactionId}
      referenceId={referenceId}
      result={result}
      onReset={handleReset}
      targetRef={shareTargetRef}
      summary={pdfLines.join("\n")}
    >
      <div ref={shareTargetRef} className="bg-white rounded-lg p-6 border border-green-200">
        {/* Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detailRows.map((row, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border bg-white border-gray-200"
            >
              <div className="text-sm text-gray-500">{row.label}</div>
              <div className="mt-1 font-medium text-gray-900 break-words">
                {String(row.value)}
              </div>
            </div>
          ))}
        </div>

        {/* FASTag Records */}
        {Array.isArray(fastagRecords) && fastagRecords.length > 0 && (
          <div className="space-y-3 mt-6">
            <h4 className="text-lg font-semibold text-gray-900">FASTag Records</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fastagRecords.map((rec: any, i: number) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border bg-white border-gray-200 space-y-2"
                >
                  <div>
                    <div className="text-sm text-gray-500">Tag ID</div>
                    <div className="font-medium text-gray-900 break-all">{rec.tag_id}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-sm text-gray-500">Status</div>
                      <div className="text-gray-900">{rec.tag_status}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Vehicle Class</div>
                      <div className="text-gray-900">{rec.vehicle_class}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Issuer Bank</div>
                    <div className="text-gray-900">{rec.issuer_bank}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Issue Date</div>
                    <div className="text-gray-900">{rec.issue_date}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Action</div>
                    <div className="text-gray-900">{rec.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </VerificationResultShell>
  );
}

    // RC Lite (Vehicle RC): fetch-lite — show RC, owner, insurance, PUCC, vehicle details
    if (serviceKey === "fetch-lite") {
  const data = result.data || result;
  const rc = data.rc_data || {};

  const owner = rc.owner_data || {};
  const pucc = rc.pucc_data || {};
  const insurance = rc.insurance_data || {};
  const vehicle = rc.vehicle_data || {};

  // ✅ Extract main RC fields
  const detailRows: { label: string; value?: string | boolean }[] = [
    { label: "Document Type", value: rc.document_type },
    { label: "RC Number", value: rc.document_id },
    { label: "Owner Name", value: owner.name },
    { label: "Father's Name", value: owner.father_name },
    { label: "Present Address", value: owner.present_address },
    { label: "Permanent Address", value: owner.permanent_address },
    { label: "Issue Date", value: rc.issue_date },
    { label: "Expiry Date", value: rc.expiry_date },
    { label: "Registered At", value: rc.registered_at },
    { label: "Status", value: rc.status },
    {
      label: "Blacklist Status",
      value:
        rc.blacklist_status === "false" || rc.blacklist_status === false
          ? "Not Blacklisted"
          : rc.blacklist_status === "true" || rc.blacklist_status === true
          ? "Blacklisted"
          : "Unknown",
    },
    { label: "Norms Type", value: rc.norms_type },
    { label: "Tax End Date", value: rc.tax_end_date },
    { label: "Is Commercial", value: rc.is_commercial },
  ].filter((r) => r.value !== undefined && r.value !== null && r.value !== "");

  // ✅ Meta IDs
  const requestId = data.request_id || data.requestId;
  const transactionId = data.transaction_id || data.transactionId;
  const referenceId = data.reference_id || data.referenceId;
  const message = data.message || "Vehicle details fetched";

  // ✅ Build PDF export lines
  const pdfLines: string[] = [];
  pdfLines.push(`${serviceName || "RC Verification"}`);
  pdfLines.push("Verification Successful");
  pdfLines.push("");

  // Add RC & Owner details
  pdfLines.push("RC & OWNER DETAILS");
  detailRows.forEach(({ label, value }) => {
    const displayValue =
      typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : String(value);
    pdfLines.push(`${label}: ${displayValue}`);
  });

  // Add PUCC
  if (Object.keys(pucc).length > 0) {
    pdfLines.push("");
    pdfLines.push("PUCC DETAILS");
    if (pucc.pucc_number)
      pdfLines.push(`PUCC Number: ${pucc.pucc_number}`);
    if (pucc.expiry_date)
      pdfLines.push(`Expiry Date: ${pucc.expiry_date}`);
  }

  // Add Insurance
  if (Object.keys(insurance).length > 0) {
    pdfLines.push("");
    pdfLines.push("INSURANCE DETAILS");
    if (insurance.policy_number)
      pdfLines.push(`Policy Number: ${String(insurance.policy_number).replace(/,+$/, "").trim()}`);
    if (insurance.company)
      pdfLines.push(`Company: ${insurance.company}`);
    if (insurance.expiry_date)
      pdfLines.push(`Expiry Date: ${insurance.expiry_date}`);
  }

  // Add Vehicle
  if (Object.keys(vehicle).length > 0) {
    pdfLines.push("");
    pdfLines.push("VEHICLE DETAILS");
    Object.entries(vehicle).forEach(([key, value]) => {
      if (!value && value !== 0) return;

      let label = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      label = label
        .replace("Cubic Capacity", "Engine Capacity (CC)")
        .replace("Unladen Weight", "Kerb Weight (kg)")
        .replace("Gross Weight", "GVW (kg)")
        .replace("Number Of Cylinders", "Cylinders");

      pdfLines.push(`${label}: ${String(value)}`);
    });
  }

  return (
    <VerificationResultShell
      serviceName={serviceName}
      serviceDescription={serviceDescription}
      message={message}
      isValid={true}
      requestId={requestId}
      transactionId={transactionId}
      referenceId={referenceId}
      result={result}
      onReset={handleReset}
      targetRef={shareTargetRef}
      summary={pdfLines.join("\n")}
    >
      <div ref={shareTargetRef} className="bg-white rounded-lg p-6 border border-green-200 space-y-8">
        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detailRows.map((row, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border bg-gray-50 border-gray-200"
            >
              <div className="text-sm font-medium text-gray-600">
                {row.label}
              </div>
              <div className="mt-1 font-semibold text-gray-900 break-words">
                {typeof row.value === "boolean"
                  ? row.value
                    ? "Yes"
                    : "No"
                  : String(row.value)}
              </div>
            </div>
          ))}
        </div>

        {/* PUCC */}
        {Object.keys(pucc).length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">PUCC Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pucc.pucc_number && (
                <div className="p-4 rounded-xl border bg-gray-50 border-gray-200">
                  <div className="text-sm font-medium text-gray-600">PUCC Number</div>
                  <div className="mt-1 font-semibold text-gray-900">{pucc.pucc_number}</div>
                </div>
              )}
              {pucc.expiry_date && (
                <div className="p-4 rounded-xl border bg-gray-50 border-gray-200">
                  <div className="text-sm font-medium text-gray-600">Expiry Date</div>
                  <div className="mt-1 font-semibold text-gray-900">{pucc.expiry_date}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Insurance */}
        {Object.keys(insurance).length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Insurance Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insurance.policy_number && (
                <div className="p-4 rounded-xl border bg-gray-50 border-gray-200">
                  <div className="text-sm font-medium text-gray-600">Policy Number</div>
                  <div className="mt-1 font-semibold text-gray-900">
                    {String(insurance.policy_number).replace(/,+$/, "").trim()}
                  </div>
                </div>
              )}
              {insurance.company && (
                <div className="p-4 rounded-xl border bg-gray-50 border-gray-200">
                  <div className="text-sm font-medium text-gray-600">Company</div>
                  <div className="mt-1 font-semibold text-gray-900">{insurance.company}</div>
                </div>
              )}
              {insurance.expiry_date && (
                <div className="p-4 rounded-xl border bg-gray-50 border-gray-200">
                  <div className="text-sm font-medium text-gray-600">Expiry Date</div>
                  <div className="mt-1 font-semibold text-gray-900">{insurance.expiry_date}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vehicle */}
        {Object.keys(vehicle).length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Vehicle Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(vehicle).map(([key, value]) => {
                if (!value && value !== 0) return null;

                const label = key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())
                  .replace("Cubic Capacity", "Engine Capacity (CC)")
                  .replace("Unladen Weight", "Kerb Weight (kg)")
                  .replace("Gross Weight", "GVW (kg)")
                  .replace("Number Of Cylinders", "Cylinders");

                return (
                  <div
                    key={key}
                    className="p-4 rounded-xl border bg-gray-50 border-gray-200"
                  >
                    <div className="text-sm font-medium text-gray-600">{label}</div>
                    <div className="mt-1 font-semibold text-gray-900 break-words">
                      {String(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </VerificationResultShell>
  );
}

    // RC Detailed Verification: fetch-detailed — show all RC, owner, insurance, PUCC, vehicle details
    if (serviceKey === "fetch-detailed") {
  const data = (result as any).data || result;
  const rc = data.rc_data || {};

  const owner = rc.owner_data || {};
  const pucc = rc.pucc_data || {};
  const insurance = rc.insurance_data || {};
  const vehicle = rc.vehicle_data || {};

  // ✅ Extract main RC fields
  const detailRows: { label: string; value?: any }[] = [
    { label: "Document Type", value: rc.document_type },
    { label: "RC Number", value: rc.document_id },
    { label: "Owner Name", value: owner.name },
    { label: "Serial", value: owner.serial },
    { label: "Present Address", value: owner.present_address },
    { label: "Permanent Address", value: owner.permanent_address },
    { label: "Issue Date", value: rc.issue_date },
    { label: "Expiry Date", value: rc.expiry_date },
    { label: "Registered At", value: rc.registered_at },
    { label: "Status", value: rc.status },
    { label: "Blacklist Status", value: rc.blacklist_status },
    { label: "Norms Type", value: rc.norms_type },
    { label: "Tax End Date", value: rc.tax_end_date },
    { label: "Is Commercial", value: rc.is_commercial },
  ].filter((r) => r.value !== undefined && r.value !== null && r.value !== "");

  // ✅ Meta IDs
  const requestId = data.request_id || data.requestId;
  const transactionId = data.transaction_id || data.transactionId;
  const referenceId = data.reference_id || data.referenceId;
  const message = data.message || "Vehicle details fetched";

  // ✅ Build PDF export lines
  const pdfLines: string[] = [];
  pdfLines.push(`${serviceName || "RC Verification"}`);
  pdfLines.push("Verification Successful");
  pdfLines.push("");

  // Add RC & Owner details
  pdfLines.push("RC & OWNER DETAILS");
  detailRows.forEach(({ label, value }) => {
    const displayValue = typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
    pdfLines.push(`${label}: ${displayValue}`);
  });

  // Add PUCC
  if (Object.keys(pucc).length > 0) {
    pdfLines.push("");
    pdfLines.push("PUCC DETAILS");
    Object.entries(pucc).forEach(([key, value]) => {
      const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      pdfLines.push(`${label}: ${String(value)}`);
    });
  }

  // Add Insurance
  if (Object.keys(insurance).length > 0) {
    pdfLines.push("");
    pdfLines.push("INSURANCE DETAILS");
    Object.entries(insurance).forEach(([key, value]) => {
      const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      pdfLines.push(`${label}: ${String(value)}`);
    });
  }

  // Add Vehicle
  if (Object.keys(vehicle).length > 0) {
    pdfLines.push("");
    pdfLines.push("VEHICLE DETAILS");
    Object.entries(vehicle).forEach(([key, value]) => {
      let label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      // Custom readable labels
      label = label
        .replace("Cubic Capacity", "Engine Capacity (CC)")
        .replace("Unladen Weight", "Kerb Weight (kg)")
        .replace("Gross Weight", "Gross Vehicle Weight (kg)")
        .replace("Number Of Cylinders", "Cylinders");
      pdfLines.push(`${label}: ${String(value)}`);
    });
  }

  return (
    <VerificationResultShell
      serviceName={serviceName}
      serviceDescription={serviceDescription}
      message={message}
      isValid={true}
      requestId={requestId}
      transactionId={transactionId}
      referenceId={referenceId}
      result={result}
      onReset={handleReset}
      targetRef={shareTargetRef}
      summary={pdfLines.join("\n")}
    >
      <div ref={shareTargetRef} className="bg-white rounded-lg p-6 border border-green-200 space-y-6">
        {/* Owner & RC Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detailRows.map((row, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border bg-white border-gray-200"
            >
              <div className="text-sm text-gray-500">{row.label}</div>
              <div className="mt-1 font-medium text-gray-900 break-words">
                {typeof row.value === "boolean" ? (row.value ? "Yes" : "No") : String(row.value)}
              </div>
            </div>
          ))}
        </div>

        {/* PUCC Details */}
        {Object.keys(pucc).length > 0 && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900">PUCC Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(pucc).map(([k, v]) => (
                <div
                  key={k}
                  className="p-4 rounded-xl border bg-white border-gray-200"
                >
                  <div className="text-sm text-gray-500">
                    {k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </div>
                  <div className="mt-1 font-medium text-gray-900 break-words">
                    {String(v)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insurance Details */}
        {Object.keys(insurance).length > 0 && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900">Insurance Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(insurance).map(([k, v]) => (
                <div
                  key={k}
                  className="p-4 rounded-xl border bg-white border-gray-200"
                >
                  <div className="text-sm text-gray-500">
                    {k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </div>
                  <div className="mt-1 font-medium text-gray-900 break-words">
                    {String(v)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vehicle Details */}
        {Object.keys(vehicle).length > 0 && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900">Vehicle Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(vehicle).map(([k, v]) => {
                let label = k
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase());
                label = label
                  .replace("Cubic Capacity", "Engine Capacity (CC)")
                  .replace("Unladen Weight", "Kerb Weight (kg)")
                  .replace("Gross Weight", "Gross Vehicle Weight (kg)")
                  .replace("Number Of Cylinders", "Cylinders");
                return (
                  <div
                    key={k}
                    className="p-4 rounded-xl border bg-white border-gray-200"
                  >
                    <div className="text-sm text-gray-500">{label}</div>
                    <div className="mt-1 font-medium text-gray-900 break-words">
                      {String(v)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </VerificationResultShell>
  );
}

    // RC Detailed Verification: fetch-detailed-challan — show all RC, owner, insurance, PUCC, vehicle details
    if (serviceKey === "fetch-detailed-challan") {
      const data = result.data || result;
      const rc = data.rc_data || {};

      const owner = rc.owner_data || {};
      const pucc = rc.pucc_data || {};
      const insurance = rc.insurance_data || {};
      const vehicle = rc.vehicle_data || {};

      // ✅ Extract main RC fields
      const detailRows: { label: string; value?: string | number | boolean }[] =
        [
          { label: "Document Type", value: rc.document_type },
          { label: "RC Number", value: rc.document_id },
          { label: "Owner Name", value: owner.name },
          { label: "Father's Name", value: owner.father_name },
          { label: "Serial", value: owner.serial },
          { label: "Present Address", value: owner.present_address },
          { label: "Permanent Address", value: owner.permanent_address },
          { label: "Issue Date", value: rc.issue_date },
          { label: "Expiry Date", value: rc.expiry_date },
          { label: "Registered At", value: rc.registered_at },
          { label: "Status", value: rc.status },
          { label: "Norms Type", value: rc.norms_type },
          { label: "Tax End Date", value: rc.tax_end_date },
          { label: "Financed", value: rc.financed },
        ].filter(
          (r) => r.value !== undefined && r.value !== null && r.value !== ""
        );

      // ✅ Build plain text lines for PDF/clipboard
      const pdfLines: string[] = [];

      // Add header
      pdfLines.push(`${serviceName || "Vehicle Verification"}`);
      pdfLines.push("Verification Successful");
      pdfLines.push("");
      pdfLines.push("RC & OWNER DETAILS");

      // Add detail rows
      detailRows.forEach(({ label, value }) => {
        const displayValue =
          typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
        pdfLines.push(`${label}: ${displayValue}`);
      });

      // Add PUCC
      if (Object.keys(pucc).length > 0) {
        pdfLines.push("");
        pdfLines.push("PUCC DETAILS");
        Object.entries(pucc).forEach(([key, value]) => {
          const label = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          pdfLines.push(`${label}: ${String(value)}`);
        });
      }

      // Add Insurance
      if (Object.keys(insurance).length > 0) {
        pdfLines.push("");
        pdfLines.push("INSURANCE DETAILS");
        Object.entries(insurance).forEach(([key, value]) => {
          const label = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          pdfLines.push(`${label}: ${String(value)}`);
        });
      }

      // Add Vehicle
      if (Object.keys(vehicle).length > 0) {
        pdfLines.push("");
        pdfLines.push("VEHICLE DETAILS");
        Object.entries(vehicle).forEach(([key, value]) => {
          let label = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          // Custom readable labels
          label = label
            .replace("Cubic Capacity", "Engine Capacity (CC)")
            .replace("Unladen Weight", "Kerb Weight (kg)")
            .replace("Gross Weight", "Gross Vehicle Weight (kg)")
            .replace("Number Of Cylinders", "Cylinders");
          pdfLines.push(`${label}: ${String(value)}`);
        });
      }

      // Meta
      const requestId = data.request_id || data.requestId;
      const transactionId = data.transaction_id || data.transactionId;
      const referenceId = data.reference_id || data.referenceId;
      const message = data.message || "Vehicle details extracted";

      return (
        <VerificationResultShell
          serviceName={serviceName}
          serviceDescription={serviceDescription}
          message={message}
          isValid={true}
          requestId={requestId}
          transactionId={transactionId}
          referenceId={referenceId}
          result={result}
          onReset={handleReset}
          targetRef={shareTargetRef} // ✅ Pass ref
          summary={pdfLines.join("\n")}
        >
          {/* Pass pdfLines to ShareActions via summary */}
          <div
            ref={shareTargetRef}
            className="bg-white rounded-lg p-6 border border-green-200 space-y-8"
          >
            {/* RC & Owner Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detailRows.map((row, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border bg-gray-50 border-gray-200"
                >
                  <div className="text-sm font-medium text-gray-600">
                    {row.label}
                  </div>
                  <div className="mt-1 font-semibold text-gray-900 break-words">
                    {typeof row.value === "boolean"
                      ? row.value
                        ? "Yes"
                        : "No"
                      : String(row.value)}
                  </div>
                </div>
              ))}
            </div>

            {/* PUCC Details */}
            {Object.keys(pucc).length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  PUCC Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(pucc).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-4 rounded-xl border bg-gray-50 border-gray-200"
                    >
                      <div className="text-sm font-medium text-gray-600">
                        {key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </div>
                      <div className="mt-1 font-semibold text-gray-900 break-words">
                        {String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insurance Details */}
            {Object.keys(insurance).length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Insurance Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(insurance).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-4 rounded-xl border bg-gray-50 border-gray-200"
                    >
                      <div className="text-sm font-medium text-gray-600">
                        {key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </div>
                      <div className="mt-1 font-semibold text-gray-900 break-words">
                        {String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vehicle Details */}
            {Object.keys(vehicle).length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Vehicle Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(vehicle).map(([key, value]) => {
                    let label = key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase());
                    label = label
                      .replace("Cubic Capacity", "Engine Capacity (CC)")
                      .replace("Unladen Weight", "Kerb Weight (kg)")
                      .replace("Gross Weight", "Gross Vehicle Weight (kg)")
                      .replace("Number Of Cylinders", "Cylinders");
                    return (
                      <div
                        key={key}
                        className="p-4 rounded-xl border bg-gray-50 border-gray-200"
                      >
                        <div className="text-sm font-medium text-gray-600">
                          {label}
                        </div>
                        <div className="mt-1 font-semibold text-gray-900 break-words">
                          {String(value)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </VerificationResultShell>
      );
    }

    // E-Challan: echallan-fetch
    if (serviceKey === "echallan-fetch") {
      const data = result.data || result;
      const challans: {
        document_id?: string;
        document_type?: string;
        date_issued?: string;
        status?: string;
        accused_name?: string;
        state?: string;
        area_name?: string;
        amount?: string | number;
        offence_data?: { offence_description: string }[];
      }[] = Array.isArray(data.challan_data) ? data.challan_data : [];

      const totalChallans = challans.length;
      const totalAmount = challans.reduce(
        (sum, c) => sum + (Number(c.amount) || 0),
        0
      );

      // ✅ Meta IDs
      const requestId = data.request_id || data.requestId;
      const transactionId = data.transaction_id || data.transactionId;
      const referenceId = data.reference_id || data.referenceId;
      const message = data.message || "Challan details fetched";

      // ✅ Build PDF export lines
      const pdfLines: string[] = [];
      pdfLines.push(`${serviceName || "E-Challan Verification"}`);
      pdfLines.push("Verification Successful");
      pdfLines.push("");
      pdfLines.push(`Total Challans: ${totalChallans}`);
      pdfLines.push(`Total Amount Due: ₹${totalAmount}`);
      pdfLines.push("");

      challans.forEach((c, idx) => {
        pdfLines.push(`--- Challan ${idx + 1} ---`);
        pdfLines.push(`Challan ID: ${c.document_id || "Not Available"}`);
        if (c.document_type) pdfLines.push(`Type: ${c.document_type}`);
        pdfLines.push(`Issued On: ${c.date_issued || "—"}`);
        pdfLines.push(`Status: ${c.status || "Pending"}`);
        pdfLines.push(`Accused Name: ${c.accused_name || "Not Provided"}`);
        pdfLines.push(`State: ${c.state || "—"}`);
        if (c.area_name) pdfLines.push(`Area: ${c.area_name}`);
        pdfLines.push(`Amount: ₹${Number(c.amount) || 0}`);

        (c.offence_data || []).forEach((offence, i) => {
          pdfLines.push(
            `Offence ${i + 1}: ${
              offence.offence_description || `Offence #${i + 1}`
            }`
          );
        });
        pdfLines.push("");
      });

      return (
        <VerificationResultShell
          serviceName={serviceName}
          serviceDescription={serviceDescription}
          message={message}
          isValid={true}
          requestId={requestId}
          transactionId={transactionId}
          referenceId={referenceId}
          result={result}
          onReset={handleReset}
          targetRef={shareTargetRef}
          summary={pdfLines.join("\n")}
        >
          <div ref={shareTargetRef} className="space-y-6">
            {/* Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6 flex flex-wrap items-center gap-6">
              <div>
                <div className="text-sm text-gray-500">Total Challans</div>
                <div className="text-lg font-semibold text-gray-900">
                  {totalChallans}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Amount</div>
                <div className="text-lg font-semibold text-red-600">
                  ₹{totalAmount}
                </div>
              </div>
            </div>

            {/* Challan List */}
            {challans.length > 0 ? (
              <div className="space-y-4">
                {challans.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border bg-white border-gray-200 shadow-sm"
                  >
                    {/* ... same UI ... */}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">
                No challans found.
              </p>
            )}
          </div>
        </VerificationResultShell>
      );
    }

    // RC Registration Number by Chassis: fetch-reg-num-by-chassis
    if (serviceKey === "fetch-reg-num-by-chassis") {
      const data = (result as any).data || result;
      const vehicles: any[] = data.vehicle_details || [];

      // ✅ Meta IDs
      const requestId = data.request_id || data.requestId;
      const transactionId = data.transaction_id || data.transactionId;
      const referenceId = data.reference_id || data.referenceId;
      const message = data.message || "Vehicle details fetched";

      // ✅ Build PDF export lines
      const pdfLines: string[] = [];
      pdfLines.push(`${serviceName || "RC by Chassis Verification"}`);
      pdfLines.push("Verification Successful");
      pdfLines.push("");

      if (vehicles.length > 0) {
        pdfLines.push("VEHICLE DETAILS");
        vehicles.forEach((v, idx) => {
          pdfLines.push(`--- Vehicle ${idx + 1} ---`);
          pdfLines.push(
            `RC Registration Number: ${v.rc_registration_number || "—"}`
          );
          pdfLines.push(`Chassis Number: ${v.chassis_number || "—"}`);
        });
      } else {
        pdfLines.push("No vehicle details found.");
      }

      return (
        <VerificationResultShell
          serviceName={serviceName}
          serviceDescription={serviceDescription}
          message={message}
          isValid={true}
          requestId={requestId}
          transactionId={transactionId}
          referenceId={referenceId}
          result={result}
          onReset={handleReset}
          targetRef={shareTargetRef}
          summary={pdfLines.join("\n")}
        >
          <div ref={shareTargetRef} className="space-y-6">
            {/* Vehicle Details */}
            {vehicles.length > 0 ? (
              <div className="bg-white rounded-lg p-6 border border-green-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Vehicle Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicles.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border bg-white border-gray-200"
                    >
                      <div className="text-sm text-gray-500">
                        RC Registration Number
                      </div>
                      <div className="mt-1 font-medium text-gray-900 break-words">
                        {v.rc_registration_number || "—"}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Chassis Number
                      </div>
                      <div className="mt-1 font-medium text-gray-900 break-words">
                        {v.chassis_number || "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">
                No vehicle details found.
              </p>
            )}
          </div>
        </VerificationResultShell>
      );
    }

    if (serviceKey === "fetch") {
      const payload = result.data || result;
      const data = payload.data || payload;
      const message =
        data.message || payload.message || "Passport details fetched";
      const passport = data.passport_data || data.passportData || {};

      const requestId = payload.request_id || payload.requestId;
      const transactionId = payload.transaction_id || payload.transactionId;
      const referenceId = payload.reference_id || payload.referenceId;

      // ✅ Build PDF export lines (only what’s shown in UI)
      const pdfLines: string[] = [];
      pdfLines.push(`${serviceName || "Passport Verification"}`);
      pdfLines.push("Verification Successful");
      pdfLines.push("");

      pdfLines.push("PASSPORT DETAILS");
      if (passport.document_type)
        pdfLines.push(`Document Type: ${passport.document_type}`);
      if (passport.document_id)
        pdfLines.push(`Document ID: ${passport.document_id}`);
      if (passport.file_number)
        pdfLines.push(`File Number: ${passport.file_number}`);
      if (passport.first_name)
        pdfLines.push(`First Name: ${passport.first_name}`);
      if (passport.last_name) pdfLines.push(`Last Name: ${passport.last_name}`);
      if (passport.date_of_birth)
        pdfLines.push(`Date of Birth: ${passport.date_of_birth}`);
      if (passport.application_received_date)
        pdfLines.push(
          `Application Received: ${passport.application_received_date}`
        );

      return (
        <VerificationResultShell
          serviceName={serviceName}
          serviceDescription={serviceDescription}
          message={message}
          isValid={true}
          requestId={requestId}
          transactionId={transactionId}
          referenceId={referenceId}
          result={result}
          onReset={handleReset}
          targetRef={shareTargetRef}
          summary={pdfLines.join("\n")}
        >
          <div
            ref={shareTargetRef}
            className="bg-white rounded-lg p-6 border border-green-200 space-y-6"
          >
            {/* Passport Card */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Document Type
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {passport.document_type}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Document ID
                  </p>
                  <p className="text-sm font-semibold font-mono text-gray-900">
                    {passport.document_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    File Number
                  </p>
                  <p className="text-sm font-semibold font-mono text-gray-900">
                    {passport.file_number}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    First Name
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {passport.first_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Last Name
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {passport.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Date of Birth
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {passport.date_of_birth}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Application Received
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {passport.application_received_date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </VerificationResultShell>
      );
    }

    if (serviceKey === "mrz-generate") {
      const payload = result.data || result;
      const data = payload.data || payload;
      const message = data.message || payload.message || "MRZ generated";
      const mrz = data.mrz_data || data.mrzData || {};

      const requestId = payload.request_id || payload.requestId;
      const transactionId = payload.transaction_id || payload.transactionId;
      const referenceId = payload.reference_id || payload.referenceId;

      // ✅ Build PDF export lines
      const pdfLines: string[] = [];
      pdfLines.push(`${serviceName || "MRZ Generation"}`);
      pdfLines.push("MRZ Generated Successfully");
      pdfLines.push("");

      if (message) {
        pdfLines.push(`Status: ${message}`);
      }

      if (mrz.first_line) {
        pdfLines.push(`First Line: ${mrz.first_line}`);
      }
      if (mrz.second_line) {
        pdfLines.push(`Second Line: ${mrz.second_line}`);
      }

      return (
        <VerificationResultShell
          serviceName={serviceName}
          serviceDescription={serviceDescription}
          message={message}
          isValid={true}
          requestId={requestId}
          transactionId={transactionId}
          referenceId={referenceId}
          result={result}
          onReset={handleReset}
          targetRef={shareTargetRef}
          summary={pdfLines.join("\n")}
        >
          <div
            ref={shareTargetRef}
            className="bg-white rounded-lg p-6 border border-green-200"
          >
            <h5 className="text-gray-800 font-semibold mb-4">
              Machine-Readable Zone
            </h5>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">
                  First Line
                </p>
                <p className="text-lg font-mono bg-gray-100 rounded px-3 py-2 text-gray-900 break-all">
                  {mrz.first_line}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">
                  Second Line
                </p>
                <p className="text-lg font-mono bg-gray-100 rounded px-3 py-2 text-gray-900 break-all">
                  {mrz.second_line}
                </p>
              </div>
            </div>
          </div>
        </VerificationResultShell>
      );
    }

    if (serviceKey === "mrz-verify") {
      const payload = result.data || result;
      const data = payload.data || payload;
      const message =
        data.message || payload.message || "MRZ verification completed";

      const isMatch = data.code === "1000"; // 1000 = success
      const requestId = payload.request_id || payload.requestId;
      const transactionId = payload.transaction_id || payload.transactionId;
      const referenceId = payload.reference_id || payload.referenceId;

      // ✅ Build PDF export lines
      const pdfLines: string[] = [];
      pdfLines.push(`${serviceName || "MRZ Verification"}`);
      pdfLines.push(
        isMatch ? "MRZ Verified Successfully" : "MRZ Verification Failed"
      );
      pdfLines.push("");
      pdfLines.push(`Status: ${isMatch ? "Matched" : "Mismatched"}`);
      if (message) {
        pdfLines.push(`Message: ${message}`);
      }

      pdfLines.push("");
      pdfLines.push("Verification Result:");
      if (isMatch) {
        pdfLines.push(
          "✅ The provided Machine-Readable Zone is valid and verified."
        );
      } else {
        pdfLines.push(
          "❌ The provided Machine-Readable Zone does not match our records."
        );
      }

      // Include meta IDs if needed
      if (requestId) pdfLines.push(`Request ID: ${requestId}`);
      if (transactionId) pdfLines.push(`Transaction ID: ${transactionId}`);
      if (referenceId) pdfLines.push(`Reference ID: ${referenceId}`);

      return (
        <VerificationResultShell
          serviceName={serviceName}
          serviceDescription={serviceDescription}
          message={message}
          isValid={isMatch} // ✅ true = green success, false = red failure
          requestId={requestId}
          transactionId={transactionId}
          referenceId={referenceId}
          result={result}
          onReset={handleReset}
          targetRef={shareTargetRef}
          summary={pdfLines.join("\n")}
        >
          <div ref={shareTargetRef} className="space-y-6">
            {/* Status Message Block */}
            <div
              className={`rounded-lg p-6 text-center border ${
                isMatch
                  ? "bg-green-100 border-green-200"
                  : "bg-red-100 border-red-200"
              }`}
            >
              {isMatch ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    MRZ Matched
                  </h3>
                  <p className="text-gray-600">
                    The provided Machine-Readable Zone is valid and verified.
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-red-800 mb-2">
                    MRZ Mismatch
                  </h3>
                  <p className="text-gray-600">
                    The provided Machine-Readable Zone does not match our
                    records.
                  </p>
                </>
              )}
            </div>
          </div>
        </VerificationResultShell>
      );
    }

    if (serviceKey === "verify") {
      const payload = result.data || result;
      const data = payload.data || payload;
      const message =
        data.message || payload.message || "Verification completed";

      // 1004 = valid, 1005 = invalid
      const isValid = data.code === "1004";

      const requestId = payload.request_id || payload.requestId;
      const transactionId = payload.transaction_id || payload.transactionId;
      const referenceId = payload.reference_id || payload.referenceId;

      // ✅ Build PDF export lines
      const pdfLines: string[] = [];
      pdfLines.push(`${serviceName || "Verification"}`);
      pdfLines.push(
        isValid ? "Verification Successful" : "Verification Failed"
      );
      pdfLines.push("");

      if (message) {
        pdfLines.push(`Status: ${message}`);
      }

      pdfLines.push("");
      pdfLines.push("Result:");
      if (isValid) {
        pdfLines.push("✅ Details Verified");
        pdfLines.push(
          "The provided passport information is valid and matches our records."
        );
      } else {
        pdfLines.push("❌ Verification Failed");
        pdfLines.push(
          "The provided passport information is invalid or does not match our records."
        );
      }

      // Optional: include request IDs
      if (requestId) pdfLines.push(`\nRequest ID: ${requestId}`);
      if (transactionId) pdfLines.push(`Transaction ID: ${transactionId}`);
      if (referenceId) pdfLines.push(`Reference ID: ${referenceId}`);

      return (
        <VerificationResultShell
          serviceName={serviceName}
          serviceDescription={serviceDescription}
          message={message}
          isValid={isValid}
          requestId={requestId}
          transactionId={transactionId}
          referenceId={referenceId}
          result={result}
          onReset={handleReset}
          targetRef={shareTargetRef}
          summary={pdfLines.join("\n")}
        >
          <div ref={shareTargetRef} className="space-y-6">
            {/* Status Message */}
            <div
              className={`rounded-lg p-6 text-center border ${
                isValid
                  ? "bg-green-100 border-green-200"
                  : "bg-red-100 border-red-200"
              }`}
            >
              {isValid ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    Details Verified
                  </h3>
                  <p className="text-gray-600">
                    The provided passport information is valid and matches our
                    records.
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-red-800 mb-2">
                    Verification Failed
                  </h3>
                  <p className="text-gray-600">
                    The provided passport information is invalid or does not
                    match our records.
                  </p>
                </>
              )}
            </div>
          </div>
        </VerificationResultShell>
      );
    }

    if (serviceKey === "ocr-v2") {
      const data = result.data || result;
      const ocrData = data.ocr_data || {};

      // ✅ Meta IDs
      const requestId = data.request_id || data.requestId;
      const transactionId = data.transaction_id || data.transactionId;
      const referenceId = data.reference_id || data.referenceId;
      const message = data.message || "OCR data extracted";

      // ✅ Build PDF export lines
      const pdfLines: string[] = [];
      pdfLines.push(`${serviceName || "OCR Verification"}`);
      pdfLines.push("Verification Successful");
      pdfLines.push("");

      // Summary Section
      pdfLines.push("PERSONAL INFORMATION");
      if (ocrData.name) pdfLines.push(`Full Name: ${ocrData.name}`);
      if (ocrData.document_id)
        pdfLines.push(`Document ID: ${ocrData.document_id}`);
      if (ocrData.date_of_birth)
        pdfLines.push(`Date of Birth: ${ocrData.date_of_birth}`);
      if (ocrData.gender) pdfLines.push(`Gender: ${ocrData.gender}`);
      if (ocrData.contact_number)
        pdfLines.push(`Contact Number: ${ocrData.contact_number}`);

      // Family Info
      if (ocrData.guardian_name) {
        pdfLines.push("");
        pdfLines.push("FAMILY INFORMATION");
        pdfLines.push(`Guardian Name: ${ocrData.guardian_name}`);
      }

      // Address Info
      if (ocrData.address) {
        pdfLines.push("");
        pdfLines.push("ADDRESS INFORMATION");
        pdfLines.push(ocrData.address);
      }

      return (
        <VerificationResultShell
          serviceName={serviceName}
          serviceDescription={serviceDescription}
          message={message}
          isValid={true}
          requestId={requestId}
          transactionId={transactionId}
          referenceId={referenceId}
          result={result}
          onReset={handleReset}
          targetRef={shareTargetRef}
          summary={pdfLines.join("\n")}
        >
          <div ref={shareTargetRef} className="space-y-6">
            {/* Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div className="text-sm text-gray-500">Document ID</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {ocrData.document_id || "Not Available"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {ocrData.name || "Not Available"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date of Birth</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {ocrData.date_of_birth || "Not Available"}
                  </div>
                </div>
              </div>
            </div>

            {/* OCR Details */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border bg-white border-gray-200 shadow-sm">
                <h5 className="font-semibold text-gray-900 mb-4">
                  Personal Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Full Name</div>
                    <div className="font-semibold text-gray-900">
                      {ocrData.name || "Not Available"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Document ID</div>
                    <div className="font-semibold text-gray-900">
                      {ocrData.document_id || "Not Available"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Date of Birth</div>
                    <div className="font-semibold text-gray-900">
                      {ocrData.date_of_birth || "Not Available"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Gender</div>
                    <div className="font-semibold text-gray-900">
                      {ocrData.gender || "Not Available"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Contact Number</div>
                    <div className="font-semibold text-gray-900">
                      {ocrData.contact_number || "Not Available"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border bg-white border-gray-200 shadow-sm">
                <h5 className="font-semibold text-gray-900 mb-4">
                  Family Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Guardian Name</div>
                    <div className="font-semibold text-gray-900">
                      {ocrData.guardian_name || "Not Available"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border bg-white border-gray-200 shadow-sm">
                <h5 className="font-semibold text-gray-900 mb-4">
                  Address Information
                </h5>
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="font-semibold text-gray-900 mt-1">
                    {ocrData.address || "Not Available"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </VerificationResultShell>
      );
    }

    if (serviceKey === "aadhaar-link") {
      const data = result.data || result;

      // ✅ Extract message and determine status
      const apiMessage =
        data.message || data.status || "Verification completed";
      const isLinked =
        typeof apiMessage === "string"
          ? apiMessage.toLowerCase().includes("linked")
          : false;

      const requestId = data.request_id || data.requestId;
      const transactionId = data.transaction_id || data.transactionId;
      const referenceId = data.reference_id || data.referenceId;

      // ✅ Build PDF export lines
      const pdfLines: string[] = [];
      pdfLines.push(`${serviceName || "Aadhaar-PAN Link Verification"}`);
      pdfLines.push(
        isLinked ? "Verification Successful" : "Verification Failed"
      );
      pdfLines.push("");

      // Status
      pdfLines.push(
        `Status: ${isLinked ? "Linked Successfully" : "Not Linked"}`
      );
      pdfLines.push(
        `Message: ${
          isLinked
            ? "PAN and Aadhaar are successfully linked."
            : "PAN and Aadhaar are NOT linked. Please link them on the Income Tax e-Filing portal."
        }`
      );

      // Optional: include meta IDs
      if (requestId) pdfLines.push(`\nRequest ID: ${requestId}`);
      if (transactionId) pdfLines.push(`Transaction ID: ${transactionId}`);
      if (referenceId) pdfLines.push(`Reference ID: ${referenceId}`);

      return (
        <VerificationResultShell
          serviceName={serviceName}
          serviceDescription={serviceDescription}
          message={apiMessage}
          isValid={isLinked}
          requestId={requestId}
          transactionId={transactionId}
          referenceId={referenceId}
          result={result}
          onReset={handleReset}
          targetRef={shareTargetRef}
          summary={pdfLines.join("\n")}
        >
          <div
            ref={shareTargetRef}
            className="bg-white rounded-lg p-8 border border-gray-200"
          >
            <div className="flex items-center justify-center gap-6">
              {/* Dynamic Icon */}
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isLinked ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {isLinked ? (
                  <Link className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>

              {/* Status Text */}
              <div className="text-center">
                <p
                  className={`text-3xl font-bold mb-2 ${
                    isLinked ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {isLinked ? "Linked Successfully" : "Not Linked"}
                </p>
                <p className="text-gray-600 text-lg">
                  {isLinked
                    ? "PAN and Aadhaar are successfully linked."
                    : "PAN and Aadhaar are NOT linked. Please link them on the Income Tax e-Filing portal."}
                </p>
              </div>
            </div>
          </div>
        </VerificationResultShell>
      );
    }

    // Default clean display for other services - extract key information only
    const data = result.data || result;
    const extractedInfo = [];

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
      });
    }

    if (data.document_number || data.documentNumber || data.id || data.number) {
      extractedInfo.push({
        label: "Document Number",
        value:
          data.document_number || data.documentNumber || data.id || data.number,
        icon: <CreditCard className="w-6 h-6 text-purple-600" />,
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-800",
        valueColor: "text-purple-900",
      });
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
      });
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
      });
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
              <h4 className="font-semibold text-green-800 text-lg">
                Verification Successful
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <ShareActions
                targetRef={shareTargetRef}
                serviceName={serviceName || (serviceKey ?? "Verification")}
                fileName={`${(serviceName || "verification")
                  .toString()
                  .toLowerCase()
                  .replace(/\s+/g, "-")}-details`}
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
                      <p
                        className={`text-sm font-medium ${info.textColor} mb-1`}
                      >
                        {info.label}
                      </p>
                      <p className={`text-lg font-bold ${info.valueColor}`}>
                        {info.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Verification Completed
                </h3>
                <p className="text-gray-600">
                  The verification process has been completed successfully.
                </p>
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
    );
  };

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
        );

      case "file":
        return (
          <div key={field.name} className="space-y-2 w-full">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-blue-400 transition-colors w-full">
              <input
                type="file"
                accept={field.accept || "image/*"}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleFileChange(field.name, file);
                }}
                className="hidden"
                id={`file-input-${field.name}`} // Unique ID for each field
              />
              <label
                htmlFor={`file-input-${field.name}`}
                className="cursor-pointer"
              >
                {formData[field.name] ? (
                  <div className="text-center">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">
                      {formData[field.name].name}
                    </p>
                    <div className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm">
                      Change file
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <div className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm">
                      Choose File
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>
        );

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
                    <p className="text-xs sm:text-sm text-green-600 font-medium">
                      Image captured successfully!
                    </p>
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
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">
                    Capture document image
                  </p>
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
        );

      case "radio":
        return (
          <div key={field.name} className="space-y-3 w-full">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-4 sm:gap-6">
              {field.options?.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={formData[field.name] === option.value}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    required={field.required}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm sm:text-base text-gray-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

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
        );

      default:
        return null;
    }
  };

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
                  <h3 className="text-base sm:text-lg font-semibold">
                    Capture Document
                  </h3>
                  <button
                    onClick={closeCamera}
                    className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <div className="text-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full max-w-sm rounded-lg mb-4 bg-gray-100"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Position the document within the frame
                    </p>
                    <button
                      onClick={() => {
                        const cameraField = fields.find(
                          (f) => f.type === "camera"
                        );
                        if (cameraField) captureImage(cameraField.name);
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
            <ProductReviews
              productId={productId}
              showList={false}
              showStats={false}
              showForm={true}
            />
          </div>
        )}
      </div>
    );
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
                <h3 className="text-base sm:text-lg font-semibold">
                  Capture Document
                </h3>
                <button
                  onClick={closeCamera}
                  className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <div className="text-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-sm rounded-lg mb-4 bg-gray-100"
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Position the document within the frame
                  </p>
                  <button
                    onClick={() => {
                      const cameraField = fields.find(
                        (f) => f.type === "camera"
                      );
                      if (cameraField) captureImage(cameraField.name);
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
              <h4 className="font-medium text-red-800 text-sm sm:text-base">
                Verification Failed
              </h4>
              <p className="text-red-600 text-xs sm:text-sm mt-1 break-words">
                {error}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
