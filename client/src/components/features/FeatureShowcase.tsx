"use client";

import type React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { easeOut } from "framer-motion";

interface FeatureShowcaseProps {
  title: string;
  description: string;
  image: string;
  detailedText: string;
  reverse?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOut },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOut },
  },
};

const getTextVariants = (reverse: boolean) => ({
  hidden: { opacity: 0, x: reverse ? 40 : -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easeOut, delay: 0.2 },
  },
});

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  title,
  description,
  image,
  detailedText,
  reverse = false,
  ctaText = "Explore Product",
  ctaLink = "#",
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={cardVariants}
      className="relative"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl -z-10" />

      <motion.div
        whileHover={{ y: -4 }} // Reduced hover lift for subtlety
        transition={{ duration: 0.4 }}
        className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 sm:p-8 md:p-10 my-6 md:my-8 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-orange-400/10 to-pink-400/10 rounded-full blur-xl" />

        <div
          className={`grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-center ${
            reverse ? "lg:grid-flow-col-dense" : ""
          }`}
        >
          {/* Image Section (2 columns wide) */}
          <motion.div
            variants={imageVariants}
            className={`relative order-2 lg:order-none ${
              reverse ? "lg:col-start-4 lg:col-span-2" : "lg:col-span-2"
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 scale-110" />

              {/* Image Container */}
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-1 sm:p-1.5 md:p-2">
                {" "}
                {/* Minimal padding */}
                <img
                  src={image || "/placeholder.svg"}
                  alt={title}
                  className="w-full h-52 sm:h-64 md:h-72 lg:h-80 xl:h-96 object-contain rounded-xl" // Full width, taller height, fills space
                />
                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-1.5 rounded-lg shadow-lg"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </motion.div>
              </div>

              {/* Stats (mobile only) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 gap-2 py-2 mt-3 lg:hidden"
              >
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-sm sm:text-base font-bold text-blue-600">
                    99.9%
                  </div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="text-sm sm:text-base font-bold text-green-600">
                    3s
                  </div>
                  <div className="text-xs text-gray-600">Verify</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Content Section (3 columns wide) */}
          <motion.div
            variants={getTextVariants(reverse)}
            className={`space-y-4 order-1 lg:order-none ${
              reverse ? "lg:col-start-1 lg:col-span-3" : "lg:col-span-3"
            }`}
          >
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              {title}
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight text-gray-900"
            >
              {description}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-sm sm:text-base text-gray-600 leading-relaxed"
            >
              {detailedText}
            </motion.p>

            {/* Stats (desktop only) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="hidden lg:grid grid-cols-2 gap-4 py-4"
            >
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <div className="text-xl font-bold text-blue-600">99.9%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="text-xl font-bold text-green-600">3s</div>
                <div className="text-sm text-gray-600">Verify</div>
              </div>
            </motion.div>

            {/* CTA Button (desktop only) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="hidden lg:block"
            >
              <motion.a
                href={ctaLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2.5 sm:gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {ctaText}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* CTA Button (mobile only) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-4 lg:hidden"
        >
          <motion.a
            href={ctaLink}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            {ctaText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
