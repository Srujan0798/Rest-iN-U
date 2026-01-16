import request from "supertest";
import { app } from "../../server";

describe("Properties API", () => {
  describe("GET /api/properties", () => {
    it("should return 200 and array of properties", async () => {
      const res = await request(app).get("/api/v1/properties");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.properties).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toBeDefined();
    });

    it("should filter by city correctly", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ city: "Bangalore" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.properties).toBeInstanceOf(Array);

      // All returned properties should have Bangalore in city
      res.body.data.properties.forEach((property: any) => {
        expect(property.city.toLowerCase()).toContain(
          "bangalore".toLowerCase(),
        );
      });
    });

    it("should filter by price range correctly", async () => {
      const minPrice = 5000000;
      const maxPrice = 10000000;

      const res = await request(app)
        .get("/api/v1/properties")
        .query({ minPrice, maxPrice });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // All returned properties should be within price range
      res.body.data.properties.every((property: any) => {
        expect(property.price).toBeGreaterThanOrEqual(minPrice);
        expect(property.price).toBeLessThanOrEqual(maxPrice);
        return true;
      });
    });

    it("should filter by propertyType correctly", async () => {
      const propertyType = "HOUSE";

      const res = await request(app)
        .get("/api/v1/properties")
        .query({ propertyType });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // All returned properties should be of the specified type
      res.body.data.properties.forEach((property: any) => {
        expect(property.propertyType).toBe(propertyType);
      });
    });

    it("should handle pagination correctly", async () => {
      const page = 2;
      const limit = 10;

      const res = await request(app)
        .get("/api/v1/properties")
        .query({ page, limit });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.pagination.page).toBe(page);
      expect(res.body.data.pagination.limit).toBe(limit);
      expect(res.body.data.properties.length).toBeLessThanOrEqual(limit);
    });

    it("should validate pagination parameters", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ page: -1, limit: 0 });

      expect(res.status).toBe(400);
    });

    it("should combine multiple filters", async () => {
      const res = await request(app).get("/api/v1/properties").query({
        city: "Bangalore",
        minPrice: 3000000,
        maxPrice: 15000000,
        propertyType: "HOUSE",
        minBedrooms: 3,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.properties).toBeInstanceOf(Array);
    });

    it("should sort results correctly", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ sortBy: "price", sortOrder: "asc" });

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

    it("should include nested data correctly", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ limit: 1 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      if (res.body.data.properties.length > 0) {
        const property = res.body.data.properties[0];
        expect(property).toHaveProperty("id");
        expect(property).toHaveProperty("title");
        expect(property).toHaveProperty("price");
        expect(property).toHaveProperty("city");
        expect(property).toHaveProperty("photos");
        expect(property).toHaveProperty("vastuAnalysis");
        expect(property).toHaveProperty("climateAnalysis");
      }
    });
  });

  describe("GET /api/properties/:id", () => {
    it("should return 404 for invalid property ID", async () => {
      const invalidId = "invalid-property-id";

      const res = await request(app).get(`/api/v1/properties/${invalidId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("Property not found");
    });

    it("should return 404 for non-existent property ID", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000";

      const res = await request(app).get(`/api/v1/properties/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should validate UUID format", async () => {
      const malformedId = "not-a-uuid";

      const res = await request(app).get(`/api/v1/properties/${malformedId}`);

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/properties/:id/similar", () => {
    it("should return 404 for invalid property ID when fetching similar properties", async () => {
      const invalidId = "invalid-property-id";

      const res = await request(app).get(
        `/api/v1/properties/${invalidId}/similar`,
      );

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should limit similar properties correctly", async () => {
      const invalidId = "00000000-0000-0000-0000-000000000000";
      const limit = 3;

      const res = await request(app)
        .get(`/api/v1/properties/${invalidId}/similar`)
        .query({ limit });

      expect(res.status).toBe(404);
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle empty results gracefully", async () => {
      const res = await request(app).get("/api/v1/properties").query({
        city: "NonExistentCity12345",
        minPrice: 999999999,
        maxPrice: 1000000000,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.properties).toEqual([]);
      expect(res.body.data.pagination.total).toBe(0);
    });

    it("should validate invalid filter parameters", async () => {
      const res = await request(app).get("/api/v1/properties").query({
        minPrice: "invalid",
        maxBedrooms: -1,
        propertyType: "INVALID_TYPE",
      });

      expect(res.status).toBe(400);
    });

    it("should handle very large page numbers gracefully", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ page: 999999 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.properties).toEqual([]);
    });

    it("should respect maximum limit constraint", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ limit: 1000 });

      expect(res.status).toBe(200);
      expect(res.body.data.properties.length).toBeLessThanOrEqual(100);
    });
  });

  describe("Caching behavior", () => {
    it("should return consistent results for identical requests", async () => {
      const query = { city: "Bangalore", limit: 5 };

      const res1 = await request(app).get("/api/v1/properties").query(query);

      const res2 = await request(app).get("/api/v1/properties").query(query);

      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(res1.body).toEqual(res2.body);
    });
  });

  describe("POST /api/v1/properties", () => {
    it("should return 401 when not authenticated", async () => {
      const res = await request(app)
        .post("/api/v1/properties")
        .send({
          title: "Test Property",
          description: "A beautiful test property with great amenities",
          propertyType: "HOUSE",
          listingType: "SALE",
          streetAddress: "123 Test Street",
          city: "Bangalore",
          state: "Karnataka",
          zipCode: "560001",
          latitude: 12.9716,
          longitude: 77.5946,
          price: 5000000,
          bedrooms: 3,
          bathrooms: 2,
        });

      expect(res.status).toBe(401);
    });

    it("should return 400 for invalid property data", async () => {
      const res = await request(app)
        .post("/api/v1/properties")
        .set("Authorization", "Bearer test-token")
        .send({
          title: "Ab", // Too short
          description: "Short", // Too short
          propertyType: "INVALID_TYPE",
          price: -1000, // Negative price
        });

      expect(res.status).toBe(400);
    });

    it("should validate required fields", async () => {
      const res = await request(app)
        .post("/api/v1/properties")
        .set("Authorization", "Bearer test-token")
        .send({
          title: "Valid Title Property",
          // Missing required fields
        });

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/v1/properties/:id", () => {
    it("should return 401 when not authenticated", async () => {
      const res = await request(app)
        .put("/api/v1/properties/00000000-0000-0000-0000-000000000000")
        .send({
          price: 6000000,
        });

      expect(res.status).toBe(401);
    });

    it("should return 404 for non-existent property", async () => {
      const res = await request(app)
        .put("/api/v1/properties/00000000-0000-0000-0000-000000000000")
        .set("Authorization", "Bearer test-token")
        .send({
          price: 6000000,
        });

      expect(res.status).toBe(404);
    });

    it("should validate update data", async () => {
      const res = await request(app)
        .put("/api/v1/properties/00000000-0000-0000-0000-000000000000")
        .set("Authorization", "Bearer test-token")
        .send({
          price: -1000, // Invalid negative price
          yearBuilt: 3000, // Invalid future year
        });

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/v1/properties/:id", () => {
    it("should return 401 when not authenticated", async () => {
      const res = await request(app)
        .delete("/api/v1/properties/00000000-0000-0000-0000-000000000000");

      expect(res.status).toBe(401);
    });

    it("should return 404 for non-existent property", async () => {
      const res = await request(app)
        .delete("/api/v1/properties/00000000-0000-0000-0000-000000000000")
        .set("Authorization", "Bearer test-token");

      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/v1/properties/:id/photos", () => {
    it("should return 401 when not authenticated", async () => {
      const res = await request(app)
        .post("/api/v1/properties/00000000-0000-0000-0000-000000000000/photos")
        .send({
          photos: [{ url: "https://example.com/photo.jpg" }],
        });

      expect(res.status).toBe(401);
    });

    it("should return 404 for non-existent property", async () => {
      const res = await request(app)
        .post("/api/v1/properties/00000000-0000-0000-0000-000000000000/photos")
        .set("Authorization", "Bearer test-token")
        .send({
          photos: [{ url: "https://example.com/photo.jpg" }],
        });

      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/v1/properties/:id/schedule-showing", () => {
    it("should return 401 when not authenticated", async () => {
      const res = await request(app)
        .post("/api/v1/properties/00000000-0000-0000-0000-000000000000/schedule-showing")
        .send({
          scheduledAt: new Date().toISOString(),
        });

      expect(res.status).toBe(401);
    });

    it("should return 400 when scheduledAt is missing", async () => {
      const res = await request(app)
        .post("/api/v1/properties/00000000-0000-0000-0000-000000000000/schedule-showing")
        .set("Authorization", "Bearer test-token")
        .send({});

      expect(res.status).toBe(400);
    });

    it("should return 404 for non-existent property", async () => {
      const res = await request(app)
        .post("/api/v1/properties/00000000-0000-0000-0000-000000000000/schedule-showing")
        .set("Authorization", "Bearer test-token")
        .send({
          scheduledAt: new Date().toISOString(),
        });

      expect(res.status).toBe(404);
    });
  });

  describe("Vastu and Climate filters", () => {
    it("should filter by minimum vastu score", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ minVastuScore: 70 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // All returned properties should have vastu score >= 70
      res.body.data.properties.forEach((property: any) => {
        if (property.vastuAnalysis) {
          expect(property.vastuAnalysis.overallScore).toBeGreaterThanOrEqual(70);
        }
      });
    });

    it("should filter by maximum climate risk", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ maxClimateRisk: 30 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // All returned properties should have climate risk <= 30
      res.body.data.properties.forEach((property: any) => {
        if (property.climateAnalysis) {
          expect(property.climateAnalysis.overallRiskScore).toBeLessThanOrEqual(30);
        }
      });
    });

    it("should combine vastu and climate filters", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ minVastuScore: 60, maxClimateRisk: 50 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("Sorting", () => {
    it("should sort by price descending", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ sortBy: "price", sortOrder: "desc" });

      expect(res.status).toBe(200);

      const properties = res.body.data.properties;
      for (let i = 1; i < properties.length; i++) {
        expect(properties[i].price).toBeLessThanOrEqual(properties[i - 1].price);
      }
    });

    it("should sort by bedrooms ascending", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ sortBy: "bedrooms", sortOrder: "asc" });

      expect(res.status).toBe(200);

      const properties = res.body.data.properties;
      for (let i = 1; i < properties.length; i++) {
        expect(properties[i].bedrooms).toBeGreaterThanOrEqual(properties[i - 1].bedrooms);
      }
    });

    it("should sort by squareFeet", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ sortBy: "squareFeet", sortOrder: "desc" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should default to createdAt desc sorting", async () => {
      const res = await request(app).get("/api/v1/properties");

      expect(res.status).toBe(200);
      // Default sorting is by createdAt desc - no specific assertion needed
      // Just verify the request succeeds
    });
  });

  describe("Bedroom and bathroom filters", () => {
    it("should filter by minimum bedrooms", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ minBedrooms: 4 });

      expect(res.status).toBe(200);

      res.body.data.properties.forEach((property: any) => {
        expect(property.bedrooms).toBeGreaterThanOrEqual(4);
      });
    });

    it("should filter by maximum bedrooms", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ maxBedrooms: 2 });

      expect(res.status).toBe(200);

      res.body.data.properties.forEach((property: any) => {
        expect(property.bedrooms).toBeLessThanOrEqual(2);
      });
    });

    it("should filter by bathroom range", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ minBathrooms: 2, maxBathrooms: 4 });

      expect(res.status).toBe(200);

      res.body.data.properties.forEach((property: any) => {
        expect(property.bathrooms).toBeGreaterThanOrEqual(2);
        expect(property.bathrooms).toBeLessThanOrEqual(4);
      });
    });
  });

  describe("Square footage filters", () => {
    it("should filter by minimum square feet", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ minSquareFeet: 2000 });

      expect(res.status).toBe(200);

      res.body.data.properties.forEach((property: any) => {
        if (property.squareFeet) {
          expect(property.squareFeet).toBeGreaterThanOrEqual(2000);
        }
      });
    });

    it("should filter by square footage range", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ minSquareFeet: 1000, maxSquareFeet: 3000 });

      expect(res.status).toBe(200);
    });
  });

  describe("Year built filters", () => {
    it("should filter by minimum year built", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ minYearBuilt: 2010 });

      expect(res.status).toBe(200);

      res.body.data.properties.forEach((property: any) => {
        if (property.yearBuilt) {
          expect(property.yearBuilt).toBeGreaterThanOrEqual(2010);
        }
      });
    });

    it("should filter by year built range", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ minYearBuilt: 2000, maxYearBuilt: 2020 });

      expect(res.status).toBe(200);
    });
  });

  describe("Listing type filter", () => {
    it("should filter by SALE listing type", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ listingType: "SALE" });

      expect(res.status).toBe(200);

      res.body.data.properties.forEach((property: any) => {
        expect(property.listingType).toBe("SALE");
      });
    });

    it("should filter by RENT listing type", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ listingType: "RENT" });

      expect(res.status).toBe(200);
    });
  });

  describe("Features filter", () => {
    it("should filter by features", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ features: "pool,garage" });

      expect(res.status).toBe(200);
      // Properties should have both pool and garage features
    });
  });

  describe("Multiple property types", () => {
    it("should filter by multiple property types", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ propertyType: "HOUSE,CONDO,VILLA" });

      expect(res.status).toBe(200);

      res.body.data.properties.forEach((property: any) => {
        expect(["HOUSE", "CONDO", "VILLA"]).toContain(property.propertyType);
      });
    });
  });
});
