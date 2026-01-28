import { PrismaClient } from '@prisma/client';
import { env, isDev } from './env';

// Create Prisma client instance  
const prisma = new PrismaClient({
    log: isDev ? ['query', 'info', 'warn', 'error'] : ['error'],
    datasources: {
        db: {
            url: env.DATABASE_URL,
        },
    },
});

// Connection test
export async function connectDatabase(): Promise<void> {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

// Graceful disconnect
export async function disconnectDatabase(): Promise<void> {
    await prisma.$disconnect();
    console.log('📦 Database disconnected');
}

export { prisma };
export default prisma;
