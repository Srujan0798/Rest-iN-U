'use client';

import { useState, useCallback, createContext, useContext, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Accordion item interface
interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

// Context for accordion state
interface AccordionContextType {
  expandedItems: string[];
  toggleItem: (id: string) => void;
  variant: AccordionProps['variant'];
  size: AccordionProps['size'];
}

const AccordionContext = createContext<AccordionContextType | null>(null);

// Hook to access accordion context
export function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion component');
  }
  return context;
}

// Component props
interface AccordionProps {
  items?: AccordionItemData[];
  defaultExpanded?: string[];
  allowMultiple?: boolean;
  variant?: 'default' | 'bordered' | 'separated' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  iconPosition?: 'left' | 'right';
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Accordion item component
interface AccordionItemProps {
  item?: AccordionItemData;
  id?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  className?: string;
}

export function AccordionItem({
  item,
  id: propId,
  title: propTitle,
  children,
  icon: propIcon,
  badge: propBadge,
  disabled: propDisabled,
  className = '',
}: AccordionItemProps) {
  const generatedId = useId();
  const { expandedItems, toggleItem, variant, size } = useAccordionContext();
  
  // Use item props or individual props
  const id = item?.id || propId || generatedId;
  const title = item?.title || propTitle;
  const content = item?.content || children;
  const icon = item?.icon || propIcon;
  const badge = item?.badge || propBadge;
  const disabled = item?.disabled || propDisabled || false;
  
  const isExpanded = expandedItems.includes(id);
  
  // Size classes
  const sizeClasses = {
    sm: { padding: 'px-3 py-2', text: 'text-sm', gap: 'gap-2' },
    md: { padding: 'px-4 py-3', text: 'text-base', gap: 'gap-3' },
    lg: { padding: 'px-5 py-4', text: 'text-lg', gap: 'gap-4' },
  };
  
  // Variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'bordered':
        return 'border border-gray-200 rounded-lg mb-2 last:mb-0 overflow-hidden';
      case 'separated':
        return 'bg-white rounded-lg shadow-sm mb-3 last:mb-0 overflow-hidden';
      case 'ghost':
        return 'border-b border-gray-100 last:border-b-0';
      default:
        return 'border-b border-gray-200 last:border-b-0';
    }
  };
  
  const handleClick = () => {
    if (!disabled) {
      toggleItem(id);
    }
  };
  
  return (
    <div className={`${getVariantClasses()} ${className}`}>
      {/* Header */}
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between ${sizeClasses[size || 'md'].padding}
          ${sizeClasses[size || 'md'].text} font-medium text-left
          ${disabled 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-900 hover:bg-gray-50'
          }
          transition-colors
        `}
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${id}`}
      >
        <div className={`flex items-center ${sizeClasses[size || 'md'].gap}`}>
          {/* Icon */}
          {icon && <span className="flex-shrink-0 text-gray-500">{icon}</span>}
          
          {/* Title */}
          <span>{title}</span>
          
          {/* Badge */}
          {badge !== undefined && (
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              {badge}
            </span>
          )}
        </div>
        
        {/* Expand/Collapse icon */}
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-gray-400"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </button>
      
      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`accordion-content-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`${sizeClasses[size || 'md'].padding} pt-0 text-gray-600`}>
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Accordion trigger component (for custom headers)
interface AccordionTriggerProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function AccordionTrigger({
  id,
  children,
  className = '',
  disabled = false,
}: AccordionTriggerProps) {
  const { expandedItems, toggleItem } = useAccordionContext();
  const isExpanded = expandedItems.includes(id);
  
  return (
    <button
      onClick={() => !disabled && toggleItem(id)}
      disabled={disabled}
      className={className}
      aria-expanded={isExpanded}
      aria-controls={`accordion-content-${id}`}
    >
      {children}
    </button>
  );
}

// Accordion content component (for custom content)
interface AccordionContentProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function AccordionContent({
  id,
  children,
  className = '',
}: AccordionContentProps) {
  const { expandedItems } = useAccordionContext();
  const isExpanded = expandedItems.includes(id);
  
  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          id={`accordion-content-${id}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={`overflow-hidden ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main Accordion component
export default function Accordion({
  items,
  defaultExpanded = [],
  allowMultiple = false,
  variant = 'default',
  size = 'md',
  iconPosition = 'right',
  animated = true,
  className = '',
  children,
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);
  
  // Toggle item expansion
  const toggleItem = useCallback((id: string) => {
    setExpandedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      
      if (allowMultiple) {
        return [...prev, id];
      }
      
      return [id];
    });
  }, [allowMultiple]);
  
  // Context value
  const contextValue: AccordionContextType = {
    expandedItems,
    toggleItem,
    variant,
    size,
  };
  
  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={className}>
        {/* Render from items prop */}
        {items?.map(item => (
          <AccordionItem key={item.id} item={item} />
        ))}
        
        {/* Render children */}
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// FAQ Accordion variant - specialized for FAQ pages
interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  searchable?: boolean;
  grouped?: boolean;
  className?: string;
}

export function FAQAccordion({
  items,
  searchable = false,
  grouped = false,
  className = '',
}: FAQAccordionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group items by category if needed
  const groupedItems = grouped
    ? filteredItems.reduce((acc, item) => {
        const category = item.category || 'General';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
      }, {} as Record<string, FAQItem[]>)
    : { '': filteredItems };
  
  const toggleItem = (question: string) => {
    setExpandedItems(prev =>
      prev.includes(question)
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };
  
  return (
    <div className={className}>
      {/* Search */}
      {searchable && (
        <div className="mb-6">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>
          
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-500">
              {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
      )}
      
      {/* FAQ items */}
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className={category ? 'mb-8' : ''}>
          {category && (
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
          )}
          
          <div className="space-y-3">
            {categoryItems.map((item, index) => {
              const isExpanded = expandedItems.includes(item.question);
              
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(item.question)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 pr-4">
                      {item.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.span>
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 text-gray-600 border-t border-gray-100 pt-4">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Empty state */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-500">No FAQs match your search</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 text-orange-500 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}

// Export types
export type { AccordionItemData, AccordionProps, FAQItem };
