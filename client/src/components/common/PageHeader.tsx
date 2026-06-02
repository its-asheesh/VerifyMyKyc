"use client"

import type React from "react"
import { motion } from "framer-motion"
import { BackButton } from "./BackButton"
import { useNavigate } from "react-router-dom"
import { Container } from "./Container"
import { Heading } from "./Heading"
import { Section } from "./Section"

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  children?: React.ReactNode
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  children,
  className = "",
}) => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Section variant="gradient" className={`py-6 md:py-10 ${className}`}>
        <div className="flex items-center justify-between">
          {/* Header content only half width */}
          <div className="w-full">
            {showBackButton && (
              <BackButton />
            )}
            <Heading level={1} className="mb-3">
              {title}
            </Heading>
            {subtitle && (
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl">
                {subtitle}
              </p>
            )}
          </div>

          {/* Children (actions) stay on right */}
          {children && <div className="ml-6">{children}</div>}
        </div>
      </Section>
    </motion.div>
  )
}
