import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Load environment variables from .env file
 * This should be called at the start of the application
 */
export function loadEnvironment() {
  // Load from .env file in the project root
  const result = dotenv.config({ path: path.join(process.cwd(), '.env') });

  if (result.error && process.env.NODE_ENV !== 'production') {
    console.warn('Warning: .env file not found. Using environment variables or defaults.');
    console.warn('Copy .env.example to .env and configure your API keys.');
  }

  // Validate required environment variables for production
  if (process.env.NODE_ENV === 'production') {
    validateProductionEnvironment();
  }
}

/**
 * Validate that required environment variables are set for production
 */
function validateProductionEnvironment() {
  const required = ['NODE_ENV'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Get environment variable with default value
 */
export function getEnv(key: string, defaultValue?: string): string {
  return process.env[key] || defaultValue || '';
}

/**
 * Get environment variable as number
 */
export function getEnvAsNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Get environment variable as boolean
 */
export function getEnvAsBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV !== 'production';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}
