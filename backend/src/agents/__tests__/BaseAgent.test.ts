import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseAgent, Property, PropertyAnalysis, AgentDebate } from '../BaseAgent';

// Concrete implementation of BaseAgent for testing
class TestAgent extends BaseAgent {
  private mockScore: number;
  private mockConfidence: number;
  private mockReasoning: string;

  constructor(
    id: string,
    type: string = 'TestAgent',
    score: number = 75,
    confidence: number = 0.85,
    reasoning: string = 'Test reasoning'
  ) {
    super(id, type);
    this.mockScore = score;
    this.mockConfidence = confidence;
    this.mockReasoning = reasoning;
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    return {
      agentId: this.agentId,
      propertyId: property.id,
      score: this.mockScore,
      confidence: this.mockConfidence,
      reasoning: this.mockReasoning,
      timestamp: new Date(),
    };
  }

  // Expose protected methods for testing
  public testCalculateConsensus(analyses: PropertyAnalysis[]): string {
    return this.calculateConsensus(analyses);
  }

  public testCalculateDebateConfidence(analyses: PropertyAnalysis[]): number {
    return this.calculateDebateConfidence(analyses);
  }

  public async testDelay(ms: number): Promise<void> {
    return this.delay(ms);
  }
}

// Test fixtures
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

const createMockAnalysis = (
  agentId: string,
  score: number,
  confidence: number
): PropertyAnalysis => ({
  agentId,
  propertyId: mockProperty.id,
  score,
  confidence,
  reasoning: `Analysis from ${agentId}`,
  timestamp: new Date(),
});

