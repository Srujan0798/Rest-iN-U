'use client';
import { useState } from 'react';
import { Box, RotateCcw, Armchair, Hammer, PlayCircle, Maximize, Info } from 'lucide-react';

export default function VRARToursPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [style, setStyle] = useState('modern');

    const vrTours = [
        { id: 1, address: '123 Main St', rooms: 8, views: 256, status: 'ready' },
        { id: 2, address: '456 Oak Ave', rooms: 6, views: 189, status: 'ready' },
        { id: 3, address: '789 Pine Rd', rooms: 10, views: 412, status: 'processing' }
    ];

    const stagingStyles = [
        { id: 'modern', name: 'Modern Contemporary' },
        { id: 'scandinavian', name: 'Scandinavian' },
        { id: 'traditional', name: 'Traditional' },
        { id: 'minimalist', name: 'Minimalist' },
        { id: 'industrial', name: 'Industrial' },
        { id: 'bohemian', name: 'Bohemian' }
    ];

    const arFurniture = [
        { id: 'sofa-01', name: 'Modern L-Sofa', price: 1299, brand: 'IKEA' },
        { id: 'table-01', name: 'Coffee Table', price: 449, brand: 'CB2' },
        { id: 'bed-01', name: 'King Platform Bed', price: 899, brand: 'Article' },
        { id: 'chair-01', name: 'Accent Chair', price: 599, brand: 'West Elm' }
    ];

    const tabs = [
        { icon: RotateCcw, label: '360° Virtual Tours' },
        { icon: Armchair, label: 'AR Furniture' },
        { icon: Box, label: 'Virtual Staging' },
        { icon: Hammer, label: 'Renovation Preview' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <Box className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">VR & AR Experience</h1>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Immersive 360° virtual tours, AR furniture preview, and AI-powered virtual staging
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTab(index)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === index
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="hidden md:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* 360° Virtual Tours Tab */}
                {activeTab === 0 && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Your Virtual Tours</h2>
                                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    <RotateCcw className="w-4 h-4" />
                                    Create New Tour
                                </button>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {vrTours.map(tour => (
                                    <div key={tour.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="h-44 bg-gray-100 flex items-center justify-center">
                                            <RotateCcw className="w-16 h-16 text-gray-300" />
                                        </div>
                                        <div className="p-4">
                                            <p className="font-semibold text-gray-900">{tour.address}</p>
                                            <div className="flex gap-2 my-2">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{tour.rooms} Rooms</span>
                                                <span className="px-2 py-1 border border-gray-300 text-gray-600 rounded-full text-xs">{tour.views} Views</span>
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                {tour.status === 'ready' ? (
                                                    <>
                                                        <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">
                                                            <PlayCircle className="w-4 h-4" /> View
                                                        </button>
                                                        <button className="flex items-center gap-1 border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-100">
                                                            <Maximize className="w-4 h-4" /> VR Mode
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Processing...</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 text-center">
                            <h3 className="font-semibold text-gray-900 mb-4">VR Headset Support</h3>
                            <div className="flex flex-wrap justify-center gap-2">
                                {['Meta Quest 3', 'HTC Vive', 'PlayStation VR', 'Apple Vision Pro'].map(headset => (
                                    <span key={headset} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        {headset}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* AR Furniture Tab */}
                {activeTab === 1 && (
                    <div className="space-y-6">
                        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-800">
                                Point your camera at any room to see how furniture would look in real-time using AR technology
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-md p-6 text-center">
                                <Box className="w-20 h-20 text-blue-600 mx-auto my-4" />
                                <h3 className="font-semibold text-gray-900 mb-2">AR Room Scanner</h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    Scan your room to get accurate dimensions and place furniture
                                </p>
                                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    Open AR Camera
                                </button>
                            </div>

                            <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Furniture Catalog</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {arFurniture.map(item => (
                                        <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="h-24 bg-gray-100 flex items-center justify-center">
                                                <Armchair className="w-10 h-10 text-gray-300" />
                                            </div>
                                            <div className="p-3">
                                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.brand}</p>
                                                <p className="text-sm font-semibold text-blue-600">${item.price}</p>
                                                <button className="w-full mt-2 text-xs text-blue-600 hover:bg-blue-50 py-1 rounded">
                                                    Place in AR
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Virtual Staging Tab */}
                {activeTab === 2 && (
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Virtual Staging</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Transform empty rooms into beautifully staged spaces with AI
                            </p>

                            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                                <div className="text-center">
                                    <Box className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Upload an empty room photo</p>
                                    <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                        Upload Image
                                    </button>
                                </div>
                            </div>

                            <select
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-4"
                            >
                                {stagingStyles.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>

                            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                Generate Staged Image
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Pricing</h3>
                            <div className="space-y-3">
                                {[
                                    { name: 'Per Image', price: 15, desc: 'Single room staging' },
                                    { name: '5 Images', price: 60, desc: 'Save 20%' },
                                    { name: '10 Images', price: 100, desc: 'Save 33%' },
                                    { name: 'Unlimited', price: 199, desc: 'Monthly subscription' }
                                ].map(plan => (
                                    <div key={plan.name} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-900">{plan.name}</p>
                                            <p className="text-xs text-gray-500">{plan.desc}</p>
                                        </div>
                                        <p className="text-lg font-semibold text-blue-600">${plan.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Renovation Preview Tab */}
                {activeTab === 3 && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Renovation Preview</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Visualize renovations before spending a dime with our AR renovation tool
                        </p>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { name: 'Kitchen Remodel', cost: '$25,000 - $75,000', roi: '70-80%' },
                                { name: 'Bathroom Update', cost: '$10,000 - $30,000', roi: '60-70%' },
                                { name: 'Flooring Upgrade', cost: '$3,000 - $15,000', roi: '70-80%' },
                                { name: 'Paint & Refresh', cost: '$1,000 - $5,000', roi: '100%+' }
                            ].map(reno => (
                                <div key={reno.name} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="h-36 bg-gray-100 flex items-center justify-center">
                                        <Hammer className="w-12 h-12 text-gray-300" />
                                    </div>
                                    <div className="p-4">
                                        <p className="font-semibold text-gray-900">{reno.name}</p>
                                        <p className="text-sm text-gray-500">{reno.cost}</p>
                                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                            ROI: {reno.roi}
                                        </span>
                                        <button className="w-full mt-3 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 transition-colors text-sm">
                                            Preview in AR
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

