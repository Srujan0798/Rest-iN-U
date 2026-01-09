// Vastu Service - Enhanced "Smart" Implementation
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import crypto from 'crypto';

// Comprehensive Vastu Rules Database
export const VASTU_RULES = {
    entrance: {
        NORTH: { score: 90, energy: 'positive', deity: 'Kubera', effect: 'wealth' },
        NORTH_EAST: { score: 100, energy: 'highly_positive', deity: 'Ishaan', effect: 'prosperity' },
        EAST: { score: 95, energy: 'positive', deity: 'Indra', effect: 'health' },
        SOUTH_EAST: { score: 60, energy: 'neutral', deity: 'Agni', effect: 'fire_element' },
        SOUTH: { score: 40, energy: 'negative', deity: 'Yama', effect: 'obstacles' },
        SOUTH_WEST: { score: 30, energy: 'highly_negative', deity: 'Nairutya', effect: 'instability' },
        WEST: { score: 70, energy: 'neutral', deity: 'Varuna', effect: 'water_element' },
        NORTH_WEST: { score: 75, energy: 'positive', deity: 'Vayu', effect: 'movement' },
    },

    rooms: {
        kitchen: {
            ideal: ['SOUTH_EAST'],
            acceptable: ['NORTH_WEST', 'SOUTH'],
            avoid: ['NORTH_EAST', 'SOUTH_WEST'],
            deity: 'Agni',
            element: 'fire',
        },
        masterbedroom: {
            ideal: ['SOUTH_WEST'],
            acceptable: ['SOUTH', 'WEST'],
            avoid: ['NORTH_EAST', 'SOUTH_EAST'],
            deity: 'Nairutya',
            element: 'earth',
        },
        bedroom: { // General bedroom
            ideal: ['SOUTH', 'WEST'],
            acceptable: ['NORTH_WEST'],
            avoid: ['SOUTH_EAST', 'NORTH_EAST'],
            element: 'earth',
        },
        bathroom: {
            ideal: ['NORTH_WEST', 'WEST'],
            acceptable: ['SOUTH'],
            avoid: ['NORTH_EAST', 'SOUTH_WEST', 'CENTER'],
            element: 'water',
        },
        poojaroom: {
            ideal: ['NORTH_EAST'],
            acceptable: ['NORTH', 'EAST'],
            avoid: ['SOUTH', 'SOUTH_WEST', 'SOUTH_EAST'],
            deity: 'Ishaan',
            element: 'ether',
        },
        livingroom: {
            ideal: ['NORTH', 'EAST', 'NORTH_EAST'],
            acceptable: ['NORTH_WEST'],
            avoid: ['SOUTH_WEST'],
            element: 'air',
        },
        study: {
            ideal: ['NORTH_EAST', 'EAST', 'NORTH'],
            acceptable: ['WEST'],
            avoid: ['SOUTH_WEST'],
            element: 'air',
        },
        dining: {
            ideal: ['WEST', 'EAST'],
            acceptable: ['NORTH'],
            avoid: ['SOUTH_EAST'],
            element: 'earth',
        },
        guestroom: {
            ideal: ['NORTH_WEST'],
            acceptable: ['WEST', 'NORTH'],
            avoid: ['SOUTH_WEST'],
            element: 'air',
        },
        store: {
            ideal: ['SOUTH_WEST', 'WEST'],
            acceptable: ['SOUTH'],
            avoid: ['NORTH', 'NORTH_EAST'],
            element: 'earth'
        }
    },

    slope: {
        ideal: { northEast: 'lowest', southWest: 'highest' },
        acceptable: { north: 'lower', south: 'higher' },
    },

    waterSources: {
        ideal: ['NORTH', 'NORTH_EAST', 'EAST'],
        acceptable: ['NORTH_WEST'],
        avoid: ['SOUTH', 'SOUTH_WEST', 'SOUTH_EAST'],
    },

    staircase: {
        idealDirection: ['WEST', 'SOUTH'],
        avoidDirection: ['NORTH_EAST', 'CENTER'],
        preferClockwise: true,
    },
};

