// ============================================================================
// Analytics Service - Unified tracking for GA4, Mixpanel, and custom events
// ============================================================================

import { ANALYTICS_CONFIG } from '@/lib/config';

// ============================================================================
// Types
// ============================================================================

export interface UserProperties {
  userId?: string;
  email?: string;
  name?: string;
  role?: string;
  plan?: string;
  signupDate?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

export interface PageViewProperties {
  path: string;
  title?: string;
  referrer?: string;
  search?: string;
}

export interface TransactionProperties {
  transactionId: string;
  value: number;
  currency?: string;
  items?: Array<{
    itemId: string;
    itemName: string;
    price: number;
    quantity?: number;
    category?: string;
  }>;
}

// ============================================================================
// Analytics Class
// ============================================================================

class Analytics {
  private initialized = false;
  private userId: string | null = null;
  private userProperties: UserProperties = {};
  private queue: Array<() => void> = [];

  // ============================================================================
  // Initialization
  // ============================================================================

  /**
   * Initialize analytics providers
   */
  init(): void {
    if (this.initialized || typeof window === 'undefined') return;

    // Initialize Google Analytics 4
    if (ANALYTICS_CONFIG.googleAnalyticsId) {
      this.initGA4();
    }

    // Initialize Mixpanel
    if (ANALYTICS_CONFIG.mixpanelToken) {
      this.initMixpanel();
    }

    // Initialize Sentry
    if (ANALYTICS_CONFIG.sentryDsn) {
      this.initSentry();
    }

    // Initialize Hotjar
    if (ANALYTICS_CONFIG.hotjarId) {
      this.initHotjar();
    }

    this.initialized = true;

    // Process queued events
    this.queue.forEach((fn) => fn());
    this.queue = [];
  }

