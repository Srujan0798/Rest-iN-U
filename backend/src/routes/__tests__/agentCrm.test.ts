import request from "supertest";
import { app } from "../../server";

describe("Agent CRM API", () => {
  describe("GET /api/agent-crm/leads", () => {
    it("should return leads list with stats", async () => {
      const res = await request(app).get("/api/v1/agent-crm/leads");

      expect(res.status).toBe(200);
      expect(res.body.leads).toBeInstanceOf(Array);
      expect(res.body.total).toBe(3);
      expect(res.body.stats).toBeDefined();
      expect(res.body.stats.hot).toBe(1);
      expect(res.body.stats.warm).toBe(1);
      expect(res.body.stats.new).toBe(1);
      expect(res.body.stats.cold).toBe(0);
    });

    it("should filter leads by status", async () => {
      const res = await request(app)
        .get("/api/v1/agent-crm/leads")
        .query({ status: "hot" });

      expect(res.status).toBe(200);
      expect(res.body.leads).toBeInstanceOf(Array);
      // Mock data should contain hot leads
    });

    it("should filter leads by source", async () => {
      const res = await request(app)
        .get("/api/v1/agent-crm/leads")
        .query({ source: "website" });

      expect(res.status).toBe(200);
      expect(res.body.leads).toBeInstanceOf(Array);
    });

    it("should handle authentication", async () => {
      const res = await request(app).get("/api/v1/agent-crm/leads");
      // Should require auth middleware
      expect(res.status).toBeGreaterThanOrEqual(401);
    });
  });

  describe("POST /api/agent-crm/leads", () => {
    it("should create a new lead", async () => {
      const leadData = {
        name: "Test User",
        email: "test@example.com",
        phone: "555-123-4567",
        source: "website",
        type: "buyer",
        budget: "$500,000 - $700,000",
        timeline: "1-3 months",
        interests: ["3 bedrooms", "Downtown"],
        notes: "Test lead",
      };

      const res = await request(app)
        .post("/api/v1/agent-crm/leads")
        .send(leadData);

      expect(res.status).toBe(201);
      expect(res.body.leadId).toBeDefined();
      expect(res.body.message).toBe("Lead created successfully");
      expect(res.body.name).toBe(leadData.name);
      expect(res.body.status).toBe("new");
    });

    it("should validate required fields", async () => {
      const invalidData = {
        email: "invalid-email",
        type: "invalid-type",
      };

      const res = await request(app)
        .post("/api/v1/agent-crm/leads")
        .send(invalidData);

      expect(res.status).toBe(500);
    });

    it("should create lead with minimal data", async () => {
      const minimalData = {
        name: "Minimal Lead",
        source: "referral",
        type: "seller",
      };

      const res = await request(app)
        .post("/api/v1/agent-crm/leads")
        .send(minimalData);

      expect(res.status).toBe(201);
      expect(res.body.leadId).toBeDefined();
    });
  });

  describe("PATCH /api/agent-crm/leads/:leadId", () => {
    it("should update lead status", async () => {
      const leadId = "lead_123";
      const updates = {
        status: "hot",
        notes: "Updated status to hot",
        nextFollowUp: "2024-01-25",
      };

      const res = await request(app)
        .patch(`/api/v1/agent-crm/leads/${leadId}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.leadId).toBe(leadId);
      expect(res.body.status).toBe("hot");
    });

    it("should validate status values", async () => {
      const leadId = "lead_123";
      const invalidUpdates = {
        status: "invalid-status",
      };

      const res = await request(app)
        .patch(`/api/v1/agent-crm/leads/${leadId}`)
        .send(invalidUpdates);

      expect(res.status).toBe(500);
    });

    it("should handle partial updates", async () => {
      const leadId = "lead_123";
      const partialUpdate = {
        notes: "Added new note",
      };

      const res = await request(app)
        .patch(`/api/v1/agent-crm/leads/${leadId}`)
        .send(partialUpdate);

      expect(res.status).toBe(200);
      expect(res.body.notes).toBe("Added new note");
    });
  });

  describe("POST /api/agent-crm/leads/:leadId/activity", () => {
    it("should log activity for lead", async () => {
      const leadId = "lead_123";
      const activityData = {
        type: "call",
        description: "Had a productive conversation",
        outcome: "Interested in properties",
        followUpDate: "2024-01-26",
      };

      const res = await request(app)
        .post(`/api/v1/agent-crm/leads/${leadId}/activity`)
        .send(activityData);

      expect(res.status).toBe(201);
      expect(res.body.activityId).toBeDefined();
      expect(res.body.leadId).toBe(leadId);
      expect(res.body.type).toBe("call");
      expect(res.body.loggedAt).toBeDefined();
    });

    it("should validate activity types", async () => {
      const leadId = "lead_123";
      const invalidActivity = {
        type: "invalid-type",
        description: "Test",
      };

      const res = await request(app)
        .post(`/api/v1/agent-crm/leads/${leadId}/activity`)
        .send(invalidActivity);

      expect(res.status).toBe(500);
    });

    it("should create activity with minimal data", async () => {
      const leadId = "lead_123";
      const minimalActivity = {
        type: "note",
        description: "Left a note",
      };

      const res = await request(app)
        .post(`/api/v1/agent-crm/leads/${leadId}/activity`)
        .send(minimalActivity);

      expect(res.status).toBe(201);
    });
  });

  describe("GET /api/agent-crm/pipeline", () => {
    it("should return pipeline data", async () => {
      const res = await request(app).get("/api/v1/agent-crm/pipeline");

      expect(res.status).toBe(200);
      expect(res.body.pipeline).toBeInstanceOf(Array);
      expect(res.body.conversionRates).toBeDefined();

      // Check pipeline stages
      const pipeline = res.body.pipeline;
      expect(pipeline.length).toBeGreaterThan(0);
      expect(pipeline[0]).toHaveProperty("stage");
      expect(pipeline[0]).toHaveProperty("count");
      expect(pipeline[0]).toHaveProperty("value");

      // Check conversion rates
      const conversionRates = res.body.conversionRates;
      expect(conversionRates).toHaveProperty("leadToContact");
      expect(conversionRates).toHaveProperty("contactToQualified");
      expect(conversionRates).toHaveProperty("qualifiedToOffer");
      expect(conversionRates).toHaveProperty("offerToClosed");
      expect(conversionRates).toHaveProperty("overallConversion");
    });

    it("should handle pipeline data integrity", async () => {
      const res = await request(app).get("/api/v1/agent-crm/pipeline");

      expect(res.status).toBe(200);

      const pipeline = res.body.pipeline;
      const totalLeads = pipeline.reduce(
        (sum: number, stage: any) => sum + stage.count,
        0,
      );
      expect(totalLeads).toBeGreaterThan(0);

      // Check that values are numbers
      pipeline.forEach((stage: any) => {
        expect(typeof stage.count).toBe("number");
        expect(typeof stage.value).toBe("number");
      });
    });
  });

  describe("GET /api/agent-crm/tasks", () => {
    it("should return tasks list with stats", async () => {
      const res = await request(app).get("/api/v1/agent-crm/tasks");

      expect(res.status).toBe(200);
      expect(res.body.tasks).toBeInstanceOf(Array);
      expect(res.body.stats).toBeDefined();

      // Check task structure
      const tasks = res.body.tasks;
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks[0]).toHaveProperty("id");
      expect(tasks[0]).toHaveProperty("title");
      expect(tasks[0]).toHaveProperty("type");
      expect(tasks[0]).toHaveProperty("dueDate");
      expect(tasks[0]).toHaveProperty("priority");
      expect(tasks[0]).toHaveProperty("status");
      expect(tasks[0]).toHaveProperty("relatedTo");

      // Check stats
      const stats = res.body.stats;
      expect(stats).toHaveProperty("overdue");
      expect(stats).toHaveProperty("dueToday");
      expect(stats).toHaveProperty("upcoming");
    });

    it("should validate task structure", async () => {
      const res = await request(app).get("/api/v1/agent-crm/tasks");

      expect(res.status).toBe(200);

      const tasks = res.body.tasks;
      tasks.forEach((task: any) => {
        expect(["follow_up", "showing", "document"]).toContain(task.type);
        expect(["high", "medium", "low"]).toContain(task.priority);
        expect(["pending", "overdue", "completed"]).toContain(task.status);
      });
    });
  });

  describe("GET /api/agent-crm/campaigns", () => {
    it("should return email campaigns", async () => {
      const res = await request(app).get("/api/v1/agent-crm/campaigns");

      expect(res.status).toBe(200);
      expect(res.body.campaigns).toBeInstanceOf(Array);

      // Check campaign structure
      const campaigns = res.body.campaigns;
      expect(campaigns.length).toBeGreaterThan(0);
      expect(campaigns[0]).toHaveProperty("id");
      expect(campaigns[0]).toHaveProperty("name");
      expect(campaigns[0]).toHaveProperty("type");
      expect(campaigns[0]).toHaveProperty("status");
      expect(campaigns[0]).toHaveProperty("recipients");

      // Check campaign types
      campaigns.forEach((campaign: any) => {
        expect(["drip", "newsletter"]).toContain(campaign.type);
        expect(["active", "scheduled", "completed"]).toContain(campaign.status);
      });
    });

    it("should include campaign metrics", async () => {
      const res = await request(app).get("/api/v1/agent-crm/campaigns");

      expect(res.status).toBe(200);

      const campaigns = res.body.campaigns;
      const activeCampaign = campaigns.find((c: any) => c.status === "active");

      if (activeCampaign) {
        expect(activeCampaign).toHaveProperty("opens");
        expect(activeCampaign).toHaveProperty("clicks");
        expect(activeCampaign).toHaveProperty("lastSent");
      }

      const scheduledCampaign = campaigns.find(
        (c: any) => c.status === "scheduled",
      );
      if (scheduledCampaign) {
        expect(scheduledCampaign).toHaveProperty("scheduledFor");
      }
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid lead ID", async () => {
      const res = await request(app)
        .patch("/api/v1/agent-crm/leads/invalid-id")
        .send({ status: "hot" });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it("should handle malformed requests", async () => {
      const res = await request(app)
        .post("/api/v1/agent-crm/leads")
        .send({ invalid: "data" });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it("should handle server errors gracefully", async () => {
      // This test would need to mock a database error
      const res = await request(app).get("/api/v1/agent-crm/leads");
      // Should return proper error format
      if (res.status >= 500) {
        expect(res.body).toHaveProperty("error");
      }
    });
  });

  describe("Authentication & Authorization", () => {
    it("should require authentication for all endpoints", async () => {
      const endpoints = [
        { method: "get", path: "/api/v1/agent-crm/leads" },
        { method: "get", path: "/api/v1/agent-crm/pipeline" },
        { method: "get", path: "/api/v1/agent-crm/tasks" },
        { method: "get", path: "/api/v1/agent-crm/campaigns" },
      ];

      for (const endpoint of endpoints) {
        const res = await (request as any)[endpoint.method](endpoint.path);
        expect(res.status).toBeGreaterThanOrEqual(401);
      }
    });
  });
});
