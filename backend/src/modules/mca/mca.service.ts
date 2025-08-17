import { fetchDinByPanProvider } from './providers/dinByPan.provider';
import { fetchCinByPanProvider } from './providers/cinByPan.provider';
import { fetchCompanyProvider } from './providers/fetchCompany.provider';
import { DinByPanRequest, CinByPanRequest } from '../../common/types/pan';
import { FetchCompanyRequest } from '../../common/types/mca';

export class McaService {
  // Fetch DIN by PAN
  async fetchDinByPan(payload: DinByPanRequest) {
    return fetchDinByPanProvider(payload);
  }

  // Fetch CIN by PAN
  async fetchCinByPan(payload: CinByPanRequest) {
    return fetchCinByPanProvider(payload);
  }

  // Fetch Company by Company ID (CIN/FCRN/LLPIN)
  async fetchCompany(payload: FetchCompanyRequest) {
    return fetchCompanyProvider(payload);
  }
}
