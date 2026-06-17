import { BaseAgent, Property, PropertyAnalysis } from "./BaseAgent";

interface GrowthScenario {
  name: "Conservative" | "Balanced" | "Aggressive";
  oneYearRoi: number; // percentage
  fiveYearRoi: number; // percentage
  projectedValue1Y: number;
  projectedValue5Y: number;
}

interface GrowthDriver {
  type: "infrastructure" | "market" | "demographic" | "policy";
  name: string;
  impact: "high" | "medium" | "low";
  description: string;
}

interface AppreciationForecast {
  currentValue: number;
  scenarios: GrowthScenario[];
  drivers: GrowthDriver[];
  overallScore: number; // 0-10 representation of growth potential
  confidence: number;
  summary: string;
}

export class AppreciationProphet extends BaseAgent {
  constructor(agentId?: string) {
    super(agentId || `appreciation-prophet-${Date.now()}`, "appreciation-prophet");
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    await this.delay(Math.random() * 600 + 300);

    const forecast = await this.forecastGrowth(property);

    return {
      agentId: this.agentId,
      propertyId: property.id,
      score: forecast.overallScore,
      confidence: forecast.confidence,
      reasoning: forecast.summary,
      timestamp: new Date(),
    };
  }

  private async forecastGrowth(property: Property): Promise<AppreciationForecast> {
    const currentValue = property.price || 0;
    const drivers = this.identifyGrowthDrivers(property);
    const scenarios = this.calculateScenarios(currentValue, drivers, property);

    // Score based on Balanced 5Y ROI
    const balancedScenario = scenarios.find(s => s.name === "Balanced")!;
    const roiScore = this.mapRoiToScore(balancedScenario.fiveYearRoi);

    const summary = this.generateSummary(scenarios, drivers);

    return {
      currentValue,
      scenarios,
      drivers,
      overallScore: roiScore,
      confidence: this.calculateConfidence(drivers),
      summary
    };
  }

  private identifyGrowthDrivers(property: Property): GrowthDriver[] {
    const drivers: GrowthDriver[] = [];

    // Simulate finding drivers based on property data
    // In a real implementation, this would query a knowledge base of city plans

    if (Math.random() > 0.3) {
      drivers.push({
        type: "infrastructure",
        name: "Metro Expansion",
        impact: "high",
        description: "Upcoming metro line within 2km will boost connectivity."
      });
    }

    if (Math.random() > 0.4) {
      drivers.push({
        type: "market",
        name: "IT Hub Development",
        impact: "medium",
        description: "New tech parks planned in 5km radius."
      });
    }

    if (property.neighborhood && property.neighborhood.includes("Upcoming")) {
      drivers.push({
        type: "demographic",
        name: "Gentrification",
        impact: "high",
        description: "Neighborhood transitioning from industrial to residential."
      });
    }

    return drivers;
  }

  private calculateScenarios(currentValue: number, drivers: GrowthDriver[], property: Property): GrowthScenario[] {
    // Base appreciation rates
    let baseRate = 0.05; // 5% annual

    // Adjust based on drivers
    const impactMap = { high: 0.02, medium: 0.01, low: 0.005 };
    const driverBoost = drivers.reduce((acc, d) => acc + impactMap[d.impact], 0);

    const scenarios: GrowthScenario[] = [
      {
        name: "Conservative",
        rate: baseRate + (driverBoost * 0.5) - 0.01
      },
      {
        name: "Balanced",
        rate: baseRate + driverBoost
      },
      {
        name: "Aggressive",
        rate: baseRate + (driverBoost * 1.5) + 0.02
      }
    ].map(s => {
      const rate = Math.max(0.01, s.rate); // Ensure positive growth for simplicity, or allow negative? Real estate usually goes up long term.
      const val1Y = currentValue * (1 + rate);
      const val5Y = currentValue * Math.pow(1 + rate, 5);

      return {
        name: s.name as any,
        oneYearRoi: (val1Y - currentValue) / currentValue * 100,
        fiveYearRoi: (val5Y - currentValue) / currentValue * 100,
        projectedValue1Y: Math.round(val1Y),
        projectedValue5Y: Math.round(val5Y)
      };
    });

    return scenarios;
  }

  private mapRoiToScore(fiveYearRoi: number): number {
    // 50% growth over 5 years (approx 8.5% CAGR) is a solid 8/10
    // < 20% is poor
    // > 80% is excellent

    if (fiveYearRoi > 80) return 10;
    if (fiveYearRoi > 60) return 9;
    if (fiveYearRoi > 50) return 8;
    if (fiveYearRoi > 40) return 7;
    if (fiveYearRoi > 30) return 6;
    if (fiveYearRoi > 20) return 5;
    if (fiveYearRoi > 10) return 4;
    return 3;
  }

  private calculateConfidence(drivers: GrowthDriver[]): number {
    // More identified drivers = higher confidence in the prediction
    const baseConfidence = 6;
    const boost = drivers.length * 1.5;
    return Math.min(9, baseConfidence + boost);
  }

  private generateSummary(scenarios: GrowthScenario[], drivers: GrowthDriver[]): string {
    const balanced = scenarios.find(s => s.name === "Balanced")!;
    const driverNames = drivers.map(d => d.name).join(", ");

    return `Projected 5-Year Growth: ${balanced.fiveYearRoi.toFixed(1)}% (Balanced). ` +
           `Value could reach $${balanced.projectedValue5Y.toLocaleString()}. ` +
           (driverNames ? `Key drivers: ${driverNames}.` : `Based on historical trends.`);
  }
}
