import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    }
  },
  {
    timestamps: true
  }
);

// Add index for faster email lookups
subscriberSchema.index({ email: 1 }, { unique: true });

export const Subscriber = mongoose.model<ISubscriber>('Subscriber', subscriberSchema);
