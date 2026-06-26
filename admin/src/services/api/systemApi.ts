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
   */
  async getSettings(): Promise<SystemSettings> {
    const response = await this.get<{ success: boolean; data: SystemSettings }>('/system/settings');
    return response.data;
  }

  /**
   * Updates the system/maintenance settings.
   */
  async updateSettings(data: Partial<SystemSettings>): Promise<SystemSettings> {
    const response = await this.put<{ success: boolean; data: SystemSettings }>('/system/settings', data);
    return response.data;
  }
}

export default new SystemApi();
