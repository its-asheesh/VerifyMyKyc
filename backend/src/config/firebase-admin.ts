// src/config/firebase-admin.ts
import * as admin from "firebase-admin";
import serviceAccount from "./verifymykyc-3d29e-firebase-adminsdk-fbsvc-35a8fb6c42.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
  console.log("✅ Firebase Admin initialized");
}

export default admin;