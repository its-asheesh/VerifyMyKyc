"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
 
interface Service {
  key: string
  name: string
  description: string
  icon?: React.ElementType
}

interface VerificationLayoutProps {
  title: string
  description: string
  services: Service[]
  selectedService: Service
  onServiceChange: (service: Service) => void
  children: React.ReactNode
}

export const VerificationLayout: React.FC<VerificationLayoutProps> = ({
  title,
  description,
  services,
  selectedService,
  onServiceChange,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gray-50">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="w-80 max-w-[85vw] h-full bg-white shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Available Services</h3>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {services.map((service) => {
                  const IconComponent = service.icon
                  return (
                    <button
                      key={service.key}
                      onClick={() => {
                        onServiceChange(service)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedService.key === service.key
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                          {IconComponent && <IconComponent className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 text-sm leading-tight break-words">{service.name}</h4>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed break-words">{service.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              {/* Why Choose Us - Mobile */}
              <div className="p-4 border-t border-gray-200 mt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Why Choose Us?</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">99.9% Accuracy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">3 Second Verification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Bank-Grade Security</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="w-full bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">{description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)] w-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-80 xl:w-96 flex-shrink-0 bg-white border-r border-gray-200 flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Services</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {services.map((service) => {
              const IconComponent = service.icon
              return (
                <button
                  key={service.key}
                  onClick={() => onServiceChange(service)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedService.key === service.key
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                      {IconComponent && <IconComponent className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight break-words">{service.name}</h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed break-words">{service.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          {/* Why Choose Us - Desktop */}
          <div className="p-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Why Choose Us?</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">99.9% Accuracy</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">3 Second Verification</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Bank-Grade Security</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 h-full overflow-y-auto bg-gray-50">
          <div className="w-full h-full p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>
      
    </div>
  )
}
