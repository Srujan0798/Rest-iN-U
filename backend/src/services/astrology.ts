// Astrological Timing & Numerology Service
import { logger } from '../utils/logger';

// Nakshatra (Lunar Mansions) data
const NAKSHATRAS = [
  { name: 'Ashwini', deity: 'Ashwini Kumaras', nature: 'Light', ruler: 'Ketu', forProperty: true },
  { name: 'Bharani', deity: 'Yama', nature: 'Fierce', ruler: 'Venus', forProperty: false },
  { name: 'Krittika', deity: 'Agni', nature: 'Mixed', ruler: 'Sun', forProperty: false },
  { name: 'Rohini', deity: 'Brahma', nature: 'Fixed', ruler: 'Moon', forProperty: true },
  { name: 'Mrigashira', deity: 'Soma', nature: 'Soft', ruler: 'Mars', forProperty: true },
  { name: 'Ardra', deity: 'Rudra', nature: 'Sharp', ruler: 'Rahu', forProperty: false },
  { name: 'Punarvasu', deity: 'Aditi', nature: 'Movable', ruler: 'Jupiter', forProperty: true },
  { name: 'Pushya', deity: 'Brihaspati', nature: 'Light', ruler: 'Saturn', forProperty: true },
  { name: 'Ashlesha', deity: 'Sarpa', nature: 'Sharp', ruler: 'Mercury', forProperty: false },
  { name: 'Magha', deity: 'Pitris', nature: 'Fierce', ruler: 'Ketu', forProperty: false },
  { name: 'Purva Phalguni', deity: 'Bhaga', nature: 'Fierce', ruler: 'Venus', forProperty: false },
  { name: 'Uttara Phalguni', deity: 'Aryaman', nature: 'Fixed', ruler: 'Sun', forProperty: true },
  { name: 'Hasta', deity: 'Savitar', nature: 'Light', ruler: 'Moon', forProperty: true },
  { name: 'Chitra', deity: 'Vishwakarma', nature: 'Soft', ruler: 'Mars', forProperty: true },
  { name: 'Swati', deity: 'Vayu', nature: 'Movable', ruler: 'Rahu', forProperty: true },
  { name: 'Vishakha', deity: 'Indra-Agni', nature: 'Mixed', ruler: 'Jupiter', forProperty: false },
  { name: 'Anuradha', deity: 'Mitra', nature: 'Soft', ruler: 'Saturn', forProperty: true },
  { name: 'Jyeshtha', deity: 'Indra', nature: 'Sharp', ruler: 'Mercury', forProperty: false },
  { name: 'Mula', deity: 'Nirriti', nature: 'Sharp', ruler: 'Ketu', forProperty: false },
  { name: 'Purva Ashadha', deity: 'Apas', nature: 'Fierce', ruler: 'Venus', forProperty: false },
  { name: 'Uttara Ashadha', deity: 'Vishvedevas', nature: 'Fixed', ruler: 'Sun', forProperty: true },
  { name: 'Shravana', deity: 'Vishnu', nature: 'Movable', ruler: 'Moon', forProperty: true },
  { name: 'Dhanishta', deity: 'Vasus', nature: 'Movable', ruler: 'Mars', forProperty: true },
  { name: 'Shatabhisha', deity: 'Varuna', nature: 'Movable', ruler: 'Rahu', forProperty: false },
  { name: 'Purva Bhadrapada', deity: 'Aja Ekapada', nature: 'Fierce', ruler: 'Jupiter', forProperty: false },
  { name: 'Uttara Bhadrapada', deity: 'Ahir Budhnya', nature: 'Fixed', ruler: 'Saturn', forProperty: true },
  { name: 'Revati', deity: 'Pushan', nature: 'Soft', ruler: 'Mercury', forProperty: true },
];

// Tithi (Lunar Day) data
const TITHIS = [
  { name: 'Pratipada', number: 1, lord: 'Agni', nature: 'Supportive', forProperty: true },
  { name: 'Dwitiya', number: 2, lord: 'Brahma', nature: 'Supportive', forProperty: true },
  { name: 'Tritiya', number: 3, lord: 'Gauri', nature: 'Supportive', forProperty: true },
  { name: 'Chaturthi', number: 4, lord: 'Ganapati', nature: 'Rikta', forProperty: false },
  { name: 'Panchami', number: 5, lord: 'Serpent', nature: 'Supportive', forProperty: true },
  { name: 'Shashthi', number: 6, lord: 'Kartikeya', nature: 'Supportive', forProperty: true },
  { name: 'Saptami', number: 7, lord: 'Surya', nature: 'Supportive', forProperty: true },
  { name: 'Ashtami', number: 8, lord: 'Rudra', nature: 'Jaya', forProperty: false },
  { name: 'Navami', number: 9, lord: 'Durga', nature: 'Rikta', forProperty: false },
  { name: 'Dashami', number: 10, lord: 'Yama', nature: 'Supportive', forProperty: true },
  { name: 'Ekadashi', number: 11, lord: 'Vishnu', nature: 'Jaya', forProperty: true },
  { name: 'Dwadashi', number: 12, lord: 'Aditya', nature: 'Supportive', forProperty: true },
  { name: 'Trayodashi', number: 13, lord: 'Kamadeva', nature: 'Jaya', forProperty: true },
  { name: 'Chaturdashi', number: 14, lord: 'Shiva', nature: 'Rikta', forProperty: false },
  { name: 'Purnima', number: 15, lord: 'Chandra', nature: 'Nanda', forProperty: true },
  { name: 'Amavasya', number: 30, lord: 'Pitris', nature: 'Nanda', forProperty: false },
];

