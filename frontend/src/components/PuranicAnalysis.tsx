import React from 'react';
import { Mountain, Droplets, Wind, Flame, Layers, BookOpen, ShieldCheck } from 'lucide-react';

interface PuranicAnalysisProps {
    analysis: any;
}

export const PuranicAnalysis: React.FC<PuranicAnalysisProps> = ({ analysis }) => {
    if (!analysis) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-6">
                <div className="bg-amber-100 p-4 rounded-full">
                    <BookOpen className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold">Puranic Land Analysis</h3>
                    <p className="text-gray-500">Ancient land classification and elemental balance</p>
                </div>
            </div>

            {/* Land Classification */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-amber-500" />
                    Land Classification
                </h4>
                <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">
                        {analysis.land_type === 'Elephant' ? '🐘' :
                            analysis.land_type === 'Turtle' ? '🐢' :
                                analysis.land_type === 'Lion' ? '🦁' :
                                    analysis.land_type === 'Cow' ? '🐄' : '🏞️'}
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-800">{analysis.land_type} Class</div>
                        <p className="text-gray-600">{analysis.description}</p>
                    </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                    <h5 className="font-medium text-amber-800 mb-2">Key Characteristics</h5>
                    <ul className="list-disc list-inside text-amber-700 space-y-1 text-sm">
                        {analysis.characteristics?.map((char: string, index: number) => (
                            <li key={index}>{char}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Elemental Balance (Pancha Mahabhuta) */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h4 className="font-semibold text-gray-700 mb-4">Elemental Balance (Pancha Mahabhuta)</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { name: 'Earth (Prithvi)', score: analysis.elements?.earth, icon: <Mountain className="w-6 h-6 text-emerald-600" />, color: 'bg-emerald-100' },
                        { name: 'Water (Jala)', score: analysis.elements?.water, icon: <Droplets className="w-6 h-6 text-blue-600" />, color: 'bg-blue-100' },
                        { name: 'Fire (Agni)', score: analysis.elements?.fire, icon: <Flame className="w-6 h-6 text-red-600" />, color: 'bg-red-100' },
                        { name: 'Air (Vayu)', score: analysis.elements?.air, icon: <Wind className="w-6 h-6 text-sky-600" />, color: 'bg-sky-100' },
                        { name: 'Space (Akasha)', score: analysis.elements?.space, icon: <ShieldCheck className="w-6 h-6 text-purple-600" />, color: 'bg-purple-100' },
                    ].map((element, index) => (
                        <div key={index} className="text-center p-3 border rounded-lg hover:shadow-sm transition">
                            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${element.color}`}>
                                {element.icon}
                            </div>
                            <div className="font-medium text-gray-700 text-sm mb-1">{element.name}</div>
                            <div className="text-lg font-bold text-gray-900">{element.score}%</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommendations */}
            {analysis.recommendations?.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h4 className="font-semibold text-gray-700 mb-4">Puranic Recommendations</h4>
                    <ul className="space-y-3">
                        {analysis.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start gap-3 text-gray-600">
                                <span className="mt-1 text-amber-500">•</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
