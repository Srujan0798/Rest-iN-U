import { v4 as uuidv4 } from 'uuid';

/**
 * AI Negotiation Agent Service
 * 
 * Analyzes comparable sales, seller psychology, and market conditions
 * to formulate optimal offer strategies and negotiate on buyer's behalf
 */
class AINegotiationAgentService {

    // ============================================
    // MAIN NEGOTIATION ANALYSIS
    // ============================================

    async analyzeAndRecommend(
        propertyId: string,
        buyerMaxPrice: number,
        propertyData: PropertyData
    ): Promise<NegotiationStrategy> {
        console.log(`[AI Negotiator] Analyzing property ${propertyId}...`);

        // 1. Analyze comparable sales
        const comps = await this.analyzeComparableSales(propertyData);

        // 2. Analyze seller motivation
        const sellerMotivation = this.analyzeSellerMotivation(propertyData);

        // 3. Analyze market conditions
        const marketConditions = this.analyzeMarketConditions(propertyData);

        // 4. Calculate fair market value
        const fairValue = this.calculateFairValue(comps, propertyData);

        // 5. Generate offer strategy
        const strategy = this.generateOfferStrategy(
            propertyData.askingPrice,
            fairValue,
            buyerMaxPrice,
            sellerMotivation,
            marketConditions
        );

        return {
            id: uuidv4(),
            propertyId,
            askingPrice: propertyData.askingPrice,
            fairMarketValue: fairValue,
            buyerMaxPrice,
            comparableAnalysis: comps,
            sellerMotivation,
            marketConditions,
            recommendedOffer: strategy.initialOffer,
            offerStrategy: strategy,
            confidenceScore: this.calculateConfidence(comps, sellerMotivation),
            generatedAt: new Date().toISOString()
        };
    }

    // ============================================
    // COMPARABLE SALES ANALYSIS
    // ============================================

    private async analyzeComparableSales(property: PropertyData): Promise<ComparableAnalysis> {
        // Simulated comparable sales (would query MLS database)
        const comps: ComparableSale[] = [
            {
                address: '123 Oak Street',
                salePrice: property.askingPrice * 0.95,
                soldDate: '2024-10-15',
                daysOnMarket: 28,
                sqft: property.sqft * 0.98,
                pricePerSqft: (property.askingPrice * 0.95) / (property.sqft * 0.98),
                similarity: 0.92
            },
            {
                address: '456 Maple Avenue',
                salePrice: property.askingPrice * 1.02,
                soldDate: '2024-09-22',
                daysOnMarket: 14,
                sqft: property.sqft * 1.05,
                pricePerSqft: (property.askingPrice * 1.02) / (property.sqft * 1.05),
                similarity: 0.88
            },
            {
                address: '789 Pine Road',
                salePrice: property.askingPrice * 0.88,
                soldDate: '2024-11-01',
                daysOnMarket: 45,
                sqft: property.sqft * 0.92,
                pricePerSqft: (property.askingPrice * 0.88) / (property.sqft * 0.92),
                similarity: 0.85
            }
        ];

        const avgPricePerSqft = comps.reduce((sum, c) => sum + c.pricePerSqft, 0) / comps.length;
        const avgSalePrice = comps.reduce((sum, c) => sum + c.salePrice, 0) / comps.length;
        const avgDaysOnMarket = comps.reduce((sum, c) => sum + c.daysOnMarket, 0) / comps.length;

        const suggestedPrice = Math.round(avgPricePerSqft * property.sqft);
        const listToSaleRatio = avgSalePrice / (property.askingPrice * 0.98); // Assume asking was similar

        return {
            comparables: comps,
            averagePricePerSqft: Math.round(avgPricePerSqft),
            averageSalePrice: Math.round(avgSalePrice),
            averageDaysOnMarket: Math.round(avgDaysOnMarket),
            suggestedPrice,
            priceVsAsking: ((suggestedPrice / property.askingPrice) * 100 - 100).toFixed(1) + '%',
            listToSaleRatio: (listToSaleRatio * 100).toFixed(1) + '%'
        };
    }

    // ============================================
    // SELLER MOTIVATION ANALYSIS
    // ============================================

    private analyzeSellerMotivation(property: PropertyData): SellerMotivation {
        let motivationScore = 50; // Neutral baseline
        const indicators: string[] = [];
        const negotiationLeverage: string[] = [];

        // Days on market analysis
        if (property.daysOnMarket > 90) {
            motivationScore += 25;
            indicators.push('Property listed over 90 days - seller likely motivated');
            negotiationLeverage.push('Use extended listing time as negotiation point');
        } else if (property.daysOnMarket > 45) {
            motivationScore += 15;
            indicators.push('Property listed 45+ days - moderately motivated');
        } else if (property.daysOnMarket < 14) {
            motivationScore -= 15;
            indicators.push('Recently listed - seller may be firm on price');
        }

        // Price reduction history
        if (property.priceReductions > 2) {
            motivationScore += 20;
            indicators.push(`${property.priceReductions} price reductions - highly motivated`);
            negotiationLeverage.push('Multiple price drops indicate flexibility');
        } else if (property.priceReductions === 1) {
            motivationScore += 10;
            indicators.push('One price reduction - some flexibility');
        }

        // Relocation/life event indicators
        if (property.isVacant) {
            motivationScore += 15;
            indicators.push('Property is vacant - carrying costs pressure');
            negotiationLeverage.push('Vacant property = double carrying costs for seller');
        }

        // Market timing
        if (property.monthListed >= 10 || property.monthListed <= 2) {
            motivationScore += 10;
            indicators.push('Listed in slower season (winter) - may be motivated');
        }

        const level = motivationScore >= 75 ? 'high'
            : motivationScore >= 50 ? 'moderate'
                : 'low';

        return {
            score: Math.min(100, Math.max(0, motivationScore)),
            level,
            indicators,
            negotiationLeverage,
            estimatedFlexibility: level === 'high' ? '8-12%' : level === 'moderate' ? '4-7%' : '0-3%'
        };
    }

