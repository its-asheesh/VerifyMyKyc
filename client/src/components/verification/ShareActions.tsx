"use client";

import React, { useState, useRef, useCallback } from "react";
import { Share2 } from "lucide-react";
import {
  generateVerificationPdf,
  filterShareTextLines,
  parseVerificationSummary
} from "../../lib/pdfGenerator";

export interface ShareActionsProps {
  targetRef?: React.RefObject<HTMLDivElement | null> | React.MutableRefObject<HTMLDivElement | null>;
  serviceName: string;
  fileName?: string;
  summary?: string; // Plain text (preferred)
  result?: unknown; // Only fallback; not used directly
}

const ShareActions: React.FC<ShareActionsProps> = ({
  serviceName,
  fileName,
  summary,
}) => {
  // Safely generate filename
  const safeTitle = (fileName || `${serviceName || "verification"}-details`).replace(/\s+/g, "-");

  // Share menu state
  const [shareOpen, setShareOpen] = useState(false);
  const shareBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!shareOpen) return;
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        shareBtnRef.current &&
        !shareBtnRef.current.contains(target)
      ) {
        setShareOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [shareOpen]);

  // ✅ Build full share text with company info
  const buildShareText = useCallback((): string => {
    const lines = parseVerificationSummary(summary);
    const filteredLines = filterShareTextLines(lines);

    const companyInfo = `VerifyMyKyc - Navigant Digital Private Limited
A 24/5, Mohan Cooperative Industrial Area, Badarpur, Second Floor
New Delhi 110044, India
Phone: +91 9990010601 | Email: verifymykyc@navigantinc.com

${serviceName} Verification - Verification Successful

${filteredLines.join("\n")}`;

    return companyInfo;
  }, [serviceName, summary]);

  // ✅ Trigger file download
  const triggerDownload = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ✅ Email handler
  const handleEmail = async () => {
    setShareOpen(false);
    const subject = `${serviceName} Verification Result`;
    const bodyText = buildShareText() + "\n\nSent from VerifyMyKyc";

    try {
      const blob = await generateVerificationPdf(serviceName, summary || "");
      if (blob && "canShare" in navigator && (navigator as any).canShare({ files: [new File([blob], "report.pdf")] })) { // eslint-disable-line @typescript-eslint/no-explicit-any
        const file = new File([blob], `${safeTitle}.pdf`, { type: "application/pdf" });
        await (navigator as any).share({ title: `${serviceName} Result`, text: bodyText, files: [file] }); // eslint-disable-line @typescript-eslint/no-explicit-any
        return;
      }
      // Fallback: download PDF
      if (blob) triggerDownload(blob, `${safeTitle}.pdf`);
    } catch (err) {
      console.warn("PDF download failed", err);
    }

    // Final fallback: mailto
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  };

  // ✅ System Share (Web Share API)
  const handleShareSystem = async () => {
    setShareOpen(false);
    const text = buildShareText();

    try {
      const blob = await generateVerificationPdf(serviceName, summary || "");
      const file = new File([blob!], `${safeTitle}.pdf`, { type: "application/pdf" });

      if ("canShare" in navigator && (navigator as any).canShare({ files: [file] })) { // eslint-disable-line @typescript-eslint/no-explicit-any
        await (navigator as any).share({ title: `${serviceName} Result`, text, files: [file] }); // eslint-disable-line @typescript-eslint/no-explicit-any
        return;
      }

      if (navigator.share) {
        await navigator.share({ title: `${serviceName} Result`, text });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Details copied to clipboard.");
      }
    } catch (err) {
      console.error("Share failed:", err);
      alert("Sharing not supported or blocked.");
    }
  };

  // ✅ WhatsApp
  const handleWhatsAppShare = async () => {
    setShareOpen(false);
    const text = buildShareText();

    try {
      const blob = await generateVerificationPdf(serviceName, summary || "");
      const file = new File([blob!], `${safeTitle}.pdf`, { type: "application/pdf" });

      if ("canShare" in navigator && (navigator as any).canShare({ files: [file] })) { // eslint-disable-line @typescript-eslint/no-explicit-any
        await (navigator as any).share({ title: `${serviceName} Result`, text, files: [file] }); // eslint-disable-line @typescript-eslint/no-explicit-any
        return;
      }

      // Fallback: download PDF
      if (blob) triggerDownload(blob, `${safeTitle}.pdf`);
    } catch (err) {
      console.warn("PDF generation failed, falling back to text", err);
    }

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // ✅ Copy to clipboard
  const handleCopy = async () => {
    setShareOpen(false);
    const text = buildShareText();
    try {
      await navigator.clipboard.writeText(text);
      alert("Details copied to clipboard!");
    } catch {
      prompt("Copy failed. Please manually copy:", text);
    }
  };

  const handleToggle = () => setShareOpen((v) => !v);

  return (
    <div className="print:hidden relative">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative">
          <button
            ref={shareBtnRef}
            onClick={handleToggle}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium"
            aria-haspopup="true"
            aria-expanded={shareOpen}
          >
            <Share2 className="w-4 h-4" />
            Share Details
          </button>

          {shareOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg z-30 overflow-hidden"
              role="menu"
            >
              <button
                onClick={async () => {
                  const blob = await generateVerificationPdf(serviceName, summary || "");
                  if (blob) triggerDownload(blob, `${safeTitle}.pdf`);
                }}
                className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                role="menuitem"
              >
                Export PDF
              </button>
              <button
                onClick={handleCopy}
                className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                role="menuitem"
              >
                Copy Details
              </button>
              <hr className="my-1 h-px border-0 bg-gray-200" />
              <button
                onClick={handleShareSystem}
                className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                role="menuitem"
              >
                System Share
              </button>
              <button
                onClick={handleEmail}
                className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                role="menuitem"
              >
                Email
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                role="menuitem"
              >
                WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareActions;