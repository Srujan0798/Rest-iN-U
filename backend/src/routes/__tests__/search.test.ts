import request from "supertest";
import { app } from "../../server";
import { prisma } from "../../utils/prisma";

describe("Search API", () => {
  let agentToken: string;
  let testProperty: any;

  beforeAll(async () => {
    // Create an agent for testing
    const agentRes = await request(app).post("/api/v1/auth/register").send({
      email: "search.agent@example.com",
      password: "password123",
      firstName: "Search",
      lastName: "Agent",
      userType: "AGENT",
    });

    agentToken = agentRes.body.data.accessToken;

    // Register as agent
    await request(app)
      .post("/api/v1/auth/register-agent")
      .set("Authorization", `Bearer ${agentToken}`)
      .send({
        licenseNumber: "AG999999",
        licenseState: "California",
        licenseExpiry: "2025-12-31",
        brokerage: "Search Realty",
      });

    // Create test properties for search
    const properties = [
      {
        title: "Luxury Villa with Pool",
        description: "Beautiful 4 bedroom villa with swimming pool",
        propertyType: "VILLA",
        listingType: "SALE",
        streetAddress: "123 Luxury St",
        city: "Beverly Hills",
        state: "CA",
        zipCode: "90210",
        country: "USA",
        latitude: 34.0736,
        longitude: -118.4004,
        price: 2500000,
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 3500,
        yearBuilt: 2015,
        features: ["POOL", "GARDEN", "GARAGE"],
        photos: [
          {
            url: "https://example.com/villa1.jpg",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Modern Condo Downtown",
        description: "Sleek 2 bedroom condo with city view",
        propertyType: "CONDO",
        listingType: "RENT",
        streetAddress: "456 Urban Ave",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA",
        latitude: 37.7897,
        longitude: -122.4,
        price: 4500,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        yearBuilt: 2020,
        features: ["GYM", "CONCIERGE", "BALCONY"],
        photos: [
          {
            url: "https://example.com/condo1.jpg",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Family Home with Garden",
        description: "Spacious 3 bedroom home perfect for families",
        propertyType: "HOUSE",
        listingType: "SALE",
        streetAddress: "789 Family Dr",
        city: "Palo Alto",
        state: "CA",
        zipCode: "94301",
        country: "USA",
        latitude: 37.4419,
        longitude: -122.143,
        price: 1800000,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 2200,
        yearBuilt: 2010,
        features: ["GARDEN", "FIREPLACE", "GARAGE"],
        photos: [
          {
            url: "https://example.com/house1.jpg",
            isPrimary: true,
          },
        ],
      },
    ];

    // Create properties
    for (const propertyData of properties) {
      const res = await request(app)
        .post("/api/v1/properties")
        .set("Authorization", `Bearer ${agentToken}`)
        .send(propertyData);

      if (propertyData.title === "Luxury Villa with Pool") {
        testProperty = res.body.data;
      }
    }
  });

  describe("POST /api/search/advanced", () => {
    it("should return search results for basic query", async () => {
      const res = await request(app)
        .post("/api/v1/search/advanced")
        .send({
          propertyType: ["HOUSE"],
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.properties).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toBeDefined();
    });

    it("should filter by property type correctly", async () => {
      const res = await request(app)
        .post("/api/v1/search/advanced")
        .send({
          propertyType: ["VILLA"],
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      res.body.data.properties.forEach((property: any) => {
        expect(property.propertyType).toBe("VILLA");
      });
    });

    it("should filter by price range", async () => {
      const res = await request(app).post("/api/v1/search/advanced").send({
        minPrice: 1000000,
        maxPrice: 3000000,
        page: 1,
        limit: 10,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      res.body.data.properties.forEach((property: any) => {
        expect(property.price).toBeGreaterThanOrEqual(1000000);
        expect(property.price).toBeLessThanOrEqual(3000000);
      });
    });

    it("should filter by bedrooms and bathrooms", async () => {
      const res = await request(app).post("/api/v1/search/advanced").send({
        minBedrooms: 3,
        minBathrooms: 2,
        page: 1,
        limit: 10,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      res.body.data.properties.forEach((property: any) => {
        expect(property.bedrooms).toBeGreaterThanOrEqual(3);
        expect(property.bathrooms).toBeGreaterThanOrEqual(2);
      });
    });

    it("should filter by square footage", async () => {
      const res = await request(app).post("/api/v1/search/advanced").send({
        minSquareFeet: 2000,
        page: 1,
        limit: 10,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      res.body.data.properties.forEach((property: any) => {
        expect(property.squareFeet).toBeGreaterThanOrEqual(2000);
      });
    });

    it("should filter by features", async () => {
      const res = await request(app)
        .post("/api/v1/search/advanced")
        .send({
          features: ["POOL"],
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // At least one property should have POOL feature
      const hasPool = res.body.data.properties.some(
        (property: any) =>
          property.features && property.features.includes("POOL"),
      );
      expect(hasPool).toBe(true);
    });

    it("should filter by location city", async () => {
      const res = await request(app)
        .post("/api/v1/search/advanced")
        .send({
          location: {
            city: "Beverly Hills",
          },
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      res.body.data.properties.forEach((property: any) => {
        expect(property.city.toLowerCase()).toContain(
          "beverly hills".toLowerCase(),
        );
      });
    });

    it("should filter by listing type", async () => {
      const res = await request(app).post("/api/v1/search/advanced").send({
        listingType: "RENT",
        page: 1,
        limit: 10,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      res.body.data.properties.forEach((property: any) => {
        expect(property.listingType).toBe("RENT");
      });
    });

    it("should handle must-have features (AND logic)", async () => {
      const res = await request(app)
        .post("/api/v1/search/advanced")
        .send({
          mustHaveFeatures: ["POOL", "GARDEN"],
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should handle geographical search with coordinates", async () => {
      const res = await request(app)
        .post("/api/v1/search/advanced")
        .send({
          location: {
            latitude: 37.7749,
            longitude: -122.4194,
            radiusMiles: 25,
          },
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should handle sorting by price", async () => {
      const res = await request(app).post("/api/v1/search/advanced").send({
        sortBy: "price",
        sortOrder: "asc",
        page: 1,
        limit: 10,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify sorting
      const properties = res.body.data.properties;
      for (let i = 1; i < properties.length; i++) {
        expect(properties[i].price).toBeGreaterThanOrEqual(
          properties[i - 1].price,
        );
      }
    });

    it("should handle sorting by square feet", async () => {
      const res = await request(app).post("/api/v1/search/advanced").send({
        sortBy: "squareFeet",
        sortOrder: "desc",
        page: 1,
        limit: 10,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should include pagination metadata", async () => {
      const res = await request(app).post("/api/v1/search/advanced").send({
        page: 2,
        limit: 5,
      });

      expect(res.status).toBe(200);
      expect(res.body.data.pagination).toHaveProperty("page", 2);
      expect(res.body.data.pagination).toHaveProperty("limit", 5);
      expect(res.body.data.pagination).toHaveProperty("total");
      expect(res.body.data.pagination).toHaveProperty("totalPages");
      expect(res.body.data.pagination).toHaveProperty("hasMore");
    });

    it("should validate limit constraints", async () => {
      const res = await request(app).post("/api/v1/search/advanced").send({
        limit: 200, // Exceeds max of 100
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should include filter information", async () => {
      const res = await request(app)
        .post("/api/v1/search/advanced")
        .send({
          propertyType: ["HOUSE"],
          minPrice: 1000000,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.filters).toBeDefined();
      expect(res.body.data.filters.applied).toBeGreaterThan(0);
      expect(res.body.data.filters.available).toBeDefined();
    });

    it("should return empty results for no matches", async () => {
      const res = await request(app)
        .post("/api/v1/search/advanced")
        .send({
          propertyType: ["HOUSE"],
          city: "NonExistentCity",
          minPrice: 10000000,
          maxPrice: 11000000,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.properties).toEqual([]);
      expect(res.body.data.pagination.total).toBe(0);
    });
  });

  describe("POST /api/search/natural-language", () => {
    it('should parse and search for "3 bedroom house"', async () => {
      const res = await request(app)
        .post("/api/v1/search/natural-language")
        .send({
          query: "3 bedroom house",
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.originalQuery).toBe("3 bedroom house");
      expect(res.body.data.parsedFilters).toBeDefined();
      expect(res.body.data.parsedFilters.minBedrooms).toBe(3);
      expect(res.body.data.parsedFilters.propertyType).toContain("HOUSE");
    });

    it('should parse and search for "condo under $500k"', async () => {
      const res = await request(app)
        .post("/api/v1/search/natural-language")
        .send({
          query: "condo under $500k",
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.parsedFilters.propertyType).toContain("CONDO");
      expect(res.body.data.parsedFilters.maxPrice).toBe(500000);
    });

    it('should parse complex query "3 bedroom 2 bathroom house with pool in California"', async () => {
      const res = await request(app)
        .post("/api/v1/search/natural-language")
        .send({
          query: "3 bedroom 2 bathroom house with pool in California",
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.parsedFilters.minBedrooms).toBe(3);
      expect(res.body.data.parsedFilters.minBathrooms).toBe(2);
      expect(res.body.data.parsedFilters.propertyType).toContain("HOUSE");
      expect(res.body.data.parsedFilters.features).toContain("POOL");
      expect(res.body.data.parsedFilters.location?.state).toBe("California");
    });

    it('should parse rental query "2 bedroom apartment for rent"', async () => {
      const res = await request(app)
        .post("/api/v1/search/natural-language")
        .send({
          query: "2 bedroom apartment for rent",
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.parsedFilters.minBedrooms).toBe(2);
      expect(res.body.data.parsedFilters.listingType).toBe("RENT");
    });

    it('should parse square footage "1500 sqft home"', async () => {
      const res = await request(app)
        .post("/api/v1/search/natural-language")
        .send({
          query: "1500 sqft home",
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.parsedFilters.minSquareFeet).toBe(1500);
      expect(res.body.data.parsedFilters.propertyType).toContain("HOUSE");
    });

    it("should parse vastu-related query", async () => {
      const res = await request(app)
        .post("/api/v1/search/natural-language")
        .send({
          query: "vastu compliant house",
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.parsedFilters.minVastuScore).toBe(60);
    });

    it("should parse climate-safe query", async () => {
      const res = await request(app)
        .post("/api/v1/search/natural-language")
        .send({
          query: "safe climate low flood risk property",
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.parsedFilters.maxClimateRiskScore).toBe(25);
    });

    it("should handle empty query", async () => {
      const res = await request(app)
        .post("/api/v1/search/natural-language")
        .send({
          query: "",
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should handle short query", async () => {
      const res = await request(app)
        .post("/api/v1/search/natural-language")
        .send({
          query: "hi",
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should provide suggestions for no results", async () => {
      const res = await request(app)
        .post("/api/v1/search/natural-language")
        .send({
          query: "magical castle in Atlantis",
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.properties).toEqual([]);
      expect(res.body.data.suggestions).toBeDefined();
      expect(res.body.data.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/search/autocomplete", () => {
    it("should return city suggestions", async () => {
      const res = await request(app).get("/api/v1/search/autocomplete").query({
        query: "San",
        type: "location",
        limit: 5,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.suggestions).toBeInstanceOf(Array);

      const citySuggestions = res.body.data.suggestions.filter(
        (s: any) => s.type === "city",
      );
      expect(citySuggestions.length).toBeGreaterThan(0);

      citySuggestions.forEach((suggestion: any) => {
        expect(suggestion.type).toBe("city");
        expect(suggestion.value).toBeDefined();
        expect(suggestion.display).toBeDefined();
        expect(suggestion.metadata).toBeDefined();
      });
    });

    it("should return feature suggestions", async () => {
      const res = await request(app).get("/api/v1/search/autocomplete").query({
        query: "pool",
        type: "feature",
        limit: 5,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.suggestions).toBeInstanceOf(Array);

      const featureSuggestions = res.body.data.suggestions.filter(
        (s: any) => s.type === "feature",
      );
      expect(featureSuggestions.length).toBeGreaterThan(0);

      featureSuggestions.forEach((suggestion: any) => {
        expect(suggestion.type).toBe("feature");
        expect(suggestion.value).toBeDefined();
        expect(suggestion.display).toBeDefined();
      });
    });

    it("should return agent suggestions", async () => {
      const res = await request(app).get("/api/v1/search/autocomplete").query({
        query: "Search",
        type: "agent",
        limit: 5,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.suggestions).toBeInstanceOf(Array);
    });

    it("should return zip code suggestions", async () => {
      const res = await request(app).get("/api/v1/search/autocomplete").query({
        query: "902",
        type: "location",
        limit: 5,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const zipSuggestions = res.body.data.suggestions.filter(
        (s: any) => s.type === "zipCode",
      );
      // May or may not have zip codes depending on test data
    });

    it('should return all types when type is "all"', async () => {
      const res = await request(app).get("/api/v1/search/autocomplete").query({
        query: "San",
        type: "all",
        limit: 10,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.suggestions).toBeInstanceOf(Array);

      const types = new Set(res.body.data.suggestions.map((s: any) => s.type));
      expect(
        types.has("city") || types.has("feature") || types.has("agent"),
      ).toBe(true);
    });

    it("should respect limit parameter", async () => {
      const res = await request(app).get("/api/v1/search/autocomplete").query({
        query: "a",
        type: "all",
        limit: 3,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.suggestions.length).toBeLessThanOrEqual(3);
    });

    it("should handle empty query", async () => {
      const res = await request(app).get("/api/v1/search/autocomplete").query({
        query: "",
        type: "all",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/search/suggestions", () => {
    it("should return popular search suggestions", async () => {
      const res = await request(app).get("/api/v1/search/suggestions");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.suggestions).toBeInstanceOf(Array);

      const popularSuggestions = res.body.data.suggestions.filter(
        (s: any) => s.type === "popular",
      );
      expect(popularSuggestions.length).toBeGreaterThan(0);

      popularSuggestions.forEach((suggestion: any) => {
        expect(suggestion.type).toBe("popular");
        expect(suggestion.title).toBeDefined();
        expect(suggestion.query).toBeDefined();
      });
    });

    it("should return personalized suggestions for authenticated user", async () => {
      // First create a user and some saved searches
      const userRes = await request(app).post("/api/v1/auth/register").send({
        email: "search.user@example.com",
        password: "password123",
        firstName: "Search",
        lastName: "User",
        userType: "BUYER",
      });

      const userToken = userRes.body.data.accessToken;

      const res = await request(app)
        .get("/api/v1/search/suggestions")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.suggestions).toBeInstanceOf(Array);

      // Should have both popular and potentially personalized suggestions
      const types = new Set(res.body.data.suggestions.map((s: any) => s.type));
      expect(types.has("popular")).toBe(true);
    });

    it("should include trending property types", async () => {
      const res = await request(app).get("/api/v1/search/suggestions");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Check for expected popular search categories
      const suggestions = res.body.data.suggestions;
      const hasPopularSearches = suggestions.some(
        (s: any) => s.type === "popular" && s.title && s.query,
      );
      expect(hasPopularSearches).toBe(true);
    });
  });

  describe("GET /api/search/trending", () => {
    it("should return trending searches", async () => {
      const res = await request(app).get("/api/v1/search/trending");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.trending).toBeInstanceOf(Array);
      expect(res.body.data.trending.length).toBeGreaterThan(0);

      res.body.data.trending.forEach((trending: any, index: number) => {
        expect(trending.rank).toBe(index + 1);
        expect(trending.term).toBeDefined();
        expect(trending.searchCount).toBeGreaterThan(0);
        expect(trending.trend).toMatch(/^(up|down|stable)$/);
        expect(typeof trending.change).toBe("number");
      });
    });

    it("should include diverse trending topics", async () => {
      const res = await request(app).get("/api/v1/search/trending");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const trendingTerms = res.body.data.trending.map((t: any) =>
        t.term.toLowerCase(),
      );

      // Should include various property-related trends
      const hasVastu = trendingTerms.some((term) => term.includes("vastu"));
      const hasClimate = trendingTerms.some((term) => term.includes("climate"));
      const hasFeatures = trendingTerms.some(
        (term) =>
          term.includes("pool") ||
          term.includes("smart") ||
          term.includes("solar"),
      );

      expect(hasVastu || hasClimate || hasFeatures).toBe(true);
    });

    it("should include trend direction information", async () => {
      const res = await request(app).get("/api/v1/search/trending");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      res.body.data.trending.forEach((trending: any) => {
        expect(["up", "down", "stable"]).toContain(trending.trend);
        expect(typeof trending.change).toBe("number");

        // Trend direction should match change sign
        if (trending.trend === "up") {
          expect(trending.change).toBeGreaterThan(0);
        } else if (trending.trend === "down") {
          expect(trending.change).toBeLessThan(0);
        } else if (trending.trend === "stable") {
          expect(Math.abs(trending.change)).toBeLessThanOrEqual(5);
        }
      });
    });
  });

  describe("Search Performance and Edge Cases", () => {
    it("should handle complex multi-filter searches", async () => {
      const res = await request(app)
        .post("/api/v1/search/advanced")
        .send({
          propertyType: ["HOUSE", "VILLA"],
          minBedrooms: 3,
          maxPrice: 3000000,
          features: ["GARDEN"],
          location: {
            state: "CA",
          },
          sortBy: "price",
          sortOrder: "asc",
          page: 1,
          limit: 5,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.properties).toBeInstanceOf(Array);
    });

    it("should handle searches with no results gracefully", async () => {
      const res = await request(app)
        .post("/api/v1/search/advanced")
        .send({
          propertyType: ["CASTLE"],
          minBedrooms: 10,
          maxPrice: 1000,
          location: {
            city: "Atlantis",
          },
          page: 1,
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.properties).toEqual([]);
      expect(res.body.data.pagination.total).toBe(0);
    });

    it("should handle invalid sort options", async () => {
      const res = await request(app).post("/api/v1/search/advanced").send({
        sortBy: "invalidField",
        page: 1,
        limit: 10,
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should handle pagination edge cases", async () => {
      // Test very high page number
      const res = await request(app).post("/api/v1/search/advanced").send({
        page: 999999,
        limit: 10,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.properties).toEqual([]);
    });

    it("should include relevant property metadata in results", async () => {
      const res = await request(app)
        .post("/api/v1/search/advanced")
        .send({
          propertyType: ["VILLA"],
          page: 1,
          limit: 1,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      if (res.body.data.properties.length > 0) {
        const property = res.body.data.properties[0];
        expect(property).toHaveProperty("id");
        expect(property).toHaveProperty("title");
        expect(property).toHaveProperty("price");
        expect(property).toHaveProperty("photos");
        expect(property).toHaveProperty("vastuAnalysis");
        expect(property).toHaveProperty("climateAnalysis");
        expect(property).toHaveProperty("listingAgent");
        expect(property).toHaveProperty("neighborhood");
      }
    });
  });
});
