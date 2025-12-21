import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// AQI categories per EPA
const AQI_CATEGORIES = {
    good: { min: 0, max: 50, color: '#00e400', description: 'Air quality is satisfactory' },
    moderate: { min: 51, max: 100, color: '#ffff00', description: 'Acceptable; may be concern for sensitive groups' },
    unhealthySensitive: { min: 101, max: 150, color: '#ff7e00', description: 'Sensitive groups may experience effects' },
    unhealthy: { min: 151, max: 200, color: '#ff0000', description: 'Everyone may experience effects' },
    veryUnhealthy: { min: 201, max: 300, color: '#8f3f97', description: 'Health alert: significant risk' },
    hazardous: { min: 301, max: 500, color: '#7e0023', description: 'Emergency conditions' }
};

// Pollutant info
const POLLUTANTS = {
    pm25: {
        name: 'PM2.5',
        fullName: 'Fine Particulate Matter',
        sources: ['Fires', 'Cars', 'Industry', 'Cooking'],
        healthEffects: 'Respiratory and cardiovascular issues'
    },
    pm10: {
        name: 'PM10',
        fullName: 'Inhalable Particles',
        sources: ['Dust', 'Pollen', 'Construction'],
        healthEffects: 'Respiratory irritation'
    },
    ozone: {
        name: 'O3',
        fullName: 'Ground-level Ozone',
        sources: ['Sunlight reacting with car exhaust'],
        healthEffects: 'Breathing difficulties, lung damage'
    },
    no2: {
        name: 'NO2',
        fullName: 'Nitrogen Dioxide',
        sources: ['Vehicle emissions', 'Power plants'],
        healthEffects: 'Respiratory inflammation'
    },
    co: {
        name: 'CO',
        fullName: 'Carbon Monoxide',
        sources: ['Incomplete combustion', 'Cars', 'Heaters'],
        healthEffects: 'Reduced oxygen delivery'
    }
};

// ============================================
// GET AIR QUALITY
// ============================================
router.get('/current/:location', async (req: Request, res: Response) => {
    try {
        const { location } = req.params;

        // In production, would call EPA AirNow API or similar
        const airQuality = generateAirQualityData(location);

        res.json({
            location,
            timestamp: new Date().toISOString(),
            ...airQuality
        });
    } catch (error) {
        console.error('Air quality error:', error);
        res.status(500).json({ error: 'Failed to get air quality' });
    }
});

function generateAirQualityData(location: string): any {
    // Simulated AQI data
    const aqi = Math.floor(Math.random() * 120) + 20;
    const category = getAQICategory(aqi);

    return {
        aqi,
        category: category.name,
        color: category.color,
        description: category.description,
        mainPollutant: 'PM2.5',
        pollutants: {
            pm25: { value: Math.round(aqi * 0.4), unit: 'μg/m³', aqi: Math.floor(aqi * 0.9) },
            pm10: { value: Math.round(aqi * 0.6), unit: 'μg/m³', aqi: Math.floor(aqi * 0.7) },
            ozone: { value: (aqi * 0.3).toFixed(1), unit: 'ppb', aqi: Math.floor(aqi * 0.6) },
            no2: { value: (aqi * 0.2).toFixed(1), unit: 'ppb', aqi: Math.floor(aqi * 0.5) },
            co: { value: (aqi * 0.02).toFixed(1), unit: 'ppm', aqi: Math.floor(aqi * 0.3) }
        },
        healthRecommendations: getHealthRecommendations(aqi),
        activities: getActivityRecommendations(aqi)
    };
}

function getAQICategory(aqi: number): any {
    if (aqi <= 50) return { name: 'Good', ...AQI_CATEGORIES.good };
    if (aqi <= 100) return { name: 'Moderate', ...AQI_CATEGORIES.moderate };
    if (aqi <= 150) return { name: 'Unhealthy for Sensitive Groups', ...AQI_CATEGORIES.unhealthySensitive };
    if (aqi <= 200) return { name: 'Unhealthy', ...AQI_CATEGORIES.unhealthy };
    if (aqi <= 300) return { name: 'Very Unhealthy', ...AQI_CATEGORIES.veryUnhealthy };
    return { name: 'Hazardous', ...AQI_CATEGORIES.hazardous };
}

