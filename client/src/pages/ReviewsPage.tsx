"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePublicReviews } from "../hooks/useReviews";
import type { Review } from "../types/review";
import { ReviewCard } from "../components/reviews/ReviewCard";
import { Modal } from "../components/common/Modal";
import { useSearchParams, useNavigate } from "react-router-dom";

// Helper to get query param
const useQuery = () => {
  const searchParams = useSearchParams()[0];
  return (name: string) => searchParams.get(name);
};

const ReviewsPage: React.FC = () => {
  const getQuery = useQuery();
  const productId = getQuery("productId");
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ name: string; text: string; stars: number } | null>(null);

  // Fetch all reviews
  const { data, isLoading, isError } = usePublicReviews({ page: 1, limit: 200 });

  // Filter reviews by productId if provided
  const items = (data?.items || []).filter((review: Review) =>
    productId ? review.productId === productId : true
  );

  // Map to display format
  const mapped = items.map((r: Review) => {
    const userName = typeof r.userId === "string"
      ? "Verified User"
      : r.userId?.name || "Verified User";
    const userEmail = typeof r.userId === "string" ? undefined : r.userId?.email;

    return {
      text: r.comment || r.title || "",
      name: userName,
      image: "",
      stars: r.rating || 5,
      verified: true,
      email: userEmail,
    };
  });

  // Optional: Fetch product name if needed
  const [productName, setProductName] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      // Optionally fetch product name via API
      // For now, fake it or pass via query
      const nameFromQuery = getQuery("productName");
      setProductName(nameFromQuery || "this product");
    }
  }, [productId, getQuery]);

  return (
    <section className="relative py-16 px-4 md:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Dynamic Header */}
        <div className="mb-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            {productId
              ? `Customer Reviews for ${productName || "this product"}`
              : "All Customer Reviews"}
          </motion.h1>
          <p className="text-gray-600 mt-2">
            {productId
              ? "Read what customers say about this verification service."
              : "See what our users love about VerifyMyKyc."}
          </p>

          {/* Back to product or home */}
          {productId && (
            <button
              onClick={() => navigate(-1)}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              ← Back to product
            </button>
          )}
        </div>

        {isLoading && (
          <div className="text-center text-gray-600 py-8">Loading reviews…</div>
        )}

        {isError && (
          <div className="text-center text-red-600 py-8">
            Failed to load reviews.
          </div>
        )}

        {!isLoading && !isError && (
          mapped.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mapped.map((review, idx) => (
                <ReviewCard
                  key={idx}
                  {...review}
                  showReadMore={(review.text || "").length > 220}
                  onReadMore={() => {
                    setModalContent({ name: review.name, text: review.text, stars: review.stars });
                    setModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-8">
              No reviews yet for this product.
            </div>
          )
        )}
      </div>

      {/* Full Review Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent ? `${modalContent.name}'s Review` : 'Review'}
      >
        {modalContent && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`inline-block w-3 h-3 rounded-full ${i < modalContent.stars ? 'bg-yellow-400' : 'bg-gray-200'}`}
                />
              ))}
              <span className="text-sm text-gray-600 font-medium">{modalContent.stars}.0</span>
            </div>
            <p className="text-gray-800 whitespace-pre-line leading-relaxed">{modalContent.text}</p>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default ReviewsPage;