describe('BaseAgent', () => {
  let agent: TestAgent;

  beforeEach(() => {
    agent = new TestAgent('test-agent-1', 'TestAgent');
  });

  describe('Constructor', () => {
    it('should initialize with correct agentId', () => {
      const customAgent = new TestAgent('custom-id', 'CustomType');
      // Testing through analyze which uses agentId
      return customAgent.analyze(mockProperty).then((analysis) => {
        expect(analysis.agentId).toBe('custom-id');
      });
    });

    it('should accept any valid string as agentId', () => {
      const ids = ['agent-1', 'discovery-scout', 'agent_with_underscore', '123-numeric'];
      ids.forEach((id) => {
        expect(() => new TestAgent(id)).not.toThrow();
      });
    });
  });

  describe('analyze', () => {
    it('should return PropertyAnalysis with all required fields', async () => {
      const analysis = await agent.analyze(mockProperty);

      expect(analysis).toHaveProperty('agentId');
      expect(analysis).toHaveProperty('propertyId');
      expect(analysis).toHaveProperty('score');
      expect(analysis).toHaveProperty('confidence');
      expect(analysis).toHaveProperty('reasoning');
      expect(analysis).toHaveProperty('timestamp');
    });

    it('should return correct property ID', async () => {
      const analysis = await agent.analyze(mockProperty);

      expect(analysis.propertyId).toBe(mockProperty.id);
    });

    it('should return correct agent ID', async () => {
      const analysis = await agent.analyze(mockProperty);

      expect(analysis.agentId).toBe('test-agent-1');
    });

    it('should return timestamp as Date object', async () => {
      const analysis = await agent.analyze(mockProperty);

      expect(analysis.timestamp).toBeInstanceOf(Date);
    });

    it('should return score within valid range', async () => {
      const analysis = await agent.analyze(mockProperty);

      expect(analysis.score).toBeGreaterThanOrEqual(0);
      expect(analysis.score).toBeLessThanOrEqual(100);
    });

    it('should return confidence within valid range', async () => {
      const analysis = await agent.analyze(mockProperty);

      expect(analysis.confidence).toBeGreaterThanOrEqual(0);
      expect(analysis.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('debate', () => {
    it('should return AgentDebate with all required fields', async () => {
      const analyses = [
        createMockAnalysis('agent-2', 80, 0.90),
        createMockAnalysis('agent-3', 75, 0.85),
      ];

      const debate = await agent.debate(analyses);

      expect(debate).toHaveProperty('analyses');
      expect(debate).toHaveProperty('consensus');
      expect(debate).toHaveProperty('confidence');
      expect(debate).toHaveProperty('timestamp');
    });

    it('should filter out own analysis from debate', async () => {
      const analyses = [
        createMockAnalysis('test-agent-1', 80, 0.90), // Same ID as agent
        createMockAnalysis('agent-2', 75, 0.85),
        createMockAnalysis('agent-3', 70, 0.80),
      ];

      const debate = await agent.debate(analyses);

      // Should only include agent-2 and agent-3
      expect(debate.analyses).toHaveLength(2);
      expect(debate.analyses.every((a) => a.agentId !== 'test-agent-1')).toBe(true);
    });

    it('should return timestamp as Date object', async () => {
      const analyses = [createMockAnalysis('agent-2', 80, 0.90)];

      const debate = await agent.debate(analyses);

      expect(debate.timestamp).toBeInstanceOf(Date);
    });

    it('should handle empty analyses array', async () => {
      const debate = await agent.debate([]);

      expect(debate.analyses).toHaveLength(0);
      expect(debate.consensus).toBe('No consensus available');
      expect(debate.confidence).toBe(0);
    });

    it('should handle single analysis', async () => {
      const analyses = [createMockAnalysis('agent-2', 80, 0.90)];

      const debate = await agent.debate(analyses);

      expect(debate.analyses).toHaveLength(1);
      expect(debate.confidence).toBeGreaterThan(0);
    });
  });

  describe('calculateConsensus', () => {
    it('should return no consensus for empty array', () => {
      const result = agent.testCalculateConsensus([]);

      expect(result).toBe('No consensus available');
    });

    it('should calculate correct average score', () => {
      const analyses = [
        createMockAnalysis('agent-1', 80, 0.90),
        createMockAnalysis('agent-2', 60, 0.85),
      ];

      const result = agent.testCalculateConsensus(analyses);

      // Average score: (80 + 60) / 2 = 70
      expect(result).toContain('70.00');
    });

    it('should calculate correct average confidence', () => {
      const analyses = [
        createMockAnalysis('agent-1', 80, 0.90),
        createMockAnalysis('agent-2', 60, 0.80),
      ];

      const result = agent.testCalculateConsensus(analyses);

      // Average confidence: (0.90 + 0.80) / 2 = 0.85
      expect(result).toContain('0.85');
    });

    it('should format consensus string correctly', () => {
      const analyses = [createMockAnalysis('agent-1', 75, 0.85)];

      const result = agent.testCalculateConsensus(analyses);

      expect(result).toMatch(/Consensus score: \d+\.\d+, Confidence: \d+\.\d+/);
    });
  });

  describe('calculateDebateConfidence', () => {
    it('should return 0 for empty analyses', () => {
      const result = agent.testCalculateDebateConfidence([]);

      expect(result).toBe(0);
    });

    it('should return high confidence when agents agree', () => {
      // All scores very similar
      const analyses = [
        createMockAnalysis('agent-1', 75, 0.85),
        createMockAnalysis('agent-2', 76, 0.85),
        createMockAnalysis('agent-3', 74, 0.85),
      ];

      const result = agent.testCalculateDebateConfidence(analyses);

      expect(result).toBeGreaterThan(0.8);
    });

    it('should return lower confidence when agents disagree', () => {
      // Scores very different
      const analyses = [
        createMockAnalysis('agent-1', 10, 0.85),
        createMockAnalysis('agent-2', 50, 0.85),
        createMockAnalysis('agent-3', 90, 0.85),
      ];

      const result = agent.testCalculateDebateConfidence(analyses);

      // High variance should lower confidence
      expect(result).toBeLessThan(0.6);
    });

    it('should factor in average confidence', () => {
      // Same scores but different confidences
      const highConfAnalyses = [
        createMockAnalysis('agent-1', 75, 0.95),
        createMockAnalysis('agent-2', 75, 0.95),
      ];

      const lowConfAnalyses = [
        createMockAnalysis('agent-1', 75, 0.50),
        createMockAnalysis('agent-2', 75, 0.50),
      ];

      const highResult = agent.testCalculateDebateConfidence(highConfAnalyses);
      const lowResult = agent.testCalculateDebateConfidence(lowConfAnalyses);

      expect(highResult).toBeGreaterThan(lowResult);
    });

    it('should handle single analysis', () => {
      const analyses = [createMockAnalysis('agent-1', 75, 0.85)];

      const result = agent.testCalculateDebateConfidence(analyses);

      // Single analysis: (1 + 0.85) / 2 = 0.925
      expect(result).toBeCloseTo(0.925, 2);
    });
  });

  describe('delay utility', () => {
    it('should delay for specified duration', async () => {
      const startTime = Date.now();
      const delayMs = 50;

      await agent.testDelay(delayMs);

      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(delayMs - 10); // Allow 10ms tolerance
    });

    it('should resolve after delay', async () => {
      const result = agent.testDelay(10);

      await expect(result).resolves.toBeUndefined();
    });
  });

  describe('Interface types', () => {
    it('should accept Property with additional fields', async () => {
      const extendedProperty: Property = {
        ...mockProperty,
        customField: 'custom value',
        anotherField: 12345,
      };

      const analysis = await agent.analyze(extendedProperty);

      expect(analysis.propertyId).toBe(extendedProperty.id);
    });

    it('should handle Property with all required fields only', async () => {
      const minimalProperty: Property = {
        id: 'minimal-123',
        address: '456 Minimal Ave',
        price: 1000000,
        bedrooms: 1,
        bathrooms: 1,
        squareFootage: 500,
        propertyType: 'STUDIO',
        yearBuilt: 2000,
        neighborhood: 'Central',
      };

      const analysis = await agent.analyze(minimalProperty);

      expect(analysis.propertyId).toBe('minimal-123');
    });
  });

  describe('Multiple agents interaction', () => {
    it('should produce different analyses from different agents', async () => {
      const agent1 = new TestAgent('agent-1', 'Type1', 80, 0.90, 'Agent 1 reasoning');
      const agent2 = new TestAgent('agent-2', 'Type2', 60, 0.70, 'Agent 2 reasoning');

      const analysis1 = await agent1.analyze(mockProperty);
      const analysis2 = await agent2.analyze(mockProperty);

      expect(analysis1.agentId).not.toBe(analysis2.agentId);
      expect(analysis1.score).not.toBe(analysis2.score);
      expect(analysis1.confidence).not.toBe(analysis2.confidence);
      expect(analysis1.reasoning).not.toBe(analysis2.reasoning);
    });

    it('should allow cross-agent debate', async () => {
      const agent1 = new TestAgent('agent-1', 'Type1', 80, 0.90);
      const agent2 = new TestAgent('agent-2', 'Type2', 60, 0.70);

      const analysis1 = await agent1.analyze(mockProperty);
      const analysis2 = await agent2.analyze(mockProperty);

      // Agent 1 debates with Agent 2's analysis
      const debate = await agent1.debate([analysis1, analysis2]);

      // Should exclude agent1's own analysis
      expect(debate.analyses).toHaveLength(1);
      expect(debate.analyses[0].agentId).toBe('agent-2');
    });
  });

  describe('Edge cases', () => {
    it('should handle zero score', async () => {
      const zeroScoreAgent = new TestAgent('zero-agent', 'Test', 0, 0.85);

      const analysis = await zeroScoreAgent.analyze(mockProperty);

      expect(analysis.score).toBe(0);
    });

    it('should handle zero confidence', async () => {
      const zeroConfAgent = new TestAgent('zero-conf', 'Test', 75, 0);

      const analysis = await zeroConfAgent.analyze(mockProperty);

      expect(analysis.confidence).toBe(0);
    });

    it('should handle maximum score', async () => {
      const maxScoreAgent = new TestAgent('max-agent', 'Test', 100, 0.85);

      const analysis = await maxScoreAgent.analyze(mockProperty);

      expect(analysis.score).toBe(100);
    });

    it('should handle maximum confidence', async () => {
      const maxConfAgent = new TestAgent('max-conf', 'Test', 75, 1.0);

      const analysis = await maxConfAgent.analyze(mockProperty);

      expect(analysis.confidence).toBe(1.0);
    });

    it('should handle empty reasoning', async () => {
      const emptyReasonAgent = new TestAgent('empty-reason', 'Test', 75, 0.85, '');

      const analysis = await emptyReasonAgent.analyze(mockProperty);

      expect(analysis.reasoning).toBe('');
    });

    it('should handle very long reasoning', async () => {
      const longReasoning = 'A'.repeat(10000);
      const longReasonAgent = new TestAgent('long-reason', 'Test', 75, 0.85, longReasoning);

      const analysis = await longReasonAgent.analyze(mockProperty);

      expect(analysis.reasoning).toBe(longReasoning);
    });
  });
});
