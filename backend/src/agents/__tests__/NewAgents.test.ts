import { describe, it, expect } from 'vitest';
import { LifestyleMapper } from '../LifestyleMapper';
import { AppreciationProphet } from '../AppreciationProphet';
import { ReraRadar } from '../ReraRadar';
import { NegotiationStrategist } from '../NegotiationStrategist';
import { Property, PropertyType, ListingType, PropertyStatus } from '../BaseAgent';

// Mock Property Data
const mockProperty: Property = {
  id: 'test-prop-1',
  title: 'Luxury Apartment near Metro',
  description: 'A beautiful apartment with gym and pool.',
  price: 15000000, // 1.5 Cr
  location: {
    address: 'Indiranagar, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560038',
    latitude: 12.9784,
    longitude: 77.6408,
  },
  features: ['Metro nearby', 'Gym', 'Pool', 'Park'],
  amenities: ['Gym', 'Pool', 'Park'],
  propertyType: PropertyType.APARTMENT,
  listingType: ListingType.SALE,
  status: PropertyStatus.ACTIVE,
  agentId: 'agent-1',
  images: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('New Agents Swarm', () => {

  describe('LifestyleMapper', () => {
    it('should calculate a lifestyle score based on proximity and amenities', async () => {
      const agent = new LifestyleMapper();
      const result = await agent.analyze(mockProperty);

      expect(result.agentName).toBe('Lifestyle Mapper');
      expect(result.score).toBeGreaterThan(0);
      expect(result.metadata).toHaveProperty('commuteDistance');
      // Bangalore coords (mocked inside agent) are close to Indiranagar, so distance should be small
      expect(result.metadata.commuteDistance).toBeLessThan(10);
    });
  });

  describe('AppreciationProphet', () => {
    it('should predict future value based on city tier and metro', async () => {
      const agent = new AppreciationProphet();
      const result = await agent.analyze(mockProperty);

      expect(result.agentName).toBe('Appreciation Prophet');
      expect(result.metadata).toHaveProperty('cagr');
      // Bangalore + Metro should be high growth (0.08 + 0.02 = 0.10 ideally)
      expect(result.metadata.cagr).toBeGreaterThanOrEqual(0.08);
      expect(result.metadata.projectedValue5Y).toBeGreaterThan(mockProperty.price);
    });
  });

  describe('ReraRadar', () => {
    it('should check for RERA compliance', async () => {
      const agent = new ReraRadar();
      const result = await agent.analyze(mockProperty);

      expect(result.agentName).toBe('RERA Radar');
      expect(result.metadata).toHaveProperty('reraVerified');
      // Since logic is random/mocked, we just check structure
      expect(result.score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('NegotiationStrategist', () => {
    it('should suggest negotiation tactics', async () => {
      const agent = new NegotiationStrategist();
      const result = await agent.analyze(mockProperty);

      expect(result.agentName).toBe('Negotiation Strategist');
      expect(result.metadata).toHaveProperty('daysOnMarket');
      expect(result.reasoning.length).toBeGreaterThan(0);
    });
  });

});
