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
exports.optionalAuth = exports.requireAnyRole = exports.requireUser = exports.requireAdmin = exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const auth_model_1 = require("../../modules/auth/auth.model");
// Middleware to authenticate user
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        const token = (0, jwt_1.extractTokenFromHeader)(authHeader);
        const decoded = (0, jwt_1.verifyToken)(token);
        // Find user in database
        const user = yield auth_model_1.User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid token. User not found.' });
        }
        if (!user.isActive) {
            return res.status(401).json({ message: 'Account is deactivated.' });
        }
        // Attach user to request object
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: error.message || 'Invalid token.' });
    }
});
exports.authenticate = authenticate;
// Middleware to check if user has required role
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Access denied. User not authenticated.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied. Insufficient permissions.'
            });
        }
        next();
    };
};
exports.authorize = authorize;
// Specific role middlewares
exports.requireAdmin = (0, exports.authorize)('admin');
exports.requireUser = (0, exports.authorize)('user', 'admin');
exports.requireAnyRole = (0, exports.authorize)('user', 'admin');
// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(); // Continue without user
        }
        const token = (0, jwt_1.extractTokenFromHeader)(authHeader);
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = yield auth_model_1.User.findById(decoded.userId).select('-password');
        if (user && user.isActive) {
            req.user = user;
        }
        next();
    }
    catch (error) {
        // Continue without user if token is invalid
        next();
    }
});
exports.optionalAuth = optionalAuth;
