import { Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { McaService } from './mca.service';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { ensureVerificationQuota, consumeVerificationQuota } from '../orders/quota.service';

const service = new McaService();

// POST /api/mca/fetch-din-by-pan
export const fetchDinByPanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  // Prefer consuming from 'company' quota; fallback to 'pan' to support PAN flows using MCA lookups
  let order = await ensureVerificationQuota(userId, 'company');
  if (!order) {
    order = await ensureVerificationQuota(userId, 'pan');
  }
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired for company or pan' });
  const result = await service.fetchDinByPan(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/mca/cin-by-pan
export const fetchCinByPanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  // Prefer 'company' quota; fallback to 'pan' for PAN product usage
  let order = await ensureVerificationQuota(userId, 'company');
  if (!order) {
    order = await ensureVerificationQuota(userId, 'pan');
  }
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired for company or pan' });
  const result = await service.fetchCinByPan(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/mca/fetch-company
export const fetchCompanyHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  // Prefer 'company' quota; fallback to 'pan' if PAN plan includes company fetch usage
  let order = await ensureVerificationQuota(userId, 'company');
  if (!order) {
    order = await ensureVerificationQuota(userId, 'pan');
  }
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired for company or pan' });
  const result = await service.fetchCompany(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});
