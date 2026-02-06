import { Router } from 'express';
import {
  fetchRcLiteHandler,
  fetchRcDetailedHandler,
  fetchRcDetailedWithChallanHandler,
  fetchEChallanHandler,
  fetchRegNumByChassisHandler,
  fetchFastagDetailsHandler,
} from './vehicle.controller';
import { authenticate, requireUser } from '../../common/middleware/auth';

const router = Router();

/**
 * RC Verification APIs
 */

// Fetch basic RC details
router.post('/rc/fetch-lite', authenticate, requireUser, fetchRcLiteHandler);

// Fetch detailed RC information
router.post('/rc/fetch-detailed', authenticate, requireUser, fetchRcDetailedHandler);

// Fetch RC details with linked challans
router.post(
  '/rc/fetch-detailed-challan',
  authenticate,
  requireUser,
  fetchRcDetailedWithChallanHandler,
);

// Fetch e-challan details by RC, chassis, and engine number
router.post('/challan/fetch', authenticate, requireUser, fetchEChallanHandler);

// Fetch vehicle registration number using chassis number
router.post('/rc/fetch-reg-num-by-chassis', authenticate, requireUser, fetchRegNumByChassisHandler);

// Fetch FASTag details using RC number or Tag ID
router.post('/fastag/fetch-detailed', authenticate, requireUser, fetchFastagDetailsHandler);

export default router;
