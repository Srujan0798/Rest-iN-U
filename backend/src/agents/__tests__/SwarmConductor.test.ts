import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SwarmConductor } from '../SwarmConductor';
import { BaseAgent, Property, PropertyAnalysis } from '../BaseAgent';

// Mock agent implementation for testing
class MockAgent extends BaseAgent {
  private mockScore: number;
  private mockConfidence: number;
  private shouldFail: boolean;
  private failCount: number;
  private currentFailures: number;

  constructor(
    id: string,
    score: number = 75,
    confidence: number = 0.85,
    shouldFail: boolean = false,
    failCount: number = 0
  ) {
    super(id, 'MockAgent');
    this.mockScore = score;
    this.mockConfidence = confidence;
    this.shouldFail = shouldFail;
    this.failCount = failCount;
    this.currentFailures = 0;
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    if (this.shouldFail && this.currentFailures < this.failCount) {
      this.currentFailures++;
      throw new Error(`Agent ${this.agentId} failed`);
    }

    return {
      agentId: this.agentId,
      propertyId: property.id,
      score: this.mockScore,
      confidence: this.mockConfidence,
      reasoning: `Mock analysis for property ${property.id} with score ${this.mockScore}`,
      timestamp: new Date(),
    };
  }
}

// Test property fixture
const mockProperty: Property = {
  id: 'test-property-123',
  address: '123 Test Street, Bangalore',
  price: 5000000,
  bedrooms: 3,
  bathrooms: 2,
  squareFootage: 1800,
  propertyType: 'HOUSE',
  yearBuilt: 2020,
  neighborhood: 'Koramangala',
};

