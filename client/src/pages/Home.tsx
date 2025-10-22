import type React from "react"
import HeroCarousel from "../components/carousel/HeroCarousel"
import VerificationFeatures from "../containers/Home/VerificationFeatures"
import FeaturesSection from "../containers/Home/FeaturesSection"
// import PricingSection from "../containers/Home/PricingSection"
import TrustSection from "../containers/Home/TrustSection"
import ReviewsSection from "../containers/Home/ReviewsSection"
import FaqSection from "../containers/Home/FaqSection"
import SubscribeSection from "../containers/Home/SubscribeSection"
import SEOHead from "../components/seo/SEOHead"

const Home: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "VerifyMyKYC",
    "url": "https://verifymykyc.com",
    "description": "India's leading KYC and identity verification platform",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://verifymykyc.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "Service",
          "name": "Aadhaar Verification",
          "description": "Instant Aadhaar card verification and validation"
        },
        {
          "@type": "Service",
          "name": "PAN Verification", 
          "description": "PAN card verification and validation services"
        },
        {
          "@type": "Service",
          "name": "Driving License Verification",
          "description": "Driving license verification and validation"
        },
        {
          "@type": "Service",
          "name": "Passport Verification",
          "description": "Passport verification and validation services"
        },
        {
          "@type": "Service",
          "name": "GSTIN Verification",
          "description": "GSTIN verification and business validation"
        },
        {
          "@type": "Service",
          "name": "Background Verification",
          "description": "Criminal record checks and background verification"
        }
      ]
    }
  };

  return (
    <>
      <SEOHead 
        title="VerifyMyKYC - India's Leading KYC & Identity Verification Platform"
        description="VerifyMyKYC provides instant identity verification services including Aadhaar, PAN, Driving License, Passport, GSTIN verification and background checks. Trusted by 10,000+ users across India."
        keywords="KYC verification, identity verification, Aadhaar verification, PAN verification, driving license verification, passport verification, GSTIN verification, background check, India, digital verification, compliance"
        structuredData={structuredData}
      />
      <div className="bg-gray-50 min-h-screen">
        <HeroCarousel />
        <VerificationFeatures />
        <FeaturesSection />
        {/* <PricingSection /> */}
        <TrustSection />
        {/* <ReviewsSection /> */}
        <FaqSection />
        <SubscribeSection />
      </div>
    </>
  )
}

export default Home
