import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

// Try standard paths relative to both process.cwd() and __dirname
const pathsToTry = [
  path.resolve(__dirname, '../../.env'), // From src/config/dotenv.ts to backend/.env
  path.resolve(__dirname, '../../../.env'), // If in a sub-subdirectory
  path.resolve(__dirname, '../../../../.env'), // In case it's in a built/dist subfolder
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend', '.env'),
];

let envLoaded = false;
for (const p of pathsToTry) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  // Fallback to default dotenv.config()
  dotenv.config();
}
