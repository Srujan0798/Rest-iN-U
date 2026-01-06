
import { describe, it, expect } from 'vitest';
import { VastuService } from './vastu.service';

describe('VastuService', () => {
    const service = new VastuService();

    it('should calculate entrance score correctly for NORTH_EAST', async () => {
        const result = await service.analyzeProperty({
            orientation: 'NORTH',
            propertyType: 'HOUSE',
            entrance: { direction: 'NORTH_EAST' }
        });

        expect(result.entranceAnalysis.score).toBe(100);
        expect(result.entranceAnalysis.isIdeal).toBe(true);
    });

    it('should identify critical defects for SOUTH_WEST entrance', async () => {
        const result = await service.analyzeProperty({
            orientation: 'NORTH',
            propertyType: 'HOUSE',
            entrance: { direction: 'SOUTH_WEST' }
        });

        expect(result.entranceAnalysis.score).toBe(30);
        expect(result.criticalDefects).toBeGreaterThan(0);
        expect(result.issues[0].remedies.length).toBeGreaterThan(0);
    });

    it('should analyze room placements', async () => {
        const result = await service.analyzeProperty({
            orientation: 'NORTH',
            propertyType: 'HOUSE',
            entrance: { direction: 'NORTH' },
            rooms: [
                { type: 'kitchen', direction: 'SOUTH_EAST' }, // Ideal
                { type: 'masterBedroom', direction: 'NORTH_EAST' } // Avoid (Critical)
            ]
        });

        // The key in roomAnalysis matches the input type string
        expect(result.roomAnalysis.kitchen).toBeDefined();
        expect(result.roomAnalysis.kitchen.score).toBe(100);

        expect(result.roomAnalysis.masterBedroom).toBeDefined();
        expect(result.roomAnalysis.masterBedroom.score).toBe(30);

        expect(result.overallScore).toBeLessThan(100);
    });
});
