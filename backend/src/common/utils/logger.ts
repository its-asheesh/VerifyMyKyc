// src/utils/logger.ts
import winston from 'winston';
import path from 'path';

// Define log directory
const LOG_DIR = 'logs';

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

// Create Winston logger instance
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
  ),
  transports: [
    // Console transport for development (readable)
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    // File transport for all logs (JSON format for easier parsing)
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'combined.log'),
      format: winston.format.combine(winston.format.json()),
    }),
    // File transport for errors only
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'error.log'),
      level: 'error',
      format: winston.format.combine(winston.format.json()),
    }),
  ],
});

// Legacy support for logToFile (maps to info level)
export const logToFile = (fileName: string, data: any) => {
  logger.info(`Log to ${fileName}`, { fileName, ...data });
};
