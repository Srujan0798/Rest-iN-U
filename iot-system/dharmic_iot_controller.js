/**
 * Revolutionary IoT System with Vedic Time Integration
 * 
 * Unique Innovation: Sensors activate during auspicious times
 * to capture most accurate readings per Muhurat Shastra
 * 
 * Based on: Jyotish principles that certain times are better
 * for accurate measurements and divine blessing on devices
 */

const mqtt = require('mqtt');
const schedule = require('node-schedule');
const axios = require('axios');

class DharmicIoTController {
    constructor() {
        // MQTT broker for sensor network
        this.mqttClient = mqtt.connect('mqtt://localhost:1883');

        // Sensor registry
        this.sensors = new Map();

        // Jyotish API for auspicious timings
        this.jyotishApi = 'http://localhost:8001/api/v1/jyotish';

        // Sacred sensor activation logs
        this.activationLog = [];

        this.initializeSensors();
        this.setupDharmicScheduling();
    }

    async initializeSensors() {
        console.log('Initializing Dharmic IoT System...');

        // Define sensor types with their Vedic associations
        this.sensorTypes = {
            air_quality: {
                element: 'Vayu',  // Air element
                deity: 'Pavan Dev',
                best_time: 'sunrise',  // Best readings at sunrise
                nakshatra_preference: ['Rohini', 'Hasta', 'Shravana'],
                mantra: 'Om Vayave Namaha',
                calibration_ritual: 'Offer incense before first reading'
            },
            water_quality: {
                element: 'Jala',  // Water element
                deity: 'Varuna Dev',
                best_time: 'abhijit',  // Noon time
                nakshatra_preference: ['Pushya', 'Revati'],
                mantra: 'Om Varunaya Namaha',
                calibration_ritual: 'Sprinkle pure water on sensor'
            },
            soil_quality: {
                element: 'Prithvi',  // Earth element
                deity: 'Bhumi Devi',
                best_time: 'morning',
                nakshatra_preference: ['Rohini', 'Uttara Phalguni', 'Uttara Ashadha'],
                mantra: 'Om Prithivyai Namaha',
                calibration_ritual: 'Touch sensor to earth with respect'
            },
            temperature: {
                element: 'Agni',  // Fire element
                deity: 'Agni Dev',
                best_time: 'midday',
                nakshatra_preference: ['Krittika', 'Magha'],
                mantra: 'Om Agnaye Namaha',
                calibration_ritual: 'Light lamp near sensor'
            },
            sound_level: {
                element: 'Akasha',  // Ether element
                deity: 'Brahma',
                best_time: 'twilight',
                nakshatra_preference: ['Revati', 'Ashwini'],
                mantra: 'Om Brahmane Namaha',
                calibration_ritual: 'Maintain silence during first reading'
            }
        };

        // Initialize MQTT subscriptions
        this.mqttClient.on('connect', () => {
            console.log('Connected to MQTT broker');
            this.mqttClient.subscribe('sensors/+/data');
            this.mqttClient.subscribe('sensors/+/status');
        });

        // Handle incoming sensor data
        this.mqttClient.on('message', (topic, message) => {
            this.processSensorData(topic, message);
        });
    }

    async setupDharmicScheduling() {
        console.log('Setting up Vedic timing-based sensor scheduling...');

        // Get today's Panchang
        const panchang = await this.getTodayPanchang();

        // Schedule sensor readings during auspicious times
        await this.scheduleAuspiciousReadings(panchang);

        // Schedule daily at midnight to update next day
        schedule.scheduleJob('0 0 * * *', async () => {
            console.log('New day - updating Dharmic schedules');
            const newPanchang = await this.getTodayPanchang();
            await this.scheduleAuspiciousReadings(newPanchang);
        });

        // Special readings during Abhijit Muhurat (most auspicious 48 min)
        this.scheduleAbhijitReadings(panchang);

        // Avoid readings during Rahu Kaal (inauspicious period)
        this.blockRahuKaalReadings(panchang);
    }

