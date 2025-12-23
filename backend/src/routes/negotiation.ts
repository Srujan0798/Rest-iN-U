import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// AI NEGOTIATION STRATEGY
// ============================================
router.post('/strategy', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid(),
            maxBudget: z.number().positive(),
            mustHaveTerms: z.array(z.string()).optional(),
            flexibleTerms: z.array(z.string()).optional()
        }).parse(req.body);

        // Get property and market data
        const property = await prisma.property.findUnique({
            where: { id: data.propertyId },
            include: {
                priceHistory: { orderBy: { changeDate: 'desc' } }
            }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Analyze seller motivation
        const motivation = analyzeSellerMotivation(property);

        // Calculate optimal offer
        const strategy = generateNegotiationStrategy(
            property.price,
            data.maxBudget,
            motivation,
            property.daysOnMarket
        );

        res.json({
            property: {
                id: property.id,
                address: `${property.street}, ${property.city}`,
                listingPrice: property.price,
                daysOnMarket: property.daysOnMarket,
                priceReductions: property.priceHistory.filter(p => p.newPrice < p.previousPrice).length
            },
            sellerMotivation: motivation,
            strategy
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Strategy error:', error);
        res.status(500).json({ error: 'Failed to generate strategy' });
    }
});

interface MotivationAnalysis {
    score: number;
    level: 'high' | 'moderate' | 'low';
    factors: string[];
}

function analyzeSellerMotivation(property: any): MotivationAnalysis {
    let score = 50;
    const factors: string[] = [];

    // Days on market
    if (property.daysOnMarket > 90) {
        score += 25;
        factors.push('Extended time on market (90+ days)');
    } else if (property.daysOnMarket > 60) {
        score += 15;
        factors.push('Moderate time on market (60-90 days)');
    } else if (property.daysOnMarket > 30) {
        score += 5;
        factors.push('Normal market time (30-60 days)');
    }

    // Price reductions
    const reductions = property.priceHistory?.filter((p: any) => p.newPrice < p.previousPrice) || [];
    if (reductions.length >= 3) {
        score += 25;
        factors.push('Multiple price reductions (3+)');
    } else if (reductions.length >= 2) {
        score += 15;
        factors.push('Two price reductions');
    } else if (reductions.length === 1) {
        score += 10;
        factors.push('One price reduction');
    }

    // Vacant property (inferred from lack of photos)
    if (property.status === 'ACTIVE' && property.daysOnMarket > 60) {
        score += 10;
        factors.push('Likely carrying costs pressure');
    }

    // Season (winter = more motivated)
    const month = new Date().getMonth();
    if ([11, 0, 1].includes(month)) {
        score += 10;
        factors.push('Off-season listing (winter)');
    }

    score = Math.min(100, score);

    return {
        score,
        level: score >= 70 ? 'high' : score >= 50 ? 'moderate' : 'low',
        factors
    };
}

interface NegotiationStrategy {
    recommendedInitialOffer: number;
    initialOfferPercent: number;
    walkAwayPrice: number;
    tactics: string[];
    counterOfferStrategies: CounterStrategy[];
    estimatedFinalPrice: number;
    probabilityAccepted: number;
    timeline: string;
}

interface CounterStrategy {
    round: number;
    ifSellerCounters: string;
    yourResponse: string;
    increaseAmount: number;
}

function generateNegotiationStrategy(
    listingPrice: number,
    maxBudget: number,
    motivation: MotivationAnalysis,
    daysOnMarket: number
): NegotiationStrategy {

    // Calculate discount based on motivation
    let discountPercent = 0;
    if (motivation.level === 'high') {
        discountPercent = 12 + Math.random() * 5; // 12-17%
    } else if (motivation.level === 'moderate') {
        discountPercent = 7 + Math.random() * 5; // 7-12%
    } else {
        discountPercent = 3 + Math.random() * 4; // 3-7%
    }

    const recommendedOffer = Math.round(listingPrice * (1 - discountPercent / 100));
    const estimatedFinal = Math.round(listingPrice * (1 - discountPercent * 0.6 / 100));

    // Generate tactics based on motivation
    const tactics: string[] = [];

    if (motivation.level === 'high') {
        tactics.push('Lead with a strong initial offer below asking');
        tactics.push('Mention flexibility on closing date');
        tactics.push('Offer shorter inspection period to sweeten deal');
        tactics.push('Request seller concessions for closing costs');
    } else if (motivation.level === 'moderate') {
        tactics.push('Make a fair initial offer slightly below asking');
        tactics.push('Emphasize your pre-approval and readiness');
        tactics.push('Be prepared for 2-3 rounds of negotiation');
    } else {
        tactics.push('Start close to asking price');
        tactics.push('Focus on non-price terms');
        tactics.push('Move quickly - motivated buyers win');
        tactics.push('Consider escalation clause');
    }

    // Counter-offer strategies
    const counterStrategies: CounterStrategy[] = [
        {
            round: 1,
            ifSellerCounters: `Seller counters at ${Math.round(listingPrice * 0.97)}`,
            yourResponse: 'Increase modestly, cite market comparables',
            increaseAmount: Math.round(recommendedOffer * 0.03)
        },
        {
            round: 2,
            ifSellerCounters: `Seller holds at ${Math.round(listingPrice * 0.95)}`,
            yourResponse: 'Final offer with best terms, set deadline',
            increaseAmount: Math.round(recommendedOffer * 0.02)
        },
        {
            round: 3,
            ifSellerCounters: 'Seller rejects or minimal movement',
            yourResponse: 'Walk away or accept at max budget',
            increaseAmount: 0
        }
    ];

    return {
        recommendedInitialOffer: Math.min(recommendedOffer, maxBudget * 0.92),
        initialOfferPercent: Math.round((1 - discountPercent / 100) * 100),
        walkAwayPrice: maxBudget,
        tactics,
        counterOfferStrategies: counterStrategies,
        estimatedFinalPrice: Math.min(estimatedFinal, maxBudget),
        probabilityAccepted: calculateAcceptanceProbability(motivation.score, discountPercent),
        timeline: motivation.level === 'high' ? '1-2 rounds, 3-5 days' : '2-4 rounds, 1-2 weeks'
    };
}

function calculateAcceptanceProbability(motivationScore: number, discountPercent: number): number {
    // Higher motivation + lower discount = higher probability
    const baseProbability = motivationScore / 100;
    const discountPenalty = discountPercent * 2;
    return Math.min(95, Math.max(20, Math.round(baseProbability * 100 - discountPenalty)));
}

// ============================================
// GENERATE OFFER LETTER
// ============================================
router.post('/offer-letter', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid(),
            offerPrice: z.number().positive(),
            earnestMoney: z.number().positive(),
            downPaymentPercent: z.number().min(0).max(100),
            financingType: z.enum(['conventional', 'fha', 'va', 'cash']),
            closingDate: z.string(),
            contingencies: z.object({
                inspection: z.boolean(),
                financing: z.boolean(),
                appraisal: z.boolean(),
                saleOfHome: z.boolean()
            }),
            personalLetter: z.boolean().optional()
        }).parse(req.body);

        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        const property = await prisma.property.findUnique({
            where: { id: data.propertyId }
        });

        if (!property || !user) {
            return res.status(404).json({ error: 'Property or user not found' });
        }

        // Generate offer letter text
        const offerLetter = generateOfferLetterText({
            buyerName: `${user.firstName} ${user.lastName}`,
            propertyAddress: `${property.street}, ${property.city}, ${property.state} ${property.zip}`,
            ...data
        });

        res.json({
            offerLetter,
            summary: {
                offerPrice: data.offerPrice,
                percentOfAsking: Math.round((data.offerPrice / property.price) * 100),
                earnestMoney: data.earnestMoney,
                contingencies: Object.entries(data.contingencies)
                    .filter(([_, v]) => v)
                    .map(([k]) => k)
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Offer letter error:', error);
        res.status(500).json({ error: 'Failed to generate offer letter' });
    }
});

