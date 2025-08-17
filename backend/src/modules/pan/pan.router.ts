import { Router } from 'express';
import { 
  fetchFatherNameHandler, 
  checkPanAadhaarLinkHandler, 
  digilockerPullHandler, 
  digilockerInitHandler, 
  digilockerFetchDocumentHandler,
  fetchGstinByPanHandler,
  fetchDinByPanHandler,
  fetchCinByPanHandler,
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

export default router;
