import { fetchGstinByPanProvider } from './providers/fetchByPan.provider';
import { fetchGstinLiteProvider } from './providers/fetchLite.provider';
import { fetchGstinContactProvider } from './providers/fetchContact.provider';
import { GstinByPanRequest, GstinContactRequest } from '../../common/types/pan';

import { FetchGstinLiteRequest } from '../../common/types/gst';

export class GstinService {
  // Fetch GSTIN by PAN
  async fetchByPan(payload: GstinByPanRequest) {
    return fetchGstinByPanProvider(payload);
  }

  // Fetch GSTIN Lite
  async fetchLite(payload: FetchGstinLiteRequest) {
    return fetchGstinLiteProvider(payload);
  }

  // Fetch GSTIN Contact Details
  async fetchContact(payload: GstinContactRequest) {
    return fetchGstinContactProvider(payload);
  }
}
