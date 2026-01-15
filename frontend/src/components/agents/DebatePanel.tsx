"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Download,
  Users,
  Bot,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Brain,
  Compass,
  TrendingUp,
  Shield,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Scale,
  Zap,
  FileText,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

interface AgentAnalysis {
  id: string;
  agentId: string;
  score: number;
  verdict: "positive" | "negative" | "neutral" | "warning";
  summary: string;
  reasoning: ReasoningStep[];
  recommendations: string[];
  confidence: number;
  timestamp: Date;
}

interface ReasoningStep {
  id: string;
  type: "observation" | "analysis" | "calculation" | "inference" | "conclusion";
  title: string;
  content: string;
  data?: Record<string, unknown>;
  confidence?: number;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: "compass" | "brain" | "trending" | "shield" | "bot";
  color: "purple" | "green" | "blue" | "orange" | "red";
  gradient: string;
}

interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: Date;
  type: "argument" | "evidence" | "question" | "conclusion" | "rebuttal";
  inReplyTo?: string;
}

interface SwarmVerdict {
  decision: "approve" | "reject" | "conditional";
  confidence: number;
  summary: string;
  consensusLevel: "unanimous" | "majority" | "split";
  agentVotes: {
    agentId: string;
    vote: "approve" | "reject" | "conditional";
    weight: number;
  }[];
  recommendations: string[];
  risks: string[];
  opportunities: string[];
}

interface DebatePanelProps {
  propertyId: string;
  agents?: Agent[];
  analyses?: AgentAnalysis[];
  messages?: Message[];
  verdict?: SwarmVerdict;
  isLoading?: boolean;
  onDownloadReport?: () => void;
}

// ============================================================================
// Mock Data
// ============================================================================

const defaultAgents: Agent[] = [
  {
    id: "vastu",
    name: "Vastu Master",
    role: "Vastu Shastra Expert",
    description: "Analyzes property alignment, energy flow, and spatial harmony",
    icon: "compass",
    color: "purple",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "climate",
    name: "Climate Guardian",
    role: "Environmental Risk Analyst",
    description: "Assesses climate risks, flood zones, and environmental factors",
    icon: "shield",
    color: "green",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: "financial",
    name: "Value Analyst",
    role: "Financial Advisor",
    description: "Evaluates market value, investment potential, and pricing",
    icon: "trending",
    color: "blue",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: "legal",
    name: "Legal Expert",
    role: "Compliance Specialist",
    description: "Reviews documentation, titles, and regulatory compliance",
    icon: "brain",
    color: "orange",
    gradient: "from-orange-500 to-amber-600",
  },
];

