import { BaseAgent, Property, PropertyAnalysis } from "./BaseAgent";

interface Amenity {
  name: string;
  type: "school" | "hospital" | "park" | "transit" | "shopping";
  distance: number; // in km
  rating: number; // 0-5
}

interface CommuteData {
  destination: string;
  timePeak: number; // minutes
  timeOffPeak: number; // minutes
  method: "driving" | "transit" | "walking";
}

interface LifestyleAssessment {
  overallScore: number;
  familyFitScore: number;
  convenienceScore: number;
  amenities: Amenity[];
  commute: CommuteData[];
  summary: string;
}

export class LifestyleMapper extends BaseAgent {
  constructor(agentId?: string) {
    super(agentId || `lifestyle-mapper-${Date.now()}`, "lifestyle-mapper");
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    await this.delay(Math.random() * 500 + 200);

    const assessment = await this.assessLifestyle(property);

    return {
      agentId: this.agentId,
      propertyId: property.id,
      score: assessment.overallScore,
      confidence: this.calculateConfidence(assessment),
      reasoning: assessment.summary,
      timestamp: new Date(),
    };
  }

  private async assessLifestyle(property: Property): Promise<LifestyleAssessment> {
    const amenities = this.findNearbyAmenities(property);
    const commute = this.calculateCommutes(property);

    const familyFitScore = this.calculateFamilyFit(amenities, property);
    const convenienceScore = this.calculateConvenience(amenities, commute);

    const overallScore = (familyFitScore + convenienceScore) / 2;
    const summary = this.generateSummary(familyFitScore, convenienceScore, amenities);

    return {
      overallScore,
      familyFitScore,
      convenienceScore,
      amenities,
      commute,
      summary
    };
  }

  private findNearbyAmenities(property: Property): Amenity[] {
    // Simulated data discovery based on property location (mocked)
    const count = 5 + Math.floor(Math.random() * 5);
    const amenities: Amenity[] = [];
    const types: ("school" | "hospital" | "park" | "transit" | "shopping")[] =
      ["school", "hospital", "park", "transit", "shopping"];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      amenities.push({
        name: `${property.neighborhood || "Local"} ${this.capitalize(type)} ${i+1}`,
        type,
        distance: Number((Math.random() * 5).toFixed(1)),
        rating: Number((3 + Math.random() * 2).toFixed(1))
      });
    }

    return amenities.sort((a, b) => a.distance - b.distance);
  }

  private calculateCommutes(property: Property): CommuteData[] {
    // Simulated commute calculation
    return [
      {
        destination: "City Center",
        timePeak: 30 + Math.floor(Math.random() * 30),
        timeOffPeak: 15 + Math.floor(Math.random() * 15),
        method: "driving"
      },
      {
        destination: "IT Park",
        timePeak: 45 + Math.floor(Math.random() * 20),
        timeOffPeak: 25 + Math.floor(Math.random() * 10),
        method: "transit"
      }
    ];
  }

  private calculateFamilyFit(amenities: Amenity[], property: Property): number {
    let score = 5;

    // Schools are critical for families
    const schools = amenities.filter(a => a.type === "school");
    if (schools.some(s => s.distance < 2 && s.rating > 4)) score += 3;
    else if (schools.some(s => s.distance < 5)) score += 1;

    // Parks add value
    const parks = amenities.filter(a => a.type === "park");
    if (parks.some(p => p.distance < 1)) score += 2;

    // Bedrooms check
    if (property.bedrooms >= 3) score += 1; // Good for families
    if (property.bedrooms < 2) score -= 2; // Less ideal for families

    return Math.min(10, Math.max(1, score));
  }

  private calculateConvenience(amenities: Amenity[], commute: CommuteData[]): number {
    let score = 5;

    // Proximity to essentials
    const closeAmenities = amenities.filter(a => a.distance < 1.5).length;
    score += closeAmenities * 0.5;

    // Commute impact
    const avgCommute = commute.reduce((sum, c) => sum + c.timePeak, 0) / commute.length;
    if (avgCommute < 30) score += 2;
    else if (avgCommute > 60) score -= 2;

    return Math.min(10, Math.max(1, score));
  }

  private calculateConfidence(assessment: LifestyleAssessment): number {
    // More amenities found = higher confidence in the assessment
    const amenityCount = assessment.amenities.length;
    return Math.min(9.5, 5 + (amenityCount * 0.5));
  }

  private generateSummary(familyFit: number, convenience: number, amenities: Amenity[]): string {
    const topAmenities = amenities.slice(0, 3).map(a => `${a.name} (${a.distance}km, ${a.rating}★)`).join(", ");

    let verdict = "Balanced choice.";
    if (familyFit > 8) verdict = "Excellent for families.";
    else if (convenience > 8) verdict = "Highly convenient location.";
    else if (familyFit < 4) verdict = "May not be ideal for families.";

    return `${verdict} Family Score: ${familyFit.toFixed(1)}/10. Convenience: ${convenience.toFixed(1)}/10. Nearby: ${topAmenities}.`;
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