    // ============================================
    // MARKET CONDITIONS
    // ============================================

    private analyzeMarketConditions(property: PropertyData): MarketConditions {
        // Simulated market data
        const monthsOfInventory = 2.5; // < 3 = seller's market, > 6 = buyer's market
        const priceAppreciation = 5.2; // YoY %
        const avgDaysOnMarket = 32;

        let marketType: 'buyers' | 'sellers' | 'balanced';
        let buyerAdvantage: number;

        if (monthsOfInventory < 3) {
            marketType = 'sellers';
            buyerAdvantage = 30;
        } else if (monthsOfInventory > 6) {
            marketType = 'buyers';
            buyerAdvantage = 70;
        } else {
            marketType = 'balanced';
            buyerAdvantage = 50;
        }

        return {
            marketType,
            monthsOfInventory,
            priceAppreciation,
            avgDaysOnMarket,
            buyerAdvantage,
            insights: [
                `${marketType.charAt(0).toUpperCase() + marketType.slice(1)} market conditions`,
                `${monthsOfInventory.toFixed(1)} months of inventory`,
                `Prices up ${priceAppreciation}% year-over-year`,
                `Properties averaging ${avgDaysOnMarket} days on market`
            ],
            recommendation: marketType === 'sellers'
                ? 'Competitive market - may need strong initial offer'
                : marketType === 'buyers'
                    ? 'Buyer advantage - significant negotiation room'
                    : 'Balanced market - standard negotiation expected'
        };
    }

    // ============================================
    // FAIR VALUE CALCULATION
    // ============================================

    private calculateFairValue(comps: ComparableAnalysis, property: PropertyData): FairValueEstimate {
        const compBasedValue = comps.suggestedPrice;

        // Adjustments
        let adjustedValue = compBasedValue;
        const adjustments: { factor: string; amount: number }[] = [];

        // Condition adjustment
        if (property.condition === 'excellent') {
            adjustedValue *= 1.05;
            adjustments.push({ factor: 'Excellent condition', amount: compBasedValue * 0.05 });
        } else if (property.condition === 'needs_work') {
            adjustedValue *= 0.92;
            adjustments.push({ factor: 'Needs work', amount: -compBasedValue * 0.08 });
        }

        // Unique features
        if (property.hasPool) {
            adjustedValue += 15000;
            adjustments.push({ factor: 'Pool', amount: 15000 });
        }
        if (property.hasView) {
            adjustedValue += 25000;
            adjustments.push({ factor: 'Premium view', amount: 25000 });
        }

        // Vastu bonus
        if (property.vastuScore && property.vastuScore > 80) {
            adjustedValue *= 1.03;
            adjustments.push({ factor: 'High Vastu score', amount: compBasedValue * 0.03 });
        }

        return {
            compBasedValue,
            adjustedValue: Math.round(adjustedValue),
            adjustments,
            confidenceRange: {
                low: Math.round(adjustedValue * 0.95),
                high: Math.round(adjustedValue * 1.05)
            },
            vsAskingPrice: ((adjustedValue / property.askingPrice) * 100 - 100).toFixed(1) + '%'
        };
    }

    // ============================================
    // OFFER STRATEGY GENERATION
    // ============================================

    private generateOfferStrategy(
        askingPrice: number,
        fairValue: FairValueEstimate,
        buyerMaxPrice: number,
        sellerMotivation: SellerMotivation,
        market: MarketConditions
    ): OfferStrategy {
        // Calculate optimal initial offer
        let initialOfferPercent: number;

        if (sellerMotivation.level === 'high' && market.marketType === 'buyers') {
            initialOfferPercent = 0.85; // Aggressive discount
        } else if (sellerMotivation.level === 'high') {
            initialOfferPercent = 0.90;
        } else if (market.marketType === 'sellers') {
            initialOfferPercent = 0.97; // Close to asking
        } else {
            initialOfferPercent = 0.93; // Standard discount
        }

        const initialOffer = Math.round(Math.min(
            askingPrice * initialOfferPercent,
            fairValue.adjustedValue * 0.98,
            buyerMaxPrice * 0.93
        ));

        // Generate counter-offer scenarios
        const counterOffers = this.generateCounterScenarios(initialOffer, askingPrice, buyerMaxPrice);

        return {
            initialOffer,
            initialOfferPercent: Math.round(initialOfferPercent * 100),
            counterOfferScenarios: counterOffers,
            walkAwayPrice: Math.round(buyerMaxPrice * 1.02),
            contingencies: this.recommendContingencies(sellerMotivation, market),
            closingDateStrategy: this.recommendClosingDate(sellerMotivation),
            talkingPoints: [
                `Fair market value analysis supports $${(fairValue.adjustedValue / 1000).toFixed(0)}K`,
                sellerMotivation.level !== 'low' ? 'Property has been on market - factor into negotiations' : null,
                `Similar properties selling at ${fairValue.vsAskingPrice} of asking`,
                'Pre-approved financing ready for quick close'
            ].filter(Boolean) as string[]
        };
    }

