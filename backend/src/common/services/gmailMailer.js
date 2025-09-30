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
exports.gmailSend = gmailSend;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
    if (filePath && fs_1.default.existsSync(filePath)) {
        return JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
    }
    // 3) Try a sensible default relative to repo (e.g., provided json under src/modules/auth)
    const defaultRel = path_1.default.resolve(process.cwd(), 'src/modules/auth/verifymykyc-5f02e-firebase-adminsdk-fbsvc-41079032c4.json');
    if (fs_1.default.existsSync(defaultRel)) {
        return JSON.parse(fs_1.default.readFileSync(defaultRel, 'utf8'));
    }
    throw new Error('Service account JSON not found. Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_SERVICE_ACCOUNT_PATH.');
}
function getJWT() {
    const svc = getServiceAccount();
    const jwt = new googleapis_1.google.auth.JWT(svc.client_email, undefined, svc.private_key, ['https://www.googleapis.com/auth/gmail.send'], process.env.GMAIL_DELEGATED_USER // user to impersonate
    );
    return jwt;
}
function createMimeMessage(from, to, subject, html) {
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
function gmailSend(_a) {
    return __awaiter(this, arguments, void 0, function* ({ to, subject, html }) {
        if (!process.env.GMAIL_DELEGATED_USER) {
            throw new Error('GMAIL_DELEGATED_USER is required for Gmail API send (a Workspace mailbox to send as).');
        }
        const auth = getJWT();
        yield auth.authorize();
        const gmail = googleapis_1.google.gmail({ version: 'v1', auth });
        const from = process.env.FROM_EMAIL || process.env.GMAIL_DELEGATED_USER || 'no-reply@your-domain.com';
        const raw = createMimeMessage(from, to, subject, html);
        const res = yield gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw },
        });
        return res.data;
    });
}
