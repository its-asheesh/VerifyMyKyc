"use client"

import type React from "react"
import { useState } from "react"
import { Star, Check, MessageSquare } from "lucide-react"

interface ReviewFormData {
  rating: number
  title: string
  content: string
}

interface ReviewFormErrors {
  rating?: string
  title?: string
  content?: string
}

export const ProductReviews: React.FC = () => {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    title: "",
    content: "",
  })
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<ReviewFormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: ReviewFormErrors = {}

    if (formData.rating === 0) newErrors.rating = "Please select a rating"
    if (!formData.title.trim()) newErrors.title = "Review title is required"
    if (!formData.content.trim()) newErrors.content = "Review content is required"
    if (formData.content.length < 10) newErrors.content = "Review must be at least 10 characters"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        rating: 0,
        title: "",
        content: "",
      })
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <div className="max-w-sm mx-auto p-4 sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-green-800 mb-2">Thank You!</h2>
          <p className="text-green-700">Your review has been submitted successfully.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto p-4 sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
      <div className="mb-6 text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Write a Review</h2>
        <p className="text-gray-600">Share your experience with this product</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:gap-6 lg:gap-8 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rating *</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="hover:scale-110 transition-all duration-200 p-1 rounded-full hover:bg-yellow-50"
                >
                  <Star
                    className={`w-6 h-6 lg:w-7 lg:h-7 transition-colors ${
                      star <= (hoveredRating || formData.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200 hover:fill-yellow-300 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && <p className="text-red-500 text-sm mt-1 font-medium">{errors.rating}</p>}
          </div>

          <div className="flex-1">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.title ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Summarize your review"
              maxLength={60}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1 font-medium">{errors.title}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="content"
            rows={3}
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none lg:rows-4 ${
              errors.content ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Tell us about your experience with this product..."
            maxLength={500}
          />
          {errors.content && <p className="text-red-500 text-sm mt-1 font-medium">{errors.content}</p>}
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">{formData.content.length}/500 characters</p>
            {formData.content.length >= 10 && <span className="text-green-600 text-sm font-medium">✓ Good length</span>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white px-6 py-3 lg:py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                Submit Review
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                rating: 0,
                title: "",
                content: "",
              })
              setErrors({})
            }}
            className="sm:w-auto px-6 py-3 lg:py-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Clear
          </button>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center leading-relaxed">
            By submitting, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  )
}

export default ProductReviews
