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
exports.sendGaEvent = sendGaEvent;
const https_1 = __importDefault(require("https"));
function postJSON(url, data) {
    return new Promise((resolve) => {
        try {
            const u = new URL(url);
            const payload = Buffer.from(JSON.stringify(data));
            const req = https_1.default.request({
                hostname: u.hostname,
                path: u.pathname + u.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': payload.length,
                },
            }, (res) => {
                // Drain response; we don't need body
                res.on('data', () => { });
                res.on('end', () => resolve());
            });
            req.on('error', () => resolve());
            req.write(payload);
            req.end();
        }
        catch (_a) {
            resolve();
        }
    });
}
function sendGaEvent(userId_1, name_1) {
    return __awaiter(this, arguments, void 0, function* (userId, name, params = {}) {
        const measurementId = process.env.GA4_MEASUREMENT_ID;
        const apiSecret = process.env.GA4_API_SECRET;
        if (!measurementId || !apiSecret)
            return; // silently skip if not configured
        const clientId = `${Date.now()}.${Math.floor(Math.random() * 1e6)}`;
        const body = Object.assign(Object.assign({ client_id: clientId }, (userId ? { user_id: String(userId) } : {})), { events: [
                {
                    name,
                    params,
                },
            ] });
        const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;
        yield postJSON(url, body);
    });
}
