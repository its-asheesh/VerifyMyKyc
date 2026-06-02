import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

console.log(`[Env Loader] Starting dotenv loader...`);
console.log(`[Env Loader] __dirname = ${__dirname}`);
console.log(`[Env Loader] process.cwd() = ${process.cwd()}`);

function findAndLoadEnv(startDir: string): boolean {
  let dir = path.resolve(startDir);
  while (true) {
    const envPath = path.join(dir, '.env');
    const exists = fs.existsSync(envPath);
    console.log(`[Env Loader] Checking: ${envPath} -> ${exists ? 'FOUND' : 'NOT FOUND'}`);
    if (exists) {
      dotenv.config({ path: envPath });
      console.log(`[Env Loader] Successfully loaded environment from: ${envPath}`);
      return true;
    }
    const parentDir = path.dirname(dir);
    if (parentDir === dir) {
      break; // Reached filesystem root
    }
    dir = parentDir;
  }
  return false;
}

let envLoaded = false;

// 1. Try upward from the current file directory (__dirname)
envLoaded = findAndLoadEnv(__dirname);

// 2. Try upward from the current working directory (process.cwd())
if (!envLoaded) {
  envLoaded = findAndLoadEnv(process.cwd());
}

// 3. Fallback to default dotenv.config()
if (!envLoaded) {
  console.log(`[Env Loader] No .env file found. Falling back to default dotenv.config()`);
  dotenv.config();
}
