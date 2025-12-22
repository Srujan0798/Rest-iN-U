// Smart Home Integration Service
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { redisClient } from '../utils/redis';

interface SmartDevice {
    id: string;
    type: string;
    name: string;
    manufacturer: string;
    status: 'ONLINE' | 'OFFLINE' | 'ERROR';
    lastSeen: Date;
    capabilities: string[];
    currentState: Record<string, any>;
}

interface SmartHomeScore {
    overall: number;
    categories: {
        security: number;
        energy: number;
        comfort: number;
        connectivity: number;
    };
    devices: SmartDevice[];
    recommendations: string[];
}

const DEVICE_CATEGORIES = {
    SECURITY: ['camera', 'doorbell', 'lock', 'alarm', 'motion_sensor'],
    ENERGY: ['thermostat', 'smart_meter', 'solar_inverter', 'ev_charger'],
    COMFORT: ['lighting', 'blinds', 'speaker', 'display', 'climate'],
    CONNECTIVITY: ['hub', 'router', 'extender', 'bridge'],
};

export class SmartHomeService {
    // Calculate smart home score for a property
    async calculateSmartHomeScore(propertyId: string): Promise<SmartHomeScore> {
        const sensors = await prisma.ioTSensor.findMany({
            where: { propertyId },
            include: { readings: { take: 1, orderBy: { timestamp: 'desc' } } },
        });

        const devices: SmartDevice[] = sensors.map(s => ({
            id: s.id,
            type: s.sensorType,
            name: s.model || s.sensorType,
            manufacturer: s.manufacturer || 'Unknown',
            status: this.getDeviceStatus(s.lastReading),
            lastSeen: s.lastReading || new Date(),
            capabilities: this.getDeviceCapabilities(s.sensorType),
            currentState: s.readings[0] ? { value: s.readings[0].value, unit: s.readings[0].unit } : {},
        }));

        const categories = this.calculateCategoryScores(devices);
        const overall = Math.round(
            (categories.security * 0.3) +
            (categories.energy * 0.3) +
            (categories.comfort * 0.25) +
            (categories.connectivity * 0.15)
        );

        const recommendations = this.generateRecommendations(categories, devices);

        return { overall, categories, devices, recommendations };
    }

    private getDeviceStatus(lastReading: Date | null): 'ONLINE' | 'OFFLINE' | 'ERROR' {
        if (!lastReading) return 'OFFLINE';
        const hoursSinceReading = (Date.now() - lastReading.getTime()) / (1000 * 60 * 60);
        if (hoursSinceReading < 1) return 'ONLINE';
        if (hoursSinceReading < 24) return 'OFFLINE';
        return 'ERROR';
    }

    private getDeviceCapabilities(type: string): string[] {
        const capabilities: Record<string, string[]> = {
            AIR_QUALITY: ['monitor', 'alert'],
            TEMPERATURE: ['monitor', 'control', 'schedule'],
            HUMIDITY: ['monitor', 'alert'],
            WATER_QUALITY: ['monitor', 'alert', 'filter_status'],
            EMF: ['monitor'],
            NOISE: ['monitor', 'alert'],
            SEISMIC: ['monitor', 'emergency_alert'],
            WEATHER: ['monitor', 'forecast'],
            TRAFFIC: ['monitor', 'route_suggest'],
            WILDLIFE: ['monitor', 'record'],
        };
        return capabilities[type] || ['monitor'];
    }

    private calculateCategoryScores(devices: SmartDevice[]): SmartHomeScore['categories'] {
        const categoryCounts = { security: 0, energy: 0, comfort: 0, connectivity: 0 };
        const categoryOnline = { security: 0, energy: 0, comfort: 0, connectivity: 0 };

        devices.forEach(device => {
            const type = device.type.toLowerCase();

            for (const [category, types] of Object.entries(DEVICE_CATEGORIES)) {
                if (types.some(t => type.includes(t))) {
                    const cat = category.toLowerCase() as keyof typeof categoryCounts;
                    categoryCounts[cat]++;
                    if (device.status === 'ONLINE') categoryOnline[cat]++;
                }
            }
        });

        // Score based on device count and online status
        const calculateScore = (count: number, online: number, idealMin: number): number => {
            if (count === 0) return 0;
            const coverageScore = Math.min(100, (count / idealMin) * 50);
            const healthScore = (online / count) * 50;
            return Math.round(coverageScore + healthScore);
        };

        return {
            security: calculateScore(categoryCounts.security, categoryOnline.security, 4),
            energy: calculateScore(categoryCounts.energy, categoryOnline.energy, 3),
            comfort: calculateScore(categoryCounts.comfort, categoryOnline.comfort, 5),
            connectivity: calculateScore(categoryCounts.connectivity, categoryOnline.connectivity, 2),
        };
    }

    private generateRecommendations(categories: SmartHomeScore['categories'], devices: SmartDevice[]): string[] {
        const recommendations: string[] = [];

        if (categories.security < 50) {
            recommendations.push('Add smart security cameras and video doorbell for enhanced protection');
        }
        if (categories.energy < 50) {
            recommendations.push('Install smart thermostat to reduce energy costs by up to 23%');
        }
        if (categories.comfort < 50) {
            recommendations.push('Add smart lighting for customizable ambiance and energy savings');
        }
        if (categories.connectivity < 50) {
            recommendations.push('Consider a smart home hub to unify device control');
        }

        const offlineDevices = devices.filter(d => d.status !== 'ONLINE');
        if (offlineDevices.length > 0) {
            recommendations.push(`${offlineDevices.length} device(s) need attention - check connectivity`);
        }

        // Add Vastu-aligned recommendations
        recommendations.push('Position smart devices according to Vastu principles for optimal energy flow');

        return recommendations;
    }

    // Get real-time device status for a property
    async getPropertyDeviceStatus(propertyId: string): Promise<any[]> {
        const cacheKey = `smartHome:status:${propertyId}`;
        const cached = await redisClient.get(cacheKey);

        if (cached) {
            return JSON.parse(cached);
        }

        const status = await this.calculateSmartHomeScore(propertyId);
        await redisClient.setex(cacheKey, 60, JSON.stringify(status.devices));

        return status.devices;
    }

    // Control device (mock)
    async controlDevice(deviceId: string, command: string, value: any): Promise<any> {
        logger.info(`Smart home command: ${deviceId} - ${command}: ${value}`);

        // In real implementation, would send command to device
        return {
            success: true,
            deviceId,
            command,
            value,
            timestamp: new Date(),
        };
    }

    // Get automation suggestions
    getAutomationSuggestions(): any[] {
        return [
            {
                name: 'Morning Ritual',
                trigger: 'Time: 6:00 AM',
                actions: ['Gradual lighting increase', 'Adjust thermostat to 72°F', 'Start coffee maker'],
                vastuAlignment: 'Aligns with Brahma Muhurta energy',
            },
            {
                name: 'Away Mode',
                trigger: 'Everyone leaves home',
                actions: ['Arm security', 'Reduce HVAC', 'Turn off non-essential lights'],
                energySavings: 'Up to 15% reduction',
            },
            {
                name: 'Welcome Home',
                trigger: 'First person arrives',
                actions: ['Disarm security', 'Adjust lighting', 'Set comfortable temperature'],
                vastuAlignment: 'Positive energy welcome',
            },
            {
                name: 'Night Mode',
                trigger: 'Time: 10:00 PM',
                actions: ['Dim all lights', 'Lock all doors', 'Lower thermostat'],
                vastuAlignment: 'Supports restful sleep per Vastu',
            },
        ];
    }
}

export const smartHomeService = new SmartHomeService();
