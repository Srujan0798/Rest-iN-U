'use client';

import React, { useState, useEffect } from 'react';

export default function MortgageCalculatorPage() {
    const [inputs, setInputs] = useState({
        homePrice: 500000,
        downPayment: 100000,
        loanTerm: 30,
        interestRate: 7.0,
        propertyTax: 6250,
        insurance: 2500,
        hoa: 200,
    });

    const [result, setResult] = useState<any>(null);
    const [showSchedule, setShowSchedule] = useState(false);

    const calculate = () => {
        const { homePrice, downPayment, loanTerm, interestRate, propertyTax, insurance, hoa } = inputs;

        const loanAmount = homePrice - downPayment;
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = loanTerm * 12;

        let monthlyPI: number;
        if (monthlyRate === 0) {
            monthlyPI = loanAmount / numPayments;
        } else {
            monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                (Math.pow(1 + monthlyRate, numPayments) - 1);
        }

        const monthlyTax = propertyTax / 12;
        const monthlyInsurance = insurance / 12;
        const downPaymentPercent = (downPayment / homePrice) * 100;
        const monthlyPmi = downPaymentPercent < 20 ? loanAmount * 0.01 / 12 : 0;

        const total = monthlyPI + monthlyTax + monthlyInsurance + hoa + monthlyPmi;

        // Generate amortization schedule
        const schedule = [];
        let balance = loanAmount;
        let totalInterest = 0;

        for (let month = 1; month <= numPayments; month++) {
            const interest = balance * monthlyRate;
            const principal = monthlyPI - interest;
            balance -= principal;
            totalInterest += interest;

            if (month <= 12 || month % 12 === 0 || month === numPayments) {
                schedule.push({
                    month,
                    year: Math.ceil(month / 12),
                    principal: Math.round(principal),
                    interest: Math.round(interest),
                    balance: Math.max(0, Math.round(balance)),
                    totalInterest: Math.round(totalInterest),
                });
            }
        }

        setResult({
            monthlyPI: Math.round(monthlyPI),
            monthlyTax: Math.round(monthlyTax),
            monthlyInsurance: Math.round(monthlyInsurance),
            monthlyHoa: hoa,
            monthlyPmi: Math.round(monthlyPmi),
            totalMonthly: Math.round(total),
            loanAmount,
            totalPayments: Math.round(total * numPayments),
            totalInterest: Math.round(totalInterest),
            downPaymentPercent: downPaymentPercent.toFixed(1),
            schedule,
        });
    };

    useEffect(() => {
        calculate();
    }, [inputs]);

    const formatCurrency = (num: number) => `$${num.toLocaleString()}`;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-12 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">Mortgage Calculator</h1>
                    <p className="text-white/70">Calculate your monthly payments and affordability</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 -mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Form */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">Loan Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Home Price</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={inputs.homePrice}
                                            onChange={e => setInputs({ ...inputs, homePrice: Number(e.target.value) })}
                                            className="w-full pl-8 pr-4 py-3 border rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Down Payment</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={inputs.downPayment}
                                            onChange={e => setInputs({ ...inputs, downPayment: Number(e.target.value) })}
                                            className="w-full pl-8 pr-4 py-3 border rounded-lg"
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max={inputs.homePrice}
                                        step="10000"
                                        value={inputs.downPayment}
                                        onChange={e => setInputs({ ...inputs, downPayment: Number(e.target.value) })}
                                        className="w-full mt-2"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Loan Term</label>
                                        <select
                                            value={inputs.loanTerm}
                                            onChange={e => setInputs({ ...inputs, loanTerm: Number(e.target.value) })}
                                            className="w-full px-4 py-3 border rounded-lg"
                                        >
                                            <option value={15}>15 years</option>
                                            <option value={20}>20 years</option>
                                            <option value={30}>30 years</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Interest Rate</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={inputs.interestRate}
                                                onChange={e => setInputs({ ...inputs, interestRate: Number(e.target.value) })}
                                                className="w-full pr-8 px-4 py-3 border rounded-lg"
                                            />
                                            <span className="absolute right-3 top-3 text-gray-400">%</span>
                                        </div>
                                    </div>
                                </div>

                                <hr />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Property Tax/yr</label>
                                        <input
                                            type="number"
                                            value={inputs.propertyTax}
                                            onChange={e => setInputs({ ...inputs, propertyTax: Number(e.target.value) })}
                                            className="w-full px-4 py-3 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Insurance/yr</label>
                                        <input
                                            type="number"
                                            value={inputs.insurance}
                                            onChange={e => setInputs({ ...inputs, insurance: Number(e.target.value) })}
                                            className="w-full px-4 py-3 border rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">HOA/mo</label>
                                    <input
                                        type="number"
                                        value={inputs.hoa}
                                        onChange={e => setInputs({ ...inputs, hoa: Number(e.target.value) })}
                                        className="w-full px-4 py-3 border rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-2 space-y-6">
                        {result && (
                            <>
                                {/* Monthly Payment */}
                                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                                    <div className="text-gray-500 mb-2">Your Estimated Monthly Payment</div>
                                    <div className="text-5xl font-bold text-green-600">
                                        {formatCurrency(result.totalMonthly)}
                                    </div>
                                </div>

                                {/* Breakdown */}
                                <div className="bg-white rounded-2xl shadow-md p-6">
                                    <h3 className="text-xl font-semibold mb-6">Payment Breakdown</h3>

                                    <div className="space-y-4">
                                        {[
                                            { label: 'Principal & Interest', value: result.monthlyPI, color: 'bg-green-500' },
                                            { label: 'Property Tax', value: result.monthlyTax, color: 'bg-blue-500' },
                                            { label: 'Home Insurance', value: result.monthlyInsurance, color: 'bg-yellow-500' },
                                            { label: 'HOA Fees', value: result.monthlyHoa, color: 'bg-purple-500' },
                                            { label: 'PMI', value: result.monthlyPmi, color: 'bg-red-500' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className={`w-4 h-4 rounded ${item.color}`} />
                                                <div className="flex-1">{item.label}</div>
                                                <div className="font-semibold">{formatCurrency(item.value)}</div>
                                                <div className="text-gray-400 w-16 text-right">
                                                    {((item.value / result.totalMonthly) * 100).toFixed(0)}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Visual bar */}
                                    <div className="h-4 rounded-full overflow-hidden flex mt-6">
                                        <div className="bg-green-500" style={{ width: `${(result.monthlyPI / result.totalMonthly) * 100}%` }} />
                                        <div className="bg-blue-500" style={{ width: `${(result.monthlyTax / result.totalMonthly) * 100}%` }} />
                                        <div className="bg-yellow-500" style={{ width: `${(result.monthlyInsurance / result.totalMonthly) * 100}%` }} />
                                        <div className="bg-purple-500" style={{ width: `${(result.monthlyHoa / result.totalMonthly) * 100}%` }} />
                                        <div className="bg-red-500" style={{ width: `${(result.monthlyPmi / result.totalMonthly) * 100}%` }} />
                                    </div>
                                </div>

                                {/* Summary Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white rounded-xl shadow-md p-4 text-center">
                                        <div className="text-2xl font-bold text-gray-800">{formatCurrency(result.loanAmount)}</div>
                                        <div className="text-sm text-gray-500">Loan Amount</div>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-md p-4 text-center">
                                        <div className="text-2xl font-bold text-orange-600">{formatCurrency(result.totalInterest)}</div>
                                        <div className="text-sm text-gray-500">Total Interest</div>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-md p-4 text-center">
                                        <div className="text-2xl font-bold text-gray-800">{formatCurrency(result.totalPayments)}</div>
                                        <div className="text-sm text-gray-500">Total Payments</div>
                                    </div>
                                </div>

                                {/* Amortization Toggle */}
                                <div className="bg-white rounded-2xl shadow-md p-6">
                                    <button
                                        onClick={() => setShowSchedule(!showSchedule)}
                                        className="flex items-center justify-between w-full"
                                    >
                                        <h3 className="text-xl font-semibold">Amortization Schedule</h3>
                                        <span className="text-gray-400">{showSchedule ? '▼' : '▶'}</span>
                                    </button>

                                    {showSchedule && (
                                        <div className="mt-6 overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left p-2">Year</th>
                                                        <th className="text-right p-2">Principal</th>
                                                        <th className="text-right p-2">Interest</th>
                                                        <th className="text-right p-2">Balance</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {result.schedule.filter((s: any) => s.month % 12 === 0 || s.month === 1).map((row: any) => (
                                                        <tr key={row.month} className="border-b">
                                                            <td className="p-2">{row.year}</td>
                                                            <td className="text-right p-2">{formatCurrency(row.principal)}</td>
                                                            <td className="text-right p-2">{formatCurrency(row.interest)}</td>
                                                            <td className="text-right p-2">{formatCurrency(row.balance)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

