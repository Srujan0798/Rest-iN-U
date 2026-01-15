import { BaseAgent, Property, PropertyAnalysis } from "./BaseAgent";

interface LegalCheckResult {
  category: string;
  status: "clear" | "warning" | "issue" | "unknown";
  description: string;
  severity: number;
}

interface LegalAssessment {
  overallStatus: "clear" | "caution" | "concern" | "critical";
  titleStatus: LegalCheckResult;
  encumbrances: LegalCheckResult;
  zoningCompliance: LegalCheckResult;
  permitStatus: LegalCheckResult;
  taxStatus: LegalCheckResult;
  ownershipHistory: LegalCheckResult;
  environmentalCompliance: LegalCheckResult;
  recommendations: string[];
  estimatedClosingCosts: number;
}

export class LegalEagle extends BaseAgent {
  constructor(agentId?: string) {
    super(agentId || `legal-eagle-${Date.now()}`, "legal-eagle");
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    await this.delay(Math.random() * 700 + 350);

    const legalAssessment = await this.conductLegalReview(property);
    const score = this.calculateLegalScore(legalAssessment);
    const confidence = this.calculateConfidence(legalAssessment);
    const reasoning = this.generateReasoning(legalAssessment);

    return {
      agentId: this.agentId,
      propertyId: property.id,
      score,
      confidence,
      reasoning,
      timestamp: new Date(),
    };
  }

  private async conductLegalReview(property: Property): Promise<LegalAssessment> {
    const titleStatus = this.checkTitleStatus(property);
    const encumbrances = this.checkEncumbrances(property);
    const zoningCompliance = this.checkZoningCompliance(property);
    const permitStatus = this.checkPermitStatus(property);
    const taxStatus = this.checkTaxStatus(property);
    const ownershipHistory = this.checkOwnershipHistory(property);
    const environmentalCompliance = this.checkEnvironmentalCompliance(property);

    const allChecks = [
      titleStatus,
      encumbrances,
      zoningCompliance,
      permitStatus,
      taxStatus,
      ownershipHistory,
      environmentalCompliance,
    ];

    const overallStatus = this.determineOverallStatus(allChecks);
    const recommendations = this.generateRecommendations(allChecks);
    const estimatedClosingCosts = this.estimateClosingCosts(property);

    return {
      overallStatus,
      titleStatus,
      encumbrances,
      zoningCompliance,
      permitStatus,
      taxStatus,
      ownershipHistory,
      environmentalCompliance,
      recommendations,
      estimatedClosingCosts,
    };
  }

  private checkTitleStatus(property: Property): LegalCheckResult {
    // Simulate title search based on property characteristics
    const ageRisk = property.yearBuilt
      ? new Date().getFullYear() - property.yearBuilt
      : 30;

    if (ageRisk < 10) {
      return {
        category: "Title Status",
        status: "clear",
        description: "Title appears clear with no encumbrances detected",
        severity: 1,
      };
    }

    if (ageRisk < 30) {
      return {
        category: "Title Status",
        status: "clear",
        description: "Title clear, standard chain of ownership verified",
        severity: 2,
      };
    }

    if (ageRisk < 50) {
      return {
        category: "Title Status",
        status: "warning",
        description:
          "Title requires detailed review due to property age; recommend title insurance",
        severity: 4,
      };
    }

    return {
      category: "Title Status",
      status: "warning",
      description:
        "Complex title history detected; thorough title search strongly recommended",
      severity: 6,
    };
  }

  private checkEncumbrances(property: Property): LegalCheckResult {
    // Simulate encumbrance check
    const random = Math.random();

    if (random < 0.7) {
      return {
        category: "Encumbrances",
        status: "clear",
        description: "No liens, easements, or encumbrances found",
        severity: 1,
      };
    }

    if (random < 0.9) {
      return {
        category: "Encumbrances",
        status: "warning",
        description: "Standard utility easements present; common and non-restrictive",
        severity: 3,
      };
    }

    return {
      category: "Encumbrances",
      status: "issue",
      description:
        "Potential lien or encumbrance detected; requires resolution before closing",
      severity: 7,
    };
  }

  private checkZoningCompliance(property: Property): LegalCheckResult {
    const propertyType = property.propertyType?.toLowerCase() || "";

    // Most residential properties are zoning compliant
    if (
      propertyType.includes("single-family") ||
      propertyType.includes("residential")
    ) {
      return {
        category: "Zoning Compliance",
        status: "clear",
        description: "Property conforms to current residential zoning requirements",
        severity: 1,
      };
    }

    if (propertyType.includes("condo") || propertyType.includes("townhouse")) {
      return {
        category: "Zoning Compliance",
        status: "clear",
        description:
          "Property conforms to multi-family/PUD zoning; HOA covenants apply",
        severity: 2,
      };
    }

    if (propertyType.includes("multi-family")) {
      return {
        category: "Zoning Compliance",
        status: "warning",
        description:
          "Multi-family zoning verified; check for rental restrictions and occupancy limits",
        severity: 4,
      };
    }

    if (propertyType.includes("commercial") || propertyType.includes("land")) {
      return {
        category: "Zoning Compliance",
        status: "warning",
        description:
          "Verify intended use aligns with current zoning; conditional use may apply",
        severity: 5,
      };
    }

    return {
      category: "Zoning Compliance",
      status: "unknown",
      description: "Zoning status requires verification with local authorities",
      severity: 4,
    };
  }

