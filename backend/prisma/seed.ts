import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create sample users
    const passwordHash = await bcrypt.hash('password123', 12);

    const buyer = await prisma.user.upsert({
        where: { email: 'buyer@example.com' },
        update: {},
        create: {
            email: 'buyer@example.com',
            passwordHash,
            firstName: 'John',
            lastName: 'Buyer',
            phone: '555-0101',
            userType: 'BUYER',
        }
    });

    const agentUser = await prisma.user.upsert({
        where: { email: 'agent@example.com' },
        update: {},
        create: {
            email: 'agent@example.com',
            passwordHash,
            firstName: 'Sarah',
            lastName: 'Agent',
            phone: '555-0202',
            userType: 'AGENT',
        }
    });

    // Create agent profile
    const agent = await prisma.agent.upsert({
        where: { userId: agentUser.id },
        update: {},
        create: {
            userId: agentUser.id,
            licenseNumber: 'RE-123456',
            brokerage: 'Top Realty Group',
            yearsExperience: 8,
            specialties: ['Luxury Homes', 'First-Time Buyers', 'Investment Properties'],
            serviceAreas: ['New York', 'Brooklyn', 'Manhattan'],
            bio: 'Dedicated real estate professional with 8+ years of experience.',
            rating: 4.8,
            reviewCount: 127,
            verified: true,
        }
    });

    // Create neighborhood
    const neighborhood = await prisma.neighborhood.upsert({
        where: { name_city_state: { name: 'Downtown', city: 'New York', state: 'NY' } },
        update: {},
        create: {
            name: 'Downtown',
            city: 'New York',
            state: 'NY',
            medianHomePrice: 520000,
            priceTrend: 0.05,
            crimeIndex: 25,
            walkabilityScore: 85,
            transitScore: 90,
        }
    });

    // Sample properties
    const properties = [
        { street: '123 Main St', city: 'New York', state: 'NY', zip: '10001', price: 485000, beds: 3, baths: 2, sqft: 1800, type: 'HOUSE' as const },
        { street: '456 Park Ave', city: 'New York', state: 'NY', zip: '10002', price: 725000, beds: 4, baths: 3, sqft: 2400, type: 'HOUSE' as const },
        { street: '789 Broadway', city: 'Brooklyn', state: 'NY', zip: '11201', price: 550000, beds: 2, baths: 2, sqft: 1200, type: 'CONDO' as const },
        { street: '321 5th Ave', city: 'Manhattan', state: 'NY', zip: '10016', price: 1200000, beds: 3, baths: 2.5, sqft: 1800, type: 'CONDO' as const },
        { street: '555 Ocean Dr', city: 'Boston', state: 'MA', zip: '02115', price: 680000, beds: 4, baths: 3, sqft: 2200, type: 'HOUSE' as const },
    ];

    for (const p of properties) {
        await prisma.property.upsert({
            where: { mlsId: `MLS-${p.street.replace(/\s/g, '')}` },
            update: {},
            create: {
                mlsId: `MLS-${p.street.replace(/\s/g, '')}`,
                listingAgentId: agent.id,
                street: p.street,
                city: p.city,
                state: p.state,
                zip: p.zip,
                country: 'USA',
                lat: 40.7128 + Math.random() * 0.1,
                lng: -74.006 + Math.random() * 0.1,
                price: p.price,
                propertyType: p.type,
                listingType: 'SALE',
                bedrooms: p.beds,
                bathrooms: p.baths,
                squareFeet: p.sqft,
                yearBuilt: 2010 + Math.floor(Math.random() * 10),
                description: 'Beautiful property in prime location. Modern amenities throughout.',
                features: ['Central Air', 'Hardwood Floors', 'Updated Kitchen', 'Garage'],
                neighborhoodId: neighborhood.id,
                photos: {
                    create: [
                        { url: `https://picsum.photos/800/600?random=${Math.random()}`, caption: 'Front View', order: 0 },
                        { url: `https://picsum.photos/800/600?random=${Math.random()}`, caption: 'Living Room', order: 1 },
                    ]
                }
            }
        });
    }

    console.log('✅ Database seeded successfully!');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
