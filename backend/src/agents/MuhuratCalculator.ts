import { BaseAgent, Property, PropertyAnalysis } from "./BaseAgent";

// Muhurat Types
export type MuhuratPurpose = "visit" | "signing" | "registration" | "moving";

export interface MuhuratDate {
  date: string; // YYYY-MM-DD
  dayName: string;
  tithi: string;
  tithiNumber: number;
  nakshatra: string;
  yoga: string;
  karana: string;
  vara: string; // Weekday in Sanskrit
  rahuKaal: { start: string; end: string };
  quality: "EXCELLENT" | "GOOD" | "NEUTRAL" | "AVOID";
  score: number; // 0-100
  reasons: string[];
  recommendedTime?: { start: string; end: string };
  warnings: string[];
}

export interface MuhuratAnalysis {
  purpose: MuhuratPurpose;
  dates: MuhuratDate[];
  nextAuspiciousDate: MuhuratDate | null;
  summary: string;
  generalGuidelines: string[];
}

export interface DateCheckResult {
  date: string;
  isAuspicious: boolean;
  quality: MuhuratDate["quality"];
  score: number;
  panchang: {
    tithi: string;
    nakshatra: string;
    yoga: string;
    karana: string;
    vara: string;
  };
  rahuKaal: { start: string; end: string };
  suitableFor: MuhuratPurpose[];
  notSuitableFor: MuhuratPurpose[];
  reasons: string[];
  warnings: string[];
  remedies: string[];
}

// Vedic Calendar Constants
const TITHIS = [
  { name: "Pratipada", number: 1, quality: "auspicious", paksha: "Shukla" },
  { name: "Dwitiya", number: 2, quality: "auspicious", paksha: "Shukla" },
  { name: "Tritiya", number: 3, quality: "auspicious", paksha: "Shukla" },
  { name: "Chaturthi", number: 4, quality: "neutral", paksha: "Shukla" },
  { name: "Panchami", number: 5, quality: "auspicious", paksha: "Shukla" },
  { name: "Shashthi", number: 6, quality: "auspicious", paksha: "Shukla" },
  { name: "Saptami", number: 7, quality: "auspicious", paksha: "Shukla" },
  { name: "Ashtami", number: 8, quality: "avoid", paksha: "Shukla" },
  { name: "Navami", number: 9, quality: "neutral", paksha: "Shukla" },
  { name: "Dashami", number: 10, quality: "auspicious", paksha: "Shukla" },
  { name: "Ekadashi", number: 11, quality: "auspicious", paksha: "Shukla" },
  { name: "Dwadashi", number: 12, quality: "auspicious", paksha: "Shukla" },
  { name: "Trayodashi", number: 13, quality: "auspicious", paksha: "Shukla" },
  { name: "Chaturdashi", number: 14, quality: "avoid", paksha: "Shukla" },
  { name: "Purnima", number: 15, quality: "excellent", paksha: "Shukla" },
  { name: "Pratipada", number: 1, quality: "neutral", paksha: "Krishna" },
  { name: "Dwitiya", number: 2, quality: "auspicious", paksha: "Krishna" },
  { name: "Tritiya", number: 3, quality: "auspicious", paksha: "Krishna" },
  { name: "Chaturthi", number: 4, quality: "avoid", paksha: "Krishna" },
  { name: "Panchami", number: 5, quality: "neutral", paksha: "Krishna" },
  { name: "Shashthi", number: 6, quality: "neutral", paksha: "Krishna" },
  { name: "Saptami", number: 7, quality: "neutral", paksha: "Krishna" },
  { name: "Ashtami", number: 8, quality: "avoid", paksha: "Krishna" },
  { name: "Navami", number: 9, quality: "avoid", paksha: "Krishna" },
  { name: "Dashami", number: 10, quality: "neutral", paksha: "Krishna" },
  { name: "Ekadashi", number: 11, quality: "auspicious", paksha: "Krishna" },
  { name: "Dwadashi", number: 12, quality: "neutral", paksha: "Krishna" },
  { name: "Trayodashi", number: 13, quality: "neutral", paksha: "Krishna" },
  { name: "Chaturdashi", number: 14, quality: "avoid", paksha: "Krishna" },
  { name: "Amavasya", number: 30, quality: "avoid", paksha: "Krishna" },
];

