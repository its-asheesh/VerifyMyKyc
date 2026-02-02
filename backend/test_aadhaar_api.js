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
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '.env') });
const generateOtpV2_provider_1 = require("./src/modules/aadhaar/providers/generateOtpV2.provider");
function testAadhaar() {
    return __awaiter(this, void 0, void 0, function* () {
        const aadhaarNumber = '911426413098';
        console.log(`Testing Aadhaar OTP for number: ${aadhaarNumber}`);
        try {
            const result = yield (0, generateOtpV2_provider_1.generateOtpV2Provider)({ id_number: aadhaarNumber });
            console.log('SUCCESS:', JSON.stringify(result, null, 2));
        }
        catch (error) {
            console.error('ERROR:', JSON.stringify(error, null, 2));
            if (error.response) {
                console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
            }
            console.error('Error Message:', error.message);
        }
    });
}
testAadhaar();
