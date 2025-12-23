import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Current mortgage rates (would fetch from API in production)
const CURRENT_RATES = {
    '30-year-fixed': 6.99,
    '15-year-fixed': 6.25,
    '5-1-arm': 6.50,
    '7-1-arm': 6.75,
    'fha': 6.50,
    'va': 6.25,
    'jumbo': 7.25
};

// ============================================
// CALCULATE MORTGAGE
// ============================================
router.post('/calculate', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            homePrice: z.number().positive(),
            downPayment: z.number().min(0),
            downPaymentPercent: z.number().min(0).max(100).optional(),
            loanTerm: z.number().default(30),
            interestRate: z.number().optional(),
            loanType: z.string().default('30-year-fixed'),
            propertyTax: z.number().optional(),
            homeInsurance: z.number().optional(),
            hoa: z.number().default(0),
            pmi: z.boolean().default(true)
        }).parse(req.body);

        const result = calculateMortgage(data);

        res.json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Mortgage calc error:', error);
        res.status(500).json({ error: 'Calculation failed' });
    }
});

function calculateMortgage(data: any): any {
    const homePrice = data.homePrice;
    const downPayment = data.downPaymentPercent
        ? homePrice * (data.downPaymentPercent / 100)
        : data.downPayment;
    const downPaymentPercent = (downPayment / homePrice) * 100;
    const loanAmount = homePrice - downPayment;

    const rate = data.interestRate || CURRENT_RATES[data.loanType as keyof typeof CURRENT_RATES] || 7;
    const monthlyRate = rate / 100 / 12;
    const numPayments = data.loanTerm * 12;

    // Calculate monthly principal & interest using amortization formula
    const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))
        / (Math.pow(1 + monthlyRate, numPayments) - 1);

    // Property tax (estimate ~1.1% annually if not provided)
    const monthlyTax = data.propertyTax || (homePrice * 0.011 / 12);

    // Insurance (estimate ~0.35% annually if not provided)
    const monthlyInsurance = data.homeInsurance || (homePrice * 0.0035 / 12);

    // PMI (if down payment < 20%)
    let monthlyPMI = 0;
    if (data.pmi && downPaymentPercent < 20) {
        monthlyPMI = (loanAmount * 0.005) / 12; // ~0.5% annual PMI rate
    }

    const monthlyHOA = data.hoa || 0;

    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + monthlyHOA;
    const totalInterest = (monthlyPI * numPayments) - loanAmount;

    return {
        loanDetails: {
            homePrice,
            downPayment: Math.round(downPayment),
            downPaymentPercent: Math.round(downPaymentPercent * 10) / 10,
            loanAmount: Math.round(loanAmount),
            loanTerm: data.loanTerm,
            interestRate: rate
        },
        monthlyPayment: {
            total: Math.round(totalMonthly),
            principalAndInterest: Math.round(monthlyPI),
            propertyTax: Math.round(monthlyTax),
            homeInsurance: Math.round(monthlyInsurance),
            pmi: Math.round(monthlyPMI),
            hoa: Math.round(monthlyHOA)
        },
        totals: {
            totalPayments: Math.round(monthlyPI * numPayments),
            totalInterest: Math.round(totalInterest),
            totalCost: Math.round(homePrice + totalInterest)
        },
        amortization: generateAmortizationSummary(loanAmount, monthlyRate, numPayments, monthlyPI)
    };
}

function generateAmortizationSummary(principal: number, monthlyRate: number, numPayments: number, monthlyPI: number): any {
    let balance = principal;
    const years: any[] = [];

    for (let year = 1; year <= Math.min(numPayments / 12, 30); year++) {
        let yearInterest = 0;
        let yearPrincipal = 0;

        for (let month = 0; month < 12 && ((year - 1) * 12 + month) < numPayments; month++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPI - interestPayment;
            yearInterest += interestPayment;
            yearPrincipal += principalPayment;
            balance -= principalPayment;
        }

        years.push({
            year,
            principalPaid: Math.round(yearPrincipal),
            interestPaid: Math.round(yearInterest),
            remainingBalance: Math.round(Math.max(0, balance))
        });
    }

    return { yearlyBreakdown: years };
}

// ============================================
// COMPARE SCENARIOS
// ============================================
router.post('/compare', async (req: Request, res: Response) => {
    try {
        const { scenarios } = z.object({
            scenarios: z.array(z.object({
                name: z.string(),
                homePrice: z.number(),
                downPayment: z.number(),
                loanTerm: z.number(),
                interestRate: z.number().optional(),
                loanType: z.string().optional()
            })).min(2).max(4)
        }).parse(req.body);

        const comparisons = scenarios.map(scenario => ({
            name: scenario.name,
            ...calculateMortgage(scenario)
        }));

        // Find best option by total cost
        const bestTotalCost = comparisons.reduce((prev, curr) =>
            prev.totals.totalCost < curr.totals.totalCost ? prev : curr
        );

        // Find best option by monthly payment
        const bestMonthly = comparisons.reduce((prev, curr) =>
            prev.monthlyPayment.total < curr.monthlyPayment.total ? prev : curr
        );

        res.json({
            scenarios: comparisons,
            recommendations: {
                lowestTotalCost: bestTotalCost.name,
                lowestMonthly: bestMonthly.name,
                analysis: `"${bestTotalCost.name}" saves the most money overall ($${Math.max(...comparisons.map(c => c.totals.totalCost)) - bestTotalCost.totals.totalCost
                    } less in total costs)`
            }
        });
    } catch (error) {
        console.error('Compare error:', error);
        res.status(500).json({ error: 'Comparison failed' });
    }
});

