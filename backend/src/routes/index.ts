// API Routes Index - Aggregates all route modules
// Updated: All 73 routes registered
import { Router } from 'express';

// Core Features
import healthRoutes from './health';
import authRoutes from './auth';
import propertiesRoutes from './properties';
import searchRoutes from './search';
import agentsRoutes from './agents';
import favoritesRoutes from './favorites';
import savedSearchesRoutes from './savedSearches';
import notificationsRoutes from './notifications';
import messagesRoutes from './messages';
import documentsRoutes from './documents';
import uploadsRoutes from './uploads';
import calendarRoutes from './calendar';

// Ancient Wisdom & Spiritual Analysis
import vastuRoutes from './vastu';
import astrologyRoutes from './astrology';
import fiveElementsRoutes from './fiveElements';
import numerologyRoutes from './numerology';
import sacredGeometryRoutes from './sacredGeometry';
import muhuratRoutes from './muhurat';
import spiritualAnalysisRoutes from './spiritualAnalysis';
import landEnergyRoutes from './landEnergy';

// Climate & Environment
import climateRoutes from './climate';
import airQualityRoutes from './airQuality';
import waterQualityRoutes from './waterQuality';
import noisePollutionRoutes from './noisePollution';
import emfMappingRoutes from './emfMapping';
import carbonFootprintRoutes from './carbonFootprint';
import solarPotentialRoutes from './solarPotential';
import satelliteRoutes from './satellite';
import dronePhotosRoutes from './dronePhotos';

// Blockchain & Web3
import blockchainRoutes from './blockchain';
import fractionalOwnershipRoutes from './fractionalOwnership';
import daoRoutes from './dao';
import transactionsRoutes from './transactions';
import signingRoutes from './signing';

// Smart Home & IoT
import iotRoutes from './iot';
import smartHomeRoutes from './smartHome';
import healthRoutesFull from './health.routes';
import videoRoutes from './video';
import virtualToursRoutes from './virtualTours';
import arvrViewerRoutes from './arvrViewer';
import vrArRoutes from './vrAr';

// Location & Neighborhood
import neighborhoodsRoutes from './neighborhoods';
import schoolsRoutes from './schools';
import commuteRoutes from './commute';
import crimeStatsRoutes from './crimeStats';
import accessibilityRoutes from './accessibility';
import petFriendlyRoutes from './petFriendly';
import communityRoutes from './community';

// Financial Services
import mortgageRoutes from './mortgage';
import insuranceRoutes from './insurance';
import valuationRoutes from './valuation';
import investmentRoutes from './investment';
import homeWarrantyRoutes from './homeWarranty';
import paymentsRoutes from './payments';
import subscriptionsRoutes from './subscriptions';
import renovationEstimatorRoutes from './renovationEstimator';
import negotiationRoutes from './negotiation';
import propertyHistoryRoutes from './propertyHistory';

// Agent Tools
import agentCrmRoutes from './agentCrm';
import leadsRoutes from './leads';
import showingsRoutes from './showings';
import openHousesRoutes from './openHouses';
import inspectionsRoutes from './inspections';
import reportsRoutes from './reports';
import reviewsRoutes from './reviews';

