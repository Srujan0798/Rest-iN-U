// Mortgage Calculator Service
import { logger } from '../utils/logger';

interface MortgageInput {
    homePrice: number;
    downPayment: number;
    loanTerm: number; // years
    interestRate: number; // annual percentage
    propertyTax?: number; // annual
    insurance?: number; // annual
    hoa?: number; // monthly
    pmi?: number; // monthly - if down payment < 20%
}

interface MortgageBreakdown {
    principal: number;
    interest: number;
    propertyTax: number;
    insurance: number;
    hoa: number;
    pmi: number;
    total: number;
}

interface AmortizationEntry {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    totalInterestPaid: number;
}

export class MortgageService {
    // Calculate monthly mortgage payment
    calculateMonthlyPayment(input: MortgageInput): MortgageBreakdown {
        const { homePrice, downPayment, loanTerm, interestRate, propertyTax, insurance, hoa, pmi } = input;

        const loanAmount = homePrice - downPayment;
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = loanTerm * 12;

        // Principal + Interest (P&I)
        let monthlyPI: number;
        if (monthlyRate === 0) {
            monthlyPI = loanAmount / numPayments;
        } else {
            monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                (Math.pow(1 + monthlyRate, numPayments) - 1);
        }

        // Split P&I for first payment
        const firstInterest = loanAmount * monthlyRate;
        const firstPrincipal = monthlyPI - firstInterest;

        // Other monthly costs
        const monthlyTax = (propertyTax || homePrice * 0.0125) / 12;
        const monthlyInsurance = (insurance || homePrice * 0.005) / 12;
        const monthlyHoa = hoa || 0;

        // PMI if down payment < 20%
        const downPaymentPercent = (downPayment / homePrice) * 100;
        const monthlyPmi = downPaymentPercent < 20 ? (pmi || loanAmount * 0.01 / 12) : 0;

        const total = monthlyPI + monthlyTax + monthlyInsurance + monthlyHoa + monthlyPmi;

        return {
            principal: Math.round(firstPrincipal),
            interest: Math.round(firstInterest),
            propertyTax: Math.round(monthlyTax),
            insurance: Math.round(monthlyInsurance),
            hoa: Math.round(monthlyHoa),
            pmi: Math.round(monthlyPmi),
            total: Math.round(total),
        };
    }

    // Generate full amortization schedule
    generateAmortizationSchedule(input: MortgageInput): AmortizationEntry[] {
        const { homePrice, downPayment, loanTerm, interestRate } = input;

        const loanAmount = homePrice - downPayment;
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = loanTerm * 12;

        let monthlyPayment: number;
        if (monthlyRate === 0) {
            monthlyPayment = loanAmount / numPayments;
        } else {
            monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                (Math.pow(1 + monthlyRate, numPayments) - 1);
        }

        const schedule: AmortizationEntry[] = [];
        let balance = loanAmount;
        let totalInterest = 0;

        for (let month = 1; month <= numPayments; month++) {
            const interest = balance * monthlyRate;
            const principal = monthlyPayment - interest;
            balance -= principal;
            totalInterest += interest;

            schedule.push({
                month,
                payment: Math.round(monthlyPayment),
                principal: Math.round(principal),
                interest: Math.round(interest),
                balance: Math.max(0, Math.round(balance)),
                totalInterestPaid: Math.round(totalInterest),
            });
        }

        return schedule;
    }

    // Calculate affordability based on income
    calculateAffordability(annualIncome: number, monthlyDebts: number = 0, downPaymentPercent: number = 20): any {
        // Using 28% front-end ratio and 36% back-end ratio
        const frontEndRatio = 0.28;
        const backEndRatio = 0.36;

        const monthlyIncome = annualIncome / 12;
        const maxHousingPayment = monthlyIncome * frontEndRatio;
        const maxTotalDebt = monthlyIncome * backEndRatio;
        const maxHousingWithDebts = maxTotalDebt - monthlyDebts;

        const maxPayment = Math.min(maxHousingPayment, maxHousingWithDebts);

        // Estimate home price (assuming 7% rate, 30-year, with taxes/insurance)
        const estimatedRate = 0.07;
        const monthlyRate = estimatedRate / 12;
        const numPayments = 360;
        const taxInsuranceRatio = 0.25; // Assume ~25% of payment goes to tax/insurance

        const piPayment = maxPayment * (1 - taxInsuranceRatio);
        const maxLoan = piPayment * (Math.pow(1 + monthlyRate, numPayments) - 1) /
            (monthlyRate * Math.pow(1 + monthlyRate, numPayments));

        const maxHomePrice = maxLoan / (1 - downPaymentPercent / 100);

        return {
            maxMonthlyPayment: Math.round(maxPayment),
            maxHomePrice: Math.round(maxHomePrice),
            maxLoanAmount: Math.round(maxLoan),
            recommendedDownPayment: Math.round(maxHomePrice * downPaymentPercent / 100),
            debtToIncomeRatio: ((monthlyDebts + maxPayment) / monthlyIncome * 100).toFixed(1),
            assumptions: {
                interestRate: '7%',
                loanTerm: '30 years',
                frontEndRatio: '28%',
                backEndRatio: '36%',
            },
        };
    }

    // Compare different loan scenarios
    compareLoanScenarios(homePrice: number, downPayment: number, scenarios: { term: number; rate: number }[]): any[] {
        return scenarios.map(scenario => {
            const input = {
                homePrice,
                downPayment,
                loanTerm: scenario.term,
                interestRate: scenario.rate,
            };

            const monthly = this.calculateMonthlyPayment(input);
            const schedule = this.generateAmortizationSchedule(input);
            const totalInterest = schedule[schedule.length - 1]?.totalInterestPaid || 0;

            return {
                term: scenario.term,
                rate: scenario.rate,
                monthlyPayment: monthly.total,
                totalPayment: monthly.total * scenario.term * 12,
                totalInterest,
                loanAmount: homePrice - downPayment,
            };
        });
    }

    // Refinance analysis
    analyzeRefinance(currentLoan: any, newLoan: any): any {
        const currentMonthly = this.calculateMonthlyPayment(currentLoan);
        const newMonthly = this.calculateMonthlyPayment(newLoan);

        const monthlySavings = currentMonthly.total - newMonthly.total;
        const closingCosts = newLoan.closingCosts || (currentLoan.homePrice - currentLoan.downPayment) * 0.02;
        const breakEvenMonths = closingCosts / monthlySavings;

        return {
            currentPayment: currentMonthly.total,
            newPayment: newMonthly.total,
            monthlySavings: Math.round(monthlySavings),
            annualSavings: Math.round(monthlySavings * 12),
            closingCosts: Math.round(closingCosts),
            breakEvenMonths: Math.round(breakEvenMonths),
            recommendation: monthlySavings > 200 && breakEvenMonths < 36
                ? 'Refinancing recommended - good savings with reasonable break-even'
                : monthlySavings > 0
                    ? 'Consider refinancing if planning to stay long-term'
                    : 'Refinancing not recommended at current rates',
        };
    }
}

export const mortgageService = new MortgageService();

