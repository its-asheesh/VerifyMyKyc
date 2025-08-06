"use client"

import type React from "react"
import { motion } from "framer-motion"

interface TrustPillarProps {
  title: string
  icon: string
  brandLogo: string
  index: number
}

export const TrustPillar: React.FC<TrustPillarProps> = ({ title, icon, brandLogo, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3 },
      }}
      className="flex flex-col items-center gap-4 group cursor-pointer"
    >
      {/* Icon with animated background */}
      <div className="relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <div className="relative bg-white rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
          <motion.img
            src={icon}
            alt={title}
            className="w-12 h-12 md:w-16 md:h-16"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* Brand Logo */}
      <motion.img
        src={brandLogo}
        alt="VerifyMyKyc"
        className="w-16 md:w-20 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        whileHover={{ scale: 1.1 }}
      />

      {/* Title */}
      <motion.p
        className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
      >
        {title}
      </motion.p>
    </motion.div>
  )
}
