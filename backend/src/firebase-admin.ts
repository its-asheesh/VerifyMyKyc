// src/firebase-admin.ts
import * as admin from 'firebase-admin';
import { logger } from './common/utils/logger';
import * as serviceAccount from './modules/auth/verifymykyc-5f02e-firebase-adminsdk-fbsvc-41079032c4.json'; // ✅ Direct JSON import

// Initialize only once
if (!admin.apps.length) {
  try {
    // Validate
    if (!serviceAccount.private_key) {
      throw new Error("Service account is missing 'private_key'");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: 'verifymykyc-5f02e',
    });

    logger.info('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    logger.error('❌ Firebase Admin SDK initialization failed:', error);
  }
}

export default admin;
