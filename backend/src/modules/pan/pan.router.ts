import { Router } from 'express';
import { fetchFatherNameHandler, checkPanAadhaarLinkHandler, digilockerPullHandler, digilockerInitHandler, digilockerFetchDocumentHandler } from './pan.controller';

const router = Router();

// Fetch Father's Name by PAN
router.post('/father-name', fetchFatherNameHandler);

// Check PAN-Aadhaar Link
router.post('/aadhaar-link', checkPanAadhaarLinkHandler);

// Digilocker Init
router.post('/digilocker-init', digilockerInitHandler);

// Digilocker Pull PAN
router.post('/digilocker-pull', digilockerPullHandler);

// Digilocker Fetch Document
router.post('/digilocker-fetch-document', digilockerFetchDocumentHandler);

export default router;
