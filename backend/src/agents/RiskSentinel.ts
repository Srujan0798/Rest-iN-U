import { BaseAgent, Property, PropertyAnalysis } from "./BaseAgent";

interface RiskFactors {
  marketRisk: number;
  locationRisk: number;
  propertyConditionRisk: number;
  financialRisk: number;
  legalRisk: number;
  environmentalRisk: number;
  liquidityRisk: number;
}

interface RiskAssessment {
  overallRisk: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  factors: RiskFactors;
  mitigations: string[];
  warnings: string[];
}

export class RiskSentinel extends BaseAgent {
  private riskThresholds = {
    low: 2.5,
    moderate: 5.0,
    high: 7.5,
    critical: 10,
  };

  constructor(agentId?: string) {
    super(agentId || `risk-sentinel-${Date.now()}`, "risk-sentinel");
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    await this.delay(Math.random() * 600 + 300);

    const riskAssessment = await this.assessAllRisks(property);
    const score = this.calculateRiskScore(riskAssessment);
    const confidence = this.calculateConfidence(riskAssessment);
    const reasoning = this.generateReasoning(riskAssessment);

    return {
      agentId: this.agentId,
      propertyId: property.id,
      score,
      confidence,
      reasoning,
      timestamp: new Date(),
    };
  }

  private async assessAllRisks(property: Property): Promise<RiskAssessment> {
    const factors: RiskFactors = {
      marketRisk: this.assessMarketRisk(property),
      locationRisk: this.assessLocationRisk(property),
      propertyConditionRisk: this.assessPropertyConditionRisk(property),
      financialRisk: this.assessFinancialRisk(property),
      legalRisk: this.assessLegalRisk(property),
      environmentalRisk: this.assessEnvironmentalRisk(property),
      liquidityRisk: this.assessLiquidityRisk(property),
    };

    const overallRisk = this.calculateOverallRisk(factors);
    const riskLevel = this.determineRiskLevel(overallRisk);
    const mitigations = this.generateMitigations(factors);
    const warnings = this.generateWarnings(factors);

    return {
      overallRisk,
      riskLevel,
      factors,
      mitigations,
      warnings,
    };
  }

  private assessMarketRisk(property: Property): number {
    let risk = 3;

    // Price volatility risk
    if (property.price) {
      const pricePerSqft = property.squareFootage
        ? property.price / property.squareFootage
        : 0;

      if (pricePerSqft > 500)
        risk += 2; // Premium pricing increases risk
      else if (pricePerSqft < 150) risk += 1; // Below market could indicate issues
    }

    // Property type risk
    switch (property.propertyType) {
      case "single-family":
        risk -= 1;
        break;
      case "condo":
      case "townhouse":
        // no change
        break;
      case "multi-family":
        risk += 1;
        break;
      case "commercial":
        risk += 2;
        break;
      case "land":
        risk += 3;
        break;
    }

    return Math.max(1, Math.min(10, risk));
  }

  private assessLocationRisk(property: Property): number {
    let risk = 4;

    if (!property.neighborhood) return risk;

    const normalized = property.neighborhood.toLowerCase();

    // High-risk area indicators
    const highRiskIndicators = ["industrial", "flood", "crime", "remote"];
    const lowRiskIndicators = [
      "downtown",
      "suburban",
      "residential",
      "gated",
      "premium",
    ];

    highRiskIndicators.forEach((indicator) => {
      if (normalized.includes(indicator)) risk += 2;
    });

    lowRiskIndicators.forEach((indicator) => {
      if (normalized.includes(indicator)) risk -= 1;
    });

    return Math.max(1, Math.min(10, risk));
  }

  private assessPropertyConditionRisk(property: Property): number {
    if (!property.yearBuilt) return 5;

    const currentYear = new Date().getFullYear();
    const age = currentYear - property.yearBuilt;

    if (age <= 5) return 1;
    if (age <= 10) return 2;
    if (age <= 20) return 3;
    if (age <= 30) return 5;
    if (age <= 50) return 7;
    return 9;
  }

  private assessFinancialRisk(property: Property): number {
    let risk = 4;

    if (property.price) {
      // Higher price = higher financial exposure
      if (property.price > 1000000) risk += 2;
      else if (property.price > 500000) risk += 1;
      else if (property.price < 200000) risk -= 1;
    }

    // Price per bedroom analysis
    if (property.price && property.bedrooms) {
      const pricePerBed = property.price / property.bedrooms;
      if (pricePerBed > 300000) risk += 1;
      else if (pricePerBed < 100000) risk -= 1;
    }

    return Math.max(1, Math.min(10, risk));
  }

  private assessLegalRisk(property: Property): number {
    let risk = 3;

    // Older properties may have title complexities
    if (property.yearBuilt && property.yearBuilt < 1970) {
      risk += 2;
    }

    // Certain property types have more legal complexity
    if (property.propertyType === "multi-family") risk += 1;
    if (property.propertyType === "commercial") risk += 2;
    if (property.propertyType === "land") risk += 1;

    return Math.max(1, Math.min(10, risk));
  }

  private assessEnvironmentalRisk(property: Property): number {
    let risk = 3;

    if (property.neighborhood) {
      const normalized = property.neighborhood.toLowerCase();

      // Environmental risk indicators
      if (normalized.includes("flood") || normalized.includes("coastal"))
        risk += 3;
      if (normalized.includes("wildfire") || normalized.includes("forest"))
        risk += 2;
      if (normalized.includes("industrial")) risk += 2;
      if (normalized.includes("hillside") || normalized.includes("slope"))
        risk += 1;
    }

    // Older buildings may have asbestos, lead paint
    if (property.yearBuilt && property.yearBuilt < 1980) {
      risk += 1;
    }

    return Math.max(1, Math.min(10, risk));
  }

  private assessLiquidityRisk(property: Property): number {
    let risk = 4;

    // Higher-priced properties are harder to sell
    if (property.price) {
      if (property.price > 1500000) risk += 3;
      else if (property.price > 1000000) risk += 2;
      else if (property.price > 500000) risk += 1;
      else if (property.price < 300000) risk -= 1;
    }

    // Property type affects liquidity
    const liquidityFactors: Record<string, number> = {
      "single-family": -1,
      condo: 0,
      townhouse: 0,
      "multi-family": 1,
      commercial: 3,
      land: 4,
    };
    risk += liquidityFactors[property.propertyType] || 0;

    // Standard bedroom counts are more liquid
    if (property.bedrooms) {
      if (property.bedrooms >= 2 && property.bedrooms <= 4) risk -= 1;
      else if (property.bedrooms > 5) risk += 2;
    }

    return Math.max(1, Math.min(10, risk));
  }

  private calculateOverallRisk(factors: RiskFactors): number {
    const weights = {
      marketRisk: 0.2,
      locationRisk: 0.15,
      propertyConditionRisk: 0.15,
      financialRisk: 0.2,
      legalRisk: 0.1,
      environmentalRisk: 0.1,
      liquidityRisk: 0.1,
    };

    return Object.entries(weights).reduce((total, [factor, weight]) => {
      return total + factors[factor as keyof RiskFactors] * weight;
    }, 0);
  }

  private determineRiskLevel(
    overallRisk: number,
  ): "low" | "moderate" | "high" | "critical" {
    if (overallRisk <= this.riskThresholds.low) return "low";
    if (overallRisk <= this.riskThresholds.moderate) return "moderate";
    if (overallRisk <= this.riskThresholds.high) return "high";
    return "critical";
  }

  private calculateRiskScore(assessment: RiskAssessment): number {
    // Convert risk to a positive score (lower risk = higher score)
    return Math.max(1, Math.min(10, 10 - assessment.overallRisk));
  }

  private calculateConfidence(assessment: RiskAssessment): number {
    // More warnings and mitigations = more thorough analysis = higher confidence
    const thoroughness =
      (assessment.warnings.length + assessment.mitigations.length) / 10;
    const factorConsistency = this.calculateFactorConsistency(
      assessment.factors,
    );

    return Math.min(10, (factorConsistency * 7 + thoroughness * 3) / 10);
  }

