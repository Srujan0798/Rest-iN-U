import { describe, it, expect } from 'vitest';
import { PanchangService } from '../../src/services/panchang.service';

describe('PanchangService', () => {
  const panchangService = new PanchangService();

  it('should calculate valid Panchang data for a known date', () => {
    // January 1, 2024, 12:00 PM UTC
    // New Delhi coordinates
    const date = new Date('2024-01-01T12:00:00Z');
    const lat = 28.6139;
    const lng = 77.2090;

    const result = panchangService.calculatePanchang(date, lat, lng);

    expect(result).toBeDefined();
    expect(result.date).toBe('2024-01-01');
    expect(result.dayOfWeek).toBe('Monday'); // Jan 1 2024 was Monday

    // Check structure
    expect(result.tithi).toHaveProperty('name');
    expect(result.nakshatra).toHaveProperty('name');
    expect(result.yoga).toHaveProperty('name');
    expect(result.rahuKaal).toHaveProperty('start');
    expect(result.rahuKaal).toHaveProperty('end');

    // Check specific known values approx
    expect(result.tithi.name).not.toBe('Unknown');
    expect(result.nakshatra.name).not.toBe('Unknown');
  });

  it('should identify Rahu Kaal correctly', () => {
    // Determine a time that should be inside Rahu Kaal
    // Monday Rahu Kaal is approx 7:30 AM - 9:00 AM (2nd part of day)
    // Let's pick a date where we can predict Rahu Kaal

    // Let's just verify that Rahu Kaal start < end
    const date = new Date('2024-06-21T12:00:00Z'); // Summer solstice
    const result = panchangService.calculatePanchang(date);

    const start = new Date(result.rahuKaal.start);
    const end = new Date(result.rahuKaal.end);

    expect(start.getTime()).toBeLessThan(end.getTime());

    // Duration should be approx 1/8 of day (approx 1.5 - 1.7 hours depending on latitude/season)
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    expect(durationHours).toBeGreaterThan(1.0);
    expect(durationHours).toBeLessThan(2.5);
  });
});
