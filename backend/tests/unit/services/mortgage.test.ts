import { describe, it, expect, vi } from 'vitest';
import { MortgageService } from '../../../src/services/mortgage';

// Mock dependencies
vi.mock('../../../src/utils/logger', () => ({
    logger: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

describe('MortgageService', () => {
    const service = new MortgageService();

    describe('calculateMonthlyPayment', () => {
        it('should calculate standard mortgage payment correctly', () => {
            const input = {
                homePrice: 500000,
                downPayment: 100000, // 20%
                loanTerm: 30,
                interestRate: 6.5,
                propertyTax: 6000,
                insurance: 1200,
                hoa: 200,
            };

            const result = service.calculateMonthlyPayment(input);

            // Manual calc check:
            // Loan: 400,000
            // Rate: 0.0054166...
            // N: 360
            // PI = ~2528
            // Tax = 500
            // Ins = 100
            // HOA = 200
            // Total = ~3328

            expect(result.principal + result.interest).toBeCloseTo(2528, -1);
            expect(result.propertyTax).toBe(500);
            expect(result.insurance).toBe(100);
            expect(result.hoa).toBe(200);
            expect(result.pmi).toBe(0);
            expect(result.total).toBeGreaterThan(3300);
            expect(result.total).toBeLessThan(3350);
        });

        it('should include PMI for low down payment', () => {
            const input = {
                homePrice: 500000,
                downPayment: 25000, // 5%
                loanTerm: 30,
                interestRate: 6.5,
            };

            const result = service.calculateMonthlyPayment(input);
            expect(result.pmi).toBeGreaterThan(0);
        });
    });

    describe('generateAmortizationSchedule', () => {
        it('should generate full schedule', () => {
            const input = {
                homePrice: 200000,
                downPayment: 0,
                loanTerm: 1, // 1 year for short test
                interestRate: 12,
            };

            const schedule = service.generateAmortizationSchedule(input);
            expect(schedule).toHaveLength(12);
            expect(schedule[11].balance).toBe(0); // Should be paid off
        });
    });

    describe('calculateAffordability', () => {
        it('should return affordability metrics', () => {
            const result = service.calculateAffordability(120000, 500);

            expect(result.maxMonthlyPayment).toBeGreaterThan(0);
            expect(result.maxHomePrice).toBeGreaterThan(0);
            expect(result.recommendedDownPayment).toBeGreaterThan(0);
        });
    });
});
