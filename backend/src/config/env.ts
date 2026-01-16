/**
 * Environment Variable Validation
 *
 * This module validates all environment variables at startup using Zod.
 * If any required variable is missing or invalid, the app will fail fast
 * with a clear error message instead of crashing at runtime.
 */

import { z } from 'zod';

// Define the schema for all environment variables
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection URL'),

  // Redis
  REDIS_URL: z.string().url('REDIS_URL must be a valid Redis connection URL').optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).optional(),
  REDIS_PASSWORD: z.string().optional(),

  // JWT Secrets
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters for security'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Encryption
  ENCRYPTION_KEY: z.string().min(32, 'ENCRYPTION_KEY must be at least 32 characters'),

  // API Configuration
  // Adding 'test' to allowed environments
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().min(1000).max(65535).default(4000),
  API_VERSION: z.string().default('v1'),

  // CORS
  CORS_ORIGIN: z.string().url('CORS_ORIGIN must be a valid URL'),
  FRONTEND_URL: z.string().url().optional(),
  APP_URL: z.string().url().optional(),

  // Stripe Payment
  STRIPE_SECRET_KEY: z.string().startsWith('sk_', 'STRIPE_SECRET_KEY must start with sk_'),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_').optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').optional(),

  // SendGrid Email
  SENDGRID_API_KEY: z.string().startsWith('SG.', 'SENDGRID_API_KEY must start with SG.'),
  FROM_EMAIL: z.string().email('FROM_EMAIL must be a valid email address'),
  EMAIL_FROM: z.string().email().optional(),
  EMAIL_FROM_NAME: z.string().optional(),

  // Twilio
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_API_KEY_SID: z.string().optional(),
  TWILIO_API_KEY_SECRET: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),

  // DocuSign
  DOCUSIGN_INTEGRATION_KEY: z.string().optional(),
  DOCUSIGN_USER_ID: z.string().optional(),
  DOCUSIGN_ACCOUNT_ID: z.string().optional(),
  DOCUSIGN_PRIVATE_KEY: z.string().optional(),
  DOCUSIGN_PRIVATE_KEY_PATH: z.string().optional(),
  DOCUSIGN_BASE_URL: z.string().url().optional(),
  DOCUSIGN_AUTH_SERVER: z.string().url().optional(),
  DOCUSIGN_HMAC_KEY: z.string().optional(),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_S3_BUCKET: z.string().optional(),

  // Google Maps
  GOOGLE_MAPS_API_KEY: z.string().optional(),

  // Mapbox
  MAPBOX_ACCESS_TOKEN: z.string().optional(),

  // Blockchain
  PROPERTY_NFT_CONTRACT: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address').optional(),
  FRACTIONAL_NFT_CONTRACT: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address').optional(),
  DAO_CONTRACT: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address').optional(),
  POLYGON_RPC_URL: z.string().url().optional(),
  PRIVATE_KEY: z.string().optional(),

  // Python AI/ML Service
  PYTHON_AI_URL: z.string().url().default('http://localhost:5000'),
  AYURVEDIC_API_URL: z.string().url().optional(),
  JYOTISH_API_URL: z.string().url().optional(),
  PURANIC_API_URL: z.string().url().optional(),
  CLIMATE_API_URL: z.string().url().optional(),

  // MLS Integration
  MLS_API_KEY: z.string().optional(),
  MLS_API_URL: z.string().url().optional(),
  MLS_WEBHOOK_SECRET: z.string().optional(),

  // Webhook API Keys
  CLIMATE_WEBHOOK_API_KEY: z.string().optional(),
  IOT_WEBHOOK_API_KEY: z.string().optional(),
  PANCHANG_WEBHOOK_API_KEY: z.string().optional(),

  // Monitoring
  SENTRY_DSN: z.string().optional().refine(val => !val || val === '' || z.string().url().safeParse(val).success, {
    message: 'SENTRY_DSN must be empty or a valid URL'
  }),
  NEW_RELIC_LICENSE_KEY: z.string().optional(),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),

  // Elasticsearch
  ELASTICSEARCH_URL: z.string().url().optional(),
  ES_USERNAME: z.string().optional(),
  ES_PASSWORD: z.string().optional(),

  // Email Testing (Development)
  ETHEREAL_USER: z.string().optional(),
  ETHEREAL_PASS: z.string().optional(),

  // CDN
  CDN_URL: z.string().url().optional(),
});

// Export the validated environment variables
export type Env = z.infer<typeof envSchema>;

let env: Env;

/**
 * Validate and parse environment variables
 * This should be called once at application startup
 */
export function validateEnv(): Env {
  try {
    env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      console.error('');

      error.issues.forEach((err) => {
        const path = err.path.join('.');
        console.error(`  • ${path}: ${err.message}`);
      });

      console.error('');
      console.error('Please check your .env file and ensure all required variables are set.');
      console.error('See .env.example for reference.');

      process.exit(1);
    }
    throw error;
  }
}

/**
 * Get validated environment variables
 * Must call validateEnv() first during app startup
 */
export function getEnv(): Env {
  if (!env) {
    throw new Error('Environment not validated. Call validateEnv() during app startup.');
  }
  return env;
}

// Export individual env vars for convenience
export default env;
