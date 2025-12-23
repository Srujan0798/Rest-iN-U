'use client';

import React, { useState } from 'react';
import { DollarSign, Percent, Calendar, TrendingUp, Home, Calculator, PiggyBank } from 'lucide-react';

interface InvestmentCalculatorProps {
    propertyPrice: number;
    propertyTitle: string;
}

export default function InvestmentCalculator({ propertyPrice, propertyTitle }: InvestmentCalculatorProps) {
    const [downPayment, setDownPayment] = useState(20);
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTerm, setLoanTerm] = useState(30);
    const [appreciationRate, setAppreciationRate] = useState(3);
    const [rentalYield, setRentalYield] = useState(5);

    const downPaymentAmount = (propertyPrice * downPayment) / 100;
    const loanAmount = propertyPrice - downPaymentAmount;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;

    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    const totalInterest = (monthlyPayment * totalPayments) - loanAmount;

    const monthlyRent = (propertyPrice * rentalYield / 100) / 12;
    const cashFlow = monthlyRent - monthlyPayment;
    const capRate = ((monthlyRent * 12) / propertyPrice) * 100;

    const futureValue5y = propertyPrice * Math.pow(1 + appreciationRate / 100, 5);
    const equity5y = futureValue5y - loanAmount + (downPaymentAmount);
    const roi5y = ((equity5y - downPaymentAmount) / downPaymentAmount) * 100;

    const formatCurrency = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${Math.round(n).toLocaleString()}`;

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5">
                <div className="flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-white" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Investment Calculator</h2>
                        <p className="text-white/80 text-sm">{propertyTitle}</p>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-6">
                {/* Input Sliders */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-400">Down Payment</span>
                            <span className="text-white font-semibold">{downPayment}% ({formatCurrency(downPaymentAmount)})</span>
                        </label>
                        <input type="range" min="5" max="50" value={downPayment} onChange={e => setDownPayment(+e.target.value)} className="w-full accent-indigo-500" />
                    </div>
                    <div>
                        <label className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-400">Interest Rate</span>
                            <span className="text-white font-semibold">{interestRate}%</span>
                        </label>
                        <input type="range" min="3" max="12" step="0.25" value={interestRate} onChange={e => setInterestRate(+e.target.value)} className="w-full accent-indigo-500" />
                    </div>
                    <div>
                        <label className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-400">Loan Term</span>
                            <span className="text-white font-semibold">{loanTerm} years</span>
                        </label>
                        <input type="range" min="10" max="30" step="5" value={loanTerm} onChange={e => setLoanTerm(+e.target.value)} className="w-full accent-indigo-500" />
                    </div>
                    <div>
                        <label className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-400">Appreciation Rate</span>
                            <span className="text-white font-semibold">{appreciationRate}% / year</span>
                        </label>
                        <input type="range" min="0" max="10" step="0.5" value={appreciationRate} onChange={e => setAppreciationRate(+e.target.value)} className="w-full accent-indigo-500" />
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-800 rounded-xl p-4 text-center">
                        <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{formatCurrency(monthlyPayment)}</p>
                        <p className="text-xs text-gray-400">Monthly Payment</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4 text-center">
                        <Home className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{formatCurrency(monthlyRent)}</p>
                        <p className="text-xs text-gray-400">Est. Rental Income</p>
                    </div>
                    <div className={`bg-gray-800 rounded-xl p-4 text-center ${cashFlow >= 0 ? '' : 'border border-red-500/30'}`}>
                        <PiggyBank className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                        <p className={`text-lg font-bold ${cashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(Math.abs(cashFlow))}</p>
                        <p className="text-xs text-gray-400">{cashFlow >= 0 ? 'Positive' : 'Negative'} Cash Flow</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4 text-center">
                        <Percent className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{capRate.toFixed(1)}%</p>
                        <p className="text-xs text-gray-400">Cap Rate</p>
                    </div>
                </div>

                {/* 5 Year Projection */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> 5-Year Investment Outlook
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xl font-bold text-white">{formatCurrency(futureValue5y)}</p>
                            <p className="text-xs text-gray-400">Property Value</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-white">{formatCurrency(equity5y)}</p>
                            <p className="text-xs text-gray-400">Est. Equity</p>
                        </div>
                        <div>
                            <p className={`text-xl font-bold ${roi5y >= 0 ? 'text-green-400' : 'text-red-400'}`}>{roi5y.toFixed(0)}%</p>
                            <p className="text-xs text-gray-400">ROI on Down Payment</p>
                        </div>
                    </div>
                </div>

                {/* Totals */}
                <div className="flex justify-between text-sm border-t border-gray-800 pt-4">
                    <div className="text-gray-400">Total Interest Paid: <span className="text-white font-semibold">{formatCurrency(totalInterest)}</span></div>
                    <div className="text-gray-400">Total Loan Cost: <span className="text-white font-semibold">{formatCurrency(loanAmount + totalInterest)}</span></div>
                </div>
            </div>
        </div>
    );
}
