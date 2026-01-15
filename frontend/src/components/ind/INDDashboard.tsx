"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Vote,
  Calendar,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Filter,
  Search,
  ChevronRight,
  UserCheck,
  Building,
  Flag,
} from "lucide-react";
import DebatePanel from "./DebatePanel";
import VotingInterface from "./VotingInterface";

interface Debate {
  id: string;
  title: string;
  category: string;
  description: string;
  stats: {
    participants: number;
    arguments: { for: number; against: number };
    views: number;
  };
  trending: boolean;
  deadline: string;
  status: "active" | "ended" | "upcoming";
}

interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: number;
  userVoted: boolean;
  deadline: string;
}

interface Representative {
  id: string;
  name: string;
  position: string;
  constituency: string;
  party: string;
  avatar?: string;
  rating: number;
}

const mockDebates: Debate[] = [
  {
    id: "1",
    title: "Should India implement a Universal Basic Income (UBI)?",
    category: "Economic Policy",
    description:
      "Discussion on implementing UBI to address poverty and unemployment in India",
    stats: {
      participants: 1234,
      arguments: { for: 456, against: 324 },
      views: 8901,
    },
    trending: true,
    deadline: "2024-02-15",
    status: "active",
  },
  {
    id: "2",
    title: "Is digital voting the future of Indian elections?",
    category: "Electoral Reform",
    description:
      "Exploring the feasibility and security of online voting systems",
    stats: {
      participants: 892,
      arguments: { for: 234, against: 456 },
      views: 5678,
    },
    trending: false,
    deadline: "2024-01-30",
    status: "active",
  },
];

const mockPolls: Poll[] = [
  {
    id: "1",
    question: "Which infrastructure development should be prioritized?",
    options: ["Highways", "Railways", "Airports", "Ports"],
    votes: 5432,
    userVoted: false,
    deadline: "2024-01-25",
  },
  {
    id: "2",
    question: "Should voting be made mandatory for all citizens?",
    options: ["Yes", "No", "Only for local elections", "Not sure"],
    votes: 3210,
    userVoted: true,
    deadline: "2024-02-01",
  },
];

const mockRepresentatives: Representative[] = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    position: "Member of Parliament",
    constituency: "Mumbai South",
    party: "INC",
    rating: 4.2,
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    position: "MLA",
    constituency: "Delhi Cantonment",
    party: "BJP",
    rating: 3.8,
  },
];

export default function INDDashboard() {
  const [activeTab, setActiveTab] = useState<
    "debates" | "polls" | "representatives"
  >("debates");
  const [selectedDebate, setSelectedDebate] = useState<Debate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    "Economic Policy",
    "Electoral Reform",
    "Social Issues",
    "Defense",
    "Foreign Policy",
  ];

  const filteredDebates = mockDebates.filter((debate) => {
    const matchesSearch =
      debate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      debate.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || debate.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Ended";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "ended":
        return "bg-gray-100 text-gray-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (selectedDebate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedDebate(null)}
            className="mb-6 flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Back to Dashboard
          </button>
          <DebatePanel debate={selectedDebate} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Indian Democracy Platform
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Engage in meaningful debates, participate in polls, and connect
              with your representatives to strengthen Indian democracy
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Debates</p>
                <p className="text-2xl font-bold text-gray-900">127</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Polls</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Vote className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-2xl font-bold text-gray-900">12.3K</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Representatives</p>
                <p className="text-2xl font-bold text-gray-900">847</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {["debates", "polls", "representatives"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        {activeTab === "debates" && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search debates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>

                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "debates" && (
              <div className="space-y-4">
                {filteredDebates.map((debate) => (
                  <div
                    key={debate.id}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-orange-100"
                    onClick={() => setSelectedDebate(debate)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                            {debate.category}
                          </span>
                          {debate.trending && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </span>
                          )}
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(debate.status)}`}
                          >
                            {debate.status.charAt(0).toUpperCase() +
                              debate.status.slice(1)}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-orange-600 transition-colors">
                          {debate.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4">
                          {debate.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {debate.stats.participants}
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {debate.stats.arguments.for +
                                debate.stats.arguments.against}
                            </span>
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {debate.stats.views}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatDate(debate.deadline)}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="text-sm">
                              <span className="text-green-600">
                                {debate.stats.arguments.for}
                              </span>
                              <span className="text-gray-400 mx-1">vs</span>
                              <span className="text-red-600">
                                {debate.stats.arguments.against}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "polls" && (
              <div className="space-y-4">
                {mockPolls.map((poll) => (
                  <div
                    key={poll.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-orange-100"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {poll.question}
                    </h3>

                    <div className="space-y-3 mb-4">
                      {poll.options.map((option, index) => (
                        <div key={index} className="relative">
                          <div
                            className="absolute inset-0 bg-orange-100 rounded-lg opacity-30"
                            style={{
                              width: `${Math.random() * 100}%`,
                            }}
                          ></div>
                          <div className="relative px-4 py-3 border border-orange-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-900">{option}</span>
                              <span className="text-sm text-gray-500">
                                {Math.floor(Math.random() * 1000)} votes
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-600">
                        {poll.votes} total votes
                      </span>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(poll.deadline)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "representatives" && (
              <div className="space-y-4">
                {mockRepresentatives.map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-orange-100"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {rep.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {rep.name}
                        </h3>
                        <p className="text-gray-600">{rep.position}</p>
                        <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                          <span>{rep.constituency}</span>
                          <span>•</span>
                          <span>{rep.party}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="font-semibold">{rep.rating}</span>
                        </div>
                        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-medium hover:from-orange-700 hover:to-orange-800 transition-all">
                  Start New Debate
                </button>
                <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 transition-all">
                  Create Poll
                </button>
                <button className="w-full border border-orange-600 text-orange-600 py-3 rounded-lg font-medium hover:bg-orange-50 transition-all">
                  Contact Representative
                </button>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trending Topics
              </h3>
              <div className="space-y-3">
                {[
                  "Farmers Bill 2024",
                  "Digital Rupee",
                  "Education Reform",
                  "Healthcare Policy",
                ].map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">{topic}</span>
                    <span className="text-xs text-gray-500">
                      {Math.floor(Math.random() * 1000)} discussions
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Civic Education */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Learn About Democracy
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Understanding your civic rights and responsibilities is the
                foundation of a strong democracy.
              </p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Explore Resources
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
