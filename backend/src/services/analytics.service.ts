import { v4 as uuidv4 } from 'uuid';

// Analytics Service for Tracking and Reporting
class AnalyticsService {
    private events: AnalyticsEvent[] = [];
    private pageViews: PageView[] = [];

    // ============================================
    // EVENT TRACKING
    // ============================================

    async track(eventName: string, properties: Record<string, any>, userId?: string): Promise<void> {
        const event: AnalyticsEvent = {
            id: uuidv4(),
            name: eventName,
            properties,
            userId,
            timestamp: new Date(),
            sessionId: properties.sessionId
        };

        this.events.push(event);

        // In production, would send to analytics service (Segment, Mixpanel, etc.)
        console.log(`[ANALYTICS] ${eventName}:`, properties);

        // Keep only last 10000 events in memory
        if (this.events.length > 10000) {
            this.events = this.events.slice(-10000);
        }
    }

    // ============================================
    // PROPERTY TRACKING
    // ============================================

    async trackPropertyView(propertyId: string, userId?: string, source?: string): Promise<void> {
        await this.track('property_viewed', {
            propertyId,
            source: source || 'direct',
            viewedAt: new Date().toISOString()
        }, userId);
    }

    async trackPropertySearch(filters: any, resultCount: number, userId?: string): Promise<void> {
        await this.track('property_search', {
            filtersUsed: Object.keys(filters).length,
            hasVastuFilter: !!filters.vastuMinScore,
            hasClimateFilter: !!filters.climateRiskMax,
            locationType: filters.location?.type,
            resultCount
        }, userId);
    }

    async trackPropertyFavorite(propertyId: string, userId: string, action: 'add' | 'remove'): Promise<void> {
        await this.track('property_favorite', { propertyId, action }, userId);
    }

    async trackPropertyShare(propertyId: string, userId: string, platform: string): Promise<void> {
        await this.track('property_shared', { propertyId, platform }, userId);
    }

    async trackPropertyInquiry(propertyId: string, agentId: string, userId: string): Promise<void> {
        await this.track('property_inquiry', { propertyId, agentId }, userId);
    }

    // ============================================
    // USER TRACKING
    // ============================================

    async trackUserSignup(userId: string, method: string, referralSource?: string): Promise<void> {
        await this.track('user_signup', {
            method,
            referralSource,
            signupDate: new Date().toISOString()
        }, userId);
    }

    async trackUserLogin(userId: string, method: string): Promise<void> {
        await this.track('user_login', { method }, userId);
    }

    async trackPageView(page: string, userId?: string, referrer?: string): Promise<void> {
        const pageView: PageView = {
            id: uuidv4(),
            page,
            userId,
            referrer,
            timestamp: new Date()
        };

        this.pageViews.push(pageView);

        await this.track('page_view', { page, referrer }, userId);
    }

    // ============================================
    // AGENT TRACKING
    // ============================================

    async trackAgentListingCreated(agentId: string, propertyId: string): Promise<void> {
        await this.track('agent_listing_created', { propertyId }, agentId);
    }

    async trackAgentLeadReceived(agentId: string, leadId: string, propertyId: string): Promise<void> {
        await this.track('agent_lead_received', { leadId, propertyId }, agentId);
    }

    async trackAgentLeadConverted(agentId: string, leadId: string, conversionType: string): Promise<void> {
        await this.track('agent_lead_converted', { leadId, conversionType }, agentId);
    }

    // ============================================
    // CONVERSION TRACKING
    // ============================================

    async trackConversion(type: string, value: number, userId: string, metadata?: Record<string, any>): Promise<void> {
        await this.track('conversion', {
            type,
            value,
            currency: 'USD',
            ...metadata
        }, userId);
    }

    // ============================================
    // REPORTS
    // ============================================

    async getDailyMetrics(date: Date): Promise<DailyMetrics> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const dayEvents = this.events.filter(e =>
            e.timestamp >= startOfDay && e.timestamp <= endOfDay
        );

        const dayPageViews = this.pageViews.filter(p =>
            p.timestamp >= startOfDay && p.timestamp <= endOfDay
        );

