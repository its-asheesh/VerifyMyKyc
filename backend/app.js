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
const auth_1 = require("./src/common/middleware/auth");
// Connect to MongoDB
(0, db_1.connectDB)();
const app = (0, express_1.default)();
// ✅ ADD THIS — Handle OPTIONS requests BEFORE cors()
app.use(auth_1.handleOptions);
// ✅ CORS — allow multiple origins incl. localhost; can override via CORS_ORIGINS env
const defaultOrigins = ['https://verifymykyc.com', 'https://www.verifymykyc.com', 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'https://admin.verifymykyc.com', 'https://fanglike-santa-boredly.ngrok-free.dev/'];
const envOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        return callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
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
        statusCode: err.statusCode,
        details: err.details,
        fullError: err
    });
    // Use status from HTTPError or default to 500
    const status = err.status || err.statusCode || 500;
    res.status(status).json(Object.assign(Object.assign({ message: err.message || 'Internal Server Error' }, (err.details ? { details: err.details } : {})), (((_b = err.response) === null || _b === void 0 ? void 0 : _b.data) ? { apiError: err.response.data } : {})));
});
exports.default = app;
