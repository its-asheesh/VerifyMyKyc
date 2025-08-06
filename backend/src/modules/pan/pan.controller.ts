import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { PanService } from './pan.service';
import { DigilockerFetchDocumentRequest } from './providers/digilockerFetchDocument.provider';

const service = new PanService();

// POST /api/pan/father-name
// Expects body: { pan_number: string, consent: string }
export const fetchFatherNameHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.fetchFatherName(req.body);
  res.json(result);
});

// POST /api/pan/aadhaar-link
// Expects body: { pan_number: string, aadhaar_number: string, consent: string }
export const checkPanAadhaarLinkHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.checkPanAadhaarLink(req.body);
  res.json(result);
});

// POST /api/pan/digilocker-init
// Expects body: { redirect_uri: string, consent: string }
export const digilockerInitHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.digilockerInit(req.body);
  res.json(result);
});

// POST /api/pan/digilocker-pull
// Expects body: { parameters: { panno: string, PANFullName: string }, transactionId: string }
export const digilockerPullHandler = asyncHandler(async (req: Request, res: Response) => {
  const { transactionId, ...payload } = req.body;
  const result = await service.digilockerPull(payload, transactionId);
  res.json(result);
});

// POST /api/pan/digilocker-fetch-document
// Expects body: { document_uri: string, transaction_id: string }
export const digilockerFetchDocumentHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.digilockerFetchDocument(req.body as DigilockerFetchDocumentRequest);
  res.json(result);
});
