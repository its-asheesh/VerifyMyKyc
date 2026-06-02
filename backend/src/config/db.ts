import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { logger } from '../common/utils/logger';

// Load environment variables
dotenv.config();

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
  } catch (err: any) {
    logger.error('MongoDB connection error:', { message: err.message, stack: err.stack });
    process.exit(1);
  }
};
