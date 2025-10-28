import { makeProviderApiCall, createStandardErrorMapper } from '../../../common/providers/BaseProvider';

export async function fetchUanProvider(payload: { mobile_number: string; pan?: string; consent: string }) {
  const externalPayload = {
    mobile_number: payload.mobile_number,
    pan: payload.pan,
    consent: payload.consent,
  };
  return makeProviderApiCall({
    endpoint: '/epfo-api/fetch-uan',
    payload: externalPayload,
    operationName: 'EPFO Fetch UAN',
    customErrorMapper: createStandardErrorMapper('Fetch UAN failed')
  });
}

