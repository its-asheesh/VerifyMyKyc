"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Star, Users, Zap, Shield } from "lucide-react"
import type { Product } from "../../types/product"
import { AadhaarSection } from "../verification/AadhaarSection"
import { PanSection } from "../verification/PanSection"
import { DrivingLicenseSection } from "../verification/DrivingLicenseSection"
import { VoterSection } from "../verification/VoterSection"
import { GstinSection } from "../verification/GstinSection"
import { CompanySection } from "../verification/CompanySection"

interface ProductOverviewProps {
  product: Product
}

export const ProductOverview: React.FC<ProductOverviewProps> = ({ product }) => {
  const [aadhaarModalOpen, setAadhaarModalOpen] = useState(false)
  const [panModalOpen, setPanModalOpen] = useState(false)
  const [drivingLicenseModalOpen, setDrivingLicenseModalOpen] = useState(false)
  const [voterModalOpen, setVoterModalOpen] = useState(false)
  const [gstinModalOpen, setGstinModalOpen] = useState(false)
  const [companyModalOpen, setCompanyModalOpen] = useState(false)
  const title = product.title.toLowerCase()
  const categoryName = product.category.name.toLowerCase()
  const isAadhaarProduct = title.includes("aadhaar") || categoryName.includes("aadhaar")
  // Use word-boundary to avoid matching 'pan' inside 'company'
  const isPanProduct = /\bpan\b/.test(title) || /\bpan\b/.test(categoryName)
  const isDrivingLicenseProduct = title.includes("driving") || categoryName.includes("driving")
  const isVoterProduct = title.includes("voter") || categoryName.includes("voter")
  const isGstinProduct = title.includes("gstin") || categoryName.includes("gstin") || title.includes("gst") || categoryName.includes("gst")
  const isCompanyProduct =
    title.includes("company") ||
    categoryName.includes("company") ||
    title.includes("mca") ||
    title.includes("cin") ||
    title.includes("din")

  const handleTryDemo = () => {
    if (isAadhaarProduct) setAadhaarModalOpen(true)
    else if (isDrivingLicenseProduct) setDrivingLicenseModalOpen(true)
    else if (isVoterProduct) setVoterModalOpen(true)
    else if (isGstinProduct) setGstinModalOpen(true)
    else if (isCompanyProduct) setCompanyModalOpen(true)
    else if (isPanProduct) setPanModalOpen(true)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left: Product Image */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-lg">
          <img src={product.image || "/placeholder.svg"} alt={product.title} className="w-full h-64 object-contain" />
        </div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right: Product Details */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-6"
      >
        {/* Category Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
          <Shield className="w-4 h-4" />
          {product.category.name}
        </div>

        {/* Description */}
        <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>

        {/* Key Features */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
          <div className="grid grid-cols-1 gap-3">
            {product.features.slice(0, 4).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-sm text-gray-600">Rating</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">1.2k</div>
            <div className="text-sm text-gray-600">Users</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 pt-6">
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
            Get Started
          </button>
          <button
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
            onClick={handleTryDemo}
            disabled={!isAadhaarProduct && !isPanProduct && !isDrivingLicenseProduct && !isVoterProduct && !isGstinProduct && !isCompanyProduct}
          >
            Try Demo
          </button>
        </div>
        {aadhaarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative p-6">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setAadhaarModalOpen(false)}
              >
                &times;
              </button>
              <AadhaarSection />
            </div>
          </div>
        )}
        {panModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative p-6">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setPanModalOpen(false)}
              >
                &times;
              </button>
              <PanSection />
            </div>
          </div>
        )}
        {drivingLicenseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative p-6">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setDrivingLicenseModalOpen(false)}
              >
                &times;
              </button>
              <DrivingLicenseSection />
            </div>
          </div>
        )}
        {voterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative p-6">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setVoterModalOpen(false)}
              >
                &times;
              </button>
              <VoterSection />
            </div>
          </div>
        )}
        {gstinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative p-6">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setGstinModalOpen(false)}
              >
                &times;
              </button>
              <GstinSection />
            </div>
          </div>
        )}
        {companyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative p-6">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setCompanyModalOpen(false)}
              >
                &times;
              </button>
              <CompanySection />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
