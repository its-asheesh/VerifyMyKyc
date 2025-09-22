"use client";

import type React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FooterSection } from "../footer/FooterSection";
import { SocialLinks } from "../footer/SocialLinks";
import { footerData } from "../../utils/constants";
import { isInternalLink } from "../../utils/helpers";
import { Mail, Phone, MapPin } from "lucide-react";
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
            className="lg:col-span-3 text-center lg:text-left space-y-2"
          >
            {/* Logo */}
            <motion.div
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.3 }}
  className="mb-6"
>
  <div className="flex justify-center md:justify-start items-center">
    {/* Logo Container */}
    <div className="relative w-50 h-16 mr-4">  
      <img
        src="/verifymykyclogo.svg"
        alt="VerifyMyKyc Logo"
        className="w-full h-full object-contain opacity-100 transition-opacity duration-300"
        onError={(e) => {
          e.currentTarget.classList.add("opacity-0", "pointer-events-none");
          const fallback = e.currentTarget.parentElement?.querySelector(".logo-fallback");
          if (fallback) {
            fallback.classList.remove("hidden");
          }
        }}
      />
      {/* Fallback Text */}
      <span
        className="logo-fallback hidden absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-600 bg-white dark:bg-slate-800 rounded-md"
        aria-label="VerifyMyKyc"
      >
        VMK
      </span>
    </div>

    {/* Optional: You can keep or remove the text "VerifyMyKyc" beside the logo */}
    {/* 
    <div>
      <div className="font-bold text-2xl tracking-tight">
        <span className="text-blue-600">Verify</span>
        <span className="text-orange-500">MyKyc</span>
      </div>
    </div>
    */}
  </div>
</motion.div>
            {/* Contact Info */}
            <div className="space-y-2 text-blue-600 text-sm max-w-xs mx-auto lg:mx-0">
              {/* Email 1 */}
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <a
                  href="mailto:verifymykyc@gmail.com"
                  className="hover:underline hover:text-blue-800 transition-colors"
                >
                  verifymykyc@gmail.com
                </a>
              </div>

              {/* Email 2 */}
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <a
                  href="mailto:verifymykyc@navigantinc.com"
                  className="hover:underline hover:text-blue-800 transition-colors"
                >
                  verifymykyc@navigantinc.com
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <a
                  href="tel:+919560652708"
                  className="hover:underline hover:text-blue-800 transition-colors"
                >
                  +91 95606 52708
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start pt-1">
                <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                <span className="leading-tight">
                  A 24/5, Mohan Cooperative Industrial Area, Badarpur, Second
                  Floor, New Delhi 110044
                </span>
              </div>
            </div>
          </motion.div>

          {/* Social Links and Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 text-center"
          >
            <h3 className="font-bold text-blue-600 mb-6 text-xl">
              Follow Us
            </h3>

            <SocialLinks links={footerData.socialLinks} />

            {/* Navigation Links */}
            <div className="mt-8 pt-6 border-t border-blue-200">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link
                  to="/products"
                  className="text-blue-600 hover:text-orange-500 hover:underline transition-colors duration-300 font-medium"
                >
                  Products
                </Link>
                <span className="text-blue-300">•</span>
                <Link
                  to="/about"
                  className="text-blue-600 hover:text-orange-500 hover:underline transition-colors duration-300 font-medium"
                >
                  About Us
                </Link>
                <span className="text-blue-300">•</span>
                <Link
                  to="/blog"
                  className="text-blue-600 hover:text-orange-500 hover:underline transition-colors duration-300 font-medium"
                >
                  Blog
                </Link>
                <span className="text-blue-300">•</span>
                <Link
                  to="/contact"
                  className="text-blue-600 hover:text-orange-500 hover:underline transition-colors duration-300 font-medium"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Footer Links */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
            <FooterSection
              title="Legal Pages"
              links={footerData.legalLinks}
              index={0}
            />
            <FooterSection
              title="Important Links"
              links={footerData.importantLinks}
              index={1}
            />
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
            <p className="text-sm text-center md:text-left">
              VerifyMyKyc Copyright {new Date().getFullYear()}, All Rights
              Reserved.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              {footerData.bottomLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  {isInternalLink(link.href) ? (
                    <Link
                      to={link.href}
                      className="text-white hover:text-orange-300 hover:underline transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-orange-300 hover:underline transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
// Compare this snippet from client/src/components/footer/FooterSection.tsx:
