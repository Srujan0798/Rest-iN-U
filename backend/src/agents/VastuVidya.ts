import { BaseAgent, PropertyAnalysis, Property } from './BaseAgent';
import { VASTU_RULES_ENGINE, Direction, RoomType, calculateGrade, VastuRule, DIRECTION_PROPERTIES } from './VastuRules';

export class VastuVidya extends BaseAgent {
  name = 'Vastu Vidya';
  role = 'Vastu Shastra Expert';
  description = 'Analyzes property based on ancient Indian architectural principles.';

  async analyze(property: Property): Promise<PropertyAnalysis> {
    const propertyDirections = this.extractDirections(property);
    const defects: string[] = [];
    let totalScore = 100;

    // Apply rules
    for (const rule of VASTU_RULES_ENGINE) {
      const propertyDirection = propertyDirections[rule.category]; // e.g., 'NE' for 'entrance'

      if (propertyDirection) {
        const isIdeal = Array.isArray(rule.direction)
          ? rule.direction.includes(propertyDirection as Direction)
          : rule.direction === propertyDirection;

        // Note: This logic is simplified. Real logic needs to check "avoidFor" as well.
        // For "ideal" rules (positive checks):
        if (rule.idealCondition && !isIdeal) {
            // Check if it hits a specific defect condition?
            // Simplified: If it matches the specific defect direction, apply penalty.
            // Wait, standard Vastu check:
            // 1. Where is the Room? (e.g. Kitchen is in NE)
            // 2. Is that bad? (Check if NE is "avoidFor" Kitchen in DIRECTION_PROPERTIES)

            // Let's use the explicit rule definitions for now
             if (rule.defectCondition && propertyDirection === rule.direction) {
                // Wait, if rule says "Kitchen in SE" (Ideal), and actual is "NE".
                // We need to find the rule "Kitchen in NE Defect" (KIT-002).
             }
        }
      }
    }

    // Since we don't have full property layout data in this mock Property object,
    // we will rely on a helper method that would theoretically parse the floorplan.
    // For this TEST/MVP, we will use a "Simulated Analysis" based on provided metadata map.

    // Assume property.metadata contains a map of room -> direction
    const layout = property['layout'] || {};

    let analysisScore = 100;
    const reasoning: string[] = [];

    // Analyze specific rooms based on layout
    if (layout.entrance) {
        const score = this.calculateRoomScore('entrance', layout.entrance);
        analysisScore -= (100 - score); // Deduct penalty
        if (score < 100) reasoning.push(`Entrance in ${layout.entrance} is not ideal.`);
    }

    if (layout.kitchen) {
        const score = this.calculateRoomScore('kitchen', layout.kitchen);
        analysisScore -= (100 - score);
        if (score < 100) reasoning.push(`Kitchen in ${layout.kitchen} needs remedy.`);
    }

    if (layout.master_bedroom) {
        const score = this.calculateRoomScore('masterbedroom', layout.master_bedroom);
        analysisScore -= (100 - score);
    }

    if (layout.toilet) {
        const score = this.calculateRoomScore('toilet', layout.toilet);
        analysisScore -= (100 - score);
        if (score < 50) reasoning.push('Critical: Toilet location needs immediate attention.');
    }

    // Clamp score
    analysisScore = Math.max(0, analysisScore);
    const grade = calculateGrade(analysisScore);

    return {
      agentName: this.name,
      score: analysisScore,
      reasoning: reasoning.length > 0 ? reasoning : ['Property follows Vastu principles well.'],
      confidence: 90,
      metadata: {
        grade,
        defects
      }
    };
  }

  public calculateRoomScore(room: RoomType | string, directionRaw: string): number {
    const direction = this.normalizeDirection(directionRaw);
    if (!direction) return 50; // Unknown direction

    // Find rules for this room
    // 1. Check "Defect" rules first (Critical penalties)
    const defectRules = VASTU_RULES_ENGINE.filter(r =>
        (r.roomType === room || r.category === room) &&
        r.severity === 'critical' &&
        r.defectCondition.toLowerCase().includes(direction.toLowerCase()) // Loose matching for MVP
    );

    // Wait, better logic:
    // Look for rules where roomType matches, and "direction" matches the input direction.
    // If the rule is a "Defect" rule (name contains Defect), apply penalty.
    // If the rule is an "Ideal" rule, award points (or rather, don't deduct).

    // Actually, simpler:
    // Iterate all rules.
    // If rule applies to this Room and this Direction:
    //   Apply scoreImpact (which is negative).

    let score = 100;

    for (const rule of VASTU_RULES_ENGINE) {
        if (rule.roomType === room || rule.category === room) {
             // Does this rule apply to this direction?
             const ruleDirs = Array.isArray(rule.direction) ? rule.direction : [rule.direction];

             // Check if this rule is about a specific placement
             if (ruleDirs.includes(direction)) {
                 // Check if the rule implies a penalty (negative scoreImpact)
                 // Most rules in the engine have negative scoreImpact for VIOLATIONS or Specific DEFECTS.
                 // But wait, "Kitchen in SE" (KIT-001) is an IDEAL rule. It has negative scoreImpact??
                 // Looking at VastuRules.ts:
                 // KIT-001: "Kitchen in South-East" -> idealCondition: "Kitchen located in South-East"
                 // defectCondition: "Kitchen not in South-East". scoreImpact: -12.

                 // So if we ARE in SE, we avoid the penalty.
                 // If we are NOT in SE, we get the penalty?

                 // The rule structure is a bit ambiguous for a generic engine.
                 // Let's use a simpler look-up for the "Ideal" vs "Avoid" maps in DIRECTION_PROPERTIES.
             }
        }
    }

    // Fallback to DIRECTION_PROPERTIES for reliable scoring
    // This is the robust "Moat" logic we need to test.
    const dirProps = this.getDirectionProps(direction);
    if (!dirProps) return 50;

    // Check "Ideal For"
    if (dirProps.idealFor.some(r => room.includes(r) || r.includes(room))) {
        return 100;
    }

    // Check "Avoid For"
    if (dirProps.avoidFor.some(r => room.includes(r) || r.includes(room))) {
        // Critical penalty
        if (room === 'toilet' && direction === 'NE') return 0; // Absolute worst
        if (room === 'kitchen' && direction === 'NE') return 20;
        return 40;
    }

    return 70; // Neutral
  }

  private normalizeDirection(dir: string): Direction | null {
    const d = dir.toUpperCase().replace(/[^A-Z]/g, '');
    if (['N', 'NORTH'].includes(d)) return 'N';
    if (['S', 'SOUTH'].includes(d)) return 'S';
    if (['E', 'EAST'].includes(d)) return 'E';
    if (['W', 'WEST'].includes(d)) return 'W';

    if (['NE', 'NORTHEAST'].includes(d)) return 'NE';
    if (['SE', 'SOUTHEAST'].includes(d)) return 'SE';
    if (['SW', 'SOUTHWEST'].includes(d)) return 'SW';
    if (['NW', 'NORTHWEST'].includes(d)) return 'NW';

    return null;
  }

  private getDirectionProps(dir: Direction) {
      return DIRECTION_PROPERTIES[dir];
  }

  private extractDirections(property: Property): Record<string, string> {
     // Mock extraction
     return {};
  }
}