  private initGA4(): void {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.googleAnalyticsId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', ANALYTICS_CONFIG.googleAnalyticsId, {
      send_page_view: false, // We'll manually track page views
    });
  }

  private initMixpanel(): void {
    // Mixpanel snippet (simplified)
    (function (c, a) {
      if (!a.__SV) {
        let i,
          h,
          p: string[],
          l: { _i: unknown[][]; init: (e: string, o: object, r?: string) => void };
        (window as unknown as { mixpanel: typeof l }).mixpanel = l = {
          _i: [],
          init: function (e: string, o: object, r?: string) {
            // Initialization logic placeholder
          },
        };
        // ... rest of Mixpanel init would go here
      }
    })(document, window.mixpanel || {});

    // Initialize with token
    if (window.mixpanel?.init) {
      window.mixpanel.init(ANALYTICS_CONFIG.mixpanelToken!, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: false,
        persistence: 'localStorage',
      });
    }
  }

  private initSentry(): void {
    // Sentry is typically initialized in _app.tsx or instrumentation.ts
    // This is a placeholder for additional Sentry configuration
  }

  private initHotjar(): void {
    (function (h: Window, o: Document, t: string, j: string) {
      (h as unknown as { hj?: unknown }).hj =
        (h as unknown as { hj: unknown }).hj ||
        function () {
          ((h as unknown as { hj: { q: unknown[] } }).hj.q =
            (h as unknown as { hj: { q: unknown[] } }).hj.q || []).push(arguments);
        };
      (h as unknown as { _hjSettings: { hjid: number; hjsv: number } })._hjSettings = {
        hjid: parseInt(ANALYTICS_CONFIG.hotjarId!, 10),
        hjsv: 6,
      };
      const a = o.getElementsByTagName('head')[0];
      const r = o.createElement('script');
      r.async = true;
      r.src = t + (h as unknown as { _hjSettings: { hjid: number; hjsv: number } })._hjSettings.hjid + j;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=6');
  }

  // ============================================================================
  // User Identification
  // ============================================================================

  /**
   * Identify a user across analytics platforms
   */
  identify(userId: string, properties?: UserProperties): void {
    this.userId = userId;
    this.userProperties = { ...this.userProperties, ...properties };

    const execute = () => {
      // GA4
      if (window.gtag) {
        window.gtag('config', ANALYTICS_CONFIG.googleAnalyticsId!, {
          user_id: userId,
        });
        if (properties) {
          window.gtag('set', 'user_properties', properties);
        }
      }

      // Mixpanel
      if (window.mixpanel) {
        window.mixpanel.identify(userId);
        if (properties) {
          window.mixpanel.people.set(properties);
        }
      }
    };

    if (this.initialized) {
      execute();
    } else {
      this.queue.push(execute);
    }
  }

  /**
   * Reset user identification (on logout)
   */
  reset(): void {
    this.userId = null;
    this.userProperties = {};

    if (window.mixpanel) {
      window.mixpanel.reset();
    }

    // GA4 doesn't have a direct reset, but we can clear user_id
    if (window.gtag) {
      window.gtag('config', ANALYTICS_CONFIG.googleAnalyticsId!, {
        user_id: null,
      });
    }
  }

  // ============================================================================
  // Page Views
  // ============================================================================

  /**
   * Track a page view
   */
  pageView(properties: PageViewProperties): void {
    const execute = () => {
      // GA4
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_path: properties.path,
          page_title: properties.title,
          page_referrer: properties.referrer,
        });
      }

      // Mixpanel
      if (window.mixpanel) {
        window.mixpanel.track('Page View', {
          path: properties.path,
          title: properties.title,
          referrer: properties.referrer,
          search: properties.search,
        });
      }
    };

    if (this.initialized) {
      execute();
    } else {
      this.queue.push(execute);
    }
  }

  // ============================================================================
  // Event Tracking
  // ============================================================================

  /**
   * Track a custom event
   */
  track(eventName: string, properties?: EventProperties): void {
    const execute = () => {
      // GA4
      if (window.gtag) {
        window.gtag('event', eventName, properties);
      }

      // Mixpanel
      if (window.mixpanel) {
        window.mixpanel.track(eventName, properties);
      }

      // Console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics]', eventName, properties);
      }
    };

    if (this.initialized) {
      execute();
    } else {
      this.queue.push(execute);
    }
  }

  // ============================================================================
  // E-commerce Tracking
  // ============================================================================

  /**
   * Track a purchase/transaction
   */
  trackPurchase(transaction: TransactionProperties): void {
    const execute = () => {
      // GA4 Enhanced E-commerce
      if (window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: transaction.transactionId,
          value: transaction.value,
          currency: transaction.currency || 'INR',
          items: transaction.items?.map((item) => ({
            item_id: item.itemId,
            item_name: item.itemName,
            price: item.price,
            quantity: item.quantity || 1,
            item_category: item.category,
          })),
        });
      }

      // Mixpanel
      if (window.mixpanel) {
        window.mixpanel.track('Purchase', {
          transactionId: transaction.transactionId,
          value: transaction.value,
          currency: transaction.currency || 'INR',
          items: transaction.items,
        });
        
        // Track revenue
        window.mixpanel.people.track_charge(transaction.value, {
          transactionId: transaction.transactionId,
        });
      }
    };

    if (this.initialized) {
      execute();
    } else {
      this.queue.push(execute);
    }
  }

  /**
   * Track subscription events
   */
  trackSubscription(
    action: 'subscribe' | 'upgrade' | 'downgrade' | 'cancel' | 'renew',
    properties: {
      planId: string;
      planName: string;
      value: number;
      interval?: 'monthly' | 'yearly';
      previousPlan?: string;
    }
  ): void {
    this.track(`subscription_${action}`, {
      plan_id: properties.planId,
      plan_name: properties.planName,
      value: properties.value,
      interval: properties.interval,
      previous_plan: properties.previousPlan,
    });
  }

  // ============================================================================
  // Property-Specific Events
  // ============================================================================

  /**
   * Track property view
   */
  trackPropertyView(property: {
    id: string;
    title: string;
    type: string;
    price: number;
    city: string;
    vastuScore?: number;
  }): void {
    this.track('property_view', {
      property_id: property.id,
      property_title: property.title,
      property_type: property.type,
      price: property.price,
      city: property.city,
      vastu_score: property.vastuScore,
    });
  }

  /**
   * Track property search
   */
  trackPropertySearch(filters: {
    query?: string;
    type?: string[];
    city?: string;
    priceMin?: number;
    priceMax?: number;
    bedrooms?: number[];
    resultsCount: number;
  }): void {
    this.track('property_search', {
      search_query: filters.query,
      property_types: filters.type?.join(','),
      city: filters.city,
      price_min: filters.priceMin,
      price_max: filters.priceMax,
      bedrooms: filters.bedrooms?.join(','),
      results_count: filters.resultsCount,
    });
  }

  /**
   * Track property inquiry
   */
  trackPropertyInquiry(property: {
    id: string;
    title: string;
    agentId?: string;
    inquiryType: 'general' | 'viewing' | 'offer';
  }): void {
    this.track('property_inquiry', {
      property_id: property.id,
      property_title: property.title,
      agent_id: property.agentId,
      inquiry_type: property.inquiryType,
    });
  }

  /**
   * Track favorite action
   */
  trackFavorite(
    action: 'add' | 'remove',
    property: { id: string; title: string; type: string }
  ): void {
    this.track(`favorite_${action}`, {
      property_id: property.id,
      property_title: property.title,
      property_type: property.type,
    });
  }

  /**
   * Track comparison
   */
  trackComparison(propertyIds: string[]): void {
    this.track('property_compare', {
      property_ids: propertyIds.join(','),
      properties_count: propertyIds.length,
    });
  }

  // ============================================================================
  // Authentication Events
  // ============================================================================

  /**
   * Track authentication events
   */
  trackAuth(
    action: 'signup' | 'login' | 'logout' | 'password_reset',
    method?: string
  ): void {
    this.track(`auth_${action}`, {
      method: method,
    });
  }

  // ============================================================================
  // Error Tracking
  // ============================================================================

  /**
   * Track an error
   */
  trackError(error: Error, context?: Record<string, unknown>): void {
    this.track('error', {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack?.substring(0, 500),
      ...context,
    });

    // Also send to Sentry if available
    if (typeof window !== 'undefined' && (window as unknown as { Sentry?: { captureException: (e: Error) => void } }).Sentry) {
      (window as unknown as { Sentry: { captureException: (e: Error) => void } }).Sentry.captureException(error);
    }
  }

  // ============================================================================
  // Timing Tracking
  // ============================================================================

  /**
   * Track timing metrics
   */
  trackTiming(category: string, variable: string, value: number, label?: string): void {
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: variable,
        value: Math.round(value),
        event_category: category,
        event_label: label,
      });
    }
  }

  /**
   * Start a timing measurement
   */
  startTiming(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.trackTiming('Performance', name, duration);
    };
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const analytics = new Analytics();

// ============================================================================
// React Hooks
// ============================================================================

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Hook to automatically track page views
 */
export function usePageTracking(): void {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      analytics.pageView({
        path: pathname,
        title: document.title,
        referrer: document.referrer,
        search: searchParams?.toString(),
      });
    }
  }, [pathname, searchParams]);
}

/**
 * Hook to track component mount timing
 */
export function useComponentTiming(componentName: string): void {
  useEffect(() => {
    const endTiming = analytics.startTiming(`${componentName}_mount`);
    return () => {
      endTiming();
    };
  }, [componentName]);
}

// ============================================================================
// Type Declarations for Global Objects
// ============================================================================

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    mixpanel?: {
      init: (token: string, config?: object) => void;
      track: (event: string, properties?: object) => void;
      identify: (userId: string) => void;
      reset: () => void;
      people: {
        set: (properties: object) => void;
        track_charge: (amount: number, properties?: object) => void;
      };
    };
  }
}

export default analytics;
