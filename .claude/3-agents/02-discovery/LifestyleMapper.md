# Agent: Lifestyle Mapper (Discovery Cluster)

**Role**: Personal Fit Analyst
**Priority**: ⭐⭐⭐ (High - Core Feature)
**Dependencies**: Discovery Scout, Neighborhood Oracle

## RESPONSIBILITIES

### Core Duties
1. **Commute Analysis**: Calculate exact travel times to user's key locations (Office, School, Gym)
2. **Vibe Matching**: Match property location with user's lifestyle preferences (Quiet, Nightlife, Family-friendly)
3. **Daily Routine Simulation**: Simulate a "Day in the Life" for the user in this property

### Input Data
- User's POIs (Points of Interest) with coordinates
- User's transport preferences (Car, Metro, Walk)
- Property location

### Output Data
- Commute Score (0-100)
- Lifestyle Fit Score (0-100)
- "Day in the Life" timeline

## TECHNICAL SPECIFICATION

### Class Structure
```typescript
export class LifestyleMapper extends BaseAgent {
  name = "Lifestyle Mapper";
  role = "Personal Fit Analyst";

  async analyze(property: Property, userProfile: UserProfile): Promise<AnalysisResult> {
    // 1. Calculate commutes using Google Maps API (or geometric distance as fallback)
    // 2. Score neighborhood vibe match
    // 3. Generate summary
  }
}
```

### Integration Points
- **Google Maps API** (Distance Matrix)
- **Neighborhood Oracle** (for area tags)
