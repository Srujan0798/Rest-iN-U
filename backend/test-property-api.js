// Simple test for Property API
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testPropertyAPI() {
  try {
    console.log("🔍 Testing Property Model...");

    // Test if we can connect to database
    await prisma.$connect();
    console.log("✅ Database connected");

    // Test Property model exists
    const propertyCount = await prisma.property.count();
    console.log(
      `✅ Property model accessible - ${propertyCount} properties found`,
    );

    // Test creating a test property
    const testProperty = await prisma.property.create({
      data: {
        title: "Test Property for API",
        description: "This is a test property to verify API functionality",
        propertyType: "HOUSE",
        listingType: "SALE",
        status: "ACTIVE",
        streetAddress: "123 Test Street",
        city: "Test City",
        state: "TS",
        zipCode: "12345",
        country: "USA",
        latitude: 40.7128,
        longitude: -74.006,
        price: 500000,
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 2000,
        yearBuilt: 2020,
        isActive: true,
      },
    });

    console.log(`✅ Test property created: ${testProperty.id}`);

    // Test querying with filters
    const properties = await prisma.property.findMany({
      where: {
        status: "ACTIVE",
        propertyType: "HOUSE",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        city: true,
        state: true,
        price: true,
        propertyType: true,
        status: true,
      },
    });

    console.log(
      `✅ Property query successful - found ${properties.length} properties`,
    );
    properties.forEach((p) => {
      console.log(`   - ${p.title} in ${p.city}, ${p.state} - $${p.price}`);
    });

    // Test relations
    const propertyWithRelations = await prisma.property.findUnique({
      where: { id: testProperty.id },
      include: {
        photos: true,
        vastuAnalysis: true,
        climateAnalysis: true,
      },
    });

    console.log(`✅ Property relations accessible:`);
    console.log(`   - Photos: ${propertyWithRelations.photos.length}`);
    console.log(
      `   - Vastu Analysis: ${propertyWithRelations.vastuAnalysis ? "Yes" : "No"}`,
    );
    console.log(
      `   - Climate Analysis: ${propertyWithRelations.climateAnalysis ? "Yes" : "No"}`,
    );

    // Clean up test property
    await prisma.property.delete({
      where: { id: testProperty.id },
    });
    console.log("✅ Test property cleaned up");

    console.log("\n🎉 All Property API tests passed!");
    console.log("📋 Property model is ready for frontend integration");
  } catch (error) {
    console.error("❌ Property API test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testPropertyAPI();
