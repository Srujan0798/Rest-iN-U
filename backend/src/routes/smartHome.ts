import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// SUPPORTED SMART HOME PLATFORMS
// ============================================
const PLATFORMS = {
    alexa: {
        name: 'Amazon Alexa',
        icon: '🔵',
        deviceTypes: ['lights', 'thermostat', 'locks', 'cameras', 'speakers']
    },
    google: {
        name: 'Google Home',
        icon: '🔴',
        deviceTypes: ['lights', 'thermostat', 'cameras', 'displays', 'speakers']
    },
    apple: {
        name: 'Apple HomeKit',
        icon: '⚪',
        deviceTypes: ['lights', 'thermostat', 'locks', 'cameras', 'sensors']
    },
    smartthings: {
        name: 'Samsung SmartThings',
        icon: '🟢',
        deviceTypes: ['lights', 'thermostat', 'locks', 'sensors', 'appliances']
    },
    hubitat: {
        name: 'Hubitat',
        icon: '🟤',
        deviceTypes: ['lights', 'thermostat', 'locks', 'sensors', 'zigbee', 'zwave']
    }
};

// ============================================
// GET PROPERTY SMART HOME SCORE
// ============================================
router.get('/property/:propertyId/score', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        const devices = await prisma.smartDevice.findMany({
            where: { propertyId }
        });

        if (devices.length === 0) {
            return res.json({
                propertyId,
                smartHomeScore: 0,
                grade: 'Not Smart',
                devices: [],
                recommendations: getStarterRecommendations()
            });
        }

        const score = calculateSmartHomeScore(devices);
        const categories = categorizeDevices(devices);

        res.json({
            propertyId,
            smartHomeScore: score.total,
            grade: getSmartHomeGrade(score.total),
            breakdown: score.breakdown,
            deviceCount: devices.length,
            categories,
            platforms: getUniquePlatforms(devices),
            estimatedEnergySavings: calculateEnergySavings(devices),
            recommendations: getUpgradeRecommendations(devices, score.breakdown)
        });
    } catch (error) {
        console.error('Smart home score error:', error);
        res.status(500).json({ error: 'Failed to get smart home score' });
    }
});

function calculateSmartHomeScore(devices: any[]): { total: number; breakdown: Record<string, number> } {
    const breakdown: Record<string, number> = {
        lighting: 0,
        climate: 0,
        security: 0,
        entertainment: 0,
        energy: 0,
        automation: 0
    };

    for (const device of devices) {
        switch (device.type) {
            case 'lights':
                breakdown.lighting += 5;
                break;
            case 'thermostat':
                breakdown.climate += 15;
                break;
            case 'cameras':
            case 'locks':
            case 'doorbell':
                breakdown.security += 10;
                break;
            case 'speakers':
            case 'tv':
                breakdown.entertainment += 5;
                break;
            case 'solar':
            case 'battery':
                breakdown.energy += 15;
                break;
            case 'hub':
            case 'sensors':
                breakdown.automation += 10;
                break;
        }
    }

    // Cap each category at reasonable max
    const caps = { lighting: 20, climate: 20, security: 25, entertainment: 10, energy: 15, automation: 10 };
    for (const [key, cap] of Object.entries(caps)) {
        breakdown[key] = Math.min(breakdown[key], cap);
    }

    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

    return { total, breakdown };
}

function categorizeDevices(devices: any[]): Record<string, any[]> {
    const categories: Record<string, any[]> = {
        lighting: [],
        climate: [],
        security: [],
        entertainment: [],
        energy: [],
        other: []
    };

    for (const device of devices) {
        const category = getDeviceCategory(device.type);
        categories[category].push(device);
    }

    return categories;
}

function getDeviceCategory(type: string): string {
    const mapping: Record<string, string> = {
        lights: 'lighting',
        thermostat: 'climate',
        hvac: 'climate',
        cameras: 'security',
        locks: 'security',
        doorbell: 'security',
        sensors: 'security',
        speakers: 'entertainment',
        tv: 'entertainment',
        solar: 'energy',
        battery: 'energy'
    };
    return mapping[type] || 'other';
}

