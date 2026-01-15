import { BaseAgent, Property, PropertyAnalysis } from "./BaseAgent";

interface MarketData {
  comparableSales: ComparableSale[];
  neighborhoodAverage: number;
  marketTrend: "rising" | "stable" | "declining";
  pricePerSquareFoot: number;
  daysOnMarket: number;
}

interface ComparableSale {
  price: number;
  squareFootage: number;
  beds: number;
  baths: number;
  distance: number;
  saleDate: Date;
}

export class ValuationOracle extends BaseAgent {
  private marketDataCache: Map<string, MarketData>;

  constructor(agentId?: string) {
    super(agentId || `valuation-oracle-${Date.now()}`, "valuation-oracle");
    this.marketDataCache = new Map();
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    await this.delay(Math.random() * 800 + 400);

    const marketData = await this.getMarketData(property);
    const fairPrice = this.calculateFairPrice(property, marketData);
    const valuationScore = this.calculateValuationScore(property, fairPrice);
    const confidence = this.calculateValuationConfidence(marketData);
    const reasoning = this.generateValuationReasoning(
      property,
      fairPrice,
      marketData,
    );

    return {
      agentId: this.agentId,
      propertyId: property.id,
      score: valuationScore,
      confidence,
      reasoning,
      timestamp: new Date(),
    };
  }

  private async getMarketData(property: Property): Promise<MarketData> {
    const cacheKey = `${property.neighborhood}-${property.propertyType}`;

    if (this.marketDataCache.has(cacheKey)) {
      return this.marketDataCache.get(cacheKey)!;
    }

    const marketData = await this.fetchMarketData(property);
    this.marketDataCache.set(cacheKey, marketData);

    return marketData;
  }

  private async fetchMarketData(property: Property): Promise<MarketData> {
    const comparableSales = this.generateComparableSales(property);
    const neighborhoodAverage =
      this.calculateNeighborhoodAverage(comparableSales);
    const marketTrend = this.determineMarketTrend(property);
    const pricePerSquareFoot =
      this.calculatePricePerSquareFoot(comparableSales);
    const daysOnMarket = this.estimateDaysOnMarket(property);

    return {
      comparableSales,
      neighborhoodAverage,
      marketTrend,
      pricePerSquareFoot,
      daysOnMarket,
    };
  }

  private calculateFairPrice(
    property: Property,
    marketData: MarketData,
  ): number {
    const basePrice = this.calculateBasePrice(property, marketData);
    const adjustments = this.calculateAdjustments(property, marketData);

    return basePrice + adjustments;
  }

  private calculateBasePrice(
    property: Property,
    marketData: MarketData,
  ): number {
    if (property.squareFootage) {
      return marketData.pricePerSquareFoot * property.squareFootage;
    }

    const compsWithSameBeds = marketData.comparableSales
      .filter((comp) => comp.beds === property.bedrooms)
      .map((comp) => comp.price);

    if (compsWithSameBeds.length > 0) {
      return (
        compsWithSameBeds.reduce((sum, price) => sum + price, 0) /
        compsWithSameBeds.length
      );
    }

    return marketData.neighborhoodAverage;
  }

  private calculateAdjustments(
    property: Property,
    marketData: MarketData,
  ): number {
    let adjustment = 0;

    if (property.yearBuilt) {
      const ageAdjustment = this.calculateAgeAdjustment(property.yearBuilt);
      adjustment += ageAdjustment;
    }

    const bedBathAdjustment = this.calculateBedBathAdjustment(
      property,
      marketData,
    );
    adjustment += bedBathAdjustment;

    const marketTrendAdjustment = this.calculateMarketTrendAdjustment(
      marketData.marketTrend,
    );
    adjustment += marketTrendAdjustment;

    return adjustment;
  }

  private calculateAgeAdjustment(yearBuilt: number): number {
    const currentYear = new Date().getFullYear();
    const age = currentYear - yearBuilt;

    if (age <= 5) return 50000;
    if (age <= 10) return 30000;
    if (age <= 20) return 10000;
    if (age <= 30) return -5000;
    if (age <= 50) return -15000;
    return -30000;
  }

  private calculateBedBathAdjustment(
    property: Property,
    marketData: MarketData,
  ): number {
    const avgComps = marketData.comparableSales.reduce(
      (acc, comp) => ({
        beds: acc.beds + comp.beds / marketData.comparableSales.length,
        baths: acc.baths + comp.baths / marketData.comparableSales.length,
      }),
      { beds: 0, baths: 0 },
    );

    let adjustment = 0;

    if (property.bedrooms > avgComps.beds) {
      adjustment += (property.bedrooms - avgComps.beds) * 25000;
    } else if (property.bedrooms < avgComps.beds) {
      adjustment -= (avgComps.beds - property.bedrooms) * 20000;
    }

    if (property.bathrooms > avgComps.baths) {
      adjustment += (property.bathrooms - avgComps.baths) * 15000;
    } else if (property.bathrooms < avgComps.baths) {
      adjustment -= (avgComps.baths - property.bathrooms) * 12000;
    }

    return adjustment;
  }

