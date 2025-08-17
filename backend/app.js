"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./src/routes"));
const db_1 = require("./src/config/db");
// Connect to MongoDB
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
// Mount all API routes under /api
app.use('/api', routes_1.default);
// Global error handler middleware for logging
app.use((err, req, res, next) => {
    var _a, _b;
    console.error('GLOBAL ERROR HANDLER:', {
        message: err.message,
        stack: err.stack,
        responseData: (_a = err.response) === null || _a === void 0 ? void 0 : _a.data,
        status: err.status,
        fullError: err
    });
    res.status(err.status || 500).json(Object.assign({ message: err.message || 'Internal Server Error' }, (((_b = err.response) === null || _b === void 0 ? void 0 : _b.data) ? { details: err.response.data } : {})));
});
exports.default = app;