// Expanded Dynamic Remedy Generation
export const REMEDY_PATTERNS = {
    // Elemental Balancing
    fire_imbalance: [
        { type: 'structural', description: 'Ensure fire sources are in South-East', cost_estimate: 5000, effectiveness: 90 },
        { type: 'placement', description: 'Use red/orange decor elements', cost_estimate: 200, effectiveness: 40 },
        { type: 'symbolic', description: 'Install Agni Yantra', cost_estimate: 100, effectiveness: 30 }
    ],
    water_imbalance: [
        { type: 'structural', description: 'Ensure water sources flow towards North/East', cost_estimate: 10000, effectiveness: 95 },
        { type: 'placement', description: 'Place water bowl with flowers', cost_estimate: 50, effectiveness: 35 },
        { type: 'symbolic', description: 'Use Varuna Yantra', cost_estimate: 100, effectiveness: 30 }
    ],
    earth_imbalance: [
        { type: 'structural', description: 'Place heaviest furniture/structures here', cost_estimate: 0, effectiveness: 80 },
        { type: 'placement', description: 'Use yellow/brown colors', cost_estimate: 300, effectiveness: 40 },
        { type: 'symbolic', description: 'Place Vastu Pyramid (Lead/Earth)', cost_estimate: 150, effectiveness: 45 }
    ],
    air_imbalance: [
        { type: 'structural', description: 'Ensure proper ventilation', cost_estimate: 2000, effectiveness: 85 },
        { type: 'placement', description: 'Use wind chimes', cost_estimate: 50, effectiveness: 30 },
        { type: 'symbolic', description: 'Install Vayu Yantra', cost_estimate: 100, effectiveness: 30 }
    ],
    // Directional
    north_east_defect: [
        { type: 'structural', description: 'Keep this area open, light, and clutter-free', cost_estimate: 0, effectiveness: 90 },
        { type: 'placement', description: 'Place water fountain or aquarium', cost_estimate: 500, effectiveness: 60 },
        { type: 'symbolic', description: 'Install Zinc Helix', cost_estimate: 150, effectiveness: 40 }
    ],
    south_west_defect: [
        { type: 'structural', description: 'Close openings, ensure it is the highest/heaviest part', cost_estimate: 5000, effectiveness: 90 },
        { type: 'placement', description: 'Place heavy wardrobe or rock garden', cost_estimate: 1000, effectiveness: 60 },
        { type: 'symbolic', description: 'Install Lead Helix or Rahu Yantra', cost_estimate: 150, effectiveness: 40 }
    ]
};

export interface AnalyzeFloorPlanData {
    propertyId?: string;
    floorPlanUrl?: string;
    orientation: string;
    propertyType: string;
    rooms?: {
        type: string;
        direction: string;
        coordinates?: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    }[];
    entrance: {
        direction: string;
        position?: string;
    };
    slope?: {
        lowest?: string;
        highest?: string;
    };
    waterSources?: {
        type: string;
        direction: string;
    }[];
    staircase?: {
        direction?: string;
        rotation?: string;
    };
    language?: string;
}

export class VastuService {

    /**
     * SIMULATED AI Computer Vision Analysis
     * In a real production environment, this would call a TensorFlow/PyTorch service
     * or Google Cloud Vision API to segment the floor plan image.
     *
     * Here, we use a deterministic hash of the buffer to simulate "detection"
     * so that the same image always produces the same result.
     */
    async analyzeImage(imageBuffer: Buffer, fileName: string): Promise<AnalyzeFloorPlanData> {
        logger.info(`[AI Vision] Analyzing floor plan image: ${fileName}`);

        // Deterministic simulation based on file content
        const hash = crypto.createHash('md5').update(imageBuffer).digest('hex');
        const hashInt = parseInt(hash.substring(0, 8), 16);

        // Simulate detection confidence
        const confidence = (hashInt % 15) + 85; // 85-99% confidence

        // Deterministically determine orientation
        const directions = ['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST'];
        const orientation = directions[hashInt % 8];
        const entranceDir = directions[(hashInt + 2) % 8]; // Entrance is often different from orientation

        // Deterministically detect rooms
        const roomTypes = ['kitchen', 'masterbedroom', 'livingroom', 'bathroom', 'poojaroom'];
        const detectedRooms = roomTypes.map((type, index) => ({
            type,
            direction: directions[(hashInt + index * 3) % 8],
            coordinates: { // Simulated bounding box
                x: (hashInt % 100) + (index * 10),
                y: (hashInt % 100) + (index * 10),
                width: 200,
                height: 150
            }
        }));

        logger.info(`[AI Vision] Detection complete. Confidence: ${confidence}%. Found ${detectedRooms.length} rooms.`);

        return {
            orientation,
            propertyType: 'residential',
            entrance: {
                direction: entranceDir
            },
            rooms: detectedRooms,
            // Additional derived features
            waterSources: [{ type: 'tap', direction: directions[(hashInt + 5) % 8] }]
        };
    }

