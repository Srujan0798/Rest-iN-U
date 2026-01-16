import * as Astronomy from 'astronomy-engine';

// Helper for MakeTime since it is a top-level function in some versions or attached to Astronomy in others
const MakeTime = Astronomy.MakeTime;

export interface BirthDetails {
  dateOfBirth: Date | string;
  timeOfBirth: string; // "HH:MM"
  placeOfBirth: {
    latitude: number;
    longitude: number;
  };
}

export interface PlanetaryPosition {
  planet: string;
  longitude: number; // 0-360 degrees
  sign: string;
  house?: number;
  retrograde: boolean;
}

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export class AstrologyService {
  /**
   * Calculate planetary positions for a given date/time and location
   */
  private calculatePlanets(date: Date, latitude?: number, longitude?: number): PlanetaryPosition[] {
    const astronomyDate = MakeTime(date);
    const planets = [
      { name: 'Sun', body: Astronomy.Body.Sun },
      { name: 'Moon', body: Astronomy.Body.Moon },
      { name: 'Mercury', body: Astronomy.Body.Mercury },
      { name: 'Venus', body: Astronomy.Body.Venus },
      { name: 'Mars', body: Astronomy.Body.Mars },
      { name: 'Jupiter', body: Astronomy.Body.Jupiter },
      { name: 'Saturn', body: Astronomy.Body.Saturn },
    ];

    return planets.map(p => {
      // Calculate geocentric coordinates (Earth-centered)
      // For astrological charts, we typically use Geocentric Ecliptic coordinates
      const vector = Astronomy.GeoVector(p.body, astronomyDate, true);

      // Convert to spherical coordinates (longitude, latitude, distance)
      // We only really care about longitude for the Zodiac sign
      // Note: This is Tropical Zodiac. For Vedic (Sidereal), we need to subtract Ayanamsa (~24 degrees).
      // Let's implement Tropical for now as it's standard in this library, or approximate Sidereal.
      // Standard approximation for Lahiri Ayanamsa is roughly 24 degrees.

      // Calculate Ecliptic longitude
      // We can use Ecliptic(vector) which returns {lon, lat}
      const ecliptic = Astronomy.Ecliptic(vector);

      // Convert to Sidereal (Vedic) by subtracting Ayanamsa (approx 24 deg for modern times)
      let siderealLon = ecliptic.lon - 24.0;
      if (siderealLon < 0) siderealLon += 360;

      const signIndex = Math.floor(siderealLon / 30);
      const sign = ZODIAC_SIGNS[signIndex];

      return {
        planet: p.name,
        longitude: siderealLon,
        sign: sign,
        retrograde: false // Simplified for now
      };
    });
  }

  /**
   * Calculate compatibility between user birth data and property construction date
   * Returns a "Cosmic Score" (0-100) and a Summary
   */
  public calculateCompatibility(userBirthData: BirthDetails, propertyConstructionDate: Date | string) {
    const userDate = new Date(userBirthData.dateOfBirth);
    const [hours, minutes] = userBirthData.timeOfBirth.split(':').map(Number);
    userDate.setHours(hours, minutes);

    const propDate = new Date(propertyConstructionDate);
    // Assume noon for property if time unknown
    propDate.setHours(12, 0, 0);

    const userPlanets = this.calculatePlanets(
      userDate,
      userBirthData.placeOfBirth.latitude,
      userBirthData.placeOfBirth.longitude
    );

    const propPlanets = this.calculatePlanets(propDate); // Location matters less for slow moving planets usually, but let's assume global

    let score = 50; // Base score
    const details: string[] = [];

    // 1. Check Jupiter alignment (Prosperity)
    const userJupiter = userPlanets.find(p => p.planet === 'Jupiter');
    const propJupiter = propPlanets.find(p => p.planet === 'Jupiter');

    if (userJupiter && propJupiter) {
      // Trine (120) or Sextile (60) is good
      const angle = Math.abs(userJupiter.longitude - propJupiter.longitude);
      const diff = Math.min(angle, 360 - angle);

      if (Math.abs(diff - 120) < 10) {
        score += 20;
        details.push("Jupiter forms a prosperous Trine, indicating wealth and abundance.");
      } else if (Math.abs(diff - 60) < 10) {
        score += 10;
        details.push("Jupiter is in a supportive Sextile, suggesting growth.");
      }
    }

    // 2. Sun-Moon Harmony (Vitality & Comfort)
    const userSun = userPlanets.find(p => p.planet === 'Sun');
    const propMoon = propPlanets.find(p => p.planet === 'Moon');

    if (userSun && propMoon) {
       const angle = Math.abs(userSun.longitude - propMoon.longitude);
       // Conjunction (0) or Opposition (180) can be powerful
       if (angle < 15) {
         score += 15;
         details.push("Sun and Moon are conjoint, bringing strong emotional resonance.");
       }
    }

    // 3. Saturn Stability (Longevity)
    const userSaturn = userPlanets.find(p => p.planet === 'Saturn');
    const propSun = propPlanets.find(p => p.planet === 'Sun');
    if (userSaturn && propSun) {
      // Square (90) is challenging
      const angle = Math.abs(userSaturn.longitude - propSun.longitude);
      const diff = Math.min(angle, 360 - angle);

      if (Math.abs(diff - 90) < 10) {
        score -= 15;
        details.push("Saturn squares the Property Sun, indicating potential delays or structural challenges.");
      } else {
        score += 5; // General stability
      }
    }

    // Normalize score
    score = Math.max(0, Math.min(100, score));

    // Generate Magical Summary
    let summary = "";
    if (score > 80) {
      summary = "The stars have aligned! This property is a destined sanctuary for you.";
    } else if (score > 60) {
      summary = "A harmonious match. The cosmic energies support your growth here.";
    } else {
      summary = "Cosmic energies are mixed. Remedial Vastu measures may be needed.";
    }

    if (details.length > 0) {
      summary += " " + details.join(" ");
    }

    return {
      score,
      summary,
      details,
      userPlanets: userPlanets.map(p => ({ planet: p.planet, sign: p.sign })),
      propertyPlanets: propPlanets.map(p => ({ planet: p.planet, sign: p.sign }))
    };
  }
}

export const astrologyService = new AstrologyService();
