import { describe, it, expect } from 'vitest';
import { VastuVidya } from '../VastuVidya';

describe('Vastu Vidya Logic', () => {
  const vastuEngine = new VastuVidya();

  describe('Direction Normalization', () => {
    it('should normalize "North-East", "NE", "North East" to "NE"', () => {
      const directions = ['North-East', 'NE', 'North East', 'north_east', 'NORTHEAST'];

      directions.forEach(dir => {
        // We simulate a room analysis for 'pooja room' (mapped to 'poojaroom' internally usually, or strict match)
        // VastuVidya.ts uses 'pooja room' in the DIRECTION_PROPERTIES map for NE.

        // Wait, VastuRules.ts map has:
        // NE: idealFor: ['pooja room'...]

        // My test calls calculateRoomScore('pooja room', dir)
        const score = vastuEngine.calculateRoomScore('pooja room', dir);

        // Puja room in NE is ideal -> should be 100
        expect(score).toBe(100);
      });
    });
  });

  describe('Critical Flaws (Maha Dosha)', () => {
    it('should heavily penalize a Toilet in the North East (Ishaan)', () => {
        const score = vastuEngine.calculateRoomScore('toilet', 'NE');
        expect(score).toBe(0); // Absolute worst
    });

    it('should heavily penalize a Kitchen in the North East', () => {
        const score = vastuEngine.calculateRoomScore('kitchen', 'North East'); // Test normalization too
        expect(score).toBeLessThan(30); // Should be very low (20 in code)
    });
  });

  describe('Ideal Placements', () => {
    it('should give high score for Master Bedroom in South West (Nairutya)', () => {
        // VastuRules map: SW idealFor ['master bedroom'...]
        const score = vastuEngine.calculateRoomScore('master bedroom', 'SW');
        expect(score).toBe(100);
    });

    it('should give high score for Kitchen in South East (Agni)', () => {
        // VastuRules map: SE idealFor ['kitchen'...]
        const score = vastuEngine.calculateRoomScore('kitchen', 'SE');
        expect(score).toBe(100);
    });
  });
});
