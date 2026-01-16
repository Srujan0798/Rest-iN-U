# Agent: RERA Radar (Risk Cluster)

**Role**: Regulatory Compliance Checker
**Priority**: ⭐⭐⭐⭐⭐ (Critical - Trust)
**Dependencies**: Legal Eagle

## RESPONSIBILITIES

### Core Duties
1. **RERA Verification**: Check if the project is RERA registered and compliant.
2. **Litigation Check**: Scan for consumer court cases against the builder.
3. **Project Delay Analysis**: Compare promised vs. actual progress.

### Input Data
- RERA ID
- Builder Name
- Project Name

### Output Data
- Compliance Score (0-100)
- Risk Flags (Red/Yellow/Green)
- "Safe to Buy" Verdict

## TECHNICAL SPECIFICATION

### Class Structure
```typescript
export class ReraRadar extends BaseAgent {
  name = "RERA Radar";
  role = "Regulatory Compliance Checker";

  async analyze(property: Property): Promise<AnalysisResult> {
    // 1. Validate RERA ID format
    // 2. Cross-reference with known blacklisted builders
    // 3. Check for delay flags
  }
}
```

### Integration Points
- **Legal Eagle** (shares legal context)
- **RERA Website Scraper** (future)
