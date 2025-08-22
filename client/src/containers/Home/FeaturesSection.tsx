"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Sparkles, Target, Zap } from "lucide-react"
import { FeatureShowcase } from "../../components/features/FeatureShowcase"
import { verificationFeatures } from "../../utils/constants"

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-30" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl animate-pulse" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Comprehensive Solutions
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
              Comprehensive Verification
            </span>
            <br />
            <span className="text-blue-600">Solutions</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
          >
            From government IDs to business credentials, we provide end-to-end verification services to ensure trust and
            security in every interaction.
          </motion.p>

          {/* Stats */}
          <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.6, duration: 0.8 }}
  className="grid grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto"
>
  {[
    { icon: Target, value: "99.9%", label: "Accuracy Rate" },
    { icon: Zap, value: "3s", label: "Avg. Verification Time" },
    { icon: Sparkles, value: "24/7", label: "Support Available" },
  ].map((stat, index) => (
    <motion.div
      key={stat.label}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mb-3 sm:mb-4 mx-auto">
        <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <div className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.value}</div>
      <div className="text-xs sm:text-base text-gray-600 font-medium">{stat.label}</div>
    </motion.div>
  ))}
</motion.div>

        </motion.div>

        {/* Feature Cards */}
        <div className="space-y-8 md:space-y-16">
          {verificationFeatures.map((feature, index) => (
            <FeatureShowcase
              key={feature.id}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              detailedText={feature.detailedText}
              reverse={index % 2 === 1}
              ctaText={feature.ctaText}
              ctaLink={feature.ctaLink}
            />
          ))}
        </div>
      </div>

      <style>{`
        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.05)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
      `}</style>
    </section>
  )
}

export default FeaturesSection
