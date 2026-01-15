"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "estate" | "indu" | "web3";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeConfig = {
  estate: {
    name: "ESTATE",
    primary: "#2563eb",
    secondary: "#7c3aed",
    accent: "#3b82f6",
    gradient: "from-blue-600 to-purple-600",
    background: "from-blue-50 to-purple-50",
  },
  indu: {
    name: "INDU",
    primary: "#f59e0b",
    secondary: "#ea580c",
    accent: "#f97316",
    gradient: "from-amber-500 to-orange-500",
    background: "from-amber-50 to-orange-50",
  },
  web3: {
    name: "WEB3",
    primary: "#10b981",
    secondary: "#14b8a6",
    accent: "#06b6d4",
    gradient: "from-emerald-500 to-teal-500",
    background: "from-emerald-50 to-teal-50",
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("estate");

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("restinu-theme") as Theme;
    if (savedTheme && themeConfig[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Update CSS variables and localStorage when theme changes
    const config = themeConfig[theme];
    const root = document.documentElement;

    root.style.setProperty("--theme-primary", config.primary);
    root.style.setProperty("--theme-secondary", config.secondary);
    root.style.setProperty("--theme-accent", config.accent);

    localStorage.setItem("restinu-theme", theme);

    // Update body class for theme-specific styles
    document.body.className = document.body.className.replace(/theme-\w+/g, "");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { themeConfig };
