import { Response } from 'express';
import { AadhaarService } from './aadhaar.service';
import asyncHandler from '../../common/middleware/asyncHandler';
import { FetchEAadhaarRequest } from '../../common/types/eaadhaar';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { BaseController } from '../../common/controllers/BaseController';

const service = new AadhaarService();

class AadhaarController extends BaseController {
  // POST /api/aadhaar/ocr-v1
  aadhaarOcrV1Handler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { base64_data, consent } = req.body;

    await this.handleVerificationRequest(req, res, {
      verificationType: 'aadhaar',
      requireConsent: true,
      requiredFields: ['base64_data']
    }, async () => {
      return service.ocrV1(base64_data, consent);
    });
  });

  // POST /api/aadhaar/ocr-v2
  aadhaarOcrV2Handler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleFileUploadRequest(req, res, {
      verificationType: 'aadhaar',
      requireConsent: true
    }, async (files) => {
      const { consent } = req.body;
      return service.ocrV2(
        files.file_front.buffer,
        files.file_front.originalname,
        consent,
        files.file_back?.buffer,
        files.file_back?.originalname
      );
    });
  });

  // POST /api/aadhaar/e-aadhaar
  fetchEAadhaarHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { transaction_id, json } = req.body;

    await this.handleVerificationRequest(req, res, {
      verificationType: 'aadhaar',
      requiredFields: ['transaction_id']
    }, async () => {
      return service.fetchEAadhaar({ transaction_id, json });
    });
  });
}

// Create controller instance and export handlers
const controller = new AadhaarController();

export const aadhaarOcrV1Handler = controller.aadhaarOcrV1Handler.bind(controller);
export const aadhaarOcrV2Handler = controller.aadhaarOcrV2Handler.bind(controller);
export const fetchEAadhaarHandler = controller.fetchEAadhaarHandler.bind(controller);