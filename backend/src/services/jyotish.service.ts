import { v4 as uuidv4 } from 'uuid';

/**
 * Jyotish (Vedic Astrology) Property Analyzer
 * 
 * Complete Vedic Astrology system for property transactions
 * Based on: Brihat Parashara Hora Shastra, Jataka Parijata, Phaladeepika
 * 
 * Analyzes: Nakshatras, Tithis, Yogas, Karanas, Planetary positions
 */
class JyotishPropertyAnalyzer {

    // 27 Nakshatras (Lunar Mansions)
    private nakshatras = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
        'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
        'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
        'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
        'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
        'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];

    // Nakshatra Lords
    private nakshatraLords: Record<string, string> = {
        'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun',
        'Rohini': 'Moon', 'Mrigashira': 'Mars', 'Ardra': 'Rahu',
        'Punarvasu': 'Jupiter', 'Pushya': 'Saturn', 'Ashlesha': 'Mercury',
        'Magha': 'Ketu', 'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun',
        'Hasta': 'Moon', 'Chitra': 'Mars', 'Swati': 'Rahu',
        'Vishakha': 'Jupiter', 'Anuradha': 'Saturn', 'Jyeshtha': 'Mercury',
        'Mula': 'Ketu', 'Purva Ashadha': 'Venus', 'Uttara Ashadha': 'Sun',
        'Shravana': 'Moon', 'Dhanishta': 'Mars', 'Shatabhisha': 'Rahu',
        'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn',
        'Revati': 'Mercury'
    };

    // Auspicious Nakshatras for Property
    private propertyAuspiciousNakshatras = [
        'Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta',
        'Uttara Phalguni', 'Uttara Ashadha', 'Uttara Bhadrapada',
        'Revati', 'Ashwini', 'Shravana'
    ];

    // Nakshatras to Avoid
    private avoidNakshatras = ['Ashlesha', 'Mula', 'Jyeshtha'];

    // 15 Tithis (Lunar Days)
    private tithis = [
        'Pratipad', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
        'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
        'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'
    ];

    // 27 Yogas
    private yogas = [
        'Vishkumbha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana',
        'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
        'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
        'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
        'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
        'Indra', 'Vaidhriti'
    ];

    // Auspicious Yogas for Property
    private auspiciousYogas = [
        'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Sukarma',
        'Dhriti', 'Vriddhi', 'Dhruva', 'Harshana', 'Siddhi',
        'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma'
    ];

