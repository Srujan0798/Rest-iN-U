"use client";

import { useTheme, themeConfig } from "@/contexts/ThemeContext";
import { Palette, Home, Building2, Globe } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: "estate" as const,
      name: "ESTATE",
      icon: Home,
      description: "Real estate property search",
    },
    {
      id: "indu" as const,
      name: "INDU",
      icon: Building2,
      description: "Industrial properties",
    },
    {
      id: "web3" as const,
      name: "WEB3",
      icon: Globe,
      description: "Blockchain properties",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-2">
        <div className="flex items-center space-x-2 mb-3 px-2 pt-2">
          <Palette className="w-4 h-4 text-gray-600" />
          <span className="text-xs font-semibold text-gray-700">
            Theme Mode
          </span>
        </div>

        <div className="space-y-1">
          {themes.map(({ id, name, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                theme === id
                  ? "bg-gradient-to-r " +
                    themeConfig[id].gradient +
                    " text-white shadow-lg scale-105"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              title={description}
            >
              <Icon className="w-4 h-4" />
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{name}</div>
                <div
                  className={`text-xs ${theme === id ? "text-white/80" : "text-gray-500"}`}
                >
                  {description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
