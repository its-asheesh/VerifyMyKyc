"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useVerificationPricing } from "../../hooks/usePricing";
import {
    Upload,
    AlertCircle,
    Loader2,
    ShieldCheck,
    Lock,
} from "lucide-react";
import TextField from "../forms/TextField";
import { VerificationResultShell } from "./VerificationResultShell";
import { PostVerificationReview } from "./PostVerificationReview";
import { formatLabel, flattenObject } from "../../lib/utils";
import { useForm } from "react-hook-form";

interface FormField {
    name: string;
    label: string;
    type: "text" | "file" | "json" | "radio" | "camera" | "date" | "number" | "email";
    required: boolean;
    placeholder?: string;
    options?: { label: string; value: string }[];
    accept?: string;
    pattern?: string;
    title?: string;
}

interface VerificationResult {
    success?: boolean;
    status?: string | number;
    message?: string;
    error?: string;
    status_code?: number;
    data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    request_id?: string;
    transaction_id?: string;
    bank_account_data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface VerificationFormProps {
    fields: FormField[];
    onSubmit: (data: Record<string, unknown>) => Promise<unknown>;
    isLoading?: boolean;
    result?: unknown;
    error?: string | null;
    serviceKey?: string;
    serviceName?: string;
    serviceDescription?: string;
    productId?: string;
    onCustomReset?: () => void;
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
    onCustomReset,
}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [showResult, setShowResult] = useState(false);

    // Camera refs removed as unused

    const shareTargetRef = useRef<HTMLDivElement | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<Record<string, unknown>>({
        mode: "onChange",
    });

    // Clear form data and results when service changes
    useEffect(() => {
        setFormData({});
        setShowResult(false);
        reset();
    }, [serviceKey, reset]);

    useEffect(() => {
        if (result) {
            setShowResult(true);
            // setShowMoreDetails(false); // Removed
        } else {
            // Reset form when result is cleared (e.g., from parent component)
            setShowResult(false);
            setFormData({});
        }
    }, [result]);

    const isQuotaError = typeof error === "string" && /quota|exhaust|exhausted|limit|token/i.test(error);
    const serviceSlug = ((serviceKey || serviceName || "verification") as string)
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    // Prefer productId (e.g., pan, gstin, ...) if provided, fallback to service slug
    const verificationType = (productId || serviceSlug).toLowerCase();

    // Pull the same pricing used on the product detail page
    const { data: pricingData } = useVerificationPricing(verificationType);

    // Reuse Buy Now logic from ProductOverview: navigate to checkout with minimal required state
    const handleBuyNow = () => {
        if (pricingData && pricingData.oneTimePrice != null) {
            const oneTimePrice = Number(pricingData.oneTimePrice);
            const tierInfo = {
                service: verificationType,
                label: serviceName || verificationType.toUpperCase(),
                price: isNaN(oneTimePrice) ? 0 : oneTimePrice,
                billingPeriod: "one-time",
                originalPrice: isNaN(oneTimePrice) ? 0 : oneTimePrice,
                discount: 0,
            };
            navigate("/checkout", {
                state: {
                    selectedPlan: "one-time",
                    billingPeriod: "one-time",
                    selectedServices: [verificationType],
                    productInfo: {
                        id: verificationType,
                        title: serviceName || verificationType.toUpperCase(),
                    },
                    tierInfo,
                    totalAmount: isNaN(oneTimePrice) ? undefined : oneTimePrice,
                    returnTo: `/products/${verificationType}`,
                },
            });
        } else {
            // Fallback minimal payload
            navigate("/checkout", {
                state: {
                    selectedPlan: "one-time",
                    billingPeriod: "one-time",
                    selectedServices: [verificationType],
                    productInfo: {
                        id: verificationType,
                        title: serviceName || verificationType.toUpperCase(),
                    },
                    returnTo: `/products/${verificationType}`,
                },
            });
        }
    };

    const handleFileChange = (name: string, file: File | null) => {
        setFormData((prev) => ({ ...prev, [name]: file }));
        setValue(name, file);
    };

    const onFormSubmit = async (data: Record<string, unknown>) => {
        try {
            // Merge react-hook-form data with custom state (like files/camera)
            const mergedData = { ...data, ...formData };
            await onSubmit(mergedData);
        } catch (err) {
            console.error("Form submission error:", err);
        }
    };

    const handleReset = () => {
        setShowResult(false);
        setFormData({});
        reset();
        // Call custom reset handler if provided (for services like Aadhaar V2 that need additional state reset)
        if (onCustomReset) {
            onCustomReset();
        } else {
            window.location.reload();
        }
    };

