"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/callback-handler.ts
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// Utility to save logs
const logCallback = (data) => {
    const log = Object.assign({ timestamp: new Date().toISOString() }, data);
    const logPath = path_1.default.join(__dirname, "logs", "ccrv-callbacks.json");
    const dir = path_1.default.dirname(logPath);
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir);
    const existing = fs_1.default.existsSync(logPath) ? JSON.parse(fs_1.default.readFileSync(logPath, "utf-8")) : [];
    existing.push(log);
    fs_1.default.writeFileSync(logPath, JSON.stringify(existing, null, 2));
};
// 🔁 MAIN CALLBACK ENDPOINT
router.post("/callback/ccrv", (req, res) => {
    var _a, _b, _c, _d;
    console.log("✅ CCRV Callback Received");
    const transactionId = req.headers["x-transaction-id"];
    const referenceId = req.headers["x-reference-id"];
    const authType = req.headers["x-auth-type"];
    const payload = req.body;
    // Log everything
    logCallback({
        transactionId,
        referenceId,
        authType,
        payload,
    });
    // ✅ Extract status
    const code = (_a = payload === null || payload === void 0 ? void 0 : payload.data) === null || _a === void 0 ? void 0 : _a.code;
    const status = (_b = payload === null || payload === void 0 ? void 0 : payload.data) === null || _b === void 0 ? void 0 : _b.ccrv_status;
    const reportUrl = (_d = (_c = payload === null || payload === void 0 ? void 0 : payload.data) === null || _c === void 0 ? void 0 : _c.ccrv_data) === null || _d === void 0 ? void 0 : _d.report_pdf_url;
    console.log(`Transaction: ${transactionId} | Status: ${status} | Code: ${code}`);
    // 🔌 Here: Update your DB, notify user, send email, etc.
    if (code === "1004") {
        console.log("🎉 Verification SUCCESSFUL:", reportUrl);
        // Save to DB, trigger email, etc.
    }
    else if (code === "1006") {
        console.log("❌ Verification FAILED");
    }
    // ✅ Respond immediately
    res.status(200).json({ received: true, transactionId, code });
});
exports.default = router;