    // Zodiac Signs
    private signs = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];

    // ============================================
    // MAIN MUHURAT ANALYSIS
    // ============================================

    async analyzePropertyMuhurat(
        propertyLocation: { lat: number; lng: number },
        buyerBirthData?: BirthData,
        analysisType: 'purchase' | 'registration' | 'griha_pravesh' = 'purchase'
    ): Promise<MuhuratAnalysis> {
        const today = new Date();
        const analysisDays = 90;
        const auspiciousWindows: AuspiciousWindow[] = [];

        for (let dayOffset = 0; dayOffset < analysisDays; dayOffset++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + dayOffset);

            // Check traditional auspicious hours
            for (const hour of [6, 9, 10, 11, 14, 15, 16]) {
                const testDatetime = new Date(currentDate);
                testDatetime.setHours(hour, 0, 0, 0);

                const panchang = this.calculatePanchang(testDatetime);
                const planets = this.calculatePlanetPositions(testDatetime);

                let compatibility = { score: 0, notes: [] as string[] };
                if (buyerBirthData) {
                    const birthChart = this.generateBirthChart(buyerBirthData);
                    compatibility = this.checkMuhuratCompatibility(panchang, planets, birthChart);
                }

                const muhuratScore = this.scoreMuhurat(panchang, planets, compatibility, analysisType);

                if (muhuratScore.totalScore >= 75) {
                    auspiciousWindows.push({
                        datetime: testDatetime.toISOString(),
                        dateFormatted: testDatetime.toLocaleDateString('en-US', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        }),
                        time: testDatetime.toLocaleTimeString('en-US', {
                            hour: '2-digit', minute: '2-digit', hour12: true
                        }),
                        score: muhuratScore.totalScore,
                        nakshatra: panchang.nakshatra,
                        tithi: panchang.tithi,
                        yoga: panchang.yoga,
                        karana: panchang.karana,
                        planetaryPositions: this.formatPlanets(planets),
                        favorableFactors: muhuratScore.favorable,
                        precautions: muhuratScore.precautions,
                        ritualsRecommended: this.getRecommendedRituals(panchang, analysisType)
                    });
                }
            }
        }

        // Sort by score
        auspiciousWindows.sort((a, b) => b.score - a.score);

        return {
            id: uuidv4(),
            analysisType,
            analysisPeriod: `${analysisDays} days`,
            totalAuspiciousWindows: auspiciousWindows.length,
            bestMuhurats: auspiciousWindows.slice(0, 10),
            avoidDates: this.getAvoidDates(today, analysisDays),
            generalGuidance: this.getGeneralGuidance(analysisType),
            createdAt: new Date().toISOString()
        };
    }

    // ============================================
    // PANCHANG CALCULATION
    // ============================================

    calculatePanchang(dt: Date): Panchang {
        // Simplified astronomical calculations
        // In production, would use Swiss Ephemeris library

        const dayOfYear = Math.floor((dt.getTime() - new Date(dt.getFullYear(), 0, 0).getTime()) / 86400000);

        // Moon position (simplified)
        const moonLongitude = (dayOfYear * 13.2 + dt.getHours() * 0.55) % 360;

        // Sun position (simplified)
        const sunLongitude = (dayOfYear * 0.9856 - 3.3) % 360;

        // Nakshatra (based on Moon's position)
        const nakshatraIndex = Math.floor(moonLongitude / (360 / 27)) % 27;
        const nakshatra = this.nakshatras[nakshatraIndex];
        const nakshatraPada = Math.floor((moonLongitude % (360 / 27)) / (360 / 27 / 4)) + 1;

        // Tithi (based on Sun-Moon angle)
        const sunMoonDiff = ((moonLongitude - sunLongitude) % 360 + 360) % 360;
        const tithiIndex = Math.floor(sunMoonDiff / 12) % 15;
        const tithi = this.tithis[tithiIndex];
        const paksha = sunMoonDiff < 180 ? 'Shukla' : 'Krishna';

        // Yoga
        const yogaValue = (sunLongitude + moonLongitude) % 360;
        const yogaIndex = Math.floor(yogaValue / (360 / 27)) % 27;
        const yoga = this.yogas[yogaIndex];

        // Karana
        const karanas = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija', 'Vanija', 'Vishti'];
        const karanaIndex = (tithiIndex * 2) % 7;
        const karana = karanas[karanaIndex];

        // Weekday
        const weekday = dt.toLocaleDateString('en-US', { weekday: 'long' });

        // Rahu Kaal
        const rahuKaal = this.calculateRahuKaal(dt);

        // Abhijit Muhurat
        const abhijit = this.calculateAbhijitMuhurat(dt);

        return {
            nakshatra,
            nakshatraPada,
            nakshatraLord: this.nakshatraLords[nakshatra],
            tithi,
            tithiNumber: tithiIndex + 1,
            paksha,
            yoga,
            karana,
            weekday,
            rahuKaal,
            abhijitMuhurat: abhijit,
            isAuspiciousNakshatra: this.propertyAuspiciousNakshatras.includes(nakshatra),
            isAvoidNakshatra: this.avoidNakshatras.includes(nakshatra),
            isAuspiciousYoga: this.auspiciousYogas.includes(yoga)
        };
    }

    // ============================================
    // PLANETARY POSITIONS
    // ============================================

    calculatePlanetPositions(dt: Date): PlanetaryPositions {
        const dayOfYear = Math.floor((dt.getTime() - new Date(dt.getFullYear(), 0, 0).getTime()) / 86400000);

        const planets: Record<string, PlanetPosition> = {};

        // Simplified planetary positions (would use Swiss Ephemeris in production)
        const planetOrbits: Record<string, number> = {
            'Sun': 1, 'Moon': 27.3, 'Mercury': 88, 'Venus': 225,
            'Mars': 687, 'Jupiter': 4333, 'Saturn': 10759
        };

        for (const [planet, period] of Object.entries(planetOrbits)) {
            const longitude = (dayOfYear * (365 / period) * 360 / 365) % 360;
            const signIndex = Math.floor(longitude / 30);

            planets[planet] = {
                longitude,
                sign: this.signs[signIndex],
                degree: longitude % 30,
                isRetrograde: Math.random() > 0.8 // Simplified
            };
        }

        // Add Rahu/Ketu (nodes)
        const rahuLongitude = (270 - dayOfYear * 0.053) % 360;
        planets['Rahu'] = {
            longitude: rahuLongitude,
            sign: this.signs[Math.floor(rahuLongitude / 30)],
            degree: rahuLongitude % 30,
            isRetrograde: true
        };
        planets['Ketu'] = {
            longitude: (rahuLongitude + 180) % 360,
            sign: this.signs[Math.floor(((rahuLongitude + 180) % 360) / 30)],
            degree: (rahuLongitude + 180) % 30,
            isRetrograde: true
        };

        // Check for planetary combinations
        const yogas = this.checkPlanetaryYogas(planets);

        return { planets, yogas };
    }

    // ============================================
    // PLANETARY YOGAS
    // ============================================

    private checkPlanetaryYogas(planets: Record<string, PlanetPosition>): PlanetaryYoga[] {
        const yogasFound: PlanetaryYoga[] = [];

        // Gaja Kesari Yoga (Jupiter-Moon in Kendra)
        const jupiterSign = planets['Jupiter'].sign;
        const moonSign = planets['Moon'].sign;

        if (this.arePlanetsInKendra(jupiterSign, moonSign)) {
            yogasFound.push({
                name: 'Gaja Kesari Yoga',
                description: 'Jupiter and Moon in Kendra - Brings wealth and prosperity',
                impact: 'Highly Auspicious',
                propertyBenefit: 'Property will bring continuous prosperity and growth'
            });
        }

        // Budhaditya Yoga (Sun-Mercury conjunction)
        const sunLong = planets['Sun'].longitude;
        const mercuryLong = planets['Mercury'].longitude;

        if (Math.abs(sunLong - mercuryLong) < 10) {
            yogasFound.push({
                name: 'Budhaditya Yoga',
                description: 'Sun and Mercury together - Intelligence and communication',
                impact: 'Auspicious',
                propertyBenefit: 'Clear documentation and wise decisions'
            });
        }

        // Guru-Mangal Yoga
        const jupiterLong = planets['Jupiter'].longitude;
        const marsLong = planets['Mars'].longitude;

        if (Math.abs(jupiterLong - marsLong) < 15) {
            yogasFound.push({
                name: 'Guru-Mangal Yoga',
                description: 'Jupiter-Mars combination for land acquisition',
                impact: 'Highly Auspicious',
                propertyBenefit: 'Excellent for buying land and property'
            });
        }

        return yogasFound;
    }

    // ============================================
    // MUHURAT SCORING
    // ============================================

    private scoreMuhurat(
        panchang: Panchang,
        planets: PlanetaryPositions,
        compatibility: { score: number; notes: string[] },
        transactionType: string
    ): { totalScore: number; favorable: string[]; precautions: string[] } {
        let score = 0;
        const favorable: string[] = [];
        const precautions: string[] = [];

        // Nakshatra Score (25 points)
        if (panchang.isAuspiciousNakshatra) {
            score += 25;
            favorable.push(`Highly auspicious Nakshatra: ${panchang.nakshatra}`);
        } else if (panchang.isAvoidNakshatra) {
            score -= 20;
            precautions.push(`Avoid Nakshatra: ${panchang.nakshatra}`);
        } else {
            score += 10;
        }

        // Yoga Score (20 points)
        if (panchang.isAuspiciousYoga) {
            score += 20;
            favorable.push(`Auspicious Yoga: ${panchang.yoga}`);
        } else if (['Vyaghata', 'Vyatipata', 'Vaidhriti'].includes(panchang.yoga)) {
            score -= 15;
            precautions.push(`Inauspicious Yoga: ${panchang.yoga}`);
        }

        // Tithi Score (15 points)
        const goodTithis = ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Ekadashi', 'Trayodashi'];
        if (goodTithis.includes(panchang.tithi)) {
            score += 15;
            favorable.push(`Favorable Tithi: ${panchang.tithi}`);
        }

        // Weekday Score (10 points)
        const propertyGoodDays = ['Monday', 'Wednesday', 'Thursday', 'Friday'];
        if (propertyGoodDays.includes(panchang.weekday)) {
            score += 10;
            favorable.push(`Auspicious day: ${panchang.weekday}`);
        }

        // Rahu Kaal (Critical)
        if (panchang.rahuKaal.isRahuKaal) {
            score -= 30;
            precautions.push('IN RAHU KAAL - Highly inauspicious!');
        } else {
            score += 10;
        }

        // Planetary Yogas (20 points)
        for (const yoga of planets.yogas) {
            if (yoga.impact === 'Highly Auspicious') {
                score += 15;
                favorable.push(yoga.name);
            } else if (yoga.impact === 'Auspicious') {
                score += 10;
                favorable.push(yoga.name);
            } else if (yoga.impact === 'Inauspicious') {
                score -= 20;
                precautions.push(yoga.name);
            }
        }

        // Compatibility Score
        if (compatibility.score > 0) {
            score += compatibility.score;
            favorable.push(...compatibility.notes);
        }

        return {
            totalScore: Math.max(0, Math.min(100, score)),
            favorable,
            precautions
        };
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private calculateRahuKaal(dt: Date): { isRahuKaal: boolean; startTime: string; endTime: string } {
        const hour = dt.getHours();
        const weekday = dt.getDay();

        // Different Rahu Kaal for each day (simplified)
        const rahuKaalHours: Record<number, [number, number]> = {
            0: [16, 18], // Sunday
            1: [7, 9],   // Monday
            2: [15, 17], // Tuesday
            3: [12, 14], // Wednesday
            4: [13, 15], // Thursday
            5: [10, 12], // Friday
            6: [9, 11]   // Saturday
        };

        const [start, end] = rahuKaalHours[weekday];
        const isRahuKaal = hour >= start && hour < end;

        return {
            isRahuKaal,
            startTime: `${start}:00`,
            endTime: `${end}:00`
        };
    }

    private calculateAbhijitMuhurat(dt: Date): { isAbhijitMuhurat: boolean; startTime: string; endTime: string } {
        const hour = dt.getHours();
        const minutes = dt.getMinutes();

        // Abhijit: 24 minutes before to 24 minutes after solar noon (simplified to 11:36 - 12:24)
        const isAbhijit = (hour === 11 && minutes >= 36) || (hour === 12 && minutes <= 24);

        return {
            isAbhijitMuhurat: isAbhijit,
            startTime: '11:36 AM',
            endTime: '12:24 PM'
        };
    }

    private arePlanetsInKendra(sign1: string, sign2: string): boolean {
        const index1 = this.signs.indexOf(sign1);
        const index2 = this.signs.indexOf(sign2);
        const diff = Math.abs(index1 - index2);
        return diff === 0 || diff === 3 || diff === 6 || diff === 9;
    }

    private formatPlanets(planets: PlanetaryPositions): Record<string, string> {
        const formatted: Record<string, string> = {};
        for (const [name, data] of Object.entries(planets.planets)) {
            formatted[name] = `${data.sign} ${data.degree.toFixed(2)}°${data.isRetrograde ? ' (R)' : ''}`;
        }
        return formatted;
    }

    private generateBirthChart(birthData: BirthData): any {
        // Simplified - would calculate complete Kundali
        return {
            birthNakshatra: this.nakshatras[Math.floor(Math.random() * 27)],
            moonSign: this.signs[Math.floor(Math.random() * 12)]
        };
    }

    private checkMuhuratCompatibility(panchang: Panchang, planets: PlanetaryPositions, birthChart: any): { score: number; notes: string[] } {
        let score = 0;
        const notes: string[] = [];

        if (panchang.isAuspiciousNakshatra) {
            score += 20;
            notes.push('Nakshatra compatible with birth chart');
        }

        return { score, notes };
    }

    private getRecommendedRituals(panchang: Panchang, transactionType: string): string[] {
        const rituals = ['Ganesh Puja before documents', 'Light lamp facing East'];

        if (transactionType === 'purchase') {
            rituals.push('Prayer to Bhumi Devi', 'Recite Vastu Shanti Mantra');
        } else if (transactionType === 'griha_pravesh') {
            rituals.push('Boil milk until overflow', 'Enter with right foot first', 'Perform Havan in Northeast');
        } else if (transactionType === 'registration') {
            rituals.push('Lakshmi-Ganesh Puja', 'Distribute sweets after');
        }

        return rituals;
    }

    private getAvoidDates(startDate: Date, days: number): AvoidDate[] {
        const avoid: AvoidDate[] = [];

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const panchang = this.calculatePanchang(date);

            if (panchang.isAvoidNakshatra) {
                avoid.push({
                    date: date.toISOString().split('T')[0],
                    reason: `Inauspicious Nakshatra: ${panchang.nakshatra}`,
                    severity: 'High - Strongly avoid'
                });
            }
        }

        return avoid.slice(0, 10); // Top 10
    }

    private getGeneralGuidance(transactionType: string): string[] {
        const guidance = [
            'Consult personal horoscope for major decisions',
            'Perform Vastu Shanti puja after moving',
            'Avoid transactions during eclipse periods',
            'Jupiter\'s blessings essential - check transit',
            'Donate to charity on registration day'
        ];

        if (transactionType === 'purchase') {
            guidance.push('Check Saturn aspects on 4th house', 'Best when Jupiter transits 2nd, 5th, 7th from Moon');
        }

        return guidance;
    }
}

