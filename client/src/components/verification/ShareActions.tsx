"use client"

import React from "react"
import { Share2 } from "lucide-react"
import jsPDF from "jspdf"
 

export interface ShareActionsProps {
  targetRef: React.RefObject<HTMLDivElement | null> | React.MutableRefObject<HTMLDivElement | null>
  serviceName: string
  fileName?: string
  summary?: string
  result?: any
}

const ShareActions: React.FC<ShareActionsProps> = ({
  targetRef,
  serviceName,
  fileName,
  summary,
  result,
}) => {
  const safeTitle = (fileName || `${serviceName}-verification`).replace(/\s+/g, "-")
  // Mark 'result' as used to satisfy TS noUnusedParameters when not consuming it directly
  void result
  // Mark 'targetRef' as used (no longer needed for text-only PDF, but kept for API compatibility)
  void targetRef

  // Share menu state
  const [shareOpen, setShareOpen] = React.useState(false)
  const shareBtnRef = React.useRef<HTMLButtonElement | null>(null)
  const menuRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!shareOpen) return
      const t = e.target as Node
      if (menuRef.current && !menuRef.current.contains(t) && shareBtnRef.current && !shareBtnRef.current.contains(t)) {
        setShareOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [shareOpen])

  // Helpers to format and flatten fetched information
  const formatKey = (k: string) =>
    k
      .replace(/_/g, " ")
      .replace(/\./g, " ")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/^./, (s) => s.toUpperCase())

  const buildDetailsLines = (): string[] => {
    const out: string[] = []
    const addPair = (key: string, value: any) => {
      if (value === null || value === undefined || value === "") return
      let v: string
      if (typeof value === "object") {
        try { v = JSON.stringify(value) } catch { v = String(value) }
      } else {
        v = String(value)
      }
      if (v.length > 200) v = v.slice(0, 200) + "…"
      out.push(`${formatKey(key)}: ${v}`)
    }
    const walk = (obj: any, prefix = "", depth = 0) => {
      if (!obj || depth > 2) return
      if (Array.isArray(obj)) {
        obj.slice(0, 20).forEach((v, i) => addPair(`${prefix}[${i}]`, v))
        return
      }
      if (typeof obj !== "object") { addPair(prefix || "value", obj); return }
      Object.entries(obj).forEach(([k, v]) => {
        const name = prefix ? `${prefix}.${k}` : k
        if (v && typeof v === "object") {
          const isPlain = !Array.isArray(v) && Object.values(v).every((vv) => typeof vv !== "object")
          if (isPlain) {
            Object.entries(v as Record<string, any>).forEach(([sk, sv]) => addPair(`${name}.${sk}`, sv))
          } else {
            walk(v, name, depth + 1)
          }
        } else {
          addPair(name, v)
        }
      })
    }
    if (result) {
      walk(result)
      const sliced = out.slice(0, 120)
      if (sliced.length > 0) return sliced
    }
    if (summary && summary.trim()) {
      return summary.trim().split(/\r?\n/)
    }
    return ["No additional details available."]
  }

  const buildShareText = (): string => {
    const lines = buildDetailsLines()
    return `${serviceName} Verification - Verification Successful\n\n` + lines.join("\n")
  }

  const generatePdfBlob = async (): Promise<Blob | null> => {
    // Build a clean, black-and-white PDF containing only title, success badge, and fetched info
    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const marginX = 14
    const marginTop = 18
    let y = marginTop

    // Title
    pdf.setTextColor(0, 0, 0)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(18)
    pdf.text(`${serviceName} Verification`, marginX, y)
    y += 10

    // Success badge (outlined box with text)
    const badgeText = "Verification Successful"
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(12)
    const badgePadX = 4
    const badgeRectH = 7
    const textW = pdf.getTextWidth(badgeText)
    const badgeW = textW + badgePadX * 2
    const rectY = y - 5
    pdf.setDrawColor(0)
    pdf.setLineWidth(0.3)
    pdf.rect(marginX, rectY, badgeW, badgeRectH)
    pdf.text(badgeText, marginX + badgePadX, y)
    y += 12

    // Divider
    pdf.line(marginX, y, pageWidth - marginX, y)
    y += 6

    // Details header
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(14)
    pdf.text("Details", marginX, y)
    y += 8

    // Prepare details lines: prefer 'summary', otherwise flatten 'result'
    const maxWidth = pageWidth - marginX * 2
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(11)
    const lines = buildDetailsLines()

    for (const line of lines) {
      const wrapped = pdf.splitTextToSize(line, maxWidth)
      for (const w of wrapped) {
        if (y > pageHeight - 14) { pdf.addPage(); y = marginTop }
        pdf.text(w, marginX, y)
        y += 6
      }
    }

    return pdf.output("blob")
  }

  const triggerDownload = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleEmail = async () => {
    const subject = `${serviceName} Verification Result`
    const bodyText = buildShareText() + "\n\nSent from VerifyMyKyc"

    try {
      const blob = await generatePdfBlob()
      if (blob) {
        const file = new File([blob], `${safeTitle}.pdf`, { type: "application/pdf" })
        // If browser supports sharing files, use share sheet (often includes Mail)
        if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
          await (navigator as any).share({ title: `${serviceName} Result`, text: bodyText, files: [file] })
          return
        }
        // Fallback: download PDF locally, then open mailto (attachments not possible via mailto)
        triggerDownload(blob, `${safeTitle}.pdf`)
      }
    } catch {}

    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`
    window.location.href = mailto
  }

  const handleShareSystem = async () => {
    try {
      const blob = await generatePdfBlob()
      const text = buildShareText()
      if (blob) {
        const file = new File([blob], `${safeTitle}.pdf`, { type: "application/pdf" })
        const navAny = navigator as any
        if (navAny.canShare && navAny.canShare({ files: [file] })) {
          await navAny.share({ title: `${serviceName} Result`, text, files: [file] })
          return
        }
      }
      if (navigator.share) {
        await navigator.share({ title: `${serviceName} Result`, text })
      } else {
        await navigator.clipboard.writeText(text)
        alert("Details copied to clipboard. Paste it into your app.")
      }
    } catch {}
  }

  const handleWhatsAppShare = async () => {
    try {
      const blob = await generatePdfBlob()
      const text = buildShareText()
      if (blob) {
        const file = new File([blob], `${safeTitle}.pdf`, { type: "application/pdf" })
        const navAny = navigator as any
        if (navAny.canShare && navAny.canShare({ files: [file] })) {
          await navAny.share({ title: `${serviceName} Result`, text, files: [file] })
          return
        }
        // Fallback: download then open WhatsApp with text
        triggerDownload(blob, `${safeTitle}.pdf`)
      }
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`
      window.open(url, "_blank")
    } catch {}
  }

  const handleShare = () => setShareOpen((v) => !v)

  const handleCopy = async () => {
    const text = buildShareText()
    await navigator.clipboard.writeText(text)
  }

  return (
    <div className="print:hidden relative">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative">
          <button
            ref={shareBtnRef}
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium"
          >
            <Share2 className="w-4 h-4" />
            Share Details
          </button>
          {shareOpen && (
            <div ref={menuRef} className="absolute right-0 mt-1 w-44 rounded-md border border-gray-200 bg-white shadow-lg z-30">
              <button onClick={async () => { setShareOpen(false); const b = await generatePdfBlob(); if (b) triggerDownload(b, `${safeTitle}.pdf`) }} className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">Export PDF</button>
              <button onClick={() => { setShareOpen(false); handleCopy() }} className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">Copy Details</button>
              <div className="my-1 h-px bg-gray-200" />
              <button onClick={() => { setShareOpen(false); handleShareSystem() }} className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">System Share</button>
              <button onClick={() => { setShareOpen(false); handleEmail() }} className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">Email</button>
              <button onClick={() => { setShareOpen(false); handleWhatsAppShare() }} className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">WhatsApp</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareActions
