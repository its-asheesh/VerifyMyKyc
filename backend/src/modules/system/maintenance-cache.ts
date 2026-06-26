import { SystemSettings, ISystemSettings } from './system.model';
import { logger } from '../../common/utils/logger';

export interface CachedSettings {
  maintenanceMode: boolean;
  maintenanceTitle: string;
  maintenanceMessage: string;
  estimatedEndTime: Date | null;
  showCountdown: boolean;
}

// In-memory cache store
let maintenanceCache: CachedSettings = {
  maintenanceMode: false,
  maintenanceTitle: 'Scheduled Maintenance',
  maintenanceMessage: 'We are currently upgrading our systems. Please check back shortly.',
  estimatedEndTime: null,
  showCountdown: false,
};

/**
 * Loads settings from MongoDB and populates the cache.
 * If no settings document exists, creates the default settings.
 */
export const loadMaintenanceSettings = async (): Promise<CachedSettings> => {
  try {
    let settings = await SystemSettings.findOne({ _id: 'system_settings' });

    if (!settings) {
      logger.info('System settings document not found, initializing default settings...');
      settings = new SystemSettings({
        _id: 'system_settings',
        maintenanceMode: false,
        maintenanceTitle: 'Scheduled Maintenance',
        maintenanceMessage: 'We are currently upgrading our systems. Please check back shortly.',
        estimatedEndTime: null,
        showCountdown: false,
      });
      await settings.save();
    }

    maintenanceCache = {
      maintenanceMode: settings.maintenanceMode,
      maintenanceTitle: settings.maintenanceTitle,
      maintenanceMessage: settings.maintenanceMessage,
      estimatedEndTime: settings.estimatedEndTime,
      showCountdown: settings.showCountdown,
    };

    logger.info('System settings cache loaded successfully:', maintenanceCache);
    return maintenanceCache;
  } catch (error) {
    logger.error('Failed to load system settings into cache:', error);
    return maintenanceCache;
  }
};

/**
 * Refreshes the cache from the database.
 */
export const refreshMaintenanceCache = async (): Promise<CachedSettings> => {
  return loadMaintenanceSettings();
};

/**
 * Returns the current cached maintenance state.
 */
export const getMaintenanceState = (): CachedSettings => {
  return maintenanceCache;
};
