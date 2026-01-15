import { SwarmConductor } from "./SwarmConductor";
import { DiscoveryScout } from "./DiscoveryScout";
import { ValuationOracle } from "./ValuationOracle";
import { RiskSentinel } from "./RiskSentinel";
import { LegalEagle } from "./LegalEagle";
import { FinanceArchitect } from "./FinanceArchitect";
import { Property, BaseAgent } from "./BaseAgent";

/**
 * Example demonstrating how to use the Agent Swarm framework
 * for comprehensive property analysis
 */

async function demonstrateAgentSwarm() {
  console.log("🚀 Initializing Agent Swarm for Property Analysis...\n");

  // Initialize the 6 core agents
  const agents = [
    new DiscoveryScout(),
    new ValuationOracle(),
    new RiskSentinel(),
    new LegalEagle(),
    new FinanceArchitect(),
    // Note: In a full implementation, you would add LifestyleMapper and NeighborhoodOracle here
    // For now, we'll create a mock agent to complete the 6 required agents
    new (class extends BaseAgent {
      constructor() {
        super("lifestyle-mapper", "lifestyle-mapper");
      }

      async analyze(property: Property) {
        await this.delay(500);
        return {
          agentId: this.agentId,
          propertyId: property.id,
          score: 7.5,
          confidence: 0.8,
          reasoning:
            "Lifestyle compatibility analysis based on amenities and location",
          timestamp: new Date(),
        };
      }
    })(),
  ];

  // Create the Swarm Conductor
  const swarm = new SwarmConductor(agents);

  // Sample property for analysis
  const sampleProperty: Property = {
    id: "property-001",
    address: "123 Koramangala Main Street, Bangalore",
    price: 8500000,
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1800,
    propertyType: "single-family",
    yearBuilt: 2015,
    neighborhood: "Koramangala",
  };

  console.log("📋 Property Details:");
  console.log(`Address: ${sampleProperty.address}`);
  console.log(`Price: ₹${(sampleProperty.price / 100000).toFixed(2)} Lakhs`);
  console.log(
    `Bedrooms: ${sampleProperty.bedrooms} | Bathrooms: ${sampleProperty.bathrooms}`,
  );
  console.log(`Area: ${sampleProperty.squareFootage} sqft`);
  console.log(
    `Type: ${sampleProperty.propertyType} | Built: ${sampleProperty.yearBuilt}`,
  );
  console.log(`Neighborhood: ${sampleProperty.neighborhood}\n`);

  console.log("🤖 Starting Swarm Analysis...\n");

  try {
    // Execute the swarm analysis
    const startTime = Date.now();
    const result = await swarm.orchestrateAnalysis(sampleProperty);
    const duration = Date.now() - startTime;

    // Display results
    console.log("✅ Swarm Analysis Complete!");
    console.log(`⏱️  Analysis completed in ${duration}ms\n`);

    console.log("📊 Individual Agent Analyses:");
    console.log("=".repeat(80));

    result.individualAnalyses.forEach((analysis, index) => {
      const agentName = analysis.agentId.split("-")[0];
      console.log(`${index + 1}. ${agentName.toUpperCase()}`);
      console.log(
        `   Score: ${analysis.score.toFixed(2)}/10 | Confidence: ${(analysis.confidence * 100).toFixed(1)}%`,
      );
      console.log(`   Reasoning: ${analysis.reasoning}`);
      console.log("");
    });

    console.log("🎯 Swarm Consensus:");
    console.log("=".repeat(80));
    console.log(`Consensus: ${result.consensusAnalysis.consensus}`);
    console.log(
      `Consensus Confidence: ${(result.consensusAnalysis.confidence * 100).toFixed(1)}%\n`,
    );

    console.log("📈 Overall Results:");
    console.log("=".repeat(80));
    console.log(`Combined Score: ${result.combinedScore.toFixed(2)}/10`);
    console.log(
      `Overall Confidence: ${(result.overallConfidence * 100).toFixed(1)}%\n`,
    );

    // Generate recommendations based on swarm analysis
    console.log("💡 Swarm Recommendations:");
    console.log("=".repeat(80));

    if (result.combinedScore >= 8) {
      console.log("🟢 EXCELLENT: Property scores very high across all agents");
      console.log("   • Strong recommendation to proceed");
      console.log("   • Multiple agents indicate high value potential");
    } else if (result.combinedScore >= 6) {
      console.log(
        "🟡 GOOD: Property shows positive indicators with some considerations",
      );
      console.log("   • Recommended with due diligence");
      console.log("   • Review individual agent concerns");
    } else if (result.combinedScore >= 4) {
      console.log("🟠 MODERATE: Property has mixed signals");
      console.log("   • Proceed with caution");
      console.log("   • Further investigation recommended");
    } else {
      console.log("🔴 POOR: Property shows significant concerns");
      console.log("   • Not recommended");
      console.log("   • Consider alternative properties");
    }

    console.log("\n🔍 Detailed Agent Insights:");
    console.log("=".repeat(80));

    // Show specific agent insights
    const discoveryScout = result.individualAnalyses.find((a) =>
      a.agentId.includes("discovery"),
    );
    const valuationOracle = result.individualAnalyses.find((a) =>
      a.agentId.includes("valuation"),
    );
    const riskSentinel = result.individualAnalyses.find((a) =>
      a.agentId.includes("risk"),
    );
    const legalEagle = result.individualAnalyses.find((a) =>
      a.agentId.includes("legal"),
    );
    const financeArchitect = result.individualAnalyses.find((a) =>
      a.agentId.includes("finance"),
    );

    if (discoveryScout) {
      console.log(
        `🏠 Discovery Scout: Property match score is ${discoveryScout.score}/10`,
      );
    }

    if (valuationOracle) {
      console.log(
        `💰 Valuation Oracle: Price assessment score is ${valuationOracle.score}/10`,
      );
    }

    if (riskSentinel) {
      console.log(
        `⚠️  Risk Sentinel: Risk assessment score is ${riskSentinel.score}/10`,
      );
    }

    if (legalEagle) {
      console.log(
        `⚖️  Legal Eagle: Legal compliance score is ${legalEagle.score}/10`,
      );
    }

    if (financeArchitect) {
      console.log(
        `🏦 Finance Architect: Financial viability score is ${financeArchitect.score}/10`,
      );
    }

    console.log("\n🎉 Swarm Analysis Demo Complete!");
  } catch (error) {
    console.error("❌ Error during swarm analysis:", error);
  }
}

