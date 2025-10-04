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

// ✅ CORS — allow multiple origins incl. localhost; can override via CORS_ORIGINS env
const defaultOrigins = ['https://verifymykyc.com','https://www.verifymykyc.com','http://localhost:3000','http://127.0.0.1:3000','http://localhost:5173','http://127.0.0.1:5173','https://admin.verifymykyc.com','https://fanglike-santa-boredly.ngrok-free.dev/'];
const envOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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
