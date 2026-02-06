import { Response } from 'express';
import { AadhaarService } from './aadhaar.service';
import asyncHandler from '../../common/middleware/asyncHandler';
import {
  FetchEAadhaarRequest,
  AadhaarOcrV1Request,
  AadhaarGenerateOtpV2Request,
  AadhaarSubmitOtpV2Request,
} from '../../common/validation/schemas';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { BaseController } from '../../common/controllers/BaseController';
import { ensureVerificationQuota, consumeVerificationQuota } from '../orders/quota.service';

const service = new AadhaarService();

class AadhaarController extends BaseController {
  // POST /api/aadhaar/ocr-v1
  aadhaarOcrV1Handler = asyncHandler(async (req: AuthenticatedRequest<{}, {}, AadhaarOcrV1Request>, res: Response) => {
    const { base64_data, consent } = req.body;

    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'aadhaar',
        requireConsent: false,
        requiredFields: [],
      },
      async () => {
        return service.ocrV1(base64_data, consent);
      },
    );
  });

  // POST /api/aadhaar/ocr-v2
  aadhaarOcrV2Handler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleFileUploadRequest(
      req,
      res,
      {
        verificationType: 'aadhaar',
        requireConsent: true,
      },
      async (files) => {
        const { consent } = req.body;
        return service.ocrV2(
          files.file_front.buffer,
          files.file_front.originalname,
          consent,
          files.file_back?.buffer,
          files.file_back?.originalname,
        );
      },
    );
  });

  // POST /api/aadhaar/e-aadhaar
  fetchEAadhaarHandler = asyncHandler(async (req: AuthenticatedRequest<{}, {}, FetchEAadhaarRequest>, res: Response) => {
    const { transaction_id, json } = req.body;

    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'aadhaar',
        requiredFields: [],
      },
      async () => {
        return service.fetchEAadhaar({ transaction_id, json });
      },
    );
  });

  // POST /api/aadhaar/v2/generate-otp - QuickEKYC Aadhaar V2
  // NOTE: Does NOT consume quota - only checks quota exists
  generateOtpV2Handler = asyncHandler(async (req: AuthenticatedRequest<{}, {}, AadhaarGenerateOtpV2Request>, res: Response) => {
    try {
      const { id_number, consent } = req.body; // Types from Zod
      const userId = req.user?._id;

      // Validate user authentication (Already handled by middleware, but types allow optional user? generic auth request uses any)
      // Actually AuthenticatedRequest ensures user exists.

      // Validate required fields (Handled by Zod)

      // Check quota exists (but don't consume yet)
      const order = await ensureVerificationQuota(userId, 'aadhaar');
      if (!order) {
        res.status(403).json({ message: 'Verification quota exhausted or expired' });
        return;
      }

      // Log request
      this.logRequest('Aadhaar V2 Generate OTP', userId, {
        aadhaar_number: id_number.replace(/.(?=.{4})/g, 'X'),
      });

      // Generate OTP without consuming quota
      const result = await service.generateOtpV2({ id_number, consent: req.body.consent });
      res.json(result);
    } catch (error: any) {
      // Log error for debugging
      /*
      console.error('Aadhaar V2 Generate OTP Handler Error:', {
        message: error?.message,
        stack: error?.stack,
        status: error?.status,
        response: error?.response?.data
      });
      */

      // Re-throw to let asyncHandler handle it properly
      throw error;
    }
  });

  // POST /api/aadhaar/v2/submit-otp - QuickEKYC Aadhaar V2
  // NOTE: Consumes quota ONLY after successful OTP verification
  submitOtpV2Handler = asyncHandler(async (req: AuthenticatedRequest<{}, {}, AadhaarSubmitOtpV2Request>, res: Response) => {
    const { request_id, otp, client_id, consent } = req.body;
    const userId = req.user._id;

    // Validation handled by Zod

    // Check quota exists
    const order = await ensureVerificationQuota(userId, 'aadhaar');
    if (!order) {
      res.status(403).json({ message: 'Verification quota exhausted or expired' });
      return;
    }

    // Log request
    this.logRequest('Aadhaar V2 Submit OTP', userId, { request_id });

    try {
      // Submit OTP and verify
      const result = await service.submitOtpV2({ request_id, otp, client_id, consent });

      // Only consume quota if verification was successful
      if (result.status === 'success' && result.data?.aadhaar_number) {
        await consumeVerificationQuota(order);
        this.logQuotaConsumption(order, 'Aadhaar V2');
      }

      res.json(result);
    } catch (error) {
      // Don't consume quota if verification failed
      throw error; // Let asyncHandler handle it
    }
  });
}

// Create controller instance and export handlers
const controller = new AadhaarController();

export const aadhaarOcrV1Handler = controller.aadhaarOcrV1Handler.bind(controller);
export const aadhaarOcrV2Handler = controller.aadhaarOcrV2Handler.bind(controller);
export const fetchEAadhaarHandler = controller.fetchEAadhaarHandler.bind(controller);
export const generateOtpV2Handler = controller.generateOtpV2Handler.bind(controller);
export const submitOtpV2Handler = controller.submitOtpV2Handler.bind(controller);