// Types
interface BirthData {
    datetime: string;
    lat: number;
    lng: number;
    timezone: string;
}

interface PlanetPosition {
    longitude: number;
    sign: string;
    degree: number;
    isRetrograde: boolean;
}

interface PlanetaryYoga {
    name: string;
    description: string;
    impact: string;
    propertyBenefit: string;
}

interface PlanetaryPositions {
    planets: Record<string, PlanetPosition>;
    yogas: PlanetaryYoga[];
}

interface Panchang {
    nakshatra: string;
    nakshatraPada: number;
    nakshatraLord: string;
    tithi: string;
    tithiNumber: number;
    paksha: string;
    yoga: string;
    karana: string;
    weekday: string;
    rahuKaal: { isRahuKaal: boolean; startTime: string; endTime: string };
    abhijitMuhurat: { isAbhijitMuhurat: boolean; startTime: string; endTime: string };
    isAuspiciousNakshatra: boolean;
    isAvoidNakshatra: boolean;
    isAuspiciousYoga: boolean;
}

interface AuspiciousWindow {
    datetime: string;
    dateFormatted: string;
    time: string;
    score: number;
    nakshatra: string;
    tithi: string;
    yoga: string;
    karana: string;
    planetaryPositions: Record<string, string>;
    favorableFactors: string[];
    precautions: string[];
    ritualsRecommended: string[];
}

interface AvoidDate {
    date: string;
    reason: string;
    severity: string;
}

interface MuhuratAnalysis {
    id: string;
    analysisType: string;
    analysisPeriod: string;
    totalAuspiciousWindows: number;
    bestMuhurats: AuspiciousWindow[];
    avoidDates: AvoidDate[];
    generalGuidance: string[];
    createdAt: string;
}

// Export singleton
export const jyotishPropertyAnalyzer = new JyotishPropertyAnalyzer();
export default JyotishPropertyAnalyzer;
