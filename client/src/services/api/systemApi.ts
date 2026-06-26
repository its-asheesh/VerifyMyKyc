import BaseApi from './baseApi';

export interface SystemSettings {
  maintenanceMode: boolean;
  maintenanceTitle: string;
  maintenanceMessage: string;
  estimatedEndTime: string | null;
  showCountdown: boolean;
}

class SystemApi extends BaseApi {
  /**
   * Fetches the current system/maintenance settings.
   * This is a public route that skips JWT token validation.
   */
  async getSystemSettings(): Promise<SystemSettings> {
    const response = await this.get<{ success: boolean; data: SystemSettings }>('/system/settings', {
      skipAuth: true,
    });
    return response.data;
  }
}

export default new SystemApi();
