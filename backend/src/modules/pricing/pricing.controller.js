"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableVerifications = exports.getHomepagePlansByPeriod = exports.getHomepagePricing = exports.getAllPricing = exports.deleteHomepagePlan = exports.editHomepagePlan = exports.addHomepagePlan = exports.getHomepagePlanByType = exports.getAllHomepagePlans = exports.deleteVerificationPricing = exports.editVerificationPricing = exports.addVerificationPricing = exports.getVerificationPricingByType = exports.getAllVerificationPricing = void 0;
const pricing_model_1 = require("./pricing.model");
// ==================== VERIFICATION PRICING CONTROLLERS ====================
// Get all verification pricing
const getAllVerificationPricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pricing = yield pricing_model_1.VerificationPricing.find();
        res.json(pricing);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch verification pricing" });
    }
});
exports.getAllVerificationPricing = getAllVerificationPricing;
// Get verification pricing by type
const getVerificationPricingByType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { verificationType } = req.params;
        console.log('Backend: Looking for verification type:', verificationType);
        const pricing = yield pricing_model_1.VerificationPricing.findOne({ verificationType });
        console.log('Backend: Found pricing data:', pricing);
        if (!pricing) {
            console.log('Backend: No pricing found for type:', verificationType);
            return res.status(404).json({ message: "Verification pricing not found" });
        }
        console.log('Backend: Sending pricing data:', pricing);
        res.json(pricing);
    }
    catch (err) {
        console.error('Backend: Error fetching verification pricing:', err);
        res.status(500).json({ message: "Failed to fetch verification pricing" });
    }
});
exports.getVerificationPricingByType = getVerificationPricingByType;
// Add verification pricing
const addVerificationPricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pricing = new pricing_model_1.VerificationPricing(req.body);
        yield pricing.save();
        res.status(201).json(pricing);
    }
    catch (err) {
        res.status(400).json({ message: err.message || "Failed to add verification pricing" });
    }
});
exports.addVerificationPricing = addVerificationPricing;
// Edit verification pricing
const editVerificationPricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const pricing = yield pricing_model_1.VerificationPricing.findByIdAndUpdate(id, req.body, { new: true });
        if (!pricing)
            return res.status(404).json({ message: "Verification pricing not found" });
        res.json(pricing);
    }
    catch (err) {
        res.status(400).json({ message: err.message || "Failed to update verification pricing" });
    }
});
exports.editVerificationPricing = editVerificationPricing;
// Delete verification pricing
const deleteVerificationPricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const pricing = yield pricing_model_1.VerificationPricing.findByIdAndDelete(id);
        if (!pricing)
            return res.status(404).json({ message: "Verification pricing not found" });
        res.json({ message: "Verification pricing deleted successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message || "Failed to delete verification pricing" });
    }
});
exports.deleteVerificationPricing = deleteVerificationPricing;
// ==================== HOMEPAGE PLANS CONTROLLERS ====================
// Get all homepage plans
const getAllHomepagePlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plans = yield pricing_model_1.HomepagePlan.find();
        res.json(plans);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch homepage plans" });
    }
});
exports.getAllHomepagePlans = getAllHomepagePlans;
// Get homepage plan by type
const getHomepagePlanByType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { planType } = req.params;
        const plan = yield pricing_model_1.HomepagePlan.findOne({ planType });
        if (!plan)
            return res.status(404).json({ message: "Homepage plan not found" });
        res.json(plan);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch homepage plan" });
    }
});
exports.getHomepagePlanByType = getHomepagePlanByType;
// Add homepage plan
const addHomepagePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plan = new pricing_model_1.HomepagePlan(req.body);
        yield plan.save();
        res.status(201).json(plan);
    }
    catch (err) {
        res.status(400).json({ message: err.message || "Failed to add homepage plan" });
    }
});
exports.addHomepagePlan = addHomepagePlan;
// Edit homepage plan
const editHomepagePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const plan = yield pricing_model_1.HomepagePlan.findByIdAndUpdate(id, req.body, { new: true });
        if (!plan)
            return res.status(404).json({ message: "Homepage plan not found" });
        res.json(plan);
    }
    catch (err) {
        res.status(400).json({ message: err.message || "Failed to update homepage plan" });
    }
});
exports.editHomepagePlan = editHomepagePlan;
// Delete homepage plan
const deleteHomepagePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const plan = yield pricing_model_1.HomepagePlan.findByIdAndDelete(id);
        if (!plan)
            return res.status(404).json({ message: "Homepage plan not found" });
        res.json({ message: "Homepage plan deleted successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message || "Failed to delete homepage plan" });
    }
});
exports.deleteHomepagePlan = deleteHomepagePlan;
// ==================== COMBINED PRICING CONTROLLERS ====================
// Get all pricing data (both verification and homepage plans)
const getAllPricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [verificationPricing, homepagePlans] = yield Promise.all([
            pricing_model_1.VerificationPricing.find(),
            pricing_model_1.HomepagePlan.find()
        ]);
        res.json({
            verificationPricing,
            homepagePlans
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch pricing data" });
    }
});
exports.getAllPricing = getAllPricing;
// Get pricing for homepage (monthly and yearly plans)
const getHomepagePricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plans = yield pricing_model_1.HomepagePlan.find().sort({ planType: 1, planName: 1 });
        res.json(plans);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch homepage pricing" });
    }
});
exports.getHomepagePricing = getHomepagePricing;
// Get homepage plans by billing period
const getHomepagePlansByPeriod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { period } = req.params; // 'monthly' or 'yearly'
        if (!['monthly', 'yearly'].includes(period)) {
            return res.status(400).json({ message: "Invalid period. Must be 'monthly' or 'yearly'" });
        }
        const plans = yield pricing_model_1.HomepagePlan.find({ planType: period }).sort({ planName: 1 });
        res.json(plans);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch homepage plans" });
    }
});
exports.getHomepagePlansByPeriod = getHomepagePlansByPeriod;
// Get all available verification types for custom selection
const getAvailableVerifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifications = yield pricing_model_1.VerificationPricing.find({}, 'verificationType title description monthlyPrice yearlyPrice oneTimePrice');
        res.json(verifications);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch available verifications" });
    }
});
exports.getAvailableVerifications = getAvailableVerifications;
