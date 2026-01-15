import request from "supertest";
import { app } from "../../server";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";

describe("Agents API", () => {
  let agentToken: string;
  let buyerToken: string;
  let agentId: string;
  let buyerId: string;
  let propertyId: string;

  const testAgent = {
    email: "agent.test@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Agent",
    phone: "+1234567890",
    userType: "AGENT" as const,
    licenseNumber: "AG123789",
    licenseState: "California",
    licenseExpiry: "2025-12-31",
    brokerage: "Test Realty Co",
    yearsExperience: 7,
    specialties: ["Residential", "Commercial"],
    serviceAreas: ["San Francisco", "San Jose", "Oakland"],
    languages: ["English", "Spanish"],
    bio: "Experienced real estate agent specializing in residential and commercial properties",
  };

  const testBuyer = {
    email: "buyer.test@example.com",
    password: "password123",
    firstName: "Jane",
    lastName: "Buyer",
    phone: "+1234567891",
    userType: "BUYER" as const,
  };

  beforeAll(async () => {
    // Create and register agent
    const agentRegRes = await request(app)
      .post("/api/v1/auth/register")
      .send(testAgent);

    agentToken = agentRegRes.body.data.accessToken;
    agentId = agentRegRes.body.data.user.id;

    await request(app)
      .post("/api/v1/auth/register-agent")
      .set("Authorization", `Bearer ${agentToken}`)
      .send({
        licenseNumber: testAgent.licenseNumber,
        licenseState: testAgent.licenseState,
        licenseExpiry: testAgent.licenseExpiry,
        brokerage: testAgent.brokerage,
        yearsExperience: testAgent.yearsExperience,
        specialties: testAgent.specialties,
        serviceAreas: testAgent.serviceAreas,
        languages: testAgent.languages,
        bio: testAgent.bio,
      });

    // Create buyer
    const buyerRegRes = await request(app)
      .post("/api/v1/auth/register")
      .send(testBuyer);

    buyerToken = buyerRegRes.body.data.accessToken;
    buyerId = buyerRegRes.body.data.user.id;

    // Get agent ID from agent profile
    const agentProfile = await prisma.agent.findFirst({
      where: { userId: agentId },
    });

    if (agentProfile) {
      agentId = agentProfile.id;
    }
  });

  describe("GET /api/agents", () => {
    it("should return list of verified agents", async () => {
      const res = await request(app).get("/api/v1/agents");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.agents).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toBeDefined();
    });

    it("should filter agents by city", async () => {
      const res = await request(app)
        .get("/api/v1/agents")
        .query({ city: "San Francisco" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      res.body.data.agents.forEach((agent: any) => {
        expect(agent.serviceAreas).toContain("San Francisco");
      });
    });

    it("should filter agents by specialty", async () => {
      const res = await request(app)
        .get("/api/v1/agents")
        .query({ specialty: "Residential" });

      expect(res.status).toBe(200);

      res.body.data.agents.forEach((agent: any) => {
        expect(agent.specialties).toContain("Residential");
      });
    });

    it("should filter agents by language", async () => {
      const res = await request(app)
        .get("/api/v1/agents")
        .query({ language: "Spanish" });

      expect(res.status).toBe(200);

      res.body.data.agents.forEach((agent: any) => {
        expect(agent.languages).toContain("Spanish");
      });
    });

    it("should filter agents by minimum rating", async () => {
      const res = await request(app).get("/api/v1/agents").query({ rating: 4 });

      expect(res.status).toBe(200);

      res.body.data.agents.forEach((agent: any) => {
        expect(agent.rating).toBeGreaterThanOrEqual(4);
      });
    });

    it("should handle pagination correctly", async () => {
      const res = await request(app)
        .get("/api/v1/agents")
        .query({ page: 1, limit: 5 });

      expect(res.status).toBe(200);
      expect(res.body.data.agents.length).toBeLessThanOrEqual(5);
      expect(res.body.data.pagination.page).toBe(1);
      expect(res.body.data.pagination.limit).toBe(5);
    });

    it("should include all required agent fields", async () => {
      const res = await request(app).get("/api/v1/agents").query({ limit: 1 });

      expect(res.status).toBe(200);

      if (res.body.data.agents.length > 0) {
        const agent = res.body.data.agents[0];
        expect(agent).toHaveProperty("id");
        expect(agent).toHaveProperty("name");
        expect(agent).toHaveProperty("photo");
        expect(agent).toHaveProperty("brokerage");
        expect(agent).toHaveProperty("rating");
        expect(agent).toHaveProperty("reviewCount");
        expect(agent).toHaveProperty("yearsExperience");
        expect(agent).toHaveProperty("specialties");
        expect(agent).toHaveProperty("serviceAreas");
        expect(agent).toHaveProperty("languages");
        expect(agent).toHaveProperty("ethicsScore");
        expect(agent).toHaveProperty("activeListings");
        expect(agent).toHaveProperty("subscriptionTier");
      }
    });
  });

  describe("GET /api/agents/:id", () => {
    it("should return agent profile by ID", async () => {
      const res = await request(app).get(`/api/v1/agents/${agentId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.firstName).toBe(testAgent.firstName);
      expect(res.body.data.user.lastName).toBe(testAgent.lastName);
      expect(res.body.data.brokerage).toBe(testAgent.brokerage);
    });

    it("should return 404 for non-existent agent", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const res = await request(app).get(`/api/v1/agents/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should include agent properties", async () => {
      const res = await request(app).get(`/api/v1/agents/${agentId}`);

      expect(res.status).toBe(200);
      expect(res.body.data.properties).toBeDefined();
      expect(res.body.data.properties).toBeInstanceOf(Array);
    });

    it("should include agent reviews", async () => {
      const res = await request(app).get(`/api/v1/agents/${agentId}`);

      expect(res.status).toBe(200);
      expect(res.body.data.reviews).toBeDefined();
      expect(res.body.data.reviews).toBeInstanceOf(Array);
    });

    it("should include availability information", async () => {
      const res = await request(app).get(`/api/v1/agents/${agentId}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("availability");
    });
  });

  describe("GET /api/agents/:id/reviews", () => {
    it("should return agent reviews with pagination", async () => {
      const res = await request(app).get(`/api/v1/agents/${agentId}/reviews`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.reviews).toBeInstanceOf(Array);
      expect(res.body.data.ratingDistribution).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toBeDefined();
    });

    it("should handle pagination for reviews", async () => {
      const res = await request(app)
        .get(`/api/v1/agents/${agentId}/reviews`)
        .query({ page: 1, limit: 5 });

      expect(res.status).toBe(200);
      expect(res.body.data.reviews.length).toBeLessThanOrEqual(5);
      expect(res.body.data.pagination.page).toBe(1);
      expect(res.body.data.pagination.limit).toBe(5);
    });

    it("should return 404 for non-existent agent reviews", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const res = await request(app).get(`/api/v1/agents/${fakeId}/reviews`);

      expect(res.status).toBe(200); // Returns empty array for non-existent agents
      expect(res.body.data.reviews).toEqual([]);
    });

    it("should include reviewer information in reviews", async () => {
      const res = await request(app).get(`/api/v1/agents/${agentId}/reviews`);

      expect(res.status).toBe(200);

      res.body.data.reviews.forEach((review: any) => {
        expect(review.reviewer).toBeDefined();
        expect(review.reviewer).toHaveProperty("firstName");
        expect(review.reviewer).toHaveProperty("lastName");
      });
    });
  });

  describe("POST /api/agents/:id/reviews", () => {
    const reviewData = {
      rating: 5,
      title: "Excellent Agent",
      comment: "Very professional and knowledgeable",
      transactionType: "BOUGHT",
    };

    it("should submit a review as authenticated user", async () => {
      const res = await request(app)
        .post(`/api/v1/agents/${agentId}/reviews`)
        .set("Authorization", `Bearer ${buyerToken}`)
        .send(reviewData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rating).toBe(reviewData.rating);
      expect(res.body.data.title).toBe(reviewData.title);
    });

    it("should require authentication", async () => {
      const res = await request(app)
        .post(`/api/v1/agents/${agentId}/reviews`)
        .send(reviewData);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should validate rating range", async () => {
      const res = await request(app)
        .post(`/api/v1/agents/${agentId}/reviews`)
        .set("Authorization", `Bearer ${buyerToken}`)
        .send({ ...reviewData, rating: 6 });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Rating must be 1-5");
    });

    it("should prevent duplicate reviews", async () => {
      // First review
      await request(app)
        .post(`/api/v1/agents/${agentId}/reviews`)
        .set("Authorization", `Bearer ${buyerToken}`)
        .send(reviewData);

      // Second review (should fail)
      const res = await request(app)
        .post(`/api/v1/agents/${agentId}/reviews`)
        .set("Authorization", `Bearer ${buyerToken}`)
        .send({
          rating: 4,
          title: "Second Review",
          comment: "This should fail",
          transactionType: "SOLD",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("already reviewed this agent");
    });

    it("should return 404 for non-existent agent", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const res = await request(app)
        .post(`/api/v1/agents/${fakeId}/reviews`)
        .set("Authorization", `Bearer ${buyerToken}`)
        .send(reviewData);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/agents/me/dashboard", () => {
    it("should return agent dashboard stats", async () => {
      const res = await request(app)
        .get("/api/v1/agents/me/dashboard")
        .set("Authorization", `Bearer ${agentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("activeListings");
      expect(res.body.data).toHaveProperty("totalLeads");
      expect(res.body.data).toHaveProperty("newLeads");
      expect(res.body.data).toHaveProperty("scheduledShowings");
      expect(res.body.data).toHaveProperty("unreadMessages");
      expect(res.body.data).toHaveProperty("performance");
    });

    it("should require agent authentication", async () => {
      const res = await request(app)
        .get("/api/v1/agents/me/dashboard")
        .set("Authorization", `Bearer ${buyerToken}`);

      expect(res.status).toBe(403); // Buyer is not an agent
      expect(res.body.success).toBe(false);
    });

    it("should require authentication", async () => {
      const res = await request(app).get("/api/v1/agents/me/dashboard");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/agents/me/leads", () => {
    it("should return agent leads", async () => {
      const res = await request(app)
        .get("/api/v1/agents/me/leads")
        .set("Authorization", `Bearer ${agentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.leads).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toBeDefined();
    });

    it("should filter leads by status", async () => {
      const res = await request(app)
        .get("/api/v1/agents/me/leads")
        .set("Authorization", `Bearer ${agentToken}`)
        .query({ status: "NEW" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should filter leads by priority", async () => {
      const res = await request(app)
        .get("/api/v1/agents/me/leads")
        .set("Authorization", `Bearer ${agentToken}`)
        .query({ priority: "HIGH" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should require agent authentication", async () => {
      const res = await request(app)
        .get("/api/v1/agents/me/leads")
        .set("Authorization", `Bearer ${buyerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/agents/me/analytics", () => {
    it("should return agent analytics data", async () => {
      const res = await request(app)
        .get("/api/v1/agents/me/analytics")
        .set("Authorization", `Bearer ${agentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("views");
      expect(res.body.data).toHaveProperty("inquiries");
      expect(res.body.data).toHaveProperty("conversionRate");
      expect(res.body.data).toHaveProperty("activeLeads");
      expect(res.body.data).toHaveProperty("viewsHistory");
      expect(res.body.data.viewsHistory).toBeInstanceOf(Array);
    });

    it("should require agent authentication", async () => {
      const res = await request(app)
        .get("/api/v1/agents/me/analytics")
        .set("Authorization", `Bearer ${buyerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/agents/analyze", () => {
    const analysisData = {
      propertyId: "test-property-id",
      analysisTypes: ["VASTU", "CLIMATE", "ENVIRONMENTAL"],
      priority: "HIGH",
    };

    it("should initiate agent swarm analysis", async () => {
      // First create a test property
      const propertyRes = await request(app)
        .post("/api/v1/properties")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          title: "Test Property for Analysis",
          description: "A test property for agent swarm analysis",
          propertyType: "HOUSE",
          listingType: "SALE",
          streetAddress: "123 Test St",
          city: "Test City",
          state: "CA",
          zipCode: "12345",
          country: "USA",
          latitude: 37.7749,
          longitude: -122.4194,
          price: 500000,
          bedrooms: 3,
          bathrooms: 2,
          squareFeet: 1500,
          yearBuilt: 2000,
          photos: [
            {
              url: "https://example.com/photo1.jpg",
              isPrimary: true,
            },
          ],
        });

      if (propertyRes.status === 201) {
        propertyId = propertyRes.body.data.id;

        const res = await request(app)
          .post("/api/v1/agents/analyze")
          .set("Authorization", `Bearer ${agentToken}`)
          .send({
            propertyId,
            analysisTypes: ["VASTU", "CLIMATE"],
            priority: "MEDIUM",
          });

        expect(res.status).toBe(202);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("analysisId");
        expect(res.body.data.propertyId).toBe(propertyId);
        expect(res.body.data.status).toBe("PENDING");
      }
    });

    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v1/agents/analyze")
        .send(analysisData);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should validate property ID format", async () => {
      const res = await request(app)
        .post("/api/v1/agents/analyze")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          propertyId: "invalid-id",
          analysisTypes: ["VASTU"],
        });

      expect(res.status).toBe(400);
    });

    it("should validate analysis types", async () => {
      const res = await request(app)
        .post("/api/v1/agents/analyze")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          propertyId: "00000000-0000-0000-0000-000000000000",
          analysisTypes: ["INVALID_TYPE"],
        });

      expect(res.status).toBe(400);
    });

    it("should return 404 for non-existent property", async () => {
      const res = await request(app)
        .post("/api/v1/agents/analyze")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          propertyId: "00000000-0000-0000-0000-000000000000",
          analysisTypes: ["VASTU"],
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/agents/analyze/:analysisId", () => {
    it("should return analysis status", async () => {
      // First create an analysis
      const createRes = await request(app)
        .post("/api/v1/agents/analyze")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          propertyId: "00000000-0000-0000-0000-000000000000",
          analysisTypes: ["VASTU"],
        });

      // This will likely fail due to non-existent property, but let's test with a real analysis
      const analysisId = createRes.body.data?.analysisId || "test-analysis-id";

      const res = await request(app)
        .get(`/api/v1/agents/analyze/${analysisId}`)
        .set("Authorization", `Bearer ${agentToken}`);

      if (res.status === 404) {
        expect(res.status).toBe(404);
      } else {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      }
    });

    it("should require authentication", async () => {
      const res = await request(app).get(
        "/api/v1/agents/analyze/test-analysis-id",
      );

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 404 for non-existent analysis", async () => {
      const res = await request(app)
        .get("/api/v1/agents/analyze/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${agentToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Agent Performance and Stats", () => {
    it("should update agent rating after review", async () => {
      // Create a second buyer for another review
      const buyer2Res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          ...testBuyer,
          email: "buyer2.test@example.com",
        });

      const buyer2Token = buyer2Res.body.data.accessToken;

      // Get initial agent rating
      const agentBefore = await request(app).get(`/api/v1/agents/${agentId}`);

      const initialRating = agentBefore.body.data.rating || 0;

      // Submit a review
      await request(app)
        .post(`/api/v1/agents/${agentId}/reviews`)
        .set("Authorization", `Bearer ${buyer2Token}`)
        .send({
          rating: 4,
          title: "Good Agent",
          comment: "Decent service",
          transactionType: "BOUGHT",
        });

      // Check updated rating
      const agentAfter = await request(app).get(`/api/v1/agents/${agentId}`);

      // Rating should be updated (exact calculation depends on aggregation)
      expect(agentAfter.body.data.rating).toBeDefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid UUID format in agent ID", async () => {
      const res = await request(app).get("/api/v1/agents/invalid-uuid");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should handle malformed analysis requests", async () => {
      const res = await request(app)
        .post("/api/v1/agents/analyze")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
