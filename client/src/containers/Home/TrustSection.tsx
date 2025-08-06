"use client"

import type React from "react"
import { motion } from "framer-motion"
import { TrustPillar } from "../../components/trust/TrustPillar"
import { PartnerLogo } from "../../components/trust/PartnerLogo"
import { FeaturedCard } from "../../components/trust/FeaturedCard"
import { ExpertSection } from "../../components/trust/ExpertSection"
import { trustPillars, partnerLogos, featuredContent, expertContent } from "../../utils/constants"

const TrustSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How returning{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              customers trust
            </span>{" "}
            our products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built on the foundation of speed, accuracy, and compliance - trusted by industry leaders worldwide.
          </p>
        </motion.div>

        {/* Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-20 md:mb-24">
          {trustPillars.map((pillar, index) => (
            <TrustPillar
              key={pillar.title}
              title={pillar.title}
              icon={pillar.icon}
              brandLogo={pillar.brandLogo}
              index={index}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16 items-start">
          {/* Left Section: Partner Logos + Featured Card */}
          <div className="lg:col-span-2 space-y-10 md:space-y-12">
            {/* Partner Logos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-6 text-center md:text-left">
                Trusted by Industry Leaders
              </h3>
              <div className="flex flex-wrap gap-8 md:gap-12 justify-center md:justify-start items-center">
                {partnerLogos.map((logo, index) => (
                  <PartnerLogo key={index} src={logo.src} alt={logo.alt} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Featured Card */}
            <div className="flex justify-center md:justify-start">
              <FeaturedCard
                badge={featuredContent.badge}
                title={featuredContent.title}
                description={featuredContent.description}
                ctaText={featuredContent.ctaText}
                ctaLink={featuredContent.ctaLink}
              />
            </div>
          </div>

          {/* Right Section: Expert Recognition */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <ExpertSection
              title={expertContent.title}
              description={expertContent.description}
              ctaText={expertContent.ctaText}
              ctaLink={expertContent.ctaLink}
            />
          </div>
        </div>
      </div>

      <style>{`
        .bg-grid-white\\/5 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
      `}</style>
    </section>
  )
}

export default TrustSection
