"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "../../services/api/reviewApi";
import type { Review } from "../../types/review";
import { CheckCircle } from "lucide-react";

interface ProductReviewsProps {
  productId: string;
  showList?: boolean;
  showForm?: boolean;
  showStats?: boolean;
  limit?: number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  showList = true,
  showForm = true,
  showStats = true,
  limit = 20,
}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["product-reviews", productId, limit],
    queryFn: () => reviewApi.getProductReviews(productId, { page: 1, limit }),
    staleTime: 30_000,
  });

  const [form, setForm] = useState<{
    rating: number;
    title: string;
    comment: string;
  }>({
    rating: 5,
    title: "",
    comment: "",
  });

  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("token");
  const [submitted, setSubmitted] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    name: string;
    text: string;
    stars: number;
  } | null>(null);

  const createMutation = useMutation({
    mutationFn: async () => reviewApi.createReview({ productId, ...form }),
    onSuccess: () => {
      setSubmitted(true);
      setForm({ rating: 5, title: "", comment: "" });
      queryClient.invalidateQueries({
        queryKey: ["product-reviews", productId],
      });
    },
  });

  const formCard = (
    <div className="border rounded-lg p-4 bg-gray-50">
      {submitted ? (
        <div className="flex flex-col items-center text-center py-6">
          <CheckCircle className="w-12 h-12 text-green-600 mb-2" />
          <h4 className="font-semibold text-gray-900 mb-1">
            Thank you for your rating & review!
          </h4>
          <p className="text-sm text-gray-600">We appreciate your feedback.</p>
        </div>
      ) : (
        <>
          <h4 className="font-semibold text-gray-900 mb-3">Write a review</h4>
          {!hasToken ? (
            <p className="text-sm text-gray-600">
              Please{" "}
              <a href="/login" className="text-blue-600 underline">
                login
              </a>{" "}
              to submit a review.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!form.comment.trim()) return;
                createMutation.mutate();
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm text-gray-700">Rating</label>
                <div
                  className="mt-1 flex items-center gap-1"
                  role="radiogroup"
                  aria-label="Rating"
                >
                  {([1, 2, 3, 4, 5] as const).map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setForm({ ...form, rating: n })}
                      aria-checked={form.rating === n}
                      role="radio"
                      className={`text-2xl leading-none ${
                        n <= form.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                      title={`${n} star${n > 1 ? "s" : ""}`}
                    >
                      {n <= form.rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700">
                  Title (optional)
                </label>
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
                  onChange={(e) =>
                    setForm({ ...form, comment: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 disabled:opacity-60"
              >
                {createMutation.isPending ? "Submitting…" : "Submit Review"}
              </button>
              {createMutation.isError && (
                <div className="text-xs text-red-600">
                  Failed to submit review. You may have already reviewed.
                </div>
              )}
            </form>
          )}
        </>
      )}
    </div>
  );

  const avg = data?.stats?.avgRating ?? 0;
  const count = data?.stats?.count ?? 0;
  const avgRounded = Math.round(avg);

  // Form-only rendering
  if (showForm && !showList && !showStats) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">{formCard}</div>
      </section>
    );
  }

  const items = data?.items ?? [];
  const visibleItems = showAll ? items : items.slice(0, 3);

  // Open modal with full review
  const handleReadMore = (r: Review) => {
    setModalContent({
      name:
        typeof r.userId === "string"
          ? "User"
          : r.userId.name || r.userId.email || "User",
      text: r.comment,
      stars: r.rating,
    });
    setModalOpen(true);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Customer Reviews
          </h3>
          {showStats && count > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="text-yellow-500">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
                  <span key={n} aria-hidden>
                    {n <= avgRounded ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {avg.toFixed(1)} / 5 • {count} reviews
              </p>
            </div>
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
        {showList && (
  <div className="lg:col-span-3">
    {/* Horizontally Scrollable Container on All Devices */}
    <div className="space-y-4">
      {isLoading && <div className="text-gray-600">Loading reviews…</div>}
      {error && (
        <div className="text-red-600 text-sm">
          Failed to load reviews. Please try again.
        </div>
      )}
      {!isLoading && items.length === 0 && (
        <div className="text-gray-600 text-sm">No reviews available</div>
      )}

      {/* Always Horizontal Scroll */}
      <div
        className="flex gap-4 overflow-x-auto py-3 px-1 snap-x snap-mandatory scroll-smooth scrollbar-hide"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        {/* Optional: padding to prevent clipping at edges */}
        <div className="w-4 flex-shrink-0" aria-hidden="true" />

        {visibleItems.map((r: Review) => {
          const isExpanded = !!expanded[r._id];
          // Responsive truncation length
          const MAX_CHARS = window.innerWidth >= 768 ? 220 : 140;
          const overLimit = r.comment.length > MAX_CHARS;
          const shownComment = isExpanded || !overLimit
            ? r.comment
            : `${r.comment.slice(0, MAX_CHARS)}…`;

          return (
            <div
              key={r._id}
              className="
                flex-shrink-0 snap-center
                w-[80%] sm:w-[60%] md:w-[45%] lg:w-[30%] xl:w-[28%]
                min-w-[280px] max-w-[380px]
                border rounded-lg p-3 cursor-pointer hover:bg-gray-50
                flex flex-col justify-between h-[180px] sm:h-[200px]
              "
              onClick={() =>
                setExpanded((prev) => ({ ...prev, [r._id]: !prev[r._id] }))
              }
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-gray-900 text-xs truncate">
                    {typeof r.userId === "string"
                      ? "User"
                      : r.userId.name || r.userId.email || "User"}
                  </div>
                  <div className="text-yellow-500 text-xs">
                    {"★".repeat(r.rating)}
                    <span className="text-gray-400">{"★".repeat(5 - r.rating)}</span>
                  </div>
                </div>
                {r.title && (
                  <div className="text-gray-800 text-xs font-medium mb-1 truncate">
                    {r.title}
                  </div>
                )}
                <div
                  className={`
                    text-gray-700 text-xs leading-tight whitespace-pre-wrap
                    ${isExpanded ? "" : "line-clamp-3"}
                  `}
                >
                  {shownComment}
                </div>
                {!isExpanded && overLimit && (
                  <button
                    type="button"
                    className="mt-1 text-xs text-blue-600 hover:underline font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReadMore(r); // Open modal
                    }}
                  >
                    Read more
                  </button>
                )}
                {isExpanded && overLimit && (
                  <button
                    type="button"
                    className="mt-1 text-xs text-blue-600 hover:underline font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded((prev) => ({ ...prev, [r._id]: false }));
                    }}
                  >
                    Read less
                  </button>
                )}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {new Date(r.createdAt).toLocaleDateString()}
              </div>
            </div>
          );
        })}

        {/* End padding */}
        <div className="w-4 flex-shrink-0" aria-hidden="true" />
      </div>

      {/* Dots Indicator (Mobile Only) */}
      {visibleItems.length > 1 && (
        <div className="flex md:hidden justify-center gap-2 mt-3">
          {visibleItems.map((_, index) => (
            <div
              key={index}
              aria-label={`Review ${index + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === 0 ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  </div>
)}

        {/* Form */}
        {showForm && <div className="lg:col-span-1">{formCard}</div>}
      </div>

      {/* Full Review Modal */}
      {modalContent && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
            modalOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setModalOpen(false)}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setModalOpen(false)}
          ></div>

          {/* Modal */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {modalContent.name}'s Review
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < modalContent.stars
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-1 text-sm text-gray-600 font-medium">
                  {modalContent.stars}.0
                </span>
              </div>
              {/* Full Review */}
              <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                {modalContent.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