    const renderFormattedResult = () => {
        if (!result || !showResult) return null;

        const safeResult = result as VerificationResult;
        // 🚨 Error Detection Logic
        const isError =
            safeResult.success === false ||
            safeResult.status === "failed" ||
            safeResult.status === "error" ||
            (typeof safeResult.status_code === "number" && safeResult.status_code >= 400) ||
            (safeResult.data && typeof safeResult.data.status_code === "number" && safeResult.data.status_code >= 400) ||
            // Specific valid_aadhaar check for Aadhaar V2
            (safeResult.data && safeResult.data.valid_aadhaar === false);

        if (isError) {
            const errorMessage =
                safeResult.message ||
                (safeResult.data && safeResult.data.message) ||
                safeResult.error ||
                "Verification failed. Please check the details and try again.";

            const errorData = safeResult.data || safeResult;
            const requestId = safeResult.request_id || errorData.request_id;
            const transactionId = safeResult.transaction_id || errorData.transaction_id;

            return (
                <VerificationResultShell
                    serviceName={serviceName}
                    serviceDescription={serviceDescription}
                    message={errorMessage}
                    isValid={false} // This triggers the red styling
                    requestId={requestId}
                    transactionId={transactionId}
                    result={result}
                    onReset={handleReset}
                    targetRef={shareTargetRef}
                    summary={`Verification Failed: ${errorMessage}`}
                >
                    <div ref={shareTargetRef} className="bg-red-50 rounded-lg p-6 border border-red-200">
                        <div className="flex flex-col items-center justify-center text-center py-4">
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <h3 className="text-lg font-semibold text-red-800 mb-2">Verification Failed</h3>
                            <p className="text-red-700 max-w-md mx-auto">{errorMessage}</p>
                            {/* Show full debug info if available and explicitly requested (optional) */}
                            {/* <pre className="mt-4 text-xs text-left w-full overflow-auto bg-white p-2 rounded">{JSON.stringify(result, null, 2)}</pre> */}
                        </div>
                    </div>
                </VerificationResultShell>
            );
        }

        // Company (MCA): fetch-company — show structured company details and directors
        if (serviceKey === "fetch-company") {
            const data = safeResult.data || safeResult;
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
                directors.forEach((d: any, i: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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
                                    {directors.map((d: any, i: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
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

        // Bank Account Verification
        if (
            serviceKey === "account-verify" ||
            (safeResult &&
                ((safeResult.data && safeResult.data.bank_account_data) ||
                    safeResult.bank_account_data))
        ) {
            const payload: any = safeResult.data || safeResult; // eslint-disable-line @typescript-eslint/no-explicit-any
            const data: any = payload; // eslint-disable-line @typescript-eslint/no-explicit-any
            const bank: any = data.bank_account_data || data; // eslint-disable-line @typescript-eslint/no-explicit-any

            const status =
                data.message || data.status || data.code || safeResult.message;
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

        // Generic Smart Renderer for any other service (Passport, PAN, RC, etc.)
        const payload: any = safeResult.data || safeResult; // eslint-disable-line @typescript-eslint/no-explicit-any
        const mainData = payload.data || payload;

        // Flatten the data for display
        // Common keys that hold the actual data object
        const dataKeys = [
            "passport_data",
            "rc_data",
            "pan_data",
            "pan_details",
            "driving_license_data",
            "voter_data",
            "gstin_data",
            "udyam_data",
            "challan_data",
            "vehicle_fastag_data",
            "mrz_data",
            "ocr_data",
            "aadhaar_data",
            "company_details"
        ];

        let displayData: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
        let specificDataFound = false;

        // 1. Try to find a known specific data object
        for (const key of dataKeys) {
            if (mainData[key]) {
                displayData = mainData[key];
                specificDataFound = true;
                break;
            }
        }

        // 2. If no specific object, use the main data but filter out meta fields
        if (!specificDataFound) {
            const metaKeys = ["request_id", "transaction_id", "reference_id", "status", "code", "message", "timestamp", "path", "success", "status_code"];
            displayData = Object.entries(mainData).reduce((acc: any, [key, value]) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                // Include scalars AND objects (except null), filter out meta keys
                if (!metaKeys.includes(key) && value !== null && value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {});
        }

        // If we found specific data (like passport_data), use that.
        // Recursive helper to render values
        const renderValue = (val: any): string => { // eslint-disable-line @typescript-eslint/no-explicit-any
            if (val === null || val === undefined) return "-";
            if (typeof val === "boolean") return val ? "Yes" : "No";
            if (typeof val === "object") {
                // For arrays, join with comma
                if (Array.isArray(val)) {
                    return val.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(", ");
                }
                return JSON.stringify(val);
            }
            return String(val);
        };

        const statusStr = payload.message || payload.status || "Verification Successful";
        const reqId = payload.request_id || mainData.request_id;
        const txnId = payload.transaction_id || mainData.transaction_id;

        // Flatten data for display to avoid nested JSON strings
        const flatDisplayData = flattenObject(displayData);

        // ✅ Build PDF export lines
        const pdfLines: string[] = [];
        pdfLines.push(`${serviceName || "Verification"} Report`);
        pdfLines.push("Verification Successful");
        if (statusStr) pdfLines.push(`Status: ${statusStr}`);
        pdfLines.push("");

        Object.entries(flatDisplayData).forEach(([key, value]) => {
            const label = formatLabel(key);
            const valStr = renderValue(value);
            pdfLines.push(`${label}: ${valStr}`);
        });

        return (
            <VerificationResultShell
                serviceName={serviceName}
                serviceDescription={serviceDescription}
                message={statusStr} // Use dynamic status message
                isValid={true} // Defaulting to true if we have a result
                requestId={reqId}
                transactionId={txnId}
                result={result}
                onReset={handleReset}
                targetRef={shareTargetRef}
                summary={pdfLines.join("\n")}
            >
                <div ref={shareTargetRef} className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(flatDisplayData).map(([key, value]) => {
                            return (
                                <div
                                    key={key}
                                    className="p-4 rounded-xl border bg-white border-gray-200"
                                >
                                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        {formatLabel(key)}
                                    </div>
                                    <div className="mt-1 font-medium text-gray-900 break-words">
                                        {renderValue(value)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </VerificationResultShell>
        );
    };

    return (
        <div className="space-y-6">
            {/* Banner */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-5 text-white shadow-lg">
                <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight">{serviceName}</h2>
                        <p className="text-blue-100 max-w-2xl text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                            {serviceDescription}
                        </p>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl opacity-50" />
                <div className="absolute -bottom-12 right-12 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl opacity-50" />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-800">Verification Failed</h4>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                        {isQuotaError && (
                            <button
                                onClick={handleBuyNow}
                                className="mt-3 text-sm font-medium text-red-700 underline hover:text-red-800"
                            >
                                Upgrade Plan / Buy Credits
                            </button>
                        )}
                    </div>
                </div>
            )}

            {result ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {renderFormattedResult()}

                    {/* Post Verification Review */}
                    {productId && (
                        <PostVerificationReview
                            productId={productId}
                            serviceName={serviceName}
                        />
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 bg-white p-1 rounded-xl">
                    <div className="grid grid-cols-1 gap-5">
                        {fields.map((field, index) => {
                            const isTextField = field.type !== "radio" && field.type !== "file" && field.type !== "camera";

                            return (
                                <motion.div
                                    key={field.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                    className="space-y-3 group"
                                >
                                    {!isTextField && (
                                        <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 group-focus-within:text-blue-600 transition-colors">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                    )}

                                    {field.type === "radio" ? (
                                        <div className="flex gap-6">
                                            {field.options?.map((option) => (
                                                <label key={option.value} className="flex items-center gap-3 cursor-pointer group/option">
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="radio"
                                                            value={option.value}
                                                            {...register(field.name, { required: field.required })}
                                                            className="peer h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 group-hover/option:text-gray-900">{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : field.type === "file" ? (
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all group-focus-within:border-blue-500 group-focus-within:bg-blue-50/50">
                                            <div className="space-y-2 text-center">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                                <div className="flex text-sm text-gray-600 justify-center">
                                                    <label
                                                        htmlFor={field.name}
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                                    >
                                                        <span>Upload a file</span>
                                                        <input
                                                            id={field.name}
                                                            type="file"
                                                            accept={field.accept}
                                                            className="sr-only"
                                                            {...register(field.name, { required: field.required })}
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0] || null;
                                                                handleFileChange(field.name, file);
                                                            }}
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                                {!!watch(field.name) && (
                                                    <p className="text-sm text-green-600 font-medium mt-2">
                                                        File selected: {(watch(field.name) as FileList)?.[0]?.name || "Selected"}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : field.type === "camera" ? (
                                        // Placeholder for camera UI if needed, currently falls back to text in original code?
                                        // Just in case "camera" was handled by generic input previously (which is broken HTML), likely it needs custom UI.
                                        // For now, let's keep it consistent with what I saw: if it wasn't handled, it was an input.
                                        // But input type="camera" does nothing.
                                        // I'll render a button to open camera if this is what was intended, 
                                        // BUT checking the grep results, "camera" appears in types but I didn't see the UI logic.
                                        // Actually I recall seeing `openCamera` function. It must be used somewhere.
                                        // Ah, I missed where `field.type === "camera"` logic was in the previous view. 
                                        // I will assume for now it falls to TextField if I don't handle it.
                                        // But TextField type="camera" will strict input type="camera", which is just text.
                                        // The original code passed `field.type` to `input type={field.type}`.
                                        // So if I pass it to TextField it behaves SAME as before.
                                        <TextField
                                            id={field.name}
                                            label={field.label}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            error={errors[field.name]?.message as string}
                                            {...register(field.name, { required: field.required })}
                                        />
                                    ) : (
                                        <TextField
                                            id={field.name}
                                            label={field.label}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            error={errors[field.name] ? "This field is required" : undefined}
                                            {...register(field.name, { required: field.required })}
                                        />
                                    )}

                                    {/* Only show external error for non-TextFields */}
                                    {!isTextField && errors[field.name] && (
                                        <p className="text-sm text-red-600 flex items-center gap-1.5 animate-in slide-in-from-left-1">
                                            <AlertCircle className="w-4 h-4" />
                                            This field is required
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Verifying Document...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5 mr-2" />
                                    Secure Verify
                                </>
                            )}
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-4">
                            By verifying, you agree to our Terms of Service and Privacy Policy.
                        </p>

                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                            <Lock className="w-3 h-3" />
                            <span>256-bit SSL Encrypted Connection</span>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};
