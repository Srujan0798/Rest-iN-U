import { Router, Request, Response } from 'express';

const router = Router();

interface SensorReading {
    sensorId: string;
    type: string;
    value: number;
    unit: string;
    timestamp: string;
    status: string;
}

// Mock IoT sensor data (in production, would connect to real sensors)
const generateSensorData = (propertyId: string, sensorType: string): SensorReading[] => {
    const now = Date.now();
    const readings: SensorReading[] = [];

    for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now - i * 60 * 60 * 1000).toISOString();

        switch (sensorType) {
            case 'air_quality':
                readings.push({
                    sensorId: `AIR-${propertyId.slice(0, 8)}`,
                    type: 'air_quality',
                    value: Math.floor(Math.random() * 40) + 20,
                    unit: 'AQI',
                    timestamp,
                    status: 'active'
                });
                break;
            case 'water_quality':
                readings.push({
                    sensorId: `H2O-${propertyId.slice(0, 8)}`,
                    type: 'water_quality',
                    value: Math.floor(Math.random() * 100) + 100,
                    unit: 'TDS (ppm)',
                    timestamp,
                    status: 'active'
                });
                break;
            case 'emf':
                readings.push({
                    sensorId: `EMF-${propertyId.slice(0, 8)}`,
                    type: 'emf_radiation',
                    value: Math.random() * 0.5,
                    unit: 'mG',
                    timestamp,
                    status: 'active'
                });
                break;
            case 'noise':
                readings.push({
                    sensorId: `SND-${propertyId.slice(0, 8)}`,
                    type: 'noise_level',
                    value: Math.floor(Math.random() * 30) + 30,
                    unit: 'dB',
                    timestamp,
                    status: 'active'
                });
                break;
        }
    }

    return readings;
};

// Get all sensor data for a property
router.get('/:propertyId/sensors', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        const sensors = {
            propertyId,
            lastUpdated: new Date().toISOString(),
            sensorsActive: 6,

            airQuality: {
                sensorId: `AIR-${propertyId.slice(0, 8)}`,
                status: 'active',
                currentReading: {
                    aqi: Math.floor(Math.random() * 40) + 20,
                    pm25: (Math.random() * 10 + 5).toFixed(1),
                    pm10: (Math.random() * 20 + 10).toFixed(1),
                    co2: Math.floor(Math.random() * 200) + 400,
                    voc: (Math.random() * 100).toFixed(0),
                    humidity: Math.floor(Math.random() * 30) + 40
                },
                rating: 'Good',
                recommendations: ['Air quality is healthy', 'No action needed']
            },

            waterQuality: {
                sensorId: `H2O-${propertyId.slice(0, 8)}`,
                status: 'active',
                currentReading: {
                    tds: Math.floor(Math.random() * 100) + 100,
                    ph: (Math.random() * 1 + 6.5).toFixed(1),
                    turbidity: (Math.random() * 2).toFixed(1),
                    chlorine: (Math.random() * 0.5).toFixed(2),
                    temperature: (Math.random() * 10 + 15).toFixed(1)
                },
                rating: 'Safe',
                recommendations: ['Water is safe for drinking', 'Consider filter for optimal taste']
            },

            emfRadiation: {
                sensorId: `EMF-${propertyId.slice(0, 8)}`,
                status: 'active',
                currentReading: {
                    level: (Math.random() * 0.3).toFixed(2),
                    frequency: '50-60 Hz',
                    source: 'Background only'
                },
                rating: 'Low',
                healthRisk: 'Minimal',
                recommendations: ['EMF levels within safe range']
            },

            noiseLevels: {
                sensorId: `SND-${propertyId.slice(0, 8)}`,
                status: 'active',
                currentReading: {
                    currentDb: Math.floor(Math.random() * 15) + 35,
                    averageDb: Math.floor(Math.random() * 10) + 40,
                    peakDb: Math.floor(Math.random() * 20) + 55,
                    quietestHour: '03:00',
                    loudestHour: '08:00'
                },
                rating: 'Quiet',
                sleepQualityImpact: 'None'
            },

            soilSensor: {
                sensorId: `SOIL-${propertyId.slice(0, 8)}`,
                status: 'active',
                currentReading: {
                    moisture: Math.floor(Math.random() * 30) + 30,
                    ph: (Math.random() * 2 + 5.5).toFixed(1),
                    nitrogen: Math.floor(Math.random() * 50) + 20,
                    phosphorus: Math.floor(Math.random() * 40) + 15,
                    potassium: Math.floor(Math.random() * 60) + 30
                },
                rating: 'Good',
                gardenViability: 'Excellent'
            },

            weatherStation: {
                sensorId: `WX-${propertyId.slice(0, 8)}`,
                status: 'active',
                currentReading: {
                    temperature: Math.floor(Math.random() * 20) + 60,
                    humidity: Math.floor(Math.random() * 30) + 40,
                    pressure: Math.floor(Math.random() * 20) + 1010,
                    windSpeed: Math.floor(Math.random() * 10) + 5,
                    windDirection: 'NW',
                    uvIndex: Math.floor(Math.random() * 5) + 2,
                    solarRadiation: Math.floor(Math.random() * 500) + 300
                }
            }
        };

        res.json(sensors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sensor data' });
    }
});

