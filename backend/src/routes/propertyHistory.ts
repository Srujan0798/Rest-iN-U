import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET PROPERTY HISTORY
// ============================================
router.get('/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        res.json({
            propertyId,
            address: `${property.street}, ${property.city}, ${property.state} ${property.zipCode}`,
            history: generatePropertyHistory(property),
            timeline: generateTimeline(property),
            publicRecords: getPublicRecords(property),
            marketHistory: getMarketHistory(property)
        });
    } catch (error) {
        console.error('Property history error:', error);
        res.status(500).json({ error: 'Failed to get history' });
    }
});

function generatePropertyHistory(property: any): any {
    const yearBuilt = property.yearBuilt || 1990;

    return {
        construction: {
            yearBuilt,
            builder: 'Original Developer LLC',
            originalOwner: 'Residential Trust'
        },
        ownershipHistory: [
            {
                owner: 'Smith Family Trust',
                purchaseDate: '2018-06-15',
                purchasePrice: 450000,
                saleDate: '2023-03-20',
                salePrice: 620000,
                holdingPeriod: '4 years, 9 months'
            },
            {
                owner: 'Johnson, Michael & Sarah',
                purchaseDate: '2010-09-01',
                purchasePrice: 320000,
                saleDate: '2018-06-15',
                salePrice: 450000,
                holdingPeriod: '7 years, 9 months'
            },
            {
                owner: 'Williams, Robert',
                purchaseDate: '2002-04-22',
                purchasePrice: 185000,
                saleDate: '2010-09-01',
                salePrice: 320000,
                holdingPeriod: '8 years, 5 months'
            }
        ],
        totalOwners: 4,
        averageHoldingPeriod: '6.9 years',
        priceAppreciationHistory: [
            { year: 2002, price: 185000 },
            { year: 2010, price: 320000 },
            { year: 2018, price: 450000 },
            { year: 2023, price: 620000 }
        ]
    };
}

function generateTimeline(property: any): any[] {
    return [
        { date: '2023-03-20', event: 'Sold', details: 'Sold for $620,000', type: 'sale' },
        { date: '2022-11-15', event: 'Listed for sale', details: 'Listed at $649,000', type: 'listing' },
        { date: '2021-08-10', event: 'Renovation', details: 'Kitchen remodel completed', type: 'improvement' },
        { date: '2020-06-01', event: 'Permit', details: 'Building permit for deck addition', type: 'permit' },
        { date: '2019-03-15', event: 'Refinance', details: 'Refinanced mortgage', type: 'financial' },
        { date: '2018-06-15', event: 'Sold', details: 'Sold for $450,000', type: 'sale' },
        { date: '2015-09-20', event: 'Renovation', details: 'Bathroom update', type: 'improvement' },
        { date: '2010-09-01', event: 'Sold', details: 'Sold for $320,000', type: 'sale' }
    ];
}

function getPublicRecords(property: any): any {
    return {
        tax: {
            assessedValue: 550000,
            landValue: 200000,
            improvementValue: 350000,
            annualTax: 6600,
            lastAssessment: '2023'
        },
        permits: [
            { date: '2021-07', type: 'Building', description: 'Kitchen remodel', status: 'Closed', cost: 45000 },
            { date: '2020-06', type: 'Building', description: 'Deck addition', status: 'Closed', cost: 12000 },
            { date: '2015-08', type: 'Plumbing', description: 'Bathroom renovation', status: 'Closed', cost: 8000 }
        ],
        liens: [],
        violations: [],
        zoning: {
            current: 'R-1 (Single Family Residential)',
            allowedUses: ['Single family home', 'Accessory dwelling unit (ADU)'],
            restrictions: 'No commercial use'
        }
    };
}

function getMarketHistory(property: any): any {
    return {
        listingHistory: [
            {
                date: '2022-11-15',
                listPrice: 649000,
                daysOnMarket: 126,
                priceChanges: [
                    { date: '2023-01-10', price: 635000 },
                    { date: '2023-02-20', price: 625000 }
                ],
                salePrice: 620000,
                closeDate: '2023-03-20'
            },
            {
                date: '2018-04-01',
                listPrice: 465000,
                daysOnMarket: 75,
                priceChanges: [],
                salePrice: 450000,
                closeDate: '2018-06-15'
            }
        ],
        rentalHistory: [
            { period: '2019-2020', monthlyRent: 2800 },
            { period: '2012-2015', monthlyRent: 1800 }
        ],
        comparableHistory: {
            neighborhoodAvg2023: 580000,
            neighborhoodAvg2018: 420000,
            pricePerSqFt2023: 310,
            pricePerSqFt2018: 225
        }
    };
}

