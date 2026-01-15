"use client";

import { useState } from "react";
import { Palette, Home, Users, Cpu } from "lucide-react";

type Theme = "estate" | "ind" | "web3";

interface ThemeConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  primaryColor: string;
  bgGradient: string;
  borderColor: string;
  module: string;
}

const themes: Record<Theme, ThemeConfig> = {
  estate: {
    name: "ESTATE",
    icon: Home,
    primaryColor: "bg-blue-600",
    bgGradient: "from-blue-600 to-blue-700",
    borderColor: "border-blue-200",
    module: "Real Estate",
  },
  ind: {
    name: "IND",
    icon: Users,
    primaryColor: "bg-orange-600",
    bgGradient: "from-orange-600 to-orange-700",
    borderColor: "border-orange-200",
    module: "Indian Democracy",
  },
  web3: {
    name: "WEB3",
    icon: Cpu,
    primaryColor: "bg-green-600",
    bgGradient: "from-green-600 to-green-700",
    borderColor: "border-green-200",
    module: "Web3 & Crypto",
  },
};

interface ThemeSwitcherProps {
  currentTheme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function ThemeSwitcher({
  currentTheme = "estate",
  onThemeChange,
  showLabels = true,
  size = "md",
}: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = (theme: Theme) => {
    onThemeChange?.(theme);
    setIsOpen(false);

    // Update CSS variables for theme
    const root = document.documentElement;
    switch (theme) {
      case "estate":
        root.style.setProperty("--primary", "210 100% 50%");
        root.style.setProperty("--primary-foreground", "0 0% 100%");
        break;
      case "ind":
        root.style.setProperty("--primary", "30 100% 50%");
        root.style.setProperty("--primary-foreground", "0 0% 100%");
        break;
      case "web3":
        root.style.setProperty("--primary", "160 80% 45%");
        root.style.setProperty("--primary-foreground", "0 0% 100%");
        break;
    }
  };

  const currentConfig = themes[currentTheme];
  const sizeClasses = {
    sm: "p-2 text-sm",
    md: "p-3 text-base",
    lg: "p-4 text-lg",
  };

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all ${sizeClasses[size]}`}
      >
        <currentConfig.icon className="w-5 h-5" />
        {showLabels && (
          <span className="font-medium text-gray-900">
            {currentConfig.name}
          </span>
        )}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
      </button>

      {/* Theme Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Panel */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2 text-gray-900">
                <Palette className="w-5 h-5" />
                <span className="font-semibold">Choose Theme</span>
              </div>
            </div>

            <div className="p-2">
              {(Object.entries(themes) as [Theme, ThemeConfig][]).map(
                ([themeKey, config]) => {
                  const Icon = config.icon;
                  const isActive = currentTheme === themeKey;

                  return (
                    <button
                      key={themeKey}
                      onClick={() => handleThemeSelect(themeKey)}
                      className={`w-full p-3 rounded-lg flex items-center space-x-3 transition-all ${
                        isActive
                          ? "bg-gray-100 border-2 border-gray-300"
                          : "hover:bg-gray-50 border-2 border-transparent"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${config.primaryColor} text-white`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">
                            {config.name}
                          </span>
                          {isActive && (
                            <svg
                              className="w-4 h-4 text-green-600"
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
                        <span className="text-sm text-gray-500">
                          {config.module}
                        </span>
                      </div>

                      <div className="flex space-x-1">
                        <div
                          className={`w-3 h-3 rounded-full ${config.primaryColor}`}
                        ></div>
                        <div
                          className={`w-3 h-3 rounded-full opacity-60 ${config.primaryColor}`}
                        ></div>
                        <div
                          className={`w-3 h-3 rounded-full opacity-30 ${config.primaryColor}`}
                        ></div>
                      </div>
                    </button>
                  );
                },
              )}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-600 text-center">
                Each theme adapts the interface for its specific module
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Compact Theme Toggle Component
export function ThemeToggle({
  currentTheme,
  onThemeChange,
}: {
  currentTheme?: Theme;
  onThemeChange?: (theme: Theme) => void;
}) {
  const handleCycle = () => {
    const themes: Theme[] = ["estate", "ind", "web3"];
    const currentIndex = currentTheme ? themes.indexOf(currentTheme) : 0;
    const nextIndex = (currentIndex + 1) % themes.length;
    onThemeChange?.(themes[nextIndex]);
  };

  const currentConfig = currentTheme ? themes[currentTheme] : themes.estate;
  const Icon = currentConfig.icon;

  return (
    <button
      onClick={handleCycle}
      className={`p-2 ${currentConfig.primaryColor} text-white rounded-lg hover:opacity-90 transition-opacity`}
      title={`Switch to next theme (Current: ${currentConfig.name})`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}

// Theme Indicator Component
export function ThemeIndicator({ theme }: { theme: Theme }) {
  const config = themes[theme];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-white border ${config.borderColor}`}
    >
      <Icon
        className={`w-4 h-4 ${config.primaryColor.replace("bg-", "text-")}`}
      />
      <span className="text-sm font-medium text-gray-700">{config.name}</span>
    </div>
  );
}