  private calculateMarketTrendAdjustment(marketTrend: string): number {
    switch (marketTrend) {
      case "rising":
        return 0.05;
      case "stable":
        return 0;
      case "declining":
        return -0.05;
      default:
        return 0;
    }
  }

  private calculateValuationScore(
    property: Property,
    fairPrice: number,
  ): number {
    if (!property.price) return 5;

    const priceDifference = Math.abs(property.price - fairPrice);
    const priceDifferencePercent = (priceDifference / fairPrice) * 100;

    if (priceDifferencePercent <= 5) return 10;
    if (priceDifferencePercent <= 10) return 9;
    if (priceDifferencePercent <= 15) return 8;
    if (priceDifferencePercent <= 20) return 6;
    if (priceDifferencePercent <= 30) return 4;
    if (priceDifferencePercent <= 40) return 2;
    return 1;
  }

  private calculateValuationConfidence(marketData: MarketData): number {
    const compCount = marketData.comparableSales.length;
    let confidence = Math.min(10, compCount * 2);

    const avgDistance =
      marketData.comparableSales.reduce((sum, comp) => sum + comp.distance, 0) /
      compCount;

    if (avgDistance <= 0.5) confidence += 1;
    else if (avgDistance <= 1) confidence += 0.5;
    else if (avgDistance > 2) confidence -= 1;

    const varianceScore = this.calculateComparableVariance(
      marketData.comparableSales,
    );
    confidence += varianceScore;

    return Math.max(1, Math.min(10, confidence));
  }

  private calculateComparableVariance(comps: ComparableSale[]): number {
    if (comps.length < 2) return 0;

    const prices = comps.map((comp) => comp.price);
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance =
      prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) /
      prices.length;
    const coefficientOfVariation = Math.sqrt(variance) / mean;

    if (coefficientOfVariation <= 0.1) return 2;
    if (coefficientOfVariation <= 0.2) return 1;
    if (coefficientOfVariation <= 0.3) return 0;
    return -1;
  }

  private generateValuationReasoning(
    property: Property,
    fairPrice: number,
    marketData: MarketData,
  ): string {
    const priceDiff = property.price ? property.price - fairPrice : 0;
    const priceDiffPercent = property.price
      ? (Math.abs(priceDiff) / fairPrice) * 100
      : 0;

    let reasoning = `Fair value: $${fairPrice.toLocaleString()}`;

    if (property.price) {
      reasoning += `. Current price: $${property.price.toLocaleString()} (${priceDiff > 0 ? "+" : ""}$${priceDiff.toLocaleString()}, ${priceDiffPercent.toFixed(1)}%)`;
    }

    reasoning += `. Based on ${marketData.comparableSales.length} comparable properties at $${marketData.pricePerSquareFoot}/sqft`;

    if (marketData.marketTrend !== "stable") {
      reasoning += `. Market is ${marketData.marketTrend}`;
    }

    return reasoning;
  }

  private generateComparableSales(property: Property): ComparableSale[] {
    const basePrice = property.price || 500000;
    const baseSqft = property.squareFootage || 1500;

    const comparables: ComparableSale[] = [];
    const compCount = 5;

    for (let i = 0; i < compCount; i++) {
      const priceVariation = (Math.random() - 0.5) * 0.3;
      const sqftVariation = (Math.random() - 0.5) * 400;
      const bedVariation =
        Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
      const bathVariation =
        Math.random() > 0.8 ? (Math.random() > 0.5 ? 0.5 : -0.5) : 0;

      comparables.push({
        price: Math.round(basePrice * (1 + priceVariation)),
        squareFootage: Math.round(baseSqft + sqftVariation),
        beds: Math.max(1, (property.bedrooms || 3) + bedVariation),
        baths: Math.max(1, (property.bathrooms || 2) + bathVariation),
        distance: Math.random() * 2,
        saleDate: new Date(
          Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
        ),
      });
    }

    return comparables;
  }

  private calculateNeighborhoodAverage(comparables: ComparableSale[]): number {
    return (
      comparables.reduce((sum, comp) => sum + comp.price, 0) /
      comparables.length
    );
  }

  private determineMarketTrend(
    property: Property,
  ): "rising" | "stable" | "declining" {
    const random = Math.random();
    if (random < 0.3) return "rising";
    if (random < 0.7) return "stable";
    return "declining";
  }

  private calculatePricePerSquareFoot(comparables: ComparableSale[]): number {
    const avgPricePerSqft =
      comparables.reduce((sum, comp) => {
        return sum + comp.price / comp.squareFootage;
      }, 0) / comparables.length;

    return Math.round(avgPricePerSqft);
  }

  private estimateDaysOnMarket(property: Property): number {
    const baseDays = 45;
    const variation = Math.random() * 60 - 30;
    return Math.max(1, Math.round(baseDays + variation));
  }
}
