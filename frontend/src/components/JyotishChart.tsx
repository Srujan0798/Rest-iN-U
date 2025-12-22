import React from 'react';
import { Star, Calendar, Moon, Sun, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface JyotishChartProps {
    analysis: any;
}

export const JyotishChart: React.FC<JyotishChartProps> = ({ analysis }) => {
    if (!analysis) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-6">
                <div className="bg-purple-100 p-4 rounded-full">
                    <Star className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold">Vedic Astrology Analysis</h3>
                    <p className="text-gray-500">Planetary influences and auspicious timings</p>
                </div>
            </div>

            {/* Overall Score */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-700">Overall Auspiciousness</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${analysis.overall_score >= 80 ? 'bg-green-100 text-green-800' :
                            analysis.overall_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                        }`}>
                        {analysis.overall_score}/100
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full ${analysis.overall_score >= 80 ? 'bg-green-600' :
                                analysis.overall_score >= 60 ? 'bg-yellow-500' :
                                    'bg-red-600'
                            }`}
                        style={{ width: `${analysis.overall_score}%` }}
                    ></div>
                </div>
                <p className="mt-4 text-gray-600">{analysis.summary}</p>
            </div>

            {/* Planetary Positions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                        <Sun className="w-5 h-5 mr-2 text-orange-500" />
                        Planetary Positions
                    </h4>
                    <div className="space-y-3">
                        {analysis.planetary_positions?.map((planet: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                <span className="font-medium text-gray-700">{planet.planet}</span>
                                <span className="text-sm text-gray-500">{planet.sign} ({planet.house} House)</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Doshas */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                        Doshas & Yogas
                    </h4>
                    {analysis.doshas?.length > 0 ? (
                        <ul className="space-y-2">
                            {analysis.doshas.map((dosha: any, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{dosha.name}: {dosha.description}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded">
                            <CheckCircle className="w-5 h-5" />
                            <span>No major doshas detected</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Auspicious Timings (Muhurat) */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    Upcoming Auspicious Timings (Muhurat)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {analysis.auspicious_dates?.slice(0, 3).map((date: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3 hover:shadow-md transition">
                            <div className="text-sm text-gray-500 mb-1">{new Date(date.date).toLocaleDateString()}</div>
                            <div className="font-medium text-blue-700">{date.event}</div>
                            <div className="text-xs text-gray-400 mt-2">{date.time_window}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
