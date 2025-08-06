"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPError = void 0;
class HTTPError extends Error {
    constructor(message, status = 500, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}
exports.HTTPError = HTTPError;