function getUniquePlatforms(devices: any[]): string[] {
    const platforms = new Set(devices.map(d => d.platform));
    return Array.from(platforms);
}

function calculateEnergySavings(devices: any[]): any {
    let annualSavings = 0;

    for (const device of devices) {
        switch (device.type) {
            case 'thermostat':
                annualSavings += 180; // Smart thermostat saves ~$180/year
                break;
            case 'lights':
                annualSavings += 25; // Smart lights save ~$25/year each
                break;
            case 'solar':
                annualSavings += 1200; // Solar can save $1200+/year
                break;
        }
    }

    return {
        estimatedAnnual: annualSavings,
        description: `Estimated $${annualSavings}/year in energy savings`
    };
}

function getSmartHomeGrade(score: number): string {
    if (score >= 80) return 'A+ (Fully Automated)';
    if (score >= 60) return 'A (Smart Connected)';
    if (score >= 40) return 'B (Partially Smart)';
    if (score >= 20) return 'C (Basic Smart)';
    return 'D (Minimal)';
}

function getStarterRecommendations(): any[] {
    return [
        { priority: 1, item: 'Smart Thermostat', reason: 'Biggest energy savings', estimatedCost: 200 },
        { priority: 2, item: 'Video Doorbell', reason: 'Security and convenience', estimatedCost: 150 },
        { priority: 3, item: 'Smart Locks', reason: 'Keyless entry and monitoring', estimatedCost: 200 },
        { priority: 4, item: 'Smart Light Bulbs', reason: 'Easy automation start', estimatedCost: 50 }
    ];
}

function getUpgradeRecommendations(devices: any[], breakdown: Record<string, number>): any[] {
    const recs: any[] = [];

    if (breakdown.climate < 15) {
        recs.push({ priority: 1, item: 'Smart Thermostat', reason: 'Optimize heating/cooling' });
    }
    if (breakdown.security < 20) {
        recs.push({ priority: 2, item: 'Security Cameras', reason: 'Enhance home security' });
    }
    if (breakdown.energy < 10) {
        recs.push({ priority: 3, item: 'Energy Monitor', reason: 'Track energy usage' });
    }

    return recs;
}

// ============================================
// ADD SMART DEVICE
// ============================================
const deviceSchema = z.object({
    propertyId: z.string().uuid(),
    type: z.string(),
    brand: z.string(),
    model: z.string(),
    platform: z.string(),
    room: z.string().optional(),
    status: z.enum(['online', 'offline', 'unknown']).default('unknown')
});

router.post('/device', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = deviceSchema.parse(req.body);

        const device = await prisma.smartDevice.create({
            data: {
                propertyId: data.propertyId,
                type: data.type,
                brand: data.brand,
                model: data.model,
                platform: data.platform,
                room: data.room,
                status: data.status,
                addedBy: req.userId!
            }
        });

        res.status(201).json({
            message: 'Device added successfully',
            device
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Add device error:', error);
        res.status(500).json({ error: 'Failed to add device' });
    }
});

// ============================================
// GET SUPPORTED PLATFORMS
// ============================================
router.get('/platforms', (req: Request, res: Response) => {
    res.json({ platforms: PLATFORMS });
});

// ============================================
// SMART HOME AUTOMATION PRESETS
// ============================================
const PRESETS = {
    away: {
        name: 'Away Mode',
        description: 'Energy saving when nobody is home',
        actions: ['thermostat:setback', 'lights:off', 'cameras:arm']
    },
    sleep: {
        name: 'Sleep Mode',
        description: 'Nighttime settings',
        actions: ['thermostat:night', 'lights:dim', 'locks:engage', 'alarm:arm']
    },
    welcome: {
        name: 'Welcome Home',
        description: 'Return home comfort',
        actions: ['lights:on', 'thermostat:comfort', 'music:play']
    },
    movie: {
        name: 'Movie Time',
        description: 'Entertainment mode',
        actions: ['lights:dim', 'tv:on', 'blinds:close']
    }
};

router.get('/presets', (req: Request, res: Response) => {
    res.json({ presets: PRESETS });
});

export default router;
