import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Carbon emission factors
const EMISSION_FACTORS = {
    electricity: 0.42, // kg CO2 per kWh (US average)
    naturalGas: 5.3, // kg CO2 per therm
    fuel: 8.89, // kg CO2 per gallon gasoline
    carPerMile: 0.404, // kg CO2 per mile driven
    flightPerMile: 0.255, // kg CO2 per mile
    construction: {
        wood: 50, // kg CO2 per sqft
        concrete: 150,
        steel: 200,
        brick: 125
    }
};

// ============================================
// CALCULATE PROPERTY CARBON FOOTPRINT
// ============================================
router.post('/property/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;
        const data = z.object({
            monthlyElectricityKwh: z.number().optional(),
            monthlyGasTherms: z.number().optional(),
            constructionType: z.enum(['wood', 'concrete', 'steel', 'brick', 'mixed']).optional(),
            yearBuilt: z.number().optional(),
            commuteMilesOneWay: z.number().optional(),
            workFromHomeDays: z.number().min(0).max(5).optional()
        }).parse(req.body);

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        const footprint = calculatePropertyFootprint(property, data);

        res.json({
            propertyId,
            carbonFootprint: footprint,
            comparison: getComparison(footprint.totalAnnualTons),
            offsetOptions: getOffsetOptions(footprint.totalAnnualTons),
            reductionStrategies: getReductionStrategies(footprint)
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Carbon footprint error:', error);
        res.status(500).json({ error: 'Calculation failed' });
    }
});

function calculatePropertyFootprint(property: any, data: any): any {
    const sqft = property.squareFeet || 2000;

    // Estimate if not provided
    const electricityKwh = data.monthlyElectricityKwh || (sqft * 0.5); // ~0.5 kWh/sqft/month
    const gasTherms = data.monthlyGasTherms || (sqft * 0.02); // ~0.02 therms/sqft/month

    // Annual calculations
    const electricityAnnual = electricityKwh * 12;
    const gasAnnual = gasTherms * 12;

    // Electricity emissions
    const electricityEmissions = electricityAnnual * EMISSION_FACTORS.electricity / 1000; // tons

    // Gas emissions
    const gasEmissions = gasAnnual * EMISSION_FACTORS.naturalGas / 1000; // tons

    // Embodied carbon (construction)
    const constructionType = data.constructionType || 'mixed';
    const embodiedCarbon = constructionType === 'mixed'
        ? sqft * 100 / 1000 // average
        : sqft * EMISSION_FACTORS.construction[constructionType as keyof typeof EMISSION_FACTORS.construction] / 1000;

    // Amortized over 50 years
    const embodiedAnnual = embodiedCarbon / 50;

    // Commute emissions
    let commuteEmissions = 0;
    if (data.commuteMilesOneWay) {
        const workDays = (5 - (data.workFromHomeDays || 0)) * 50; // 50 weeks
        const annualMiles = data.commuteMilesOneWay * 2 * workDays;
        commuteEmissions = annualMiles * EMISSION_FACTORS.carPerMile / 1000;
    }

    const totalAnnual = electricityEmissions + gasEmissions + embodiedAnnual + commuteEmissions;

    return {
        breakdown: {
            electricity: {
                annualUsageKwh: electricityAnnual,
                emissionsTons: Math.round(electricityEmissions * 100) / 100
            },
            naturalGas: {
                annualUsageTherms: gasAnnual,
                emissionsTons: Math.round(gasEmissions * 100) / 100
            },
            embodiedCarbon: {
                constructionType,
                totalTons: Math.round(embodiedCarbon * 100) / 100,
                amortizedAnnualTons: Math.round(embodiedAnnual * 100) / 100
            },
            commute: {
                annualMiles: data.commuteMilesOneWay ? (data.commuteMilesOneWay * 2 * 250) : 0,
                emissionsTons: Math.round(commuteEmissions * 100) / 100
            }
        },
        totalAnnualTons: Math.round(totalAnnual * 100) / 100,
        perSquareFootKg: Math.round((totalAnnual * 1000 / sqft) * 100) / 100
    };
}

function getComparison(tons: number): any {
    const avgUS = 16; // Average US household ~16 tons/year
    const percentOfAvg = Math.round((tons / avgUS) * 100);

    return {
        usAverage: avgUS,
        percentOfAverage: percentOfAvg,
        rating: percentOfAvg < 80 ? 'Below Average (Good!)' :
            percentOfAvg < 120 ? 'Average' : 'Above Average',
        equivalents: {
            carsOnRoad: (tons / 4.6).toFixed(1), // 4.6 tons per car/year
            treesNeeded: Math.round(tons / 0.06), // Tree absorbs ~0.06 tons/year
            milesFlown: Math.round(tons / 0.000255) // Per mile
        }
    };
}

