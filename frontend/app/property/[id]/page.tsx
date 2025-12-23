'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { VastuScore, ClimateRiskBadge, AuspiciousDateCard } from '../../../components/PropertyComponents';
import { JyotishChart } from '../../../components/JyotishChart';
import { PuranicAnalysis } from '../../../components/PuranicAnalysis';
import { AyurvedicDosha } from '../../../components/AyurvedicDosha';
import api from '../../../lib/api';

export default function PropertyDetailPage() {
    const params = useParams();
    const propertyId = params?.id as string;

    const [property, setProperty] = useState<any>(null);
    const [vastu, setVastu] = useState<any>(null);
    const [climate, setClimate] = useState<any>(null);
    const [jyotish, setJyotish] = useState<any>(null);
    const [puranic, setPuranic] = useState<any>(null);
    const [ayurveda, setAyurveda] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [showInquiry, setShowInquiry] = useState(false);

    useEffect(() => {
        if (!propertyId) return;

        Promise.all([
            api.getProperty(propertyId),
            api.getVastuAnalysis(propertyId).catch(() => null),
            api.getClimateAnalysis(propertyId).catch(() => null),
            api.getJyotishAnalysis(propertyId).catch(() => null),
            api.getPuranicAnalysis(propertyId).catch(() => null),
            api.getAyurvedicAnalysis(propertyId).catch(() => null),
        ]).then(([propRes, vastuRes, climateRes, jyotishRes, puranicRes, ayurvedaRes]) => {
            setProperty(propRes.data);
            setVastu(vastuRes?.data);
            setClimate(climateRes?.data);
            setJyotish(jyotishRes?.data);
            setPuranic(puranicRes?.data);
            setAyurveda(ayurvedaRes?.data);
            setLoading(false);
        });
    }, [propertyId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🏠</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h2>
                    <Link href="/search" className="text-amber-600 hover:underline">Back to Search</Link>
                </div>
            </div>
        );
    }

    const formatPrice = (price: number) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(price);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '🏠' },
        { id: 'vastu', label: 'Vastu', icon: '🪷' },
        { id: 'jyotish', label: 'Jyotish', icon: '✨' },
        { id: 'puranic', label: 'Puranic', icon: '📜' },
        { id: 'ayurveda', label: 'Ayurveda', icon: '🌿' },
        { id: 'climate', label: 'Climate', icon: '🌍' },
        { id: 'energy', label: 'Energy', icon: '⚡' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Image */}
            <div className="relative h-[50vh] min-h-[400px]">
                <img
                    src={property.photos?.[0]?.url || '/placeholder-property.jpg'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {vastu && (
                        <div className="bg-white/90 backdrop-blur rounded-xl p-2 shadow-lg">
                            <VastuScore score={vastu.overallScore} grade={vastu.grade} size="sm" showLabel={false} />
                        </div>
                    )}
                    {climate && <ClimateRiskBadge riskScore={climate.overallRiskScore} riskGrade={climate.riskGrade} />}
                </div>

                {/* Price */}
                <div className="absolute bottom-4 left-4">
                    <div className="text-4xl font-bold text-white mb-1">{formatPrice(property.price)}</div>
                    <div className="text-white/80">{property.streetAddress}, {property.city}, {property.state}</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="grid grid-cols-4 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                                    <div className="text-sm text-gray-500">Bedrooms</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                                    <div className="text-sm text-gray-500">Bathrooms</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{property.squareFeet?.toLocaleString()}</div>
                                    <div className="text-sm text-gray-500">Sq Ft</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{property.yearBuilt || '-'}</div>
                                    <div className="text-sm text-gray-500">Year Built</div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="flex border-b">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-4 text-center font-medium transition ${activeTab === tab.id
                                            ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <span className="mr-1">{tab.icon}</span> {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3">Description</h3>
                                            <p className="text-gray-600 leading-relaxed">{property.description}</p>
                                        </div>
                                        {property.features?.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3">Features</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {property.features.map((f: string) => (
                                                        <span key={f} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                                                            {f}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'vastu' && vastu && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6">
                                            <VastuScore score={vastu.overallScore} grade={vastu.grade} size="lg" />
                                            <div>
                                                <h3 className="text-xl font-semibold">Vastu Shastra Analysis</h3>
                                                <p className="text-gray-500">Based on 5,000-year-old Vedic principles</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { dir: 'NE', score: vastu.northEastScore, label: 'Ishanya' },
                                                { dir: 'E', score: vastu.eastScore, label: 'Purva' },
                                                { dir: 'SE', score: vastu.southEastScore, label: 'Agneya' },
                                                { dir: 'N', score: vastu.northScore, label: 'Uttara' },
                                                { dir: '⬤', score: vastu.centerScore, label: 'Brahmasthana' },
                                                { dir: 'S', score: vastu.southScore, label: 'Dakshina' },
                                                { dir: 'NW', score: vastu.northWestScore, label: 'Vayavya' },
                                                { dir: 'W', score: vastu.westScore, label: 'Paschima' },
                                                { dir: 'SW', score: vastu.southWestScore, label: 'Nairutya' },
                                            ].map(d => (
                                                <div key={d.dir} className={`p-3 rounded-lg text-center ${d.score >= 80 ? 'bg-green-50' : d.score >= 60 ? 'bg-yellow-50' : 'bg-red-50'
                                                    }`}>
                                                    <div className="font-bold text-lg">{d.dir}</div>
                                                    <div className="text-sm text-gray-500">{d.label}</div>
                                                    <div className={`font-semibold ${d.score >= 80 ? 'text-green-600' : d.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                                                        }`}>{d.score}%</div>
                                                </div>
                                            ))}
                                        </div>

                                        {vastu.defects?.length > 0 && (
                                            <div className="bg-red-50 rounded-lg p-4">
                                                <h4 className="font-semibold text-red-800 mb-2">Vastu Defects</h4>
                                                <ul className="space-y-1 text-red-700 text-sm">
                                                    {vastu.defects.slice(0, 5).map((d: any, i: number) => (
                                                        <li key={i}>• {d.description}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'jyotish' && jyotish && (
                                    <JyotishChart analysis={jyotish} />
                                )}

                                {activeTab === 'puranic' && puranic && (
                                    <PuranicAnalysis analysis={puranic} />
                                )}

                                {activeTab === 'ayurveda' && ayurveda && (
                                    <AyurvedicDosha analysis={ayurveda} />
                                )}

                                {activeTab === 'climate' && climate && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-semibold">Climate Risk Analysis</h3>
                                                <p className="text-gray-500">100-year projections</p>
                                            </div>
                                            <div className={`text-4xl font-bold ${climate.overallRiskScore <= 30 ? 'text-green-600' :
                                                climate.overallRiskScore <= 60 ? 'text-yellow-600' : 'text-red-600'
                                                }`}>
                                                {climate.riskGrade}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { label: 'Flood Risk', value: climate.floodRisk2050, icon: '🌊' },
                                                { label: 'Wildfire', value: climate.wildfireRisk, icon: '🔥' },
                                                { label: 'Hurricane', value: climate.hurricaneRisk, icon: '🌀' },
                                                { label: 'Seismic', value: climate.seismicRisk, icon: '⚠️' },
                                            ].map(r => (
                                                <div key={r.label} className="bg-gray-50 rounded-lg p-4 text-center">
                                                    <div className="text-2xl mb-1">{r.icon}</div>
                                                    <div className="font-semibold">{r.value}%</div>
                                                    <div className="text-xs text-gray-500">{r.label}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-blue-800 mb-2">Insurance Projection</h4>
                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                <div>
                                                    <div className="text-lg font-bold text-blue-700">${climate.insuranceCurrent?.toLocaleString()}</div>
                                                    <div className="text-xs text-blue-600">Current/year</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold text-blue-700">${climate.insurance2030?.toLocaleString()}</div>
                                                    <div className="text-xs text-blue-600">2030 est.</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold text-blue-700">${climate.insurance2050?.toLocaleString()}</div>
                                                    <div className="text-xs text-blue-600">2050 est.</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'energy' && (
                                    <div className="text-center py-8 text-gray-500">
                                        <div className="text-4xl mb-3">⚡</div>
                                        <p>Energy analysis requires IoT sensors</p>
                                        <Link href={`/iot-dashboard/${propertyId}`} className="text-amber-600 hover:underline">
                                            View IoT Dashboard →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Agent & Actions */}
                    <div className="space-y-6">
                        {/* Agent Card */}
                        {property.listingAgent && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold">
                                        {property.listingAgent.user?.firstName?.[0] || 'A'}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {property.listingAgent.user?.firstName} {property.listingAgent.user?.lastName}
                                        </div>
                                        <div className="text-sm text-gray-500">{property.listingAgent.brokerage}</div>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            {'★'.repeat(Math.round(property.listingAgent.rating || 0))}
                                            <span className="text-gray-500 text-sm ml-1">({property.listingAgent.reviewCount})</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowInquiry(true)}
                                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition"
                                >
                                    Contact Agent
                                </button>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
                            <Link
                                href={`/blockchain?property=${propertyId}`}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                            >
                                <span className="text-2xl">🔗</span>
                                <div>
                                    <div className="font-medium">Blockchain Verified</div>
                                    <div className="text-sm text-gray-500">View on-chain records</div>
                                </div>
                            </Link>
                            <Link
                                href={`/muhurat?property=${propertyId}`}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                            >
                                <span className="text-2xl">📅</span>
                                <div>
                                    <div className="font-medium">Auspicious Timing</div>
                                    <div className="text-sm text-gray-500">Find best dates</div>
                                </div>
                            </Link>
                            <Link
                                href={`/valuation?property=${propertyId}`}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                            >
                                <span className="text-2xl">💰</span>
                                <div>
                                    <div className="font-medium">AI Valuation</div>
                                    <div className="text-sm text-gray-500">Get price estimate</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inquiry Modal */}
            {showInquiry && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4">Contact Agent</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const data = {
                                name: formData.get('name') as string,
                                email: formData.get('email') as string,
                                phone: formData.get('phone') as string,
                                message: formData.get('message') as string,
                            };

                            api.submitInquiry(propertyId, data)
                                .then(() => {
                                    alert('Inquiry sent successfully!');
                                    setShowInquiry(false);
                                })
                                .catch((err) => alert(err.message));
                        }} className="space-y-4">
                            <input name="name" required type="text" placeholder="Your Name" className="w-full px-4 py-3 border rounded-lg" />
                            <input name="email" required type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-lg" />
                            <input name="phone" type="tel" placeholder="Phone (optional)" className="w-full px-4 py-3 border rounded-lg" />
                            <textarea name="message" required placeholder="Message" rows={3} className="w-full px-4 py-3 border rounded-lg" />
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowInquiry(false)} className="flex-1 py-3 border rounded-lg">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 bg-amber-500 text-white rounded-lg font-semibold">
                                    Send Inquiry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