    async getTodayPanchang() {
        try {
            // Get property location (this would come from database)
            const location = await this.getPropertyLocation();

            // Call Jyotish API for today's Panchang
            const response = await axios.post(
                `${this.jyotishApi}/calculate-panchang`,
                {
                    datetime: new Date().toISOString(),
                    latitude: location.lat,
                    longitude: location.lng
                }
            );

            return response.data;
        } catch (error) {
            console.error('Failed to fetch Panchang:', error);
            // Fallback to standard scheduling if Panchang unavailable
            return this.getDefaultSchedule();
        }
    }

    async scheduleAuspiciousReadings(panchang) {
        console.log(`Today's Nakshatra: ${panchang.nakshatra}`);
        console.log(`Today's Tithi: ${panchang.tithi}`);

        // For each sensor type, schedule based on preferences
        for (const [sensorType, config] of Object.entries(this.sensorTypes)) {
            // Check if current nakshatra is preferred for this sensor
            const isPreferredNakshatra = config.nakshatra_preference.includes(
                panchang.nakshatra
            );

            if (isPreferredNakshatra) {
                console.log(`✨ Highly auspicious day for ${sensorType} readings!`);
                // Increase reading frequency on auspicious days
                await this.scheduleHighFrequencyReading(sensorType);
            }

            // Schedule based on best time
            this.scheduleByBestTime(sensorType, config.best_time, panchang);
        }
    }

    scheduleByBestTime(sensorType, bestTime, panchang) {
        const schedules = {
            sunrise: '06:00',  // Brahma Muhurta area
            morning: '08:00',
            abhijit: panchang.abhijit_muhurat?.start_time || '12:00',
            midday: '13:00',
            twilight: '18:00'
        };

        const scheduledTime = schedules[bestTime];

        // Schedule daily reading at best time
        schedule.scheduleJob(
            `0 ${scheduledTime.split(':')[1]} ${scheduledTime.split(':')[0]} * * *`,
            async () => {
                await this.performDharmicReading(sensorType);
            }
        );

        console.log(`Scheduled ${sensorType} reading at ${scheduledTime} (${bestTime})`);
    }

    scheduleAbhijitReadings(panchang) {
        if (!panchang.abhijit_muhurat) return;

        const { start_time, end_time } = panchang.abhijit_muhurat;

        console.log(`📿 Abhijit Muhurat: ${start_time} - ${end_time}`);
        console.log('All sensors will take EXTRA readings during this golden period');

        // Parse time
        const startHour = parseInt(start_time.split(':')[0]);
        const startMin = parseInt(start_time.split(':')[1]);

        // Schedule all sensors during Abhijit
        schedule.scheduleJob(
            `0 ${startMin} ${startHour} * * *`,
            async () => {
                console.log('🌟 ABHIJIT MUHURAT - Taking blessed readings from all sensors');

                // Read ALL sensors during most auspicious time
                for (const sensorType of Object.keys(this.sensorTypes)) {
                    await this.performDharmicReading(sensorType, true);
                }
            }
        );
    }

    blockRahuKaalReadings(panchang) {
        if (!panchang.rahu_kaal?.is_rahu_kaal) return;

        const { start_time, end_time } = panchang.rahu_kaal;

        console.log(`⚠️ Rahu Kaal: ${start_time} - ${end_time}`);
        console.log('NON-CRITICAL sensors will pause during inauspicious period');

        // Parse times
        const startHour = parseInt(start_time.split(':')[0]);
        const endHour = parseInt(end_time.split(':')[0]);

        // Block non-critical readings during Rahu Kaal
        this.rahuKaalBlock = { start: startHour, end: endHour };
    }

