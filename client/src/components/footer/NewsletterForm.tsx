"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { subscribe } from "../../services/subscription.service"
import { toast } from "react-hot-toast"

export const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.")
      setLoading(false)
      return
    }

    try {
      await subscribe(email)
      setSuccess(true)
      setEmail("")
      toast.success('Thank you for subscribing!')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const error = err as Error
      const errorMessage = error.message || 'Failed to subscribe. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="relative"
      >
        <div className="flex items-center bg-blue-50 rounded-2xl border border-blue-100 p-1 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center pl-4 pr-2">
            <Mail className="w-4 h-4 text-blue-500" />
          </div>
          <input
            type="email"
            placeholder="Enter Your Query"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent flex-1 px-2 py-3 text-gray-700 placeholder-gray-500 outline-none text-sm"
            disabled={loading}
          />
          <motion.button
            type="submit"
            disabled={loading || !email}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                <span className="hidden sm:inline">Ask Query</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Status Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-2 text-red-500 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-2 text-green-500 text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Thank you for your query!
          </motion.div>
        )}
      </motion.form>

      <p className="text-xs text-blue-600 mt-3 text-center">
        We won't spam, read our{" "}
        <a href="#" className="underline hover:text-orange-500 transition-colors duration-300">
          email policy
        </a>
      </p>
    </div>
  )
}
// Compare this snippet from client/src/components/footer/Footer.tsx:
