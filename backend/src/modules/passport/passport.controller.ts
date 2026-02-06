import { Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { PassportService } from './passport.service';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { BaseController } from '../../common/controllers/BaseController';

const service = new PassportService();

class PassportController extends BaseController {
  // POST /api/passport/mrz/generate
  generateMrzHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const {
      country_code,
      passport_number,
      surname,
      given_name,
      gender,
      date_of_birth,
      date_of_expiry,
      consent,
    } = req.body || {};

    this.logRequest('Generate MRZ', req.user._id.toString(), {
      country_code,
      passport_number,
      surname,
    });

    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'passport',
        requireConsent: true,
        requiredFields: [
          'country_code',
          'passport_number',
          'surname',
          'given_name',
          'gender',
          'date_of_birth',
          'date_of_expiry',
        ],
      },
      async () => {
        return service.generateMrz({
          country_code,
          passport_number,
          surname,
          given_name,
          gender,
          date_of_birth,
          date_of_expiry,
          consent,
        });
      },
    );
  });

  // POST /api/passport/mrz/verify
  verifyMrzHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const {
      country_code,
      passport_number,
      surname,
      given_name,
      gender,
      date_of_birth,
      date_of_expiry,
      mrz_first_line,
      mrz_second_line,
      consent,
    } = req.body || {};

    this.logRequest('Verify MRZ', req.user._id.toString(), {
      country_code,
      passport_number,
      surname,
    });

    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'passport',
        requireConsent: true,
        requiredFields: [
          'country_code',
          'passport_number',
          'surname',
          'given_name',
          'gender',
          'date_of_birth',
          'date_of_expiry',
          'mrz_first_line',
          'mrz_second_line',
        ],
      },
      async () => {
        return service.verifyMrz({
          country_code,
          passport_number,
          surname,
          given_name,
          gender,
          date_of_birth,
          date_of_expiry,
          mrz_first_line,
          mrz_second_line,
          consent,
        });
      },
    );
  });

  // POST /api/passport/verify
  verifyPassportHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { file_number, passport_number, surname, given_name, date_of_birth, consent } =
      req.body || {};

    this.logRequest('Verify Passport', req.user._id.toString(), {
      file_number,
      passport_number,
      surname,
    });

    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'passport',
        requireConsent: true,
        requiredFields: [
          'file_number',
          'passport_number',
          'surname',
          'given_name',
          'date_of_birth',
        ],
      },
      async () => {
        return service.verifyPassport({
          file_number,
          passport_number,
          surname,
          given_name,
          date_of_birth,
          consent,
        });
      },
    );
  });

  // POST /api/passport/fetch
  fetchPassportDetailsHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { file_number, date_of_birth, consent } = req.body || {};

    this.logRequest('Fetch Passport Details', req.user._id.toString(), {
      file_number,
      date_of_birth,
    });

    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'passport',
        requireConsent: true,
        requiredFields: ['file_number', 'date_of_birth'],
      },
      async () => {
        return service.fetchPassportDetails({
          file_number,
          date_of_birth,
          consent,
        });
      },
    );
  });

  // POST /api/passport/ocr - Special handler with blob conversion
  extractPassportOcrDataHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { consent } = req.body;

    // Handle multer files properly
    const files = req.files as any;

    let file_front: any = undefined;
    let file_back: any = undefined;

    // Handle both array and object formats of files
    if (Array.isArray(files)) {
      file_front = files[0];
    } else if (files && typeof files === 'object') {
      file_front = files['file_front']?.[0];
      file_back = files['file_back']?.[0];
    }

    if (!file_front || !consent) {
      return res.status(400).json({
        message: 'file_front and consent are required',
      });
    }

    this.logRequest('Extract Passport OCR Data', req.user._id.toString(), {
      hasFileFront: !!file_front,
      hasFileBack: !!file_back,
      hasConsent: Boolean(consent),
    });

    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'passport',
      },
      async () => {
        // Simplified buffer to blob conversion
        const convertToBlob = (file: any): Blob => {
          if (file.buffer instanceof Buffer) {
            return new Blob([file.buffer], { type: file.mimetype });
          } else if (file.buffer instanceof ArrayBuffer) {
            return new Blob([file.buffer], { type: file.mimetype });
          } else {
            return new Blob([Buffer.from(file.buffer)], { type: file.mimetype });
          }
        };

        return service.extractPassportOcrData({
          file_front: convertToBlob(file_front),
          file_back: file_back ? convertToBlob(file_back) : undefined,
          consent,
        });
      },
    );
  });
}

// Create controller instance and export handlers
const controller = new PassportController();

export const generateMrzHandler = controller.generateMrzHandler.bind(controller);
export const verifyMrzHandler = controller.verifyMrzHandler.bind(controller);
export const verifyPassportHandler = controller.verifyPassportHandler.bind(controller);
export const fetchPassportDetailsHandler = controller.fetchPassportDetailsHandler.bind(controller);
export const extractPassportOcrDataHandler =
  controller.extractPassportOcrDataHandler.bind(controller);
