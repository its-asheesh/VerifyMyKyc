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
exports.findEligibleVerificationOrder = findEligibleVerificationOrder;
exports.ensureVerificationQuota = ensureVerificationQuota;
exports.consumeVerificationQuota = consumeVerificationQuota;
const order_model_1 = require("./order.model");
/**
 * Find an eligible verification order for a user and verification type.
 * Prefers the order that expires sooner to minimize waste.
 */
function findEligibleVerificationOrder(userId, verificationType) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        return order_model_1.Order.findOne({
            userId,
            orderType: 'verification',
            status: 'active',
            paymentStatus: 'completed',
            'serviceDetails.verificationType': verificationType,
            'verificationQuota.remaining': { $gt: 0 },
            $or: [
                { 'verificationQuota.expiresAt': { $gt: now } },
                { 'verificationQuota.expiresAt': { $exists: false } },
            ],
        })
            .sort({ 'verificationQuota.expiresAt': 1, endDate: 1, createdAt: 1 })
            .exec();
    });
}
/**
 * Ensures that the user has quota. Returns the order to consume from, or null.
 */
function ensureVerificationQuota(userId, verificationType) {
    return __awaiter(this, void 0, void 0, function* () {
        return findEligibleVerificationOrder(userId, verificationType);
    });
}
/**
 * Consume one verification from the provided order.
 */
function consumeVerificationQuota(order) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!order)
            throw new Error('Order not provided');
        yield order.useVerification();
    });
}
