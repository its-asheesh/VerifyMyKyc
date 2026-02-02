"use client";

import React, { useState, useRef, useCallback } from "react";
import { Share2 } from "lucide-react";
import jsPDF from "jspdf";
import { isGarbledText } from "../../lib/utils";

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



  // ✅ Use only `summary` for text extraction (what user sees) - WITH AGGRESSIVE SANITIZATION
  const buildDetailsLines = useCallback((): string[] => {
    if (summary && summary.trim()) {
      return summary
        .trim()
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .filter((line) => !isGarbledText(line));
    }
    return ["No details available."];
  }, [summary]);

  // ✅ Build full share text with company info
  const buildShareText = useCallback((): string => {
    const lines = buildDetailsLines();

    // Filter out redundant status messages and garbled text from share text too
    const filteredLines = lines.filter(line => {
      const lowerLine = line.toLowerCase();

      // Remove garbled/corrupted text patterns - COMPREHENSIVE FILTERING
      if (isGarbledText(line)) return false;

      return !lowerLine.includes('verification successful') &&
        !lowerLine.includes('fetch ') &&
        !lowerLine.includes('status code') &&
        !lowerLine.includes('status:') &&
        !lowerLine.includes('request id') &&
        !lowerLine.includes('transaction id') &&
        !lowerLine.includes('reference id') &&
        !lowerLine.includes('=== ') &&  // Section headers like "=== PERSONAL INFORMATION ==="
        !lowerLine.includes('--- ') &&  // Sub-section headers like "--- Director 1 ---"
        !lowerLine.match(/^\d+$/) &&    // Pure numbers (like status codes)
        !lowerLine.match(/^[Ø=ÜË\s]+$/) && // Lines with only special chars and spaces
        !lowerLine.match(/^[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]/) && // Spaced out words
        !line.match(/.*[&]{3,}.*/) && // Lines with 3+ consecutive ampersands
        !line.match(/.*[Ø=ÜË]{2,}.*/) && // Lines with multiple special chars
        !line.match(/.*verification.*details.*/i) && // Any line containing "verification details" (case insensitive)
        !line.match(/.*[Ø=ÜË].*verification.*/i) && // Any line with special chars + verification
        !line.match(/.*[Ø=ÜË].*details.*/i) && // Any line with special chars + details
        line.trim() !== '';
    });

    const companyInfo = `VerifyMyKyc - Navigant Digital Private Limited
A 24/5, Mohan Cooperative Industrial Area, Badarpur, Second Floor
New Delhi 110044, India
Phone: +91 9990010601 | Email: verifymykyc@navigantinc.com

${serviceName} Verification - Verification Successful

${filteredLines.join("\n")}`;

    return companyInfo;
  }, [serviceName, buildDetailsLines]);

  // ✅ Generate PDF with enhanced design and proper logo loading
  const generatePdfBlob = useCallback(async (): Promise<Blob | null> => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const marginX = 15;
    let y = 20;

    // TWO-COLUMN LAYOUT: Logo on LEFT, Company Details on RIGHT
    let logoLoaded = false;
    const logoWidth = 45;
    const logoHeight = 18;
    // const rightColumnStart = marginX + logoWidth + 15; // Unused

    try {
      // Try multiple logo formats and sources with better error handling
      const logoSources = [
        '/verifymykyclogo.svg',  // Primary logo
        '/verifymykyc.jpg',      // Alternative logo
        '/SVG.svg',              // Generic SVG
        '/SVG1.svg',             // Alternative SVG
        '/SVG2.svg',             // Alternative SVG
        './verifymykyclogo.svg', // Relative path
        './verifymykyc.jpg',     // Relative path
        './SVG.svg'              // Relative path
      ];

      let logoFormat = 'PNG';

      for (const logoSource of logoSources) {
        try {
          const logoResponse = await fetch(logoSource);

          if (logoResponse.ok) {
            const logoBlob = await logoResponse.blob();


            if (logoBlob.size > 0) {
              const logoUrl = URL.createObjectURL(logoBlob);

              // Determine image format more accurately
              const contentType = logoResponse.headers.get('content-type') || '';


              if (contentType.includes('svg') || logoSource.includes('.svg')) {
                logoFormat = 'SVG';
              } else if (contentType.includes('jpeg') || contentType.includes('jpg') || logoSource.includes('.jpg')) {
                logoFormat = 'JPEG';
              } else {
                logoFormat = 'PNG';
              }

              // Convert blob to base64 for better compatibility
              const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(logoBlob);
              });

              try {
                // Add logo on the LEFT side
                pdf.addImage(base64, logoFormat, marginX, y, logoWidth, logoHeight);

                logoLoaded = true;
                URL.revokeObjectURL(logoUrl);
                break;
              } catch (imgError) {
                console.warn('Failed to add logo to PDF:', imgError);
                URL.revokeObjectURL(logoUrl);
              }
            } else {
              console.warn(`Logo blob is empty for ${logoSource}`);
            }
          } else {
            console.warn(`Logo response not ok for ${logoSource}: ${logoResponse.status}`);
          }
        } catch (error) {
          console.warn(`Could not load logo from ${logoSource}:`, error);
        }
      }

      if (!logoLoaded) {
        console.warn('All logo sources failed, using text fallback');
        // Fallback: Draw a simple logo placeholder on the LEFT
        pdf.setFillColor(59, 130, 246); // Blue color
        pdf.rect(marginX, y, logoWidth, logoHeight, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text("VMK", marginX + 8, y + 13);
        pdf.setTextColor(0, 0, 0);
      }
    } catch (error) {
      console.warn('Logo loading failed:', error);
      // Fallback: Draw a simple logo placeholder on the LEFT
      pdf.setFillColor(59, 130, 246); // Blue color
      pdf.rect(marginX, y, logoWidth, logoHeight, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("VMK", marginX + 8, y + 13);
      pdf.setTextColor(0, 0, 0);
    }

    // RIGHT COLUMN: Company details positioned next to logo with proper alignment
    let rightY = y; // Start at same level as logo

    // Company name positioned next to logo - RIGHT ALIGNED
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);

    const companyName = "Navigant Digital Private Limited";
    const companyNameWidth = pdf.getTextWidth(companyName);
    const rightMargin = pageWidth - marginX;

    pdf.text(companyName, rightMargin - companyNameWidth, rightY + 4);
    rightY += 8; // Increased spacing

    // Address positioned below company name with better spacing - RIGHT ALIGNED
    pdf.setFontSize(9);
    pdf.setTextColor(75, 85, 99);

    // Right-align address lines
    const addressLine1 = "A 24/5, Mohan Cooperative Industrial Area, Badarpur, Second Floor";
    const addressLine2 = "New Delhi 110044, India";
    const contactLine = "Phone: +91 9990010601 | Email: verifymykyc@navigantinc.com";

    // Calculate right-aligned positions (using same rightMargin as company name)
    const address1Width = pdf.getTextWidth(addressLine1);
    const address2Width = pdf.getTextWidth(addressLine2);
    const contactWidth = pdf.getTextWidth(contactLine);

    pdf.text(addressLine1, rightMargin - address1Width, rightY);
    rightY += 6; // Increased spacing between address lines
    pdf.text(addressLine2, rightMargin - address2Width, rightY);
    rightY += 8; // Increased spacing before contact info

    // Contact info positioned below address with proper spacing - RIGHT ALIGNED
    pdf.text(contactLine, rightMargin - contactWidth, rightY);

    // Update y position for the rest of the document
    y = Math.max(y + logoHeight, rightY) + 8; // Increased spacing before decorative line

    // Decorative line
    y += 8;
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(0.8);
    pdf.line(marginX, y, pageWidth - marginX, y);
    y += 6;

    // Service Title with enhanced styling
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(31, 41, 55); // Dark gray
    pdf.text(`${serviceName} Verification Report`, marginX, y);
    y += 8;

    // Success badge with clean design
    const badgeText = "VERIFICATION SUCCESSFUL";
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    const badgePadX = 6;
    const badgePadY = 3;
    const textW = pdf.getTextWidth(badgeText);
    const badgeW = textW + badgePadX * 2;
    const badgeH = 8;
    const rectY = y - badgePadY;

    // Badge background with gradient effect
    pdf.setFillColor(34, 197, 94); // Green
    pdf.rect(marginX, rectY, badgeW, badgeH, 'F');

    // Badge border
    pdf.setDrawColor(22, 163, 74);
    pdf.setLineWidth(0.3);
    pdf.rect(marginX, rectY, badgeW, badgeH);

    // Badge text
    pdf.setTextColor(255, 255, 255);
    pdf.text(badgeText, marginX + badgePadX, y + 2);
    pdf.setTextColor(0, 0, 0);
    y += 12;

    // Section divider
    pdf.setDrawColor(229, 231, 235);
    pdf.setLineWidth(0.5);
    pdf.line(marginX, y, pageWidth - marginX, y);
    y += 8;

    // Skip the problematic "Verification Details" header entirely
    // pdf.setFont("helvetica", "bold");
    // pdf.setFontSize(14);
    // pdf.setTextColor(31, 41, 55);
    // pdf.text("📋 Verification Details", marginX, y);
    // y += 8;

    // Parse data into tabular format with section headings
    const lines = buildDetailsLines();
    const tableData: Array<{ label: string, value: string, isSectionHeader?: boolean }> = [];

    // Filter out redundant status messages and garbled text
    const filteredLines = lines.filter(line => {
      const lowerLine = line.toLowerCase();

      // Remove garbled/corrupted text patterns - COMPREHENSIVE FILTERING
      if (line.includes('Ø') || line.includes('Ü') || line.includes('Ë') ||
        line.includes('&V&e&r&i&f&i&c&a&t&i') ||
        line.match(/[&]{2,}/) || // Multiple consecutive ampersands
        line.match(/[Ø=ÜË]/) || // Special characters that cause garbling
        line.match(/[&][a-zA-Z][&]/) || // Pattern like &V&e&r&i&f&i&c&a&t&i&o&n&
        line.includes('&V&e&r&i&f&i&c&a&t&i&o&n&') ||
        line.includes('&D&e&t&a&i&l&s') ||
        line.match(/[&][A-Za-z][&][A-Za-z][&]/) || // More garbled patterns
        line.includes('Ø=ÜË') || // Specific pattern from user
        line.match(/V\s+e\s+r\s+i\s+f\s+i\s+c\s+a\s+t\s+i\s+o\s+n/) || // Spaced out "Verification"
        line.match(/D\s+e\s+t\s+a\s+i\s+l\s+s/) || // Spaced out "Details"
        line.match(/[Ø=ÜË]\s+[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]/) || // Pattern with special chars + spaced letters
        line.includes('V e r i f i c a t i o n') ||
        line.includes('D e t a i l s') || // More specific patterns
        line.match(/Ø=ÜË.*&.*V.*&.*e.*&.*r.*&.*i.*&.*f.*&.*i.*&.*c.*&.*a.*&.*t.*&.*i.*&.*o.*&.*n/) || // Complex garbled pattern
        line.match(/.*&.*V.*&.*e.*&.*r.*&.*i.*&.*f.*&.*i.*&.*c.*&.*a.*&.*t.*&.*i.*&.*o.*&.*n.*&.*D.*&.*e.*&.*t.*&.*a.*&.*i.*&.*l.*&.*s/) || // Full garbled pattern
        line.includes('Ø=ÜË& &V&e&r&i&f&i&c&a&t&i&o&n& &D&e&t&a&i&l&s') || // Exact pattern from image
        line.match(/.*Ø.*=.*Ü.*Ë.*&.*&.*V.*&.*e.*&.*r.*&.*i.*&.*f.*&.*i.*&.*c.*&.*a.*&.*t.*&.*i.*&.*o.*&.*n.*&.*&.*D.*&.*e.*&.*t.*&.*a.*&.*i.*&.*l.*&.*s.*/) || // Regex for exact pattern
        line.match(/.*[Ø=ÜË].*[&].*[V].*[&].*[e].*[&].*[r].*[&].*[i].*[&].*[f].*[&].*[i].*[&].*[c].*[&].*[a].*[&].*[t].*[&].*[i].*[&].*[o].*[&].*[n].*[&].*[D].*[&].*[e].*[&].*[t].*[&].*[a].*[&].*[i].*[&].*[l].*[&].*[s].*/) || // More comprehensive pattern
        line.includes('Ø=ÜË V e r i f i c a t i o n D e t a i l')) { // Spaced version
        return false;
      }

      return !lowerLine.includes('verification successful') &&
        !lowerLine.includes('fetch ') &&
        !lowerLine.includes('status code') &&
        !lowerLine.includes('status:') &&
        !lowerLine.includes('request id') &&
        !lowerLine.includes('transaction id') &&
        !lowerLine.includes('reference id') &&
        !lowerLine.includes('=== ') &&  // Section headers like "=== PERSONAL INFORMATION ==="
        !lowerLine.includes('--- ') &&  // Sub-section headers like "--- Director 1 ---"
        !lowerLine.match(/^\d+$/) &&    // Pure numbers (like status codes)
        !lowerLine.match(/^[Ø=ÜË\s]+$/) && // Lines with only special chars and spaces
        !lowerLine.match(/^[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]/) && // Spaced out words
        !line.match(/.*[&]{3,}.*/) && // Lines with 3+ consecutive ampersands
        !line.match(/.*[Ø=ÜË]{2,}.*/) && // Lines with multiple special chars
        !line.match(/.*verification.*details.*/i) && // Any line containing "verification details" (case insensitive)
        !line.match(/.*[Ø=ÜË].*verification.*/i) && // Any line with special chars + verification
        !line.match(/.*[Ø=ÜË].*details.*/i) && // Any line with special chars + details
        line.trim() !== '';
    });

    // Helper function to detect section headings for all verification types
    const isSectionHeading = (line: string): boolean => {
      const trimmed = line.trim();
      if (!trimmed) return false;

      // Must not have a colon (key-value pairs have colons)
      if (trimmed.includes(':')) return false;

      // Section headings are usually short (less than 60 characters)
      if (trimmed.length > 60) return false;

      // Check if it's all uppercase or mostly uppercase
      const letters = trimmed.match(/[A-Za-z]/g) || [];
      if (letters.length === 0) return false;

      const upperCaseCount = (trimmed.match(/[A-Z]/g) || []).length;
      const upperCaseRatio = upperCaseCount / letters.length;

      // Common section heading keywords
      const upperTrimmed = trimmed.toUpperCase();
      const hasSectionKeywords =
        upperTrimmed.includes('DETAILS') ||
        upperTrimmed.includes('INFORMATION') ||
        upperTrimmed.includes('DATA') ||
        upperTrimmed.includes('SUMMARY') ||
        upperTrimmed.includes('OVERVIEW') ||
        upperTrimmed.includes('STATUS') ||
        upperTrimmed.includes('VERIFICATION') ||
        upperTrimmed.includes('PERSONAL') ||
        upperTrimmed.includes('ADDRESS') ||
        upperTrimmed.includes('CONTACT') ||
        upperTrimmed.includes('EMPLOYMENT') ||
        upperTrimmed.includes('COMPANY') ||
        upperTrimmed.includes('OWNER') ||
        upperTrimmed.includes('VEHICLE') ||
        upperTrimmed.includes('BANK') ||
        upperTrimmed.includes('ACCOUNT') ||
        upperTrimmed.includes('DOCUMENT') ||
        upperTrimmed.includes('IDENTIFICATION');

      // Pattern 1: Mostly uppercase with section keywords (e.g., "RC & OWNER DETAILS", "PUCC DETAILS")
      if (upperCaseRatio > 0.6 && hasSectionKeywords) {
        return true;
      }

      // Pattern 2: All or mostly uppercase short lines (e.g., "PERSONAL INFORMATION", "VEHICLE DETAILS")
      if (upperCaseRatio > 0.7 && trimmed.length < 40) {
        return true;
      }

      // Pattern 3: Lines with "&" and uppercase (e.g., "RC & OWNER DETAILS")
      if (trimmed.includes('&') && upperCaseRatio > 0.6 && trimmed.length < 50) {
        return true;
      }

      // Pattern 4: Common verification section patterns
      const sectionPatterns = [
        /^[A-Z\s&]+DETAILS$/,
        /^[A-Z\s&]+INFORMATION$/,
        /^[A-Z\s&]+DATA$/,
        /^[A-Z\s&]+SUMMARY$/,
      ];

      for (const pattern of sectionPatterns) {
        if (pattern.test(trimmed)) {
          return true;
        }
      }

      return false;
    };

    // Parse lines into key-value pairs or section headings
    filteredLines.forEach(line => {
      // Check if this is a section heading
      if (isSectionHeading(line)) {
        tableData.push({ label: '', value: line.trim(), isSectionHeader: true });
        return;
      }

      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const label = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        if (label && value) {
          tableData.push({ label, value, isSectionHeader: false });
        }
      } else {
        // If no colon and not a section heading, treat as a standalone value
        if (line.trim()) {
          tableData.push({ label: '', value: line.trim(), isSectionHeader: false });
        }
      }
    });

    // Create enhanced table
    if (tableData.length > 0) {
      const tableStartY = y;
      const minRowHeight = 7; // Minimum row height
      const lineSpacing = 3.8; // Spacing between lines
      const verticalPadding = 4; // Top and bottom padding
      const labelWidth = 65;
      const valueWidth = pageWidth - marginX * 2 - labelWidth;

      // Enhanced table header with gradient effect
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setFillColor(59, 130, 246); // Blue header
      pdf.rect(marginX, tableStartY, pageWidth - marginX * 2, minRowHeight, 'F');

      // Header text in white
      pdf.setTextColor(255, 255, 255);
      pdf.text("FIELD", marginX + 3, tableStartY + 5);
      pdf.text("VALUE", marginX + labelWidth + 3, tableStartY + 5);
      pdf.setTextColor(0, 0, 0);

      // Header border
      pdf.setDrawColor(37, 99, 235);
      pdf.setLineWidth(0.4);
      pdf.rect(marginX, tableStartY, pageWidth - marginX * 2, minRowHeight);
      pdf.line(marginX + labelWidth, tableStartY, marginX + labelWidth, tableStartY + minRowHeight);

      y = tableStartY + minRowHeight;

      // Enhanced table rows with dynamic height
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);

      tableData.forEach((row, index) => {
        // Check if we need a new page before drawing the row
        if (y > pageHeight - 30) {
          pdf.addPage();
          y = 20;
        }

        // Handle section headers differently
        if (row.isSectionHeader) {
          // Add spacing before section header
          y += 4;

          // Section header styling
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(12);
          pdf.setTextColor(31, 41, 55); // Dark gray

          // Section header background
          pdf.setFillColor(241, 245, 249); // Light gray background
          const headerHeight = 8;
          pdf.rect(marginX, y, pageWidth - marginX * 2, headerHeight, 'F');

          // Section header border
          pdf.setDrawColor(203, 213, 225);
          pdf.setLineWidth(0.5);
          pdf.rect(marginX, y, pageWidth - marginX * 2, headerHeight);

          // Section header text (centered or left-aligned)
          const sectionText = row.value || '';
          pdf.text(sectionText, marginX + 5, y + 6);

          y += headerHeight + 2; // Add spacing after header
          return;
        }

        // Regular table row
        const labelText = row.label || '';
        const valueText = row.value || '';

        // Enhanced text wrapping
        const wrappedLabel = pdf.splitTextToSize(labelText, labelWidth - 6);
        const wrappedValue = pdf.splitTextToSize(valueText, valueWidth - 6);

        // Calculate dynamic row height based on content
        const maxLines = Math.max(wrappedLabel.length, wrappedValue.length);
        const calculatedHeight = Math.max(
          minRowHeight,
          (maxLines * lineSpacing) + verticalPadding
        );

        // Enhanced row styling - draw background first
        const isEvenRow = index % 2 === 0;
        if (isEvenRow) {
          pdf.setFillColor(248, 250, 252); // Very light blue
          pdf.rect(marginX, y, pageWidth - marginX * 2, calculatedHeight, 'F');
        }

        // Row borders with better styling - adjust to calculated height
        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.3);
        pdf.rect(marginX, y, pageWidth - marginX * 2, calculatedHeight);
        pdf.line(marginX + labelWidth, y, marginX + labelWidth, y + calculatedHeight);

        // Label styling
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(75, 85, 99); // Gray for labels

        const labelStartY = y + verticalPadding / 2 + 3;
        for (let i = 0; i < wrappedLabel.length; i++) {
          pdf.text(wrappedLabel[i], marginX + 3, labelStartY + (i * lineSpacing));
        }

        // Value styling
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(31, 41, 55); // Dark gray for values

        const valueStartY = y + verticalPadding / 2 + 3;
        for (let i = 0; i < wrappedValue.length; i++) {
          pdf.text(wrappedValue[i], marginX + labelWidth + 3, valueStartY + (i * lineSpacing));
        }

        // Move to next row position based on calculated height
        y += calculatedHeight;
      });
    } else {
      // Fallback to simple text if no structured data
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const maxWidth = pageWidth - marginX * 2;

      for (const line of filteredLines) {
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
    }

    // Legal Disclaimer Section
    y += 15; // Add space before disclaimer

    // Check if we need a new page for disclaimer
    if (y > pageHeight - 80) {
      pdf.addPage();
      y = 20;
    }

    // Disclaimer header
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(31, 41, 55);
    pdf.text("Legal Disclaimer", marginX, y);
    y += 8;

    // Disclaimer divider line
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.5);
    pdf.line(marginX, y - 2, pageWidth - marginX, y - 2);
    y += 6;

    // Disclaimer content
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(75, 85, 99);

    const disclaimerText = `All rights reserved. 
The report and its contents are the property of VerifyMyKyc (operated by Navigant Digital Pvt. Ltd.) and may not be reproduced in any manner without the express written permission of VerifyMyKyc.
The reports and information contained herein are confidential and are meant only for the internal use of the VerifyMyKyc client for assessing the background of their applicant. The information and report are subject to change based on changes in factual information.

Information and reports, including text, graphics, links, or other items, are provided on an "as is," "as available" basis. VerifyMyKyc expressly disclaims liability for errors or omissions in the report, information, and materials, as the information is obtained from various sources as per industry practice. No warranty of any kind implied, express, or statutory including but not limited to the warranties of non-infringement of third party rights, title, merchantability, fitness for a particular purpose or freedom from computer virus, is given with respect to the contents of this report.

Our findings are based on the information available to us and industry practice; therefore, we cannot guarantee the accuracy of the information collected. Should additional information or documentation become available that impacts conclusions, we reserve the right to amend our findings accordingly.

These reports are not intended for publication or circulation. They should not be shared with any person, entity, association, corporation, or any other purposes, in whole or in part, without prior written consent from VerifyMyKyc in each specific instance. Our reports cannot be used by clients to claim all responsibility or liability that may arise due omissions, additions, correction, and accuracy. All the information has been obtained from various sources as per industry practice to make an informed decision, and we hereby disclaim all responsibility or liability that may arise due to errors in the report.

Due to the limitations mentioned above, the result of our work with respect to background checks should be considered only as a guideline. Our reports and comments should not be considered a definitive pronouncement on the individual.

Verify My Kyc - Confidential`;

    // Split disclaimer into lines and add to PDF
    const disclaimerLines = pdf.splitTextToSize(disclaimerText, pageWidth - marginX * 2);

    for (const line of disclaimerLines) {
      if (y > pageHeight - 20) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, marginX, y);
      y += 4; // Smaller line spacing for disclaimer
    }

    // Enhanced footer with better styling
    y += 10; // Add space before footer
    y = Math.min(y, pageHeight - 20); // Ensure footer doesn't go off page

    // Footer divider line
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.5);
    pdf.line(marginX, y - 5, pageWidth - marginX, y - 5);

    // Footer content
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);

    // Generation timestamp
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    pdf.text(`Generated on ${timestamp}`, marginX, y);

    // Copyright with enhanced styling
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(59, 130, 246);
    pdf.text("© VerifyMyKyc", marginX, y + 4);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);
    pdf.text("Navigant Digital Private Limited", marginX + 25, y + 4);

    // Watermark removed as requested

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
      const blob = await generatePdfBlob();
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
      const blob = await generatePdfBlob();
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