import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { SystemSettings } from './system.model';
import { refreshMaintenanceCache, getMaintenanceState } from './maintenance-cache';
import { logger } from '../../common/utils/logger';

/**
 * Get current system settings (Public endpoint)
 */
export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = getMaintenanceState();
  
  return res.status(200).json({
    success: true,
    data: settings,
  });
});

/**
 * Update system settings (Admin only)
 */
export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const { maintenanceMode, maintenanceTitle, maintenanceMessage, estimatedEndTime, showCountdown } = req.body;

  // Find or create settings document
  let settings = await SystemSettings.findOne({ _id: 'system_settings' });

  if (!settings) {
    settings = new SystemSettings({ _id: 'system_settings' });
  }

  // Update fields if provided
  if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
  if (maintenanceTitle !== undefined) settings.maintenanceTitle = maintenanceTitle;
  if (maintenanceMessage !== undefined) settings.maintenanceMessage = maintenanceMessage;
  if (estimatedEndTime !== undefined) settings.estimatedEndTime = estimatedEndTime;
  if (showCountdown !== undefined) settings.showCountdown = showCountdown;
  
  if (req.user) {
    settings.updatedBy = req.user._id;
  }

  await settings.save();

  // Refresh in-memory cache immediately
  const updatedCache = await refreshMaintenanceCache();

  logger.info(`System settings updated by admin: ${req.user?._id || 'unknown'}`, updatedCache);

  return res.status(200).json({
    success: true,
    message: 'System settings updated successfully',
    data: updatedCache,
  });
});
