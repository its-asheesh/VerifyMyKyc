"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Star, Award } from "lucide-react"

// -----------------------------------------------------------------------------
// ExpertSection Component
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// PartnerLogo Component
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// TrustPillar Component
// -----------------------------------------------------------------------------
interface TrustPillarProps {
    title: string
    icon: string
    brandLogo?: string
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

            {/* Title */}
            <motion.p
                className="text-sm md:text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
            >
                {title}
            </motion.p>
        </motion.div>
    )
}

// -----------------------------------------------------------------------------
// FeaturedCard Component
// -----------------------------------------------------------------------------
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
