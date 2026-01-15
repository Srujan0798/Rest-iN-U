import { BaseAgent, Property, PropertyAnalysis } from "./BaseAgent";

interface PropertyFeatures {
  locationScore: number;
  priceCompetitiveness: number;
  propertyCondition: number;
  marketDemand: number;
  amenitiesScore: number;
  accessibilityScore: number;
}

export class DiscoveryScout extends BaseAgent {
  constructor(agentId?: string) {
    super(agentId || `discovery-scout-${Date.now()}`, "discovery-scout");
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    await this.delay(Math.random() * 500 + 200);

    const features = await this.extractFeatures(property);
    const matchScore = this.calculateMatchScore(features);
    const confidence = this.calculateConfidence(features);
    const reasoning = this.generateReasoning(features, matchScore);

    return {
      agentId: this.agentId,
      propertyId: property.id,
      score: matchScore,
      confidence,
      reasoning,
      timestamp: new Date(),
    };
  }

  private async extractFeatures(property: Property): Promise<PropertyFeatures> {
    const locationScore = this.calculateLocationScore(property);
    const priceCompetitiveness = this.calculatePriceCompetitiveness(property);
    const propertyCondition = this.estimatePropertyCondition(property);
    const marketDemand = this.assessMarketDemand(property);
    const amenitiesScore = this.calculateAmenitiesScore(property);
    const accessibilityScore = this.calculateAccessibilityScore(property);

    return {
      locationScore,
      priceCompetitiveness,
      propertyCondition,
      marketDemand,
      amenitiesScore,
      accessibilityScore,
    };
  }

  private calculateLocationScore(property: Property): number {
    const scoreFactors = {
      neighborhood: property.neighborhood
        ? this.getNeighborhoodScore(property.neighborhood)
        : 5,
      address: property.address
        ? this.getAddressQualityScore(property.address)
        : 5,
    };

    return (
      Object.values(scoreFactors).reduce((sum, score) => sum + score, 0) /
      Object.keys(scoreFactors).length
    );
  }

  private calculatePriceCompetitiveness(property: Property): number {
    if (!property.price || !property.squareFootage) return 5;

    const pricePerSqft = property.price / property.squareFootage;
    const marketRate = 300;
    const competitiveness = Math.max(
      1,
      Math.min(10, (marketRate / pricePerSqft) * 5),
    );

    return competitiveness;
  }

  private estimatePropertyCondition(property: Property): number {
    if (!property.yearBuilt) return 6;

    const currentYear = new Date().getFullYear();
    const age = currentYear - property.yearBuilt;

    if (age <= 5) return 9;
    if (age <= 10) return 8;
    if (age <= 20) return 7;
    if (age <= 30) return 6;
    if (age <= 50) return 4;
    return 3;
  }

  private assessMarketDemand(property: Property): number {
    const demandFactors = {
      bedrooms: property.bedrooms >= 3 ? 8 : property.bedrooms >= 2 ? 6 : 4,
      bathrooms:
        property.bathrooms >= 2 ? 8 : property.bathrooms >= 1.5 ? 6 : 4,
      squareFootage:
        property.squareFootage >= 2000
          ? 9
          : property.squareFootage >= 1500
            ? 7
            : 5,
    };

    return (
      Object.values(demandFactors).reduce((sum, score) => sum + score, 0) /
      Object.keys(demandFactors).length
    );
  }

  private calculateAmenitiesScore(property: Property): number {
    let score = 5;

    if (property.bedrooms >= 3) score += 1;
    if (property.bathrooms >= 2) score += 1;
    if (property.squareFootage >= 2000) score += 1;
    if (property.propertyType === "single-family") score += 1;
    if (property.yearBuilt && property.yearBuilt >= 2000) score += 1;

    return Math.min(10, score);
  }

  private calculateAccessibilityScore(property: Property): number {
    if (!property.neighborhood) return 5;

    const accessibilityFactors = this.getNeighborhoodAccessibility(
      property.neighborhood,
    );
    return accessibilityFactors;
  }

  private calculateMatchScore(features: PropertyFeatures): number {
    const weights = {
      locationScore: 0.25,
      priceCompetitiveness: 0.2,
      propertyCondition: 0.15,
      marketDemand: 0.2,
      amenitiesScore: 0.1,
      accessibilityScore: 0.1,
    };

    return Object.entries(weights).reduce((total, [feature, weight]) => {
      return total + features[feature as keyof PropertyFeatures] * weight;
    }, 0);
  }

  private calculateConfidence(features: PropertyFeatures): number {
    const featureValues = Object.values(features);
    const variance =
      featureValues.reduce((sum, val) => {
        const mean =
          featureValues.reduce((s, v) => s + v, 0) / featureValues.length;
        return sum + Math.pow(val - mean, 2);
      }, 0) / featureValues.length;

    const consistency = Math.max(0, 1 - variance / 25);
    return Math.min(10, consistency * 10);
  }

  private generateReasoning(
    features: PropertyFeatures,
    matchScore: number,
  ): string {
    const topFeatures = Object.entries(features)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([feature, score]) => `${feature}: ${score.toFixed(1)}`);

    return `Match score ${matchScore.toFixed(2)} based on ${topFeatures.join(", ")}. Location and price competitiveness are key factors.`;
  }

  private getNeighborhoodScore(neighborhood: string): number {
    const highValueAreas = ["downtown", "uptown", "riverside", "lakeside"];
    const mediumValueAreas = ["suburban", "midtown", "westside", "eastside"];

    const normalized = neighborhood.toLowerCase();

    if (highValueAreas.some((area) => normalized.includes(area))) return 9;
    if (mediumValueAreas.some((area) => normalized.includes(area))) return 7;
    return 5;
  }

  private getAddressQualityScore(address: string): number {
    if (!address) return 5;

    const qualityIndicators = ["dr", "st", "ave", "blvd", "lane", "court"];
    const normalized = address.toLowerCase();

    const hasQualityIndicator = qualityIndicators.some((indicator) =>
      normalized.includes(indicator),
    );

    return hasQualityIndicator ? 7 : 5;
  }

  private getNeighborhoodAccessibility(neighborhood: string): number {
    const highAccess = ["downtown", "central", "metro", "transit"];
    const mediumAccess = ["suburban", "residential"];

    const normalized = neighborhood.toLowerCase();

    if (highAccess.some((area) => normalized.includes(area))) return 8;
    if (mediumAccess.some((area) => normalized.includes(area))) return 6;
    return 5;
  }
}
