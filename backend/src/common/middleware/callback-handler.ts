// backend/callback-handler.ts
import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Utility to save logs
const logCallback = (data: any) => {
  const log = {
    timestamp: new Date().toISOString(),
    ...data,
  };
  const logPath = path.join(__dirname, 'logs', 'ccrv-callbacks.json');
  const dir = path.dirname(logPath);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const existing = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf-8')) : [];
  existing.push(log);
  fs.writeFileSync(logPath, JSON.stringify(existing, null, 2));
};

// 🔁 MAIN CALLBACK ENDPOINT
router.post('/callback/ccrv', (req: Request, res: Response) => {
  console.log('✅ CCRV Callback Received');

  const transactionId = req.headers['x-transaction-id'] as string;
  const referenceId = req.headers['x-reference-id'] as string;
  const authType = req.headers['x-auth-type'] as string;

  const payload = req.body;

  // Log everything
  logCallback({
    transactionId,
    referenceId,
    authType,
    payload,
  });

  // ✅ Extract status
  const code = payload?.data?.code;
  const status = payload?.data?.ccrv_status;
  const reportUrl = payload?.data?.ccrv_data?.report_pdf_url;

  console.log(`Transaction: ${transactionId} | Status: ${status} | Code: ${code}`);

  // 🔌 Here: Update your DB, notify user, send email, etc.
  if (code === '1004') {
    console.log('🎉 Verification SUCCESSFUL:', reportUrl);
    // Save to DB, trigger email, etc.
  } else if (code === '1006') {
    console.log('❌ Verification FAILED');
  }

  // ✅ Respond immediately
  res.status(200).json({ received: true, transactionId, code });
});

export default router;