// Weekday lords and properties
const WEEKDAYS = [
  { day: 'Sunday', lord: 'Surya', element: 'Fire', forProperty: true, activities: ['Signing contracts', 'Moving in'] },
  { day: 'Monday', lord: 'Chandra', element: 'Water', forProperty: true, activities: ['Home viewing', 'Griha Pravesh'] },
  { day: 'Tuesday', lord: 'Mangal', element: 'Fire', forProperty: false, activities: [] },
  { day: 'Wednesday', lord: 'Budha', element: 'Earth', forProperty: true, activities: ['Documentation', 'Registration'] },
  { day: 'Thursday', lord: 'Guru', element: 'Ether', forProperty: true, activities: ['Purchase', 'Auspicious ceremonies'] },
  { day: 'Friday', lord: 'Shukra', element: 'Water', forProperty: true, activities: ['Home decoration', 'Moving in'] },
  { day: 'Saturday', lord: 'Shani', element: 'Air', forProperty: false, activities: [] },
];

export class AstrologyService {
  // Calculate Life Path Number from birth date
  calculateLifePathNumber(dateOfBirth: Date): number {
    const dateStr = dateOfBirth.toISOString().split('T')[0].replace(/-/g, '');
    let sum = dateStr.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    
    return sum;
  }

  // Get Life Path interpretation
  getLifePathInterpretation(number: number): any {
    const interpretations: Record<number, any> = {
      1: {
        traits: ['Leadership', 'Independence', 'Ambition'],
        bestProperties: ['Corner plots', 'Apartments facing East', 'Properties with unique features'],
        luckyNumbers: [1, 10, 19, 28],
        luckyColors: ['Gold', 'Orange', 'Yellow'],
      },
      2: {
        traits: ['Harmony', 'Partnership', 'Sensitivity'],
        bestProperties: ['Homes with gardens', 'Properties near water', 'Cozy interiors'],
        luckyNumbers: [2, 11, 20, 29],
        luckyColors: ['White', 'Cream', 'Green'],
      },
      3: {
        traits: ['Creativity', 'Expression', 'Joy'],
        bestProperties: ['Artistic homes', 'Open layouts', 'Properties with views'],
        luckyNumbers: [3, 12, 21, 30],
        luckyColors: ['Yellow', 'Orange', 'Purple'],
      },
      4: {
        traits: ['Stability', 'Structure', 'Practicality'],
        bestProperties: ['Well-built homes', 'Properties with good foundation', 'Square-shaped plots'],
        luckyNumbers: [4, 13, 22, 31],
        luckyColors: ['Blue', 'Gray', 'Brown'],
      },
      5: {
        traits: ['Freedom', 'Adventure', 'Change'],
        bestProperties: ['Properties with multiple exits', 'Homes in diverse neighborhoods', 'Flexible spaces'],
        luckyNumbers: [5, 14, 23],
        luckyColors: ['Gray', 'Silver', 'Light colors'],
      },
      6: {
        traits: ['Love', 'Responsibility', 'Nurturing'],
        bestProperties: ['Family homes', 'Properties with large kitchens', 'Child-friendly layouts'],
        luckyNumbers: [6, 15, 24],
        luckyColors: ['Pink', 'Blue', 'Rose'],
      },
      7: {
        traits: ['Wisdom', 'Spirituality', 'Analysis'],
        bestProperties: ['Quiet locations', 'Properties with study rooms', 'Secluded spaces'],
        luckyNumbers: [7, 16, 25],
        luckyColors: ['Purple', 'Violet', 'Green'],
      },
      8: {
        traits: ['Power', 'Abundance', 'Achievement'],
        bestProperties: ['Prestigious addresses', 'Properties with strong Vastu', 'Homes with offices'],
        luckyNumbers: [8, 17, 26],
        luckyColors: ['Black', 'Dark blue', 'Brown'],
      },
      9: {
        traits: ['Compassion', 'Wisdom', 'Completion'],
        bestProperties: ['Properties facing North', 'Homes with spiritual spaces', 'Community-oriented layouts'],
        luckyNumbers: [9, 18, 27],
        luckyColors: ['Red', 'Maroon', 'Pink'],
      },
      11: {
        traits: ['Intuition', 'Inspiration', 'Illumination'],
        bestProperties: ['Properties with high ceilings', 'Homes with meditation spaces', 'Spiritually aligned locations'],
        luckyNumbers: [11, 22, 29],
        luckyColors: ['White', 'Silver', 'Light blue'],
      },
      22: {
        traits: ['Master builder', 'Practical idealism', 'Achievement'],
        bestProperties: ['Large properties', 'Homes with potential for development', 'Properties on strong land'],
        luckyNumbers: [22, 44, 4],
        luckyColors: ['Gold', 'Coral', 'Tan'],
      },
    };

    return interpretations[number] || interpretations[number % 9 || 9];
  }

