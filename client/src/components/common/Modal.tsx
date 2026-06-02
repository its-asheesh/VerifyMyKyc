"use client"

import React from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode
  maxWidthClassName?: string
}

const Backdrop: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
    onClick={onClick}
  />
)

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  maxWidthClassName = "max-w-2xl"
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <Backdrop onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            className={`fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] ${maxWidthClassName}`}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {icon && (
                    <div className="flex-shrink-0">
                      {icon}
                    </div>
                  )}
                  <div>
                    {title && <h3 className="text-lg font-semibold text-gray-900 leading-tight">{title}</h3>}
                    {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
                  </div>
                </div>
                <button
                  aria-label="Close"
                  className="p-2 -mr-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-auto">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal
