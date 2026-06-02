import {
  fetchUanProvider,
  generateOtpProvider,
  validateOtpProvider,
  listEmployersProvider,
  fetchPassbookProvider,
  employmentByUanProvider,
  employmentLatestProvider,
  uanByPanProvider,
  employerVerifyProvider,
} from './providers';

export class EpfoService {
  async fetchUan(payload: any) {
    return fetchUanProvider(payload);
  }
  async generateOtp(payload: any) {
    return generateOtpProvider(payload);
  }
  async validateOtp(transactionId: string, payload: any) {
    return validateOtpProvider(transactionId, payload);
  }
  async listEmployers(transactionId: string) {
    return listEmployersProvider(transactionId);
  }
  async fetchPassbook(transactionId: string, payload: any) {
    return fetchPassbookProvider(transactionId, payload);
  }
  async fetchEmploymentByUan(payload: any) {
    return employmentByUanProvider(payload);
  }
  async fetchLatestEmployment(payload: any) {
    return employmentLatestProvider(payload);
  }
  async fetchUanByPan(payload: any) {
    return uanByPanProvider(payload);
  }
  async verifyEmployer(payload: any) {
    return employerVerifyProvider(payload);
  }
}
