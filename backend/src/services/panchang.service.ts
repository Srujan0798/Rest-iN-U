import {
  Body,
  SearchMoonPhase,
  SearchRiseSet,
  Observer,
  Equator,
  Ecliptic,
  GeoVector,
  RotationMatrix,
  Vector,
  AstroTime,
  MakeTime
} from 'astronomy-engine';
import * as Astronomy from 'astronomy-engine';

// Constants for Panchang calculations
const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra',
  'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha',
  'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami',
  'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami',
  'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
];

const YOGAS = [
  'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarman',
  'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi',
  'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti'
];

// Rahu Kaal segments (1/8th of daylight duration) starting index (0-7) for each day (Sun-Sat)
const RAHU_KAAL_SEGMENTS = [7, 1, 6, 4, 5, 3, 2]; // 0-based index of the 8 segments

export interface PanchangData {
  date: string;
  dayOfWeek: string;
  sunrise: string;
  sunset: string;
  tithi: { name: string; index: number };
  nakshatra: { name: string; index: number };
  yoga: { name: string; index: number };
  rahuKaal: { start: string; end: string };
  isAuspicious: boolean;
}

export class PanchangService {
  /**
   * Calculate Panchang details for a given date and location.
   * Defaults to New Delhi coordinates if not provided.
   */
  public calculatePanchang(date: Date, latitude: number = 28.6139, longitude: number = 77.2090): PanchangData {
    const observer = new Observer(latitude, longitude, 0);

    // Astronomy Engine works with its own Time object mostly, but accepts Dates in MakeTime
    const astroTime = Astronomy.MakeTime(date);

    // 1. Sunrise and Sunset
    // Find the sunrise relevant to the current "Panchang Day".
    // We search for two sunrises starting from 24h ago, and pick the one that starts the current day.
    const searchStart = new Date(date.getTime() - 24 * 3600 * 1000);
    const r1 = Astronomy.SearchRiseSet(Body.Sun, observer, +1, searchStart, 1);

    // If r1 is undefined (polar region?), handle gracefully.
    // Assuming normal latitudes for now.
    let dayRise = r1;
    if (r1) {
       // Search for the next sunrise to see if 'date' falls in the second cycle
       const r2 = Astronomy.SearchRiseSet(Body.Sun, observer, +1, r1.date, 1);
       if (r2 && r2.date <= date) {
         dayRise = r2;
       }
    }

    // Now find Sunset *after* the chosen sunrise
    const daySet = dayRise ? Astronomy.SearchRiseSet(Body.Sun, observer, -1, dayRise.date, 1) : null;

    // 2. Tithi Calculation
    // Use SunPosition for Sun Ecliptic Longitude
    const sunPos = Astronomy.SunPosition(astroTime);
    const sunLongitude = sunPos.elon;

    const moonPhase = Astronomy.MoonPhase(date); // Phase angle (0-360)

    // Tithi = Phase / 12
    const tithiIndex = Math.floor(moonPhase / 12);

    // 3. Nakshatra Calculation
    // MoonLon = (SunLon + Phase) % 360
    let moonLongitude = (sunLongitude + moonPhase) % 360;
    if (moonLongitude < 0) moonLongitude += 360;

    const ayanamsa = 24.1; // Approximate Lahiri Ayanamsa
    let siderealMoon = moonLongitude - ayanamsa;
    if (siderealMoon < 0) siderealMoon += 360;

    const nakshatraIndex = Math.floor(siderealMoon / 13.333333);

    // 4. Yoga Calculation
    let siderealSun = sunLongitude - ayanamsa;
    if (siderealSun < 0) siderealSun += 360;

    let yogaSum = siderealMoon + siderealSun;
    if (yogaSum > 360) yogaSum -= 360;

    const yogaIndex = Math.floor(yogaSum / 13.333333);

    // 5. Rahu Kaal
    let rahuStart: Date | null = null;
    let rahuEnd: Date | null = null;

    if (dayRise && daySet) {
      const riseTime = dayRise.date;
      const setTime = daySet.date;

      // Ensure valid duration
      if (setTime > riseTime) {
          const daylightDuration = setTime.getTime() - riseTime.getTime();
          const segmentDuration = daylightDuration / 8;

          const dayOfWeek = date.getDay(); // 0 = Sun, 6 = Sat
          const segmentIndex = RAHU_KAAL_SEGMENTS[dayOfWeek];

          rahuStart = new Date(riseTime.getTime() + (segmentIndex * segmentDuration));
          rahuEnd = new Date(rahuStart.getTime() + segmentDuration);
      }
    }

    return {
      date: date.toISOString().split('T')[0],
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()],
      sunrise: dayRise ? dayRise.date.toISOString() : 'N/A',
      sunset: daySet ? daySet.date.toISOString() : 'N/A',
      tithi: {
        name: TITHIS[tithiIndex] || 'Unknown',
        index: tithiIndex + 1 // 1-based usually
      },
      nakshatra: {
        name: NAKSHATRAS[nakshatraIndex] || 'Unknown',
        index: nakshatraIndex + 1
      },
      yoga: {
        name: YOGAS[yogaIndex] || 'Unknown',
        index: yogaIndex + 1
      },
      rahuKaal: {
        start: rahuStart ? rahuStart.toISOString() : '',
        end: rahuEnd ? rahuEnd.toISOString() : ''
      },
      isAuspicious: this.checkAuspicious(tithiIndex, nakshatraIndex, rahuStart, rahuEnd, date)
    };
  }

  private checkAuspicious(tithiIdx: number, nakshatraIdx: number, rahuStart: Date | null, rahuEnd: Date | null, queryTime: Date): boolean {
    // 1. Check Rahu Kaal
    if (rahuStart && rahuEnd) {
      if (queryTime >= rahuStart && queryTime <= rahuEnd) {
        return false; // In Rahu Kaal
      }
    }

    // 2. Check Tithi (Avoid Rikta Tithis)
    const riktaTithis = [3, 8, 13, 18, 23, 28, 29];
    if (riktaTithis.includes(tithiIdx)) {
      return false;
    }

    // 3. Good Nakshatras
    const goodNakshatras = [3, 4, 7, 11, 12, 13, 14, 16, 20, 21, 22, 23, 25, 26];
    if (goodNakshatras.includes(nakshatraIdx)) {
      return true;
    }

    return true;
  }
}
