"use client";

import { useState, useEffect } from "react";
import {
  Brain,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  TrendingUp,
  Shield,
  Home,
} from "lucide-react";

interface ThoughtStep {
  id: string;
  type: "analysis" | "reasoning" | "calculation" | "validation" | "decision";
  title: string;
  content: string;
  confidence?: number;
  data?: any;
  timestamp: Date;
}

interface GlassBoxProps {
  title?: string;
  thoughts: ThoughtStep[];
  isVisible?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function GlassBox({
  title = "AI Reasoning Process",
  thoughts,
  isVisible: externalVisible,
  onToggle,
  className = "",
}: GlassBoxProps) {
  const [internalVisible, setInternalVisible] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);

  const isVisible =
    externalVisible !== undefined ? externalVisible : internalVisible;
  const handleToggle = onToggle || (() => setInternalVisible(!isVisible));

  const getIcon = (type: ThoughtStep["type"]) => {
    switch (type) {
      case "analysis":
        return <Brain className="w-4 h-4 text-blue-500" />;
      case "reasoning":
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case "calculation":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "validation":
        return <Shield className="w-4 h-4 text-purple-500" />;
      case "decision":
        return <Home className="w-4 h-4 text-red-500" />;
      default:
        return <Brain className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: ThoughtStep["type"]) => {
    switch (type) {
      case "analysis":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "reasoning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "calculation":
        return "bg-green-50 border-green-200 text-green-800";
      case "validation":
        return "bg-purple-50 border-purple-200 text-purple-800";
      case "decision":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId],
    );
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (!isVisible) {
    return (
      <div className={`fixed bottom-6 left-6 z-40 ${className}`}>
        <button
          onClick={handleToggle}
          className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 px-4 py-3 rounded-xl shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 group"
        >
          <Eye className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
          <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
            Show AI Reasoning
          </span>
          <Brain className="w-4 h-4 text-blue-600 animate-pulse" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-6 left-6 right-6 md:right-auto md:w-96 z-40 ${className}`}
    >
      <div className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl overflow-hidden max-h-96">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <h3 className="font-semibold">{title}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Live</span>
              </div>
              <button
                onClick={handleToggle}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-80">
          {thoughts.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">AI is thinking...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {thoughts.map((thought, index) => {
                const isExpanded = expandedSteps.includes(thought.id);
                return (
                  <div
                    key={thought.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleStep(thought.id)}
                      className="w-full p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 font-mono">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {getIcon(thought.type)}
                          <span className="text-sm font-medium text-gray-900 text-left">
                            {thought.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {thought.confidence && (
                            <span className="text-xs text-gray-500">
                              {Math.round(thought.confidence * 100)}%
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-3 bg-white border-t border-gray-200">
                        <div className="mb-2 flex items-center space-x-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${getTypeColor(thought.type)}`}
                          >
                            {thought.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(thought.timestamp)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                          {thought.content}
                        </p>

                        {thought.data && (
                          <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                            <pre className="text-xs text-gray-600 overflow-x-auto">
                              {JSON.stringify(thought.data, null, 2)}
                            </pre>
                          </div>
                        )}

                        {thought.confidence && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Confidence</span>
                              <span>
                                {Math.round(thought.confidence * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                                style={{
                                  width: `${thought.confidence * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Total Steps: {thoughts.length}</span>
            <span>Processing Time: ~2.3s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock hook for generating AI thoughts
export function useMockThoughts(propertyId: string): ThoughtStep[] {
  const [thoughts, setThoughts] = useState<ThoughtStep[]>([]);

  useEffect(() => {
    // Simulate AI thinking process
    const mockThoughts: ThoughtStep[] = [
      {
        id: "1",
        type: "analysis",
        title: "Analyzing property characteristics",
        content:
          "Processing property data: 4BHK villa, 3200 sqft, Whitefield location",
        confidence: 0.95,
        timestamp: new Date(Date.now() - 5000),
        data: { bedrooms: 4, sqft: 3200, location: "Whitefield" },
      },
      {
        id: "2",
        type: "calculation",
        title: "Calculating Vastu compliance score",
        content:
          "Evaluating entrance direction, room placement, and energy flow",
        confidence: 0.88,
        timestamp: new Date(Date.now() - 4000),
        data: { entrance: "Northeast", score: 9, compliance: "Excellent" },
      },
      {
        id: "3",
        type: "reasoning",
        title: "Assessing climate risk factors",
        content: "Analyzing flood risk, air quality, and temperature patterns",
        confidence: 0.92,
        timestamp: new Date(Date.now() - 3000),
        data: { riskLevel: "low", floodRisk: "minimal", airQuality: "good" },
      },
      {
        id: "4",
        type: "validation",
        title: "Cross-validating with market data",
        content: "Comparing price with similar properties in the area",
        confidence: 0.85,
        timestamp: new Date(Date.now() - 2000),
        data: { marketPrice: 8200000, currentPrice: 8500000, variance: "3.7%" },
      },
      {
        id: "5",
        type: "decision",
        title: "Generating final recommendation",
        content:
          "Property recommended with conditional approval based on climate mitigation",
        confidence: 0.78,
        timestamp: new Date(Date.now() - 1000),
        data: {
          decision: "conditional",
          confidence: 78,
          recommendation: "Proceed with precautions",
        },
      },
    ];

    // Simulate progressive loading of thoughts
    const timer = setTimeout(() => {
      setThoughts(mockThoughts);
    }, 1000);

    return () => clearTimeout(timer);
  }, [propertyId]);

  return thoughts;
}
