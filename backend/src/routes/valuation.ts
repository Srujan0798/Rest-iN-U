import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

// AI PRICE ESTIMATOR
router.post('/estimate', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            address: z.string().min(1),
            bedrooms: z.number().int().min(0),
            bathrooms: z.number().min(0),
            squareFeet: z.number().positive(),
            yearBuilt: z.number().optional(),
        }).parse(req.body);

        // Simple price estimation algorithm (would be ML model in production)
        const basePrice = data.squareFeet * 250; // Base $250/sqft
        const bedroomBonus = data.bedrooms * 15000;
        const bathroomBonus = data.bathrooms * 10000;
        const ageDeduction = data.yearBuilt ? Math.max(0, (2024 - data.yearBuilt) * 500) : 0;

        const estimate = Math.round(basePrice + bedroomBonus + bathroomBonus - ageDeduction);
        const confidence = 0.82;

        res.json({
            estimate,
            confidence_low: Math.round(estimate * 0.95),
            confidence_high: Math.round(estimate * 1.05),
            confidence_score: confidence,
            comparable_properties: [
                { address: 'Nearby Property 1', sold_price: Math.round(estimate * 0.98), sold_date: '2025-11-20', similarity_score: 0.95 },
                { address: 'Nearby Property 2', sold_price: Math.round(estimate * 1.02), sold_date: '2025-10-15', similarity_score: 0.92 },
            ],
            price_trends: {
                '6_month_change': 0.04,
                '1_year_change': 0.09,
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        res.status(500).json({ error: 'Failed to estimate price' });
    }
});

// MORTGAGE CALCULATOR
router.post('/mortgage', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            price: z.number().positive(),
            downPayment: z.number().min(0).default(20),
            interestRate: z.number().min(0).max(30).default(6.99),
            loanTerm: z.number().int().default(30),
            propertyTax: z.number().optional(),
            insurance: z.number().optional(),
            hoa: z.number().optional(),
        }).parse(req.body);

        const loanAmount = data.price * (1 - data.downPayment / 100);
        const monthlyRate = data.interestRate / 100 / 12;
        const numPayments = data.loanTerm * 12;

        const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
            (Math.pow(1 + monthlyRate, numPayments) - 1);

        const monthlyTax = data.propertyTax || (data.price * 0.012) / 12;
        const monthlyInsurance = data.insurance || 100;
        const monthlyHOA = data.hoa || 0;

        res.json({
            loan_amount: Math.round(loanAmount),
            monthly_payment: {
                principal_interest: Math.round(monthlyPI),
                property_tax: Math.round(monthlyTax),
                insurance: Math.round(monthlyInsurance),
                hoa: monthlyHOA,
                total: Math.round(monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA),
            },
            total_cost: Math.round(monthlyPI * numPayments),
            total_interest: Math.round(monthlyPI * numPayments - loanAmount),
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        res.status(500).json({ error: 'Failed to calculate mortgage' });
    }
});

export default router;
