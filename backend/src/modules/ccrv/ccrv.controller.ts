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
    address,
    father_name,
    additional_address,
    date_of_birth,
    consent
  } = req.body || {};

  // Required fields validation
  if (!name || !address || !consent) {
    return res.status(400).json({
      message: 'name, address, and consent are required'
    });
  }

  console.log('CCRV Generate Report Controller: incoming request', {
    userId,
    name,
    address,
    hasConsent: Boolean(consent)
  });

  // Check verification quota
  const order = await ensureVerificationQuota(userId, 'ccrv');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

  try {
    const result = await service.generateReport({
      name,
      address,
      father_name,
      additional_address,
      date_of_birth,
      consent: consent === true ? 'Y' : consent === false ? 'N' : consent // Ensure consent is 'Y' or 'N'
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

  try {
    const result = await service.fetchResult({
      transaction_id
    });

    // Don't consume quota for polling - quota was already consumed during the initial search
    console.log('CCRV Fetch Result Controller: fetched result without consuming quota (polling)');
    console.log('CCRV Fetch Result Data:', JSON.stringify(result, null, 2));

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

  // Validate consent format
  if (consent !== 'Y' && consent !== 'N') {
    return res.status(400).json({
      message: 'consent must be either "Y" or "N"'
    });
  }

  console.log('CCRV Search Controller: incoming request', {
    userId,
    name,
    address,
    consent,
    consentType: typeof consent,
    hasConsent: Boolean(consent),
    fullBody: req.body
  });

  // Check verification quota
  const order = await ensureVerificationQuota(userId, 'ccrv');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

  try {
    const searchPayload = {
      name,
      address,
      father_name,
      date_of_birth,
      case_category,
      type,
      name_match_type,
      father_match_type,
      jurisdiction_type,
      consent: consent === true ? 'Y' : consent === false ? 'N' : consent // Ensure consent is 'Y' or 'N'
    };
    
    console.log('CCRV Search Payload being sent to API:', searchPayload);
    
    const result = await service.search(searchPayload);

    // Consume verification quota
    await consumeVerificationQuota(order);

    console.log('CCRV Search Controller: consumed 1 verification', {
      orderId: order.orderId,
      newRemaining: order?.verificationQuota?.remaining,
    });
    console.log('CCRV Search Result Data:', JSON.stringify(result, null, 2));

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