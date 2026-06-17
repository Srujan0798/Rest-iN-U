import { BaseAgent, Property, PropertyAnalysis } from "./BaseAgent";

interface NegotiationStrategy {
  suggestedOffer: number;
  maxOffer: number;
  walkAwayPrice: number;
  tactics: string[];
  sellerMotivation: "High" | "Medium" | "Low";
  scripts: string[];
}

export class NegotiationStrategist extends BaseAgent {
  constructor(agentId?: string) {
    super(agentId || `negotiation-strategist-${Date.now()}`, "negotiation-strategist");
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    await this.delay(Math.random() * 500 + 200);

    const strategy = await this.developStrategy(property);
    const score = this.calculateNegotiabilityScore(strategy, property);

    return {
      agentId: this.agentId,
      propertyId: property.id,
      score,
      confidence: 8.5, // Strategies are usually high confidence based on math
      reasoning: this.generateReasoning(strategy, property),
      timestamp: new Date(),
    };
  }

  private async developStrategy(property: Property): Promise<NegotiationStrategy> {
    const listPrice = property.price || 0;

    // Simulate seller motivation based on days on market (mocked)
    const daysOnMarket = Math.floor(Math.random() * 120);
    let motivation: "High" | "Medium" | "Low" = "Low";
    if (daysOnMarket > 60) motivation = "Medium";
    if (daysOnMarket > 90) motivation = "High";

    // Determine discount factor
    let discount = 0.05; // Base 5%
    if (motivation === "Medium") discount = 0.08;
    if (motivation === "High") discount = 0.12;

    const suggestedOffer = Math.round(listPrice * (1 - discount));
    const maxOffer = Math.round(listPrice * (1 - (discount / 2)));
    const walkAwayPrice = Math.round(listPrice * 0.98); // Don't pay more than 98% unless hot market

    const tactics = [
      "Cite comparable sales in the neighborhood.",
      daysOnMarket > 60 ? "Highlight time on market to pressure seller." : "Move quickly to secure deal.",
      "Ask for furniture/fixtures to be included."
    ];

    const scripts = [
      `"Based on recent sales in [Neighborhood], we believe $${suggestedOffer.toLocaleString()} is fair market value."`,
      `"We are ready to close quickly if you can meet us at $${maxOffer.toLocaleString()}."`
    ];

    return {
      suggestedOffer,
      maxOffer,
      walkAwayPrice,
      tactics,
      sellerMotivation: motivation,
      scripts
    };
  }

  private calculateNegotiabilityScore(strategy: NegotiationStrategy, property: Property): number {
    // Higher score = more room to negotiate
    const potentialSavings = property.price ? (property.price - strategy.suggestedOffer) : 0;
    const savingsPercent = property.price ? (potentialSavings / property.price) * 100 : 0;

    if (savingsPercent > 10) return 9;
    if (savingsPercent > 7) return 8;
    if (savingsPercent > 5) return 7;
    if (savingsPercent > 3) return 6;
    return 5;
  }

  private generateReasoning(strategy: NegotiationStrategy, property: Property): string {
    const savings = property.price ? (property.price - strategy.suggestedOffer) : 0;

    return `Seller motivation appears ${strategy.sellerMotivation}. ` +
           `Suggest starting offer at $${strategy.suggestedOffer.toLocaleString()} ` +
           `(potential saving: $${savings.toLocaleString()}). ` +
           `Walk away if price exceeds $${strategy.walkAwayPrice.toLocaleString()}. ` +
           `Key tactic: ${strategy.tactics[0]}`;
  }
}
