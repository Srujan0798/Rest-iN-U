import { BaseAgent, Property, PropertyAnalysis } from "./BaseAgent";
import { JyotishMatcher, BirthDetails, PropertyJyotishDetails, JyotishCompatibility } from "./JyotishMatcher";
import { MuhuratCalculator, MuhuratDate, MuhuratPurpose } from "./MuhuratCalculator";

export interface JyotishAssessment {
  compatibility: JyotishCompatibility;
  nextAuspiciousVisit: MuhuratDate | null;
  overallRecommendation: string;
}

export class JyotishVidya extends BaseAgent {
  private matcher: JyotishMatcher;
  private muhurat: MuhuratCalculator;

  constructor(agentId?: string) {
    super(agentId || `jyotish-vidya-${Date.now()}`, "jyotish-vidya");
    this.matcher = new JyotishMatcher();
    this.muhurat = new MuhuratCalculator();
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    // Basic analysis delegates to matcher's general analysis
    const matcherAnalysis = await this.matcher.analyze(property);
    
    // Enrich with general muhurat info
    const muhuratAnalysis = await this.muhurat.analyze(property);

    return {
      agentId: this.agentId,
      propertyId: property.id,
      score: (matcherAnalysis.score + muhuratAnalysis.score) / 2,
      confidence: (matcherAnalysis.confidence + muhuratAnalysis.confidence) / 2,
      reasoning: `Combined Jyotish & Muhurat Analysis: ${matcherAnalysis.reasoning} ${muhuratAnalysis.reasoning}`,
      timestamp: new Date(),
    };
  }

  /**
   * Comprehensive Jyotish Assessment for a specific buyer and property
   */
  async assessCompatibilityAndTiming(
    birthDetails: BirthDetails,
    propertyDetails: PropertyJyotishDetails
  ): Promise<JyotishAssessment> {
    // 1. Check compatibility
    const compatibility = await this.matcher.matchBuyerToProperty(birthDetails, propertyDetails);

    // 2. Find next auspicious time for visit
    const visitDates = await this.muhurat.getAuspiciousDates("visit", 14);
    const nextAuspiciousVisit = visitDates.nextAuspiciousDate;

    // 3. Formulate overall recommendation
    let overallRecommendation = "";
    if (compatibility.recommendation === "HIGHLY_COMPATIBLE" || compatibility.recommendation === "COMPATIBLE") {
      overallRecommendation = `This property is astrologically favorable.`;
      if (nextAuspiciousVisit) {
        overallRecommendation += ` Plan a visit on ${nextAuspiciousVisit.date} (${nextAuspiciousVisit.dayName}).`;
      }
    } else {
      overallRecommendation = `This property has some astrological mismatches. Review the remedies before proceeding.`;
    }

    return {
      compatibility,
      nextAuspiciousVisit,
      overallRecommendation,
    };
  }

  // Expose underlying agents' methods for direct access
  
  async match(birthDetails: BirthDetails, propertyDetails: PropertyJyotishDetails) {
    return this.matcher.matchBuyerToProperty(birthDetails, propertyDetails);
  }

  async getMuhuratDates(purpose: MuhuratPurpose, days: number = 30) {
    return this.muhurat.getAuspiciousDates(purpose, days);
  }

  async checkDate(date: string) {
    return this.muhurat.checkDate(date);
  }
}
