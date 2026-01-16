import { BaseAgent, Property, PropertyAnalysis } from "./BaseAgent";

interface NeighborhoodMetrics {
  safetyScore: number;
  schoolRating: number;
  walkabilityScore: number;
  transitScore: number;
  amenitiesScore: number;
  noiseLevel: number;
  growthPotential: number;
  communityVibes: string[];
}

interface LocalAmenities {
  restaurants: number;
  groceryStores: number;
  hospitals: number;
  parks: number;
  gyms: number;
  schools: number;
  publicTransit: number;
}

interface NeighborhoodAnalysis {
  metrics: NeighborhoodMetrics;
  amenities: LocalAmenities;
  pros: string[];
  cons: string[];
  futureOutlook: string;
  comparableNeighborhoods: string[];
}

export class NeighborhoodOracle extends BaseAgent {
  constructor(agentId?: string) {
    super(agentId || `neighborhood-oracle-${Date.now()}`, "neighborhood-oracle");
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    await this.delay(Math.random() * 550 + 275);

    const neighborhoodAnalysis = await this.analyzeNeighborhood(property);
    const score = this.calculateNeighborhoodScore(neighborhoodAnalysis);
    const confidence = this.calculateConfidence(neighborhoodAnalysis);
    const reasoning = this.generateReasoning(neighborhoodAnalysis);

    return {
      agentId: this.agentId,
      propertyId: property.id,
      score,
      confidence,
      reasoning,
      timestamp: new Date(),
    };
  }

  private async analyzeNeighborhood(
    property: Property
  ): Promise<NeighborhoodAnalysis> {
    const metrics = this.assessNeighborhoodMetrics(property);
    const amenities = this.assessLocalAmenities(property);
    const pros = this.identifyPros(metrics, amenities);
    const cons = this.identifyCons(metrics, amenities);
    const futureOutlook = this.assessFutureOutlook(property, metrics);
    const comparableNeighborhoods = this.findComparableNeighborhoods(property);

    return {
      metrics,
      amenities,
      pros,
      cons,
      futureOutlook,
      comparableNeighborhoods,
    };
  }

  private assessNeighborhoodMetrics(property: Property): NeighborhoodMetrics {
    const neighborhood = property.neighborhood?.toLowerCase() || "";

    // Base scores with some randomness to simulate real data
    let safetyScore = 7 + (Math.random() - 0.5) * 2;
    let schoolRating = 6 + (Math.random() - 0.5) * 3;
    let walkabilityScore = 5 + (Math.random() - 0.5) * 4;
    let transitScore = 5 + (Math.random() - 0.5) * 4;
    let amenitiesScore = 6 + (Math.random() - 0.5) * 3;
    let noiseLevel = 4 + (Math.random() - 0.5) * 3;
    let growthPotential = 6 + (Math.random() - 0.5) * 3;

    // Adjust based on neighborhood type indicators
    if (
      neighborhood.includes("downtown") ||
      neighborhood.includes("urban") ||
      neighborhood.includes("city")
    ) {
      walkabilityScore += 2;
      transitScore += 2;
      amenitiesScore += 1.5;
      noiseLevel += 2;
      safetyScore -= 0.5;
    }

    if (
      neighborhood.includes("suburban") ||
      neighborhood.includes("residential")
    ) {
      safetyScore += 1;
      schoolRating += 1;
      noiseLevel -= 1.5;
      walkabilityScore -= 1;
      transitScore -= 1;
    }

    if (neighborhood.includes("gated") || neighborhood.includes("premium")) {
      safetyScore += 1.5;
      schoolRating += 1;
      amenitiesScore += 1;
    }

    if (
      neighborhood.includes("industrial") ||
      neighborhood.includes("commercial")
    ) {
      safetyScore -= 1;
      schoolRating -= 1;
      noiseLevel += 2;
      amenitiesScore -= 1;
    }

    if (neighborhood.includes("historic") || neighborhood.includes("heritage")) {
      walkabilityScore += 1;
      amenitiesScore += 0.5;
      growthPotential -= 0.5; // Limited development potential
    }

    // Community vibes based on characteristics
    const communityVibes = this.determineCommunityVibes(
      neighborhood,
      property.propertyType
    );

    return {
      safetyScore: this.clamp(safetyScore, 1, 10),
      schoolRating: this.clamp(schoolRating, 1, 10),
      walkabilityScore: this.clamp(walkabilityScore, 1, 10),
      transitScore: this.clamp(transitScore, 1, 10),
      amenitiesScore: this.clamp(amenitiesScore, 1, 10),
      noiseLevel: this.clamp(noiseLevel, 1, 10),
      growthPotential: this.clamp(growthPotential, 1, 10),
      communityVibes,
    };
  }

  private determineCommunityVibes(
    neighborhood: string,
    propertyType?: string
  ): string[] {
    const vibes: string[] = [];

    if (neighborhood.includes("family") || neighborhood.includes("suburban")) {
      vibes.push("Family-friendly", "Quiet streets", "Community events");
    }

    if (neighborhood.includes("downtown") || neighborhood.includes("urban")) {
      vibes.push("Vibrant nightlife", "Cultural diversity", "Fast-paced");
    }

    if (neighborhood.includes("historic")) {
      vibes.push("Charming architecture", "Established community", "Tree-lined streets");
    }

    if (neighborhood.includes("tech") || neighborhood.includes("innovation")) {
      vibes.push("Young professionals", "Startup culture", "Modern amenities");
    }

    if (neighborhood.includes("beach") || neighborhood.includes("coastal")) {
      vibes.push("Laid-back lifestyle", "Outdoor activities", "Tourist presence");
    }

    if (propertyType === "condo" || propertyType === "townhouse") {
      vibes.push("HOA community", "Shared amenities");
    }

    // Add default vibes if none matched
    if (vibes.length === 0) {
      vibes.push("Mixed community", "Growing area");
    }

    return vibes;
  }

  private assessLocalAmenities(property: Property): LocalAmenities {
    const neighborhood = property.neighborhood?.toLowerCase() || "";
    const isUrban =
      neighborhood.includes("downtown") ||
      neighborhood.includes("urban") ||
      neighborhood.includes("city");

    const baseMultiplier = isUrban ? 1.5 : 0.8;

    return {
      restaurants: Math.round((15 + Math.random() * 20) * baseMultiplier),
      groceryStores: Math.round((3 + Math.random() * 4) * baseMultiplier),
      hospitals: Math.round((1 + Math.random() * 2) * baseMultiplier),
      parks: Math.round((4 + Math.random() * 6) * (isUrban ? 0.7 : 1.3)),
      gyms: Math.round((3 + Math.random() * 5) * baseMultiplier),
      schools: Math.round((4 + Math.random() * 4) * (isUrban ? 0.8 : 1.2)),
      publicTransit: Math.round((2 + Math.random() * 8) * (isUrban ? 2 : 0.5)),
    };
  }

  private identifyPros(
    metrics: NeighborhoodMetrics,
    amenities: LocalAmenities
  ): string[] {
    const pros: string[] = [];

    if (metrics.safetyScore >= 8) {
      pros.push("Excellent safety record and low crime rates");
    } else if (metrics.safetyScore >= 7) {
      pros.push("Good neighborhood safety");
    }

    if (metrics.schoolRating >= 8) {
      pros.push("Top-rated schools in the district");
    } else if (metrics.schoolRating >= 7) {
      pros.push("Above-average school ratings");
    }

    if (metrics.walkabilityScore >= 8) {
      pros.push("Highly walkable - daily errands on foot");
    } else if (metrics.walkabilityScore >= 7) {
      pros.push("Good walkability to local shops");
    }

    if (metrics.transitScore >= 8) {
      pros.push("Excellent public transit access");
    }

    if (metrics.amenitiesScore >= 8) {
      pros.push("Rich variety of local amenities");
    }

    if (metrics.noiseLevel <= 3) {
      pros.push("Very quiet and peaceful environment");
    } else if (metrics.noiseLevel <= 5) {
      pros.push("Reasonable noise levels");
    }

    if (metrics.growthPotential >= 8) {
      pros.push("High neighborhood appreciation potential");
    }

    if (amenities.parks >= 6) {
      pros.push("Abundant green spaces and parks nearby");
    }

    if (amenities.restaurants >= 20) {
      pros.push("Diverse dining options within walking distance");
    }

    return pros;
  }

  private identifyCons(
    metrics: NeighborhoodMetrics,
    amenities: LocalAmenities
  ): string[] {
    const cons: string[] = [];

    if (metrics.safetyScore < 5) {
      cons.push("Safety concerns - research crime statistics");
    } else if (metrics.safetyScore < 6) {
      cons.push("Some safety considerations to be aware of");
    }

    if (metrics.schoolRating < 5) {
      cons.push("Below-average school ratings");
    }

    if (metrics.walkabilityScore < 4) {
      cons.push("Car-dependent area - limited walkability");
    }

    if (metrics.transitScore < 4) {
      cons.push("Limited public transportation options");
    }

    if (metrics.noiseLevel >= 7) {
      cons.push("Higher noise levels - urban environment");
    } else if (metrics.noiseLevel >= 6) {
      cons.push("Moderate noise from traffic or commercial activity");
    }

    if (metrics.growthPotential < 5) {
      cons.push("Limited appreciation potential");
    }

    if (amenities.groceryStores < 2) {
      cons.push("Few grocery options nearby");
    }

    if (amenities.hospitals < 1) {
      cons.push("Medical facilities not immediately accessible");
    }

    if (amenities.parks < 2) {
      cons.push("Limited green spaces in the area");
    }

    return cons;
  }