/**
 * Example of how to use the swarm for multiple properties
 */
async function batchPropertyAnalysis() {
  console.log("\n🔄 Batch Property Analysis Example\n");

  const properties: Property[] = [
    {
      id: "property-001",
      address: "123 Koramangala, Bangalore",
      price: 8500000,
      bedrooms: 3,
      bathrooms: 2,
      squareFootage: 1800,
      propertyType: "single-family",
      yearBuilt: 2015,
      neighborhood: "Koramangala",
    },
    {
      id: "property-002",
      address: "456 Indiranagar, Bangalore",
      price: 12000000,
      bedrooms: 4,
      bathrooms: 3,
      squareFootage: 2400,
      propertyType: "single-family",
      yearBuilt: 2020,
      neighborhood: "Indiranagar",
    },
    {
      id: "property-003",
      address: "789 Whitefield, Bangalore",
      price: 6500000,
      bedrooms: 2,
      bathrooms: 2,
      squareFootage: 1200,
      propertyType: "condo",
      yearBuilt: 2018,
      neighborhood: "Whitefield",
    },
  ];

  const agents = [
    new DiscoveryScout(),
    new ValuationOracle(),
    new RiskSentinel(),
    new LegalEagle(),
    new FinanceArchitect(),
    new (class extends BaseAgent {
      constructor() {
        super("lifestyle-mapper", "lifestyle-mapper");
      }

      async analyze(property: Property) {
        await this.delay(500);
        return {
          agentId: this.agentId,
          propertyId: property.id,
          score: 7.5,
          confidence: 0.8,
          reasoning: "Lifestyle compatibility analysis",
          timestamp: new Date(),
        };
      }
    })(),
  ];

  const swarm = new SwarmConductor(agents);

  // Process all properties in parallel
  const results = await Promise.all(
    properties.map((property) => swarm.orchestrateAnalysis(property)),
  );

  console.log("📊 Batch Analysis Results:");
  console.log("=".repeat(80));

  results.forEach((result, index) => {
    const property = properties[index];
    console.log(`${index + 1}. ${property.address}`);
    console.log(`   Price: ₹${(property.price / 100000).toFixed(2)} Lakhs`);
    console.log(
      `   Score: ${result.combinedScore.toFixed(2)}/10 | Confidence: ${(result.overallConfidence * 100).toFixed(1)}%`,
    );

    if (result.combinedScore >= 7) {
      console.log("   🟢 Highly Recommended");
    } else if (result.combinedScore >= 5) {
      console.log("   🟡 Consider");
    } else {
      console.log("   🔴 Not Recommended");
    }
    console.log("");
  });
}

// Run the examples if this file is executed directly
if (require.main === module) {
  demonstrateAgentSwarm()
    .then(() => batchPropertyAnalysis())
    .catch(console.error);
}

export { demonstrateAgentSwarm, batchPropertyAnalysis };