function getHealthRecommendations(aqi: number): string[] {
    if (aqi <= 50) {
        return ['Great day to be outdoors!', 'No restrictions for any groups'];
    }
    if (aqi <= 100) {
        return [
            'Unusually sensitive people should reduce prolonged outdoor exertion',
            'Most people can be active outside'
        ];
    }
    if (aqi <= 150) {
        return [
            'People with heart or lung disease, older adults, and children should reduce prolonged or heavy outdoor exertion',
            'Consider wearing a mask if outdoors for extended periods'
        ];
    }
    return [
        'Everyone should reduce prolonged outdoor exertion',
        'Keep windows closed',
        'Consider using air purifier indoors',
        'Sensitive groups should avoid outdoor activities'
    ];
}

function getActivityRecommendations(aqi: number): any {
    return {
        outdoorExercise: aqi <= 100 ? 'Safe' : aqi <= 150 ? 'Limit intensity' : 'Avoid',
        windows: aqi <= 100 ? 'Can open' : 'Keep closed',
        airPurifier: aqi > 100 ? 'Recommended' : 'Not necessary',
        outdoorDining: aqi <= 150 ? 'Generally OK' : 'Consider indoor'
    };
}

// ============================================
// PROPERTY AIR QUALITY ASSESSMENT
// ============================================
router.post('/assess/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;
        const factors = z.object({
            nearHighway: z.boolean().optional(),
            nearIndustry: z.boolean().optional(),
            hasAirPurifier: z.boolean().optional(),
            hasHVACFilter: z.boolean().optional(),
            surroundingTrees: z.enum(['none', 'few', 'many']).optional()
        }).parse(req.body);

        let indoorScore = 85;
        const concerns: string[] = [];
        const improvements: string[] = [];

        if (factors.nearHighway) {
            indoorScore -= 15;
            concerns.push('Highway proximity increases particulate matter exposure');
            improvements.push('Use HEPA air purifiers in bedrooms');
        }

        if (factors.nearIndustry) {
            indoorScore -= 20;
            concerns.push('Industrial area may have elevated pollutants');
            improvements.push('Install whole-house air filtration');
        }

        if (factors.hasAirPurifier) {
            indoorScore += 10;
        }

        if (factors.hasHVACFilter) {
            indoorScore += 5;
        }

        if (factors.surroundingTrees === 'many') {
            indoorScore += 5;
        }

        res.json({
            propertyId,
            estimatedIndoorAQI: Math.max(20, 100 - indoorScore),
            indoorAirScore: Math.min(100, indoorScore),
            grade: indoorScore >= 85 ? 'A' : indoorScore >= 70 ? 'B' : indoorScore >= 55 ? 'C' : 'D',
            concerns,
            improvements,
            plantRecommendations: [
                { name: 'Snake Plant', benefit: 'Removes formaldehyde, overnight oxygen' },
                { name: 'Peace Lily', benefit: 'Removes VOCs, mold spores' },
                { name: 'Spider Plant', benefit: 'Removes carbon monoxide, xylene' },
                { name: 'Boston Fern', benefit: 'Natural humidifier, removes pollutants' }
            ]
        });
    } catch (error) {
        console.error('Assessment error:', error);
        res.status(500).json({ error: 'Assessment failed' });
    }
});

// ============================================
// GET POLLUTANT INFO
// ============================================
router.get('/pollutants', (req: Request, res: Response) => {
    res.json({ pollutants: POLLUTANTS, categories: AQI_CATEGORIES });
});

// ============================================
// HISTORICAL AIR QUALITY
// ============================================
router.get('/history/:location', async (req: Request, res: Response) => {
    try {
        const { location } = req.params;
        const { days } = req.query;
        const numDays = parseInt(days as string) || 7;

        const history: any[] = [];
        for (let i = 0; i < numDays; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            history.push({
                date: date.toISOString().split('T')[0],
                aqi: Math.floor(Math.random() * 80) + 30,
                mainPollutant: ['PM2.5', 'Ozone', 'PM10'][Math.floor(Math.random() * 3)]
            });
        }

        res.json({
            location,
            period: `Last ${numDays} days`,
            history,
            averageAQI: Math.round(history.reduce((a, b) => a + b.aqi, 0) / history.length),
            trend: history[0].aqi > history[history.length - 1].aqi ? 'Improving' : 'Stable'
        });
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ error: 'Failed to get history' });
    }
});

export default router;