        return {
            date: date.toISOString().split('T')[0],
            totalEvents: dayEvents.length,
            uniqueUsers: new Set(dayEvents.filter(e => e.userId).map(e => e.userId)).size,
            pageViews: dayPageViews.length,
            propertyViews: dayEvents.filter(e => e.name === 'property_viewed').length,
            searches: dayEvents.filter(e => e.name === 'property_search').length,
            signups: dayEvents.filter(e => e.name === 'user_signup').length,
            inquiries: dayEvents.filter(e => e.name === 'property_inquiry').length,
            conversions: dayEvents.filter(e => e.name === 'conversion').length
        };
    }

    async getPropertyAnalytics(propertyId: string, days: number = 30): Promise<PropertyAnalytics> {
        const since = new Date();
        since.setDate(since.getDate() - days);

        const propertyEvents = this.events.filter(e =>
            e.properties.propertyId === propertyId && e.timestamp >= since
        );

        return {
            propertyId,
            period: `${days} days`,
            totalViews: propertyEvents.filter(e => e.name === 'property_viewed').length,
            uniqueViewers: new Set(propertyEvents.filter(e => e.name === 'property_viewed' && e.userId).map(e => e.userId)).size,
            favorites: propertyEvents.filter(e => e.name === 'property_favorite' && e.properties.action === 'add').length,
            shares: propertyEvents.filter(e => e.name === 'property_shared').length,
            inquiries: propertyEvents.filter(e => e.name === 'property_inquiry').length,
            avgTimeOnPage: 0, // Would calculate from session data
            viewsBySource: this.groupByProperty(propertyEvents.filter(e => e.name === 'property_viewed'), 'source')
        };
    }

    async getAgentPerformance(agentId: string, days: number = 30): Promise<AgentPerformance> {
        const since = new Date();
        since.setDate(since.getDate() - days);

        const agentEvents = this.events.filter(e =>
            e.userId === agentId && e.timestamp >= since
        );

        return {
            agentId,
            period: `${days} days`,
            listingsCreated: agentEvents.filter(e => e.name === 'agent_listing_created').length,
            leadsReceived: agentEvents.filter(e => e.name === 'agent_lead_received').length,
            leadsConverted: agentEvents.filter(e => e.name === 'agent_lead_converted').length,
            conversionRate: 0, // Would calculate
            totalPropertyViews: 0, // Would aggregate
            responseTime: '< 1 hour' // Would calculate
        };
    }

    async getSearchTrends(days: number = 7): Promise<SearchTrend[]> {
        const since = new Date();
        since.setDate(since.getDate() - days);

        const searchEvents = this.events.filter(e =>
            e.name === 'property_search' && e.timestamp >= since
        );

        // Group and count by location
        const locationCounts: Record<string, number> = {};
        searchEvents.forEach(e => {
            const location = e.properties.locationType || 'unknown';
            locationCounts[location] = (locationCounts[location] || 0) + 1;
        });

        return Object.entries(locationCounts)
            .map(([location, count]) => ({ location, count }))
            .sort((a, b) => b.count - a.count);
    }

    async getMarketInsights(): Promise<MarketInsights> {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const recentSearches = this.events.filter(e =>
            e.name === 'property_search' && e.timestamp >= last30Days
        );

        return {
            totalSearches: recentSearches.length,
            avgResultCount: this.average(recentSearches.map(e => e.properties.resultCount || 0)),
            vastuSearchPercent: (recentSearches.filter(e => e.properties.hasVastuFilter).length / recentSearches.length * 100) || 0,
            climateSearchPercent: (recentSearches.filter(e => e.properties.hasClimateFilter).length / recentSearches.length * 100) || 0,
            topLocations: this.getTopN(recentSearches.map(e => e.properties.locationType), 5),
            peakHours: [10, 14, 19], // Would calculate
            trendingFeatures: ['pool', 'solar', 'smart-home'] // Would calculate
        };
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private groupByProperty(events: AnalyticsEvent[], property: string): Record<string, number> {
        const result: Record<string, number> = {};
        events.forEach(e => {
            const key = e.properties[property] || 'unknown';
            result[key] = (result[key] || 0) + 1;
        });
        return result;
    }

    private average(numbers: number[]): number {
        if (numbers.length === 0) return 0;
        return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }

    private getTopN(items: string[], n: number): string[] {
        const counts: Record<string, number> = {};
        items.forEach(item => {
            if (item) counts[item] = (counts[item] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, n)
            .map(([item]) => item);
    }

    // ============================================
    // EXPORT
    // ============================================

    async exportEvents(startDate: Date, endDate: Date): Promise<AnalyticsEvent[]> {
        return this.events.filter(e =>
            e.timestamp >= startDate && e.timestamp <= endDate
        );
    }
}

// Types
interface AnalyticsEvent {
    id: string;
    name: string;
    properties: Record<string, any>;
    userId?: string;
    timestamp: Date;
    sessionId?: string;
}

interface PageView {
    id: string;
    page: string;
    userId?: string;
    referrer?: string;
    timestamp: Date;
}

interface DailyMetrics {
    date: string;
    totalEvents: number;
    uniqueUsers: number;
    pageViews: number;
    propertyViews: number;
    searches: number;
    signups: number;
    inquiries: number;
    conversions: number;
}

interface PropertyAnalytics {
    propertyId: string;
    period: string;
    totalViews: number;
    uniqueViewers: number;
    favorites: number;
    shares: number;
    inquiries: number;
    avgTimeOnPage: number;
    viewsBySource: Record<string, number>;
}

interface AgentPerformance {
    agentId: string;
    period: string;
    listingsCreated: number;
    leadsReceived: number;
    leadsConverted: number;
    conversionRate: number;
    totalPropertyViews: number;
    responseTime: string;
}

interface SearchTrend {
    location: string;
    count: number;
}

interface MarketInsights {
    totalSearches: number;
    avgResultCount: number;
    vastuSearchPercent: number;
    climateSearchPercent: number;
    topLocations: string[];
    peakHours: number[];
    trendingFeatures: string[];
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default AnalyticsService;
