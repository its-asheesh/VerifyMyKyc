import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { VehicleService } from './vehicle.service';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { ensureVerificationQuota, consumeVerificationQuota } from '../orders/quota.service';
import { logger } from '../../common/utils/logger';

const service = new VehicleService();

// POST /api/vehicle/rc/fetch-lite
// Expects body: { rc_number: string, consent: 'Y' | 'N' }
export const fetchRcLiteHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const { rc_number, consent } = req.body || {};

  if (!rc_number || !consent) {
    return res.status(400).json({ message: 'rc_number and consent are required' });
  }

  logger.info('RC Lite Controller: incoming request', {
    userId,
    rc_number,
    hasConsent: Boolean(consent),
  });

  const order = await ensureVerificationQuota(userId, 'vehicle');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

  logger.info('RC Lite Controller: using order for quota', {
    orderId: order.orderId,
    remaining: order?.verificationQuota?.remaining,
    expiresAt: order?.verificationQuota?.expiresAt,
  });

  const result = await service.fetchRcLite({ rc_number, consent });
  await consumeVerificationQuota(order);

  logger.info('RC Lite Controller: consumed 1 verification', {
    orderId: order.orderId,
    newRemaining: order?.verificationQuota?.remaining,
  });

  res.json(result);
});

// POST /api/vehicle/rc/fetch-detailed
// Expects body: { rc_number: string, extract_variant?: boolean, extract_mapping?: string, extract_insurer?: string, consent: 'Y' | 'N' }
export const fetchRcDetailedHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const { rc_number, extract_variant, extract_mapping, extract_insurer, consent } =
      req.body || {};

    if (!rc_number || !consent) {
      return res.status(400).json({ message: 'rc_number and consent are required' });
    }

    logger.info('RC Detailed Controller: incoming request', {
      userId,
      rc_number,
      extract_variant,
      extract_mapping: !!extract_mapping,
      extract_insurer: !!extract_insurer,
      hasConsent: Boolean(consent),
    });

    const order = await ensureVerificationQuota(userId, 'vehicle');
    if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

    const result = await service.fetchRcDetailed({
      rc_number,
      extract_variant,
      extract_mapping,
      extract_insurer,
      consent,
    });
    await consumeVerificationQuota(order);

    res.json(result);
  },
);

// POST /api/vehicle/rc/fetch-detailed-challan
// Expects body: { rc_number: string, extract_variant?: boolean, extract_mapping?: string, consent: 'Y' | 'N' }
export const fetchRcDetailedWithChallanHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const { rc_number, extract_variant, extract_mapping, consent } = req.body || {};

    if (!rc_number || !consent) {
      return res.status(400).json({ message: 'rc_number and consent are required' });
    }

    logger.info('RC Detailed With Challan Controller: incoming request', {
      userId,
      rc_number,
      extract_variant,
      extract_mapping: !!extract_mapping,
      hasConsent: Boolean(consent),
    });

    const order = await ensureVerificationQuota(userId, 'vehicle');
    if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

    const result = await service.fetchRcDetailedWithChallan({
      rc_number,
      extract_variant,
      extract_mapping,
      consent,
    });
    await consumeVerificationQuota(order);

    res.json(result);
  },
);

// POST /api/vehicle/challan/fetch
// Expects body: { rc_number: string, chassis_number: string, engine_number: string, state_portals?: string[], consent: 'Y' | 'N' }
export const fetchEChallanHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const { rc_number, chassis_number, engine_number, state_portals, consent } = req.body || {};

    if (!rc_number || !chassis_number || !engine_number || !consent) {
      return res.status(400).json({
        message: 'rc_number, chassis_number, engine_number, and consent are required',
      });
    }

    logger.info('E-Challan Controller: incoming request', {
      userId,
      rc_number,
      chassis_number,
      engine_number,
      state_portals,
      hasConsent: Boolean(consent),
    });

    const order = await ensureVerificationQuota(userId, 'vehicle');
    if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

    const result = await service.fetchEChallan({
      rc_number,
      chassis_number,
      engine_number,
      state_portals,
      consent,
    });
    await consumeVerificationQuota(order);

    res.json(result);
  },
);

// POST /api/vehicle/rc/fetch-reg-num-by-chassis
// Expects body: { chassis_number: string, consent: 'Y' | 'N' }
export const fetchRegNumByChassisHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const { chassis_number, consent } = req.body || {};

    if (!chassis_number || !consent) {
      return res.status(400).json({ message: 'chassis_number and consent are required' });
    }

    logger.info('Fetch Reg Num By Chassis Controller: incoming request', {
      userId,
      chassis_number,
      hasConsent: Boolean(consent),
    });

    const order = await ensureVerificationQuota(userId, 'vehicle');
    if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

    const result = await service.fetchRegNumByChassis({ chassis_number, consent });
    await consumeVerificationQuota(order);

    res.json(result);
  },
);

// POST /api/vehicle/fastag/fetch-detailed
// Expects body: { rc_number?: string, tag_id?: string, consent: 'Y' | 'N' }
export const fetchFastagDetailsHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const { rc_number, tag_id, consent } = req.body || {};

    if (!rc_number && !tag_id) {
      return res.status(400).json({
        message: 'At least one of rc_number or tag_id is required',
      });
    }

    if (!consent) {
      return res.status(400).json({ message: 'consent is required' });
    }

    logger.info('FASTag Details Controller: incoming request', {
      userId,
      rc_number: rc_number || 'N/A',
      tag_id: tag_id ? 'PROVIDED' : 'N/A',
      hasConsent: Boolean(consent),
    });

    const order = await ensureVerificationQuota(userId, 'vehicle');
    if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

    const result = await service.fetchFastagDetails({ rc_number, tag_id, consent });
    await consumeVerificationQuota(order);

    res.json(result);
  },
);
