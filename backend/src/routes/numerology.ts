import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// NUMEROLOGY CALCULATOR
// ============================================
router.post('/address-number', async (req: Request, res: Response) => {
    try {
        const { address } = z.object({ address: z.string() }).parse(req.body);

        // Extract numbers from address
        const numbers = address.replace(/\D/g, '');

        // Calculate numerology number (reduce to single digit)
        let sum = numbers.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
            sum = sum.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
        }

        const meanings: Record<number, any> = {
            1: {
                meaning: 'Leadership & Independence',
                vibe: 'Ambitious, pioneering energy',
                bestFor: ['Entrepreneurs', 'Leaders', 'Single professionals'],
                avoid: ['Those seeking harmony', 'Partnerships'],
                element: 'Fire',
                planet: 'Sun'
            },
            2: {
                meaning: 'Partnership & Balance',
                vibe: 'Peaceful, harmonious energy',
                bestFor: ['Couples', 'Partnerships', 'Mediators'],
                avoid: ['Those needing independence'],
                element: 'Water',
                planet: 'Moon'
            },
            3: {
                meaning: 'Creativity & Expression',
                vibe: 'Joyful, artistic energy',
                bestFor: ['Artists', 'Writers', 'Social hosts'],
                avoid: ['Those seeking solitude'],
                element: 'Fire',
                planet: 'Jupiter'
            },
            4: {
                meaning: 'Stability & Security',
                vibe: 'Grounded, practical energy',
                bestFor: ['Families', 'Hard workers', 'Builders'],
                avoid: ['Those seeking excitement'],
                element: 'Earth',
                planet: 'Uranus'
            },
            5: {
                meaning: 'Freedom & Change',
                vibe: 'Dynamic, adventurous energy',
                bestFor: ['Travelers', 'Salespeople', 'Social butterflies'],
                avoid: ['Those seeking routine'],
                element: 'Air',
                planet: 'Mercury'
            },
            6: {
                meaning: 'Love & Family',
                vibe: 'Nurturing, warm energy',
                bestFor: ['Families', 'Caregivers', 'Beauticians'],
                avoid: ['Those avoiding responsibility'],
                element: 'Earth',
                planet: 'Venus'
            },
            7: {
                meaning: 'Wisdom & Spirituality',
                vibe: 'Contemplative, mystical energy',
                bestFor: ['Scholars', 'Spiritual seekers', 'Researchers'],
                avoid: ['Those needing social activity'],
                element: 'Water',
                planet: 'Neptune'
            },
            8: {
                meaning: 'Abundance & Power',
                vibe: 'Prosperous, authoritative energy',
                bestFor: ['Business owners', 'Executives', 'Investors'],
                avoid: ['Those avoiding material success'],
                element: 'Earth',
                planet: 'Saturn'
            },
            9: {
                meaning: 'Completion & Humanitarianism',
                vibe: 'Compassionate, global energy',
                bestFor: ['Humanitarians', 'Artists', 'Healers'],
                avoid: ['Those focused on self'],
                element: 'Fire',
                planet: 'Mars'
            },
            11: {
                meaning: 'Master Number - Inspiration',
                vibe: 'Highly intuitive, visionary energy',
                bestFor: ['Spiritual leaders', 'Innovators', 'Healers'],
                avoid: ['Those seeking ordinary life'],
                element: 'Air',
                planet: 'Uranus'
            },
            22: {
                meaning: 'Master Number - Master Builder',
                vibe: 'Powerful manifesting energy',
                bestFor: ['Visionaries', 'Large-scale builders', 'Leaders'],
                avoid: ['Those avoiding responsibility'],
                element: 'Earth',
                planet: 'Pluto'
            },
            33: {
                meaning: 'Master Number - Master Teacher',
                vibe: 'Highest spiritual vibration',
                bestFor: ['Spiritual teachers', 'Healers', 'Guides'],
                avoid: ['Those on material path'],
                element: 'Water',
                planet: 'Neptune'
            }
        };

        res.json({
            address,
            addressNumber: sum,
            isMasterNumber: [11, 22, 33].includes(sum),
            ...meanings[sum] || meanings[9],
            compatibility: await calculateCompatibility(sum)
        });
    } catch (error) {
        console.error('Numerology error:', error);
        res.status(500).json({ error: 'Numerology calculation failed' });
    }
});

