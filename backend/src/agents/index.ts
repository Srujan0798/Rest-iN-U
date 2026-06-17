// Agent Swarm Framework - Main Exports

// Base Agent and Core Types
export { BaseAgent } from "./BaseAgent";
export type { Property, PropertyAnalysis, AgentDebate } from "./BaseAgent";

// Core Agents (Original 6)
export { DiscoveryScout } from "./DiscoveryScout";
export { ValuationOracle } from "./ValuationOracle";
export { RiskSentinel } from "./RiskSentinel";
export { LegalEagle } from "./LegalEagle";
export { FinanceArchitect } from "./FinanceArchitect";
export { NeighborhoodOracle } from "./NeighborhoodOracle";
export { VastuVidya } from "./VastuVidya";

// New Agents (Added Jan 2026)
export { LifestyleMapper } from "./LifestyleMapper";
export { AppreciationProphet } from "./AppreciationProphet";
export { ReraRadar } from "./ReraRadar";
export { NegotiationStrategist } from "./NegotiationStrategist";

// Swarm Conductor
export { SwarmConductor } from "./SwarmConductor";

// Ancient Wisdom Agents
export { JyotishMatcher } from "./JyotishMatcher";
export { MuhuratCalculator } from "./MuhuratCalculator";
export { JyotishVidya } from "./JyotishVidya";

// Example Usage
export {
  demonstrateAgentSwarm,
  batchPropertyAnalysis,
} from "./example-swarm-usage";
