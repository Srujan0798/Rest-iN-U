import { describe, it, expect } from 'vitest';
import { VastuVidya } from '../VastuVidya';
import { Property } from '../BaseAgent';
import { Direction } from '../VastuRules';

describe('VastuVidya Agent', () => {
  const agent = new VastuVidya();

  it('should be instantiated with correct id and type', () => {
    expect(agent).toBeDefined();
    // @ts-ignore - accessing protected property for test
    expect(agent.agentId).toBe('vastu-vidya-001');
    // @ts-ignore - accessing protected property for test
    expect(agent.agentType).toBe('VASTU_EXPERT');
  });

  it('should give high score for perfect Vastu property', async () => {
    const perfectProperty: Property = {
      id: 'prop-1',
      address: '123 Heaven Lane',
      price: 1000000,
      bedrooms: 3,
      bathrooms: 2,
      squareFootage: 2000,
      propertyType: 'House',
      yearBuilt: 2020,
      neighborhood: 'Paradise',
      // Vastu fields
      entranceDirection: 'NE' as Direction,
      kitchenLocation: 'SE' as Direction,
      masterBedroomLocation: 'SW' as Direction,
      toiletLocation: 'NW' as Direction
    };

    const analysis = await agent.analyze(perfectProperty);

    expect(analysis.score).toBeGreaterThanOrEqual(90);
    expect(analysis.reasoning).toContain('Vastu Grade: A+');
  });

  it('should penalize SW entrance', async () => {
    const defectiveProperty: Property = {
      id: 'prop-2',
      address: '666 Hell Way',
      price: 500000,
      bedrooms: 3,
      bathrooms: 2,
      squareFootage: 1500,
      propertyType: 'House',
      yearBuilt: 2010,
      neighborhood: 'Underworld',
      // Defect: SW Entrance
      entranceDirection: 'SW' as Direction,
      kitchenLocation: 'SE' as Direction, // Good
      masterBedroomLocation: 'SW' as Direction, // Good
      toiletLocation: 'NW' as Direction // Good
    };

    const analysis = await agent.analyze(defectiveProperty);

    // SW Entrance is -25 (Critical) or similar impact
    // VastuRules has ENT-002: South-West Entrance Defect, scoreImpact: -25
    expect(analysis.score).toBeLessThan(80); 
    expect(analysis.reasoning).toContain('South-West Entrance Defect');
  });

  it('should penalize NE Kitchen', async () => {
    const defectiveProperty: Property = {
      id: 'prop-3',
      address: '123 Fire Water Clash',
      price: 600000,
      bedrooms: 2,
      bathrooms: 1,
      squareFootage: 1200,
      propertyType: 'Apartment',
      yearBuilt: 2015,
      neighborhood: 'City',
      // Good Entrance
      entranceDirection: 'N' as Direction, 
      // Defect: NE Kitchen
      kitchenLocation: 'NE' as Direction,
      masterBedroomLocation: 'SW' as Direction,
      toiletLocation: 'NW' as Direction
    };

    const analysis = await agent.analyze(defectiveProperty);

    // NE Kitchen is -25 (Critical)
    expect(analysis.score).toBeLessThan(80);
    expect(analysis.reasoning).toContain('Kitchen in North-East Defect');
  });

  it('should handle missing data gracefully', async () => {
    const unknownProperty: Property = {
      id: 'prop-4',
      address: 'Mystery Shack',
      price: 100,
      bedrooms: 1,
      bathrooms: 1,
      squareFootage: 500,
      propertyType: 'Shack',
      yearBuilt: 1900,
      neighborhood: 'Woods'
      // No Vastu fields
    };

    const analysis = await agent.analyze(unknownProperty);

    expect(analysis.score).toBe(100); // Defaults to perfect if no defects found? 
    // Wait, my implementation starts at 100.
    // Ideally it should probably reflect low confidence.
    expect(analysis.confidence).toBe(0);
    expect(analysis.reasoning).toContain('Entrance direction not specified');
  });
});
