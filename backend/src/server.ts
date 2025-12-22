// Dharma Realty - Main Server Entry Point
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { prisma } from './utils/prisma';
import { redisClient } from './utils/redis';
import { initializeSocketHandlers } from './websockets';

// Route imports
import authRoutes from './routes/auth';
import propertyRoutes from './routes/properties';
import vastuRoutes from './routes/vastu';
import searchRoutes from './routes/search';
import climateRoutes from './routes/climate';
import valuationRoutes from './routes/valuation';
import agentRoutes from './routes/agents';
import blockchainRoutes from './routes/blockchain';
import iotRoutes from './routes/iot';
import daoRoutes from './routes/dao';
import healthRoutes from './routes/health';

// Initialize Express app
const app: Application = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: config.frontendUrl,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Dharma Realty API',
            version: '1.0.0',
            description: 'Revolutionary Real Estate Platform with Ancient Wisdom + Cutting-Edge Tech',
            contact: {
                name: 'Dharma Realty Support',
                email: 'support@dharmarealty.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${config.port}/api/${config.apiVersion}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Trust proxy for rate limiting behind load balancer
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
    origin: [config.frontendUrl, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Compression
app.use(compression());

// Request logging
app.use(morgan('combined', {
    stream: { write: (message) => logger.http(message.trim()) },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
        success: false,
        error: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Dharma Realty API Documentation',
}));

// Health check (no auth required)
app.use('/api/health', healthRoutes);

// API Routes
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/properties', propertyRoutes);
apiRouter.use('/vastu', vastuRoutes);
apiRouter.use('/search', searchRoutes);
apiRouter.use('/climate', climateRoutes);
apiRouter.use('/valuation', valuationRoutes);
apiRouter.use('/agents', agentRoutes);
apiRouter.use('/blockchain', blockchainRoutes);
apiRouter.use('/iot', iotRoutes);
apiRouter.use('/dao', daoRoutes);

app.use(`/api/${config.apiVersion}`, apiRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Initialize Socket.IO handlers
initializeSocketHandlers(io);

// Graceful shutdown
const gracefulShutdown = async () => {
    logger.info('Received shutdown signal. Closing connections...');

    httpServer.close(() => {
        logger.info('HTTP server closed');
    });

    await prisma.$disconnect();
    logger.info('Database connection closed');

    await redisClient.quit();
    logger.info('Redis connection closed');

    process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const startServer = async () => {
    try {
        // Test database connection
        await prisma.$connect();
        logger.info('✅ Database connected');

        // Test Redis connection
        await redisClient.ping();
        logger.info('✅ Redis connected');

        // Start HTTP server
        httpServer.listen(config.port, () => {
            logger.info(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║    🙏 DHARMA REALTY PLATFORM 🙏                            ║
║                                                            ║
║    Ancient Wisdom + Cutting-Edge Technology                ║
║                                                            ║
║    Server: http://localhost:${config.port}                      ║
║    API: http://localhost:${config.port}/api/${config.apiVersion}                  ║
║    Docs: http://localhost:${config.port}/api/docs               ║
║                                                            ║
║    Environment: ${config.env}                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export { app, io };
