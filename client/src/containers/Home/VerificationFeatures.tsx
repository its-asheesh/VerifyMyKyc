"use client"

import { useRef, useState, useEffect } from "react"
import { Box, Typography, Button, Chip } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material"
import { VerificationCard } from "../../components/services/VerificationCard"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchProducts, fetchCategories } from "../../redux/slices/productSlice"

const VerificationSection = () => {
  const dispatch = useAppDispatch()

  const { products = [], categories = [], isLoading } = useAppSelector(
    (state) => state.products
  )

  const [activeCategory, setActiveCategory] = useState("All")
  const [filtered, setFiltered] = useState(products)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  /* -------- fetch once -------- */
  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  /* -------- filter when products or category changes -------- */
  useEffect(() => {
    if (activeCategory === "All") {
      setFiltered(products)
    } else {
      setFiltered(products.filter((p) => p.category?.slug === activeCategory))
    }
  }, [activeCategory, products])

  /* -------- scroll helpers -------- */
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.offsetWidth * 0.8
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  /* -------- loading -------- */
  if (isLoading) {
    return (
      <Box sx={{ py: 8, px: 2, bgcolor: "#f9fbff", textAlign: "center" }}>
        <Typography variant="h6">Loading services…</Typography>
      </Box>
    )
  }

  /* -------- render -------- */
  return (
    <Box sx={{ py: 8, px: 2, bgcolor: "#f9fbff" }}>
      <Typography variant="h4" align="center" fontWeight={700} mb={4}>
        Browse Our Top Services
      </Typography>

      {/* category chips from Redux */}
      <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mb={4}>
        <Chip
          label="All"
          color={activeCategory === "All" ? "primary" : "default"}
          onClick={() => setActiveCategory("All")}
          variant={activeCategory === "All" ? "filled" : "outlined"}
        />
        {categories.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.name}
            color={activeCategory === cat.slug ? "primary" : "default"}
            onClick={() => setActiveCategory(cat.slug)}
            variant={activeCategory === cat.slug ? "filled" : "outlined"}
          />
        ))}
      </Box>

      {/* horizontal scroll with arrows */}
      <Box position="relative">
        <Button
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            zIndex: 10,
            transform: "translateY(-50%)",
            display: { xs: "none", md: "flex" },
          }}
        >
          <ArrowBackIos fontSize="small" />
        </Button>

        <Box
          ref={scrollRef}
          component={motion.div}
          sx={{
            display: "flex",
            gap: { xs: 1.5, md: 3 },
            overflowX: "auto",
            scrollBehavior: "smooth",
            px: { xs: 2, md: 6 },
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          <AnimatePresence initial={false}>
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                style={{ scrollSnapAlign: "start" }}
              >
                <VerificationCard
                  title={item.title}
                  image={item.image}
                  demand={item.demand}
  demandLevel={item.demandLevel}
                  rating={4.5}
                  reviews={100}
                  productId={item.id}
                  link={`/products/${item.id}`}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>

        <Button
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            zIndex: 10,
            transform: "translateY(-50%)",
            display: { xs: "none", md: "flex" },
          }}
        >
          <ArrowForwardIos fontSize="small" />
        </Button>
      </Box>
    </Box>
  )
}

export default VerificationSection