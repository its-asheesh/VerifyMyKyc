import { fetchEChallanProvider } from './providers/fetch.provider';
import { EChallanFetchRequest } from '../../common/types/echallan';

export class EChallanService {
  async fetch(payload: EChallanFetchRequest) {
    return fetchEChallanProvider(payload);
  }
} 