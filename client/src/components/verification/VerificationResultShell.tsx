// VerificationResultShell.tsx
import { motion } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import ShareActions from "./ShareActions";
import React from "react";

interface Props {
  serviceName?: string;
  serviceDescription?: string;
  message?: string;
  isValid?: boolean;
  requestId?: string;
  transactionId?: string;
  referenceId?: string;
  result: any;
  onReset: () => void;
  children: React.ReactNode;
  // 👇 New: Accept ref and summary from parent
  targetRef?: React.RefObject<HTMLDivElement | null>;
  summary?: string; // Plain text to export
}

export const VerificationResultShell: React.FC<Props> = ({
  serviceName,
  serviceDescription,
  message = "Completed",
  isValid = true,
  requestId,
  transactionId,
  referenceId,
  result,
  onReset,
  children,
  targetRef,     // ← Comes from parent (e.g., VerificationForm)
  summary,       // ← Formatted text (e.g., pdfLines.join("\n"))
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Service Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            {/* Optional icon */}
          </div>
          <div>
            <h2 className="text-xl font-bold">{serviceName}</h2>
            <p className="text-blue-100 mt-1">{serviceDescription}</p>
          </div>
        </div>
      </div>

      {/* Main Result Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-6 w-full border ${
          isValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {isValid ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <h4 className={`font-semibold text-lg ${isValid ? "text-green-800" : "text-red-800"}`}>
              {isValid ? "Verification Successful" : "Verification Failed"}
            </h4>
            <span
              className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${
                isValid
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-red-100 text-red-800 border-red-200"
              }`}
            >
              {message}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* ✅ Single Share Button — uses summary */}
            <ShareActions
              targetRef={targetRef} // ← Passed from parent
              serviceName={serviceName || "Verification"}
              fileName={`${(serviceName || "verification").toLowerCase().replace(/\s+/g, "-")}-details`}
              summary={summary} // ✅ Only what's shown in UI
              result={result} // Optional: can be ignored if summary is used
            />
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Verify Another
            </button>
          </div>
        </div>

        {/* Request Info */}
        {(requestId || transactionId || referenceId) && (
          <div className="mb-6 rounded-lg bg-white p-4 border border-gray-200">
            <h5 className="text-gray-800 font-semibold mb-3">Request Info</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {requestId && <InfoRow label="Request ID" value={requestId} />}
              {transactionId && <InfoRow label="Transaction ID" value={transactionId} />}
              {referenceId && <InfoRow label="Reference ID" value={referenceId} />}
            </div>
          </div>
        )}

        {/* Render children inside the result card */}
        {children}
      </motion.div>
    </div>
  );
};

// Reusable component
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 text-sm font-semibold text-gray-900 break-words font-mono">{value}</p>
  </div>
);