  private assessFutureOutlook(
    property: Property,
    metrics: NeighborhoodMetrics
  ): string {
    const growthPotential = metrics.growthPotential;

    if (growthPotential >= 8) {
      return "Strong growth outlook. Area shows signs of significant development and increasing property values. Investment potential is high.";
    }

    if (growthPotential >= 6) {
      return "Positive outlook. Neighborhood is stable with moderate growth expected. Good long-term hold potential.";
    }

    if (growthPotential >= 5) {
      return "Stable outlook. Area is established with steady property values. Appreciation will likely track market averages.";
    }

    if (growthPotential >= 4) {
      return "Mixed outlook. Some positive indicators but growth may be slower than market average.";
    }

    return "Cautious outlook. Area may face challenges. Recommend thorough research into local development plans.";
  }

  private findComparableNeighborhoods(property: Property): string[] {
    const neighborhood = property.neighborhood?.toLowerCase() || "";
    const comparables: string[] = [];

    if (neighborhood.includes("downtown")) {
      comparables.push("Midtown", "Arts District", "Financial District");
    } else if (neighborhood.includes("suburban")) {
      comparables.push("Oak Park", "Maple Heights", "Riverside");
    } else if (neighborhood.includes("historic")) {
      comparables.push("Heritage Row", "Victorian Quarter", "Old Town");
    } else if (neighborhood.includes("beach") || neighborhood.includes("coastal")) {
      comparables.push("Marina District", "Bayview", "Harbor Point");
    } else {
      comparables.push("Westside", "Northgate", "Eastwood");
    }

    return comparables;
  }

  private calculateNeighborhoodScore(analysis: NeighborhoodAnalysis): number {
    const metrics = analysis.metrics;

    // Weighted average of key metrics
    const weights = {
      safetyScore: 0.25,
      schoolRating: 0.15,
      walkabilityScore: 0.15,
      transitScore: 0.1,
      amenitiesScore: 0.15,
      noiseLevel: 0.1, // Lower is better, so we'll invert
      growthPotential: 0.1,
    };

    let score = 0;
    score += metrics.safetyScore * weights.safetyScore;
    score += metrics.schoolRating * weights.schoolRating;
    score += metrics.walkabilityScore * weights.walkabilityScore;
    score += metrics.transitScore * weights.transitScore;
    score += metrics.amenitiesScore * weights.amenitiesScore;
    score += (10 - metrics.noiseLevel) * weights.noiseLevel; // Invert noise
    score += metrics.growthPotential * weights.growthPotential;

    // Adjust based on pros/cons balance
    const prosConsRatio =
      analysis.pros.length / Math.max(1, analysis.cons.length);
    if (prosConsRatio > 2) score += 0.5;
    else if (prosConsRatio < 0.5) score -= 0.5;

    return this.clamp(score, 1, 10);
  }

  private calculateConfidence(analysis: NeighborhoodAnalysis): number {
    let confidence = 7; // Base confidence

    // More data points = higher confidence
    const dataPoints =
      analysis.pros.length +
      analysis.cons.length +
      analysis.comparableNeighborhoods.length;
    confidence += Math.min(2, dataPoints * 0.1);

    // Clearer outlook = higher confidence
    if (
      analysis.futureOutlook.includes("Strong") ||
      analysis.futureOutlook.includes("Cautious")
    ) {
      confidence += 0.5;
    }

    // Having comparable neighborhoods adds confidence
    if (analysis.comparableNeighborhoods.length >= 3) {
      confidence += 0.5;
    }

    return this.clamp(confidence, 1, 10);
  }

  private generateReasoning(analysis: NeighborhoodAnalysis): string {
    const metrics = analysis.metrics;

    let reasoning = `Safety: ${metrics.safetyScore.toFixed(1)}/10, Schools: ${metrics.schoolRating.toFixed(1)}/10, Walkability: ${metrics.walkabilityScore.toFixed(1)}/10. `;

    reasoning += `${analysis.pros.length} positive factors, ${analysis.cons.length} considerations. `;

    if (metrics.communityVibes.length > 0) {
      reasoning += `Vibes: ${metrics.communityVibes.slice(0, 2).join(", ")}. `;
    }

    // Summarize outlook
    if (analysis.futureOutlook.includes("Strong")) {
      reasoning += "Strong growth potential.";
    } else if (analysis.futureOutlook.includes("Positive")) {
      reasoning += "Positive growth outlook.";
    } else if (analysis.futureOutlook.includes("Cautious")) {
      reasoning += "Growth outlook requires caution.";
    } else {
      reasoning += "Stable outlook.";
    }

    return reasoning;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  getNeighborhoodAnalysis(property: Property): Promise<NeighborhoodAnalysis> {
    return this.analyzeNeighborhood(property);
  }
}
