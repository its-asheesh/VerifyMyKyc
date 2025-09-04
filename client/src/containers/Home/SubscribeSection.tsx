"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Bell, Shield, Users } from "lucide-react"
import { SubscribeForm } from "../../components/subscribe/SubscribeForm"
import { subscribe as subscribeApi } from "../../services/subscription.service"

const SubscribeSection: React.FC = () => {
  const handleSubscribe = async (email: string): Promise<boolean> => {
    try {
      await subscribeApi(email)
      return true
    } catch (err) {
      console.error("Subscribe error", err)
      return false
    }
  }

  return (
    <section className="py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-blue-400/20 rounded-full blur-lg animate-bounce" />

          <div className="relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 md:mb-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex justify-center mb-4"
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Bell className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
              >
                Stay Ahead with Our{" "}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Newsletter
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed"
              >
                Get the latest industry insights, exclusive content, and special offers delivered straight to your
                inbox.
              </motion.p>
            </motion.div>

            {/* Subscribe Form */}
            <div className="flex justify-center mb-8">
              <SubscribeForm onSubmit={handleSubscribe} />
            </div>

            {/* Features */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.5, duration: 0.6 }}
  className="flex flex-wrap md:flex-nowrap items-center justify-center gap-4 sm:gap-6 md:gap-6 mb-8"
>
  {[
    { icon: Shield, text: "Industry Insights" },
    { icon: Users, text: "Exclusive Content" },
    { icon: Bell, text: "Special Offers" },
  ].map((item, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
      className="flex items-center justify-center gap-2 sm:gap-3 text-white/90 text-xs sm:text-sm md:text-base whitespace-nowrap"
    >
      <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="font-medium">{item.text}</span>
    </motion.div>
  ))}
</motion.div>

            {/* Disclaimer */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-xs text-center text-white/70 max-w-3xl mx-auto leading-relaxed"
            >
              By subscribing, you agree to our{" "}
              <a href="#" className="underline hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>{" "}
              and consent to receive updates from us. You can unsubscribe at any time.
            </motion.p>
          </div>

          <style>{`
            .bg-grid-white\\/10 {
              background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.1)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
            }
          `}</style>
        </motion.div>
      </div>
    </section>
  )
}

export default SubscribeSection