function getOffsetOptions(tons: number): any[] {
    const costPerTon = 15; // Average offset cost
    const totalCost = Math.round(tons * costPerTon);

    return [
        {
            name: 'Forest Conservation',
            description: 'Protect existing forests from deforestation',
            costPerTon: 12,
            totalCost: Math.round(tons * 12),
            certifications: ['VCS', 'Gold Standard']
        },
        {
            name: 'Renewable Energy',
            description: 'Fund wind and solar projects',
            costPerTon: 15,
            totalCost: Math.round(tons * 15),
            certifications: ['Green-e']
        },
        {
            name: 'Direct Air Capture',
            description: 'Cutting-edge carbon removal technology',
            costPerTon: 250,
            totalCost: Math.round(tons * 250),
            certifications: ['Scientific verification']
        }
    ];
}

function getReductionStrategies(footprint: any): any[] {
    const strategies = [];

    // Electricity reduction
    if (footprint.breakdown.electricity.emissionsTons > 3) {
        strategies.push({
            category: 'Electricity',
            action: 'Switch to renewable energy provider',
            potentialReduction: '50-100%',
            estimatedSavings: Math.round(footprint.breakdown.electricity.emissionsTons * 0.7) + ' tons/year',
            difficulty: 'Easy',
            costLevel: 'Low'
        });
    }

    // Solar potential
    strategies.push({
        category: 'Solar',
        action: 'Install rooftop solar panels',
        potentialReduction: '60-90%',
        estimatedSavings: Math.round(footprint.breakdown.electricity.emissionsTons * 0.8) + ' tons/year',
        difficulty: 'Medium',
        costLevel: 'High upfront, long-term savings'
    });

    // Heat pump
    if (footprint.breakdown.naturalGas.emissionsTons > 2) {
        strategies.push({
            category: 'Heating',
            action: 'Replace gas furnace with heat pump',
            potentialReduction: '50-70%',
            estimatedSavings: Math.round(footprint.breakdown.naturalGas.emissionsTons * 0.6) + ' tons/year',
            difficulty: 'Medium',
            costLevel: 'Medium'
        });
    }

    // Commute
    if (footprint.breakdown.commute.emissionsTons > 1) {
        strategies.push({
            category: 'Transportation',
            action: 'Switch to electric vehicle',
            potentialReduction: '70-90%',
            estimatedSavings: Math.round(footprint.breakdown.commute.emissionsTons * 0.8) + ' tons/year',
            difficulty: 'Medium',
            costLevel: 'High'
        });
    }

    return strategies;
}

// ============================================
// GET EMISSION FACTORS
// ============================================
router.get('/factors', (req: Request, res: Response) => {
    res.json({ factors: EMISSION_FACTORS });
});

// ============================================
// COMPARE PROPERTIES
// ============================================
router.post('/compare', async (req: Request, res: Response) => {
    try {
        const { propertyIds } = z.object({
            propertyIds: z.array(z.string().uuid()).min(2).max(5)
        }).parse(req.body);

        const properties = await prisma.property.findMany({
            where: { id: { in: propertyIds } }
        });

        const comparisons = properties.map(p => {
            const sqft = p.squareFeet || 2000;
            const estimatedAnnual = (sqft * 0.5 * 12 * EMISSION_FACTORS.electricity +
                sqft * 0.02 * 12 * EMISSION_FACTORS.naturalGas) / 1000;
            return {
                propertyId: p.id,
                address: `${p.street}, ${p.city}`,
                squareFeet: sqft,
                estimatedAnnualTons: Math.round(estimatedAnnual * 100) / 100,
                perSqFtKg: Math.round((estimatedAnnual * 1000 / sqft) * 100) / 100
            };
        });

        // Sort by efficiency
        comparisons.sort((a, b) => a.perSqFtKg - b.perSqFtKg);

        res.json({
            comparisons,
            mostEfficient: comparisons[0],
            leastEfficient: comparisons[comparisons.length - 1]
        });
    } catch (error) {
        console.error('Compare error:', error);
        res.status(500).json({ error: 'Comparison failed' });
    }
});

export default router;

