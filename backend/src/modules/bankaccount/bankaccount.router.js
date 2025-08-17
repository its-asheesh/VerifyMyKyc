"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bankaccount_controller_1 = require("./bankaccount.controller");
const router = (0, express_1.Router)();
// POST /api/bankaccount/verify
router.post('/verify', bankaccount_controller_1.verifyBankAccountHandler);
exports.default = router;
