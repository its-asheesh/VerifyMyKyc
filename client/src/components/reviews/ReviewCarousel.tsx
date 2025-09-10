"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { ReviewCard } from "./ReviewCard";
import { Modal } from "../common/Modal";
import { Link } from "react-router-dom";

interface Review {
  text: string;
  name: string;
  image: string;
  stars: number;
  position?: string;
  company?: string;
  verified?: boolean;
  email?: string;
  isMoreCard?: boolean;
}

interface ReviewCarouselProps {
  reviews: Review[];
  autoPlay?: boolean;
  autoPlayInterval?: number; // in ms, default 4000
}

// Reusable Button Component
const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  disabled = false,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "primary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
  disabled?: boolean;
  [key: string]: any;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantClasses = {
    default: "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm",
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm",
    ghost: "text-white hover:bg-white/20",
  };

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-12 w-12",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const ReviewCarousel: React.FC<ReviewCarouselProps> = ({
  reviews,
  autoPlay = true,
  autoPlayInterval = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovering, setIsHovering] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    name: string;
    text: string;
    stars: number;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Limit to 8 reviews + "Show all" card
  const maxCards = 8;
const displayReviews: Review[] = reviews.length > 0
  ? [
      ...reviews.slice(0, maxCards),
      {
        text: "",
        name: "Show all reviews",
        image: "",
        stars: 5,
        verified: true,
        isMoreCard: true,
      },
    ]
  : reviews; // or [] if you want empty

  // Memoized navigation
  const goToReview = useCallback(
    (index: number) => {
      // Resume auto-play when user interacts
      setIsPlaying(true);

      setCurrentIndex(index);
      if (scrollRef.current) {
        const container = scrollRef.current;
        const card = container.children[index + 1] as HTMLElement; // +1 due to padding div
        if (!card) return;

        const offset =
          card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
        container.scrollTo({
          left: offset,
          behavior: "smooth",
        });
      }
    },
    []
  );

  const next = useCallback(() => {
    goToReview((currentIndex + 1) % displayReviews.length);
  }, [currentIndex, displayReviews.length, goToReview]);

  const prev = useCallback(() => {
    goToReview((currentIndex - 1 + displayReviews.length) % displayReviews.length);
  }, [currentIndex, displayReviews.length, goToReview]);

  const toggleAutoPlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Sync scroll with index
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    // Pause auto-play on manual scroll
    //setIsPlaying(false);

    scrollTimeoutRef.current = setTimeout(() => {
      if (!scrollRef.current || displayReviews.length === 0) return;
      const container = scrollRef.current;
      const cardWidth = container.clientWidth * 0.85;
      const index = Math.round(container.scrollLeft / cardWidth);
      setCurrentIndex(Math.min(index, displayReviews.length - 1));
    }, 100);
  }, [displayReviews.length]);

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && !isHovering && displayReviews.length > 1) {
      intervalRef.current = setInterval(next, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [isPlaying, isHovering, next, autoPlayInterval, displayReviews.length]);

  // Hide scrollbar
  const hideScrollbarStyle = (
    <style >{`
      .scroll-container::-webkit-scrollbar {
        display: none;
      }
      .scroll-container {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Scrollable Reviews Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scroll-container flex gap-3 overflow-x-auto py-4 px-1 snap-x snap-mandatory scroll-smooth"
      >
        {hideScrollbarStyle}

        {/* Small edge padding */}
        <div className="w-2 md:w-4 flex-shrink-0" aria-hidden="true" />

        {displayReviews.map((review, index) => (
          <div
            key={index}
            className="flex-shrink-0 snap-center min-w-[85%] md:min-w-[300px] max-w-[85%] md:max-w-[300px] px-1"
          >
            {review.isMoreCard ? (
              <Link to="/reviews" className="block h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/95 backdrop-blur-sm border border-white/20 p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-[260px] flex flex-col items-center justify-center text-center"
                >
                  <div className="text-4xl mb-2">✨</div>
                  <h3 className="text-base font-bold text-gray-900">
                    Show all reviews
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    Read more experiences
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-blue-600 font-semibold text-sm">
                    Browse all
                  </span>
                </motion.div>
              </Link>
            ) : (
              <ReviewCard
                {...review}
                showReadMore={(review.text?.length || 0) > (window.innerWidth < 768 ? 220 : 180)}
                onReadMore={() => {
                  setModalContent({
                    name: review.name,
                    text: review.text,
                    stars: review.stars,
                  });
                  setModalOpen(true);
                }}
              />
            )}
          </div>
        ))}

        {/* End padding */}
        <div className="w-2 md:w-4 flex-shrink-0" aria-hidden="true" />
      </div>

      {/* Desktop: Left & Right Navigation Arrows */}
      <div className="hidden md:flex absolute inset-y-0 left-0 right-0 pointer-events-none">
        <Button
          variant="outline"
          size="icon"
          onClick={prev}
          className="pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 shadow-xl hover:shadow-2xl"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={next}
          className="pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 shadow-xl hover:shadow-2xl"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Auto-play Toggle Button (Top Right) */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleAutoPlay}
        className="absolute top-0 right-0 -translate-y-8 md:-translate-y-10 z-10 bg-transparent"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>

      {/* Dots Indicator (Visible on All Devices) */}
      <div className="flex justify-center gap-2 mt-3">
        {displayReviews.map((_, index) => (
          <button
            key={index}
            onClick={() => goToReview(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-blue-600 w-6" : "bg-blue-300 w-1.5"
            }`}
            aria-label={`Go to review ${index + 1}`}
          />
        ))}
      </div>

      {/* Full Review Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent ? `${modalContent.name}'s Review` : "Review"}
      >
        {modalContent && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`inline-block w-3 h-3 rounded-full ${
                    i < modalContent.stars ? "bg-yellow-400" : "bg-gray-200"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 font-medium">
                {modalContent.stars}.0
              </span>
            </div>
            <p className="text-gray-800 whitespace-pre-line leading-relaxed">
              {modalContent.text}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};