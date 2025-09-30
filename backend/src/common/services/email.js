"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailer = void 0;
exports.sendEmail = sendEmail;
exports.buildOtpEmailHtml = buildOtpEmailHtml;
const nodemailer_1 = __importDefault(require("nodemailer"));
const gmailMailer_1 = require("./gmailMailer");
const smtpHost = process.env.SMTP_HOST || '';
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';
const fromEmail = process.env.FROM_EMAIL || 'no-reply@verifymykyc.com';
exports.mailer = nodemailer_1.default.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
    logger: !!process.env.EMAIL_DEBUG,
    debug: !!process.env.EMAIL_DEBUG,
});
function sendEmail(to, subject, html) {
    return __awaiter(this, void 0, void 0, function* () {
        // If SMTP configured, prefer SMTP
        if (!smtpHost) {
            // Fallback to Gmail API using service account + delegation
            if (!process.env.FIREBASE_SERVICE_ACCOUNT || !process.env.GMAIL_DELEGATED_USER) {
                throw new Error('Email send requires SMTP or Gmail API (set FIREBASE_SERVICE_ACCOUNT and GMAIL_DELEGATED_USER)');
            }
            const info = yield (0, gmailMailer_1.gmailSend)({ to, subject, html });
            if (process.env.EMAIL_DEBUG)
                console.log('Gmail API sent:', (info === null || info === void 0 ? void 0 : info.id) || info);
            return info;
        }
        try {
            const info = yield exports.mailer.sendMail({
                from: fromEmail,
                to,
                subject,
                html,
            });
            if (process.env.EMAIL_DEBUG) {
                console.log('Email sent:', { messageId: info.messageId, envelope: info.envelope });
            }
            return info;
        }
        catch (err) {
            console.error('Email send failed:', {
                message: err === null || err === void 0 ? void 0 : err.message,
                code: err === null || err === void 0 ? void 0 : err.code,
                command: err === null || err === void 0 ? void 0 : err.command,
                response: err === null || err === void 0 ? void 0 : err.response,
            });
            throw err;
        }
    });
}
function buildOtpEmailHtml(name, code) {
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
