'use client';

import { useState, useCallback, createContext, useContext, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tab item interface
interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
  content?: React.ReactNode;
}

// Context for controlled tabs
interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

// Hook to access tabs context
export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
}

// Component props
interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'boxed' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  animated?: boolean;
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
  children?: React.ReactNode;
}

// Individual tab button component
interface TabButtonProps {
  tab: TabItem;
  isActive: boolean;
  onClick: () => void;
  variant: TabsProps['variant'];
  size: TabsProps['size'];
  isFirst: boolean;
  isLast: boolean;
}

function TabButton({
  tab,
  isActive,
  onClick,
  variant,
  size,
  isFirst,
  isLast,
}: TabButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'pills':
        return isActive
          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100';
      
      case 'underline':
        return isActive
          ? 'text-orange-500 border-b-2 border-orange-500'
          : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent';
      
      case 'boxed':
        return `${isActive 
          ? 'bg-white text-gray-900 shadow-sm border-gray-200' 
          : 'text-gray-600 hover:text-gray-900 border-transparent'
        } border ${isFirst ? 'rounded-l-lg' : ''} ${isLast ? 'rounded-r-lg' : '-ml-px'}`;
      
      case 'vertical':
        return isActive
          ? 'bg-orange-50 text-orange-600 border-l-2 border-orange-500'
          : 'text-gray-600 hover:bg-gray-50 border-l-2 border-transparent';
      
      default:
        return isActive
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-600 hover:bg-gray-50';
    }
  };
  
  return (
    <button
      onClick={onClick}
      disabled={tab.disabled}
      className={`
        relative flex items-center gap-2 font-medium transition-all
        ${sizeClasses[size || 'md']}
        ${getVariantClasses()}
        ${variant === 'pills' ? 'rounded-full' : variant === 'vertical' ? 'w-full text-left' : 'rounded-lg'}
        ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      role="tab"
      aria-selected={isActive}
      aria-disabled={tab.disabled}
    >
      {/* Icon */}
      {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
      
      {/* Label */}
      <span>{tab.label}</span>
      
      {/* Badge */}
      {tab.badge !== undefined && (
        <span className={`
          ml-1 px-1.5 py-0.5 text-xs font-medium rounded-full
          ${isActive 
            ? variant === 'pills' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'
            : 'bg-gray-100 text-gray-600'
          }
        `}>
          {tab.badge}
        </span>
      )}
      
      {/* Active indicator for default variant */}
      {variant === 'default' && isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gray-100 rounded-lg -z-10"
          transition={{ type: 'spring', duration: 0.3 }}
        />
      )}
    </button>
  );
}

// Tab panel component
interface TabPanelProps {
  tabId: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ tabId, children, className = '' }: TabPanelProps) {
  const { activeTab } = useTabsContext();
  
  if (activeTab !== tabId) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      role="tabpanel"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Tab list component (for custom tab rendering)
interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className = '' }: TabListProps) {
  return (
    <div role="tablist" className={className}>
      {children}
    </div>
  );
}

// Main Tabs component
export default function Tabs({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  animated = true,
  className = '',
  tabsClassName = '',
  contentClassName = '',
  children,
}: TabsProps) {
  // Internal state for uncontrolled mode
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id || ''
  );
  
  // Use controlled or internal state
  const activeTab = controlledActiveTab ?? internalActiveTab;
  
  // Handle tab change
  const handleTabChange = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.disabled) return;
    
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  }, [tabs, controlledActiveTab, onTabChange]);
  
  // Get current tab content
  const currentTab = tabs.find(t => t.id === activeTab);
  
  // Context value
  const contextValue: TabsContextType = {
    activeTab,
    setActiveTab: handleTabChange,
  };
  
  // Tab list classes based on variant
  const getTabListClasses = () => {
    const baseClasses = 'flex';
    
    switch (variant) {
      case 'pills':
        return `${baseClasses} gap-2 p-1 bg-gray-100 rounded-full ${fullWidth ? 'w-full' : 'w-fit'}`;
      
      case 'underline':
        return `${baseClasses} gap-4 border-b border-gray-200 ${fullWidth ? 'w-full' : ''}`;
      
      case 'boxed':
        return `${baseClasses} ${fullWidth ? 'w-full' : 'w-fit'}`;
      
      case 'vertical':
        return `flex-col gap-1 ${fullWidth ? 'w-full' : 'w-48'}`;
      
      default:
        return `${baseClasses} gap-1 p-1 bg-gray-50 rounded-xl ${fullWidth ? 'w-full' : 'w-fit'}`;
    }
  };
  
  return (
    <TabsContext.Provider value={contextValue}>
      <div className={`${variant === 'vertical' ? 'flex gap-6' : ''} ${className}`}>
        {/* Tab buttons */}
        <div
          role="tablist"
          className={`${getTabListClasses()} ${tabsClassName}`}
        >
          {tabs.map((tab, index) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
              variant={variant}
              size={size}
              isFirst={index === 0}
              isLast={index === tabs.length - 1}
            />
          ))}
        </div>
        
        {/* Tab content */}
        <div className={`${variant === 'vertical' ? 'flex-1' : 'mt-4'} ${contentClassName}`}>
          {children ? (
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              {currentTab?.content && (
                <motion.div
                  key={activeTab}
                  initial={animated ? { opacity: 0, y: 10 } : undefined}
                  animate={{ opacity: 1, y: 0 }}
                  exit={animated ? { opacity: 0, y: -10 } : undefined}
                  transition={{ duration: 0.2 }}
                  role="tabpanel"
                >
                  {currentTab.content}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </TabsContext.Provider>
  );
}

// Controlled tab trigger component
interface TabTriggerProps {
  tabId: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  disabled?: boolean;
}

export function TabTrigger({
  tabId,
  children,
  className = '',
  activeClassName = '',
  disabled = false,
}: TabTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === tabId;
  
  return (
    <button
      onClick={() => !disabled && setActiveTab(tabId)}
      disabled={disabled}
      className={`${className} ${isActive ? activeClassName : ''}`}
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

// Scrollable tabs component
interface ScrollableTabsProps extends TabsProps {
  scrollButtons?: boolean;
}

export function ScrollableTabs({
  scrollButtons = true,
  ...props
}: ScrollableTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  }, []);
  
  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };
  
  return (
    <div className="relative">
      {scrollButtons && canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="overflow-x-auto scrollbar-hide"
      >
        <Tabs {...props} />
      </div>
      
      {scrollButtons && canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Export types
export type { TabItem, TabsProps };
