import { Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { DrivingLicenseService } from './drivinglicense.service';
import { DrivingLicenseRequest, OcrRequest } from '../../common/validation/schemas';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { BaseController } from '../../common/controllers/BaseController';

const service = new DrivingLicenseService();

class DrivingLicenseController extends BaseController {
  // POST /api/drivinglicense/ocr
  // POST /api/drivinglicense/ocr
  drivingLicenseOcrHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleFileUploadRequest(
      req,
      res,
      {
        verificationType: 'drivinglicense',
        requireConsent: false, // Handled by Zod (if we apply it) or manually checked inside? 
        // handleFileUploadRequest calls serviceMethod.
        // We can pass validation responsibility to middleware.
      },
      async (files) => {
        const { consent } = req.body as OcrRequest;
        return service.ocr(
          files.file_front.buffer,
          files.file_front.originalname,
          consent,
          files.file_back?.buffer,
          files.file_back?.originalname,
        );
      },
    );
  });

  // POST /api/drivinglicense/fetch-details
  // POST /api/drivinglicense/fetch-details
  fetchDrivingLicenseDetailsHandler = asyncHandler(
    async (req: AuthenticatedRequest<{}, {}, DrivingLicenseRequest>, res: Response) => {
      await this.handleVerificationRequest(
        req,
        res,
        {
          verificationType: 'drivinglicense',
          requiredFields: [], // Handled by Zod
        },
        async () => {
          return service.fetchDetails({
            driving_license_number: req.body.dl_number,
            date_of_birth: req.body.dob,
            consent: req.body.consent,
          });
        },
      );
    },
  );
}

// Create controller instance and export handlers
const controller = new DrivingLicenseController();

export const drivingLicenseOcrHandler = controller.drivingLicenseOcrHandler.bind(controller);
export const fetchDrivingLicenseDetailsHandler =
  controller.fetchDrivingLicenseDetailsHandler.bind(controller);
