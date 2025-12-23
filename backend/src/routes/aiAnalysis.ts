import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// AI PROPERTY ANALYZER
// ============================================
router.post('/comprehensive/:propertyId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { propertyId } = req.params;

        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            include: {
                photos: true,
                priceHistory: { orderBy: { changeDate: 'desc' } },
                neighborhood: true
            }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Generate comprehensive AI analysis
        const analysis = await generateComprehensiveAnalysis(property);

        res.json({
            propertyId,
            address: `${property.street}, ${property.city}, ${property.state}`,
            ...analysis
        });
    } catch (error) {
        console.error('AI analysis error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

async function generateComprehensiveAnalysis(property: any): Promise<any> {
    const sqft = property.squareFeet || 2000;
    const price = property.price;
    const age = property.yearBuilt ? new Date().getFullYear() - property.yearBuilt : 30;

    return {
        overallScore: calculateOverallScore(property),
        investmentPotential: analyzeInvestmentPotential(property),
        marketPosition: analyzeMarketPosition(property),
        conditionAssessment: assessCondition(property, age),
        valueOptimization: suggestValueOptimization(property),
        riskAnalysis: analyzeRisks(property),
        buyerPersonaMatch: matchBuyerPersonas(property),
        negotiationInsights: generateNegotiationInsights(property),
        futureProjections: projectFuture(property)
    };
}

function calculateOverallScore(property: any): any {
    let score = 70; // Base score

    // Location factors
    if (property.neighborhood?.walkabilityScore > 70) score += 5;
    if (property.neighborhood?.transitScore > 60) score += 3;

    // Property factors
    if (property.bedrooms >= 3) score += 5;
    if (property.bathrooms >= 2) score += 3;
    if (property.yearBuilt && property.yearBuilt > 2000) score += 5;

    // Market factors
    if (property.daysOnMarket < 30) score += 5;
    if (property.priceHistory?.length > 0 &&
        property.priceHistory[0].newPrice < property.priceHistory[0].previousPrice) {
        score += 3; // Price reduction = opportunity
    }

    return {
        score: Math.min(100, score),
        grade: score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : 'D',
        summary: score >= 85 ? 'Excellent investment opportunity' :
            score >= 70 ? 'Good property with solid fundamentals' :
                score >= 55 ? 'Average property, consider alternatives' :
                    'Below average, proceed with caution'
    };
}

function analyzeInvestmentPotential(property: any): any {
    const pricePerSqFt = property.squareFeet ? property.price / property.squareFeet : 300;
    const estimatedMonthlyRent = property.squareFeet ? property.squareFeet * 1.5 : 2500;
    const grossYield = (estimatedMonthlyRent * 12 / property.price) * 100;
    const netYield = grossYield * 0.75; // Assume 25% expenses

    return {
        pricePerSqFt: Math.round(pricePerSqFt),
        estimatedMonthlyRent: Math.round(estimatedMonthlyRent),
        grossYield: grossYield.toFixed(2) + '%',
        netYield: netYield.toFixed(2) + '%',
        capitalGrowthPotential: property.neighborhood?.priceTrend > 3 ? 'High' :
            property.neighborhood?.priceTrend > 0 ? 'Moderate' : 'Low',
        rentalDemand: 'Moderate to High',
        recommendation: netYield > 6 ? 'Strong Buy' : netYield > 4 ? 'Buy' : 'Hold'
    };
}

function analyzeMarketPosition(property: any): any {
    return {
        daysOnMarket: property.daysOnMarket || 0,
        marketStatus: property.daysOnMarket < 14 ? 'Hot Market' :
            property.daysOnMarket < 30 ? 'Active Market' :
                property.daysOnMarket < 60 ? 'Balanced Market' : 'Buyer Market',
        competitivePosition: property.daysOnMarket < 30 ? 'Strong' : 'Negotiable',
        priceMovement: property.priceHistory?.length > 0 ?
            `${property.priceHistory.length} price change(s)` : 'No changes',
        listingFreshness: property.daysOnMarket < 7 ? 'New' :
            property.daysOnMarket < 30 ? 'Recent' : 'Stale'
    };
}

function assessCondition(property: any, age: number): any {
    return {
        estimatedAge: age,
        ageCategory: age < 5 ? 'New Construction' :
            age < 15 ? 'Modern' :
                age < 30 ? 'Established' :
                    age < 50 ? 'Aging' : 'Historic',
        maintenanceExpectation: age < 10 ? 'Low' : age < 25 ? 'Moderate' : 'High',
        potentialIssues: age > 30 ? [
            'Roof may need inspection',
            'Plumbing updates advisable',
            'HVAC efficiency check recommended'
        ] : ['Standard wear items'],
        renovationPotential: age > 20 ? 'Significant' : 'Minimal'
    };
}

function suggestValueOptimization(property: any): any {
    const suggestions = [];

    if (!property.virtualTourUrl) {
        suggestions.push({
            action: 'Add virtual tour',
            impact: 'High',
            cost: '$200-500',
            valueIncrease: '3-5% more buyer interest'
        });
    }

    if (property.photos?.length < 20) {
        suggestions.push({
            action: 'Professional photography',
            impact: 'High',
            cost: '$150-300',
            valueIncrease: '2-4% faster sale'
        });
    }

    suggestions.push({
        action: 'Fresh paint',
        impact: 'Medium',
        cost: '$1,000-3,000',
        valueIncrease: '1-3% price increase'
    });

    return suggestions;
}

function analyzeRisks(property: any): any {
    const risks = [];

    if (property.daysOnMarket > 90) {
        risks.push({
            type: 'Market Risk',
            level: 'Medium',
            description: 'Extended time on market may indicate pricing or condition issues'
        });
    }

    if (property.priceHistory?.length > 2) {
        risks.push({
            type: 'Pricing Risk',
            level: 'Low',
            description: 'Multiple price reductions suggest motivated seller'
        });
    }

    if (!property.neighborhood) {
        risks.push({
            type: 'Location Risk',
            level: 'Unknown',
            description: 'Neighborhood data unavailable for analysis'
        });
    }

    return risks.length > 0 ? risks : [{
        type: 'Overall',
        level: 'Low',
        description: 'No significant risks identified'
    }];
}

function matchBuyerPersonas(property: any): any[] {
    const personas = [];

    if (property.bedrooms >= 4) {
        personas.push({
            type: 'Growing Family',
            matchScore: 90,
            keyFeatures: ['Multiple bedrooms', 'Space for children']
        });
    }

    if (property.bedrooms <= 2) {
        personas.push({
            type: 'Young Professional',
            matchScore: 85,
            keyFeatures: ['Manageable size', 'Lower maintenance']
        });
        personas.push({
            type: 'Investor',
            matchScore: 80,
            keyFeatures: ['Rental potential', 'Entry-level price point']
        });
    }

    if (property.yearBuilt && property.yearBuilt > 2015) {
        personas.push({
            type: 'Move-In Ready Buyer',
            matchScore: 95,
            keyFeatures: ['Modern construction', 'No immediate repairs needed']
        });
    }

    return personas;
}

function generateNegotiationInsights(property: any): any {
    const sellerMotivation = property.daysOnMarket > 60 ? 'High' :
        property.daysOnMarket > 30 ? 'Moderate' : 'Low';

    const suggestedOffer = property.price * (
        sellerMotivation === 'High' ? 0.9 :
            sellerMotivation === 'Moderate' ? 0.95 : 0.98
    );

    return {
        sellerMotivation,
        suggestedInitialOffer: Math.round(suggestedOffer),
        suggestedMaxOffer: Math.round(property.price * 0.98),
        negotiationRoom: sellerMotivation === 'High' ? '8-12%' :
            sellerMotivation === 'Moderate' ? '3-6%' : '1-3%',
        tactics: [
            'Request inspection contingency',
            'Ask for closing cost credits',
            sellerMotivation === 'High' ? 'Make aggressive initial offer' : 'Start with respectful offer'
        ]
    };
}

function projectFuture(property: any): any {
    const annualAppreciation = property.neighborhood?.priceTrend || 3;
    const projections = [];

    for (const years of [1, 3, 5, 10]) {
        const futureValue = property.price * Math.pow(1 + annualAppreciation / 100, years);
        projections.push({
            years,
            estimatedValue: Math.round(futureValue),
            totalAppreciation: Math.round(futureValue - property.price),
            annualizedReturn: annualAppreciation.toFixed(1) + '%'
        });
    }

    return {
        projections,
        assumptions: `Based on ${annualAppreciation}% annual appreciation`,
        confidence: 'Medium',
        factors: ['Local market trends', 'Economic conditions', 'Property maintenance']
    };
}

// ============================================
// QUICK SCORE
// ============================================
router.get('/quick-score/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        const score = calculateOverallScore(property);

        res.json({
            propertyId,
            score: score.score,
            grade: score.grade,
            summary: score.summary
        });
    } catch (error) {
        console.error('Quick score error:', error);
        res.status(500).json({ error: 'Score failed' });
    }
});

export default router;

