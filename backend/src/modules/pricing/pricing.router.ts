import { Router } from 'express';
import {
  // Verification Pricing Controllers
  getAllVerificationPricing,
  getVerificationPricingByType,
  addVerificationPricing,
  editVerificationPricing,
  deleteVerificationPricing,

  // Homepage Plans Controllers
  getAllHomepagePlans,
  getHomepagePlanByType,
  addHomepagePlan,
  editHomepagePlan,
  deleteHomepagePlan,

  // Combined Controllers
  getAllPricing,
  getHomepagePricing,
  getHomepagePlansByPeriod,
  getAvailableVerifications,
} from './pricing.controller';

const router = Router();

// ==================== VERIFICATION PRICING ROUTES ====================
router.get('/verification', getAllVerificationPricing);
router.get('/verification/:verificationType', getVerificationPricingByType);
router.post('/verification', addVerificationPricing);
router.put('/verification/:id', editVerificationPricing);
router.delete('/verification/:id', deleteVerificationPricing);

// ==================== HOMEPAGE PLANS ROUTES ====================
router.get('/homepage', getAllHomepagePlans);
router.get('/homepage/:planType', getHomepagePlanByType);
router.post('/homepage', addHomepagePlan);
router.put('/homepage/:id', editHomepagePlan);
router.delete('/homepage/:id', deleteHomepagePlan);

// ==================== COMBINED ROUTES ====================
router.get('/', getAllPricing); // Get all pricing data
router.get('/homepage-pricing', getHomepagePricing);
router.get('/homepage-pricing/:period', getHomepagePlansByPeriod); // Get plans by period (monthly/yearly)
router.get('/available-verifications', getAvailableVerifications);

export default router;
