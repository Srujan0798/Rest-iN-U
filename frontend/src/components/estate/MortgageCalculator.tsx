"use client";

import { useState } from "react";
import { Calculator, IndianRupee, Percent, Calendar } from "lucide-react";

interface MortgageCalculatorProps {
  principal: number;
  onCalculate?: (
    emi: number,
    totalInterest: number,
    totalPayment: number,
  ) => void;
}

export default function MortgageCalculator({
  principal,
  onCalculate,
}: MortgageCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(Math.round(principal * 0.8));
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [downPayment, setDownPayment] = useState(Math.round(principal * 0.2));

  // Auto-calculate down payment when loan amount changes
  const handleLoanAmountChange = (value: number) => {
    const newLoanAmount = Math.min(value, principal);
    setLoanAmount(newLoanAmount);
    setDownPayment(principal - newLoanAmount);
  };

  // Auto-calculate loan amount when down payment changes
  const handleDownPaymentChange = (value: number) => {
    const newDownPayment = Math.min(value, principal);
    setDownPayment(newDownPayment);
    setLoanAmount(principal - newDownPayment);
  };

  // Calculate EMI
  const calculateEMI = () => {
    const monthlyRate = interestRate / 12 / 100;
    const months = loanTenure * 12;

    if (monthlyRate === 0) {
      return loanAmount / months;
    }

    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const emi = calculateEMI();
  const totalPayment = emi * loanTenure * 12;
  const totalInterest = totalPayment - loanAmount;

  // Notify parent of calculation
  if (onCalculate) {
    onCalculate(emi, totalInterest, totalPayment);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Input Fields */}
      <div className="space-y-4">
        {/* Property Price */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Home className="w-4 h-4 mr-2" />
            Property Price
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IndianRupee className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={formatCurrency(principal)}
              disabled
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
            />
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calculator className="w-4 h-4 mr-2" />
            Down Payment
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IndianRupee className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {Math.round((downPayment / principal) * 100)}% of property price
          </div>
        </div>

        {/* Loan Amount */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <IndianRupee className="w-4 h-4 mr-2" />
            Loan Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IndianRupee className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => handleLoanAmountChange(Number(e.target.value))}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {Math.round((loanAmount / principal) * 100)}% of property price
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Percent className="w-4 h-4 mr-2" />
            Interest Rate (Annual)
          </label>
          <div className="relative">
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              step="0.1"
              min="0.1"
              max="20"
              className="block w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">%</span>
            </div>
          </div>
        </div>

        {/* Loan Tenure */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            Loan Tenure
          </label>
          <div className="relative">
            <input
              type="number"
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              min="1"
              max="30"
              className="block w-full pr-12 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">years</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Payment Breakdown
        </h4>

        <div className="space-y-4">
          {/* EMI Amount */}
          <div className="flex justify-between items-center pb-3 border-b border-blue-200">
            <span className="text-gray-700">Monthly EMI</span>
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(emi)}
            </span>
          </div>

          {/* Total Interest */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Interest</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(totalInterest)}
            </span>
          </div>

          {/* Total Payment */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Payment</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(totalPayment)}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Important Information
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                This calculation is for illustration purposes only. Actual
                interest rates and EMIs may vary based on:
              </p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Your credit score and financial profile</li>
                <li>Bank-specific interest rates and processing fees</li>
                <li>Current RBI policy rates</li>
                <li>Property type and location factors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
