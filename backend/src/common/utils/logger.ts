// src/utils/logger.ts
import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(__dirname, '../logs');

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

export const logToFile = (fileName: string, data: any) => {
  const filePath = path.join(LOG_DIR, `${fileName}.jsonl`); // .jsonl = JSON Lines
  const logEntry = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...data,
  }) + '\n'; // Append newline for JSONL format

  try {
    fs.appendFileSync(filePath, logEntry, 'utf-8');
  } catch (err) {
    console.error('Failed to write log:', err);
  }
};