    private generateCounterScenarios(initial: number, asking: number, maxPrice: number): CounterOffer[] {
        return [
            {
                scenario: 'Seller counter at asking',
                theirOffer: asking,
                yourResponse: Math.round((initial + asking) / 2),
                reasoning: 'Split the difference - shows flexibility'
            },
            {
                scenario: 'Seller counters 3% below asking',
                theirOffer: Math.round(asking * 0.97),
                yourResponse: Math.round(initial * 1.03),
                reasoning: 'Modest increase to keep negotiation moving'
            },
            {
                scenario: 'Seller accepts',
                theirOffer: initial,
                yourResponse: initial,
                reasoning: 'Proceed to contract'
            }
        ];
    }

    private recommendContingencies(motivation: SellerMotivation, market: MarketConditions): string[] {
        const contingencies = ['Financing contingency'];

        if (market.marketType !== 'sellers') {
            contingencies.push('Inspection contingency (10 days)');
            contingencies.push('Appraisal contingency');
        }

        if (motivation.level !== 'low') {
            contingencies.push('Request seller-paid closing costs (2-3%)');
        }

        return contingencies;
    }

    private recommendClosingDate(motivation: SellerMotivation): string {
        if (motivation.level === 'high') {
            return 'Offer quick close (21 days) - increases appeal to motivated seller';
        }
        return 'Standard 30-45 day close appropriate';
    }

    // ============================================
    // CONFIDENCE CALCULATION
    // ============================================

    private calculateConfidence(comps: ComparableAnalysis, motivation: SellerMotivation): number {
        let confidence = 70;

        if (comps.comparables.length >= 5) confidence += 10;
        if (comps.comparables.every(c => c.similarity > 0.8)) confidence += 10;
        if (motivation.indicators.length >= 2) confidence += 5;

        return Math.min(95, confidence);
    }
}

// Types
interface PropertyData {
    id: string;
    askingPrice: number;
    sqft: number;
    daysOnMarket: number;
    priceReductions: number;
    isVacant: boolean;
    monthListed: number;
    condition: 'excellent' | 'good' | 'needs_work';
    hasPool?: boolean;
    hasView?: boolean;
    vastuScore?: number;
}

interface ComparableSale {
    address: string;
    salePrice: number;
    soldDate: string;
    daysOnMarket: number;
    sqft: number;
    pricePerSqft: number;
    similarity: number;
}

interface ComparableAnalysis {
    comparables: ComparableSale[];
    averagePricePerSqft: number;
    averageSalePrice: number;
    averageDaysOnMarket: number;
    suggestedPrice: number;
    priceVsAsking: string;
    listToSaleRatio: string;
}

interface SellerMotivation {
    score: number;
    level: 'high' | 'moderate' | 'low';
    indicators: string[];
    negotiationLeverage: string[];
    estimatedFlexibility: string;
}

interface MarketConditions {
    marketType: 'buyers' | 'sellers' | 'balanced';
    monthsOfInventory: number;
    priceAppreciation: number;
    avgDaysOnMarket: number;
    buyerAdvantage: number;
    insights: string[];
    recommendation: string;
}

interface FairValueEstimate {
    compBasedValue: number;
    adjustedValue: number;
    adjustments: { factor: string; amount: number }[];
    confidenceRange: { low: number; high: number };
    vsAskingPrice: string;
}

interface CounterOffer {
    scenario: string;
    theirOffer: number;
    yourResponse: number;
    reasoning: string;
}

interface OfferStrategy {
    initialOffer: number;
    initialOfferPercent: number;
    counterOfferScenarios: CounterOffer[];
    walkAwayPrice: number;
    contingencies: string[];
    closingDateStrategy: string;
    talkingPoints: string[];
}

interface NegotiationStrategy {
    id: string;
    propertyId: string;
    askingPrice: number;
    fairMarketValue: FairValueEstimate;
    buyerMaxPrice: number;
    comparableAnalysis: ComparableAnalysis;
    sellerMotivation: SellerMotivation;
    marketConditions: MarketConditions;
    recommendedOffer: number;
    offerStrategy: OfferStrategy;
    confidenceScore: number;
    generatedAt: string;
}

// Export singleton
export const aiNegotiationAgentService = new AINegotiationAgentService();
export default AINegotiationAgentService;