const NAKSHATRAS_MUHURAT = [
  { name: "Ashwini", quality: "good", nature: "Swift", suitableFor: ["visit", "signing"] },
  { name: "Bharani", quality: "avoid", nature: "Fierce", suitableFor: [] },
  { name: "Krittika", quality: "neutral", nature: "Mixed", suitableFor: ["signing"] },
  { name: "Rohini", quality: "excellent", nature: "Fixed", suitableFor: ["visit", "signing", "registration", "moving"] },
  { name: "Mrigashira", quality: "good", nature: "Soft", suitableFor: ["visit", "signing", "moving"] },
  { name: "Ardra", quality: "avoid", nature: "Sharp", suitableFor: [] },
  { name: "Punarvasu", quality: "excellent", nature: "Movable", suitableFor: ["visit", "signing", "registration", "moving"] },
  { name: "Pushya", quality: "excellent", nature: "Light", suitableFor: ["visit", "signing", "registration", "moving"] },
  { name: "Ashlesha", quality: "avoid", nature: "Sharp", suitableFor: [] },
  { name: "Magha", quality: "neutral", nature: "Fierce", suitableFor: ["registration"] },
  { name: "Purva Phalguni", quality: "good", nature: "Fierce", suitableFor: ["moving"] },
  { name: "Uttara Phalguni", quality: "excellent", nature: "Fixed", suitableFor: ["visit", "signing", "registration", "moving"] },
  { name: "Hasta", quality: "excellent", nature: "Light", suitableFor: ["visit", "signing", "registration", "moving"] },
  { name: "Chitra", quality: "good", nature: "Soft", suitableFor: ["visit", "moving"] },
  { name: "Swati", quality: "excellent", nature: "Movable", suitableFor: ["visit", "signing", "registration", "moving"] },
  { name: "Vishakha", quality: "neutral", nature: "Mixed", suitableFor: ["signing", "registration"] },
  { name: "Anuradha", quality: "excellent", nature: "Soft", suitableFor: ["visit", "signing", "registration", "moving"] },
  { name: "Jyeshtha", quality: "avoid", nature: "Sharp", suitableFor: [] },
  { name: "Mula", quality: "avoid", nature: "Sharp", suitableFor: [] },
  { name: "Purva Ashadha", quality: "neutral", nature: "Fierce", suitableFor: ["signing"] },
  { name: "Uttara Ashadha", quality: "excellent", nature: "Fixed", suitableFor: ["visit", "signing", "registration", "moving"] },
  { name: "Shravana", quality: "excellent", nature: "Movable", suitableFor: ["visit", "signing", "registration", "moving"] },
  { name: "Dhanishta", quality: "good", nature: "Movable", suitableFor: ["visit", "moving"] },
  { name: "Shatabhisha", quality: "neutral", nature: "Movable", suitableFor: ["visit"] },
  { name: "Purva Bhadrapada", quality: "avoid", nature: "Fierce", suitableFor: [] },
  { name: "Uttara Bhadrapada", quality: "excellent", nature: "Fixed", suitableFor: ["visit", "signing", "registration", "moving"] },
  { name: "Revati", quality: "excellent", nature: "Soft", suitableFor: ["visit", "signing", "registration", "moving"] },
];

const YOGAS = [
  { name: "Vishkambha", quality: "neutral" },
  { name: "Preeti", quality: "excellent" },
  { name: "Ayushman", quality: "excellent" },
  { name: "Saubhagya", quality: "excellent" },
  { name: "Shobhana", quality: "excellent" },
  { name: "Atiganda", quality: "avoid" },
  { name: "Sukarma", quality: "good" },
  { name: "Dhriti", quality: "excellent" },
  { name: "Shoola", quality: "avoid" },
  { name: "Ganda", quality: "avoid" },
  { name: "Vriddhi", quality: "excellent" },
  { name: "Dhruva", quality: "excellent" },
  { name: "Vyaghata", quality: "avoid" },
  { name: "Harshana", quality: "excellent" },
  { name: "Vajra", quality: "neutral" },
  { name: "Siddhi", quality: "excellent" },
  { name: "Vyatipata", quality: "avoid" },
  { name: "Variyan", quality: "good" },
  { name: "Parigha", quality: "avoid" },
  { name: "Shiva", quality: "excellent" },
  { name: "Siddha", quality: "excellent" },
  { name: "Sadhya", quality: "good" },
  { name: "Shubha", quality: "excellent" },
  { name: "Shukla", quality: "good" },
  { name: "Brahma", quality: "excellent" },
  { name: "Indra", quality: "excellent" },
  { name: "Vaidhriti", quality: "avoid" },
];

