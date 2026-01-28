import { z } from 'zod';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Environment schema validation
const envSchema = z.object({
    // App
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3001'),
    APP_NAME: z.string().default('CHECK24M'),
    BASE_URL: z.string().default('https://check24m.com'),
    API_URL: z.string().default('http://localhost:3001'),

    // Database
    DATABASE_URL: z.string().optional().default(''),

    // JWT
    JWT_SECRET: z.string().default('dev-jwt-secret-key-minimum-32-characters-long'),
    JWT_REFRESH_SECRET: z.string().default('dev-refresh-secret-key-minimum-32-chars'),
    JWT_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

    // CORS
    CORS_ORIGINS: z.string().default('http://localhost:3000'),

    // Rate Limit
    RATE_LIMIT_WINDOW_MS: z.string().default('60000'),
    RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),

    // Betflix API
    BETFLIX_API_URL: z.string().optional(),
    BETFLIX_API_CAT: z.string().optional(),
    BETFLIX_API_KEY: z.string().optional(),
    BETFLIX_PREFIX: z.string().optional(),
    BETFLIX_GAME_ENTRANCE: z.string().optional(),

    // Nexus API
    NEXUS_API_URL: z.string().optional(),
    NEXUS_AGENT_CODE: z.string().optional(),
    NEXUS_AGENT_TOKEN: z.string().optional(),

    // BIBPay
    BIBPAY_API_URL: z.string().optional(),
    BIBPAY_API_KEY: z.string().optional(),
    BIBPAY_API_SECRET: z.string().optional(),

    // Telegram
    TELEGRAM_BOT_TOKEN: z.string().optional(),
    TELEGRAM_CHAT_ID: z.string().optional(),

    // Logging
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Parse and validate
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = parsed.data;

// Derived values
export const isDev = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
