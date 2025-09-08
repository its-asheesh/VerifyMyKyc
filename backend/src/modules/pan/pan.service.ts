import { fetchFatherNameByPanProvider } from './providers/fatherName.provider';
import { checkPanAadhaarLinkProvider } from './providers/linkCheck.provider';
import { digilockerPullPanProvider } from './providers/digilockerPull.provider';
import { digilockerInitProvider } from './providers/digilockerInit.provider';
import { digilockerFetchDocumentProvider, DigilockerFetchDocumentRequest } from './providers/digilockerFetchDocument.provider';
import { fetchPanAdvanceProvider } from './providers/fetchPanAdvance.provider';

import { 
  PanFatherNameRequest, 
  PanAadhaarLinkRequest, 
  FetchPanAdvanceRequest, 
  PanDigilockerPullRequest,
  DigilockerInitRequest 
} from '../../common/types/pan';
import { fetchDinByPanProvider } from '../mca/providers/dinByPan.provider';
import { fetchCinByPanProvider } from '../mca/providers/cinByPan.provider';
import { fetchGstinByPanProvider } from '../gstin/providers/fetchByPan.provider';
import type { DinByPanRequest, FetchPanDetailsRequest, GstinByPanRequest } from '../../common/types/pan';
import type { CinByPanRequest } from '../../common/types/mca';
import { fetchPanDetailedProvider } from './providers/fetchPanDetailed.provider';

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

  // DIN By PAN (MCA)
  async fetchDinByPan(payload: DinByPanRequest) {
    return fetchDinByPanProvider(payload);
  }

  // CIN By PAN (MCA)
  async fetchCinByPan(payload: CinByPanRequest) {
    return fetchCinByPanProvider(payload);
  }

  // GSTIN By PAN (GSTIN)
  async fetchGstinByPan(payload: GstinByPanRequest) {
    return fetchGstinByPanProvider(payload);
  }

  // Fetch PAN Advance
  async fetchPanAdvance(payload: FetchPanAdvanceRequest) {
    return fetchPanAdvanceProvider(payload);
  }

  // Fetch PAN Detailed
  async fetchPanDetailed(payload: FetchPanDetailsRequest) {
    return fetchPanDetailedProvider(payload);
  }
}
