"use client"

import type React from "react"
import { motion } from "framer-motion"
import CountUp from "react-countup"

interface ReviewStatsProps {
  stats: Array<{
    value: number
    label: string
    suffix?: string
    prefix?: string
    decimals?: number
  }>
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 md:mt-16"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
          className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
        >
          <div className="text-2xl md:text-3xl font-bold text-white mb-2">
            <CountUp
              start={0}
              end={stat.value}
              duration={2}
              suffix={stat.suffix}
              prefix={stat.prefix}
              separator=","
              decimal="."
              decimals={stat.decimals || 0}
            />
          </div>
          <div className="text-sm text-blue-100">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  )
}