// Additional Services
import analyticsRoutes from './analytics';
import adminRoutes from './admin';
import webhooksRoutes from './webhooks';
import oauthRoutes from './oauth';
import movingServicesRoutes from './movingServices';
import aiAnalysisRoutes from './aiAnalysis';

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
        description: 'Revolutionary real estate platform combining 5,000 years of Vedic wisdom with modern technology',
        features: {
            core: 'Authentication, Properties, Search, Agents, Favorites, Messages, Documents, Calendar',
            ancientWisdom: 'Vastu Shastra, Vedic Astrology, Five Elements, Numerology, Sacred Geometry, Muhurat',
            climate: 'Climate Risk, Air Quality, Water Quality, Noise, EMF, Carbon Footprint, Solar Potential',
            blockchain: 'Property NFTs, Fractional Ownership, DAO Governance, Smart Contracts',
            iot: 'IoT Monitoring, Smart Home, Health Tracking, Video Streaming, Virtual Tours',
            location: 'Neighborhoods, Schools, Commute, Crime Stats, Accessibility, Community',
            financial: 'Mortgage Calculator, Insurance, Valuation, Investment Analysis, Payments',
            agentTools: 'CRM, Leads, Showings, Open Houses, Inspections, Reports, Reviews'
        },
        endpoints: {
            // Core
            health: '/api/v1/health',
            auth: '/api/v1/auth',
            properties: '/api/v1/properties',
            search: '/api/v1/search',
            agents: '/api/v1/agents',
            favorites: '/api/v1/favorites',
            savedSearches: '/api/v1/saved-searches',
            notifications: '/api/v1/notifications',
            messages: '/api/v1/messages',
            documents: '/api/v1/documents',
            uploads: '/api/v1/uploads',
            calendar: '/api/v1/calendar',

            // Ancient Wisdom
            vastu: '/api/v1/vastu',
            astrology: '/api/v1/astrology',
            fiveElements: '/api/v1/five-elements',
            numerology: '/api/v1/numerology',
            sacredGeometry: '/api/v1/sacred-geometry',
            muhurat: '/api/v1/muhurat',
            spiritualAnalysis: '/api/v1/spiritual-analysis',
            landEnergy: '/api/v1/land-energy',

            // Climate & Environment
            climate: '/api/v1/climate',
            airQuality: '/api/v1/air-quality',
            waterQuality: '/api/v1/water-quality',
            noisePollution: '/api/v1/noise-pollution',
            emfMapping: '/api/v1/emf-mapping',
            carbonFootprint: '/api/v1/carbon-footprint',
            solarPotential: '/api/v1/solar-potential',
            satellite: '/api/v1/satellite',
            dronePhotos: '/api/v1/drone-photos',

            // Blockchain
            blockchain: '/api/v1/blockchain',
            fractionalOwnership: '/api/v1/fractional-ownership',
            dao: '/api/v1/dao',
            transactions: '/api/v1/transactions',
            signing: '/api/v1/signing',

            // IoT & Smart Home
            iot: '/api/v1/iot',
            smartHome: '/api/v1/smart-home',
            healthTracking: '/api/v1/health-tracking',
            video: '/api/v1/video',
            virtualTours: '/api/v1/virtual-tours',
            arvrViewer: '/api/v1/arvr-viewer',
            vrAr: '/api/v1/vr-ar',

            // Location
            neighborhoods: '/api/v1/neighborhoods',
            schools: '/api/v1/schools',
            commute: '/api/v1/commute',
            crimeStats: '/api/v1/crime-stats',
            accessibility: '/api/v1/accessibility',
            petFriendly: '/api/v1/pet-friendly',
            community: '/api/v1/community',

            // Financial
            mortgage: '/api/v1/mortgage',
            insurance: '/api/v1/insurance',
            valuation: '/api/v1/valuation',
            investment: '/api/v1/investment',
            homeWarranty: '/api/v1/home-warranty',
            payments: '/api/v1/payments',
            subscriptions: '/api/v1/subscriptions',
            renovationEstimator: '/api/v1/renovation-estimator',
            negotiation: '/api/v1/negotiation',
            propertyHistory: '/api/v1/property-history',

            // Agent Tools
            agentCrm: '/api/v1/agent-crm',
            leads: '/api/v1/leads',
            showings: '/api/v1/showings',
            openHouses: '/api/v1/open-houses',
            inspections: '/api/v1/inspections',
            reports: '/api/v1/reports',
            reviews: '/api/v1/reviews',

            // Additional
            analytics: '/api/v1/analytics',
            admin: '/api/v1/admin',
            webhooks: '/api/v1/webhooks',
            oauth: '/api/v1/oauth',
            movingServices: '/api/v1/moving-services',
            aiAnalysis: '/api/v1/ai-analysis'
        },
        documentation: '/api/docs',
        totalEndpoints: '439+',
        status: 'operational'
    });
});

