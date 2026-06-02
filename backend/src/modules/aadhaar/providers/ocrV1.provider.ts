import {
  makeProviderApiCall,
  createStandardErrorMapper,
} from '../../../common/providers/BaseProvider';

export async function aadhaarOcrV1Provider(base64_data: string, consent: string) {
  return makeProviderApiCall({
    endpoint: '/aadhaar-api/ocr',
    payload: {
      base64_data,
      consent,
    },
    operationName: 'Aadhaar OCR V1',
    customErrorMapper: createStandardErrorMapper('Aadhaar OCR V1 failed'),
  });
}
