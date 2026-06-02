"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Star } from "lucide-react"

interface ExpertSectionProps {
  title: string
  description: string
  ctaText: string
  ctaLink: string
}

export const ExpertSection: React.FC<ExpertSectionProps> = ({ title, description, ctaText, ctaLink }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="text-center md:text-left space-y-4"
    >
      {/* Decorative Element */}
      <motion.div
        className="flex justify-center md:justify-start mb-4"
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full">
          <Star className="w-6 h-6 text-white fill-white" />
        </div>
      </motion.div>

      <motion.h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight" whileHover={{ scale: 1.02 }}>
        {title}
      </motion.h3>

      <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-sm mx-auto md:mx-0">{description}</p>

      <motion.a
        href={ctaLink}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {ctaText}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      </motion.a>
    </motion.div>
  )
}
