"use client";

import type React from "react";
import { useRef } from "react";
import { AlertCircle } from "lucide-react";
import { VerificationResultShell } from "./VerificationResultShell";
import { formatLabel, flattenObject } from "../../lib/utils";
import { CompanyRenderer } from "./renderers/CompanyRenderer";
import { BankRenderer } from "./renderers/BankRenderer";

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

interface VerificationResultRendererProps {
    result: unknown;
    serviceKey?: string;
    serviceName?: string;
    serviceDescription?: string;
    onReset: () => void;
}

export const VerificationResultRenderer: React.FC<VerificationResultRendererProps> = ({
    result,
    serviceKey,
    serviceName,
    serviceDescription,
    onReset,
}) => {
    const shareTargetRef = useRef<HTMLDivElement | null>(null);

    if (!result) return null;

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
                onReset={onReset}
                targetRef={shareTargetRef}
                summary={`Verification Failed: ${errorMessage}`}
            >
                <div ref={shareTargetRef} className="bg-red-50 rounded-lg p-6 border border-red-200">
                    <div className="flex flex-col items-center justify-center text-center py-4">
                        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Verification Failed</h3>
                        <p className="text-red-700 max-w-md mx-auto">{errorMessage}</p>
                    </div>
                </div>
            </VerificationResultShell>
        );
    }

    // --- STRATEGY SELECTION ---

    // 1. Company (MCA) Strategy
    if (serviceKey === "fetch-company") {
        return (
            <CompanyRenderer
                result={safeResult}
                serviceName={serviceName}
                serviceDescription={serviceDescription}
                onReset={onReset}
                shareTargetRef={shareTargetRef}
            />
        );
    }

    // 2. Bank Account Strategy
    if (
        serviceKey === "account-verify" ||
        (safeResult &&
            ((safeResult.data && safeResult.data.bank_account_data) ||
                safeResult.bank_account_data))
    ) {
        return (
            <BankRenderer
                result={safeResult}
                serviceName={serviceName}
                serviceDescription={serviceDescription}
                onReset={onReset}
                shareTargetRef={shareTargetRef}
            />
        );
    }

    // 3. Default (Generic) Strategy
    // Handles Passport, PAN, RC, Driving License, Voter ID, GSTIN, etc.
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

    // Try to find a known specific data object
    for (const key of dataKeys) {
        if (mainData[key]) {
            displayData = mainData[key];
            specificDataFound = true;
            break;
        }
    }

    // If no specific object, use the main data but filter out meta fields
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
    const flatDisplayDataRaw = flattenObject(displayData);

    // Clean up redundant prefixes from keys
    const flatDisplayData: Record<string, unknown> = {};
    Object.entries(flatDisplayDataRaw).forEach(([key, value]) => {
        // Remove common redundant prefixes that clutter the UI
        let newKey = key
            .replace(/^vehicle_data\s+/i, "")
            .replace(/^rc_data\s+/i, "")
            .replace(/^data\s+/i, "")
            .replace(/^result\s+/i, "");

        // For insurance/pucc/permit, we might keep the prefix to distinguish "Expiry Date" 
        // but "Vehicle Data" is almost always redundant in this context.

        flatDisplayData[newKey] = value;
    });

    // Build PDF export lines
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
            onReset={onReset}
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
