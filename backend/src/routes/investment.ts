import { Router, Request, Response } from 'express';

const router = Router();

// Investment opportunity analysis
router.post('/analyze', async (req: Request, res: Response) => {
    try {
        const { propertyId, purchasePrice, downPayment, interestRate, loanTerm } = req.body;

        const price = purchasePrice || 500000;
        const down = downPayment || price * 0.2;
        const loanAmount = price - down;
        const rate = interestRate || 6.5;
        const term = loanTerm || 30;

        // Calculate mortgage payment
        const monthlyRate = rate / 100 / 12;
        const numPayments = term * 12;
        const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
            (Math.pow(1 + monthlyRate, numPayments) - 1);

        // Estimate rental income (based on 0.8% of property value monthly)
        const estimatedRent = price * 0.008;

        // Operating expenses (30% of rent)
        const operatingExpenses = estimatedRent * 0.30;

        // Net Operating Income
        const monthlyNOI = estimatedRent - operatingExpenses;
        const annualNOI = monthlyNOI * 12;

        // Cash flow
        const monthlyCashFlow = monthlyNOI - monthlyPayment;
        const annualCashFlow = monthlyCashFlow * 12;

        // Cap Rate
        const capRate = (annualNOI / price) * 100;

        // Cash on Cash Return
        const cashOnCash = (annualCashFlow / down) * 100;

        // 1% Rule check
        const onePercentRule = estimatedRent >= price * 0.01;

        // Appreciation projections (3% annual)
        const yearlyAppreciation = 0.03;
        const projections: Array<{ year: number; propertyValue: number; equity: number; accumulatedCashFlow: number; totalReturn: number; roi: string }> = [];
        let currentValue = price;
        let totalEquity = down;
        let remainingLoan = loanAmount;

        for (let year = 1; year <= 10; year++) {
            currentValue *= (1 + yearlyAppreciation);
            // Simplified loan paydown (actual would use amortization schedule)
            const yearlyPrincipal = (loanAmount / term);
            remainingLoan -= yearlyPrincipal;
            totalEquity = currentValue - remainingLoan;

            projections.push({
                year,
                propertyValue: Math.round(currentValue),
                equity: Math.round(totalEquity),
                accumulatedCashFlow: Math.round(annualCashFlow * year),
                totalReturn: Math.round(totalEquity - down + annualCashFlow * year),
                roi: ((totalEquity - down + annualCashFlow * year) / down * 100).toFixed(1)
            });
        }

        res.json({
            propertyId,
            purchaseAnalysis: {
                purchasePrice: price,
                downPayment: down,
                loanAmount,
                interestRate: rate,
                loanTerm: term,
                monthlyPayment: Math.round(monthlyPayment)
            },

            rentalAnalysis: {
                estimatedMonthlyRent: Math.round(estimatedRent),
                operatingExpenses: Math.round(operatingExpenses),
                monthlyNOI: Math.round(monthlyNOI),
                annualNOI: Math.round(annualNOI)
            },

            investmentMetrics: {
                capRate: capRate.toFixed(2) + '%',
                cashOnCashReturn: cashOnCash.toFixed(2) + '%',
                monthlyCashFlow: Math.round(monthlyCashFlow),
                annualCashFlow: Math.round(annualCashFlow),
                onePercentRule: onePercentRule ? 'Pass' : 'Fail',
                breakEvenRent: Math.round(monthlyPayment + operatingExpenses)
            },

            investmentGrade: getInvestmentGrade(capRate, cashOnCash, monthlyCashFlow),

            tenYearProjections: projections,

            riskFactors: [
                { factor: 'Vacancy', impact: 'Moderate', mitigation: 'Build 3-month reserve' },
                { factor: 'Maintenance', impact: 'Low', mitigation: 'Property inspection' },
                { factor: 'Market Decline', impact: 'Moderate', mitigation: 'Long-term hold strategy' },
                { factor: 'Interest Rates', impact: 'Low', mitigation: 'Fixed rate mortgage' }
            ],

            recommendation: generateRecommendation(capRate, cashOnCash, monthlyCashFlow)
        });
    } catch (error) {
        res.status(500).json({ error: 'Investment analysis failed' });
    }
});

// Calculate loan scenarios
router.post('/loan-scenarios', async (req: Request, res: Response) => {
    try {
        const { purchasePrice, scenarios } = req.body;
        const price = purchasePrice || 500000;

        const defaultScenarios = scenarios || [
            { name: 'Conservative', downPercent: 25, rate: 7.0, term: 30 },
            { name: 'Standard', downPercent: 20, rate: 6.5, term: 30 },
            { name: 'Aggressive', downPercent: 10, rate: 6.5, term: 30 },
            { name: 'FHA', downPercent: 3.5, rate: 6.25, term: 30 },
            { name: '15-Year', downPercent: 20, rate: 5.75, term: 15 }
        ];

        const results = defaultScenarios.map(s => {
            const down = price * (s.downPercent / 100);
            const loanAmount = price - down;
            const monthlyRate = s.rate / 100 / 12;
            const numPayments = s.term * 12;
            const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                (Math.pow(1 + monthlyRate, numPayments) - 1);
            const totalInterest = (monthlyPayment * numPayments) - loanAmount;

            return {
                scenario: s.name,
                downPayment: Math.round(down),
                downPercent: s.downPercent,
                loanAmount: Math.round(loanAmount),
                interestRate: s.rate,
                term: s.term,
                monthlyPayment: Math.round(monthlyPayment),
                totalInterest: Math.round(totalInterest),
                totalCost: Math.round(loanAmount + totalInterest),
                pmi: s.downPercent < 20 ? Math.round(loanAmount * 0.005 / 12) : 0
            };
        });

        res.json({ purchasePrice: price, scenarios: results });
    } catch (error) {
        res.status(500).json({ error: 'Scenario calculation failed' });
    }
});