describe('SwarmConductor', () => {
  describe('Constructor', () => {
    it('should require exactly 6 agents', () => {
      const agents = Array(5).fill(null).map((_, i) => new MockAgent(`agent-${i}`));

      expect(() => new SwarmConductor(agents)).toThrow('SwarmConductor requires exactly 6 agents');
    });

    it('should accept exactly 6 agents', () => {
      const agents = Array(6).fill(null).map((_, i) => new MockAgent(`agent-${i}`));

      expect(() => new SwarmConductor(agents)).not.toThrow();
    });

    it('should reject more than 6 agents', () => {
      const agents = Array(7).fill(null).map((_, i) => new MockAgent(`agent-${i}`));

      expect(() => new SwarmConductor(agents)).toThrow('SwarmConductor requires exactly 6 agents');
    });

    it('should reject empty agent array', () => {
      expect(() => new SwarmConductor([])).toThrow('SwarmConductor requires exactly 6 agents');
    });
  });

  describe('orchestrateAnalysis', () => {
    let conductor: SwarmConductor;
    let agents: MockAgent[];

    beforeEach(() => {
      agents = [
        new MockAgent('discovery-scout', 80, 0.90),
        new MockAgent('valuation-oracle', 75, 0.85),
        new MockAgent('market-analyst', 70, 0.80),
        new MockAgent('risk-assessor', 65, 0.75),
        new MockAgent('location-expert', 85, 0.95),
        new MockAgent('trend-predictor', 72, 0.82),
      ];
      conductor = new SwarmConductor(agents);
    });

    it('should orchestrate analysis from all agents', async () => {
      const result = await conductor.orchestrateAnalysis(mockProperty);

      expect(result).toHaveProperty('individualAnalyses');
      expect(result).toHaveProperty('consensusAnalysis');
      expect(result).toHaveProperty('combinedScore');
      expect(result).toHaveProperty('overallConfidence');
    });

    it('should return 6 individual analyses when all succeed', async () => {
      const result = await conductor.orchestrateAnalysis(mockProperty);

      expect(result.individualAnalyses).toHaveLength(6);
    });

    it('should include correct property ID in analyses', async () => {
      const result = await conductor.orchestrateAnalysis(mockProperty);

      result.individualAnalyses.forEach((analysis) => {
        expect(analysis.propertyId).toBe(mockProperty.id);
      });
    });

    it('should calculate combined weighted score correctly', async () => {
      const result = await conductor.orchestrateAnalysis(mockProperty);

      // Combined score should be weighted average of (score * confidence)
      expect(result.combinedScore).toBeGreaterThan(0);
      expect(result.combinedScore).toBeLessThanOrEqual(100);
    });

    it('should calculate overall confidence as average', async () => {
      const result = await conductor.orchestrateAnalysis(mockProperty);

      // Average of all confidences
      const expectedConfidence = (0.90 + 0.85 + 0.80 + 0.75 + 0.95 + 0.82) / 6;
      expect(result.overallConfidence).toBeCloseTo(expectedConfidence, 2);
    });

    it('should generate consensus from top 3 agents', async () => {
      const result = await conductor.orchestrateAnalysis(mockProperty);

      expect(result.consensusAnalysis).toHaveProperty('consensus');
      expect(result.consensusAnalysis).toHaveProperty('confidence');
      expect(result.consensusAnalysis).toHaveProperty('timestamp');
      expect(result.consensusAnalysis.consensus).toContain('Top 3 agents consensus');
    });

    it('should include all analyses in consensus debate', async () => {
      const result = await conductor.orchestrateAnalysis(mockProperty);

      expect(result.consensusAnalysis.analyses).toHaveLength(6);
    });

    it('should calculate consensus confidence based on agreement', async () => {
      const result = await conductor.orchestrateAnalysis(mockProperty);

      expect(result.consensusAnalysis.confidence).toBeGreaterThan(0);
      expect(result.consensusAnalysis.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Agent failure handling', () => {
    it('should handle partial agent failures gracefully', async () => {
      const agents = [
        new MockAgent('agent-1', 80, 0.90),
        new MockAgent('agent-2', 75, 0.85, true, 5), // Will always fail (failCount > retries)
        new MockAgent('agent-3', 70, 0.80),
        new MockAgent('agent-4', 65, 0.75),
        new MockAgent('agent-5', 85, 0.95),
        new MockAgent('agent-6', 72, 0.82),
      ];
      const conductor = new SwarmConductor(agents);

      const result = await conductor.orchestrateAnalysis(mockProperty);

      // Should have 5 successful analyses
      expect(result.individualAnalyses.length).toBe(5);
    });

    it('should retry failed agents up to 3 times', async () => {
      // Agent fails twice then succeeds on third try
      const agents = [
        new MockAgent('agent-1', 80, 0.90),
        new MockAgent('agent-2', 75, 0.85, true, 2), // Fails 2 times, succeeds on 3rd
        new MockAgent('agent-3', 70, 0.80),
        new MockAgent('agent-4', 65, 0.75),
        new MockAgent('agent-5', 85, 0.95),
        new MockAgent('agent-6', 72, 0.82),
      ];
      const conductor = new SwarmConductor(agents);

      const result = await conductor.orchestrateAnalysis(mockProperty);

      // All 6 should succeed (agent-2 recovers after retries)
      expect(result.individualAnalyses.length).toBe(6);
    });

    it('should throw error when all agents fail', async () => {
      const agents = Array(6).fill(null).map((_, i) =>
        new MockAgent(`agent-${i}`, 75, 0.85, true, 5)
      );
      const conductor = new SwarmConductor(agents);

      await expect(conductor.orchestrateAnalysis(mockProperty))
        .rejects.toThrow('All agent analyses failed');
    });

    it('should work with minimum successful analyses (at least 1)', async () => {
      const agents = [
        new MockAgent('agent-1', 80, 0.90), // Only this one succeeds
        ...Array(5).fill(null).map((_, i) =>
          new MockAgent(`failing-agent-${i}`, 75, 0.85, true, 5)
        ),
      ];
      const conductor = new SwarmConductor(agents);

      const result = await conductor.orchestrateAnalysis(mockProperty);

      expect(result.individualAnalyses.length).toBe(1);
      expect(result.combinedScore).toBe(80);
    });
  });

  describe('Score calculations', () => {
    it('should calculate weighted combined score correctly', async () => {
      // All agents with same confidence - combined score should be average of scores
      const agents = [
        new MockAgent('agent-1', 90, 0.50),
        new MockAgent('agent-2', 80, 0.50),
        new MockAgent('agent-3', 70, 0.50),
        new MockAgent('agent-4', 60, 0.50),
        new MockAgent('agent-5', 50, 0.50),
        new MockAgent('agent-6', 40, 0.50),
      ];
      const conductor = new SwarmConductor(agents);

      const result = await conductor.orchestrateAnalysis(mockProperty);

      // With equal weights, should be simple average
      const expectedAvg = (90 + 80 + 70 + 60 + 50 + 40) / 6;
      expect(result.combinedScore).toBeCloseTo(expectedAvg, 1);
    });

    it('should weight higher confidence agents more heavily', async () => {
      const agents = [
        new MockAgent('high-conf', 90, 1.0), // High score, high confidence
        new MockAgent('low-conf', 30, 0.1),  // Low score, low confidence
        new MockAgent('agent-3', 60, 0.5),
        new MockAgent('agent-4', 60, 0.5),
        new MockAgent('agent-5', 60, 0.5),
        new MockAgent('agent-6', 60, 0.5),
      ];
      const conductor = new SwarmConductor(agents);

      const result = await conductor.orchestrateAnalysis(mockProperty);

      // Combined score should be closer to 90 (high confidence agent)
      // than to 30 (low confidence agent)
      expect(result.combinedScore).toBeGreaterThan(60);
    });

    it('should return 0 combined score when all confidences are 0', async () => {
      const agents = Array(6).fill(null).map((_, i) =>
        new MockAgent(`agent-${i}`, 75, 0) // Zero confidence
      );
      const conductor = new SwarmConductor(agents);

      const result = await conductor.orchestrateAnalysis(mockProperty);

      expect(result.combinedScore).toBe(0);
    });
  });

  describe('Consensus generation', () => {
    it('should use top 3 scoring agents for consensus reasoning', async () => {
      const agents = [
        new MockAgent('lowest', 50, 0.90),
        new MockAgent('low', 60, 0.85),
        new MockAgent('mid-low', 70, 0.80),
        new MockAgent('mid-high', 80, 0.75), // Top 3
        new MockAgent('high', 85, 0.95),     // Top 3
        new MockAgent('highest', 90, 0.82),  // Top 3
      ];
      const conductor = new SwarmConductor(agents);

      const result = await conductor.orchestrateAnalysis(mockProperty);

      // Consensus should mention top 3 with average of 80, 85, 90 = 85
      expect(result.consensusAnalysis.consensus).toContain('85.00');
    });

    it('should calculate high consensus confidence when agents agree', async () => {
      // All agents with very similar scores
      const agents = Array(6).fill(null).map((_, i) =>
        new MockAgent(`agent-${i}`, 75 + (i % 2), 0.85) // Scores between 75-76
      );
      const conductor = new SwarmConductor(agents);

      const result = await conductor.orchestrateAnalysis(mockProperty);

      // High agreement should yield high confidence
      expect(result.consensusAnalysis.confidence).toBeGreaterThan(0.7);
    });

    it('should calculate lower consensus confidence when agents disagree', async () => {
      // Agents with very different scores
      const agents = [
        new MockAgent('agent-1', 10, 0.90),
        new MockAgent('agent-2', 30, 0.85),
        new MockAgent('agent-3', 50, 0.80),
        new MockAgent('agent-4', 70, 0.75),
        new MockAgent('agent-5', 90, 0.95),
        new MockAgent('agent-6', 100, 0.82),
      ];
      const conductor = new SwarmConductor(agents);

      const result = await conductor.orchestrateAnalysis(mockProperty);

      // High variance should yield lower confidence
      expect(result.consensusAnalysis.confidence).toBeLessThan(0.7);
    });
  });

  describe('Utility methods', () => {
    it('should return correct agent count', () => {
      const agents = Array(6).fill(null).map((_, i) => new MockAgent(`agent-${i}`));
      const conductor = new SwarmConductor(agents);

      expect(conductor.getAgentCount()).toBe(6);
    });

    it('should return correct agent types', () => {
      const agents = Array(6).fill(null).map((_, i) => new MockAgent(`agent-${i}`));
      const conductor = new SwarmConductor(agents);

      const types = conductor.getAgentTypes();

      expect(types).toHaveLength(6);
      types.forEach((type) => {
        expect(type).toBe('MockAgent');
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle property with missing optional fields', async () => {
      const minimalProperty: Property = {
        id: 'minimal-prop',
        address: '123 Minimal St',
        price: 1000000,
        bedrooms: 2,
        bathrooms: 1,
        squareFootage: 1000,
        propertyType: 'CONDO',
        yearBuilt: 2015,
        neighborhood: 'Downtown',
      };

      const agents = Array(6).fill(null).map((_, i) => new MockAgent(`agent-${i}`));
      const conductor = new SwarmConductor(agents);

      const result = await conductor.orchestrateAnalysis(minimalProperty);

      expect(result.individualAnalyses).toHaveLength(6);
    });

    it('should handle very high property values', async () => {
      const expensiveProperty: Property = {
        ...mockProperty,
        price: 999999999999,
      };

      const agents = Array(6).fill(null).map((_, i) => new MockAgent(`agent-${i}`));
      const conductor = new SwarmConductor(agents);

      const result = await conductor.orchestrateAnalysis(expensiveProperty);

      expect(result.individualAnalyses).toHaveLength(6);
    });

    it('should handle concurrent analyses', async () => {
      const agents = Array(6).fill(null).map((_, i) => new MockAgent(`agent-${i}`));
      const conductor = new SwarmConductor(agents);

      // Run multiple analyses in parallel
      const results = await Promise.all([
        conductor.orchestrateAnalysis({ ...mockProperty, id: 'prop-1' }),
        conductor.orchestrateAnalysis({ ...mockProperty, id: 'prop-2' }),
        conductor.orchestrateAnalysis({ ...mockProperty, id: 'prop-3' }),
      ]);

      expect(results).toHaveLength(3);
      results.forEach((result, index) => {
        expect(result.individualAnalyses[0].propertyId).toBe(`prop-${index + 1}`);
      });
    });
  });
});
