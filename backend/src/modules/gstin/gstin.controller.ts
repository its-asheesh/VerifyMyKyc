import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { GstinService } from './gstin.service';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { ensureVerificationQuota, consumeVerificationQuota } from '../orders/quota.service';

const service = new GstinService();

// POST /api/gstin/fetch-by-pan
export const fetchGstinByPanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  // Prefer GSTIN quota, but allow PAN quota fallback so the same feature works from either module
  let order = await ensureVerificationQuota(userId, 'gstin');
  if (!order) {
    order = await ensureVerificationQuota(userId, 'pan');
  }
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired for gstin or pan' });
  const result = await service.fetchByPan(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/gstin/fetch-lite
// Expects body: { gstin: string, consent: string }
export const fetchGstinLiteHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'gstin');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.fetchLite(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/gstin/fetch-contact
// Expects body: { gstin: string, consent: string }
export const fetchGstinContactHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'gstin');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.fetchContact(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});