// Tax benefits calculator
router.post('/tax-benefits', async (req: Request, res: Response) => {
    try {
        const { purchasePrice, annualRent, operatingExpenses, mortgageInterest, taxBracket } = req.body;

        const price = purchasePrice || 500000;
        const rent = annualRent || price * 0.008 * 12;
        const expenses = operatingExpenses || rent * 0.30;
        const interest = mortgageInterest || price * 0.8 * 0.065;
        const bracket = taxBracket || 0.24;

        // Depreciation (residential: 27.5 years, only building value ~80%)
        const buildingValue = price * 0.8;
        const annualDepreciation = buildingValue / 27.5;

        // Taxable income calculation
        const grossIncome = rent;
        const totalDeductions = expenses + interest + annualDepreciation;
        const taxableIncome = grossIncome - totalDeductions;

        // Tax savings from depreciation alone
        const depreciationTaxSavings = annualDepreciation * bracket;

        res.json({
            grossRentalIncome: Math.round(rent),
            deductions: {
                operatingExpenses: Math.round(expenses),
                mortgageInterest: Math.round(interest),
                depreciation: Math.round(annualDepreciation),
                totalDeductions: Math.round(totalDeductions)
            },
            taxableRentalIncome: Math.round(taxableIncome),
            taxLiability: Math.round(Math.max(0, taxableIncome * bracket)),
            taxSavings: {
                fromDepreciation: Math.round(depreciationTaxSavings),
                effectiveIncome: Math.round(rent - expenses - interest + depreciationTaxSavings)
            },
            twentySevenFiveRule: {
                explanation: 'Residential properties depreciate over 27.5 years',
                annualDeduction: Math.round(annualDepreciation),
                totalBenefit: Math.round(buildingValue)
            },
            disclaimer: 'Consult a tax professional for personalized advice'
        });
    } catch (error) {
        res.status(500).json({ error: 'Tax calculation failed' });
    }
});

// Portfolio overview
router.get('/portfolio/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        // Mock portfolio data
        const portfolio = {
            userId,
            totalProperties: 3,
            totalValue: 1850000,
            totalEquity: 720000,
            monthlyIncome: 8500,
            monthlyExpenses: 5200,
            monthlyCashFlow: 3300,

            properties: [
                { id: 1, address: '123 Main St', value: 650000, equity: 280000, cashFlow: 1200, capRate: 6.2 },
                { id: 2, address: '456 Oak Ave', value: 580000, equity: 210000, cashFlow: 950, capRate: 5.8 },
                { id: 3, address: '789 Pine Rd', value: 620000, equity: 230000, cashFlow: 1150, capRate: 6.5 }
            ],

            performance: {
                totalROI: 18.5,
                averageCapRate: 6.17,
                yearlyAppreciation: 54000
            },

            goals: {
                targetProperties: 5,
                targetMonthlyIncome: 15000,
                progress: 60
            }
        };

        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ error: 'Portfolio fetch failed' });
    }
});

// Helper functions
function getInvestmentGrade(capRate: number, cashOnCash: number, cashFlow: number): string {
    let score = 0;
    if (capRate >= 8) score += 3;
    else if (capRate >= 6) score += 2;
    else if (capRate >= 4) score += 1;

    if (cashOnCash >= 12) score += 3;
    else if (cashOnCash >= 8) score += 2;
    else if (cashOnCash >= 5) score += 1;

    if (cashFlow >= 500) score += 3;
    else if (cashFlow >= 200) score += 2;
    else if (cashFlow >= 0) score += 1;

    if (score >= 8) return 'A - Excellent Investment';
    if (score >= 6) return 'B - Good Investment';
    if (score >= 4) return 'C - Fair Investment';
    if (score >= 2) return 'D - Below Average';
    return 'F - Poor Investment';
}

function generateRecommendation(capRate: number, cashOnCash: number, cashFlow: number): string {
    if (capRate >= 6 && cashOnCash >= 8 && cashFlow >= 200) {
        return 'Strong buy. This property shows excellent fundamentals for rental investment.';
    } else if (capRate >= 5 && cashFlow >= 0) {
        return 'Consider buying. Positive cash flow but monitor for appreciation potential.';
    } else if (cashFlow < 0) {
        return 'Caution advised. Negative cash flow requires additional capital reserves.';
    }
    return 'Further analysis needed. Consider market conditions and personal goals.';
}

export default router;
