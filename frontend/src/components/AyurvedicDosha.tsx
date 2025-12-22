import React from 'react';
import { Wind, Sun, Droplets, Heart, Leaf, AlertTriangle } from 'lucide-react';

interface AyurvedicDoshaProps {
    analysis: any;
}

export const AyurvedicDosha: React.FC<AyurvedicDoshaProps> = ({ analysis }) => {
    if (!analysis) return null;

    const DoshaBar = ({ label, score, color, icon }: any) => (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-medium text-gray-700">{label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-600">{score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                    className={`h-3 rounded-full ${color}`}
                    style={{ width: `${score}%` }}
                ></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-6">
                <div className="bg-green-100 p-4 rounded-full">
                    <Heart className="w-8 h-8 text-green-600" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold">Ayurvedic Property Health</h3>
                    <p className="text-gray-500">Tridosha analysis and health impact</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dosha Profile */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h4 className="font-semibold text-gray-700 mb-6">Dosha Profile (Prakriti)</h4>

                    <DoshaBar
                        label="Vata (Air + Ether)"
                        score={analysis.vata_score}
                        color="bg-purple-500"
                        icon={<Wind className="w-4 h-4 text-purple-500" />}
                    />
                    <DoshaBar
                        label="Pitta (Fire + Water)"
                        score={analysis.pitta_score}
                        color="bg-red-500"
                        icon={<Sun className="w-4 h-4 text-red-500" />}
                    />
                    <DoshaBar
                        label="Kapha (Water + Earth)"
                        score={analysis.kapha_score}
                        color="bg-green-500"
                        icon={<Droplets className="w-4 h-4 text-green-500" />}
                    />

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                        <div className="text-sm text-gray-500 mb-1">Dominant Constitution</div>
                        <div className="text-xl font-bold text-gray-800">{analysis.dominant_dosha}</div>
                        <p className="text-sm text-gray-600 mt-2">{analysis.prakriti_description}</p>
                    </div>
                </div>

                {/* Health Impact & Remedies */}
                <div className="space-y-6">
                    {/* Imbalances */}
                    {analysis.imbalances?.length > 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                                Potential Imbalances
                            </h4>
                            <ul className="space-y-3">
                                {analysis.imbalances.map((imbalance: any, index: number) => (
                                    <li key={index} className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                        <div className="font-medium text-yellow-800 mb-1">Excess {imbalance.dosha}</div>
                                        <div className="text-sm text-yellow-700">{imbalance.severity} Severity</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center justify-center h-32">
                            <div className="text-center text-green-600">
                                <Heart className="w-8 h-8 mx-auto mb-2" />
                                <div className="font-medium">Balanced Property Health</div>
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                            <Leaf className="w-5 h-5 mr-2 text-green-500" />
                            Recommendations
                        </h4>
                        <ul className="space-y-2">
                            {analysis.recommendations?.slice(0, 3).map((rec: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
