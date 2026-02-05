
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

import { generateOtpV2Provider } from './src/modules/aadhaar/providers/generateOtpV2.provider';

async function testAadhaar() {
    const aadhaarNumber = '911426413098';
    console.log(`Testing Aadhaar OTP for number: ${aadhaarNumber}`);

    try {
        const result = await generateOtpV2Provider({ id_number: aadhaarNumber, consent: 'Y' });
        console.log('SUCCESS:', JSON.stringify(result, null, 2));
    } catch (error: any) {
        console.error('ERROR:', JSON.stringify(error, null, 2));
        if (error.response) {
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        console.error('Error Message:', error.message);
    }
}

testAadhaar();
