// Token validation utilities
export interface TokenPayload {
  userId?: string;
  email?: string;
  role?: string;
  exp?: number; // seconds since epoch (JWT)
  [key: string]: any;
}

function base64UrlDecode(input: string): string {
  try {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return atob(padded);
  } catch {
    return '';
  }
}

function tryParseJson(json: string): any | null {
  try { return JSON.parse(json); } catch { return null; }
}

// Parse payload from either standard JWT or custom token format
export const parseTokenPayload = (token: string): TokenPayload | null => {
  if (!token) return null;
  const parts = token.split('.');
  // Standard JWT: header.payload.signature
  if (parts.length >= 2) {
    const jwtPayload = base64UrlDecode(parts[1]);
    const jwtObj = tryParseJson(jwtPayload);
    if (jwtObj) return jwtObj as TokenPayload;
  }
  // Custom: base64JsonPayload.timestamp.signature
  if (parts.length >= 2) {
    const customPayload = atob(parts[0]); // first segment is standard base64 JSON in custom format
    const customObj = tryParseJson(customPayload);
    if (customObj) return customObj as TokenPayload;
  }
  return null;
};

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  const parts = token.split('.');
  const payload = parseTokenPayload(token);
  if (!payload) return true;
  // JWT exp
  if (payload.exp && typeof payload.exp === 'number') {
    const nowSec = Math.floor(Date.now() / 1000);
    return nowSec >= payload.exp;
  }
  // Custom timestamp (ms) is the 2nd segment
  if (parts.length >= 2) {
    const tsMs = Number(parts[1]);
    if (!Number.isNaN(tsMs) && tsMs > 0) {
      const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;
      return Date.now() - tsMs > fifteenDaysMs;
    }
  }
  // If no exp information, consider it valid and let server enforce
  return false;
};

export const validateToken = (token: string): { isValid: boolean; payload: TokenPayload | null } => {
  if (!token) return { isValid: false, payload: null };
  const expired = isTokenExpired(token);
  if (expired) return { isValid: false, payload: null };
  const payload = parseTokenPayload(token);
  return { isValid: !!payload, payload: payload || null };
};
