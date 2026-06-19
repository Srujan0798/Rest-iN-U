'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { api } from '@/lib/api';
import { Button, Card, CardHeader, CardTitle, CardContent, EmptyState, Badge, Spinner } from '@/components/ui';

export default function AgentDashboardPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    const [listings, setListings] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated || user?.userType !== 'AGENT') {
            router.push('/login');
            return;
        }

        const fetchAgentData = async () => {
            setLoading(true);
            try {
                // Fetch stats dashboard
                const dashboardRes = await api.request<any>('/agent-crm/me/dashboard').catch(() => null);

                // Fetch leads
                const leadsRes = await api.request<any>('/leads/agent').catch(() => ({ data: { leads: [] } }));

                // Fetch listings
                let agentId = user?.agent?.id;
                let myProperties: any[] = [];
                if (agentId) {
                     const agentRes = await api.request<any>(`/agents/${agentId}`).catch(() => null);
                     if (agentRes?.data?.properties) {
                         myProperties = agentRes.data.properties;
                     }
                }

                setListings(myProperties);
                setLeads(leadsRes.data?.leads || []);
                setStats(dashboardRes?.data || {
                    activeListings: myProperties.length,
                    totalLeads: leadsRes.data?.leads?.length || 0,
                    newLeads: 0,
                    scheduledShowings: 0
                });

            } catch (error) {
                console.error('Error fetching agent data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgentData();
    }, [isAuthenticated, authLoading, user, router]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;

        setDeletingId(id);
        try {
            await api.request(`/properties/${id}`, { method: 'DELETE' });
            setListings(prev => prev.filter(p => p.id !== id));
            // Update stats
            setStats((prev: any) => ({
                ...prev,
                activeListings: (prev?.activeListings || 1) - 1
            }));
        } catch (error: any) {
            alert(`Failed to delete listing: ${error.message}`);
        } finally {
            setDeletingId(null);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated || user?.userType !== 'AGENT') {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-gray-900 text-white py-12 px-4 mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Agent Dashboard</h1>
                        <p className="text-gray-400">Manage your listings, leads, and performance.</p>
                    </div>
                    <div className="flex gap-4">
                         <Link href="/dashboard">
                            <Button variant="secondary" className="bg-transparent text-white border-gray-600 hover:bg-gray-800">
                                View User Dashboard
                            </Button>
                        </Link>
                        <Link href="/properties/create">
                            <Button variant="primary" icon={<span className="text-xl">+</span>}>
                                Create New Listing
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card padding="md">
                        <div className="text-3xl font-bold text-gray-900">{stats?.activeListings || 0}</div>
                        <div className="text-gray-500 text-sm">Active Listings</div>
                    </Card>
                    <Card padding="md">
                        <div className="text-3xl font-bold text-blue-600">{stats?.totalLeads || 0}</div>
                        <div className="text-gray-500 text-sm">Total Leads</div>
                    </Card>
                    <Card padding="md">
                        <div className="text-3xl font-bold text-green-600">{stats?.newLeads || 0}</div>
                        <div className="text-gray-500 text-sm">New Leads (30d)</div>
                    </Card>
                     <Card padding="md">
                        <div className="text-3xl font-bold text-purple-600">{stats?.scheduledShowings || 0}</div>
                        <div className="text-gray-500 text-sm">Scheduled Showings</div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Listings Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>My Listings</CardTitle>
                                <Link href="/properties/create" className="text-sm text-amber-600 font-medium hover:underline">
                                    + Add New
                                </Link>
                            </CardHeader>
                            <CardContent className="p-0">
                                {listings.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {listings.map((listing: any) => (
                                            <div key={listing.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition">
                                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                                     {listing.photos?.[0]?.url && (
                                                        <img src={listing.photos[0].url} alt="" className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 truncate">{listing.title}</h4>
                                                    <p className="text-sm text-gray-500">{listing.city}, {listing.state}</p>
                                                    <div className="mt-1 font-medium text-amber-600">
                                                        ${(listing.price / 1000).toFixed(0)}k
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="secondary" disabled={deletingId === listing.id}>Edit</Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDelete(listing.id)}
                                                        loading={deletingId === listing.id}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        icon="🏠"
                                        title="No listings yet"
                                        description="Create your first property listing to get started."
                                        action={{ label: 'Create Listing', href: '/properties/create' }}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Leads Column */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Leads</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {leads.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {leads.slice(0, 5).map((lead: any) => (
                                            <div key={lead.lead_id || lead.id} className="p-4 hover:bg-gray-50 transition">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h5 className="font-semibold text-gray-900">{lead.name}</h5>
                                                    <Badge variant={lead.status === 'NEW' ? 'success' : 'default'}>{lead.status}</Badge>
                                                </div>
                                                <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                                                {lead.message && (
                                                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 italic">"{lead.message}"</p>
                                                )}
                                                <div className="mt-3 flex justify-end">
                                                    <Button size="sm" variant="secondary" className="text-xs py-1 h-auto">Contact</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <p>No active leads.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
