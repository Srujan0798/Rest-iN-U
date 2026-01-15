"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building,
  Users,
  Cpu,
  Menu,
  X,
  ChevronDown,
  Palette,
  User,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  description: string;
  color: string;
  bgGradient: string;
}

const navigationItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    path: "/",
    description: "Welcome to Rest-iN-U Platform",
    color: "text-violet-600",
    bgGradient: "from-violet-500 to-purple-600",
  },
  {
    id: "estate",
    label: "ESTATE",
    icon: Building,
    path: "/estate",
    description: "Real Estate & Property Management",
    color: "text-blue-600",
    bgGradient: "from-blue-500 to-blue-700",
  },
  {
    id: "ind",
    label: "IND",
    icon: Users,
    path: "/ind",
    description: "Indian Democracy & Civic Engagement",
    color: "text-orange-600",
    bgGradient: "from-orange-500 to-orange-700",
  },
  {
    id: "web3",
    label: "WEB3",
    icon: Cpu,
    path: "/web3",
    description: "Crypto, NFTs & DeFi Hub",
    color: "text-green-600",
    bgGradient: "from-green-500 to-emerald-600",
  },
];

interface MainNavigationProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onModuleChange?: (module: string) => void;
  currentTheme?: string;
}

export default function MainNavigation({
  user,
  onModuleChange,
  currentTheme = "estate",
}: MainNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();

  const currentModule =
    navigationItems.find(
      (item) =>
        item.path === pathname ||
        (pathname.startsWith(item.path) && item.path !== "/"),
    ) || navigationItems[0];

  const handleNavClick = (item: NavItem) => {
    onModuleChange?.(item.id);
    setIsMobileMenuOpen(false);
  };

  const formatUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      {/* Desktop Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Rest-iN-U</span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === currentModule.id;

                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => handleNavClick(item)}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${item.bgGradient} text-white shadow-lg`
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Switcher */}
            <div className="hidden lg:block">
              <ThemeSwitcher currentTheme={currentTheme as any} />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user ? formatUserInitials(user.name) : "G"}
                    </span>
                  </div>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    {user ? (
                      <>
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">
                                {formatUserInitials(user.name)}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </button>
                          <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </button>
                          <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-4">
                        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                          Sign In
                        </button>
                        <p className="text-sm text-gray-600 text-center mt-2">
                          Access all features with an account
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Module Navigation */}
            <div className="space-y-2 mb-6">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === currentModule.id;

                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => handleNavClick(item)}
                    className={`w-full px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${item.bgGradient} text-white`
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div
                        className={`text-sm ${isActive ? "text-white/80" : "text-gray-500"}`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Theme Switcher */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Theme</span>
                <ThemeSwitcher
                  currentTheme={currentTheme as any}
                  showLabels={false}
                />
              </div>
            </div>

            {/* Mobile User Actions */}
            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {formatUserInitials(user.name)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="px-4">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Current Module Indicator (Desktop) */}
      <div className="hidden lg:block bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <currentModule.icon
                className={`w-5 h-5 ${currentModule.color}`}
              />
              <span className="font-medium text-gray-900">
                {currentModule.description}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>
                Current Module:{" "}
                <span className="font-semibold">{currentModule.label}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Compact Navigation for smaller spaces
export function CompactNavigation({
  currentModule,
  onModuleChange,
}: {
  currentModule?: string;
  onModuleChange?: (module: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleModuleSelect = (moduleId: string) => {
    onModuleChange?.(moduleId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">
                Navigate to Module
              </h3>
            </div>

            <div className="py-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === currentModule;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleModuleSelect(item.id)}
                    className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors ${
                      isActive
                        ? "bg-gradient-to-r " + item.bgGradient + " text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div
                        className={`text-sm ${isActive ? "text-white/80" : "text-gray-500"}`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
