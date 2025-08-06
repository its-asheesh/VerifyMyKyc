import { Users, Zap, Shield } from "lucide-react"

export const categories = [
  { label: "Personal", value: "personal" },
  { label: "Business", value: "business" },
  { label: "Finance & Banking", value: "finance" },
  { label: "Government", value: "government" },
  { label: "Biometric", value: "biometric" },
  { label: "Covid Check", value: "covid" },
]

export const verificationServices = [
  {
    id: 1,
    category: "personal",
    title: "PAN Card Verification",
    image: "/pan.png",
    demand: "Most Demanding",
    demandLevel: "high",
    verifications: 20,
    duration: "7 days",
    price: 250,
    rating: 4.5,
    reviews: 120,
    link: "/products/1",
  },
  {
    id: 2,
    category: "personal",
    title: "Aadhaar Card Verification",
    image: "/aadhaar.png",
    demand: "Most Demanding",
    demandLevel: "high",
    verifications: 20,
    duration: "7 days",
    price: 360,
    rating: 4.7,
    reviews: 200,
    link: "/products/2",
  },
  {
    id: 3,
    category: "government",
    title: "Passport Verification",
    image: "/passport.png",
    demand: "Most Demanding",
    demandLevel: "high",
    verifications: 20,
    duration: "7 days",
    price: 241,
    rating: 4.8,
    reviews: 150,
    link: "/products/3",
  },
  {
    id: 4,
    category: "personal",
    title: "Driving License Verification",
    image: "/drivinglicense.png",
    demand: "High Demand",
    demandLevel: "high",
    verifications: 15,
    duration: "7 days",
    price: 300,
    rating: 4.6,
    reviews: 90,
    link: "/products/4",
  },
]

export const verificationFeatures = [
  {
    id: 1,
    title: "GOVERNMENT ID VERIFICATION",
    description: "PAN Card, Aadhaar Card,\nVoter ID, Driving Licence,\nPassport",
    image: "/cat1.png",
    detailedText:
      "We authenticate each document against its issuing authority to prevent identity fraud and ensure complete compliance with regulatory standards.",
    ctaText: "Explore Government IDs",
    ctaLink: "/government-verification",
  },
  {
    id: 2,
    title: "COMPANY & CREDENTIAL VERIFICATION",
    description: "GST Registration, FSSAI,\nLicense, MSME Certification,\nCompany Registration",
    image: "/cat2.png",
    detailedText:
      "We verify business credentials to help you trust your business associates and ensure legitimate partnerships with verified entities.",
    ctaText: "Verify Business Credentials",
    ctaLink: "/business-verification",
  },
  {
    id: 3,
    title: "LEGAL & BACKGROUND CHECKS",
    description: "Criminal Records,\nCourt Cases,\nPolice FIR Checks",
    image: "/cat3.png",
    detailedText:
      "Ensure candidate or entity credibility with thorough legal record checks across multiple databases and jurisdictions.",
    ctaText: "Check Legal Records",
    ctaLink: "/background-checks",
  },
  {
    id: 4,
    title: "BIOMETRIC & LIVENESS CHECKS",
    description: "Face Match,\nLiveness Detection",
    image: "/cat4.png",
    detailedText:
      "AI-based facial recognition and liveness detection to avoid spoofing and ensure authentic identity verification.",
    ctaText: "Try Biometric Verification",
    ctaLink: "/biometric-verification",
  },
  {
    id: 5,
    title: "SPECIALIZED CHECKS",
    description: "Covid Certificate,\nOther Niche Verifications",
    image: "/cat5.png",
    detailedText:
      "From health to travel, verify specialized credentials quickly and reliably with our comprehensive verification network.",
    ctaText: "Explore Specialized Services",
    ctaLink: "/specialized-verification",
  },
]

export const pricingPlans = [
  {
    title: "Personal",
    price: "₹190",
    description: "Perfect for individuals getting started",
    features: [
      "Full Access to VerifyMyKyc",
      "100 GB Free Storage",
      "Unlimited Visitors",
      "10 Agents",
      "Live Chat Support",
    ],
    icon: Users,
    color: "blue" as const,
  },
  {
    title: "Professional",
    price: "₹495",
    description: "Best for growing businesses",
    features: [
      "Full Access to VerifyMyKyc",
      "500 GB Free Storage",
      "Unlimited Visitors",
      "50 Agents",
      "Priority Live Chat Support",
      "Advanced Analytics",
    ],
    highlighted: true,
    popular: true,
    icon: Zap,
    color: "purple" as const,
  },
  {
    title: "Business",
    price: "₹998",
    description: "For large scale operations",
    features: [
      "Full Access to VerifyMyKyc",
      "Unlimited Storage",
      "Unlimited Visitors",
      "Unlimited Agents",
      "24/7 Priority Support",
      "Advanced Analytics",
      "Custom Integrations",
    ],
    icon: Shield,
    color: "green" as const,
  },
]

export const verificationStats = [
  { value: 95, label: "Coverage for Indians", suffix: "%" },
  { value: 0.5, label: "Seconds - Speed to Verification", prefix: "~" },
  { value: 3, label: "Seconds. Same speed as phone OTP", prefix: "~" },
  { value: 1, label: "OTP-based solution in India", prefix: "#" },
]

