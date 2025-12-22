// Configuration Management
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  API_VERSION: z.string().default('v1'),
  
  // Database
  DATABASE_URL: z.string(),
  
  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
  
  // JWT
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  
  // Encryption
  ENCRYPTION_KEY: z.string(),
  
  // AWS
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_CLOUDFRONT_URL: z.string().optional(),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_DHARMA_PRICE_ID: z.string().optional(),
  STRIPE_KARMA_PRICE_ID: z.string().optional(),
  STRIPE_ENLIGHTENED_PRICE_ID: z.string().optional(),
  
  // SendGrid
  SENDGRID_API_KEY: z.string().optional(),
  SENDGRID_FROM_EMAIL: z.string().default('noreply@dharmarealty.com'),
  
  // Twilio
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  
  // Google
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_MAPS_API_KEY: z.string().optional(),
  
  // Blockchain
  POLYGON_RPC_URL: z.string().default('https://polygon-rpc.com'),
  ETHEREUM_RPC_URL: z.string().optional(),
  CONTRACT_DEPLOYER_PRIVATE_KEY: z.string().optional(),
  PROPERTY_REGISTRY_CONTRACT: z.string().optional(),
  
  // IPFS
  IPFS_PROJECT_ID: z.string().optional(),
  IPFS_PROJECT_SECRET: z.string().optional(),
  IPFS_GATEWAY: z.string().default('https://gateway.pinata.cloud/ipfs/'),
  
  // External APIs
  MATTERPORT_API_KEY: z.string().optional(),
  ZILLOW_API_KEY: z.string().optional(),
  GREAT_SCHOOLS_API_KEY: z.string().optional(),
  NOAA_API_KEY: z.string().optional(),
  PURPLEAIR_API_KEY: z.string().optional(),
  
  // OpenAI / AI
  OPENAI_API_KEY: z.string().optional(),
  
  // Frontend URL
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('âŒ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = {
  env: parsed.data.NODE_ENV,
  port: parseInt(parsed.data.PORT, 10),
  apiVersion: parsed.data.API_VERSION,
  
  database: {
    url: parsed.data.DATABASE_URL,
  },
  
  redis: {
    url: parsed.data.REDIS_URL,
  },
  
  jwt: {
    secret: parsed.data.JWT_SECRET,
    expiresIn: parsed.data.JWT_EXPIRES_IN,
    refreshSecret: parsed.data.JWT_REFRESH_SECRET,
    refreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRES_IN,
  },
  
  encryption: {
    key: parsed.data.ENCRYPTION_KEY,
  },
  
  aws: {
    accessKeyId: parsed.data.AWS_ACCESS_KEY_ID,
    secretAccessKey: parsed.data.AWS_SECRET_ACCESS_KEY,
    region: parsed.data.AWS_REGION,
    s3Bucket: parsed.data.AWS_S3_BUCKET,
    cloudfrontUrl: parsed.data.AWS_CLOUDFRONT_URL,
  },
  
  stripe: {
    secretKey: parsed.data.STRIPE_SECRET_KEY,
    webhookSecret: parsed.data.STRIPE_WEBHOOK_SECRET,
    prices: {
      dharma: parsed.data.STRIPE_DHARMA_PRICE_ID,
      karma: parsed.data.STRIPE_KARMA_PRICE_ID,
      enlightened: parsed.data.STRIPE_ENLIGHTENED_PRICE_ID,
    },
  },
  
  sendgrid: {
    apiKey: parsed.data.SENDGRID_API_KEY,
    fromEmail: parsed.data.SENDGRID_FROM_EMAIL,
  },
  
  twilio: {
    accountSid: parsed.data.TWILIO_ACCOUNT_SID,
    authToken: parsed.data.TWILIO_AUTH_TOKEN,
    phoneNumber: parsed.data.TWILIO_PHONE_NUMBER,
  },
  
  google: {
    clientId: parsed.data.GOOGLE_CLIENT_ID,
    clientSecret: parsed.data.GOOGLE_CLIENT_SECRET,
    mapsApiKey: parsed.data.GOOGLE_MAPS_API_KEY,
  },
  
  blockchain: {
    polygonRpcUrl: parsed.data.POLYGON_RPC_URL,
    ethereumRpcUrl: parsed.data.ETHEREUM_RPC_URL,
    deployerPrivateKey: parsed.data.CONTRACT_DEPLOYER_PRIVATE_KEY,
    propertyRegistryContract: parsed.data.PROPERTY_REGISTRY_CONTRACT,
  },
  
  ipfs: {
    projectId: parsed.data.IPFS_PROJECT_ID,
    projectSecret: parsed.data.IPFS_PROJECT_SECRET,
    gateway: parsed.data.IPFS_GATEWAY,
  },
  
  externalApis: {
    matterport: parsed.data.MATTERPORT_API_KEY,
    zillow: parsed.data.ZILLOW_API_KEY,
    greatSchools: parsed.data.GREAT_SCHOOLS_API_KEY,
    noaa: parsed.data.NOAA_API_KEY,
    purpleAir: parsed.data.PURPLEAIR_API_KEY,
  },
  
  openai: {
    apiKey: parsed.data.OPENAI_API_KEY,
  },
  
  frontendUrl: parsed.data.FRONTEND_URL,
  
  rateLimit: {
    windowMs: parseInt(parsed.data.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(parsed.data.RATE_LIMIT_MAX_REQUESTS, 10),
  },
};

export type Config = typeof config;
