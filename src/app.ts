import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env, isDev } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { requestLogger, logger } from './utils/logger';
import { generalLimiter, errorHandler, notFoundHandler } from './middleware';
import routes from './routes';

// Create Express app
const app: Express = express();

// ============================================
// Middleware
// ============================================

// Security headers
app.use(helmet());

// CORS
const corsOrigins = env.CORS_ORIGINS.split(',').map(origin => origin.trim());
app.use(cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Rate limiting (global)
app.use('/api', generalLimiter);

// ============================================
// Routes
// ============================================

// API routes
app.use('/api', routes);

// ============================================
// Error Handling
// ============================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================
// Server Startup
// ============================================

const PORT = parseInt(env.PORT);

async function startServer() {
    try {
        // Connect to database
        await connectDatabase();

        // Start server
        app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT}`);
            logger.info(`📍 Environment: ${env.NODE_ENV}`);
            logger.info(`🔗 API URL: ${env.API_URL}`);

            if (isDev) {
                logger.info(`📚 Health: http://localhost:${PORT}/api/health`);
            }
        });
    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
async function gracefulShutdown(signal: string) {
    logger.info(`\n${signal} received. Shutting down gracefully...`);
    await disconnectDatabase();
    process.exit(0);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
startServer();

export default app;
