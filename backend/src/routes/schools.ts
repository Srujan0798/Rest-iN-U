import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET SCHOOLS NEAR PROPERTY
// ============================================
router.get('/near/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;
        const { radius, type } = req.query;

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // In production, would call GreatSchools API or similar
        const schools = generateSchoolData(type as string);

        res.json({
            propertyId,
            searchRadius: radius || '5 miles',
            schools,
            summary: {
                totalSchools: schools.length,
                averageRating: Math.round(schools.reduce((a, b) => a + b.rating, 0) / schools.length * 10) / 10,
                topRatedSchool: schools.sort((a, b) => b.rating - a.rating)[0]?.name
            }
        });
    } catch (error) {
        console.error('Schools error:', error);
        res.status(500).json({ error: 'Failed to get schools' });
    }
});

function generateSchoolData(type?: string): any[] {
    const schools = [
        {
            id: 'sch_1',
            name: 'Lincoln Elementary',
            type: 'elementary',
            grades: 'K-5',
            rating: 9,
            distance: 0.4,
            students: 450,
            studentTeacherRatio: 18,
            ratings: {
                academic: 9,
                teachers: 9,
                diversity: 8,
                collegePrep: null
            },
            testScores: {
                math: 85,
                reading: 88
            },
            reviews: 127,
            publicPrivate: 'public'
        },
        {
            id: 'sch_2',
            name: 'Washington Middle School',
            type: 'middle',
            grades: '6-8',
            rating: 8,
            distance: 0.8,
            students: 680,
            studentTeacherRatio: 22,
            ratings: {
                academic: 8,
                teachers: 8,
                diversity: 9,
                collegePrep: 7
            },
            testScores: {
                math: 78,
                reading: 82
            },
            reviews: 95,
            publicPrivate: 'public'
        },
        {
            id: 'sch_3',
            name: 'Central High School',
            type: 'high',
            grades: '9-12',
            rating: 8,
            distance: 1.5,
            students: 1200,
            studentTeacherRatio: 24,
            ratings: {
                academic: 8,
                teachers: 7,
                diversity: 9,
                collegePrep: 8
            },
            testScores: {
                math: 75,
                reading: 80
            },
            graduationRate: 92,
            collegeEnrollment: 78,
            reviews: 203,
            publicPrivate: 'public'
        },
        {
            id: 'sch_4',
            name: 'St. Mary\'s Academy',
            type: 'private',
            grades: 'K-8',
            rating: 10,
            distance: 1.2,
            students: 280,
            studentTeacherRatio: 12,
            ratings: {
                academic: 10,
                teachers: 10,
                diversity: 6,
                collegePrep: 9
            },
            tuition: 15000,
            reviews: 67,
            publicPrivate: 'private'
        },
        {
            id: 'sch_5',
            name: 'Montessori Children\'s House',
            type: 'preschool',
            grades: 'PreK',
            rating: 9,
            distance: 0.6,
            students: 45,
            studentTeacherRatio: 8,
            ratings: {
                academic: 9,
                teachers: 10,
                diversity: 8
            },
            tuition: 12000,
            reviews: 42,
            publicPrivate: 'private'
        }
    ];

    if (type) {
        return schools.filter(s => s.type === type);
    }

    return schools;
}

// ============================================
// GET SCHOOL DETAILS
// ============================================
router.get('/detail/:schoolId', async (req: Request, res: Response) => {
    try {
        const { schoolId } = req.params;

        const schools = generateSchoolData();
        const school = schools.find(s => s.id === schoolId);

        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        res.json({
            ...school,
            programs: ['STEM', 'Arts', 'Music', 'Sports'],
            facilities: ['Library', 'Gym', 'Computer Lab', 'Playground'],
            rankings: {
                state: `Top ${Math.floor(Math.random() * 20 + 10)}%`,
                district: `#${Math.floor(Math.random() * 10 + 1)} of 25`
            },
            demographics: {
                white: 45,
                hispanic: 25,
                black: 15,
                asian: 10,
                other: 5
            },
            recentNews: [
                'Named Blue Ribbon School 2024',
                'New STEM lab opening Fall 2024'
            ]
        });
    } catch (error) {
        console.error('School detail error:', error);
        res.status(500).json({ error: 'Failed to get school details' });
    }
});

// ============================================
// SCHOOL DISTRICT COMPARISON
// ============================================
router.post('/compare-districts', async (req: Request, res: Response) => {
    try {
        const { districtIds } = z.object({
            districtIds: z.array(z.string()).min(2).max(4)
        }).parse(req.body);

        const districts = districtIds.map((id, i) => ({
            id,
            name: [`Springfield School District`, `Oak Valley USD`, `Riverside Academy District`, `Central Schools`][i],
            overallRating: Math.floor(Math.random() * 3) + 7,
            schools: Math.floor(Math.random() * 20) + 10,
            students: Math.floor(Math.random() * 20000) + 5000,
            graduationRate: Math.floor(Math.random() * 15) + 85,
            perPupilSpending: Math.floor(Math.random() * 5000) + 10000,
            testScoreRanking: `Top ${Math.floor(Math.random() * 30 + 10)}%`
        }));

        res.json({
            districts,
            winner: districts.sort((a, b) => b.overallRating - a.overallRating)[0].name,
            comparison: {
                bestGraduationRate: districts.sort((a, b) => b.graduationRate - a.graduationRate)[0].name,
                bestFunding: districts.sort((a, b) => b.perPupilSpending - a.perPupilSpending)[0].name
            }
        });
    } catch (error) {
        console.error('Compare error:', error);
        res.status(500).json({ error: 'Comparison failed' });
    }
});

// ============================================
// SCHOOL BOUNDARY CHECK
// ============================================
router.get('/boundary/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        res.json({
            propertyId,
            assignedSchools: {
                elementary: {
                    name: 'Lincoln Elementary',
                    rating: 9,
                    distance: '0.4 mi'
                },
                middle: {
                    name: 'Washington Middle School',
                    rating: 8,
                    distance: '0.8 mi'
                },
                high: {
                    name: 'Central High School',
                    rating: 8,
                    distance: '1.5 mi'
                }
            },
            districtName: 'Springfield School District',
            districtRating: 8,
            note: 'School assignments may change. Verify with district.'
        });
    } catch (error) {
        console.error('Boundary error:', error);
        res.status(500).json({ error: 'Failed to get boundaries' });
    }
});

export default router;

