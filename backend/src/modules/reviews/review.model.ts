import mongoose, { Document, Schema } from 'mongoose'

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId
  productId: string // matches client product id like 'pan', 'aadhaar'
  rating: number // 1-5
  title?: string
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  verified?: boolean
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  productId: { type: String, required: true, index: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: { type: String, trim: true, maxlength: 120 },
  comment: { type: String, trim: true, maxlength: 2000, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved', index: true },
  verified: { type: Boolean, default: false, index: true },
}, { timestamps: true })

reviewSchema.index({ productId: 1, status: 1, verified: 1, createdAt: -1 })

export const Review = mongoose.model<IReview>('Review', reviewSchema)