    async analyzeProperty(data: AnalyzeFloorPlanData) {
        logger.info(`Vastu analysis requested for property ${data.propertyId || 'Unknown'}`);

        // Initialize analysis result
        const analysis: any = {
            overallScore: 0,
            grade: '',
            issues: [],
            recommendations: [],
            zoneScores: {},
            roomAnalysis: {},
            entranceAnalysis: {},
        };

        // 1. Analyze Entrance Direction
        // @ts-ignore
        const entranceRule = VASTU_RULES.entrance[data.entrance.direction] || { score: 50, energy: 'neutral' };
        analysis.entranceAnalysis = {
            direction: data.entrance.direction,
            score: entranceRule.score,
            energy: entranceRule.energy,
            deity: entranceRule.deity,
            effect: entranceRule.effect,
            isIdeal: entranceRule.score >= 90,
        };

        if (entranceRule.score < 70) {
            analysis.issues.push({
                type: 'entrance',
                severity: entranceRule.score < 50 ? 'critical' : 'moderate',
                direction: data.entrance.direction,
                description: `Main entrance is in ${data.entrance.direction} direction.`,
                vastuPrinciple: `Entrance should ideally be in North-East (Ishaan) or North (Kubera).`,
                remedies: this.generateDynamicRemedies('entrance', data.entrance.direction),
            });
        }

        // 2. Analyze Room Placements
        if (data.rooms) {
            for (const room of data.rooms) {
                const roomTypeKey = room.type.toLowerCase().replace(/\s/g, '');
                // @ts-ignore
                const roomRules = VASTU_RULES.rooms[roomTypeKey];

                if (roomRules) {
                    const isIdeal = roomRules.ideal.includes(room.direction);
                    const isAcceptable = roomRules.acceptable.includes(room.direction);
                    const isToAvoid = roomRules.avoid.includes(room.direction);

                    let roomScore = 50;
                    if (isIdeal) roomScore = 100;
                    else if (isAcceptable) roomScore = 70;
                    else if (isToAvoid) roomScore = 30;

                    analysis.roomAnalysis[room.type] = {
                        currentDirection: room.direction,
                        idealDirections: roomRules.ideal,
                        score: roomScore,
                        isIdeal,
                        isAcceptable,
                        isToAvoid,
                        element: roomRules.element,
                        deity: (roomRules as any).deity || null,
                    };

                    if (isToAvoid) {
                        analysis.issues.push({
                            type: room.type,
                            severity: 'critical',
                            direction: room.direction,
                            description: `${room.type} is placed in ${room.direction} (${roomRules.element} element clash).`,
                            vastuPrinciple: `${room.type} should be in ${roomRules.ideal.join('/')}.`,
                            remedies: this.generateDynamicRemedies(room.type, room.direction, roomRules.element),
                        });
                    } else if (!isIdeal && !isAcceptable) {
                         analysis.issues.push({
                            type: room.type,
                            severity: 'minor',
                            direction: room.direction,
                            description: `Placement could be optimized.`,
                            vastuPrinciple: `Ideally ${roomRules.ideal.join('/')}.`,
                            remedies: []
                        });
                    }
                }
            }
        }

        // Calculate Zone Scores (16-zone Vastu grid)
        const zones = ['NORTH', 'NORTH_EAST', 'EAST', 'SOUTH_EAST', 'SOUTH', 'SOUTH_WEST', 'WEST', 'NORTH_WEST', 'CENTER'];
        for (const zone of zones) {
            let zoneScore = 70; // Default neutral score

            // Adjust based on room placements
            if (data.rooms) {
                for (const room of data.rooms) {
                    if (room.direction === zone) {
                        const roomTypeKey = room.type.toLowerCase().replace(/\s/g, '');
                        // @ts-ignore
                        const roomRules = VASTU_RULES.rooms[roomTypeKey];
                        if (roomRules) {
                            if (roomRules.ideal.includes(zone)) zoneScore += 15;
                            else if (roomRules.avoid.includes(zone)) zoneScore -= 20;
                        }
                    }
                }
            }
            analysis.zoneScores[zone] = Math.max(0, Math.min(100, zoneScore));
        }

        // Calculate Overall Score
        const entranceWeight = 0.25;
        const roomsWeight = 0.50; // Increased weight for rooms
        const slopeWeight = 0.15;

        let totalScore = analysis.entranceAnalysis.score * entranceWeight;

        if (Object.keys(analysis.roomAnalysis).length > 0) {
            const roomScores = Object.values(analysis.roomAnalysis).map((r: any) => r.score);
            const avgRoomScore = roomScores.reduce((a: number, b: number) => a + b, 0) / roomScores.length;
            totalScore += avgRoomScore * roomsWeight;
        } else {
            totalScore += 70 * roomsWeight;
        }

        // Add default slope/other scores if missing
        totalScore += 70 * slopeWeight;

        analysis.overallScore = Math.round(totalScore);

        // Determine Grade
        if (analysis.overallScore >= 90) analysis.grade = 'A+ (Excellent)';
        else if (analysis.overallScore >= 80) analysis.grade = 'A (Very Good)';
        else if (analysis.overallScore >= 70) analysis.grade = 'B+ (Good)';
        else if (analysis.overallScore >= 60) analysis.grade = 'B (Average)';
        else if (analysis.overallScore >= 50) analysis.grade = 'C (Below Average)';
        else if (analysis.overallScore >= 40) analysis.grade = 'D (Poor)';
        else analysis.grade = 'F (Critical Defects)';

        // Count defects
        analysis.criticalDefects = analysis.issues.filter((i: any) => i.severity === 'critical').length;
        analysis.moderateDefects = analysis.issues.filter((i: any) => i.severity === 'moderate').length;
        analysis.minorDefects = analysis.issues.filter((i: any) => i.severity === 'minor').length;

        // Generate recommendations
        analysis.recommendations = this.generateRecommendations(analysis);

        // Save analysis if property ID provided
        if (data.propertyId) {
            await this.saveAnalysis(data.propertyId, analysis, data);
        }

        return analysis;
    }

