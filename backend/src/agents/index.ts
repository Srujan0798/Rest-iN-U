// Agent Swarm Framework - Main Exports

// Base Agent and Core Types
export { BaseAgent } from "./BaseAgent";
export type { Property, PropertyAnalysis, AgentDebate } from "./BaseAgent";

// Core Agents (6 Specialized Agents)
export { DiscoveryScout } from "./DiscoveryScout";
export { ValuationOracle } from "./ValuationOracle";
export { RiskSentinel } from "./RiskSentinel";
export { LegalEagle } from "./LegalEagle";
export { FinanceArchitect } from "./FinanceArchitect";
export { NeighborhoodOracle } from "./NeighborhoodOracle";

// Swarm Conductor
export { SwarmConductor } from "./SwarmConductor";

// Example Usage
export {
  demonstrateAgentSwarm,
  batchPropertyAnalysis,
} from "./example-swarm-usage";

/**
 * Agent Swarm Framework
 *
 * A comprehensive multi-agent system for real estate property analysis.
 *
 * Core Components:
 * - BaseAgent: Abstract base class for all agents
 * - SwarmConductor: Orchestrates analysis across multiple agents
 * - 6 Specialized Agents: Each focuses on different aspects of property analysis
 *
 * Usage:
 * ```typescript
 * import {
 *   SwarmConductor,
 *   DiscoveryScout,
 *   ValuationOracle,
 *   RiskSentinel,
 *   LegalEagle,
 *   FinanceArchitect,
 *   NeighborhoodOracle
 * } from './agents';
 *
 * const agents = [
 *   new DiscoveryScout(),
 *   new ValuationOracle(),
 *   new RiskSentinel(),
 *   new LegalEagle(),
 *   new FinanceArchitect(),
 *   new NeighborhoodOracle(),
 * ];
 *
 * const swarm = new SwarmConductor(agents);
 * const result = await swarm.orchestrateAnalysis(property);
 * ```
 */
