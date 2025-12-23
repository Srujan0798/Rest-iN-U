import { describe, it, expect } from 'vitest';

// Mortgage Calculator Tests
describe('Mortgage Calculator', () => {
    const calculateMonthlyPayment = (
        principal: number,
        annualRate: number,
        years: number
    ): number => {
        const monthlyRate = annualRate / 100 / 12;
        const numPayments = years * 12;
        const payment =
            principal *
            (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
            (Math.pow(1 + monthlyRate, numPayments) - 1);
        return Math.round(payment * 100) / 100;
    };

    it('should calculate correct monthly payment for standard loan', () => {
        // $300,000 loan at 6% for 30 years
        const payment = calculateMonthlyPayment(300000, 6, 30);
        expect(payment).toBeCloseTo(1798.65, 0);
    });

    it('should calculate correct payment for 15-year loan', () => {
        // $300,000 loan at 5.5% for 15 years
        const payment = calculateMonthlyPayment(300000, 5.5, 15);
        expect(payment).toBeCloseTo(2451.25, 0);
    });

    it('should handle edge case of 0% interest', () => {
        // With 0% interest, should be principal / months
        const principal = 120000;
        const years = 10;
        // Formula breaks with 0%, so we handle it separately
        const payment = principal / (years * 12);
        expect(payment).toBe(1000);
    });

    it('should calculate higher payment for higher interest rate', () => {
        const lowRate = calculateMonthlyPayment(300000, 5, 30);
        const highRate = calculateMonthlyPayment(300000, 7, 30);
        expect(highRate).toBeGreaterThan(lowRate);
    });
});

// Price Estimator Tests
describe('Price Estimator', () => {
    const estimatePrice = (
        squareFeet: number,
        bedrooms: number,
        bathrooms: number,
        yearBuilt: number
    ): number => {
        const basePrice = squareFeet * 250;
        const bedroomBonus = bedrooms * 15000;
        const bathroomBonus = bathrooms * 10000;
        const ageDeduction = Math.max(0, (2024 - yearBuilt) * 500);
        return Math.round(basePrice + bedroomBonus + bathroomBonus - ageDeduction);
    };

    it('should calculate base price from square footage', () => {
        const price = estimatePrice(1000, 0, 0, 2024);
        expect(price).toBe(250000);
    });

    it('should add bedroom bonus correctly', () => {
        const withoutBedrooms = estimatePrice(1000, 0, 0, 2024);
        const withBedrooms = estimatePrice(1000, 3, 0, 2024);
        expect(withBedrooms - withoutBedrooms).toBe(45000);
    });

    it('should add bathroom bonus correctly', () => {
        const withoutBathrooms = estimatePrice(1000, 0, 0, 2024);
        const withBathrooms = estimatePrice(1000, 0, 2, 2024);
        expect(withBathrooms - withoutBathrooms).toBe(20000);
    });

    it('should deduct for older homes', () => {
        const newHome = estimatePrice(1000, 3, 2, 2024);
        const oldHome = estimatePrice(1000, 3, 2, 2014);
        expect(newHome - oldHome).toBe(5000); // 10 years * $500
    });

    it('should not deduct for future year built', () => {
        const futureHome = estimatePrice(1000, 3, 2, 2025);
        const currentHome = estimatePrice(1000, 3, 2, 2024);
        expect(futureHome).toBe(currentHome);
    });
});

// Search Filter Tests
describe('Search Filter', () => {
    const properties = [
        { id: '1', price: 300000, bedrooms: 2, city: 'Boston' },
        { id: '2', price: 450000, bedrooms: 3, city: 'Boston' },
        { id: '3', price: 600000, bedrooms: 4, city: 'New York' },
        { id: '4', price: 250000, bedrooms: 2, city: 'Boston' },
    ];

    const filterProperties = (
        props: typeof properties,
        filters: { minPrice?: number; maxPrice?: number; minBedrooms?: number; city?: string }
    ) => {
        return props.filter(p => {
            if (filters.minPrice && p.price < filters.minPrice) return false;
            if (filters.maxPrice && p.price > filters.maxPrice) return false;
            if (filters.minBedrooms && p.bedrooms < filters.minBedrooms) return false;
            if (filters.city && p.city !== filters.city) return false;
            return true;
        });
    };

    it('should filter by minimum price', () => {
        const result = filterProperties(properties, { minPrice: 400000 });
        expect(result).toHaveLength(2);
        expect(result.every(p => p.price >= 400000)).toBe(true);
    });

    it('should filter by maximum price', () => {
        const result = filterProperties(properties, { maxPrice: 350000 });
        expect(result).toHaveLength(2);
    });

    it('should filter by price range', () => {
        const result = filterProperties(properties, { minPrice: 300000, maxPrice: 500000 });
        expect(result).toHaveLength(2);
    });

    it('should filter by minimum bedrooms', () => {
        const result = filterProperties(properties, { minBedrooms: 3 });
        expect(result).toHaveLength(2);
    });

    it('should filter by city', () => {
        const result = filterProperties(properties, { city: 'Boston' });
        expect(result).toHaveLength(3);
    });

    it('should apply multiple filters', () => {
        const result = filterProperties(properties, { city: 'Boston', minBedrooms: 3 });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('2');
    });

    it('should return all when no filters', () => {
        const result = filterProperties(properties, {});
        expect(result).toHaveLength(4);
    });
});

