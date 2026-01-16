# Agent: Negotiation Strategist (Transaction Cluster)

**Role**: Deal Closer
**Priority**: ⭐⭐ (Medium - Late Stage)
**Dependencies**: Valuation Oracle, Finance Architect

## RESPONSIBILITIES

### Core Duties
1. **BATNA Calculation**: Determine the Best Alternative to a Negotiated Agreement.
2. **Opening Offer Recommendation**: Suggest the optimal starting price.
3. **Leverage Analysis**: Identify points of leverage (e.g., property on market for 180+ days).

### Input Data
- Listing Price vs. Valuation Oracle Price
- Days on Market
- Seller urgency indicators

### Output Data
- Recommended Offer Price
- Negotiation Tactics (e.g., "Ask for repairs instead of price drop")
- Deal Probability Score

## TECHNICAL SPECIFICATION

### Class Structure
```typescript
export class NegotiationStrategist extends BaseAgent {
  name = "Negotiation Strategist";
  role = "Deal Closer";

  async analyze(property: Property): Promise<AnalysisResult> {
    // 1. Compare List Price vs Fair Value
    // 2. Analyze market heat (Days on Market)
    // 3. Generate specific negotiation talking points
  }
}
```

### Integration Points
- **Valuation Oracle** (Fair Value)
- **Finance Architect** (Budget constraints)
