import type React from "react"
import HeroCarousel from "../components/carousel/HeroCarousel"
import VerificationFeatures from "../containers/Home/VerificationFeatures"
import FeaturesSection from "../containers/Home/FeaturesSection"
// import PricingSection from "../containers/Home/PricingSection"
import TrustSection from "../containers/Home/TrustSection"
import ReviewsSection from "../containers/Home/ReviewsSection"
import FaqSection from "../containers/Home/FaqSection"
import SubscribeSection from "../containers/Home/SubscribeSection"

const Home: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <HeroCarousel />
      <VerificationFeatures />
      <FeaturesSection />
      {/* <PricingSection /> */}
      <TrustSection />
      <ReviewsSection />
      <FaqSection />
      <SubscribeSection />
    </div>
  )
}

export default Home
