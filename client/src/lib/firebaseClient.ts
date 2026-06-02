// Lightweight Firebase client initializer used by hooks like useGoogleAuth
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAnalytics, type Analytics, isSupported, setUserId as gaSetUserId, logEvent as gaLogEvent } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider, signInWithPopup, type Auth } from 'firebase/auth'

// Prefer env-based config; falls back to provided public config if not set
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyChOUyrAoNI2ONrGbpbeASGgRwL_v9Bq-g',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'verifymykyc-5f02e.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'verifymykyc-5f02e',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'verifymykyc-5f02e.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1032594065751',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1032594065751:web:42e0c05ca6f0ef0edd1612',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-FMKP8PZ0PF',
}

let app: FirebaseApp
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]!
}

export const auth: Auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export { signInWithPopup }

// Analytics (optional; only if supported and measurementId present)
let _analytics: Analytics | null = null
export const getAnalyticsInstance = async (): Promise<Analytics | null> => {
  try {
    if (_analytics) return _analytics
    const supported = await isSupported()
    if (!supported) return null
    if (!firebaseConfig.measurementId) return null
    _analytics = getAnalytics(app)
    return _analytics
  } catch {
    return null
  }
}

export const analyticsSetUserId = async (userId: string) => {
  const a = await getAnalyticsInstance()
  if (a && userId) gaSetUserId(a, userId)
}

export const analyticsLogEvent = async (name: string, params?: Record<string, unknown>) => {
  const a = await getAnalyticsInstance()
  if (a) gaLogEvent(a, name, params)
}


