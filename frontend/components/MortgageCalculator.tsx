'use client';
import { useState } from 'react';

interface MortgageCalculatorProps {
    price: number;
}

export default function MortgageCalculator({ price }: MortgageCalculatorProps) {
    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [interestRate, setInterestRate] = useState(6.99);
    const [loanTerm, setLoanTerm] = useState(30);

    const downPayment = price * (downPaymentPercent / 100);
    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const monthlyTax = (price * 0.012) / 12;
    const monthlyInsurance = 100;
    const total = monthlyPI + monthlyTax + monthlyInsurance;

    return (
        <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mortgage Calculator</h3>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm text-gray-700 mb-2">
                        Down Payment: {downPaymentPercent}% (${downPayment.toLocaleString()})
                    </label>
                    <input
                        type="range"
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                        min={5}
                        max={50}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Interest Rate (%)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={interestRate}
                            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Loan Term</label>
                        <select
                            value={loanTerm}
                            onChange={(e) => setLoanTerm(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                            <option value={15}>15 years</option>
                            <option value={20}>20 years</option>
                            <option value={30}>30 years</option>
                        </select>
                    </div>
                </div>
            </div>

            <hr className="my-5 border-gray-200" />

            <div className="bg-blue-600 text-white p-4 rounded-lg text-center mb-4">
                <p className="text-sm opacity-90">Estimated Monthly Payment</p>
                <p className="text-3xl font-bold">${Math.round(total).toLocaleString()}/mo</p>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Principal & Interest</span>
                    <span className="text-gray-900">${Math.round(monthlyPI).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Property Tax</span>
                    <span className="text-gray-900">${Math.round(monthlyTax).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Home Insurance</span>
                    <span className="text-gray-900">${monthlyInsurance}</span>
                </div>
                <hr className="my-2 border-gray-200" />
                <div className="flex justify-between">
                    <span className="text-gray-500">Loan Amount</span>
                    <span className="text-gray-900">${loanAmount.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

