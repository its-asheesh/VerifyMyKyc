import {
  generateCCRVReportProvider,
  fetchCCRVResultProvider,
  searchCCRVProvider,
} from './provider/fetch.CcrvProvider';
import { logToFile, logger } from '../../common/utils/logger';

// Import request types
import {
  CCRVGenerateReportRequest,
  CCRVFetchResultRequest,
  CCRVSearchRequest,
} from '../../common/types/ccrv';

// Import response types
import {
  CCRVGenerateReportResponse,
  CCRVFetchResultResponse,
  CCRVSearchResponse,
} from '../../common/types/ccrv';

import { CCRVCallbackData } from '../../common/types/ccrv';

export class CCRVService {
  /**
   * Generates a CCRV report for criminal case record verification.
   * This API initiates the CCRV verification process and returns a transaction ID.
   */
  async generateReport(payload: CCRVGenerateReportRequest): Promise<CCRVGenerateReportResponse> {
    return generateCCRVReportProvider(payload);
  }

  /**
   * Fetches the CCRV result using the transaction ID.
   * This API is used to get the status of verification or the final result.
   */
  async fetchResult(payload: CCRVFetchResultRequest): Promise<CCRVFetchResultResponse> {
    return fetchCCRVResultProvider(payload);
  }

  /**
   * Searches for CCRV records based on name and address.
   * This API initiates a search for criminal case records.
   */
  async search(payload: CCRVSearchRequest): Promise<CCRVSearchResponse> {
    return searchCCRVProvider(payload);
  }

  async handleCallback(data: CCRVCallbackData): Promise<void> {
    const { transactionId, referenceId, payload } = data;

    // Log for audit
    logToFile('ccrv-callbacks', {
      timestamp: new Date().toISOString(),
      transactionId,
      referenceId,
      code: payload?.data?.code,
      status: payload?.data?.ccrv_status,
      result: payload?.data?.ccrv_data?.report_status?.result,
    });

    const code = payload?.data?.code;
    const result = payload?.data?.ccrv_data?.report_status?.result;

    // 🔍 Business Logic
    // Determine a mapped status based on the code and result
    let mappedCode: 'SUCCESS' | 'FAILURE' | 'PENDING' = 'PENDING';
    if (code === '1004' && result === 'SUCCESS') {
      mappedCode = 'SUCCESS';
    } else if (['1006', '1008', '1010'].includes(code)) {
      mappedCode = 'FAILURE';
    }

    // Log based on mapped status
    if (mappedCode === 'SUCCESS') {
      logger.info(`🎉 CCRV SUCCESS for ${transactionId}`);
      // ➕ Update DB, notify user via email/SMS, trigger webhook
      // await updateUserVerificationStatus(transactionId, 'completed');
      // await sendEmailNotification(userId, 'ccrv_success', payload);
    } else if (mappedCode === 'FAILURE') {
      logger.warn(`⚠️ CCRV ${code} for ${transactionId}:`, payload?.data?.message);
      // ➕ Handle failure or UTV
    } else {
      logger.info(`📌 CCRV In Progress or Unknown: ${code}`);
    }

    // Optionally: store full payload in DB
    // await db.ccrvCallbacks.create({ transactionId, payload });
  }
}
