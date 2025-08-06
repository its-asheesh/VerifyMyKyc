"use client"

import type React from "react"
import { motion } from "framer-motion"
import CountUp from "react-countup"

interface StatsCardProps {
  value: number
  label: string
  suffix?: string
  prefix?: string
  index: number
}

export const StatsCard: React.FC<StatsCardProps> = ({ value, label, suffix, prefix, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
      className="text-center"
    >
      <div className="text-2xl md:text-3xl font-bold mb-2">
        <CountUp
          start={0}
          end={value}
          duration={2}
          suffix={suffix}
          prefix={prefix}
          separator=","
          decimal="."
          decimals={value < 1 ? 1 : 0}
        />
      </div>
      <p className="text-blue-100 text-sm md:text-base">{label}</p>
    </motion.div>
  )
}
// Compare this snippet from client/src/components/layout/Navbar.tsx: