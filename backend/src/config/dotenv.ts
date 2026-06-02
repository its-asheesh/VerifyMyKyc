import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

function findAndLoadEnv(startDir: string): boolean {
  let dir = path.resolve(startDir);
  while (true) {
    const envPath = path.join(dir, '.env');
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      console.log(`[Env Loader] Loaded environment from: ${envPath}`);
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
  dotenv.config();
}
