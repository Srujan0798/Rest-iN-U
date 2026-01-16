import { BaseAgent, PropertyAnalysis, Property } from './BaseAgent';

export class LifestyleMapper extends BaseAgent {
  name = 'Lifestyle Mapper';
  role = 'Personal Fit Analyst';
  description = 'Analyzes commute times and lifestyle fit based on user preferences.';

  async analyze(property: Property): Promise<PropertyAnalysis> {
    // In a real implementation, we would fetch user preferences from the context or DB
    // and calculate commute times using Google Maps API.

    // Mock Logic:
    // 1. Calculate a "Commute Score" based on location (City center proximity)
    // 2. Calculate "Lifestyle Score" based on property type and amenities

    const cityCenterLat = 12.9716; // Bangalore (Example)
    const cityCenterLng = 77.5946;

    const distance = this.calculateDistance(
      property.location.latitude,
      property.location.longitude,
      cityCenterLat,
      cityCenterLng
    );

    // Score decreases as distance increases (Simple Linear Decay)
    // 10km = 100, 20km = 50, >30km = 0
    let commuteScore = Math.max(0, 100 - (distance * 5));

    // Lifestyle Score: Boost for "Amenities"
    let lifestyleScore = 70; // Base
    if (property.amenities.includes('Gym')) lifestyleScore += 10;
    if (property.amenities.includes('Pool')) lifestyleScore += 10;
    if (property.amenities.includes('Park')) lifestyleScore += 10;

    const overallScore = Math.round((commuteScore + lifestyleScore) / 2);

    return {
      agentName: this.name,
      score: overallScore,
      reasoning: [
        `Distance to City Center is approx ${distance.toFixed(1)} km (Score: ${Math.round(commuteScore)}/100)`,
        `Lifestyle amenities include ${property.amenities.slice(0, 3).join(', ')} (Score: ${lifestyleScore}/100)`,
        overallScore > 80 ? 'Excellent match for active lifestyle.' : 'Average match for daily commute.'
      ],
      confidence: 85,
      metadata: {
        commuteDistance: distance,
        commuteTimeMinutes: distance * 3 // Rough est: 20km/h avg in traffic
      }
    };
  }

  // Haversine formula for distance in km
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
