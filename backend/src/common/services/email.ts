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
  // 1. Prioritize Gmail API if configured (GMAIL_DELEGATED_USER present)
  if (process.env.GMAIL_DELEGATED_USER) {
    console.log(`[Email Service] Sending via Gmail API as ${process.env.GMAIL_DELEGATED_USER}`);
    try {
      const info = await gmailSend({ to, subject, html });
      if (process.env.EMAIL_DEBUG) console.log('Gmail API sent:', info?.id || info);
      return info;
    } catch (err: any) {
      console.error('[Email Service] Gmail API failed:', err?.message || err);
      // Optional: Fallback to SMTP if Gmail fails? For now, throw to be explicit.
      throw err;
    }
  }

  // 2. Fallback to SMTP
  if (smtpHost) {
    try {
      console.log(`[Email Service] Attempting to send email to: ${to}, subject: "${subject}"`);
      console.log(
        `[Email Service] Using configuration: Host=${smtpHost}, Port=${smtpPort}, Secure=${smtpPort === 465}, User=${smtpUser ? '***' : 'None'}`,
      );

      const info = await mailer.sendMail({
        from: fromEmail,
        to,
        subject,
        html,
      });

      console.log(`[Email Service] Email sent successfully. MessageId: ${info.messageId}`);
      if (process.env.EMAIL_DEBUG) {
        console.log('[Email Service] Full envelope:', info.envelope);
      }
      return info;
    } catch (err: any) {
      console.error('[Email Service] Email send FAILED:', {
        message: err?.message,
        code: err?.code,
        command: err?.command,
        response: err?.response,
        stack: err?.stack,
      });
      throw err;
    }
  }

  throw new Error(
    'Email configuration missing. Set GMAIL_DELEGATED_USER (for Gmail API) or SMTP_HOST/SMTP_USER/etc (for SMTP).',
  );
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
