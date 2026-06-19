import { BaseAgent, Property, PropertyAnalysis } from "./BaseAgent";
import { normalizeDirection, Direction } from "./VastuRules";

// Vedic Astrology Data Types
export interface BirthDetails {
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM (24-hour format)
  placeOfBirth: {
    city: string;
    state?: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface JyotishProfile {
  rashi: string; // Moon sign
  nakshatra: string; // Birth star
  nakshatraPada: number; // 1-4
  lifePathNumber: number;
  favorableDirections: string[];
  favorableNumbers: number[];
  rulingPlanet: string;
  element: string;
}

export interface PropertyJyotishDetails {
  propertyId: string;
  address: string;
  entranceDirection?: string;
  propertyNumber?: number;
  floor?: number;
  unitNumber?: string;
  constructionYear?: number;
}

export interface JyotishCompatibility {
  overallScore: number;
  recommendation: "HIGHLY_COMPATIBLE" | "COMPATIBLE" | "NEUTRAL" | "CAUTIOUS" | "NOT_RECOMMENDED";
  factors: CompatibilityFactor[];
  remedies: string[];
  auspiciousElements: string[];
  buyerProfile: JyotishProfile;
}

interface CompatibilityFactor {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  positive: boolean;
}

// Vedic Astrology Constants
const RASHIS = [
  { name: "Mesha", english: "Aries", element: "Fire", lord: "Mars", direction: "EAST", numbers: [1, 9] },
  { name: "Vrishabha", english: "Taurus", element: "Earth", lord: "Venus", direction: "SOUTH", numbers: [2, 6] },
  { name: "Mithuna", english: "Gemini", element: "Air", lord: "Mercury", direction: "WEST", numbers: [3, 5] },
  { name: "Karka", english: "Cancer", element: "Water", lord: "Moon", direction: "NORTH", numbers: [2, 7] },
  { name: "Simha", english: "Leo", element: "Fire", lord: "Sun", direction: "EAST", numbers: [1, 4] },
  { name: "Kanya", english: "Virgo", element: "Earth", lord: "Mercury", direction: "SOUTH", numbers: [5, 6] },
  { name: "Tula", english: "Libra", element: "Air", lord: "Venus", direction: "WEST", numbers: [6, 9] },
  { name: "Vrishchika", english: "Scorpio", element: "Water", lord: "Mars", direction: "NORTH", numbers: [3, 9] },
  { name: "Dhanu", english: "Sagittarius", element: "Fire", lord: "Jupiter", direction: "EAST", numbers: [3, 9] },
  { name: "Makara", english: "Capricorn", element: "Earth", lord: "Saturn", direction: "SOUTH", numbers: [8, 6] },
  { name: "Kumbha", english: "Aquarius", element: "Air", lord: "Saturn", direction: "WEST", numbers: [4, 8] },
  { name: "Meena", english: "Pisces", element: "Water", lord: "Jupiter", direction: "NORTH", numbers: [3, 7] },
];

const NAKSHATRAS = [
  { name: "Ashwini", lord: "Ketu", rashi: "Mesha", pada: [1, 2, 3, 4], nature: "Swift", deity: "Ashwini Kumaras" },
  { name: "Bharani", lord: "Venus", rashi: "Mesha", pada: [1, 2, 3, 4], nature: "Fierce", deity: "Yama" },
  { name: "Krittika", lord: "Sun", rashi: "Mesha/Vrishabha", pada: [1, 2, 3, 4], nature: "Mixed", deity: "Agni" },
  { name: "Rohini", lord: "Moon", rashi: "Vrishabha", pada: [1, 2, 3, 4], nature: "Fixed", deity: "Brahma" },
  { name: "Mrigashira", lord: "Mars", rashi: "Vrishabha/Mithuna", pada: [1, 2, 3, 4], nature: "Soft", deity: "Soma" },
  { name: "Ardra", lord: "Rahu", rashi: "Mithuna", pada: [1, 2, 3, 4], nature: "Sharp", deity: "Rudra" },
  { name: "Punarvasu", lord: "Jupiter", rashi: "Mithuna/Karka", pada: [1, 2, 3, 4], nature: "Movable", deity: "Aditi" },
  { name: "Pushya", lord: "Saturn", rashi: "Karka", pada: [1, 2, 3, 4], nature: "Light", deity: "Brihaspati" },
  { name: "Ashlesha", lord: "Mercury", rashi: "Karka", pada: [1, 2, 3, 4], nature: "Sharp", deity: "Nagas" },
  { name: "Magha", lord: "Ketu", rashi: "Simha", pada: [1, 2, 3, 4], nature: "Fierce", deity: "Pitris" },
  { name: "Purva Phalguni", lord: "Venus", rashi: "Simha", pada: [1, 2, 3, 4], nature: "Fierce", deity: "Bhaga" },
  { name: "Uttara Phalguni", lord: "Sun", rashi: "Simha/Kanya", pada: [1, 2, 3, 4], nature: "Fixed", deity: "Aryaman" },
  { name: "Hasta", lord: "Moon", rashi: "Kanya", pada: [1, 2, 3, 4], nature: "Light", deity: "Savitar" },
  { name: "Chitra", lord: "Mars", rashi: "Kanya/Tula", pada: [1, 2, 3, 4], nature: "Soft", deity: "Tvashtar" },
  { name: "Swati", lord: "Rahu", rashi: "Tula", pada: [1, 2, 3, 4], nature: "Movable", deity: "Vayu" },
  { name: "Vishakha", lord: "Jupiter", rashi: "Tula/Vrishchika", pada: [1, 2, 3, 4], nature: "Mixed", deity: "Indra-Agni" },
  { name: "Anuradha", lord: "Saturn", rashi: "Vrishchika", pada: [1, 2, 3, 4], nature: "Soft", deity: "Mitra" },
  { name: "Jyeshtha", lord: "Mercury", rashi: "Vrishchika", pada: [1, 2, 3, 4], nature: "Sharp", deity: "Indra" },
  { name: "Mula", lord: "Ketu", rashi: "Dhanu", pada: [1, 2, 3, 4], nature: "Sharp", deity: "Nirriti" },
  { name: "Purva Ashadha", lord: "Venus", rashi: "Dhanu", pada: [1, 2, 3, 4], nature: "Fierce", deity: "Apas" },
  { name: "Uttara Ashadha", lord: "Sun", rashi: "Dhanu/Makara", pada: [1, 2, 3, 4], nature: "Fixed", deity: "Vishvadevas" },
  { name: "Shravana", lord: "Moon", rashi: "Makara", pada: [1, 2, 3, 4], nature: "Movable", deity: "Vishnu" },
  { name: "Dhanishta", lord: "Mars", rashi: "Makara/Kumbha", pada: [1, 2, 3, 4], nature: "Movable", deity: "Vasus" },
  { name: "Shatabhisha", lord: "Rahu", rashi: "Kumbha", pada: [1, 2, 3, 4], nature: "Movable", deity: "Varuna" },
  { name: "Purva Bhadrapada", lord: "Jupiter", rashi: "Kumbha/Meena", pada: [1, 2, 3, 4], nature: "Fierce", deity: "Aja Ekapada" },
  { name: "Uttara Bhadrapada", lord: "Saturn", rashi: "Meena", pada: [1, 2, 3, 4], nature: "Fixed", deity: "Ahir Budhnya" },
  { name: "Revati", lord: "Mercury", rashi: "Meena", pada: [1, 2, 3, 4], nature: "Soft", deity: "Pushan" },
];

// Direction compatibility based on Rashi (using Normalized Direction Codes from VastuRules)
// Mapping: NORTH_EAST -> NE, SOUTH_EAST -> SE, etc.
const DIRECTION_COMPATIBILITY: Record<string, { best: Direction[]; good: Direction[]; neutral: Direction[]; avoid: Direction[] }> = {
  Mesha: { best: ["E"], good: ["NE", "SE"], neutral: ["N", "S"], avoid: ["W", "SW"] },
  Vrishabha: { best: ["S"], good: ["SE", "SW"], neutral: ["E", "W"], avoid: ["N", "NW"] },
  Mithuna: { best: ["W"], good: ["NW", "SW"], neutral: ["N", "S"], avoid: ["E", "SE"] },
  Karka: { best: ["N"], good: ["NE", "NW"], neutral: ["E", "W"], avoid: ["S", "SW"] },
  Simha: { best: ["E"], good: ["SE", "NE"], neutral: ["N", "S"], avoid: ["W", "NW"] },
  Kanya: { best: ["S"], good: ["SW", "SE"], neutral: ["E", "W"], avoid: ["N", "NE"] },
  Tula: { best: ["W"], good: ["NW", "SW"], neutral: ["N", "S"], avoid: ["E", "SE"] },
  Vrishchika: { best: ["N"], good: ["NE", "NW"], neutral: ["E", "W"], avoid: ["S", "SE"] },
  Dhanu: { best: ["E"], good: ["NE", "SE"], neutral: ["N", "S"], avoid: ["W", "SW"] },
  Makara: { best: ["S"], good: ["SW", "SE"], neutral: ["E", "W"], avoid: ["N", "NW"] },
  Kumbha: { best: ["W"], good: ["NW", "SW"], neutral: ["N", "S"], avoid: ["E", "NE"] },
  Meena: { best: ["N"], good: ["NE", "NW"], neutral: ["E", "W"], avoid: ["S", "SW"] },
};

// Numerology compatibility
const NUMBER_COMPATIBILITY: Record<number, number[]> = {
  1: [1, 2, 3, 9],
  2: [1, 2, 6, 9],
  3: [1, 3, 6, 9],
  4: [1, 4, 6, 7],
  5: [1, 5, 6, 9],
  6: [2, 3, 4, 5, 6, 9],
  7: [4, 6, 7],
  8: [1, 4, 5, 8],
  9: [1, 2, 3, 5, 6, 9],
};

export class JyotishMatcher extends BaseAgent {
  constructor(agentId?: string) {
    super(agentId || `jyotish-matcher-${Date.now()}`, "jyotish-matcher");
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    await this.delay(Math.random() * 500 + 250);

    // For general property analysis without buyer details
    const score = this.calculateGeneralPropertyScore(property);
    const confidence = 0.7;
    const reasoning = this.generateGeneralReasoning(property);

    return {
      agentId: this.agentId,
      propertyId: property.id,
      score,
      confidence,
      reasoning,
      timestamp: new Date(),
    };
  }

  /**
   * Match buyer's birth details with a property for Jyotish compatibility
   */
  async matchBuyerToProperty(
    birthDetails: BirthDetails,
    propertyDetails: PropertyJyotishDetails
  ): Promise<JyotishCompatibility> {
    await this.delay(Math.random() * 400 + 200);

    // Calculate buyer's Jyotish profile
    const profile = this.calculateJyotishProfile(birthDetails);

    // Calculate compatibility factors
    const factors: CompatibilityFactor[] = [];

    // 1. Direction Compatibility (max 25 points)
    const directionFactor = this.calculateDirectionCompatibility(
      profile,
      propertyDetails.entranceDirection
    );
    factors.push(directionFactor);

    // 2. Numerology Compatibility (max 20 points)
    const numerologyFactor = this.calculateNumerologyCompatibility(
      profile,
      propertyDetails
    );
    factors.push(numerologyFactor);

    // 3. Nakshatra-based Property Suitability (max 20 points)
    const nakshatraFactor = this.calculateNakshatraSuitability(profile);
    factors.push(nakshatraFactor);

    // 4. Floor Number Compatibility (max 15 points)
    if (propertyDetails.floor !== undefined) {
      const floorFactor = this.calculateFloorCompatibility(
        profile,
        propertyDetails.floor
      );
      factors.push(floorFactor);
    }

    // 5. Construction Year Compatibility (max 10 points)
    if (propertyDetails.constructionYear) {
      const yearFactor = this.calculateYearCompatibility(
        profile,
        propertyDetails.constructionYear
      );
      factors.push(yearFactor);
    }

    // 6. Rashi Element Harmony (max 10 points)
    const elementFactor = this.calculateElementHarmony(profile);
    factors.push(elementFactor);

    // Calculate overall score
    const totalScore = factors.reduce((sum, f) => sum + f.score, 0);
    const maxPossibleScore = factors.reduce((sum, f) => sum + f.maxScore, 0);
    const overallScore = Math.round((totalScore / maxPossibleScore) * 100);

    // Determine recommendation
    const recommendation = this.getRecommendation(overallScore);

    // Generate remedies if score is low
    const remedies = this.generateRemedies(profile, factors, overallScore);

    // Generate auspicious elements
    const auspiciousElements = this.generateAuspiciousElements(profile);

    return {
      overallScore,
      recommendation,
      factors,
      remedies,
      auspiciousElements,
      buyerProfile: profile,
    };
  }

  /**
   * Calculate Jyotish profile from birth details
   */
  calculateJyotishProfile(birthDetails: BirthDetails): JyotishProfile {
    const dob = new Date(birthDetails.dateOfBirth);

    // Calculate Moon sign (Rashi) - simplified calculation
    const rashi = this.calculateRashi(dob, birthDetails.timeOfBirth);

    // Calculate Nakshatra
    const { nakshatra, pada } = this.calculateNakshatra(dob, birthDetails.timeOfBirth);

    // Calculate Life Path Number
    const lifePathNumber = this.calculateLifePathNumber(birthDetails.dateOfBirth);

    // Get Rashi details
    const rashiData = RASHIS.find((r) => r.name === rashi) || RASHIS[0];

    // Get favorable directions based on rashi
    const directionCompat = DIRECTION_COMPATIBILITY[rashi];
    const favorableDirections = [
      ...directionCompat.best,
      ...directionCompat.good,
    ];

    return {
      rashi,
      nakshatra,
      nakshatraPada: pada,
      lifePathNumber,
      favorableDirections,
      favorableNumbers: rashiData.numbers,
      rulingPlanet: rashiData.lord,
      element: rashiData.element,
    };
  }

  private calculateRashi(dob: Date, timeOfBirth: string): string {
    // Simplified Rashi calculation based on date
    // In production, use Swiss Ephemeris for accurate Moon position
    const dayOfYear = this.getDayOfYear(dob);
    const timeAdjustment = parseInt(timeOfBirth.split(":")[0]) / 24;
    const adjustedDay = dayOfYear + timeAdjustment;

    // Moon traverses ~13 degrees per day, completes zodiac in ~27.3 days
    // This is a simplified approximation
    const moonCycle = (adjustedDay + dob.getFullYear()) % 27.3;
    const rashiIndex = Math.floor((moonCycle / 27.3) * 12) % 12;

    return RASHIS[rashiIndex].name;
  }

  private calculateNakshatra(
    dob: Date,
    timeOfBirth: string
  ): { nakshatra: string; pada: number } {
    const dayOfYear = this.getDayOfYear(dob);
    const hour = parseInt(timeOfBirth.split(":")[0]);
    const minute = parseInt(timeOfBirth.split(":")[1]) || 0;
    const timeAdjustment = (hour * 60 + minute) / 1440;

    // Each nakshatra spans 13°20' of the zodiac
    // Moon takes ~27.3 days to complete zodiac
    const adjustedDay = (dayOfYear + timeAdjustment + dob.getFullYear()) % 27.3;
    const nakshatraIndex = Math.floor(adjustedDay) % 27;
    const nakshatraFraction = adjustedDay - Math.floor(adjustedDay);
    const pada = Math.floor(nakshatraFraction * 4) + 1;

    return {
      nakshatra: NAKSHATRAS[nakshatraIndex].name,
      pada: Math.min(4, Math.max(1, pada)),
    };
  }

  private calculateLifePathNumber(dateOfBirth: string): number {
    const digits = dateOfBirth.replace(/\D/g, "").split("").map(Number);
    let sum = digits.reduce((a, b) => a + b, 0);

    // Reduce to single digit unless master number
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum
        .toString()
        .split("")
        .map(Number)
        .reduce((a, b) => a + b, 0);
    }

    return sum;
  }

  private calculateDirectionCompatibility(
    profile: JyotishProfile,
    entranceDirection?: string
  ): CompatibilityFactor {
    if (!entranceDirection) {
      return {
        name: "Direction Compatibility",
        score: 12,
        maxScore: 25,
        description: "Entrance direction not specified. Consider properties with entrances facing " +
          profile.favorableDirections.slice(0, 2).join(" or ") + ".",
        positive: true,
      };
    }

    // Normalize input direction to standard format (N, NE, E...)
    const normalizedDir = normalizeDirection(entranceDirection);

    if (!normalizedDir) {
       // Fallback if direction cannot be normalized
       return {
         name: "Direction Compatibility",
         score: 10,
         maxScore: 25,
         description: `Entrance direction '${entranceDirection}' unrecognized. Please verify Vastu direction.`,
         positive: true
       };
    }

    const directionCompat = DIRECTION_COMPATIBILITY[profile.rashi];
    let score = 0;
    let description = "";

    // Helper to format direction for display (optional, can just use code)
    const displayDir = normalizedDir;

    if (directionCompat.best.includes(normalizedDir)) {
      score = 25;
      description = `Excellent! ${displayDir} entrance is highly auspicious for your Rashi (${profile.rashi}).`;
    } else if (directionCompat.good.includes(normalizedDir)) {
      score = 20;
      description = `Good match! ${displayDir} entrance is favorable for your Rashi.`;
    } else if (directionCompat.neutral.includes(normalizedDir)) {
      score = 12;
      description = `Neutral. ${displayDir} entrance has moderate compatibility with your Rashi.`;
    } else if (directionCompat.avoid.includes(normalizedDir)) {
      score = 5;
      description = `Caution: ${displayDir} entrance is not ideal for ${profile.rashi}. Your favorable directions are ${profile.favorableDirections.join(", ")}.`;
    } else {
      score = 10;
      description = `${displayDir} entrance requires assessment. Best directions for you: ${profile.favorableDirections.join(", ")}.`;
    }

    return {
      name: "Direction Compatibility",
      score,
      maxScore: 25,
      description,
      positive: score >= 15,
    };
  }

  private calculateNumerologyCompatibility(
    profile: JyotishProfile,
    propertyDetails: PropertyJyotishDetails
  ): CompatibilityFactor {
    // Calculate property number
    let propertyNumber = propertyDetails.propertyNumber;

    if (!propertyNumber && propertyDetails.address) {
      // Extract numbers from address
      const numbers = propertyDetails.address.match(/\d+/g);
      if (numbers) {
        propertyNumber = numbers
          .join("")
          .split("")
          .map(Number)
          .reduce((a, b) => a + b, 0);
        // Reduce to single digit
        while (propertyNumber > 9) {
          propertyNumber = propertyNumber
            .toString()
            .split("")
            .map(Number)
            .reduce((a, b) => a + b, 0);
        }
      }
    }

    if (!propertyNumber) {
      return {
        name: "Numerology",
        score: 10,
        maxScore: 20,
        description: "Property number not available. Your favorable numbers are: " +
          profile.favorableNumbers.join(", "),
        positive: true,
      };
    }

    const compatibleNumbers = NUMBER_COMPATIBILITY[profile.lifePathNumber] || [];
    const rashiNumbers = profile.favorableNumbers;

    let score = 10;
    let description = "";

    // Check both life path and rashi number compatibility
    const isLifePathCompatible = compatibleNumbers.includes(propertyNumber);
    const isRashiCompatible = rashiNumbers.includes(propertyNumber);

    if (isLifePathCompatible && isRashiCompatible) {
      score = 20;
      description = `Excellent numerology match! Property number ${propertyNumber} harmonizes with both your life path (${profile.lifePathNumber}) and Rashi numbers.`;
    } else if (isLifePathCompatible || isRashiCompatible) {
      score = 15;
      description = `Good numerology compatibility. Property number ${propertyNumber} aligns with your ${isLifePathCompatible ? "life path number" : "Rashi"}.`;
    } else {
      score = 8;
      description = `Property number ${propertyNumber} has neutral compatibility. Your favorable numbers: ${[...new Set([...compatibleNumbers, ...rashiNumbers])].join(", ")}.`;
    }

    return {
      name: "Numerology",
      score,
      maxScore: 20,
      description,
      positive: score >= 12,
    };
  }

  private calculateNakshatraSuitability(profile: JyotishProfile): CompatibilityFactor {
    const nakshatraData = NAKSHATRAS.find((n) => n.name === profile.nakshatra);

    if (!nakshatraData) {
      return {
        name: "Nakshatra Suitability",
        score: 10,
        maxScore: 20,
        description: "Nakshatra analysis pending.",
        positive: true,
      };
    }

    let score = 10;
    let description = "";

    // Fixed and Soft nakshatras are best for property
    const goodForProperty = ["Fixed", "Soft", "Light"];
    const neutralForProperty = ["Movable", "Mixed"];
    const cautiousForProperty = ["Sharp", "Fierce", "Swift"];

    if (goodForProperty.includes(nakshatraData.nature)) {
      score = 20;
      description = `Excellent! Born in ${profile.nakshatra} (${nakshatraData.nature} nature), you naturally attract stable, harmonious properties. Deity ${nakshatraData.deity} blesses property matters.`;
    } else if (neutralForProperty.includes(nakshatraData.nature)) {
      score = 14;
      description = `Good. ${profile.nakshatra} nakshatra (${nakshatraData.nature}) suggests flexibility in property choices. Consider properties that feel intuitively right.`;
    } else {
      score = 10;
      description = `${profile.nakshatra} nakshatra (${nakshatraData.nature}) suggests performing Vastu Shanti puja before finalizing property. Seek properties with peaceful energy.`;
    }

    return {
      name: "Nakshatra Suitability",
      score,
      maxScore: 20,
      description,
      positive: score >= 12,
    };
  }

  private calculateFloorCompatibility(
    profile: JyotishProfile,
    floor: number
  ): CompatibilityFactor {
    // Reduce floor to single digit
    let floorNumber = floor;
    while (floorNumber > 9) {
      floorNumber = floorNumber
        .toString()
        .split("")
        .map(Number)
        .reduce((a, b) => a + b, 0);
    }

    const compatibleNumbers = NUMBER_COMPATIBILITY[profile.lifePathNumber] || [];
    const rashiNumbers = profile.favorableNumbers;

    let score = 7;
    let description = "";

    if (compatibleNumbers.includes(floorNumber) || rashiNumbers.includes(floorNumber)) {
      score = 15;
      description = `Floor ${floor} (numerology ${floorNumber}) is favorable for you.`;
    } else {
      score = 8;
      description = `Floor ${floor} has neutral compatibility. Preferred floors: ${[...new Set([...compatibleNumbers, ...rashiNumbers])].map((n) => `${n}`).join(", ")}.`;
    }

    return {
      name: "Floor Compatibility",
      score,
      maxScore: 15,
      description,
      positive: score >= 10,
    };
  }

  private calculateYearCompatibility(
    profile: JyotishProfile,
    constructionYear: number
  ): CompatibilityFactor {
    // Reduce year to single digit
    let yearNumber = constructionYear
      .toString()
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
    while (yearNumber > 9) {
      yearNumber = yearNumber
        .toString()
        .split("")
        .map(Number)
        .reduce((a, b) => a + b, 0);
    }

    const compatibleNumbers = NUMBER_COMPATIBILITY[profile.lifePathNumber] || [];

    let score = 5;
    if (compatibleNumbers.includes(yearNumber)) {
      score = 10;
      return {
        name: "Construction Year",
        score,
        maxScore: 10,
        description: `Property built in ${constructionYear} (vibration ${yearNumber}) aligns with your numerological profile.`,
        positive: true,
      };
    }

    return {
      name: "Construction Year",
      score,
      maxScore: 10,
      description: `Construction year ${constructionYear} has neutral numerological compatibility.`,
      positive: true,
    };
  }

  private calculateElementHarmony(profile: JyotishProfile): CompatibilityFactor {
    // Element-based recommendations for property features
    const elementAdvice: Record<string, { score: number; advice: string }> = {
      Fire: {
        score: 10,
        advice: "Seek properties with good natural light, south/east facing windows. Avoid dark, cold spaces.",
      },
      Earth: {
        score: 10,
        advice: "Properties with gardens, ground floors, or earthy tones suit you. Stability is key.",
      },
      Air: {
        score: 10,
        advice: "Spacious, well-ventilated properties with open layouts enhance your energy. Higher floors can be beneficial.",
      },
      Water: {
        score: 10,
        advice: "Properties near water features, with north-facing aspects suit you. Blue and white interiors are favorable.",
      },
    };

    const advice = elementAdvice[profile.element] || elementAdvice.Earth;

    return {
      name: "Element Harmony",
      score: advice.score,
      maxScore: 10,
      description: `As a ${profile.element} element person (${profile.rashi}): ${advice.advice}`,
      positive: true,
    };
  }

  private getRecommendation(
    score: number
  ): JyotishCompatibility["recommendation"] {
    if (score >= 80) return "HIGHLY_COMPATIBLE";
    if (score >= 65) return "COMPATIBLE";
    if (score >= 50) return "NEUTRAL";
    if (score >= 35) return "CAUTIOUS";
    return "NOT_RECOMMENDED";
  }

  private generateRemedies(
    profile: JyotishProfile,
    factors: CompatibilityFactor[],
    score: number
  ): string[] {
    const remedies: string[] = [];

    if (score < 70) {
      // Direction remedies
      const directionFactor = factors.find((f) => f.name === "Direction Compatibility");
      if (directionFactor && !directionFactor.positive) {
        remedies.push(
          `Place a Vastu pyramid or yantra near the entrance to harmonize directional energy.`
        );
        remedies.push(
          `Keep a copper pot filled with water in the ${profile.favorableDirections[0]} corner.`
        );
      }

      // Numerology remedies
      const numFactor = factors.find((f) => f.name === "Numerology");
      if (numFactor && !numFactor.positive) {
        remedies.push(
          `Display your favorable numbers (${profile.favorableNumbers.join(", ")}) in home decor.`
        );
      }

      // General remedies based on ruling planet
      const planetRemedies: Record<string, string> = {
        Sun: "Place a red cloth or copper items in the east direction.",
        Moon: "Keep a silver item or water feature in the north direction.",
        Mars: "Place a red light or coral stone in the south direction.",
        Mercury: "Keep green plants and books in the north direction.",
        Jupiter: "Place yellow flowers or brass items in the northeast.",
        Venus: "Display white flowers or crystals in the southeast.",
        Saturn: "Keep iron items or blue elements in the west direction.",
        Rahu: "Place a Rahu yantra or smoky quartz in the southwest.",
        Ketu: "Keep a lamp lit in the southwest direction regularly.",
      };

      const planetRemedy = planetRemedies[profile.rulingPlanet];
      if (planetRemedy) {
        remedies.push(planetRemedy);
      }

      // Always add general remedy
      remedies.push(
        "Perform Vastu Shanti puja before moving in to harmonize energies."
      );
      remedies.push(
        "Light a diya (lamp) during evening hours daily to enhance positive energy."
      );
    }

    return remedies;
  }

  private generateAuspiciousElements(profile: JyotishProfile): string[] {
    const elements: string[] = [];

    elements.push(`Favorable entrance directions: ${profile.favorableDirections.join(", ")}`);
    elements.push(`Lucky numbers for property: ${profile.favorableNumbers.join(", ")}`);
    elements.push(`Ruling planet: ${profile.rulingPlanet}`);
    elements.push(`Element affinity: ${profile.element}`);
    elements.push(`Birth star: ${profile.nakshatra} (Pada ${profile.nakshatraPada})`);

    // Add specific auspicious items based on element
    const elementItems: Record<string, string> = {
      Fire: "Auspicious items: Sunlight, warm colors, south-facing windows",
      Earth: "Auspicious items: Plants, brown/green decor, ground contact",
      Air: "Auspicious items: Wind chimes, open spaces, light colors",
      Water: "Auspicious items: Water features, blue tones, north aspects",
    };

    elements.push(elementItems[profile.element] || elementItems.Earth);

    return elements;
  }

  private calculateGeneralPropertyScore(property: Property): number {
    let score = 7;

    // Adjust based on property characteristics
    if (property.yearBuilt) {
      const age = new Date().getFullYear() - property.yearBuilt;
      if (age < 5) score += 0.5;
      if (age > 50) score -= 0.3;
    }

    // Properties with certain features score higher
    if (property.neighborhood?.toLowerCase().includes("peaceful")) score += 0.5;
    if (property.neighborhood?.toLowerCase().includes("green")) score += 0.3;

    return this.clamp(score, 1, 10);
  }

  private generateGeneralReasoning(property: Property): string {
    return `General Jyotish assessment: Property at ${property.address} requires buyer-specific analysis for accurate compatibility. Consider entrance direction, property number, and alignment with buyer's birth chart for comprehensive Jyotish matching.`;
  }

  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}