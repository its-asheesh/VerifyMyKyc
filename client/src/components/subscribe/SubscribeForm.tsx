"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react"
import { AnimatePresence } from "framer-motion"

interface SubscribeFormProps {
  onSubmit: (email: string) => Promise<boolean>
}

export const SubscribeForm: React.FC<SubscribeFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.")
      setLoading(false)
      return
    }

    try {
      const result = await onSubmit(email)
      if (result) {
        setSuccess(true)
        setEmail("")
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError("Failed to subscribe. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.6 }}
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative">
        <div className="flex items-center bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 p-2 shadow-xl">
          <div className="flex items-center pl-4 pr-2">
            <Mail className="w-4 h-4 text-white/70" />
          </div>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent flex-1 px-2 py-3 text-white placeholder-white/70 outline-none text-sm md:text-base"
            disabled={loading}
          />
          <motion.button
            type="submit"
            disabled={loading || !email}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Subscribe</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 mt-3 text-red-300 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 mt-3 text-green-300 text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Thank you for subscribing!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  )
}
