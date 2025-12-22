'use client';
import { useState } from 'react';
import { TrendingUp, Calculator, Landmark, PieChart, ChevronUp, ChevronDown } from 'lucide-react';

export default function InvestmentAnalysisPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [purchasePrice, setPurchasePrice] = useState(500000);
    const [downPayment, setDownPayment] = useState(100000);
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTerm, setLoanTerm] = useState(30);

    // Calculations
    const loanAmount = purchasePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);

    const estimatedRent = purchasePrice * 0.008;
    const operatingExpenses = estimatedRent * 0.30;
    const monthlyNOI = estimatedRent - operatingExpenses;
    const annualNOI = monthlyNOI * 12;
    const monthlyCashFlow = monthlyNOI - monthlyPayment;
    const annualCashFlow = monthlyCashFlow * 12;
    const capRate = (annualNOI / purchasePrice) * 100;
    const cashOnCash = (annualCashFlow / downPayment) * 100;

    const getGrade = () => {
        if (capRate >= 7 && cashOnCash >= 10 && monthlyCashFlow >= 300) return { grade: 'A', color: 'green' };
        if (capRate >= 5 && cashOnCash >= 5 && monthlyCashFlow >= 0) return { grade: 'B', color: 'yellow' };
        return { grade: 'C', color: 'red' };
    };

    const grade = getGrade();

    const projections = Array.from({ length: 10 }, (_, i) => {
        const year = i + 1;
        const appreciation = Math.pow(1.03, year);
        const value = Math.round(purchasePrice * appreciation);
        const equity = Math.round(downPayment + (loanAmount / 30 * year) + (value - purchasePrice));
        return { year, value, equity, cashFlow: Math.round(annualCashFlow * year) };
    });

    const tabs = [
        { icon: Calculator, label: 'Calculator' },
        { icon: PieChart, label: '10-Year Projections' },
        { icon: Landmark, label: 'Loan Scenarios' },
    ];

    const gradeColors = {
        green: 'bg-green-100 text-green-800 border-green-300',
        yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        red: 'bg-red-100 text-red-800 border-red-300',
    };

    const badgeColors = {
        green: 'bg-green-500 text-white',
        yellow: 'bg-yellow-500 text-white',
        red: 'bg-red-500 text-white',
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Investment Analysis</h1>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Professional-grade real estate investment analysis with cap rate, cash-on-cash return, and ROI projections
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
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Calculator Tab */}
                {activeTab === 0 && (
                    <div className="grid md:grid-cols-5 gap-6">
                        {/* Input Panel */}
                        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">
                                        Purchase Price: <span className="font-semibold">${purchasePrice.toLocaleString()}</span>
                                    </label>
                                    <input
                                        type="range"
                                        value={purchasePrice}
                                        onChange={(e) => setPurchasePrice(Number(e.target.value))}
                                        min={100000}
                                        max={2000000}
                                        step={10000}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">
                                        Down Payment: <span className="font-semibold">${downPayment.toLocaleString()}</span> ({((downPayment / purchasePrice) * 100).toFixed(0)}%)
                                    </label>
                                    <input
                                        type="range"
                                        value={downPayment}
                                        onChange={(e) => setDownPayment(Number(e.target.value))}
                                        min={purchasePrice * 0.03}
                                        max={purchasePrice * 0.5}
                                        step={5000}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">
                                        Interest Rate: <span className="font-semibold">{interestRate}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        value={interestRate}
                                        onChange={(e) => setInterestRate(Number(e.target.value))}
                                        min={3}
                                        max={10}
                                        step={0.125}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">
                                        Loan Term: <span className="font-semibold">{loanTerm} years</span>
                                    </label>
                                    <input
                                        type="range"
                                        value={loanTerm}
                                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                                        min={10}
                                        max={30}
                                        step={5}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Results Panel */}
                        <div className="md:col-span-3 space-y-4">
                            {/* Investment Grade */}
                            <div className={`rounded-xl p-6 text-center border-2 ${gradeColors[grade.color]}`}>
                                <p className="text-sm font-medium mb-1">Investment Grade</p>
                                <p className="text-6xl font-bold mb-2">{grade.grade}</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badgeColors[grade.color]}`}>
                                    {monthlyCashFlow >= 0 ? 'Cash Flow Positive' : 'Cash Flow Negative'}
                                </span>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">Cap Rate</p>
                                    <p className={`text-xl font-bold ${capRate >= 6 ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {capRate.toFixed(1)}%
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">Cash on Cash</p>
                                    <p className={`text-xl font-bold ${cashOnCash >= 8 ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {cashOnCash.toFixed(1)}%
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">Monthly Cash Flow</p>
                                    <p className={`text-xl font-bold ${monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ${Math.round(monthlyCashFlow).toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">Monthly Payment</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        ${Math.round(monthlyPayment).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Income & Expenses */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-4">Income & Expenses</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Est. Monthly Rent</p>
                                        <p className="text-lg font-semibold">${Math.round(estimatedRent).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Operating Expenses</p>
                                        <p className="text-lg font-semibold">${Math.round(operatingExpenses).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Monthly NOI</p>
                                        <p className="text-lg font-semibold">${Math.round(monthlyNOI).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Annual NOI</p>
                                        <p className="text-lg font-semibold">${Math.round(annualNOI).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 10-Year Projections Tab */}
                {activeTab === 1 && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">10-Year Investment Projection</h2>
                        <p className="text-gray-600 mb-6">Based on 3% annual appreciation and current cash flow</p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Year</th>
                                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Property Value</th>
                                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Total Equity</th>
                                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Accumulated Cash Flow</th>
                                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Total Return</th>
                                        <th className="text-left py-3 px-2 font-semibold text-gray-700">ROI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projections.map(row => (
                                        <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-2 font-medium">Year {row.year}</td>
                                            <td className="py-3 px-2">${row.value.toLocaleString()}</td>
                                            <td className="py-3 px-2">${row.equity.toLocaleString()}</td>
                                            <td className="py-3 px-2">${row.cashFlow.toLocaleString()}</td>
                                            <td className="py-3 px-2 font-semibold">${(row.equity - downPayment + row.cashFlow).toLocaleString()}</td>
                                            <td className="py-3 px-2">
                                                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                    {((row.equity - downPayment + row.cashFlow) / downPayment * 100).toFixed(0)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800">
                                <strong>10-Year Summary:</strong> Starting with ${downPayment.toLocaleString()} down payment,
                                you could build ${projections[9]?.equity.toLocaleString()} in equity plus
                                ${projections[9]?.cashFlow.toLocaleString()} in accumulated cash flow.
                            </p>
                        </div>
                    </div>
                )}

                {/* Loan Scenarios Tab */}
                {activeTab === 2 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { name: 'Conservative (25% Down)', down: 0.25, rate: 7.0, term: 30 },
                            { name: 'Standard (20% Down)', down: 0.20, rate: 6.5, term: 30 },
                            { name: 'Aggressive (10% Down)', down: 0.10, rate: 6.5, term: 30 },
                            { name: 'FHA (3.5% Down)', down: 0.035, rate: 6.25, term: 30 },
                            { name: '15-Year Fixed', down: 0.20, rate: 5.75, term: 15 },
                        ].map(scenario => {
                            const sDown = purchasePrice * scenario.down;
                            const sLoan = purchasePrice - sDown;
                            const sRate = scenario.rate / 100 / 12;
                            const sPayments = scenario.term * 12;
                            const sPayment = sLoan * (sRate * Math.pow(1 + sRate, sPayments)) /
                                (Math.pow(1 + sRate, sPayments) - 1);
                            const sInterest = (sPayment * sPayments) - sLoan;
                            const sCashFlow = estimatedRent - operatingExpenses - sPayment;

                            return (
                                <div key={scenario.name} className="bg-white rounded-xl shadow-md p-5">
                                    <h3 className="font-semibold text-gray-900 mb-3">{scenario.name}</h3>
                                    <div className="border-t border-gray-200 pt-3 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Down Payment</span>
                                            <span className="font-medium">${Math.round(sDown).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Loan Amount</span>
                                            <span className="font-medium">${Math.round(sLoan).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Rate / Term</span>
                                            <span className="font-medium">{scenario.rate}% / {scenario.term}yr</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Monthly Payment</span>
                                            <span className="font-bold">${Math.round(sPayment).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Total Interest</span>
                                            <span className="font-medium">${Math.round(sInterest).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm items-center">
                                            <span className="text-gray-500">Cash Flow</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${sCashFlow >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                ${Math.round(sCashFlow).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
