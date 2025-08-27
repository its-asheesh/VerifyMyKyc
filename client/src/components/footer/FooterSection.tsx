// src/components/footer/FooterSection.tsx
"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ Import Link

interface FooterSectionProps {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
  index: number;
}

// Helper: Check if it's an internal route
const isInternalLink = (href: string) => href.startsWith("/") && !href.startsWith("//");

export const FooterSection: React.FC<FooterSectionProps> = ({ title, links, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex-1 min-w-[200px]"
    >
      <h3 className="font-bold text-blue-600 mb-4 text-lg">{title}</h3>
      <div className="space-y-3">
        {links.map((link, linkIndex) => (
          <motion.div
            key={link.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + linkIndex * 0.05 }}
          >
            {isInternalLink(link.href) ? (
              // ✅ Internal link: use React Router's Link
              <Link
                to={link.href}
                className="text-blue-600 text-sm hover:text-orange-500 hover:underline transition-all duration-300 block"
              >
                {link.label}
              </Link>
            ) : (
              // ✅ External link: use <a> with rel and target
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:text-orange-500 hover:underline transition-all duration-300 block"
              >
                {link.label}
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ✅ Keep your footerData here or move to constants
export const footerData = {
  legalLinks: [
    { label: "Terms and conditions", href: "/terms" },
    { label: "Privacy", href: "/privacy-policy" }, // ✅ Internal
    { label: "Cookies", href: "/cookies" },
  ],
  importantLinks: [
    { label: "Get help", href: "/help" },
    // { label: "Add your restaurant", href: "/restaurant/signup" },
    // { label: "Sign up to deliver", href: "/deliver" },
    // { label: "Create a business account", href: "/business" },
  ],
  socialLinks: [
    {
      name: "facebook" as const,
      href: "https://www.facebook.com/people/Verify-My-KYC/61576760613090/",
      color: "#1877F2",
    },
    {
      name: "instagram" as const,
      href: "https://www.instagram.com/verifymykyc/",
      color: "#C13584",
    },
    {
      name: "x" as const,
      href: "https://x.com/verifymykyc",
      color: "#000000",
    },
    {
      name: "linkedin" as const,
      href: "https://www.linkedin.com/company/verifymykyc",
      color: "#0A66C2",
    },
  ],
  bottomLinks: [
    { label: "Privacy Policy", href: "/PrivacyPolicyPage" }, // ✅ Internal
    { label: "Terms", href: "/terms" },
    { label: "Pricing", href: "/pricing" },
    { label: "Do not sell or share my personal information", href: "/opt-out" },
  ],
};