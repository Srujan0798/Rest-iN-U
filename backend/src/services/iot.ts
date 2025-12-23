// IoT Sensor Service
import { prisma } from '../utils/prisma';
import { cacheGet, cacheSet, CACHE_KEYS, CACHE_TTL, publishMessage } from '../utils/redis';
import { logger } from '../utils/logger';

interface SensorReading {
    sensorId: string;
    value: number;
    unit: string;
    timestamp: Date;
}

interface EnvironmentalSnapshot {
    temperature: number;
    humidity: number;
    airQuality: number;
    co2Level?: number;
    noise?: number;
    light?: number;
}

export class IoTService {
    /**
     * Register a new IoT sensor for a property
     */
    async registerSensor(
        propertyId: string,
        sensorData: {
            sensorType: string;
            manufacturer?: string;
            model?: string;
            location?: string;
        }
    ) {
        const sensor = await prisma.ioTSensor.create({
            data: {
                propertyId,
                sensorType: sensorData.sensorType,
                manufacturer: sensorData.manufacturer,
                model: sensorData.model,
                location: sensorData.location,
                status: 'ONLINE',
                lastReading: new Date(),
            },
        });

        logger.info(`IoT sensor ${sensor.id} registered for property ${propertyId}`);
        return sensor;
    }

    /**
     * Process incoming sensor reading
     */
    async processReading(sensorId: string, reading: SensorReading) {
        // Validate sensor exists
        const sensor = await prisma.ioTSensor.findUnique({
            where: { id: sensorId },
            include: { property: true },
        });

        if (!sensor) {
            throw new Error('Sensor not found');
        }

        // Store reading
        const storedReading = await prisma.ioTReading.create({
            data: {
                sensorId,
                value: reading.value,
                unit: reading.unit,
                timestamp: reading.timestamp || new Date(),
            },
        });

        // Update sensor last reading time
        await prisma.ioTSensor.update({
            where: { id: sensorId },
            data: { lastReading: new Date(), status: 'ONLINE' },
        });

        // Cache latest reading
        await cacheSet(
            `${CACHE_KEYS.IOT}${sensorId}:latest`,
            storedReading,
            CACHE_TTL.SHORT
        );

        // Publish real-time update
        await publishMessage('iot_readings', {
            propertyId: sensor.propertyId,
            sensorId,
            reading: storedReading,
        });

        // Check for alerts
        await this.checkAlerts(sensor, reading);

        return storedReading;
    }

    /**
     * Get current environmental data for a property
     */
    async getEnvironmentalData(propertyId: string): Promise<EnvironmentalSnapshot | null> {
        const cacheKey = `${CACHE_KEYS.ENVIRONMENTAL}${propertyId}`;
        let data = await cacheGet(cacheKey);

        if (data) return data;

        // Get all sensors for property
        const sensors = await prisma.ioTSensor.findMany({
            where: { propertyId, status: 'ONLINE' },
        });

        if (sensors.length === 0) return null;

        // Get latest readings for each sensor
        const snapshot: EnvironmentalSnapshot = {
            temperature: 0,
            humidity: 0,
            airQuality: 0,
        };

        for (const sensor of sensors) {
            const latestReading = await prisma.ioTReading.findFirst({
                where: { sensorId: sensor.id },
                orderBy: { timestamp: 'desc' },
            });

            if (latestReading) {
                switch (sensor.sensorType) {
                    case 'TEMPERATURE':
                        snapshot.temperature = latestReading.value;
                        break;
                    case 'HUMIDITY':
                        snapshot.humidity = latestReading.value;
                        break;
                    case 'AIR_QUALITY':
                        snapshot.airQuality = latestReading.value;
                        break;
                    case 'CO2':
                        snapshot.co2Level = latestReading.value;
                        break;
                    case 'NOISE':
                        snapshot.noise = latestReading.value;
                        break;
                    case 'LIGHT':
                        snapshot.light = latestReading.value;
                        break;
                }
            }
        }

        await cacheSet(cacheKey, snapshot, CACHE_TTL.SHORT);
        return snapshot;
    }

