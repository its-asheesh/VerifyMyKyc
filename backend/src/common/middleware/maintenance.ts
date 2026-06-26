import { Request, Response, NextFunction } from 'express';
import { getMaintenanceState } from '../../modules/system/maintenance-cache';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt';

/**
 * Checks if the request path is whitelisted during maintenance mode.
 */
const isWhitelisted = (path: string): boolean => {
  const cleanPath = path.split('?')[0]; // strip query parameters
  
  return (
    cleanPath === '/api/auth/login' ||
    cleanPath === '/api/auth/login/phone-password' ||
    cleanPath === '/api/system/settings' ||
    cleanPath.includes('/callback')
  );
};

/**
 * Global middleware to block requests when system is in maintenance mode.
 * Admins are bypassed if they have a valid token.
 */
export const maintenanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { maintenanceMode, maintenanceTitle, maintenanceMessage, estimatedEndTime, showCountdown } = getMaintenanceState();

  // If maintenance is off, proceed
  if (!maintenanceMode) {
    return next();
  }

  // Check if route is whitelisted
  const path = req.originalUrl || req.url;
  if (isWhitelisted(path)) {
    return next();
  }

  // Check if request is from an admin
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = extractTokenFromHeader(authHeader);
      const decoded = verifyToken(token);
      
      if (decoded && decoded.role === 'admin') {
        // Admin user - bypass maintenance
        return next();
      }
    } catch (error) {
      // Token verification failed or not an admin, proceed to block
    }
  }

  // Block the request and return 503
  return res.status(503).json({
    success: false,
    maintenance: true,
    title: maintenanceTitle,
    message: maintenanceMessage,
    estimatedEndTime: estimatedEndTime,
    showCountdown: showCountdown,
  });
};
