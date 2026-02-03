import React from "react";
import { VerificationResultShell } from "../VerificationResultShell";

interface BankRendererProps {
    result: any;
    serviceName?: string;
    serviceDescription?: string;
    onReset: () => void;
    shareTargetRef: React.RefObject<HTMLDivElement | null>;
}

export const BankRenderer: React.FC<BankRendererProps> = ({
    result,
    serviceName,
    serviceDescription,
    onReset,
    shareTargetRef,
}) => {
    const payload: any = result.data || result;
    const data: any = payload;
    const bank: any = data.bank_account_data || data;

    const status =
        data.message || data.status || data.code || result.message;
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

    // Build PDF export lines
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
            onReset={onReset}
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
};