// Mount Core Routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/properties', propertiesRoutes);
router.use('/search', searchRoutes);
router.use('/agents', agentsRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/saved-searches', savedSearchesRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/messages', messagesRoutes);
router.use('/documents', documentsRoutes);
router.use('/uploads', uploadsRoutes);
router.use('/calendar', calendarRoutes);

// Mount Ancient Wisdom Routes
router.use('/vastu', vastuRoutes);
router.use('/astrology', astrologyRoutes);
router.use('/five-elements', fiveElementsRoutes);
router.use('/numerology', numerologyRoutes);
router.use('/sacred-geometry', sacredGeometryRoutes);
router.use('/muhurat', muhuratRoutes);
router.use('/spiritual-analysis', spiritualAnalysisRoutes);
router.use('/land-energy', landEnergyRoutes);

// Mount Climate & Environment Routes
router.use('/climate', climateRoutes);
router.use('/air-quality', airQualityRoutes);
router.use('/water-quality', waterQualityRoutes);
router.use('/noise-pollution', noisePollutionRoutes);
router.use('/emf-mapping', emfMappingRoutes);
router.use('/carbon-footprint', carbonFootprintRoutes);
router.use('/solar-potential', solarPotentialRoutes);
router.use('/satellite', satelliteRoutes);
router.use('/drone-photos', dronePhotosRoutes);

// Mount Blockchain & Web3 Routes
router.use('/blockchain', blockchainRoutes);
router.use('/fractional-ownership', fractionalOwnershipRoutes);
router.use('/dao', daoRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/signing', signingRoutes);

// Mount Smart Home & IoT Routes
router.use('/iot', iotRoutes);
router.use('/smart-home', smartHomeRoutes);
router.use('/health-tracking', healthRoutesFull);
router.use('/video', videoRoutes);
router.use('/virtual-tours', virtualToursRoutes);
router.use('/arvr-viewer', arvrViewerRoutes);
router.use('/vr-ar', vrArRoutes);

// Mount Location & Neighborhood Routes
router.use('/neighborhoods', neighborhoodsRoutes);
router.use('/schools', schoolsRoutes);
router.use('/commute', commuteRoutes);
router.use('/crime-stats', crimeStatsRoutes);
router.use('/accessibility', accessibilityRoutes);
router.use('/pet-friendly', petFriendlyRoutes);
router.use('/community', communityRoutes);

// Mount Financial Services Routes
router.use('/mortgage', mortgageRoutes);
router.use('/insurance', insuranceRoutes);
router.use('/valuation', valuationRoutes);
router.use('/investment', investmentRoutes);
router.use('/home-warranty', homeWarrantyRoutes);
router.use('/payments', paymentsRoutes);
router.use('/subscriptions', subscriptionsRoutes);
router.use('/renovation-estimator', renovationEstimatorRoutes);
router.use('/negotiation', negotiationRoutes);
router.use('/property-history', propertyHistoryRoutes);

// Mount Agent Tools Routes
router.use('/agent-crm', agentCrmRoutes);
router.use('/leads', leadsRoutes);
router.use('/showings', showingsRoutes);
router.use('/open-houses', openHousesRoutes);
router.use('/inspections', inspectionsRoutes);
router.use('/reports', reportsRoutes);
router.use('/reviews', reviewsRoutes);

// Mount Additional Services Routes
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);
router.use('/webhooks', webhooksRoutes);
router.use('/oauth', oauthRoutes);
router.use('/moving-services', movingServicesRoutes);
router.use('/ai-analysis', aiAnalysisRoutes);

export default router;