    async performDharmicReading(sensorType, isAbhijit = false) {
        const config = this.sensorTypes[sensorType];

        // Check if currently in Rahu Kaal
        const now = new Date();
        if (this.isRahuKaal(now) && !this.isCriticalSensor(sensorType)) {
            console.log(`⏸️ Skipping ${sensorType} reading during Rahu Kaal`);
            return;
        }

        console.log(`\n🕉️ Performing Dharmic reading for ${sensorType}`);
        console.log(`Element: ${config.element} | Deity: ${config.deity}`);

        if (isAbhijit) {
            console.log('✨ Reading during ABHIJIT MUHURAT - Highly blessed time');
        }

        try {
            // Step 1: Offer digital mantra (invoke deity)
            await this.offerMantra(config.mantra, sensorType);

            // Step 2: Request reading from sensor
            const reading = await this.requestSensorReading(sensorType);

            // Step 3: Validate with Dharmic principles
            const validated = this.validateReadingDharmically(
                reading,
                sensorType,
                isAbhijit
            );

            // Step 4: Store with metadata
            await this.storeReading({
                ...validated,
                sensor_type: sensorType,
                timestamp: new Date().toISOString(),
                element: config.element,
                deity: config.deity,
                abhijit_reading: isAbhijit,
                dharmic_quality: 'auspicious'
            });

            // Step 5: Trigger alerts if needed
            await this.checkThresholdsAndAlert(validated, sensorType);

            console.log(`✅ ${sensorType} reading complete and blessed`);

        } catch (error) {
            console.error(`❌ Error in ${sensorType} reading:`, error);

            // Log failure with Dharmic note
            this.activationLog.push({
                sensor_type: sensorType,
                timestamp: new Date(),
                status: 'failed',
                note: 'May retry during next auspicious time'
            });
        }
    }

    async offerMantra(mantra, sensorType) {
        // Digital mantra offering before sensor activation
        console.log(`🙏 Offering mantra: ${mantra}`);

        // Log mantra offering
        this.activationLog.push({
            type: 'mantra_offering',
            mantra: mantra,
            sensor_type: sensorType,
            timestamp: new Date()
        });

        // Wait symbolic moment (108ms for 108 beads of mala)
        await new Promise(resolve => setTimeout(resolve, 108));
    }