// ============================================
// AFFORDABILITY CALCULATOR
// ============================================
router.post('/affordability', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            annualIncome: z.number().positive(),
            monthlyDebts: z.number().min(0),
            downPaymentAvailable: z.number().min(0),
            creditScore: z.number().min(300).max(850).optional(),
            includePropertyTax: z.boolean().default(true),
            includeInsurance: z.boolean().default(true)
        }).parse(req.body);

        const monthlyIncome = data.annualIncome / 12;

        // 28% rule: housing shouldn't exceed 28% of gross income
        const maxHousingPayment = monthlyIncome * 0.28;

        // 36% rule: total debt shouldn't exceed 36%
        const maxTotalDebt = monthlyIncome * 0.36;
        const availableForHousing = maxTotalDebt - data.monthlyDebts;

        // Take the more conservative limit
        const affordablePayment = Math.min(maxHousingPayment, availableForHousing);

        // Estimate P&I portion (assume 75% of total payment)
        const estimatedPI = affordablePayment * 0.75;

        // Back-calculate affordable home price
        const rate = 7 / 100 / 12; // Assume 7% rate
        const numPayments = 360; // 30-year
        const affordableLoan = estimatedPI * (Math.pow(1 + rate, numPayments) - 1)
            / (rate * Math.pow(1 + rate, numPayments));

        // Add down payment for total home price
        const downPaymentPercent = 20;
        const affordableHome = affordableLoan / (1 - downPaymentPercent / 100);

        res.json({
            income: {
                annual: data.annualIncome,
                monthly: Math.round(monthlyIncome)
            },
            affordability: {
                maxMonthlyPayment: Math.round(affordablePayment),
                maxHomePrice: Math.round(Math.min(affordableHome, affordableLoan + data.downPaymentAvailable)),
                recommendedDownPayment: Math.round(Math.min(affordableHome, affordableLoan + data.downPaymentAvailable) * 0.2),
                actualDownPayment: data.downPaymentAvailable
            },
            ratios: {
                frontEndRatio: '28%',
                backEndRatio: '36%',
                yourDebtToIncome: `${Math.round((data.monthlyDebts / monthlyIncome) * 100)}%`
            },
            tips: getAffordabilityTips(data)
        });
    } catch (error) {
        console.error('Affordability error:', error);
        res.status(500).json({ error: 'Calculation failed' });
    }
});

function getAffordabilityTips(data: any): string[] {
    const tips: string[] = [];
    const dti = data.monthlyDebts / (data.annualIncome / 12);

    if (dti > 0.2) {
        tips.push('Consider paying down debts to improve buying power');
    }

    if (data.downPaymentAvailable < (data.annualIncome * 0.5)) {
        tips.push('Saving more for down payment could get better rates');
    }

    if (data.creditScore && data.creditScore < 740) {
        tips.push('Improving credit score could lower your interest rate');
    }

    tips.push('Get pre-approved to know your exact budget');
    tips.push('Don\'t forget closing costs (2-5% of home price)');

    return tips;
}

// ============================================
// GET CURRENT RATES
// ============================================
router.get('/rates', (req: Request, res: Response) => {
    res.json({
        rates: CURRENT_RATES,
        lastUpdated: new Date().toISOString(),
        source: 'Estimated market rates'
    });
});

// ============================================
// REFINANCE CALCULATOR
// ============================================
router.post('/refinance', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            currentLoanBalance: z.number().positive(),
            currentRate: z.number(),
            currentMonthlyPayment: z.number(),
            remainingYears: z.number(),
            newRate: z.number(),
            newTerm: z.number(),
            closingCosts: z.number().default(3000)
        }).parse(req.body);

        const currentTotal = data.currentMonthlyPayment * data.remainingYears * 12;

        // Calculate new payment
        const monthlyRate = data.newRate / 100 / 12;
        const numPayments = data.newTerm * 12;
        const newPayment = data.currentLoanBalance * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))
            / (Math.pow(1 + monthlyRate, numPayments) - 1);

        const newTotal = (newPayment * numPayments) + data.closingCosts;
        const monthlySavings = data.currentMonthlyPayment - newPayment;
        const breakEvenMonths = Math.ceil(data.closingCosts / monthlySavings);
        const lifetimeSavings = currentTotal - newTotal;

        res.json({
            current: {
                monthlyPayment: data.currentMonthlyPayment,
                remainingPayments: Math.round(currentTotal),
                rate: data.currentRate
            },
            refinanced: {
                monthlyPayment: Math.round(newPayment),
                totalPayments: Math.round(newTotal),
                rate: data.newRate,
                closingCosts: data.closingCosts
            },
            savings: {
                monthly: Math.round(monthlySavings),
                lifetime: Math.round(lifetimeSavings),
                breakEvenMonths,
                worthIt: lifetimeSavings > 0 && breakEvenMonths < (data.newTerm * 12 * 0.5)
            },
            recommendation: lifetimeSavings > data.closingCosts * 3
                ? 'Refinancing is recommended'
                : lifetimeSavings > 0
                    ? 'Refinancing may be beneficial if you stay long-term'
                    : 'Refinancing may not be beneficial at this time'
        });
    } catch (error) {
        console.error('Refinance error:', error);
        res.status(500).json({ error: 'Calculation failed' });
    }
});

export default router;

