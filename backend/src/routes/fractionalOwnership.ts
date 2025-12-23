import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET FRACTIONAL OWNERSHIP OPPORTUNITIES
// ============================================
router.get('/opportunities', async (req: Request, res: Response) => {
    try {
        const { minInvestment, maxInvestment, propertyType } = req.query;

        const opportunities = [
            {
                id: 'frac_1',
                propertyId: 'prop_123',
                propertyName: 'Luxury Beach Condo - Miami',
                propertyType: 'condo',
                location: 'Miami Beach, FL',
                totalValue: 2500000,
                sharesAvailable: 25,
                totalShares: 100,
                pricePerShare: 25000,
                minShares: 1,
                maxShares: 10,
                projectedROI: '8-12% annually',
                rentalIncome: true,
                monthlyRentalEstimate: 8500,
                managementFee: '10% of rental income',
                benefits: ['Usage rights (4 weeks/share/year)', 'Rental income', 'Appreciation'],
                documents: ['Prospectus', 'Operating Agreement', 'Property Appraisal']
            },
            {
                id: 'frac_2',
                propertyId: 'prop_456',
                propertyName: 'Mountain Retreat Cabin',
                propertyType: 'cabin',
                location: 'Aspen, CO',
                totalValue: 3200000,
                sharesAvailable: 40,
                totalShares: 80,
                pricePerShare: 40000,
                minShares: 1,
                maxShares: 5,
                projectedROI: '6-10% annually',
                rentalIncome: true,
                monthlyRentalEstimate: 12000,
                managementFee: '12% of rental income',
                benefits: ['Ski season priority booking', 'Rental income', 'Tax benefits'],
                documents: ['Prospectus', 'Operating Agreement', 'Property Appraisal']
            },
            {
                id: 'frac_3',
                propertyId: 'prop_789',
                propertyName: 'Commercial Office Building',
                propertyType: 'commercial',
                location: 'Austin, TX',
                totalValue: 15000000,
                sharesAvailable: 150,
                totalShares: 300,
                pricePerShare: 50000,
                minShares: 2,
                maxShares: 20,
                projectedROI: '7-9% annually',
                rentalIncome: true,
                monthlyRentalEstimate: 95000,
                managementFee: '8% of rental income',
                benefits: ['Quarterly distributions', 'Professional management', 'Portfolio diversification'],
                documents: ['SEC Filing', 'Offering Memorandum', 'Financials']
            }
        ];

        let filtered = opportunities;

        if (minInvestment) {
            filtered = filtered.filter(o => o.pricePerShare >= parseInt(minInvestment as string));
        }
        if (maxInvestment) {
            filtered = filtered.filter(o => o.pricePerShare <= parseInt(maxInvestment as string));
        }
        if (propertyType) {
            filtered = filtered.filter(o => o.propertyType === propertyType);
        }

        res.json({
            total: filtered.length,
            opportunities: filtered,
            disclaimer: 'Investments involve risk. Past performance is not indicative of future results.'
        });
    } catch (error) {
        console.error('Opportunities error:', error);
        res.status(500).json({ error: 'Failed to get opportunities' });
    }
});

// ============================================
// GET OPPORTUNITY DETAILS
// ============================================
router.get('/opportunity/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        res.json({
            id,
            status: 'Active',
            fundingProgress: 75,
            investors: 45,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            propertyDetails: {
                address: '1234 Ocean Drive, Miami Beach, FL 33139',
                bedrooms: 3,
                bathrooms: 3,
                squareFeet: 2500,
                yearBuilt: 2020,
                amenities: ['Ocean view', 'Pool access', 'Concierge', 'Gym', 'Valet parking']
            },
            financials: {
                purchasePrice: 2350000,
                closingCosts: 75000,
                renovationBudget: 50000,
                reserves: 25000,
                totalInvestment: 2500000,
                projectedAnnualRental: 102000,
                projectedExpenses: 35000,
                projectedNOI: 67000,
                projectedCashOnCash: '8.5%',
                projectedIRR: '12-15%',
                holdPeriod: '5-7 years'
            },
            legalStructure: {
                entity: 'Limited Liability Company (LLC)',
                jurisdiction: 'Delaware',
                managingMember: 'Pacific Property Partners LLC',
                investorRights: ['Quarterly reports', 'Annual meeting', 'Exit option after 3 years']
            },
            risks: [
                'Property value may decrease',
                'Rental income not guaranteed',
                'Limited liquidity',
                'Market conditions may change'
            ]
        });
    } catch (error) {
        console.error('Opportunity detail error:', error);
        res.status(500).json({ error: 'Failed to get details' });
    }
});