const KARANAS = [
  { name: "Bava", quality: "good" },
  { name: "Balava", quality: "good" },
  { name: "Kaulava", quality: "good" },
  { name: "Taitila", quality: "good" },
  { name: "Garaja", quality: "good" },
  { name: "Vanija", quality: "excellent" },
  { name: "Vishti", quality: "avoid" }, // Also called Bhadra
  { name: "Shakuni", quality: "neutral" },
  { name: "Chatushpada", quality: "neutral" },
  { name: "Naga", quality: "neutral" },
  { name: "Kimstughna", quality: "good" },
];

const VARAS = [
  { name: "Ravivara", english: "Sunday", lord: "Sun", quality: "neutral", goodFor: ["signing"] },
  { name: "Somvara", english: "Monday", lord: "Moon", quality: "excellent", goodFor: ["visit", "signing", "moving"] },
  { name: "Mangalvara", english: "Tuesday", lord: "Mars", quality: "avoid", goodFor: [] },
  { name: "Budhvara", english: "Wednesday", lord: "Mercury", quality: "excellent", goodFor: ["visit", "signing", "registration"] },
  { name: "Guruvara", english: "Thursday", lord: "Jupiter", quality: "excellent", goodFor: ["visit", "signing", "registration", "moving"] },
  { name: "Shukravara", english: "Friday", lord: "Venus", quality: "excellent", goodFor: ["visit", "signing", "moving"] },
  { name: "Shanivara", english: "Saturday", lord: "Saturn", quality: "avoid", goodFor: ["registration"] },
];

// Rahu Kaal timings by weekday (based on sunrise at 6:00 AM)
const RAHU_KAAL_PERIODS: Record<number, { start: number; end: number }> = {
  0: { start: 16.5, end: 18 }, // Sunday: 4:30 PM - 6:00 PM
  1: { start: 7.5, end: 9 }, // Monday: 7:30 AM - 9:00 AM
  2: { start: 15, end: 16.5 }, // Tuesday: 3:00 PM - 4:30 PM
  3: { start: 12, end: 13.5 }, // Wednesday: 12:00 PM - 1:30 PM
  4: { start: 13.5, end: 15 }, // Thursday: 1:30 PM - 3:00 PM
  5: { start: 10.5, end: 12 }, // Friday: 10:30 AM - 12:00 PM
  6: { start: 9, end: 10.5 }, // Saturday: 9:00 AM - 10:30 AM
};

export class MuhuratCalculator extends BaseAgent {
  constructor(agentId?: string) {
    super(agentId || `muhurat-calculator-${Date.now()}`, "muhurat-calculator");
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    await this.delay(Math.random() * 300 + 150);

    // Get next auspicious dates for this property
    const analysis = await this.getAuspiciousDates("visit", 7);
    const nextGoodDate = analysis.nextAuspiciousDate;

    const score = nextGoodDate ? 8 : 6;
    const reasoning = nextGoodDate
      ? `Best time to visit this property: ${nextGoodDate.date} (${nextGoodDate.dayName}). ${nextGoodDate.reasons[0]}`
      : "Consider consulting a pandit for personalized muhurat based on your birth chart.";

    return {
      agentId: this.agentId,
      propertyId: property.id,
      score,
      confidence: 0.75,
      reasoning,
      timestamp: new Date(),
    };
  }

  /**
   * Get auspicious dates for a specific purpose
   */
  async getAuspiciousDates(
    purpose: MuhuratPurpose,
    days: number = 30
  ): Promise<MuhuratAnalysis> {
    await this.delay(Math.random() * 200 + 100);

    const dates: MuhuratDate[] = [];
    const startDate = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const muhuratDate = this.calculateMuhuratForDate(date, purpose);
      dates.push(muhuratDate);
    }

    // Sort by score descending
    const sortedDates = [...dates].sort((a, b) => b.score - a.score);

    // Find next auspicious date
    const nextAuspicious =
      sortedDates.find(
        (d) => d.quality === "EXCELLENT" || d.quality === "GOOD"
      ) || null;

