"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bankaccount_controller_1 = require("./bankaccount.controller");
const middleware_1 = require("../../common/validation/middleware");
const schemas_1 = require("../../common/validation/schemas");
const router = (0, express_1.Router)();
// POST /api/bankaccount/verify
// Validates request body using Zod schema before processing
router.post('/verify', (0, middleware_1.validate)(schemas_1.bankAccountVerifySchema), bankaccount_controller_1.verifyBankAccountHandler);
// POST /api/bankaccount/verify-ifsc
// Validates IFSC code and fetches bank/branch details
router.post('/verify-ifsc', (0, middleware_1.validate)(schemas_1.ifscValidateSchema), bankaccount_controller_1.verifyIfscHandler);
// POST /api/bankaccount/verify-upi
// Verifies UPI ID (VPA) and fetches account holder name
router.post('/verify-upi', (0, middleware_1.validate)(schemas_1.upiVerifySchema), bankaccount_controller_1.verifyUpiHandler);
exports.default = router;
