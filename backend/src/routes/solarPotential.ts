import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Average solar irradiance by region (kWh/m²/day)
const SOLAR_REGIONS = {
    southwest: { irradiance: 6.5, rating: 'Excellent' },
    southeast: { irradiance: 5.5, rating: 'Very Good' },
    midwest: { irradiance: 4.5, rating: 'Good' },
    northeast: { irradiance: 4.0, rating: 'Moderate' },
    northwest: { irradiance: 3.5, rating: 'Fair' }
};

// ============================================
// SOLAR POTENTIAL ANALYSIS
// ============================================
router.post('/analyze', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid().optional(),
            lat: z.number().optional(),
            lng: z.number().optional(),
            roofArea: z.number().positive().optional(),
            roofType: z.enum(['flat', 'gable', 'hip', 'shed', 'other']).optional(),
            roofOrientation: z.enum(['south', 'southwest', 'southeast', 'east', 'west', 'north']).optional(),
            shading: z.enum(['none', 'light', 'moderate', 'heavy']).optional(),
            monthlyElectricBill: z.number().positive().optional()
        }).parse(req.body);

        const analysis = analyzeSolarPotential(data);

        res.json({
            solarScore: analysis.score,
            grade: analysis.grade,
            estimatedCapacity: analysis.capacity,
            annualProduction: analysis.production,
            savingsEstimate: analysis.savings,
            systemRecommendation: analysis.system,
            financials: analysis.financials,
            incentives: getIncentives(),
            environmentalImpact: analysis.environmental
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Solar analysis error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

function analyzeSolarPotential(data: any): any {
    const roofArea = data.roofArea || 1500; // sq ft default
    const usableRoof = roofArea * 0.65; // ~65% typically usable

    // Panel calculations
    const panelSize = 17.5; // sq ft per panel
    const panelWatts = 400; // watts per panel
    const panelCount = Math.floor(usableRoof / panelSize);
    const systemSizeKW = (panelCount * panelWatts) / 1000;

    // Production factors
    let efficiencyFactor = 1.0;

    // Orientation factor
    const orientationFactors: Record<string, number> = {
        south: 1.0, southwest: 0.95, southeast: 0.95,
        east: 0.85, west: 0.85, north: 0.60
    };
    efficiencyFactor *= orientationFactors[data.roofOrientation || 'south'];

    // Shading factor
    const shadingFactors: Record<string, number> = {
        none: 1.0, light: 0.9, moderate: 0.75, heavy: 0.5
    };
    efficiencyFactor *= shadingFactors[data.shading || 'none'];

    // Annual production (assuming 4.5 peak sun hours average)
    const peakSunHours = 4.5;
    const annualProductionKWh = Math.round(systemSizeKW * peakSunHours * 365 * efficiencyFactor * 0.8);

    // Financial calculations
    const electricityRate = 0.15; // $/kWh average
    const annualSavings = Math.round(annualProductionKWh * electricityRate);
    const systemCost = Math.round(systemSizeKW * 2800); // $2.80/watt installed
    const federalCredit = Math.round(systemCost * 0.30); // 30% ITC
    const netCost = systemCost - federalCredit;
    const paybackYears = Math.round(netCost / annualSavings * 10) / 10;

    // Score calculation
    let score = 50;
    if (efficiencyFactor >= 0.9) score += 30;
    else if (efficiencyFactor >= 0.75) score += 20;
    else if (efficiencyFactor >= 0.6) score += 10;

    if (paybackYears <= 7) score += 20;
    else if (paybackYears <= 10) score += 10;

    return {
        score: Math.min(100, score),
        grade: score >= 80 ? 'A (Excellent)' : score >= 65 ? 'B (Good)' : score >= 50 ? 'C (Fair)' : 'D (Limited)',
        capacity: {
            systemSizeKW: Math.round(systemSizeKW * 10) / 10,
            panelCount,
            usableRoofSqFt: Math.round(usableRoof)
        },
        production: {
            annualKWh: annualProductionKWh,
            monthlyAvgKWh: Math.round(annualProductionKWh / 12),
            efficiencyFactor: Math.round(efficiencyFactor * 100)
        },
        savings: {
            firstYearSavings: annualSavings,
            twentyYearSavings: Math.round(annualSavings * 20 * 1.02), // 2% annual increase
            monthlyAvgSavings: Math.round(annualSavings / 12)
        },
        system: {
            recommendedSize: `${Math.round(systemSizeKW * 10) / 10} kW`,
            panels: `${panelCount} x 400W panels`,
            inverterType: systemSizeKW > 10 ? 'String inverter with optimizers' : 'Microinverters',
            estimatedInstallTime: '1-3 days'
        },
        financials: {
            grossCost: systemCost,
            federalTaxCredit: federalCredit,
            netCost,
            paybackYears,
            roi: Math.round((annualSavings * 25 - netCost) / netCost * 100) + '%'
        },
        environmental: {
            annualCO2OffsetLbs: Math.round(annualProductionKWh * 0.9),
            equivalentTreesPlanted: Math.round(annualProductionKWh * 0.9 / 48),
            carsOffRoadEquivalent: Math.round(annualProductionKWh * 0.9 / 10000 * 10) / 10
        }
    };
}

function getIncentives(): any {
    return {
        federal: [
            {
                name: 'Federal Solar Investment Tax Credit (ITC)',
                value: '30% of system cost',
                expires: '2032 (reduces to 26% in 2033)',
                type: 'Tax Credit'
            }
        ],
        state: [
            {
                name: 'State Solar Rebate',
                value: 'Varies by state ($500-$5,000)',
                note: 'Check your state\'s energy office'
            },
            {
                name: 'Net Metering',
                value: 'Sell excess power back to grid',
                note: 'Available in most states'
            }
        ],
        utility: [
            {
                name: 'Utility Rebates',
                value: 'Varies ($0.10-0.50 per watt)',
                note: 'Contact your utility company'
            }
        ],
        financing: [
            { name: 'Solar Loan', terms: '10-25 years, 4-8% APR' },
            { name: 'Solar Lease', terms: '$0 down, fixed monthly payment' },
            { name: 'PPA', terms: 'Pay only for power produced' }
        ]
    };
}

// ============================================
// COMPARE SOLAR PROVIDERS
// ============================================
router.get('/providers/:zipCode', async (req: Request, res: Response) => {
    try {
        const { zipCode } = req.params;

        res.json({
            zipCode,
            providers: [
                {
                    name: 'SunPower',
                    rating: 4.8,
                    reviews: 1250,
                    pricePerWatt: '$3.20',
                    warranty: '25 years complete',
                    financing: ['Loan', 'Lease', 'PPA']
                },
                {
                    name: 'Tesla Solar',
                    rating: 4.3,
                    reviews: 890,
                    pricePerWatt: '$2.50',
                    warranty: '25 years',
                    financing: ['Loan', 'Cash'],
                    note: 'Requires Powerwall purchase'
                },
                {
                    name: 'Local Solar Co',
                    rating: 4.7,
                    reviews: 320,
                    pricePerWatt: '$2.80',
                    warranty: '25 years panels, 10 years labor',
                    financing: ['Loan', 'Lease', 'PPA', 'PACE']
                }
            ],
            tips: [
                'Get at least 3 quotes',
                'Compare warranties carefully',
                'Ask about equipment quality',
                'Check installer certifications (NABCEP)'
            ]
        });
    } catch (error) {
        console.error('Providers error:', error);
        res.status(500).json({ error: 'Failed to get providers' });
    }
});

// ============================================
// BATTERY STORAGE OPTIONS
// ============================================
router.get('/battery-options', (req: Request, res: Response) => {
    res.json({
        options: [
            {
                name: 'Tesla Powerwall',
                capacity: '13.5 kWh',
                price: '$11,500 installed',
                warranty: '10 years',
                features: ['Backup power', 'Time-of-use optimization', 'Storm watch']
            },
            {
                name: 'Enphase IQ Battery',
                capacity: '10.5 kWh (stackable)',
                price: '$15,000 installed',
                warranty: '10 years',
                features: ['Modular design', 'Microinverter compatible']
            },
            {
                name: 'LG Chem RESU',
                capacity: '16 kWh',
                price: '$12,000 installed',
                warranty: '10 years',
                features: ['High capacity', 'Compact design']
            }
        ],
        federalCredit: '30% tax credit applies to batteries paired with solar',
        benefits: [
            'Backup power during outages',
            'Store solar for nighttime use',
            'Reduce peak electricity rates',
            'Energy independence'
        ]
    });
});

export default router;

