import { BaseAgent, Property, PropertyAnalysis } from "./BaseAgent";

interface ReraStatus {
  isRegistered: boolean;
  registrationNumber?: string;
  projectStatus: "On Time" | "Delayed" | "Stalled" | "Completed";
  possessionDate?: Date;
  complaints: number;
}

interface ReraAssessment {
  score: number;
  status: ReraStatus;
  flags: string[];
  complianceLevel: "High" | "Medium" | "Low" | "Unknown";
  summary: string;
}

export class ReraRadar extends BaseAgent {
  constructor(agentId?: string) {
    super(agentId || `rera-radar-${Date.now()}`, "rera-radar");
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    await this.delay(Math.random() * 400 + 200);

    const assessment = await this.checkCompliance(property);

    return {
      agentId: this.agentId,
      propertyId: property.id,
      score: assessment.score,
      confidence: assessment.status.isRegistered ? 9 : 5,
      reasoning: assessment.summary,
      timestamp: new Date(),
    };
  }

  private async checkCompliance(property: Property): Promise<ReraAssessment> {
    // Simulated RERA check
    // In production, this would hit a RERA API or scraped database

    const isRegistered = Math.random() > 0.2; // 80% chance registered
    const complaints = isRegistered ? Math.floor(Math.random() * 5) : 0;

    let projectStatus: ReraStatus["projectStatus"] = "On Time";
    if (Math.random() > 0.7) projectStatus = "Delayed";
    if (Math.random() > 0.95) projectStatus = "Stalled";
    if (property.status === "COMPLETED") projectStatus = "Completed";

    const status: ReraStatus = {
      isRegistered,
      registrationNumber: isRegistered ? `PR/GJ/AHMEDABAD/${Math.floor(Math.random()*10000)}` : undefined,
      projectStatus,
      complaints,
      possessionDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * (Math.random() * 3)) // 0-3 years
    };

    const flags: string[] = [];
    if (!isRegistered) flags.push("Not RERA Registered");
    if (projectStatus === "Delayed") flags.push("Project is behind schedule");
    if (projectStatus === "Stalled") flags.push("Project construction halted");
    if (complaints > 3) flags.push("High volume of consumer complaints");

    let score = 10;
    if (!isRegistered) score = 1;
    else {
      if (projectStatus === "Delayed") score -= 3;
      if (projectStatus === "Stalled") score -= 7;
      score -= complaints; // -1 per complaint
    }
    score = Math.max(1, score);

    let complianceLevel: ReraAssessment["complianceLevel"] = "High";
    if (score < 8) complianceLevel = "Medium";
    if (score < 5) complianceLevel = "Low";
    if (!isRegistered) complianceLevel = "Unknown"; // Or Critical

    const summary = this.generateSummary(status, flags, score);

    return {
      score,
      status,
      flags,
      complianceLevel,
      summary
    };
  }

  private generateSummary(status: ReraStatus, flags: string[], score: number): string {
    if (!status.isRegistered) {
      return "CRITICAL: Project does not appear to be RERA registered. Exercise extreme caution.";
    }

    let text = `RERA Registered (${status.registrationNumber}). Status: ${status.projectStatus}. `;
    if (flags.length > 0) {
      text += `Flags: ${flags.join(", ")}. `;
    }

    if (score > 8) text += "Compliance looks solid.";
    else if (score > 5) text += "Some compliance concerns detected.";
    else text += "Major compliance risks identified.";

    return text;
  }
}
