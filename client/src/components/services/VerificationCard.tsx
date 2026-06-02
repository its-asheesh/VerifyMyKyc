"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { reviewApi } from "../../services/api/reviewApi";
import { Badge } from "../common/Badge";

type VerificationCardProps = {
  title: string;
  image: string;
  demand: string;
  demandLevel: "high" | "medium" | "low";
  rating: number;
  reviews: number;
  productId?: string;
  remaining?: number;
  expiresAt?: string;
  link?: string;
};

const variantMap = {
  high: "solid-error",
  medium: "solid-warning",
  low: "default",
} as const;

export const VerificationCard: FC<VerificationCardProps> = ({
  title,
  image,
  demand,
  demandLevel,
  rating,
  reviews,
  productId,
  link,
  remaining,
  expiresAt,
}) => {
  const formattedExpiry = expiresAt
    ? new Date(expiresAt).toLocaleDateString()
    : null;

  const { data } = useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () =>
      reviewApi.getProductReviews(productId as string, { page: 1, limit: 1 }),
    enabled: !!productId,
    staleTime: 30_000,
  });

  const apiAvg = data?.stats?.avgRating;
  const apiCount = data?.stats?.count;
  const useApi = !!productId;
  const avgDisplay = useApi
    ? typeof apiCount === "number" && apiCount > 0
      ? (apiAvg ?? 0).toFixed(1)
      : "0.0"
    : typeof rating === "number"
      ? rating.toFixed(1)
      : String(rating);
  const countDisplay = useApi
    ? typeof apiCount === "number" && apiCount > 0
      ? apiCount
      : 0
    : reviews;

  const handleGetStarted = () => {
    if (link) {
      window.location.href = link;
    } else if (productId) {

      // Add navigation logic here
    }
  };

  // Common card content component
  const CardContent = ({ isMobile }: { isMobile: boolean }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full w-full">
      {/* Image section */}
      <div className="w-full bg-slate-50 flex-shrink-0">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-20 sm:h-24 md:h-32 lg:h-36 object-cover rounded-t-xl"
          loading="lazy"
        />
      </div>

      <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3 flex-1 flex flex-col">
        <Badge
          variant={variantMap[demandLevel]}
          className="flex-shrink-0"
          size="sm"
        >
          {demand}
        </Badge>

        {(typeof remaining === "number" || formattedExpiry) && (
          <div className="flex flex-wrap gap-1 sm:gap-2 flex-shrink-0">
            {typeof remaining === "number" && (
              <Badge
                variant={remaining === 0 ? "error" : "success"}
                size="sm"
              >
                Remaining: {remaining}
              </Badge>
            )}
            {formattedExpiry && (
              <Badge variant="default" size="sm">
                Expires: {formattedExpiry}
              </Badge>
            )}
          </div>
        )}

        <h3 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg leading-tight line-clamp-2 flex-shrink-0 text-left">
          {title}
        </h3>

        <div className="flex-1"></div>

        <div className="flex items-center justify-between mt-auto flex-shrink-0">
          {/* <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
            <span>
              {avgDisplay} ({countDisplay})
            </span>
          </div> */}

          {isMobile ? (
            <div className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium ">
              Get Started
            </div>
          ) : (
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="w-full h-full"
    >
      {/* Mobile: Card is fully clickable */}
      <button
        type="button"
        onClick={handleGetStarted}
        className="block sm:hidden w-full h-full p-0 m-0 border-none bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xl"
      >
        <CardContent isMobile={true} />
      </button>

      {/* Desktop: Standard card */}
      <div className="hidden sm:block h-full">
        <CardContent isMobile={false} />
      </div>
    </motion.div>
  );
};
