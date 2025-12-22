import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { redis, cacheKeys, cacheTTL } from '../utils/redis';
import { authenticate } from '../middleware/auth';
import { asyncHandler, BadRequestError, NotFoundError } from '../middleware/errorHandler';

const router = Router();

// ============================================================================
// SCHEMAS
// ============================================================================

const birthDetailsSchema = z.object({
  dateOfBirth: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  timeOfBirth: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  placeOfBirth: z.object({
    city: z.string(),
    state: z.string().optional(),
    country: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
});

const auspiciousDatesSchema = z.object({
  eventType: z.enum([
    'PROPERTY_VIEWING', 'MAKING_OFFER', 'SIGNING_CONTRACT', 
    'CLOSING', 'GRIHA_PRAVESH', 'RENOVATION_START', 
    'BHOOMI_PUJA', 'MOVING_IN'
  ]),
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  birthDetails: birthDetailsSchema.optional(),
});

const muhuratSchema = z.object({
  eventType: z.enum([
    'PROPERTY_VIEWING', 'MAKING_OFFER', 'SIGNING_CONTRACT', 
    'CLOSING', 'GRIHA_PRAVESH', 'RENOVATION_START',
    'BHOOMI_PUJA', 'MOVING_IN'
  ]),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  birthDetails: birthDetailsSchema.optional(),
});

const propertyMatchSchema = z.object({
  propertyId: z.string().uuid(),
  buyerBirthDetails: birthDetailsSchema,
});

// ============================================================================
// VEDIC ASTROLOGY DATA
// ============================================================================

const NAKSHATRAS = [
  { name: 'Ashwini', deity: 'Ashwini Kumaras', element: 'Ketu', nature: 'Swift', goodFor: ['new beginnings', 'travel', 'medical'] },
  { name: 'Bharani', deity: 'Yama', element: 'Venus', nature: 'Fierce', goodFor: ['cremation', 'destruction'] },
  { name: 'Krittika', deity: 'Agni', element: 'Sun', nature: 'Mixed', goodFor: ['fire ceremonies', 'cooking'] },
  { name: 'Rohini', deity: 'Brahma', element: 'Moon', nature: 'Fixed', goodFor: ['agriculture', 'marriage', 'property purchase'] },
  { name: 'Mrigashira', deity: 'Soma', element: 'Mars', nature: 'Soft', goodFor: ['travel', 'gardens', 'art'] },
  { name: 'Ardra', deity: 'Rudra', element: 'Rahu', nature: 'Sharp', goodFor: ['destruction', 'surgery'] },
  { name: 'Punarvasu', deity: 'Aditi', element: 'Jupiter', nature: 'Movable', goodFor: ['travel', 'returning home', 'griha pravesh'] },
  { name: 'Pushya', deity: 'Brihaspati', element: 'Saturn', nature: 'Light', goodFor: ['all auspicious activities', 'property', 'investment'] },
  { name: 'Ashlesha', deity: 'Nagas', element: 'Mercury', nature: 'Sharp', goodFor: ['administering poison', 'filing lawsuits'] },
  { name: 'Magha', deity: 'Pitris', element: 'Ketu', nature: 'Fierce', goodFor: ['ancestral rites', 'government work'] },
  { name: 'Purva Phalguni', deity: 'Bhaga', element: 'Venus', nature: 'Fierce', goodFor: ['marriage', 'romance', 'relaxation'] },
  { name: 'Uttara Phalguni', deity: 'Aryaman', element: 'Sun', nature: 'Fixed', goodFor: ['marriage', 'agreements', 'property'] },
  { name: 'Hasta', deity: 'Savitar', element: 'Moon', nature: 'Light', goodFor: ['crafts', 'business', 'trading'] },
  { name: 'Chitra', deity: 'Tvashtar', element: 'Mars', nature: 'Soft', goodFor: ['decorating', 'jewelry', 'art'] },
  { name: 'Swati', deity: 'Vayu', element: 'Rahu', nature: 'Movable', goodFor: ['trade', 'travel', 'learning'] },
  { name: 'Vishakha', deity: 'Indra-Agni', element: 'Jupiter', nature: 'Mixed', goodFor: ['marriage', 'ceremonies'] },
  { name: 'Anuradha', deity: 'Mitra', element: 'Saturn', nature: 'Soft', goodFor: ['friendship', 'activities in foreign lands'] },
  { name: 'Jyeshtha', deity: 'Indra', element: 'Mercury', nature: 'Sharp', goodFor: ['administration', 'occult'] },
  { name: 'Mula', deity: 'Nirriti', element: 'Ketu', nature: 'Sharp', goodFor: ['agriculture', 'herbalism'] },
  { name: 'Purva Ashadha', deity: 'Apas', element: 'Venus', nature: 'Fierce', goodFor: ['water activities', 'confrontation'] },
  { name: 'Uttara Ashadha', deity: 'Vishvadevas', element: 'Sun', nature: 'Fixed', goodFor: ['permanent activities', 'property purchase'] },
  { name: 'Shravana', deity: 'Vishnu', element: 'Moon', nature: 'Movable', goodFor: ['learning', 'travel', 'taking medicine'] },
  { name: 'Dhanishta', deity: 'Vasus', element: 'Mars', nature: 'Movable', goodFor: ['moving', 'ceremonies'] },
  { name: 'Shatabhisha', deity: 'Varuna', element: 'Rahu', nature: 'Movable', goodFor: ['healing', 'aquatic activities'] },
  { name: 'Purva Bhadrapada', deity: 'Aja Ekapada', element: 'Jupiter', nature: 'Fierce', goodFor: ['agriculture', 'dealing with fire'] },
  { name: 'Uttara Bhadrapada', deity: 'Ahir Budhnya', element: 'Saturn', nature: 'Fixed', goodFor: ['marriage', 'property', 'spiritual activities'] },
  { name: 'Revati', deity: 'Pushan', element: 'Mercury', nature: 'Soft', goodFor: ['travel', 'dealing with animals', 'healing'] },
];

const TITHIS = [
  { name: 'Pratipada', paksha: 'Shukla', deity: 'Agni', nature: 'Nanda', goodFor: ['beginning tasks'] },
  { name: 'Dwitiya', paksha: 'Shukla', deity: 'Brahma', nature: 'Bhadra', goodFor: ['laying foundation', 'building'] },
  { name: 'Tritiya', paksha: 'Shukla', deity: 'Gauri', nature: 'Jaya', goodFor: ['all auspicious works'] },
  { name: 'Chaturthi', paksha: 'Shukla', deity: 'Yama/Ganesha', nature: 'Rikta', goodFor: ['cruel actions'] },
  { name: 'Panchami', paksha: 'Shukla', deity: 'Nagas', nature: 'Purna', goodFor: ['medicine', 'good deeds'] },
  { name: 'Shashthi', paksha: 'Shukla', deity: 'Kartikeya', nature: 'Nanda', goodFor: ['coronation', 'favorable activities'] },
  { name: 'Saptami', paksha: 'Shukla', deity: 'Surya', nature: 'Bhadra', goodFor: ['travel', 'vehicles'] },
  { name: 'Ashtami', paksha: 'Shukla', deity: 'Rudra', nature: 'Jaya', goodFor: ['warfare'] },
  { name: 'Navami', paksha: 'Shukla', deity: 'Durga', nature: 'Rikta', goodFor: ['destroying enemies'] },
  { name: 'Dashami', paksha: 'Shukla', deity: 'Dharma', nature: 'Purna', goodFor: ['all auspicious', 'griha pravesh'] },
  { name: 'Ekadashi', paksha: 'Shukla', deity: 'Vishvadeva', nature: 'Nanda', goodFor: ['fasting', 'spiritual'] },
  { name: 'Dwadashi', paksha: 'Shukla', deity: 'Vishnu', nature: 'Bhadra', goodFor: ['religious ceremonies'] },
  { name: 'Trayodashi', paksha: 'Shukla', deity: 'Kamadeva', nature: 'Jaya', goodFor: ['friendship', 'pleasure'] },
  { name: 'Chaturdashi', paksha: 'Shukla', deity: 'Rudra', nature: 'Rikta', goodFor: ['administering poison'] },
  { name: 'Purnima', paksha: 'Shukla', deity: 'Soma', nature: 'Purna', goodFor: ['all auspicious', 'property purchase'] },
];

const YOGAS = [
  { name: 'Vishkumbha', nature: 'Inauspicious', description: 'Obstacles in work' },
  { name: 'Priti', nature: 'Auspicious', description: 'Love and affection' },
  { name: 'Ayushman', nature: 'Auspicious', description: 'Long life, good health' },
  { name: 'Saubhagya', nature: 'Very Auspicious', description: 'Good fortune' },
  { name: 'Shobhana', nature: 'Auspicious', description: 'Splendor, beauty' },
  { name: 'Atiganda', nature: 'Inauspicious', description: 'Danger' },
  { name: 'Sukarma', nature: 'Very Auspicious', description: 'Good deeds succeed' },
  { name: 'Dhriti', nature: 'Auspicious', description: 'Determination, steadiness' },
  { name: 'Shula', nature: 'Inauspicious', description: 'Pain, suffering' },
  { name: 'Ganda', nature: 'Inauspicious', description: 'Danger, obstacles' },
  { name: 'Vriddhi', nature: 'Very Auspicious', description: 'Growth, prosperity' },
  { name: 'Dhruva', nature: 'Auspicious', description: 'Permanence, stability' },
  { name: 'Vyaghata', nature: 'Inauspicious', description: 'Destruction' },
  { name: 'Harshana', nature: 'Auspicious', description: 'Joy, happiness' },
  { name: 'Vajra', nature: 'Mixed', description: 'Hard, diamond-like' },
  { name: 'Siddhi', nature: 'Very Auspicious', description: 'Success, accomplishment' },
  { name: 'Vyatipata', nature: 'Very Inauspicious', description: 'Calamity' },
  { name: 'Variyan', nature: 'Auspicious', description: 'Excellence' },
  { name: 'Parigha', nature: 'Inauspicious', description: 'Obstruction' },
  { name: 'Shiva', nature: 'Very Auspicious', description: 'Auspiciousness' },
  { name: 'Siddha', nature: 'Very Auspicious', description: 'Perfection' },
  { name: 'Sadhya', nature: 'Auspicious', description: 'Accomplishment' },
  { name: 'Shubha', nature: 'Very Auspicious', description: 'Auspiciousness' },
  { name: 'Shukla', nature: 'Auspicious', description: 'Brightness, purity' },
  { name: 'Brahma', nature: 'Auspicious', description: 'Divine knowledge' },
  { name: 'Indra', nature: 'Very Auspicious', description: 'Power, authority' },
  { name: 'Vaidhriti', nature: 'Very Inauspicious', description: 'Bad luck' },
];

// Event-specific Muhurat requirements
const MUHURAT_REQUIREMENTS: Record<string, any> = {
  PROPERTY_VIEWING: {
    preferredNakshatras: ['Rohini', 'Mrigashira', 'Pushya', 'Uttara Phalguni', 'Hasta', 'Swati', 'Anuradha', 'Uttara Ashadha', 'Shravana', 'Uttara Bhadrapada', 'Revati'],
    avoidNakshatras: ['Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Magha', 'Jyeshtha', 'Mula'],
    preferredTithis: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Dwadashi', 'Trayodashi'],
    avoidTithis: ['Chaturthi', 'Navami', 'Chaturdashi', 'Amavasya'],
    preferredWeekdays: [1, 2, 3, 4, 5], // Mon-Fri
    avoidWeekdays: [6], // Saturday
  },
  GRIHA_PRAVESH: {
    preferredNakshatras: ['Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Uttara Phalguni', 'Hasta', 'Swati', 'Anuradha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Uttara Bhadrapada', 'Revati'],
    avoidNakshatras: ['Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Magha', 'Pubba', 'Vishakha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Purva Bhadrapada'],
    preferredTithis: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Purnima'],
    avoidTithis: ['Pratipada', 'Chaturthi', 'Shashthi', 'Ashtami', 'Navami', 'Chaturdashi', 'Amavasya'],
    preferredWeekdays: [1, 3, 4, 5], // Mon, Wed, Thu, Fri
    avoidWeekdays: [2, 6], // Tue, Sat
    requiresLagna: true,
    preferredLagnas: ['Taurus', 'Cancer', 'Leo', 'Virgo', 'Sagittarius', 'Aquarius', 'Pisces'],
  },
  CLOSING: {
    preferredNakshatras: ['Rohini', 'Pushya', 'Uttara Phalguni', 'Hasta', 'Anuradha', 'Uttara Ashadha', 'Shravana', 'Uttara Bhadrapada'],
    avoidNakshatras: ['Bharani', 'Ardra', 'Ashlesha', 'Jyeshtha', 'Mula'],
    preferredTithis: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Dwadashi', 'Purnima'],
    avoidTithis: ['Chaturthi', 'Ashtami', 'Navami', 'Chaturdashi', 'Amavasya'],
    preferredWeekdays: [1, 3, 4, 5],
    avoidWeekdays: [2, 6],
  },
  BHOOMI_PUJA: {
    preferredNakshatras: ['Rohini', 'Mrigashira', 'Pushya', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Uttara Ashadha', 'Shravana', 'Uttara Bhadrapada', 'Revati'],
    avoidNakshatras: ['Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Magha', 'Jyeshtha', 'Mula'],
    preferredTithis: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Purnima'],
    avoidTithis: ['Pratipada', 'Chaturthi', 'Shashthi', 'Ashtami', 'Navami', 'Chaturdashi', 'Amavasya'],
    preferredWeekdays: [1, 3, 4, 5],
    avoidWeekdays: [2, 6],
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateNakshatra(date: Date): typeof NAKSHATRAS[0] {
  // Simplified calculation - in production, use Swiss Ephemeris
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000));
  const index = (dayOfYear + date.getDate()) % 27;
  return NAKSHATRAS[index];
}

function calculateTithi(date: Date): typeof TITHIS[0] {
  // Simplified calculation based on lunar phase
  const lunarDay = Math.floor((date.getTime() / (24 * 60 * 60 * 1000)) % 30);
  const index = lunarDay % 15;
  return TITHIS[index];
}

function calculateYoga(date: Date): typeof YOGAS[0] {
  // Simplified calculation
  const dayNumber = Math.floor(date.getTime() / (24 * 60 * 60 * 1000));
  const index = dayNumber % 27;
  return YOGAS[index];
}

function calculateRahuKaal(date: Date): { start: string; end: string } {
  const dayOfWeek = date.getDay();
  const rahuKaalTimes: Record<number, { start: string; end: string }> = {
    0: { start: '16:30', end: '18:00' }, // Sunday
    1: { start: '07:30', end: '09:00' }, // Monday
    2: { start: '15:00', end: '16:30' }, // Tuesday
    3: { start: '12:00', end: '13:30' }, // Wednesday
    4: { start: '13:30', end: '15:00' }, // Thursday
    5: { start: '10:30', end: '12:00' }, // Friday
    6: { start: '09:00', end: '10:30' }, // Saturday
  };
  return rahuKaalTimes[dayOfWeek];
}

function calculateLifePathNumber(dateOfBirth: string): number {
  const digits = dateOfBirth.replace(/\D/g, '').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  
  // Reduce to single digit unless master number
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  }
  
  return sum;
}

function calculateMoonSign(dateOfBirth: Date, timeOfBirth?: string): string {
  // Simplified - in production would use ephemeris
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const dayOfYear = Math.floor((dateOfBirth.getTime() - new Date(dateOfBirth.getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000));
  const index = Math.floor((dayOfYear * 12) / 365) % 12;
  return signs[index];
}

function calculatePropertyCompatibility(buyerDetails: any, propertyDetails: any): any {
  // Calculate compatibility based on various factors
  const compatibility: any = {
    overall: 0,
    factors: [],
  };
  
  // Direction compatibility (based on moon sign)
  const moonSign = calculateMoonSign(new Date(buyerDetails.dateOfBirth));
  const directionCompatibility: Record<string, string[]> = {
    'Aries': ['EAST', 'NORTH'],
    'Taurus': ['SOUTH', 'SOUTH_WEST'],
    'Gemini': ['WEST', 'NORTH_WEST'],
    'Cancer': ['NORTH', 'NORTH_EAST'],
    'Leo': ['EAST', 'SOUTH_EAST'],
    'Virgo': ['SOUTH', 'WEST'],
    'Libra': ['WEST', 'NORTH'],
    'Scorpio': ['NORTH', 'EAST'],
    'Sagittarius': ['EAST', 'SOUTH'],
    'Capricorn': ['SOUTH', 'WEST'],
    'Aquarius': ['WEST', 'NORTH'],
    'Pisces': ['NORTH', 'EAST'],
  };
  
  const favorableDirections = directionCompatibility[moonSign] || ['NORTH_EAST'];
  const entranceMatch = favorableDirections.includes(propertyDetails.entranceDirection);
  
  compatibility.factors.push({
    name: 'Entrance Direction',
    score: entranceMatch ? 100 : 50,
    description: entranceMatch 
      ? `Entrance direction ${propertyDetails.entranceDirection} is favorable for your moon sign ${moonSign}`
      : `Your favorable directions are ${favorableDirections.join(', ')}. Property entrance is ${propertyDetails.entranceDirection}`,
  });
  
  // Numerology compatibility
  const lifePathNumber = calculateLifePathNumber(buyerDetails.dateOfBirth);
  const addressNumber = propertyDetails.address 
    ? propertyDetails.address.split('').filter((c: string) => /\d/.test(c)).reduce((a: number, b: string) => a + parseInt(b), 0) % 9 || 9
    : 1;
  
  const numerologyCompatible = {
    1: [1, 2, 3, 9],
    2: [1, 2, 6],
    3: [1, 3, 6, 9],
    4: [1, 4, 6, 7],
    5: [1, 5, 6, 9],
    6: [2, 3, 4, 5, 6, 9],
    7: [4, 7],
    8: [1, 4, 8],
    9: [1, 3, 5, 6, 9],
  };
  
  const numMatch = (numerologyCompatible[lifePathNumber as keyof typeof numerologyCompatible] || []).includes(addressNumber);
  
  compatibility.factors.push({
    name: 'Numerology',
    score: numMatch ? 90 : 60,
    description: `Your life path number is ${lifePathNumber}. Property number reduces to ${addressNumber}. ${numMatch ? 'Good match!' : 'Neutral compatibility.'}`,
  });
  
  // Vastu score factor
  if (propertyDetails.vastuScore) {
    compatibility.factors.push({
      name: 'Vastu Score',
      score: propertyDetails.vastuScore,
      description: `Property Vastu score: ${propertyDetails.vastuScore}/100`,
    });
  }
  
  // Calculate overall score
  compatibility.overall = Math.round(
    compatibility.factors.reduce((sum: number, f: any) => sum + f.score, 0) / compatibility.factors.length
  );
  
  return compatibility;
}

// ============================================================================
// ROUTES
// ============================================================================

// Generate birth chart (Kundali)
router.post('/birth-chart', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const validated = birthDetailsSchema.parse(req.body);
  const userId = (req as any).user.id;
  
  const dob = new Date(validated.dateOfBirth);
  
  // Calculate astrological details
  const moonSign = calculateMoonSign(dob, validated.timeOfBirth);
  const nakshatra = calculateNakshatra(dob);
  const lifePathNumber = calculateLifePathNumber(validated.dateOfBirth);
  
  // Determine favorable directions based on moon sign
  const directionRecommendations: Record<string, any> = {
    'Aries': { best: ['EAST'], good: ['NORTH', 'NORTH_EAST'], avoid: ['WEST', 'SOUTH_WEST'] },
    'Taurus': { best: ['SOUTH'], good: ['SOUTH_WEST', 'SOUTH_EAST'], avoid: ['NORTH', 'NORTH_WEST'] },
    'Gemini': { best: ['WEST'], good: ['NORTH_WEST', 'NORTH'], avoid: ['SOUTH', 'SOUTH_EAST'] },
    'Cancer': { best: ['NORTH'], good: ['NORTH_EAST', 'EAST'], avoid: ['SOUTH', 'SOUTH_WEST'] },
    'Leo': { best: ['EAST'], good: ['SOUTH_EAST', 'SOUTH'], avoid: ['WEST', 'NORTH_WEST'] },
    'Virgo': { best: ['SOUTH'], good: ['WEST', 'SOUTH_WEST'], avoid: ['NORTH', 'NORTH_EAST'] },
    'Libra': { best: ['WEST'], good: ['NORTH', 'NORTH_WEST'], avoid: ['EAST', 'SOUTH_EAST'] },
    'Scorpio': { best: ['NORTH'], good: ['EAST', 'NORTH_EAST'], avoid: ['SOUTH', 'SOUTH_WEST'] },
    'Sagittarius': { best: ['EAST'], good: ['SOUTH', 'SOUTH_EAST'], avoid: ['WEST', 'NORTH_WEST'] },
    'Capricorn': { best: ['SOUTH'], good: ['WEST', 'SOUTH_WEST'], avoid: ['NORTH', 'NORTH_EAST'] },
    'Aquarius': { best: ['WEST'], good: ['NORTH', 'NORTH_WEST'], avoid: ['EAST', 'SOUTH_EAST'] },
    'Pisces': { best: ['NORTH'], good: ['EAST', 'NORTH_EAST'], avoid: ['SOUTH', 'SOUTH_WEST'] },
  };
  
  const directions = directionRecommendations[moonSign];
  
  // Store birth details for user if not already stored
  await prisma.user.update({
    where: { id: userId },
    data: {
      dateOfBirth: dob,
      birthTime: validated.timeOfBirth,
      birthPlace: validated.placeOfBirth.city,
      lifePathNumber,
    },
  });
  
  const birthChart = {
    birthDetails: validated,
    moonSign,
    nakshatra: nakshatra.name,
    nakshatraDetails: nakshatra,
    lifePathNumber,
    favorableDirections: directions,
    propertyRecommendations: {
      idealEntrances: directions.best,
      goodEntrances: directions.good,
      avoidEntrances: directions.avoid,
      bestPropertyTypes: moonSign === 'Cancer' ? ['HOUSE', 'VILLA'] : ['CONDO', 'APARTMENT'],
      elementBalance: nakshatra.element,
    },
    generalGuidance: `As a ${moonSign} moon sign born in ${nakshatra.name} nakshatra, properties with entrances facing ${directions.best.join(' or ')} will be most beneficial for you. Your life path number ${lifePathNumber} suggests affinity with properties whose address numbers reduce to compatible numbers.`,
  };
  
  res.json({
    success: true,
    data: { birthChart },
  });
}));

// Get auspicious dates for property activities
router.post('/auspicious-dates', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const validated = auspiciousDatesSchema.parse(req.body);
  
  const startDate = new Date(validated.startDate);
  const endDate = new Date(validated.endDate);
  const eventType = validated.eventType;
  
  const requirements = MUHURAT_REQUIREMENTS[eventType] || MUHURAT_REQUIREMENTS['PROPERTY_VIEWING'];
  
  const auspiciousDates: any[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const nakshatra = calculateNakshatra(currentDate);
    const tithi = calculateTithi(currentDate);
    const yoga = calculateYoga(currentDate);
    const rahuKaal = calculateRahuKaal(currentDate);
    
    // Check if day is suitable
    const isWeekdayGood = !requirements.avoidWeekdays?.includes(dayOfWeek);
    const isNakshatraGood = requirements.preferredNakshatras?.includes(nakshatra.name) || !requirements.avoidNakshatras?.includes(nakshatra.name);
    const isTithiGood = requirements.preferredTithis?.includes(tithi.name) || !requirements.avoidTithis?.includes(tithi.name);
    const isYogaGood = yoga.nature !== 'Very Inauspicious' && yoga.nature !== 'Inauspicious';
    
    // Calculate overall auspiciousness score
    let score = 50; // Base score
    if (requirements.preferredWeekdays?.includes(dayOfWeek)) score += 10;
    if (requirements.avoidWeekdays?.includes(dayOfWeek)) score -= 30;
    if (requirements.preferredNakshatras?.includes(nakshatra.name)) score += 20;
    if (requirements.avoidNakshatras?.includes(nakshatra.name)) score -= 25;
    if (requirements.preferredTithis?.includes(tithi.name)) score += 15;
    if (requirements.avoidTithis?.includes(tithi.name)) score -= 20;
    if (yoga.nature === 'Very Auspicious') score += 15;
    if (yoga.nature === 'Auspicious') score += 10;
    if (yoga.nature === 'Inauspicious') score -= 15;
    if (yoga.nature === 'Very Inauspicious') score -= 25;
    
    score = Math.max(0, Math.min(100, score));
    
    if (isWeekdayGood && isNakshatraGood && isTithiGood && isYogaGood && score >= 50) {
      // Generate auspicious windows (avoiding Rahu Kaal)
      const windows = [];
      const morningStart = '06:00';
      const morningEnd = rahuKaal.start;
      const afternoonStart = rahuKaal.end;
      const eveningEnd = '18:00';
      
      if (morningStart < morningEnd) {
        windows.push({ start: morningStart, end: morningEnd, quality: 'Good' });
      }
      if (afternoonStart < eveningEnd) {
        windows.push({ start: afternoonStart, end: eveningEnd, quality: 'Excellent' });
      }
      
      auspiciousDates.push({
        date: currentDate.toISOString().split('T')[0],
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
        score,
        quality: score >= 80 ? 'Excellent' : score >= 65 ? 'Good' : 'Fair',
        nakshatra: nakshatra.name,
        tithi: tithi.name,
        yoga: yoga.name,
        rahuKaal,
        windows,
        reasons: [
          `${nakshatra.name} nakshatra is ${requirements.preferredNakshatras?.includes(nakshatra.name) ? 'highly favorable' : 'acceptable'} for ${eventType.toLowerCase().replace(/_/g, ' ')}`,
          `${tithi.name} tithi has ${tithi.nature} nature`,
          `${yoga.name} yoga is ${yoga.nature.toLowerCase()}`,
        ],
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Sort by score
  auspiciousDates.sort((a, b) => b.score - a.score);
  
  // Get event-specific guidance
  const eventGuidance: Record<string, string> = {
    PROPERTY_VIEWING: 'For property viewings, mornings are generally more auspicious. Avoid viewing during Rahu Kaal as perceptions may be clouded.',
    MAKING_OFFER: 'Making offers during auspicious times increases the likelihood of acceptance. Thursday and Friday are particularly favorable for negotiations.',
    SIGNING_CONTRACT: 'Contract signing should be done during stable nakshatras like Rohini or Uttara Phalguni. Avoid eclipses and Amavasya.',
    CLOSING: 'Closing on fixed nakshatras ensures permanence and stability in the transaction. Pushya nakshatra is considered most auspicious.',
    GRIHA_PRAVESH: 'Griha Pravesh (house warming) should be performed during Shubh Muhurat. The ceremony should begin during Brahma Muhurat or shortly after sunrise.',
    RENOVATION_START: 'Begin renovations during Rohini, Mrigashira, or Uttara Phalguni nakshatra. Avoid starting during inauspicious tithis.',
    BHOOMI_PUJA: 'Bhoomi Puja for new construction should be performed on Pushya, Rohini, or Uttara Bhadrapada nakshatra.',
    MOVING_IN: 'Moving should be completed during daytime hours on auspicious days. Bring water and rice into the new home first.',
  };
  
  res.json({
    success: true,
    data: {
      eventType,
      dateRange: { start: validated.startDate, end: validated.endDate },
      auspiciousDates: auspiciousDates.slice(0, 10), // Top 10
      totalFound: auspiciousDates.length,
      guidance: eventGuidance[eventType],
      generalTips: [
        'Avoid Rahu Kaal for important activities',
        'Prefer Shukla Paksha (waxing moon) over Krishna Paksha',
        'Check for any eclipses during the period',
        'Consider your personal birth chart for additional refinement',
      ],
    },
  });
}));

// Calculate Muhurat for specific date
router.post('/muhurat', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const validated = muhuratSchema.parse(req.body);
  const date = new Date(validated.date);
  
  const nakshatra = calculateNakshatra(date);
  const tithi = calculateTithi(date);
  const yoga = calculateYoga(date);
  const rahuKaal = calculateRahuKaal(date);
  const dayOfWeek = date.getDay();
  
  const requirements = MUHURAT_REQUIREMENTS[validated.eventType] || MUHURAT_REQUIREMENTS['PROPERTY_VIEWING'];
  
  // Calculate detailed muhurat windows
  const muhuratWindows = [];
  
  // Brahma Muhurat (1.5 hours before sunrise, ~4:30-6:00 AM)
  muhuratWindows.push({
    name: 'Brahma Muhurat',
    start: '04:30',
    end: '06:00',
    quality: 'Most Auspicious',
    description: 'Best time for spiritual activities and important beginnings',
  });
  
  // Abhijit Muhurat (around noon, 48 minutes)
  muhuratWindows.push({
    name: 'Abhijit Muhurat',
    start: '11:45',
    end: '12:33',
    quality: 'Highly Auspicious',
    description: 'Overcomes all doshas, universally auspicious',
  });
  
  // Exclude Rahu Kaal
  const goodPeriods = [];
  const dayStart = 6;
  const dayEnd = 18;
  const rahuStart = parseInt(rahuKaal.start.split(':')[0]);
  const rahuEnd = parseInt(rahuKaal.end.split(':')[0]);
  
  if (dayStart < rahuStart) {
    goodPeriods.push({
      start: `0${dayStart}:00`,
      end: rahuKaal.start,
      quality: 'Good',
    });
  }
  if (rahuEnd < dayEnd) {
    goodPeriods.push({
      start: rahuKaal.end,
      end: `${dayEnd}:00`,
      quality: 'Good',
    });
  }
  
  // Calculate overall suitability
  let overallScore = 50;
  const issues: string[] = [];
  const positives: string[] = [];
  
  if (requirements.preferredWeekdays?.includes(dayOfWeek)) {
    overallScore += 10;
    positives.push(`${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]} is favorable`);
  }
  if (requirements.avoidWeekdays?.includes(dayOfWeek)) {
    overallScore -= 20;
    issues.push(`${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]} is not recommended`);
  }
  
  if (requirements.preferredNakshatras?.includes(nakshatra.name)) {
    overallScore += 20;
    positives.push(`${nakshatra.name} nakshatra is highly favorable`);
  }
  if (requirements.avoidNakshatras?.includes(nakshatra.name)) {
    overallScore -= 25;
    issues.push(`${nakshatra.name} nakshatra should be avoided`);
  }
  
  if (requirements.preferredTithis?.includes(tithi.name)) {
    overallScore += 15;
    positives.push(`${tithi.name} tithi is auspicious`);
  }
  if (requirements.avoidTithis?.includes(tithi.name)) {
    overallScore -= 20;
    issues.push(`${tithi.name} tithi is inauspicious`);
  }
  
  if (yoga.nature.includes('Auspicious')) {
    overallScore += yoga.nature === 'Very Auspicious' ? 15 : 10;
    positives.push(`${yoga.name} yoga is ${yoga.nature.toLowerCase()}`);
  }
  if (yoga.nature.includes('Inauspicious')) {
    overallScore -= yoga.nature === 'Very Inauspicious' ? 20 : 10;
    issues.push(`${yoga.name} yoga is ${yoga.nature.toLowerCase()}`);
  }
  
  overallScore = Math.max(0, Math.min(100, overallScore));
  
  const verdict = overallScore >= 75 ? 'Highly Recommended' : overallScore >= 60 ? 'Favorable' : overallScore >= 45 ? 'Neutral' : 'Not Recommended';
  
  res.json({
    success: true,
    data: {
      date: validated.date,
      eventType: validated.eventType,
      panchang: {
        nakshatra: { name: nakshatra.name, deity: nakshatra.deity, nature: nakshatra.nature },
        tithi: { name: tithi.name, paksha: tithi.paksha, nature: tithi.nature },
        yoga: { name: yoga.name, nature: yoga.nature },
        karana: 'Bava', // Simplified
        vara: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
      },
      rahuKaal,
      specialMuhurats: muhuratWindows,
      auspiciousWindows: goodPeriods,
      analysis: {
        overallScore,
        verdict,
        positives,
        issues,
      },
      recommendation: overallScore >= 60 
        ? `This date is ${verdict.toLowerCase()} for ${validated.eventType.toLowerCase().replace(/_/g, ' ')}. Best times are ${goodPeriods.map(p => `${p.start}-${p.end}`).join(' or ')}.`
        : `Consider choosing a different date for ${validated.eventType.toLowerCase().replace(/_/g, ' ')}. Check our auspicious dates API for better alternatives.`,
    },
  });
}));

// Property-buyer compatibility analysis
router.post('/property-match', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const validated = propertyMatchSchema.parse(req.body);
  
  // Get property details
  const property = await prisma.property.findUnique({
    where: { id: validated.propertyId },
    include: {
      vastuAnalysis: true,
    },
  });
  
  if (!property) {
    throw new NotFoundError('Property not found');
  }
  
  const propertyDetails = {
    address: property.address,
    entranceDirection: property.vastuAnalysis?.entranceDirection || 'NORTH_EAST',
    vastuScore: property.vastuAnalysis?.overallScore || 70,
    yearBuilt: property.yearBuilt,
    constructionDate: property.constructionDate,
  };
  
  const compatibility = calculatePropertyCompatibility(validated.buyerBirthDetails, propertyDetails);
  
  // Add construction date compatibility if available
  if (property.constructionDate) {
    const constructionNakshatra = calculateNakshatra(new Date(property.constructionDate));
    const buyerNakshatra = calculateNakshatra(new Date(validated.buyerBirthDetails.dateOfBirth));
    
    // Check nakshatra compatibility (simplified)
    const nakshatraMatch = constructionNakshatra.element === buyerNakshatra.element;
    
    compatibility.factors.push({
      name: 'Construction Nakshatra',
      score: nakshatraMatch ? 85 : 65,
      description: `Property was constructed during ${constructionNakshatra.name} nakshatra. ${nakshatraMatch ? 'Compatible with your birth nakshatra!' : 'Neutral compatibility.'}`,
    });
    
    // Recalculate overall
    compatibility.overall = Math.round(
      compatibility.factors.reduce((sum: number, f: any) => sum + f.score, 0) / compatibility.factors.length
    );
  }
  
  // Generate recommendation
  const recommendation = compatibility.overall >= 80 
    ? 'Excellent Match! This property aligns well with your astrological profile.'
    : compatibility.overall >= 65 
    ? 'Good Match. This property is compatible with minor considerations.'
    : compatibility.overall >= 50 
    ? 'Moderate Match. Consider the suggested remedies to enhance harmony.'
    : 'Consider Other Options. Look for properties with more favorable alignments.';
  
  res.json({
    success: true,
    data: {
      propertyId: validated.propertyId,
      propertyTitle: property.title,
      buyerMoonSign: calculateMoonSign(new Date(validated.buyerBirthDetails.dateOfBirth)),
      buyerNakshatra: calculateNakshatra(new Date(validated.buyerBirthDetails.dateOfBirth)).name,
      compatibility,
      recommendation,
      remedies: compatibility.overall < 70 ? [
        'Place a Vastu pyramid near the entrance',
        'Keep a copper pot filled with water in the North-East',
        'Light a diya (lamp) during evening hours',
        'Chant Vastu Shanti mantras before moving in',
      ] : [],
    },
  });
}));

export default router;
