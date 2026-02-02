"use client"

import { useEffect } from "react"
import { Box, Typography, Button } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { VerificationCard } from "../../components/services/VerificationCard"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchProducts } from "../../redux/slices/productSlice"

const VerificationSection = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { products = [], isLoading } = useAppSelector(
    (state) => state.products
  )

  /* -------- fetch once -------- */
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  /* -------- loading -------- */
  if (isLoading) {
    return (
      <Box sx={{ py: 8, px: 2, bgcolor: "#f9fbff", textAlign: "center" }}>
        <Typography variant="h6">Loading services…</Typography>
      </Box>
    )
  }

  /* -------- render -------- */
  // Limit to 4 products for home page display
  const displayProducts = products.slice(0, 4)

  return (
    <Box sx={{ py: 8, px: 2, bgcolor: "#f9fbff" }}>
      <Typography variant="h4" align="center" fontWeight={700} mb={4}>
        Browse Our Top Services
      </Typography>

      {/* products grid */}
      <Box
        component={motion.div}
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(auto-fit, minmax(160px, 1fr))",
            sm: "repeat(auto-fit, minmax(200px, 1fr))",
            md: "repeat(auto-fit, minmax(280px, 1fr))",
            lg: "repeat(4, 1fr)",
          },
          gap: { xs: 2, sm: 3, md: 4 },
          justifyContent: "center",
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
          maxWidth: "1400px",
          mx: "auto",
        }}
      >
        <AnimatePresence initial={false}>
          {displayProducts.map((item) => (
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

      {/* View All Button */}
      {products.length > 4 && (
        <Box display="flex" justifyContent="center" mt={6}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/products")}
            sx={{
              px: 6,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 700,
              borderRadius: "50px",
              textTransform: "none",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
              border: "none",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                transition: "left 0.5s",
              },
              "&:hover": {
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
                transform: "translateY(-3px) scale(1.05)",
                "&::before": {
                  left: "100%",
                },
              },
              "&:active": {
                transform: "translateY(-1px) scale(1.02)",
              },
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            <Box
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                position: "relative",
                zIndex: 1,
              }}
            >
              View All Verifications
              <Box
                component="span"
                sx={{
                  fontSize: "1.2rem",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateX(4px)",
                  },
                }}
              >
                →
              </Box>
            </Box>
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default VerificationSection