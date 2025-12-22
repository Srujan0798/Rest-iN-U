'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

// Breadcrumb item interface
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

// Component props
interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  homeLabel?: string;
  homeHref?: string;
  maxItems?: number;
  className?: string;
  autoGenerate?: boolean;
}

// Path segment to readable label mapping
const pathLabels: Record<string, string> = {
  properties: 'Properties',
  property: 'Property',
  agents: 'Agents',
  agent: 'Agent',
  dashboard: 'Dashboard',
  favorites: 'Favorites',
  searches: 'Saved Searches',
  showings: 'Showings',
  offers: 'Offers',
  messages: 'Messages',
  documents: 'Documents',
  astrology: 'Astrology',
  analytics: 'Analytics',
  settings: 'Settings',
  subscription: 'Subscription',
  listings: 'Listings',
  leads: 'Leads',
  clients: 'Clients',
  'open-houses': 'Open Houses',
  search: 'Search',
  compare: 'Compare',
  checkout: 'Checkout',
  about: 'About Us',
  contact: 'Contact',
  faq: 'FAQ',
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  login: 'Login',
  register: 'Register',
  vastu: 'Vastu',
  consultation: 'Consultation',
  video: 'Video Call',
  signing: 'Document Signing',
};

// Default separator icon
const DefaultSeparator = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Home icon
const HomeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

// Convert path segment to readable label
const getLabel = (segment: string): string => {
  // Check custom labels
  if (pathLabels[segment.toLowerCase()]) {
    return pathLabels[segment.toLowerCase()];
  }
  
  // Check if it's an ID (UUID or numeric)
  if (/^[0-9a-f-]{36}$/i.test(segment) || /^\d+$/.test(segment)) {
    return 'Details';
  }
  
  // Convert kebab-case or snake_case to title case
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};

export default function Breadcrumbs({
  items: customItems,
  separator,
  showHome = true,
  homeLabel = 'Home',
  homeHref = '/',
  maxItems = 0, // 0 means show all
  className = '',
  autoGenerate = true,
}: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Auto-generate breadcrumb items from pathname
  const generatedItems = useMemo(() => {
    if (!autoGenerate || customItems) return [];
    
    const segments = pathname.split('/').filter(Boolean);
    let currentPath = '';
    
    return segments.map((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      return {
        label: getLabel(segment),
        href: isLast ? undefined : currentPath,
      };
    });
  }, [pathname, autoGenerate, customItems]);
  
  // Use custom items or generated items
  let items = customItems || generatedItems;
  
  // Add home if needed
  if (showHome) {
    items = [{ label: homeLabel, href: homeHref, icon: <HomeIcon /> }, ...items];
  }
  
  // Apply max items limit
  if (maxItems > 0 && items.length > maxItems) {
    const firstItem = items[0];
    const lastItems = items.slice(-( maxItems - 2));
    items = [
      firstItem,
      { label: '...', href: undefined },
      ...lastItems,
    ];
  }
  
  // Don't render if only home or empty
  if (items.length <= 1) {
    return null;
  }
  
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isEllipsis = item.label === '...';
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 flex-shrink-0">
                  {separator || <DefaultSeparator />}
                </span>
              )}
              
              {isEllipsis ? (
                <span className="text-gray-400 text-sm">...</span>
              ) : item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className={`flex items-center gap-1.5 text-sm ${
                  isLast ? 'text-gray-900 font-medium' : 'text-gray-500'
                }`}>
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Structured data component for SEO
export function BreadcrumbsStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://dharmarealty.in${item.href}` : undefined,
    })),
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Export types
export type { BreadcrumbItem, BreadcrumbsProps };
