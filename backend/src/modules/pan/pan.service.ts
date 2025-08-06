import { fetchFatherNameByPanProvider } from './providers/fatherName.provider';
import { checkPanAadhaarLinkProvider } from './providers/linkCheck.provider';
import { digilockerPullPanProvider } from './providers/digilockerPull.provider';
import { digilockerInitProvider } from './providers/digilockerInit.provider';
import { digilockerFetchDocumentProvider, DigilockerFetchDocumentRequest } from './providers/digilockerFetchDocument.provider';
import { 
  PanFatherNameRequest, 
  PanAadhaarLinkRequest, 
  PanDigilockerPullRequest,
  DigilockerInitRequest 
} from '../../common/types/pan';

export class PanService {
  // Fetch Father's Name by PAN
  async fetchFatherName(payload: PanFatherNameRequest) {
    return fetchFatherNameByPanProvider(payload);
  }

  // Check PAN-Aadhaar Link
  async checkPanAadhaarLink(payload: PanAadhaarLinkRequest) {
    return checkPanAadhaarLinkProvider(payload);
  }

  // Digilocker Init
  async digilockerInit(payload: DigilockerInitRequest) {
    return digilockerInitProvider(payload);
  }

  // Digilocker Pull PAN
  async digilockerPull(payload: PanDigilockerPullRequest, transactionId: string) {
    return digilockerPullPanProvider(payload, transactionId);
  }

  // Digilocker Fetch Document
  async digilockerFetchDocument(payload: DigilockerFetchDocumentRequest) {
    return digilockerFetchDocumentProvider(payload);
  }
}
