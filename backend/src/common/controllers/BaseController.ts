import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import {
  ensureVerificationQuota,
  consumeVerificationQuota,
} from '../../modules/orders/quota.service';
import { logger } from '../utils/logger';

export interface FileUploadData {
  file_front: Express.Multer.File;
  file_back?: Express.Multer.File;
}

export interface VerificationRequestOptions {
  verificationType: string;
  fallbackTypes?: string[];
  requireConsent?: boolean;
  requiredFields?: string[];
}

/**
 * Base controller class that provides common patterns for verification modules
 * Maintains all existing functionality while reducing code duplication
 */
export abstract class BaseController {
  /**
   * Handles verification requests with quota management
   * Preserves exact same behavior as existing controllers
   */
  protected async handleVerificationRequest<T>(
    req: AuthenticatedRequest,
    res: Response,
    options: VerificationRequestOptions,
    serviceMethod: () => Promise<T>,
  ): Promise<void> {
    const userId = req.user._id;

    // Try primary verification type first, then fallbacks
    let order = await ensureVerificationQuota(userId, options.verificationType);

    if (!order && options.fallbackTypes) {
      for (const fallbackType of options.fallbackTypes) {
        order = await ensureVerificationQuota(userId, fallbackType);
        if (order) break;
      }
    }

    if (!order) {
      const fallbackMessage = options.fallbackTypes
        ? `Verification quota exhausted or expired for ${options.verificationType} or ${options.fallbackTypes.join(', ')}`
        : 'Verification quota exhausted or expired';
      res.status(403).json({ message: fallbackMessage });
      return;
    }

    // Validate required fields if specified
    if (options.requiredFields) {
      const missingFields = options.requiredFields.filter((field) => !req.body[field]);
      if (missingFields.length > 0) {
        res.status(400).json({
          message: `${missingFields.join(', ')} are required`,
        });
        return;
      }
    }

    // Validate consent if required
    if (options.requireConsent && !req.body.consent) {
      res.status(400).json({ message: 'consent is required' });
      return;
    }

    try {
      const result = await serviceMethod();
      await consumeVerificationQuota(order);
      res.json(result);
    } catch (error) {
      throw error; // Let asyncHandler handle it
    }
  }

  /**
   * Handles file upload verification requests
   * Maintains exact same file handling logic as existing controllers
   */
  protected async handleFileUploadRequest<T>(
    req: AuthenticatedRequest,
    res: Response,
    options: VerificationRequestOptions,
    serviceMethod: (files: FileUploadData) => Promise<T>,
  ): Promise<void> {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const file_front = files?.file_front?.[0];
    const file_back = files?.file_back?.[0];

    if (!file_front) {
      res.status(400).json({ message: 'file_front is required' });
      return;
    }

    return this.handleVerificationRequest(req, res, options, () =>
      serviceMethod({ file_front, file_back }),
    );
  }

  /**
   * Handles simple verification requests without file uploads
   * For backward compatibility with existing patterns
   */
  protected async handleSimpleVerificationRequest<T>(
    req: AuthenticatedRequest,
    res: Response,
    verificationType: string,
    serviceMethod: () => Promise<T>,
  ): Promise<void> {
    return this.handleVerificationRequest(req, res, { verificationType }, serviceMethod);
  }

  /**
   * Handles verification requests with fallback quota types
   * Used by modules like PAN that can consume from multiple quota types
   */
  protected async handleVerificationWithFallback<T>(
    req: AuthenticatedRequest,
    res: Response,
    primaryType: string,
    fallbackTypes: string[],
    serviceMethod: () => Promise<T>,
  ): Promise<void> {
    return this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: primaryType,
        fallbackTypes,
      },
      serviceMethod,
    );
  }

  /**
   * Validates request body fields
   * Maintains existing validation patterns
   */
  protected validateRequiredFields(req: any, fields: string[]): string | null {
    const missingFields = fields.filter((field) => !req.body[field]);
    return missingFields.length > 0 ? `${missingFields.join(', ')} are required` : null;
  }

  /**
   * Creates consistent response format
   * Maintains existing response structure
   */
  protected createSuccessResponse(data: any, message?: string) {
    return {
      success: true,
      ...(message && { message }),
      ...(data && { data }),
    };
  }

  /**
   * Logs request details for debugging
   * Maintains existing logging patterns
   */
  /**
   * Logs request details for debugging
   * Maintains existing logging patterns
   */
  protected logRequest(operationName: string, userId: string, additionalData?: any) {
    logger.info(`${operationName} Controller: incoming request`, {
      userId,
      ...additionalData,
    });
  }

  /**
   * Logs quota consumption details
   * Maintains existing quota logging patterns
   */
  protected logQuotaConsumption(order: any, operationName: string) {
    logger.info(`${operationName} Controller: consumed 1 verification`, {
      orderId: order.orderId,
      newRemaining: order?.verificationQuota?.remaining,
    });
  }
}
