import {
  makeProviderApiCall,
  createStandardErrorMapper,
} from '../../../common/providers/BaseProvider';

export async function uanByPanProvider(payload: { pan_number: string; consent: string }) {
  return makeProviderApiCall({
    endpoint: '/epfo-api/uan/fetch-by-pan',
    payload,
    operationName: 'EPFO UAN by PAN',
    customErrorMapper: createStandardErrorMapper('Fetch UAN by PAN failed'),
  });
}
