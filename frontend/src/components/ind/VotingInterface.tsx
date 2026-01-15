"use client";

import { useState } from "react";
import {
  Vote,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Share2,
  Flag,
} from "lucide-react";

interface VotingOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  isSelected: boolean;
}

interface Poll {
  id: string;
  question: string;
  description?: string;
  options: VotingOption[];
  totalVotes: number;
  deadline: string;
  userVoted: boolean;
  category: string;
  allowMultipleChoice: boolean;
  isAnonymous: boolean;
}

interface VotingInterfaceProps {
  poll: Poll;
  onVote?: (optionIds: string[]) => void;
  onShare?: (pollId: string) => void;
  onReport?: (pollId: string) => void;
}

export default function VotingInterface({
  poll,
  onVote,
  onShare,
  onReport,
}: VotingInterfaceProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(poll.userVoted);
  const [showResults, setShowResults] = useState(poll.userVoted);

  const handleOptionSelect = (optionId: string) => {
    if (hasVoted) return;

    if (poll.allowMultipleChoice) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId],
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVote = () => {
    if (selectedOptions.length === 0 || hasVoted) return;

    onVote?.(selectedOptions);
    setHasVoted(true);
    setShowResults(true);
  };

  const formatTimeRemaining = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();

    if (diffMs <= 0) return "Voting ended";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    if (diffDays > 0) return `${diffDays} days left`;
    if (diffHours > 0) return `${diffHours} hours left`;
    return "Less than 1 hour left";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Economic: "bg-blue-100 text-blue-800",
      Social: "bg-green-100 text-green-800",
      Political: "bg-orange-100 text-orange-800",
      Environmental: "bg-emerald-100 text-emerald-800",
      Technology: "bg-purple-100 text-purple-800",
      Infrastructure: "bg-gray-100 text-gray-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Poll Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getCategoryColor(poll.category)}`}
              >
                {poll.category}
              </span>
              <h1 className="text-2xl font-bold mb-2">{poll.question}</h1>
              {poll.description && (
                <p className="text-orange-100 text-sm">{poll.description}</p>
              )}
            </div>

            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onShare?.(poll.id)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onReport?.(poll.id)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{poll.totalVotes.toLocaleString()} votes</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{formatTimeRemaining(poll.deadline)}</span>
              </div>
            </div>

            {poll.isAnonymous && (
              <div className="flex items-center text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>Anonymous voting</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voting Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {!hasVoted && !showResults && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {poll.allowMultipleChoice
                ? "Select all options you support"
                : "Select one option"}
            </h2>
            <p className="text-sm text-gray-600">
              {poll.allowMultipleChoice
                ? `You can choose multiple options (${poll.options.length} available)`
                : "Choose the option you prefer"}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {poll.options.map((option) => (
            <div
              key={option.id}
              className={`relative rounded-lg border-2 transition-all cursor-pointer ${
                !hasVoted && !showResults
                  ? selectedOptions.includes(option.id)
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  : "border-gray-200"
              }`}
              onClick={() =>
                !hasVoted && !showResults && handleOptionSelect(option.id)
              }
            >
              {/* Progress Bar for Results */}
              {showResults && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg"
                  style={{ width: `${option.percentage}%` }}
                ></div>
              )}

              <div className="relative p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {/* Checkbox/Radio Button */}
                    {!hasVoted && !showResults && (
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedOptions.includes(option.id)
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedOptions.includes(option.id) && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    )}

                    {/* Check Mark for Voted Option */}
                    {hasVoted && selectedOptions.includes(option.id) && (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}

                    <span className="text-gray-900 font-medium">
                      {option.text}
                    </span>
                  </div>

                  {/* Vote Count and Percentage */}
                  {showResults && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-semibold text-gray-900">
                        {option.percentage}%
                      </span>
                      <span className="text-gray-600">
                        ({option.votes.toLocaleString()} votes)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {!hasVoted && !showResults && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleVote}
              disabled={selectedOptions.length === 0}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                selectedOptions.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 shadow-lg"
              }`}
            >
              <Vote className="w-4 h-4 inline mr-2" />
              Cast Vote{selectedOptions.length > 1 ? "s" : ""}
            </button>
          </div>
        )}

        {hasVoted && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-800">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">
                Your vote has been recorded successfully!
              </span>
            </div>
          </div>
        )}

        {/* Toggle Results Button */}
        {hasVoted && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowResults(!showResults)}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              {showResults ? "Hide Results" : "Show Results"}
            </button>
          </div>
        )}
      </div>

      {/* Poll Analytics */}
      {showResults && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Poll Analytics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {poll.totalVotes.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {poll.options.filter((opt) => opt.votes > 0).length}
              </div>
              <div className="text-sm text-gray-600">Options with Votes</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(poll.totalVotes / poll.options.length)}
              </div>
              <div className="text-sm text-gray-600">Average Votes</div>
            </div>
          </div>
        </div>
      )}

      {/* Voting Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Voting Guidelines
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Each citizen can vote only once per poll</li>
              <li>• All votes are confidential and counted fairly</li>
              <li>• Poll results are visible after voting deadline</li>
              <li>• This platform promotes informed civic participation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
