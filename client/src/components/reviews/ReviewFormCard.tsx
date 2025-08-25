// components/reviews/ReviewFormCard.tsx
"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { reviewApi } from "../../services/api/reviewApi"
import { CheckCircle } from "lucide-react"

export const ReviewFormCard = ({ productId }: { productId: string }) => {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ rating: 5, title: "", comment: "" })
  const [submitted, setSubmitted] = useState(false)
  const hasToken = !!localStorage.getItem("token")

  const mutation = useMutation({
    mutationFn: () => reviewApi.createReview({ productId, ...form }),
    onSuccess: () => {
      setSubmitted(true)
      setForm({ rating: 5, title: "", comment: "" })
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] })
    },
  })

  if (submitted) {
    return (
      <div className="border rounded-lg p-6 bg-green-50 text-center">
        <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
        <h4 className="font-semibold text-gray-900">Thank you!</h4>
        <p className="text-sm text-gray-600">Your review has been submitted.</p>
      </div>
    )
  }

  if (!hasToken) {
    return (
      <div className="border rounded-lg p-6 bg-gray-50 text-center">
        <p className="text-gray-700">
          Please <a href="/login" className="text-blue-600 underline">log in</a> to leave a review.
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-6 bg-gray-50">
      <h4 className="font-semibold text-gray-900 mb-4">Write a Review</h4>
      <form onSubmit={(e) => { e.preventDefault(); if (form.comment.trim()) mutation.mutate() }} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setForm({ ...form, rating: n })}
                className={`text-xl ${n <= form.rating ? "text-yellow-500" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-700">Title (optional)</label>
          <input
            className="w-full border rounded-md p-2 text-sm"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Comment</label>
          <textarea
            className="w-full border rounded-md p-2 text-sm h-24"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
        >
          {mutation.isPending ? "Submitting..." : "Submit Review"}
        </button>
        {mutation.isError && (
          <p className="text-xs text-red-600 mt-1">Error submitting. You may have already reviewed.</p>
        )}
      </form>
    </div>
  )
}