function generateOfferLetterText(data: any): string {
    return `
RESIDENTIAL PURCHASE AGREEMENT

Date: ${new Date().toLocaleDateString()}

BUYER: ${data.buyerName}
PROPERTY ADDRESS: ${data.propertyAddress}

1. OFFER TERMS
   Purchase Price: $${data.offerPrice.toLocaleString()}
   Earnest Money Deposit: $${data.earnestMoney.toLocaleString()}
   Down Payment: ${data.downPaymentPercent}%
   Financing Type: ${data.financingType.toUpperCase()}
   Proposed Closing Date: ${new Date(data.closingDate).toLocaleDateString()}

2. CONTINGENCIES
   ${data.contingencies.inspection ? '☑' : '☐'} Inspection Contingency (10 days)
   ${data.contingencies.financing ? '☑' : '☐'} Financing Contingency (21 days)
   ${data.contingencies.appraisal ? '☑' : '☐'} Appraisal Contingency
   ${data.contingencies.saleOfHome ? '☑' : '☐'} Sale of Buyer's Current Home

3. ADDITIONAL TERMS
   - Buyer to receive all appliances in working condition
   - Seller to provide clear title at closing
   - Property sold in "as-is" condition subject to inspections

This offer is valid for 48 hours from the date above.

_______________________________
Buyer Signature

_______________________________
Date
`.trim();
}

// ============================================
// SUBMIT OFFER
// ============================================
router.post('/submit', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid(),
            offerPrice: z.number().positive(),
            earnestMoney: z.number().positive(),
            downPaymentPercent: z.number(),
            financingType: z.string(),
            closingDate: z.string(),
            contingencies: z.any(),
            message: z.string().optional()
        }).parse(req.body);

        const offer = await prisma.offer.create({
            data: {
                propertyId: data.propertyId,
                buyerId: req.userId!,
                offerPrice: data.offerPrice,
                earnestMoney: data.earnestMoney,
                downPaymentPercent: data.downPaymentPercent,
                financingType: data.financingType,
                closingDate: new Date(data.closingDate),
                contingencies: data.contingencies,
                message: data.message,
                status: 'PENDING',
                expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
            }
        });

        // Notify seller/agent
        // await sendOfferNotification(offer);

        res.status(201).json({
            message: 'Offer submitted successfully',
            offer: {
                id: offer.id,
                status: offer.status,
                expiresAt: offer.expiresAt
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Submit offer error:', error);
        res.status(500).json({ error: 'Failed to submit offer' });
    }
});

export default router;

