"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Users, MessageCircle } from "lucide-react"
import { ReviewCarousel } from "../../components/reviews/ReviewCarousel"
import { ReviewStats } from "../../components/reviews/ReviewStats"
import { reviewStats } from "../../utils/constants"
import { usePublicReviews } from "../../hooks/useReviews"
import type { Review } from "../../types/review"

const ReviewsSection: React.FC = () => {
  // Fetch approved reviews across all categories
  const { data, isLoading, isError } = usePublicReviews({ page: 1, limit: 20 })

  // Map backend reviews to ReviewCarousel card props
  const mappedReviews = (data?.items || []).map((r: Review) => {
    const userName = typeof r.userId === "string" ? "Verified User" : r.userId?.name || "Verified User"
    const userEmail = typeof r.userId === "string" ? undefined : r.userId?.email
    return {
      text: r.comment || r.title || "",
      name: userName,
      image: "", // ReviewCard will fallback to placeholder
      stars: r.rating || 5,
      position: undefined,
      company: undefined,
      verified: true,
      email: userEmail,
    }
  })

  // Compose stats: override first two with API values when available
  const apiAvg = data?.stats?.avgRating
  const apiCount = data?.stats?.count
  const statsToShow = apiAvg != null && apiCount != null
    ? [
        { value: Number(apiAvg.toFixed(1)), label: "Average Rating", suffix: "/5", decimals: 1 },
        { value: apiCount, label: "Happy Customers", suffix: "+" },
        ...reviewStats.slice(2),
      ]
    : reviewStats

  return (
    <section className="relative py-16 md:py-20 px-4 md:px-8 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800" />

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/20 rounded-full blur-lg animate-bounce" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-blue-100 tracking-wider uppercase">Customer Reviews</p>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
          >
            What Our{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Customers Say
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed"
          >
            Don't just take our word for it. Here's what our satisfied customers have to say about their experience with
            VerifyMyKyc.
          </motion.p>
        </motion.div>

        {/* Review Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {isLoading ? (
            <div className="text-center text-blue-100 py-8">Loading reviews…</div>
          ) : mappedReviews.length > 0 ? (
            <ReviewCarousel reviews={mappedReviews} autoPlay={true} autoPlayInterval={2000} />
          ) : (
            <div className="text-center text-blue-100 py-8">No reviews yet. Be the first to share your experience!</div>
          )}
        </motion.div>

        {/* Stats */}
        <ReviewStats stats={statsToShow} />

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-12 md:mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <Users className="w-5 h-5" />
            Join 10,000+ Happy Customers
          </motion.button>
        </motion.div>
      </div>

      <style>{`
        .bg-grid-white\\/10 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.1)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default ReviewsSection
