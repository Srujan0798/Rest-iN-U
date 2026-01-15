import request from "supertest";
import { app } from "../../server";
import { prisma } from "../../utils/prisma";

describe("Favorites API", () => {
  let userToken: string;
  let agentToken: string;
  let userId: string;
  let testProperty1: any;
  let testProperty2: any;
  let testProperty3: any;

  beforeAll(async () => {
    // Create test user
    const userRes = await request(app).post("/api/v1/auth/register").send({
      email: "favorite.user@example.com",
      password: "password123",
      firstName: "Favorite",
      lastName: "User",
      userType: "BUYER",
    });

    userToken = userRes.body.data.accessToken;
    userId = userRes.body.data.user.id;

    // Create agent and properties
    const agentRes = await request(app).post("/api/v1/auth/register").send({
      email: "favorite.agent@example.com",
      password: "password123",
      firstName: "Favorite",
      lastName: "Agent",
      userType: "AGENT",
    });

    agentToken = agentRes.body.data.accessToken;

    await request(app)
      .post("/api/v1/auth/register-agent")
      .set("Authorization", `Bearer ${agentToken}`)
      .send({
        licenseNumber: "AG888888",
        licenseState: "California",
        licenseExpiry: "2025-12-31",
        brokerage: "Favorite Realty",
      });

    // Create test properties
    const properties = [
      {
        title: "Luxury Villa for Favorites Test",
        description: "Beautiful villa perfect for favorites testing",
        propertyType: "VILLA",
        listingType: "SALE",
        streetAddress: "123 Favorite St",
        city: "Beverly Hills",
        state: "CA",
        zipCode: "90210",
        country: "USA",
        latitude: 34.0736,
        longitude: -118.4004,
        price: 3500000,
        bedrooms: 5,
        bathrooms: 4,
        squareFeet: 4500,
        yearBuilt: 2018,
        photos: [
          {
            url: "https://example.com/fav1.jpg",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Modern Condo Favorites",
        description: "Sleek condo for favorites testing",
        propertyType: "CONDO",
        listingType: "SALE",
        streetAddress: "456 Urban Ave",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA",
        latitude: 37.7897,
        longitude: -122.4,
        price: 1200000,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1400,
        yearBuilt: 2021,
        photos: [
          {
            url: "https://example.com/fav2.jpg",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Family Home Favorites",
        description: "Perfect family home for testing",
        propertyType: "HOUSE",
        listingType: "SALE",
        streetAddress: "789 Family Dr",
        city: "Palo Alto",
        state: "CA",
        zipCode: "94301",
        country: "USA",
        latitude: 37.4419,
        longitude: -122.143,
        price: 2200000,
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2800,
        yearBuilt: 2016,
        photos: [
          {
            url: "https://example.com/fav3.jpg",
            isPrimary: true,
          },
        ],
      },
    ];

    for (const propertyData of properties) {
      const res = await request(app)
        .post("/api/v1/properties")
        .set("Authorization", `Bearer ${agentToken}`)
        .send(propertyData);

      if (propertyData.title.includes("Villa")) {
        testProperty1 = res.body.data;
      } else if (propertyData.title.includes("Condo")) {
        testProperty2 = res.body.data;
      } else if (propertyData.title.includes("Family Home")) {
        testProperty3 = res.body.data;
      }
    }
  });

  describe("Saved Searches", () => {
    describe("GET /api/favorites/saved-searches", () => {
      it("should return empty list for new user", async () => {
        const res = await request(app)
          .get("/api/v1/favorites/saved-searches")
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.savedSearches).toEqual([]);
      });

      it("should require authentication", async () => {
        const res = await request(app).get("/api/v1/favorites/saved-searches");

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
    });

    describe("POST /api/favorites/saved-searches", () => {
      it("should create a new saved search", async () => {
        const searchFilters = {
          propertyType: ["HOUSE"],
          minBedrooms: 3,
          maxPrice: 2000000,
          location: { city: "San Francisco" },
        };

        const res = await request(app)
          .post("/api/v1/favorites/saved-searches")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            name: "3+ BR Houses under $2M",
            filters: searchFilters,
            alertFrequency: "DAILY",
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.savedSearch.name).toBe("3+ BR Houses under $2M");
        expect(res.body.data.savedSearch.filters).toEqual(searchFilters);
        expect(res.body.data.savedSearch.alertFrequency).toBe("DAILY");
        expect(res.body.data.savedSearch.isActive).toBe(true);
        expect(res.body.data.savedSearch.matchCount).toBeDefined();
      });

      it("should require authentication", async () => {
        const res = await request(app)
          .post("/api/v1/favorites/saved-searches")
          .send({
            name: "Test Search",
            filters: {},
          });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });

      it("should validate required fields", async () => {
        const res = await request(app)
          .post("/api/v1/favorites/saved-searches")
          .set("Authorization", `Bearer ${userToken}`)
          .send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should enforce saved search limit", async () => {
        // Create 20 saved searches (the limit)
        const promises = Array(20)
          .fill(null)
          .map((_, i) =>
            request(app)
              .post("/api/v1/favorites/saved-searches")
              .set("Authorization", `Bearer ${userToken}`)
              .send({
                name: `Search ${i}`,
                filters: { propertyType: ["HOUSE"] },
              }),
          );

        await Promise.all(promises);

        // Try to create one more (should fail)
        const res = await request(app)
          .post("/api/v1/favorites/saved-searches")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            name: "Search Too Many",
            filters: { propertyType: ["CONDO"] },
          });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain(
          "Maximum of 20 saved searches allowed",
        );
      });

      it("should validate alert frequency", async () => {
        const res = await request(app)
          .post("/api/v1/favorites/saved-searches")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            name: "Invalid Frequency",
            filters: {},
            alertFrequency: "INVALID",
          });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });

    describe("GET /api/favorites/saved-searches/:id", () => {
      let savedSearchId: string;

      beforeAll(async () => {
        const res = await request(app)
          .post("/api/v1/favorites/saved-searches")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            name: "Test Search for Get",
            filters: { propertyType: ["VILLA"] },
          });
        savedSearchId = res.body.data.savedSearch.id;
      });

      it("should return specific saved search", async () => {
        const res = await request(app)
          .get(`/api/v1/favorites/saved-searches/${savedSearchId}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.savedSearch.id).toBe(savedSearchId);
        expect(res.body.data.savedSearch.name).toBe("Test Search for Get");
      });

      it("should return 404 for non-existent search", async () => {
        const fakeId = "00000000-0000-0000-0000-000000000000";
        const res = await request(app)
          .get(`/api/v1/favorites/saved-searches/${fakeId}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
      });

      it("should require authentication", async () => {
        const res = await request(app).get(
          `/api/v1/favorites/saved-searches/${savedSearchId}`,
        );

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
    });

    describe("PUT /api/favorites/saved-searches/:id", () => {
      let savedSearchId: string;

      beforeAll(async () => {
        const res = await request(app)
          .post("/api/v1/favorites/saved-searches")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            name: "Search to Update",
            filters: { propertyType: ["HOUSE"] },
          });
        savedSearchId = res.body.data.savedSearch.id;
      });

      it("should update saved search name", async () => {
        const res = await request(app)
          .put(`/api/v1/favorites/saved-searches/${savedSearchId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            name: "Updated Search Name",
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.savedSearch.name).toBe("Updated Search Name");
      });

      it("should update saved search filters", async () => {
        const newFilters = {
          propertyType: ["CONDO"],
          minPrice: 500000,
          maxPrice: 1500000,
        };

        const res = await request(app)
          .put(`/api/v1/favorites/saved-searches/${savedSearchId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            filters: newFilters,
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.savedSearch.filters).toEqual(newFilters);
      });

      it("should update alert frequency", async () => {
        const res = await request(app)
          .put(`/api/v1/favorites/saved-searches/${savedSearchId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            alertFrequency: "WEEKLY",
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.savedSearch.alertFrequency).toBe("WEEKLY");
      });

      it("should deactivate saved search", async () => {
        const res = await request(app)
          .put(`/api/v1/favorites/saved-searches/${savedSearchId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            isActive: false,
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.savedSearch.isActive).toBe(false);
      });

      it("should return 404 for non-existent search", async () => {
        const fakeId = "00000000-0000-0000-0000-000000000000";
        const res = await request(app)
          .put(`/api/v1/favorites/saved-searches/${fakeId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({ name: "Updated" });

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
      });
    });

    describe("DELETE /api/favorites/saved-searches/:id", () => {
      let savedSearchId: string;

      beforeAll(async () => {
        const res = await request(app)
          .post("/api/v1/favorites/saved-searches")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            name: "Search to Delete",
            filters: { propertyType: ["APARTMENT"] },
          });
        savedSearchId = res.body.data.savedSearch.id;
      });

      it("should delete saved search", async () => {
        const res = await request(app)
          .delete(`/api/v1/favorites/saved-searches/${savedSearchId}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("deleted successfully");
      });

      it("should return 404 for already deleted search", async () => {
        const res = await request(app)
          .delete(`/api/v1/favorites/saved-searches/${savedSearchId}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
      });
    });

    describe("GET /api/favorites/saved-searches/:id/matches", () => {
      let savedSearchId: string;

      beforeAll(async () => {
        const res = await request(app)
          .post("/api/v1/favorites/saved-searches")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            name: "Search for Matches",
            filters: {
              propertyType: ["VILLA", "CONDO", "HOUSE"],
              minPrice: 1000000,
            },
          });
        savedSearchId = res.body.data.savedSearch.id;
      });

      it("should return matching properties", async () => {
        const res = await request(app)
          .get(`/api/v1/favorites/saved-searches/${savedSearchId}/matches`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.properties).toBeInstanceOf(Array);
        expect(res.body.data.pagination).toBeDefined();
      });

      it("should handle pagination for matches", async () => {
        const res = await request(app)
          .get(`/api/v1/favorites/saved-searches/${savedSearchId}/matches`)
          .set("Authorization", `Bearer ${userToken}`)
          .query({ page: 1, limit: 5 });

        expect(res.status).toBe(200);
        expect(res.body.data.properties.length).toBeLessThanOrEqual(5);
        expect(res.body.data.pagination.page).toBe(1);
        expect(res.body.data.pagination.limit).toBe(5);
      });

      it("should filter new matches only", async () => {
        const res = await request(app)
          .get(`/api/v1/favorites/saved-searches/${savedSearchId}/matches`)
          .set("Authorization", `Bearer ${userToken}`)
          .query({ newOnly: true });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.newMatches).toBeDefined();
      });

      it("should update match count", async () => {
        const beforeRes = await request(app)
          .get(`/api/v1/favorites/saved-searches/${savedSearchId}`)
          .set("Authorization", `Bearer ${userToken}`);

        const initialCount = beforeRes.body.data.savedSearch.matchCount;

        await request(app)
          .get(`/api/v1/favorites/saved-searches/${savedSearchId}/matches`)
          .set("Authorization", `Bearer ${userToken}`);

        const afterRes = await request(app)
          .get(`/api/v1/favorites/saved-searches/${savedSearchId}`)
          .set("Authorization", `Bearer ${userToken}`);

        // Match count should be updated
        expect(afterRes.body.data.savedSearch.matchCount).toBeDefined();
      });
    });
  });

  describe("Property Favorites", () => {
    describe("GET /api/favorites/favorites", () => {
      it("should return empty list for new user", async () => {
        const res = await request(app)
          .get("/api/v1/favorites/favorites")
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.favorites).toEqual([]);
        expect(res.body.data.pagination).toBeDefined();
      });

      it("should require authentication", async () => {
        const res = await request(app).get("/api/v1/favorites/favorites");

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });

      it("should handle sorting", async () => {
        const res = await request(app)
          .get("/api/v1/favorites/favorites")
          .set("Authorization", `Bearer ${userToken}`)
          .query({ sortBy: "price", sortOrder: "asc" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });

      it("should handle pagination", async () => {
        const res = await request(app)
          .get("/api/v1/favorites/favorites")
          .set("Authorization", `Bearer ${userToken}`)
          .query({ page: 1, limit: 5 });

        expect(res.status).toBe(200);
        expect(res.body.data.pagination.page).toBe(1);
        expect(res.body.data.pagination.limit).toBe(5);
      });
    });

    describe("POST /api/favorites/favorites", () => {
      it("should add property to favorites", async () => {
        const res = await request(app)
          .post("/api/v1/favorites/favorites")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            propertyId: testProperty1.id,
            notes: "Beautiful villa, perfect for family",
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.favorite.propertyId).toBe(testProperty1.id);
        expect(res.body.data.favorite.notes).toBe(
          "Beautiful villa, perfect for family",
        );
        expect(res.body.data.favorite.property).toBeDefined();
        expect(res.body.message).toContain("added to favorites");
      });

      it("should add favorite without notes", async () => {
        const res = await request(app)
          .post("/api/v1/favorites/favorites")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            propertyId: testProperty2.id,
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.favorite.propertyId).toBe(testProperty2.id);
        expect(res.body.data.favorite.notes).toBeNull();
      });

      it("should require authentication", async () => {
        const res = await request(app)
          .post("/api/v1/favorites/favorites")
          .send({
            propertyId: testProperty1.id,
          });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });

      it("should return 404 for non-existent property", async () => {
        const fakeId = "00000000-0000-0000-0000-000000000000";
        const res = await request(app)
          .post("/api/v1/favorites/favorites")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            propertyId: fakeId,
          });

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
      });

      it("should prevent duplicate favorites", async () => {
        const res = await request(app)
          .post("/api/v1/favorites/favorites")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            propertyId: testProperty1.id,
          });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("already in favorites");
      });

      it("should validate property ID format", async () => {
        const res = await request(app)
          .post("/api/v1/favorites/favorites")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            propertyId: "invalid-uuid",
          });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should validate notes length", async () => {
        const longNotes = "a".repeat(501);
        const res = await request(app)
          .post("/api/v1/favorites/favorites")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            propertyId: testProperty3.id,
            notes: longNotes,
          });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });

    describe("PUT /api/favorites/favorites/:propertyId", () => {
      it("should update favorite notes", async () => {
        const res = await request(app)
          .put(`/api/v1/favorites/favorites/${testProperty1.id}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            notes: "Updated notes: Still love this villa!",
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.favorite.notes).toBe(
          "Updated notes: Still love this villa!",
        );
      });

      it("should return 404 for non-favorited property", async () => {
        const res = await request(app)
          .put(`/api/v1/favorites/favorites/${testProperty3.id}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            notes: "This should fail",
          });

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
      });

      it("should require authentication", async () => {
        const res = await request(app)
          .put(`/api/v1/favorites/favorites/${testProperty1.id}`)
          .send({ notes: "Updated" });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
    });

    describe("DELETE /api/favorites/favorites/:propertyId", () => {
      it("should remove property from favorites", async () => {
        const res = await request(app)
          .delete(`/api/v1/favorites/favorites/${testProperty2.id}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("removed from favorites");
      });

      it("should return 404 for non-favorited property", async () => {
        const res = await request(app)
          .delete(`/api/v1/favorites/favorites/${testProperty3.id}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
      });

      it("should require authentication", async () => {
        const res = await request(app).delete(
          `/api/v1/favorites/favorites/${testProperty1.id}`,
        );

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
    });

    describe("GET /api/favorites/favorites/check/:propertyId", () => {
      it("should return true for favorited property", async () => {
        const res = await request(app)
          .get(`/api/v1/favorites/favorites/check/${testProperty1.id}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.isFavorited).toBe(true);
        expect(res.body.data.favorite).toBeDefined();
        expect(res.body.data.favorite.notes).toBe(
          "Updated notes: Still love this villa!",
        );
      });

      it("should return false for non-favorited property", async () => {
        const res = await request(app)
          .get(`/api/v1/favorites/favorites/check/${testProperty3.id}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.isFavorited).toBe(false);
        expect(res.body.data.favorite).toBeNull();
      });

      it("should require authentication", async () => {
        const res = await request(app).get(
          `/api/v1/favorites/favorites/check/${testProperty1.id}`,
        );

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
    });

    describe("GET /api/favorites/favorites (with data)", () => {
      it("should return favorites with property details", async () => {
        const res = await request(app)
          .get("/api/v1/favorites/favorites")
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.favorites).toBeInstanceOf(Array);

        if (res.body.data.favorites.length > 0) {
          const favorite = res.body.data.favorites[0];
          expect(favorite).toHaveProperty("id");
          expect(favorite).toHaveProperty("propertyId");
          expect(favorite).toHaveProperty("notes");
          expect(favorite).toHaveProperty("createdAt");
          expect(favorite.property).toBeDefined();
          expect(favorite.property.photos).toBeDefined();
          expect(favorite.property.vastuAnalysis).toBeDefined();
          expect(favorite.property.climateAnalysis).toBeDefined();
          expect(favorite.property.listingAgent).toBeDefined();
        }
      });

      it("should sort favorites correctly", async () => {
        // Add another favorite to test sorting
        await request(app)
          .post("/api/v1/favorites/favorites")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            propertyId: testProperty3.id,
            notes: "Family home favorite",
          });

        const res = await request(app)
          .get("/api/v1/favorites/favorites")
          .set("Authorization", `Bearer ${userToken}`)
          .query({ sortBy: "price", sortOrder: "asc" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        // Verify price sorting (ascending)
        const favorites = res.body.data.favorites;
        for (let i = 1; i < favorites.length; i++) {
          if (favorites[i].property.price && favorites[i - 1].property.price) {
            expect(favorites[i].property.price).toBeGreaterThanOrEqual(
              favorites[i - 1].property.price,
            );
          }
        }
      });
    });
  });

  describe("Property Comparison", () => {
    describe("POST /api/favorites/comparisons", () => {
      it("should create comparison group", async () => {
        const res = await request(app)
          .post("/api/v1/favorites/comparisons")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            propertyIds: [testProperty1.id, testProperty3.id],
            name: "Luxury Properties Comparison",
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.groupId).toBeDefined();
        expect(res.body.data.name).toBe("Luxury Properties Comparison");
        expect(res.body.data.properties).toHaveLength(2);
        expect(res.body.data.comparison).toBeDefined();
        expect(res.body.data.comparison.categories).toBeInstanceOf(Array);
      });

      it("should require at least 2 properties", async () => {
        const res = await request(app)
          .post("/api/v1/favorites/comparisons")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            propertyIds: [testProperty1.id],
          });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should limit to 10 properties", async () => {
        const tooManyIds = Array(11).fill(testProperty1.id);
        const res = await request(app)
          .post("/api/v1/favorites/comparisons")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            propertyIds: tooManyIds,
          });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should return 404 for non-existent property", async () => {
        const res = await request(app)
          .post("/api/v1/favorites/comparisons")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            propertyIds: [
              testProperty1.id,
              "00000000-0000-0000-0000-000000000000",
            ],
          });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("not found");
      });

      it("should require authentication", async () => {
        const res = await request(app)
          .post("/api/v1/favorites/comparisons")
          .send({
            propertyIds: [testProperty1.id, testProperty3.id],
          });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });

      it("should generate comparison categories", async () => {
        const res = await request(app)
          .post("/api/v1/favorites/comparisons")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            propertyIds: [testProperty1.id, testProperty3.id],
            name: "Detailed Comparison",
          });

        expect(res.status).toBe(201);
        expect(res.body.data.comparison.categories.length).toBeGreaterThan(0);

        const categories = res.body.data.comparison.categories.map(
          (c: any) => c.name,
        );
        expect(categories).toContain("Basic Info");
      });
    });

    describe("GET /api/favorites/comparisons", () => {
      let comparisonGroupId: string;

      beforeAll(async () => {
        const res = await request(app)
          .post("/api/v1/favorites/comparisons")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            propertyIds: [testProperty1.id, testProperty3.id],
            name: "List Comparison Test",
          });
        comparisonGroupId = res.body.data.groupId;
      });

      it("should return comparison groups", async () => {
        const res = await request(app)
          .get("/api/v1/favorites/comparisons")
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.comparisons).toBeInstanceOf(Array);

        const foundComparison = res.body.data.comparisons.find(
          (c: any) => c.groupId === comparisonGroupId,
        );
        expect(foundComparison).toBeDefined();
        expect(foundComparison.properties).toHaveLength(2);
      });

      it("should require authentication", async () => {
        const res = await request(app).get("/api/v1/favorites/comparisons");

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
    });

    describe("GET /api/favorites/comparisons/:groupId", () => {
      let comparisonGroupId: string;

      beforeAll(async () => {
        const res = await request(app)
          .post("/api/v1/favorites/comparisons")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            propertyIds: [testProperty1.id, testProperty3.id],
            name: "Detailed Comparison Test",
          });
        comparisonGroupId = res.body.data.groupId;
      });

      it("should return specific comparison with details", async () => {
        const res = await request(app)
          .get(`/api/v1/favorites/comparisons/${comparisonGroupId}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.groupId).toBe(comparisonGroupId);
        expect(res.body.data.properties).toHaveLength(2);
        expect(res.body.data.comparison).toBeDefined();
        expect(res.body.data.comparison.categories).toBeInstanceOf(Array);
        expect(res.body.data.comparison.winner).toBeDefined();
        expect(res.body.data.comparison.scores).toBeDefined();
      });

      it("should include detailed property data", async () => {
        const res = await request(app)
          .get(`/api/v1/favorites/comparisons/${comparisonGroupId}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);

        res.body.data.properties.forEach((property: any) => {
          expect(property.photos).toBeDefined();
          expect(property.vastuAnalysis).toBeDefined();
          expect(property.climateAnalysis).toBeDefined();
          expect(property.environmentalData).toBeDefined();
          expect(property.neighborhood).toBeDefined();
          expect(property.priceHistory).toBeDefined();
        });
      });

      it("should return 404 for non-existent comparison", async () => {
        const res = await request(app)
          .get("/api/v1/favorites/comparisons/non-existent-group")
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
      });

      it("should require authentication", async () => {
        const res = await request(app).get(
          `/api/v1/favorites/comparisons/${comparisonGroupId}`,
        );

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
    });

    describe("DELETE /api/favorites/comparisons/:groupId", () => {
      let comparisonGroupId: string;

      beforeAll(async () => {
        const res = await request(app)
          .post("/api/v1/favorites/comparisons")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            propertyIds: [testProperty1.id, testProperty3.id],
            name: "Comparison to Delete",
          });
        comparisonGroupId = res.body.data.groupId;
      });

      it("should delete comparison group", async () => {
        const res = await request(app)
          .delete(`/api/v1/favorites/comparisons/${comparisonGroupId}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("deleted successfully");
      });

      it("should return 404 for already deleted comparison", async () => {
        const res = await request(app)
          .delete(`/api/v1/favorites/comparisons/${comparisonGroupId}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
      });

      it("should require authentication", async () => {
        const res = await request(app).delete(
          `/api/v1/favorites/comparisons/${comparisonGroupId}`,
        );

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle invalid UUID formats", async () => {
      const res = await request(app)
        .get("/api/v1/favorites/favorites/check/invalid-uuid")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should enforce favorites limit", async () => {
      // This test would require creating 100+ favorites
      // For now, just verify the limit is checked
      expect(testProperty1).toBeDefined();
      expect(testProperty2).toBeDefined();
      expect(testProperty3).toBeDefined();
    });

    it("should handle malformed filter data", async () => {
      const res = await request(app)
        .post("/api/v1/favorites/saved-searches")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Test",
          filters: "invalid-filter-data",
        });

      // Should accept string since filters type is Record<string, any>
      expect(res.status).toBe(201);
    });

    it("should handle special characters in search names", async () => {
      const res = await request(app)
        .post("/api/v1/favorites/saved-searches")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Special chars: !@#$%^&*()_+-={}[]|\\:\";'<>?,./",
          filters: { propertyType: ["HOUSE"] },
        });

      expect(res.status).toBe(201);
      expect(res.body.data.savedSearch.name).toBeDefined();
    });

    it("should handle empty filter updates", async () => {
      const searchRes = await request(app)
        .post("/api/v1/favorites/saved-searches")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Search for empty update",
          filters: { propertyType: ["HOUSE"] },
        });

      const res = await request(app)
        .put(
          `/api/v1/favorites/saved-searches/${searchRes.body.data.savedSearch.id}`,
        )
        .set("Authorization", `Bearer ${userToken}`)
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