async function calculateCompatibility(addressNum: number) {
    // Return compatible life path numbers
    const compatibilityMap: Record<number, number[]> = {
        1: [1, 3, 5],
        2: [2, 4, 8],
        3: [1, 3, 5, 6, 9],
        4: [2, 4, 8],
        5: [1, 3, 5, 7],
        6: [2, 3, 6, 9],
        7: [5, 7],
        8: [2, 4, 8],
        9: [3, 6, 9],
        11: [2, 11, 22],
        22: [4, 11, 22],
        33: [6, 22, 33]
    };

    return {
        compatibleLifePathNumbers: compatibilityMap[addressNum] || [1, 9],
        bestBuyDates: [addressNum, addressNum + 9, addressNum + 18].map(d => d % 31 || 1)
    };
}

// ============================================
// LIFE PATH CALCULATOR
// ============================================
router.post('/life-path', async (req: Request, res: Response) => {
    try {
        const { birthDate } = z.object({ birthDate: z.string() }).parse(req.body);

        const date = new Date(birthDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // Calculate life path number
        const digits = `${day}${month}${year}`.split('').map(Number);
        let sum = digits.reduce((a, b) => a + b, 0);

        while (sum > 9 && ![11, 22, 33].includes(sum)) {
            sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
        }

        res.json({
            birthDate,
            lifePathNumber: sum,
            isMasterNumber: [11, 22, 33].includes(sum),
            rulingPlanet: getRulingPlanet(sum),
            luckyColors: getLuckyColors(sum),
            luckyDays: getLuckyDays(sum),
            bestPropertyDirections: getBestDirections(sum)
        });
    } catch (error) {
        console.error('Life path error:', error);
        res.status(500).json({ error: 'Life path calculation failed' });
    }
});

function getRulingPlanet(num: number): string {
    const planets: Record<number, string> = {
        1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Uranus',
        5: 'Mercury', 6: 'Venus', 7: 'Neptune', 8: 'Saturn', 9: 'Mars',
        11: 'Uranus', 22: 'Pluto', 33: 'Neptune'
    };
    return planets[num] || 'Unknown';
}

function getLuckyColors(num: number): string[] {
    const colors: Record<number, string[]> = {
        1: ['Gold', 'Orange', 'Yellow'],
        2: ['White', 'Cream', 'Silver'],
        3: ['Purple', 'Violet', 'Mauve'],
        4: ['Blue', 'Grey', 'Khaki'],
        5: ['Light Grey', 'White', 'Shimmering colors'],
        6: ['Blue', 'Pink', 'Rose'],
        7: ['Green', 'Yellow', 'White'],
        8: ['Dark Blue', 'Black', 'Purple'],
        9: ['Red', 'Crimson', 'Pink'],
        11: ['Silver', 'Violet'],
        22: ['Emerald', 'Coral'],
        33: ['Turquoise', 'Pink']
    };
    return colors[num] || ['White'];
}

function getLuckyDays(num: number): string[] {
    const days: Record<number, string[]> = {
        1: ['Sunday', 'Monday'],
        2: ['Monday', 'Friday'],
        3: ['Thursday', 'Friday'],
        4: ['Saturday', 'Sunday'],
        5: ['Wednesday', 'Friday'],
        6: ['Friday', 'Monday'],
        7: ['Monday', 'Sunday'],
        8: ['Saturday', 'Thursday'],
        9: ['Tuesday', 'Thursday'],
        11: ['Monday', 'Wednesday'],
        22: ['Saturday', 'Thursday'],
        33: ['Friday', 'Sunday']
    };
    return days[num] || ['Sunday'];
}

function getBestDirections(num: number): string[] {
    const directions: Record<number, string[]> = {
        1: ['East', 'Northeast'],
        2: ['Northwest', 'North'],
        3: ['Northeast', 'East'],
        4: ['Southwest', 'South'],
        5: ['North', 'West'],
        6: ['Southeast', 'East'],
        7: ['Northwest', 'West'],
        8: ['South', 'Southwest'],
        9: ['South', 'East'],
        11: ['East', 'North'],
        22: ['North', 'Northeast'],
        33: ['East', 'Southeast']
    };
    return directions[num] || ['North'];
}

// ============================================
// PROPERTY-USER COMPATIBILITY
// ============================================
router.post('/compatibility', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { propertyId, birthDate } = z.object({
            propertyId: z.string().uuid(),
            birthDate: z.string()
        }).parse(req.body);

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Calculate address number
        const addressNums = property.street.replace(/\D/g, '');
        let addressSum = addressNums.split('').reduce((a, d) => a + parseInt(d), 0);
        while (addressSum > 9 && ![11, 22, 33].includes(addressSum)) {
            addressSum = addressSum.toString().split('').reduce((a, d) => a + parseInt(d), 0);
        }

        // Calculate life path
        const date = new Date(birthDate);
        const digits = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`.split('').map(Number);
        let lifePathSum = digits.reduce((a, b) => a + b, 0);
        while (lifePathSum > 9 && ![11, 22, 33].includes(lifePathSum)) {
            lifePathSum = lifePathSum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
        }

        // Calculate compatibility score
        const compatibilityMatrix: Record<string, number> = {
            '1-1': 85, '1-3': 95, '1-5': 90, '1-9': 80,
            '2-2': 85, '2-4': 90, '2-6': 95, '2-8': 80,
            '3-3': 80, '3-6': 90, '3-9': 95,
            '4-4': 85, '4-8': 90, '4-22': 95,
            '5-5': 75, '5-7': 85, '5-9': 80,
            '6-6': 85, '6-9': 90, '6-33': 95,
            '7-7': 80, '7-11': 90,
            '8-8': 85, '8-22': 95,
            '9-9': 80,
            '11-11': 90, '11-22': 95,
            '22-22': 90, '22-33': 95,
            '33-33': 95
        };

        const key1 = `${Math.min(addressSum, lifePathSum)}-${Math.max(addressSum, lifePathSum)}`;
        const key2 = `${lifePathSum}-${addressSum}`;
        const baseScore = compatibilityMatrix[key1] || compatibilityMatrix[key2] || 70;

        // Adjust for matching numbers
        const finalScore = addressSum === lifePathSum ? 100 : baseScore;

        res.json({
            propertyAddress: property.street,
            addressNumber: addressSum,
            lifePathNumber: lifePathSum,
            compatibilityScore: finalScore,
            grade: getGrade(finalScore),
            interpretation: getInterpretation(finalScore, addressSum, lifePathSum),
            recommendations: getRecommendations(addressSum, lifePathSum)
        });
    } catch (error) {
        console.error('Compatibility error:', error);
        res.status(500).json({ error: 'Compatibility check failed' });
    }
});

function getGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
}

function getInterpretation(score: number, address: number, lifePath: number): string {
    if (score >= 90) {
        return `Excellent match! Your life path ${lifePath} harmonizes beautifully with this ${address} address.`;
    }
    if (score >= 80) {
        return `Good compatibility. This property supports your life path energy.`;
    }
    if (score >= 70) {
        return `Moderate compatibility. Consider remedies to enhance the energy.`;
    }
    return `Challenging match. Consult a numerologist for personalized guidance.`;
}

function getRecommendations(address: number, lifePath: number): string[] {
    const recs = [
        `Place ${address} items of significance in your entrance`,
        `Use colors associated with number ${lifePath} in your decor`,
        `Schedule important activities on dates that reduce to ${lifePath}`
    ];

    if (address !== lifePath) {
        recs.push(`Add symbols of number ${lifePath} to balance the energy`);
    }

    return recs;
}

export default router;

