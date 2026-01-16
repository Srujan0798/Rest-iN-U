import { BaseAgent, PropertyAnalysis, Property } from './BaseAgent';

export class NegotiationStrategist extends BaseAgent {
  name = 'Negotiation Strategist';
  role = 'Deal Closer';
  description = 'Analyzes market heat and suggests negotiation tactics.';

  async analyze(property: Property): Promise<PropertyAnalysis> {
    // Mock Logic:
    // 1. Check "Days on Market" (DOM)
    // 2. Compare List Price vs "Fair Value" (mocked)

    // Simulate DOM if not present
    const daysOnMarket = Math.floor(Math.random() * 180); // 0-180 days

    let negotiationLeverage = 'LOW';
    let suggestedOfferDiscount = 0; // % discount to ask

    if (daysOnMarket > 90) {
      negotiationLeverage = 'HIGH';
      suggestedOfferDiscount = 10; // Ask for 10% off
    } else if (daysOnMarket > 30) {
      negotiationLeverage = 'MEDIUM';
      suggestedOfferDiscount = 5;
    } else {
      negotiationLeverage = 'LOW'; // Hot property
      suggestedOfferDiscount = 0; // Full ask
    }

    const targetPrice = property.price * (1 - (suggestedOfferDiscount / 100));

    return {
      agentName: this.name,
      score: daysOnMarket > 60 ? 80 : 40, // High score means "Good Deal Potential"
      reasoning: [
        `Property has been on market for ${daysOnMarket} days (${negotiationLeverage} buyer leverage).`,
        daysOnMarket > 90 ? 'Seller likely motivated. Aggressive offer recommended.' : 'Fresh listing. Expect competition.',
        `Suggested Opening Offer: ₹${(targetPrice / 100000).toFixed(2)} Lakhs (-${suggestedOfferDiscount}%)`
      ],
      confidence: 75,
      metadata: {
        daysOnMarket,
        leverage: negotiationLeverage,
        suggestedDiscount: suggestedOfferDiscount
      }
    };
  }
}
