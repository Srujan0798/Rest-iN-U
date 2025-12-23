// Database Seed Data
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@restinu.com' },
        update: {},
        create: {
            email: 'admin@restinu.com',
            passwordHash: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            userType: 'ADMIN',
            kycVerified: true,
        },
    });
    console.log('✅ Admin user created');

    // Create test agent
    const agentPassword = await bcrypt.hash('agent123', 12);
    const agentUser = await prisma.user.upsert({
        where: { email: 'agent@restinu.com' },
        update: {},
        create: {
            email: 'agent@restinu.com',
            passwordHash: agentPassword,
            firstName: 'Arjun',
            lastName: 'Sharma',
            phone: '+1-555-123-4567',
            userType: 'AGENT',
            kycVerified: true,
            dateOfBirth: new Date('1985-06-15'),
            birthPlace: 'Mumbai, India',
            doshaType: 'PITTA',
            lifePathNumber: 7,
        },
    });

    const agent = await prisma.agent.upsert({
        where: { userId: agentUser.id },
        update: {},
        create: {
            userId: agentUser.id,
            licenseNumber: 'CA-2024-789456',
            licenseState: 'CA',
            licenseExpiry: new Date('2026-12-31'),
            brokerage: 'REST-iN-U Real Estate Group',
            yearsExperience: 12,
            specialties: ['Luxury Homes', 'Vastu-Compliant Properties', 'Investment Properties'],
            serviceAreas: ['Los Angeles', 'San Francisco', 'San Diego'],
            languages: ['English', 'Hindi', 'Spanish'],
            bio: 'Certified Vastu consultant and real estate specialist with 12 years of experience helping families find their perfect homes aligned with ancient wisdom.',
            rating: 4.8,
            reviewCount: 47,
            subscriptionTier: 'ENLIGHTENED',
            verified: true,
            ethicsScore: 98,
        },
    });
    console.log('✅ Test agent created');

    // Create test buyer
    const buyerPassword = await bcrypt.hash('buyer123', 12);
    const buyer = await prisma.user.upsert({
        where: { email: 'buyer@example.com' },
        update: {},
        create: {
            email: 'buyer@example.com',
            passwordHash: buyerPassword,
            firstName: 'Priya',
            lastName: 'Patel',
            phone: '+1-555-987-6543',
            userType: 'BUYER',
            dateOfBirth: new Date('1990-03-21'),
            doshaType: 'VATA_PITTA',
            lifePathNumber: 3,
        },
    });
    console.log('✅ Test buyer created');

    // Create neighborhoods
    const neighborhoods = await Promise.all([
        prisma.neighborhood.upsert({
            where: { name_city_state: { name: 'Beverly Hills', city: 'Los Angeles', state: 'CA' } },
            update: {},
            create: {
                name: 'Beverly Hills',
                city: 'Los Angeles',
                state: 'CA',
                medianHomePrice: 3500000,
                walkabilityScore: 78,
                transitScore: 45,
                bikeScore: 62,
                crimeIndex: 15,
                schoolRating: 9.2,
            },
        }),
        prisma.neighborhood.upsert({
            where: { name_city_state: { name: 'Palo Alto', city: 'Palo Alto', state: 'CA' } },
            update: {},
            create: {
                name: 'Downtown',
                city: 'Palo Alto',
                state: 'CA',
                medianHomePrice: 4200000,
                walkabilityScore: 92,
                transitScore: 65,
                bikeScore: 95,
                crimeIndex: 8,
                schoolRating: 9.5,
            },
        }),
    ]);
    console.log('✅ Neighborhoods created');

    // Create sample properties
    const properties = await Promise.all([
        prisma.property.create({
            data: {
                title: 'Vastu-Perfect Luxury Villa with Ocean Views',
                description: 'Stunning 5-bedroom villa designed according to Vastu Shastra principles. Northeast entrance brings positive energy, master bedroom in Southwest for stability. Features include Italian marble flooring, gourmet kitchen, infinity pool, and meditation garden. Solar panels and smart home automation included.',
                propertyType: 'VILLA',
                listingType: 'SALE',
                status: 'ACTIVE',
                streetAddress: '123 Ocean View Drive',
                city: 'Malibu',
                state: 'CA',
                zipCode: '90265',
                latitude: 34.0259,
                longitude: -118.7798,
                price: 4850000,
                originalPrice: 5000000,
                pricePerSqft: 850,
                bedrooms: 5,
                bathrooms: 4.5,
                squareFeet: 5700,
                lotSizeAcres: 0.75,
                yearBuilt: 2020,
                stories: 2,
                parkingSpaces: 3,
                garageSpaces: 3,
                features: ['Pool', 'Smart Home', 'Solar Panels', 'Wine Cellar', 'Home Theater', 'Ocean View'],
                amenities: ['Gated Community', 'Private Beach Access', '24/7 Security'],
                flooring: ['Marble', 'Hardwood'],
                heating: ['Central'],
                cooling: ['Central Air'],
                roofType: 'Tile',
                exteriorMaterial: 'Stucco',
                listingAgentId: agent.id,
                neighborhoodId: neighborhoods[0].id,
            },
        }),
        prisma.property.create({
            data: {
                title: 'Modern Condo with Perfect Feng Shui Balance',
                description: 'Beautifully designed 2-bedroom condo with feng shui-optimized layout. Open floor plan with excellent chi flow. Floor-to-ceiling windows face East for morning sun. Kitchen in Southeast sector. Building features rooftop garden and meditation center.',
                propertyType: 'CONDO',
                listingType: 'SALE',
                status: 'ACTIVE',
                streetAddress: '456 Harmony Lane, Unit 12A',
                city: 'San Francisco',
                state: 'CA',
                zipCode: '94102',
                latitude: 37.7749,
                longitude: -122.4194,
                price: 1250000,
                pricePerSqft: 1041,
                bedrooms: 2,
                bathrooms: 2,
                squareFeet: 1200,
                yearBuilt: 2019,
                stories: 1,
                parkingSpaces: 1,
                garageSpaces: 1,
                features: ['Bamboo Floors', 'Quartz Counters', 'In-Unit Laundry', 'City View'],
                amenities: ['Rooftop Garden', 'Gym', 'Meditation Room', 'Concierge'],
                flooring: ['Bamboo', 'Tile'],
                heating: ['Central'],
                cooling: ['Central Air'],
                hoaFee: 850,
                hoaFrequency: 'Monthly',
                listingAgentId: agent.id,
            },
        }),
        prisma.property.create({
            data: {
                title: 'Spiritual Retreat Farmhouse on Sacred Land',
                description: 'Historic farmhouse on 5 acres of land with documented positive earth energy. Property features ancient oak trees, natural spring, and ley line intersection. Includes yoga studio, organic garden, and guest cottage. Perfect for Ayurvedic lifestyle.',
                propertyType: 'FARMHOUSE',
                listingType: 'SALE',
                status: 'ACTIVE',
                streetAddress: '789 Sacred Valley Road',
                city: 'Ojai',
                state: 'CA',
                zipCode: '93023',
                latitude: 34.4557,
                longitude: -119.2257,
                price: 2750000,
                pricePerSqft: 687,
                bedrooms: 4,
                bathrooms: 3,
                squareFeet: 4000,
                lotSizeAcres: 5,
                yearBuilt: 1925,
                stories: 2,
                parkingSpaces: 4,
                features: ['Yoga Studio', 'Organic Garden', 'Natural Spring', 'Guest House', 'Mountain Views'],
                amenities: ['Private', 'Meditation Garden', 'Fruit Orchard'],
                flooring: ['Hardwood', 'Terra Cotta'],
                heating: ['Radiant Floor'],
                cooling: ['Evaporative'],
                exteriorMaterial: 'Adobe',
                listingAgentId: agent.id,
            },
        }),
    ]);
    console.log(`✅ ${properties.length} sample properties created`);

    // Add Vastu analysis to first property
    await prisma.vastuAnalysis.create({
        data: {
            propertyId: properties[0].id,
            overallScore: 92,
            grade: 'A',
            entranceDirection: 'NORTHEAST',
            entranceScore: 100,
            plotOrientation: 'North-South',
            plotScore: 95,
            northEastScore: 98,
            eastScore: 90,
            southEastScore: 85,
            southScore: 88,
            southWestScore: 95,
            westScore: 88,
            northWestScore: 82,
            northScore: 92,
            centerScore: 100,
            kitchenPlacement: { direction: 'SOUTHEAST', score: 95, ideal: true },
            masterBedroomPlacement: { direction: 'SOUTHWEST', score: 100, ideal: true },
            bathroomPlacement: { direction: 'NORTHWEST', score: 90, ideal: true },
            poojaRoomPlacement: { direction: 'NORTHEAST', score: 100, ideal: true },
            studyRoomPlacement: { direction: 'NORTH', score: 85, ideal: true },
            livingRoomPlacement: { direction: 'EAST', score: 90, ideal: true },
            defects: [],
            criticalDefects: 0,
            moderateDefects: 0,
            minorDefects: 2,
            remedies: [
                { type: 'enhancement', action: 'Add water feature in North', cost: 500 },
            ],
        },
    });
    console.log('✅ Vastu analysis added');

    // Add climate analysis
    await prisma.climateAnalysis.create({
        data: {
            propertyId: properties[0].id,
            overallRiskScore: 35,
            riskGrade: 'B',
            currentFloodZone: 'X',
            floodRisk2030: 15,
            floodRisk2050: 22,
            floodRisk2075: 35,
            floodRisk2100: 48,
            seaLevelRiseCm: [{ year: 2030, cm: 5 }, { year: 2050, cm: 15 }, { year: 2100, cm: 40 }],
            wildfireRisk: 45,
            hurricaneRisk: 10,
            tornadoRisk: 5,
            currentExtremeDays: 18,
            projectedExtreme2050: 32,
            seismicRisk: 55,
            insuranceCurrent: 3200,
            insurance2030: 4100,
            insurance2050: 5800,
            insurabilityStatus: 'Standard',
            mitigationStrategies: [
                { type: 'wildfire', action: 'Maintain defensible space', cost: 2000, riskReduction: 15 },
            ],
            dataSources: ['FEMA', 'NOAA', 'CalFire'],
        },
    });
    console.log('✅ Climate analysis added');

    // Create karmic scores for users
    await Promise.all([
        prisma.karmicScore.upsert({
            where: { userId: admin.id },
            update: {},
            create: {
                userId: admin.id,
                overallScore: 950,
                honestyScore: 100,
                responsivenessScore: 100,
                fairnessScore: 100,
                communityScore: 100,
                environmentalScore: 100,
                badges: ['Founding Member', 'Verified Admin'],
            },
        }),
        prisma.karmicScore.upsert({
            where: { userId: agentUser.id },
            update: {},
            create: {
                userId: agentUser.id,
                overallScore: 875,
                honestyScore: 95,
                responsivenessScore: 98,
                fairnessScore: 90,
                communityScore: 85,
                environmentalScore: 80,
                totalTransactions: 47,
                avgRating: 4.8,
                badges: ['Top Agent 2024', 'Vastu Expert', 'Community Leader'],
            },
        }),
        prisma.karmicScore.upsert({
            where: { userId: buyer.id },
            update: {},
            create: {
                userId: buyer.id,
                overallScore: 500,
                honestyScore: 100,
                responsivenessScore: 100,
                fairnessScore: 100,
                communityScore: 100,
                environmentalScore: 100,
                badges: ['New Member'],
            },
        }),
    ]);
    console.log('✅ Karmic scores created');

    // Create token balances
    await Promise.all([
        prisma.tokenBalance.upsert({
            where: { userId: admin.id },
            update: {},
            create: { userId: admin.id, balance: 10000 },
        }),
        prisma.tokenBalance.upsert({
            where: { userId: agentUser.id },
            update: {},
            create: { userId: agentUser.id, balance: 2500 },
        }),
        prisma.tokenBalance.upsert({
            where: { userId: buyer.id },
            update: {},
            create: { userId: buyer.id, balance: 100 },
        }),
    ]);
    console.log('✅ Token balances created');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nTest accounts:');
    console.log('  Admin: admin@restinu.com / admin123');
    console.log('  Agent: agent@restinu.com / agent123');
    console.log('  Buyer: buyer@example.com / buyer123');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

