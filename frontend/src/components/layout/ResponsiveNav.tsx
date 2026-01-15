"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Building2,
  Globe,
  Search,
  Settings,
  User,
  ChevronDown,
} from "lucide-react";
import { useTheme, themeConfig } from "@/contexts/ThemeContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

export function ResponsiveNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { theme } = useTheme();

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const navItems: NavItem[] = [
    {
      label: "ESTATE",
      href: "/estate",
      icon: <Home className="w-4 h-4" />,
    },
    {
      label: "INDU",
      href: "/indu",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      label: "WEB3",
      href: "/web3",
      icon: <Globe className="w-4 h-4" />,
    },
  ];

  const secondaryNavItems = [
    {
      label: "Search",
      href: "/search",
      icon: <Search className="w-4 h-4" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <User className="w-4 h-4" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const getNavColor = (href: string) => {
    if (isActive(href)) {
      return "text-white bg-gradient-to-r from-blue-600 to-purple-600";
    }
    return "text-gray-700 hover:text-gray-900 hover:bg-gray-100";
  };

  const getNavColorMobile = (href: string) => {
    if (isActive(href)) {
      return "bg-gradient-to-r from-blue-600 to-purple-600 text-white";
    }
    return "text-gray-700 hover:bg-gray-100";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        {isDesktop && (
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Rest-iN-U</span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${getNavColor(item.href)}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Secondary Navigation */}
            <div className="flex items-center space-x-2">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title={item.label}
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {!isDesktop && (
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Rest-iN-U</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && !isDesktop && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">R</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    Rest-iN-U
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Navigation Items */}
              <div className="p-4 space-y-2">
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Property Modes
                  </h3>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${getNavColorMobile(item.href)}`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Account
                  </h3>
                  {secondaryNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Theme Indicator */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full bg-${themeConfig[theme].primary}`}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        Current Theme: {themeConfig[theme].name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
