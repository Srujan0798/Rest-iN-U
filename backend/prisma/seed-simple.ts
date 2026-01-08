// Simplified Database Seed - Fixed for actual schema
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting simplified seeding...');

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
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create test user
    const userPassword = await bcrypt.hash('user123', 12);
    const testUser = await prisma.user.upsert({
        where: { email: 'user@restinu.com' },
        update: {},
        create: {
            email: 'user@restinu.com',
            passwordHash: userPassword,
            firstName: 'Test',
            lastName: 'User',
            userType: 'BUYER',
        },
    });
    console.log('✅ Test user created:', testUser.email);

    // Create agent user
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
        },
    });
    console.log('✅ Agent user created:', agentUser.email);

    // Create agent profile
    const agent = await prisma.agent.upsert({
        where: { userId: agentUser.id },
        update: {},
        create: {
            userId: agentUser.id,
            licenseNumber: 'CA-DRE-12345678',
            licenseState: 'California',
            licenseExpiry: new Date('2027-12-31'),
            brokerage: 'REST-iN-U Realty',
            brokerageAddress: '123 Main St, San Francisco, CA 94102',
            yearsExperience: 10,
            specialties: ['Residential', 'Vastu Consulting', 'Luxury Homes'],
            bio: 'Experienced real estate agent specializing in properties with excellent Vastu compliance.',
            verified: true,
            subscriptionTier: 'DHARMA',  // Fixed: Use DHARMA instead of PREMIUM
        },
    });
    console.log('✅ Agent profile created');

    // Create sample properties
    const property1 = await prisma.property.create({
        data: {
            title: 'Modern Vastu-Compliant Villa',
            description: 'Beautiful 4-bedroom villa with perfect Vastu alignment. South-facing entrance with optimal energy flow.',
            propertyType: 'HOUSE',
            listingType: 'SALE',
            status: 'ACTIVE',
            price: 1250000,
            streetAddress: '456 Harmony Lane',  // Fixed: use streetAddress
            city: 'San Francisco',
            state: 'California',
            zipCode: '94102',
            country: 'USA',
            latitude: 37.7749,
            longitude: -122.4194,
            bedrooms: 4,
            bathrooms: 3,
            squareFeet: 2800,
            lotSizeAcres: 0.12,
            yearBuilt: 2020,
            features: ['Solar Panels', 'Smart Home', 'Garden', 'Pool'],
            listingAgentId: agent.id,
        },
    });
    console.log('✅ Property 1 created:', property1.title);

    const property2 = await prisma.property.create({
        data: {
            title: 'Feng Shui Penthouse with Bay Views',
            description: 'Luxurious penthouse designed with Feng Shui principles. Panoramic bay views and optimal Chi flow.',
            propertyType: 'PENTHOUSE',
            listingType: 'SALE',
            status: 'ACTIVE',
            price: 2500000,
            streetAddress: '789 Skyline Tower',
            city: 'San Francisco',
            state: 'California',
            zipCode: '94105',
            country: 'USA',
            latitude: 37.7849,
            longitude: -122.3994,
            bedrooms: 3,
            bathrooms: 2,
            squareFeet: 2200,
            yearBuilt: 2022,
            features: ['Concierge', 'Gym', 'Rooftop Access', 'Parking'],
            listingAgentId: agent.id,
        },
    });
    console.log('✅ Property 2 created:', property2.title);

    const property3 = await prisma.property.create({
        data: {
            title: 'Eco-Friendly Smart Home',
            description: 'Sustainable living with IoT integration. Energy efficient with climate monitoring system.',
            propertyType: 'HOUSE',
            listingType: 'SALE',
            status: 'ACTIVE',
            price: 895000,
            streetAddress: '321 Green Valley Road',
            city: 'Oakland',
            state: 'California',
            zipCode: '94612',
            country: 'USA',
            latitude: 37.8044,
            longitude: -122.2712,
            bedrooms: 3,
            bathrooms: 2,
            squareFeet: 1800,
            lotSizeAcres: 0.08,
            yearBuilt: 2021,
            features: ['Solar', 'EV Charging', 'Smart Thermostat', 'Garden'],
            listingAgentId: agent.id,
        },
    });
    console.log('✅ Property 3 created:', property3.title);

    console.log('');
    console.log('🎉 Seeding completed successfully!');
    console.log('');
    console.log('📋 Test Accounts:');
    console.log('   Admin: admin@restinu.com / admin123');
    console.log('   Agent: agent@restinu.com / agent123');
    console.log('   User:  user@restinu.com / user123');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