  private checkPermitStatus(property: Property): LegalCheckResult {
    if (!property.yearBuilt) {
      return {
        category: "Permit Status",
        status: "unknown",
        description: "Unable to verify permit history without construction date",
        severity: 4,
      };
    }

    const age = new Date().getFullYear() - property.yearBuilt;

    if (age <= 5) {
      return {
        category: "Permit Status",
        status: "clear",
        description: "Recent construction; permits likely on file and verifiable",
        severity: 1,
      };
    }

    if (age <= 20) {
      return {
        category: "Permit Status",
        status: "clear",
        description:
          "Recommend verifying any renovation permits; original permits should be on file",
        severity: 2,
      };
    }

    return {
      category: "Permit Status",
      status: "warning",
      description:
        "Older property; verify any unpermitted work or additions during inspection",
        severity: 5,
    };
  }

  private checkTaxStatus(property: Property): LegalCheckResult {
    // Simulate tax status check
    const random = Math.random();

    if (random < 0.85) {
      return {
        category: "Tax Status",
        status: "clear",
        description: "Property taxes current; no delinquencies or tax liens found",
        severity: 1,
      };
    }

    if (random < 0.95) {
      return {
        category: "Tax Status",
        status: "warning",
        description:
          "Minor tax assessment pending; verify current tax obligations at closing",
        severity: 3,
      };
    }

    return {
      category: "Tax Status",
      status: "issue",
      description:
        "Tax delinquency detected; must be resolved before transfer of ownership",
      severity: 8,
    };
  }

  private checkOwnershipHistory(property: Property): LegalCheckResult {
    // Simulate ownership history check
    const random = Math.random();

    if (random < 0.6) {
      return {
        category: "Ownership History",
        status: "clear",
        description: "Stable ownership history; single owner for extended period",
        severity: 1,
      };
    }

    if (random < 0.85) {
      return {
        category: "Ownership History",
        status: "clear",
        description: "Multiple historical owners; all transfers appear legitimate",
        severity: 2,
      };
    }

    if (random < 0.95) {
      return {
        category: "Ownership History",
        status: "warning",
        description:
          "Frequent ownership changes; verify no fraud or foreclosure history",
        severity: 4,
      };
    }

    return {
      category: "Ownership History",
      status: "warning",
      description:
        "Complex ownership history; recommend enhanced title search and insurance",
      severity: 6,
    };
  }

  private checkEnvironmentalCompliance(property: Property): LegalCheckResult {
    const yearBuilt = property.yearBuilt || 1990;
    const neighborhood = property.neighborhood?.toLowerCase() || "";

    // Pre-1978 homes may have lead paint
    if (yearBuilt < 1978) {
      return {
        category: "Environmental Compliance",
        status: "warning",
        description:
          "Pre-1978 construction; lead paint disclosure required; asbestos inspection recommended",
        severity: 5,
      };
    }

    // Check for environmental risk indicators in location
    if (
      neighborhood.includes("industrial") ||
      neighborhood.includes("commercial")
    ) {
      return {
        category: "Environmental Compliance",
        status: "warning",
        description:
          "Property near industrial/commercial area; Phase I environmental assessment recommended",
        severity: 6,
      };
    }

    return {
      category: "Environmental Compliance",
      status: "clear",
      description: "No environmental concerns identified based on available data",
      severity: 1,
    };
  }

  private determineOverallStatus(
    checks: LegalCheckResult[]
  ): "clear" | "caution" | "concern" | "critical" {
    const hasIssue = checks.some((c) => c.status === "issue");
    const warningCount = checks.filter((c) => c.status === "warning").length;
    const unknownCount = checks.filter((c) => c.status === "unknown").length;
    const maxSeverity = Math.max(...checks.map((c) => c.severity));

    if (hasIssue || maxSeverity >= 8) return "critical";
    if (warningCount >= 3 || maxSeverity >= 6) return "concern";
    if (warningCount >= 1 || unknownCount >= 2) return "caution";
    return "clear";
  }

