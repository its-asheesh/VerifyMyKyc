import axios from 'axios';
import { HTTPError } from '../../../common/http/error';
import { createStandardErrorMapper } from '../../../common/providers/BaseProvider';

export interface SubmitOtpV2Request {
  request_id: string | number;
  otp: string;
  client_id?: string;
}

export interface AadhaarV2Address {
  dist?: string;
  house?: string;
  country?: string;
  subdist?: string;
  vtc?: string;
  po?: string;
  state?: string;
  street?: string;
  loc?: string;
}

export interface AadhaarV2Response {
  aadhaar_number: string;
  dob: string; // yyyy-mm-dd
  zip?: string;
  full_name: string;
  gender?: string;
  address?: AadhaarV2Address;
  client_id?: string;
  profile_image?: string;
  zip_data?: string;
  raw_xml?: string;
  share_code?: string;
  care_of?: string;
}

export interface SubmitOtpV2Response {
  data: AadhaarV2Response;
  status_code: number;
  message: string;
  status: string;
  request_id: number;
}

/**
 * Submit OTP for Aadhaar V2 verification using QuickEKYC API
 */
export async function submitOtpV2Provider(
  payload: SubmitOtpV2Request
): Promise<SubmitOtpV2Response> {
  const apiKey = process.env.QUICKEKYC_API_KEY;
  const baseURL = process.env.QUICKEKYC_BASE_URL || 'https://api.quickekyc.com';

  if (!apiKey) {
    throw new HTTPError('QUICKEKYC_API_KEY is not configured', 500);
  }

  try {
    console.log('Aadhaar V2 Submit OTP Request:', {
      request_id: payload.request_id,
      has_otp: !!payload.otp,
      url: `${baseURL}/api/v1/aadhaar-v2/submit-otp`,
    });

    const response = await axios.post<SubmitOtpV2Response>(
      `${baseURL}/api/v1/aadhaar-v2/submit-otp`,
      {
        key: apiKey,
        request_id: payload.request_id,
        otp: payload.otp,
        ...(payload.client_id && { client_id: payload.client_id }),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    console.log('Aadhaar V2 Submit OTP Response:', {
      status: response.status,
      success: response.data.status === 'success',
      has_data: !!response.data.data,
      request_id: response.data.request_id,
    });

    // Handle API errors (200 OK with error status)
    if (response.data.status === 'error') {
      throw new HTTPError(
        response.data.message || 'QuickEKYC API Error',
        response.data.status_code || 502,
        response.data
      );
    }

    return response.data;
  } catch (error: any) {
    // If it's already an HTTPError, re-throw it
    if (error instanceof HTTPError) {
      throw error;
    }

    console.error('Aadhaar V2 Submit OTP Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Handle 401 Unauthorized from external API (Fixes frontend logout issue)
    if (error.response?.status === 401) {
      throw new HTTPError(
        'Upstream service authentication failed. Please contact support.',
        502,
        error.response?.data
      );
    }

    // Handle invalid OTP/request_id
    if (error.response?.status === 200 && error.response?.data?.status === 'error') {
      throw new HTTPError(
        error.response.data.message || 'Invalid OTP or request ID',
        400,
        error.response.data
      );
    }

    const { message, statusCode } = createStandardErrorMapper('Aadhaar V2 OTP submission failed')(error);
    throw new HTTPError(message, statusCode, error.response?.data);
  }
}

