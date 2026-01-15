"use client";

import { useState } from "react";
import {
  MessageCircle,
  Users,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Flag,
  Clock,
} from "lucide-react";

interface Debate {
  id: string;
  title: string;
  description: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  stats: {
    participants: number;
    arguments: {
      for: number;
      against: number;
    };
    timestamp: string;
  };
  active: boolean;
}

interface Argument {
  id: string;
  debateId: string;
  side: "for" | "against";
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  votes: {
    up: number;
    down: number;
  };
  timestamp: string;
  rebuttals?: Argument[];
}

interface DebatePanelProps {
  debate?: Debate;
  arguments?: Argument[];
  onVote?: (argumentId: string, type: "up" | "down") => void;
  onAddArgument?: (
    debateId: string,
    side: "for" | "against",
    content: string,
  ) => void;
  showNewDebateForm?: boolean;
}

export default function DebatePanel({
  debate,
  arguments = [],
  onVote,
  onAddArgument,
  showNewDebateForm = false,
}: DebatePanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "arguments">(
    "overview",
  );
  const [selectedSide, setSelectedSide] = useState<"for" | "against">("for");
  const [newArgument, setNewArgument] = useState("");

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Glass Box Container */}
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        {debate && (
          <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-md border-b border-white/10 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 bg-orange-500/30 text-orange-200 text-xs font-semibold rounded-full">
                    {debate.category}
                  </span>
                  {debate.active && (
                    <span className="px-2 py-1 bg-green-500/30 text-green-200 text-xs font-semibold rounded-full flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                      LIVE
                    </span>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-white mb-3">
                  {debate.title}
                </h1>
                <p className="text-white/80 mb-4">{debate.description}</p>

                <div className="flex items-center space-x-4 text-sm text-white/70">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mr-2"></div>
                    <span>{debate.author.name}</span>
                    {debate.author.verified && (
                      <svg
                        className="w-4 h-4 text-blue-400 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(debate.stats.timestamp)}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {debate.stats.participants} participants
                  </div>
                </div>
              </div>

              <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        {debate && (
          <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {debate.stats.arguments.for}
                </div>
                <div className="text-sm text-white/60">FOR</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {debate.stats.arguments.against}
                </div>
                <div className="text-sm text-white/60">AGAINST</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {debate.stats.participants}
                </div>
                <div className="text-sm text-white/60">DEBATERS</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
          <div className="flex">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-white border-b-2 border-orange-400 bg-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("arguments")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "arguments"
                  ? "text-white border-b-2 border-orange-400 bg-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Arguments ({arguments.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "overview" ? (
            <div className="space-y-6">
              {/* Side Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedSide("for")}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedSide === "for"
                      ? "border-green-400 bg-green-500/20 text-white"
                      : "border-white/20 bg-white/5 text-white/60 hover:border-white/30"
                  }`}
                >
                  <div className="text-lg font-bold mb-2">FOR</div>
                  <div className="text-sm">Support this position</div>
                </button>

                <button
                  onClick={() => setSelectedSide("against")}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedSide === "against"
                      ? "border-red-400 bg-red-500/20 text-white"
                      : "border-white/20 bg-white/5 text-white/60 hover:border-white/30"
                  }`}
                >
                  <div className="text-lg font-bold mb-2">AGAINST</div>
                  <div className="text-sm">Oppose this position</div>
                </button>
              </div>

              {/* Add Argument */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                  Your Argument ({selectedSide.toUpperCase()})
                </label>
                <textarea
                  value={newArgument}
                  onChange={(e) => setNewArgument(e.target.value)}
                  placeholder="Present your case with facts, logic, and evidence..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                  rows={4}
                />
                <button
                  onClick={() => {
                    if (newArgument.trim() && debate && onAddArgument) {
                      onAddArgument(debate.id, selectedSide, newArgument);
                      setNewArgument("");
                    }
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  Submit Argument
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {arguments.map((argument) => (
                <div
                  key={argument.id}
                  className={`p-4 rounded-xl border backdrop-blur-sm ${
                    argument.side === "for"
                      ? "bg-green-500/10 border-green-400/20"
                      : "bg-red-500/10 border-red-400/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          argument.side === "for"
                            ? "bg-green-500/30 text-green-200"
                            : "bg-red-500/30 text-red-200"
                        }`}
                      >
                        {argument.side.toUpperCase()}
                      </span>
                      <span className="text-sm text-white/70">
                        {argument.author.name}
                      </span>
                      <span className="text-xs text-white/50">
                        {formatDate(argument.timestamp)}
                      </span>
                    </div>

                    <button className="p-1 text-white/40 hover:text-white/60 transition-colors">
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-white/90 mb-3">{argument.content}</p>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => onVote?.(argument.id, "up")}
                      className="flex items-center space-x-1 text-white/60 hover:text-green-400 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{argument.votes.up}</span>
                    </button>

                    <button
                      onClick={() => onVote?.(argument.id, "down")}
                      className="flex items-center space-x-1 text-white/60 hover:text-red-400 transition-colors"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-sm">{argument.votes.down}</span>
                    </button>

                    <button className="flex items-center space-x-1 text-white/60 hover:text-white/60 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Reply</span>
                    </button>
                  </div>
                </div>
              ))}

              {arguments.length === 0 && (
                <div className="text-center py-12 text-white/50">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No arguments yet. Be the first to present your case!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
