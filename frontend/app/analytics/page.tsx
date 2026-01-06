'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { MetricCard } from '@/components/MetricCard';
import { TrendingUp, Users, Home, DollarSign } from 'lucide-react';

interface AnalyticsMetrics {
    totalProperties: number;
    activeListings: number;
    totalViews: number;
    totalFavorites: number;
    conversionRate: number;
    avgTimeToClose: number;
    totalRevenue: number;
    activeUsers: number;
}

export default function AnalyticsPage() {
    const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('/api/analytics/overview');
            const data = await response.json();
            setMetrics(data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading analytics...</div>;
    }

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Track your platform performance and insights
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Properties"
                    value={metrics?.totalProperties || 0}
                    icon={<Home className="h-4 w-4" />}
                    trend="+12%"
                    trendUp={true}
                />
                <MetricCard
                    title="Active Users"
                    value={metrics?.activeUsers || 0}
                    icon={<Users className="h-4 w-4" />}
                    trend="+8%"
                    trendUp={true}
                />
                <MetricCard
                    title="Total Revenue"
                    value={`₹${(metrics?.totalRevenue || 0).toLocaleString()}`}
                    icon={<DollarSign className="h-4 w-4" />}
                    trend="+23%"
                    trendUp={true}
                />
                <MetricCard
                    title="Conversion Rate"
                    value={`${(metrics?.conversionRate || 0).toFixed(1)}%`}
                    icon={<TrendingUp className="h-4 w-4" />}
                    trend="-2%"
                    trendUp={false}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Property Views Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LineChart
                            data={[
                                { month: 'Jan', views: 4000 },
                                { month: 'Feb', views: 3000 },
                                { month: 'Mar', views: 5000 },
                                { month: 'Apr', views: 4500 },
                                { month: 'May', views: 6000 },
                                { month: 'Jun', views: 5500 },
                            ]}
                            xKey="month"
                            yKey="views"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Properties</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BarChart
                            data={[
                                { name: 'Property A', views: 890 },
                                { name: 'Property B', views: 756 },
                                { name: 'Property C', views: 645 },
                                { name: 'Property D', views: 534 },
                                { name: 'Property E', views: 423 },
                            ]}
                            xKey="name"
                            yKey="views"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Additional Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Active Listings</p>
                            <p className="text-2xl font-bold">{metrics?.activeListings || 0}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Views</p>
                            <p className="text-2xl font-bold">{(metrics?.totalViews || 0).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Avg. Time to Close</p>
                            <p className="text-2xl font-bold">{metrics?.avgTimeToClose || 0} days</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
