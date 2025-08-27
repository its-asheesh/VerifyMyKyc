"use client"

// SocialLinks.tsx

import type React from "react"
import { motion } from "framer-motion"
import { Facebook, Instagram, X, Linkedin } from "lucide-react" // ✅ X instead of Music/Smile/Twitter

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  x: X, // ✅ Map 'x' to X icon
  linkedin: Linkedin,
}

interface SocialLinksProps {
  links: Array<{
    name: keyof typeof socialIcons
    href: string
    color: string
  }>
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  return (
    <div className="flex gap-4 justify-center">
      {links.map((social, index) => {
        const IconComponent = socialIcons[social.name]
        return (
          <motion.a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: index * 0.15,
              duration: 0.4,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              scale: 1.15,
              rotate: [0, -5, 5, 0],
              y: -2,
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 
                       backdrop-blur-md border border-white/30 flex items-center justify-center 
                       text-gray-700 hover:text-white transition-all duration-300 
                       shadow-lg hover:shadow-2xl hover:shadow-blue-500/25
                       before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br 
                       before:from-transparent before:to-black/10 before:opacity-0 
                       hover:before:opacity-100 before:transition-opacity before:duration-300"
            style={
              {
                "--hover-color": social.color,
              } as React.CSSProperties
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${social.color}20, ${social.color}40)`
              e.currentTarget.style.borderColor = social.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = ""
              e.currentTarget.style.borderColor = ""
            }}
          >
            <div
              className="absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-100 
                           transition-opacity duration-300 blur-sm -z-10"
              style={{ background: `linear-gradient(135deg, ${social.color}40, ${social.color}20)` }}
            />

            <IconComponent className="w-5 h-5 relative z-10 group-hover:drop-shadow-sm transition-all duration-300" />

            <div
              className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/20 
                           group-hover:animate-pulse transition-all duration-300"
            />
          </motion.a>
        )
      })}
    </div>
  )
}
