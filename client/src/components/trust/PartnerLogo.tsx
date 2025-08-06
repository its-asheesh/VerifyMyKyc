"use client"

import type React from "react"
import { motion } from "framer-motion"

interface PartnerLogoProps {
  src: string
  alt: string
  index: number
}

export const PartnerLogo: React.FC<PartnerLogoProps> = ({ src, alt, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.3 },
      }}
      className="group cursor-pointer"
    >
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className="h-10 md:h-12 object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
      />
    </motion.div>
  )
}
