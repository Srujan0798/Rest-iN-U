// @F1-Web: Theme Switcher Component
"use client";

import { useState } from "react";

export type ThemeMode = "estate" | "indu" | "web3";

interface ThemeSwitcherProps {
  currentTheme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
}

export function ThemeSwitcher({
  currentTheme = "estate",
  onThemeChange,
}: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<ThemeMode>(currentTheme);

  const themes = [
    {
      id: "estate" as ThemeMode,
      name: "ESTATE",
      icon: "🏠",
      colors: "bg-blue-600",
      hoverColors: "hover:bg-blue-700",
      borderColors: "border-blue-600",
    },
    {
      id: "indu" as ThemeMode,
      name: "INDU",
      icon: "🏭",
      colors: "bg-orange-600",
      hoverColors: "hover:bg-orange-700",
      borderColors: "border-orange-600",
    },
    {
      id: "web3" as ThemeMode,
      name: "WEB3",
      icon: "🌐",
      colors: "bg-green-600",
      hoverColors: "hover:bg-green-700",
      borderColors: "border-green-600",
    },
  ];

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }

    // Update CSS variables for global theming
    document.documentElement.className = `theme-${newTheme}`;
  };

  return (
    <div className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-lg">
      <span className="text-sm font-medium text-gray-700 px-2">Mode:</span>

      {themes.map((themeOption) => (
        <button
          key={themeOption.id}
          onClick={() => handleThemeChange(themeOption.id)}
          className={`
                        flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all
                        ${
                          theme === themeOption.id
                            ? `${themeOption.colors} text-white`
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                    `}
        >
          <span className="text-lg">{themeOption.icon}</span>
          <span>{themeOption.name}</span>
        </button>
      ))}
    </div>
  );
}
