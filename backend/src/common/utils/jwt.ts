import { IUser } from '../../modules/auth/auth.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Simple token generation (replace with actual JWT library)
export const generateToken = (user: IUser): string => {
  const payload: JWTPayload = {
    userId: (user._id as any).toString(),
    email: user.email,
    role: user.role
  };

  // For now, create a simple token (replace with actual JWT)
  const tokenData = Buffer.from(JSON.stringify(payload)).toString('base64');
  const timestamp = Date.now();
  const signature = Buffer.from(`${JWT_SECRET}${timestamp}`).toString('base64');
  
  return `${tokenData}.${timestamp}.${signature}`;
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    const [tokenData, timestamp, signature] = token.split('.');
    
    if (!tokenData || !timestamp || !signature) {
      throw new Error('Invalid token format');
    }

    // Verify signature
    const expectedSignature = Buffer.from(`${JWT_SECRET}${timestamp}`).toString('base64');
    if (signature !== expectedSignature) {
      throw new Error('Invalid token signature');
    }

    // Check if token is expired
    const tokenTime = parseInt(timestamp);
    const currentTime = Date.now();
    const expirationMs = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds
    
    if (currentTime - tokenTime > expirationMs) {
      throw new Error('Token expired');
    }

    const payload = JSON.parse(Buffer.from(tokenData, 'base64').toString());
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const extractTokenFromHeader = (authHeader: string): string => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}; 