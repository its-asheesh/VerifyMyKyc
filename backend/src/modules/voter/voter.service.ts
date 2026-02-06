import { voterBosonFetchProvider } from './providers/bosonFetch.provider';
import { voterMesonInitProvider } from './providers/mesonInit.provider';
import { voterMesonFetchProvider } from './providers/mesonFetch.provider';
import { voterOcrProvider } from './providers/ocr.provider';
import { VoterBosonFetchRequest, VoterMesonFetchRequest } from '../../common/types/voter';

export class VoterService {
  async bosonFetch(payload: VoterBosonFetchRequest) {
    return voterBosonFetchProvider(payload);
  }

  async mesonInit() {
    return voterMesonInitProvider();
  }

  async mesonFetch(payload: VoterMesonFetchRequest) {
    return voterMesonFetchProvider(payload);
  }

  async ocr(
    file_front: Buffer,
    file_front_name: string,
    consent: string,
    file_back?: Buffer,
    file_back_name?: string,
  ) {
    return voterOcrProvider(file_front, file_front_name, consent, file_back, file_back_name);
  }
}