    async requestSensorReading(sensorType) {
        // Publish MQTT request to sensor
        const topic = `sensors/${sensorType}/command`;
        const command = {
            action: 'read',
            dharmic_mode: true,
            timestamp: new Date().toISOString()
        };

        // Send command
        this.mqttClient.publish(topic, JSON.stringify(command));

        // Wait for response (with timeout)
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Sensor timeout'));
            }, 30000);  // 30 second timeout

            // Listen for response
            const responseHandler = (topic, message) => {
                if (topic === `sensors/${sensorType}/data`) {
                    clearTimeout(timeout);
                    this.mqttClient.removeListener('message', responseHandler);

                    try {
                        const data = JSON.parse(message.toString());
                        resolve(data);
                    } catch (error) {
                        reject(error);
                    }
                }
            };

            this.mqttClient.on('message', responseHandler);
        });
    }

    validateReadingDharmically(reading, sensorType, isAbhijit) {
        // Apply Dharmic validation principles

        // Readings during Abhijit are considered most accurate
        const reliability = isAbhijit ? 1.0 : 0.95;

        // Check if reading is within natural bounds per Vedic science
        const naturalBounds = this.getNaturalBounds(sensorType);
        const withinBounds = this.isWithinBounds(reading, naturalBounds);

        // Panchamahabhuta interpretation
        const elementalInterpretation = this.interpretElementally(
            reading,
            sensorType
        );

        return {
            ...reading,
            reliability_score: reliability,
            within_natural_bounds: withinBounds,
            elemental_interpretation: elementalInterpretation,
            dharmic_validation: 'passed'
        };
    }

    getNaturalBounds(sensorType) {
        // Define natural bounds based on Vedic understanding
        const bounds = {
            air_quality: {
                min: 0,   // Pure Vayu
                max: 500, // Heavily polluted
                ideal: 50 // As per Ayurvedic air quality
            },
            water_quality: {
                min: 0,
                max: 1000,  // TDS in ppm
                ideal: 50   // Pure Jala as per Vedas
            },
            soil_quality: {
                min: 0,
                max: 100,
                ideal: 70   // Fertile Prithvi
            },
            temperature: {
                min: -10,
                max: 50,    // Celsius
                ideal: 22   // As per Ayurveda for health
            },
            sound_level: {
                min: 0,
                max: 140,   // dB
                ideal: 40   // Peaceful Akasha
            }
        };

        return bounds[sensorType] || { min: 0, max: 100, ideal: 50 };
    }

    isWithinBounds(reading, bounds) {
        const value = reading.value || reading.raw_value;
        return value >= bounds.min && value <= bounds.max;
    }

    interpretElementally(reading, sensorType) {
        const config = this.sensorTypes[sensorType];
        const value = reading.value || reading.raw_value;
        const bounds = this.getNaturalBounds(sensorType);

        // Calculate how close to ideal
        const deviationFromIdeal = Math.abs(value - bounds.ideal);
        const maxDeviation = Math.max(
            bounds.ideal - bounds.min,
            bounds.max - bounds.ideal
        );
        const normalizedDeviation = deviationFromIdeal / maxDeviation;

        // Interpret based on element
        let interpretation = '';

        if (normalizedDeviation < 0.2) {
            interpretation = `${config.element} is in perfect balance - Excellent state`;
        } else if (normalizedDeviation < 0.4) {
            interpretation = `${config.element} is mostly balanced - Good state`;
        } else if (normalizedDeviation < 0.6) {
            interpretation = `${config.element} shows imbalance - Moderate concern`;
        } else {
            interpretation = `${config.element} is significantly imbalanced - Action needed`;
        }

        return {
            element: config.element,
            interpretation: interpretation,
            balance_score: (1 - normalizedDeviation) * 100,
            deity_invocation: `Invoke ${config.deity} for balance`
        };
    }

    async storeReading(validatedReading) {
        // Store in database with Dharmic metadata
        const db = await this.getDatabase();

        await db.collection('sensor_readings').insertOne({
            ...validatedReading,
            vedic_metadata: {
                recorded_during_abhijit: validatedReading.abhijit_reading,
                element_balance: validatedReading.elemental_interpretation.balance_score,
                dharmic_quality: validatedReading.dharmic_quality
            }
        });

        // Also store in time-series database for analytics
        await this.storeTimeSeries(validatedReading);
    }

    async checkThresholdsAndAlert(reading, sensorType) {
        const bounds = this.getNaturalBounds(sensorType);
        const value = reading.value || reading.raw_value;

        // Check if outside safe bounds
        if (value < bounds.min || value > bounds.max * 0.8) {
            console.log(`⚠️ ${sensorType} reading outside safe bounds!`);

            // Send alert with Dharmic recommendation
            await this.sendDharmicAlert({
                sensor_type: sensorType,
                current_value: value,
                ideal_value: bounds.ideal,
                element: this.sensorTypes[sensorType].element,
                recommendation: this.getDharmicRecommendation(sensorType, value, bounds)
            });
        }
    }

    getDharmicRecommendation(sensorType, currentValue, bounds) {
        const config = this.sensorTypes[sensorType];

        if (currentValue < bounds.ideal) {
            return {
                issue: `${config.element} element is deficient`,
                remedy: `Perform ${config.element} enhancement rituals`,
                mantra: config.mantra,
                practical_action: this.getPracticalAction(sensorType, 'low')
            };
        } else {
            return {
                issue: `${config.element} element is excessive`,
                remedy: `Balance with complementary element`,
                mantra: config.mantra,
                practical_action: this.getPracticalAction(sensorType, 'high')
            };
        }
    }

    getPracticalAction(sensorType, condition) {
        const actions = {
            air_quality: {
                low: 'Ensure proper ventilation, open windows during Brahma Muhurta',
                high: 'Install air purifier, perform Agnihotra (fire ritual)'
            },
            water_quality: {
                low: 'Install water purification, offer prayers to Varuna',
                high: 'Check for contamination, perform water blessing ritual'
            },
            soil_quality: {
                low: 'Add organic compost, perform Bhumi Puja',
                high: 'Test for contaminants, sprinkle Panchagavya'
            },
            temperature: {
                low: 'Improve insulation, light sacred fire',
                high: 'Enhance shade, install cooling, spray water facing East'
            },
            sound_level: {
                low: 'Normal - maintain peaceful environment',
                high: 'Reduce noise sources, chant Om for 108 times'
            }
        };

        return actions[sensorType]?.[condition] || 'Consult Vastu expert';
    }

    async sendDharmicAlert(alertData) {
        // Send to property owner/manager with Dharmic framing
        console.log('\n🔔 DHARMIC ALERT');
        console.log('═══════════════════════════════════════');
        console.log(`Sensor: ${alertData.sensor_type}`);
        console.log(`Element: ${alertData.element}`);
        console.log(`Current: ${alertData.current_value}`);
        console.log(`Ideal: ${alertData.ideal_value}`);
        console.log('\nDharmic Recommendation:');
        console.log(`Issue: ${alertData.recommendation.issue}`);
        console.log(`Remedy: ${alertData.recommendation.remedy}`);
        console.log(`Mantra: ${alertData.recommendation.mantra}`);
        console.log(`Action: ${alertData.recommendation.practical_action}`);
        console.log('═══════════════════════════════════════\n');

        // Would send via notification system
        // Email, SMS, push notification with above content
    }

    isRahuKaal(datetime) {
        if (!this.rahuKaalBlock) return false;

        const hour = datetime.getHours();
        return hour >= this.rahuKaalBlock.start && hour < this.rahuKaalBlock.end;
    }

    isCriticalSensor(sensorType) {
        // Critical sensors that must read even during Rahu Kaal
        const critical = ['air_quality', 'temperature'];
        return critical.includes(sensorType);
    }

    async scheduleHighFrequencyReading(sensorType) {
        // On auspicious days, read more frequently
        console.log(`📈 Increased frequency for ${sensorType} on auspicious nakshatra`);

        // Schedule every 3 hours instead of daily
        for (let hour = 6; hour < 21; hour += 3) {
            schedule.scheduleJob(`0 0 ${hour} * * *`, async () => {
                await this.performDharmicReading(sensorType);
            });
        }
    }

    processSensorData(topic, message) {
        // Process incoming MQTT sensor data
        try {
            const data = JSON.parse(message.toString());
            console.log(`📡 Received data from ${topic}:`, data);

            // Store and process
            this.sensors.set(topic, {
                last_reading: data,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error processing sensor data:', error);
        }
    }

    // Utility methods
    async getPropertyLocation() {
        // Would fetch from database
        return { lat: 28.6139, lng: 77.2090 };  // Delhi example
    }

    getDefaultSchedule() {
        // Fallback schedule if Panchang unavailable
        return {
            nakshatra: 'Unknown',
            tithi: 'Unknown',
            abhijit_muhurat: { start_time: '12:00', end_time: '12:48' },
            rahu_kaal: { start_time: '15:00', end_time: '16:30', is_rahu_kaal: true }
        };
    }

    async getDatabase() {
        // Return MongoDB connection
        const { MongoClient } = require('mongodb');
        const client = await MongoClient.connect('mongodb://localhost:27017');
        return client.db('realestate');
    }

    async storeTimeSeries(reading) {
        // Store in TimescaleDB for time-series analytics
        // Implementation...
    }
}

// Initialize and start the Dharmic IoT system
const dharmicIoT = new DharmicIoTController();

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        🕉️  DHARMIC IoT SYSTEM INITIALIZED  🕉️              ║
║                                                           ║
║  Sensors will activate during auspicious times           ║
║  Following Vedic principles for accurate readings        ║
║                                                           ║
║  Om Tat Sat - May all readings be blessed               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);

module.exports = DharmicIoTController;
