import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

/**
 * Gmail API mailer using a Google Workspace service account with domain-wide delegation.
 * Requires FIREBASE_SERVICE_ACCOUNT (JSON) and GMAIL_DELEGATED_USER (the from user).
 */

function getServiceAccount() {
  // 1) Inline JSON via env
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
  // 2) JSON file path via env
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (filePath && fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  // 3) Try a sensible default relative to repo (e.g., provided json under src/modules/auth)
  const defaultRel = path.resolve(process.cwd(), 'src/modules/auth/verifymykyc-5f02e-firebase-adminsdk-fbsvc-41079032c4.json');
  if (fs.existsSync(defaultRel)) {
    return JSON.parse(fs.readFileSync(defaultRel, 'utf8'));
  }
  throw new Error('Service account JSON not found. Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_SERVICE_ACCOUNT_PATH.');
}

function getJWT() {
  const svc = getServiceAccount();
  const jwt = new google.auth.JWT(
    svc.client_email,
    undefined,
    svc.private_key,
    ['https://www.googleapis.com/auth/gmail.send'],
    process.env.GMAIL_DELEGATED_USER // user to impersonate
  );
  return jwt;
}

function createMimeMessage(from: string, to: string, subject: string, html: string) {
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
  ].join('\n');
  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export async function gmailSend({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!process.env.GMAIL_DELEGATED_USER) {
    throw new Error('GMAIL_DELEGATED_USER is required for Gmail API send (a Workspace mailbox to send as).');
  }
  const auth = getJWT();
  await auth.authorize();
  const gmail = google.gmail({ version: 'v1', auth });
  const from = process.env.FROM_EMAIL || process.env.GMAIL_DELEGATED_USER || 'no-reply@your-domain.com';
  const raw = createMimeMessage(from, to, subject, html);

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  });
  return res.data;
}


