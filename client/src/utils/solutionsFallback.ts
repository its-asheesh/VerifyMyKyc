import type { Industry, Solution } from "../types/solution"

export const industriesFallback: Industry[] = [
  {
    id: "banking",
    name: "Banking & Finance",
    slug: "banking",
    description: "KYC and AML solutions tailored for financial institutions.",
    icon: "credit-card",
  },
  // {
  //   id: "government",
  //   name: "Government Services",
  //   slug: "government",
  //   description: "Citizen verification and e-governance onboarding.",
  //   icon: "building",
  // },
  // {
  //   id: "healthcare",
  //   name: "Healthcare",
  //   slug: "healthcare",
  //   description: "Patient identity and insurance verification.",
  //   icon: "shield",
  // },
  // {
  //   id: "ecommerce",
  //   name: "E-commerce",
  //   slug: "ecommerce",
  //   description: "Seller onboarding and fraud prevention.",
  //   icon: "zap",
  // },
]

export const solutionsFallback: Solution[] = [
  {
    id: "sol-banking-kyc",
    title: "Bank Account Verification",
    description: "Verify bank accounts, IFSC, and UPI in real-time for seamless onboarding.",
    industry: industriesFallback[0],
    useCases: [
      { title: "Account Holder Match", description: "Match name against bank records.", benefits: ["Lower fraud", "Faster payouts"] },
      { title: "UPI Verification", description: "Validate UPI handles instantly.", benefits: ["Seamless UX", "Reduced failures"] },
    ],
    benefits: ["Reduce chargebacks", "Compliant KYC", "Faster onboarding"],
    implementation: [
      { step: 1, title: "Integrate APIs", description: "Use our REST endpoints.", duration: "1 day" },
      { step: 2, title: "Test Sandbox", description: "Verify against sample data.", duration: "1 day" },
    ],
    caseStudies: [
      { company: "FinPay", industry: "Fintech", challenge: "High payout failures", solution: "Account validation before payout", results: ["-45% failures", "+22% CSAT"] },
    ],
    isActive: true,
    image: "/images/solutions/banking.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // {
  //   id: "sol-gov-kyc",
  //   title: "Citizen Verification Platform",
  //   description: "PAN, Aadhaar, Voter ID verification for e-governance services.",
  //   industry: industriesFallback[1],
  //   useCases: [
  //     { title: "Subsidy Eligibility", description: "Verify identity for benefits.", benefits: ["Less leakage"] },
  //   ],
  //   benefits: ["High accuracy", "Scalable"],
  //   implementation: [
  //     { step: 1, title: "Connect", description: "REST APIs", duration: "2 days" },
  //   ],
  //   caseStudies: [],
  //   isActive: true,
  //   image: "/images/solutions/government.png",
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
  // {
  //   id: "sol-health-kyc",
  //   title: "Healthcare KYC & Claims",
  //   description: "Verify patient IDs and reduce insurance fraud.",
  //   industry: industriesFallback[2],
  //   useCases: [],
  //   benefits: ["Lower fraud", "Better TAT"],
  //   implementation: [],
  //   caseStudies: [],
  //   isActive: true,
  //   image: "/images/solutions/healthcare.png",
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
  // {
  //   id: "sol-ecom-kyc",
  //   title: "E-commerce Seller Onboarding",
  //   description: "Verify GSTIN, PAN, and bank accounts for sellers.",
  //   industry: industriesFallback[3],
  //   useCases: [],
  //   benefits: ["Faster onboarding"],
  //   implementation: [],
  //   caseStudies: [],
  //   isActive: true,
  //   image: "/images/solutions/ecommerce.png",
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
]
