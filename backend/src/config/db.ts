import './dotenv';
import mongoose from 'mongoose';

import { logger } from '../common/utils/logger';

const mongoUri = process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    await mongoose.connect(mongoUri, {
      family: 4, // Force IPv4 to resolve querySrv ETIMEOUT
    });
    logger.info('MongoDB connected successfully');

    // Initialize maintenance settings cache
    const { loadMaintenanceSettings } = await import('../modules/system/maintenance-cache');
    await loadMaintenanceSettings();
  } catch (err: any) {
    logger.error('MongoDB connection error:', { message: err.message, stack: err.stack });
    process.exit(1);
  }
};
