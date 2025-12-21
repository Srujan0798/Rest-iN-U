import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// PET FRIENDLINESS SCORE
// ============================================
router.get('/score/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        const petScore = calculatePetScore(property);

        res.json({
            propertyId,
            petFriendlyScore: petScore.overall,
            grade: petScore.grade,
            breakdown: petScore.breakdown,
            nearbyAmenities: getNearbyPetAmenities(),
            recommendations: getPetRecommendations(petScore)
        });
    } catch (error) {
        console.error('Pet score error:', error);
        res.status(500).json({ error: 'Failed to calculate score' });
    }
});

function calculatePetScore(property: any): any {
    let score = 70;
    const breakdown: any = {};

    // Property type scoring
    if (property.type === 'house' || property.type === 'single-family') {
        score += 20;
        breakdown.propertyType = { score: 95, note: 'Houses are ideal for pets' };
    } else if (property.type === 'townhouse') {
        score += 10;
        breakdown.propertyType = { score: 80, note: 'Good space for pets' };
    } else {
        breakdown.propertyType = { score: 60, note: 'Check pet policies for apartments/condos' };
    }

    // Yard/outdoor space
    const hasYard = property.squareFeet && property.squareFeet > 1500;
    if (hasYard) {
        score += 15;
        breakdown.outdoorSpace = { score: 90, note: 'Yard space available' };
    } else {
        breakdown.outdoorSpace = { score: 50, note: 'Limited outdoor space' };
    }

    // Assumed proximity to parks (would use real data in production)
    breakdown.parkAccess = { score: 75, note: '3 parks within 1 mile' };
    breakdown.vetClinics = { score: 80, note: '2 vet clinics nearby' };
    breakdown.petStores = { score: 85, note: 'Pet stores within 0.5 miles' };

    return {
        overall: Math.min(100, score),
        grade: score >= 85 ? 'A (Excellent for pets)' :
            score >= 70 ? 'B (Good for pets)' :
                score >= 55 ? 'C (Okay for pets)' : 'D (Limited pet friendliness)',
        breakdown
    };
}

function getNearbyPetAmenities(): any {
    return {
        dogParks: [
            { name: 'Central Bark Dog Park', distance: '0.3 mi', features: ['Off-leash', 'Agility equipment', 'Water stations'] },
            { name: 'Riverside Dog Run', distance: '0.8 mi', features: ['Fenced', 'Separate small dog area'] }
        ],
        vetClinics: [
            { name: 'Happy Paws Veterinary', distance: '0.5 mi', rating: 4.8, emergency: true },
            { name: 'Main Street Animal Hospital', distance: '1.2 mi', rating: 4.6, emergency: false }
        ],
        petStores: [
            { name: 'PetSmart', distance: '0.7 mi', services: ['Grooming', 'Training'] },
            { name: 'Local Pet Boutique', distance: '0.4 mi', services: ['Premium food', 'Supplies'] }
        ],
        groomers: [
            { name: 'Pawfect Grooming', distance: '0.6 mi', rating: 4.9 }
        ],
        trainers: [
            { name: 'Good Dog Training', distance: '1.0 mi', services: ['Obedience', 'Puppy classes'] }
        ],
        walkingTrails: [
            { name: 'Riverside Trail', distance: '0.2 mi', length: '2.5 mi', petFriendly: true },
            { name: 'Oak Park Path', distance: '0.5 mi', length: '1.2 mi', petFriendly: true }
        ]
    };
}

function getPetRecommendations(petScore: any): string[] {
    const recs: string[] = [];

    if (petScore.breakdown.outdoorSpace?.score < 70) {
        recs.push('Consider properties with yards or patios for easier pet care');
        recs.push('Nearby dog parks can compensate for limited yard space');
    }

    if (petScore.overall >= 80) {
        recs.push('Great location for pets! Plenty of amenities nearby');
    }

    recs.push('Check HOA/lease agreements for pet policies');
    recs.push('Verify any breed or size restrictions');
    recs.push('Consider proximity to emergency vet clinics');

    return recs;
}

// ============================================
// NEIGHBORHOOD PET POLICIES
// ============================================
router.get('/policies/:neighborhoodId', async (req: Request, res: Response) => {
    try {
        const { neighborhoodId } = req.params;

        res.json({
            neighborhoodId,
            generalPolicies: {
                leashLaws: 'Dogs must be leashed in public areas except designated off-leash parks',
                poopScoopLaw: 'Required - fines up to $250',
                noiseLaws: 'Excessive barking can result in citations'
            },
            hoaCommon: {
                petsAllowed: true,
                breedRestrictions: ['Pit Bulls', 'Rottweilers', 'Dobermans (in some communities)'],
                sizeRestrictions: 'Some HOAs limit to 2 pets or dogs under 50 lbs',
                registrationRequired: true,
                petDeposit: '$200-500 typical'
            },
            rentalPolicies: {
                petDeposit: '$300-800',
                monthlyPetRent: '$25-75',
                commonRestrictions: ['2 pet maximum', 'Weight limits vary', 'Some breeds restricted']
            },
            note: 'Always verify specific policies with property management or HOA'
        });
    } catch (error) {
        console.error('Policies error:', error);
        res.status(500).json({ error: 'Failed to get policies' });
    }
});

// ============================================
// PET-FRIENDLY LISTINGS
// ============================================
router.get('/listings', async (req: Request, res: Response) => {
    try {
        const { city, petType, minScore } = req.query;

        const listings = await prisma.property.findMany({
            where: {
                status: 'active',
                ...(city && { city: city as string })
            },
            take: 20,
            include: {
                photos: { take: 1 }
            }
        });

        // Add pet scores to listings
        const withScores = listings.map(listing => ({
            ...listing,
            petFriendlyScore: 70 + Math.floor(Math.random() * 25),
            petFeatures: [
                'Fenced yard',
                'Near dog park',
                'Pet door installed'
            ].slice(0, Math.floor(Math.random() * 3) + 1)
        }));

        const minScoreNum = parseInt(minScore as string) || 0;
        const filtered = withScores.filter(l => l.petFriendlyScore >= minScoreNum);

        res.json({
            total: filtered.length,
            listings: filtered,
            filters: {
                petType: petType || 'all',
                minScore: minScoreNum,
                city: city || 'all'
            }
        });
    } catch (error) {
        console.error('Listings error:', error);
        res.status(500).json({ error: 'Failed to get listings' });
    }
});

// ============================================
// VET EMERGENCY INFO
// ============================================
router.get('/emergency/:location', async (req: Request, res: Response) => {
    try {
        const { location } = req.params;

        res.json({
            location,
            emergencyVets: [
                {
                    name: 'City Animal Emergency',
                    address: '123 Emergency Lane',
                    phone: '(555) 911-PETS',
                    hours: '24/7',
                    distance: '2.1 mi',
                    services: ['Surgery', 'ICU', 'Toxicology']
                },
                {
                    name: 'VCA Emergency Hospital',
                    address: '456 Vet Way',
                    phone: '(555) 234-5678',
                    hours: '24/7',
                    distance: '3.5 mi',
                    services: ['Surgery', 'Trauma', 'Imaging']
                }
            ],
            poisonControl: {
                aspca: '1-888-426-4435',
                petPoisonHelpline: '1-855-764-7661'
            },
            tips: [
                'Keep vet records easily accessible',
                'Know the route to nearest emergency vet',
                'Have a pet first aid kit ready'
            ]
        });
    } catch (error) {
        console.error('Emergency info error:', error);
        res.status(500).json({ error: 'Failed to get emergency info' });
    }
});

export default router;