const defaultAnalyses: AgentAnalysis[] = [
  {
    id: "analysis-1",
    agentId: "vastu",
    score: 8.5,
    verdict: "positive",
    summary: "Excellent Vastu compliance with ideal entrance placement and room orientation.",
    confidence: 0.92,
    timestamp: new Date(),
    reasoning: [
      {
        id: "r1",
        type: "observation",
        title: "Entrance Analysis",
        content: "The main entrance faces Northeast (Ishaan), which is considered the most auspicious direction according to Vastu Shastra.",
        confidence: 0.95,
      },
      {
        id: "r2",
        type: "analysis",
        title: "Room Placement",
        content: "Master bedroom is positioned in the Southwest corner, ensuring stability and prosperity. Kitchen is in the Southeast (Agni) corner as prescribed.",
        confidence: 0.88,
      },
      {
        id: "r3",
        type: "calculation",
        title: "Energy Flow Score",
        content: "Calculated positive energy flow based on open spaces, windows, and room connectivity.",
        data: { flowScore: 8.5, blockages: 1, enhancements: 4 },
        confidence: 0.85,
      },
      {
        id: "r4",
        type: "conclusion",
        title: "Final Assessment",
        content: "Property demonstrates excellent adherence to Vastu principles with minor optimization opportunities.",
        confidence: 0.92,
      },
    ],
    recommendations: [
      "Consider adding a water feature in the Northeast corner",
      "Ensure no clutter in the Brahmasthan (center) area",
      "Mirror placement in the bedroom could be optimized",
    ],
  },
  {
    id: "analysis-2",
    agentId: "climate",
    score: 6.8,
    verdict: "warning",
    summary: "Moderate climate risk due to proximity to water body. Mitigation measures recommended.",
    confidence: 0.88,
    timestamp: new Date(),
    reasoning: [
      {
        id: "r1",
        type: "observation",
        title: "Flood Zone Assessment",
        content: "Property is located within 500m of a seasonal water body. Historical flood data shows occasional waterlogging.",
        confidence: 0.92,
      },
      {
        id: "r2",
        type: "analysis",
        title: "Drainage Analysis",
        content: "Current drainage infrastructure appears adequate but may need enhancement during monsoon season.",
        confidence: 0.78,
      },
      {
        id: "r3",
        type: "calculation",
        title: "Risk Probability",
        content: "Based on 30-year climate data and current infrastructure.",
        data: { floodRisk: "moderate", probability: 0.15, impactLevel: "medium" },
        confidence: 0.85,
      },
      {
        id: "r4",
        type: "inference",
        title: "Insurance Implications",
        content: "Higher flood risk classification may affect insurance premiums by 15-20%.",
        confidence: 0.82,
      },
    ],
    recommendations: [
      "Install flood barriers around property perimeter",
      "Elevate electrical systems and valuable storage",
      "Consider flood insurance coverage",
      "Ensure proper drainage maintenance",
    ],
  },
  {
    id: "analysis-3",
    agentId: "financial",
    score: 7.2,
    verdict: "neutral",
    summary: "Property priced 8% above market average. Premium justified by Vastu compliance but negotiation recommended.",
    confidence: 0.85,
    timestamp: new Date(),
    reasoning: [
      {
        id: "r1",
        type: "observation",
        title: "Comparable Sales Analysis",
        content: "Analyzed 15 similar properties sold in the area within the last 6 months.",
        confidence: 0.90,
      },
      {
        id: "r2",
        type: "calculation",
        title: "Market Valuation",
        content: "Computed fair market value based on size, location, amenities, and condition.",
        data: { marketValue: 7800000, askingPrice: 8500000, variance: "+8.97%" },
        confidence: 0.87,
      },
      {
        id: "r3",
        type: "analysis",
        title: "Premium Justification",
        content: "The Vastu compliance can justify a 3-5% premium for the right buyer segment.",
        confidence: 0.75,
      },
      {
        id: "r4",
        type: "inference",
        title: "Investment Outlook",
        content: "Area shows 6-8% annual appreciation trend. Property should maintain value well.",
        confidence: 0.80,
      },
    ],
    recommendations: [
      "Negotiate price down by 5-7%",
      "Request recent property inspection reports",
      "Consider timing - market slightly favors buyers currently",
      "Factor in renovation costs if any",
    ],
  },
];

const defaultMessages: Message[] = [
  {
    id: "1",
    agentId: "vastu",
    content: "The property demonstrates excellent Vastu compliance with a northeast-facing entrance and proper room placement. The kitchen in the southeast corner is particularly auspicious.",
    timestamp: new Date(Date.now() - 5000),
    type: "evidence",
  },
  {
    id: "2",
    agentId: "climate",
    content: "I must raise a concern about the moderate flood risk due to proximity to the water body. While the location is scenic, historical data shows occasional waterlogging.",
    timestamp: new Date(Date.now() - 4000),
    type: "argument",
  },
  {
    id: "3",
    agentId: "financial",
    content: "The asking price is 8% above market average. However, I would argue the Vastu compliance could justify a portion of this premium for traditional buyers.",
    timestamp: new Date(Date.now() - 3000),
    type: "argument",
  },
  {
    id: "4",
    agentId: "vastu",
    content: "Regarding the climate concerns - the northeast water proximity is actually considered auspicious in Vastu. It enhances positive energy flow.",
    timestamp: new Date(Date.now() - 2000),
    type: "rebuttal",
    inReplyTo: "2",
  },
  {
    id: "5",
    agentId: "climate",
    content: "While I respect the Vastu perspective, the physical flood risk remains. I recommend flood barriers as a practical mitigation that doesn't conflict with energy principles.",
    timestamp: new Date(Date.now() - 1000),
    type: "conclusion",
    inReplyTo: "4",
  },
];

