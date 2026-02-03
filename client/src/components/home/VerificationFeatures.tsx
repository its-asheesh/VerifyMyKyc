"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { VerificationCard } from "../../components/services/VerificationCard"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchProducts } from "../../redux/slices/productSlice"
import { Section } from "../common/Section"
import { Container } from "../common/Container"
import { Heading } from "../common/Heading"

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
      <Section variant="gray" className="text-center py-20">
        <p className="text-lg font-medium text-gray-500">Loading services…</p>
      </Section>
    )
  }

  /* -------- render -------- */
  // Limit to 4 products for home page display
  const displayProducts = products.slice(0, 4)

  return (
    <Section variant="gray">
      <Container>
        <div className="text-center mb-12">
          <Heading level={2} className="mb-4">
            Browse Our Top Services
          </Heading>
        </div>

        {/* products grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center mx-auto"
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
        </motion.div>

        {/* View All Button */}
        {products.length > 4 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => navigate("/products")}
              className="group relative px-8 py-3 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:translate-y-[-2px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span className="relative flex items-center gap-2">
                View All Verifications
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </button>
          </div>
        )}
      </Container>
    </Section>
  )
}

export default VerificationSection