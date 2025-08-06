import mongoose, { Document, Schema } from 'mongoose'

export interface ICarouselSlide extends Document {
  title: string
  subtitle: string
  description: string
  imageUrl: string
  buttonText: string
  buttonLink: string
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const CarouselSlideSchema = new Schema<ICarouselSlide>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    buttonText: {
      type: String,
      required: true,
      trim: true
    },
    buttonLink: {
      type: String,
      required: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

export const CarouselSlide = mongoose.model<ICarouselSlide>('CarouselSlide', CarouselSlideSchema) 