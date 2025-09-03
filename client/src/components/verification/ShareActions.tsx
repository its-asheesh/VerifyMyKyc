"use client";

import React, { useState, useRef, useCallback } from "react";
import { Share2 } from "lucide-react";
import jsPDF from "jspdf";

export interface ShareActionsProps {
  targetRef?: React.RefObject<HTMLDivElement | null> | React.MutableRefObject<HTMLDivElement | null>;
  serviceName: string;
  fileName?: string;
  summary?: string; // Plain text (preferred)
  result?: any; // Only fallback; not used directly
}

const ShareActions: React.FC<ShareActionsProps> = ({
  targetRef,
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

  // ✅ Use only `summary` for text extraction (what user sees)
  const buildDetailsLines = useCallback((): string[] => {
    if (summary && summary.trim()) {
      return summary
        .trim()
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    }
    return ["No details available."];
  }, [summary]);

  // ✅ Build full share text
  const buildShareText = useCallback((): string => {
    const lines = buildDetailsLines();
    return `${serviceName} Verification - Verification Successful\n\n${lines.join("\n")}`;
  }, [serviceName, buildDetailsLines]);

  // ✅ Generate PDF from clean text
  const generatePdfBlob = useCallback(async (): Promise<Blob | null> => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const marginX = 14;
    let y = 18;

    // Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${serviceName} Verification`, marginX, y);
    y += 10;

    // Success badge (box)
    const badgeText = "Verification Successful";
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    const badgePadX = 4;
    const badgeRectH = 7;
    const textW = pdf.getTextWidth(badgeText);
    const badgeW = textW + badgePadX * 2;
    const rectY = y - 5;
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.3);
    pdf.rect(marginX, rectY, badgeW, badgeRectH);
    pdf.text(badgeText, marginX + badgePadX, y);
    y += 12;

    // Divider
    pdf.setDrawColor(0);
    pdf.line(marginX, y, pageWidth - marginX, y);
    y += 6;

    // Details Header
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Details", marginX, y);
    y += 8;

    // Content
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    const lines = buildDetailsLines();
    const maxWidth = pageWidth - marginX * 2;

    for (const line of lines) {
      const wrapped = pdf.splitTextToSize(line, maxWidth);
      for (const part of wrapped) {
        if (y > pageHeight - 14) {
          pdf.addPage();
          y = 18;
        }
        pdf.text(part, marginX, y);
        y += 6;
      }
      y += 1; // extra spacing between entries
    }

    return pdf.output("blob");
  }, [serviceName, buildDetailsLines]);

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
      const blob = await generatePdfBlob();
      if (blob && "canShare" in navigator && (navigator as any).canShare({ files: [new File([blob], "report.pdf")] })) {
        const file = new File([blob], `${safeTitle}.pdf`, { type: "application/pdf" });
        await (navigator as any).share({ title: `${serviceName} Result`, text: bodyText, files: [file] });
        return;
      }
      // Fallback: download PDF
      triggerDownload(blob!, `${safeTitle}.pdf`);
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
      const blob = await generatePdfBlob();
      const file = new File([blob!], `${safeTitle}.pdf`, { type: "application/pdf" });

      if ("canShare" in navigator && (navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({ title: `${serviceName} Result`, text, files: [file] });
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
      const blob = await generatePdfBlob();
      const file = new File([blob!], `${safeTitle}.pdf`, { type: "application/pdf" });

      if ("canShare" in navigator && (navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({ title: `${serviceName} Result`, text, files: [file] });
        return;
      }

      // Fallback: download PDF
      triggerDownload(blob!, `${safeTitle}.pdf`);
    } catch (err) {
      console.warn("PDF generation failed, falling back to text");
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
    } catch (err) {
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
                  const blob = await generatePdfBlob();
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