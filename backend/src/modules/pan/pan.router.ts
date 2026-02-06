import { Router } from 'express';
import {
  fetchFatherNameHandler,
  checkPanAadhaarLinkHandler,
  fetchPanAdvanceHandler,
  digilockerPullHandler,
  digilockerInitHandler,
  digilockerFetchDocumentHandler,
  fetchGstinByPanHandler,
  fetchDinByPanHandler,
  fetchCinByPanHandler,
  fetchPanDetailedHandler,
} from './pan.controller';
import { authenticate, requireUser } from '../../common/middleware/auth';
import { validate } from '../../common/validation/middleware';
import {
  panBasicSchema,
  panAadhaarLinkSchema,
  digilockerInitSchema,
  digilockerPullSchema,
  digilockerFetchDocumentSchema,
  cinByPanSchema
} from '../../common/validation/schemas';

const router = Router();

// Fetch Father's Name by PAN
router.post('/father-name', authenticate, requireUser, validate(panBasicSchema), fetchFatherNameHandler);

// GSTIN by PAN
router.post('/gstin-by-pan', authenticate, requireUser, validate(panBasicSchema), fetchGstinByPanHandler);

// DIN by PAN (MCA)
router.post('/din-by-pan', authenticate, requireUser, validate(panBasicSchema), fetchDinByPanHandler);

// CIN by PAN (MCA)
router.post('/cin-by-pan', authenticate, requireUser, validate(cinByPanSchema), fetchCinByPanHandler);

// Check PAN-Aadhaar Link
router.post('/aadhaar-link', authenticate, requireUser, validate(panAadhaarLinkSchema), checkPanAadhaarLinkHandler);

// Digilocker Init
router.post('/digilocker-init', authenticate, requireUser, validate(digilockerInitSchema), digilockerInitHandler);

// Digilocker Pull PAN
router.post('/digilocker-pull', authenticate, requireUser, validate(digilockerPullSchema), digilockerPullHandler);

// Digilocker Fetch Document
router.post(
  '/digilocker-fetch-document',
  authenticate,
  requireUser,
  validate(digilockerFetchDocumentSchema),
  digilockerFetchDocumentHandler,
);

// Fetch PAN Advance
router.post('/fetch-pan-advance', authenticate, requireUser, validate(panBasicSchema), fetchPanAdvanceHandler);

// Fetch PAN Detailed
router.post('/fetch-pan-detailed', authenticate, requireUser, validate(panBasicSchema), fetchPanDetailedHandler);

export default router;
