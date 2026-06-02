// Token validation utilities
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const [tokenData, timestamp] = token.split('.');

    if (!tokenData || !timestamp) {
      return true;
    }

    const tokenTime = parseInt(timestamp);
    const currentTime = Date.now();
    const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000;

    return currentTime - tokenTime > fifteenDaysInMs;
  } catch {
    return true;
  }
};

export const parseTokenPayload = (token: string): TokenPayload | null => {
  try {
    const [tokenData] = token.split('.');

    if (!tokenData) {
      return null;
    }

    const payload = JSON.parse(atob(tokenData));
    return payload;
  } catch {
    return null;
  }
};

export const validateToken = (token: string): { isValid: boolean; payload: TokenPayload | null } => {
  if (!token) {
    return { isValid: false, payload: null };
  }

  const isExpired = isTokenExpired(token);
  if (isExpired) {
    return { isValid: false, payload: null };
  }

  const payload = parseTokenPayload(token);
  if (!payload || !payload.userId || !payload.email || !payload.role) {
    return { isValid: false, payload: null };
  }

  return { isValid: true, payload };
};
