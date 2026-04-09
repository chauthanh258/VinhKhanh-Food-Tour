import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV || 'development';
const cwd = process.cwd();

// Load environment variables with predictable precedence.
const envFiles = [
  `.env.${nodeEnv}.local`,
  '.env.local',
  `.env.${nodeEnv}`,
  '.env',
];

for (const file of envFiles) {
  const fullPath = path.join(cwd, file);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath, override: false });
  }
}

const port = Number(process.env.PORT || 3001);

export const env = {
  NODE_ENV: nodeEnv,
  PORT: Number.isNaN(port) ? 3001 : port,
  API_BASE_URL: process.env.API_BASE_URL || `http://localhost:${Number.isNaN(port) ? 3001 : port}/api`,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
};
