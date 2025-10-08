"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = exports.verifyToken = exports.generateToken = void 0;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
// Simple token generation (replace with actual JWT library)
const generateToken = (user) => {
    const payload = {
        userId: user._id.toString(),
        email: user.email || '',
        role: user.role
    };
    // For now, create a simple token (replace with actual JWT)
    const tokenData = Buffer.from(JSON.stringify(payload)).toString('base64');
    const timestamp = Date.now();
    const signature = Buffer.from(`${JWT_SECRET}${timestamp}`).toString('base64');
    return `${tokenData}.${timestamp}.${signature}`;
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const [tokenData, timestamp, signature] = token.split('.');
        if (!tokenData || !timestamp || !signature) {
            throw new Error('Invalid token format');
        }
        // Verify signature
        const expectedSignature = Buffer.from(`${JWT_SECRET}${timestamp}`).toString('base64');
        if (signature !== expectedSignature) {
            console.error('Signature mismatch:', { signature, expectedSignature });
            throw new Error('Invalid token signature');
        }
        // Check expiration
        const tokenTime = parseInt(timestamp);
        const currentTime = Date.now();
        const expirationMs = 15 * 24 * 60 * 60 * 1000;
        if (currentTime - tokenTime > expirationMs) {
            console.error('Token expired:', { tokenTime, currentTime });
            throw new Error('Token expired');
        }
        const payload = JSON.parse(Buffer.from(tokenData, 'base64').toString());
        return payload;
    }
    catch (error) {
        console.error('Token verification failed:', error);
        throw new Error('Invalid token');
    }
};
exports.verifyToken = verifyToken;
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('No token provided');
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
};
exports.extractTokenFromHeader = extractTokenFromHeader;
