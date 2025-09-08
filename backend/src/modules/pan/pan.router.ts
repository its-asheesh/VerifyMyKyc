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

const router = Router();

// Fetch Father's Name by PAN
router.post('/father-name', authenticate, requireUser, fetchFatherNameHandler);

// GSTIN by PAN
router.post('/gstin-by-pan', authenticate, requireUser, fetchGstinByPanHandler);

// DIN by PAN (MCA)
router.post('/din-by-pan', authenticate, requireUser, fetchDinByPanHandler);

// CIN by PAN (MCA)
router.post('/cin-by-pan', authenticate, requireUser, fetchCinByPanHandler);

// Check PAN-Aadhaar Link
router.post('/aadhaar-link', authenticate, requireUser, checkPanAadhaarLinkHandler);

// Digilocker Init
router.post('/digilocker-init', authenticate, requireUser, digilockerInitHandler);

// Digilocker Pull PAN
router.post('/digilocker-pull', authenticate, requireUser, digilockerPullHandler);

// Digilocker Fetch Document
router.post('/digilocker-fetch-document', authenticate, requireUser, digilockerFetchDocumentHandler);

// Fetch PAN Advance
router.post('/fetch-pan-advance', authenticate, requireUser, fetchPanAdvanceHandler);

// Fetch PAN Detailed
router.post('/fetch-pan-detailed', authenticate, requireUser, fetchPanDetailedHandler);

export default router;
