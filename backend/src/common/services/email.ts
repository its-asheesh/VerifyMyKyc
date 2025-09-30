import nodemailer from 'nodemailer';
import { gmailSend } from './gmailMailer';

const smtpHost = process.env.SMTP_HOST || '';
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';
const fromEmail = process.env.FROM_EMAIL || 'no-reply@verifymykyc.com';

export const mailer = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // true for 465, false for other ports
  auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
  logger: !!process.env.EMAIL_DEBUG,
  debug: !!process.env.EMAIL_DEBUG,
});

export async function sendEmail(to: string, subject: string, html: string) {
  // If SMTP configured, prefer SMTP
  if (!smtpHost) {
    // Fallback to Gmail API using service account + delegation
    if (!process.env.FIREBASE_SERVICE_ACCOUNT || !process.env.GMAIL_DELEGATED_USER) {
      throw new Error('Email send requires SMTP or Gmail API (set FIREBASE_SERVICE_ACCOUNT and GMAIL_DELEGATED_USER)');
    }
    const info = await gmailSend({ to, subject, html });
    if (process.env.EMAIL_DEBUG) console.log('Gmail API sent:', info?.id || info);
    return info;
  }
  try {
    const info = await mailer.sendMail({
      from: fromEmail,
      to,
      subject,
      html,
    });
    if (process.env.EMAIL_DEBUG) {
      console.log('Email sent:', { messageId: info.messageId, envelope: info.envelope });
    }
    return info;
  } catch (err: any) {
    console.error('Email send failed:', {
      message: err?.message,
      code: err?.code,
      command: err?.command,
      response: err?.response,
    });
    throw err;
  }
}

export function buildOtpEmailHtml(name: string, code: string) {
  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
    <h2 style="color:#111827;">Verify your email</h2>
    <p>Hi ${name || 'there'},</p>
    <p>Your one-time verification code is:</p>
    <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; background:#f3f4f6; padding:12px 16px; border-radius:8px; display:inline-block;">${code}</div>
    <p style="margin-top:12px;">This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.</p>
    <p style="margin-top:24px; color:#6b7280;">Thanks,<br/>VerifyMyKyc Team</p>
  </div>`;
}


