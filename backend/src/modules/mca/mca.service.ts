import { fetchDinByPanProvider } from './providers/dinByPan.provider';
import { fetchCinByPanProvider } from './providers/cinByPan.provider';
import { DinByPanRequest, CinByPanRequest } from '../../common/types/pan';

export class McaService {
  // Fetch DIN by PAN
  async fetchDinByPan(payload: DinByPanRequest) {
    return fetchDinByPanProvider(payload);
  }

  // Fetch CIN by PAN
  async fetchCinByPan(payload: CinByPanRequest) {
    return fetchCinByPanProvider(payload);
  }
}
