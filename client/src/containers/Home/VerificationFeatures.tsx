// src/containers/Home/VerificationSection.tsx

"use client"

import { useRef, useState, useEffect } from "react"
import { Box, Typography, Button, Chip } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material"
import { VerificationCard } from "../../components/services/VerificationCard"
import { categories, verificationServices } from "../../utils/constants"

const VerificationSection = () => {
  const [activeCategory, setActiveCategory] = useState("All")
  const [filtered, setFiltered] = useState(verificationServices)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (activeCategory === "All") setFiltered(verificationServices)
    else setFiltered(verificationServices.filter(v => v.category === activeCategory))
  }, [activeCategory])

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.offsetWidth * 0.8
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  return (
    <Box sx={{ py: 8, px: 2, bgcolor: "#f9fbff" }}>
      <Typography variant="h4" align="center" fontWeight={700} mb={4}>
        Browse Our Top Services
      </Typography>

      <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mb={4}>
        {["All", ...categories].map(cat => {
          const label = typeof cat === "string" ? cat : cat.label;
          const value = typeof cat === "string" ? cat : cat.value;
          return (
            <Chip
              key={value}
              label={label}
              color={activeCategory === value ? "primary" : "default"}
              onClick={() => setActiveCategory(value)}
              variant={activeCategory === value ? "filled" : "outlined"}
            />
          );
        })}
      </Box>

      <Box position="relative">
        <Button
          onClick={() => scroll("left")}
          sx={{ position: "absolute", top: "50%", left: 0, zIndex: 10, transform: "translateY(-50%)" }}
        >
          <ArrowBackIos fontSize="small" />
        </Button>
        <Box
          ref={scrollRef}
          component={motion.div}
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            scrollBehavior: "smooth",
            px: 6,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <AnimatePresence initial={false}>
            {filtered.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
              >
                <VerificationCard
                  title={item.title}
                  image={item.image}
                  demand={item.demand}
                  demandLevel={
                    item.demandLevel === "high" || item.demandLevel === "medium" || item.demandLevel === "low"
                      ? item.demandLevel
                      : "medium"
                  }
                  verifications={item.verifications}
                  duration={item.duration}
                  price={item.price}
                  rating={item.rating}
                  reviews={item.reviews}
                  productId={item.id}
                  link={item.link}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
        <Button
          onClick={() => scroll("right")}
          sx={{ position: "absolute", top: "50%", right: 0, zIndex: 10, transform: "translateY(-50%)" }}
        >
          <ArrowForwardIos fontSize="small" />
        </Button>
      </Box>
    </Box>
  )
}

export default VerificationSection
