import { DiscoveryScout } from "../DiscoveryScout";
import { Property } from "../BaseAgent";

describe("DiscoveryScout", () => {
  let agent: DiscoveryScout;
  let mockProperty: Property;

  beforeEach(() => {
    agent = new DiscoveryScout();
    mockProperty = {
      id: "test-prop-1",
      address: "123 Test St",
      price: 500000,
      bedrooms: 3,
      bathrooms: 2,
      squareFootage: 2000,
      yearBuilt: 2010,
      propertyType: "single-family",
      neighborhood: "Test Area",
    };
  });

  describe("analyze", () => {
    it("should analyze property successfully", async () => {
      const result = await agent.analyze(mockProperty);

      expect(result).toHaveProperty("agentId");
      expect(result).toHaveProperty("propertyId", "test-prop-1");
      expect(result).toHaveProperty("score");
      expect(result).toHaveProperty("confidence");
      expect(result).toHaveProperty("reasoning");
      expect(result).toHaveProperty("timestamp");

      expect(result.score).toBeGreaterThanOrEqual(1);
      expect(result.score).toBeLessThanOrEqual(10);
      expect(result.confidence).toBeGreaterThanOrEqual(1);
      expect(result.confidence).toBeLessThanOrEqual(10);
    });

    it("should handle different property types", async () => {
      const condoProperty = { ...mockProperty, propertyType: "condo" };
      const result = await agent.analyze(condoProperty);

      expect(result.propertyId).toBe("test-prop-1");
      expect(result.score).toBeGreaterThanOrEqual(1);
      expect(result.score).toBeLessThanOrEqual(10);
    });
  });
});