  private calculateFactorConsistency(factors: RiskFactors): number {
    const values = Object.values(factors);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Lower variance = more consistent = higher confidence
    return Math.max(1, 10 - stdDev);
  }

  private generateMitigations(factors: RiskFactors): string[] {
    const mitigations: string[] = [];

    if (factors.marketRisk > 6) {
      mitigations.push("Consider market timing and exit strategy planning");
      mitigations.push("Get independent market analysis from multiple sources");
    }

    if (factors.locationRisk > 6) {
      mitigations.push("Conduct thorough neighborhood research");
      mitigations.push("Verify local development plans and zoning changes");
    }

    if (factors.propertyConditionRisk > 6) {
      mitigations.push("Request comprehensive home inspection");
      mitigations.push("Budget for potential repairs and renovations");
      mitigations.push("Review maintenance history if available");
    }

    if (factors.financialRisk > 6) {
      mitigations.push("Ensure adequate financial reserves");
      mitigations.push(
        "Consider rental income potential for downside protection",
      );
    }

    if (factors.legalRisk > 5) {
      mitigations.push("Obtain title insurance");
      mitigations.push("Conduct thorough title search");
      mitigations.push("Review all existing liens and encumbrances");
    }

    if (factors.environmentalRisk > 5) {
      mitigations.push("Request environmental assessment");
      mitigations.push("Review flood zone and natural disaster history");
      mitigations.push(
        "Verify hazardous material clearances for older properties",
      );
    }

    if (factors.liquidityRisk > 6) {
      mitigations.push("Plan for longer holding period if needed");
      mitigations.push("Maintain property in marketable condition");
    }

    return mitigations;
  }

  private generateWarnings(factors: RiskFactors): string[] {
    const warnings: string[] = [];

    if (factors.marketRisk >= 8) {
      warnings.push(
        "HIGH MARKET RISK: Property may face significant value volatility",
      );
    }

    if (factors.locationRisk >= 8) {
      warnings.push(
        "HIGH LOCATION RISK: Area may have safety or development concerns",
      );
    }

    if (factors.propertyConditionRisk >= 8) {
      warnings.push(
        "HIGH CONDITION RISK: Property age suggests major systems may need replacement",
      );
    }

    if (factors.financialRisk >= 8) {
      warnings.push("HIGH FINANCIAL RISK: Investment exposure is significant");
    }

    if (factors.legalRisk >= 7) {
      warnings.push(
        "ELEVATED LEGAL RISK: Title complexity requires careful review",
      );
    }

    if (factors.environmentalRisk >= 7) {
      warnings.push(
        "ELEVATED ENVIRONMENTAL RISK: Natural hazard or contamination concerns",
      );
    }

    if (factors.liquidityRisk >= 8) {
      warnings.push("HIGH LIQUIDITY RISK: May be difficult to sell quickly");
    }

    return warnings;
  }

  private generateReasoning(assessment: RiskAssessment): string {
    const topRisks = Object.entries(assessment.factors)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(
        ([factor, score]) =>
          `${this.formatFactorName(factor)}: ${score.toFixed(1)}`,
      );

    let reasoning = `Risk level: ${assessment.riskLevel.toUpperCase()} (${assessment.overallRisk.toFixed(2)}/10). `;
    reasoning += `Top risk factors: ${topRisks.join(", ")}. `;

    if (assessment.warnings.length > 0) {
      reasoning += `${assessment.warnings.length} warning(s) identified. `;
    }

    if (assessment.mitigations.length > 0) {
      reasoning += `${assessment.mitigations.length} mitigation strategies recommended.`;
    }

    return reasoning;
  }

  private formatFactorName(factor: string): string {
    return factor
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  getRiskAssessment(property: Property): Promise<RiskAssessment> {
    return this.assessAllRisks(property);
  }
}
