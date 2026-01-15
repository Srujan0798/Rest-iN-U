// @F1-Web: Glass Box Component for Visible Reasoning
"use client";

import { useState } from "react";

interface ReasoningStep {
  id: string;
  step: number;
  title: string;
  description: string;
  confidence: number;
  category: "analysis" | "calculation" | "validation" | "conclusion";
  timestamp: Date;
}

interface GlassBoxProps {
  propertyId?: string;
  visible?: boolean;
  compact?: boolean;
}

export function GlassBox({
  propertyId,
  visible = true,
  compact = false,
}: GlassBoxProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const [reasoningSteps] = useState<ReasoningStep[]>([
    {
      id: "1",
      step: 1,
      title: "Property Data Validation",
      description:
        "Verified property dimensions, location coordinates, and ownership records against official databases.",
      confidence: 95,
      category: "validation",
      timestamp: new Date(Date.now() - 10 * 60000),
    },
    {
      id: "2",
      step: 2,
      title: "Vastu Compliance Analysis",
      description:
        "Analyzed entrance direction (Northeast), room placement, and elemental balance. Kitchen in Southeast corner follows Vastu principles.",
      confidence: 88,
      category: "analysis",
      timestamp: new Date(Date.now() - 8 * 60000),
    },
    {
      id: "3",
      step: 3,
      title: "Climate Risk Assessment",
      description:
        "Calculated flood risk score based on historical data, proximity to water bodies, and elevation. Moderate risk identified.",
      confidence: 76,
      category: "calculation",
      timestamp: new Date(Date.now() - 6 * 60000),
    },
    {
      id: "4",
      step: 4,
      title: "Market Value Calculation",
      description:
        "Comparable property analysis with area price per sqft adjustment. Price estimated 5% above market average due to Vastu compliance.",
      confidence: 82,
      category: "calculation",
      timestamp: new Date(Date.now() - 4 * 60000),
    },
    {
      id: "5",
      step: 5,
      title: "Investment Potential Scoring",
      description:
        "ROI projection based on area development plans, infrastructure projects, and historical appreciation rates. Strong growth potential identified.",
      confidence: 79,
      category: "analysis",
      timestamp: new Date(Date.now() - 2 * 60000),
    },
    {
      id: "6",
      step: 6,
      title: "Final Recommendation",
      description:
        "Overall positive recommendation with conditional requirements for flood mitigation measures and price negotiation.",
      confidence: 85,
      category: "conclusion",
      timestamp: new Date(),
    },
  ]);

  if (!visible) return null;

  const getCategoryColor = (category: ReasoningStep["category"]) => {
    switch (category) {
      case "validation":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "analysis":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "calculation":
        return "bg-green-100 text-green-800 border-green-200";
      case "conclusion":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: ReasoningStep["category"]) => {
    switch (category) {
      case "validation":
        return "✅";
      case "analysis":
        return "🔍";
      case "calculation":
        return "📊";
      case "conclusion":
        return "🎯";
      default:
        return "📋";
    }
  };

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  if (compact) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
        <h4 className="font-medium text-sm mb-2 flex items-center">
          <span className="mr-2">🧠</span>
          AI Reasoning Process
        </h4>
        <div className="flex items-center space-x-2">
          {reasoningSteps.map((step) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  step.category === "conclusion"
                    ? "bg-orange-500 border-orange-600"
                    : step.category === "validation"
                      ? "bg-blue-500 border-blue-600"
                      : step.category === "analysis"
                        ? "bg-purple-500 border-purple-600"
                        : "bg-green-500 border-green-600"
                }`}
                title={step.title}
              />
              {step.step < reasoningSteps.length && (
                <div className="w-4 h-0.5 bg-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🧠</span>
            <h3 className="text-lg font-semibold text-gray-900">
              Glass Box: Visible Reasoning
            </h3>
          </div>
          <span className="text-sm text-gray-500">
            {reasoningSteps.length} steps analyzed
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Transparent AI decision-making process for property evaluation
        </p>
      </div>

      {/* Reasoning Steps */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {reasoningSteps.map((step) => (
          <div
            key={step.id}
            className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md"
          >
            <div
              className="p-3 cursor-pointer bg-white hover:bg-gray-50"
              onClick={() => toggleStep(step.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{step.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(step.category)}`}
                      >
                        <span className="mr-1">
                          {getCategoryIcon(step.category)}
                        </span>
                        {step.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {step.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {step.confidence}%
                    </div>
                    <div className="text-xs text-gray-500">confidence</div>
                  </div>
                  <div className="w-12 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${step.confidence}%` }}
                    />
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedSteps.has(step.id) ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {expandedSteps.has(step.id) && (
              <div className="px-3 pb-3 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {step.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Overall Confidence</h4>
            <p className="text-sm text-gray-600">
              Based on {reasoningSteps.length} analysis steps
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(
                reasoningSteps.reduce((acc, step) => acc + step.confidence, 0) /
                  reasoningSteps.length,
              )}
              %
            </div>
            <div className="text-xs text-gray-500">Average Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}
