// backend/config/payment.ts
import dotenv from 'dotenv'
dotenv.config()

export const razorpayConfig = {
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
}