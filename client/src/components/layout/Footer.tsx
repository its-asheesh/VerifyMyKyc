"use client"

import type React from "react"
import { motion } from "framer-motion"
import { FooterSection } from "../footer/FooterSection"
import { SocialLinks } from "../footer/SocialLinks"
import { NewsletterForm } from "../footer/NewsletterForm"
import { footerData } from "../../utils/constants"

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-50 to-white border-t-2 border-blue-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Logo and Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 text-center lg:text-left"
          >
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="mb-6">
              <div className="font-bold text-2xl tracking-tight">
                <span className="text-blue-600">Verify</span>
                <span className="text-orange-500">MyKyc</span>
              </div>
            </motion.div>
            <p className="text-blue-600 text-sm leading-relaxed max-w-xs mx-auto lg:mx-0">
              Company # 490039-445, Registered with House of companies.
            </p>
          </motion.div>

          {/* Newsletter and Social */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 text-center"
          >
            <h3 className="font-bold text-blue-600 mb-6 text-xl">Get Exclusive Deals in your Inbox</h3>

            <div className="mb-6">
              <NewsletterForm />
            </div>

            <SocialLinks links={footerData.socialLinks} />
          </motion.div>

          {/* Footer Links */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
            <FooterSection title="Legal Pages" links={footerData.legalLinks} index={0} />
            <FooterSection title="Important Links" links={footerData.importantLinks} index={1} />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-blue-600 text-white py-4"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-center md:text-left">VerifyMyKyc Copyright 2024, All Rights Reserved.</p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              {footerData.bottomLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="text-white hover:text-orange-300 hover:underline transition-colors duration-300"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer
// Compare this snippet from client/src/components/footer/FooterSection.tsx: