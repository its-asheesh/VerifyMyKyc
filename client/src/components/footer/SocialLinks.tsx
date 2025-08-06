"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Facebook, Instagram, Music, Smile, Twitter, Linkedin } from "lucide-react"

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music,
  snapchat: Smile,
  twitter: Twitter,
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
    <div className="flex gap-3 justify-center">
      {links.map((social, index) => {
        const IconComponent = socialIcons[social.name]
        return (
          <motion.a
            key={social.name}
            href={social.href}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{
              scale: 1.2,
              rotate: 5,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gray-600 hover:text-white hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
            style={
              {
                "--hover-color": social.color,
              } as React.CSSProperties
            }
          >
            <IconComponent className="w-5 h-5" />
          </motion.a>
        )
      })}
    </div>
  )
}
// Compare this snippet from client/src/components/footer/Footer.tsx: