import axios from 'axios';
import { HTTPError } from '../../../common/http/error';
import { createStandardErrorMapper } from '../../../common/providers/BaseProvider';

export interface GenerateOtpV2Request {
  id_number: string; // Aadhaar Number
}

export interface GenerateOtpV2Response {
  data: {
    otp_sent: boolean;
    if_number: boolean;
    valid_aadhaar: boolean;
  };
  status_code: number;
  message: string;
  status: string;
  request_id: number;
}

/**
 * Generate OTP for Aadhaar V2 verification using QuickEKYC API
 * Waits 45 seconds to generate OTP for same Aadhaar Number
 */
export async function generateOtpV2Provider(
  payload: GenerateOtpV2Request
): Promise<GenerateOtpV2Response> {
  const apiKey = process.env.QUICKEKYC_API_KEY;
  const baseURL = process.env.QUICKEKYC_BASE_URL || 'https://api.quickekyc.com';

  if (!apiKey) {
    throw new HTTPError('QUICKEKYC_API_KEY is not configured', 500);
  }

  try {
    console.log('Aadhaar V2 Generate OTP Request:', {
      aadhaar_number: payload.id_number.replace(/.(?=.{4})/g, 'X'), // Mask Aadhaar
      url: `${baseURL}/api/v1/aadhaar-v2/generate-otp`,
    });

    const response = await axios.post<GenerateOtpV2Response>(
      `${baseURL}/api/v1/aadhaar-v2/generate-otp`,
      {
        key: apiKey,
        id_number: payload.id_number,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    console.log('Aadhaar V2 Generate OTP Response:', {
      status: response.status,
      otp_sent: response.data.data?.otp_sent,
      valid_aadhaar: response.data.data?.valid_aadhaar,
      request_id: response.data.request_id,
    });

    return response.data;
  } catch (error: any) {
    console.error('Aadhaar V2 Generate OTP Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Handle rate limit (429) specifically
    if (error.response?.status === 429) {
      throw new HTTPError(
        'Please wait 45 seconds before requesting another OTP for the same Aadhaar number',
        429,
        error.response?.data
      );
    }

    const { message, statusCode } = createStandardErrorMapper('Aadhaar V2 OTP generation failed')(error);
    throw new HTTPError(message, statusCode, error.response?.data);
  }
}

