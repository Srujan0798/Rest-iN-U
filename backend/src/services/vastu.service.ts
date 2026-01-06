// Vastu Service - Clean Implementation
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

// Vastu Rules Database - Comprehensive set of rules from ancient texts
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

// Remedies Database
export const VASTU_REMEDIES = {
  entrance_south_west: [
    {
      type: 'structural',
      description: 'Relocate main entrance to North or East direction',
      cost_estimate: 50000,
      effectiveness: 100,
      difficulty: 'high',
    },
    {
      type: 'placement',
      description: 'Place Ganesha idol outside entrance facing outward',
      cost_estimate: 500,
      effectiveness: 60,
      difficulty: 'low',
    },
    {
      type: 'symbolic',
      description: 'Install Vastu pyramid at entrance, paint door green, hang sacred toran',
      cost_estimate: 200,
      effectiveness: 40,
      difficulty: 'low',
    },
  ],

  kitchen_north_east: [
    {
      type: 'structural',
      description: 'Relocate kitchen to South-East (Agni) direction',
      cost_estimate: 75000,
      effectiveness: 100,
      difficulty: 'high',
    },
    {
      type: 'placement',
      description: 'Place copper vessel with water in kitchen, cook facing East',
      cost_estimate: 100,
      effectiveness: 50,
      difficulty: 'low',
    },
    {
      type: 'symbolic',
      description: 'Install Agni yantra, use red/orange colors in kitchen',
      cost_estimate: 150,
      effectiveness: 35,
      difficulty: 'low',
    },
  ],

  bathroom_north_east: [
    {
      type: 'structural',
      description: 'Convert to prayer room or study, relocate bathroom',
      cost_estimate: 100000,
      effectiveness: 100,
      difficulty: 'high',
    },
    {
      type: 'placement',
      description: 'Keep bathroom door always closed, place sea salt bowl inside',
      cost_estimate: 50,
      effectiveness: 40,
      difficulty: 'low',
    },
    {
      type: 'symbolic',
      description: 'Install mirror on North wall, use light colors, add plants',
      cost_estimate: 200,
      effectiveness: 30,
      difficulty: 'low',
    },
  ],

  bedroom_north_east: [
    {
      type: 'structural',
      description: 'Convert to meditation room or study',
      cost_estimate: 25000,
      effectiveness: 100,
      difficulty: 'medium',
    },
    {
      type: 'placement',
      description: 'Sleep with head towards South, place heavy furniture in South-West',
      cost_estimate: 100,
      effectiveness: 50,
      difficulty: 'low',
    },
  ],

  center_blocked: [
    {
      type: 'structural',
      description: 'Keep Brahmasthan (center) open, remove pillars/walls',
      cost_estimate: 40000,
      effectiveness: 100,
      difficulty: 'high',
    },
    {
      type: 'placement',
      description: 'If unavoidable, place tulsi plant or crystal in center',
      cost_estimate: 100,
      effectiveness: 45,
      difficulty: 'low',
    },
  ],
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
        const entranceRule = VASTU_RULES.entrance[data.entrance.direction];
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
                description: `Main entrance is in ${data.entrance.direction} direction. ${entranceRule.energy === 'highly_negative'
                    ? 'This is considered highly inauspicious and may bring obstacles and instability.'
                    : 'This direction is not ideal for prosperity.'
                    }`,
                vastuPrinciple: `Entrance should ideally be in North-East (Ishaan) or North (Kubera) for prosperity and wealth.`,
                remedies: this.getRemedies('entrance', data.entrance.direction),
            });
        }

        // 2. Analyze Room Placements
        if (data.rooms) {
            for (const room of data.rooms) {
                // @ts-ignore
                const roomRules = VASTU_RULES.rooms[room.type.toLowerCase() as keyof typeof VASTU_RULES.rooms];

                if (roomRules) {
                    const isIdeal = roomRules.ideal.includes(room.direction);
                    const isAcceptable = roomRules.acceptable.includes(room.direction);
                    const isToAvoid = roomRules.avoid.includes(room.direction);

                    let roomScore = 100;
                    if (isIdeal) roomScore = 100;
                    else if (isAcceptable) roomScore = 70;
                    else if (isToAvoid) roomScore = 30;
                    else roomScore = 50;

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
                            description: `${room.type.charAt(0).toUpperCase() + room.type.slice(1)} is placed in ${room.direction} direction, which should be avoided.`,
                            vastuPrinciple: `${room.type.charAt(0).toUpperCase() + room.type.slice(1)} should ideally be in ${roomRules.ideal.join(' or ')} direction.`,
                            remedies: this.getRemedies(room.type, room.direction),
                        });
                    } else if (!isIdeal && !isAcceptable) {
                        analysis.issues.push({
                            type: room.type,
                            severity: 'minor',
                            direction: room.direction,
                            description: `${room.type.charAt(0).toUpperCase() + room.type.slice(1)} placement could be improved.`,
                            vastuPrinciple: `Consider ${roomRules.ideal.join(' or ')} for optimal energy flow.`,
                        });
                    }
                }
            }
        }

        // 3. Analyze Slope
        if (data.slope) {
            const idealSlope = data.slope.lowest === 'NORTH_EAST' && data.slope.highest === 'SOUTH_WEST';
            analysis.slopeAnalysis = {
                current: data.slope,
                isIdeal: idealSlope,
                score: idealSlope ? 100 : 50,
            };

            if (!idealSlope) {
                analysis.issues.push({
                    type: 'slope',
                    severity: 'moderate',
                    description: 'Land slope is not in the ideal Vastu direction.',
                    vastuPrinciple: 'Land should slope from South-West (highest) to North-East (lowest) for prosperity.',
                    remedies: [
                        {
                            type: 'structural',
                            description: 'Grade the land to slope towards North-East',
                            cost_estimate: 20000,
                            effectiveness: 100,
                            difficulty: 'high',
                        },
                        {
                            type: 'placement',
                            description: 'Place heavy elements (boulders, structures) in South-West',
                            cost_estimate: 5000,
                            effectiveness: 60,
                            difficulty: 'medium',
                        },
                    ],
                });
            }
        }

        // 4. Analyze Water Sources
        if (data.waterSources && data.waterSources.length > 0) {
            for (const water of data.waterSources) {
                // @ts-ignore
                const isIdeal = VASTU_RULES.waterSources.ideal.includes(water.direction);
                // @ts-ignore
                const isToAvoid = VASTU_RULES.waterSources.avoid.includes(water.direction);

                if (isToAvoid) {
                    analysis.issues.push({
                        type: 'water_source',
                        severity: 'moderate',
                        direction: water.direction,
                        description: `Water source (${water.type}) is in ${water.direction}, which can disturb energy flow.`,
                        vastuPrinciple: 'Water sources should be in North, North-East, or East for abundance.',
                        remedies: [
                            {
                                type: 'structural',
                                description: 'Relocate water source to North-East or North',
                                cost_estimate: 30000,
                                effectiveness: 100,
                                difficulty: 'high',
                            },
                            {
                                type: 'symbolic',
                                description: 'Place Varuna yantra near water source, add aquatic plants',
                                cost_estimate: 200,
                                effectiveness: 40,
                                difficulty: 'low',
                            },
                        ],
                    });
                }
            }
        }

        // 5. Analyze Staircase
        if (data.staircase) {
            // @ts-ignore
            const isIdealDirection = VASTU_RULES.staircase.idealDirection.includes(data.staircase.direction!);
            // @ts-ignore
            const isToAvoid = VASTU_RULES.staircase.avoidDirection.includes(data.staircase.direction!);
            const isClockwise = data.staircase.rotation === 'CLOCKWISE';

            if (isToAvoid || !isClockwise) {
                analysis.issues.push({
                    type: 'staircase',
                    severity: isToAvoid ? 'critical' : 'minor',
                    description: `Staircase ${isToAvoid ? 'is in ' + data.staircase.direction + ' (should be avoided)' : ''} ${!isClockwise ? 'rotates anticlockwise' : ''}`,
                    vastuPrinciple: 'Staircase should be in South or West, rotating clockwise when ascending.',
                    remedies: [
                        {
                            type: 'placement',
                            description: 'Place a mirror on the North wall of staircase, use light colors',
                            cost_estimate: 500,
                            effectiveness: 40,
                            difficulty: 'low',
                        },
                    ],
                });
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
                        // @ts-ignore
                        const roomRules = VASTU_RULES.rooms[room.type.toLowerCase() as keyof typeof VASTU_RULES.rooms];
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
        const roomsWeight = 0.4;
        const slopeWeight = 0.15;
        const waterWeight = 0.1;
        const staircaseWeight = 0.1;

        let totalScore = analysis.entranceAnalysis.score * entranceWeight;

        if (Object.keys(analysis.roomAnalysis).length > 0) {
            const roomScores = Object.values(analysis.roomAnalysis).map((r: any) => r.score);
            const avgRoomScore = roomScores.reduce((a: number, b: number) => a + b, 0) / roomScores.length;
            totalScore += avgRoomScore * roomsWeight;
        } else {
            totalScore += 70 * roomsWeight; // Default if no rooms specified
        }

        if (analysis.slopeAnalysis) {
            totalScore += analysis.slopeAnalysis.score * slopeWeight;
        } else {
            totalScore += 70 * slopeWeight;
        }

        // Add remaining weights with default scores
        totalScore += 70 * waterWeight;
        totalScore += 70 * staircaseWeight;

        analysis.overallScore = Math.round(totalScore);

        // Determine Grade
        if (analysis.overallScore >= 90) analysis.grade = 'A+';
        else if (analysis.overallScore >= 80) analysis.grade = 'A';
        else if (analysis.overallScore >= 70) analysis.grade = 'B+';
        else if (analysis.overallScore >= 60) analysis.grade = 'B';
        else if (analysis.overallScore >= 50) analysis.grade = 'C';
        else if (analysis.overallScore >= 40) analysis.grade = 'D';
        else analysis.grade = 'F';

        // Count defects by severity
        analysis.criticalDefects = analysis.issues.filter((i: any) => i.severity === 'critical').length;
        analysis.moderateDefects = analysis.issues.filter((i: any) => i.severity === 'moderate').length;
        analysis.minorDefects = analysis.issues.filter((i: any) => i.severity === 'minor').length;

        // Calculate total remedy cost
        analysis.totalRemedyCost = analysis.issues.reduce((total: number, issue: any) => {
            if (issue.remedies) {
                const lowestCostRemedy = issue.remedies.reduce((min: any, r: any) =>
                    r.cost_estimate < min.cost_estimate ? r : min, issue.remedies[0]);
                return total + (lowestCostRemedy?.cost_estimate || 0);
            }
            return total;
        }, 0);

        // Generate recommendations
        analysis.recommendations = this.generateRecommendations(analysis);

        // Save analysis if property ID provided
        if (data.propertyId) {
            await prisma.vastuAnalysis.upsert({
                where: { propertyId: data.propertyId },
                create: {
                    propertyId: data.propertyId,
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
                    totalRemedyCost: analysis.totalRemedyCost,
                    slopeAnalysis: analysis.slopeAnalysis,
                },
                update: {
                    overallScore: analysis.overallScore,
                    grade: analysis.grade,
                    entranceDirection: data.entrance.direction,
                    entranceScore: analysis.entranceAnalysis.score,
                    defects: analysis.issues,
                    criticalDefects: analysis.criticalDefects,
                    moderateDefects: analysis.moderateDefects,
                    minorDefects: analysis.minorDefects,
                    remedies: analysis.issues.flatMap((i: any) => i.remedies || []),
                    totalRemedyCost: analysis.totalRemedyCost,
                    updatedAt: new Date(),
                },
            });
        }

        return analysis;
    }

    private getRemedies(type: string, direction: string): any[] {
        const key = `${type.toLowerCase()}_${direction.toLowerCase()}`;
        // @ts-ignore
        return VASTU_REMEDIES[key] || [
            {
                type: 'symbolic',
                description: 'Consult a Vastu expert for specific remedies',
                cost_estimate: 500,
                effectiveness: 50,
                difficulty: 'low',
            },
        ];
    }

    private generateRecommendations(analysis: any): string[] {
        const recommendations: string[] = [];

        if (analysis.overallScore < 60) {
            recommendations.push('Consider consulting a professional Vastu consultant for structural modifications.');
        }

        if (analysis.entranceAnalysis.score < 70) {
            recommendations.push('Focus on entrance remedies as they have the highest impact on overall energy.');
        }

        if (analysis.criticalDefects > 0) {
            recommendations.push(`Address the ${analysis.criticalDefects} critical defect(s) first for maximum improvement.`);
        }

        if (analysis.zoneScores['NORTH_EAST'] < 60) {
            recommendations.push('North-East (Ishaan) zone needs attention - keep it clean, clutter-free, and well-lit.');
        }

        if (analysis.zoneScores['SOUTH_WEST'] < 60) {
            recommendations.push('Strengthen South-West zone with heavy furniture and earth elements.');
        }

        recommendations.push('Regular space cleansing with camphor or incense improves overall energy.');
        recommendations.push('Ensure adequate natural light and ventilation throughout the property.');

        return recommendations;
    }
}
