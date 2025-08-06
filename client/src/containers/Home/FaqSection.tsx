"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { FaqItem } from "../../components/faq/FaqItem"
import { FaqHeader } from "../../components/faq/FaqHeader"
import { faqData } from "../../utils/constants"

const FaqSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0) // First item open by default

  const toggleIndex = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index)
  }

  const handleCtaClick = () => {
    // Handle CTA click - could navigate to signup page
    console.log("Start Verifying clicked")
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left side - Header */}
          <FaqHeader
            title="Frequently Asked Questions"
            description="Find answers to common questions about VerifyMyKyc. Can't find what you're looking for? Contact our support team."
            ctaText="Start Verifying"
            onCtaClick={handleCtaClick}
          />

          {/* Right side - FAQ Items */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 space-y-4 w-full"
          >
            {faqData.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isActive={activeIndex === index}
                onToggle={() => toggleIndex(index)}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FaqSection
