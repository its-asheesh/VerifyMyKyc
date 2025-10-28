import { Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { DrivingLicenseService } from './drivinglicense.service';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { BaseController } from '../../common/controllers/BaseController';

const service = new DrivingLicenseService();

class DrivingLicenseController extends BaseController {
  // POST /api/drivinglicense/ocr
  drivingLicenseOcrHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleFileUploadRequest(req, res, {
      verificationType: 'drivinglicense',
      requireConsent: true
    }, async (files) => {
      const { consent } = req.body;
      return service.ocr(
        files.file_front.buffer,
        files.file_front.originalname,
        consent,
        files.file_back?.buffer,
        files.file_back?.originalname
      );
    });
  });

  // POST /api/drivinglicense/fetch-details
  fetchDrivingLicenseDetailsHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleVerificationRequest(req, res, {
      verificationType: 'drivinglicense'
    }, async () => {
      return service.fetchDetails(req.body);
    });
  });
}

// Create controller instance and export handlers
const controller = new DrivingLicenseController();

export const drivingLicenseOcrHandler = controller.drivingLicenseOcrHandler.bind(controller);
export const fetchDrivingLicenseDetailsHandler = controller.fetchDrivingLicenseDetailsHandler.bind(controller); 