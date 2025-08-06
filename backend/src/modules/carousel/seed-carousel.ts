import { CarouselSlide } from './carousel.model'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const carouselData = [
  {
    title: "Trusted Identity & Background Verification",
    subtitle: "for Your Home & Business",
    description: "Hiring domestic help or personal staff is convenient but ensuring their trustworthiness is crucial. VerifyMyKyc is a digital identity verification platform tailored for individuals and households.",
    imageUrl: "/carousel/slide1.jpg", // Local image path
    buttonText: "Start Verifying",
    buttonLink: "/custom-pricing",
    isActive: true,
    order: 1
  },
  {
    title: "Lightning Fast Document Verification",
    subtitle: "in Just 3 Seconds",
    description: "Experience the fastest KYC verification in India. Our advanced AI technology processes documents instantly while maintaining the highest security standards.",
    imageUrl: "/carousel/slide2.png", // Local image path
    buttonText: "Try Now",
    buttonLink: "/products",
    isActive: true,
    order: 2
  },
  {
    title: "Complete Compliance Solution",
    subtitle: "for Modern Businesses",
    description: "Stay compliant with regulatory requirements while providing seamless user experience. Our platform covers all major verification needs for businesses of any size.",
    imageUrl: "/carousel/slide3.webp", // Local image path
    buttonText: "Get Started",
    buttonLink: "/solutions",
    isActive: true,
    order: 3
  }
]

export const seedCarousel = async () => {
  try {
    // Clear existing carousel slides to update with new content
    await CarouselSlide.deleteMany({})
    console.log('🗑️ Cleared existing carousel slides')

    // Insert carousel data
    await CarouselSlide.insertMany(carouselData)
    
    console.log('🎠 Carousel slides seeded successfully!')
    console.log(`📊 Created ${carouselData.length} carousel slides`)
  } catch (error) {
    console.error('❌ Error seeding carousel slides:', error)
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/verifymykyc')
    .then(() => {
      console.log('🔗 Connected to MongoDB')
      return seedCarousel()
    })
    .then(() => {
      console.log('✅ Carousel seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
} 