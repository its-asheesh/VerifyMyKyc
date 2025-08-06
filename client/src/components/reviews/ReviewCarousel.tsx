"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { ReviewCard } from "./ReviewCard"

interface Review {
  text: string
  name: string
  image: string
  stars: number
  position?: string
  company?: string
  verified?: boolean
}

interface ReviewCarouselProps {
  reviews: Review[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  disabled = false,
  ...props
}: {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "primary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  onClick?: () => void
  disabled?: boolean
  [key: string]: any
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const variantClasses = {
    default: "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm",
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm",
    ghost: "text-white hover:bg-white/20",
  }

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-12 w-12",
  }

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
  )
}

export const ReviewCarousel: React.FC<ReviewCarouselProps> = ({
  reviews,
  autoPlay = true,
  autoPlayInterval = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isHovering, setIsHovering] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollAmount = clientWidth * 0.8
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const goToReview = (index: number) => {
    setCurrentIndex(index)
  }

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isHovering) {
      intervalRef.current = setInterval(() => {
        if (scrollRef.current) {
          const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth
          if (scrollRef.current.scrollLeft >= maxScrollLeft) {
            scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
          } else {
            scroll("right")
          }
        }
        nextReview()
      }, autoPlayInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isHovering, autoPlayInterval])

  return (
    <div className="relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      {/* Desktop Carousel */}
      <div className="hidden md:block relative">
        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        {/* Auto-play Control */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleAutoPlay}
          className="absolute top-0 right-0 -translate-y-12 z-10 bg-transparent"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>

        {/* Reviews Container */}
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto py-4 px-8 scrollbar-hide">
          {reviews.map((review, index) => (
            <div key={index} className="min-w-[350px] max-w-[350px] flex-shrink-0">
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Single Card View */}
      <div className="md:hidden">
        <div className="relative">
          {/* Navigation Arrows for Mobile */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevReview}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextReview}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-transparent"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Auto-play Control for Mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAutoPlay}
            className="absolute top-0 right-0 -translate-y-12 z-10 bg-transparent"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </Button>

          {/* Single Review Card */}
          <div className="px-16">
            <AnimatePresence mode="wait">
              <ReviewCard key={currentIndex} {...reviews[currentIndex]} />
            </AnimatePresence>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToReview(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-8" : "bg-white/50 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