// ============================================
// GET NEARBY SOLD PROPERTIES
// ============================================
router.get('/sales/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;
        const { months } = req.query;

        res.json({
            propertyId,
            period: `Last ${months || 12} months`,
            recentSales: [
                {
                    address: '123 Nearby St',
                    distance: '0.1 mi',
                    saleDate: '2024-01-10',
                    salePrice: 595000,
                    beds: 3,
                    baths: 2,
                    sqft: 1800,
                    pricePerSqFt: 331
                },
                {
                    address: '456 Adjacent Ave',
                    distance: '0.2 mi',
                    saleDate: '2023-12-05',
                    salePrice: 640000,
                    beds: 4,
                    baths: 2.5,
                    sqft: 2100,
                    pricePerSqFt: 305
                },
                {
                    address: '789 Parallel Ln',
                    distance: '0.3 mi',
                    saleDate: '2023-11-20',
                    salePrice: 550000,
                    beds: 3,
                    baths: 2,
                    sqft: 1650,
                    pricePerSqFt: 333
                }
            ],
            summary: {
                totalSales: 15,
                avgSalePrice: 598000,
                medianSalePrice: 595000,
                avgPricePerSqFt: 318,
                avgDaysOnMarket: 42
            }
        });
    } catch (error) {
        console.error('Sales history error:', error);
        res.status(500).json({ error: 'Failed to get sales' });
    }
});

// ============================================
// PRICE HISTORY CHART DATA
// ============================================
router.get('/price-chart/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        res.json({
            propertyId,
            chartData: {
                property: [
                    { year: 2002, value: 185000 },
                    { year: 2005, value: 250000 },
                    { year: 2008, value: 280000 },
                    { year: 2010, value: 320000 },
                    { year: 2013, value: 360000 },
                    { year: 2015, value: 400000 },
                    { year: 2018, value: 450000 },
                    { year: 2020, value: 520000 },
                    { year: 2023, value: 620000 }
                ],
                neighborhood: [
                    { year: 2002, value: 175000 },
                    { year: 2005, value: 230000 },
                    { year: 2008, value: 260000 },
                    { year: 2010, value: 280000 },
                    { year: 2013, value: 320000 },
                    { year: 2015, value: 360000 },
                    { year: 2018, value: 420000 },
                    { year: 2020, value: 480000 },
                    { year: 2023, value: 580000 }
                ],
                city: [
                    { year: 2002, value: 190000 },
                    { year: 2005, value: 245000 },
                    { year: 2008, value: 270000 },
                    { year: 2010, value: 285000 },
                    { year: 2013, value: 330000 },
                    { year: 2015, value: 380000 },
                    { year: 2018, value: 440000 },
                    { year: 2020, value: 500000 },
                    { year: 2023, value: 600000 }
                ]
            },
            appreciation: {
                totalAppreciation: '235%',
                annualizedReturn: '5.9%',
                vsNeighborhood: '+6.9%',
                vsCity: '+3.3%'
            }
        });
    } catch (error) {
        console.error('Price chart error:', error);
        res.status(500).json({ error: 'Failed to get price chart' });
    }
});

// ============================================
// DISCLOSURE DOCUMENTS
// ============================================
router.get('/disclosures/:propertyId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { propertyId } = req.params;

        res.json({
            propertyId,
            disclosures: [
                {
                    type: 'Seller Disclosure',
                    date: '2022-11-01',
                    items: [
                        { category: 'Structure', issue: 'None disclosed' },
                        { category: 'Roof', issue: 'Replaced 2020' },
                        { category: 'Plumbing', issue: 'Repiped 2015' },
                        { category: 'HVAC', issue: 'New AC 2021' },
                        { category: 'Known defects', issue: 'Minor settling crack in garage' }
                    ]
                },
                {
                    type: 'Natural Hazard Disclosure',
                    date: '2022-11-01',
                    items: [
                        { hazard: 'Flood Zone', status: 'Not in flood zone' },
                        { hazard: 'Fire Zone', status: 'Moderate risk area' },
                        { hazard: 'Earthquake Fault', status: 'Not near known fault' },
                        { hazard: 'Landslide', status: 'Low risk' }
                    ]
                },
                {
                    type: 'HOA Documents',
                    date: '2022-11-05',
                    available: true,
                    documents: ['CC&Rs', 'Bylaws', 'Financial statements', 'Meeting minutes']
                }
            ]
        });
    } catch (error) {
        console.error('Disclosures error:', error);
        res.status(500).json({ error: 'Failed to get disclosures' });
    }
});

export default router;
