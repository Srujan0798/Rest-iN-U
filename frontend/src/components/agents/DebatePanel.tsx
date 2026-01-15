"use client";

import { useState } from "react";
import {
  MessageCircle,
  Download,
  Users,
  Bot,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
}

interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: Date;
  type: "argument" | "evidence" | "question" | "conclusion";
}

interface Verdict {
  decision: "approve" | "reject" | "conditional";
  confidence: number;
  summary: string;
  recommendations: string[];
}

const mockAgents: Agent[] = [
  {
    id: "vastu",
    name: "Vastu Master",
    role: "Vastu Shastra Expert",
    avatar: "🕉️",
    color: "purple",
  },
  {
    id: "climate",
    name: "Climate Analyst",
    role: "Environmental Risk Specialist",
    avatar: "🌍",
    color: "green",
  },
  {
    id: "financial",
    name: "Financial Advisor",
    role: "Investment Analyst",
    avatar: "💰",
    color: "blue",
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    agentId: "vastu",
    content:
      "The property has excellent Vastu compliance with a northeast-facing entrance and proper room placement. The kitchen is in the southeast corner which is auspicious.",
    timestamp: new Date(),
    type: "evidence",
  },
  {
    id: "2",
    agentId: "climate",
    content:
      "Climate risk assessment shows moderate flood risk due to proximity to water body. Recommend elevated foundation and proper drainage systems.",
    timestamp: new Date(),
    type: "evidence",
  },
  {
    id: "3",
    agentId: "financial",
    content:
      "Property price is 8% above market average for this area. However, the Vastu compliance may justify the premium for the right buyer.",
    timestamp: new Date(),
    type: "argument",
  },
  {
    id: "4",
    agentId: "vastu",
    content:
      "The master bedroom is in the southwest corner, which ensures stability and prosperity for the residents.",
    timestamp: new Date(),
    type: "evidence",
  },
];

const mockVerdict: Verdict = {
  decision: "conditional",
  confidence: 78,
  summary:
    "Property shows excellent Vastu compliance but requires climate mitigation measures. Financial valuation is slightly high but justifiable.",
  recommendations: [
    "Install flood barrier systems around the property perimeter",
    "Negotiate price down by 5-7% to account for climate risks",
    "Consider additional insurance for flood coverage",
    "Proceed with purchase if Vastu alignment is priority",
  ],
};

export function DebatePanel({ propertyId }: { propertyId: string }) {
  const [activeTab, setActiveTab] = useState<"debate" | "verdict">("debate");
  const [isGenerating, setIsGenerating] = useState(false);

  const getMessageIcon = (type: Message["type"]) => {
    switch (type) {
      case "evidence":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "argument":
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "question":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "conclusion":
        return <Bot className="w-4 h-4 text-purple-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAgentColor = (agentId: string) => {
    const agent = mockAgents.find((a) => a.id === agentId);
    return agent ? agent.color : "gray";
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      // Download logic here
      const reportData = {
        propertyId,
        verdict: mockVerdict,
        messages: mockMessages,
        generatedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `property-report-${propertyId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Agent Analysis</h2>
              <p className="text-blue-100 text-sm">
                Multi-expert property evaluation
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isGenerating ? "Generating..." : "Download Report"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab("debate")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "debate"
                ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Agent Debate</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("verdict")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "verdict"
                ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Final Verdict</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {activeTab === "debate" ? (
          <div className="p-6 space-y-4">
            {/* Agents */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                {mockAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center space-x-2">
                    <div
                      className={`w-8 h-8 rounded-full bg-${agent.color}-100 flex items-center justify-center text-sm`}
                    >
                      {agent.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{agent.name}</div>
                      <div className="text-xs text-gray-500">{agent.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-4">
              {mockMessages.map((message) => {
                const agent = mockAgents.find((a) => a.id === message.agentId);
                return (
                  <div key={message.id} className="flex space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-${getAgentColor(message.agentId)}-100 flex items-center justify-center flex-shrink-0`}
                    >
                      {agent?.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">
                          {agent?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {getMessageIcon(message.type)}
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                        {message.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Verdict Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Final Verdict</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        mockVerdict.decision === "approve"
                          ? "bg-green-500"
                          : mockVerdict.decision === "reject"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                      style={{ width: `${mockVerdict.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {mockVerdict.confidence}%
                  </span>
                </div>
              </div>

              <div
                className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                  mockVerdict.decision === "approve"
                    ? "bg-green-100 text-green-800"
                    : mockVerdict.decision === "reject"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {mockVerdict.decision === "approve" && (
                  <CheckCircle className="w-4 h-4" />
                )}
                {mockVerdict.decision === "reject" && (
                  <AlertCircle className="w-4 h-4" />
                )}
                {mockVerdict.decision === "conditional" && (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="capitalize">{mockVerdict.decision}</span>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-gray-700 text-sm">{mockVerdict.summary}</p>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {mockVerdict.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
