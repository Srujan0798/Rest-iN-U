export interface PropertyAnalysis {
  agentId: string;
  propertyId: string;
  score: number;
  confidence: number;
  reasoning: string;
  timestamp: Date;
}

export interface Property {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  propertyType: string;
  yearBuilt: number;
  neighborhood: string;
  [key: string]: any;
}

export interface AgentDebate {
  analyses: PropertyAnalysis[];
  consensus?: string;
  confidence: number;
  timestamp: Date;
}

export abstract class BaseAgent {
  protected agentId: string;
  protected agentType: string;

  constructor(agentId: string, agentType: string) {
    this.agentId = agentId;
    this.agentType = agentType;
  }

  abstract analyze(property: Property): Promise<PropertyAnalysis>;

  async debate(analyses: PropertyAnalysis[]): Promise<AgentDebate> {
    const validAnalyses = analyses.filter((a) => a.agentId !== this.agentId);

    const consensus = this.calculateConsensus(validAnalyses);
    const confidence = this.calculateDebateConfidence(validAnalyses);

    return {
      analyses: validAnalyses,
      consensus,
      confidence,
      timestamp: new Date(),
    };
  }

  protected calculateConsensus(analyses: PropertyAnalysis[]): string {
    if (analyses.length === 0) return "No consensus available";

    const avgScore =
      analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length;
    const avgConfidence =
      analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length;

    return `Consensus score: ${avgScore.toFixed(2)}, Confidence: ${avgConfidence.toFixed(2)}`;
  }

  protected calculateDebateConfidence(analyses: PropertyAnalysis[]): number {
    if (analyses.length === 0) return 0;

    const scores = analyses.map((a) => a.score);
    const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const variance =
      scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);

    const agreement = Math.max(0, 1 - standardDeviation / 10);
    const avgConfidence =
      analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length;

    return (agreement + avgConfidence) / 2;
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
