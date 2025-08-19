"use client"

import React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { reviewApi } from "../../services/api/reviewApi"
import type { Review } from "../../types/review"
import { CheckCircle } from "lucide-react"

interface ProductReviewsProps {
  productId: string
  showList?: boolean
  showForm?: boolean
  showStats?: boolean
  limit?: number
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, showList = true, showForm = true, showStats = true, limit = 20 }) => {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ["product-reviews", productId, limit],
    queryFn: () => reviewApi.getProductReviews(productId, { page: 1, limit }),
    staleTime: 30_000,
  })

  const [form, setForm] = React.useState<{ rating: number; title: string; comment: string }>({
    rating: 5,
    title: "",
    comment: "",
  })

  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("token")
  const [submitted, setSubmitted] = React.useState(false)
  const [showAll, setShowAll] = React.useState(false)
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  const createMutation = useMutation({
    mutationFn: async () => reviewApi.createReview({ productId, ...form }),
    onSuccess: () => {
      setSubmitted(true)
      setForm({ rating: 5, title: "", comment: "" })
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] })
    },
  })

  const formCard = (
    <div className="border rounded-lg p-4 bg-gray-50">
      {submitted ? (
        <div className="flex flex-col items-center text-center py-6">
          <CheckCircle className="w-12 h-12 text-green-600 mb-2" />
          <h4 className="font-semibold text-gray-900 mb-1">Thank you for your rating & review!</h4>
          <p className="text-sm text-gray-600">We appreciate your feedback.</p>
        </div>
      ) : (
        <>
          <h4 className="font-semibold text-gray-900 mb-3">Write a review</h4>
          {!hasToken ? (
            <p className="text-sm text-gray-600">Please <a href="/login" className="text-blue-600 underline">login</a> to submit a review.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!form.comment.trim()) return
                createMutation.mutate()
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm text-gray-700">Rating</label>
                <div className="mt-1 flex items-center gap-1" role="radiogroup" aria-label="Rating">
                  {([1,2,3,4,5] as const).map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setForm({ ...form, rating: n })}
                      aria-checked={form.rating === n}
                      role="radio"
                      className={`text-2xl leading-none ${n <= form.rating ? "text-yellow-500" : "text-gray-300"}`}
                      title={`${n} star${n > 1 ? "s" : ""}`}
                    >
                      {n <= form.rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Title (optional)</label>
                <input
                  className="mt-1 w-full border rounded-md p-2"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Comment</label>
                <textarea
                  className="mt-1 w-full border rounded-md p-2 h-28"
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 disabled:opacity-60"
              >
                {createMutation.isPending ? 'Submitting…' : 'Submit Review'}
              </button>
              {createMutation.isError && (
                <div className="text-xs text-red-600">Failed to submit review. You may have already reviewed.</div>
              )}
            </form>
          )}
        </>
      )}
    </div>
  )

  const avg = data?.stats?.avgRating ?? 0
  const count = data?.stats?.count ?? 0
  const avgRounded = Math.round(avg)

  // Form-only rendering (e.g., inside verification flow)
  if (showForm && !showList && !showStats) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          {formCard}
        </div>
      </section>
    )
  }

  const items = data?.items ?? []
  const visibleItems = showAll ? items : items.slice(0, 3)

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
          {showStats && (
            count > 0 ? (
              <div className="flex items-center gap-2 mt-1">
                <div className="text-yellow-500">
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
                    <span key={n} aria-hidden>{n <= avgRounded ? "★" : "☆"}</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600">{avg.toFixed(1)} / 5 • {count} reviews</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mt-1">No review available</p>
            )
          )}
        </div>
        <div>
          {items.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="text-sm text-blue-600 hover:underline"
            >
              {showAll ? "Show less" : "Show all reviews"}
            </button>
          )}
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List */}
        {showList && (
          <div className="lg:col-span-2 space-y-4">
            {isLoading && <div className="text-gray-600">Loading reviews…</div>}
            {error && (
              <div className="text-red-600 text-sm">Failed to load reviews. Please try again.</div>
            )}
            {!isLoading && data?.items?.length === 0 && (
              <div className="text-gray-600 text-sm">No review available</div>
            )}

            {visibleItems.map((r: Review) => {
              const isExpanded = !!expanded[r._id]
              const MAX_CHARS = 220
              const overLimit = (r.comment?.length || 0) > MAX_CHARS
              const shownComment = isExpanded || !overLimit
                ? r.comment
                : `${r.comment.slice(0, MAX_CHARS)}…`
              return (
              <div
                key={r._id}
                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded((prev) => ({ ...prev, [r._id]: !prev[r._id] }))}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">
                    {typeof r.userId === 'string' ? 'User' : (r.userId.name || r.userId.email || 'User')}
                  </div>
                  <div className="text-yellow-500 font-semibold">{"★".repeat(r.rating)}<span className="text-gray-400">{"★".repeat(5 - r.rating)}</span></div>
                </div>
                {r.title && <div className="mt-1 text-gray-800 font-semibold">{r.title}</div>}
                <div className="mt-1 text-gray-700 text-sm whitespace-pre-wrap">{shownComment}</div>
                {!isExpanded && overLimit && (
                  <button
                    type="button"
                    className="mt-1 text-xs text-blue-600 hover:underline"
                    onClick={(e) => { e.stopPropagation(); setExpanded((prev) => ({ ...prev, [r._id]: true })) }}
                  >
                    Read more
                  </button>
                )}
                {isExpanded && overLimit && (
                  <button
                    type="button"
                    className="mt-1 text-xs text-blue-600 hover:underline"
                    onClick={(e) => { e.stopPropagation(); setExpanded((prev) => ({ ...prev, [r._id]: false })) }}
                  >
                    Read less
                  </button>
                )}
                <div className="mt-2 text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
            )})}
          </div>
        )}
        {/* Form */}
        {showForm && (
          <div className="lg:col-span-1">
            {formCard}
          </div>
        )}
      </div>
    </section>
  )
}
