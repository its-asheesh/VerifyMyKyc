"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Award } from "lucide-react"

interface FeaturedCardProps {
  badge: string
  title: string
  description: string
  ctaText: string
  ctaLink: string
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({ badge, title, description, ctaText, ctaLink }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
      className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white rounded-2xl shadow-2xl p-6 md:p-8 w-full md:max-w-[450px] relative overflow-hidden group"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          <motion.span
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <Award className="w-3 h-3" />
            {badge}
          </motion.span>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-lg md:text-xl text-white">{title}</h4>
          <p className="text-sm md:text-base text-blue-100 leading-relaxed">{description}</p>
        </div>

        <motion.a
          href={ctaLink}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-blue-200 transition-colors duration-300 group/link"
          whileHover={{ x: 4 }}
        >
          {ctaText}
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
        </motion.a>
      </div>
    </motion.div>
  )
}
