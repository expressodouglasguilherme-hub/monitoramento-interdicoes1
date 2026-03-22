import * as dotenv from 'dotenv';
import { Config } from './types';

// Load environment variables
dotenv.config();

function parseAllowedOrigins(value?: string): string[] {
  if (!value || value.trim() === '') {
    return []; // Empty means allow all in development
  }
  return value.split(',').map(origin => origin.trim());
}

function parseLogLevel(value?: string): 'debug' | 'info' | 'warn' | 'error' {
  const level = value?.toLowerCase();
  if (level === 'debug' || level === 'info' || level === 'warn' || level === 'error') {
    return level;
  }
  return 'info';
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  powerbiUrl: process.env.POWERBI_URL || 'https://estradasbloqueadas.com.br',
  cacheDurationMs: parseInt(process.env.CACHE_DURATION_MS || '300000', 10), // 5 minutes
  scrapingTimeoutMs: parseInt(process.env.SCRAPING_TIMEOUT_MS || '30000', 10), // 30 seconds
  allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGINS),
  logLevel: parseLogLevel(process.env.LOG_LEVEL),
};

// Validate required configuration
if (!config.powerbiUrl) {
  throw new Error('POWERBI_URL is required');
}

if (config.port < 1 || config.port > 65535) {
  throw new Error('PORT must be between 1 and 65535');
}