    /**
     * Get historical readings for a sensor
     */
    async getSensorHistory(
        sensorId: string,
        startDate: Date,
        endDate: Date,
        interval: 'hour' | 'day' | 'week' = 'hour'
    ) {
        const readings = await prisma.ioTReading.findMany({
            where: {
                sensorId,
                timestamp: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { timestamp: 'asc' },
        });

        // Aggregate by interval
        const aggregated: { timestamp: Date; avg: number; min: number; max: number }[] = [];
        let currentBucket: typeof readings = [];
        let bucketStart = startDate;

        const bucketMs = interval === 'hour' ? 3600000 : interval === 'day' ? 86400000 : 604800000;

        for (const reading of readings) {
            if (reading.timestamp.getTime() - bucketStart.getTime() > bucketMs) {
                if (currentBucket.length > 0) {
                    const values = currentBucket.map(r => r.value);
                    aggregated.push({
                        timestamp: bucketStart,
                        avg: values.reduce((a, b) => a + b, 0) / values.length,
                        min: Math.min(...values),
                        max: Math.max(...values),
                    });
                }
                bucketStart = new Date(reading.timestamp);
                currentBucket = [];
            }
            currentBucket.push(reading);
        }

        // Don't forget last bucket
        if (currentBucket.length > 0) {
            const values = currentBucket.map(r => r.value);
            aggregated.push({
                timestamp: bucketStart,
                avg: values.reduce((a, b) => a + b, 0) / values.length,
                min: Math.min(...values),
                max: Math.max(...values),
            });
        }

        return aggregated;
    }

    /**
     * Calculate energy efficiency score
     */
    async calculateEnergyScore(propertyId: string): Promise<any> {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Get energy sensor readings
        const sensors = await prisma.ioTSensor.findMany({
            where: {
                propertyId,
                sensorType: { in: ['POWER', 'SOLAR', 'GAS', 'WATER'] },
            },
        });

        if (sensors.length === 0) {
            return null;
        }

        const energyData: Record<string, number> = {};

        for (const sensor of sensors) {
            const readings = await prisma.ioTReading.findMany({
                where: {
                    sensorId: sensor.id,
                    timestamp: { gte: thirtyDaysAgo },
                },
            });

            const total = readings.reduce((sum, r) => sum + r.value, 0);
            energyData[sensor.sensorType] = total;
        }

        // Calculate efficiency score (simplified)
        const powerUsage = energyData['POWER'] || 0;
        const solarGeneration = energyData['SOLAR'] || 0;
        const waterUsage = energyData['WATER'] || 0;

        const renewableRatio = solarGeneration / (powerUsage || 1);
        const efficiencyScore = Math.min(100, Math.round(
            50 + (renewableRatio * 30) - (waterUsage / 10000)
        ));

        // Update or create energy analysis record
        await prisma.energyAnalysis.upsert({
            where: { propertyId },
            create: {
                propertyId,
                energyScore: efficiencyScore,
                monthlyKwh: powerUsage,
                solarGeneration,
                netEnergyUse: powerUsage - solarGeneration,
                estimatedMonthlyCost: powerUsage * 0.12, // ~$0.12/kWh
                projectedSavings: solarGeneration * 0.12,
            },
            update: {
                energyScore: efficiencyScore,
                monthlyKwh: powerUsage,
                solarGeneration,
                netEnergyUse: powerUsage - solarGeneration,
                analysisDate: new Date(),
            },
        });

        return {
            score: efficiencyScore,
            grade: this.getGrade(efficiencyScore),
            metrics: {
                powerUsageKwh: powerUsage,
                solarGenerationKwh: solarGeneration,
                renewableRatio: Math.round(renewableRatio * 100),
                waterUsageGal: waterUsage,
            },
            recommendations: this.getEnergyRecommendations(energyData, efficiencyScore),
        };
    }

    private getGrade(score: number): string {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        if (score >= 50) return 'D';
        return 'F';
    }

    private getEnergyRecommendations(data: Record<string, number>, score: number): string[] {
        const recommendations: string[] = [];

        if (!data['SOLAR'] || data['SOLAR'] < data['POWER'] * 0.3) {
            recommendations.push('Consider installing solar panels to offset energy costs');
        }

        if (data['WATER'] && data['WATER'] > 5000) {
            recommendations.push('Water usage is high - consider low-flow fixtures');
        }

        if (score < 60) {
            recommendations.push('Schedule an energy audit for improvement opportunities');
        }

        if (data['POWER'] && data['POWER'] > 1000) {
            recommendations.push('Upgrade to LED lighting and Energy Star appliances');
        }

        return recommendations;
    }

    private async checkAlerts(sensor: any, reading: SensorReading) {
        // Define thresholds per sensor type
        const thresholds: Record<string, { min?: number; max?: number }> = {
            TEMPERATURE: { min: 50, max: 90 },
            HUMIDITY: { min: 20, max: 80 },
            CO2: { max: 1000 },
            AIR_QUALITY: { max: 150 },
        };

        const threshold = thresholds[sensor.sensorType];
        if (!threshold) return;

        let alertMessage: string | null = null;

        if (threshold.min && reading.value < threshold.min) {
            alertMessage = `${sensor.sensorType} reading too low: ${reading.value} ${reading.unit}`;
        } else if (threshold.max && reading.value > threshold.max) {
            alertMessage = `${sensor.sensorType} reading too high: ${reading.value} ${reading.unit}`;
        }

        if (alertMessage) {
            // Create notification
            await prisma.notification.create({
                data: {
                    userId: sensor.property.listingAgentId || sensor.property.ownerId,
                    type: 'IOT_ALERT',
                    title: 'IoT Sensor Alert',
                    message: alertMessage,
                    data: { sensorId: sensor.id, propertyId: sensor.propertyId, reading },
                },
            });

            // Publish real-time alert
            await publishMessage('alerts', {
                type: 'iot_alert',
                propertyId: sensor.propertyId,
                message: alertMessage,
            });

            logger.warn(`IoT Alert: ${alertMessage}`);
        }
    }
}

export const iotService = new IoTService();

