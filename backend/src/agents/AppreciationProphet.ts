import { BaseAgent, PropertyAnalysis, Property } from './BaseAgent';

export class AppreciationProphet extends BaseAgent {
  name = 'Appreciation Prophet';
  role = 'Future Value Predictor';
  description = 'Predicts future property value based on market trends and infrastructure.';

  async analyze(property: Property): Promise<PropertyAnalysis> {
    // Mock Logic:
    // 1. Base growth rate (CAGR) based on City Tier
    // 2. Bonus for "Metro" or "IT Park" proximity

    let annualGrowthRate = 0.05; // 5% default

    const locationKeywords = property.location.address.toLowerCase();

    if (locationKeywords.includes('bangalore') || locationKeywords.includes('mumbai') || locationKeywords.includes('delhi')) {
      annualGrowthRate = 0.08; // Tier 1 cities
    }

    if (property.features.some(f => f.toLowerCase().includes('metro'))) {
      annualGrowthRate += 0.02; // +2% for Metro
    }

    const currentPrice = property.price;
    const priceIn5Years = currentPrice * Math.pow(1 + annualGrowthRate, 5);
    const totalAppreciation = priceIn5Years - currentPrice;
    const appreciationPercent = (totalAppreciation / currentPrice) * 100;

    // Score is based on appreciation potential (>50% in 5 years is 100/100)
    const score = Math.min(100, Math.round(appreciationPercent * 2));

    return {
      agentName: this.name,
      score: score,
      reasoning: [
        `Estimated Annual Growth Rate (CAGR): ${(annualGrowthRate * 100).toFixed(1)}%`,
        `Projected Value in 5 Years: ₹${(priceIn5Years / 100000).toFixed(2)} Lakhs`,
        `Key Drivers: ${locationKeywords.includes('metro') ? 'Metro Connectivity' : 'City Growth'}`
      ],
      confidence: 70, // Prediction is risky
      metadata: {
        cagr: annualGrowthRate,
        projectedValue5Y: priceIn5Years
      }
    };
  }
}