    const excellentDays = dates.filter((d) => d.quality === "EXCELLENT").length;
    const goodDays = dates.filter((d) => d.quality === "GOOD").length;
    const avoidDays = dates.filter((d) => d.quality === "AVOID").length;

    const summary = `In the next ${days} days for ${this.getPurposeDescription(purpose)}: ${excellentDays} excellent days, ${goodDays} good days, ${avoidDays} days to avoid. ${nextAuspicious ? `Next best date: ${nextAuspicious.date}` : "Consult a Jyotishi for personalized guidance."}`;

    return {
      purpose,
      dates,
      nextAuspiciousDate: nextAuspicious,
      summary,
      generalGuidelines: this.getGuidelinesForPurpose(purpose),
    };
  }

  /**
   * Check if a specific date is auspicious
   */
  async checkDate(dateString: string): Promise<DateCheckResult> {
    await this.delay(Math.random() * 100 + 50);

    const date = new Date(dateString);
    const panchang = this.calculatePanchang(date);
    const rahuKaal = this.calculateRahuKaal(date);

    // Check suitability for each purpose
    const suitableFor: MuhuratPurpose[] = [];
    const notSuitableFor: MuhuratPurpose[] = [];
    const allPurposes: MuhuratPurpose[] = [
      "visit",
      "signing",
      "registration",
      "moving",
    ];

    for (const purpose of allPurposes) {
      const muhuratDate = this.calculateMuhuratForDate(date, purpose);
      if (muhuratDate.quality === "EXCELLENT" || muhuratDate.quality === "GOOD") {
        suitableFor.push(purpose);
      } else if (muhuratDate.quality === "AVOID") {
        notSuitableFor.push(purpose);
      }
    }

    // Calculate overall quality
    const overallMuhurat = this.calculateMuhuratForDate(date, "visit");

    // Generate remedies if needed
    const remedies = this.generateRemediesForDate(panchang, overallMuhurat.quality);

    return {
      date: dateString,
      isAuspicious:
        overallMuhurat.quality === "EXCELLENT" ||
        overallMuhurat.quality === "GOOD",
      quality: overallMuhurat.quality,
      score: overallMuhurat.score,
      panchang: {
        tithi: overallMuhurat.tithi,
        nakshatra: overallMuhurat.nakshatra,
        yoga: overallMuhurat.yoga,
        karana: overallMuhurat.karana,
        vara: overallMuhurat.vara,
      },
      rahuKaal,
      suitableFor,
      notSuitableFor,
      reasons: overallMuhurat.reasons,
      warnings: overallMuhurat.warnings,
      remedies,
    };
  }

  private calculateMuhuratForDate(
    date: Date,
    purpose: MuhuratPurpose
  ): MuhuratDate {
    const panchang = this.calculatePanchang(date);
    const rahuKaal = this.calculateRahuKaal(date);

    let score = 50; // Base score
    const reasons: string[] = [];
    const warnings: string[] = [];

    // 1. Evaluate Tithi (max 20 points)
    const tithiData = TITHIS.find((t) => t.name === panchang.tithi);
    if (tithiData) {
      if (tithiData.quality === "excellent") {
        score += 20;
        reasons.push(`${panchang.tithi} (${tithiData.paksha} Paksha) is highly auspicious.`);
      } else if (tithiData.quality === "auspicious") {
        score += 15;
        reasons.push(`${panchang.tithi} is a favorable tithi.`);
      } else if (tithiData.quality === "avoid") {
        score -= 20;
        warnings.push(`${panchang.tithi} is generally not recommended for important activities.`);
      }
    }

    // 2. Evaluate Nakshatra (max 25 points)
    const nakshatraData = NAKSHATRAS_MUHURAT.find(
      (n) => n.name === panchang.nakshatra
    );
    if (nakshatraData) {
      if (nakshatraData.suitableFor.includes(purpose)) {
        if (nakshatraData.quality === "excellent") {
          score += 25;
          reasons.push(`${panchang.nakshatra} nakshatra is excellent for ${purpose}.`);
        } else if (nakshatraData.quality === "good") {
          score += 18;
          reasons.push(`${panchang.nakshatra} is favorable for ${purpose}.`);
        }
      } else if (nakshatraData.quality === "avoid") {
        score -= 25;
        warnings.push(`${panchang.nakshatra} nakshatra should be avoided for property matters.`);
      } else {
        score += 5;
        reasons.push(`${panchang.nakshatra} has neutral influence for ${purpose}.`);
      }
    }

    // 3. Evaluate Yoga (max 15 points)
    const yogaData = YOGAS.find((y) => y.name === panchang.yoga);
    if (yogaData) {
      if (yogaData.quality === "excellent") {
        score += 15;
        reasons.push(`${panchang.yoga} yoga brings auspicious energy.`);
      } else if (yogaData.quality === "good") {
        score += 10;
      } else if (yogaData.quality === "avoid") {
        score -= 15;
        warnings.push(`${panchang.yoga} yoga is inauspicious.`);
      }
    }

    // 4. Evaluate Karana (max 10 points)
    const karanaData = KARANAS.find((k) => k.name === panchang.karana);
    if (karanaData) {
      if (karanaData.quality === "excellent") {
        score += 10;
        reasons.push(`${panchang.karana} karana is highly favorable.`);
      } else if (karanaData.quality === "good") {
        score += 7;
      } else if (karanaData.quality === "avoid") {
        score -= 15;
        warnings.push(`${panchang.karana} (Bhadra) karana should be avoided for auspicious activities.`);
      }
    }

    // 5. Evaluate Vara (weekday) (max 15 points)
    const varaData = VARAS[date.getDay()];
    if (varaData.goodFor.includes(purpose)) {
      score += 15;
      reasons.push(`${varaData.english} (${varaData.name}) is favorable for ${purpose}.`);
    } else if (varaData.quality === "avoid") {
      score -= 10;
      warnings.push(`${varaData.english} is generally not preferred for auspicious activities.`);
    }

    // 6. Check for special combinations
    if (
      panchang.nakshatra === "Pushya" &&
      varaData.english === "Thursday"
    ) {
      score += 15;
      reasons.push("Pushya nakshatra on Thursday creates Pushya Yoga - highly auspicious!");
    }

    if (
      panchang.nakshatra === "Rohini" ||
      panchang.nakshatra === "Uttara Phalguni" ||
      panchang.nakshatra === "Uttara Ashadha" ||
      panchang.nakshatra === "Uttara Bhadrapada"
    ) {
      score += 5;
      reasons.push(`${panchang.nakshatra} is a 'Dhruva' (fixed) nakshatra - stable for property.`);
    }

    // Calculate recommended time (avoid Rahu Kaal)
    const recommendedTime = this.calculateRecommendedTime(rahuKaal);

    // Determine quality
    let quality: MuhuratDate["quality"];
    if (score >= 85) {
      quality = "EXCELLENT";
    } else if (score >= 65) {
      quality = "GOOD";
    } else if (score >= 40) {
      quality = "NEUTRAL";
    } else {
      quality = "AVOID";
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    return {
      date: this.formatDate(date),
      dayName: VARAS[date.getDay()].english,
      tithi: panchang.tithi,
      tithiNumber: panchang.tithiNumber,
      nakshatra: panchang.nakshatra,
      yoga: panchang.yoga,
      karana: panchang.karana,
      vara: VARAS[date.getDay()].name,
      rahuKaal,
      quality,
      score,
      reasons,
      recommendedTime,
      warnings,
    };
  }

  private calculatePanchang(date: Date): {
    tithi: string;
    tithiNumber: number;
    nakshatra: string;
    yoga: string;
    karana: string;
  } {
    // Simplified panchang calculation
    // In production, use accurate astronomical calculations or an API

    const dayOfYear = this.getDayOfYear(date);
    const year = date.getFullYear();

    // Lunar day cycle (approximately 29.5 days)
    const lunarCycle = (dayOfYear + year) % 29.5;
    const tithiIndex = Math.floor(lunarCycle) % 30;
    const tithiData = TITHIS[tithiIndex] || TITHIS[0];

    // Nakshatra cycle (approximately 27.3 days for Moon to traverse all)
    const nakshatraCycle = (dayOfYear + year * 0.5) % 27;
    const nakshatraIndex = Math.floor(nakshatraCycle) % 27;
    const nakshatra = NAKSHATRAS_MUHURAT[nakshatraIndex]?.name || "Ashwini";

    // Yoga cycle (sun + moon longitude / 13.33)
    const yogaCycle = (dayOfYear * 0.9 + year) % 27;
    const yogaIndex = Math.floor(yogaCycle) % 27;
    const yoga = YOGAS[yogaIndex]?.name || "Vishkambha";

    // Karana (half of tithi)
    const karanaIndex = (tithiIndex * 2) % 11;
    const karana = KARANAS[karanaIndex]?.name || "Bava";

    return {
      tithi: tithiData.name,
      tithiNumber: tithiData.number,
      nakshatra,
      yoga,
      karana,
    };
  }

  private calculateRahuKaal(date: Date): { start: string; end: string } {
    const dayOfWeek = date.getDay();
    const rahuPeriod = RAHU_KAAL_PERIODS[dayOfWeek];

    return {
      start: this.formatTime(rahuPeriod.start),
      end: this.formatTime(rahuPeriod.end),
    };
  }

  private calculateRecommendedTime(rahuKaal: {
    start: string;
    end: string;
  }): { start: string; end: string } {
    // Recommend morning time before Rahu Kaal if it's in morning/afternoon
    // Otherwise recommend morning
    const rahuStart = this.parseTime(rahuKaal.start);

    if (rahuStart > 10) {
      return { start: "09:00", end: "10:30" };
    } else if (rahuStart > 8) {
      return { start: "10:30", end: "12:00" };
    } else {
      return { start: "14:00", end: "16:00" };
    }
  }

  private generateRemediesForDate(
    _panchang: { tithi: string; nakshatra: string; yoga: string; karana: string },
    quality: MuhuratDate["quality"]
  ): string[] {
    const remedies: string[] = [];

    if (quality === "AVOID" || quality === "NEUTRAL") {
      remedies.push("Light a ghee lamp and pray to Lord Ganesha before the activity.");
      remedies.push("Chant 'Om Ganeshaya Namaha' 11 times before proceeding.");
      remedies.push("Avoid Rahu Kaal timing for important decisions.");
      remedies.push("Consider wearing yellow clothing for positive energy.");
      remedies.push("If urgent, perform a small Navagraha puja beforehand.");
    }

    return remedies;
  }

  private getGuidelinesForPurpose(purpose: MuhuratPurpose): string[] {
    const guidelines: Record<MuhuratPurpose, string[]> = {
      visit: [
        "Best to visit properties during Shukla Paksha (waxing moon phase).",
        "Thursday, Friday, and Monday are most favorable for property visits.",
        "Visit between 9 AM and 11 AM or 2 PM and 4 PM for best energy.",
        "Avoid visiting during Rahu Kaal, Yamaghantaka, and Gulika Kala.",
        "Fixed (Dhruva) nakshatras like Rohini, Uttara Phalguni are ideal.",
      ],
      signing: [
        "Agreement signing should ideally be done in Shukla Paksha.",
        "Wednesday and Thursday are excellent for legal documents.",
        "Avoid signing during eclipses or on Chaturthi/Ashtami tithis.",
        "Pushya, Hasta, Anuradha, and Shravana nakshatras are excellent.",
        "Ensure Mercury (Budh) is not retrograde for contract signing.",
      ],
      registration: [
        "Thursday (Guruvara) is most auspicious for property registration.",
        "Purnima (full moon) or dates close to it are favorable.",
        "Avoid Amavasya (new moon) and Krishna Chaturdashi.",
        "Fixed nakshatras ensure stability in property ownership.",
        "Complete registration before noon for best results.",
      ],
      moving: [
        "Griha Pravesh should be done during Shukla Paksha only.",
        "Uttara Phalguni, Uttara Ashadha, Uttara Bhadrapada are best nakshatras.",
        "Monday, Wednesday, Thursday, and Friday are favorable.",
        "Enter the new home facing east or north first.",
        "Perform Vastu puja and Griha Shanti before moving furniture.",
        "First bring milk, rice, and turmeric into the new home.",
      ],
    };

    return guidelines[purpose] || [];
  }

  private getPurposeDescription(purpose: MuhuratPurpose): string {
    const descriptions: Record<MuhuratPurpose, string> = {
      visit: "property visit",
      signing: "agreement signing",
      registration: "property registration",
      moving: "Griha Pravesh (house warming/moving in)",
    };
    return descriptions[purpose];
  }

  private formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  private formatTime(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }

  private parseTime(timeStr: string): number {
    const [h, m] = timeStr.split(":").map(Number);
    return h + m / 60;
  }

  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
