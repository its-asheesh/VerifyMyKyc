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
import { validate } from '../../common/validation/middleware';
import {
  rcLiteSchema,
  rcDetailedSchema,
  rcDetailedWithChallanSchema,
  eChallanSchema,
  regNumByChassisSchema,
  fastagSchema
} from '../../common/validation/schemas';

const router = Router();

/**
 * RC Verification APIs
 */

// Fetch basic RC details
router.post('/rc/fetch-lite', authenticate, requireUser, validate(rcLiteSchema), fetchRcLiteHandler);

// Fetch detailed RC information
router.post('/rc/fetch-detailed', authenticate, requireUser, validate(rcDetailedSchema), fetchRcDetailedHandler);

// Fetch RC details with linked challans
router.post(
  '/rc/fetch-detailed-challan',
  authenticate,
  requireUser,
  validate(rcDetailedWithChallanSchema),
  fetchRcDetailedWithChallanHandler,
);

// Fetch e-challan details by RC, chassis, and engine number
router.post('/challan/fetch', authenticate, requireUser, validate(eChallanSchema), fetchEChallanHandler);

// Fetch vehicle registration number using chassis number
router.post('/rc/fetch-reg-num-by-chassis', authenticate, requireUser, validate(regNumByChassisSchema), fetchRegNumByChassisHandler);

// Fetch FASTag details using RC number or Tag ID
router.post('/fastag/fetch-detailed', authenticate, requireUser, validate(fastagSchema), fetchFastagDetailsHandler);

export default router;
