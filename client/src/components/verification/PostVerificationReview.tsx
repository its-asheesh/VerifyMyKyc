"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, X, CheckCircle, MessageSquare } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { reviewApi } from "../../services/api/reviewApi"
import { useAppSelector } from "../../redux/hooks"

interface PostVerificationReviewProps {
  productId: string
  serviceName?: string
  onReviewSubmitted?: () => void
}

export const PostVerificationReview: React.FC<PostVerificationReviewProps> = ({
  productId,
  serviceName,
  onReviewSubmitted,
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ rating: 5, title: "", comment: "" })
  const [submitted, setSubmitted] = useState(false)

  const { user } = useAppSelector((state) => state.auth)

  // Check if user has already reviewed this product (fetch before showing prompt)
  const { data: existingReviews } = useQuery({
    queryKey: ["product-reviews", productId, "check"],
    queryFn: () => reviewApi.getProductReviews(productId, { page: 1, limit: 100 }),
    enabled: isAuthenticated && !!user?.id && !!productId,
    staleTime: 30_000,
  })

  // Check if current user has already reviewed
  const hasReviewed = user?.id && existingReviews?.items?.some((review: any) => {
    // Check if review belongs to current user
    // userId can be a string (ID) or populated object with _id
    if (typeof review.userId === 'string') {
      return review.userId === user.id
    }
    if (review.userId && typeof review.userId === 'object') {
      return review.userId._id === user.id || review.userId.id === user.id
    }
    return false
  })

  // Show review prompt after a short delay (only if authenticated and hasn't reviewed)
  useEffect(() => {
    if (isAuthenticated && !hasReviewed && productId && user?.id && existingReviews !== undefined) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000) // Show after 2 seconds
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, hasReviewed, productId, user?.id, existingReviews])

  const createMutation = useMutation({
    mutationFn: () => reviewApi.createReview({ productId, ...form, verified: true }),
    onSuccess: () => {
      setSubmitted(true)
      setForm({ rating: 5, title: "", comment: "" })
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] })
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
      // Auto-close after 3 seconds
      setTimeout(() => {
        setIsOpen(false)
      }, 3000)
    },
  })

  if (!isAuthenticated || hasReviewed || submitted) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-50 max-w-md w-full mx-4"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">How was your experience?</h3>
                  <p className="text-xs text-gray-500">Help us improve {serviceName || "this service"}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Thank you!</h4>
                <p className="text-sm text-gray-600">Your review has been submitted.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (form.comment.trim()) {
                    createMutation.mutate()
                  }
                }}
                className="space-y-4"
              >
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm({ ...form, rating: n })}
                        className={`transition-transform hover:scale-110 ${n <= form.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                          }`}
                      >
                        <Star className="w-6 h-6" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    value={form.title}
                    onChange={(e: any) => setForm({ ...form, title: e.target.value })} // eslint-disable-line @typescript-eslint/no-explicit-any
                    placeholder="Brief summary of your experience"
                    maxLength={120}
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                    rows={3}
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    placeholder="Share your experience with this verification..."
                    required
                    maxLength={2000}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Maybe Later
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || !form.comment.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {createMutation.isPending ? "Submitting..." : "Submit Review"}
                  </button>
                </div>

                {createMutation.isError && (
                  <p className="text-xs text-red-600 text-center">
                    {createMutation.error instanceof Error
                      ? createMutation.error.message
                      : "Failed to submit review. You may have already reviewed this product."}
                  </p>
                )}
              </form>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

