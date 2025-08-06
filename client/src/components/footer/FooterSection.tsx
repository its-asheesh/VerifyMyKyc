"use client"

import type React from "react"
import { motion } from "framer-motion"

interface FooterSectionProps {
  title: string
  links: Array<{
    label: string
    href: string
  }>
  index: number
}

export const FooterSection: React.FC<FooterSectionProps> = ({ title, links, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex-1 min-w-[200px]"
    >
      <h3 className="font-bold text-blue-600 mb-4 text-lg">{title}</h3>
      <div className="space-y-3">
        {links.map((link, linkIndex) => (
          <motion.div
            key={link.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + linkIndex * 0.05 }}
          >
            <a
              href={link.href}
              className="text-blue-600 text-sm hover:text-orange-500 hover:underline transition-all duration-300 block"
            >
              {link.label}
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
// Compare this snippet from client/src/components/footer/Footer.tsx:
