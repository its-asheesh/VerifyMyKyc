import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { PanService } from './pan.service';
import { DigilockerFetchDocumentRequest } from './providers/digilockerFetchDocument.provider';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { ensureVerificationQuota, consumeVerificationQuota } from '../orders/quota.service';

const service = new PanService();

// POST /api/pan/father-name
// Expects body: { pan_number: string, consent: string }
export const fetchFatherNameHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const { pan_number, consent } = req.body || {};

  // Basic payload validation to prevent avoidable 500s
  if (!pan_number || !consent) {
    return res.status(400).json({ message: 'pan_number and consent are required' });
  }

  console.log('PAN Father-Name Controller: incoming request', {
    userId,
    pan_number,
    hasConsent: Boolean(consent)
  });
  const order = await ensureVerificationQuota(userId, 'pan');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  console.log('PAN Father-Name Controller: using order for quota', {
    orderId: order.orderId,
    remaining: order?.verificationQuota?.remaining,
    expiresAt: order?.verificationQuota?.expiresAt,
  });

  const result = await service.fetchFatherName({ pan_number, consent });
  await consumeVerificationQuota(order);
  console.log('PAN Father-Name Controller: consumed 1 verification', {
    orderId: order.orderId,
    newRemaining: order?.verificationQuota?.remaining,
  });
  res.json(result);
});

// POST /api/pan/gstin-by-pan
// Expects body: { pan_number: string, consent: string }
export const fetchGstinByPanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const { pan_number, consent } = req.body || {};
  if (!pan_number || !consent) {
    return res.status(400).json({ message: 'pan_number and consent are required' });
  }
  console.log('PAN GSTIN-by-PAN Controller: incoming request', { userId, pan_number });
  const order = await ensureVerificationQuota(userId, 'pan');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.fetchGstinByPan({ pan_number, consent });
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/pan/din-by-pan
// Expects body: { pan_number: string, consent: string }
export const fetchDinByPanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const { pan_number, consent } = req.body || {};
  if (!pan_number || !consent) {
    return res.status(400).json({ message: 'pan_number and consent are required' });
  }
  console.log('PAN DIN-by-PAN Controller: incoming request', { userId, pan_number });
  // Prefer company quota (MCA), fallback to pan
  let order = await ensureVerificationQuota(userId, 'company');
  if (!order) order = await ensureVerificationQuota(userId, 'pan');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired for company or pan' });
  const result = await service.fetchDinByPan({ pan_number, consent });
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/pan/cin-by-pan
// Expects body: { pan: string }
export const fetchCinByPanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const pan = req.body?.pan || req.body?.pan_number;
  if (!pan) {
    return res.status(400).json({ message: 'pan is required' });
  }
  console.log('PAN CIN-by-PAN Controller: incoming request', { userId, pan });
  // Prefer company quota (MCA), fallback to pan
  let order = await ensureVerificationQuota(userId, 'company');
  if (!order) order = await ensureVerificationQuota(userId, 'pan');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired for company or pan' });
  const result = await service.fetchCinByPan({ pan });
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/pan/aadhaar-link
// Expects body: { pan_number: string, aadhaar_number: string, consent: string }
export const checkPanAadhaarLinkHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'pan');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.checkPanAadhaarLink(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/pan/digilocker-init
// Expects body: { redirect_uri: string, consent: string }
export const digilockerInitHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await service.digilockerInit(req.body);
  res.json(result);
});

// POST /api/pan/digilocker-pull
// Expects body: { parameters: { panno: string, PANFullName: string }, transactionId: string }
export const digilockerPullHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { transactionId, ...payload } = req.body;
  const result = await service.digilockerPull(payload, transactionId);
  res.json(result);
});

// POST /api/pan/digilocker-fetch-document
// Expects body: { document_uri: string, transaction_id: string }
export const digilockerFetchDocumentHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'pan');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.digilockerFetchDocument(req.body as DigilockerFetchDocumentRequest);
  await consumeVerificationQuota(order);
  res.json(result);
});
