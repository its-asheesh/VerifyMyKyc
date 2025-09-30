import { Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { ensureVerificationQuota, consumeVerificationQuota } from '../orders/quota.service';
import { EpfoService } from './epfo.service';

const service = new EpfoService();

// POST /api/epfo/fetch-uan
export const fetchUanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'epfo');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.fetchUan(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/epfo/passbook/generate-otp
export const generateOtpHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'epfo');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.generateOtp(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/epfo/passbook/validate-otp
export const validateOtpHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'epfo');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.validateOtp(req.headers['x-transaction-id'] as string, req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});

// GET /api/epfo/passbook/employers
export const listEmployersHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'epfo');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.listEmployers(req.headers['x-transaction-id'] as string);
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/epfo/passbook/fetch
export const fetchPassbookHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'epfo');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.fetchPassbook(req.headers['x-transaction-id'] as string, req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/epfo/employment-history/fetch-by-uan
export const employmentByUanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'epfo');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.fetchEmploymentByUan(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/epfo/employment-history/fetch-latest
export const employmentLatestHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'epfo');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.fetchLatestEmployment(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/epfo/uan/fetch-by-pan
export const uanByPanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'epfo');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.fetchUanByPan(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/epfo/employer-verify
export const employerVerifyHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'epfo');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.verifyEmployer(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});


