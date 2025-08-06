"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, Shield, Award, ArrowRight, CheckCircle, Loader2 } from "lucide-react"
import { useCarouselSlides } from "../../hooks/useCarousel"
import { useNavigate } from "react-router-dom"

const HeroCarousel: React.FC = () => {
  const navigate = useNavigate()
  const { data: slides, isLoading, error } = useCarouselSlides()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !slides || slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPlaying, slides])

  const nextSlide = () => {
    if (!slides) return
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    if (!slides) return
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const handleButtonClick = (link: string) => {
    if (link.startsWith('http')) {
      window.open(link, '_blank')
    } else {
      navigate(link)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="relative min-h-[50vh] bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading carousel...</p>
        </div>
      </section>
    )
  }

  // Error state
  if (error || !slides || slides.length === 0) {
    return (
      <section className="relative min-h-[50vh] bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Carousel content not available</p>
        </div>
      </section>
    )
  }

  const currentSlideData = slides[currentSlide]

  return (
    <section className="relative min-h-[50vh] bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-30" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-orange-200/30 rounded-full blur-lg animate-bounce" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[50vh]"
          >
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
              >
                <Award className="w-4 h-4" />
                {currentSlideData.subtitle}
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="space-y-3"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
                    {currentSlideData.title}
                  </span>
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl font-medium text-blue-600">
                  {currentSlideData.subtitle}
                </p>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                {currentSlideData.description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleButtonClick(currentSlideData.buttonLink)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  {currentSlideData.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20 scale-110" />

                {/* Image Container */}
                <motion.div
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <div className="relative">
                    <img
                      src={currentSlideData.imageUrl}
                      alt={currentSlideData.title}
                      className="w-full max-w-[400px] h-auto object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400x250?text=Image+Not+Found"
                      }}
                    />
                    {/* Gradient mask for sides blending */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent pointer-events-none" 
                         style={{
                           background: 'linear-gradient(90deg, transparent 0%, transparent 85%, rgba(255,255,255,0.1) 100%)'
                         }} />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-transparent pointer-events-none" 
                         style={{
                           background: 'linear-gradient(270deg, transparent 0%, transparent 85%, rgba(255,255,255,0.1) 100%)'
                         }} />
                  </div>

                  {/* Floating Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-xl shadow-lg"
                  >
                    <div className="text-xs font-semibold">99.9% Accurate</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="absolute -bottom-3 -left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-xl shadow-lg"
                  >
                    <div className="text-xs font-semibold">3 Sec Verification</div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6">
          {/* Slide Indicators */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-blue-600 w-8" : "bg-gray-300 w-2 hover:bg-gray-400"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <motion.button
              onClick={prevSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-all duration-300 shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={nextSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-all duration-300 shadow-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Play/Pause */}
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-all duration-300 shadow-lg"
          >
            {isPlaying ? <motion.div className="w-2 h-2 bg-current" /> : <Play className="w-3 h-3" />}
          </motion.button>
        </div>
      </div>

      <style>{`
        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.05)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
      `}</style>
    </section>
  )
}

export default HeroCarousel
