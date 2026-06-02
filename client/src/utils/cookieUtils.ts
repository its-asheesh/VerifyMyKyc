// Cookie utilities for secure token storage
export interface CookieOptions {
  expires?: Date;
  maxAge?: number; // in seconds
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

// Set a cookie with options
export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.maxAge !== undefined) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += `; secure`;
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  if (options.httpOnly) {
    cookieString += `; httponly`;
  }

  document.cookie = cookieString;
};

// Get a cookie value by name
export const getCookie = (name: string): string | null => {
  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
};

// Remove a cookie
export const removeCookie = (name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void => {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
    maxAge: -1
  });
};

// Token-specific cookie utilities
export const setTokenCookie = (token: string, rememberMe: boolean = false): void => {
  const options: CookieOptions = {
    path: '/',
    secure: window.location.protocol === 'https:',
    sameSite: 'lax'
  };

  if (rememberMe) {
    // Store for 30 days
    options.maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
  } else {
    // Store for session only (browser close)
    options.maxAge = undefined;
  }

  setCookie('auth_token', token, options);
};

export const getTokenCookie = (): string | null => {
  return getCookie('auth_token');
};

export const removeTokenCookie = (): void => {
  removeCookie('auth_token', { path: '/' });
};

// User data cookie utilities
export const setUserCookie = (userData: unknown, rememberMe: boolean = false): void => {
  const options: CookieOptions = {
    path: '/',
    secure: window.location.protocol === 'https:',
    sameSite: 'lax'
  };

  if (rememberMe) {
    options.maxAge = 30 * 24 * 60 * 60; // 30 days
  }

  setCookie('user_data', JSON.stringify(userData), options);
};

export const getUserCookie = (): unknown | null => {
  const userData = getCookie('user_data');
  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

export const removeUserCookie = (): void => {
  removeCookie('user_data', { path: '/' });
};

// Check if cookies are supported
export const areCookiesSupported = (): boolean => {
  try {
    const testCookie = 'test_cookie_support';
    setCookie(testCookie, 'test');
    const supported = getCookie(testCookie) === 'test';
    removeCookie(testCookie);
    return supported;
  } catch {
    return false;
  }
};



