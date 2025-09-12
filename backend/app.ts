import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import router from './src/routes';
import { Request, Response, NextFunction } from 'express';
import { connectDB } from './src/config/db';
import { handleOptions } from './src/common/middleware/auth';

// Connect to MongoDB
connectDB();

const app = express();
// ✅ ADD THIS — Handle OPTIONS requests BEFORE cors()
app.use(handleOptions);

// ✅ UPDATE THIS — Add credentials and origin
app.use(cors({
  origin: 'https://verifymykyc.com',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Mount all API routes under /api
app.use('/api', router);

// Global error handler middleware for logging
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('GLOBAL ERROR HANDLER:', {
    message: err.message,
    stack: err.stack,
    responseData: err.response?.data,
    status: err.status,
    fullError: err
  });
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(err.response?.data ? { details: err.response.data } : {})
  });
});

export default app;