const defaultVerdict: SwarmVerdict = {
  decision: "conditional",
  confidence: 0.78,
  summary: "Property recommended with conditions. Excellent Vastu compliance balanced against moderate climate risks. Fair value achievable with negotiation.",
  consensusLevel: "majority",
  agentVotes: [
    { agentId: "vastu", vote: "approve", weight: 0.85 },
    { agentId: "climate", vote: "conditional", weight: 0.75 },
    { agentId: "financial", vote: "conditional", weight: 0.72 },
    { agentId: "legal", vote: "approve", weight: 0.90 },
  ],
  recommendations: [
    "Install flood mitigation measures before monsoon season",
    "Negotiate price down by 5-7% to account for climate risks",
    "Obtain comprehensive flood insurance coverage",
    "Proceed with purchase if Vastu alignment is a priority",
  ],
  risks: [
    "Moderate flood risk (15% annual probability)",
    "Above-market pricing may limit resale flexibility",
    "Seasonal maintenance costs for flood prevention",
  ],
  opportunities: [
    "Strong Vastu compliance attracts traditional buyers",
    "Area shows consistent 6-8% appreciation",
    "Water proximity adds scenic value",
    "Good infrastructure connectivity",
  ],
};

// ============================================================================
// Helper Components
// ============================================================================

const AgentIcon = ({ icon, className = "" }: { icon: Agent["icon"]; className?: string }) => {
  const iconProps = { className: `w-full h-full ${className}` };
  switch (icon) {
    case "compass":
      return <Compass {...iconProps} />;
    case "brain":
      return <Brain {...iconProps} />;
    case "trending":
      return <TrendingUp {...iconProps} />;
    case "shield":
      return <Shield {...iconProps} />;
    case "bot":
      return <Bot {...iconProps} />;
    default:
      return <Bot {...iconProps} />;
  }
};

const VerdictBadge = ({ verdict }: { verdict: AgentAnalysis["verdict"] }) => {
  const config = {
    positive: { bg: "bg-green-100", text: "text-green-800", icon: ThumbsUp },
    negative: { bg: "bg-red-100", text: "text-red-800", icon: ThumbsDown },
    neutral: { bg: "bg-gray-100", text: "text-gray-800", icon: Scale },
    warning: { bg: "bg-yellow-100", text: "text-yellow-800", icon: AlertCircle },
  };
  const { bg, text, icon: Icon } = config[verdict];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {verdict.charAt(0).toUpperCase() + verdict.slice(1)}
    </span>
  );
};

const ConfidenceBar = ({ confidence, size = "md" }: { confidence: number; size?: "sm" | "md" }) => {
  const height = size === "sm" ? "h-1.5" : "h-2";
  return (
    <div className={`w-full bg-gray-200 rounded-full ${height}`}>
      <motion.div
        className={`bg-gradient-to-r from-blue-500 to-purple-500 ${height} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${confidence * 100}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

const ReasoningStepBadge = ({ type }: { type: ReasoningStep["type"] }) => {
  const config = {
    observation: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    analysis: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    calculation: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    inference: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
    conclusion: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  };
  const { bg, text, border } = config[type];
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${bg} ${text} ${border}`}>
      {type}
    </span>
  );
};

// ============================================================================
// Agent Card Component
// ============================================================================

interface AgentCardProps {
  agent: Agent;
  analysis?: AgentAnalysis;
  isExpanded: boolean;
  onToggle: () => void;
}

const AgentCard = ({ agent, analysis, isExpanded, onToggle }: AgentCardProps) => {
  const [activeReasoningStep, setActiveReasoningStep] = useState<string | null>(null);

  return (
    <motion.div
      layout
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Agent Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
      >
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.gradient} p-2.5 text-white flex-shrink-0 shadow-lg`}>
          <AgentIcon icon={agent.icon} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900 truncate">{agent.name}</h4>
            {analysis && <VerdictBadge verdict={analysis.verdict} />}
          </div>
          <p className="text-sm text-gray-500 truncate">{agent.role}</p>
        </div>

        {/* Score & Expand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {analysis && (
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{analysis.score.toFixed(1)}</div>
              <div className="text-xs text-gray-500">/10</div>
            </div>
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && analysis && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="border-t border-gray-100 p-4 space-y-4">
              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">{analysis.summary}</p>
              </div>

              {/* Confidence */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">Analysis Confidence</span>
                  <span className="text-xs font-bold text-gray-900">{Math.round(analysis.confidence * 100)}%</span>
                </div>
                <ConfidenceBar confidence={analysis.confidence} />
              </div>

              {/* Reasoning Steps */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  Reasoning Process
                </h5>
                <div className="space-y-2">
                  {analysis.reasoning.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setActiveReasoningStep(
                          activeReasoningStep === step.id ? null : step.id
                        )}
                        className="w-full p-3 flex items-center gap-2 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-xs font-mono text-gray-400 w-5">{String(index + 1).padStart(2, "0")}</span>
                        <ReasoningStepBadge type={step.type} />
                        <span className="flex-1 text-sm font-medium text-gray-900 truncate">{step.title}</span>
                        {step.confidence && (
                          <span className="text-xs text-gray-500">{Math.round(step.confidence * 100)}%</span>
                        )}
                        <motion.div
                          animate={{ rotate: activeReasoningStep === step.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {activeReasoningStep === step.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-gray-100 bg-gray-50 p-3"
                          >
                            <p className="text-sm text-gray-700 mb-2">{step.content}</p>
                            {step.data && (
                              <div className="bg-white rounded border border-gray-200 p-2 mt-2">
                                <pre className="text-xs text-gray-600 overflow-x-auto">
                                  {JSON.stringify(step.data, null, 2)}
                                </pre>
                              </div>
                            )}
                            {step.confidence && (
                              <div className="mt-2">
                                <ConfidenceBar confidence={step.confidence} size="sm" />
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    Recommendations
                  </h5>
                  <ul className="space-y-1.5">
                    {analysis.recommendations.map((rec, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// Swarm Verdict Component
// ============================================================================

interface SwarmVerdictDisplayProps {
  verdict: SwarmVerdict;
  agents: Agent[];
}

const SwarmVerdictDisplay = ({ verdict, agents }: SwarmVerdictDisplayProps) => {
  const decisionConfig = {
    approve: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      gradient: "from-green-500 to-emerald-600",
      icon: CheckCircle,
      label: "Approved",
    },
    reject: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      gradient: "from-red-500 to-rose-600",
      icon: AlertCircle,
      label: "Not Recommended",
    },
    conditional: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      gradient: "from-yellow-500 to-amber-600",
      icon: Scale,
      label: "Conditional Approval",
    },
  };

  const config = decisionConfig[verdict.decision];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Main Verdict Card */}
      <div className={`rounded-2xl border-2 ${config.border} ${config.bg} overflow-hidden`}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{config.label}</h3>
                <p className="text-white/80 text-sm">Swarm Intelligence Verdict</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{Math.round(verdict.confidence * 100)}%</div>
              <div className="text-white/80 text-sm">Confidence</div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-6">
          <p className="text-gray-700 text-lg leading-relaxed">{verdict.summary}</p>
        </div>

        {/* Consensus Indicator */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">
              Agent Consensus: <span className="capitalize">{verdict.consensusLevel}</span>
            </span>
          </div>

          {/* Agent Votes */}
          <div className="flex flex-wrap gap-2">
            {verdict.agentVotes.map((vote) => {
              const agent = agents.find((a) => a.id === vote.agentId);
              if (!agent) return null;

              const voteColor = {
                approve: "bg-green-100 text-green-800 border-green-200",
                reject: "bg-red-100 text-red-800 border-red-200",
                conditional: "bg-yellow-100 text-yellow-800 border-yellow-200",
              };

              return (
                <motion.div
                  key={vote.agentId}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${voteColor[vote.vote]}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${agent.gradient} p-1 text-white`}>
                    <AgentIcon icon={agent.icon} />
                  </div>
                  <span className="text-xs font-medium">{agent.name}</span>
                  <span className="text-xs opacity-75">({Math.round(vote.weight * 100)}%)</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommendations, Risks, Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recommendations */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Recommendations</h4>
          </div>
          <ul className="space-y-2">
            {verdict.recommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <Zap className="w-3 h-3 text-blue-500 mt-1 flex-shrink-0" />
                {rec}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Risks</h4>
          </div>
          <ul className="space-y-2">
            {verdict.risks.map((risk, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <AlertCircle className="w-3 h-3 text-red-500 mt-1 flex-shrink-0" />
                {risk}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Opportunities</h4>
          </div>
          <ul className="space-y-2">
            {verdict.opportunities.map((opp, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <Sparkles className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                {opp}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Debate Thread Component
// ============================================================================

interface DebateThreadProps {
  messages: Message[];
  agents: Agent[];
}

const DebateThread = ({ messages, agents }: DebateThreadProps) => {
  const getAgent = (agentId: string) => agents.find((a) => a.id === agentId);

  const typeConfig = {
    evidence: { icon: CheckCircle, color: "text-green-500" },
    argument: { icon: MessageCircle, color: "text-blue-500" },
    question: { icon: AlertCircle, color: "text-yellow-500" },
    conclusion: { icon: Bot, color: "text-purple-500" },
    rebuttal: { icon: Scale, color: "text-orange-500" },
  };

  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        const agent = getAgent(message.agentId);
        if (!agent) return null;

        const { icon: TypeIcon, color } = typeConfig[message.type];
        const isReply = !!message.inReplyTo;

        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex gap-3 ${isReply ? "ml-8" : ""}`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.gradient} p-2 text-white flex-shrink-0 shadow-md`}>
              <AgentIcon icon={agent.icon} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{agent.name}</span>
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </span>
                <TypeIcon className={`w-4 h-4 ${color}`} />
                {isReply && (
                  <span className="text-xs text-gray-400 italic">reply</span>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg rounded-tl-none p-3">
                <p className="text-sm text-gray-700 leading-relaxed">{message.content}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ============================================================================
// Main DebatePanel Component
// ============================================================================

export function DebatePanel({
  propertyId,
  agents = defaultAgents,
  analyses = defaultAnalyses,
  messages = defaultMessages,
  verdict = defaultVerdict,
  isLoading = false,
  onDownloadReport,
}: DebatePanelProps) {
  const [activeTab, setActiveTab] = useState<"agents" | "debate" | "verdict">("agents");
  const [expandedAgents, setExpandedAgents] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleAgentExpansion = useCallback((agentId: string) => {
    setExpandedAgents((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId]
    );
  }, []);

  const handleGenerateReport = useCallback(() => {
    setIsGenerating(true);

    // Generate report
    setTimeout(() => {
      const reportData = {
        propertyId,
        generatedAt: new Date().toISOString(),
        agents: agents.map((a) => ({ id: a.id, name: a.name, role: a.role })),
        analyses,
        verdict,
        messages,
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `uncle-report-${propertyId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setIsGenerating(false);
    }, 1500);

    onDownloadReport?.();
  }, [propertyId, agents, analyses, verdict, messages, onDownloadReport]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-12 h-12 text-purple-500" />
          </motion.div>
          <p className="mt-4 text-gray-600 font-medium">Agents are analyzing...</p>
          <p className="text-sm text-gray-400">This may take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Agent Swarm Analysis</h2>
              <p className="text-blue-100 text-sm">
                Multi-expert property evaluation with transparent reasoning
              </p>
            </div>
          </div>
          <motion.button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <FileText className="w-4 h-4" />
              </motion.div>
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isGenerating ? "Generating..." : "Download Uncle Report"}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex">
          {[
            { id: "agents", label: "Agent Analysis", icon: Brain },
            { id: "debate", label: "Debate Thread", icon: MessageCircle },
            { id: "verdict", label: "Swarm Verdict", icon: Scale },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-3.5 px-4 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "border-b-2 border-purple-600 text-purple-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === "agents" && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Agent Summary Bar */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {agents.length} Agents Analyzed
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (expandedAgents.length === agents.length) {
                      setExpandedAgents([]);
                    } else {
                      setExpandedAgents(agents.map((a) => a.id));
                    }
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  {expandedAgents.length === agents.length ? "Collapse All" : "Expand All"}
                </button>
              </div>

              {/* Agent Cards */}
              {agents.map((agent) => {
                const analysis = analyses.find((a) => a.agentId === agent.id);
                return (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    analysis={analysis}
                    isExpanded={expandedAgents.includes(agent.id)}
                    onToggle={() => toggleAgentExpansion(agent.id)}
                  />
                );
              })}
            </motion.div>
          )}

          {activeTab === "debate" && (
            <motion.div
              key="debate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DebateThread messages={messages} agents={agents} />
            </motion.div>
          )}

          {activeTab === "verdict" && (
            <motion.div
              key="verdict"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SwarmVerdictDisplay verdict={verdict} agents={agents} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export type {
  Agent,
  AgentAnalysis,
  ReasoningStep,
  Message,
  SwarmVerdict,
  DebatePanelProps,
};