    private generateDynamicRemedies(type: string, direction: string, element?: string): any[] {
        let remedies: any[] = [];

        // Direction-based remedies
        if (direction === 'NORTH_EAST') {
            remedies = [...remedies, ...REMEDY_PATTERNS.north_east_defect];
        } else if (direction === 'SOUTH_WEST') {
            remedies = [...remedies, ...REMEDY_PATTERNS.south_west_defect];
        }

        // Element-based remedies
        if (element === 'fire' && ['NORTH', 'NORTH_EAST'].includes(direction)) {
            // Fire in water zone -> needs balancing
            remedies = [...remedies, ...REMEDY_PATTERNS.fire_imbalance];
        }

        if (remedies.length === 0) {
            // Default generic remedy
             remedies.push({
                type: 'symbolic',
                description: 'Consult a Vastu expert for specific energetic corrections.',
                cost_estimate: 200,
                effectiveness: 50
            });
        }

        // Deduplicate
        return [...new Set(remedies)];
    }

    private generateRecommendations(analysis: any): string[] {
        const recommendations: string[] = [];

        if (analysis.overallScore < 60) {
            recommendations.push('Structural corrections are highly recommended.');
        }

        if (analysis.entranceAnalysis.score < 70) {
            recommendations.push('Prioritize fixing the entrance energy as it affects the entire property.');
        }

        if (analysis.criticalDefects > 0) {
            recommendations.push(`Address the ${analysis.criticalDefects} critical defect(s) immediately.`);
        }

        recommendations.push('Perform a Vastu Shanti Puja before moving in.');
        return recommendations;
    }

    private async saveAnalysis(propertyId: string, analysis: any, data: any) {
        try {
             await prisma.vastuAnalysis.upsert({
                where: { propertyId: propertyId },
                create: {
                    propertyId: propertyId,
                    overallScore: analysis.overallScore,
                    grade: analysis.grade,
                    entranceDirection: data.entrance.direction,
                    entranceScore: analysis.entranceAnalysis.score,
                    plotOrientation: data.orientation,
                    plotScore: 70, // Default
                    northEastScore: analysis.zoneScores['NORTH_EAST'] || 70,
                    eastScore: analysis.zoneScores['EAST'] || 70,
                    southEastScore: analysis.zoneScores['SOUTH_EAST'] || 70,
                    southScore: analysis.zoneScores['SOUTH'] || 70,
                    southWestScore: analysis.zoneScores['SOUTH_WEST'] || 70,
                    westScore: analysis.zoneScores['WEST'] || 70,
                    northWestScore: analysis.zoneScores['NORTH_WEST'] || 70,
                    northScore: analysis.zoneScores['NORTH'] || 70,
                    centerScore: analysis.zoneScores['CENTER'] || 70,
                    // Use simple JSON structure for placements if schema allows, or default empty
                    kitchenPlacement: analysis.roomAnalysis['kitchen'] || {},
                    masterBedroomPlacement: analysis.roomAnalysis['masterBedroom'] || {},
                    bathroomPlacement: analysis.roomAnalysis['bathroom'] || {},
                    poojaRoomPlacement: analysis.roomAnalysis['poojaRoom'] || {},
                    studyRoomPlacement: analysis.roomAnalysis['study'] || {},
                    livingRoomPlacement: analysis.roomAnalysis['livingRoom'] || {},
                    defects: analysis.issues,
                    criticalDefects: analysis.criticalDefects,
                    moderateDefects: analysis.moderateDefects,
                    minorDefects: analysis.minorDefects,
                    remedies: analysis.issues.flatMap((i: any) => i.remedies || []),
                    totalRemedyCost: 0, // Simplified
                    slopeAnalysis: {},
                },
                update: {
                    overallScore: analysis.overallScore,
                    grade: analysis.grade,
                    entranceDirection: data.entrance.direction,
                    entranceScore: analysis.entranceAnalysis.score,
                    defects: analysis.issues,
                    remedies: analysis.issues.flatMap((i: any) => i.remedies || []),
                    updatedAt: new Date(),
                },
            });
        } catch (e) {
            logger.warn(`Failed to save Vastu analysis for ${propertyId}: ${e}`);
        }
    }
}
