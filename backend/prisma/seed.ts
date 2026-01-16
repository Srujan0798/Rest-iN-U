import { PrismaClient, PropertyType, ListingType, PropertyStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123456', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@restinu.com' },
    update: {},
    create: {
      email: 'demo@restinu.com',
      passwordHash: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      userType: 'BUYER',
      emailVerified: true,
    },
  });
  console.log('✅ Demo user created:', demoUser.email);

  // Create demo agent user
  const agentUser = await prisma.user.upsert({
    where: { email: 'agent@restinu.com' },
    update: {},
    create: {
      email: 'agent@restinu.com',
      passwordHash: hashedPassword,
      firstName: 'Arjun',
      lastName: 'Patel',
      userType: 'AGENT',
      emailVerified: true,
    },
  });

  const agent = await prisma.agent.upsert({
    where: { userId: agentUser.id },
    update: {},
    create: {
      userId: agentUser.id,
      licenseNumber: 'IN-REG-123456',
      licenseState: 'Karnataka',
      brokerage: 'REST-iN-U Realty',
      bio: 'Specializing in Vastu-compliant and spiritually aligned properties.',
      specializations: ['Vastu', 'Luxury', 'Investment'],
      verified: true,
      subscriptionTier: 'PREMIUM',
      rating: 4.9,
      reviewCount: 127,
    },
  });
  console.log('✅ Demo agent created:', agentUser.email);

  const propertiesData = [
    // Bangalore Properties
    {
      title: "Modern 3BHK Apartment in Koramangala",
      description: "Beautiful 3BHK apartment in the heart of Koramangala with modern amenities and excellent connectivity.",
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.SALE,
      status: PropertyStatus.ACTIVE,
      streetAddress: "123, Koramangala Industrial Layout",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560034",
      country: "India",
      latitude: 12.9352,
      longitude: 77.6129,
      price: 12500000,
      bedrooms: 3,
      bathrooms: 2.5,
      squareFeet: 1800,
      yearBuilt: 2020,
      features: ["Swimming Pool", "Gym", "24/7 Security", "Parking"],
      amenities: ["Club House", "Garden", "Play Area"],
      appliances: ["Refrigerator", "Washing Machine", "AC", "Water Purifier"],
      flooring: ["Marble", "Wooden"],
      heating: ["Central Heating"],
      cooling: ["Split AC"],
      listedDate: new Date(),
      listingAgentId: agent.id,
    },
    {
      title: "Luxury Villa in Whitefield",
      description: "Spacious luxury villa with garden and pool in premium Whitefield location.",
      propertyType: PropertyType.VILLA,
      listingType: ListingType.SALE,
      status: PropertyStatus.ACTIVE,
      streetAddress: "45, Prestige Golf Course Road",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560066",
      country: "India",
      latitude: 12.9716,
      longitude: 77.6826,
      price: 25000000,
      bedrooms: 4,
      bathrooms: 4,
      squareFeet: 3500,
      yearBuilt: 2018,
      features: ["Swimming Pool", "Garden", "Garage", "Security"],
      amenities: ["Tennis Court", "Club House", "Spa"],
      appliances: ["Home Theater", "Smart Home System", "Solar Panels"],
      flooring: ["Granite", "Marble"],
      heating: ["Radiant Floor Heating"],
      cooling: ["Central AC"],
      listedDate: new Date(),
      listingAgentId: agent.id,
    },
    {
      title: "Affordable 2BHK in HSR Layout",
      description: "Well-designed 2BHK apartment in peaceful HSR Layout with excellent infrastructure.",
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
      status: PropertyStatus.ACTIVE,
      streetAddress: "789, HSR Sector 2",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560102",
      country: "India",
      latitude: 12.9139,
      longitude: 77.6315,
      price: 25000,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      yearBuilt: 2019,
      features: ["Balcony", "Parking", "Lift"],
      amenities: ["Gym", "Children Play Area"],
      appliances: ["Water Purifier", "Gas Stove"],
      flooring: ["Vitrified Tiles"],
      heating: ["Room Heater"],
      cooling: ["Split AC"],
      listedDate: new Date(),
      listingAgentId: agent.id,
    },
    {
      title: "Premium Penthouse in Indiranagar",
      description: "Stunning penthouse with panoramic views and premium finishes in posh Indiranagar.",
      propertyType: PropertyType.PENTHOUSE,
      listingType: ListingType.SALE,
      status: PropertyStatus.ACTIVE,
      streetAddress: "101, Indiranagar Double Road",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560038",
      country: "India",
      latitude: 12.9742,
      longitude: 77.6457,
      price: 35000000,
      bedrooms: 3,
      bathrooms: 3,
      squareFeet: 2800,
      yearBuilt: 2021,
      features: ["Terrace", "Swimming Pool", "Gym", "Concierge"],
      amenities: ["Spa", "Restaurant", "Conference Room"],
      appliances: ["Home Automation", "Wine Cellar", "Steam Room"],
      flooring: ["Italian Marble", "Hardwood"],
      heating: ["Underfloor Heating"],
      cooling: ["VRV System"],
      listedDate: new Date(),
      listingAgentId: agent.id,
    },
    {
      title: "Heritage Home in Malleshwaram",
      description: "Charming heritage home with traditional architecture and modern amenities.",
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.SALE,
      status: PropertyStatus.ACTIVE,
      streetAddress: "22, Malleshwaram 8th Cross",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560003",
      country: "India",
      latitude: 13.0097,
      longitude: 77.5598,
      price: 18000000,
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 2200,
      yearBuilt: 1995,
      features: ["Courtyard", "Traditional Architecture", "Garden"],
      amenities: ["Library", "Study Room"],
      appliances: ["Vintage Collection", "Antique Furniture"],
      flooring: ["Teak Wood", "Stone"],
      heating: ["Fireplace"],
      cooling: ["Cross Ventilation"],
      listedDate: new Date(),
      listingAgentId: agent.id,
    },

    // Mumbai Properties
    {
      title: "Sea-facing Apartment in Bandra West",
      description: "Luxurious sea-facing apartment with stunning views of the Arabian Sea.",
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.SALE,
      status: PropertyStatus.ACTIVE,
      streetAddress: "505, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      country: "India",
      latitude: 19.0613,
      longitude: 72.8361,
      price: 45000000,
      bedrooms: 3,
      bathrooms: 3,
      squareFeet: 2200,
      yearBuilt: 2017,
      features: ["Sea View", "Balcony", "Parking", "Security"],
      amenities: ["Swimming Pool", "Gym", "Club House"],
      appliances: ["Home Theater", "Modular Kitchen", "Water Softener"],
      flooring: ["Italian Marble", "Granite"],
      heating: ["Central Heating"],
      cooling: ["Central AC"],
      listedDate: new Date(),
      listingAgentId: agent.id,
    },
  ];

  for (const propertyData of propertiesData) {
    const property = await prisma.property.create({
      data: propertyData
    });
    console.log('✅ Property created:', property.title);

    // Create Vastu Analysis
    await prisma.vastuAnalysis.create({
      data: {
        propertyId: property.id,
        overallScore: 70 + Math.floor(Math.random() * 25),
        grade: ['A+', 'A', 'A-', 'B+'][Math.floor(Math.random() * 4)],
        northEastScore: 75 + Math.floor(Math.random() * 20),
        eastScore: 70 + Math.floor(Math.random() * 25),
        southEastScore: 65 + Math.floor(Math.random() * 30),
        southScore: 60 + Math.floor(Math.random() * 35),
        southWestScore: 70 + Math.floor(Math.random() * 25),
        westScore: 65 + Math.floor(Math.random() * 30),
        northWestScore: 70 + Math.floor(Math.random() * 25),
        northScore: 75 + Math.floor(Math.random() * 20),
        centerScore: 80 + Math.floor(Math.random() * 15),
        entranceDirection: ['NORTH', 'EAST', 'NORTH_EAST'][Math.floor(Math.random() * 3)],
        entranceScore: 75 + Math.floor(Math.random() * 20),
        defects: [],
        recommendations: ['Enhance the north-east corner with water element', 'Add plants in the east'],
      },
    });

    // Create Climate Analysis
    await prisma.climateAnalysis.create({
      data: {
        propertyId: property.id,
        overallRiskScore: 15 + Math.floor(Math.random() * 40),
        riskGrade: ['A', 'B+', 'B', 'C+'][Math.floor(Math.random() * 4)],
        floodRisk2030: 5 + Math.floor(Math.random() * 20),
        floodRisk2050: 10 + Math.floor(Math.random() * 30),
        wildfireRisk: 5 + Math.floor(Math.random() * 25),
        hurricaneRisk: Math.floor(Math.random() * 20),
        seismicRisk: Math.floor(Math.random() * 30),
        heatWaveRisk: 10 + Math.floor(Math.random() * 30),
        droughtRisk: 10 + Math.floor(Math.random() * 25),
        seaLevelRiseImpact: Math.floor(Math.random() * 15),
        insuranceCurrent: 20000 + Math.floor(Math.random() * 30000),
        insurance2030: 25000 + Math.floor(Math.random() * 40000),
        insurance2050: 35000 + Math.floor(Math.random() * 60000),
      },
    });
  }

  console.log('\n🎉 Seeding complete!');
  console.log('\n📧 Demo accounts:');
  console.log('   User: demo@restinu.com / demo123456');
  console.log('   Agent: agent@restinu.com / demo123456');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });