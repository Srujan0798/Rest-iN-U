"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    DollarSign,
    AlertTriangle,
    MapPin,
    Home,
    TrendingUp,
    Bot,
    CheckCircle,
    XCircle,
    Loader2,
    FileText,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

// Agent types with their icons and colors
const AGENTS = {
    discovery: {
        name: "Discovery Scout",
        icon: Search,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
    },
    valuation: {
        name: "Valuation Oracle",
        icon: DollarSign,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
    },
    risk: {
        name: "Risk Sentinel",
        icon: AlertTriangle,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
    },
    lifestyle: {
        name: "Lifestyle Mapper",
        icon: MapPin,
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-200",
    },
    vastu: {
        name: "Vastu Vidya",
        icon: Home,
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
    },
    negotiation: {
        name: "Negotiation Strategist",
        icon: TrendingUp,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
    },
} as const;

type AgentType = keyof typeof AGENTS;

interface AgentMessage {
    agent: AgentType;
    message: string;
    sentiment: "positive" | "neutral" | "warning" | "negative";
    details?: string;
    confidence?: number;
}

interface DebateResult {
    verdict: "GOOD_BUY" | "PROCEED_WITH_CAUTION" | "NOT_RECOMMENDED" | "NEEDS_ANALYSIS";
    summary: string;
    agentMessages: AgentMessage[];
    recommendations?: string[];
}

interface AgentVisibleDebateProps {
    propertyId?: string;
    propertyData?: {
        title: string;
        price: number;
        city: string;
        bedrooms: number;
        vastuScore?: number;
        climateRisk?: number;
        daysOnMarket?: number;
    };
    onRequestAnalysis?: (propertyId: string) => Promise<DebateResult>;
    initialDebate?: DebateResult;
    className?: string;
}

// Mock debate generator for demo purposes
function generateMockDebate(propertyData?: AgentVisibleDebateProps["propertyData"]): DebateResult {
    const price = propertyData?.price || 8500000;
    const vastuScore = propertyData?.vastuScore || 78;
    const daysOnMarket = propertyData?.daysOnMarket || 45;

    return {
        verdict: vastuScore >= 70 ? "GOOD_BUY" : "PROCEED_WITH_CAUTION",
        summary: `Property priced at ₹${(price / 100000).toFixed(0)}L with Vastu score ${vastuScore}/100. ${daysOnMarket > 30 ? "Seller may be motivated." : "Fresh listing."
            }`,
        agentMessages: [
            {
                agent: "discovery",
                message: `${propertyData?.bedrooms || 3}BHK matches family size. ${propertyData?.city || "Location"
                    } has good connectivity. ✓`,
                sentiment: "positive",
                confidence: 92,
            },
            {
                agent: "valuation",
                message: `Fair market price ₹${((price * 0.96) / 100000).toFixed(0)}-${((price * 1.02) / 100000).toFixed(0)}L. Current listing is FAIR.`,
                sentiment: "neutral",
                confidence: 88,
            },
            {
                agent: "risk",
                message: daysOnMarket > 30
                    ? "Property listed for 45 days. No major red flags. Medium priority."
                    : "Fresh listing. Builder verification in progress.",
                sentiment: daysOnMarket > 60 ? "warning" : "neutral",
                confidence: 75,
                details: "Builder reputation: 4.2/5 stars. 1 project delay in history.",
            },
            {
                agent: "lifestyle",
                message: "Schools within 3km. Hospital 5km. Metro station 1.2km. Traffic moderate.",
                sentiment: "positive",
                confidence: 95,
            },
            {
                agent: "vastu",
                message: `Score ${vastuScore}/100. ${vastuScore >= 80
                        ? "Excellent alignment."
                        : vastuScore >= 70
                            ? "Good with minor remedies suggested."
                            : "Needs attention."
                    }`,
                sentiment: vastuScore >= 70 ? "positive" : "warning",
                confidence: vastuScore,
                details:
                    vastuScore < 80
                        ? "Kitchen in NE (-10 points). Remedy: Place water fountain in kitchen corner."
                        : undefined,
            },
            {
                agent: "negotiation",
                message: `Property listed ${daysOnMarket} days. ${daysOnMarket > 30 ? "Seller may be motivated. " : ""
                    }Offer ₹${((price * 0.95) / 100000).toFixed(0)}L. Walk-away: ₹${((price * 0.99) / 100000).toFixed(0)}L.`,
                sentiment: "positive",
                confidence: 82,
            },
        ],
        recommendations: [
            `Negotiate from ₹${((price * 0.95) / 100000).toFixed(0)}L`,
            vastuScore < 80 ? "Budget ₹50K for Vastu remedies" : "Vastu ready",
            "Request builder completion certificate",
        ],
    };
}

export default function AgentVisibleDebate({
    propertyId,
    propertyData,
    onRequestAnalysis,
    initialDebate,
    className = "",
}: AgentVisibleDebateProps) {
    const [debate, setDebate] = useState<DebateResult | null>(initialDebate || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedAgent, setExpandedAgent] = useState<AgentType | null>(null);
    const [showAllMessages, setShowAllMessages] = useState(true);

    // Animated loading of messages
    const [visibleMessages, setVisibleMessages] = useState(0);

    useEffect(() => {
        if (debate && visibleMessages < debate.agentMessages.length) {
            const timer = setTimeout(() => {
                setVisibleMessages((prev) => prev + 1);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [debate, visibleMessages]);

    const runAnalysis = async () => {
        setLoading(true);
        setError(null);
        setVisibleMessages(0);

        try {
            if (onRequestAnalysis && propertyId) {
                const result = await onRequestAnalysis(propertyId);
                setDebate(result);
            } else {
                // Demo mode - use mock data
                await new Promise((resolve) => setTimeout(resolve, 2000));
                setDebate(generateMockDebate(propertyData));
            }
        } catch (err) {
            setError("Failed to run agent analysis. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getSentimentIcon = (sentiment: AgentMessage["sentiment"]) => {
        switch (sentiment) {
            case "positive":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "warning":
                return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case "negative":
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getVerdictStyle = (verdict: DebateResult["verdict"]) => {
        switch (verdict) {
            case "GOOD_BUY":
                return "bg-green-100 text-green-800 border-green-300";
            case "PROCEED_WITH_CAUTION":
                return "bg-amber-100 text-amber-800 border-amber-300";
            case "NOT_RECOMMENDED":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    return (
        <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Agent Swarm Analysis</h3>
                        <p className="text-sm text-gray-500">
                            6 specialized AI agents evaluate this property
                        </p>
                    </div>
                </div>

                {!loading && !debate && (
                    <button
                        onClick={runAnalysis}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition flex items-center gap-2"
                    >
                        <Bot className="w-4 h-4" />
                        Run Analysis
                    </button>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="p-8 text-center">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Agents are analyzing property...</p>
                    <p className="text-sm text-gray-400 mt-1">
                        This typically takes 2-3 seconds
                    </p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="p-6">
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                    <button
                        onClick={runAnalysis}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Debate Results */}
            {debate && !loading && (
                <div className="p-6 space-y-6">
                    {/* Verdict Banner */}
                    <div
                        className={`px-4 py-3 rounded-xl border-2 ${getVerdictStyle(debate.verdict)}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-bold text-lg flex items-center gap-2">
                                    🎯 SWARM VERDICT:{" "}
                                    {debate.verdict.replace(/_/g, " ")}
                                </div>
                                <p className="text-sm mt-1 opacity-80">{debate.summary}</p>
                            </div>
                            <button className="flex items-center gap-1 text-sm font-medium opacity-70 hover:opacity-100">
                                <FileText className="w-4 h-4" />
                                Download Report
                            </button>
                        </div>
                    </div>

                    {/* Agent Messages */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">
                                Visible Agent Debate
                            </h4>
                            <button
                                onClick={() => setShowAllMessages(!showAllMessages)}
                                className="text-sm text-indigo-600 flex items-center gap-1"
                            >
                                {showAllMessages ? "Collapse" : "Expand All"}
                                {showAllMessages ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        <div className="space-y-3">
                            {debate.agentMessages.slice(0, visibleMessages).map((msg, idx) => {
                                const agentConfig = AGENTS[msg.agent];
                                const Icon = agentConfig.icon;
                                const isExpanded = expandedAgent === msg.agent;

                                return (
                                    <div
                                        key={idx}
                                        className={`rounded-xl border ${agentConfig.border} ${agentConfig.bg} p-4 transition-all ${showAllMessages || isExpanded ? "opacity-100" : "opacity-60"
                                            }`}
                                    >
                                        <div
                                            className="flex items-start gap-3 cursor-pointer"
                                            onClick={() =>
                                                setExpandedAgent(isExpanded ? null : msg.agent)
                                            }
                                        >
                                            <div
                                                className={`p-2 rounded-lg bg-white shadow-sm ${agentConfig.color}`}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-medium ${agentConfig.color}`}>
                                                        [{agentConfig.name}]
                                                    </span>
                                                    {getSentimentIcon(msg.sentiment)}
                                                    {msg.confidence && (
                                                        <span className="text-xs text-gray-400">
                                                            {msg.confidence}% confident
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-700 mt-1">{msg.message}</p>
                                                {msg.details && isExpanded && (
                                                    <p className="text-sm text-gray-500 mt-2 pl-2 border-l-2 border-gray-200">
                                                        └─ {msg.details}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {visibleMessages < debate.agentMessages.length && (
                                <div className="flex justify-center">
                                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recommendations */}
                    {debate.recommendations && debate.recommendations.length > 0 && (
                        <div className="border-t border-gray-100 pt-4">
                            <h4 className="font-semibold text-gray-900 mb-3">
                                📋 Recommendations
                            </h4>
                            <ul className="space-y-2">
                                {debate.recommendations.map((rec, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center gap-2 text-gray-700"
                                    >
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={runAnalysis}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                        >
                            <Bot className="w-4 h-4" />
                            Re-analyze
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition">
                            Switch to INDU Mode for Full Vastu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
