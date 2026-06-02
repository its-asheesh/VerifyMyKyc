export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: Record<string, unknown>;
}

export const generateSEOConfig = (config: Partial<SEOConfig>): SEOConfig => {
  const baseUrl = "https://verifymykyc.com";

  return {
    title: config.title || "VerifyMyKYC - India's Leading KYC & Identity Verification Platform",
    description: config.description || "VerifyMyKYC provides instant identity verification services including Aadhaar, PAN, Driving License, Passport, GSTIN verification and background checks. Trusted by 10,000+ users across India.",
    keywords: config.keywords || "KYC verification, identity verification, Aadhaar verification, PAN verification, driving license verification, passport verification, GSTIN verification, background check, India",
    canonicalUrl: config.canonicalUrl ? `${baseUrl}${config.canonicalUrl}` : baseUrl,
    ogImage: config.ogImage || "/verifymykyclogo.svg",
    ogType: config.ogType || "website",
    twitterCard: config.twitterCard || "summary_large_image",
    noIndex: config.noIndex || false,
    noFollow: config.noFollow || false,
    structuredData: config.structuredData
  };
};

export const generatePageTitle = (pageTitle: string, includeBrand: boolean = true): string => {
  const brandName = "VerifyMyKYC";
  return includeBrand ? `${pageTitle} | ${brandName}` : pageTitle;
};

export const generateMetaDescription = (content: string, maxLength: number = 160): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength - 3) + "...";
};

export const generateKeywords = (primaryKeywords: string[], secondaryKeywords: string[] = []): string => {
  const allKeywords = [...primaryKeywords, ...secondaryKeywords];
  return [...new Set(allKeywords)].join(", ");
};

// Predefined SEO configurations for common pages
export const SEO_PRESETS = {
  HOME: {
    title: "VerifyMyKYC - India's Leading KYC & Identity Verification Platform",
    description: "VerifyMyKYC provides instant identity verification services including Aadhaar, PAN, Driving License, Passport, GSTIN verification and background checks. Trusted by 10,000+ users across India.",
    keywords: "KYC verification, identity verification, Aadhaar verification, PAN verification, driving license verification, passport verification, GSTIN verification, background check, India, digital verification, compliance"
  },

  PRODUCTS: {
    title: "KYC Verification Products - Aadhaar, PAN, Driving License | VerifyMyKYC",
    description: "Browse our comprehensive range of KYC verification products including Aadhaar verification, PAN verification, Driving License verification, Passport verification, GSTIN verification and background checks.",
    keywords: "KYC products, verification services, Aadhaar verification, PAN verification, driving license verification, passport verification, GSTIN verification, background check services"
  },

  ABOUT: {
    title: "About VerifyMyKYC - India's Leading KYC Verification Company",
    description: "Learn about VerifyMyKYC, India's leading KYC and identity verification platform. We provide instant verification services for Aadhaar, PAN, Driving License, Passport, GSTIN and background checks. Trusted by 10,000+ users.",
    keywords: "about VerifyMyKYC, KYC verification company, identity verification platform, digital verification services, India KYC company"
  },

  CONTACT: {
    title: "Contact VerifyMyKYC - Get Support for KYC Verification Services",
    description: "Contact VerifyMyKYC for support with KYC verification services. Get help with Aadhaar verification, PAN verification, Driving License verification, Passport verification, GSTIN verification and background checks.",
    keywords: "contact VerifyMyKYC, KYC support, verification help, customer service, technical support"
  },

  BLOG: {
    title: "KYC Verification Blog - Latest News & Insights | VerifyMyKYC",
    description: "Stay updated with the latest KYC verification news, insights, and best practices. Learn about Aadhaar verification, PAN verification, compliance requirements, and digital identity trends.",
    keywords: "KYC blog, verification news, compliance insights, digital identity, Aadhaar verification, PAN verification, compliance trends"
  }
};

// Service-specific SEO configurations
export const SERVICE_SEO = {
  AADHAAR: {
    title: "Aadhaar Verification Service - Instant Online Verification | VerifyMyKYC",
    description: "Verify Aadhaar cards instantly with VerifyMyKYC's secure Aadhaar verification service. Fast, reliable, and compliant verification for businesses across India.",
    keywords: "Aadhaar verification, Aadhaar card verification, UIDAI verification, instant Aadhaar verification, online Aadhaar verification"
  },

  PAN: {
    title: "PAN Card Verification Service - Instant Online Verification | VerifyMyKYC",
    description: "Verify PAN cards instantly with VerifyMyKYC's secure PAN verification service. Fast, reliable, and compliant verification for businesses across India.",
    keywords: "PAN verification, PAN card verification, income tax verification, instant PAN verification, online PAN verification"
  },

  DRIVING_LICENSE: {
    title: "Driving License Verification Service - Instant Online Verification | VerifyMyKYC",
    description: "Verify driving licenses instantly with VerifyMyKYC's secure driving license verification service. Fast, reliable, and compliant verification for businesses across India.",
    keywords: "driving license verification, DL verification, RTO verification, instant DL verification, online driving license verification"
  },

  PASSPORT: {
    title: "Passport Verification Service - Instant Online Verification | VerifyMyKYC",
    description: "Verify passports instantly with VerifyMyKYC's secure passport verification service. Fast, reliable, and compliant verification for businesses across India.",
    keywords: "passport verification, passport verification service, instant passport verification, online passport verification"
  },

  GSTIN: {
    title: "GSTIN Verification Service - Instant Online Verification | VerifyMyKYC",
    description: "Verify GSTIN numbers instantly with VerifyMyKYC's secure GSTIN verification service. Fast, reliable, and compliant verification for businesses across India.",
    keywords: "GSTIN verification, GST verification, GST number verification, instant GSTIN verification, online GST verification"
  }
};

export default {
  generateSEOConfig,
  generatePageTitle,
  generateMetaDescription,
  generateKeywords,
  SEO_PRESETS,
  SERVICE_SEO
};
