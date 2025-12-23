// Rest-iN-U - Main Server Entry Point
import express, { Application, Request, Response, NextFunction } from 'express';
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
import { initializeWebSocket } from './socket';

// Route imports
import authRoutes from './routes/auth';
// import userRoutes from './routes/users'; // Excluded due to schema mismatch
import propertyRoutes from './routes/properties';
import searchRoutes from './routes/search';
import agentRoutes from './routes/agents';
import leadRoutes from './routes/leads';
import vastuRoutes from './routes/vastu';
import climateRoutes from './routes/climate';
import blockchainRoutes from './routes/blockchain';
// import valuationRoutes from './routes/valuation'; // Excluded due to schema mismatch
import savedSearchRoutes from './routes/savedSearches';
import favoriteRoutes from './routes/favorites';
import messageRoutes from './routes/messages';
import notificationRoutes from './routes/notifications';
// import subscriptionRoutes from './routes/subscriptions'; // Excluded due to schema mismatch
// import uploadRoutes from './routes/uploads'; // Excluded due to schema mismatch
import astrologyRoutes from './routes/astrology';
import daoRoutes from './routes/dao';
// import analyticsRoutes from './routes/analytics'; // Excluded due to schema mismatch
// import webhookRoutes from './routes/webhooks'; // Excluded due to schema mismatch
import healthRoutes from './routes/health';

// Initialize Express app
const app: Application = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = initializeWebSocket(httpServer);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rest-iN-U API',
      version: '1.0.0',
      description: 'Revolutionary Real Estate Platform with Ancient Wisdom + Cutting-Edge Tech',
      contact: {
        name: 'Rest-iN-U Support',
        email: 'support@rest-in-u.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/${config.apiVersion}`,
        description: 'Development server',
      },
      {
        url: `https://api.rest-in-u.com/api/${config.apiVersion}`,
        description: 'Production server',
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
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
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

// Body parsing - exclude webhooks from JSON parsing
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Rest-iN-U API Documentation',
}));

// Health check (no auth required)
app.use('/api/health', healthRoutes);

// Webhooks (no auth, raw body) - Temporarily disabled due to schema mismatch
// app.use('/api/webhooks', webhookRoutes);

// API Routes
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
// apiRouter.use('/users', userRoutes); // Excluded due to schema mismatch
apiRouter.use('/properties', propertyRoutes);
apiRouter.use('/search', searchRoutes);
apiRouter.use('/agents', agentRoutes);
apiRouter.use('/leads', leadRoutes);
apiRouter.use('/vastu', vastuRoutes);
apiRouter.use('/climate', climateRoutes);
apiRouter.use('/blockchain', blockchainRoutes);
// apiRouter.use('/valuation', valuationRoutes); // Excluded due to schema mismatch
apiRouter.use('/saved-searches', savedSearchRoutes);
apiRouter.use('/favorites', favoriteRoutes);
apiRouter.use('/messages', messageRoutes);
apiRouter.use('/notifications', notificationRoutes);
// apiRouter.use('/subscriptions', subscriptionRoutes); // Excluded due to schema mismatch
// apiRouter.use('/uploads', uploadRoutes); // Excluded due to schema mismatch
apiRouter.use('/astrology', astrologyRoutes);
apiRouter.use('/dao', daoRoutes);
// apiRouter.use('/analytics', analyticsRoutes); // Excluded due to schema mismatch

app.use(`/api/${config.apiVersion}`, apiRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Initialize Socket.IO handlers
// initializeSocketHandlers(io); // Removed as it is initialized in the io creation

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info('Received shutdown signal. Closing connections...');

  // Close HTTP server
  httpServer.close(() => {
    logger.info('HTTP server closed');
  });

  // Close database connection
  await prisma.$disconnect();
  logger.info('Database connection closed');

  // Close Redis connection
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
    logger.info('âœ… Database connected');

    // Test Redis connection
    await redisClient.ping();
    logger.info('âœ… Redis connected');

    // Start HTTP server
    httpServer.listen(config.port, () => {
      logger.info(`
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘                                                            â•‘
â•‘    ðŸ™ DHARMA REALTY PLATFORM ðŸ™                            â•‘
â•‘                                                            â•‘
â•‘    Ancient Wisdom + Cutting-Edge Technology                â•‘
â•‘                                                            â•‘
â•‘    Server: http://localhost:${config.port}                      â•‘
â•‘    API: http://localhost:${config.port}/api/${config.apiVersion}                  â•‘
â•‘    Docs: http://localhost:${config.port}/api/docs               â•‘
â•‘                                                            â•‘
â•‘    Environment: ${config.env}                          â•‘
â•‘                                                            â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      `);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, io };

