import React from "react";
import { VerificationResultShell } from "../VerificationResultShell";

interface CompanyRendererProps {
    result: any;
    serviceName?: string;
    serviceDescription?: string;
    onReset: () => void;
    shareTargetRef: React.RefObject<HTMLDivElement | null>;
}

export const CompanyRenderer: React.FC<CompanyRendererProps> = ({
    result,
    serviceName,
    serviceDescription,
    onReset,
    shareTargetRef,
}) => {
    const data = result.data || result;
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
    const listing = cd.listing;
    const incorporationDate = cd.incorporation_date;
    const lastAgmDate = cd.last_agm_date;
    const balanceSheetDate = cd.balance_sheet_date;
    const activeCompliance = cd.active_compliance;
    const eFilingStatus = cd.efiling_status;
    const authorisedCapital = cd.authorised_capital;
    const paidUpCapital = cd.paid_up_capital;
    const totalObligation = cd.total_obligation;
    const annualReturnFiledDate = cd.annual_return_filed_date;
    const stateVal = cd.state;
    const idType = cd.type;
    const statusCode = data.code;
    const statusMessage = data.message;

    // Meta IDs
    const requestId = data.request_id || data.requestId;
    const transactionId = data.transaction_id || data.transactionId;
    const referenceId = data.reference_id || data.referenceId;

    // Build PDF export lines
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
            onReset={onReset}
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
};