  private calculateLegalScore(assessment: LegalAssessment): number {
    const statusScores = {
      clear: 10,
      caution: 7,
      concern: 4,
      critical: 2,
    };

    const allChecks = [
      assessment.titleStatus,
      assessment.encumbrances,
      assessment.zoningCompliance,
      assessment.permitStatus,
      assessment.taxStatus,
      assessment.ownershipHistory,
      assessment.environmentalCompliance,
    ];

    // Calculate weighted average based on severity
    const totalSeverity = allChecks.reduce((sum, check) => sum + check.severity, 0);
    const maxPossibleSeverity = allChecks.length * 10;

    const severityScore = 10 - (totalSeverity / maxPossibleSeverity) * 10;
    const statusScore = statusScores[assessment.overallStatus];

    return Math.max(1, Math.min(10, (severityScore + statusScore) / 2));
  }

  private calculateConfidence(assessment: LegalAssessment): number {
    const allChecks = [
      assessment.titleStatus,
      assessment.encumbrances,
      assessment.zoningCompliance,
      assessment.permitStatus,
      assessment.taxStatus,
      assessment.ownershipHistory,
      assessment.environmentalCompliance,
    ];

    const unknownCount = allChecks.filter((c) => c.status === "unknown").length;
    const clearCount = allChecks.filter((c) => c.status === "clear").length;

    // More clear statuses and fewer unknowns = higher confidence
    const knownRatio = (allChecks.length - unknownCount) / allChecks.length;
    const clarityBonus = clearCount / allChecks.length;

    return Math.min(10, (knownRatio * 7 + clarityBonus * 3) * 10);
  }

  private generateRecommendations(checks: LegalCheckResult[]): string[] {
    const recommendations: string[] = [];

    const titleCheck = checks.find((c) => c.category === "Title Status");
    if (titleCheck && titleCheck.severity >= 4) {
      recommendations.push("Obtain comprehensive title insurance");
      recommendations.push("Request extended title search from title company");
    }

    const encumbranceCheck = checks.find((c) => c.category === "Encumbrances");
    if (encumbranceCheck && encumbranceCheck.status !== "clear") {
      recommendations.push("Review all easements and their impact on property use");
      recommendations.push("Ensure any liens are satisfied before closing");
    }

    const zoningCheck = checks.find((c) => c.category === "Zoning Compliance");
    if (zoningCheck && zoningCheck.status !== "clear") {
      recommendations.push("Verify zoning with local planning department");
      recommendations.push("Review any HOA or PUD restrictions");
    }

    const permitCheck = checks.find((c) => c.category === "Permit Status");
    if (permitCheck && permitCheck.severity >= 4) {
      recommendations.push("Request permit history from local building department");
      recommendations.push("Verify all additions/renovations were properly permitted");
    }

    const taxCheck = checks.find((c) => c.category === "Tax Status");
    if (taxCheck && taxCheck.status !== "clear") {
      recommendations.push("Obtain tax certificate showing current status");
      recommendations.push("Prorate taxes at closing");
    }

    const envCheck = checks.find((c) => c.category === "Environmental Compliance");
    if (envCheck && envCheck.severity >= 5) {
      recommendations.push("Request lead paint disclosure documentation");
      recommendations.push("Consider professional environmental inspection");
    }

    // Always include standard recommendations
    recommendations.push("Review all closing documents with real estate attorney");

    return recommendations;
  }

  private estimateClosingCosts(property: Property): number {
    if (!property.price) return 0;

    // Typical closing costs are 2-5% of purchase price
    const baseClosingRate = 0.03;
    let adjustedRate = baseClosingRate;

    // Higher-priced properties may have additional costs
    if (property.price > 1000000) {
      adjustedRate += 0.005;
    }

    // Older properties may need more title work
    if (property.yearBuilt && property.yearBuilt < 1970) {
      adjustedRate += 0.005;
    }

    return Math.round(property.price * adjustedRate);
  }

  private generateReasoning(assessment: LegalAssessment): string {
    const allChecks = [
      assessment.titleStatus,
      assessment.encumbrances,
      assessment.zoningCompliance,
      assessment.permitStatus,
      assessment.taxStatus,
      assessment.ownershipHistory,
      assessment.environmentalCompliance,
    ];

    const clearCount = allChecks.filter((c) => c.status === "clear").length;
    const issueCount = allChecks.filter((c) => c.status === "issue").length;
    const warningCount = allChecks.filter((c) => c.status === "warning").length;

    let reasoning = `Legal status: ${assessment.overallStatus.toUpperCase()}. `;
    reasoning += `${clearCount}/${allChecks.length} checks clear. `;

    if (issueCount > 0) {
      reasoning += `${issueCount} issue(s) require resolution. `;
    }

    if (warningCount > 0) {
      reasoning += `${warningCount} warning(s) need attention. `;
    }

    if (assessment.estimatedClosingCosts > 0) {
      reasoning += `Est. closing costs: $${assessment.estimatedClosingCosts.toLocaleString()}. `;
    }

    reasoning += `${assessment.recommendations.length} recommendations provided.`;

    return reasoning;
  }

  getLegalAssessment(property: Property): Promise<LegalAssessment> {
    return this.conductLegalReview(property);
  }
}