  // Calculate property compatibility
  calculatePropertyCompatibility(userBirthDate: Date, propertyAddress: string): any {
    const userNumber = this.calculateLifePathNumber(userBirthDate);
    const propertyNumber = this.calculateAddressNumber(propertyAddress);
    
    const compatibility = this.getCompatibilityScore(userNumber, propertyNumber);
    
    return {
      userLifePath: userNumber,
      propertyNumber,
      compatibilityScore: compatibility.score,
      compatibilityRating: compatibility.rating,
      explanation: compatibility.explanation,
      recommendations: compatibility.recommendations,
    };
  }

  // Calculate property address number
  calculateAddressNumber(address: string): number {
    const numbers = address.match(/\d+/g);
    if (!numbers) return 1;
    
    const houseNumber = numbers[0];
    let sum = houseNumber.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    
    while (sum > 9) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    
    return sum;
  }

  // Get compatibility between user and property numbers
  private getCompatibilityScore(userNum: number, propertyNum: number): any {
    const harmonious = [
      [1, 1], [1, 4], [1, 8],
      [2, 2], [2, 7], [2, 9],
      [3, 3], [3, 6], [3, 9],
      [4, 4], [4, 8], [4, 1],
      [5, 5], [5, 7], [5, 9],
      [6, 6], [6, 3], [6, 9],
      [7, 7], [7, 2], [7, 5],
      [8, 8], [8, 1], [8, 4],
      [9, 9], [9, 3], [9, 6],
    ];

    const isHarmonious = harmonious.some(
      ([a, b]) => (a === userNum && b === propertyNum) || (b === userNum && a === propertyNum)
    );

    if (userNum === propertyNum) {
      return {
        score: 95,
        rating: 'Excellent',
        explanation: 'Perfect match - your energy completely aligns with this property',
        recommendations: ['This property is numerologically ideal for you'],
      };
    }

    if (isHarmonious) {
      return {
        score: 80,
        rating: 'Very Good',
        explanation: 'Harmonious combination - supportive energy flow',
        recommendations: ['This property supports your life path'],
      };
    }

    return {
      score: 60,
      rating: 'Moderate',
      explanation: 'Neutral combination - neither positive nor negative',
      recommendations: ['Consider Vastu remedies to enhance harmony', 'Use numerological colors in decoration'],
    };
  }

  // Find auspicious dates for property transactions
  findAuspiciousDates(eventType: string, startDate: Date, endDate: Date): any[] {
    const dates: any[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const auspiciousness = this.evaluateDateAuspiciousness(current, eventType);
      
      if (auspiciousness.score >= 70) {
        dates.push({
          date: new Date(current),
          score: auspiciousness.score,
          quality: auspiciousness.quality,
          nakshatra: auspiciousness.nakshatra,
          tithi: auspiciousness.tithi,
          weekday: auspiciousness.weekday,
          considerations: auspiciousness.considerations,
        });
      }
      
      current.setDate(current.getDate() + 1);
    }

    return dates.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  // Evaluate a specific date for auspiciousness
  evaluateDateAuspiciousness(date: Date, eventType: string): any {
    const dayOfWeek = date.getDay();
    const weekday = WEEKDAYS[dayOfWeek];
    
    // Simplified calculation (in real implementation, would use astronomical calculations)
    const dayOfMonth = date.getDate();
    const nakshatraIndex = (dayOfMonth + date.getMonth()) % 27;
    const nakshatra = NAKSHATRAS[nakshatraIndex];
    const tithiIndex = dayOfMonth % 15;
    const tithi = TITHIS[tithiIndex];

    let score = 50;
    const considerations: string[] = [];

    // Weekday score
    if (weekday.forProperty) {
      score += 15;
      considerations.push(`${weekday.day} is auspicious for property matters`);
    } else {
      score -= 10;
      considerations.push(`${weekday.day} is not ideal - avoid if possible`);
    }

    // Nakshatra score
    if (nakshatra.forProperty) {
      score += 20;
      considerations.push(`${nakshatra.name} nakshatra supports property transactions`);
    }

    // Tithi score
    if (tithi.forProperty) {
      score += 15;
      considerations.push(`${tithi.name} tithi is favorable`);
    }

    // Event-specific bonuses
    if (eventType === 'Grihapravesh' && weekday.activities.includes('Griha Pravesh')) {
      score += 10;
    }
    if (eventType === 'Purchase' && weekday.activities.includes('Purchase')) {
      score += 10;
    }

    const quality = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 55 ? 'Average' : 'Avoid';

    return {
      score: Math.min(100, Math.max(0, score)),
      quality,
      nakshatra: nakshatra.name,
      tithi: tithi.name,
      weekday: weekday.day,
      considerations,
    };
  }
}

export const astrologyService = new AstrologyService();

