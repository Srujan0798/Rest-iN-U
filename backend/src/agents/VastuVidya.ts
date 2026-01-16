import { BaseAgent, Property, PropertyAnalysis } from './BaseAgent';
import {
  VASTU_RULES_ENGINE,
  VastuRule,
  calculateGrade,
  SCORING_WEIGHTS,
  Direction,
  RoomType,
  VastuGrade
} from './VastuRules';

export class VastuVidya extends BaseAgent {
  constructor() {
    super('vastu-vidya-001', 'VASTU_EXPERT');
  }

  async analyze(property: Property): Promise<PropertyAnalysis> {
    // Start with a perfect score
    let score = 100;
    const defects: string[] = [];
    const reasoning: string[] = [];
    
    // Extract Vastu-specific details from property
    // We assume the property object has these fields populated by the DiscoveryScout or user input
    // Default to CENTER or undefined if missing to avoid crashes, but ideally logic handles undefined
    const entranceDirection = (property['entranceDirection'] || property['facing']) as Direction | undefined;
    const kitchenLocation = property['kitchenLocation'] as Direction | undefined;
    const masterBedroomLocation = property['masterBedroomLocation'] as Direction | undefined;
    const toiletLocation = property['toiletLocation'] as Direction | undefined;
    
    // 1. Entrance Analysis
    if (entranceDirection) {
      const entranceRules = VASTU_RULES_ENGINE.filter(r => r.category === 'entrance');
      this.evaluateDirectionalRule(entranceRules, entranceDirection, 'Entrance', defects, reasoning, (impact) => score += impact);
    } else {
      reasoning.push("Entrance direction not specified, assuming neutral impact.");
    }

    // 2. Kitchen Analysis
    if (kitchenLocation) {
      const kitchenRules = VASTU_RULES_ENGINE.filter(r => r.category === 'kitchen');
      this.evaluateDirectionalRule(kitchenRules, kitchenLocation, 'Kitchen', defects, reasoning, (impact) => score += impact);
    }

    // 3. Master Bedroom Analysis
    if (masterBedroomLocation) {
      const bedroomRules = VASTU_RULES_ENGINE.filter(r => r.category === 'bedroom' && r.roomType === 'masterbedroom');
      this.evaluateDirectionalRule(bedroomRules, masterBedroomLocation, 'Master Bedroom', defects, reasoning, (impact) => score += impact);
    }

    // 4. Toilet Analysis
    if (toiletLocation) {
      const toiletRules = VASTU_RULES_ENGINE.filter(r => r.category === 'bathroom' && (r.id === 'BATH-001' || r.id === 'BATH-002'));
       this.evaluateDirectionalRule(toiletRules, toiletLocation, 'Toilet', defects, reasoning, (impact) => score += impact);
    }

    // Cap score at 100 and floor at 0
    score = Math.max(0, Math.min(100, score));
    const grade = calculateGrade(score);

    const fullReasoning = `Vastu Grade: ${grade}. ${reasoning.length > 0 ? reasoning.join(' ') : 'No major defects detected.'}`;

    // Confidence is based on how much data we had
    const dataPoints = [entranceDirection, kitchenLocation, masterBedroomLocation, toiletLocation].filter(Boolean).length;
    const confidence = Math.min(100, (dataPoints / 4) * 100); 

    return {
      agentId: this.agentId,
      propertyId: property.id,
      score,
      confidence,
      reasoning: fullReasoning,
      timestamp: new Date()
    };
  }

  private evaluateDirectionalRule(
    rules: VastuRule[], 
    actualDirection: Direction, 
    featureName: string, 
    defects: string[], 
    reasoning: string[],
    updateScore: (impact: number) => void
  ) {
    for (const rule of rules) {
      // Logic:
      // If rule is about a SPECIFIC direction defect (e.g. "Kitchen in NE Defect"), 
      // and actual matches rule direction, apply penalty.
      
      if (!rule.direction) continue;

      const directions = Array.isArray(rule.direction) ? rule.direction : [rule.direction];
      const matchesDirection = directions.includes(actualDirection);
      
      // Heuristic: Identify "Defect" rules vs "Ideal" rules
      const isDefectRule = rule.name.toLowerCase().includes('defect') || 
                           rule.description.toLowerCase().includes('avoid') ||
                           rule.defectCondition.toLowerCase().includes(actualDirection.toString());

      const isIdealRule = rule.name.toLowerCase().includes('ideal') ||
                          rule.idealCondition.toLowerCase().includes(actualDirection.toString());

      if (matchesDirection && isDefectRule) {
        updateScore(rule.scoreImpact);
        defects.push(rule.name);
        reasoning.push(`${featureName} in ${actualDirection}: ${rule.description} (${rule.scoreImpact} pts).`);
      } else if (!matchesDirection && isIdealRule) {
          // If it's an "Ideal" rule (e.g. Kitchen in SE) and we do NOT match it, 
          // we might want to apply a small penalty or just miss out on a bonus?
          // Since we start at 100, we strictly subtract for defects.
          // For now, we mainly punish explicit defects. 
          
          // However, if we have "Kitchen in SE" (Ideal) and we are in "NW", is that a defect?
          // Only if there is a rule saying "Kitchen in NW Defect".
          // So sticking to explicit defect rules is safer to avoid double counting.
      }
    }
  }
}