// Get historical readings for a specific sensor
router.get('/:propertyId/sensors/:sensorType/history', async (req: Request, res: Response) => {
    try {
        const { propertyId, sensorType } = req.params;
        const { hours = 24 } = req.query;

        const readings = generateSensorData(propertyId, sensorType);

        res.json({
            propertyId,
            sensorType,
            period: `Last ${hours} hours`,
            readings: readings.slice(0, Number(hours)),
            statistics: {
                min: Math.min(...readings.map(r => r.value)),
                max: Math.max(...readings.map(r => r.value)),
                average: (readings.reduce((sum, r) => sum + r.value, 0) / readings.length).toFixed(2),
                trend: 'stable'
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sensor history' });
    }
});

// Smart home integration status
router.get('/:propertyId/smart-home', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        res.json({
            propertyId,
            smartHomeScore: Math.floor(Math.random() * 30) + 70,
            grade: 'A-',

            devices: [
                { category: 'Lighting', count: 12, brand: 'Philips Hue', status: 'connected' },
                { category: 'Climate', count: 3, brand: 'Nest/Ecobee', status: 'connected' },
                { category: 'Security', count: 8, brand: 'Ring', status: 'connected' },
                { category: 'Entertainment', count: 4, brand: 'Sonos', status: 'connected' },
                { category: 'Appliances', count: 5, brand: 'Samsung SmartThings', status: 'connected' }
            ],

            integrations: {
                alexa: true,
                googleHome: true,
                homeKit: true,
                smartThings: true,
                ifttt: true
            },

            energyEfficiency: {
                solarPanels: true,
                batteryBackup: true,
                smartThermostat: true,
                ledLighting: true,
                smartPlugs: true
            },

            securityFeatures: {
                cameras: 4,
                doorLocks: 3,
                motionSensors: 6,
                alarmSystem: true,
                videoDoorbells: 2
            },

            automations: [
                { name: 'Morning Routine', devices: 8, active: true },
                { name: 'Away Mode', devices: 15, active: true },
                { name: 'Night Mode', devices: 12, active: true },
                { name: 'Guest Mode', devices: 6, active: false }
            ],

            monthlyEnergySavings: Math.floor(Math.random() * 50) + 50,
            estimatedValue: Math.floor(Math.random() * 10000) + 15000
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch smart home data' });
    }
});

// Real-time alerts
router.get('/:propertyId/alerts', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        res.json({
            propertyId,
            activeAlerts: [],
            recentAlerts: [
                {
                    alertId: 'ALT-001',
                    type: 'air_quality',
                    severity: 'info',
                    message: 'Humidity dropped below 40%',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    resolved: true
                },
                {
                    alertId: 'ALT-002',
                    type: 'security',
                    severity: 'info',
                    message: 'Motion detected at front door',
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    resolved: true
                }
            ],
            alertSettings: {
                airQualityThreshold: 100,
                noiseThreshold: 70,
                temperatureMin: 55,
                temperatureMax: 85,
                humidityMin: 30,
                humidityMax: 60,
                motionDetection: true,
                waterLeak: true
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});

export default router;
