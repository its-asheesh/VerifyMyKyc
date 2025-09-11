import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '../utils/jwt';
import { User } from '../../modules/auth/auth.model';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: any;
}

// ✅ ADD THIS — Handle OPTIONS requests for CORS preflight
export const handleOptions = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', 'https://verifymykyc.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
  } else {
    next();
  }
};

// Middleware to authenticate user
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('AUTH REQUEST FROM:', req.headers['user-agent']);
    console.log('AUTHORIZATION HEADER:', req.headers.authorization);

    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = extractTokenFromHeader(authHeader);
    const decoded = verifyToken(token) as JWTPayload;

    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated.' });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error('AUTH ERROR:', error.message);
    return res.status(401).json({ message: error.message || 'Invalid token.' });
  }
};

// Middleware to check if user has required role
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
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

// Specific role middlewares
export const requireAdmin = authorize('admin');
export const requireUser = authorize('user', 'admin');
export const requireAnyRole = authorize('user', 'admin');

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next(); // Continue without user
    }

    const token = extractTokenFromHeader(authHeader);
    const decoded = verifyToken(token) as JWTPayload;

    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.isActive) {
      req.user = user;
    }

    next();
  } catch (error) {
    next();
  }
};