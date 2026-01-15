"use client";

import { useState } from "react";
import { Grid, List } from "lucide-react";

interface ViewToggleProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  className?: string;
}

export function ViewToggle({
  view,
  onViewChange,
  className = "",
}: ViewToggleProps) {
  return (
    <div className={`flex bg-gray-100 rounded-lg p-1 ${className}`}>
      <button
        onClick={() => onViewChange("grid")}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          view === "grid"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <Grid className="w-4 h-4" />
        <span>Grid</span>
      </button>

      <button
        onClick={() => onViewChange("list")}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          view === "list"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <List className="w-4 h-4" />
        <span>List</span>
      </button>
    </div>
  );
}
