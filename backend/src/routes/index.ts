// API Routes Index - Aggregates all route modules
import { Router } from 'express';

// Import all route modules
import healthRoutes from './health';
import authRoutes from './auth';
import propertiesRoutes from './properties';
import vastuRoutes from './vastu';
import searchRoutes from './search';
import climateRoutes from './climate';
import valuationRoutes from './valuation';
import agentsRoutes from './agents';
import blockchainRoutes from './blockchain';
import iotRoutes from './iot';
import daoRoutes from './dao';
import muhuratRoutes from './muhurat';
import spiritualAnalysisRoutes from './spiritualAnalysis';
import astrologyRoutes from './astrology';

const router = Router();

/**
 * @swagger
 * /api/v1:
 *   get:
 *     summary: API Root
 *     description: Returns API information and available endpoints
 */
router.get('/', (req, res) => {
    res.json({
        name: 'REST-iN-U API',
        version: '1.0.0',
        description: 'Vedic-aligned real estate platform API',
        endpoints: {
            health: '/api/v1/health',
            auth: '/api/v1/auth',
            properties: '/api/v1/properties',
            vastu: '/api/v1/vastu',
            search: '/api/v1/search',
            climate: '/api/v1/climate',
            valuation: '/api/v1/valuation',
            agents: '/api/v1/agents',
            blockchain: '/api/v1/blockchain',
            iot: '/api/v1/iot',
            dao: '/api/v1/dao',
            muhurat: '/api/v1/muhurat',
            fengShui: '/api/v1/fengshui',
            sacredGeometry: '/api/v1/sacred-geometry',
            landEnergy: '/api/v1/land-energy',
            astrology: '/api/v1/astrology',
        },
        documentation: '/api/docs',
    });
});

// Mount route modules
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/properties', propertiesRoutes);
router.use('/vastu', vastuRoutes);
router.use('/search', searchRoutes);
router.use('/climate', climateRoutes);
router.use('/valuation', valuationRoutes);
router.use('/agents', agentsRoutes);
router.use('/blockchain', blockchainRoutes);
router.use('/iot', iotRoutes);
router.use('/dao', daoRoutes);
router.use('/muhurat', muhuratRoutes);
router.use('/astrology', astrologyRoutes);

// Spiritual analysis routes (includes Feng Shui, Sacred Geometry, Land Energy)
router.use('/', spiritualAnalysisRoutes);

export default router;

