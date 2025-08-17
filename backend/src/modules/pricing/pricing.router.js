"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pricing_controller_1 = require("./pricing.controller");
const router = (0, express_1.Router)();
// ==================== VERIFICATION PRICING ROUTES ====================
router.get("/verification", pricing_controller_1.getAllVerificationPricing);
router.get("/verification/:verificationType", pricing_controller_1.getVerificationPricingByType);
router.post("/verification", pricing_controller_1.addVerificationPricing);
router.put("/verification/:id", pricing_controller_1.editVerificationPricing);
router.delete("/verification/:id", pricing_controller_1.deleteVerificationPricing);
// ==================== HOMEPAGE PLANS ROUTES ====================
router.get("/homepage", pricing_controller_1.getAllHomepagePlans);
router.get("/homepage/:planType", pricing_controller_1.getHomepagePlanByType);
router.post("/homepage", pricing_controller_1.addHomepagePlan);
router.put("/homepage/:id", pricing_controller_1.editHomepagePlan);
router.delete("/homepage/:id", pricing_controller_1.deleteHomepagePlan);
// ==================== COMBINED ROUTES ====================
router.get("/", pricing_controller_1.getAllPricing); // Get all pricing data
router.get("/homepage-pricing", pricing_controller_1.getHomepagePricing);
router.get("/homepage-pricing/:period", pricing_controller_1.getHomepagePlansByPeriod); // Get plans by period (monthly/yearly)
router.get("/available-verifications", pricing_controller_1.getAvailableVerifications);
exports.default = router;
