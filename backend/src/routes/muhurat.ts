import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Hindu/Vedic calendar data for Muhurat calculations
const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const AUSPICIOUS_NAKSHATRAS_PROPERTY = [
    'Rohini', 'Mrigashira', 'Pushya', 'Uttara Phalguni', 'Hasta', 'Chitra',
    'Swati', 'Anuradha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Uttara Bhadrapada', 'Revati'
];

const TITHIS = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
];

const AUSPICIOUS_TITHIS = [
    'Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi'
];

const WEEKDAY_LORDS = {
    0: { name: 'Sunday', lord: 'Sun', auspiciousFor: ['Government work', 'Leadership roles'] },
    1: { name: 'Monday', lord: 'Moon', auspiciousFor: ['Home purchase', 'Water features', 'Family'] },
    2: { name: 'Tuesday', lord: 'Mars', auspiciousFor: ['Construction', 'Renovations'] },
    3: { name: 'Wednesday', lord: 'Mercury', auspiciousFor: ['Signing contracts', 'Communication'] },
    4: { name: 'Thursday', lord: 'Jupiter', auspiciousFor: ['Major purchases', 'Investments', 'Expansion'] },
    5: { name: 'Friday', lord: 'Venus', auspiciousFor: ['Luxury homes', 'Aesthetics', 'Moving in'] },
    6: { name: 'Saturday', lord: 'Saturn', auspiciousFor: ['Long-term investments', 'Land deals'] }
};

// ============================================
// FIND AUSPICIOUS DATES
// ============================================
router.post('/find-dates', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            purpose: z.enum(['purchase', 'sale', 'moving', 'construction', 'renovation', 'griha_pravesh']),
            startDate: z.string(),
            endDate: z.string(),
            buyerBirthNakshatra: z.string().optional()
        }).parse(req.body);

        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        const auspiciousDates: any[] = [];

        // Generate dates and analyze each
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateInfo = analyzeDateMuhurat(new Date(d), data.purpose, data.buyerBirthNakshatra);
            if (dateInfo.overallScore >= 70) {
                auspiciousDates.push(dateInfo);
            }
        }

        // Sort by score
        auspiciousDates.sort((a, b) => b.overallScore - a.overallScore);

        res.json({
            purpose: data.purpose,
            dateRange: { start: data.startDate, end: data.endDate },
            auspiciousDates: auspiciousDates.slice(0, 10), // Top 10
            totalFound: auspiciousDates.length,
            specialNotes: getSpecialNotes(data.purpose)
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Muhurat error:', error);
        res.status(500).json({ error: 'Failed to find auspicious dates' });
    }
});

function analyzeDateMuhurat(date: Date, purpose: string, birthNakshatra?: string): any {
    const dayOfWeek = date.getDay();
    const weekdayInfo = WEEKDAY_LORDS[dayOfWeek as keyof typeof WEEKDAY_LORDS];

    // Simplified nakshatra calculation (in production, use proper panchang API)
    const dayOfYear = getDayOfYear(date);
    const nakshatraIndex = (dayOfYear + date.getFullYear()) % 27;
    const nakshatra = NAKSHATRAS[nakshatraIndex];

    // Tithi calculation (simplified)
    const tithiIndex = (dayOfYear + date.getMonth()) % 15;
    const tithi = TITHIS[tithiIndex];

    // Score calculation
    let score = 50;
    const factors: string[] = [];

    // Nakshatra score
    if (AUSPICIOUS_NAKSHATRAS_PROPERTY.includes(nakshatra)) {
        score += 20;
        factors.push(`Auspicious Nakshatra: ${nakshatra}`);
    } else {
        factors.push(`Nakshatra: ${nakshatra}`);
    }

    // Tithi score
    if (AUSPICIOUS_TITHIS.includes(tithi)) {
        score += 15;
        factors.push(`Favorable Tithi: ${tithi}`);
    }

    // Weekday score based on purpose
    const purposeWeekdayMap: Record<string, number[]> = {
        'purchase': [1, 3, 4, 5], // Monday, Wednesday, Thursday, Friday
        'sale': [3, 4, 5], // Wednesday, Thursday, Friday
        'moving': [1, 4, 5], // Monday, Thursday, Friday
        'construction': [2, 4], // Tuesday, Thursday
        'renovation': [2, 4, 6], // Tuesday, Thursday, Saturday
        'griha_pravesh': [1, 4, 5] // Monday, Thursday, Friday
    };

    if (purposeWeekdayMap[purpose]?.includes(dayOfWeek)) {
        score += 15;
        factors.push(`Favorable day: ${weekdayInfo.name} ruled by ${weekdayInfo.lord}`);
    }

    // Birth nakshatra compatibility (if provided)
    if (birthNakshatra && nakshatra === birthNakshatra) {
        score += 10;
        factors.push('Your birth nakshatra is active!');
    }

    // Avoid certain combinations
    const avoidDates = getAvoidDates(date);
    if (avoidDates.length > 0) {
        score -= 20;
        factors.push(...avoidDates.map(a => `⚠️ ${a}`));
    }

    return {
        date: date.toISOString().split('T')[0],
        dayOfWeek: weekdayInfo.name,
        nakshatra,
        tithi,
        overallScore: Math.min(100, Math.max(0, score)),
        factors,
        auspiciousHours: getAuspiciousHours(date, purpose)
    };
}

function getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getAvoidDates(date: Date): string[] {
    const avoid: string[] = [];

    // Amavasya (New Moon) - simplified check
    const moonPhase = getDayOfYear(date) % 30;
    if (moonPhase === 0 || moonPhase === 14) {
        avoid.push('Avoid: New Moon/Full Moon day');
    }

    // Rahu Kaal varies by day - simplified
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 2) { // Tuesday
        avoid.push('Consider avoiding: Mars-ruled day for new beginnings');
    }

    return avoid;
}

function getAuspiciousHours(date: Date, purpose: string): any[] {
    // Brahma Muhurat and other auspicious times
    const hours = [
        {
            name: 'Brahma Muhurat',
            start: '04:24',
            end: '05:12',
            bestFor: 'Spiritual activities, planning'
        },
        {
            name: 'Abhijit Muhurat',
            start: '11:42',
            end: '12:26',
            bestFor: 'Important decisions, signing documents'
        }
    ];

    if (purpose === 'griha_pravesh') {
        hours.push({
            name: 'Morning Entry',
            start: '06:00',
            end: '10:00',
            bestFor: 'Griha Pravesh ceremony'
        });
    }

    return hours;
}

function getSpecialNotes(purpose: string): string[] {
    const notes: Record<string, string[]> = {
        'purchase': [
            'Thursday (Guru Var) is considered most auspicious for major purchases',
            'Avoid signing during Mercury retrograde periods',
            'Pushya Nakshatra is highly auspicious for property investments'
        ],
        'griha_pravesh': [
            'Enter facing East for maximum positive energy',
            'Perform Vastu puja before entering',
            'Boil milk until it overflows as first activity in new home',
            'Avoid Griha Pravesh during Pitru Paksha or Shradh period'
        ],
        'construction': [
            'Start digging on an auspicious day',
            'Perform Bhoomi Puja before breaking ground',
            'Avoid starting construction during monsoon months'
        ],
        'sale': [
            'Mercury-ruled Wednesday is favorable for transactions',
            'Complete paperwork during waxing moon phase',
            'Avoid selling during Shradh period'
        ],
        'moving': [
            'Move during morning hours if possible',
            'Enter new home with right foot first',
            'Bring milk, rice, and water as first items'
        ],
        'renovation': [
            'Start renovations on Tuesday (Mars = construction energy)',
            'Avoid structural changes during Rahu Kaal',
            'Complete before monsoon season'
        ]
    };

    return notes[purpose] || [];
}

// ============================================
// CHECK SPECIFIC DATE
// ============================================
router.post('/check-date', async (req: Request, res: Response) => {
    try {
        const { date, purpose } = z.object({
            date: z.string(),
            purpose: z.enum(['purchase', 'sale', 'moving', 'construction', 'renovation', 'griha_pravesh'])
        }).parse(req.body);

        const dateInfo = analyzeDateMuhurat(new Date(date), purpose);

        res.json({
            date,
            purpose,
            ...dateInfo,
            verdict: dateInfo.overallScore >= 80 ? 'Highly Auspicious' :
                dateInfo.overallScore >= 60 ? 'Moderately Auspicious' :
                    dateInfo.overallScore >= 40 ? 'Neutral' : 'Not Recommended'
        });
    } catch (error) {
        console.error('Check date error:', error);
        res.status(500).json({ error: 'Failed to check date' });
    }
});

// ============================================
// GET NAKSHATRA INFO
// ============================================
router.get('/nakshatras', (req: Request, res: Response) => {
    res.json({
        allNakshatras: NAKSHATRAS,
        auspiciousForProperty: AUSPICIOUS_NAKSHATRAS_PROPERTY,
        totalCount: NAKSHATRAS.length
    });
});

export default router;
