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
});
