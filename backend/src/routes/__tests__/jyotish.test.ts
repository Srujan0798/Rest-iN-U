import request from "supertest";
import { app } from "../../server";

describe("Jyotish & Muhurat API", () => {
  
  describe("GET /api/v1/muhurat/dates", () => {
    it("should return auspicious dates for visit", async () => {
      const res = await request(app).get("/api/v1/muhurat/dates?type=visit");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("dates");
      expect(Array.isArray(res.body.dates)).toBe(true);
      expect(res.body.type).toBe("visit");
    });

    it("should default to visit type if not specified", async () => {
      const res = await request(app).get("/api/v1/muhurat/dates");
      expect(res.status).toBe(200);
      expect(res.body.type).toBe("visit");
    });
  });

  describe("GET /api/v1/muhurat/check", () => {
    it("should check a specific date", async () => {
      const date = new Date().toISOString().split('T')[0];
      const res = await request(app).get(`/api/v1/muhurat/check?date=${date}`);
      expect(res.status).toBe(200);
      expect(res.body.date).toBe(date);
      expect(res.body).toHaveProperty("isAuspicious");
      expect(res.body).toHaveProperty("score");
    });

    it("should return 400 if date is missing", async () => {
      const res = await request(app).get("/api/v1/muhurat/check");
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/v1/jyotish/match", () => {
    const buyerDetails = {
      dateOfBirth: "1990-01-01",
      timeOfBirth: "10:00",
      placeOfBirth: {
        city: "Mumbai",
        country: "India"
      }
    };

    const propertyDetails = {
      address: "123 Main St",
      entranceDirection: "EAST",
      propertyNumber: 5,
      floor: 3,
      constructionYear: 2020
    };

    it("should return compatibility match", async () => {
      const res = await request(app)
        .post("/api/v1/jyotish/match")
        .send({
          buyerDetails,
          propertyDetails
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("compatibility");
      expect(res.body).toHaveProperty("overallRecommendation");
      expect(res.body.compatibility).toHaveProperty("overallScore");
    });

    it("should fail with invalid data", async () => {
      const res = await request(app)
        .post("/api/v1/jyotish/match")
        .send({
          buyerDetails: {} // Missing required fields
        });

      expect(res.status).toBe(400);
    });
  });
});
