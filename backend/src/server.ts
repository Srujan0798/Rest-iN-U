import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import propertiesRoutes from './routes/properties.js';
import leadsRoutes from './routes/leads.js';
import agentsRoutes from './routes/agents.js';
import savedSearchesRoutes from './routes/savedSearches.js';
import favoritesRoutes from './routes/favorites.js';
import valuationRoutes from './routes/valuation.js';
import messagesRoutes from './routes/messages.js';
import neighborhoodsRoutes from './routes/neighborhoods.js';
import openHousesRoutes from './routes/openHouses.js';
import vastuRoutes from './routes/vastu.js';
import climateRoutes from './routes/climate.js';
import iotRoutes from './routes/iot.js';
import blockchainRoutes from './routes/blockchain.js';
import investmentRoutes from './routes/investment.js';
import vrArRoutes from './routes/vrAr.js';
import oauthRoutes from './routes/oauth.js';
import paymentsRoutes from './routes/payments.js';
import virtualToursRoutes from './routes/virtualTours.js';
import numerologyRoutes from './routes/numerology.js';
import dronePhotosRoutes from './routes/dronePhotos.js';
import negotiationRoutes from './routes/negotiation.js';
import fiveElementsRoutes from './routes/fiveElements.js';
import muhuratRoutes from './routes/muhurat.js';
import smartHomeRoutes from './routes/smartHome.js';
import satelliteRoutes from './routes/satellite.js';
import carbonFootprintRoutes from './routes/carbonFootprint.js';
import sacredGeometryRoutes from './routes/sacredGeometry.js';
import emfMappingRoutes from './routes/emfMapping.js';
import noisePollutionRoutes from './routes/noisePollution.js';
import aiAnalysisRoutes from './routes/aiAnalysis.js';
import waterQualityRoutes from './routes/waterQuality.js';
import airQualityRoutes from './routes/airQuality.js';
import landEnergyRoutes from './routes/landEnergy.js';
import communityRoutes from './routes/community.js';
import mortgageRoutes from './routes/mortgage.js';
import schoolsRoutes from './routes/schools.js';
import crimeStatsRoutes from './routes/crimeStats.js';
import commuteRoutes from './routes/commute.js';
import petFriendlyRoutes from './routes/petFriendly.js';
import accessibilityRoutes from './routes/accessibility.js';
import solarPotentialRoutes from './routes/solarPotential.js';
import insuranceRoutes from './routes/insurance.js';
import movingServicesRoutes from './routes/movingServices.js';
import homeWarrantyRoutes from './routes/homeWarranty.js';
import arvrViewerRoutes from './routes/arvrViewer.js';
import fractionalOwnershipRoutes from './routes/fractionalOwnership.js';
import renovationEstimatorRoutes from './routes/renovationEstimator.js';
import homeMaintenanceRoutes from './routes/homeMaintenance.js';
import propertyHistoryRoutes from './routes/propertyHistory.js';
import documentsRoutes from './routes/documents.js';
import notificationsRoutes from './routes/notifications.js';
import analyticsRoutes from './routes/analytics.js';
import agentCrmRoutes from './routes/agentCrm.js';
import calendarRoutes from './routes/calendar.js';
import showingsRoutes from './routes/showings.js';
import reportsRoutes from './routes/reports.js';
import transactionsRoutes from './routes/transactions.js';
import adminRoutes from './routes/admin.js';
import reviewsRoutes from './routes/reviews.js';

const app: Express = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE
// ============================================

// Security
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertiesRoutes);
app.use('/api/v1/leads', leadsRoutes);
app.use('/api/v1/agents', agentsRoutes);
app.use('/api/v1/saved-searches', savedSearchesRoutes);
app.use('/api/v1/favorites', favoritesRoutes);
app.use('/api/v1/valuation', valuationRoutes);
app.use('/api/v1/messages', messagesRoutes);
app.use('/api/v1/neighborhoods', neighborhoodsRoutes);
app.use('/api/v1/open-houses', openHousesRoutes);
app.use('/api/v1/vastu', vastuRoutes);
app.use('/api/v1/climate', climateRoutes);
app.use('/api/v1/iot', iotRoutes);
app.use('/api/v1/blockchain', blockchainRoutes);
app.use('/api/v1/investment', investmentRoutes);
app.use('/api/v1/vr-ar', vrArRoutes);
app.use('/api/v1/auth/oauth', oauthRoutes);
app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/v1/virtual-tours', virtualToursRoutes);
app.use('/api/v1/numerology', numerologyRoutes);
app.use('/api/v1/drone-photos', dronePhotosRoutes);
app.use('/api/v1/negotiation', negotiationRoutes);
app.use('/api/v1/five-elements', fiveElementsRoutes);
app.use('/api/v1/muhurat', muhuratRoutes);
app.use('/api/v1/smart-home', smartHomeRoutes);
app.use('/api/v1/satellite', satelliteRoutes);
app.use('/api/v1/carbon-footprint', carbonFootprintRoutes);
app.use('/api/v1/sacred-geometry', sacredGeometryRoutes);
app.use('/api/v1/emf', emfMappingRoutes);
app.use('/api/v1/noise', noisePollutionRoutes);
app.use('/api/v1/ai-analysis', aiAnalysisRoutes);
app.use('/api/v1/water-quality', waterQualityRoutes);
app.use('/api/v1/air-quality', airQualityRoutes);
app.use('/api/v1/land-energy', landEnergyRoutes);
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1/mortgage', mortgageRoutes);
app.use('/api/v1/schools', schoolsRoutes);
app.use('/api/v1/crime', crimeStatsRoutes);
app.use('/api/v1/commute', commuteRoutes);
app.use('/api/v1/pet-friendly', petFriendlyRoutes);
app.use('/api/v1/accessibility', accessibilityRoutes);
app.use('/api/v1/solar', solarPotentialRoutes);
app.use('/api/v1/insurance', insuranceRoutes);
app.use('/api/v1/moving', movingServicesRoutes);
app.use('/api/v1/warranty', homeWarrantyRoutes);
app.use('/api/v1/arvr', arvrViewerRoutes);
app.use('/api/v1/fractional', fractionalOwnershipRoutes);
app.use('/api/v1/renovation', renovationEstimatorRoutes);
app.use('/api/v1/maintenance', homeMaintenanceRoutes);
app.use('/api/v1/history', propertyHistoryRoutes);
app.use('/api/v1/documents', documentsRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/crm', agentCrmRoutes);
app.use('/api/v1/calendar', calendarRoutes);
app.use('/api/v1/showings', showingsRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/transactions', transactionsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/reviews', reviewsRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    console.error(err.stack);

    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════╗
  ║     Rest-iN-U API Server                  ║
  ║     Running on http://localhost:${PORT}      ║
  ╚═══════════════════════════════════════════╝
  `);
});

export default app;
