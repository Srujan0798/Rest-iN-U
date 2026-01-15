import request from "supertest";
import { app } from "../../server";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";

describe("Authentication API", () => {
  const testUser = {
    email: "test@example.com",
    password: "password123",
    firstName: "Test",
    lastName: "User",
    phone: "+1234567890",
    userType: "BUYER" as const,
  };

  const testAgent = {
    licenseNumber: "AG123456",
    licenseState: "California",
    licenseExpiry: "2025-12-31",
    brokerage: "Test Realty",
    yearsExperience: 5,
    specialties: ["Residential", "Commercial"],
    serviceAreas: ["San Francisco", "San Jose"],
    languages: ["English", "Spanish"],
    bio: "Experienced real estate agent",
  };

  let authToken: string;
  let userId: string;

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
      expect(res.body.data.user.firstName).toBe(testUser.firstName);
      expect(res.body.data.user.lastName).toBe(testUser.lastName);
      expect(res.body.data.user.userType).toBe(testUser.userType);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();

      // Save user data for later tests
      userId = res.body.data.user.id;
      authToken = res.body.data.accessToken;
    });

    it("should not allow duplicate email registration", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(testUser);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("already exists");
    });

    it("should validate required fields", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should validate email format", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          ...testUser,
          email: "invalid-email",
        });

      expect(res.status).toBe(400);
    });

    it("should validate password length", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          ...testUser,
          email: "test2@example.com",
          password: "123",
        });

      expect(res.status).toBe(400);
    });

    it("should calculate life path number when DOB provided", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          ...testUser,
          email: "test3@example.com",
          dateOfBirth: "1990-01-01",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.user.id).toBeDefined();
    });

    it("should create karmic score and token balance for new user", async () => {
      const newEmail = "test4@example.com";
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          ...testUser,
          email: newEmail,
        });

      const user = await prisma.user.findUnique({
        where: { email: newEmail },
        include: {
          karmicScores: true,
          tokenBalance: true,
        },
      });

      expect(user?.karmicScores).toBeDefined();
      expect(user?.tokenBalance).toBeDefined();
      expect(user?.tokenBalance.balance).toBe(100);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it("should reject invalid email", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "nonexistent@example.com",
        password: testUser.password,
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("Invalid email or password");
    });

    it("should reject invalid password", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should update last login timestamp", async () => {
      const beforeLogin = new Date();

      await request(app).post("/api/v1/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      const user = await prisma.user.findUnique({
        where: { email: testUser.email.toLowerCase() },
      });

      expect(user?.lastLoginAt).toBeDefined();
      expect(user?.lastLoginAt!.getTime()).toBeGreaterThan(
        beforeLogin.getTime(),
      );
    });

    it("should validate required login fields", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({});

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/refresh", () => {
    it("should refresh access token with valid refresh token", async () => {
      const loginRes = await request(app).post("/api/v1/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      const refreshToken = loginRes.body.data.refreshToken;

      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.accessToken).not.toBe(
        loginRes.body.data.accessToken,
      );
    });

    it("should reject invalid refresh token", async () => {
      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: "invalid-token" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should require refresh token", async () => {
      const res = await request(app).post("/api/v1/auth/refresh").send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return current user profile with valid token", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email.toLowerCase());
      expect(res.body.data.firstName).toBe(testUser.firstName);
      expect(res.body.data.lastName).toBe(testUser.lastName);
      expect(res.body.data.karmicScores).toBeDefined();
      expect(res.body.data.tokenBalance).toBeDefined();
    });

    it("should reject request without token", async () => {
      const res = await request(app).get("/api/v1/auth/me");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should reject request with invalid token", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should include agent data if user is an agent", async () => {
      // First register as agent
      const agentEmail = "agent@example.com";
      const registerRes = await request(app)
        .post("/api/v1/auth/register")
        .send({
          ...testUser,
          email: agentEmail,
        });

      const agentToken = registerRes.body.data.accessToken;

      // Register as agent
      await request(app)
        .post("/api/v1/auth/register-agent")
        .set("Authorization", `Bearer ${agentToken}`)
        .send(testAgent);

      // Get profile
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${agentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.agent).toBeDefined();
      expect(res.body.data.agent.licenseNumber).toBe(testAgent.licenseNumber);
      expect(res.body.data.userType).toBe("AGENT");
    });
  });

  describe("POST /api/auth/register-agent", () => {
    let buyerToken: string;

    beforeAll(async () => {
      // Create a buyer user for agent registration tests
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          ...testUser,
          email: "buyer@example.com",
        });
      buyerToken = res.body.data.accessToken;
    });

    it("should register user as agent with valid data", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register-agent")
        .set("Authorization", `Bearer ${buyerToken}`)
        .send(testAgent);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.licenseNumber).toBe(testAgent.licenseNumber);
      expect(res.body.data.brokerage).toBe(testAgent.brokerage);
      expect(res.body.data.specialties).toEqual(testAgent.specialties);
    });

    it("should not allow duplicate agent registration", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register-agent")
        .set("Authorization", `Bearer ${buyerToken}`)
        .send(testAgent);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("already registered as an agent");
    });

    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register-agent")
        .send(testAgent);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should validate required agent fields", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register-agent")
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it("should validate license expiry date", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register-agent")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          ...testAgent,
          licenseNumber: "DIFF123",
          licenseExpiry: "invalid-date",
        });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully with valid token", async () => {
      const res = await request(app)
        .post("/api/v1/auth/logout")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("Logged out successfully");
    });

    it("should require authentication", async () => {
      const res = await request(app).post("/api/v1/auth/logout");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/connect-wallet", () => {
    const walletData = {
      walletAddress: "0x742d35Cc6634C0532925a3b8D9C9E6aD8d3d4A5b",
      message: "Connect wallet to Rest-iN-U",
      signature: "test-signature",
    };

    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v1/auth/connect-wallet")
        .send(walletData);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should validate required wallet fields", async () => {
      const res = await request(app)
        .post("/api/v1/auth/connect-wallet")
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should validate wallet address format", async () => {
      const res = await request(app)
        .post("/api/v1/auth/connect-wallet")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          ...walletData,
          walletAddress: "invalid-address",
        });

      expect(res.status).toBe(400);
    });
  });

  describe("Rate Limiting", () => {
    it("should rate limit registration attempts", async () => {
      const promises = Array(10)
        .fill(null)
        .map(() =>
          request(app)
            .post("/api/v1/auth/register")
            .send({
              ...testUser,
              email: `test${Math.random()}@example.com`,
            }),
        );

      const results = await Promise.all(promises);
      const rateLimitedResponses = results.filter((res) => res.status === 429);

      // Some requests should be rate limited
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    it("should rate limit login attempts", async () => {
      const promises = Array(10)
        .fill(null)
        .map(() =>
          request(app).post("/api/v1/auth/login").send({
            email: testUser.email,
            password: "wrongpassword",
          }),
        );

      const results = await Promise.all(promises);
      const rateLimitedResponses = results.filter((res) => res.status === 429);

      // Some requests should be rate limited
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe("Account Status", () => {
    it("should prevent login for inactive accounts", async () => {
      // Create a user
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          ...testUser,
          email: "inactive@example.com",
        });

      // Deactivate the user
      await prisma.user.update({
        where: { email: "inactive@example.com" },
        data: { isActive: false },
      });

      // Try to login
      const loginRes = await request(app).post("/api/v1/auth/login").send({
        email: "inactive@example.com",
        password: testUser.password,
      });

      expect(loginRes.status).toBe(401);
      expect(loginRes.body.error).toContain("Account is deactivated");
    });
  });
});
