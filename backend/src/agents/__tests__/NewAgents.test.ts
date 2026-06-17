import { describe, it, expect, beforeEach } from 'vitest';
import {
  LifestyleMapper,
  AppreciationProphet,
  ReraRadar,
  NegotiationStrategist,
  Property
} from '../index';

const mockProperty: Property = {
  id: 'test-property-123',
  address: '123 Test Street, Bangalore',
  price: 7500000,
  bedrooms: 3,
  bathrooms: 2,
  squareFootage: 1500,
  propertyType: 'HOUSE',
  yearBuilt: 2020,
  neighborhood: 'Electronic City',
  status: 'ACTIVE'
};

describe('New Agents Implementation', () => {

  describe('LifestyleMapper', () => {
    let agent: LifestyleMapper;

    beforeEach(() => {
      agent = new LifestyleMapper();
    });

    it('should be instantiated correctly', () => {
      expect(agent).toBeInstanceOf(LifestyleMapper);
    });

    it('should analyze property and return valid score', async () => {
      const analysis = await agent.analyze(mockProperty);
      expect(analysis.score).toBeGreaterThanOrEqual(0);
      expect(analysis.score).toBeLessThanOrEqual(10);
      expect(analysis.agentId).toContain('lifestyle-mapper');
      expect(analysis.reasoning).toContain('Family Score:');
    });
  });

  describe('AppreciationProphet', () => {
    let agent: AppreciationProphet;

    beforeEach(() => {
      agent = new AppreciationProphet();
    });

    it('should be instantiated correctly', () => {
      expect(agent).toBeInstanceOf(AppreciationProphet);
    });

    it('should analyze property and return growth projections', async () => {
      const analysis = await agent.analyze(mockProperty);
      expect(analysis.score).toBeGreaterThanOrEqual(0);
      expect(analysis.score).toBeLessThanOrEqual(10);
      expect(analysis.agentId).toContain('appreciation-prophet');
      expect(analysis.reasoning).toContain('Projected 5-Year Growth');
    });
  });

  describe('ReraRadar', () => {
    let agent: ReraRadar;

    beforeEach(() => {
      agent = new ReraRadar();
    });

    it('should be instantiated correctly', () => {
      expect(agent).toBeInstanceOf(ReraRadar);
    });

    it('should analyze property and return compliance status', async () => {
      const analysis = await agent.analyze(mockProperty);
      expect(analysis.score).toBeGreaterThanOrEqual(1);
      expect(analysis.score).toBeLessThanOrEqual(10);
      expect(analysis.agentId).toContain('rera-radar');
      expect(analysis.reasoning).toContain('RERA'); // Should mention RERA or CRITICAL
    });
  });

  describe('NegotiationStrategist', () => {
    let agent: NegotiationStrategist;

    beforeEach(() => {
      agent = new NegotiationStrategist();
    });

    it('should be instantiated correctly', () => {
      expect(agent).toBeInstanceOf(NegotiationStrategist);
    });

    it('should analyze property and return negotiation strategy', async () => {
      const analysis = await agent.analyze(mockProperty);
      expect(analysis.score).toBeGreaterThanOrEqual(0);
      expect(analysis.score).toBeLessThanOrEqual(10);
      expect(analysis.agentId).toContain('negotiation-strategist');
      expect(analysis.reasoning).toContain('Suggest starting offer');
    });
  });

});
