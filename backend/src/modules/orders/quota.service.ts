import mongoose from 'mongoose'
import { Order } from './order.model'
import { HTTPError } from '../../common/http/error'

/**
 * Find an eligible verification order for a user and verification type.
 * Prefers the order that expires sooner to minimize waste.
 */
export async function findEligibleVerificationOrder(
  userId: mongoose.Types.ObjectId | string,
  verificationType: string
) {
  const now = new Date()
  return Order.findOne({
    userId,
    orderType: 'verification',
    status: 'active',
    paymentStatus: 'completed',
    'serviceDetails.verificationType': verificationType,
    'verificationQuota.remaining': { $gt: 0 },
    $or: [
      { 'verificationQuota.expiresAt': { $gt: now } },
      { 'verificationQuota.expiresAt': { $exists: false } },
    ],
  })
    .sort({ 'verificationQuota.expiresAt': 1, endDate: 1, createdAt: 1 })
    .exec()
}

/**
 * Ensures that the user has quota. Returns the order to consume from, or null.
 */
export async function ensureVerificationQuota(
  userId: mongoose.Types.ObjectId | string,
  verificationType: string
) {
  return findEligibleVerificationOrder(userId, verificationType)
}

/**
 * Consume one verification from the provided order.
 */
export async function consumeVerificationQuota(order: any) {
  if (!order) throw new Error('Order not provided')
  try {
    await order.useVerification()
  } catch (err: any) {
    // Normalize quota errors to 403 instead of generic 500
    if (typeof err?.message === 'string' && err.message.includes('Verification quota exhausted')) {
      throw new HTTPError('Verification quota exhausted or expired', 403)
    }
    throw err
  }
}
