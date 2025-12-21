import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// PROPERTY ANALYTICS
// ============================================
router.get('/property/:propertyId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { propertyId } = req.params;
        const { period } = req.query;

        res.json({
            propertyId,
            period: period || 'last_30_days',
            views: {
                total: 1245,
                unique: 892,
                trend: '+12% vs previous period',
                bySource: {
                    search: 45,
                    direct: 25,
                    social: 15,
                    email: 10,
                    other: 5
                }
            },
            engagement: {
                favorites: 34,
                shares: 12,
                inquiries: 8,
                scheduledTours: 5,
                avgTimeOnPage: '2m 34s'
            },
            demographics: {
                ageGroups: { '25-34': 35, '35-44': 40, '45-54': 15, '55+': 10 },
                locations: { 'Same city': 60, 'Same state': 25, 'Out of state': 15 }
            },
            comparisons: {
                vsMarketAvg: '+18% more views',
                vsSimilarListings: '+8% engagement',
                ranking: '#5 in neighborhood'
            }
        });
    } catch (error) {
        console.error('Property analytics error:', error);
        res.status(500).json({ error: 'Failed to get analytics' });
    }
});

// ============================================
// MARKET ANALYTICS
// ============================================
router.get('/market/:location', async (req: Request, res: Response) => {
    try {
        const { location } = req.params;
        const { period } = req.query;

        res.json({
            location,
            period: period || 'last_12_months',
            priceStats: {
                medianPrice: 585000,
                avgPrice: 612000,
                pricePerSqFt: 325,
                yoyChange: '+5.2%',
                momChange: '+0.8%'
            },
            inventory: {
                activeListings: 245,
                newListings: 42,
                soldLastMonth: 38,
                monthsOfInventory: 2.8,
                trend: 'Seller\'s market'
            },
            daysOnMarket: {
                median: 28,
                average: 35,
                trend: '-5 days vs previous year'
            },
            saleTolList: {
                ratio: 98.5,
                trend: 'Stable'
            },
            forecast: {
                next3Months: '+1.5% expected',
                next12Months: '+4-6% expected',
                confidence: 'Medium'
            },
            topNeighborhoods: [
                { name: 'Downtown', medianPrice: 725000, change: '+8%' },
                { name: 'Westside', medianPrice: 550000, change: '+4%' },
                { name: 'Eastside', medianPrice: 485000, change: '+6%' }
            ]
        });
    } catch (error) {
        console.error('Market analytics error:', error);
        res.status(500).json({ error: 'Failed to get market analytics' });
    }
});

// ============================================
// AGENT PERFORMANCE
// ============================================
router.get('/agent/:agentId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { agentId } = req.params;
        const { period } = req.query;

        res.json({
            agentId,
            period: period || 'ytd',
            sales: {
                closed: 18,
                pending: 4,
                totalVolume: 12500000,
                avgSalePrice: 695000,
                listToSaleRatio: 97.8
            },
            listings: {
                active: 8,
                sold: 15,
                expired: 1,
                avgDaysOnMarket: 24
            },
            clients: {
                active: 12,
                closedThisPeriod: 18,
                referrals: 6,
                repeatClients: 4
            },
            performance: {
                responseTime: '1.2 hours avg',
                rating: 4.9,
                reviews: 42,
                rank: '#3 in office'
            },
            goals: {
                annualTarget: 25,
                progress: 72,
                onTrack: true
            },
            activities: {
                showings: 85,
                openHouses: 12,
                clientMeetings: 45,
                callsMade: 320
            }
        });
    } catch (error) {
        console.error('Agent analytics error:', error);
        res.status(500).json({ error: 'Failed to get agent analytics' });
    }
});

// ============================================
// SEARCH ANALYTICS
// ============================================
router.get('/search-trends', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            topSearches: [
                { term: '3 bedroom house', count: 1250, trend: '+15%' },
                { term: 'downtown condo', count: 980, trend: '+8%' },
                { term: 'pool home', count: 720, trend: '+22%' },
                { term: 'new construction', count: 650, trend: '+5%' },
                { term: 'waterfront', count: 520, trend: '+12%' }
            ],
            popularFilters: {
                priceRange: '$400k-$600k',
                beds: 3,
                propertyType: 'Single Family',
                features: ['Pool', 'Garage', 'Updated Kitchen']
            },
            searchVolume: {
                today: 2450,
                thisWeek: 15600,
                thisMonth: 62000,
                trend: '+8% vs last month'
            },
            conversionFunnel: {
                searches: 62000,
                propertyViews: 31000,
                favorites: 4500,
                inquiries: 1200,
                tours: 450,
                offers: 180
            }
        });
    } catch (error) {
        console.error('Search analytics error:', error);
        res.status(500).json({ error: 'Failed to get search analytics' });
    }
});

// ============================================
// DASHBOARD OVERVIEW
// ============================================
router.get('/dashboard', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            summary: {
                activeListings: 245,
                pendingSales: 32,
                closedThisMonth: 28,
                totalAgents: 45
            },
            recentActivity: [
                { type: 'sale', description: '123 Main St closed', amount: 525000, time: '2 hours ago' },
                { type: 'listing', description: 'New listing: 456 Oak Ave', price: 650000, time: '4 hours ago' },
                { type: 'price_change', description: '789 Elm Rd price reduced', change: -15000, time: '6 hours ago' }
            ],
            topPerformers: [
                { name: 'Jane Smith', sales: 5, volume: 3200000 },
                { name: 'John Doe', sales: 4, volume: 2800000 },
                { name: 'Sarah Johnson', sales: 4, volume: 2650000 }
            ],
            alerts: [
                { type: 'warning', message: '3 listings expiring this week' },
                { type: 'info', message: '5 new leads assigned today' }
            ]
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to get dashboard' });
    }
});

export default router;
