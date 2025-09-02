// ccrv.controller.ts

import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { CCRVService } from './ccrv.service';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { ensureVerificationQuota, consumeVerificationQuota } from '../orders/quota.service';

const service = new CCRVService();

// POST /api/ccrv/generate-report
export const generateCCRVReportHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const {
    name,
    father_name,
    house_number,
    locality,
    city,
    village,
    state,
    district,
    pincode,
    date_of_birth,
    gender,
    mobile_number,
    email,
    consent,
    callback_url
  } = req.body || {};

  // Required fields validation
  if (!name || !consent) {
    return res.status(400).json({
      message: 'name and consent are required'
    });
  }

  console.log('CCRV Generate Report Controller: incoming request', {
    userId,
    name,
    hasConsent: Boolean(consent),
    callback_url: !!callback_url
  });

  // Check verification quota
  const order = await ensureVerificationQuota(userId, 'ccrv');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

  try {
    const result = await service.generateReport({
      name,
      father_name,
      house_number,
      locality,
      city,
      village,
      state,
      district,
      pincode,
      date_of_birth,
      gender,
      mobile_number,
      email,
      consent,
      callback_url
    });

    // Consume verification quota
    await consumeVerificationQuota(order);

    console.log('CCRV Generate Report Controller: consumed 1 verification', {
      orderId: order.orderId,
      newRemaining: order?.verificationQuota?.remaining,
    });

    res.json(result);
  } catch (error: any) {
    console.error('CCRV Generate Report Error:', error);
    res.status(500).json({
      message: 'Failed to generate CCRV report',
      error: error.message
    });
  }
});

// POST /api/ccrv/fetch-result
export const fetchCCRVResultHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const { transaction_id } = req.body || {};

  // Required fields validation
  if (!transaction_id) {
    return res.status(400).json({
      message: 'transaction_id is required'
    });
  }

  console.log('CCRV Fetch Result Controller: incoming request', {
    userId,
    transaction_id,
  });

  // Check verification quota
  const order = await ensureVerificationQuota(userId, 'ccrv');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

  try {
    const result = await service.fetchResult({
      transaction_id
    });

    // Consume verification quota
    await consumeVerificationQuota(order);

    console.log('CCRV Fetch Result Controller: consumed 1 verification', {
      orderId: order.orderId,
      newRemaining: order?.verificationQuota?.remaining,
    });

    res.json(result);
  } catch (error: any) {
    console.error('CCRV Fetch Result Error:', error);
    res.status(500).json({
      message: 'Failed to fetch CCRV result',
      error: error.message
    });
  }
});

// POST /api/ccrv/search
export const searchCCRVHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const {
    name,
    address,
    father_name,
    date_of_birth,
    case_category,
    type,
    name_match_type,
    father_match_type,
    jurisdiction_type,
    consent
  } = req.body || {};

  // Required fields validation
  if (!name || !address || !consent) {
    return res.status(400).json({
      message: 'name, address, and consent are required'
    });
  }

  console.log('CCRV Search Controller: incoming request', {
    userId,
    name,
    address,
    hasConsent: Boolean(consent)
  });

  // Check verification quota
  const order = await ensureVerificationQuota(userId, 'ccrv');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

  try {
    const result = await service.search({
      name,
      address,
      father_name,
      date_of_birth,
      case_category,
      type,
      name_match_type,
      father_match_type,
      jurisdiction_type,
      consent
    });

    // Consume verification quota
    await consumeVerificationQuota(order);

    console.log('CCRV Search Controller: consumed 1 verification', {
      orderId: order.orderId,
      newRemaining: order?.verificationQuota?.remaining,
    });

    res.json(result);
  } catch (error: any) {
    console.error('CCRV Search Error:', error);
    res.status(500).json({
      message: 'Failed to search CCRV records',
      error: error.message
    });
  }
});



/**
 * PUBLIC: Callback handler for OnGrid CCRV API
 * This is where OnGrid sends the result when the report is ready
 */
export const ccrvCallbackHandler = async (req: Request, res: Response) => {
  const transactionId = req.headers['x-transaction-id'] as string;
  const referenceId = req.headers['x-reference-id'] as string;
  const authType = req.headers['x-auth-type'] as string;

  const payload = req.body;

  console.log('✅ CCRV Callback Received', {
    transactionId,
    referenceId,
    authType,
    payload,
  });

  try {
    // Pass to service for processing (e.g., save to DB, notify user)
    await service.handleCallback({
      transactionId,
      referenceId,
      payload,
    });

    // ✅ Acknowledge receipt
    return res.status(200).json({ received: true, transactionId });
  } catch (error: any) {
    console.error('CCRV Callback Processing Error:', error);
    return res.status(500).json({ error: 'Failed to process callback' });
  }
};