export const trustPillars = [
  {
    title: "SPEED",
    icon: "/speed.png",
    brandLogo: "/verifymykyc.jpg",
  },
  {
    title: "ACCURACY",
    icon: "/dart.png",
    brandLogo: "/verifymykyc.jpg",
  },
  {
    title: "COMPLIANCE",
    icon: "/file.png",
    brandLogo: "/verifymykyc.jpg",
  },
]

export const partnerLogos = [
  { src: "/gartner.png", alt: "Gartner" },
  { src: "/forrester.png", alt: "Forrester" },
  { src: "/liminal.png", alt: "Liminal" },
  { src: "/acuity.png", alt: "Acuity" },
  { src: "/chartis.png", alt: "Chartis" },
  { src: "/qksgroup.png", alt: "QKS Group" },
]

export const featuredContent = {
  badge: "FEATURED",
  title: "CATEGORY LEADER",
  description: "VerifyMyKyc: a leader in the QKS 2025 SPARK Matrix for Identity Capture and Verification solutions.",
  ctaText: "Learn more",
  ctaLink: "#",
}

export const expertContent = {
  title: "Here's what the experts say",
  description:
    "Recognition for our tech innovation, leadership, and mission to make the internet a safer place for everyone.",
  ctaText: "Awards & recognition",
  ctaLink: "#",
}

export const customerReviews = [
  {
    text: "VerifyMyKyc has completely transformed our onboarding process. The speed and accuracy of verification is outstanding, and our customers love the seamless experience.",
    name: "Sarah Johnson",
    position: "Product Manager",
    company: "TechCorp",
    image: "/ashley.png",
    stars: 5,
    verified: true,
  },
  {
    text: "The API integration was smooth and the documentation is excellent. We've reduced our verification time from hours to seconds. Highly recommended!",
    name: "Michael Chen",
    position: "CTO",
    company: "StartupXYZ",
    image: "/jackline.png",
    stars: 5,
    verified: true,
  },
  {
    text: "Outstanding customer support and reliable service. The verification accuracy is impressive and has helped us maintain compliance effortlessly.",
    name: "Priya Sharma",
    position: "Compliance Officer",
    company: "FinanceHub",
    image: "/ashley2.png",
    stars: 5,
    verified: true,
  },
  {
    text: "Best KYC solution we've used. The user interface is intuitive and the verification process is lightning fast. Our conversion rates have improved significantly.",
    name: "David Wilson",
    position: "Head of Operations",
    company: "E-commerce Plus",
    image: "/sophia.png",
    stars: 4,
    verified: true,
  },
  {
    text: "Reliable, secure, and efficient. VerifyMyKyc has become an essential part of our business operations. The team is responsive and always helpful.",
    name: "Lisa Rodriguez",
    position: "Business Analyst",
    company: "DataFlow Inc",
    image: "/ashley.png",
    stars: 5,
    verified: true,
  },
]

export const reviewStats = [
  { value: 4.9, label: "Average Rating", suffix: "/5", decimals: 1 },
  { value: 10000, label: "Happy Customers", suffix: "+" },
  { value: 99.9, label: "Uptime", suffix: "%", decimals: 1 },
  { value: 24, label: "Support", suffix: "/7" },
]

export const faqData = [
  {
    question: "How does VerifyMyKyc work?",
    answer:
      "VerifyMyKyc verifies documents using secure APIs that communicate with government or trusted third-party databases. Our advanced algorithms ensure accurate and fast verification while maintaining the highest security standards.",
  },
  {
    question: "Is my data secure with VerifyMyKyc?",
    answer:
      "Yes, absolutely. All data is encrypted in transit and at rest using industry-standard encryption protocols. We adhere to strict security practices, comply with data protection regulations, and undergo regular security audits to ensure your information remains safe.",
  },
  {
    question: "Does VerifyMyKyc work for large teams?",
    answer:
      "Yes, VerifyMyKyc scales efficiently for large teams and enterprises. We provide centralized dashboards, role-based access control, bulk verification capabilities, and dedicated support to ensure smooth operations for organizations of any size.",
  },
  {
    question: "How do I create a new account?",
    answer:
      'Getting started is simple! Click on the "Start Verifying" button and follow our guided sign-up process. It takes less than 2 minutes to create your account and you can begin verifying documents immediately.',
  },
  {
    question: "What types of documents can be verified?",
    answer:
      "We support verification of various documents including PAN cards, Aadhaar cards, passports, driving licenses, voter IDs, GST certificates, and many more. Our platform covers both personal and business document verification needs.",
  },
  {
    question: "What is the pricing structure?",
    answer:
      "We offer flexible pricing plans to suit different needs - from individual users to large enterprises. Our plans include pay-per-verification options and monthly subscriptions. Contact our sales team for custom enterprise pricing.",
  },
]

export const footerData = {
  legalLinks: [
    { label: "Terms and conditions", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Cookies", href: "#" },
    { label: "Modern Slavery Statement", href: "#" },
  ],
  importantLinks: [
    { label: "Get help", href: "#" },
    { label: "Add your restaurant", href: "#" },
    { label: "Sign up to deliver", href: "#" },
    { label: "Create a business account", href: "#" },
  ],
  socialLinks: [
    { name: "facebook" as const, href: "#", color: "#1877F2" },
    { name: "instagram" as const, href: "#", color: "#E4405F" },
    { name: "tiktok" as const, href: "#", color: "#000000" },
    { name: "twitter" as const, href: "#", color: "#1DA1F2" },
    { name: "linkedin" as const, href: "#", color: "#0A66C2" },
  ],
  bottomLinks: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Do not sell or share my personal information", href: "#" },
  ],
}
