
import { describe, it, expect } from 'vitest';
import {
  getDirectionProperties,
  normalizeDirection,
  Direction
} from '../VastuRules';
import { JyotishMatcher, BirthDetails, PropertyJyotishDetails } from '../JyotishMatcher';

// Subclass to bypass delay
class TestJyotishMatcher extends JyotishMatcher {
  protected async delay(ms: number): Promise<void> {
    return Promise.resolve();
  }
}

describe('VastuRules Normalization', () => {
  it('should normalize exact direction codes', () => {
    expect(normalizeDirection('NE')).toBe('NE');
    expect(normalizeDirection('N')).toBe('N');
  });

  it('should normalize full names', () => {
    expect(normalizeDirection('North-East')).toBe('NE');
    expect(normalizeDirection('North East')).toBe('NE');
    expect(normalizeDirection('NORTH_EAST')).toBe('NE'); // underscore handling
    expect(normalizeDirection('North')).toBe('N');
    expect(normalizeDirection('South West')).toBe('SW');
  });

  it('should get properties for mixed case inputs', () => {
    const props = getDirectionProperties('North-East');
    expect(props).toBeDefined();
    expect(props?.deity).toContain('Ishaan');

    const props2 = getDirectionProperties('sw');
    expect(props2).toBeDefined();
    expect(props2?.element).toBe('earth');
  });
});

describe('JyotishMatcher Direction Compatibility', () => {
  const matcher = new TestJyotishMatcher();

  // A sample birth details (Mesha Rashi -> Best direction EAST ('E'))
  const birthDetails: BirthDetails = {
    dateOfBirth: '1990-04-15', // Aries (Mesha)
    timeOfBirth: '12:00',
    placeOfBirth: {
      city: 'Mumbai',
      country: 'India'
    }
  };

  it('should match using Normalized Short Code "E"', async () => {
    const propertyDetails: PropertyJyotishDetails = {
      propertyId: '1',
      address: 'Test Address',
      entranceDirection: 'E'
    };

    const result = await matcher.matchBuyerToProperty(birthDetails, propertyDetails);
    const directionFactor = result.factors.find(f => f.name === 'Direction Compatibility');

    // Should be Excellent (score 25)
    expect(directionFactor?.score).toBe(25);
    expect(directionFactor?.description).toContain('Excellent!');
  });

  it('should match using Long Name "East"', async () => {
    const propertyDetails: PropertyJyotishDetails = {
      propertyId: '1',
      address: 'Test Address',
      entranceDirection: 'East'
    };

    const result = await matcher.matchBuyerToProperty(birthDetails, propertyDetails);
    const directionFactor = result.factors.find(f => f.name === 'Direction Compatibility');

    expect(directionFactor?.score).toBe(25);
  });

  it('should match using Variation "North-East"', async () => {
     // Mesha Rashi Good is NE.
     const propertyDetails: PropertyJyotishDetails = {
      propertyId: '1',
      address: 'Test Address',
      entranceDirection: 'North-East'
    };

    const result = await matcher.matchBuyerToProperty(birthDetails, propertyDetails);
    const directionFactor = result.factors.find(f => f.name === 'Direction Compatibility');

    // Should be Good (score 20)
    expect(directionFactor?.score).toBe(20);
    expect(directionFactor?.description).toContain('Good match!');
  });
});