// ============================================
// INVEST IN PROPERTY
// ============================================
router.post('/invest', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            opportunityId: z.string(),
            shares: z.number().int().positive(),
            paymentMethod: z.enum(['bank_transfer', 'wire', 'crypto']),
            accreditedInvestor: z.boolean(),
            agreementAccepted: z.literal(true)
        }).parse(req.body);

        if (!data.accreditedInvestor) {
            return res.status(400).json({
                error: 'Accredited investor status required',
                info: 'SEC regulations require investors to be accredited for certain offerings'
            });
        }

        const investmentId = `inv_${Date.now()}`;

        res.status(201).json({
            investmentId,
            status: 'Pending Payment',
            shares: data.shares,
            totalAmount: data.shares * 25000, // Simplified
            paymentInstructions: {
                method: data.paymentMethod,
                reference: investmentId,
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            nextSteps: [
                'Complete payment within 3 business days',
                'Sign operating agreement via DocuSign',
                'Receive ownership confirmation',
                'Access investor dashboard'
            ]
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Investment error:', error);
        res.status(500).json({ error: 'Investment failed' });
    }
});

// ============================================
// INVESTOR DASHBOARD
// ============================================
router.get('/dashboard', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            portfolio: {
                totalInvested: 150000,
                currentValue: 168500,
                totalGain: 18500,
                gainPercentage: 12.3,
                investments: [
                    {
                        id: 'inv_1',
                        propertyName: 'Luxury Beach Condo',
                        shares: 4,
                        invested: 100000,
                        currentValue: 112000,
                        rentalIncome: 2800,
                        lastPayout: '2024-01-15'
                    },
                    {
                        id: 'inv_2',
                        propertyName: 'Mountain Retreat Cabin',
                        shares: 1,
                        invested: 50000,
                        currentValue: 56500,
                        rentalIncome: 1200,
                        lastPayout: '2024-01-15'
                    }
                ]
            },
            income: {
                totalRentalIncome: 24000,
                ytdIncome: 4000,
                nextPayout: '2024-02-15',
                estimatedNextPayout: 4000
            },
            documents: [
                { name: 'Q4 2023 Report', date: '2024-01-10', type: 'pdf' },
                { name: 'Tax Documents (K-1)', date: '2024-03-01', type: 'pdf' },
                { name: 'Operating Agreement', date: '2023-06-15', type: 'pdf' }
            ]
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to load dashboard' });
    }
});

// ============================================
// SECONDARY MARKET (SELL SHARES)
// ============================================
router.post('/sell', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            investmentId: z.string(),
            sharesToSell: z.number().int().positive(),
            askingPrice: z.number().positive(),
            listingDuration: z.number().default(30) // days
        }).parse(req.body);

        const listingId = `list_${Date.now()}`;

        res.status(201).json({
            listingId,
            status: 'Listed on Secondary Market',
            sharesToSell: data.sharesToSell,
            askingPrice: data.askingPrice,
            totalAsk: data.sharesToSell * data.askingPrice,
            expiresAt: new Date(Date.now() + data.listingDuration * 24 * 60 * 60 * 1000).toISOString(),
            fees: {
                platformFee: '2% of sale price',
                transferFee: '$100 flat'
            },
            note: 'Buyers must also be accredited investors'
        });
    } catch (error) {
        console.error('Sell error:', error);
        res.status(500).json({ error: 'Failed to list shares' });
    }
});

export default router;

