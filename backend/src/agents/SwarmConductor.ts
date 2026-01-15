import {
  BaseAgent,
  Property,
  PropertyAnalysis,
  AgentDebate,
} from "./BaseAgent";

export class SwarmConductor {
  private agents: BaseAgent[];
  private conductorId: string;

  constructor(agents: BaseAgent[]) {
    if (agents.length !== 6) {
      throw new Error("SwarmConductor requires exactly 6 agents");
    }
    this.agents = agents;
    this.conductorId = "swarm-conductor-" + Date.now();
  }

  async orchestrateAnalysis(property: Property): Promise<{
    individualAnalyses: PropertyAnalysis[];
    consensusAnalysis: AgentDebate;
    combinedScore: number;
    overallConfidence: number;
  }> {
    const analysisPromises = this.agents.map((agent) =>
      this.executeAgentWithRetry(agent, property),
    );

    const individualAnalyses = await Promise.allSettled(analysisPromises);
    const successfulAnalyses = individualAnalyses
      .filter(
        (result): result is PromiseFulfilledResult<PropertyAnalysis> =>
          result.status === "fulfilled",
      )
      .map((result) => result.value);

    if (successfulAnalyses.length === 0) {
      throw new Error("All agent analyses failed");
    }

    const consensusAnalysis = await this.generateConsensus(successfulAnalyses);
    const combinedScore = this.calculateCombinedScore(successfulAnalyses);
    const overallConfidence =
      this.calculateOverallConfidence(successfulAnalyses);

    return {
      individualAnalyses: successfulAnalyses,
      consensusAnalysis,
      combinedScore,
      overallConfidence,
    };
  }

  private async executeAgentWithRetry(
    agent: BaseAgent,
    property: Property,
    maxRetries: number = 3,
  ): Promise<PropertyAnalysis> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await agent.analyze(property);
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        await this.delay(1000 * attempt);
      }
    }
    throw new Error(
      `Agent ${agent.constructor.name} failed after ${maxRetries} attempts`,
    );
  }

  private async generateConsensus(
    analyses: PropertyAnalysis[],
  ): Promise<AgentDebate> {
    const sortedByScore = [...analyses].sort((a, b) => b.score - a.score);
    const topThree = sortedByScore.slice(0, 3);

    const consensus = this.buildConsensusReasoning(topThree);
    const confidence = this.calculateConsensusConfidence(analyses);

    return {
      analyses,
      consensus,
      confidence,
      timestamp: new Date(),
    };
  }

  private buildConsensusReasoning(topAnalyses: PropertyAnalysis[]): string {
    const avgScore =
      topAnalyses.reduce((sum, a) => sum + a.score, 0) / topAnalyses.length;
    const reasons = topAnalyses.map((a) => a.reasoning).join(" | ");

    return `Top ${topAnalyses.length} agents consensus: ${avgScore.toFixed(2)}. Reasoning: ${reasons}`;
  }

  private calculateConsensusConfidence(analyses: PropertyAnalysis[]): number {
    if (analyses.length < 2) return analyses[0]?.confidence || 0;

    const scores = analyses.map((a) => a.score);
    const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const variance =
      scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);

    const agreement = Math.max(0, 1 - standardDeviation / 10);
    const avgConfidence =
      analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length;

    return agreement * 0.6 + avgConfidence * 0.4;
  }

  private calculateCombinedScore(analyses: PropertyAnalysis[]): number {
    if (analyses.length === 0) return 0;

    const weightedSum = analyses.reduce((sum, analysis) => {
      return sum + analysis.score * analysis.confidence;
    }, 0);

    const totalWeight = analyses.reduce(
      (sum, analysis) => sum + analysis.confidence,
      0,
    );

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private calculateOverallConfidence(analyses: PropertyAnalysis[]): number {
    if (analyses.length === 0) return 0;

    return (
      analyses.reduce((sum, analysis) => sum + analysis.confidence, 0) /
      analyses.length
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getAgentCount(): number {
    return this.agents.length;
  }

  getAgentTypes(): string[] {
    return this.agents.map((agent) => agent.constructor.name);
  }
}
